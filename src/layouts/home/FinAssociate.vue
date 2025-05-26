<template>
  <q-layout view="lHh Lpr lFf" style="background-color: #f1f3ff">
    <!-- Navigation Bar -->

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

      <div class="container fintech-container row q-mx-xl" >
  <div class="row q-py-xl justify-around items-center in-fintech-container" style="background-color: #ffff;border-radius: 20px;">

    <!-- Image Column -->
    <div
      class="col-12 col-md-5"
      :class="$q.screen.lt.md ? 'q-px-sm' : 'q-pl-sm q-px-sm'"
    >
      <q-img
        :src="course_img"
        :ratio="16 / 9"
        style="border-radius: 15px"
      />
    </div>

    <!-- Text Content Column -->
    <div class="col-12 col-md-5 q-px-md-xl q-mt-md right-program">
      <div class="text-bold q-mb-lg text-h4 fin-heading" style="margin-bottom: 2%;">
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
 <div class="container q-mx-xl q-mt-lg">
    <span class="text-h4 text-bold">Our Certification Highlights</span>

    <!-- 6 Buttons in one row -->
    <div class="q-mt-md row q-gutter-sm">
      <q-btn
       v-for="(tab, index) in tabs"
        :key="index"
        class="q-px-xl q-py-sm"
        @click="selectedTab = tab.name"
        :class="['tab-btn', selectedTab === tab.name ? 'selected' : 'unselected']"
        no-caps
        >
        {{ tab.label }}
      </q-btn>
    </div>
  </div>

  <div class="container first-box row q-mx-xl q-mt-lg" style="background-color: #ffff;border-radius: 20px;">
    <!-- Dynamic content -->
     <div class="col-8 row q-py-lg q-pl-lg">
    <div v-if="selectedTab === 'The Curriculum'">
      <div class="row">
      <div class="col-12">
        <ul>
        <li class="text-bold text-h5 vol-cur blue-circle q-mb-md" @click="toggleCurriculum(1)"> V1. Fintech & Financial Landscape

          <ul class="custom-list q-pb-md q-ml-xl q-mt-sm" v-show="activeCurriculum === 1">
  <li class="text-h6 q-mt-sm">M1. Unlocking Finance: A Beginner’s Guide</li>
  <li class="text-h6 q-mt-sm">M2. Banking Unveiled: A Primer</li>
  <li class="text-h6 q-mt-sm">M3. Navigating Digital Banking: An Intro</li>
  <li class="text-h6 q-mt-sm">M4. Discovering Fintech: The Essentials</li>
  <li class="text-h6 q-mt-sm">M5. Agile-Powered Software Delivery Journey</li>
</ul>
        </li>
<li class="text-bold text-h5 vol-cur  blue-circle q-mb-md" @click="toggleCurriculum(2)"> V2. Disruptive Technologies

  <ul class="custom-list q-pb-md q-ml-xl q-mt-sm " v-show="activeCurriculum === 2">
  <li class="text-h6 q-mt-sm">M1. Distributed Systems</li>
  <li class="text-h6 q-mt-sm">M2. The Power of Open API & Microservices</li>
  <li class="text-h6 q-mt-sm">M3. Cloud Computing and Azure Cloud Provider</li>
  <li class="text-h6 q-mt-sm">M4. Leveraging AI & Machine Learning</li>
  <li class="text-h6 q-mt-sm">M5. Blockchain and the Revolution of Smart Contracts in FinTech.</li>
</ul>
</li>
<li class="text-bold text-h5 vol-cur  blue-circle" @click="toggleCurriculum(3)"> V3. Equity Electronic Trading

  <ul class="custom-list q-pb-md q-ml-xl q-mt-sm q-mb-md" v-show="activeCurriculum === 3">
    <li class="text-h6 q-mt-sm" >Introduction to Equity Trading</li>
  <li class="text-h6 q-mt-sm">Fundamentals of Equity Markets</li>
  <li class="text-h6 q-mt-sm">Equity Orders and Execution</li>
  <li class="text-h6 q-mt-sm">Electronic Trading Strategies</li>
  <li class="text-h6 q-mt-sm">FIX Protocol for Exchange Connectivity</li>
