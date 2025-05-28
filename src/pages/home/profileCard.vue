<template>
  <div class="profile-container">
    <div class="header">
      <div class="profile-title">Your Profile</div>
      <!-- <q-icon name="more_vert" class="more-icon cursor-pointer" /> -->
    </div>
    <q-img :src="imageUrl || defaultProfileImg" class="profileImg cursor-pointer rounded" />
    <div class="greeting">{{ greeting }} {{ profile.name || "Guest" }}</div>

    <div class="leaderboard" v-if="topProfilesFetched.length">
  <div class="podium-container">
    <div :class="['podium', 'position-2']">
      <q-img :src="topProfiles" alt="ProPic" class="podium-pic podium-pic-2 rounded-circle" />
      <div class="profile-name" :title="topProfilesFetched[1]?.name || 'Unknown'">
  {{ topProfilesFetched[1]?.name || "Unknown" }}
</div>

      <div class="podium-poll">2nd<br><span class="points rounded-borders">{{ topProfilesFetched[1]?.points }} Pts</span></div>
    </div>
    <div :class="['podium', 'position-1']">
      <q-img :src="topProfiles" alt="ProPic" class="podium-pic podium-pic-1 rounded-circle" />
      <div class="profile-name" :title="topProfilesFetched[0]?.name || 'Unknown'">{{ topProfilesFetched[0]?.name || "Unknown" }}</div>
      <div class="podium-poll">1st<br><span class="points">{{ topProfilesFetched[0]?.points }} Pts</span></div>
    </div>
    <div :class="['podium', 'position-3']">
      <q-img :src="topProfiles" alt="ProPic" class="podium-pic podium-pic-3 rounded-circle" />
      <div class="profile-name" :title="topProfilesFetched[2]?.name || 'Unknown'">{{ topProfilesFetched[2]?.name || "Unknown" }}</div>
      <div class="podium-poll">3rd<br><span class="points">{{ topProfilesFetched[2]?.points }} Pts</span></div>
    </div>
  </div>
</div>
    <div v-else>
      <p>No leaderboard data available</p>
    </div>
  </div>
</template>

<script>
import { useProfileStore } from "src/stores/profile";
import { api } from "src/boot/axios";
import topProfiles from "src/assets/add-user.png";
import defaultProfileImg from "src/assets/profile.png";
import { useSessionStore } from "src/stores/session";
import { mapState, storeToRefs } from "pinia";


