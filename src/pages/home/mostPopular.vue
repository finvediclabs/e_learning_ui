<template>
  <div class="most-popular" style="width: 100%;">
    <!-- Desktop View (medium and up) -->
<!-- Desktop Heading (only visible on larger screens) -->
<div class="desktop-header">
  <span class="text-black" style="font-size: x-large; color: #141414; font-weight: 600;">Courses Offered</span>
</div>

<!-- Mobile Heading + View More (only visible on mobile) -->
<div class="mobile-header">
  <span class="mobile-title" style="font-size: x-large">Courses Offered</span>
  <span class="mobile-view-more" @click="viewAll">View More</span>
</div>


 <!-- Loading State -->
 <div v-if="isLoading" class="loading-container">
  <q-spinner-hourglass size="40px" color="primary" />
  <p class="loading-text">Loading Courses Offered...</p>
</div>

  <!-- <div v-if="isLoading" class="loading-container">
      <q-spinner color="primary" size="40px" />
      <p class="loading-text">Loading Courses Offered...</p>
    </div> -->

  <div v-else class="container mt-4" style="width: 100%;padding-left: 1%;padding-right: 1%;" >
    <div class="row d-flex justify-content-center align-items-center w-100" style="width: 100%;">
     <!-- Desktop & Tablet View -->
<div
  v-for="(category, index) in filteredCategories"
  :key="category.id"
  class="col-lg-3 col-md-3 col-sm-6 col-12 mb-4 d-flex justify-content-center q-pt-sm d-none d-sm-flex web_view"
  style="margin-left: auto; margin-right: auto;gap: 16px;"
>
  <q-card class="course-card1 cursor-pointer" @click="handleCategoryClick(category, index)">
    <div style="height: 280px;">
      <img
        v-if="category.imagePath"
        :src="category.imagePath"
        alt="Category Image"
        class="course-image q-pa-lg"
        fit="contain"
      />
    </div>
    <q-card-section style="padding-bottom: 0%;">
      <p class="text-bold text-left">{{ category.categoryName }}</p>
    </q-card-section>
  </q-card>
</div>

<!-- Mobile View as Carousel -->
<swiper
  class="d-block d-sm-none mobile_view "
  :slides-per-view="1.1"
  :space-between="12"
  :loop="true"
  :centered-slides="true"
>
  <swiper-slide
    v-for="(category, index) in filteredCategories"
    :key="'mobile-' + category.id"
    class="d-flex justify-content-center q-mb-md q-pb-md"
  >
    <q-card class="course-card1 cursor-pointer" @click="handleCategoryClick(category, index)">
      <div style="height: 240px;">
        <img
          v-if="category.imagePath"
          :src="category.imagePath"
          alt="Category Image"
          class="course-image q-pa-lg"
          fit="contain"
        />
      </div>
      <q-card-section style="padding-bottom: 0%;">
        <p class="text-bold text-left">{{ category.categoryName }}</p>
      </q-card-section>
    </q-card>
  </swiper-slide>
</swiper>
      <!-- Desktop View (hidden on xs) -->
      <div class="desktop-view-more">
  <span @click="viewAll">View More Courses →</span>
</div>

    </div>
  </div>

  </div>
  <DemoUserPopUp v-if="showDemoPopup" @close="showDemoPopup = false" />
</template>

