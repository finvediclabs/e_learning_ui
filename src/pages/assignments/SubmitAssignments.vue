<template>
  <fin-portlet-header>
    <fin-portlet-heading :loading="masterLoading">
      <!-- <span class="User_heading">Student Assignments</span> -->
    </fin-portlet-heading>
    </fin-portlet-header>
  <!-- Container for Layout -->
  <div class="layout-container">
    <!-- Search Bar with Same Width as Table -->

    <div class="tables-container">
      <!-- Table to Display Batches on Left (20% width) -->
      <div class="batch-table">
        <div class="row col-12" style="display:flex;align-items: center;justify-content: center;">
        <!-- <h6 style="text-align: center;margin-top: -6%;background-color: #e7f0ff;border-radius: 5px;width: 50%;color: #ffff;margin-bottom: 0%"><b>Batches</b></h6> -->
        </div>
        <fin-portlet-item class="search-container">
      <q-select
        v-model="batchSearch"
        :options="batchOptions"
        option-label="label"
        option-value="value"
        label="Batches"
        style="margin: 3%;width: 92%;"
        outlined
        dense
        clearable
        class="fin-input"
        @update:model-value="handleSelectChange"
      />
    </fin-portlet-item>

        <q-table
          flat
          :rows="filteredBatches"
          :columns="columns"
          :row-class="getRowClass(index)"
          row-key="cycleid"
          :pagination.sync="pagination"
          style="height: 60vh;margin-left: 4%;margin-right: 4%;"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="theaded"
                style="text-align: left; width: 600px;text-align:left "
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="handleRowClick(props.row)" style="cursor: pointer;">
              <q-td v-for="col in props.cols" :key="col.name" :props="props" style="text-align:left; white-space: normal; word-wrap: break-word;">
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
    <!-- <h6 style="text-align: center;background-color: #e7f0ff;border-radius: 5px;width: 30%;color: #ffff;margin-top: -2%;margin-bottom: 0%">Batch ID: {{ studentAssignments[0].cycleid_new }}</h6> -->
  </div>
  <fin-portlet-item class="search-container">
    <div style="display: flex; justify-content: space-between; align-items: center; margin: 1% 2%;">
      <div v-if="studentAssignments.length > 0">
  <span class="text-h6">Batch ID: {{ studentAssignments[0].cycleid_new }}</span>
  </div>

  <q-select
    v-model="studentSearch"
    :options="studentOptions"
    option-label="label1"
    option-value="value1"
    label="Students"
    style="width: 30%;"
    outlined
    dense
    clearable
    class="fin-input"
    @update:model-value="handleSelectChange2"
  />
