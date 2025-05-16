<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navigation Bar -->

    <q-toolbar>
      <!-- Left Side: Logo, q-select, q-search -->
      <q-toolbar-title class="row items-center q-py-sm q-mt-lg top-scale">
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
          <q-item class="logo_in" :to="'/home'">
            <q-img :src="new_logo" style="width: 220px;" ></q-img>
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
          style="width: 300px"
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
          style="min-width: 140px"
        />
        <!-- <q-btn noCaps flat label="Courses" class="nav-link" /> -->
        <q-btn noCaps flat label="Certifications" class="nav-link" />
        <q-btn
          noCaps
          flat
          label="Login"
          class="nav-link"
          :to="'/login'"
          style="color: #4e5bf8"
        />
        <q-btn
          noCaps
          label="Join for Free"
          unelevated
          :to="'/login'"
          class="join-btn"
          style="background-color: #4e5bf8; color: white"
        />
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
            <q-btn
              noCaps
              label="Join for Free"
              unelevated
              :to="'/login'"
              class="full-width"
              style="background-color: #4e5bf8; color: white"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- =================================== -->
    <q-page-container>
      <div class="q-my-md q-px-xl">
        <span class="routing_class">
          <span @click="$router.go(-1)" style="cursor: pointer; color: blue">
            {{ heading }}
          </span>

          &nbsp; > &nbsp; View Program</span
        >
      </div>
      <!-- Fintech Associate -->

      <div class="container row q-mx-xl" >
  <div class="row q-py-xl justify-around items-center" style="background-color: #f1f4ff;border-radius: 20px;">

    <!-- Image Column -->
    <div
      class="col-12 col-md-5"
      :class="$q.screen.lt.md ? 'q-px-sm' : 'q-pl-sm q-px-sm'"
    >
      <q-img
        :src="course_img"
        :ratio="16 / 8"
        style="border-radius: 15px"
      />
    </div>

    <!-- Text Content Column -->
    <div class="col-12 col-md-5 q-px-md-xl q-mt-md right-program">
      <div class="text-bold q-mb-lg text-h4" style="margin-bottom: 2%;">
        {{ heading }} Program
      </div>

      <p class="text-grey">{{ description }}</p>

      <q-btn
        class="q-px-xl q-py-md text-weight-regular shadow-5"
        noCaps
        unelevated
        label="Enroll Now"
        :to="'/register'"
        color="#fff"
        style="background-color: #443ede; border-radius: 10px;"
      />
    </div>

  </div>
</div>



      <!-- What lear -->
<div class="container row col-12 q-my-xl q-mx-xl mobile-mar">

  <div class="col-12 col-md-8 row">
     <div class="col-12">
        <div class="text-h4 text-weight-bold  q-mt-sm cou-jou">
          Course Journey
        </div>
      </div>
    <div class="row q-mt-sm q-pr-md no-padding-mobile" style="width: 100%;">
  <div class="col-12">
    <q-img
      :src="image_curriculum"
      class="q-mb-sm dot-img"
      style="width: 100%; max-width: 100%;"
    />
  </div>
</div>
<div class="col-12">
        <div class="text-h4 text-weight-bold q-mb-lg q-mt-xl cou-jou">
          Our Program Highlights
        </div>
      </div>
  <div class="col-12 col-md-6 q-mb-xl curr-mar">
<div class="q-mr-md learning_journey">
    <!-- Image and heading row -->
    <div class="row items-center q-mt-md q-pl-lg q-py-md">
      <q-img :src="learning_journey" class="Vector_class "></q-img>
      <span class="text-bold text-h5 q-pl-md">Our Curriculam</span>
    </div>

    <!-- List in a new row -->
    <div class="row">
      <div class="col-12">
        <ul>
        <li class="text-bold text-h6 vol-cur" @click="toggleCurriculum(1)"> V1. Fintech & Financial Landscape
          <q-img
          :src="activeCurriculum === 1 ? neg_sign : plus_sign"
          width="16px"
          height="16px"
          class="q-ml-sm"
        />
          <ul class="custom-list q-pb-md" v-show="activeCurriculum === 1">
  <li class="text-body1">M1. Unlocking Finance: A Beginner’s Guide</li>
  <li class="text-body1">M2. Banking Unveiled: A Primer</li>
  <li class="text-body1">M3. Navigating Digital Banking: An Intro</li>
  <li class="text-body1">M4. Discovering Fintech: The Essentials</li>
  <li class="text-body1">M5. Agile-Powered Software Delivery Journey</li>
</ul>
        </li>
