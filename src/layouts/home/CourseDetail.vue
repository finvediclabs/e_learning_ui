<template>
  <q-layout view="lHh Lpr lFf " style="background-color: #f1f3ff">


 <q-page-container>
  <div class="q-my-md q-px-xl">
  <span class="routing_class">
    <q-icon
      name="home"
      @click="$router.push('/')"
      style="cursor: pointer; color: blue"
      class="q-mr-xs"
    />
    <span
      @click="$router.push('/')"
      style="cursor: pointer; color: blue; vertical-align: middle;"
    >
      Home
    </span>
    &nbsp; > &nbsp; View Course
  </span>
</div>

      <div class="container fintech-container row q-mx-xl">
<!-- Entire row can be conditionally rendered -->
<div
  class="row q-py-xl justify-around items-center in-fintech-container"
  v-if="course"
  style="background-color: #ffff; border-radius: 20px; margin-left: auto; margin-right: auto; width: 100%;"
>
  <!-- Image Column -->
  <div
    :class="[
      'col-12',
      $q.screen.lt.md ? 'q-px-sm' : 'q-pl-sm q-px-sm',
      course.type === 'free' ? 'col-md-4' : 'col-md-2'
    ]"
  >
    <q-img
      :src="course.imagePath"
      class="imagee"
      style="border-radius: 15px"
    />
  </div>

  <!-- Text Content Column -->
  <div
    :class="[
      'col-12',
      'q-px-md-xl',
      'q-mt-md',
      'right-program',
      course.type === 'free' ? 'col-md-6' : 'col-md-8'
    ]"
  >
    <div class="text-bold q-mb-lg text-h4 fin-heading" style="margin-bottom: 2%;">
      {{ course.categoryName }}
    </div>

    <p class="text-grey">{{ course.description }}</p>

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
    <span class="text-h4 text-bold">Our Course Highlights</span>

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

    <div v-if="selectedTab === 'Virtual Labs'">
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

  <!-- Grow Section -->
<div class="container Grow-container q-mx-xl q-my-xl">
  <!-- Top Heading & Button Row -->
  <div class="row items-center justify-between">
    <span class="text-h4 text-bold">
      Grow Your Knowledge from <br />Best Teachers in the Industry
    </span>
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
  <div class="row q-col-gutter-md q-gutter-y-md items-center in-fintech-container q-mt-md" style="border-radius: 20px;">
  <!-- Left Image Column -->
  <div class="col-12 col-md-7 q-px-sm grow-img">
    <q-img
      :src="hero_footer"
      :ratio="5 / 3"
      style="border-radius: 15px; width: 100%; height: auto;"
    />
  </div>

  <!-- Right Grid Cards Column -->
  <div class="col-12 col-md-5 q-pt-xl">
    <div
  class="row q-gutter-y-md"
  :class="$q.screen.lt.md ? 'q-col-gutter-xs' : 'q-col-gutter-sm'"
  style="row-gap: 3rem;"
>

      <div
        v-for="(card, index) in teacherCards"
        :key="index"
        class="col-6"
      >
        <div class="column items-center">
          <!-- Avatar Above Card -->
          <q-avatar
  size="50px"
  class="bg-white shadow-4"
  style="margin-top: -60px; z-index: 2; position: relative; overflow: hidden;"
>
  <img
    :src="`src/assets/teacher${index + 1}.png`"
    alt="Teacher"
    style="width: 100%; height: 100%; object-fit: cover;"
  />
</q-avatar>


          <!-- Card with Details -->
          <q-card
  class="q-pt-xl q-px-sm q-pb-md text-center shadow-2"
  style="
    border-radius: 12px;
    margin-top: -30px;
    width: 100%;
    max-width: 250px; /* increased from 220px to 250px */
  "
>

            <div class="text-bold text-subtitle2 q-mb-xs">
              {{ card.subtitle }}
            </div>
            <div class="text-grey text-caption">
              {{ card.title }}
            </div>
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
import bg_img from "src/assets/scalefradepng1.png";
import new_logo from "src/assets/new_logo1.svg";
import new_logo1 from "src/assets/ScaleGrad_blue.svg";
import finAssociate_hero from "src/assets/FinAssociate_hero.png";
import hero_footer from "src/assets/Hero_Footer.png";
export default {
  name: 'CourseDetail',
  data() {
    return {
       new_logo1:new_logo1,
selectedTab: 'Virtual Labs',
openedIndex: 0,
       openedIndex1: 0,
       openedIndex2: 0,
      openedIndex3: 0,
      finAssociate_hero:finAssociate_hero,
      hero_footer:hero_footer,
       teacherCards: [
      {
        subtitle: '4+ Teachers',
        title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum.`
      },
      {
        subtitle: '430+ Hours Lessons',
        title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum.`
      },
      {
        subtitle: '1-on-1 Coaching',
        title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum.`
      },
      {
        subtitle: 'Online Community',
        title: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum.`
      }
    ],

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
      tabs: [

        { name: 'Virtual Labs', label: 'Virtual Labs' },
        { name: 'Course Prerequisotes', label: 'Course Prerequisotes' },
        { name: 'Special Features', label: 'Special Features' },
        { name: 'Certification', label: 'Certification' },
        { name: 'Career Opportunities', label: 'Career Opportunities' }
      ],
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
  computed: {
  imageColClass() {
    return [
      'col-12',
      this.$q.screen.lt.md ? 'q-px-sm' : 'q-pl-sm q-px-sm',
      this.course?.type === 'free' ? 'col-md-4' : 'col-md-2',
    ];
  },
  textColClass() {
    return [
      'col-12',
      'q-px-md-xl',
      'q-mt-md',
      'right-program',
      this.course?.type === 'free' ? 'col-md-6' : 'col-md-8',
    ];
  },
},
  mounted() {
    this.fetchCourse();
  },
  methods: {
 async fetchCourse() {
  try {
    const id = this.$route.params.id;
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const response = await fetch(`${baseUrl}api/chapterCategoriess/all`);

    if (!response.ok) {
      throw new Error('Failed to fetch course data');
    }

    const data = await response.json();
    const found = data.find(course => course.id.toString() === id);

    if (!found) {
      console.warn('Course not found with id:', id);
      return;
    }

    // Fix: Use `found`, not `course` here:
    if (found.categoryName === 'Specialization') {
      found.categoryName = 'Equities & Electronic Trading';
    }

    let imageUrl = found.imagePath;

    if (imageUrl && imageUrl.startsWith(`${baseUrl}fs/download/`)) {
      const filename = imageUrl.replace(`${baseUrl}fs/download/`, '');
      const formData = new FormData();
      formData.append('filename', filename);

      const imageRes = await fetch(`${baseUrl}fs/download`, {
        method: 'POST',
        body: formData,
      });

      if (imageRes.ok) {
        const blob = await imageRes.blob();
        imageUrl = window.URL.createObjectURL(blob);
      } else {
        imageUrl = require('@/assets/dummy_book.png'); // fallback image
      }
    }

    this.course = {
      ...found,
      imagePath: imageUrl,
    };

  } catch (error) {
    console.error('Error fetching course:', error);
  }
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
  /* padding-right:1.5% !important; */
  width: 100% !important;
}
/* .button {
  padding: 8px 12px;
  align-items: center;
} */
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
