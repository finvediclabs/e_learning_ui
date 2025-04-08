<template>
  <div class="assignments">
    <div class="row col-12 w-100">
      <div class="col-3 left">
  <q-list>
    <q-item
      clickable
      @click="filterAssignments(null)"
      :class="{ 'selected-course': selectedCourse === null }"
    >
      <q-item-section>All Courses</q-item-section>
    </q-item>
    <q-item
      v-for="course in uniqueCourses"
      :key="course"
      clickable
      @click="filterAssignments(course)"
      :class="{ 'selected-course': selectedCourse === course }"
    >
      <q-item-section>{{ course }}</q-item-section>
    </q-item>
  </q-list>
</div>


  <div class="col-9 row right q-pl-lg">
<!-- Add a flex container to separate the course label and search bar -->
<div class=" all-courses row items-center justify-between q-mb-md">
  <!-- Selected Course Label (Aligned to Left) -->
  <span class="text-h6">{{ selectedCourse ? selectedCourse : 'All Courses' }}</span>

  <div class="filtering">
  <!-- Search Input (Aligned to Right) -->
  <q-input v-model="searchQuery" label="Search Assignments" rounded outlined class="q-ml-xl searching" style="max-width: 300px;" />
  <q-btn label="Filter by Date | Status"  @click="filterDialog = true" class="q-ml-xl" />
  <q-dialog v-model="filterDialog">
  <q-card style="min-width: 400px;">
    <q-card-section>
      <div class="text-h6">Filter Assignments</div>
    </q-card-section>

    <q-card-section class="q-gutter-md">
      <!-- Date Picker -->
      <q-input v-model="selectedDate" label="Select Date" type="date" outlined />

      <!-- Status Multi-Select -->
      <q-select
        v-model="selectedStatuses"
        :options="statusOptions"
        label="Select Status"
        multiple
        outlined
        use-chips
      />
    </q-card-section>



    <q-card-actions align="right">
      <q-btn label="Clear Filter" flat color="negative" @click="clearFilters" />
      <q-btn label="Apply Filter" color="primary" @click="applyFilters" />
    </q-card-actions>
  </q-card>
</q-dialog>

</div>