<li class="text-bold text-h6 vol-cur" @click="toggleCurriculum(2)">V2. Disruptive Technologies
  <q-img
          :src="activeCurriculum === 2 ? neg_sign : plus_sign"
          width="16px"
          height="16px"
          class="q-ml-sm"
        />
  <ul class="custom-list q-pb-md" v-show="activeCurriculum === 2">
  <li class="text-body1">M1. Distributed Systems</li>
  <li class="text-body1">M2. The Power of Open API & Microservices</li>
  <li class="text-body1">M3. Cloud Computing and Azure Cloud Provider</li>
  <li class="text-body1">M4. Leveraging AI & Machine Learning</li>
  <li class="text-body1">M5. Blockchain and the Revolution of Smart Contracts in FinTech.</li>
</ul>
</li>
<li class="text-bold text-h6 vol-cur" @click="toggleCurriculum(3)">V3. Equity Electronic Trading
  <q-img
          :src="activeCurriculum === 3 ? neg_sign : plus_sign"
          width="16px"
          height="16px"
          class="q-ml-sm"
        />
  <ul class="custom-list q-pb-md" v-show="activeCurriculum === 3">
    <li class="text-body1" >Introduction to Equity Trading</li>
  <li class="text-body1">Fundamentals of Equity Markets</li>
  <li class="text-body1">Equity Orders and Execution</li>
  <li class="text-body1">Electronic Trading Strategies</li>
  <li class="text-body1">FIX Protocol for Exchange Connectivity</li>
</ul>
</li>

        </ul>
      </div>
    </div>
  </div>
  </div>
  <!-- ================== -->

 <div class="col-12 col-md-6 q-mb-xl">
<div class="q-mx-md learning_journey">
    <!-- Image and heading row -->
    <div class="row items-center q-mt-md q-pl-lg q-py-md">
      <q-img :src="Our_labs" class="Vector_class q-mr-sm"></q-img>
      <span class="text-bold text-h5 q-pl-md">Our Virtual Labs</span>
    </div>

    <!-- List in a new row -->
    <div class="row">
    <div class="col-12">
      <ul class="custom-list1 q-ml-md">
        <li v-for="(item, index) in features" :key="index">
          <div
            class="row items-center q-mb-xs"
            @click="toggle(index)"
            style="cursor: pointer;"
          >

            <div class="text-h6">{{ item.title }}</div>
            <q-img
              :src="openedIndex === index ? neg_sign : plus_sign"
              width="16px"
              height="16px"
              class="q-ml-sm"
            />
          </div>
          <div
            @click="toggle(index)"
            v-if="openedIndex === index"
            class="q-ml-md q-mr-sm q-mb-md text-body1 text-grey-8"
          >
            <i>{{ item.description }}</i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
  </div>
  <!-- ================== =============================================-->
  <div class="col-12 row">
<div class="col-12 col-md-6 q-mb-xl curr-mar">
<div class="q-mr-md learning_journey1 ">
    <!-- Image and heading row -->
    <div class="row items-center q-mt-md q-pl-lg q-py-md">
      <q-img :src="Prerequisotes" class="Vector_class q-mr-sm"></q-img>
      <span class="text-bold text-h5 q-pl-md">Course Prerequisotes</span>
    </div>

    <!-- List in a new row -->
    <div class="row">
    <div class="col-12">
      <ul class="custom-list1 q-ml-md">
        <li v-for="(item, index1) in features1" :key="index1">
          <div
            class="row items-center q-mb-xs"
            @click="toggle1(index1)"
            style="cursor: pointer;"
          >

            <div class="text-h6">{{ item.title }}</div>
            <q-img
              :src="openedIndex1 === index1 ? neg_sign : plus_sign"
              width="16px"
              height="16px"
              class="q-ml-sm"
            />
          </div>
          <div
            v-if="openedIndex1 === index1"
            class="q-ml-md q-mr-sm q-mb-md text-body1 text-grey-8"
          >
            <i>{{ item.description }}</i>
          </div>
        </li>
      </ul>
    </div>
  </div>
  </div>
  </div>
  <!-- ================== -->

  <div class="col-12 col-md-6 q-mb-xl curr-mar">
