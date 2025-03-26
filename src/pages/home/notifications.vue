<template>
    <div class="notification-card q-pa-md">
      <div class="row items-center justify-between q-mb-sm">
        <!-- Sub Heading -->
        <span class="text-h6 text-bold">Notifications</span>
        <span class="view-all text-weight-medium cursor-pointer" @click="viewAll">View All</span>
      </div>

      <div class="row notif-row">
        <!-- Notification List -->
        <q-list separator class="NotifList col q-mr-xs">
          <q-item v-for="(notification, index) in notifications" :key="index" clickable>
            <q-item-section avatar>
              <q-img :src="notification.img" class="notif-img" alt="Notification Image" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="notif-key text-weight-regular">
                {{ notification.key }}:
              </q-item-label>
              <q-item-label class="notif-title">
                {{ notification.title }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- No Notifications Available -->
          <div v-if="!notifications.length" class="text-center q-pa-md">
            <span class="text-grey">No Notifications Available</span>
          </div>
        </q-list>

        <!-- Right Bar -->
        <div class="notif-bar"></div>
      </div>
    </div>
  </template>

  <script>
  export default {
    name: "NotificationCard",
    data() {
      return {
        notifications: [
          { img: "src/assets/BackImg.png", key: "New Course", title: "Data Science Available" },
        //   { img: "src/assets/BG_New.png", key: "Update", title: "Python Course Updated" }
        ],
      };
    },
    methods: {
      viewAll() {
        console.log("View All Clicked");
      },
    },
  };
  </script>

  <style scoped>
  .notification-card {
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

  .NotifList {
    background-color: #f9f9f9;
    border-radius: 10px;
  }

  .notif-img {
    width: 60px;
    height: 34px;
    border-radius: 5px;
    object-fit: cover;
  }

  .notif-key {
    font-size: 14px;
    color: #000000;
  }

  .notif-title {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }

  .notif-row {
    display: flex;
    align-items: stretch;
    position: relative;
  }

  .notif-bar {
    width: 6px;
    background-color: #bcbcbc;
    border-radius: 10px;
    margin-left: 10px;
  }
  </style>
