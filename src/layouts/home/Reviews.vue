<template>
    <div class="reviews q-py-xl">
        <div class="row w-100 text-center head ">
            <span class="text-black text-h4 text-bold hub-insight" style="width: 100%;"><span style=" color: #2528CB ">ScaleGrad</span> Hub Insight</span>
            <span class="text-subtitle1" style="width: 100%;">Explore our student reviews, how our course boosted their skills and <br> helped to accelerate their learning journey!</span>
        </div>
        <!-- Desktop Grid View (only show on desktop) -->
<div v-if="!isMobile" class="row q-col-gutter-md q-mx-xl q-my-md q-px-xl reviewContainer">
  <div v-for="(review, index) in visibleReviews" :key="review.id" class="col-12 col-md-4">
                <q-card class="review-card">
                    <!-- Reviewer Info -->
                    <q-card-section class="flex items-center">
                        <img class="review-img" :src="review.imagePath" alt="Reviewer Image" />
                        <div class="reviewer-details q-ml-md">
                            <p class="review-name text-bold q-mb-none">{{ review.studentName }}</p>
                            <p class="review-role text-grey q-mb-none">{{ review.studentProf }}</p>
                        </div>
                    </q-card-section>

                    <!-- Star Ratings -->
                    <q-card-section class="ratings">
                        <q-icon v-for="n in 5" :key="n" name="star" size="16px" :color="n <= review.rating ? 'yellow' : 'grey'" />
                    </q-card-section>

                    <!-- Review Text -->
                    <q-card-section class="review-text">{{ review.description }}</q-card-section>
                </q-card>
            </div>
        </div>

<!-- Mobile Carousel View -->
<q-carousel
  v-if="isMobile && reviews.length"
  v-model="activeSlide"
  animated
  autoplay
  infinite
  transition-prev="slide-right"
  transition-next="slide-left"
  navigation
  arrows
  control-type="flat"
  control-color="primary"
  control-position="bottom"
  class="q-mt-md q-mx-md q-pa-none q-screen--lt-md carousel-cont custom-carousel"
>


  <q-carousel-slide
    v-for="(review, index) in reviews"
    :key="index"
    :name="index"
    class="q-pa-md inner-carousel-slide d-flex flex-column justify-center align-items-center " 
  >
    <q-card class="review-card">
<!-- Reviewer Info + Ratings side by side -->
<q-card-section class="reviewer-row" >
  <img class="review-img" :src="review.imagePath" alt="Reviewer Image" />
  
  <div class="reviewer-details-wrapper q-ml-md">
    <div class="reviewer-details">
      <p class="review-name text-bold q-mb-none">{{ review.studentName }}</p>
      <p class="review-role text-grey q-mb-none">{{ review.studentProf }}</p>
    </div>
  </div>

  <div class="ratings-mobile q-ml-md">
    <q-icon
      v-for="n in 5"
      :key="n"
      name="star"
      size="16px"
      :color="n <= review.rating ? 'yellow' : 'grey'"
    />
  </div>
</q-card-section>



      <!-- Review Text -->
      <q-card-section class="review-text" >{{ review.description }}</q-card-section>
    </q-card>
  </q-carousel-slide>
</q-carousel>

<!-- View More Button (hide on mobile) -->
<div v-if="!isMobile" class="text-center q-mt-lg">
  <q-btn
    v-if="visibleReviews.length < reviews.length"
    noCaps
    label="View More Reviews"
    class="view-more-btn"
    @click="loadMoreReviews"
    icon-right="arrow_forward"
    style="background-color: #2528cb; color: #ffff;"
  />
  <q-btn
    v-else
    noCaps
    label="View Less Reviews"
    class="view-more-btn"
    @click="resetReviews"
    icon-right="arrow_upward"
    style="background-color: #2528cb; color: #ffff;"
  />
