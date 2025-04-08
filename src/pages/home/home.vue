<template>
  <div class="row q-px-md q-my-sm">
    <!-- Left Column -->
    <div class="col-12 col-md-8">
      <div class="row w-100">
        <!-- Attendance Card -->
        <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
          <div class="box">
            <attendance-card @click="handleDemoUserAccess()"/>
          </div>
        </div>
        <!-- Assignment Card -->
        <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
          <div class="box">
            <assignment-card />
          </div>
        </div>
        <!-- Hackathon Card -->
        <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
          <div class="box" @click="handleDemoUserAccess()">
            <hackathon-card />
          </div>
        </div>
        <!-- Lab Report Card -->
        <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
          <div class="box">
            <labReport />
          </div>
        </div>
      </div>

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
import { ref } from "vue";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import { storeToRefs } from "pinia";

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
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    const showPopup = ref(false);

    // Reusable guest check
    const handleDemoUserAccess = () => {
      if (user.value?.roles?.[0]?.name === "Guest") {
        showPopup.value = true;
        return true; // Block access
      }
      return false; // Allow access
    };

    return {
      user,
      showPopup,
      handleDemoUserAccess,
    };
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

.box {
  width: 90% !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .profile-column {
    margin-left: 0 !important;
  }
}
</style>
