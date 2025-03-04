<template>
  <div class="profile-container">
    <div class="header">
      <div class="profile-title">Your Profile</div>
      <q-icon name="more_vert" class="more-icon cursor-pointer" />
    </div>
    <q-img :src="imageUrl || defaultProfileImg" class="profileImg cursor-pointer rounded" />
    <div class="greeting">{{ greeting }} {{ profile.name || "Guest" }}</div>

    <div class="leaderboard" v-if="topProfiles.length">
      <div class="podium-container">
        <div :class="['podium', 'position-2']">
          <q-img :src="topProfiles[1]?.pic || defaultProfileImg" alt="ProPic" class="podium-pic podium-pic-2 rounded-circle" />
          <div class="profile-name">{{ topProfiles[1]?.name || "Unknown" }}</div>
          <div class="podium-poll">2nd<br><span class="points rounded-borders">{{ topProfiles[1]?.points }} Pts</span></div>
        </div>
        <div :class="['podium', 'position-1']">
          <q-img :src="topProfiles[0]?.pic || defaultProfileImg" alt="ProPic" class="podium-pic podium-pic-1 rounded-circle" />
          <div class="profile-name">{{ topProfiles[0]?.name || "Unknown" }}</div>
          <div class="podium-poll">1st<br><span class="points">{{ topProfiles[0]?.points }} Pts</span></div>
        </div>
        <div :class="['podium', 'position-3']">
          <q-img :src="topProfiles[2]?.pic || defaultProfileImg" alt="ProPic" class="podium-pic podium-pic-3 rounded-circle" />
          <div class="profile-name">{{ topProfiles[2]?.name || "Unknown" }}</div>
          <div class="podium-poll">3rd<br><span class="points">{{ topProfiles[2]?.points }} Pts</span></div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No leaderboard data available</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useProfileStore } from "src/stores/profile";
import { api } from "src/boot/axios";

export default {
  name: "ProfileCard",
  data() {
    return {
      profile: {},
      imageUrl: "",
      greeting: "",
      defaultProfileImg: "https://via.placeholder.com/100",
      topProfiles: [
        { name: "Alice", pic: "src/assets/add-user.png", points: 1500 },
        { name: "Bob", pic: "src/assets/add-user.png", points: 1200 },
        { name: "Charlie", pic: "src/assets/add-user.png", points: 1000 },
      ],
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
  },
  mounted() {
    this.setGreeting();
    this.getUserData();
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
  width: 100px;
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
