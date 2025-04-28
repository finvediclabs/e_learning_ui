<template>
  <div class="row parent-container">
    <div class="col-12 col-md-4 left-container mb-3">
      <div class="chapter-categories">
  <div class="course-details" >
    <span>Course Details</span>
  </div>

  <ul>
    <li v-for="(name, index) in course.categoryName" :key="index" class="category-item1">
      <div
        class="category-row1"
        :class="{ 'active-category': course.catgoryId[index] === activeCategoryId }"
      >
      <div class="row col-12"  @click="handleCategoryClick(course.catgoryId[index])">
        <div class="col-4 left_img">
          <img
    v-if="course.categoryImagePaths && course.categoryImagePaths[index]"
    :src="course.categoryImagePaths[index]"
    alt="Category Image"
    class="category-image"
  />
        </div>
        <div class="col-8 right_text" >
          <div class="row">
            <span>{{ name }}</span><br>
          </div>
          <div class="text-body1"
          :class="{
            'category-description': true,
            'expanded': expandedIndexes.includes(index)
          }"
        >
          {{ course.categoryDescription[index] }}
        </div>

        <!-- Display Modules Below Description -->


        <!-- Read More / Read Less Toggle -->
        <a href="javascript:void(0);" @click="toggleDescription(index)" class="read-more-link">
          {{ expandedIndexes.includes(index) ? 'Read Less' : 'Read More' }}
        </a>
        </div>
      </div>



        <div
  v-if="course.catgoryId[index] === activeCategoryId"
  class="module-table"
>
  <table v-if="course.modulesByCategory && course.modulesByCategory[course.catgoryId[index]]?.length">
    <thead>
      <tr>
        <th style="font-size: 14px;">Table of Contents</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="module in course.modulesByCategory?.[course.catgoryId?.[index]] || []"
        :key="module.moduleId"
        :class="{ 'selected-module': module.moduleId === activeModuleId }"
        @click="handleModuleClick(module)"

      >
        <td style="font-size: 12px;">{{ module.moduleName }}</td>

        <td v-if="activeTab !== 'books'" class="arrow">→</td>
        <td v-else style="visibility: hidden;"> .</td>

      </tr>
    </tbody>
  </table>

  <!-- If no modules are available, show a message -->
  <div v-else class="no-modules">No modules available</div>
</div>
      </div>



      <span v-if="index < course.categoryName.length - 1"><hr /></span>
    </li>
  </ul>

</div>
</div>

<div class="col-12 col-md-8 mb-3">
    <div class="right-container">
  <div class="category-details">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
  <q-spinner-hourglass size="50px" color="primary" />
  <p class="loading-text">Loading category details...</p>
</div>

    <!-- Error State -->
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Top Buttons -->
      <div class="row mb-4" style="padding-left: 2%;">
  <div
    class="col-12 d-flex flex-wrap justify-content-center align-items-center button-container"
  >
    <q-btn
      v-for="profile in elProfiles"
      :key="profile.id"
      :label="formatProfileName(profile.profileName)"
      :color="activeTab === formatProfileName(profile.profileName) ? 'primary' : 'grey'"
      :class="{
        'bg-primary text-white': activeTab === formatProfileName(profile.profileName),
        'bg-transparent text-grey': activeTab !== formatProfileName(profile.profileName)
      }"
      class="mx-2 my-2 button-class"
      unelevated
      @click="activeTab = formatProfileName(profile.profileName)"
    />
  </div>
</div>


      <!-- Content Tabs -->
      <div v-if="activeTab === 'books'" class="tab-content row">
      <div v-if="loadingBooks" class="loading-text">Loading books...</div>
  <div v-else class="row col-12 col-md-10 main-content">
    <div
  v-for="(book, index) in books"
  :key="book.id"
  class="col-6 col-sm-4 col-md-3 col-lg-3 mb-4 book-card"
>
  <div class="card h-100">
    <q-img
      :src="book.imagePath"
      alt="Book Cover"
      class="card-img-top book_img"
      @click="handleBookClick(book, index)"
    />
    <div class="card-body">
      <span class="card-title">{{ book.chapterTitle }}</span>
    </div>
  </div>
</div>
  </div>
  <div class="col-2 d-none d-md-block"></div>
