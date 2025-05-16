<template>
 <q-layout view="lHh Lpr lFf " style="min-height: unset">

 <q-toolbar>
        <!-- Left Side: Logo, q-select, q-search -->
        <q-toolbar-title class="row items-center q-py-sm q-mt-lg">
          <!-- Menu for small screens -->
          <q-btn
            flat
            dense
            round
            icon="menu"
            class="lt-md"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <!-- Placeholder for logo -->
          <div class="q-ml-md logo">
            <!-- Logo will be added here later -->
            <q-item class="logo_in" to="/">
              <q-img :src="new_logo" style="width: 220px;"></q-img>
        </q-item>
          </div>



<q-input
  v-if="!$q.screen.lt.md"
  dense
  outlined
  placeholder="Explore, Fuel Your Curiosity..."
  class="q-ml-md search-box"
  bg-color="transparent"
  color="#4E5BF8"
  rounded
  style="width: 300px;"
>
  <template v-slot:append>
    <q-icon name="search" />
  </template>
</q-input>

        </q-toolbar-title>

        <!-- Right Side: Navigation Links (Hidden on Mobile) -->
        <div class="row items-center q-gutter-md gt-sm q-mt-sm">
          <q-select
  v-if="!$q.screen.lt.sm"
  v-model="selectedExplore"
  :options="exploreOptions"
  clearable
  label="Courses"
  dense
  outlined
  emit-value
  color="#4E5BF8"
  map-options
  class="q-ml-md explore"
  style="min-width: 140px;"
/>
          <!-- <q-btn noCaps flat label="Courses" class="nav-link" /> -->
          <q-btn noCaps flat label="Certifications" class="nav-link" />
          <q-btn noCaps flat label="Login" class="nav-link" :to="'/login'" style="color: #4E5BF8" />
          <q-btn noCaps label="Join for Free" unelevated class="join-btn" style="background-color: #4E5BF8; color: white;" />

        </div>
      </q-toolbar>

      <q-drawer v-model="leftDrawerOpen" side="left" overlay class="bg-white">
  <!-- Close Button -->
  <div class="row justify-end q-pa-md">
    <q-btn flat dense round icon="close" @click="leftDrawerOpen = false" />
  </div>

  <q-list>
    <q-item clickable v-ripple>
      <q-item-section>Courses</q-item-section>
    </q-item>
    <q-item clickable v-ripple>
      <q-item-section>Career</q-item-section>
    </q-item>
    <q-item clickable v-ripple :to="'/login'">
      <q-item-section>Login</q-item-section>
    </q-item>
    <q-item clickable v-ripple>
      <q-item-section>
        <q-btn noCaps label="Join for Free" unelevated class="full-width" style="background-color: #4E5BF8; color: white;" />
      </q-item-section>
    </q-item>

  </q-list>
</q-drawer>



  <div class="free-courses1 q-pb-lg q-mb-lg">
    <div class="row w-100 text-left q-mt-md q-mx-lg">
      <span class="text-black header_freeCourses" style="width: 100%;">
        Start learning journey with our <span class="blue_color">Exclusive COURSES</span>
      </span>
      <span class="text-black desc_mostPopular" style="width: 100%;">
        "Unlock endless learning opportunities with our courses, designed to expand your knowledge"
      </span>
    </div>

    <div class="container freeCourseCont mt-4 q-mx-lg ">
<!-- Mobile view with scroll snapping -->
<div
  v-if="$q.screen.lt.md"
  class="scroll-wrapper row no-wrap items-start"
  ref="scrollContainer"
  v-touch-pan.prevent.mouse="onPan"
>
  <div
    v-for="category in filteredCategories"
    :key="category.id"
    class="snap-card q-pt-xl"
  >
    <q-card class="course-card4 h-100">
       <div style="height: 320px;">
      <q-img
        v-if="category.imagePath"
        :src="category.imagePath"
        alt="Category Image"
        class="course-image4 q-pa-lg"
      />
      <q-card-section>
        <p class="text-bold text-left blue_color">{{ category.categoryName }}</p>
        <span class="text-caption text-grey">{{ category.description }}</span>
      </q-card-section>
      </div>
    </q-card>
  </div>
</div>


      <!-- Desktop view: grid -->
      <div
        v-else
        class="row d-flex justify-content-center align-items-center w-100"
      >
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="col-md-3 mb-4 q-pt-xl"
          style="margin-left: auto;margin-right: auto;"
        >
          <q-card class="course-card4 h-100">
            <div style="height: 340px;">
            <q-img
              v-if="category.imagePath"
              :src="category.imagePath"
              alt="Category Image"
              class="course-image4 q-pa-lg"
            />
            </div>
            <q-card-section>
              <p class="text-bold text-left blue_color">{{ category.categoryName }}</p>
              <span class="text-caption text-grey">{{ category.description }}</span>
            </q-card-section>
          </q-card>
        </div>
      </div>


    </div>
  </div>
  </q-layout>
