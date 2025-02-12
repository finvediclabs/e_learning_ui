<template>
  <div class="row parent-container">
    <div class="col-4 left-container">
      <div class="chapter-categories">
        <div class="course-details">
          <span>Course Details</span>
        </div>

  <ul>
    <li
      v-for="(name, index) in course.categoryName"
      :key="index"
      class="category-item1"
    >
      <div
        class="category-row1"
        :class="{ 'active-category': course.catgoryId[index] === activeCategoryId }"
        @click="handleCategoryClick(course.catgoryId[index])"
      >
        <span>{{ name }}</span>
      </div>
      <span v-if="index < course.categoryName.length - 1"><hr /></span>
    </li>
  </ul>
</div>

</div>

  <div class="col-8">
    <div class="right-container">
  <div class="category-details">
    <!-- Loading State -->
    <div v-if="loading">Loading category details...</div>

    <!-- Error State -->
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Top Buttons -->
      <div class="row mb-4" style="padding-left: 2%;">
        <!-- ======= -->
        <div class="col-12 d-flex justify-content-center button-container">
  <q-btn
    v-for="profile in elProfiles"
    :key="profile.id"
    :label="formatProfileName(profile.profileName)"
    :color="activeTab === formatProfileName(profile.profileName) ? 'primary' : 'grey'"
    :class="{
      'bg-primary text-white': activeTab === formatProfileName(profile.profileName),
      'bg-transparent text-grey': activeTab !== formatProfileName(profile.profileName)
    }"
    class="mx-2 button-class"
    unelevated
    @click="activeTab = formatProfileName(profile.profileName)"
  />
</div>
  <!-- ======== -->
</div>


      <!-- Content Tabs -->
     <!-- Books Tab -->
<div v-if="activeTab === 'books'" class="tab-content row">
  <div class="row col-10 main-content">
    <div
      v-for="book in books"
      :key="book.id"
      class="col-12 col-sm-4 col-md-3 col-lg-3 mb-4 book-card"
    >
      <div class="card h-100">
        <q-img :src="book.imagePath" alt="Book Cover" class="card-img-top book_img"  @click="visitChapter(book)"/>
        <div class="card-body">
          <span class="card-title">{{ book.chapterTitle }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="col-2"></div>
</div>

<!-- Videos Tab -->
<div v-if="activeTab === 'videos'" class="tab-content row">
  <div class="row mb-4 col-11 main-content">
    <div
      v-for="video in videos"
      :key="video.id"
      class="col-12 col-sm-4 col-lg-4 mb-4 video-card"
    >
      <div class="card h-100">
        <q-img :src="video.coverPath" alt="Video Cover" class="card-img-top book_img" @click="visitVideo(video)" />
        <div class="card-body">
          <span class="card-title">{{ video.chapterTitle }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="col-1"></div>
</div>

<!-- Presentations Tab -->
<div v-if="activeTab === 'presentations'" class="tab-content row">
  <div class="row mb-4 col-11 main-content">
    <div
      v-for="presentation in presentations"
      :key="presentation.id"
      class="col-12 col-sm-4 col-lg-4 mb-4 presentation-card"
    >
      <div class="card h-100">
        <q-img :src="presentation.coverPath" alt="Presentation Cover" class="card-img-top book_img" @click="visitPresentation(presentation)" />
        <div class="card-body">
          <span class="card-title">{{ presentation.chapterTitle }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="col-1"></div>
</div>


    </div>
  </div>
  </div>
</div>
</div>
</template>

<script>
import 'src/css/LibraryProgramView.css';
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import CryptoJS from 'crypto-js'
export default {
  name: 'CategoryDetails',
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    // console.log('Session Store:', session);
    return {
      token,
      userType,
      roles: [] // Initialize roles array to store fetched roles
    };
  },
  data() {
    return {
      books: [],
      activeTab: 'books', // Default active tab
      activeCategoryId: null,
      profiles: [], // This will hold all fetched profiles
      elProfiles: [],
      videos: [],
      presentations: [],
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
      const { courseId } = this.$route.params; // Get courseId from route params
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const apiUrl = `${baseUrl}api/programs/${courseId}`;

      try {
        this.loading = true;
        const response = await this.$api.get(apiUrl);

        if (response.data && response.data.success) {
          const course = response.data.data;

          // Process the course details
          this.course = {
            id: course.programId,
            title: course.heading,
            description: course.description,
            categoryName: course.chapterCategoryNames,
            catgoryId: course.chapterCategoryIds,
            abstractt: course.description,
            imagePath: course.imagePath || this.DummyBook, // Use dummy image as fallback
          };
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
    async fetchCategoryDetails() {
      const { courseId, categoryId } = this.$route.params; // Get courseId and categoryId from the route
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const apiUrl = `${baseUrl}api/programs/${courseId}/category/${categoryId}`;

      try {
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
          throw new Error('Failed to fetch category details');
        }
      } catch (error) {
        this.error = 'Error loading category details. Please try again later.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    handleCategoryClick(selectedCategoryId) {
      const { courseId } = this.$route.params; // Get courseId from route params
      console.log('Selected category ID:', selectedCategoryId);
      console.log('Course ID:', courseId);

      // Set the active category ID
      this.activeCategoryId = selectedCategoryId;

      // Update the route params to include the new categoryId
      this.$router.push({
        name: this.$route.name, // Keep the same route name
        params: { courseId, categoryId: selectedCategoryId }, // Update categoryId
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

      this.videos = await Promise.all(
        this.category.videoChapters.map(async (video) => {
          const formData = new FormData();
          const removePrefix = `${baseUrl}fs/download/`;
          const filename = video.videoCoverPath.replace(removePrefix, '');

          formData.append('filename', filename);

          try {
            const response = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            return {
              ...video,
              coverPath: url, // Dynamic video cover path
            };
          } catch (error) {
            console.error(`Error fetching video cover: ${video.chapterTitle}`, error);
            return {
              ...video,
              coverPath: this.DummyVideo, // Fallback video cover
            };
          }
        })
      );
    },

    async fetchPresentationImages() {
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const downloadUrl = `${baseUrl}fs/download`;

      this.presentations = await Promise.all(
        this.category.presentationChapters.map(async (presentation) => {
          const formData = new FormData();
          const removePrefix = `${baseUrl}fs/download/`;
          const filename = presentation.presentationCoverPath.replace(removePrefix, '');

          formData.append('filename', filename);

          try {
            const response = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            return {
              ...presentation,
              coverPath: url, // Dynamic presentation cover path
            };
          } catch (error) {
            console.error(`Error fetching presentation cover: ${presentation.chapterTitle}`, error);
            return {
              ...presentation,
              coverPath: this.DummyPresentation, // Fallback presentation cover
            };
          }
        })
      );
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

