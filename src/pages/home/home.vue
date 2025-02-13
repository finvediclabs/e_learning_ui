<template>
  <div class="home">
    <h3>Welcome back {{ user?.name }}</h3>
  </div>
 <div class="row">
  <!-- Left Column -->
  <div class="col-12 col-md-8">
    <div class="row">
      <!-- Attendance Card -->
      <div class="col-12 col-sm-6 col-lg-4 margin-bottom">
        <attendance-card />
      </div>
      <!-- Assignment Card -->
      <div class="col-12 col-sm-6 col-lg-4 margin-bottom">
        <assignment-card />
      </div>
      <!-- Hackathon Card -->
      <div class="col-12 col-sm-6 col-lg-4 margin-bottom">
        <hackathon-card />
      </div>
    </div>
  </div>
  <!-- Right Column -->
  <div class="col-12 col-md-4 mb-3 mb-sm-3"></div>
</div>

</template>

<script>
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import AttendanceCard from "src/pages/home/attendance.vue";
import AssignmentCard from "src/pages/home/assignmentCard.vue";
import HackathonCard from "src/pages/home/hackathonCard.vue";
import { storeToRefs } from "pinia";

export default {
  components: {
    AttendanceCard,
    AssignmentCard,
    HackathonCard
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
</style>
