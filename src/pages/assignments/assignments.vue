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
      <q-card style="width: 90vw; height: 90vh; padding: 20px;">
        <q-card-section>
          <div class="text-h6">Upload Assignment</div>
        </q-card-section>

        <q-card-section>
          <!-- Drag & Drop Box -->
          <div
  v-if="!filePreviewUrl"
  style="border: 2px dashed #aaa; padding: 20px; text-align: center; cursor: pointer;"
  @dragover.prevent
  @drop="handleDrop"
  @click="$refs.fileInput.click()"
>
  <span>Drag & Drop or Click to Upload (PDF, JPG, PNG, Java, Python)</span>
</div>
          <input ref="fileInput" type="file" @change="handleFileSelect" accept=".jpg,.jpeg,.png,.pdf,.java,.py" style="display: none;">

          <!-- File Preview -->
          <!-- File Preview Section (Uses Full Space) -->
<div v-if="filePreviewUrl" style="margin-top: 20px; width: 100%; height: 80vh; display: flex; flex-direction: column; align-items: center;">
  <q-btn flat icon="close" @click="removeFile" style="align-self: flex-end;" />

  <!-- Image Preview -->
  <q-img v-if="fileType.startsWith('image/')" :src="filePreviewUrl" style="max-width: 100%; max-height: 100%;" />

  <!-- PDF Preview -->
  <iframe v-else-if="fileType === 'application/pdf'" :src="filePreviewUrl" style="width: 100%; height: 100%;"></iframe>

  <!-- Java & Python Code Preview -->
  <pre v-else-if="['text/x-java-source', 'text/x-python', 'text/plain', 'application/octet-stream'].includes(fileType)"
    style="width: 100%; height: 100%; overflow: auto; background: #f5f5f5; padding: 10px; border-radius: 5px;">
    <code class="code-preview">{{ fileContent }}</code>
  </pre>
</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" color="grey" v-close-popup />
          <q-btn  v-if="filePreviewUrl" label="Submit" color="primary" @click="handleSubmit" style="margin-top: 20px;" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { storeToRefs } from "pinia";
import { useProfileStore } from "src/stores/profile";
import { useSessionStore } from "src/stores/session";
import Prism from 'prismjs';
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
    };
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
      } else {
        console.error('Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
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

    openUploadDialog(assignment) {
      this.selectedAssignment = assignment;
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

    viewAssignment(assignment) {
      alert(`Viewing assignment: ${assignment.assignmentTitle}`);
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
</style>
