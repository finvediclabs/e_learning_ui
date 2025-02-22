<template>
  <div class="course-details">
    <!-- Loading State -->
    <div v-if="loading">Loading course details...</div>

    <!-- Error State -->
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>

    <!-- Course Details -->
    <div v-else>
      <div class="row col-12 courseDetailsPage">
  <!-- Left Section: Course Name and Card -->
  <div class="col-12 col-md-5 col-lg-4 mb-3">
    <div class="course-name">{{ course.title }}</div>
    <div class="course-card">
      <q-btn
        class="course-button"
        :style="{ backgroundImage: `url(${course.imagePath})` }"
        flat
      ></q-btn>
      <div class="course-content">
        <div class="course-description">{{ course.abstractt }}</div>
      </div>
    </div>
  </div>

  <!-- Spacer for Small Screens -->
  <div class="d-none d-md-block col-md-1"></div>

  <!-- Right Section: Chapter Categories -->
  <div class="col-12 col-md-6" style="margin-top: auto;margin-bottom: auto;">
  <div class="chapter-categories" >
    <ul>
      <li
        v-for="(name, index) in course.categoryName"
        :key="index"
        class="category-item"
      >
        <div class="row align-items-center">
          <!-- Category Name & Description (8 columns) -->
          <div class="col-8">
            <span class="fw-bold">{{ name }}</span>

            <!-- Description with Read More/Read Less -->
            <div
              :class="{
                'category-description': true,
                'expanded': expandedIndexes.includes(index)
              }"
            >
              {{ course.categoryDescription[index] }}
            </div>

            <!-- Read More / Read Less Toggle -->
            <a
              href="javascript:void(0);"
              @click="toggleDescription(index)"
              class="read-more-link"
            >
              {{ expandedIndexes.includes(index) ? 'Read Less' : 'Read More' }}
            </a>
          </div>

          <!-- Button (4 columns) centered horizontally & vertically -->
          <div class="col-4 d-flex justify-content-center align-items-center" style="margin-bottom: auto;margin-top: auto;">
            <q-btn
              label="Let's Start"
              unelevated
              color="primary"
              class="category-button"
                 @click="onCategoryClick(course.catgoryId[index])"
            />
          </div>
        </div>

        <!-- Separator -->
        <span v-if="index < course.categoryName.length - 1">
          <hr />
        </span>
      </li>
    </ul>
  </div>
</div>

  <!-- Spacer for Small Screens -->
  <div class="d-none d-md-block col-md-1"></div>
</div>

    </div>
  </div>
</template>


<script>
import 'src/css/libraryProgram.css';
export default {
  name: 'CourseDetails',
  data() {
    return {
      course: null, // The course object
      loading: true, // Whether the page is loading
      error: null, // Error message
      expandedIndexes: []
    };
  },
  methods: {
    async fetchCourseDetails() {
  const courseId = this.$route.params.id; // Get the course ID from the route
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = `${baseUrl}api/programs/${courseId}`; // API endpoint

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
        categoryDescription: course.chapterCategoryDescriptions,
        catgoryId: course.chapterCategoryIds,
        abstractt: course.description,
        imagePath: course.imagePath ? course.imagePath : this.DummyBook, // Use dummy image as fallback
      };

      // Handle downloadable cover logic
      const imgurl = `${baseUrl}fs/download/`;
      if (this.course.imagePath && this.course.imagePath.startsWith(imgurl)) {
        const downloadUrl = `${baseUrl}fs/download`;
        const removePrefix = `${baseUrl}fs/download/`;
        const filename = this.course.imagePath.replace(removePrefix, '');
        console.log('fileName', filename);

        // Create form data for downloading the cover
        const formData = new FormData();
        formData.append('filename', filename);

        console.log('fetchCourseDetails: Sending POST request for cover.');
        this.$api
          .post(downloadUrl, formData, { responseType: 'blob' })
          .then((downloadResponse) => {
            console.log('fetchCourseDetails: Received cover blob.');
            const blob = new Blob([downloadResponse.data]);
            const url = window.URL.createObjectURL(blob);
            this.course.imagePath = url; // Update cover with the received blob URL
            console.log('fetchCourseDetails: Updated cover:', url);
          })
          .catch((error) => {
            console.error('fetchCourseDetails: Error fetching cover:', error);
            this.course.imagePath = this.DummyBook; // Fallback to default image on error
          });
      } else {
        console.log('fetchCourseDetails: Course has a static or missing cover.');
      }
    } else {
      throw new Error('Failed to fetch course details');
    }
  } catch (error) {
    this.error = 'Error loading course details. Please try again later.';
    console.error(error);
  } finally {
    this.loading = false;
    console.log('fetchCourseDetails: Finished fetching course details.');
  }

},
toggleDescription(index) {
    if (this.expandedIndexes.includes(index)) {
      this.expandedIndexes = this.expandedIndexes.filter(i => i !== index);
    } else {
      this.expandedIndexes.push(index);
    }
  },
onCategoryClick(categoryId) {
  const courseId = this.course.id; // Get the current course ID
  console.log('onCategoryClick: Navigating to category details:', courseId, categoryId);
  this.$router.push({ name: 'CategoryDetails', params: { courseId, categoryId } });
},

  },
  mounted() {
    this.fetchCourseDetails(); // Fetch course details when the component is mounted
  },
};
</script>
