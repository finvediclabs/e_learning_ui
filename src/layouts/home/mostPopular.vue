<template>
  <div class="most-popular q-py-xl">
    <!-- Mobile Background Wrapper -->
    <div class="mobile-bg-wrapper" v-if="$q.screen.lt.md">
      <img :src="poplc" class="bg-img left-center" />
      <img :src="poplb" class="bg-img left-bottom" />
      <img :src="poptr" class="bg-img top-right" />
    </div>
    <div class="row w-100 text-center content-layer">
    <span class="text-black header_mostPopular q-mt-lg" style="width: 100%;">Most <span style=" color: #4e5bf8 ">Popular</span> Courses</span>
    <span class="text-black desc_mostPopular" style="width: 100%;">"Explore our most popular course, designed to boost your skills and <span class="web_view">
      <br></span>accelerate your learning journey!"</span>
  </div>

  <div class="container mt-4 q-mx-lg q-my-xl" >
    <!-- Only apply scrolling on mobile -->
<div class="scroll-wrapper q-py-xl q-px-sm" v-if="$q.screen.lt.md" >
  <div class="scroll-container">
    <div
      v-for="category in filteredCategories"
      :key="category.id"
      class="scroll-item"
      style=" padding: 0px 10px;"
    >
      <q-card class="course-card">
  <q-img
    v-if="category.imagePath"
    :src="category.imagePath"
    alt="Category Image"
    class="course-image"
  />
  <q-card-section class="course-info">
    <p class="blue_color">{{ category.categoryName }}</p>
    <span class="text-caption">{{ category.description }}</span>
  </q-card-section>
</q-card>

    </div>
  </div>
</div>

<!-- View more for mobile -->
<div
  class="col-12 text-center q-mt-md View"
  style="width: 100%; margin: 0 auto; font-size: larger;"
  v-if="$q.screen.lt.md"
>
  <span style="color: #4E5BF8;">View More Courses →</span>
</div>

<!-- Only show grid on md and above -->
<div
  class="row d-flex justify-content-center align-items-center w-100"
  v-if="$q.screen.gt.sm"
>
  <div
    v-for="category in filteredCategories"
    :key="category.id"
    class="col-md-3 mb-5 q-py-lg outerCard"
    style="margin-left: auto;margin-right: auto;"
  >
    <q-card class="course-card ">
      <q-img
        v-if="category.imagePath"
        :src="category.imagePath"
        alt="Category Image"
        class="course-image q-pa-lg"
      />
      <q-card-section>
        <p class="text-bold text-left blue_color">{{ category.categoryName }}</p>
        <span class="text-caption">{{ category.description }}</span>
      </q-card-section>
    </q-card>
  </div>
  <div
    class="col-12 q-mt-none text-right q-my-lg View"
    style="width: 92%;margin-left: auto;margin-right: auto;"
  >
    <router-link to="/allCourses" class="viw-mo" style="color: #4E5BF8; cursor: pointer;">
  View More Courses →
</router-link>
  </div>
</div>

  </div>

  </div>
</template>

<script>
import mostPopularBg from '../../assets/most_popularBG.png';
import poplb from '../../assets/poplb.svg';
import poplc from '../../assets/poplc.svg';
import poptr from '../../assets/poptr.svg';
export default {
  name: 'MostPopular',
  data() {
    return {
      bgImage: mostPopularBg,
      poplb: poplb,
      poplc: poplc,
      poptr: poptr,
      categories: [],
    };
  },
  computed: {
    filteredCategories() {
      // Sort by displayOrder and take the first 3
      return this.categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 3);
    },
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const getCourse = baseUrl + 'api/chapterCategoriess';
    const response = await fetch(getCourse);
    const data = await response.json();


    // Process categories and fetch images
    this.categories = await Promise.all(
      data.map(async (category) => {
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
.mobile-bg-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Lower z-index */
}

.content-layer {
  position: relative;
  z-index: 2; /* Higher z-index to sit above background images */
}

.most-popular {
  position: relative;
  height: 100%;
  width: 100vw;
  padding-top: 0%;
  padding-bottom: 5%;
  background-color: #ffff;
  background-image: url('../../assets/most_popularBG.png');
  background-size: 100% 100%;
  background-position: cover;
  background-repeat: no-repeat;
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

.course-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  height:100%;
  overflow: hidden;
}
.blue_color{
  color: #4e5bf8 !important;
  font-size: 18px;
  text-align: center;
}

.course-image {
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 3%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  /* border-radius: 10px; */
  /* margin-bottom: 10px; */
  cursor: pointer;
}
.course-card:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}
@media (max-width: 600px) {
  .most-popular {
  position: relative;
  height: 100%;
  width: 100vw;
  padding-top: 0%;
  padding-bottom: 20%;
  background: #fff !important;
  overflow: hidden;
}

.bg-img {
  position: absolute;
  z-index: 0;
  pointer-events: none;
}

.left-center {
  left: -10%;
  top: 50%;
  transform: translateY(-50%);
  width: 70%;
}

.left-bottom {
  left: 0;
  bottom: 0;
  width: 80px;
}

.top-right {
  top: -0%;
  right: -10%;
  width: 70px;
}

  .header_mostPopular{
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 700;
}
.desc_mostPopular{
  font-size: 16px;
  font-weight: 500;
  font-family: sans-serif;
}
.container{
  margin: 0px;
}
.most-popular {
  height: 100%;
  width: 100vw;
  padding-top: 0%;
  padding-bottom: 20%;
  background: #F6F6F6;
  background-size: 100% 100%;
  background-position: cover;
  background-repeat: no-repeat;
}
.outerCard{
  padding-bottom: 0px;
  margin-top: 20px;

}
.View{
  text-align: center;
    margin-top: 15px;
}
.web_view{
  display: none;
}

  .header_mostPopular {
    font-size: 22px;
  }

  .desc_mostPopular {
    font-size: 14px;
  }

  .course-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.course-info p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.course-info .text-caption {
  font-size: 14px;
  color: #7D7D7D;
}

  .course-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 25px;
  width: 100%;
  height: 100%;
  overflow: visible;
  background-color: #fff !important;
  /* padding: 50px 20px 10px; */
  padding: 50px 0px 0px !important;
  color: #7D7D7D;
}

.course-image {
  width: 80px;
  height: 80px;
  border-radius: 50% !important;
  position: absolute;
  top: -40px;
  left: 45%;
  transform: translate(-50%, 0);
  background-size: cover;
  background-position: center;
  display: block;
  box-shadow: 0px 2px 8px rgba(5, 0, 0, 0.5);
}

.text-caption{
  font-size: 14px;
  color: #7D7D7D;
}

.scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.scroll-container {
  display: flex;
  /* gap: 16px; */
  /* padding: 0 8px; */
}

.scroll-item {
  flex: 0 0 auto;
  width: 320px;
  height: 290px;
}


.scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.View{
  text-align: center;
  font-style: italic;
  font-weight: 400;
  font-size: 1.1rem;
}



}

.course-image {
  width: 80px;
  height: 80px;
  border-radius: 50% !important;
  position: absolute;
  top: -40px;
  left: 45%;
  transform: translate(-50%, 0);
  background-size: cover;
  background-position: center;
  display: block;
  box-shadow: 0px 2px 8px rgba(5, 0, 0, 0.5);
}

.course-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 25px;
  width: 100%;
  height: 100%;
  overflow: visible;
  background-color: #f6f6f6;
  padding-top: 50px ;
  padding: 50px 20px 10px;
  color: #7D7D7D;
}

.text-caption{
  font-size: 14px;
  color: #7D7D7D;
}




</style>
