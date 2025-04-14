<template>
  <div class="row q-px-md q-my-sm">
    <!-- Left Column -->
    <div class="col-12 col-md-8">
      <div class="row card-row q-col-gutter-md q-mb-md wrap">

        <!-- Attendance Card -->
        <div class="col-6 col-sm-3 col-lg-3 margin-bottom">
          <div class="box card-fixed-height" card-fixed-height>
            <attendance-card @click="handleDemoUserAccess()"/>
          </div>
        </div>
        <!-- Assignment Card -->
        <div class="col-6 col-sm-3 col-lg-3 margin-bottom">
          <div class="box card-fixed-height">
            <assignment-card />
          </div>
        </div>
        <!-- Hackathon Card -->
        <div class="col-6 col-sm-3 col-lg-3 margin-bottom">
          <div class="box card-fixed-height" @click="handleDemoUserAccess()">
            <hackathon-card />
          </div>
        </div>
        <!-- Lab Report Card -->
        <div class="col-6 col-sm-3 col-lg-3 margin-bottom">
          <div class="box card-fixed-height">
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
import { mapState } from "pinia";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";

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
  data() {
    return {
      showPopup: false,
    };
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
  /* width: 90% !important; */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
    /* align-items: center;
    gap: 1rem; */
  }

  .profile-column {
    margin-left: 0 !important;
  }
}

@media (max-width: 768px) {
  .card-row {
    flex-wrap: wrap !important;
    flex-direction: row !important;
    justify-content: center;
  }

  .card-row > .col-6 {
    max-width: 45%;
    flex: 0 0 45%;
  }

  .profile-column {
    margin-left: 0 !important;
  }
}


.card-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.card-fixed-height {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Make sure all cards take equal height on small screens too */
@media (max-width: 768px) {
  .card-row {
    flex-wrap: wrap !important;
    flex-direction: row !important;
    justify-content: center;
  }

  .card-row > .col-6 {
    max-width: 45% !important;
    flex: 0 0 45% !important;
  }

  .card-fixed-height {
    height: 100% !important;
  }
}


</style>
