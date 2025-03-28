<template>
  <fin-portlet>
    <fin-portlet-header> </fin-portlet-header>
    <div class="row totalView">
      <div class="col-3 topView">
        <fin-portlet-item>
          <div class="row q-lg">
            <q-btn-group
              style="
                width: 100%;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
              "
            >
              <div v-for="category in categories" class="full-width">
                <q-btn
                  unelevated
                  rounded
                  :label="category.categoryName"
                  no-caps
                  v-if="!subCategories[category.id]"
                  class="full-width padding_zero"
                  size="m"
                  :class="{
                    'white-background':
                      !selectedCategory || selectedCategory.id !== category.id,
                    'bg-finvedic text-white':
                      selectedCategory && selectedCategory.id === category.id,
                  }"
                  @click="selectCategory(category)"
                  style="
                    margin-bottom: 10%;
                    padding-top: 5%;
                    padding-bottom: 5%;
                  "
                />

                <q-btn-dropdown
                  unelevated
                  rounded
                  :label="category.categoryName"
                  no-caps
                  v-if="subCategories[category.id]"
                  class="full-width padding_zero"
                  :class="{
                    'white-background':
                      !selectedCategory || selectedCategory.id !== category.id,
                    'bg-finvedic text-white':
                      selectedCategory && selectedCategory.id === category.id,
                  }"
                  size="m"
                  style="padding-top: 5%; padding-bottom: 5%"
                >
                  <q-list>
                    <q-item
                      v-for="subCategory in subCategories[category.id]"
                      clickable
                      v-close-popup
                      @click="selectSubCategory(category, subCategory)"
                      :class="{
                        'bg-finvedic text-white':
                          selectedSubCategory?.id == subCategory.id,
                      }"
                    >
                      <q-item-section>
                        <q-item-label
                          ><b>{{
                            subCategory.subCategoryName
                          }}</b></q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </q-btn-group>
          </div>
        </fin-portlet-item>
      </div>

      <div class="col-9 right_side topView">
        <fin-portlet-item class="q-pb-xl" v-if="presentations.length">
          <carousel-3d
            :totalSlides="presentations.length"
            :count="presentations.length"
            @beforeSlideChange="getCurrentSlide"
            :controls-visible="true"
            :width="responsiveWidth"
            :height="responsiveHeight"
          >
            <slide
              v-for="(slide, i) in presentations"
              :key="i"
              :index="i"
              style="max-height: 80%"
            >
              <q-img
                :src="slide.videoCoverPath ?? 'dummy'"
                class="fit"
                :alt="slide.heading"
              >
                <template v-slot:error>
                  <q-img :src="DummyBook" class="full-height full-width" />
                </template>
              </q-img>
            </slide>
          </carousel-3d>
        </fin-portlet-item>
        <fin-portlet-item class="q-pb-xl" v-if="!presentations.length">
          <carousel-3d
            :totalSlides="5"
            :count="5"
            @beforeSlideChange="getCurrentSlide"
            :controls-visible="true"
            :width="responsiveWidth"
            :height="responsiveHeight"
          >
            <slide
              v-for="i in Array.from({ length: 5 }).map((_, index) => index)"
              :key="i"
              :index="i"
              style="max-height: 80%"
            >
              <q-img :src="DummyBook_1" class="fit" alt="Dummy Book">
                <template v-slot:error>
                  <q-img :src="FallbackBook" class="full-height full-width" />
                </template>
              </q-img>
            </slide>
          </carousel-3d>
        </fin-portlet-item>
      </div>
    </div>

    <div class="row col-12 bottom_div1">
      <template v-if="presentations.length">
        <div class="col-6 single_video">
          <q-img
            :src="selectedSlide.videoCoverPath"
            :ratio="16 / 9"
            class="fin-br-8 shadow-1"
            style="width: 78%; height: 78%"
          />
          <div class="heading">
            <span class="heading_h4" style="margin-bottom: 2%"
              ><span style="color: #5479f7">Module Name: </span>
              {{ selectedSlide?.heading }}
            </span>
            <p style="font-size: 14px; font-weight: 400">
              <span style="color: #5479f7">Description: </span
              >{{ selectedSlide?.description }}
            </p>
          </div>
        </div>
      </template>
      <template v-if="!presentations.length">
        <div class="col-6 single_video">
          <q-img
            :src="DummyBook_1"
            :ratio="16 / 9"
            class="fin-br-8"
            style="
              width: 78%;
              height: 78%;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
            "
          />
          <div class="heading">
            <span class="heading_h4" style="margin-bottom: 2%"
              ><span style="color: #5479f7">Module Name: </span>
              {{ selectedSlide?.heading }}
            </span>
            <p style="font-size: 14px; font-weight: 400">
              <span style="color: #5479f7">Description: </span
              >{{ selectedSlide?.description }}
            </p>
          </div>
        </div>
      </template>
      <div
        class="col-6"
        style="position: sticky; top: 10%; align-self: flex-start"
      >
        <q-carousel
          swipeable
          animated
          v-model="slide"
          ref="carousel"
          infinite
          class="full-height"
          style="padding-top: 20px"
        >
          <template v-if="chaptersLoader || !presentations.length">
            <q-carousel-slide :name="0" class="rounded-borders text-italic">
              <div class="row full-height">
                <div class="col-12 q-px-sm full-height">
                  <div
                    square
                    class="full-width full-height q-pa-md rounded-borders"
                    style="background-color: #f5f5f5"
                  >
                    No Chapters Found
                  </div>
                </div>
              </div>
            </q-carousel-slide>
          </template>

          <template v-if="!chaptersLoader">
            <template v-if="chapters.length">
              <q-carousel-slide
                v-for="(slider, i) in allSlides"
                :name="i"
                class="items-end q-pa-none"
              >
                <div class="row">
                  <div
                    class="col-2"
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <q-carousel-control
                      class="q-gutter-xs"
                      style="position: relative"
                    >
                      <q-btn
                        position="top-left"
                        round
                        dense
                        class="shadow-2"
                        text-color="white"
                        icon="chevron_left"
                        @click="$refs.carousel.previous()"
                        style="background-color: #5479f7"
                      />
                    </q-carousel-control>
                  </div>
                  <div class="col-8">
                    <div class="row chapters_show">
                      <div class="col-6 col-lg-6 mb-4" v-for="item in slider">
                        <div
                          class="fin-br-8"
                          style="
                            height: 100%;
                            padding-bottom: 10px;
                            padding-top: 10px;
                            width: 90%;
                            margin-left: auto;
                            margin-right: auto;
                          "
                        >
                          <q-img
                            class="full-height fin-br-8 shadow-2 cursor-pointer"
                            :src="item.presentationCoverPath ?? 'dummy'"
                            @click="visitChapter(item)"
                          >
                            <template v-slot:error>
                              <q-img
                                :src="DummyBook"
                                class="full-height full-width"
                              />
                            </template>
                          </q-img>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="col-2"
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <q-carousel-control
                      class="q-gutter-xs"
                      style="position: relative"
                    >
                      <q-btn
                        round
                        dense
                        class="shadow-2"
                        text-color="white"
                        icon="chevron_right"
                        @click="$refs.carousel.next()"
                        style="background-color: #5479f7"
                      />
                    </q-carousel-control>
                  </div>
                </div>
              </q-carousel-slide>
            </template>

            <template v-if="!chapters.length">
              <q-carousel-slide :name="0" class="rounded-borders text-italic">
                <div class="row full-height">
                  <div class="col-12 q-px-sm full-height">
                    <div
                      square
                      class="full-width full-height q-pa-md rounded-borders"
                      style="background-color: #f5f5f5"
                    >
                      No Chapters Found
                    </div>
                  </div>
                </div>
              </q-carousel-slide>
            </template>
          </template>
        </q-carousel>
      </div>
    </div>
  </fin-portlet>