<div class="q-mx-md learning_journey1">
    <!-- Image and heading row -->
    <div class="row items-center q-mt-md q-pl-lg q-py-md">
      <q-img :src="Features" class="Vector_class q-mr-sm"></q-img>
      <span class="text-bold text-h5 q-pl-md">Special Features</span>
    </div>

    <!-- List in a new row -->
    <div class="row">
    <div class="col-12">
      <ul class="custom-list1 q-ml-md">
        <li v-for="(item, index2) in features2" :key="index2">
          <div
            class="row items-center q-mb-xs"
            @click="toggle2(index2)"
            style="cursor: pointer;"
          >

            <div class="text-h6">{{ item.title }}</div>
            <q-img
              :src="openedIndex2 === index2 ? neg_sign : plus_sign"
              width="16px"
              height="16px"
              class="q-ml-sm"
            />
          </div>
          <div
            v-if="openedIndex2 === index2"
            class="q-ml-md q-mr-sm q-mb-md text-body1 text-grey-8"
          >
            <i>{{ item.description }}</i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
  </div>

  </div>
<!--MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM  -->
  <div class="col-12 row q-mt-md">
<div class="col-12 col-md-6 q-mb-xl curr-mar">
<div class="q-mr-md learning_journey1">
    <!-- Image and heading row -->
    <div class="row items-center q-mt-md q-pl-lg q-py-md">
      <q-img :src="Certification" class="Vector_class q-mr-sm"></q-img>
      <span class="text-bold text-h5 q-pl-md">Certification</span>
    </div>

    <!-- List in a new row -->
    <div class="row">
    <div class="col-12">
      <ul class="custom-list1 q-ml-md">
        <li class="text-body1">Industry-recognized certification</li>
        <li class="text-body1">Enhanced career prospects</li>
      </ul>
    </div>
  </div>
  </div>
  </div>
  <!-- ================== -->

  <div class="col-12 col-md-6 q-mb-xl curr-mar">
<div class="q-mx-md learning_journey1">
    <!-- Image and heading row -->
     <div class="row items-center q-mt-md q-pl-lg q-py-md">
      <q-img :src="Oppertunities" class="Vector_class q-mr-sm"></q-img>
      <span class="text-bold text-h5 q-pl-md">Career Opportunities</span>
    </div>


    <!-- List in a new row -->
    <div class="row">
    <div class="col-12">
     <ul class="custom-list1 q-ml-md">
        <li v-for="(item, index3) in features3" :key="index3">
          <div
            class="row items-center q-mb-xs"
            @click="toggle3(index3)"
            style="cursor: pointer;"
          >

            <div class="text-h6">{{ item.title }}</div>
            <q-img
              :src="openedIndex3 === index3 ? neg_sign : plus_sign"
              width="16px"
              height="16px"
              class="q-ml-sm"
            />
          </div>
          <div
            v-if="openedIndex3 === index3"
            class="q-ml-md q-mr-sm q-mb-md text-body1 text-grey-8"
          >
            <i>{{ item.description }}</i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
  </div>

  </div>
  <!-- jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj -->