</template>


<script>
import bg_img from "src/assets/scalefradepng1.png";
import new_logo from "src/assets/new_logo1.svg";
export default {
  name: 'FreeCourses',
  data() {
    return {
      categories: [],
      expandedIndexes: [],
       bg_img,
      leftDrawerOpen: false,
      new_logo,
    };
  },
  computed: {
    filteredCategories() {
      // Sort by displayOrder and take the first 3
      return this.categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 8);
    },
  },
  mounted() {
    this.fetchCategories();


  },
  methods: {
/**
     * Returns the truncated description if not expanded
     */
     getTruncatedDescription(categoryId, description) {
      if (this.expandedIndexes.includes(categoryId)) {
        return description; // Show full text when expanded
      }
      return description.length > 100 ? description.slice(0, 100) + "..." : description;
    },

    /**
     * Toggles the description expansion for a specific category
     */
    toggleDescription(categoryId) {
      if (this.expandedIndexes.includes(categoryId)) {
        this.expandedIndexes = this.expandedIndexes.filter(id => id !== categoryId);
      } else {
        this.expandedIndexes.push(categoryId);
      }
    },
    async fetchCategories() {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const getCourse = baseUrl + 'api/chapterCategoriess/all';
    const response = await fetch(getCourse);
    const data = await response.json();


    // Process categories and fetch images
   this.categories = await Promise.all(
  data.map(async (category) => {
    // Rename "specialization" to "Equities & Electronic Trading"
    if (category.categoryName === 'Specialization') {
      category.categoryName = 'Equities & Electronic Trading';
    }

    let imageUrl = category.imagePath || null;

    if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
      console.log(`Fetching cover image for: ${category.categoryName}`);
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
        imageUrl = window.URL.createObjectURL(blob);

        console.log(`Fetched cover image for: ${category.categoryName}`);
      } catch (error) {
        console.error(`Error fetching cover image for: ${category.categoryName}`, error);
        imageUrl = require('@/assets/dummy_book.png'); // Fallback image
      }
    }

    return { ...category, imagePath: imageUrl };
  })
);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
},
  },
};
</script>

<style scoped>
.free-courses1 {
  padding: 20px;
  height: 100%; /* Set height to 80% of viewport */
  overflow-y: auto; /* Adds scroll if content overflows */
   background-color: #FFFF;
  background-image: url('src/assets/Labs_tools.png');
  background-size: 100% 100%;
  background-position: cover;
  background-repeat: no-repeat;
}

.free-courses1 h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.free-courses1 ul {
  list-style-type: none;
  padding: 0;
}

.free-courses1 li {
  background: #f9f9f9;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid #ddd;
}
.header_freeCourses{
  font-family: sans-serif;
  font-size: 2rem;
  font-weight: 700;
}
.desc_mostPopular{
  font-size: 1rem;
  font-weight: 500;
  font-family: sans-serif;
}

.course-card4 {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  height:100%;
  overflow: hidden;
}

.course-image4 {
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
.blue_color{
  color: #4e5bf8 !important;
  /* font-size: 18px; */
}

.course-card4:hover {
  transform: scale(1.05); /* Enlarges by 5% */
  transition: transform 0.3s ease;
}

.category-description {
  overflow: hidden;
  font-size: 12px;
  color: #B1B1B1;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Show only 2 lines initially */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  transition: max-height 0.3s ease-in-out;
}

.category-description.expanded {
  -webkit-line-clamp: unset; /* Remove line limit when expanded */
  white-space: normal;
}

.read-more-link {
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-left: 5px;
}
.logo_in {
  min-height: 0px !important;
  cursor: pointer;
}
.bg-Customblue {
  background-color: #4E5BF8;
}
@media (max-width: 600px){
  .header_freeCourses{
  font-family: sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.freeCourseCont{
  margin: 0px;
}

.free-courses1{
  padding: 0px;
}

.scroll-wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-wrapper {
  overflow-x: auto ;
  /* overflow-y: hidden; */
  -webkit-overflow-scrolling: touch;
  /* scroll-snap-type: x mandatory; */
  /* scroll-behavior: smooth; */
  padding: 0 1rem 1rem 2rem;
  /* gap: 1rem; */
  /* -ms-overflow-style: none; */
  /* scrollbar-width: none; */
}
.snap-card {
  scroll-snap-align: start;
  flex: 0 0 auto;
  width: 85vw;
  max-width: 280px;
  height: 100%;
  margin-right: 1rem;
  padding-top: 25px;
}
.course-card4 {
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.viw{
  text-align: center;
  font-style: italic;
  font-weight: 400;
  font-size: 1.1rem;
}
.free-courses1{
  background-image: none !important;
}


}
</style>