</ul>
</li>

        </ul>
      </div>
    </div>

    </div>
    <div v-else-if="selectedTab === 'Virtual Labs'">
       <div class="row" >
    <div class="col-12" >
      <ul >
       <li
  v-for="(item, index) in features"
  :key="index"
  class="text-bold text-h5 vol-cur q-mb-md"
>
  <div
    class="items-center q-mb-xs"
    @click="toggle(index)"
    style="cursor: pointer; display: flex; align-items: center;"
  >
    <div class="text-h5 text-bold blue-circle q-mt-sm"> {{ item.title }}</div>
  </div>

  <div
    @click="toggle(index)"
    v-if="openedIndex === index"
    class="q-ml-lg q-mr-sm q-mb-md text-h6 text-grey-8"
  >
    <i> {{ item.description }}</i>
  </div>
</li>

      </ul>
    </div>
  </div>

    </div>
    <div v-else-if="selectedTab === 'Course Prerequisotes'">
        <div class="row" >
    <div class="col-12" >
      <ul >
       <li
  v-for="(item, index1) in features1"
  :key="index1"
  class="text-bold text-h5 vol-cur q-mb-md"
>
  <div
    class="items-center q-mb-xs"
    @click="toggle1(index1)"
    style="cursor: pointer; display: flex; align-items: center;"
  >
    <div class="text-h5 text-bold blue-circle q-mt-sm"> {{ item.title }}</div>
  </div>

  <div
    @click="toggle1(index1)"
    v-if="openedIndex1 === index1"
    class="q-ml-lg q-mr-sm q-mb-md text-h6 text-grey-8"
  >
    <i> {{ item.description }}</i>
  </div>
</li>

      </ul>
    </div>
  </div>
    </div>
    <div v-else-if="selectedTab === 'Special Features'">
      <div class="row" >
    <div class="col-12" >
      <ul >
       <li
  v-for="(item, index2) in features2"
  :key="index2"
  class="text-bold text-h5 vol-cur q-mb-md"
>
  <div
    class="items-center q-mb-xs"
    @click="toggle2(index2)"
    style="cursor: pointer; display: flex; align-items: center;"
  >
    <div class="text-h5 text-bold blue-circle q-mt-sm"> {{ item.title }}</div>
  </div>

  <div
    @click="toggle2(index2)"
    v-if="openedIndex2 === index2"
    class="q-ml-lg q-mr-sm q-mb-md text-h6 text-grey-8"
  >
    <i> {{ item.description }}</i>
  </div>
</li>

      </ul>
    </div>
  </div>
    </div>
    <div v-else-if="selectedTab === 'Certification'">
      <div class="row" >
    <div class="col-12" >
      <ul >
       <li class="text-bold text-h5 vol-cur q-mb-md blue-circle">Industry-recognized certification</li>
       <li class="text-bold text-h5 vol-cur q-mb-md blue-circle">Enhanced career prospects</li>
      </ul>
    </div>
  </div>
    </div>
    <div v-else-if="selectedTab === 'Career Opportunities'">
     <div class="row" >
    <div class="col-12" >
      <ul >
       <li
  v-for="(item, index3) in features3"
  :key="index3"
  class="text-bold text-h5 vol-cur q-mb-md"
>
  <div
    class="items-center q-mb-xs"
    @click="toggle3(index3)"
    style="cursor: pointer; display: flex; align-items: center;"
  >
    <div class="text-h5 text-bold blue-circle q-mt-sm"> {{ item.title }}</div>
  </div>

  <div
    @click="toggle3(index3)"
    v-if="openedIndex3 === index3"
    class="q-ml-lg q-mr-sm q-mb-md text-h6 text-grey-8"
  >
    <i> {{ item.description }}</i>
  </div>
</li>

      </ul>
    </div>
  </div>
    </div>
    </div>
    <div class="col-4 row q-pr-lg q-py-lg">
      <q-img :src="finAssociate_hero" width="100%"></q-img>
    </div>
  </div>

  <!-- Equities -->
