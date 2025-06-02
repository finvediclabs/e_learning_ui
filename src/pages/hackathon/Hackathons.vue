<template>
  <div v-if="isSaasAdmin">
      <!-- Show assignments or batch assignments based on selected state -->
      <SaasAdminHackathon />
      </div>
  <div class="elearning-page" v-if="userType !== 'Admin' && userType !== 'Faculty' && userType !== 'SaasAdmin'"
  :style="{ backgroundImage: 'url(' + topBgGd + ')' }"
  >
    <div class="q-mt-xl" style="margin-left: 8%;margin-right: 8%;">
<div
  class="gd-background-container1"
  :style="{ backgroundImage: 'url(' + hACK_BG + ')' }"
  v-if="firstUpcomingCourse"
>
  <!-- Text Overlay -->
  <div class="gd-text-overlay1 text-h4 text-white">
    <span>
      <strong>Time:</strong>
      {{ formatTime(firstUpcomingCourse.date) }}
      <span v-if="firstUpcomingCourse.endDate"> - {{ formatTime(firstUpcomingCourse.endDate) }}</span>
    </span><br />
    <span><strong>Date:</strong> {{ formatDate(firstUpcomingCourse.date) }}</span><br />
    <span>
      <strong>Duration:</strong>
      {{ calculateDuration(firstUpcomingCourse.date, firstUpcomingCourse.endDate) }}
    </span>

    <div class="text-subtitle1 q-mt-sm q-pt-sm">
      <template v-if="firstUpcomingCourse.registeredEmails && firstUpcomingCourse.registeredEmails.includes(userEmail)">
        <div class="register-button-wrapper2">
          <div class="registered-btn2 highlight">
            <q-icon name="check_circle" class="arrow-icon" />
            Registered
          </div>
        </div>
      </template>
      <template v-else>
        <div class="register-button-wrapper2" @click.stop.prevent="handleRegistration(firstUpcomingCourse.id)">
          <button
            style="background-color: #fff; color: #000; border: none; font-weight: bold;"
            class="register-btn2 animate-on-click"
            :class="{ clicked: clickedButtonId === firstUpcomingCourse.id }"
          >
            <q-icon name="arrow_forward" class="arrow-icon moving-arrow" />
            Click to Register
          </button>
        </div>
      </template>
    </div>
  </div>
</div>

</div>

    <!-- Featured Courses Section -->
    <div class="featured-section">
      <div class="heading_class"> </div>

      <!-- Courses Section -->






<div class="section q-mx-xl" style="width: 80%; margin-right:auto; margin-left:auto;">
  <!-- Ongoing or Upcoming -->
  <div class="text-h5 q-mb-md text-bold">Ongoing & Upcoming Hackathons</div>

<div v-if="ongoingOrUpcomingCourses.length === 0" class="text-center text-grey q-pa-md">
  No ongoing or upcoming courses.
</div>

<div class="cards-container">
  <div
    v-for="course in ongoingOrUpcomingCourses"
    :key="course.id"
    class="card up-card"
    @click="openCourse(course.id, course.filePath, course.title, course.registeredEmails)"
  >
    <div class="card-image" :style="{ backgroundImage: 'url(' + course.cover + ')' }"></div>

    <div class="card-title">{{ course.title }}</div>

    <div class="card-content">
      <div><strong>Description:</strong> {{ course.description }}</div>
      <div class="q-mt-sm"><strong>Start:</strong> {{ course.date }}</div>
      <div><strong>End:</strong> {{ course.endDate }}</div>
      <div><strong>Slots:</strong> {{ course.maxSlots }}</div>

      <!-- Register / Registered Button -->
      <div class="text-subtitle1 q-mt-sm">
        <template v-if="course.registeredEmails && course.registeredEmails.includes(userEmail)">
          <div class="register-button-wrapper">
            <div class="registered-btn highlight">
              <q-icon name="check_circle" class="arrow-icon" />
              Registered
            </div>
          </div>
        </template>
        <template v-else>
          <div class="register-button-wrapper" @click.stop.prevent="handleRegistration(course.id)">
            <button class="register-btn animate-on-click" :class="{ clicked: clickedButtonId === course.id }">
              <q-icon name="arrow_forward" class="arrow-icon moving-arrow" />
              Register Now
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</div>


  <!-- Completed -->
  <div class="text-h5 q-mt-xl q-mb-md text-bold">Completed Hackathons</div>
  <div v-if="completedCourses.length === 0" class="text-center text-grey q-pa-md">
    No completed courses.
  </div>
  <div class="cards-container">
    <div
      v-for="course in completedCourses"
      :key="course.id"
      class="card up-card"
      @click="openCourse(course.id, course.filePath, course.title)"
    >
      <div class="card-image" :style="{ backgroundImage: 'url(' + course.cover + ')' }"></div>
      <div class="card-title">{{ course.title }}</div>
      <div class="card-content">
        <div><strong>Description:</strong> {{ course.description }}</div>
        <div class="q-mt-sm"><strong>Ended on:</strong> {{ course.endDate }}</div>
      </div>
    </div>
  </div>
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
import { storeToRefs } from 'pinia';
import hACK_BG from 'src/assets/hACK_BG.png';
import PDFViewer from 'pdf-viewer-vue';
import SaasAdminHackathon from './SaasAdminHackathon.vue';
import "vue3-pdf-app/dist/icons/main.css";

