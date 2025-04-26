<template>
  <div class="elearning-page">

    <!-- Featured Courses Section -->
    <div class="featured-section">
      <div class="heading_class"> </div>

      <!-- Courses Section -->

      <div class="featured-courses">

<q-input
  v-model="searchQuery"
  outlined
  debounce="300"
  placeholder="Search courses..."
  class="search-bar"
  dense
  clearable
  prefix="🔍"
/>


  <table class="styled-course-table">
    <thead>
      <tr>
        <th>Image</th>
        <th>Title</th>
        <th>Description</th>
        <th>Status</th> <!-- ✅ New column -->
      </tr>
    </thead>
    <tbody>
      <tr v-if="filteredFeaturedCourses.length === 0">
      <td colspan="4" class="text-center text-grey q-pa-md">
        No matching courses found.
      </td>
    </tr>
      <tr
        v-for="(course, index) in filteredFeaturedCourses"
        :key="course.id"
        class="course-row"
        @click="openCourse(course.id, course.filePath, course.title)"
      >

        <td>
          <q-btn
            class="course-button"
            :style="{
              backgroundImage: `url(${course.cover})`,
              backgroundSize: 'cover',             
              height: '60px',
              borderRadius: '8px',
              
            }"
            flat
          ></q-btn>
        </td>
        <td>{{ course.title }}</td>
        <td>{{ course.description }}</td>
        <td>
          <span :class="isCourseDone(course.id) ? 'status-done' : 'status-pending'">
            {{ isCourseDone(course.id) ? 'Done' : 'Pending' }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  </div>

  <q-dialog v-model="dialog" full-width full-height>
    <q-card class="full-screen-card">

      <!-- Close Button (Top-Right Corner) -->
      <q-btn flat dense round icon="close" class="close-btn" @click="dialog = false" />

      <div class="dialog-container">
        <!-- Left Half (PDF Viewer) -->
        <div class="left-half" style="display: flex;flex-direction: column;">
          <!-- First row: Hackathon Description -->
          <div style="width: 100%; text-align: center; margin-bottom: 20px;">
            <div style=" padding-top: 20px;">
              <fin-portlet-header style="margin-bottom: 0px;">
                <fin-portlet-heading :loading="loading">
                  <span class="User_heading">Instructions</span>
                </fin-portlet-heading>
              </fin-portlet-header>
              <!-- Display the Hackathon description -->
              <span><strong>Hackathon Title:</strong> {{ dialogAssignmentTitle }}</span>
            </div>
          </div>

          <vue-pdf-app style="height: 100%; width: 100%;" :pdf="chapterFilePath" :title="true" :theme="theme"
            class="pdf" page-scale="20" :config="config">
            <template #toolbar-right-prepend>
              <div style="min-height:30px" class="flex flex-center">
                <q-icon name="contrast" @click="toggleTheme" size="sm" color="white" class="q-ma-md cursor-pointer" />
              </div>
            </template>
          </vue-pdf-app>
        </div>

        <!-- Right Half (Course Details) -->
        <div class="right-half">
          <q-card-section
            style="flex: 1; display: flex; flex-direction: column; border-left: 1px solid #ddd; padding: 20px;padding-top: 0px;">

            <div v-if="studentAssignments.length > 0">
              <fin-portlet
                style="background-color:transparent;margin-bottom:0px;max-height:100vh;width: 100%;padding-top: 0px;">
                <fin-portlet-header style="width: 50vw;">
                  <fin-portlet-heading :loading="loading" style="margin-top: 0px;">
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
                          <span><strong>Submission Date:</strong> {{ new
                            Date(assignment.createdDate).toLocaleDateString()
                            }}</span>
                        </div>
                        <div>
                          <span><strong>Is Verified:</strong>
                            <template v-if="assignment.isVerified === 'Yes'">
                              Your Assignment has been <strong>VERIFIED</strong>

                            </template>

                          </span>
                        </div>

                        <!-- Conditionally render button if not verified -->
                        <div class="q-row items-center no-wrap">
                          <!-- Conditional message and Edit button -->
                          <div v-if="assignment.isVerified === 'N'" class="q-col-auto row items-center">
                            <div>Your assignment is not yet verified</div>
                            <q-btn label="Edit" color="primary" @click="handleSupport(assignment.id)" class="q-ml-sm" />
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
                              <PDFViewer :source="dialogFileUrl2" style="height: calc(60vh - 70px)"
                                :controls="['rotate', 'zoom', 'catalog', 'switchPage']" />
                              <!-- <vue-pdf-app style="height: calc(60vh - 70px)" :pdf="dialogFileUrl2" :title="true"
                              :theme="theme" class="q-pt-sm pdf" page-scale="20" :config="config">
                              <template #toolbar-right-prepend>
                                <div style="min-height:30px" class="flex flex-center">
                                  <q-icon name="contrast" @click="toggleTheme" size="sm" color="white"
                                    class="q-ma-md cursor-pointer" />
                                </div>
                              </template>
                  </vue-pdf-app> -->
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
                <fin-portlet-heading :loading="loading" class="text-center"
                  style="margin-top: 0px; margin-bottom: 13px;">
                  <span class="User_heading">Submit Your Hackathon</span>
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
        </div>
      </div>
    </q-card>
  </q-dialog>




</template>




<script>
import 'src/css/LibraryHackathon.css';
import DummyBook from 'src/assets/dummyBook.jpg';
import VuePdfApp from "vue3-pdf-app";
import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import PDFViewer from 'pdf-viewer-vue';
import "vue3-pdf-app/dist/icons/main.css";
import JSZip from "jszip";
import CryptoJS from 'crypto-js'
import { title } from 'vue-carousel-3d';

export default {
  name: 'ElearningCourses',
  data() {
    return {
      DummyBook: DummyBook,
      courses: [],
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
      dialogFileContent: "", // Content for non-zip files
      extractedFiles: [],
      assignmentes: [], // Ensure this matches the API response structure
      batchAssignments: [],
      batchAssignments2: [],
      loading: false,
      selectedAssignmentId: null,
      selectedCycleId: null,
      enrollments: [],
      studentAssignments: [],
      filePreviewUrl: '',
      fileType: '',
      fileType2: '',
      fileName: '', // Add this line
      selectedFile: null, // Add this line
      userId: null,
      dialogVisible: false,
      showDragAndDrop: true,
      EditisNotCLicked: true,
      dialogFileUrl: '',
      dialogFileUrl2: '',
      dialogFileContent: '', // The file content for Java and Python files
      dialogFileType: '', // The file type ('java' or 'py')
      // URL for the image blob
      searchQuery: "",
      featuredCourses: [],
      filteredFeaturedCourses: [],
      searchQuery: '',
      dialog: false,  // Controls dialog visibility
    };
  },
  components: {
    FinPortlet,
    FinPortletHeader,
    // SubmittedAssignment,
    // SubmittedAssignment2,
    FinPortletHeading,
    VuePdfApp,
    PDFViewer,
    // FinPortletItem
  },
  
  computed: {
  filteredFeaturedCourses() {
    if (!this.searchQuery) return this.featuredCourses || [];

    return this.featuredCourses.filter(course =>
      course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  },
},


  methods: {
    async fetchAndHandleZip() {
      try {
        // Fetch the ZIP file
        const response = await fetch(this.dialogFileUrl2);

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

    async openCourse(courseId, filePath, title) {
      try {
        this.selectedCourse = { id: courseId, filePath }; // Store the selected course details
        console.log('Selected Course ID:', courseId);
        this.dialogAssignmentId = courseId;
        this.dialogAssignmentTitle = title;
        console.log('Selected Course Heading:', title);
        console.log('Selected Course File Path:', filePath);

        this.dialog = true; // Open dialog
        this.sendPostRequest(filePath);
      }
      catch (error) {
        console.error('Error opening course:', error);
      }
      // Fetch PDF or perform necessary operations
      finally {
        this.loading = false;
        await this.fetchStudentAssignments();
      }
    },
    // filterFeaturedCourses() {
    //   this.filteredFeaturedCourses = this.featuredCourses.filter((course) =>
    //     course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    //   );
    // },
    async sendPostRequest(course) {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const getPdfUrl = baseUrl + 'fs/download';
        const removeImagePath = baseUrl + 'fs/download/';

        // Extract filePath from course object
        const filePath = course;
        if (!filePath) {
          console.error('Error: filePath is missing in course object');
          return;
        }

        // Remove the prefix to get the actual filename
        const filePathWithoutPrefix = filePath.replace(removeImagePath, '');

        const formData = new FormData();
        formData.append('filename', filePathWithoutPrefix); // Use the modified filePath

        const response = await this.$api.post(getPdfUrl, formData, { responseType: 'blob' });

        if (response.status === 200) {
          const blob = new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
          this.chapterFilePath = url; // Set chapterFilePath to the fetched PDF URL
          console.log('PDF Loaded:', url);
        } else {
          console.error('Error fetching PDF:', response);
        }
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    },
    fetchUserId() {
      const profileStore = useProfileStore();
      this.userId = profileStore.user.id; // Store the user ID
      this.userEmail = profileStore.user.email;
      this.fetchEnrollments(this.userId); // Fetch enrollments based on user ID
    },
    async fetchEnrollments(userId) {
      this.loading = true; // Start loading state
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const enrollmentUrl = `${baseUrl}api/enrollments/student/${userId}`;

        // Fetch enrollments
        const enrollmentResponse = await this.$api.get(enrollmentUrl);

        if (enrollmentResponse.data && enrollmentResponse.data.data) {
          console.log('Fetched enrollments:', enrollmentResponse.data.data);
          this.enrollments = enrollmentResponse.data.data; // Store enrollments

          // Get the first cycleId
          const firstCycleId = this.enrollments.length > 0 ? this.enrollments[0].cycleid : null;

          if (firstCycleId) {
            console.log('First Cycle ID:', firstCycleId);

            // Fetch cycle details
            const cycleUrl = `${baseUrl}api/cycles/${firstCycleId}`;
            const cycleResponse = await this.$api.get(cycleUrl);

            if (cycleResponse.data && cycleResponse.data.data) {
              console.log('Fetched cycle details:', cycleResponse.data.data);
              this.cycleDetails = cycleResponse.data.data; // Store cycle details
              this.dialogBatchId = this.cycleDetails.cycleid; // Store the batch ID
              this.dialogBatchTitle = this.cycleDetails.cycleDesc;
            } else {
              console.error('Invalid cycle response structure:', cycleResponse);
            }
          } else {
            console.warn('No cycleId found in enrollments.');
          }
        } else {
          console.error('Invalid enrollment response structure:', enrollmentResponse);
        }
      } catch (error) {
        console.error('Error fetching enrollments or cycles:', error);
      } finally {
        this.loading = false; // End loading state
      }
    },
    highlightCode() {
      this.$nextTick(() => {
        Prism.highlightAll(); // Highlight the code using PrismJS
      });
    },
    onSubmit() {
      if (this.selectedAssignmentId) {
        console.log("StudentAssignmentId", this.selectedAssignmentId)
        // If studentAssignment.id exists, call the update method
        this.updateSubmit();
      } else {
        // Otherwise, call the handleSubmit method for new submission
        this.handleSubmit();
        // this.fetchBatchAssignments();

      }
    },


    handleSupport(assignmentId) {
      // If the clicked assignment is the same as the currently selected one, toggle the states
      if (this.selectedAssignmentId === assignmentId) {
        this.showDragAndDrop = !this.showDragAndDrop;
        this.EditisNotCLicked = !this.EditisNotCLicked;
      } else {
        // Set the selected assignment ID and reset states if a different assignment is clicked
        this.selectedAssignmentId = assignmentId;
        console.log("selectedAssignmentId:", assignmentId);
        this.showDragAndDrop = true;  // Show the drag-and-drop area
        this.EditisNotCLicked = false; // Set to false when a new assignment is clicked
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
    async fetchBatchAssignmentsByCycleId(cycleId) {
      this.loading = true; // Start loading state
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const url = `${baseUrl}api/batch-assignments/batch/${cycleId}`;

        // Use this.$api to make the request
        const response = await this.$api.get(url);

        // Log the fetched batch assignments for debugging
        console.log('Fetched batch assignments for cycleId:', cycleId, response.data.data); // Debugging output
        this.batchAssignments2 = response.data.data.map((assignment, index) => ({
          ...assignment,
          index: index + 1 // Add index starting from 1
        })); // Store fetched batch assignments
      } catch (error) {
        console.error('Error fetching batch assignments by cycleId:', error);
      } finally {
        this.loading = false; // End loading state
      }
    },
    isCourseDone(courseId) {
  console.log(`Checking if course ID ${courseId} has any matching student assignment...`);
  return this.studentAssignments.some(a => {
    console.log(`Comparing assignmentId: ${a.assignmentId} === courseId: ${courseId}`);
    return a.assignmentId === courseId;
  });
},
    async fetchCourses() {
      console.log('fetchCourses: Start fetching courses.');
      this.loading = true;

      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        let url = `${baseUrl}api/hackathon`;
        const response = await this.$api.get(url);
        this.loading = false;
        console.log('fetchCourses: Response received.', response);

        if (response.data && response.data.success) {
          console.log('fetchCourses: Parsing course data.');
          this.courses = response.data.data.map((course) => ({
            id: course.id,
            title: course.heading,
            description: course.description,
            abstractt: course.abstractt,
            courseId: course.courseId,
            filePath: course.filePath,
            cover: course.imagePath ? course.imagePath : this.DummyBook, // Default cover image if none is provided
          }));

          console.log('fetchCourses: Courses parsed successfully.', this.courses);

          this.featuredCourses = this.courses; // Initialize featured courses
          this.filteredFeaturedCourses = this.featuredCourses; // Initially show all featured courses

          this.courses.forEach((course, index) => {
            console.log(`fetchCourses: Processing course [${index}] with ID: ${course.id}.`);
            const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
            let imgurl = `${baseUrl}fs/download/`;
            if (course.cover && course.cover.startsWith(imgurl)) {
              console.log(`fetchCourses: Course [${index}] has a downloadable cover: ${course.cover}`);
              const downloadUrl = `${baseUrl}fs/download`;
              const removePrefix = `${baseUrl}fs/download/`;
              const filename = course.cover.replace(removePrefix, '');
              console.log('fileName', filename);
              console.log(`fetchCourses: Filename extracted for course [${index}]: ${filename}`);
              const formData = new FormData();
              formData.append('filename', filename);

              console.log(`fetchCourses: Sending POST request for cover of course [${index}].`);
              this.$api
                .post(downloadUrl, formData, { responseType: 'blob' })
                .then((downloadResponse) => {
                  console.log(`fetchCourses: Received cover blob for course [${index}].`);
                  const blob = new Blob([downloadResponse.data]);
                  const url = window.URL.createObjectURL(blob);
                  course.cover = url; // Update cover with the received blob URL
                  console.log(`fetchCourses: Updated cover for course [${index}]: ${url}`);
                })
                .catch((error) => {
                  console.error(`fetchCourses: Error fetching cover for course [${index}]:`, error);
                  course.cover = this.DummyBook; // Fallback to default image on error
                });
            } else {
              console.log(`fetchCourses: Course [${index}] has a static or missing cover.`);
            }
          });
          await this.fetchAllStudentAssignmentsForUser();
        } else {
          console.error('fetchCourses: Invalid data structure or failure in response:', response);
        }
      } catch (error) {
        this.loading = false;
        console.error('fetchCourses: Error occurred during fetch:', error);
      } finally {
        console.log('fetchCourses: Finished fetching courses.');
      }
    },
    async fetchStudentAssignments(userId, assignmentId) {
  this.loading = true; // Start loading state
  try {
    const profileStore = useProfileStore();
    this.userId = profileStore.user.id;
    const userId = this.userId; // Get the user ID from profile store
    const assignmentId = this.dialogAssignmentId; // Get the assignment ID from dialog

    console.log(userId, assignmentId);
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const url = `${baseUrl}api/student-assignments?studentId=${userId}&assignmentId=${assignmentId}`;

    // Use this.$api to make the request
    const response = await this.$api.get(url);
    const result = response.data; // Get data from the response

    if (result.success) {
      // Filter to only include Hackathon type assignments
      this.studentAssignments = result.data.filter(a => a.type === 'Hackathon');
      this.showDragAndDrop = this.studentAssignments.length === 0;

      const fetchFiles = this.studentAssignments.map(async (assignment) => {
        console.log("submitFile:", assignment.submittedFile);
        const fileName = assignment.submittedFile;

        const fileType = fileName.split('.').pop().toLowerCase(); // Get the file extension
        const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileType); // Check if it's an image
        const isPdf = fileType === 'pdf'; // Check if it's a PDF
        const isJava = fileType === 'java'; // Check if it's a .java file
        const isPython = fileType === 'py'; // Check if it's a .py file
        const isZip = fileType === 'zip'; // Check if it's a .zip file

        this.dialogFileUrl2 = fileName;

        if (isImage) {
          console.log("File type:", fileType, "Is image:", isImage);
        } else if (isPdf) {
          this.chapterFilePath = fileName;
          console.log("File type:", fileType, "Is PDF:", isPdf);
        } else if (isJava || isPython) {
          // Fetch the file content for Java or Python files
          const fileResponse = await this.$api.get(fileName);
          this.dialogFileContent = await fileResponse.data;
          this.dialogFileType = fileType;
        } else if (isZip) {
          this.fileType = 'zip';
        } else {
          console.log("Unsupported file type:", fileType);
        }
      });

      await Promise.all(fetchFiles);
      this.showDragAndDrop = this.studentAssignments.length === 0;
    } else {
      console.error('Failed to fetch student assignments:', result.message);
    }
  } catch (error) {
    console.error('Error fetching student assignments:', error);
  } finally {
    this.loading = false; // End loading state
  }
},
async fetchAllStudentAssignmentsForUser() {
  try {
    const profileStore = useProfileStore();
    const userId = profileStore.user.id;
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const url = `${baseUrl}api/student-assignments?studentId=${userId}`;

    const response = await this.$api.get(url);
    const result = response.data;

    if (result.success) {
      this.studentAssignments = result.data.filter(a => a.type === 'Hackathon');

      console.log("All Hackathon student assignments:");
      this.studentAssignments.forEach(a => {
        console.log(`assignment.id: ${a.id}, assignment.assignmentId: ${a.assignmentId}`);
      });
    } else {
      console.error("Failed to fetch student assignments:", result.message);
    }
  } catch (error) {
    console.error("Error fetching all student assignments:", error);
  }
},

    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileType = file.type;
        console.log("fileType:", this.fileType);
        this.filePreviewUrl = URL.createObjectURL(file);
        this.fileName = file.name;
        this.selectedFile = file; // Store the selected file
        console.log('Selected file:', file); // Log the selected file
      } else {
        console.log('No file selected.');
      }
    },

    async uploadFile(file) {
      const formData = new FormData();
      const profileStore = useProfileStore();
      const username = profileStore.user.username;
      console.log("username:", username)
      // Construct the new filename using the username and original file name
      const modifiedFilename = `${username}_${file.name}`;

      // Append the file to formData with the modified filename
      formData.append('file', file, modifiedFilename);

      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const uploadFileUrl = baseUrl + 'fs/assignments/upload-file';

        const response = await this.$api.post(uploadFileUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data.uri; // Assuming the URI is returned in `data.uri`
      } catch (error) {
        this.showMsg(error.response?.data.message || error.message, 'negative');
        throw error; // Rethrow the error to handle it in the main method
      }
    },
    openInNewTab(url) {
      window.open(url, '_blank');
    },
    async updateSubmit() {
      try {
        const studentAssignmentId = this.selectedAssignmentId // Ensure the studentAssignmentId is available
        let fileUri = '';

        // Check if a file is selected and upload it if necessary
        if (this.selectedFile) {
          fileUri = await this.uploadFile(this.selectedFile); // Upload the file
          console.log('Uploaded file URI:', fileUri); // Log the uploaded file URI
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
          type: "Hackathon",
          submittedFile: fileUri, // Use the uploaded file URI
          createdDate: new Date().toISOString(),
          isVerified: "N", // Default value for verification status
        };

        // Convert the data to JSON
        const jsonData = JSON.stringify(data);
        console.log('Update submission data:', jsonData);

        // Define the API URL for updating the student assignment
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const url = `${baseUrl}api/student-assignments/${studentAssignmentId}`;
        const sessionStore = useSessionStore(); // Get the session store
        const token = sessionStore.token;
        // Send the PUT request to update the existing student assignment
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Attach the token in the request headers
          },
          body: jsonData, // Send the JSON data as the request body
        });

        if (response.ok) {
          console.log('Assignment updated successfully');
          this.showMsg('Hackathon Submitted Successfully', 'positive');
          // Optionally, you can reset the dialog and clear the file preview after a successful update
          this.dialog = false;
          this.filePreviewUrl = '';
          this.fileType = '';
          this.fileName = ''; // Clear the file name
          this.selectedFile = null; // Clear the selected file
        } else {
          console.error('Failed to update assignment');
        }
      } catch (error) {
        console.error('Error updating assignment:', error);
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
          submittedFile: fileUri, // Use the uploaded file URI
          createdDate: new Date().toISOString(),
          type: "Hackathon",
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
          this.showMsg('Hackathon Submitted Successfully', 'positive');
          // this.fetchBatchAssignments();
          // Optionally, you can reset the dialog and clear the file preview
          this.dialog = false;
          this.filePreviewUrl = '';
          this.fileType = '';
          this.fileName = ''; // Clear the file name
          this.selectedFile = null; // Clear the selected file
        } else {
          console.error('Failed to submit assignment');

        }
      } catch (error) {
        console.error('Error submitting assignment:', error);
      }
    },
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => { } }
        ]
      });
    },
    removeFile() {
      // Clear file preview and type
      this.filePreviewUrl = '';
      this.fileType = '';
      // Optionally clear the file input field
      this.$refs.fileInput.value = '';
    },

  },

  watch: {
    // searchQuery: 'filterFeaturedCourses',
    fileType(newType) {
      if (newType === "zip") {
        this.fetchAndHandleZip();
      }
    },
  },
  mounted() {
    this.fetchCourses(); // Fetch courses on component mount
    this.fetchUserId();
  }
};
</script>