<script>
import mostPopularBg from '../../assets/most_popularBG.png';
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { useProfileStore } from "src/stores/profile";
import DemoUserPopUp from "src/layouts/DemoUserPopUp.vue";
export default {
  name: 'MostPopular',
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    // console.log('Session Store:', session);
    return {
      token,
      userType,
      roles: [], // Initialize roles array to store fetched roles
      courseCount: 3, // Number of courses to show before demo popup
    };
  },
  data() {
    return {
      bgImage: mostPopularBg,
      categories: [],
      isLoading: true,
      showDemoPopup: false,
    };
  },
  components: {
    DemoUserPopUp,
     Swiper,
    SwiperSlide,
  },
  computed: {
    filteredCategories() {
      // Sort by displayOrder and take the first 3
      return this.categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 4);
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    viewAll() {
    this.$router.push("/course");
    console.log("View All Clicked from MostPopular");
  },
    async preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => resolve(require('@/assets/dummy_book.png')); // Fallback image
  });
},
handleCategoryClick(category, index) {
  console.log('UserType:', this.userType);
  console.log('Index:', index);
  console.log('courseCount:', this.courseCount);

  if (this.userType === 'Guest' && index >= this.courseCount) {
    this.showDemoPopup = true;
    return;
  }

  this.$router.push({ path: `/course/${category.id}` });
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
            console.error(`Error fetching cover image for: ${category.categoryName}`, error);
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
  },
};
</script>

<style scoped>
.most-popular {
  /* padding-top: 10%; */
  /* padding-bottom: 10%; */
  background-color: #Ffff;
}
.header_mostPopular{
  font-family: sans-serif;
  font-size: 3rem;
  font-weight: 700;
}
.desc_mostPopular{
  font-size: 1.5rem;
  font-weight: 500;
  font-family: sans-serif;
}

.course-card1 {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 98%;
  height:100%;
  max-height: 340px;
  overflow: hidden;
}

.course-image {
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 3%;
  padding: 0%;
  height: 100%;
  border-radius: 5px;
  object-fit: fill; /* ensures full image is visible */
  object-position: center;
  /* aspect-ratio: 16 / 9; */
  /* background-size: cover;
  background-position: center; */
  /* border-radius: 10px; */
  /* margin-bottom: 10px; */
  cursor: pointer;
}
.course-card1:hover {
  transform: scale(1.05); /* Enlarges by 5% */
  transition: transform 0.3s ease;
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px; /* or 100vh if you want full screen */
  text-align: center;
  gap: 16px;
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

.mobie{
    display: none;
  }

/* ================== Mobile View ================================ */
/* Default styles for desktop */
.most-popular .row.d-flex {
  flex-wrap: wrap;
}

/* Mobile view as a horizontal scrollable carousel */
@media (max-width: 768px) {

  .mobie{
    display: visible !important;
  }
  .most-popular .container .row.d-flex {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-bottom: 1rem;
  }
  .course-card1{
    border: 2px solid #f6f6f6;
  }

  .most-popular .container .row.d-flex::-webkit-scrollbar {
    display: none;
  }

  .most-popular .container .col-lg-3 {
    flex: 0 0 auto;
    width: 80%;
    scroll-snap-align: start;
    margin-right: 1rem;
  }

  .most-popular .col-12.q-mt-none.text-right {
    text-align: center;
    margin-top: 1rem;
  }
}


/* Default: Desktop View */
.mobile-header {
  display: none;
}

.desktop-view-more {
  display: block;
  text-align: right;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 0.5rem;
}

.mobile_view{
  display: none;
}

.desktop-view-more span {
  color: #4E5BF8;
  cursor: pointer;
}

/* Mobile View Only */
@media screen and (max-width: 600px) {

  .mobile-title {
    font-size: large;
    font-weight: 600;
    color: #141414;
  }

  .web_view{
    display: none;
  }
  .mobile_view{
  display: block !important;

}


  .mobile-view-more {
    font-size: small;
    color: #fff !important;
    cursor: pointer;
    background-color: #4E5BF8;
    padding: 4px 10px;
    border-radius: 9px;
  }

  .desktop-view-more {
    display: none;
  }
}


/* Default (Desktop) */
.desktop-header {
  display: block;
  width: 100%;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.mobile-header {
  display: none;
}

/* Mobile Only */
@media screen and (max-width: 600px) {
  .desktop-header {
    display: none;
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* padding: 0.75rem 1rem; */
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  .mobile-title {
    font-size: medium !important;
    font-weight: 600;
    color: #141414;
  }

  .mobile-view-more {
    font-size: small;
    color: #4E5BF8;
    cursor: pointer;
  }
}





</style>
