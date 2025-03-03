<template>
    <q-layout view="lHh Lpr lFf">
      <!-- Navigation Bar -->

      <q-toolbar>
          <!-- Left Side: Logo, q-select, q-search -->
          <q-toolbar-title class="row items-center q-py-sm">
  <!-- space for logo will add later -->

          <q-select
    v-model="selectedExplore"
    :options="exploreOptions"
    clearable
    label="Explore"
    dense
    outlined
    emit-value
    color="#4E5BF8"
    map-options
    class="q-ml-md explore"
    style="min-width: 140px;"
  />
  <q-input
    dense
    outlined
    placeholder="What do you want to learn?"
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

          <!-- Right Side: Navigation Links -->

          <q-btn noCaps flat label="Courses" class="nav-link" />
  <q-btn noCaps flat label="Career" class="nav-link" />
  <q-btn noCaps flat label="Login" class="nav-link" :to="'/login'" style="color: #4E5BF8"/>

  <q-btn
    noCaps
    label="Join for Free"
    unelevated
    class="join-btn"
    style="background-color: #4E5BF8; color: white;"
  />
        </q-toolbar>
      <q-page-container>
        <div class="q-my-md q-px-xl">
  <span class="routing_class" >
    <span @click="$router.go(-1)" style="cursor: pointer; color: blue;">

      {{ heading }}
    </span>

  &nbsp; > &nbsp; View Program</span>
</div>
        <!-- Fintech Associate -->

        <div class="container">
  <div class="row q-py-xl" style="background-color: #F1F4FF;">
    <div class="col-5 q-px-xl ">
      <div class="text-bold q-mb-lg text-h4">{{ heading }} Program</div>

      <p class="text-grey">{{ description }}</p>

      <div class="flex items-center justify-between">
        <!-- Star Ratings -->
        <div class="flex items-center">
          <q-icon name="star" size="20px" color="yellow" />
          <q-icon name="star" size="20px" color="yellow" />
          <q-icon name="star" size="20px" color="yellow" />
          <q-icon name="star" size="20px" color="yellow" />
          <q-icon name="star" size="20px" color="yellow" />
          <span class=" text-weight-regular q-px-xs">5.0</span>
        </div>

        <!-- Enrolled Students-->
        <div class="flex items-center">
          <span>2,500+ enrolled</span>
          <div class="laprof flex q-mr-xl">
            <q-avatar size="40px" class="overlap" v-for="(profile, index) in profiles" :key="index">
              <img :src="profile.image" alt="User Avatar" />
            </q-avatar>
          </div>
        </div>


    </div>
    <div class="text-bold q-my-lg" style="font-size: large;">Course fee: INR {{courseFee}}</div>
<q-btn class="q-px-xl text-weight-regular shadow-5" noCaps unelevated rounded label="Enroll Now" color="#fff" style="background-color: #443EDE;"/>
    </div>

    <div class="col q-pr-xl">
        <q-img
          :src=course_img
          :ratio="16/8"
          style="border-radius: 15px;"
        />
    </div>
  </div>
        </div>

        <!-- What lear -->
        <div class="q-pa-xl" >
    <q-list bordered class="rounded-borders" style="background-color: #F4F4F4; border-radius: 20px;border: 1px solid #C9D4FC;">
      <q-expansion-item>
        <template v-slot:header>

          <q-item-section class="text-h4 text-weight-bold q-pt-md q-pl-md">
            What You’ll Learn
          </q-item-section>
        </template>

        <q-card style="background-color: #F4F4F4;border-radius: 20px;">
            <div class="row flex items-center justify-evenly">
          <q-card-section >
                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>

                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>

                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>

                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>


          </q-card-section>

          <q-card-section >

                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>

                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>

                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>

                <q-item v-ripple>
                  <q-item-section avatar>
                    <q-icon name="done" color="indigo-14" size="sm"/>
                  </q-item-section>

                  <q-item-section class="litem">Prepare for Industry Certification Exam</q-item-section>
                </q-item>


          </q-card-section>
        </div>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
  <div class="row">
    <!-- Left Section: Display Chapter Category Names & Descriptions -->

    <div class="col-8">
  <div class="row q-px-xl q-py-sm">
    <div class="row col-12">
      <div class="text-h6 text-weight-bold q-mb-md">Course Curriculum Breakdown</div>
    </div>

  <div class="col-12">
  <div v-for="(category, index) in chapterCategoryNames" :key="index" class="q-mb-md row align-items-center">
    <div class="col-12 row">
      <div class="blue-line"></div>
      <div class="content grey-bg">
        <div class="text-p text-weight-bold">{{ category }}</div>
        <div class="text-p" style="color: #6D6D6D;">{{ chapterCategoryDescriptions[index] }}</div>
      </div>
    </div>
  </div>
</div>
</div>
<!-- /////////////////////////// -->
<div class="row q-px-xl q-py-sm" style="width: 100%;">
<div class="row  col-12">
  <div class="col-12">
  <q-expansion-item expand-separator style="width: 100%;background-color: #F4F4F4;border-radius: 10px;">
    <template v-slot:header>
      <q-item-section>
        <div class="text-h6 text-weight-bold">Description</div>
      </q-item-section>
    </template>

    <q-card>
      <q-card-section>
        <p class="text-grey">{{ description }} || </p>
      </q-card-section>
    </q-card>
  </q-expansion-item>
  </div>