</template>
<script>
import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import { setToken } from "src/boot/axios";
import { Carousel3d, Slide } from "src/components/carousel-3d";
import { urls } from "./Urls";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "src/stores/Categories";
import moment from "moment";
import DummyBook from "src/assets/dummyBook.jpg";
import DummyBook_1 from "src/assets/presentation_pre.gif";
import CryptoJS from "crypto-js";
export default {
  setup() {
    const categoryStore = useCategoryStore();
    const { categories, subCategories, selectedCategory, selectedSubCategory } =
      storeToRefs(categoryStore);
    const { selectCategory, selectSubCategory } = categoryStore;
    return {
      categories,
      subCategories,
      selectedCategory,
      selectedSubCategory,
      selectCategory,
      selectSubCategory,
    };
  },
  components: {
    Carousel3d,
    Slide,
    FinPortlet,
    FinPortletHeader,
    FinPortletHeading,
    FinPortletItem,
  },
  data() {
    return {
      DummyBook: DummyBook,
      DummyBook_1: DummyBook_1,
      presentations: [],
      selectedSlide: {},
      loading: false,
      chapters: [],
      slide: 0,
      allSlides: [],
      chaptersLoader: false,
      loading: false,
      responsiveHeight: "40vh",
      responsiveWidth: "80vw",
      slideWidth: window.innerWidth < 470 ? window.innerWidth - 30 : 450,
    };
  },
  created() {
    this.updateCarouselDimensions();
    window.addEventListener("resize", this.updateCarouselDimensions);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateCarouselDimensions);
  },
  watch: {
    selectedSlide() {
      setTimeout(() => {
        this.getChaptersData();
      }, 500);
    },
    
    selectedCategory() {
      if (!this.selectedSubCategory?.id) {
        this.getPresentations();
      }
    },
    selectedSubCategory() {
      if (this.selectedSubCategory?.id) {
        this.getPresentations();
      }
    },
  },
  mounted() {
    if (this.selectedCategory) {
      this.getPresentations();
    }
    
  },
  methods: {
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: "top-right",
        actions: [{ icon: "close", color: "white", handler: () => {} }],
      });
    },
    updateCarouselDimensions() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        this.responsiveHeight = "30vh"; // Height for small screens
        this.responsiveWidth = "90vw"; // Width for small screens
      } else if (screenWidth >= 600 && screenWidth < 1367) {
        this.responsiveHeight = "220vh"; // Height for medium screens
        this.responsiveWidth = "340"; // Width for medium screens
      } else if (screenWidth >= 1400 && screenWidth < 1602) {
        this.responsiveHeight = "300vh"; // Height for medium screens
        this.responsiveWidth = "400"; // Width for medium screens
      } else {
        this.responsiveHeight = "320vh"; // Height for large screens
        this.responsiveWidth = "480"; // Width for large screens
      }
    },
    getCurrentSlide(index) {
      this.selectedSlide = this.presentations[index];
    },
    getPresentations() {
      this.loading = true;
      this.allSlides =[];
      
      let request = {
        params: {
          categoryId: this.selectedCategory.id,
        },
      };
      if (
        this.selectedSubCategory &&
        this.selectedCategory?.id == this.selectedSubCategory?.categoryCode
      ) {
        request.params.subCategoryId = this.selectedSubCategory.id;
      }

      this.$api
        .get(urls.getPresentationsUrl, request)
        .then((response) => {
          this.loading = false;
          this.selectedSlide=[];
          // console.log('Data from getPresentationsUrl:', response.data);
          if (response.data.success) {
            this.presentations = response.data.data.map((item, index) => ({
              ...item,
              index: index + 1,
            }));

            // Loop through each presentation and fetch videoCoverPath for it
            this.presentations.forEach((presentation) => {
              // Fetch videoCoverPath and send it to download URL for each presentation
              if (presentation.videoCoverPath) {
                const baseUrl =
                  (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") +
                  "/";
                const getImagesUrl = baseUrl + "fs/download";
                const removeImagePath = baseUrl + "fs/download/";
                const videoCoverPathWithoutPrefix =
                  presentation.videoCoverPath.replace(removeImagePath, "");
                const formData = new FormData();
                formData.append("filename", videoCoverPathWithoutPrefix);

                this.$api
                  .post(getImagesUrl, formData, { responseType: "blob" })
                  .then((downloadResponse) => {
                    // Handle download success, e.g., open or save the downloaded file
                    const blob = new Blob([downloadResponse.data]);
                    const url = window.URL.createObjectURL(blob);
                    presentation.videoCoverPath = url; // Update videoCoverPath with the received video URL
                  })
                  .then(() => {
                    // console.log('Post request successful'); // Log successful post request
                  })
                  .catch((error) => {
                    // console.error('Error in post request:', error); // Log error in post request
                    // this.showMsg(error.response?.data.message || error.message, 'negative');
                  });
              }
            });

            this.selectedSlide = this.presentations.length
              ? this.presentations[0]
              : {};
              
              
          } else {
            this.showMsg(response.data?.message, "negative");
          }
        })
        .catch((error) => {
          this.loading = false;
          this.showMsg(error.message, "negative");
        });
    },
    getChaptersData() {
      this.chaptersLoader = true;
      this.chapters = [];
      this.allSlides=[];
      const formData = new FormData();
      formData.append("presentationId", this.selectedSlide?.id); // Add presentationId to form data
      // console.log('Selected Slide ID:', this.selectedSlide?.id);
      const baseUrl =
        (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
      const getChaptersUrl =
        baseUrl + "api/presentationChapters/findPresentationChapter";
        this.$api.post(getChaptersUrl, formData)
        .then((response) => {
          this.chaptersLoader = false;
          if (response.data.success) {
            this.chapters = response.data.data.map((chapter, index) => {
              return {
                index: index + 1,
                id: chapter.id,
                presentationId: chapter.presentationId,
                accountId: chapter.accountId,
                description: chapter.description,
                chapterTitle: chapter.chapterTitle,
                presentationCoverPath: chapter.presentationCoverPath,
                presentationFilePath: chapter.presentationFilePath,
                createdAt: moment(chapter.createdAt).format("YYYY-MM-DD"),
                updatedAt: moment(chapter.updatedAt).format("YYYY-MM-DD"),
                deletedAt: moment(chapter.deletedAt).format("YYYY-MM-DD"),
              };
            });
 // Log the number of chapters for the presentation
        // console.log(`Number of chapters in Presentation ID ${this.selectedSlide?.id}:`, this.chapters.length);
            // Fetch presentationCoverPath and send it to download URL
            this.chapters.forEach((chapter) => {
              if (chapter.presentationCoverPath) {
                const baseUrl =
                  (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") +
                  "/";
                const getImagesUrl = baseUrl + "fs/download";
                const removeImagePath = baseUrl + "fs/download/";
                const imagePathWithoutPrefix =
                  chapter.presentationCoverPath.replace(removeImagePath, "");
                const formData = new FormData();
                formData.append("filename", imagePathWithoutPrefix);

                this.$api.post
                  (getImagesUrl, formData, { responseType: "blob" })
                  .then((downloadResponse) => {
                    const blob = new Blob([downloadResponse.data]);
                    const url = window.URL.createObjectURL(blob);
                    chapter.presentationCoverPath = url; // Update presentationCoverPath with the received image URL
                  })
                  .catch((error) => {
                    // console.error('Error in post request for presentationCoverPath:', error);
                    this.showMsg(
                      error.response?.data.message || error.message,
                      "negative"
                    );
                  });
              }
            });

            this.getDummyChapters(this.chapters);
            // console.log("All Slides:", this.allSlides);
            this.slide = 0;
      

          } else {
            // this.showMsg(response.data?.message, 'negative');
          }
        })
        .catch((error) => {
          this.chaptersLoader = false;
          // this.showMsg(error.response?.data.message || error.message, 'negative');
        });
    },
    getDummyChapters(chapter) {
      let index = 0;
      let slide = [];

      for (let j = 0; j < chapter.length; j++) {
        slide.push(chapter[j]);
        this.allSlides[index] = slide;
        if ((j + 1) % 4 == 0) {
          index += 1;
          slide = [];
        }
      }
    },
    visitChapter(chapter) {
      var ext = chapter.presentationFilePath?.substr(
        chapter.presentationFilePath.lastIndexOf(".") + 1
      );
      let url = "/watch-ppt";
      if (ext == "pptx") {
        url = "/watch-ppt";
      } else if (ext == "mp4") {
        url = "/watch-video";
      } else if (ext == "pdf") {
        url = "/read-pdf";
      }
      let item = chapter.description;
      this.$router.push({
        path: url,
        query: {
          item: CryptoJS.AES.encrypt(item, "fileData").toString(),
        },
      });
    },
  },
};
</script>
<style>
.radio-button-group {
  display: flex;
}
.radio-button-group .item {
  width: 100%;
}
.radio-button-group .radio-button {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.radio-button-group .radio-button + label {
  padding: 16px 10px;
  cursor: pointer;

  margin-right: -2px;
  color: #555;
  background-color: #ffffff;
  display: block;
  text-align: center;
}
.radio-button-group .item:first-of-type .radio-button + label {
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  margin-right: 2%;
}
.radio-button-group .item:last-of-type .radio-button + label {
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  margin-left: 2%;
}
.radio-button-group .radio-button:checked + label {
  background-color: #5479f7;
  color: #fff;
  border-radius: 25px;
}
.row.q-lg {
  display: flex;
  justify-content: center; /* Aligns horizontally in the center */
}
.q-btn-group {
  display: flex;
  flex-direction: column;
  box-shadow: none !important; /* Displays buttons vertically */
}
.white-background {
  background-color: #fff;
  color: #5479f7 !important;
}
.right_side {
  margin-top: 0px !important;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.bottom_div1 {
  position: relative;
  background-color: #ffff !important;
  /* margin-top: 4vh; */
  margin-top: 2vh;
  display: flex;
  align-items: end;
  justify-content: center;
  /* border: 2px solid grey; */
}
.single_video {
  margin-top: -14vh;
  /* border:2px solid red; */
  /* position: absolute; */
  top: -12vh;
}
.heading {
  margin-top: 3%;
  width: 80%;
}
.heading_h4 {
  /* font-family: 'Manrope'; */
  font-size: 16px;
  width: 100%;
  padding-top: 2%;
  margin-top: 0px;
  margin-left: 0px;
  padding-left: 0px;
  line-height: 26px;
}
.padding_zero {
  padding: 5% 0px;
}
.totalView {
  height: 50vh;
}
@media screen and (min-width: 1920px) {
  /* Your CSS styles for this screen width range */
  .totalView {
    height: 54vh;
  }
  .topView {
    padding-top: 4%;
  }
}
@media screen and (min-width: 1400px) and (max-width: 1602px) {
  .totalView {
    height: 52vh;
  }
  .topView {
    padding-top: 4%;
  }
}
</style>