export default {
  name: "ProfileCard",
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const profileStore = useProfileStore();
    const currentUserId = profileStore.user.id || '';
    console.log("Current User Id:", currentUserId);

    return {
      userType,
      currentUserId,
    };
  },
  data() {
    return {
      profile: {},
      imageUrl: "",
      topProfiles: topProfiles,
      greeting: "",
      defaultProfileImg: defaultProfileImg,
      topProfilesStatic: [
  { name: "Harshitha", pic: topProfiles, points: 591 },
  { name: "R Shruthi", pic: topProfiles, points: 558 },
  { name: "Harhsa", pic: topProfiles, points: 460 },
],
topProfilesFetched: [],


    };
  },
  computed: {
    ...mapState(useProfileStore, ["user"]),
  },
  methods: {
    setGreeting() {
      const hour = new Date().getHours();
      this.greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    },
    async getUserData() {
      try {
        const response = await api.get(`api/users/${this.user.id}`);
        if (response.data.success) {
          const userData = response.data.data;
          this.profile = {
            name: userData.name,
            dob: userData.dob,
            graduationDegree: userData.graduationDegree,
            qualificationYear: userData.qualificationYear,
            specialization: userData.specialization,
            gender: userData.gender,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            role: userData.roles ? userData.roles[0] : [],
          };

          if (
            this.user.type === "Student" &&
            Object.values(this.profile).some((value) => value === null || value === undefined)
          ) {
            this.$router.push("/profile");
          }

          this.fetchProfileImage(userData.uploadDocumentPath);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error(error.response?.data.message || error.message);
      }
    },
    async fetchProfileImage(uploadDocumentPath) {
      if (!uploadDocumentPath) {
        this.imageUrl = "";
        return;
      }

      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
        const filename = uploadDocumentPath.replace(baseUrl + "fs/download/", "");
        const formData = new FormData();
        formData.append("filename", filename);

        const imageResponse = await api.post(baseUrl + "fs/download", formData, {
          responseType: "blob",
        });

        this.imageUrl = URL.createObjectURL(imageResponse.data);
      } catch (error) {
        console.error(error.response?.data.message || error.message);
      }
    },
    async fetchStudentData() {
  try {
    // Fetch student data
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const apiUrl = baseUrl + 'api/enrollments/student/' + this.currentUserId;
    const response = await this.$api.get(apiUrl);
    console.log("Fetched student data:", response.data.data); // Log the student data

    // Check if the data array is not empty
    if (response.data.data && response.data.data.length > 0) {
      const cycleId = response.data.data[0].cycleid; // Extract cycleId from the first object
      console.log("Cycle ID:", cycleId); // Log the cycleId

      // Call fetchAssignments method with the cycleId
      this.fetchAssignments(cycleId);
    } else {
      console.error("No enrollments found for the student.");
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
},

async fetchAssignments(cycleId) {
  try {
    // Fetch assignments data using the cycleId
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const apiUrl = baseUrl + 'api/enrollmentsAssignments/with-assignments?cycleid=' + cycleId;
    // const assignmentsUrl = `https://fnbackendprod.finvedic.in/api/enrollmentsAssignments/with-assignments?cycleid=${cycleId}`;
    const assignmentsResponse = await this.$api.get(apiUrl);

    // Log the assignments data for that cycleId
    console.log("Fetched assignments for cycle:", cycleId, assignmentsResponse.data);

    // Sort the assignments by scoredMarks in descending order
    const sortedAssignments = assignmentsResponse.data.sort((a, b) => b.scoredMarks - a.scoredMarks);

    // Get the top 3 scored assignments
    const top3Assignments = sortedAssignments.slice(0, 3);

    // Log the top 3 scored assignments
    console.log("Top 3 scored assignments:", top3Assignments);

    // Now, set the topProfilesFetched based on the top 3 assignments
    if (this.userType === "Student") {
      this.topProfilesFetched = top3Assignments.map((assignment) => ({
        name: assignment.username,
        points: assignment.scoredMarks,
      }));

      console.log("Top profiles fetched:", this.topProfilesFetched);
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
},
  },
  mounted() {
  this.setGreeting();
  this.getUserData();
  if (this.userType === "Student") {
    this.fetchStudentData();
  } else {
    this.topProfilesFetched = this.topProfilesStatic; // For non-student users, use static profiles
  }
},
};
</script>

  <style scoped>
.profile-container {
  border: 1px solid grey;
  background: #fff;
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-title {
  font-weight: 600;
  font-size: 1.2rem;
}

.more-icon {
  font-size: 1.5rem;
  color: #141414;
}

.profileImg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
}

.greeting {
  font-size: large;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.leaderboard {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
}

.podium {
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podium-poll {
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  font-size: 1rem;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 0.5rem;
  text-align: center;
  opacity: 0.8;
  transform: translateY(10%);
}

.points {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.5);
  padding: 1px 4px;
  border-radius: 10px;
}

.position-1 .podium-poll {
  height: 100px;
  background: linear-gradient(to top, #F5E587, #D9B902);
  z-index: 3;
}

.position-2 .podium-poll {
  height: 80px;
  background: linear-gradient(to top, #d9d9d9, #AEAEAE);
  z-index: 2;
}

.position-3 .podium-poll {
  height: 60px;
  background: linear-gradient(to top, #DCC5B5, #BD5A14);
}

.podium-pic {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.profile-name {
  font-weight: 600;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 0.8rem;
}



@media (max-width: 1024px) {
  .podium-pic {
    width: 50px;
    height: 50px;
  }
  .podium-poll {
    width: 80px;
    font-size: 0.9rem;
  }
}
  </style>