import topBgGd from 'src/assets/top_bg_gd.png';

import JSZip from "jszip";
import CryptoJS from 'crypto-js'
import { title } from 'vue-carousel-3d';

export default {
  name: 'ElearningCourses',
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
      DummyBook: DummyBook,
      courses: [],
      firstUpcomingCourse: null,
      chapterFilePath: '',
      hACK_BG,
      numPages: 0,
      ongoingOrUpcomingCourses: [],
    completedCourses: [],
      topBgGd: topBgGd,
      userEmail: '',
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
    SaasAdminHackathon,
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
     isSaasAdmin() {
      const profileStore = useProfileStore();
      const roles = profileStore.user.roles.map(role => role.name);
      // Check if the user is admin or faculty
      return roles.includes('SaasAdmin')
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
    formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(); // e.g. "6/2/2025"
  },
  formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g. "09:30 AM"
  },
  calculateDuration(start, end) {
    if (!start || !end) return '';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    if (diffMs <= 0) return '0 min';

    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes} min`;
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

    async openCourse(courseId, filePath, title, registeredEmails) {
  try {
    console.log('[openCourse] Start opening course', { courseId, filePath, title, registeredEmails });

    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);
    const email = user.value?.email;

    console.log('[openCourse] Current user email:', email);

    if (!registeredEmails) {
      console.warn('[openCourse] registeredEmails is undefined or null');
    }

    if (!registeredEmails || !registeredEmails.includes(email)) {
      console.warn('[openCourse] User is NOT registered for this course.');
      this.$q.notify({
        type: 'warning',
        message: 'You must register for this course before accessing it.'
      });
      return; // Stop here, don't open dialog
    }

    console.log('[openCourse] User is registered. Proceeding to open course dialog.');

    this.selectedCourse = { id: courseId, filePath };
    console.log('[openCourse] selectedCourse set:', this.selectedCourse);

    this.dialogAssignmentId = courseId;
    this.dialogAssignmentTitle = title;

    console.log('[openCourse] dialogAssignmentId set to:', this.dialogAssignmentId);
    console.log('[openCourse] dialogAssignmentTitle set to:', this.dialogAssignmentTitle);

    this.dialog = true; // Open dialog
    console.log('[openCourse] dialog opened.');

    this.sendPostRequest(filePath);
    console.log('[openCourse] sendPostRequest called with filePath:', filePath);
  }
  catch (error) {
    console.error('[openCourse] Error opening course:', error);
  }
  finally {
    this.loading = false;
    console.log('[openCourse] loading set to false.');
    await this.fetchStudentAssignments();
    console.log('[openCourse] fetchStudentAssignments completed.');
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
    const url = `${baseUrl}api/hackathon`;
    const response = await this.$api.get(url);

    if (response.data && response.data.success) {
      console.log('fetchCourses: Response received.', response);

      this.courses = response.data.data.map(course => ({
        id: course.id,
        title: course.heading,
        description: course.description,
        abstractt: course.abstractt,
        courseId: course.courseId,
        filePath: course.filePath,
        date: course.date ? new Date(course.date) : null,
        endDate: course.endDate ? new Date(course.endDate) : null,
        registeredEmails: course.registeredEmails,
        maxSlots: course.maxSlots,
        registeredSlots: course.registeredSlots,
        cover: course.imagePath || this.DummyBook,
      }));

      const now = new Date();

      this.ongoingOrUpcomingCourses = this.courses.filter(course => {
        if (!course.date) return false;

        if (now < course.date) return true; // upcoming
        if (course.endDate && now >= course.date && now <= course.endDate) return true; // ongoing

        return false;
      });

      this.completedCourses = this.courses.filter(course => {
        if (!course.endDate) return false;
        return now > course.endDate;
      });

      this.ongoingOrUpcomingCourses.sort((a, b) => a.date - b.date);
      this.completedCourses.sort((a, b) => b.endDate - a.endDate);

      // Set first upcoming or ongoing course for top display
      this.firstUpcomingCourse = this.ongoingOrUpcomingCourses.length > 0 ? this.ongoingOrUpcomingCourses[0] : null;

      const imgurl = `${baseUrl}fs/download/`;
      await Promise.all(this.courses.map(async (course, index) => {
        if (course.cover && course.cover.startsWith(imgurl)) {
          const downloadUrl = `${baseUrl}fs/download`;
          const filename = course.cover.replace(imgurl, '');
          const formData = new FormData();
          formData.append('filename', filename);

          try {
            const downloadResponse = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
            const blob = new Blob([downloadResponse.data]);
            course.cover = window.URL.createObjectURL(blob);
          } catch (error) {
            console.error(`Error fetching cover for course [${index}]:`, error);
            course.cover = this.DummyBook;
          }
        }
      }));

      await this.fetchAllStudentAssignmentsForUser();

    } else {
      console.error('fetchCourses: Invalid data structure or failure in response:', response);
    }
  } catch (error) {
    console.error('fetchCourses: Error occurred during fetch:', error);
  } finally {
    this.loading = false;
    console.log('fetchCourses: Finished fetching courses.');
  }
},

 async registerUser(hackathonId) {
    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    const email = user.value?.email;
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const url = `${baseUrl}api/hackathon/register/${hackathonId}?userEmail=${encodeURIComponent(email)}`;

    try {
      const response = await this.$api.post(url);
      console.log('Hackathon Registration success:', response.data);
      this.fetchCourses(); // Refresh list or status
    } catch (error) {
      console.error('Hackathon Registration failed:', error.response?.data || error.message);
    }
  },


  handleRegistration(id) {
    this.clickedButtonId = id;
    this.registerUser(id);

    // Remove animation class after 1.5 seconds
    setTimeout(() => {
      this.clickedButtonId = null;
    }, 1500);
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
          batchId: "1001",
          batchTitle: "batch 002",
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

     const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);
    this.userEmail = user.value?.email || '';
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
.cards-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

@media (min-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card.up-card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  cursor: pointer;
}
.card.up-card:hover {
  transform: translateY(-4px);
}

.gd-background-container1 {
  position: relative;
  width: 100%;
  margin: auto;
  background-size: cover;
  background-position: center;
  height: 68vh; /* adjust as needed */
  border-radius: 10px;
}
.gd-text-overlay1{
  position: absolute;
  bottom: 20vh;
  right: 4vw;
  text-align: left;
  color: white;
  font-weight: bold;
  /* optional: background for contrast */
  padding: 10px;
  border-radius: 6px;
}
.register-button2{
   position: absolute;
  bottom: 40%;
  right:30vw;
  text-align: left;
  color: white;
  font-weight: bold;
  /* optional: background for contrast */
  padding: 10px;
  border-radius: 6px;

}


.card-image {
  height: 150px;
  background-size: cover;
  background-position: center;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  padding: 8px 16px;
}

.card-content {
  padding: 0 16px 16px 16px;
  font-size: 14px;
}

.status-done {
  color: green;
  font-weight: bold;
}

.status-pending {
  color: orange;
  font-weight: bold;
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

.register-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: black;
  color: white;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: bold;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.register-btn:active {
  transform: scale(0.97);
  opacity: 0.9;
}

.register-btn .arrow-icon {
  background-color: white;
  color: black;
  border-radius: 50%;
  padding: 4px;
  font-size: 16px;
}


.register-button-wrapper {
  display: flex;
  align-items: flex-end !important;
  justify-content: flex-end;
}

.register-btn,
.registered-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #000;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.registered-btn {
  background-color: #4caf50; /* Green */
  cursor: default;
  pointer-events: none;
}

.arrow-icon {
  background-color: white;
  color: #1976d2;
  border-radius: 50%;
  padding: 4px;
  font-size: 20px;
  transition: transform 0.5s ease;
}

.registered-btn .arrow-icon {
  background-color: white;
  color: #4caf50;
}

  /* margi

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