<div class="container equities-container q-mx-xl q-mt-xl">
  <span class="text-h4 text-bold q-mb-lg">What are Equities</span>

  <!-- Wrapper for horizontal layout -->
  <div
    class="q-pa-xl q-mt-md q-mb-md q-mx-auto"
    style="background-color: #fff; border-radius: 20px;"
  >
    <div
      class="row q-col-gutter-md q-gutter-y-md items-center"
      :class="$q.screen.lt.md ? 'column' : 'row'"
    >
<!-- Image Column -->
<div
  class="col-12"
  :style="$q.screen.lt.md ? '' : 'flex-basis: 20%; max-width: 20%; text-align: center;'"
>
  <div style="aspect-ratio: 10 / 16; max-width: 200px; margin: auto;">
    <img
      :src="Equities"
      style="width: 100%; height: 100%; object-fit: fill; border-radius: 15px;"
      alt="Equities"
    />
  </div>
</div>



      <!-- Text Column -->
      <div
        class="col-12 q-pl-xl"
        :style="$q.screen.lt.md ? '' : 'flex-basis: 80%; max-width: 80%;'"
      >
        <div class="text-bold q-mb-lg text-h4 fin-heading">
          What are Equities
        </div>

        <p class="text-grey">{{ description }}</p>
        <p class="text-grey">{{ description }}</p>

        <q-btn
          class="q-px-xl q-py-md text-weight-regular shadow-5"
          noCaps
          unelevated
          label="Get Started"
          :to="'/register'"
          color="#fff"
          style="background-color: #443ede; border-radius: 10px;"
        />
      </div>
    </div>
  </div>
</div>
  <!-- Course Curriculum-->
<div class="container Course-Curr-container q-mx-xl q-mt-xl">
  <span class="text-h4 text-bold q-mb-lg">Course Curriculum Container</span>

  <!-- Wrapper for horizontal layout -->
  <div
    class="q-pa-xl q-mt-md q-mb-md q-mx-auto"
    style="background-color: #fff; border-radius: 20px;"
  >
    <div
      class="row q-col-gutter-md q-gutter-y-md items-center"
      :class="$q.screen.lt.md ? 'column' : 'row'"
    >
          <!-- Text Column -->
          <div
        class="col-12 q-pl-xl"
        :style="$q.screen.lt.md ? '' : 'flex-basis: 75%; max-width: 75%;'"
      >
        <div class="text-bold q-mb-lg text-h5 fin-heading">
          Fintech and Financial Services Landscape
        </div>

        <p class="text-grey">{{ description }}</p>
        <div class="text-bold q-mb-lg text-h5 fin-heading">
          Disruptive Technologies
        </div>

        <p class="text-grey">{{ description }}</p>
        <div class="text-bold q-mb-lg text-h5 fin-heading">
          Equities and Electronic Trading
        </div>

        <p class="text-grey">{{ description }}</p>


      </div>
<!-- Image Column -->
<div
  class="col-12"
  :style="$q.screen.lt.md ? '' : 'flex-basis: 25%; max-width: 25%; text-align: center;'"
>
  <div >
    <img
      :src="Equities"
      style="width: 100%; height: 100%; object-fit: fill; border-radius: 15px;"
      alt="Equities"
    />
  </div>
</div>




    </div>
  </div>
</div>
  <!-- Grow-->

<!-- Grow Section -->
<div class="container Grow-container q-mx-xl q-my-xl">
  <!-- Top Heading & Button Row -->
  <div class="row items-center justify-between">
    <span class="text-h4 text-bold">Grow Your Knowledge from <br>Best Teachers in the Industry</span>
    <q-btn
      class="q-px-xl q-py-md text-weight-regular shadow-5"
      noCaps
      unelevated
      label="Get Started"
      :to="'/register'"
      color="#fff"
      style="background-color: #443ede; border-radius: 10px;"
    />
  </div>

<!-- Image + Cards Section -->
<div
  class="row  q-col-gutter-md q-gutter-y-md items-center in-fintech-container q-mt-md"
  style="border-radius: 20px;"
