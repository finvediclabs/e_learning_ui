<template>
    <div class="top-image">   </div>
    <div class="elearning-page">
  
      <!-- Featured Courses Section -->
      <div class="featured-section">
        <div class="heading_class">
          <h4>Featured Courses</h4>
        </div>
  
        <!-- Courses Section -->
        <div class="featured-courses">
          <div
            v-for="(course, index) in filteredFeaturedCourses"
            :key="course.id"
            class="course-item"
          >
            <div class="course-card">
              <q-btn
                class="course-button"
                :style="{ backgroundImage: `url(${course.cover})` }"
                flat
                @click="openCourse(course.courseId)"
              >
                <div
                  class="play-overlay"
                  v-if="index < 2"
                  style="z-index: 999; background-color: azure; opacity: 0.8; padding: 2% 5%; border-radius: 8px;"
                >
                  <span style="text-transform: none;">Start</span>
                </div>
                <div
                  class="play-overlay"
                  v-if="index >= courses.length - 4"
                  style="z-index: 999; background-color: azure; opacity: 0.8; padding: 2% 5%; border-radius: 8px;"
                >
                  <span style="text-transform: none;">Continue</span>
                </div>
              </q-btn>
              <div
                class="row col-12"
                v-if="index >= courses.length - 4"
                style="align-items: center; justify-content: center; display: flex; width: 100%;"
              >
                <div class="col-10">
                  <q-linear-progress
                    class="course-progress"
                    :value="course.progress"
                    color="primary"
                    track-color="lightgrey"
                    size="sm"
                  />
                </div>
                <div class="col-2">
                  {{ (course.progress * 100).toFixed(0) }}%
                </div>
              </div>
              <div class="course-content">
                <div class="course-name">{{ course.title }}</div>
                <div class="course-description">{{ course.abstractt }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filteredFeaturedCourses.length === 0" class="no-results">
          No courses found for your search.
        </div>

  
        
         <!-- Search Bar -->
        <div class="search-container1">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search featured courses..."
            class="search-input"
          />
        </div>
        
      </div>
    </div>
  </template>
  
  


  <script>
  import 'src/css/LibraryElearning.css';
  import DummyBook from 'src/assets/dummyBook.jpg'; 
  
  export default {
    name: 'ElearningCourses',
    data() {
      return {
        DummyBook: DummyBook,
        courses: [],
        featuredCourses: [],
        filteredFeaturedCourses: [], 
        searchQuery: '' 
      };
    },
    methods: {
      async fetchCourses() {
        console.log('fetchCourses: Start fetching courses.');
        this.loading = true;
  
        try {
          const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
          let url = `${baseUrl}api/elearning/type/E-Learning`;
          const response = await this.$api.get(url);
          this.loading = false;
          console.log('fetchCourses: Response received.', response);
  
          if (response.data && response.data.success) {
            console.log('fetchCourses: Parsing course data.');
            this.courses = response.data.data.map((course) => ({
              id: course.id,
              title: course.courseDesc,
              description: course.description,
              abstractt: course.abstractt,
              courseId: course.courseId,
              cover: course.cover ? course.cover : this.DummyBook, // Default cover image if none is provided
              progress: (Math.random() * (0.8 - 0.2) + 0.3).toFixed(2)
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
      openCourse(courseId) {
        console.log('Opening course with courseId:', courseId);
        const url = `https://gurukul.finvedic.com/${courseId}/`;
        console.log('Opening URL:', url);
        window.open(url, '_blank');
      },
      filterFeaturedCourses() {
        this.filteredFeaturedCourses = this.featuredCourses.filter((course) =>
          course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    watch: {
      searchQuery: 'filterFeaturedCourses' // Watch searchQuery for changes
    },
    mounted() {
      this.fetchCourses(); // Fetch courses on component mount
    }
  };
  </script>
 
