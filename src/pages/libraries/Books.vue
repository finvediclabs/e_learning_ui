<template>
  <fin-portlet style="background-color: transparent" class="BigScreen">
    <div class="row col-12 TopBG">
      <div class="col-5 topHead">
        <fin-portlet-heading class="q-md">
          <div class="heading_class">
            <h4>{{ selectedSlide?.heading }}</h4>
          </div>
        </fin-portlet-heading>
      </div>
      <div class="right_side col-md-7 col-12 " style="margin-top: 0px;">
        <fin-portlet-item v-if="booksData.length">
          <carousel-3d :totalSlides="booksData.length" :count="booksData.length" @beforeSlideChange="getCurrentSlide"
            :controls-visible="true" :width="responsiveWidth" :height="responsiveHeight" :display="displaySlides">
            <slide v-for="(slide, i) in booksData" :key="i" :index="i" style="max-height: 80%">
              <q-img :src="slide.imagePath ?? 'dummy'" class="fin-br-8 fit" :alt="slide.heading">
                <template v-slot:error>
                  <q-img :src="DummyBook" class="full-width" />
                </template>
              </q-img>
            </slide>
          </carousel-3d>
        </fin-portlet-item>
      </div>
    </div>

    <div class="row col-12 bottom_div topHead ">
      <div class="col-4 single_book ">

        <q-avatar style="margin-left: auto;margin-right: auto" square class="book_single">
          <q-img :src="selectedSlide?.imagePath ?? 'dummy'" class="fin-br-8" style="border:1px solid #00000030"
            :alt="selectedSlide?.heading">
            <template v-slot:error>
              <q-img :src="DummyBook" class="fit" />
            </template>
          </q-img>
        </q-avatar>
        <div class="desc_div">
          <p class="single_book_desc">
            {{ selectedSlide?.description }}
          </p>
        </div>
      </div>

      <div class="right_side_chapters col-8">

        <q-carousel swipeable animated v-model="slide" ref="carousel" infinite class="full-height">

          <template v-if="chaptersLoader">

            <q-carousel-slide :name="0" class="rounded-borders text-italic">
              <div class="row full-height">
                <div class="col-6 q-px-sm full-height" v-for="item in 3">
                  <q-skeleton class="full-width full-height" style="background-color: #F5F5F5;" />
                </div>
              </div>
            </q-carousel-slide>
          </template>

          <template v-if="!chaptersLoader">

            <template v-if="chaptersData.length">

              <q-carousel-slide v-for="(slider, i) in allSlides" :name="i" class="items-end q-pa-none chapters_loader">
                <div class="row chapter_right" ref="chaptersRight">
                  <div class="col-1" style="display: flex; justify-content: center; align-items: center;">
                    <q-carousel-control class="q-gutter-xs" style="position: relative;">
                      <q-btn position="top-left" round dense class="shadow-2" text-color="white" icon="chevron_left"
                        @click="$refs.carousel.previous()" style="background-color: #5479F7;" />
                    </q-carousel-control>
                  </div>
                  <div class="col-3 q-px-sm full-height" v-for="chapter in slider"
                    style="margin-left:auto;margin-right: auto;">
                    <q-img class="full-height rounded-borders shadow-2 cursor-pointer"
                      :src="chapter.chapterImagePath ?? 'dummy'" @click="visitChapter(chapter)"
                      style="border-radius:20px">
                      <template v-slot:error>
                        <q-img :src="chapter.chapterImagePath" class="fit" />
                      </template>
                    </q-img>
                  </div>
                  <div class="col-1" style="display: flex; justify-content: center; align-items: center;">
                    <q-carousel-control class="q-gutter-xs" style="position: relative;">
                      <q-btn round dense class="shadow-2" text-color="white" icon="chevron_right"
                        @click="$refs.carousel.next()" style="background-color: #5479F7;" />
                    </q-carousel-control>
                  </div>

                </div>
              </q-carousel-slide>
            </template>

            <template v-if="!chaptersData.length">
              <q-carousel-slide :name="0" class="rounded-borders text-italic">
                <div class="row full-height">
                  <div class="col-3"></div>
                  <div class="col-6 q-px-sm full-height">
                    <div square class="full-width full-height q-pa-md rounded-borders"
                      style="background-color: transparent;text-align: center;">
                      No Chapters Found
                    </div>
                  </div>
                  <div class="col-3"></div>
                </div>
              </q-carousel-slide>
            </template>
          </template>

        </q-carousel>
      </div>

    </div>
  </fin-portlet>

  <fin-portlet class="MobScreen " style="background-color: transparent">
    <div class="TopBG">
      <div class="right_side col-md-7 col-12 " style="margin-top: 0px;">
        <fin-portlet-item v-if="booksData.length">
          <carousel-3d :totalSlides="booksData.length" :count="booksData.length" @beforeSlideChange="getCurrentSlide"
            :controls-visible="true" :width="responsiveWidth" :height="responsiveHeight" :display="displaySlides">
            <slide v-for="(slide, i) in booksData" :key="i" :index="i" style="max-height: 80%">
              <q-img :src="slide.imagePath ?? 'dummy'" class="fin-br-8 fit" :alt="slide.heading">
                <template v-slot:error>
                  <q-img :src="DummyBook" class="full-width" />
                </template>
              </q-img>
            </slide>
          </carousel-3d>
        </fin-portlet-item>
      </div>

      <div class="row col-12 topHead">
        <div class="topHeadContent">
          <fin-portlet-heading class="q-md">
            <div class="heading_class">
              <h4>{{ selectedSlide?.heading }}</h4>
            </div>
          </fin-portlet-heading>
        </div>
      </div>


    </div>

    <q-avatar style="margin-left: auto;margin-right: auto" square class="book_single">
      <q-img :src="selectedSlide?.imagePath ?? 'dummy'" class="fin-br-8" style="border:1px solid #00000030"
        :alt="selectedSlide?.heading">
        <template v-slot:error>
          <q-img :src="DummyBook" class="fit" />
        </template>
      </q-img>
    </q-avatar>

    <div class="desc_div">
      <p class="single_book_desc">
        {{ selectedSlide?.description }}
      </p>
    </div>

    <div class="right_side_chapters col-8">
      <template v-if="chaptersLoader">
        <div class="row full-height">
          <div class="col-4 q-px-sm full-height" v-for="item in 6">
            <q-skeleton class="full-width full-height" style="background-color: #F5F5F5;" />
          </div>
        </div>
      </template>

      <template v-if="!chaptersLoader">
        <template v-if="chaptersData.length">
          <div class="row q-col-gutter-md chapter_grid">
            <div class="col-4 q-px-sm full-height" v-for="chapter in chaptersData">
              <q-img class="full-height shadow-2 cursor-pointer" :src="chapter.chapterImagePath ?? 'dummy'"
                @click="visitChapter(chapter)">
                <template v-slot:error>
                  <q-img :src="chapter.chapterImagePath" class="fit" />
                </template>
              </q-img>
            </div>
          </div>
        </template>

        <template v-if="!chaptersData.length">
          <div class="row full-height">
            <div class="col-3"></div>
            <div class="col-6 q-px-sm full-height">
              <div square class="full-width full-height q-pa-md"
                style="background-color: transparent; text-align: center;">
                No Chapters Found
              </div>
            </div>
            <div class="col-3"></div>
          </div>
        </template>
      </template>
    </div>

  </fin-portlet>