</div>
</div>
<!-- ///////////////////////////// -->
<div class="row q-px-xl q-py-sm" style="width: 100%;">
<div class="row  col-12">
  <q-expansion-item expand-separator style="width: 100%;background-color: #F4F4F4;border-radius: 10px;">
    <template v-slot:header>
      <q-item-section>
        <div class="text-h6 text-weight-bold">Requirements</div>
      </q-item-section>
    </template>

    <q-card>
      <q-card-section>
        <p class="text-grey">{{ eligibility }}</p>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</div>
</div>
<!-- //////////////////// -->
 </div>

 <!-- Right Section -->
 <div class="col-4 q-pr-xl">
  <div class="row bg-lightblue">
  <div class="row col-12  ">
    <div class="text-h6 text-weight-bold q-pa-md">Course Features</div>
  </div>
  <ul class="q-pl-none q-pa-md" style="margin-top: 0%;margin-bottom: 0%;font-size: large;">
    <li class="flex items-center q-mb-sm">
      <q-icon name="push_pin" color="primary" class="q-mr-sm" />
      Beginner to Advanced
    </li>
    <li class="flex items-center q-mb-sm">
      <q-icon name="push_pin" color="primary" class="q-mr-sm" />
      Beginner to Advanced
    </li>
    <li class="flex items-center q-mb-sm">
      <q-icon name="push_pin" color="primary" class="q-mr-sm" />
      15 modules with over 150 lessons
    </li>
    <li class="flex items-center q-mb-sm">
      <q-icon name="push_pin" color="primary" class="q-mr-sm" />
      Beginner to Advanced
    </li>
    <li class="flex items-center q-mb-sm">
      <q-icon name="push_pin" color="primary" class="q-mr-sm" />
      Professional Certificate upon completion
    </li>
    <li class="flex items-center q-mb-sm">
      <q-icon name="push_pin" color="primary" class="q-mr-sm" />
      Beginner to Advanced
    </li>
  </ul>
   <div class="q-pa-md" style="width: 100%;">
      <q-btn label="Buy Now" rounded color="primary" unelevated class="full-width q-pa-sm text-capitalize" to="/login" style="font-size: large;" />
    </div>
  </div>
</div>


</div>

      </q-page-container>
    </q-layout>
  </template>

<script>
import axios from "axios";
import course_img from '../../assets/cours_1.jpg';

export default {
  data() {
    return {
      course_img: course_img,
      heading: "",
      description: "",
      eligibility: "",
      courseFee: "",
      chapterCategoryNames: [], // Added for storing category names
      chapterCategoryDescriptions: [], // Added for storing category descriptions
      profiles: [
        { image: "https://randomuser.me/api/portraits/women/1.jpg" },
        { image: "https://randomuser.me/api/portraits/men/2.jpg" },
        { image: "https://randomuser.me/api/portraits/women/3.jpg" },
        { image: "https://randomuser.me/api/portraits/men/4.jpg" }
      ]
    };
  },
  created() {
    const selectedProgramId = this.$route.query.programId;
    console.log("Selected Program ID:", selectedProgramId);

    if (selectedProgramId) {
      this.fetchProgramDetails(selectedProgramId);
    }
  },
  methods: {
    async fetchProgramDetails(programId) {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
const getPrograms = baseUrl + 'api/programsInfo';

const response = await axios.get(`${getPrograms}/${programId}`);
        console.log("Program details response:", response.data);

        if (response.data.success) {
          const program = response.data.data;
          this.heading = program.heading;
          this.description = program.description;
          this.courseFee = program.courseFee;
          this.eligibility=program.eligibility;

          // Store chapter category names & descriptions
          this.chapterCategoryNames = program.chapterCategoryNames || [];
          this.chapterCategoryDescriptions = program.chapterCategoryDescriptions || [];

          // Handle course image
          const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
          let imageUrl = program.imagePath;

          if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
            console.log(`Fetching cover image for: ${program.heading}`);
            const downloadUrl = `${baseUrl}fs/download`;
            const filename = imageUrl.replace(`${baseUrl}fs/download/`, '');

            const formData = new FormData();
            formData.append('filename', filename);

            try {
              const downloadResponse = await axios.post(downloadUrl, formData, { responseType: 'blob' });
              const blob = new Blob([downloadResponse.data]);
              this.course_img = window.URL.createObjectURL(blob);
              console.log(`Fetched cover image for: ${program.heading}`);
            } catch (imageError) {
              console.error(`Error fetching cover image for: ${program.heading}`, imageError);
              this.course_img = this.DummyBook; // Fallback image
            }
          } else {
            this.course_img = imageUrl;
          }
        } else {
          console.warn("No program data found");
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      }
    }
  }
};
</script>


  <style>
.laprof {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.routing_class{
  color: #676DED;
  font-family: sans-serif;
  font-weight: 500;
}

.q-avatar.overlap {
  border: 2px solid white; /* Adds a white border around avatars */
  margin-left: -12px; /* Overlapping effect */
  transition: transform 0.3s ease-in-out;
}

.q-avatar.overlap:first-child {
  margin-left: 0;
}

.q-avatar.overlap:hover {
  transform: scale(1.1); /* Slight zoom effect on hover */
}

.litem{
    color: gray;
    font-size: large;
}
.grey-bg{
    background-color: #F1F4FF;
    padding: 10px;
    border-radius: 10px;
}
.blue-line {
  width: 5px; /* Adjust thickness */
  height: 100%; /* Full height */
  background-color: blue;
  margin-right: 10px; /* Adjust spacing */
  border-radius: 5px;
}
.bg-lightblue{
  background-color: #DDE4FF;
  border-radius: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  padding: 10px;
  flex: 1; /* Ensures it takes up remaining space */
}
</style>
