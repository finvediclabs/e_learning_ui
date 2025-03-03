<template>
    <div class="schedule-card q-pa-md">
      <div class="row items-center justify-between q-mb-sm">
        <!-- Sub Heading -->
        <span class="text-h6 text-bold">Class Schedule</span>
        <span class="view-all text-weight-medium cursor-pointer" @click="viewAll">View All</span>
      </div>
  
      <div class="row schedule-row">
        <!-- Schedule List -->
        <q-list separator class="ScheduleList col q-mr-xs">
          <q-item v-for="(event, index) in events" :key="index" clickable>
            <q-item-section avatar>
              <q-icon name="event" size="34px" color="blue" class="calendar-icon" />
            </q-item-section>
  
            <q-item-section >
                <div class="flex justify-between items-center"  >
                <div class="flex column ">
              <q-item-label class="event-key text-weight-regular">
                Upcoming Event:
              </q-item-label>
              <q-item-label class="event-title">
                  <span class="live-dot "></span>
                Meeting with Prashant
              </q-item-label>
            </div>
            <div>
              <q-item-label caption>
                <a href="#" class="go-to-meet">Go to Meet Link</a>
              </q-item-label>
              </div>
            </div>
            </q-item-section>
          </q-item>
  
          <!-- No Events Available -->
          <div v-if="!events.length" class="text-center q-pa-md">
            <span class="text-grey">No Events Available</span>
          </div>
        </q-list>
  
        <!-- Right Bar -->
        <div class="schedule-bar"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ClassSchedule",
    data() {
      return {
        events: [
          { title: "Meeting with Prashant", link: "https://zoom.us" }
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
  .schedule-card {
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
  
  .ScheduleList {
    background-color: #f9f9f9;
    border-radius: 10px;
  }
  
  .calendar-icon {
    border-radius: 5px;
  }
  
  .event-key {
    font-size: 14px;
    color: #000000;
  }
  
  .event-title {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
  
  .go-to-meet {
    font-size: 12px;
    color: #4E5BF8;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .live-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #BA1717;
    border-radius: 50%;
  }
  
  .schedule-row {
    display: flex;
    align-items: stretch;
    position: relative;
  }
  
  .schedule-bar {
    width: 6px;
    background-color: #bcbcbc;
    border-radius: 10px;
    margin-left: 10px;
  }
  </style>
  