>
  <!-- Left Image Column -->
  <div class="col-12 col-md-6 q-px-sm grow-img">
    <q-img
      :src="course_img"
      :ratio="5 / 3"
      style="border-radius: 15px; width: 100%; height: auto;"
    />
  </div>

  <!-- Right Grid Cards Column -->
  <div class="col-12 col-md-6">
  <div class="row justify-center q-col-gutter-xl q-gutter-y-xl">
    <div v-for="(teacher, index) in 4" :key="index" class="col-12 col-sm-6 col-md-6 col-lg-5">
      <div class="column items-center">
        <!-- Avatar Above Card -->
        <q-avatar
          size="70px"
          class="bg-white shadow-4"
          style="margin-top: -70px; z-index: 2; position: relative;"
        >
          <img
            :src="`/path/to/teacher${index + 1}.jpg`"
            alt="Teacher"
            style="border-radius: 50%; object-fit: cover;"
          />
        </q-avatar>

        <!-- Card with Increased Height and Balanced Width -->
        <q-card
          class="q-pt-xl q-px-md q-pb-lg text-center shadow-3"
          style="border-radius: 15px; margin-top: -40px; min-height: 150px; width: 100%; "
        >
          <div class="text-bold text-subtitle1 q-mb-sm">Teacher {{ index + 1 }}</div>
          <div class="text-grey text-caption">Expert in Subject</div>
        </q-card>
      </div>
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
import Equities from "../../assets/Equities.png";
import new_logo from "src/assets/new_logo1.svg";
import finAssociate_hero from "src/assets/FinAssociate_hero.png";
import new_logo1 from "src/assets/ScaleGrad_blue.svg";

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
      Equities: Equities,
      Oppertunities: Oppertunities,
      image_curriculum: image_curriculum,
      Features: Features,
      Certification: Certification,
      Prerequisotes: Prerequisotes,
      Our_labs: Our_labs,
      new_logo1:new_logo1,
      finAssociate_hero: finAssociate_hero,
      pin: pin,
      heading: "",
      description: "",
      eligibility: "",
      courseFee: "",
      learning_journey: learning_journey,
      new_logo: new_logo,
plus_sign: plus_sign,
  selectedTab: 'The Curriculum',
      tabs: [
        { name: 'The Curriculum', label: 'The Curriculum' },
        { name: 'Virtual Labs', label: 'Virtual Labs' },
        { name: 'Course Prerequisotes', label: 'Course Prerequisotes' },
        { name: 'Special Features', label: 'Special Features' },
        { name: 'Certification', label: 'Certification' },
        { name: 'Career Opportunities', label: 'Career Opportunities' }
      ],
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
      activeCurriculum: 1,

       openedIndex: 0,
       openedIndex1: 0,
       openedIndex2: 0,
      openedIndex3: 0,
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

.tab-btn {
  /* padding: 10px 18px; */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s ease;
}
.selected {
  background-color: #4E5BF8;
  color: white;
}
.unselected {
  background-color: #8C95FF;
  color: black;
}
.tab-btn:hover {
  opacity: 0.9;
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
.blue-circle::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #007bff; /* Bootstrap blue */
  border-radius: 5px;
  margin-right: 8px;
  vertical-align: middle;
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
.equities-img{
  object-fit: fill !important;
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
    overflow-x: hidden !important;
  }
  .curr-mar{
    margin-left: 8px !important;
  }
  .container{
    margin: 17px;
  }
  .cou-jou{
    margin-left: 10px !important;
    font-size: x-large;
    margin: 24px 0px;
  }
  .cur-bre{
    padding: 12px !important;
  }
  .blue_bckg{
    margin-right: 12px;
    margin-bottom: 16px;
    margin-top: 0px;
  }
  .custom-list2{
    padding-left: 19px;
  }
  .learning_journey1{
    margin-left: 0px !important;
  }
  .labs_learning_journey{
    margin: 0px 10px !important;
  }
  .fintech-container{
    margin: 10px !important;
  }
  .in-fintech-container{
    padding: 20px 10px !important;
  }
  .fin-heading{
    font-size: 1.8rem;
  }
  .cert-opp{
    margin-top: 0px !important;
  }
  .curr-mar{
    margin-bottom: 35px;
  }
  .labs_container{
    margin-bottom: 35px;
  }
  .breakdown{
    padding: 20px 10px !important;
  }


}
</style>
