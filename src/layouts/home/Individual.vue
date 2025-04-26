<template>
  <q-layout view="lHh Lpr lFf " style="min-height: unset">
    <!-- Navigation Bar -->

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
            <q-item class="logo_in">
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

    <q-page-container>
      <!-- 	Alice blue Bar -->

      <!-- <q-banner dense inline-actions class="text-center bg-aliceblue">
        <span style="color: black;">

          Launch your career as a Python developer with job-ready skills from Gurukul.

       <span style="color: #4E5BF8;">
           <a href="" style="all: unset; text-decoration: none; color: inherit;cursor: pointer;">Enroll today</a>
       </span>!</span>
</q-banner> -->

<q-page class="q-mt-md mobile_view" style="min-height: auto;" >
  <div class="banner q-py-sm q-pl-lg q-mt-xl">
    <div v-for="page in marketingPages" :key="page.id">
      <span
    class="text-black dev_css"

  >
  <i>{{ page.topBar }} <span class="SG_Bar"> SCALEGRAD</span></i>
  </span>
</div>
</div>
<div class="combined_heading container row">
<div class="row">
  <div class="col-1 q-none q-md-block web_view"></div>
  <div v-for="page in marketingPages" :key="page.id">
  <span class="header_blue"><span class="scaleGrad_head">ScaleGrad</span> {{ page.heading }}</span>
</div>
</div>
<div  class="text-left row">
  <div class="col-1 q-none q-md-block web_view"></div>
  <div v-for="page in marketingPages" :key="page.id">
  <span class="header_purple">{{ page.subHeading }}</span>
</div>
</div>
<div class="text-left row">
  <div class="col-1 d-none d-md-block"></div>

  <span v-for="page in marketingPages" :key="page.id" class="header_black col-12 col-md-5 pt-2 me-xl">
   {{ page.description }}
  </span>

</div>

<div class="text-left row col-12 q-mt-md">
  <div class="col-1 q-none q-md-block"></div>
  <div class="col-12 col-md-5 row btns">
    <div class="col-12 col-md-auto q-mb-sm">
    <q-btn class="Join_Free_btn q-px-xl q-py-md full-width" no-caps to="/login">Join For Free</q-btn>
  </div>
    <div class="col-12 col-md-6 q-mb-sm q-md-ml-md margin_left">
      <q-btn class="Explore_btn q-py-md full-width" no-caps :to="firstProgramLink">  Explore Our Certifications</q-btn>
    </div>
  </div>
</div>



    <div class="image_div row">
      <div class="col-11" v-for="page in marketingPages" :key="page.id">
  <q-img :src="page.imagePath"></q-img>
</div>

       <div class="col-1"></div>
    </div>
</div>
</q-page>

    </q-page-container>
  </q-layout>
  <Associated />
<mostPopular />
<OurTools />
<freeCourses />

<Certification />
<certificateVerqification style="margin-bottom: 3%;margin-top: 3%;" />
<Success style="width: 100%"/>
<Reviews />
<Footer />
<q-dialog v-model="showOtpDialog" persistent full-width>
  <q-card style="max-width: 600px; width: 100%">
    <q-card-section>
      <CertificateOtpForm :initialUniqueId="routeUniqueId" @close="showOtpDialog = false" />
    </q-card-section>
  </q-card>
</q-dialog>
</template>
<script>
import axios from "axios";
import mostPopular from "./mostPopular.vue";
import new_logo from "src/assets/new_logo1.svg";
import freeCourses from "./freeCourses.vue";
import Reviews from "./Reviews.vue";
import bg_img from "src/assets/scalefradepng1.png"
import OurTools from "./OurTools.vue";
import Certification from "./Certification.vue";
import certificateVerqification from "./certificateVerifcations.vue";
import CertificateOtpForm from "src/layouts/home/CertificateOtpForm.vue";


import Associated from "./Associated.vue";
import Footer from "./footer.vue";
import Success from "./Success.vue";