</div>

    <table class="table">
      <thead>
        <tr>
          <th style=" border-right: none">#</th>
          <th style="border-left: none; border-right: none">Title</th>
          <th style="border-left: none; border-right: none">Course</th>
          <!-- <th>Description</th> -->
          <th style="border-left: none; border-right: none">Due Date</th>

          <!-- <th >File</th> -->
          <th style="border-left: none; border-right: none">Status</th>
          <th style="border-left: none; border-right: none">Submit</th>
          <th style="border-left: none">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(assignment, index) in filteredAssignments" :key="assignment.id">
          <td style="border-right: none">{{ index + 1 }}</td>
          <td style="border-left: none; border-right: none">{{ assignment.assignmentTitle }}</td>
          <td style="border-left: none; border-right: none">{{ assignment.course }}</td>
          <!-- <td>{{ assignment.assignmentDesc }}</td> -->
          <td style="border-left: none; border-right: none">{{ formatDate(assignment.dueDate) }}</td>
          <!-- <td><a :href="assignment.file" target="_blank">Download</a></td> -->
          <td style="border-left: none; border-right: none" :class="{ 'done': assignment.status === 'Done', 'pending': assignment.status === 'Pending' }">
            {{ assignment.status }}
          </td>
          <td style="border-left: none; border-right: none">
            <span v-if="assignment.status === 'Done'" class="submitted">Submitted</span>
            <q-btn v-else label="Upload" color="primary" @click="openDialog(assignment)" />
          </td>
          <td style="border-left: none">
            <q-btn dense flat icon="more_vert">
              <q-menu>
                <q-list>
                  <q-item clickable @click="viewAssignment(assignment)">
                    <q-item-section>View</q-item-section>
                  </q-item>
                  <q-item clickable @click="editAssignment(assignment)">
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    <!-- Upload Dialog -->
    <q-dialog v-model="dialogVisible" full-width full-height persistent>
      <q-card style="height: 100vh; display: flex; flex-direction: row; position: relative;">

        <!-- Close button at the top-right corner -->
        <q-btn flat icon="close" @click="closeDialog"
          style="position: absolute; top: 10px; right: 10px; z-index: 1000;" />

        <!-- Left half for the image -->

        <q-card-section
          style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <!-- First row: Assignment Description -->
          <div style="width: 100%; text-align: center; margin-bottom: 20px;">
            <div style="padding: 10px;">
              <fin-portlet-header>
                <fin-portlet-heading :loading="loading">
                  <span class="User_heading">Instructions</span>
                </fin-portlet-heading>
              </fin-portlet-header>
              <!-- Display the assignment description -->
              <span><strong>Assignment Title:</strong> {{ dialogAssignmentTitle }}</span>
            </div>
          </div>

          <!-- Second row: Image -->
          <div style="width: 100%; display: flex; align-items: center; justify-content: center;">
            <q-img v-if="dialogFileUrl.split('.').pop().toLowerCase() === 'jpg' ||
              dialogFileUrl.split('.').pop().toLowerCase() === 'jpeg' ||
              dialogFileUrl.split('.').pop().toLowerCase() === 'png' ||
              dialogFileUrl.split('.').pop().toLowerCase() === 'gif' ||
              dialogFileUrl.split('.').pop().toLowerCase() === 'bmp' ||
              dialogFileUrl.split('.').pop().toLowerCase() === 'webp'" :src="dialogFileUrl" alt="File"
              style="max-width: 100%; max-height: 100%; object-fit: contain;" />

            <PDFViewer v-else-if="dialogFileUrl.split('.').pop().toLowerCase() === 'pdf'" :source="dialogFileUrl"
              style="height: calc(60vh - 70px)" :controls="['rotate', 'zoom', 'catalog', 'switchPage']" />
          </div>
        </q-card-section>

        <!-- Right half for drag and drop and actions -->
        <!-- Right half for drag and drop and actions -->


        <q-card-section
          style="flex: 1; display: flex; flex-direction: column; align-items: center; border-left: 1px solid #ddd; padding: 20px;">

          <div v-if="studentAssignments.length > 0">
            <fin-portlet style="background-color:transparent;margin-bottom:0px;max-height:100vh;width: 100%;">
              <fin-portlet-header style="width: 50vw;">
                <fin-portlet-heading :loading="loading">
                  <span class="User_heading text-center">Submitted Assignment</span>
                </fin-portlet-heading>
              </fin-portlet-header>
              <fin-portlet style="background-color:transparent;">
                <fin-portlet-item>
                  <div class="assignment-container">
                    <div v-for="assignment in studentAssignments" :key="assignment.id">
                      <div>
                        <span><strong>Assignment Title:</strong> {{ assignment.assignmentTitle }}</span>
                      </div>
                      <div>
                        <span><strong>Batch :</strong> {{ assignment.batchTitle }}</span>
                      </div>
                      <div>
                        <span><strong>Submission Date:</strong> {{ new Date(assignment.createdDate).toLocaleDateString()
                          }}</span>
                      </div>
                      <div>
                        <div>
  <span><strong>Selected Student Assignment ID:</strong> {{ dialogStudentAssignmentId }}</span>