</div>
    </fin-portlet-item>
        <q-table
          flat
          :rows="studentAssignments"
          :columns="assignmentColumns"
          row-key="studentId"
          :row-class="getRowClass"
          :pagination.sync="pagination"
          style="height: 60vh;text-align:left "
        >

          <template v-slot:header="props">
            <q-tr :props="props" style="text-align:left">
              <q-th v-for="col in props.cols" :key="col.name" :props="props"  :style="['submittedRatio', 'scoredMarks','totalMarks'].includes(col.name) ? 'text-align: center;' : 'text-align: left;'" class="theaded">
                {{ col.label }}
              </q-th>
              <q-th auto-width class="theaded"/>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" style="text-align:left">
              <q-td v-for="col in props.cols" :key="col.name" :props="props"  :style="['submittedRatio', 'scoredMarks','totalMarks'].includes(col.name) ? 'text-align: center;' : 'text-align: left;'">
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
                    <thead class="theaded2">
                      <tr>
                        <th><strong>S.No</strong></th>
                        <th><strong>Assignment Title</strong></th>
                        <th><strong>is Verified</strong></th>
                        <th><strong>Rating</strong></th>
                        <th><strong>File</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(assignment,index) in props.row.assignments" :key="assignment.id">
                        <td>{{ index+1 }}</td>
                        <td>{{ assignment.assignmentTitle }}</td>
                        <td>{{ assignment.isVerified }}</td>
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
         <!--Zip Preview -->
         <template v-else-if="fileType === 'zip'">
          <div v-if="extractedFiles.length > 0">
            <div v-for="(file, index) in extractedFiles" :key="index" class="file-display">
              <h6>{{ file.name }}</h6>
              <pre v-if="['java', 'py'].includes(file.extension)">
                <code class="language-{{ file.extension }}">
                  {{ file.content }}
                </code>
              </pre>
              <p v-else-if="file.extension === 'txt'">{{ file.content }}</p>
              <p v-else-if="file.extension === 'pdf'">
                <p>Source :<span><a :href=file.content target="_blank">Click Here</a></span></p>
                  <!--  <vue-pdf-app style="height: calc(60vh - 70px)" :pdf=file.content :title="true" :theme="theme"
                  class="q-pt-sm pdf" page-scale="20" :config="config">
                  <template #toolbar-right-prepend>
                    <div style="min-height: 30px" class="flex flex-center">
                      <q-icon name="contrast" @click="toggleTheme" size="sm" color="white"
                        class="q-ma-md cursor-pointer"></q-icon>
                    </div>
                  </template>
                </vue-pdf-app>-->
              </p>
              <p v-else>Unsupported file type: {{ file.extension }}</p>
            </div>
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
              class="evaluate_button"
              :loading="masterLoading"
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
import VuePdfApp from "vue3-pdf-app";
import JSZip from "jszip";
import "vue3-pdf-app/dist/icons/main.css";
export default {
  data() {
    return {
      dialogFileContent: "", // Content for non-zip files
      extractedFiles: [],
      pdfPath: "",
      batches: [],
      evaluationTrigger: 0,
      students: [],              // All batches from API
      filteredBatches: [],       // Batches to display based on selection
      batchSearch: null,
      studentSearch: null,       // Selected batch for filtering
      studentAssignments: [],    // Data for the selected batch's assignments
      columns: [                 // Table column definitions for batches
        { name: 'cycleid_new', label: 'Batch ID', field: 'cycleid_new' },
        { name: 'cycleDesc', label: 'Description', field: 'cycleDesc' },
      ],
      assignmentColumns: [       // Table column definitions for assignments
        { name: 'studentId_new', label: 'Student ID', field: 'studentId_new' },
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
      pagination: {
        page: 1, // Current page
        rowsPerPage: 10, // Default rows per page
      },
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
    async fetchAndHandleZip() {
      try {
        // Fetch the ZIP file
        const response = await fetch(this.dialogFileUrl);

        // Check if the response is OK
        if (!response.ok) {
          throw new Error("Failed to fetch ZIP file. Network response was not ok.");
        }

        // Convert response to Blob
        const zipBlob = await response.blob();

        // Handle the ZIP file
        this.handleZipFile(zipBlob);
      } catch (error) {
        console.error("Error processing ZIP file:", error);
      }
    },
    async handleZipFile(file) {
      try {
        const jszip = new JSZip();

        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Load ZIP file
        const zipContent = await jszip.loadAsync(arrayBuffer);

        const extractedFiles = [];
        const filePromises = Object.keys(zipContent.files).map(async (filename) => {
        const file = zipContent.files[filename];
        if (!file.dir) {
          // Fetch raw binary content for the file
          const content = await file.async("uint8array");

          // Determine the file extension
          const fileExtension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

          // Create a Blob for the file with the correct MIME type
          const mimeType = fileExtension === "pdf" ? "application/pdf" : "application/octet-stream";
          const blob = new Blob([content], { type: mimeType });

          // Generate a temporary URL for the Blob
          const tempLink = URL.createObjectURL(blob);

          // Push the file details to the extracted files array
          extractedFiles.push({ name: filename, content: tempLink, extension: fileExtension });
        }
      });

        await Promise.all(filePromises);

        this.extractedFiles = extractedFiles;
        console.log("Extracted files:", extractedFiles);
      } catch (error) {
        console.error("Error extracting zip file:", error);
      }
    },
    getRowClass(row,index) {
      return (this.studentAssignments.indexOf(row) % 2 === 0) ? 'even-row' : 'odd-row';
    },
    evaluateFileUrl() {
  this.masterLoading = true;
  const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
  const postEvaluateUrl = baseUrl + "api/evaluator/evaluatecode";

  const assignmentID = this.assignmentData.assignmentId;
  const batchId = this.assignmentData.batchId;
  const studentId = this.assignmentData.studentId;

  // Construct the full request URL
  const fullUrl = `${postEvaluateUrl}?assignment-id=${encodeURIComponent(assignmentID)}&student-id=${encodeURIComponent(studentId)}`;

  // Log the full URL to the console
  // console.log("POST Request URL:", fullUrl);

  // Ensure both parameters (assignment-id & student-id) are passed in the request
  this.$api
    .post(fullUrl)
    .then((response) => {
      this.evaluationResult = response.data.response;
      this.masterLoading = false;

      // Call fetchStudentAssignments only after evaluation completes
      this.fetchStudentAssignments(batchId, studentId);
    })
    .catch((error) => {
      console.error(error);
      this.evaluationResult = "Error evaluating the file.";
      this.masterLoading = false;
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
      // Filter and map the data to add cycleid_new and exclude specific cycle IDs
      this.batches = data.data
        .filter(batch => !['1002', '1008'].includes(batch.cycleid)) // Exclude batches with cycleid 1002 and 1008
        .map(batch => {
          let cycleid_new;

          if (batch.cycleid.startsWith('0')) {
            // For cycles starting with 0, add 24A
            cycleid_new = batch.cycleid === '0001'
              ? `24A${batch.cycleid.slice(-3)}`  // Remove one zero for 0001
              : `24A${batch.cycleid}`;
          } else {
            // For other cycles, add 90A
            cycleid_new = `90A${batch.cycleid}`;
          }

          return {
            ...batch,
            cycleid_new
          };
        });

      // Assign filtered batches to filteredBatches
      this.filteredBatches = this.batches;

      // Check if there is at least one valid batch and fetch related data
      if (this.filteredBatches.length > 0) {
        const firstCycleId = this.filteredBatches[0].cycleid;
        await this.fetchAssignments(firstCycleId); // Fetch assignments
        await this.fetchStudents(firstCycleId);   // Fetch students
      } else {
        console.warn('No valid batches available after filtering.');
      }
    } else {
      console.error('Failed to fetch batches:', data.message);
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

    const response = await this.$api.get(assignmentUrl);
  //  console.log("Fetched student assignments:", response.data);

    // Check if the response is valid
    if (response.data && Array.isArray(response.data)) {
      // Process the data and add the submittedRatio, cycleid_new, and studentId_new fields
      this.studentAssignments = response.data.map((assignment) => {
        const submitted = assignment.totalStudentAssignments || 0;
        const total = assignment.totalAssignments || 0;
        const submittedRatio = `${submitted}/${total}`;

        const numericSubmittedRatio = total > 0 ? submitted / total : 0;
        // Add cycleid_new based on the same conditions as before
        const cycleid_new = cycleid.startsWith('0')
          ? cycleid === '0001'
            ? `24A${cycleid.slice(-3)}`  // Remove an extra zero for 0001
            : `24A${cycleid}`
          : `90A${cycleid}`;

        // Create studentId_new by concatenating cycleid_new with studentId
        const studentId_new = `${cycleid_new}${assignment.studentId}`;

        return {
          ...assignment,
          submittedRatio,
          numericSubmittedRatio,   // Add the submittedRatio to each assignment
          cycleid_new,     // Add cycleid_new to each assignment
          studentId_new    // Add studentId_new (cycleid_new + studentId)
        };
      });
      this.studentAssignments.sort((a, b) => b.numericSubmittedRatio - a.numericSubmittedRatio);
    } else {
      console.error("Failed to fetch assignments: Invalid response structure");
      this.studentAssignments = [];
    }
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    this.studentAssignments = []; // Default to empty array on error
  }
  this.studentAssignments.sort((a, b) => b.submittedRatio - a.submittedRatio)
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

    const response = await this.$api.get(studentAssignmentUrl);
   // console.log("Fetched assignments:", response.data);

    if (response.data && response.data.success && response.data.data) {
      const assignmentsWithBlobs = await Promise.all(
        response.data.data.map(async (assignment, index) => {
          const fileName = assignment.submittedFile;
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
          else if (fileName.endsWith(".zip")) {
                fileType = "zip";
              }

          // Generate batchId_new based on the same conditions as cycleid_new
          const batchId_new = batchId.startsWith('0')
            ? batchId === '0001'
              ? `24A${batchId.slice(-3)}`  // Remove an extra zero for 0001
              : `24A${batchId}`
            : `90A${batchId}`;

          return {
            index: index + 1,
            id: assignment.id,
            assignmentId: assignment.assignmentId,
            batchId: assignment.batchId,
            batchId_new: batchId_new,  // Add batchId_new
            assignmentTitle: assignment.assignmentTitle,
            batchTitle: assignment.batchTitle,
            createdDate: new Date(assignment.createdDate).toLocaleDateString(),
            studentId: assignment.studentId,
            studentName: assignment.studentName,
            name: assignment.name,
            submittedFile: assignment.submittedFile,
            isVerified: assignment.isVerified,
            evaluation: assignment.evaluation,
            rating: assignment.rating,
            blobUrl: fileName,  // Set blobUrl to the clean file name
            fileType: fileType  // File Type
          };
        })
      );

      const selectedRow = this.studentAssignments.find(
        (assignment) => assignment.cycleid === batchId && assignment.studentId === studentId
      );

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
    this.fetchAssignments(selectedBatch.value);
    this.fetchStudents(selectedBatch.value); // Fetch students for the selected batch
    console.log("id", selectedBatch.value); // Debug log
  } else {
    this.filteredBatches = this.batches; // Show all batches
    if (this.batches.length > 0) {
      const firstCycleId = this.batches[0].cycleid; // Get the first cycleid
      this.fetchAssignments(firstCycleId); // Fetch assignments for the first batch
      this.fetchStudents(firstCycleId);
      console.log("First Cycle ID (default):", firstCycleId); // Debug log for the default case
    } else {
      console.log("No batches available to fetch assignments.");
    }
  }
},

async handleSelectChange2(value1) {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  let url = `${baseUrl}api/enrollmentsAssignments/with-assignments?`;

  if (value1) {
    // Append cycleid and studentId if a student is selected
    url += `cycleid=${value1.value2}&studentId=${value1.value1}`;
    console.log("Student selected URL:", url);
  } else if (this.selectedCycleId) {
    // Use last selected cycleid if no student is selected
    console.log("Using selectedCycleId:", this.selectedCycleId);
    url += `cycleid=${this.selectedCycleId}`;
    console.log("Selection cleared, URL using last selected cycleid:", url);
  } else if (this.batches.length > 0) {
    // Use firstCycleId from batches as the final fallback
    const firstCycleId = this.batches[0].cycleid;
    console.log("Using firstCycleId as fallback:", firstCycleId);
    url += `cycleid=${firstCycleId}`;
    console.log("Selection cleared, URL using firstCycleId:", url);
  } else {
    console.error("No cycleid selected to fallback on");
    return; // Exit to prevent unnecessary API calls
  }

  console.log("Final API URL:", url);

  try {
    const response = await this.$api.get(url);
    console.log("Fetched assignments:", response.data);

    // Process the response data
    if (response.data && Array.isArray(response.data)) {
      // Sort by submitted ratio before mapping
      const sortedAssignments = response.data.sort((a, b) => {
        const submittedA = a.totalStudentAssignments || 0;
        const totalA = a.totalAssignments || 0;
        const ratioA = submittedA / totalA;

        const submittedB = b.totalStudentAssignments || 0;
        const totalB = b.totalAssignments || 0;
        const ratioB = submittedB / totalB;

        return ratioB - ratioA; // Sort in descending order
      });

      this.studentAssignments = sortedAssignments.map((assignment) => {
        const submitted = assignment.totalStudentAssignments || 0;
        const total = assignment.totalAssignments || 0;
        const submittedRatio = `${submitted}/${total}`;

        // Generate cycleid_new
        const cycleid = assignment.cycleid || '';
        const cycleid_new = cycleid.startsWith('0')
          ? `24A${cycleid.slice(-3)}`
          : `90A${cycleid}`;

        // Generate studentId_new
        const studentId = assignment.studentId || '';
        const studentId_new = `${cycleid_new}${studentId}`;

        return {
          ...assignment,
          submittedRatio,
          cycleid_new,
          studentId_new,
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
}
,

    handleRowClick(row) {
     // console.log('Row clicked:', row);
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
    fileType(newType) {
      if (newType === "zip") {
        this.fetchAndHandleZip();
      }
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
  /* #e7f0ff */
}
.student-assignment-table{
  width: 100%;
  margin-left: 2%;
  margin-right: 2%;
  /* border:2px solid #34549e; */
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
  width: 100% !important;
  white-space: normal; word-wrap: break-word;
  border-collapse: collapse;
}
.nested-table th,
.nested-table td {
  /* border: 1px solid #ccc; */
  white-space: normal; word-wrap: break-word;
  padding: 4px;
}

.search-container {
  width: 80%;
  margin: 2%;
}
.q-table .theaded  {
  background-color: #e7f0ff;
  color: #000000;
}

.q-table .theaded2  {
  background-color: #e7f0ff;
  color: #000000;
  border-radius: 0px 0px 0px 0px;
}

.q-table thead q-th:first-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.q-table thead q-th:last-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

/* Body row styles */
.q-table tbody .q-tr:nth-child(even) {
  background-color: #E7F0FF; /* Alternate row background color */
}

.q-table tbody .q-tr:nth-child(even) {
  background-color: #f4f4f4; /* Even rows background color */
}

.q-table tbody .q-tr:nth-child(odd) {
  background-color: #ffffff; /* Odd rows background color */
}

/* Style for alternating row colors in the nested table */
.nested-table tbody tr:nth-child(even) {
  background-color: #e7f0ff; /* Even rows background color */
}

.nested-table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* Odd rows background color */
}

.q-table tbody .q-tr:last-child td:first-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}



.q-table tbody .q-tr:last-child td:last-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

/* For first row cell borders and radius */
.q-table tbody .q-tr:first-child td:first-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.q-table tbody .q-tr:first-child td:last-child {
  border-radius: 0px 0px 0px 0px;
  overflow: hidden;
}

.tables-container {
  display: flex;
  width: 100%;
}

.batch-table {
  width: 30%;
  margin-left: 2%;
  border-right: 1px solid #ddd;
}

.assignment-table {
  width: 70%;
  margin-left: 20px;
}
.User_heading {
  color: #e7f0ff;
  margin-left: 4%;
}
.fin-input {
  width: 100%;
}
.even-row {
  background-color: #E7F0FF; /* Light blue color for even rows */
}

.odd-row {
  background-color: white; /* White color for odd rows */
}
</style>
