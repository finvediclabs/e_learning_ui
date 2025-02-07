<template>
  <fin-portlet-header>
    <fin-portlet-heading :loading="masterLoading">
      <span class="User_heading">Student Assignments</span>
    </fin-portlet-heading>
    </fin-portlet-header>
  <!-- Container for Layout -->
  <div class="layout-container">
    <!-- Search Bar with Same Width as Table -->
   
    <div class="tables-container">
      <!-- Table to Display Batches on Left (20% width) -->
      <div class="batch-table">
        <div class="row col-12" style="display:flex;align-items: center;justify-content: center;">
        <h6 style="text-align: center;margin-top: -6%;background-color: #5479f7;border-radius: 5px;width: 50%;color: #ffff;margin-bottom: 0%"><b>Batches</b></h6>
        </div>
        <fin-portlet-item class="search-container">
      <q-select
        v-model="batchSearch"
        :options="batchOptions"
        option-label="label"
        option-value="value"
        label="Batches"
        style="margin: 4%;width: 92%;"
        outlined
        dense
        clearable
        class="fin-input"
        @update:model-value="handleSelectChange"
      />
    </fin-portlet-item>

        <q-table
          flat
          bordered
          :rows="filteredBatches"
          :columns="columns"
          row-key="cycleid"
          style="height: 60vh;margin: 4%;background: transparent"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                style="text-align: left; width: 600px;"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="handleRowClick(props.row)" style="cursor: pointer;">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ props.row[col.field] }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <p v-if="!filteredBatches.length">No batches found.</p>
      </div>

      <!-- Table to Display Student Assignments on Right (70% width) -->
      <div class="student-assignment-table">
        <div v-if="studentAssignments.length > 0" class="cycle-id-heading row col-4" style="display:flex;align-items: center;margin-right: auto;margin-left: 5%;">
    <h6 style="text-align: center;background-color: #5479f7;border-radius: 5px;width: 30%;color: #ffff;margin-top: -2%;margin-bottom: 0%">Batch ID: {{ studentAssignments[0].cycleid }}</h6>
  </div>
  <fin-portlet-item class="search-container">
      <q-select
        v-model="studentSearch"
        :options="studentOptions"
        option-label="label1"
        option-value="value1"
        label="Students"
        style="margin-left:auto;margin-right: 2%;margin-bottom: 2%;margin-top: 2%; width: 30%;"
        outlined
        dense
        clearable
        class="fin-input"
        @update:model-value="handleSelectChange2"
      />
    </fin-portlet-item>
        <q-table
          flat
          bordered
          :rows="studentAssignments"
          :columns="assignmentColumns"
          row-key="studentId"
          style="height: 60vh;background: transparent;"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ props.row[col.field] }}
              </q-td>
              <q-td auto-width class="text-right">
                <q-btn
                  size="sm"
                  color="#5479f7"
                  round
                  dense
                  @click="() => { props.expand = !props.expand;
                     fetchStudentAssignments(props.row.cycleid, props.row.studentId); 
                   }"
                  :icon="props.expand ? 'remove' : 'add'"
                />
              </q-td>
            </q-tr>

            <!-- Nested Table for Student Assignments -->
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <table class="nested-table">
                    <thead>
                      <tr style="color: #5479f7;">
                        <th><strong>Assignment Title</strong></th>
                        <th><strong>Batch Title</strong></th>
                        <th><strong>is Verified</strong></th>
                        <th><strong>Student Name</strong></th>
                        <th><strong>Rating</strong></th>
                        <th><strong>File</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="assignment in props.row.assignments" :key="assignment.id">
                        <td>{{ assignment.assignmentTitle }}</td>
                        <td>{{ assignment.batchTitle }}</td>
                        <td>{{ assignment.isVerified }}</td>
                        <td>{{ assignment.name }}</td>
                        <td>{{ assignment.rating }}</td>
                        <td>
                          <template v-if="assignment.blobUrl">
  <q-btn @click="openDialog(assignment.blobUrl, assignment.fileType, assignment)" icon="visibility" flat />