</div>
                        <span><strong>Is Verified:</strong>
                          <template v-if="assignment.isVerified === 'Y'">
                            Your Assignment has been <strong>VERIFIED</strong>

                          </template>

                        </span>
                      </div>

                      <!-- Conditionally render button if not verified -->
                      <div class="q-row items-center no-wrap">
                        <!-- Conditional message and Edit button -->
                        <div v-if="assignment.isVerified === 'N'" class="q-col-auto row items-center">
                          <div>Your assignment is not yet verified</div>
                          <q-btn v-if="!onlyView" label="Edit" color="primary" @click="handleSupport(assignment.id)" class="q-ml-sm" />
                        </div>

                        <div class="q-row items-center no-wrap q-gutter-sm" style="margin-top: 10px">
                          <!-- Download File button -->
                          <q-btn label="Download File" color="green" @click="downloadFileAsPdf" class="q-ml-sm" />

                          <!-- View in New Tab button -->
                          <q-btn v-if="dialogFileUrl2" label="View in New Tab" icon="open_in_new" color="primary"
                            @click="openInNewTab(dialogFileUrl2)" class="q-ml-sm" />
                        </div>
                      </div>

                      <div v-if="EditisNotCLicked">
                        <!-- Image preview logic -->
                        <q-img
                          v-if="['jpg', 'jpeg', 'png', 'gif'].includes(dialogFileUrl2.split('.').pop().toLowerCase())"
                          :src="dialogFileUrl2" alt="Image File"
                          style="max-width: 100%; max-height: 100%; object-fit: contain; margin-top: 20px;" />

                        <!-- PDF display logic -->
                        <template v-else-if="dialogFileUrl2 && dialogFileUrl2.endsWith('.pdf')">
                          <div>
                            <vue-pdf-app style="height: calc(60vh - 70px)" :pdf="dialogFileUrl2" :title="true"
                              :theme="theme" class="q-pt-sm pdf" page-scale="20" :config="config">
                              <template #toolbar-right-prepend>
                                <div style="min-height:30px" class="flex flex-center">
                                  <q-icon name="contrast" @click="toggleTheme" size="sm" color="white"
                                    class="q-ma-md cursor-pointer" />
                                </div>
                              </template>
                            </vue-pdf-app>
                          </div>
                        </template>

                        <template
                          v-else-if="dialogFileUrl2 && ['java', 'py'].includes(dialogFileUrl2.split('.').pop().toLowerCase())">
                          <pre v-if="dialogFileContent">
        <code class="language-{{ dialogFileType }}">
          {{ dialogFileContent }}
        </code>
      </pre>
                        </template>


                        <template v-else>File Preview Not Available</template>

                      </div>

                    </div>
                  </div>
                </fin-portlet-item>
              </fin-portlet>
            </fin-portlet>
          </div>

          <div v-if="showDragAndDrop"
            style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;position: relative;">
            <fin-portlet-header style="width: 50vw;">
              <fin-portlet-heading :loading="loading" class="text-center">
                <span class="User_heading">Submit Your Assignment</span>
              </fin-portlet-heading>
            </fin-portlet-header>
            <div v-if="!filePreviewUrl"
              style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #aaa; padding: 20px; box-sizing: border-box; position: relative;"
              @dragover.prevent @drop="handleDrop">
              <span>Drag & Drop Image, PDF, .Java or .py files Here</span>
              <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*,.pdf,.java,.py"
                style="position: absolute; top: 50%; transform: translateY(-50%); opacity: 0; width: 100%; height: 100%; cursor: pointer;" />
            </div>

            <!-- File Preview and Remove Button -->
            <div v-if="filePreviewUrl"
              style="width: 100%; display: flex; flex-direction: column; align-items: center; margin-top: 20px;">
              <div style="position: relative; width: 100%; max-width: 600px;">
                <q-btn flat icon="close" @click="removeFile"
                  style="position: absolute; top: 10px; right: 10px; z-index: 1000; background: rgba(255, 255, 255, 0.8);" />
                <!-- Display image preview -->
                <q-img v-if="fileType.startsWith('image/')" :src="filePreviewUrl" alt="File Preview"
                  style="max-width: 100%; max-height: 400px; object-fit: contain;" />
                <!-- Display PDF preview -->
                <iframe
                  v-else-if="fileType === 'application/pdf' || fileType === 'text/x-java-source' || fileType === 'text/x-python' || fileType === 'text/plain' || fileType === 'application/octet-stream'"
                  :src="filePreviewUrl" style="width: 100%; height: 500px;"></iframe>

                <!-- Display message for other types -->
                <div v-else>
                  <span>File preview not available for this file type.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <q-btn v-if="filePreviewUrl" label="Submit" @click="onSubmit" style="margin-top: 20px;" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { storeToRefs } from "pinia";
import { useProfileStore } from "src/stores/profile";
import { useSessionStore } from "src/stores/session";
import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import Prism from 'prismjs';

import VuePdfApp from "vue3-pdf-app";
import PDFViewer from 'pdf-viewer-vue';