</div>
<!-- Video -->
<div v-if="activeTab === 'videos'" class="tab-content row">
  <div class="row col-12 col-md-10 main-content">
    <div v-for="group in videos" :key="group.videoId" class="col-12">
  <div class="row breakable-border">
    <div
      v-for="(video, index) in group.videos"
      :key="video.id"
      class="col-6 col-sm-4 col-lg-4 mb-4 video-card"
    >
      <div class="card h-100">
        <q-img
          :src="video.coverPath"
          alt="Video Cover"
          class="card-img-top book_img"
          @click="handleGroupedVideoClick(video, getVideoFlatIndex(group.videoId, index))"
        />
        <div class="card-body">
          <span class="card-title">{{ video.chapterTitle }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
  </div>
</div>

<!-- Presentations Tab -->
<div v-if="activeTab === 'presentations'" class="tab-content row">
  <div class="row col-12 col-md-10 main-content">
    <div v-for="group in presentations" :key="group.presentationId" class="col-12">
  <div class="row breakable-border">
    <div
  v-for="(presentation, localIndex) in group.presentations"
  :key="presentation.id"
  class="col-6 col-sm-4 col-lg-4 mb-4 presentation-card"
>
  <div class="card h-100">
    <q-img
      :src="presentation.coverPath"
      alt="Presentation Cover"
      class="card-img-top book_img"
      @click="handleGroupedPresentationClick(presentation, localIndex)"
    />
    <div class="card-body">
      <span class="card-title">{{ presentation.chapterTitle }}</span>
    </div>
  </div>
</div>
  </div>
</div>
  </div>
</div>



    </div>
  </div>
  </div>
</div>
</div>
<DemoUserPopUp v-if="showDemoPopup" @close="showDemoPopup = false" />
</template>

<script>
import 'src/css/LibraryProgramView.css';
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import CryptoJS from 'crypto-js'

import DemoUserPopUp from "src/layouts/DemoUserPopUp.vue";
export default {
  name: 'CategoryDetails',
  components: {
    DemoUserPopUp,
  },
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    // console.log('Session Store:', session);
    return {
      token,
      userType,
      roles: [], // Initialize roles array to store fetched roles
      booksCount: 2,
  videosCount: 0,
  presentationsCount: 2,
  presentationsAllowedIndexes: [1],
    };
  },
  data() {
    return {
      books: [],
      showDemoPopup: false,
      activeTab: 'books', // Default active tab
      activeCategoryId: null,
      profiles: [], // This will hold all fetched profiles
      elProfiles: [],
      videos: [],
      presentations: [],
      expandedIndexes: [],
      categoryLoading: false,
      category: {
        bookChapters: [],
        videoChapters: [],
        presentationChapters: [],
      },
      course: {
        id: null,
        title: '',
        description: '',
        categoryName: [],
        modulesByCategory: {},
        moduleId: [],
        moduleName: [],
        catgoryId: [],
        abstractt: '',
        imagePath: '',
      },
      modules: [],
      loading: true,
      error: null,
      activeTab: 'books', // Default active tab
      DummyBook: 'path/to/default-book-image.jpg', // Fallback for books
      DummyVideo: 'path/to/default-video-image.jpg', // Fallback for videos
      DummyPresentation: 'path/to/default-presentation-image.jpg', // Fallback for presentations
    };
  },
  watch: {
  $route(to, from) {
    if (to.params.categoryId !== from.params.categoryId) {
      this.fetchCategoryDetails(); // Automatically fetch new category data
    }

    // Remove moduleId when switching to the "books" tab
    if (this.activeTab === 'books' && to.params.moduleId) {
      this.activeModuleId = null;

      // Update the route to remove moduleId
      this.$router.push({
        name: this.$route.name,
        params: {
          courseId: to.params.courseId,
          categoryId: to.params.categoryId
        }
      });
    }
  }
},
created() {
    const { categoryId } = this.$route.params; // Get categoryId from the route params
    if (categoryId) {
      this.activeCategoryId = categoryId; // Set the initial active category based on the route params
    }
  },

  methods: {
    formatProfileName(profileName) {
    // Remove 'programs/' prefix if it exists
    return profileName.replace(/^programs\//, '');

  },
  toggleDescription(index) {
    if (this.expandedIndexes.includes(index)) {
      this.expandedIndexes = this.expandedIndexes.filter(i => i !== index);
    } else {
      this.expandedIndexes.push(index);
    }
  },
  async fetchProfiles() {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const response = await this.$api.get(`${baseUrl}api/userprofiles`);
    this.profiles = response.data;

    // Filter profiles based on:
    // 1. profileCode starts with 'EL'
    // 2. active === true
    // 3. roles array includes a role with name matching userType
    this.elProfiles = this.profiles.filter(profile => {
      return (
        profile.profileCode.startsWith('EL') &&
        profile.active &&
        profile.roles.some(role => role.name === this.userType)
      );
    });

    // Set the first EL Profile's profileName (after removing 'programs/') as the default active tab
    if (this.elProfiles.length > 0) {
      this.activeTab = this.formatProfileName(this.elProfiles[0].profileName);
      console.log('Active Tab:', this.activeTab);
    } else {
      console.log('No matching profiles found for the given userType.');
    }
  } catch (error) {
    console.error("Error fetching profiles:", error);
    this.error = error;
  }
},

async fetchCourseDetails() {
  const { courseId } = this.$route.params;
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = `${baseUrl}api/programs/${courseId}`;

  try {
    this.loading = true;
    const response = await this.$api.get(apiUrl);

    if (response.data && response.data.success) {
      const course = response.data.data;

      this.course = {
        id: course.programId,
        title: course.heading,
        description: course.description,
        categoryName: course.chapterCategoryNames,
        catgoryId: course.chapterCategoryIds,
        categoryDescription: course.chapterCategoryDescriptions,
        categoryImagePaths: [], // Initialize empty array for images
        imagePath: course.imagePath || this.DummyBook,
      };

      // Fetch category images dynamically
      await this.fetchCategoryImages(course.chapterCategoryImagePaths);

      await this.fetchModulesForCategories(this.course.catgoryId);
    } else {
      throw new Error('Failed to fetch course details');
    }
  } catch (error) {
    this.error = 'Error loading course details. Please try again later.';
    console.error(error);
  } finally {
    this.loading = false;
  }
},
async fetchCategoryImages(imagePaths) {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const downloadUrl = `${baseUrl}fs/download`;

  this.course.categoryImagePaths = await Promise.all(
    imagePaths.map(async (imagePath) => {
      const formData = new FormData();
      const removePrefix = `${baseUrl}fs/download/`;
      const filename = imagePath.replace(removePrefix, ''); // Extract actual filename

      formData.append('filename', filename);

      try {
        const response = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
        const blob = new Blob([response.data]);
        return window.URL.createObjectURL(blob); // Create object URL for the image
      } catch (error) {
        console.error(`Error fetching category image: ${filename}`, error);
        return this.DummyBook; // Fallback image
      }
    })
  );
},

async fetchModulesForCategories(categoryIds) {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';

  let modulesByCategory = {}; // Store modules per category

  for (const categoryId of categoryIds.map(id => Number(id))) {
    const apiUrl = `${baseUrl}api/modules/${categoryId}`;

    try {
      const response = await this.$api.get(apiUrl);
      console.log("Modules response for category:", categoryId, response.data);

      if (Array.isArray(response.data)) {
        modulesByCategory[categoryId] = response.data.map(module => ({
          moduleId: module.id,
          moduleName: module.moduleName,
        }));
      }
    } catch (error) {
      console.error(`Error fetching modules for category ${categoryId}:`, error);
      modulesByCategory[categoryId] = []; // Ensure empty array if there's an error
    }
  }

  // Assign to `course` so it's reactive
  this.course.modulesByCategory = { ...modulesByCategory };
  console.log("Updated course with categorized modules:", this.course.modulesByCategory);
},
async fetchCategoryDetails() {
  const { courseId, categoryId } = this.$route.params; // Get courseId and categoryId from the route
  const moduleId = this.activeModuleId; // Track selected module (if any)

  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  let apiUrl = `${baseUrl}api/programs/${courseId}/category/${categoryId}`;

  // If a module is selected, update API URL
  if (moduleId) {
    apiUrl += `/module/${moduleId}`;
  }

  try {
    console.log("Fetching category details from:", apiUrl); // Debugging

    const response = await this.$api.get(apiUrl);
    if (response.data && response.data.success) {
      const categoryData = response.data.data;

      // Store chapters for books, videos, and presentations
      this.category.bookChapters = categoryData.bookChapters || [];
      this.category.videoChapters = categoryData.videoChapters || [];
      this.category.presentationChapters = categoryData.presentationChapters || [];


      // Fetch dynamic images for all sections
      await Promise.all([
        this.fetchBookImages(),
        this.fetchVideoImages(),
        this.fetchPresentationImages(),
      ]);
    } else {
      throw new Error("Failed to fetch category details");
    }
  } catch (error) {
    this.error = "Error loading category details. Please try again later.";
    console.error(error);
  } finally {
    this.loading = false;
  }
},
handleModuleClick(selectedModule) {
  if (this.activeTab === 'books') {
    this.activeModuleId = null; // Reset module selection when switching to books
    return; // Prevent module selection
  }

  const { courseId, categoryId } = this.$route.params; // Get current params
  const selectedModuleId = selectedModule.moduleId; // Extract moduleId

  console.log('Selected Module ID:', selectedModuleId);

  // Toggle module selection
  this.activeModuleId = this.activeModuleId === selectedModuleId ? null : selectedModuleId;

  // Update the route params dynamically
  this.$router.push({
    name: this.$route.name, // Keep the same route name
    params: {
      courseId,
      categoryId,
      ...(this.activeModuleId && this.activeTab !== 'books' ? { moduleId: this.activeModuleId } : {}) // Only include moduleId if not in books tab
    },
  });

  this.fetchCategoryDetails(); // Fetch data with or without moduleId
},
handleCategoryClick(selectedCategoryId) {
  const { courseId } = this.$route.params; // Get courseId from route params
  console.log('Selected category ID:', selectedCategoryId);
  console.log('Course ID:', courseId);

  this.categoryLoading = true; // Show loader
  this.activeCategoryId = selectedCategoryId; // Set active category

  // Reset active module and tab selection
  this.activeModuleId = null;
  this.activeTab = 'books'; // Reset tab to books by default

  // Properly reset category data using Vue 3 reactivity
  this.category.bookChapters = [];
  this.category.videoChapters = [];
  this.category.presentationChapters = [];

  // Ensure Vue detects deep property changes
  this.category = { ...this.category };

  // Update the route params with the new categoryId
  this.$router.push({
    name: this.$route.name, // Keep the same route name
    params: { courseId, categoryId: selectedCategoryId }, // Update categoryId
  });

  // Fetch new category details
  this.fetchCategoryDetails()
    .finally(() => {
      this.categoryLoading = false; // Hide loader once data is loaded
    });
},
    async fetchBookImages() {
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const downloadUrl = `${baseUrl}fs/download`;

      this.books = await Promise.all(
        this.category.bookChapters.map(async (book) => {
          const formData = new FormData();
          const removePrefix = `${baseUrl}fs/download/`;
          const filename = book.chapterImagePath.replace(removePrefix, '');

          formData.append('filename', filename);

          try {
            const response = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            return {
              ...book,
              imagePath: url, // Dynamic book cover path
            };
          } catch (error) {
            console.error(`Error fetching book image: ${book.chapterTitle}`, error);
            return {
              ...book,
              imagePath: this.DummyBook, // Fallback book image
            };
          }
        })
      );
    },

    async fetchVideoImages() {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const downloadUrl = `${baseUrl}fs/download`;

  // Grouping videoChapters by videoId
  const groupedVideos = this.category.videoChapters.reduce((acc, video) => {
    if (!acc[video.videoId]) {
      acc[video.videoId] = [];
    }
    acc[video.videoId].push(video);
    return acc;
  }, {});

  // Process videos and fetch images
  this.videos = await Promise.all(
    Object.entries(groupedVideos).map(async ([videoId, videoList]) => {
      const processedVideos = await Promise.all(
        videoList.map(async (video) => {
          const formData = new FormData();
          const removePrefix = `${baseUrl}fs/download/`;
          const filename = video.videoCoverPath.replace(removePrefix, '');

          formData.append('filename', filename);

          try {
            const response = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            return { ...video, coverPath: url };
          } catch (error) {
            console.error(`Error fetching video cover: ${video.chapterTitle}`, error);
            return { ...video, coverPath: this.DummyVideo };
          }
        })
      );
      return { videoId, videos: processedVideos };
    })
  );
},

async fetchPresentationImages() {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const downloadUrl = `${baseUrl}fs/download`;

  // Grouping presentations by presentationId
  const groupedPresentations = this.category.presentationChapters.reduce((acc, presentation) => {
    if (!acc[presentation.presentationId]) {
      acc[presentation.presentationId] = [];
    }
    acc[presentation.presentationId].push(presentation);
    return acc;
  }, {});

  // Process presentations and fetch images
  this.presentations = await Promise.all(
    Object.entries(groupedPresentations).map(async ([presentationId, presentationList]) => {
      const processedPresentations = await Promise.all(
        presentationList.map(async (presentation) => {
          const formData = new FormData();
          const removePrefix = `${baseUrl}fs/download/`;
          const filename = presentation.presentationCoverPath.replace(removePrefix, '');

          formData.append('filename', filename);

          try {
            const response = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            return { ...presentation, coverPath: url };
          } catch (error) {
            console.error(`Error fetching presentation cover: ${presentation.chapterTitle}`, error);
            return { ...presentation, coverPath: this.DummyPresentation };
          }
        })
      );
      return { presentationId, presentations: processedPresentations };
    })
  );
},
handleBookClick(book, index) {
  if (this.userType === 'Guest' && index >= this.booksCount) {
    this.showDemoPopup = true;
  } else {
    this.visitChapter(book);
  }
},
getVideoFlatIndex(groupId, localIndex) {
    let index = 0;
    for (const group of this.videos) {
      if (group.videoId === groupId) break;
      index += group.videos.length;
    }
    return index + localIndex;
  },

  handleGroupedVideoClick(video, flatIndex) {
    if (this.userType === 'Guest' && flatIndex >= this.videosCount) {
      this.showDemoPopup = true;
      return;
    }
    this.visitVideo(video);
  },

getPresentationFlatIndex(groupId, localIndex) {
    let index = 0;
    for (const group of this.presentations) {
      if (group.presentationId === groupId) break;
      index += group.presentations.length;
    }
    return index + localIndex;
  },

  handleGroupedPresentationClick(presentation, localIndex) {
  if (
    this.userType === 'Guest' &&
    !this.presentationsAllowedIndexes.includes(localIndex)
  ) {
    this.showDemoPopup = true;
    return;
  }
  this.visitPresentation(presentation);
},

    visitChapter(chapter) {
      // console.log('Chapter File Path:', chapter.chapterFilePath); // Log the chapter file path

      var ext = chapter.chapterFilePath?.substr(chapter.chapterFilePath.lastIndexOf('.') + 1);
      let url = '/read-pdf';
      if (ext == 'pptx') { url = '/watch-ppt'; }
      else if (ext == 'mp4') { url = '/watch-video'; }
      else if (ext == 'pdf') { url = '/read-pdf'; }
      let item = chapter.chapterFilePath;

      if (item) {
        // console.log(item); // Log the item here

        this.$router.push({
          path: url,
          query: {
            item: CryptoJS.AES.encrypt(item, 'fileData').toString()
          }
        });
      } else {
        console.error('Failed to get chapter file path');
        // You can also show a notification or handle the failure in a different way
      }
    },
    visitPresentation(chapter) {
      var ext = chapter.presentationFilePath?.substr(
        chapter.presentationFilePath.lastIndexOf(".") + 1
      );
      let url = "/watch-ppt";
      if (ext == "pptx") {
        url = "/watch-ppt";
      } else if (ext == "mp4") {
        url = "/watch-video";
      } else if (ext == "pdf") {
        url = "/read-pdf";
      }
      let item = chapter.description;
      this.$router.push({
        path: url,
        query: {
          item: CryptoJS.AES.encrypt(item, "fileData").toString(),
        },
      });
    },
    visitVideo(chapter) {
      var ext = chapter.videoFilePath?.substr(
        chapter.videoFilePath.lastIndexOf(".") + 1
      );
      let url = "/watch-video";
      if (ext == "pptx") {
        url = "/watch-ppt";
      } else if (ext == "mp4") {
        url = "/watch-video";
      } else if (ext == "pdf") {
        url = "/read-pdf";
      }
      let item = chapter.videoFilePath;
      this.$router.push({
        path: url,
        query: {
          item: CryptoJS.AES.encrypt(item, "fileData").toString(),
        },
      });
    },
  },
  mounted() {
    this.fetchCourseDetails();
    this.fetchProfiles();
    this.fetchCategoryDetails(); // Fetch category details on component mount
  },
};
</script>

<style>
.category-image {
  width: 100%;
  max-width: 120px;
  height: auto;
  display: block;
  margin-bottom: 10px;
  border-radius: 8px;
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px; /* or 100vh if you want full screen */
  text-align: center;
  gap: 16px;
}
@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.loading-text {
  font-size: 20px;
  font-weight: 500;
  color: #4E5BF8;
  animation: pulse 1.5s infinite;
}


@media (max-width: 768px) {
  .category-image {
    width: 90%;
  }
}
</style>
