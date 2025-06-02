<template>
  <div>
    <!-- Mobile View -->
    <div class="mobilepart" v-if="isMobile">
      <!-- Your existing mobile content -->
    </div>

   <!-- Desktop View -->
<div class="desk q-mt-xl" v-else>
  <div style="padding: 20px;">
 <p style="
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  color: #1a202c;
  background-color: #f9fafb;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
">
  Available Hackathon Courses
</p>

    <div v-if="filteredFeaturedCourses.length === 0" class="text-center text-grey q-pa-md">
      No matching courses found.
    </div>
    
    <div class="course-cards">
      <div
        v-for="course in filteredFeaturedCourses"
        :key="course.id"
        class="course-card"
      >
        <div
          class="course-image"
          :style="{ backgroundImage: `url(${course.cover})` }"
          @click="openCourse(course.id, course.filePath, course.title)"
        ></div>
      <div class="course-content">
  <h3 class="course-title">{{ course.title }}</h3>
  <p class="course-description">{{ course.description }}</p>
  <p class="course-timestamp">
    <strong>Created:</strong> {{ course.createdAt }}
  </p>
  <p class="course-timestamp">
    <strong>Updated:</strong> {{ course.updatedAt }}
  </p>
  <q-btn
    label="Register"
    color="primary"
    unelevated
    @click="openCourse(course.id, course.filePath, course.title)"
  />
</div>

      </div>
    </div>
  </div>


  
</div>

  </div>
</template>

<script>
import 'src/css/LibraryHackathon.css';
import DummyBook from 'src/assets/dummyBook.jpg';
import { useProfileStore } from "src/stores/profile";

export default {
  data() {
    return {
      courses: [],
      featuredCourses: [],
      filteredFeaturedCourses: [],
      loading: false,
      userId: null,
      studentAssignments: [],
      searchQuery: '',
    };
  },

  methods: {
    fetchUserId() {
      const profileStore = useProfileStore();
      this.userId = profileStore.user.id;
      this.fetchStudentAssignments(this.userId);
    },

    async fetchCourses() {
      this.loading = true;
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const url = `${baseUrl}api/hackathon`;
        const response = await this.$api.get(url);

        if (response.data && response.data.success) {
        this.courses = response.data.data.map(course => ({
  id: course.id,
  title: course.heading,
  description: course.description,
  filePath: course.filePath,
  cover: course.imagePath ? course.imagePath : DummyBook,
  createdAt: new Date(course.createdAt).toLocaleString(),   // 👈 format
  updatedAt: new Date(course.updatedAt).toLocaleString(),   // 👈 format
}));

          this.featuredCourses = this.courses;
          this.filteredFeaturedCourses = this.featuredCourses;

          // Fetch blob URLs for covers if needed
          const imgBaseUrl = `${baseUrl}fs/download/`;
          this.courses.forEach(course => {
            if (course.cover && course.cover.startsWith(imgBaseUrl)) {
              const filename = course.cover.replace(imgBaseUrl, '');
              const formData = new FormData();
              formData.append('filename', filename);
              this.$api.post(`${baseUrl}fs/download`, formData, { responseType: 'blob' })
                .then(res => {
                  const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
                  course.cover = blobUrl;
                })
                .catch(() => {
                  course.cover = DummyBook;
                });
            }
          });

          await this.fetchStudentAssignments(this.userId);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchStudentAssignments(userId) {
      if (!userId) return;
      this.loading = true;
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const url = `${baseUrl}api/student-assignments?studentId=${userId}`;
        const response = await this.$api.get(url);

        if (response.data && response.data.success) {
          // Filter only Hackathon assignments
          this.studentAssignments = response.data.data.filter(a => a.type === 'Hackathon');
        }
      } catch (error) {
        console.error('Error fetching student assignments:', error);
      } finally {
        this.loading = false;
      }
    },

    isCourseDone(courseId) {
      return this.studentAssignments.some(a => a.assignmentId === courseId);
    },

    openCourse(courseId, filePath, title) {
      // Your existing logic for opening course detail or PDF viewer
      console.log('Open course:', courseId, title);
    },
  },

  mounted() {
    this.fetchUserId();
    this.fetchCourses();
  },
};
</script>



<style scoped>
.course-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.course-card {
  width: 280px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.2);
}

.course-image {
  height: 160px;
  background-size: cover;
  background-position: center;
}

.course-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.course-title {
  font-weight: 600;
  margin: 0;
  font-size: 1.2rem;
}

.course-description {
  flex-grow: 1;
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}
.course-timestamp {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
}


@media screen and (max-width: 768px) {
  .styled-course-table {
    font-size: 14px;
  }

  .styled-course-table th,
  .styled-course-table td {
    padding: 6px;
  }
}
</style>
