<template>
  <div class="assignments">
    <div class="row col-12 w-100">
      <div class="col-3 row">
        <h3>Assignment List</h3>
      </div>

      <div class="col-9 row">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Course</th>
              <th>File</th>
              <th>Status</th>
              <th>Submit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignment, index) in assignments" :key="assignment.id">
              <td>{{ index + 1 }}</td>
              <td>{{ assignment.assignmentTitle }}</td>
              <td>{{ assignment.assignmentDesc }}</td>
              <td>{{ formatDate(assignment.dueDate) }}</td>
              <td>{{ assignment.course }}</td>
              <td><a :href="assignment.file" target="_blank">Download</a></td>
              <td :class="{ 'done': assignment.status === 'Done', 'pending': assignment.status === 'Pending' }">
                {{ assignment.status }}
              </td>
              <td>
                <span v-if="assignment.status === 'Done'" class="submitted">Submitted</span>
                <q-btn v-else label="Upload" color="primary" @click="openUploadDialog(assignment)" />
              </td>
              <td>
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
    <q-dialog v-model="uploadDialog" persistent>
  <q-card class="upload-dialog-container">
    <!-- Close button -->
    <q-btn flat icon="close" @click="closeDialog" class="close-button" />

    <!-- Left Section: Assignment Description & File Preview -->
    <q-card-section class="left-section">
      <div class="assignment-instructions">
        <fin-portlet-header>
          <fin-portlet-heading :loading="loading">
            <span class="User_heading">Instructions</span>
          </fin-portlet-heading>
        </fin-portlet-header>
        <span><strong>Assignment Title:</strong> {{ dialogAssignmentTitle }}</span>
      </div>

      <div class="file-preview">
        <!-- Image Preview -->
        <q-img v-if="isImage(dialogFileUrl)" :src="dialogFileUrl" alt="File" class="image-preview" />

        <!-- PDF Preview -->
        <PDFViewer v-else-if="isPDF(dialogFileUrl)" :source="dialogFileUrl" class="pdf-preview"
          :controls="['rotate', 'zoom', 'catalog', 'switchPage']" />
      </div>
    </q-card-section>

    <!-- Right Section: Upload Feature -->
     <div class="row" style="display: block;">
      <div class="row">
    <q-card-section class="right-section">
      <div class="text-h6">Upload Assignment</div>

      <!-- Drag & Drop Box -->
       <div class="row" >
        <div class="row">
      <div class="upload-box" v-if="!filePreviewUrl" @dragover.prevent @drop="handleDrop" @click="$refs.fileInput.click()">
        <span>Drag & Drop or Click to Upload (PDF, JPG, PNG, Java, Python)</span>
      </div>
      <input ref="fileInput" type="file" @change="handleFileSelect" accept=".jpg,.jpeg,.png,.pdf,.java,.py" style="display: none;">
    </div>
      <!-- File Preview -->
      <div class="file-preview-box" v-if="filePreviewUrl">
        <q-btn flat icon="close" @click="removeFile" class="remove-file-btn" />

        <q-img v-if="fileType.startsWith('image/')" :src="filePreviewUrl" class="image-preview" />
        <iframe v-else-if="fileType === 'application/pdf'" :src="filePreviewUrl" class="pdf-preview"></iframe>
        <pre v-else-if="['text/x-java-source', 'text/x-python', 'text/plain', 'application/octet-stream'].includes(fileType)" class="code-preview">
          <code>{{ fileContent }}</code>
        </pre>
      </div>
    </div>
    </q-card-section>
  </div>

    <!-- Actions -->
     <div class="row">
    <q-card-actions style="width: 100%;">
      <q-btn v-if="filePreviewUrl" label="Submit" color="primary" @click="handleSubmit" style="margin-left: auto;margin-right: 1%;" />
    </q-card-actions>
  </div>
</div>
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
import PDFViewer from 'pdf-viewer-vue';
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
      assignments: [],
      uploadDialog: false,
      selectedAssignment: null,
      filePreviewUrl: "",
      fileType: "",
      fileContent: "",
      dialogFileUrl: '',

    };
  },
  components: {
    PDFViewer,
    FinPortlet,
    FinPortletHeader,
    FinPortletHeading,
    FinPortletItem,
  },
  methods: {
    async fetchAssignments() {
      try {
        const response = await this.$api.get("api/batch-assignments/batch/1001");
        if (response.data.success) {
          let assignmentsData = response.data.data;
          const studentId = this.user?.id;

          // Fetch assignment status
          const statusPromises = assignmentsData.map(async (assignment) => {
            try {
              const url = `api/student-assignments?studentId=${studentId}&assignmentId=${assignment.id}`;
              const statusResponse = await this.$api.get(url);
              assignment.status = statusResponse.data.data.length > 0 ? "Done" : "Pending";
            } catch (error) {
              assignment.status = "Pending";
            }
          });

          await Promise.all(statusPromises);
          this.assignments = assignmentsData;
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    },
    async handleSubmit() {
    try {
      let fileUri = '';

      if (this.selectedFile) {
        fileUri = await this.uploadFile(this.selectedFile);
        console.log('Uploaded file URI:', fileUri);
      } else {
        console.log('No file selected for upload.');
      }
      const userId = this.user?.id;
      const userEmail = this.user?.email;
      const data = {
        assignmentId: this.dialogAssignmentId,
        assignmentTitle: this.dialogAssignmentTitle,
        batchId: this.dialogBatchId,
        batchTitle: this.dialogBatchTitle,
        studentId: userId,
        studentName: userEmail,
        type: "assignment",
        submittedFile: fileUri,
        createdDate: new Date().toISOString(),
        isVerified: "N",
      };

      const jsonData = JSON.stringify(data);
      console.log('Submission data:', jsonData);

      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const studentAssignmentUrl = baseUrl + 'api/student-assignments';
      const sessionStore = useSessionStore();
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
        this.uploadDialog = false; // Close popup
        this.filePreviewUrl = '';
        this.fileType = '';
        this.fileName = '';
        this.selectedFile = null;

        this.fetchAssignments();
      } else {
        console.error('Failed to submit assignment');
        this.fetchAssignments();
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      this.fetchAssignments();
    }
  },
  closeDialog() {
      this.uploadDialog = false;
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


    openUploadDialog(assignment) {
      this.selectedAssignment = assignment;
      this.dialogAssignmentId = assignment.id;
      this.dialogAssignmentTitle = assignment.assignmentTitle;
      this.dialogBatchId = assignment.batchId;
      this.dialogBatchTitle = assignment.batchName;
      this.dialogFileUrl = assignment.file;
      this.uploadDialog = true;
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
  try {
    const studentId = this.user?.id;
    const url = `api/student-assignments?studentId=${studentId}&assignmentId=${assignment.id}`;

    const response = await this.$api.get(url);

    if (response.data.success && response.data.data.length > 0) {
      this.dialogFileUrl = response.data.data[0].submittedFile; // Set the submitted file
    } else {
      this.dialogFileUrl = ""; // No file submitted
    }

    // Open the dialog
    this.selectedAssignment = assignment;
    this.uploadDialog = true;

  } catch (error) {
    console.error("Error fetching submitted assignment:", error);
    this.dialogFileUrl = ""; // Handle error scenario gracefully
  }
},

    editAssignment(assignment) {
      alert(`Editing assignment: ${assignment.assignmentTitle}`);
    },
  },

  mounted() {
    this.fetchAssignments();
  },
};
</script>

<style scoped>
.assignments {
  text-align: center;
  padding: 20px;
  background-color: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.table th {
  background-color: #f4f4f4;
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
</style>
