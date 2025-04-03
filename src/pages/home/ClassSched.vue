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
        <q-item v-for="(event, index) in displayedEvents" :key="index" clickable>
          <q-item-section avatar>
            <q-icon name="event" size="34px" color="blue" class="calendar-icon" />
          </q-item-section>

          <q-item-section>
            <div class="flex justify-between items-center">
              <div class="flex column">
                <q-item-label class="event-key text-weight-regular">
                  {{ event.isUpcoming ? "Upcoming Event:" : "Previous Event:" }}
                </q-item-label>
                <q-item-label class="event-title">
                  <span class="live-dot"></span>
                  {{ event.title }}
                </q-item-label>
              </div>
              <div class="flex items-center">
                <q-img :src="meet" width="16px" height="16px" class="custom-icon q-mr-xs" />
                <q-item-label caption>
                  <a :href="event.link" target="_blank" class="go-to-meet">Go to Meet Link</a>
                </q-item-label>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <!-- No Events Available -->
        <div v-if="!displayedEvents.length" class="text-center q-pa-md">
          <span class="text-grey">No Events Available</span>
        </div>
      </q-list>

      <!-- Right Bar -->
      <div class="schedule-bar"></div>
    </div>
  </div>
</template>

<script>

import { urls } from "../libraries/Urls"
import meet from 'src/assets/google_meet.svg'
export default {
  name: "ClassSchedule",
  data() {
    return {
      events: [],
      displayedEvents: [], // Events displayed in UI
      loading: false,
      meet: meet,
    };
  },
  methods: {
    viewAll() {
    console.log("View All Clicked");
    this.$router.push("/class-room");
  },
    getEventsData() {
      const request = {
        categoryId: this.selectedCategory?.id,
        subCategoryId: this.selectedSubCategory?.id
      };
      this.loading = true;

      this.$api.get(urls.getEvents, { params: request })
        .then(response => {
          this.loading = false;
          if (response.data.success) {
            let events = response.data.data.map(event => {
              const eventDate = new Date(event.date);
              return {
                title: event.title,
                topic: event.topic,
                start: eventDate,
                end: event.endDate ? new Date(event.endDate) : eventDate,
                link: event.link,
                batch: event.batch,
                isUpcoming: eventDate >= new Date()
              };
            });

            this.events = events;

            // Filter upcoming events
            let upcomingEvents = events.filter(event => event.isUpcoming);
            if (upcomingEvents.length) {
              this.displayedEvents = upcomingEvents;
            } else {
              // If no upcoming events, show the most recent past event
              let pastEvents = events.filter(event => !event.isUpcoming);
              this.displayedEvents = pastEvents.length ? [pastEvents[pastEvents.length - 1]] : [];
            }
          } else {
            this.showMsg(response.data?.message, 'negative');
          }
        })
        .catch(error => {
          this.loading = false;
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
    },
  },
  mounted() {
    this.getEventsData();
  }
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
