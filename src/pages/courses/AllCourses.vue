<template>
    <div class="all-courses container q-pa-md">
      <!-- Header with Back Button -->
      <div class="row items-center q-mb-md justify-between">
        <!-- <div class="col-auto">
          <q-btn flat round icon="arrow_back" @click="$router.back()"  class="all" />
        </div> -->
        <div class="col">
          <h4 class="all text-weight-medium q-mt-none q-mb-none">All Courses</h4>
        </div>
      </div>
  
      <!-- Loader -->
      <div v-if="isLoading" class="loading-container text-center q-mt-md">
        <q-spinner color="primary" size="40px" />
      </div>
  
      <!-- Course Cards -->
      <div v-else class="row cor">
        <div
          v-for="(category, index) in categories"
          :key="category.id"
          class="course-col col-lg-3 col-md-4 col-sm-6 col-12 d-flex justify-center"
        >
        <q-card class="course-card cursor-pointer" @click="handleCategoryClick(category, index)">
          <q-img
            v-if="category.imagePath"
            :src="category.imagePath"
            alt="Category Image"
            class="course-image"
          />
            <q-card-section>
              <p class="text-bold text-left">{{ category.categoryName }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
  
          <!-- Popup for Guest Users -->
      <DemoUserPopUp v-if="showDemoPopup" @close="showDemoPopup = false" />
    </div>
  </template>
  
  <script>
  import { useSessionStore } from "src/stores/session";
  import { storeToRefs } from "pinia";
  import DemoUserPopUp from "src/layouts/DemoUserPopUp.vue";
  
  export default {
    name: 'AllCourses',
    components: {
      DemoUserPopUp,
    },
    setup() {
      const session = useSessionStore();
      const { userType } = storeToRefs(session);
      return {
        userType,
      };
    },
    data() {
      return {
        categories: [],
        isLoading: true,
        showDemoPopup: false,
        courseCount: 3,
      };
    },
    created() {
      this.fetchCategories();
    },
    methods: {
      async preloadImage(url) {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(url);
          img.onerror = () => resolve(require('@/assets/dummy_book.png'));
        });
      },
      async fetchCategories() {
        this.isLoading = true;
        try {
          const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
          const getCourse = baseUrl + 'api/chapterCategoriess/all';
          const response = await fetch(getCourse);
          const data = await response.json();
  
          const categoryNameMap = {
            "Specialization": "Equities & Electronic Trading",
            "Introduction to Banking": "Fintech & Financial Services"
          };
  
          this.categories = await Promise.all(
            data.map(async (category) => {
              let imageUrl = category.imagePath || require('@/assets/dummy_book.png');
  
              if (imageUrl.startsWith(`${baseUrl}fs/download/`)) {
                const downloadUrl = `${baseUrl}fs/download`;
                const filename = imageUrl.replace(`${baseUrl}fs/download/`, '');
  
                try {
                  const formData = new FormData();
                  formData.append('filename', filename);
  
                  const downloadResponse = await fetch(downloadUrl, {
                    method: 'POST',
                    body: formData,
                  });
  
                  if (!downloadResponse.ok) {
                    throw new Error(`HTTP error! status: ${downloadResponse.status}`);
                  }
  
                  const blob = await downloadResponse.blob();
                  imageUrl = await this.preloadImage(window.URL.createObjectURL(blob));
                } catch (error) {
                  console.error(`Error loading image for ${category.categoryName}`, error);
                  imageUrl = require('@/assets/dummy_book.png');
                }
              }
  
              return {
                ...category,
                categoryName: categoryNameMap[category.categoryName] || category.categoryName,
                imagePath: imageUrl
              };
            })
          );
  
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          this.isLoading = false;
        }
      },
      handleCategoryClick(category, index) {
        if (this.userType === 'Guest' && index >= this.courseCount) {
          this.showDemoPopup = true;
          return;
        }
        this.$router.push({ path: `/course/${category.id}` });
      },
    },
  };
  </script>
  
  <style scoped>
  .all{
    color: #4e5bf8;
  }
.course-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 100%;
}

.course-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid #eee;
}

.cor {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Adjust spacing as needed */
}

.course-col {
  max-width: 24%;
  flex: 0 0 24%;
}

@media (max-width: 1023px) {
  .course-col {
    max-width: 32%;
    flex: 0 0 32%;
  }
}

@media (max-width: 768px) {
  .course-col {
    max-width: 48%;
    flex: 0 0 48%;
  }
}

@media (max-width: 480px) {
  .course-col {
    max-width: 100%;
    flex: 0 0 100%;
  }
}


  
  </style>
  