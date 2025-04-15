<template>
  <div class="schedule-card q-px-md q-pt-md">
    <div class="row items-center justify-between q-mb-sm">
      <!-- Sub Heading -->
      <span class="text-h6 text-bold">Class Schedule</span>
      <span class="view-all text-weight-medium cursor-pointer" @click="viewAll">View All</span>
    </div>

    <!-- Current / Next / Last Event -->
    <div v-if="highlightedEvent" class="q-mb-md">
      <q-item clickable class="bg-white rounded-borders" style="border: 1px solid #ccc;border-radius: 10px;">
        <q-item-section avatar>
          <q-icon name="event" size="34px" color="blue" class="calendar-icon" />
        </q-item-section>

        <q-item-section>
          <div class="flex justify-between items-center">
            <div class="flex column">
              <q-item-label class="event-key text-weight-regular">
                {{
                  currentEvent ? 'Ongoing Event:' :
                  nextEvent ? 'Next Event:' : 'Last Event:'
                }}
              </q-item-label>
              <q-item-label class="event-title">
                <span class="live-dot"></span>
                {{ highlightedEvent.title }}
              </q-item-label>
              <q-item-label caption>
                {{ formatDate(highlightedEvent.start) }} |
                {{ formatTime(highlightedEvent.start) }} - {{ formatTime(highlightedEvent.end) }}
              </q-item-label>

            </div>
            <div class="flex items-center">
              <q-img :src="meet" width="16px" height="16px" class="custom-icon q-mr-xs" />
              <q-item-label caption>
                <a :href="highlightedEvent.link" target="_blank" class="go-to-meet">
                  Go to Meet Link
                </a>
              </q-item-label>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </div>

    <div class="row schedule-row">
      <!-- Schedule List -->
      <q-list separator class="ScheduleList col q-mr-xs">


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
import { useProfileStore } from "src/stores/profile";
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";

export default {
  name: "ClassSchedule",

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
      events: [],
      displayedEvents: [],
      loading: false,
      meet: meet,
      batchOptions2: [],
      selectedBatch2: null,
    };
  },

  methods: {
    viewAll() {
      console.log("View All Clicked");
      this.$router.push("/class-room");
    },

    async fetchEnrollments() {
      const profileStore = useProfileStore();
      const profileId = profileStore.user.id;
      this.batchOptions2 = [];
      if (this.userType !== 'Student') {
    this.batchOptions2 = [{ label: 'Batch 001', value: 'Batch 001' }];
    this.selectedBatch2 = 'Batch 001';
    this.getEventsData();
    return;
  }
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const url = `${baseUrl}api/enrollments/student/${profileId}`;

        const response = await this.$api.get(url);
        console.log('Enrollment Data:', response.data);

        const cycleFetchPromises = response.data.data.map(async (enrollment) => {
          const cycleId = enrollment.cycleid;
          try {
            const url2 = `${baseUrl}api/cycles/${cycleId}`;
            const cycleResponse = await this.$api.get(url2);
            console.log('Cycle Data for Cycle ID', cycleId, ':', cycleResponse.data);

            if (cycleResponse.data && cycleResponse.data.data) {
              const cycleDesc = cycleResponse.data.data.cycleDesc;
              this.batchOptions2.push({
                label: cycleDesc,
                value: cycleDesc
              });
            } else {
              console.error('No cycle data found for Cycle ID', cycleId);
            }
          } catch (cycleError) {
            console.error('Error fetching cycle data for Cycle ID', cycleId, ':', cycleError);
          }
        });

        await Promise.all(cycleFetchPromises);

        if (this.batchOptions2.length > 0) {
          this.selectedBatch2 = this.batchOptions2[0].value;
        }

        console.log('Batch Options:', this.batchOptions2);
        this.getEventsData();

      } catch (error) {
        console.error('Error fetching enrollment data:', error);
      }
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

            const userBatches = this.batchOptions2.map(option => option.value);
            const filteredByBatch = events.filter(e => userBatches.includes(e.batch));

            console.log("🧾 Filtered Events by User Batch:", filteredByBatch);

            const upcoming = filteredByBatch.filter(e => e.isUpcoming);
            this.displayedEvents = upcoming.length
              ? upcoming
              : filteredByBatch.length
              ? [filteredByBatch[filteredByBatch.length - 1]]
              : [];

          } else {
            this.showMsg(response.data?.message, 'negative');
          }
        })
        .catch(error => {
          this.loading = false;
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit"
      });
    },
  },

  computed: {
    isEligible() {
      const profileStore = useProfileStore();
      const roles = profileStore.user.roles.map(role => role.name);
      return roles.includes('Admin') || roles.includes('Faculty');
    },

    filteredEvents() {
      if (this.selectedBatch2) {
        return this.events.filter(event => event.batch === this.selectedBatch2);
      }
      return this.events;
    },

    nextEvent() {
      const futureEvents = this.filteredEvents.filter(e => new Date(e.start) > new Date());
      if (futureEvents.length > 0) {
        return futureEvents.reduce((next, current) =>
          new Date(current.start) < new Date(next.start) ? current : next
        );
      }
      return null;
    },

    lastEvent() {
      const pastEvents = this.filteredEvents.filter(e => new Date(e.end) < new Date());
      if (pastEvents.length > 0) {
        return pastEvents.reduce((prev, current) =>
          new Date(current.end) > new Date(prev.end) ? current : prev
        );
      }
      return null;
    },

    currentEvent() {
      const now = new Date();
      return this.filteredEvents.find(e => new Date(e.start) <= now && new Date(e.end) >= now) || null;
    },

    nextOrLastEvent() {
      return this.nextEvent || this.lastEvent || null;
    },

    nextOrLastEventTitle() {
      return this.nextOrLastEvent ? this.nextOrLastEvent.title : '';
    },
    nextOrLastEventTopic() {
      return this.nextOrLastEvent ? this.nextOrLastEvent.topic : '';
    },
    nextOrLastEventDate() {
      return this.nextOrLastEvent ? this.formatDate(this.nextOrLastEvent.start) : '';
    },
    nextOrLastEventStartTime() {
      return this.nextOrLastEvent ? this.formatTime(this.nextOrLastEvent.start) : '';
    },
    nextOrLastEventEndTime() {
      return this.nextOrLastEvent ? this.formatTime(this.nextOrLastEvent.end) : '';
    },
    highlightedEvent() {
    return this.currentEvent || this.nextEvent || this.lastEvent || null;
  },
  },

  mounted() {
    this.fetchEnrollments();
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
