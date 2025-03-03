<template>
    <div class="chats-card q-pa-md">
      <div class="row items-center justify-between q-mb-sm">
        <!-- Left Side -->
        <div class="row items-center">
          <span class="text-h6 text-bold q-mr-md">Chats</span>
          <q-btn
            unelevated
            no-caps
            label="Batch 1"
            class="chat-btn q-mr-sm text-weight-regular"
            :class="{ active: activeGroup === 'batch1', inactive: activeGroup !== 'batch1' }"
            @click="setActiveGroup('batch1')"
          />
          <q-btn
            unelevated
            no-caps
            label="Vedic Hive"
            class="chat-btn text-weight-regular"
            :class="{ active: activeGroup === 'vedic', inactive: activeGroup !== 'vedic' }"
            @click="setActiveGroup('vedic')"
          />
        </div>
  
        <!-- View All -->
        <span class="view-all text-weight-medium cursor-pointer" @click="viewAll">
          View All
        </span>
      </div>
  
      <div class="row chat-row">
        <!-- Chat List -->
        <q-list separator class="ChatList col q-mr-xs">
          <q-item v-for="(chat, index) in chats" :key="index" clickable>
            <q-item-section avatar>
              <img :src="chat.img" class="chat-img" alt="Profile Image" />
            </q-item-section>
  
            <q-item-section>
              <q-item-label class="chat-profile text-bold">
                {{ chat.name }}
              </q-item-label>
              <div class="chat-message-container">
                <q-item-label class="chat-message">
                  {{ chat.message }}
                </q-item-label>
                <q-item-label class="chat-time">
                  {{ chat.time }}
                </q-item-label>
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
  </template>
  
  <script>
  export default {
    name: "ChatsCard",
    data() {
      return {
        activeGroup: "batch1",
        chats: [
          {
            img: "src/assets/Drona_Blue.png",
            name: "Prashant Kumar",
            message: "Hello! How can I help you today?",
            time: "Yesterday",
          },
        //   {
        //     img: "src/assets/Character_Ved.png",
        //     name: "Vedic Hive",
        //     message: "Welcome to the community!",
        //     time: "2 mins ago",
        //   },
        ],
      };
    },
    methods: {
      viewAll() {
        console.log("View All Clicked");
      },
      setActiveGroup(group) {
        this.activeGroup = group;
        console.log(`Active Group: ${group}`);
      },
    },
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
    padding: 4px 10px ;
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
  </style>
  