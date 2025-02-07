
<template >
    <fin-portlet style="width: 94%;padding-left: 0%;padding-top: 0%;height: 100%;" class="BigScreen Book_bg">
      <span style="font-size: large;background-color: #5479F7;color: #ffff;padding:1% 2%;border-top-left-radius:10px ;margin-top: 8px;">Books</span>
      <div class="row col-12" style="width: 100%;">
        <div class="col-12">
          <div>
            <div style="width: 100%;margin-top: 2%;padding-left: 1%;" >
                  <p style="color: #5479F7;font-size: large;padding-bottom: 0%;margin-bottom: 0%;"><strong>{{ selectedSlide?.heading }}</strong></p>
                  <p>
                  {{ selectedSlide?.description }}
                </p>
                  
            </div>
          </div>
        </div>
        <div class="row" style="width: 100%;align-items: center;display: flex;justify-content: center;margin-top: 3%;">
        <div class="row carousel_book col-4" >
        <div class="right_side col-12 " style="margin-top: 0px;">
          <fin-portlet-item  v-if="booksData.length">
               <carousel-3d :totalSlides="booksData.length" :count="booksData.length" @beforeSlideChange="getCurrentSlide"
                    :controls-visible="true" width="170px" height="280px" :display=3 >
                  <slide v-for="(slide, i) in booksData" :key="i" :index="i" style="max-height: 80%" >
                    <q-img :src="slide.imagePath ?? 'dummy'" class="fin-br-8 fit" :alt="slide.heading"  >
                      <template v-slot:error>
                          <q-img :src="DummyBook" class="full-width" />
                      </template>
                    </q-img>
                  </slide>
               </carousel-3d>
          </fin-portlet-item>
        </div>
      </div>
      <div class="row col-8" >
        <q-carousel swipeable animated v-model="slide" ref="carousel" infinite class="full-height" style="width: 100%;">
                  
                  <template v-if="chaptersLoader">
                    
                    <q-carousel-slide :name="0" class="rounded-borders text-italic">
                      <div class="row full-height" >
                        <div class="col-6 q-px-sm full-height" v-for="item in 3">
                          <q-skeleton class="full-width full-height" style="background-color: #F5F5F5;" />
                        </div>
                      </div>
                    </q-carousel-slide>
                  </template>
  
                  <template v-if="!chaptersLoader" >
                    
                    <template v-if="chaptersData.length"  >
                      
                      <q-carousel-slide v-for="(slider, i) in allSlides" :name="i" class="items-end q-pa-none chapters_loader">
                        <div  class="row chapter_right1" ref="chaptersRight">
                          <div class="col-1" style="display: flex; justify-content: center; align-items: center;" >
                            <q-carousel-control class="q-gutter-xs"   style="position: relative;">
                      <q-btn position="top-left"  round dense class="shadow-2" text-color="white" icon="chevron_left"
                        @click="$refs.carousel.previous()" style="background-color: #5479F7;"/>
                        </q-carousel-control>
                          </div>
                          <div class="col-3 q-px-sm full-height" v-for="chapter in slider" style="margin-left:auto;margin-right: auto;display: flex; justify-content: center; align-items: center;">
                            <q-img class="rounded-borders shadow-2 cursor-pointer"
                              :src="chapter.chapterImagePath ?? 'dummy'" @click="visitChapter(chapter)" style="border-radius:20px">
                              <template v-slot:error>
                                <q-img :src="chapter.chapterImagePath" class="fit" />
                              </template>
                            </q-img>
                          </div>
                          <div class="col-1" style="display: flex; justify-content: center; align-items: center;">
                             <q-carousel-control class="q-gutter-xs"  style="position: relative;">
                              <q-btn round dense class="shadow-2" text-color="white" icon="chevron_right" @click="$refs.carousel.next()" style="background-color: #5479F7;"/>
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
  import { urls } from "../libraries/Urls";
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
            const removeImagePath = baseUrl +'fs/download/'
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
    }) .catch(error => {
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
    this.allSlides=[];
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
            const removeImagePath = baseUrl +'fs/download/'
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
  this.allSlides = [];
  const totalChapters = chapter.length;

  for (let i = 0; i < totalChapters; i++) {
    const slide = [];
    for (let j = 0; j < 3; j++) {
      // Calculate the chapter index with wrapping
      const chapterIndex = (i + j) % totalChapters;
      slide.push(chapter[chapterIndex]);
    }
    this.allSlides.push(slide);
  }
},
      
      visitChapter(chapter) {
    // console.log('Chapter File Path:', chapter.chapterFilePath); // Log the chapter file path
    
    var ext = chapter.chapterFilePath?.substr(chapter.chapterFilePath.lastIndexOf('.') + 1);
    let url = '/read-pdf';
    if(ext == 'pptx' ) { url = '/watch-ppt'; }
    else if(ext == 'mp4') { url = '/watch-video'; }
    else if(ext == 'pdf') { url = '/read-pdf'; }
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
  <style>
.carousel_book{
  width: 30%;
}
.chapter_right1{
  height: 100%;
  width: 98%;
    margin-left: auto;
    /* border:2px solid red; */
    margin-right: auto;
    /* max-width: 100%; */
    /* border: 2px solid green; */
  }
  .Book_bg{
    background-color: #ffff;
   
    margin-left: 1.5rem !important;
    margin-right: 1.5rem !important;
  }
</style>
  