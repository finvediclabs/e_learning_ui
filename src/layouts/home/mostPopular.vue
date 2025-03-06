<template>
  <div class="most-popular q-py-xl">
    <div class="row w-100 text-center ">
    <span class="text-black header_mostPopular q-pt-xl q-mt-lg" style="width: 100%;">Most <span style=" color: #4e5bf8 ">Popular</span> Courses</span>
    <span class="text-black desc_mostPopular" style="width: 100%;">"Explore our most popular course, designed to boost your skills and <span class="web_view">
      <br></span>accelerate your learning journey!"</span>
  </div>

  <div class="container mt-4 q-mx-lg q-my-xl" >
    <div class="row d-flex justify-content-center align-items-center w-100">
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
      <div class="col-12 q-mt-none text-right q-my-lg View" style="width: 92%;margin-left: auto;margin-right: auto;">
          <span style="color: #4E5BF8;">View More Courses →</span>
        </div>
    </div>
  </div>

  </div>
</template>

<script>
import mostPopularBg from '../../assets/most_popularBG.png';
export default {
  name: 'MostPopular',
  data() {
    return {
      bgImage: mostPopularBg,
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
.most-popular {
  height: 100%;
  width: 100vw;
  padding-top: 0%;
  padding-bottom: 5%;
  background-color: #F6F6F6;
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
  transform: scale(1.05); /* Enlarges by 5% */
  transition: transform 0.3s ease;
}
@media (max-width: 600px) {
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
  margin-top: 0px;
}
.most-popular {
  height: 100%;
  width: 100vw;
  padding-top: 0%;
  padding-bottom: 5%;
  background: #F6F6F6;
  background-size: 100% 100%;
  background-position: cover;
  background-repeat: no-repeat;
}
.outerCard{
  padding-bottom: 0px;
}
.View{
  margin-top: 10px;
}
.web_view{
  display: none;
}
}
</style>
