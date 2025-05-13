<template>
  <div class="row q-px-md q-my-sm">
    <!-- Left Column -->

    <div class="col-12 col-md-8">
       <div class="d-none d-sm-flex row w-100 web_view">
    <div class="col-12 col-sm-3 col-lg-3 margin-bottom" v-for="(card, index) in cards" :key="index">
      <div class="box" @click="card.onClick">
        <component :is="card.component" />
      </div>
    </div>
  </div>

  <!-- Mobile Carousel -->
  <swiper
  class="d-block d-sm-none mobile_view"
  :slides-per-view="1.2"
  :space-between="10"
  :loop="true"
  :centered-slides="true"
>
    <swiper-slide v-for="(card, index) in cards" :key="index">
      <div class="box" @click="card.onClick">
        <component :is="card.component" />
      </div>
    </swiper-slide>
  </swiper>

      <!-- MostPopular & RecentlyViewed in One Row -->
      <div class="row w-100">
        <MostPopular />
        <RecentlyViewed class="q-mt-md" />
      </div>
    </div>

    <!-- Right Column -->
    <div class="col mb-3 profile-column q-ml-md">
      <profile-card />
      <NotifCard class="q-mt-md" />
      <ClassCard class="q-mt-md" />
      <ChatsCard class="q-my-md" />
    </div>

    <!-- DemoUserPopUp -->
    <DemoUserPopUp v-if="showPopup" @close="showPopup = false" />
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
// Components
import AttendanceCard from "src/pages/home/attendance.vue";
import MostPopular from "src/pages/home/mostPopular.vue";
import LabReport from "src/pages/home/labReport.vue";
import AssignmentCard from "src/pages/home/assignmentCard.vue";
import HackathonCard from "src/pages/home/hackathonCard.vue";
import ProfileCard from "src/pages/home/profileCard.vue";
import NotifCard from "src/pages/home/notifications.vue";
import ClassCard from "src/pages/home/ClassSched.vue";
import ChatsCard from "src/pages/home/ChatsCard.vue";
import RecentlyViewed from "src/pages/home/recentlyViewed.vue";
import DemoUserPopUp from "src/layouts/DemoUserPopUp.vue";

export default {
  name: "Home",
  components: {
    AttendanceCard,
      Swiper,
    SwiperSlide,
    AssignmentCard,
    HackathonCard,
    MostPopular,
    LabReport,
    DemoUserPopUp,
    ProfileCard,
    RecentlyViewed,
    NotifCard,
    ClassCard,
    ChatsCard,
  },
  data() {
    return {
      showPopup: false,
       cards: []
    };
  },
  created() {
    // Initialize cards in `created()` so `this` is available
    this.cards = [
      { component: 'AttendanceCard', onClick: this.handleDemoUserAccess },
      { component: 'AssignmentCard', onClick: null },
      { component: 'HackathonCard', onClick: this.handleDemoUserAccess },
      { component: 'LabReport', onClick: null }
    ]
  },
  computed: {
    ...mapState(useProfileStore, ["user"]),
  },
  methods: {
    handleDemoUserAccess() {
      if (this.user?.roles?.[0]?.name === "Guest") {
        this.showPopup = true;
        return true;
      }
      return false;
    },
  },
};
</script>


<style scoped>
@font-face {
  font-family: "Poppins";
  src: url("@/assets/fonts/Poppins/Poppins-ExtraBold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
}

.mobile_view{
  display: none;
}

.box {
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.home {
  font-family: "Poppins";
  text-align: left;
  margin-left: 1%;
}

h3 {
  font-size: x-large;
  color: #141414;
  font-weight: 600;
}

.margin-bottom {
  margin-bottom: 1rem;
}



@media (max-width: 768px) {
  .row {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .box {
  padding: 10px;
  background: #fff;
  border: 1px solid #f6f6f6;
   width: 92%;
  margin-left: 1%;
  margin-right: 4%;
  margin-bottom: 2%;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
  .mobile_view{
  display: block;
}
 .web_view{
  display: none;
 }

  .profile-column {
    margin-left: 0 !important;
  }
}
</style>
