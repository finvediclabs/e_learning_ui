<template>
  <div class="elearning-page">
    <!-- Featured Courses Section -->
    <div class="featured-section">
      <div class="featured-courses">
        <div
          v-for="(course, index) in filteredFeaturedCourses"
          :key="course.id"
          class="course-item"
        >
          <div class="course-name">{{ course.title }}</div>
          <div class="course-card" @click="navigateToCourse(course.id)">
            <q-btn
              class="course-button"
              :style="{ backgroundImage: `url(${course.imagePath})` }"
              flat
            >
          </q-btn>
            <div class="course-content">
              <div class="course-description">{{ course.abstractt }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'src/css/libraryProgram.css';
import DummyBook from 'src/assets/dummyBook.jpg';
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import { useProfileStore } from "src/stores/profile";
export default {
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const { setUserType, setSessionToken } = session;
    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);
    console.log('user', user.value);


    return {
      token,
      userType,
      setUserType,
      setSessionToken,
      user
    }
  },
  name: 'ElearningCourses',
  data() {
    return {
      DummyBook: DummyBook,
      courses: [],
      featuredCourses: [],
      filteredFeaturedCourses: [],
      searchQuery: '',
    };
  },
  methods: {


    async fetchCourses() {
        console.log('fetchCourses: Start fetching courses.');
        this.loading = true;

        try {
          const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
          let url = `${baseUrl}api/programs`;
          const response = await this.$api.get(url);
          this.loading = false;
          console.log('fetchCourses: Response received.', response);

          if (response.data && response.data.success) {
            console.log('fetchCourses: Parsing course data.');
            this.courses = response.data.data.map((course) => ({
              id: course.programId,
              title: course.heading,
            //   description: course.description,
              abstractt: course.description,
              courseId: course.courseId,
              imagePath: course.imagePath ? course.imagePath : this.DummyBook, // Default cover image if none is provided
            //   progress: (Math.random() * (0.8 - 0.2) + 0.3).toFixed(2)
            }));

            console.log('fetchCourses: Courses parsed successfully.', this.courses);

            this.featuredCourses = this.courses; // Initialize featured courses
            this.filteredFeaturedCourses = this.featuredCourses; // Initially show all featured courses

            this.courses.forEach((course, index) => {
              console.log(`fetchCourses: Processing course [${index}] with ID: ${course.programId}.`);
              const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
              let imgurl = `${baseUrl}fs/download/`;
              if (course.imagePath && course.imagePath.startsWith(imgurl)) {
                console.log(`fetchCourses: Course [${index}] has a downloadable cover: ${course.imagePath}`);
                const downloadUrl = `${baseUrl}fs/download`;
                const removePrefix = `${baseUrl}fs/download/`;
                const filename = course.imagePath.replace(removePrefix, '');
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
                    course.imagePath = url; // Update cover with the received blob URL
                    console.log(`fetchCourses: Updated cover for course [${index}]: ${url}`);
                  })
                  .catch((error) => {
                    console.error(`fetchCourses: Error fetching cover for course [${index}]:`, error);
                    course.imagePath = this.DummyBook; // Fallback to default image on error
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
      async navigateToCourse(courseId) {
  console.log('Navigating to course with ID:', courseId);

  if (!this.user) {
    console.error('User data is not available!');
    return;
  }

  const userPayload = this.user; // Directly use this.user
  const url = `http://localhost:8087/api/recently-viewed/add?programId=${courseId}`;

  try {
    await this.$api.post(url, userPayload);
    console.log('Successfully added to recently viewed:', userPayload);
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }

  this.$router.push({ name: 'ProgramDetails', params: { id: courseId } });
},
  },
  mounted() {
    this.fetchCourses(); // Fetch courses on component mount
  },
};
</script>
