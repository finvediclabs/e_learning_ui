<template>
  <div class="chats-card q-pa-md q-mt-md">
    <div class="row items-center justify-between q-mb-sm">
      <!-- Left Side -->
      <div class="row items-center  left-side">
        <span class="text-h6 text-bold q-mr-md">Chats</span>
        <q-btn v-for="group in limitedGroups" :key="group.groupId" unelevated no-caps :label="group.groupName"
          class="chat-btn q-mr-sm text-weight-regular"
          :class="{ active: activeGroup === group.groupId, inactive: activeGroup !== group.groupId }"
          @click="setActiveGroup(group.groupId)" />
      </div>
      <!-- View All -->
      <span class="view-all text-weight-medium cursor-pointer" @click="viewAll">
        View All
      </span>
    </div>

    <div class="row chat-row">
      <!-- Chat List -->
      <q-list separator class="ChatList col q-mr-xs">
        <q-item v-for="(chat, index) in limitedChats" :key="index" clickable @click="viewAll">
          <q-item-section avatar>
            <q-img :src=personImage class="chat-img" alt="Profile Image" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="chat-profile text-bold">{{ chat.username }}</q-item-label>
            <div class="chat-message-container">
              <q-item-label class="chat-message">{{ truncateMessage(chat.message) }}</q-item-label>
              <q-item-label class="chat-time">{{ formatTime(chat.time) }}</q-item-label>
            </div>
          </q-item-section>
        </q-item>
        <!-- No Chats Available -->
        <div v-if="!chats.length" class="text-center q-pa-md">
          <span class="text-grey">No Chats Available</span>
        </div>
      </q-list>
      <!-- Right Bar -->
      <div class="chat-bar"></div>
    </div>
  </div>
  <DemoUserPopUp v-if="showDemoPopup" @close="showDemoPopup = false" />
</template>

<script>
import axios from "axios";
import personImage from "src/assets/User_icon.png";

import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import { useProfileStore } from "src/stores/profile";
import DemoUserPopUp from "src/layouts/DemoUserPopUp.vue";

export default {
  name: "ChatsCard",
  components: {
    DemoUserPopUp
  },
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const profileStore = useProfileStore();
    const { userProfile } = storeToRefs(profileStore);

    return {
      token,
      userType,
      userProfile
    };
  },
  data() {
    return {
      activeGroup: "",
      groups: [],
      chats: [],
      personImage: personImage,
      showDemoPopup: false,
    };
  },
  computed: {
    limitedGroups() {
      return this.groups.slice(0, 2);
    },
    limitedChats() {
      return this.chats.slice(-1)
    },
  },
  methods: {
    truncateMessage(message) {
      return message.length > 50 ? message.substring(0, 50) + "..." : message;
    },
    formatTime(time) {
      if (!time) return "";
      const date = new Date(time);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    },
    async fetchGroups() {
      try {
        const response = await this.$api.get("api/channel-batches/groups");
        if (response.data.success) {
          this.groups = response.data.data;
          //console.log(this.groups)
          this.activeGroup = this.groups.length ? this.groups[0].groupId : "";
          this.fetchMessages()
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    },
    async fetchMessages() {
      try {
        const response = await this.$api.get(`api/getmessages/${this.activeGroup}`);
        this.chats = response.data;
        //console.log(this.chats);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    setActiveGroup(groupId) {
      this.activeGroup = groupId;
      this.fetchMessages()
      console.log(`Active Group: ${groupId}`);
    },
    viewAll() {
      if (this.userType === 'Guest') {
    console.log("Guest user → popup shown");
    this.showDemoPopup = true;
  } else {
    console.log("Non-guest user → navigating to /channel");
    this.$router.push("/channel");
  }
    }
  },
  mounted() {
    this.fetchGroups();
    this.fetchMessages()
  }
};
</script>

<style scoped>
.chats-card {
  background-color: #ffffff;
  border: 1px solid grey;
  border-radius: 10px;
  position: relative;
}

.view-all {
  font-size: 14px;
  color: #6956e5;
  cursor: pointer;
}

.chat-btn {
  border-radius: 10px;
  padding: 4px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

.active {
  background-color: #5479f7;
  color: white;
}

.inactive {
  background-color: #eaeaf2;
  color: black;
}

.ChatList {
  background-color: #f9f9f9;
  border-radius: 10px;
}

.chat-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-profile {
  font-size: 14px;
  color: #000000;
}

.chat-message-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-message {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.chat-time {
  font-size: 12px;
  color: #999;
}

.chat-row {
  display: flex;
  align-items: stretch;
  position: relative;
}

.chat-bar {
  width: 6px;
  background-color: #bcbcbc;
  border-radius: 10px;
  margin-left: 10px;
}

@media (max-width: 768px) {

.left-side {
  display: flex;
  gap: 10px;
}

}
</style>