</template>
<script>
// import "src/css/LibraryBooks.css"

import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import { Carousel3d, Slide } from "src/components/carousel-3d";
import axios from 'axios';
import { setToken } from "src/boot/axios";
import { urls } from "./Urls"
import { storeToRefs } from "pinia";
import moment from "moment"
import { useCategoryStore } from "src/stores/Categories";
import DummyBook from "src/assets/dummyBook.jpg"
import samplePDF from "src/assets/sample.pdf"
import CryptoJS from 'crypto-js'
export default {
  setup() {
    const categoryStore = useCategoryStore();
    const { categories, subCategories, selectedCategory, selectedSubCategory } = storeToRefs(categoryStore);
    const { selectCategory, selectSubCategory } = categoryStore;
    return { categories, subCategories, selectedCategory, selectedSubCategory, selectCategory, selectSubCategory }
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
      booksData: [],
      selectedSlide: {},
      loading: false,
      chaptersData: [],
      slide: 0,
      allSlides: [],
      responsiveHeight: '170',
      responsiveWidth: '300',
      chaptersLoader: false,
      displaySlides: 7,
      loading: false
    }
  },
  created() {
    this.updateCarouselDimensions();
    window.addEventListener('resize', this.updateCarouselDimensions);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateCarouselDimensions);
  },
  watch: {
    selectedSlide() {
      setTimeout(() => {
        this.getChaptersData();
      }, 500);
    },
    selectedCategory() {
      if (!this.selectedSubCategory?.id) {
        this.getBooksData();
      }
    },
    selectedSubCategory() {
      if (this.selectedSubCategory?.id) {
        this.getBooksData();
      }
    }
  },
  mounted() {
    if (this.selectedCategory) {
      this.getBooksData();
    }
  },
  methods: {
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => { } }
        ]
      });
    },
    updateCarouselDimensions() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        this.responsiveHeight = '220'; // Height for small screens
        this.responsiveWidth = '120';
        this.displaySlides = 5; // Width for small screens
      } else if (screenWidth >= 600 && screenWidth < 1367) {
        this.responsiveHeight = '300'; // Height for medium screens
        this.responsiveWidth = '170';
        this.displaySlides = 7; // Width for medium screens
      } else if (screenWidth >= 1400 && screenWidth < 1602) {
        this.responsiveHeight = '400'; // Height for medium screens
        this.responsiveWidth = '230';
        this.displaySlides = 7; // Width for medium screens
      } else {
        this.responsiveHeight = '520'; // Height for large screens
        this.responsiveWidth = '280';
        this.displaySlides = 7; // Width for large screens
      }
    },
    getCurrentSlide(index) {
      this.selectedSlide = this.booksData[index];
    },
    async getBooksData() {
      this.loading = true;
      let request = {
        params: {
          categoryId: this.selectedCategory.id
        }
      }
      if (this.selectedSubCategory && this.selectedCategory?.id == this.selectedSubCategory?.categoryCode) {
        request.params.subCategoryId = this.selectedSubCategory.id;
      }

      await this.$api.get(urls.getBooksDataUrl, request).then(response => {
        this.loading = false;
        // console.log('Data from getbooksurl:', response.data);
        if (response.data.success) {
          this.booksData = response.data.data.map((item, index) => ({
            index: index + 1,
            id: item.id,
            accountId: item.accountId,
            description: item.description,
            heading: item.heading,
            imagePath: item.imagePath,
            createdAt: item.createdAt ? moment(item.createdAt).format('YYYY-MM-DD') : null,
            updatedAt: item.updatedAt ? moment(item.updatedAt).format('YYYY-MM-DD') : null,
            createdBy: item.createdBy,
            lastUpdatedBy: item.lastUpdatedBy,
            deletedAt: item.deletedAt ? moment(item.deletedAt).format('YYYY-MM-DD') : null,
          }));

          // console.log('Books Data:', this.booksData);

          // Loop through each book and fetch imagePath for it
          this.booksData.forEach(book => {
            // Fetch imagePath and send it to download URL for each book
            if (book.imagePath) {
              const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
              const getImagesUrl = baseUrl + 'fs/download';
              const removeImagePath = baseUrl + 'fs/download/'
              const imagePathWithoutPrefix = book.imagePath.replace(removeImagePath, '');
              const formData = new FormData();
              formData.append('filename', imagePathWithoutPrefix);

              this.$api.post(getImagesUrl, formData, { responseType: 'blob' })
                .then(downloadResponse => {
                  // Handle download success, e.g., open or save the downloaded file
                  const blob = new Blob([downloadResponse.data]);
                  const url = window.URL.createObjectURL(blob);
                  book.imagePath = url; // Update imagePath with the received image URL
                })
                .then(() => {
                  console.log('Post request successful');
                  // Log successful post request
                })
                .catch(error => {
                  console.error('Error in post request:', error); // Log error in post request
                  this.showMsg(error.response?.data.message || error.message, 'negative');
                });
            }
          });

          this.selectedSlide = this.booksData.length ? this.booksData[0] : {};
        } else {
          this.showMsg(response.data?.message, 'negative');
        }
      }).catch(error => {
        this.loading = false;
        if (error.response && error.response.status === 405) {
          // console.error('Error 405: Method Not Allowed');
          // You can add additional handling for this specific error code
        } else {
          this.showMsg(error.message, 'negative');
        }
      });
    },


    getChaptersData() {
      this.chaptersLoader = true;
      this.chapters = [];
      this.allSlides = [];
      const formData = new FormData();
      formData.append('bookId', this.selectedSlide?.id); // Add bookId to form data
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const getChapters = baseUrl + 'api/bookChapters/getBookChaptersByBookId';
      this.$api.post(getChapters, formData)
        .then(response => {
          this.chaptersLoader = false;
          if (response.data.success) {
            this.chaptersData = response.data.data.map((chapter, index) => {
              return {
                index: index + 1,
                id: chapter.id,
                bookId: chapter.bookId,
                accountId: chapter.accountId,
                description: chapter.description,
                chapterTitle: chapter.chapterTitle,
                chapterImagePath: chapter.chapterImagePath,
                chapterFilePath: chapter.chapterFilePath,
                createdAt: moment(chapter.createdAt).format('YYYY-MM-DD'),
                updatedAt: moment(chapter.updatedAt).format('YYYY-MM-DD'),
                deletedAt: moment(chapter.deletedAt).format('YYYY-MM-DD')
              };
            });

            // Fetch imagePath and send it to download URL
            this.chaptersData.forEach(chapter => {
              if (chapter.chapterImagePath) {
                const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
                const getImagesUrl = baseUrl + 'fs/download';
                const removeImagePath = baseUrl + 'fs/download/'
                const imagePathWithoutPrefix = chapter.chapterImagePath.replace(removeImagePath, '');
                const formData = new FormData();

                formData.append('filename', imagePathWithoutPrefix);

                this.$api.post(getImagesUrl, formData, { responseType: 'blob' })
                  .then(downloadResponse => {
                    const blob = new Blob([downloadResponse.data]);
                    const url = window.URL.createObjectURL(blob);
                    chapter.chapterImagePath = url; // Update imagePath with the received image URL
                  })
                  .catch(error => {
                    // console.error('Error in post request for imagePath:', error);
                    this.showMsg(error.response?.data.message || error.message, 'negative');
                  });
              }
            });

            this.getDummyChapters(this.chaptersData);
            this.slide = 0;
          } else {
            this.showMsg(response.data?.message, 'negative');
          }
        })
        .catch(error => {
          this.chaptersLoader = false;
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
    },

    getDummyChapters(chapter) {
      let index = 0;
      let slide = [];
      for (let j = 0; j < chapter.length; j++) {
        slide.push(chapter[j]);
        this.allSlides[index] = slide;
        if ((j + 1) % 3 == 0) {
          index += 1;
          slide = [];
        }
      }
    },

    visitChapter(chapter) {
      // console.log('Chapter File Path:', chapter.chapterFilePath); // Log the chapter file path

      var ext = chapter.chapterFilePath?.substr(chapter.chapterFilePath.lastIndexOf('.') + 1);
      let url = '/read-pdf';
      if (ext == 'pptx') { url = '/watch-ppt'; }
      else if (ext == 'mp4') { url = '/watch-video'; }
      else if (ext == 'pdf') { url = '/read-pdf'; }
      let item = chapter.chapterFilePath;

      if (item) {
        // console.log(item); // Log the item here

        this.$router.push({
          path: url,
          query: {
            item: CryptoJS.AES.encrypt(item, 'fileData').toString()
          }
        });
      } else {
        console.error('Failed to get chapter file path');
        // You can also show a notification or handle the failure in a different way
      }
    }


  }
};
</script>
<style src="../../css/LibraryBooks.css"></style>
