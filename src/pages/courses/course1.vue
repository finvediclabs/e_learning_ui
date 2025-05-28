<template>
  <div class="row parent-container body">
    <div class="col-12 col-md-4 left-container mb-3">
      <div class="chapter-categories">
        <div class="course-details">
          <span class="text-weight-bolder">Course Details</span>
        </div>

        <ul>
  <li class="category-item1">
    <div class="category-row1">
      <span class="text-weight-bold" >{{ course.categoryName }}</span><br>

     <span class="text-weight-light" style="font-size: 14px;">{{ course.description }}</span>
    </div>


  </li>
</ul>
</div>

</div>

<div class="col-12 col-md-8 mb-3">
    <div class="right-container">
  <div class="category-details">
    <!-- Loading State -->
 <div v-if="categoryLoading" class="loading-container">
  <q-spinner-hourglass size="40px" color="primary" />
  <p class="loading-text">Loading Popular Courses...</p>
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
     <!-- Books Tab -->
     <div v-if="activeTab === 'books'" class="tab-content row">
      <div v-if="BooksLoading" class="loading-container">
        <q-spinner-hourglass size="40px" color="primary" />
        <p class="loading-text">Loading Books...</p>
      </div>
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
  <div v-if="VideosLoading" class="loading-container">
        <q-spinner-hourglass size="40px" color="primary" />
        <p class="loading-text">Loading Videos...</p>
      </div>
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
  <div v-if="PresentationsLoading" class="loading-container">
        <q-spinner-hourglass size="40px" color="primary" />
        <p class="loading-text">Loading Presentations...</p>
      </div>
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
import { useProfileStore } from "src/stores/profile";
import DemoUserPopUp from "src/layouts/DemoUserPopUp.vue";
import { storeToRefs } from "pinia";
import CryptoJS from 'crypto-js'
export default {
  name: 'Courses',
  components: {
    DemoUserPopUp,
  },
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    console.log('User Type:', userType.value);
    // console.log('Session Store:', session);
    return {
      token,
      userType,
      roles: [], // Initialize roles array to store fetched roles
      booksCount: 2,
  videosCount: 0,
  presentationsCount: 2,
  presentationsAllowedIndexes: [1], // Allowed indexes for presentations
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
      BooksLoading:false,
      VideosLoading:false,
      PresentationsLoading:false,
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
        catgoryId: [],
        abstractt: '',
        imagePath: '',
      },
      categoryLoading: true,
      BooksLoading: true,
      VideosLoading:true,
      PresentationsLoading:true,
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
  },
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
    this.categoryLoading = true;
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
  } finally {
        this.categoryLoading = false;
      }
},

async fetchCourseDetails() {
  this.categoryLoading = true;
  try {
  const courseId = this.$route.params.id; // ✅ Extract the ID properly
  console.log("Course ID:", courseId); // Debugging

  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = `${baseUrl}api/categories/${courseId}`;

  console.log('API URL:', apiUrl);





    const response = await this.$api.get(apiUrl);


    if (response.data) {
      const course = response.data;
      console.log('Course Data:', course);

      // Ensure the API response contains expected data
      this.course = {
        id: course.id, // ✅ Correct field
        categoryName: course.categoryName, // ✅ Correct field
        description: course.description, // ✅ Correct field
        imagePath: course.imagePath || this.DummyBook, // ✅ Use fallback if imagePath is null
        bookChapters: course.bookChapters || [],
        videoChapters: course.videoChapters || [],
        presentationChapters: course.presentationChapters || [],
      };


    } else {

      throw new Error('Failed to fetch course details');
    }
  } catch (error) {
    this.error = 'Error loading course details. Please try again later.';
    console.error(error);
  } finally {
    this.categoryLoading = false;
  }
},
async fetchCategoryDetails() {
  this.categoryLoading = true;
  try {

  const courseId = this.$route.params.id; // ✅ Extract course ID correctly
  console.log("Course ID:", courseId); // Debugging

  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = `${baseUrl}api/categories/${courseId}`;

  console.log('API URL:', apiUrl); // Debugging


    const response = await this.$api.get(apiUrl);

    if (response.data) {
      const categoryData = response.data; // ✅ Directly assign API response
      console.log("Category Data:", categoryData);

      // Update category details
      this.category = {
        id: categoryData.id,
        categoryName: categoryData.categoryName,
        description: categoryData.description,
        imagePath: categoryData.imagePath || this.DummyBook, // ✅ Fallback if imagePath is null
        bookChapters: categoryData.bookChapters || [],
        videoChapters: categoryData.videoChapters || [],
        presentationChapters: categoryData.presentationChapters || [],
      };

      // Fetch dynamic images for all sections
      await Promise.all([
        this.fetchBookImages(),
        this.fetchVideoImages(),
        this.fetchPresentationImages(),
      ]);

    } else {
      throw new Error('Failed to fetch category details');
    }
  } catch (error) {
    this.error = 'Error loading category details. Please try again later.';
    console.error(error);
  } finally {
    this.categoryLoading = false;
    this.BooksLoading = false;
    this.VideosLoading=false;
    this.PresentationsLoading=false;
  }
},
    handleCategoryClick(selectedCategoryId) {
      const courseId = this.$route.params.id; // ✅ Extract the ID properly
      console.log("course id",courseId)
// Get courseId from route params
      console.log('Selected category ID:', selectedCategoryId);
      console.log('Course ID:', courseId);
      this.categoryLoading = true;
      // Set the active category ID
      this.activeCategoryId = selectedCategoryId;

      // Update the route params to include the new categoryId
      this.$router.push({
        name: this.$route.name, // Keep the same route name
        params: { courseId, categoryId: selectedCategoryId }, // Update categoryId
      });
      this.fetchCategoryDetails().finally(() => {
    this.categoryLoading = false; // Stop loader
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

    async loadMediaAssets() {
      await Promise.all([
        this.loadImages('books', 'bookChapters', 'chapterImagePath', this.DummyBook),
        this.loadImages('videos', 'videoChapters', 'videoCoverPath', this.DummyVideo),
        this.loadImages('presentations', 'presentationChapters', 'presentationCoverPath', this.DummyPresentation)
      ]);
    },

    async loadImages(stateKey, categoryKey, pathKey, defaultImage) {
      try {
        this[stateKey] = await Promise.all(this.category[categoryKey].map(async (item) => {
          try {
            const response = await this.$api.post(`/fs/download`, { filename: item[pathKey] }, { responseType: 'blob' });
            return { ...item, imagePath: URL.createObjectURL(new Blob([response.data])) };
          } catch {
            return { ...item, imagePath: defaultImage };
          }
        }));
      } catch (error) {
        console.error(`Error fetching ${stateKey} images:`, error);
      }
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px; /* or 100vh if you want full screen */
  text-align: center;
  gap: 16px;
}

.body{
    /* background-color: #ffff; */
  background-color: #F6F6F6;
  background-size: 100% 100%;
background-size: cover;
background-position: center;
background-repeat: no-repeat;
background-attachment: fixed;
}

.loading-text {
  font-size: 20px;
  font-weight: 500;
  color: #4E5BF8;
  animation: pulse 1.5s infinite;
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


</style>