export default {
  components: {
    mostPopular,
    freeCourses,
    OurTools,
    Reviews,
    Certification,
    Success,
    Associated,
    certificateVerqification,
    Footer,
    CertificateOtpForm,
  },
  name: "Individual",
  data() {
    return {
      reviews: [],
      bg_img: bg_img,
      marketingPages: [],
      topBar: "", // Initialize topBar
      heading: "",
      imagePath: "",
      subHeading: "",
      description:"",
      new_logo: new_logo,
      leftDrawerOpen: false,
      selectedExplore: null,
      programs: [], // List of programs
      courses: [], // List of courses (chapter categories)
      selectedProgram: "", // Selected program name
      selectedDescription: "", // Selected program description
      selectedDuration: "", // Duration of the program
    selectedModules: "", // Modules in the program
    selectedEligibility: "", // Eligibility criteria for the program
    selectedCourseFee: "", // Course fee for the program
     showOtpDialog: false,
    routeUniqueId: ""
    };
  },
  async created() {
    await this.fetchPrograms();
    await this.fetchMarketingPages();
    if (this.programs.length > 0) {
      // Automatically fetch courses for the first program
      this.fetchCourses(
      this.programs[0].programId,
      this.programs[0].heading,
      this.programs[0].description
    );
    }
  },

  watch: {
  '$route'(to) {
    if (to.path === '/certificateValidation' && to.query.uniqueId) {
      this.routeUniqueId = to.query.uniqueId;
      this.showOtpDialog = true;
    }
  }
},
mounted() {
  if (this.$route.path === '/certificateValidation' && this.$route.query.uniqueId) {
    this.routeUniqueId = this.$route.query.uniqueId;
    this.showOtpDialog = true;
  }
},
  methods: {

    async fetchPrograms() {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const getPrograms = baseUrl + 'api/programsInfo';
        const response = await axios.get(getPrograms);

        this.programs = response.data.data;

        // Ensure at least one program exists before setting default
        if (this.programs.length > 0) {
          this.fetchCourses(this.programs[0].programId, this.programs[0].heading);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    },

    navigateToAllCourses() {
  if (this.selectedProgramId) {
    this.$router.push({
      path: "/finassociate",
      query: { programId: this.selectedProgramId }
    });
  } else {
    console.warn("No program selected");
  }
},
    async fetchCourses(programId, programName, programDescription) {
  this.selectedProgramId = programId;
  this.selectedDescription = programDescription;
  this.selectedProgram = programName;
  this.courses = []; // Clear previous data

  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
const getProgramCourse = baseUrl + 'api/programsInfo';

const response = await axios.get(`${getProgramCourse}/${programId}`);
    const data = response.data.data;
    this.selectedDuration = data.duration || "Not available";
    this.selectedModules = data.modules || "Not specified";
    this.selectedEligibility = data.eligibility || "Not mentioned";
    this.selectedCourseFee = data.courseFee || "Not specified";

    // Fetch reviews for the selected program
    await this.fetchReviews(programId);

    this.courses = await Promise.all(
      data.chapterCategoryNames.map(async (name, index) => {
        let imageUrl = data.chapterCategoryImagePaths[index] || null;
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';

        if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
          console.log(`Fetching cover image for: ${name}`);
          const downloadUrl = `${baseUrl}fs/download`;
          const filename = imageUrl.replace(`${baseUrl}fs/download/`, '');

          try {
            const formData = new FormData();
            formData.append('filename', filename);

            const downloadResponse = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
            const blob = new Blob([downloadResponse.data]);
            imageUrl = window.URL.createObjectURL(blob);

            console.log(`Fetched cover image for: ${name}`);
          } catch (error) {
            console.error(`Error fetching cover image for: ${name}`, error);
            imageUrl = this.DummyBook; // Fallback image
          }
        }

        return {
          title: name,
          programDescription: data.description,
          description: data.chapterCategoryDescriptions[index] || "No description available",
          image: imageUrl,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
},
async fetchMarketingPages() {
  this.marketingPages = []; // Clear previous data before fetching new ones
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const getMarketingPagesUrl = baseUrl + 'api/marketing-pages';

  try {
    const response = await axios.get(getMarketingPagesUrl);

    if (response.data.success) {
      // Process each page to fetch its image
      this.marketingPages = await Promise.all(
        response.data.data.map(async (page) => {
          let imageUrl = page.imagePath || null;

          if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
            console.log(`Fetching image for: ${page.heading}`);
            const downloadUrl = `${baseUrl}fs/download`;
            const filename = imageUrl.replace(`${baseUrl}fs/download/`, '');

            try {
              const formData = new FormData();
              formData.append('filename', filename);

              const downloadResponse = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
              const blob = new Blob([downloadResponse.data]);
              imageUrl = window.URL.createObjectURL(blob);

              console.log(`Fetched image for: ${page.heading}`);
            } catch (error) {
              console.error(`Error fetching image for: ${page.heading}`, error);
              imageUrl = this.DummyBook; // Fallback image
            }
          }

          return {
            ...page,
            imagePath: imageUrl, // Replace with the fetched or fallback image
          };
        })
      );
    } else {
      console.error("Failed to fetch marketing pages");
    }
  } catch (error) {
    console.error("Error fetching marketing pages:", error);
  }
},
async fetchReviews(programId) {
  this.reviews = []; // Clear previous reviews before fetching new ones
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';

  try {
    const getCourse = baseUrl + 'api/programFeedback/program';
const response = await axios.get(`${getCourse}/${programId}`);


    if (response.data.success) {
      // Process each review to fetch its image
      this.reviews = await Promise.all(
        response.data.data.map(async (review) => {
          let imageUrl = review.imagePath || null;

          if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
            console.log(`Fetching image for: ${review.studentName}`);
            const downloadUrl = `${baseUrl}fs/download`;
            const filename = imageUrl.replace(`${baseUrl}fs/download/`, '');

            try {
              const formData = new FormData();
              formData.append('filename', filename);

              const downloadResponse = await this.$api.post(downloadUrl, formData, { responseType: 'blob' });
              const blob = new Blob([downloadResponse.data]);
              imageUrl = window.URL.createObjectURL(blob);

              console.log(`Fetched image for: ${review.studentName}`);
            } catch (error) {
              console.error(`Error fetching image for: ${review.studentName}`, error);
              imageUrl = this.DummyBook; // Fallback image
            }
          }

          return {
            ...review,
            imagePath: imageUrl, // Replace with the fetched or fallback image
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
  },
  computed: {
  firstProgramLink() {
    if (this.programs.length > 0) {
      return `/finassociate/?programId=${this.programs[0].programId}`;
    }
    return "/finassociate/"; // Default fallback if no programs are available
  }
},
};
</script>

<style scoped>
.logo_in{
  min-height: 0px !important;
}
.logo {
  /* height: 40px; */
  width: auto;
}
.banner{
  background-color: #f3f3f4;
  color: #4E5BF8 !important;
  width: 60%;
  font-size: 1.5vw !important;
  margin-right: auto;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}
.all_courses{
  color: #7D7D7D;
  cursor: pointer;
}
.nav-link {
  color: black;
  font-weight: 500;
}

.join-btn {
  margin-left: 10px;
  font-weight: bold;
}
.bg-aliceblue{
  background-color: #E3EEFD;
  color: #0000 !important;
  font-weight: 600;
  font-weight: bold;
  font-family: sans-serif;
}
.course-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
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
.underline {
  color: #474BFF;
  text-decoration: underline;
  text-underline-offset: 6px;
}
.scaleGrad_head{
  font-size: 2.6vw;
}

.program_view {
width: 100%;
border: 1px solid gray;
border-radius: 20px;
}
.blue_border{
  border: 2px solid #4E5BF8;
  border-radius: 22px;
  color: #4e5bf8;
  margin-top: 3%;
  letter-spacing: 1px;
  /* width: 80% !important;
  margin-left: auto;
  margin-right: auto; */
  /* margin-right: 20px; */

}
.dev_css{
  padding-left: 7vw;
  margin-top: 10%;
}
.combined_heading{
  position: relative;
  display: flex;
  padding-top: 5%;
  /* align-items: center; */
  flex-direction: column;
  overflow: hidden;
  /* justify-content: center; */
  height: 86vh;
  max-height: 100vh;
  margin-bottom: 0% !important;
}
.image_div{
  position: absolute;
  width: 60%;
  right: 0%;
  bottom: 0%;
}
.header_blue{
  color: #000;
  font-weight: bold;
  font-size: 2.2vw;
  text-align:left !important;
}
.Join_Free_btn{
  /* width: 100%; */
  background-color: #4E5BF8;
  border: 2px solid #4E5BF8;
  font-size: large;
  color: white;
}
.Explore_btn{
  width: 100%;
  border: 2px solid #4E5BF8;
  font-size: large;
  color: #4E5BF8;
}
.margin_left{
  margin-left: 2%;
}
.header_black{
  color: black;
  /* font-weight: bold; */
  font-size: 1.5vw;
  text-align: left !important;
}
.header_purple{
  color: #4E5BF8;
  font-weight: bold;
  font-size: 2.6vw;
  text-align: left !important;
}
.blue_box{
  background-color: #4E5BF8;
  color: white;
}

.review-container {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px !important;
  align-items: start;
  margin-bottom: 24px;
}


.review-name {
  font-size: large;
}

.review-role {
  font-size: 12px;

}

.ratings {
  display: flex;
  gap: 1px;
  margin-top: 5px;
}

.review-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  border: 2px solid #ccc;
}

.left-section {
  width: 200px;
}
.logo{
    /* align-items: center; */
    /* justify-content: center; */
    /* display: flex; */
  }

@media (max-width: 600px) {
  .mobile_view {
    /* padding: 1% !important; */
    margin: 0 !important;
  }
  .left-section {
    width: 100% !important;
  }
  .banner{
    background: #E3EEFD;
  color: #4E5BF8 !important;
  width: 100%;
  font-size: 0.7rem !important;
  margin-right: auto;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  margin-top: 3%;
}
.dev_css{
  padding-left: 0%;
}
.Join_Free_btn{
  padding: 0px 20px;
}
.Explore_btn{
  padding: 0px 20px;
}
.combined_heading{

  display: flex;
  /* align-items: center; */
  flex-direction: column;
  overflow: hidden;
  /* justify-content: center; */
  height: fit-content;
  margin-bottom: 0% !important;
  padding: 5%;
  padding-bottom: 0%;
}


.image_div {
    position: relative;
    width: 100%; /* Adjust width for better mobile layout */
    left: auto;
    transform: none;
    bottom: auto;
  }

.margin_left{
  margin-left: 0%;
}
.web_view{
  display: none;
}
.header_blue{
  color: #000;
  font-weight: bold;
  font-size: 20px;
  text-align:left !important;
}
.header_black{
  color: black;
  /* font-weight: bold; */
  font-size: 16px;
  text-align: left !important;
}
.header_purple{
  color: #4E5BF8;
  font-weight: bold;
  font-size: 18px;
  text-align: left !important;
}
.scaleGrad_head{
  font-size: 24px;
}

.btns{
    padding: 0px 20px;
  }

  .SG_Bar{
    color: #4E5BF8;
    font-weight: bold;
  }


}

@media (max-width: 1022px) and (min-width: 768px) {
  .btns{
    padding: 0px 20%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: baseline;
  }
  .combined_heading{
    padding: 5%;
    padding-bottom: 0%;
  }
.header_black{
padding-left: 10%;
}


  .review-container{
    display: flex;
    flex-direction: column !important;
    padding-left: 5px;
  }
  .dev_css{
    padding-left: 0%;
  }

  .blue_border{
    margin-right: 0px;
  }
  .logo{
    margin-right: auto;
    margin-left: auto;
    align-items: center;
    justify-content: center;
    display: flex;
  }

}

</style>