</div>




    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reviews: [],
      visibleReviews: [],
      reviewsPerPage: 3,
      activeSlide: 0,
      isMobile: false,
    };
  },
  async created() {
    this.updateScreenSize();
    window.addEventListener("resize", this.updateScreenSize);
    await this.initReviews(); // Only one entry point to fetch and set
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateScreenSize);
  },
  methods: {
    async initReviews() {
      await this.fetchReviews(); // Fetch reviews
      this.resetReviews();       // Load only the first 3
    },
    updateScreenSize() {
      this.isMobile = window.innerWidth < 768;
    },
    async fetchReviews() {
      this.reviews = [];
      const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
      try {
        const getCourse = baseUrl + "api/programFeedback";
        const response = await axios.get(`${getCourse}`);

        if (response.data.success) {
          this.reviews = await Promise.all(
            response.data.data.map(async (review) => {
              let imageUrl = review.imagePath || null;
              if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
                const downloadUrl = `${baseUrl}fs/download`;
                const filename = imageUrl.replace(`${baseUrl}fs/download/`, "");
                try {
                  const formData = new FormData();
                  formData.append("filename", filename);
                  const downloadResponse = await axios.post(downloadUrl, formData, { responseType: "blob" });
                  const blob = new Blob([downloadResponse.data]);
                  imageUrl = window.URL.createObjectURL(blob);
                } catch (error) {
                  console.error(`Error fetching image for: ${review.studentName}`, error);
                }
              }
              return {
                ...review,
                imagePath: imageUrl,
              };
            })
          );
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    loadMoreReviews() {
      const nextReviews = this.reviews.slice(this.visibleReviews.length, this.visibleReviews.length + this.reviewsPerPage);
      this.visibleReviews = [...this.visibleReviews, ...nextReviews];
    },
    resetReviews() {
      this.visibleReviews = this.reviews.slice(0, this.reviewsPerPage);
    },
  },
};
</script>


<style scoped>
.reviews {
    background: linear-gradient(45deg, #9999995e, #ffffff);
    padding: 60px 20px;
}
.review-card {
    width: 90%;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding: 16px;
    height: 100%;
}
.review-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}
.review-name {
    font-size: 16px;
}
.ratings {
    display: flex;
    justify-content: start;
    margin-top: -10px;
}
.view-more-btn {
    font-size: 14px;
    font-weight: bold;
    padding: 8px 20px;
    background-color: #0062ED !important;
    border-radius: 10px;
}

@media (max-width: 768px) {
    .reviewContainer{
        padding: 10px;
        margin: 10px;
    }
    .q-col-gutter-x-md > *, .q-col-gutter-md > * {
        padding-left: 0px !important;
    }
    .review-card {
        width: 100%;
    }
    /* .head{
        text-align: left;
        margin-left: 10px;
   } */

}

@media (max-width: 768px) {
  .reviewContainer {
    display: none; /* hide desktop grid in mobile */
  }
  .review-card {
    width: 100% !important;
    max-width: none;
    margin: 0 auto;
  }
  .reviews{
    padding: 30px 0px 0px 0px !important;
    background: #ffffff;
  }
   .carousel-cont {
    width: 100%;
    margin: 16px 0px !important;
}
.text-subtitle1{
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
}
.hub-insight{
    font-size: 2rem;
}
.reviewer-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding-bottom: 0;
  padding-top: 0;
}

.ratings-mobile {
  display: flex;
  gap: 2px;
  margin-top: 4px;
}

}

.custom-carousel {
  position: relative;
  padding-bottom: 50px; 
}

.custom-carousel .q-carousel__control {
  bottom: -20px !important;
}

.custom-carousel .q-carousel__arrow {
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.custom-carousel .q-carousel__arrow--left {
  left: -12px;
}

.custom-carousel .q-carousel__arrow--right {
  right: -12px;
}


.custom-carousel {
  position: relative;
  padding-bottom: 50px; /* reserve space for radio buttons */
}

@media (max-width: 768px) {
    
    .review-card {
  width: 90%;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  height: auto; /* let content determine height */
  min-height: 160px; /* reduced minimum height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

  .review-img {
    width: 45px;
    height: 45px;
  }
  .review-name {
    font-size: 15px;
  }
  .review-role {
    font-size: 13px;
  }
  .reviewer-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: nowrap;
  padding-bottom: 0;
  padding-top: 0;
}

.review-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-details-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.review-name {
  font-size: 13px;
}

.review-role {
  font-size: 10px;
  color: grey;
}

.ratings-mobile {
  display: flex;
  gap: 1px;
}

.inner-carousel-slide{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto; 
}
.custom-carousel{
height: auto;
}

}

</style>