</template>
              <template v-else>
                <a :href="assignment.submittedFile" download>Download</a>
              </template>
            </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <p v-if="!studentAssignments.length">No student assignments found for this batch.</p>
      </div>
    </div>
  </div>

  <q-dialog v-model="dialogVisible" class="custom-dialog">
    <q-card class="q-pa-md custom-card">
      <q-btn flat icon="close" class="close-btn" @click="closeDialog" />
      <q-card-section class="q-dialog-content">
        <div>
          <!-- <span><strong>Student Assignment Id:</strong> {{ assignmentData.id }}</span><br>
        <span><strong>Assignment Id:</strong> {{ assignmentData.assignmentId }}</span><br> -->
          <span
            ><strong>Assignment Title:</strong>
            {{ assignmentData.assignmentTitle }}</span
          ><br />
          <!-- <span><strong>Batch Id:</strong> {{ assignmentData.batchId }}</span><br> -->
          <span
            ><strong>Batch Name:</strong> {{ assignmentData.batchTitle }}</span
          ><br />
          <!-- <span><strong>Due Date:</strong> {{ assignmentData.createdDate }}</span><br> -->
          <span><strong>Student:</strong> {{ assignmentData.name }}</span
          ><br />
          <!-- Add q-select for isVerified -->
        </div>
        <template v-if="fileType === 'png'">
          <q-img :src="dialogFileUrl" class="custom-img" />
        </template>
        <template v-else-if="fileType === 'pdf'">
          <div v-if="fileType === 'pdf'">
            <vue-pdf-app
              style="height: calc(60vh - 70px)"
              :pdf="chapterFilePath"
              :title="true"
              :theme="theme"
              class="q-pt-sm pdf"
              page-scale="20"
              :config="config"
            >
              <template #toolbar-right-prepend>
                <div style="min-height: 30px" class="flex flex-center">
                  <q-icon
                    name="contrast"
                    @click="toggleTheme"
                    size="sm"
                    color="white"
                    class="q-ma-md cursor-pointer"
                  ></q-icon>
                </div>
              </template>
            </vue-pdf-app>
          </div>
        </template>
        <!-- Java and Python File Preview -->
        <template v-else-if="['java', 'py'].includes(fileType)">
          <pre v-if="dialogFileContent">
      <code class="language-{{ fileType }}">
        {{ dialogFileContent }}
      </code>
    </pre>
        </template>

        <template v-else>
          <div>No preview available for this file type</div>
        </template>

        <div v-if="dialogFileUrl" class="q-mt-md">
          <div class="row q-gutter-sm">
            <q-btn
              label="View in New Tab"
              icon="open_in_new"
              color="primary"
              @click="openInNewTab(dialogFileUrl)"
            />
           
            <q-btn
             v-if="!assignmentData.evaluation"
              label="Evaluate"
              icon="assignment_turned_in"
              color="green"
              @click="evaluateFileUrl"
            />
          </div>

          <p v-if="assignmentData.evaluation">
            Rating: {{ assignmentData.evaluation }}
          </p>

          <div v-if="evaluationResult" class="evaluationResult">
            <p v-if="evaluationResult.accuracy !== 'N/A'">
              <span class="bold-text">Accuracy: </span>
              {{ evaluationResult.accuracy }}
            </p>
            <p v-if="evaluationResult.mean_absolute_error !== 'N/A'">
              <span class="bold-text">Mean Absolute Error:</span>
              {{ evaluationResult.mean_absolute_error }}
            </p>
            <p v-if="evaluationResult.mean_squared_error !== 'N/A'">
              <span class="bold-text">Mean Squared Error:</span>
              {{ evaluationResult.mean_squared_error }}
            </p>
            <p v-if="evaluationResult.evaluation_feedback !== 'N/A'">
              <span class="bold-text">Feedback: </span
              >{{ evaluationResult.evaluation_feedback }}
            </p>
            <p v-if="evaluationResult.space_complexity !== 'N/A'">
              <span class="bold-text">Space Complexity: </span
              >{{ evaluationResult.space_complexity }}
            </p>
            <p v-if="evaluationResult.time_complexity !== 'N/A'">
              <span class="bold-text">Time Complexity: </span
              >{{ evaluationResult.time_complexity }}
            </p>
            <p v-if="evaluationResult.rating_of_the_code !== 'N/A'">
              <span class="bold-text">Rating of the code: </span
              >{{ evaluationResult.rating_of_the_code }}
            </p>
          </div>
        </div>
    </q-card-section>
    <!-- <q-select
          v-model="assignmentData.isVerified"
          :options="verificationOptions"
          label="Verification Status"
          class="q-mt-md"
        /> -->
    <q-card-actions class="q-dialog-actions">
      
      <!-- <q-btn label="Verification Done" color="primary" @click="submitAssignmentData" /> -->
      <q-btn label="Download File" color="secondary" @click="downloadFile" v-if="fileType" />
    </q-card-actions>
  </q-card>
