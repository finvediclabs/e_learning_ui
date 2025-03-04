<template >
  <div class="row q-px-md q-my-sm">
  <!-- Left Column -->
  <div class="col-12 col-md-8">
    <div class="row w-100">
      <!-- Attendance Card -->
      <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
        <attendance-card />
      </div>
      <!-- Assignment Card -->
      <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
        <assignment-card />
      </div>
      <!-- Hackathon Card -->
      <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
        <hackathon-card />
      </div>
      <div class="col-12 col-sm-3 col-lg-3 margin-bottom">
        <labReport />
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
</div>


</template>

<script>
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import AttendanceCard from "src/pages/home/attendance.vue";
import MostPopular from "src/pages/home/mostPopular.vue";
import labReport from "src/pages/home/labReport.vue";
import AssignmentCard from "src/pages/home/assignmentCard.vue";
import HackathonCard from "src/pages/home/hackathonCard.vue";
import ProfileCard from "src/pages/home/profileCard.vue";
import NotifCard from "src/pages/home/notifications.vue";
import ClassCard from "src/pages/home/ClassSched.vue";
import ChatsCard from "src/pages/home/ChatsCard.vue";
import RecentlyViewed from "src/pages/home/recentlyViewed.vue";
import { storeToRefs } from "pinia";

export default {
  components: {
    AttendanceCard,
    AssignmentCard,
    HackathonCard,
    MostPopular,
    labReport,
    ProfileCard,
    RecentlyViewed,
    NotifCard,
    ClassCard,
    ChatsCard
  },

  name: "Home",
  setup() {
    // Access session store
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    // Access profile store
    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    return {
      user,
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

@media (max-width: 768px){
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