<style scoped>

@media (max-width: 768px) {
  /* .course-card {
    flex-direction: column;
    align-items: flex-start;
  } */

  .course-image-container {
    width: 100%;
  }

  .course-button {
    height: 150px;
  }

  .course-content {
    width: 100%;
    padding-top: 10px;
  }

  .course-name {
    font-size: 16px;
  }

  .course-description {
    font-size: 13px;
  }
}

/* Beautify the search input */
.search-bar {
  width: 100%;
  max-width: 400px;
  margin: 1rem ;
}

.styled-course-table {
  width: 100%;
  table-layout: fixed;
}

.styled-course-table th,
.styled-course-table td {
  border: 1px solid #ddd;
}



@media screen and (max-width: 768px) {
  .styled-course-table {
    font-size: 14px;
  }

  .styled-course-table th,
  .styled-course-table td {
    padding: 6px;
  }

  /* Make image smaller and fit the cell */
  .course-button {
    width: 60px !important;
    height: 40px !important;
    background-size: contain !important; 
    background-position: center;
    background-repeat: no-repeat;
  }

  .course-name {
    font-size: 16px;
  }

  .course-description {
    font-size: 13px;
    white-space: normal;
    word-break: break-word;
  }
}

/* Default (for mobile screens and below) */
.course-button {
  background-position: center;
}

/* For laptop screens and above */
@media (min-width: 768px) {
  .course-button {
    background-position: bottom;
  }
}



</style>
