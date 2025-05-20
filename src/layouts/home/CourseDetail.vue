<template>
  <q-layout view="lHh Lpr lFf " style="min-height: unset">
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
            <q-img :src="new_logo1" style="width: 280px;" ></q-img>
          </q-item>
        </div>

        <!-- <q-input
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
        </q-input> -->
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

  <div class="course-detail q-pa-md">

    <!-- image plus text -->
    <q-card v-if="course" class="q-pa-lg shadow-2 rounded-borders">
      <div class="row q-col-gutter-lg items-start common" style="display: flex;align-items: center;">
        <!-- Left Column: Text Content -->
        <div class="col-12 col-md-6 ">

          <div>
            <h4 class="text-h4 text-bold q-mb-none">{{ course.categoryName }}</h4>
            <p class="text-body2 text-grey-8 inn q-mb-none">
              {{ course.description }}
            </p>
        <div class="row q-gutter-sm items-center">
  <div class="row items-center q-pa-sm bg-blue-1 text-black rounded button" style="padding: 8px 12px;">
    <q-icon name="lightbulb" class="q-mr-sm" />
    <span class="text-body2"><strong>Eligibility:</strong> Any Degree</span>
  </div>
  <div class="row items-center q-pa-sm bg-blue-1 text-black rounded button" style="padding: 8px 12px;">
    <q-icon name="event" class="q-mr-sm" />
    <span class="text-body2"><strong>Deadline:</strong> 3 Months</span>
  </div>
</div>

          </div>
           <q-btn
              label="Enroll now"
              color="primary"
              class="col-auto buttonn"
              unelevated
              rounded
              :to="'/register'"
              tag="router-link"
            />

        </div>


        <!-- Right Column: Image & Email Input -->
        <div class="col-12 col-md-6 q-mt-md imagee">
          <q-img
            :src="course.imagePath"
            alt="Course Image"
            style="max-height: 350px; object-fit: cover;"
            class="rounded-borders "
          />

          <div class="row q-mt-md q-gutter-sm items-center">
            <!-- <q-input
              dense
              outlined
              placeholder="Your Email"
              class="col"
            /> -->
            <!-- <q-btn
              label="Enroll now"
              color="primary"
              class="col-auto"
              unelevated
              rounded
            /> -->
          </div>
        </div>
      </div>
    </q-card>

    <q-card v-else class="q-pa-md">
      <q-card-section class="text-center">
        <q-spinner color="primary" size="md" />
        <p>Loading course details...</p>
      </q-card-section>
    </q-card>
    <!-- Add this after the main course card ends -->

<q-card v-if="course" class="q-pa-lg q-mt-lg">
  <!-- About Course Section -->
  <div class="common">
    <h5 class="text-h6 text-bold q-mb-sm">About Course</h5>
    <p class="text-body2 text-grey-8">
      ScaleGrad offers a comprehensive fintech education platform designed to equip students and professionals with the skills needed to thrive in the rapidly evolving financial technology sector. The courses cover a wide range of topics, including the fundamentals of fintech, disruptive technologies like AI and blockchain, and specialized areas such as electronic trading and wealth management. Through a blend of virtual instructor-led training, recorded sessions, and hands-on projects, learners gain both theoretical knowledge and practical experience. The curriculum is crafted by industry experts to ensure relevance and applicability in real-world scenarios, providing learners with a solid foundation to navigate the fintech landscape.
    </p>
    <p class="text-body2 text-grey-8">   In addition to the core curriculum, ScaleGrad emphasizes experiential learning through capstone projects and internships that simulate real-world fintech challenges. The platform offers access to exclusive labs, AI-powered assistance, and a wealth of resources to support continuous learning. Furthermore, ScaleGrad provides placement assistance, including mock interviews and mentorship, to help learners transition into successful fintech careers. By combining technical training with career support, ScaleGrad aims to be a one-stop solution for those aspiring to make a mark in the fintech industry.
</p>

  </div>

  <!-- Completion Goals Section -->
  <div class="q-mt-xl common">
    <h5 class="text-h6 text-bold q-mb-md">
      After Completing this Course You Will Be Able To
    </h5>
    <ul class="q-pl-none">
      <li v-for="(point, index) in learnings" :key="index" class="row items-start q-mb-sm">
        <q-icon name="lens" size="8px" color="primary" class="q-mt-xs q-mr-sm" />
        <span class="text-body2 text-grey-9">{{ point }}</span>
      </li>
    </ul>
  </div>
</q-card>
<!-- What will I learn in this accelerator? -->
<q-card class="q-mt-lg q-mb-lg">
  <q-card-section class="common">
    <h4 class="text-h6 text-weight-bold q-mb-md common">
      What will I learn in this accelerator?
    </h4>

