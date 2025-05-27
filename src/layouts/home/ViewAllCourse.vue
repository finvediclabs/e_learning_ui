<template>
 <q-layout view="lHh Lpr lFf " style="min-height: unset">




  <div class="free-courses1 q-pb-lg q-mb-lg">
    <div class="row w-100 text-left q-mt-md q-mx-lg">
      <span class="text-black header_freeCourses" style="width: 100%;">
        Start learning journey with our <span class="blue_color">Popular COURSES</span>
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
  <div style="height: 340px;">
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
<!-- First two categories with alternating layout -->
<div class="row d-flex w-100 q-mb-xl align-items-center q-mt-md web_view ">
  <div
    v-for="(category, index) in firstTwoCategories"
    :key="category.id"
    class="col-md-12 mb-4"
  >
    <div class="row align-items-center q-mt-lg q-mx-xl">
      <!-- IMAGE -->
      <div
        class="col-2"
        :class="index === 1 ? 'order-2' : 'order-1'"
      >
        <img
          v-if="category.imagePath"
          :src="category.imagePath"
          alt="Category Image"
          style="width: 100%; object-fit: cover;"
          class="course-image5 q-pa-lg"
        />
      </div>

      <!-- TEXT -->
      <div
        class="col course-TextCard"
        :class="[
          index === 1 ? 'order-1 q-mr-xl q-pa-md' : 'order-2 q-ml-xl q-pa-md'
        ]"
      >
        <div class="q-pa-sm column justify-between" style="min-height: 100%;">
          <div>
            <p class="text-h4 text-bold text-black q-mt-xl">
              <span v-html="highlightCategoryName(category.categoryName)"></span>
            </p>
            <p class="text-h5 text-grey q-mt-lg">{{ category.description }}</p>
          </div>
<div class="col-3">
          <q-btn
            label="View Details"
            rounded
           no-caps
            flat
            class="q-mt-md"
            style="background-color: #2528CB;color: #ffffff;"
            @click="goToCourseDetail(category.id)"
          />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>






<!-- Remaining categories in grid layout -->
 <span class="text-black header_freeCourses" style="width: 100%;"><span class="blue_color q-ml-lg q-mt-xl">Specializations</span>
      </span>
 <div class="row d-flex justify-content-center align-items-center w-100 web_view q-mx-xl">
  <div
    v-for="(category, index) in remainingCategories"
    :key="category.id"
    class="col-md-6 mb-4 q-pt-sm snap-card q-mt-lg"
    :style="index % 2 === 0 ? 'padding-right: 15px;' : 'padding-left: 15px;'"
  >
    <router-link
      :to="{ name: 'CourseDetail', params: { id: category.id } }"
      style="text-decoration: none;"
    >
      <q-card class="course-card4 h-100">
        <div class="row no-wrap items-start">
          <!-- IMAGE on the left -->
          <div class="col-4">
            <img
              v-if="category.imagePath"
              :src="category.imagePath"
              alt="Category Image"
              class="course-image4 q-pa-sm"
              style="width: 100%; object-fit: cover;"
            />
          </div>

          <!-- TEXT on the right -->
          <div class="col q-pa-sm q-pt-lg">
            <q-card-section>
              <p class="text-bold text-left text-black text-h5 "><span v-html="highlightCategoryName(category.categoryName)"></span></p>
              <span class="text-grey text-body1  two-line-clamp">
                {{ category.description }}
              </span>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </router-link>
  </div>
</div>





    </div>
  </div>
  </q-layout>
</template>


<script>
import bg_img from "src/assets/scalefradepng1.png";
import new_logo from "src/assets/new_logo1.svg";

import new_logo1 from "src/assets/ScaleGrad_blue.svg";

export default {
  name: 'FreeCourses',
  data() {
    return {
      categories: [],
      expandedIndexes: [],
       bg_img,
      leftDrawerOpen: false,
      new_logo,
      new_logo1
    };
  },
  computed: {
    filteredCategories() {
      // Sort by displayOrder and take the first 3
      return this.categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 10);
    },
    firstTwoCategories() {
    return this.filteredCategories.filter(c => c.id === 1 || c.id === 2);
  },
  remainingCategories() {
    return this.filteredCategories.filter(c => c.id !== 1 && c.id !== 2);
  }
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
  highlightCategoryName(name) {
    const keywords = ['Financial Services', 'Technologies' , 'Electronic Trading', 'Analytics' , 'Management', 'Commercial Banking'];
    let highlighted = name

    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi')
      highlighted = highlighted.replace(regex, '<span style="color: #4e5bf8 !important;">$1</span>')
    })

    return highlighted
  },
  goToCourseDetail(id) {
    this.$router.push({ name: 'CourseDetail', params: { id } })
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
    const getCourse = baseUrl + 'api/chapterCategoriess';
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
  /* background-image: url('src/assets/Labs_tools.png'); */
  background-size: 100% 100%;
  background-position: cover;
  background-repeat: no-repeat;
}
.margin-x {
  margin-left: 20% !important;
  margin-right: 20% !important;
}

.two-line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 5;  /* number of lines to show */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal; /* allow wrapping */
}
.order-1 {
  order: 1;
}
.order-2 {
  order: 2;
}
.custom-col {
  flex: 0 0 12.5%; /* 100% / 8 = 12.5% width */
  max-width: 12.5%;
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
  width: 100%;

  height:100%;
  overflow: hidden;
}
.course-TextCard{
  border: 1px solid #ddd;
    border-radius: 15px;

}
.course-card5 {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 96%;
  margin-left: auto;
  /* gap: 30px; */
  margin-right: auto;
  height:100%;
  /* overflow: hidden; */
}

.course-image4 {
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 3%;
  padding: 0%;
  height: 60% !important;
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

.course-image5 {
  /* width: 90%; */
  margin: 0%;
  padding: 0%;
  /* padding: 0%; */
  height: 100%;

  border-radius: 15px;
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

.course-card5:hover {
  transform: scale(1.05); /* Enlarges by 5% */
  transition: transform 0.3s ease;
}
.course-card4:hover .enroll_btn {
 display: block;
}
.enroll_btn{
  display: none;
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
.web_view{
  display: none;
}
.course-image4 {
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 3%;
  padding: 0%;
  height: 100% !important;
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
