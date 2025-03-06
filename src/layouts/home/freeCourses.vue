<template>
  <div class="free-courses q-pb-lg q-mb-lg">
    <div class="row w-100 text-left q-mt-lg q-mx-lg">
    <span class="text-black header_freeCourses" style="width: 100%;">Begin your learning journey with our <span class="blue_color">FREE COURSES</span></span>
    <span class="text-black desc_mostPopular" style="width: 100%;">"Unlock endless learning opportunities with our free courses,designed to expand your knowledge at no cost!"</span>
  </div>
  <div class="container mt-4 q-mx-lg">
    <div class="row d-flex justify-content-center align-items-center w-100">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="col-md-3 mb-4 q-pt-xl"
        style="margin-left: auto;margin-right: auto;"
      >
      <q-card class="course-card h-100">
  <q-img
    v-if="category.imagePath"
    :src="category.imagePath"
    alt="Category Image"
    class="course-image q-pa-lg"
  />
  <q-card-section>
    <p class="text-bold text-left blue_color">{{ category.categoryName }}</p>
    <span class="text-caption text-grey">{{ category.description }}</span>
  </q-card-section>
</q-card>




      </div>
      <div class="col-12 q-mt-md text-right my-5" style="width: 92%;margin-left: auto;margin-right: auto;">
          <span style="color: #4E5BF8;">View More Courses →</span>
        </div>
    </div>
  </div>

  </div>
</template>

<script>
export default {
  name: 'FreeCourses',
  data() {
    return {
      categories: [],
      expandedIndexes: []
    };
  },
  computed: {
    filteredCategories() {
      // Sort by displayOrder and take the first 3
      return this.categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 4);
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
    const getCourse = baseUrl + 'api/chapterCategoriess/free';
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
.free-courses {
  padding: 20px;
  height: 100%; /* Set height to 80% of viewport */
  overflow-y: auto; /* Adds scroll if content overflows */
}

.free-courses h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.free-courses ul {
  list-style-type: none;
  padding: 0;
}

.free-courses li {
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

.course-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  height:100%;
  overflow: hidden;
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
.blue_color{
  color: #4e5bf8 !important;
  /* font-size: 18px; */
}

.course-card:hover {
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
@media (max-width: 600px){
  .header_freeCourses{
  font-family: sans-serif;
  font-size: 18px;
  font-weight: 700;
}

}
</style>