import "vue3-pdf-app/dist/icons/main.css";
import 'prismjs/components/prism-python'; // Load syntax highlighting for Python
import 'prismjs/components/prism-java';   // Load syntax highlighting for Java
import 'prismjs/themes/prism.css';
export default {
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    console.log("Session Token:", token.value);
    const { setUserType, setSessionToken } = session;
    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    return {
      token,
      userType,
      setUserType,
      setSessionToken,
      user
    }
  },
  data() {
    return {
      pdfPath: '',
      chapterFilePath: '',
      numPages: 0,
      theme: 'light',
      config: {
        sidebar: {
          viewThumbnail: true,
          viewOutline: false,
          viewAttachments: false
        },
        toolbar: {
          toolbarViewerRight: {
            presentationMode: true,
            openFile: false,
            print: false,
            download: false,
            viewBookmark: false
          }
        },
        secondaryToolbar: {
          presentationMode: true,
          secondaryOpenFile: false,
          secondaryPrint: false,
          secondaryDownload: false,
          secondaryViewBookmark: false,

        },
      },
      filterDialog: false,
    selectedDate: "",
    selectedStatuses: [],
    statusOptions: ["In Progress", "Pending", "Done"],
      searchQuery: "",
      assignments: [],
      filteredAssignments: [],
      enrollments: [],
    selectedCourse: null,
      selectedAssignment: null,
      onlyView: false,
      EditisNotCLicked: true,
      showDragAndDrop: true,
      studentAssignments: [],
      filePreviewUrl: "",
      fileType: "",
      fileContent: "",
      dialogVisible: false,
      dialogFileUrl: '',
      dialogFileUrl2: '',
      dialogFileContent: '', // The file content for Java and Python files
      dialogFileType: '',

    };
  },
  components: {
    PDFViewer,
    FinPortlet,
    FinPortletHeader,
    FinPortletHeading,
    FinPortletItem,
    VuePdfApp,
  },
  computed: {
    uniqueCourses() {
    return [...new Set(this.assignments.map(a => a.course))];
  },
  filteredAssignments() {
    console.log("Filtering assignments...");
    return this.assignments.filter(assignment => {
      const matchesCourse = !this.selectedCourse || assignment.course === this.selectedCourse;
      const matchesSearch = !this.searchQuery || assignment.assignmentTitle.toLowerCase().includes(this.searchQuery.toLowerCase());

      console.log(`Checking assignment: ${assignment.assignmentTitle}, Course: ${assignment.course}`);
      console.log(`matchesCourse: ${matchesCourse}, matchesSearch: ${matchesSearch}`);
      console.log("Filtered Assignments:", this.filteredAssignments);


      return matchesCourse && matchesSearch;
    });
  }
},

  methods: {
    applyFilters() {
  console.log("Before filtering:", this.assignments); // Check original data

  this.filteredAssignments = this.assignments.filter(assignment => {
    const matchesDate = this.selectedDate
      ? new Date(assignment.dueDate).toISOString().split("T")[0] === this.selectedDate
      : true;

    const matchesStatus = this.selectedStatuses.length
      ? this.selectedStatuses.includes(assignment.status)
      : true;

    return matchesDate && matchesStatus;
  });

  console.log("After filtering:", this.filteredAssignments); // Check if filtering works
  this.filterDialog = false; // Close modal after applying filters
},
clearFilters() {
  this.selectedDate = "";
  this.selectedStatuses = [];
  this.filteredAssignments = [...this.assignments]; // Reset to full list
},

    async fetchEnrollments() {
  this.loading = true;

  try {
    const profileStore = useProfileStore();
    const studentId = profileStore.user?.id;

    if (!studentId) {
      console.error("User ID is missing in profile store");
      return;
    }
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const url = `${baseUrl}api/enrollments/student/${studentId}`;
    console.log("Fetching enrollments from:", url); // Debugging

    const response = await this.$api.get(url);

    console.log("API Response:", response.data); // Log full response
    this.enrollments = response.data.data; // Store enrollments

    // Extract cycleId from the first enrollment and fetch assignments
    const cycleId = this.enrollments.length > 0 ? this.enrollments[0].cycleid : null;
    if (cycleId) {
      this.fetchAssignments(cycleId);
    } else {
      console.error("No cycle ID found in enrollments.");
    }
  } catch (error) {
    console.error("Error fetching enrollments:", error.response ? error.response.data : error);
  } finally {
    this.loading = false;
  }
},
async fetchAssignments(cycleId) {
  try {
    if (!cycleId) {
      console.error("Cycle ID is missing.");
      return;
    }

    const url = `api/batch-assignments/batch/${cycleId}`;
    console.log("Fetching assignments from:", url); // Debugging

    const response = await this.$api.get(url);
    if (response.data.success) {
      let assignmentsData = response.data.data;
      console.log("Assignments Data:", assignmentsData); // Log the fetched assignments
      const studentId = this.user?.id;

      // Fetch assignment status
      const statusPromises = assignmentsData.map(async (assignment) => {
        try {
          const statusUrl = `api/student-assignments?studentId=${studentId}&assignmentId=${assignment.assignmentId}`;
          const statusResponse = await this.$api.get(statusUrl);
          assignment.status = statusResponse.data.data.length > 0 ? "Done" : "Pending";
        } catch (error) {
          assignment.status = "Pending";
        }
      });

      await Promise.all(statusPromises);
      this.assignments = assignmentsData;
      this.filteredAssignments = assignmentsData; // Initially show all assignments
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
},

filterAssignments(course) {
    this.selectedCourse = course;
    this.$forceUpdate(); // Force reactivity update
  },
  async handleSupport(assignmentId) {
  const profileStore = useProfileStore(); // ✅ get the store
  this.userId = profileStore.user?.id;

  if (!this.userId) {
    console.error("User ID is not available.");
    return;
  }

  if (this.selectedAssignmentId === assignmentId) {
    this.showDragAndDrop = !this.showDragAndDrop;
    this.EditisNotCLicked = !this.EditisNotCLicked;

    const studentAssignment = await this.fetchStudentAssignments(this.userId, assignmentId);
    if (studentAssignment?.id) {
      this.studentAssignmentId = studentAssignment.id;
      console.log("studentAssignmentId:", this.studentAssignmentId);
    } else {
      console.warn("No student assignment found.");
    }

  } else {
    this.selectedAssignmentId = assignmentId;
    console.log("selectedAssignmentId:", assignmentId);
    this.showDragAndDrop = true;
    this.EditisNotCLicked = false;

    const studentAssignment = await this.fetchStudentAssignments(this.userId, assignmentId);
    if (studentAssignment?.id) {
      this.studentAssignmentId = studentAssignment.id;
      console.log("studentAssignmentId:", this.studentAssignmentId);
    } else {
      console.warn("No student assignment found.");
    }
  }
},
async fetchStudentAssignments(userId, assignmentId) {
  this.loading = true;
  try {
    const profileStore = useProfileStore();
    this.userId = profileStore.user?.id;
    this.userEmail = profileStore.user?.email;

    if (!this.userId || !assignmentId) {
      console.error("Missing userId or assignmentId.");
      this.loading = false;
      return null;
    }

    console.log("Fetching student assignments for:", this.userId, assignmentId);

    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const url = `${baseUrl}api/student-assignments?studentId=${this.userId}&assignmentId=${assignmentId}`;
console.log("API student URL:", url); // Debugging
    const response = await this.$api.get(url);
    const result = response.data;

    if (result.success && Array.isArray(result.data)) {
      this.studentAssignments = result.data || [];

      console.log("Student assignments fetched:", this.studentAssignments); // ✅ your requested console log

      this.showDragAndDrop = this.studentAssignments.length === 0;

      if (this.studentAssignments.length > 0) {
  this.dialogFileUrl2 = this.studentAssignments[0]?.submittedFile || "";
  this.dialogStudentAssignmentId = this.studentAssignments[0]?.id || null; // ✅ Add this line
  console.log("Setting dialogFileUrl2:", this.dialogFileUrl2);
  console.log("Setting dialogStudentAssignmentId:", this.dialogStudentAssignmentId); // ✅ Optional debug
}

      const fetchFiles = this.studentAssignments.map(async (assignment) => {
        const fileName = assignment.submittedFile || "";
        if (!fileName.trim()) {
          console.log("No file submitted.");
          return;
        }

        const fileType = fileName.split('.').pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileType);
        const isPdf = fileType === "pdf";
        const isCode = ["java", "py"].includes(fileType);

        if (isImage) {
          console.log("File type:", fileType, "Is image:", isImage);
        } else if (isPdf) {
          this.chapterFilePath = fileName;
          console.log("File type:", fileType, "Is PDF:", isPdf);
        } else if (isCode) {
          try {
            const fileResponse = await this.$api.get(fileName);
            this.dialogFileContent = fileResponse.data;
            this.dialogFileType = fileType;
          } catch (error) {
            console.error("Error fetching file content:", error);
          }
        } else {
          console.log("Unsupported file type:", fileType);
        }
      });

      await Promise.all(fetchFiles);

      return this.studentAssignments[0]; // ✅ Return first assignment for external use
    } else {
      console.error("Invalid data format:", result);
      this.studentAssignments = [];
      return null;
    }
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    this.studentAssignments = [];
    return null;
  } finally {
    this.loading = false;
  }
},
highlightCode() {
      this.$nextTick(() => {
        Prism.highlightAll(); // Highlight the code using PrismJS
      });
    },
    onSubmit() {
      if (this.dialogStudentAssignmentId) {
    console.log("StudentAssignmentId:", this.dialogStudentAssignmentId);
    this.updateSubmit(this.dialogStudentAssignmentId);
  } else {
    this.handleSubmit();
    // this.fetchBatchAssignments();
  }
},
    async handleSubmit() {
      try {
        let fileUri = '';

        // Check if a file is selected
        if (this.selectedFile) {
          fileUri = await this.uploadFile(this.selectedFile); // Use the stored file
          console.log('Uploaded file URI:', fileUri); // Log the URI
        } else {
          console.log('No file selected for upload.');
        }

        // Prepare the data for submission
        const data = {
          assignmentId: this.dialogAssignmentId,
          assignmentTitle: this.dialogAssignmentTitle,
          batchId: this.dialogBatchId,
          batchTitle: this.dialogBatchTitle,
          studentId: this.userId,
          studentName: this.userEmail,
          type:"assignment",
          submittedFile: fileUri, // Use the uploaded file URI
          createdDate: new Date().toISOString(),
          isVerified: "N",
        };

        // Convert data to JSON
        const jsonData = JSON.stringify(data);
        console.log('Submission data:', jsonData);

        // POST request to submit the assignment
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const studentAssignmentUrl = baseUrl + 'api/student-assignments';
        const sessionStore = useSessionStore(); // Get the session store
        const token = sessionStore.token;
        const response = await fetch(studentAssignmentUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: jsonData,
        });

        if (response.ok) {
          console.log('Assignment submitted successfully');
          // this.fetchBatchAssignments();
          this.fetchAssignments(this.dialogBatchId);
          // Optionally, you can reset the dialog and clear the file preview
          this.dialogVisible = false;
          this.filePreviewUrl = '';
          this.fileType = '';
          this.fileName = ''; // Clear the file name
          this.selectedFile = null; // Clear the selected file
        } else {
          console.error('Failed to submit assignment');
          this.fetchAssignments();
        }
      } catch (error) {
        console.error('Error submitting assignment:', error);
        this.fetchAssignments();
      }
    },
    async updateSubmit(studentAssignmentId) {
  try {
    console.log("StudentAssignmentId:", studentAssignmentId);
    let fileUri = '';

    // Upload file if selected
    if (this.selectedFile) {
      fileUri = await this.uploadFile(this.selectedFile);
      console.log('Uploaded file URI:', fileUri);
    } else {
      console.log('No file selected for upload.');
    }

    const data = {
      assignmentId: this.dialogAssignmentId,
      assignmentTitle: this.dialogAssignmentTitle,
      batchId: this.dialogBatchTitle,
      batchTitle: this.dialogBatchId,
      studentId: this.userId,
      studentName: this.userEmail,
      type: "assignment",
      submittedFile: fileUri,
      createdDate: new Date().toISOString(),
      isVerified: "N",
    };

    const jsonData = JSON.stringify(data);
    console.log('Update submission data:', jsonData);

    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const url = `${baseUrl}api/student-assignments/${studentAssignmentId}`; // Using passed ID

    const sessionStore = useSessionStore();
    const token = sessionStore.token;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: jsonData,
    });

    if (response.ok) {
      console.log('Assignment updated successfully');
      this.dialogVisible = false;
      this.filePreviewUrl = '';
      this.fileType = '';
      this.fileName = '';
      this.selectedFile = null;
    } else {
      console.error('Failed to update assignment');
    }
  } catch (error) {
    console.error('Error updating assignment:', error);
  }
},
  closeDialog() {
      this.dialogVisible = false;
      this.EditisNotCLicked = true;
      this.dialogFileUrl = '';
      this.filePreviewUrl = '';
      this.fileType = '';
      this.fileContent = '';
    },

  async uploadFile(file) {
    const formData = new FormData();
    const profileStore = useProfileStore();
    const username = profileStore.user.username;
    console.log("Username:", username);

    const modifiedFilename = `${username}_${file.name}`;
    formData.append('file', file, modifiedFilename);

    try {
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const uploadFileUrl = baseUrl + 'fs/assignments/upload-file';

      const response = await this.$api.post(uploadFileUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data.uri;
    } catch (error) {
      this.showMsg(error.response?.data.message || error.message, 'negative');
      throw error;
    }
  },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-GB");
    },

    isImage(fileUrl) {
      if (!fileUrl) return false;
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const fileExtension = fileUrl.split('.').pop().toLowerCase();
      return imageExtensions.includes(fileExtension);
    },

    // Function to check if the file is a PDF
    isPDF(fileUrl) {
      if (!fileUrl) return false;
      return fileUrl.split('.').pop().toLowerCase() === 'pdf';
    },


    async openDialog(assignment) {
  this.loading = true;
  console.log("Opening dialog for assignment:", assignment); // Log the assignment object for debugging

  try {
    const cleanFileName = assignment.file || ""; // Ensure fileName exists

    // Set dialog properties
    this.dialogAssignmentDesc = assignment.description;
    this.dialogAssignmentId = assignment.assignmentId;
    this.dialogAssignmentTitle = assignment.assignmentTitle;
    this.dialogBatchId = assignment.batchId;
    this.dialogBatchTitle = assignment.batchName;
    this.dialogUserId = this.user?.id;
    this.dialogUserEmail = this.user?.email;
    this.dialogFileUrl = cleanFileName;

    // Log all dialog attributes
    console.log("Dialog Attributes:", {
      dialogAssignmentDesc: this.dialogAssignmentDesc,
      dialogAssignmentId: this.dialogAssignmentId,
      dialogAssignmentTitle: this.dialogAssignmentTitle,
      dialogBatchId: this.dialogBatchId,
      dialogBatchTitle: this.dialogBatchTitle,
      dialogUserId: this.dialogUserId,
      dialogUserEmail: this.dialogUserEmail,
      dialogFileUrl: this.dialogFileUrl
    });

    // Open the dialog
    this.dialogVisible = true;
  } catch (error) {
    console.error("Error processing assignment for dialog:", error);
  } finally {
    this.loading = false;
    await this.fetchStudentAssignments(this.dialogUserId, assignment.id);
  }
},

    handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file; // Store the selected file
  this.filePreviewUrl = URL.createObjectURL(file);
  this.fileType = file.type;
  this.fileName = file.name;

  // Read the file content if it's a text-based file
  if (['text/x-java-source', 'text/x-python', 'text/plain'].includes(file.type)) {
    const reader = new FileReader();
    reader.onload = () => {
      this.fileContent = reader.result;
    };
    reader.readAsText(file);
  }
},

    async handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        this.fileType = file.type;
        this.filePreviewUrl = URL.createObjectURL(file);

        if (file.name.endsWith(".java") || file.name.endsWith(".py")) {
          this.fileContent = await this.readFileAsText(file);
        }
      }
    },

    readFileAsText(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file);
      });
    },

    removeFile() {
      this.filePreviewUrl = "";
      this.fileType = "";
      this.fileContent = "";
    },

    submitFile() {
      if (!this.filePreviewUrl) {
        alert("Please select a file to upload.");
        return;
      }
      alert("File submitted successfully!");
      this.uploadDialog = false;
      this.filePreviewUrl = "";
      this.fileContent = "";
    },

  async viewAssignment(assignment) {
    this.onlyView = true;
  this.loading = true;
  try {
    this.dialogAssignmentDesc = assignment.description;
    this.dialogAssignmentId = assignment.assignmentId;
    this.dialogAssignmentTitle = assignment.assignmentTitle;
    this.dialogBatchId = assignment.batchId;
    this.dialogBatchTitle = assignment.batchName;
    this.dialogFileUrl = assignment.file;

    if (!assignment.id) {
      console.error("No assignment ID provided.");
      this.loading = false;
      return;
    }

    // Fetch student assignments and wait for results
    await this.fetchStudentAssignments(this.user?.id, assignment.assignmentId);

    // Ensure dialogFileUrl2 is available before opening dialog
    console.log("Final File URL:", this.dialogFileUrl2);

    this.dialogVisible = true; // Open the dialog after fetching data
  } catch (error) {
    console.error("Error viewing assignment:", error);
  } finally {
    this.loading = false;
  }
},
async downloadFileAsPdf() {
      try {
        // Fetch the file from the URL
        const response = await fetch(this.dialogFileUrl2);

        // Check if the response is OK
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Convert the response to a Blob
        const blob = await response.blob();

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;

        // Set the filename directly from the URL
        const filename = this.dialogFileUrl2.split('/').pop();
        link.download = filename;

        // Append the link to the body and trigger a click
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link and revoking the object URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    },

    async editAssignment(assignment) {
  this.loading = true;
  this.onlyView = true;
  try {
    this.dialogAssignmentDesc = assignment.description;
    this.dialogAssignmentId = assignment.assignmentId;
    this.dialogAssignmentTitle = assignment.assignmentTitle;
    this.dialogBatchId = assignment.batchId;
    this.dialogBatchTitle = assignment.batchName;
    this.dialogFileUrl = assignment.file;

    if (!assignment.id) {
      console.error("No assignment ID provided.");
      this.loading = false;
      return;
    }
console.log("Assignment ID:", assignment.assignmentId);
    // Fetch student assignments and wait for results
    await this.fetchStudentAssignments(this.user?.id, assignment.assignmentId);

    // Ensure dialogFileUrl2 is available before opening dialog
    console.log("Final File URL:", this.dialogFileUrl2);

    // Call handleSupport to update states instead of using onlyView
    this.handleSupport(assignment.assignmentid);

    this.dialogVisible = true; // Open the dialog after fetching data
  } catch (error) {
    console.error("Error viewing assignment:", error);
  } finally {
    this.loading = false;
  }
},
  },

  mounted() {
    this.filteredAssignments = this.assignments.filter(a => a.status === "Pending"); // Test a simple filter
    console.log("Filtered Data on Mount:", this.filteredAssignments);
    this.filteredAssignments = [...this.assignments];
    this.fetchEnrollments();
  },
};
</script>