</q-dialog>

</template>

<script>
import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import { assign } from "svelte/internal";
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";
export default {
  data() {
    return {
      pdfPath: "",
      batches: [], 
      evaluationTrigger: 0,
      students: [],              // All batches from API
      filteredBatches: [],       // Batches to display based on selection
      batchSearch: null,  
      studentSearch: null,       // Selected batch for filtering
      studentAssignments: [],    // Data for the selected batch's assignments
      columns: [                 // Table column definitions for batches
        { name: 'cycleid', label: 'Batch ID', field: 'cycleid' },
        { name: 'cycleDesc', label: 'Description', field: 'cycleDesc' },
      ],
      assignmentColumns: [       // Table column definitions for assignments
        { name: 'studentId', label: 'Student ID', field: 'studentId' },
        { name: 'username', label: 'Username', field: 'username' },
        { name: 'submittedRatio', label: 'Submitted/Total Assignments', field: 'submittedRatio' },
        { name: 'scoredMarks', label: 'Marks Obtained', field: 'scoredMarks' },
        { name: 'totalMarks', label: 'Total Marks', field: 'totalMarks' },
      ],
      chapterFilePath: "",
      numPages: 0,
      evaluationResult: "",
      theme: "light",
      config: {
        sidebar: {
          viewThumbnail: true,
          viewOutline: false,
          viewAttachments: false,
        },
        toolbar: {
          toolbarViewerRight: {
            presentationMode: true,
            openFile: false,
            print: false,
            download: false,
            viewBookmark: false,
          },
        },
        secondaryToolbar: {
          presentationMode: true,
          secondaryOpenFile: false,
          secondaryPrint: false,
          secondaryDownload: false,
          secondaryViewBookmark: false,
        },
      },
      selectedCycleId: null,
      dialogVisible: false,
      dialogFileUrl: "",
      assignmentSearch: "",
      pdf: null,
      assignmentOptions: [], // This will hold the data for q-select
      masterLoading: false, // Assuming you have a loading state
      fileType: "", // To store the file type ('image', 'pdf', etc.)
      currentPage: 1,
      numPages: 0,
      verificationOptions: [
        { label: "Y", value: "Y" },
        { label: "N", value: "N" },
      ],
    };
  },
  components: {
    FinPortlet,
    FinPortletHeader,
    VuePdfApp,
    FinPortletHeading,
  },
  computed: {
    batchOptions() {
      return this.batches.map(batch => ({
        label: batch.cycleDesc,
        value: batch.cycleid,
      }));
    },
    studentOptions(){
      return this.students.map(student => ({
        label1: student.name,
        value1: student.studentId,
        value2:student.cycleid

      }));
    }
  },
  methods: {
    evaluateFileUrl() {
  const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
  const postEvaluateUrl = baseUrl + "api/evaluator/evaluatecode";

  const assignmentID = this.assignmentData.assignmentId;
  const batchId = this.assignmentData.batchId;
  const studentId = this.assignmentData.studentId;
  console.log(batchId, studentId);

  // Use the pre-configured Axios instance (this.$api)
  this.$api
    .post(`${postEvaluateUrl}?assignment-id=${encodeURIComponent(assignmentID)}`)
    .then((response) => {
      this.evaluationResult = response.data.response;
      
      // Call fetchStudentAssignments only after evaluation completes
      this.fetchStudentAssignments(batchId, studentId);
    })
    .catch((error) => {
      console.error(error);
      this.evaluationResult = "Error evaluating the file.";
    });
},
    async submitAssignmentData() {
  try {
    const baseUrl =
      (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
    const submitAssignmentUrl = `${baseUrl}api/student-assignments/${this.assignmentData.id}`;
    
    // Construct the URL with the assignment ID
    const currentDate = Date.now();
    const evaluationString = this.evaluationResult || "";

    // Prepare the JSON data to be sent
    const data = {
      assignmentId: this.assignmentData.assignmentId,
      assignmentTitle: this.assignmentData.assignmentTitle,
      batchId: this.assignmentData.batchId,
      batchTitle: this.assignmentData.batchTitle,
      studentId: this.assignmentData.studentId,
      studentName: this.assignmentData.studentName,
      submittedFile: this.assignmentData.submittedFile,
      createdDate: currentDate,
      isVerified: this.assignmentData.isVerified.value,
      rating: this.assignmentData.rating,
      blobUrl: this.assignmentData.submittedFile, // Change here

      evaluation:
        JSON.stringify(this.evaluationResult.evaluation_feedback) || "",
    };

    // Make the PUT request
    const response = await this.$api.put(submitAssignmentUrl, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check for successful response
    if (response.data.success) {
      console.log('Assignment data updated successfully:', response.data.message);
      // Optionally, you might want to close the dialog or refresh the data
      this.dialogVisible = false;
      await this.getStudentAssignmentsData(); // Refresh data if needed
    } else {
      console.error('Failed to update assignment data:', response.data.message);
    }
  } catch (error) {
    console.error('Error updating assignment data:', error);
  }
},
    async fetchBatches() {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const batchUrl = `${baseUrl}api/cycles`;
        const response = await this.$api.get(batchUrl);
        const data = response.data;

        if (data.success) {
          this.batches = data.data;
          this.filteredBatches = data.data;
        } else {
          console.error('Failed to fetch batches:', data.message);
          const url = ``;
          this.filteredBatches = [];
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
        this.filteredBatches = [];
      }
    },
    async fetchStudents(cycleid) {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const studentsUrl = `${baseUrl}api/enrollments/${cycleid}`;
    const response = await this.$api.get(studentsUrl);
    const data = response.data;

    if (data.success) {
      this.students = data.data;
      this.filteredStudents = data.data;
    } else {
      console.error('Failed to fetch batches:', data.message);
      this.filteredStudents = [];
    }
  } catch (error) {
    console.error('Error fetching batches:', error);
    this.filteredStudents = [];
  }
},

async fetchAssignments(cycleid) {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const assignmentUrl = `${baseUrl}api/enrollmentsAssignments/with-assignments?cycleid=${cycleid}`;
    // console.log("Dynamic URL:", url);
    
    const response = await this.$api.get(assignmentUrl);
    console.log("Fetched student assignments:", response.data); // Log the response data

    // Check if the response is valid
    if (response.data && Array.isArray(response.data)) {
      // Process the data and add the submittedRatio field
      this.studentAssignments = response.data.map((assignment) => {
        const submitted = assignment.totalStudentAssignments || 0;
        const total = assignment.totalAssignments || 0;
        // Calculate the ratio as 'submitted/total'
        const submittedRatio = `${submitted}/${total}`;

        return {
          ...assignment,
          submittedRatio // Add the submittedRatio to each assignment
        };
      });
      
    } else {
      console.error("Failed to fetch assignments: Invalid response structure");
      this.studentAssignments = [];
    }
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    this.studentAssignments = []; // Default to empty array on error
  }
},
closeDialog() {
      this.dialogVisible = false;

      this.evaluationResult = ""; // Clear the evaluation result when closing
    },
  async openDialog(blobUrl, fileType, assignment) {
      console.log('Opening dialog with assignment data:', assignment);
      this.dialogFileUrl = blobUrl;
      this.fileType = fileType;
      this.dialogVisible = true;
      this.assignmentData = assignment;
      console.log("file:",blobUrl);
      if (fileType === 'pdf') {
        this.chapterFilePath = blobUrl;
        
      }else if (['java', 'py'].includes(fileType)) {
    // Fetch content for .java or .py files
    const response = await fetch(blobUrl);
    this.dialogFileContent = await response.text();
  }
      this.assignmentData.isVerified = assignment.isVerified;
    },
    highlightCode() {
    this.$nextTick(() => {
      Prism.highlightAll();
    });
  },
  openInNewTab(url) {
      window.open(url, '_blank');
    },
    async downloadFile() {
      try {
        // Fetch the file from the URL
        const response = await fetch(this.dialogFileUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Convert the response to a Blob
        const blob = await response.blob();

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = url;

        // Set a default filename (you can customize this)
        const filename = this.dialogFileUrl.split("/").pop(); // Extract filename from URL
        link.download = filename;

        // Append the link to the body and trigger a click
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link and revoking the object URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    },
async fetchStudentAssignments(batchId, studentId) {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const studentAssignmentUrl = `${baseUrl}api/student-assignments?batchId=${batchId}&studentId=${studentId}`;
    // Build the URL dynamically with batchId and studentId
    // const url = `http://localhost:8087/api/student-assignments?batchId=${batchId}&studentId=${studentId}`;
    // console.log("Fetching assignments from:", url);

    const response = await this.$api.get(studentAssignmentUrl);
    console.log("Fetched assignments:", response.data);

    // Check if response data exists and is successful
    if (response.data && response.data.success && response.data.data) {
      const assignmentsWithBlobs = await Promise.all(
        response.data.data.map(async (assignment, index) => {
          const fileName = assignment.submittedFile;
          const cleanFileName = fileName;

          // Determine the file type based on the extension
          let fileType = "unknown";
          if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            fileType = "png";
          } else if (fileName.endsWith(".pdf")) {
            fileType = "pdf";
          } else if (fileName.endsWith(".java")) {
            fileType = "java";
          } else if (fileName.endsWith(".py")) {
            fileType = "py";
          }

          // Set blobUrl directly from cleanFileName
          const blobUrl = cleanFileName;

          return {
            index: index + 1,
            id: assignment.id,
            assignmentId: assignment.assignmentId,
            batchId: assignment.batchId,
            assignmentTitle: assignment.assignmentTitle,
            batchTitle: assignment.batchTitle,
            createdDate: new Date(assignment.createdDate).toLocaleDateString(),
            studentId: assignment.studentId,
            studentName: assignment.studentName,
            name:assignment.name,
            submittedFile: assignment.submittedFile,
            isVerified: assignment.isVerified,
            evaluation: assignment.evaluation,
            rating:assignment.rating,
            blobUrl: blobUrl,  // Blob URL
            fileType: fileType // File Type (png, pdf, java, py)
          };
        })
      );

      // Find the selected row based on batchId and studentId
      const selectedRow = this.studentAssignments.find(
        (assignment) => assignment.cycleid === batchId && assignment.studentId === studentId
      );

      // Assign fetched data to the selected row's assignments array
      if (selectedRow) {
        selectedRow.assignments = assignmentsWithBlobs;
      }
    } else {
      console.error("Failed to fetch assignments: Invalid response");
    }
  } catch (error) {
    console.error("Error fetching student assignments:", error);
  }
},

    handleSelectChange(selectedBatch) {
      if (selectedBatch) {
        this.filteredBatches = this.batches.filter(
          batch => batch.cycleid === selectedBatch.value
        );
      } else {
        this.filteredBatches = this.batches; // Show all if no batch is selected
      }
    },
    
    async handleSelectChange2(value1) {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  let url = `${baseUrl}api/enrollmentsAssignments/with-assignments?`;


  // If a student is selected, append the studentId to the URL
  if (value1) {
    url += `cycleid=${value1.value2}&studentId=${value1.value1}`;
    console.log("Student selected URL:", url);
  } else {
    // If no student is selected (cleared), use the last selected cycleid
    if (this.selectedCycleId) {
      const id = this.selectedCycleId;
      console.log("id:",id);
      url += `cycleid=${this.selectedCycleId}`;
      console.log("Selection cleared, URL using last selected cycleid:", url);
    } else {
      console.error("No cycleid selected to fallback on");
    }
  }

  console.log("API URL:", url);

  try {
    const response = await this.$api.get(url);
    console.log("Fetched assignments:", response.data);

    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      this.studentAssignments = response.data.map((assignment) => {
        const submitted = assignment.totalStudentAssignments || 0;
        const total = assignment.totalAssignments || 0;
        const submittedRatio = `${submitted}/${total}`;
        return {
          ...assignment,
          submittedRatio
        };
      });
    } else {
      console.error("Failed to fetch assignments: Invalid response structure");
      this.studentAssignments = [];
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
    this.studentAssignments = [];
  }
},
    
    handleRowClick(row) {
      console.log('Row clicked:', row);
      this.selectedCycleId = row.cycleid;
      this.fetchAssignments(row.cycleid);
      this.fetchStudents(row.cycleid); // Fetch assignments for the selected batch
    },
    selectFirstRow() {
      this.$nextTick(() => {
        if (this.batches.length > 0) {
          // Simulate a click on the first row
          this.handleRowClick(this.filteredBatches[0]);
        }
      });
    },
  },
  created() {
    this.fetchBatches();
    this.fetchStudents(); // Fetch batches when component is created
  },
  
  watch: {
    dialogFileContent() {
      this.highlightCode();
    },
    evaluationTrigger() {
    this.fetchStudentAssignments(this.batchId, this.studentId);
    // this.fetchAssignments(this.cycleid);
  }
  },
  mounted() {
    // Call selectFirstRow when component is mounted to simulate the first row click
    this.selectFirstRow();
  },
  
};
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* border: 2px solid black; */
}
.custom-dialog .q-card {
  width: 100vw;
  height: 100vh;
  margin: 0;
  border-radius: 0;
}

.custom-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1; /* Ensure button is above other content */
}
.pdf-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.q-dialog-actions {
  display: flex;
  justify-content: flex-end;
}
.table {
  width: 100%;
  color: #212529;
  vertical-align: top;
  border-collapse: collapse;
  border-radius: 10px;
}
.student-assignment-table{
  width: 100%;
  margin-left: 2%;
  margin-right: 2%;
  border:2px solid #34549e;
}
button {
  background-color: #5479f7;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #34549e;
}
.evaluationResult {
  padding-top: 30px;
}
pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  white-space: pre-wrap; /* Wrap long lines */
}
.bold-text {
  font-weight: bold;
}
.nested-table {
  width: 100%;
  border-collapse: collapse;
}
.nested-table th,
.nested-table td {
  border: 1px solid #ccc;
  padding: 8px;
}

.search-container {
  width: 80%;
  margin: 2%;
}

.tables-container {
  display: flex;
  width: 100%;
}

.batch-table {
  width: 30%;
  margin-left: 2%;
  border: 2px solid #34549e;
}

.assignment-table {
  width: 70%;
  margin-left: 20px;
}
.User_heading {
  color: #5479f7;
  margin-left: 4%;
}
.fin-input {
  width: 100%;
}
</style>