<div class="row">
  <div class="col-12 cur-bre">
    <div class="row q-py-sm">
      <div class="col-12 q-mb-md ">
        <div class="text-h4 text-weight-bold q-mb-sm q-mt-sm  ">
          Course Curriculum Breakdown
        </div>
      </div>

      <!-- Single row with 3 columns -->
      <div class="row col-12 ">
        <div
          v-for="(category, index) in chapterCategoryNames"
          :key="index"
          class="col-12 col-md-12 q-mb-lg"
        >
          <div class="content learning_journey " style="padding-top: 2%;padding-bottom: 2%;">
            <div class="text-h6 text-weight-bold q-mb-xs" style="padding-left: 1%;">{{ category }}</div>
            <div class="text-body1" style="color: #6d6d6d;padding-left: 1%;">
              {{ chapterCategoryDescriptions[index] }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
  <!-- Your Learning Journey -->
<!-- llllllllllllllllllllllllllllllllll -->

</div>
<div class="col-12 col-md-4">
  <div class="sticky-section">
    <div class="col-12 blue_bckg q-mt-md q-ml-md">
      <div class="col-12 q-mr-md q-pl-lg q-py-md q-pt-lg">
        <span class="text-bold text-h5">Course Features</span>
      </div>

      <div class="col-12 q-mt-md">
        <ul class="custom-list2">
          <li v-for="(item, index) in courseFeatures" :key="index" class="row items-start q-mb-sm">
            <q-img
              :src="pin"
              width="24px"
              height="24px"
              class="q-mr-sm q-mb-sm"
              style="margin-top: 4px"
            />
            <div class="text-body1">{{ item }}</div>
          </li>
        </ul>
      </div>

      <div class="col-12 q-pb-md q-mx-lg  text-center">
        <q-btn class="text-bold text-body1 q-py-md" :to="'/register'" style="background-color: #41C0FD; width:90%;border-radius: 20px;">Enroll Now</q-btn>
      </div>
    </div>
  </div>
</div>


</div>




    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
import course_img from "../../assets/cours_1.jpg";
import new_logo from "src/assets/new_logo1.svg";
import learning_journey from "src/assets/Learning_Journey.png";
import Our_labs from "src/assets/Our_labs.png";
import plus_sign from "src/assets/plus_sign.png";
import image_curriculum from "src/assets/image_curriculum.png";
import neg_sign from "src/assets/neg_sign.png";
import pin from "src/assets/pin.png";
import Prerequisotes from "src/assets/Prerequisotes.png";
import Oppertunities from "src/assets/Oppertunities.png";
import Features from "src/assets/Features.png";
import Certification from "src/assets/Certification.png";
export default {
  data() {
    return {
      course_img: course_img,
      Oppertunities: Oppertunities,
      image_curriculum: image_curriculum,
      Features: Features,
      Certification: Certification,
      Prerequisotes: Prerequisotes,
      Our_labs: Our_labs,
      pin: pin,
      heading: "",
      description: "",
      eligibility: "",
      courseFee: "",
      learning_journey: learning_journey,
      new_logo: new_logo,
plus_sign: plus_sign,
      neg_sign: neg_sign,
      chapterCategoryNames: [], // Added for storing category names
      chapterCategoryDescriptions: [], // Added for storing category descriptions
      profiles: [
        { image: "https://randomuser.me/api/portraits/women/1.jpg" },
        { image: "https://randomuser.me/api/portraits/men/2.jpg" },
        { image: "https://randomuser.me/api/portraits/women/3.jpg" },
        { image: "https://randomuser.me/api/portraits/men/4.jpg" },
      ],
      active: null,
      activeCurriculum: null,

       openedIndex: null,
       openedIndex1: null,
       openedIndex2: null,
      openedIndex3: null,
      leftDrawerOpen: false,
      features: [
        {
          title: 'Real-Time Fintech Environment',
          description: 'Gain hands-on experience in labs that simulate real-time fintech environments, mirroring the workflows of leading companies to make you job-ready from day one.'
        },
        {
          title: '24/7 AI Assistance',
          description: 'Benefit from round-the-clock support with an AI assistant available to clarify doubts and guide you through complex technical problems at any time.'
        },
        {
          title: 'Comprehensive Software Suite',
          description: 'Work with a wide range of fintech-related softwares, NGINX, MongoDB, Kafka, Jenkins, Angular, React, Springboot, Redis.'
        },
        {
          title: 'Cloud Computing Integration',
          description: 'Learn to deploy fintech solutions using top cloud services like Microsoft Azure.'
        }
      ],
         features1: [
        {
          title: 'Educational Qualifications',
          description: 'BTech, MTech, MCA, or any tech graduate'
        },
        {
          title: 'Programming Languages',
          description: 'Understanding of Java, Python or other similar programming languages'
        },
        {
          title: 'Graduation Year',
          description: 'Experienced and freshers (2023/2024/2025 passouts)'
        }
      ],
      features2: [
        {
          title: 'Resume Services',
          description: 'Get support with building your resume to suit the fintech markets and preparing for interviews through our mock interview sessions.'
        },
        {
          title: 'Skill-Building Focus',
          description: "The labs are designed to build your practical skills, ensuring you can confidently apply what you've learned in real-world fintech scenarios."
        },
        {
          title: 'Job-Ready Training',
          description: 'The combination of theoretical knowledge and practical lab experience ensures you are fully equipped to excel in the fintech industry from day one.'
        }
      ],
        features3: [
        {
          title: 'Placement Assistance',
          description: 'Get support with finding jobs and connecting with companies.'
        },
        {
          title: 'Expert Guidance',
          description: "Get advice from industry experts."
        },
      ],
      courseFeatures: [
        "Beginner to Advanced Learning Path",
        "Hands-on Real-world Scenarios",
        "Industry-Expert Mentorship",
        "Interactive Labs and Simulations",
        "Professional Certification on Completion",
        "Lifetime Access to Learning Resources"
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
        const baseUrl =
          (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
        const getPrograms = baseUrl + "api/programsInfo";

        const response = await axios.get(`${getPrograms}/${programId}`);
        console.log("Program details response:", response.data);

        if (response.data.success) {
          const program = response.data.data;
          this.heading = program.heading;
          this.description = program.description;
          this.courseFee = program.courseFee;
          this.eligibility = program.eligibility;

          // Store chapter category names & descriptions
          this.chapterCategoryNames = program.chapterCategoryNames || [];
          this.chapterCategoryDescriptions =
            program.chapterCategoryDescriptions || [];

          // Handle course image
          const baseUrl =
            (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
          let imageUrl = program.imagePath;

          if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
            console.log(`Fetching cover image for: ${program.heading}`);
            const downloadUrl = `${baseUrl}fs/download`;
            const filename = imageUrl.replace(`${baseUrl}fs/download/`, "");

            const formData = new FormData();
            formData.append("filename", filename);

            try {
              const downloadResponse = await axios.post(downloadUrl, formData, {
                responseType: "blob",
              });
              const blob = new Blob([downloadResponse.data]);
              this.course_img = window.URL.createObjectURL(blob);
              console.log(`Fetched cover image for: ${program.heading}`);
            } catch (imageError) {
              console.error(
                `Error fetching cover image for: ${program.heading}`,
                imageError
              );
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
    },
    toggleCurriculum(index) {
    this.activeCurriculum = this.activeCurriculum === index ? null : index;
  },
      toggle(index) {
      this.openedIndex = this.openedIndex === index ? null : index;
    },
    toggle1(index1) {
      this.openedIndex1 = this.openedIndex1 === index1 ? null : index1;
    },
    toggle2(index2) {
      this.openedIndex2 = this.openedIndex2 === index2 ? null : index2;
    },
    toggle3(index3) {
      this.openedIndex3 = this.openedIndex3 === index3 ? null : index3;
    },

  },
};
</script>

<style>
.laprof {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.routing_class {
  color: #676ded;
  font-family: sans-serif;
  font-weight: 500;
}

.q-avatar.overlap {
  border: 2px solid white; /* Adds a white border around avatars */
  margin-left: -12px; /* Overlapping effect */
  transition: transform 0.3s ease-in-out;
}
.text-grey{
  color: #6D6D6D !important
}
.learning_journey{
  background-color: #ffff;
  border-radius: 20px;
  height: 100%;
  border: 1px solid #C9D4FC;
 box-shadow: 0 5px 14px 2px rgba(201, 212, 252, 0.8);


}
.learning_journey1{
  background-color: #ffff;
  border-radius: 20px;
    height: 100%;
  border: 1px solid #C9D4FC;
  box-shadow: 0 5px 14px 2px rgba(201, 212, 252, 0.8);


}
.q-avatar.overlap:first-child {
  margin-left: 0;
}

.q-avatar.overlap:hover {
  transform: scale(1.1); /* Slight zoom effect on hover */
}

.custom-list2 {
  list-style: none;
}




.litem {
  color: gray;
  font-size: large;
}
.grey-bg {
  background-color: #F4F4F4;
  padding: 10px;
  border-radius: 20px;
  height: 100%;

}
.blue-line {
  width: 5px; /* Adjust thickness */
  height: 100%; /* Full height */
  background-color: blue;
  margin-right: 10px; /* Adjust spacing */
  border-radius: 5px;
}
.bg-lightblue {
  background-color: #dde4ff;
  border-radius: 20px;
}
.Vector_class{
  max-width: 60px;
}
.blue_bckg {
  background-color: #4E5BF8;
  color: #E8E5E5;
  border-radius: 20px;
  height: 100%;
}

  .custom-list {
    list-style-type: disc;
    padding-left: 1.5rem;
  }

    .custom-list1 li::marker {
    color: #2528CB;
    font-size: 1.5rem; /* optional: to adjust bullet size */
  }

  .custom-list li::marker {
    color: #2528CB;
    font-size: 1rem; /* optional: to adjust bullet size */
  }
.content {
  display: flex;
  flex-direction: column;
  padding: 10px;
  flex: 1; /* Ensures it takes up remaining space */
}
.logo_in {
  min-height: 0px !important;
}
.vol-cur{
  list-style-type: none;
  cursor: pointer
  ;
}
.sticky-section {
  position: sticky;
  top: 100px; /* Adjust based on your header height or desired offset */
  z-index: 10;
}

@media (max-width: 600px) {
.right-program{
  padding: 10px 15px 0px;
}
.no-padding-mobile {
    /* padding-left: 0 !important; */
    /* padding-right: 0 !important; */
    padding-right: 2%;
    padding-left: 2%;
  }

  .mobile-mar{
    margin: 0px !important;
  }
  .curr-mar{
    margin-left: 8px !important;
  }
  .container{
    margin: 17px;
  }
  .cou-jou{
    margin-left: 10px !important;
    font-size: xx-large;
  }
  .cur-bre{
    padding: 12px !important;
  }
  .blue_bckg{
    margin-right: 12px;
  }
  .custom-list2{
    padding-left: 19px;
  }
}
</style>
