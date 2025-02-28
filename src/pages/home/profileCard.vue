<template>
    <div class="profile-container">
      <div class="header">
        <div class="profile-title">Your Profile</div>
        <q-icon name="more_vert" class="more-icon cursor-pointer" />
      </div>
      <q-img :src="imageUrl || ProfileImg" class="profileImg cursor-pointer rounded" />
      <div class="greeting">{{ greeting }} {{ user?.name || 'Guest' }}</div>
      <div class="leaderboard" v-if="topProfiles?.length">
        <div class="podium-container">
          <div :class="['podium', 'position-2']">
            <img :src="topProfiles[1]?.pic || defaultProfileImg" alt="ProPic" class="podium-pic podium-pic-2 rounded-circle" />
            <div class="profile-name">{{ topProfiles[1]?.name || 'Unknown' }}</div>
            <div class="podium-poll">2nd<br><span class="points rounded-borders">{{ topProfiles[1]?.points }} Pts</span></div>
          </div>
          <div :class="['podium', 'position-1']">
            <img :src="topProfiles[0]?.pic || defaultProfileImg" alt="ProPic" class="podium-pic podium-pic-1 rounded-circle" />
            <div class="profile-name">{{ topProfiles[0]?.name || 'Unknown' }}</div>
            <div class="podium-poll">1st<br><span class="points">{{ topProfiles[0]?.points }} Pts</span></div>
          </div>
          <div :class="['podium', 'position-3']">
            <img :src="topProfiles[2]?.pic || defaultProfileImg" alt="ProPic" class="podium-pic podium-pic-3 rounded-circle" />
            <div class="profile-name">{{ topProfiles[2]?.name || 'Unknown' }}</div>
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
  import { ref, computed, onMounted } from "vue";
  import { useProfileStore } from "src/stores/profile";
  import { storeToRefs } from "pinia";
  import { api } from "src/boot/axios";
  
  export default {
    name: "ProfileCard",
    setup() {
      const profileStore = useProfileStore();
      const { user } = storeToRefs(profileStore);
      const imageUrl = ref("");
      const greeting = ref("");
  
      const topProfiles = [
        { name: "Alice", pic: "src/assets/add-user.png", points: 1500 },
        { name: "Bob", pic: "src/assets/add-user.png", points: 1200 },
        { name: "Charlie", pic: "src/assets/add-user.png", points: 1000 },
      ];
  
      const defaultProfileImg = "https://via.placeholder.com/100";
      const ProfileImg = computed(() => {
        return user.value?.profileImg || defaultProfileImg;
      });

      const setGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        greeting.value = "Good Morning";
      } else if (hour < 18) {
        greeting.value = "Good Afternoon";
      } else {
        greeting.value = "Good Evening";
      }
    };
  
      const fetchImage = async (filename) => {
        if (!filename) return;
        const formData = new FormData();
        formData.append("filename", filename);
        try {
          const response = await api.post("fs/download", formData, {
            responseType: "blob",
          });
          imageUrl.value = URL.createObjectURL(response.data);
        } catch (error) {
          console.error(error.response?.data.message || error.message);
          imageUrl.value = "";
        }
      };
  
      onMounted(() => {
        setGreeting();
        fetchImage(user.value?.uploadDocumentPath);
      });
  
      return {
        user,
        topProfiles,
        imageUrl,
        ProfileImg,
        greeting,
      };
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


  </style>
  