<style scoped>
.assignments {
  background-color: #fff !important;
  text-align: left;
  padding: 20px;
  padding-top: 0px;
  padding-left: 0px;
  /* background-color: #e5dcdc !important; */
}

.left{
  background-color: #fff !important;
  padding-top: 20px;
}

.right{
  padding-top: 20px;
  /* background-color: #e5dcdc !important; */
  background-color: #fff !important;

}

.table {
  width: 100%;
  border-collapse: separate !important;
  border-spacing: 0 10px;
}

.table th, .table td {
  border: 1px solid #000;
  padding: 10px;
  text-align: left;
}

.table th {
  /* background-color: #f4f4f4; */
  background-color: #e7f0ff;
}
.table td {
  background-color: #fff;
}

.done {
  color: green;
  font-weight: bold;
}

.pending {
  color: red;
  font-weight: bold;
}

.submitted {
  color: green;
  font-weight: bold;
}
.upload-dialog-container {
  height: 90vh;
  width: 80vw;
  max-width:  80vw;
  display: flex;
  flex-direction: row;
  position: relative;
}

.left-section, .right-section {
  flex: 1; /* Each section takes 50% */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.left-section {
  border-right: 1px solid #ddd;
}

.assignment-instructions {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
}

.file-preview {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.pdf-preview {
  width: 100%;
  height: calc(60vh - 70px);
}

.upload-box {
  border: 2px dashed #aaa;
  display: flex; /* Enables flexbox */
  align-items: center; /* Centers content vertically */
  justify-content: center; /* Centers content horizontally */
  text-align: center;
  cursor: pointer;
  width: 38vw;
  height: 60vh;
}

.file-preview-box {
  margin-top: 20px;
  width: 40vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.remove-file-btn {
  align-self: flex-end;
}

.code-preview {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.selected-course {
  /* background-color: #F5F6F6 !important;  */
  background-color: #e7f0ff !important;
  color: #4e5bf8 !important;
  /* border-radius: 4px; */
}

.right{
  border-left: 2px solid #ddd;
}

.q-item:hover {
  background-color: #e7f0ff !important;
  color: #4e5bf8 !important;
}

.filtering{
  display: flex;
}



/* 📱 Mobile View: Stacking left & right sections */
@media (max-width: 768px) {
  .left, .right {
    width: 100%;
  }

  .table {
    font-size: 12px;
  }

  .table th, .table td {
    padding: 1px;
  }


  .table th:nth-child(4),
  .table td:nth-child(4),
  .table th:nth-child(5),
  .table td:nth-child(5) {
    display: none;
  }

  .all-courses{
    display: flex !important;
    flex-direction: column;
    justify-content: start !important;
    align-items: start !important;
    }

    .filtering{
      margin-top: 10px;
    }

    .searching{
      margin-left: 0px;
    }

    .assignments{
      padding: 0px;
    }
    .right{
      padding-left: 0px;
      padding: 8px;
    }
}




</style>