<q-expansion-item
  v-for="(faq, index) in faqs"
  :key="index"
  :label="faq.question"
  expand-separator
  header-class="text-weight-medium items-center"
  expand-icon-class=""
>
  <ul class="q-pl-none q-pb-xs">
    <li
      v-for="(point, idx) in faq.answerList"
      :key="idx"
      class="row items-start q-mb-sm"
    >
      <q-icon name="lens" size="8px" color="primary" class="q-mt-xs q-mr-sm" />
      <span class="text-body2 text-grey-9">{{ point }}</span>
    </li>
  </ul>
</q-expansion-item>


  </q-card-section>
</q-card>


  </div>
  </q-layout>
</template>


<script>
import bg_img from "src/assets/scalefradepng1.png";
import new_logo from "src/assets/new_logo1.svg";
import new_logo1 from "src/assets/ScaleGrad_blue.svg"
export default {
  name: 'CourseDetail',
  data() {
    return {
       new_logo1:new_logo1,

      course: null,
      learnings: [
        'Grasp the fundamentals of financial technology, including digital payments, blockchain, robo-advisors, and open banking.',
        'Gain hands-on experience with tools and platforms used in electronic trading, digital lending, and wealth tech solutions.',
        'Learn how to utilize data analytics, artificial intelligence, and machine learning to drive financial decision-making and innovation.',
        'Develop and prototype fintech solutions using programming, APIs, and cloud-based services aligned with industry use cases.',
        'Understand key compliance, cybersecurity, and regulatory frameworks that govern fintech ecosystems globally.',
        'Build a job-ready profile with capstone projects, mock interviews, and mentorship.'
      ],
   faqs: [
  {
    question: 'What foundational skills will I gain from this accelerator?',
    answerList: [
      'You’ll learn the core principles of fintech, including digital finance, emerging technologies, and market structure.',
      'You’ll understand how traditional finance is being disrupted and reimagined.',
      'The program builds a strong base in both theory and application to help you confidently navigate the fintech space.'
    ]
  },
  {
    question: 'Will I get hands-on experience with real-world tools and projects?',
    answerList: [
      'It acts as filler content for prototypes and wireframes.',
      'You’ll work on live case studies and build fintech prototypes under expert guidance.',
      'Capstone projects simulate real-world scenarios to prepare you for job-ready execution.'
    ]
  },
  {
    question: 'How does this accelerator prepare me for a fintech career?',
    answerList: [
      'You’ll gain job-oriented skills aligned with roles like fintech analyst, product associate, or data strategist.',
      'Mock interviews, resume building, and mentorship sessions are part of the career support module.',
      'By the end, you’ll have a professional portfolio and the confidence to step into the fintech industry.'
    ]
  }
],

 bg_img,
      leftDrawerOpen: false,
      new_logo,

    };



  },
  mounted() {
    this.fetchCourse();
  },
  methods: {
    async fetchCourse() {
      try {
        const id = this.$route.params.id;
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const response = await fetch(`${baseUrl}api/chapterCategoriess/free`);

        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }

        const data = await response.json();
        const found = data.find(course => course.id.toString() === id);

        if (!found) {
          console.warn('Course not found with id:', id);
          return;
        }

        let imageUrl = found.imagePath;

        if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
          const filename = imageUrl.replace(`${baseUrl}fs/download/`, '');
          const formData = new FormData();
          formData.append('filename', filename);

          const imageRes = await fetch(`${baseUrl}fs/download`, {
            method: 'POST',
            body: formData
          });

          if (imageRes.ok) {
            const blob = await imageRes.blob();
            imageUrl = window.URL.createObjectURL(blob);
          } else {
            imageUrl = require('@/assets/dummy_book.png'); // fallback
          }
        }

        this.course = {
          ...found,
          imagePath: imageUrl
        };

      } catch (error) {
        console.error('Error fetching course:', error);
      }
    },
  },
};
</script>


<style scoped>
.course-detail {
  max-width: 96%;
  margin: 0 auto;
}
.rounded-borders {
  border-radius: 12px;
}
.q-expansion-item__content ul {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  list-style: none;
}

.q-expansion-item__content li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.q-expansion-item__content li span {
  white-space: normal;
  color: #333;
}
ul.list-disc {
  list-style-type: disc !important;
  padding-left: 1.5rem !important; /* ensure space for bullet */
}

.inn{
  margin-top: 10px !important;
  padding-right: 10% !important;
  padding-bottom: 8px;
}
.imagee
{
  padding-right:1.5% !important;
}
/* .button {
  padding: 8px 12px;
  align-items: center;
} */

.button
{
  margin-top: 2%;
  border-radius: 10px !important ;
}
.buttonn
{
   margin-top: 4%;
  border-radius: 10px !important ;

}
.logo_in {
  min-height: 0px !important;
}
.common
{
  padding-left: 1.3% !important;
}

</style>
