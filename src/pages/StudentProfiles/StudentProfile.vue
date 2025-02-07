<template>
  <div class="zoom-container">
  <div class="user-profile-container">
    <!-- Row Layout with 3 Columns -->
    <div class="row col-12">
      <!-- Column 1: User Details -->
      <div class="col-2">
        <div class="user-details column1">
        <div class="user-image">
          <img v-if="imageUrl" :src="imageUrl" alt="User Document" />
          <div v-else class="placeholder">No Image</div>
        </div>
        <Span style="font-size: x-large;color: #FFFFFF;"><strong>{{ profile.name }}</strong></Span>
        <Span style="background-color: #B2CCFC;padding-left: 8%;padding-right: 8%;padding-top: 2%;padding-bottom: 2%;color:#ffffff;border-radius: 5px;"><strong>{{profile.role.name}}</strong></Span>
        <div style="width: 98%;margin-top: 4%;margin-bottom: 4%;margin-left:2%;margin-right:2%;padding-left: 1%;border-radius: 10px;">
        <div v-if="enrollmentData.length === 0">
      <p>No assignments available for the current cycle.</p>
    </div>
    
    <!-- Display assignment data when enrollmentData is not empty -->
    <div v-else>
  <!-- Loop through enrollment data for student assignments -->
  <div v-for="(assignment, index) in enrollmentData" :key="index" class="assignment-item row" style="background-color: #FFFFFF;border-radius: 5px;color: #FFFFFF;">
    <div class="col-8" style="border-radius: 5px;color: #5479F7;display: flex;align-items: center;padding-left: 10px;">
      <span><strong>Student Assignments:</strong></span>
    </div>
    <div class="col-4" style="display: flex;align-items: center;justify-content: flex-end;">
      <span style="color: #55BA82;background-color: #B9FFD9;padding: 2%;margin-right: 10%;text-align: right;">
        {{ assignmentTotals.totalStudentAssignments }}
      </span>
      <span style="color: #FF5252;background-color: #FFC3C3;padding: 2%;right: 0%;text-align: right;">
        {{ assignmentTotals.totalAssignments }}
      </span>
    </div>
  </div>

  <!-- Display the total number of VMs used -->
  <div class="row" style="margin-top: 10px;background-color: #FFFFFF;border-radius: 5px;color: #FFFFFF;">
    <div class="col-8" style="border-radius: 5px;color: #5479F7;display: flex;align-items: center;padding-left: 10px;">
      <span><strong>Total VMs Used:</strong></span>
    </div>
    <div class="col-4" style="display: flex;align-items: center;justify-content: flex-end;">
      <span style="color: #55BA82;background-color: #B9FFD9;padding: 2%;margin-right: 10%;text-align: right;">
        {{ totalVmsUsed }}
      </span>
    </div>
  </div>

  <!-- Display the total active VM time -->
  <div class="row" style="margin-top: 10px;background-color: #FFFFFF;border-radius: 5px;color: #FFFFFF;">
    <div class="col-8" style="border-radius: 5px;color: #5479F7;display: flex;align-items: center;padding-left: 10px;">
      <span><strong>Total Active VM Time:</strong></span>
    </div>
    <div class="col-4" style="display: flex;align-items: center;justify-content: flex-end;">
      <span style="color: #55BA82;background-color: #B9FFD9;padding: 2%;right: 0%;text-align: right;">
        {{ totalActiveTime }}Hrs
      </span>
    </div>
  </div>

   <!-- Display the dummy Attendence -->
   <div class="row" style="margin-top: 10px;background-color: #FFFFFF;border-radius: 5px;color: #FFFFFF;">
    <div class="col-8" style="border-radius: 5px;color: #5479F7;display: flex;align-items: center;padding-left: 10px;">
      <span><strong>Total Classes:</strong></span>
    </div>
    <div class="col-4" style="display: flex;align-items: center;justify-content: flex-end;">
      <span style="color: #55BA82;background-color: #B9FFD9;padding: 2%;margin-right: 10%;text-align: right;">
        40
      </span>
      <span style="color: #FF5252;background-color: #FFC3C3;padding: 2%;right: 0%;text-align: right;">
        52
      </span>
    </div>
  </div>
</div>    
</div>
</div>

<div style="background-color: #ffffff; border-radius: 20px; padding: 20px; display: flex; align-items: center;margin-top:20px;">
  <!-- Image with background and border-radius -->
  <div style="background-color: #EAF1FF; border-radius: 15px; padding: 10px; display: flex; align-items: center;">
    <q-img :src="calenderImg" style="width: 40px; height: 40px;" />
  </div>

  <!-- Text content -->
  <div style="flex: 1; margin-left: 10px; color: #5479F7;">
    <span style="font-weight: bold;">Total Attendance</span>
  </div>

  <!-- Percentage on the right -->
  <div style="background-color: #5479F7;color: #ffff; font-weight: bold; margin-left: auto;padding: 2%;border-radius: 5px;">
    93%
  </div>
</div>

<div style="background-color: #ffff;border-radius: 20px;height: fit-content;padding-bottom: 2%;">
    <!-- Info Section -->
    <div
      style=" padding: 20px; display: flex; align-items: center; margin-top: 20px;"
    >
      <!-- Image with background and border-radius -->
      <div
        style="background-color: #5479f7; border-radius: 15px; padding: 10px; display: flex; align-items: center;"
      >
        <img :src="course_completion" alt="Calendar" style="width: 40px; height: 40px;" />
      </div>

      <!-- Text content -->
      <div style="flex: 1; margin-left: 10px; color: #5479F7;">
        <span style="font-weight: bold;">Total Course Completion</span>
      </div>

      <!-- Percentage on the right -->
      <div
        style="background-color: #5479F7; color: #fff; font-weight: bold; margin-left: auto; padding: 2%; border-radius: 5px;"
      >
        {{ percentage }}%
      </div>
    </div>

    <!-- Doughnut Chart Section -->
    <div style="display: flex; justify-content: center; align-items: center;padding-bottom: 20px;">
      <canvas ref="doughnutChart" width="150" height="150"></canvas>
    </div>

    <div class="progress-container">
    <div class="progress-label">Unlocking Finance - A Beginner's Guide : 93%</div>

    <div class="progress-bar">
      <div class="progress-fill" style="width: 93%;"></div>
    </div>

    <div class="progress-label">Banking Unveiled - A Primer : 94%</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 94%;"></div>
    </div>

    <div class="progress-label">Navigating Digital Banking : 92%</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 92%;"></div>
    </div>

    <div class="progress-label">Discovering Fintech Essentials : 93%</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 93%;"></div>
    </div>

    <div class="progress-label">Agile Powered Software Delivery Journey : 92%</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 92%;"></div>
    </div>
  </div>

  </div>
    
</div>

      <!-- Column 2: Empty -->
      <div class="col-10 row">
        <div class="col-9">
          <div class="row">
          <Videos />
        </div>
        <div class="row" >
          <div class="col-9" >
            <Books />
          </div>
          <div class="col-3">
            <Reports/>
          </div>
          
        </div>
        </div>
        
        <div class="col-3 calendar-container">
    <q-select
      v-model="selectedTitle"
      :options="titleOptions"
      label="Select Event Title"
      emit-value
      outlined
      @input="filterEvents"
    />
    <FullCalendar :options="calendarOptions" />
    <q-img class="folder" @click="Routeassignment">
      <svg xmlns="http://www.w3.org/2000/svg" height="250px" viewBox="0 -960 960 960" width="250px" fill="#4B77D1"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z"/>
      </svg>
    </q-img>
    <div style="margin-top: 5px; font-size: 2rem; text-align: center;font-weight: bold; color: #4B77D1;">
    Assignments
  </div>
  </div>

      <div class="col-12">
        <Channel />
      </div>
        
      </div>

      <!-- Column 3: Calendar -->
      <div class="col-3 ">
        
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-6 grid-container" style="width: 100%; float: left;">
    </div> 
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Reports from './Reports.vue';
import { useProfileStore } from "src/stores/profile";
import { storeToRefs } from "pinia";
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from '@fullcalendar/timegrid'; // Import timeGrid plugin
import dayGridPlugin from '@fullcalendar/daygrid'; // Optional: for day grid week

import interactionPlugin from "@fullcalendar/interaction";
import Channel from "./ProfilesChannel.vue";
import Videos from "./Videos.vue"
import Books from "./Books.vue"
import calenderImg from "../../assets/calender.png";
import course_completion from "../../assets/course_completion.png"
import { setToken } from "src/boot/axios";

export default {
  name: "UserProfile",
  components: {
    FullCalendar,
    Reports,
    Videos,
    Channel,
    Books,

  },
  data() {
    return {
      calenderImg,
      course_completion,
      percentage: 93, // Percentage value for the chart
      profile: {
        name: "",
        email: "",
        gender: "",
        dob: "",
        graduationDegree: "",
        qualificationYear: "",
        specialization: "",
        phoneNumber: "",
        uploadDocumentPath: "",
        role: "",
      },
      assignmentTotals: {
      totalStudentAssignments: 0,
      totalAssignments: 0,
    },
   
      enrollmentData: [], 
      imageUrl: "",
      user: null,
      selectedTitle: null,
      titleOptions: [],
      eventDetails: {
      start: '',
      end: '',
      batch: '',
      course: '',
      topic: '',
      title: ''
    },

      originalEvents: [],
      calendarOptions: {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth', // Set to 'dayGridMonth' to display the complete month
  events: [],
  eventContent: function(info) {
  let anchor = document.createElement('a');
  anchor.href = info.event.url;
  anchor.target = '_blank';
  anchor.className = 'fc-event';

  let div = document.createElement('div');
  div.className = 'fc-event-main';
  div.innerHTML = `<div class="fc-event-title">${info.event.title}</div>`;

  anchor.appendChild(div);

  return { domNodes: [anchor] };
}
},


    };
  },
  computed: {
    titleOptions() {
      // Extract unique titles for the q-select options
      return [...new Set(this.originalEvents.map((event) => event.title))];
    },
  },
  methods: {
    Routeassignment(){
      this.$router.push('/library/assignment'); 
    },
    getUserData() {
      if (!this.user || !this.user.id) {
        console.error("User object is undefined or missing 'id'.");
        return;
      }
console.log(this.user.id);
      this.$api
        .get(`api/users/${this.user.id}`)
        .then((response) => {
          if (response.data.success) {
            const user = response.data.data;
            this.profile = {
              name: user.name,
              email: user.email,
              gender: user.gender,
              dob: user.dob,
              graduationDegree: user.graduationDegree,
              qualificationYear: user.qualificationYear,
              specialization: user.specialization,
              phoneNumber: user.phoneNumber,
              uploadDocumentPath: user.uploadDocumentPath,
              role: this.user.roles ? this.user.roles[0] : "",
            };
            this.loadImage();
          } else {
            this.showMsg(response.data.message, "negative");
          }
        })
        .catch((error) => {
          this.showMsg(error.response?.data.message || error.message, "negative");
        });
    },

    loadImage() {
      if (this.profile.uploadDocumentPath) {
        const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
        const removeImagePath = baseUrl + "fs/download/";
        const filename = this.profile.uploadDocumentPath.replace(removeImagePath, "");

        const formData = new FormData();
        formData.append("filename", filename);

        const ImagePath = baseUrl + "fs/download";
        axios
          .post(ImagePath, formData, { responseType: "blob" })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            this.imageUrl = url;
          })
          .catch((error) => {
            this.showMsg(error.response?.data.message || error.message, "negative");
          });
      } else {
        this.imageUrl = "";
      }
    },
    fetchEnrollmentAssignments() {
  // Access the profile store to get the user ID
  const profileStore = useProfileStore();

  // Ensure the user ID is available before making the API call
  if (!profileStore.user || !profileStore.user.id) {
    console.error("User object is undefined or missing 'id'.");
    return;
  }
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = `${baseUrl}api/enrollmentsAssignments/with-assignments?studentId=${profileStore.user.id}`;

  // Use this.$api.get to make the API call
  this.$api
    .get(apiUrl)
    .then((response) => {
      // Filter out the items where cycleid is 2024
      const filteredData = response.data.filter((item) => item.cycleid !== '2024');

      // Merge and calculate the totals
      const mergedData = filteredData.reduce(
        (acc, item) => {
          acc.totalStudentAssignments += item.totalStudentAssignments || 0;
          acc.totalAssignments += item.totalAssignments || 0;
          return acc;
        },
        { totalStudentAssignments: 0, totalAssignments: 0 }
      );

      // Store the combined totals in the component's data
      this.assignmentTotals = mergedData;

      // Optionally store merged data (if you need to display it later)
      this.enrollmentData = [mergedData];  // Store the merged result as an array for consistency

      console.log("Merged API Response:", mergedData); // Log the merged totals for debugging
      console.log("Total Student Assignments:", mergedData.totalStudentAssignments);
      console.log("Total Assignments:", mergedData.totalAssignments);
    })
    .catch((error) => {
      console.error("Error fetching enrollment assignments:", error.message);
    });
},
fetchDeletedLabVms() {
  // Access the profile store to get the username
  const profileStore = useProfileStore();

  // Ensure the username is available before making the API call
  if (!profileStore.user || !profileStore.user.username) {
    console.error("Username is undefined.");
    return;
  }

  // Define the API URL
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = `${baseUrl}api/labVms/deleted`;

  // Use this.$api.get to make the API call
  this.$api
    .get(apiUrl)
    .then((response) => {
      // Filter the data where the userName matches the profileStore username
      const filteredData = response.data.data.filter(
        (item) => item.userName === profileStore.user.username
      );

      // Count the total VMs used by this user
      this.totalVmsUsed = filteredData.length;

      // Calculate the sum of activeTime for filtered data in hours
      const totalMinutes = filteredData.reduce(
        (sum, item) => sum + (item.activeTime || 0),
        0
      );
      this.totalActiveTime = (totalMinutes / 60).toFixed(2); // Convert to hours and keep 2 decimal places

      // Log the filtered data and calculations for debugging
      console.log("Filtered Data with matching username:", filteredData);
      console.log("Total VMs Used:", this.totalVmsUsed);
      console.log("Total Active Time (hours):", this.totalActiveTime);
    })
    .catch((error) => {
      console.error("Error fetching deleted lab VMs:", error.message);
    });
},
fetchCalendarEvents() {
  // Use this.$api.get for making the API call
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const url =`${baseUrl}api/calendarEvents`
  this.$api.get(url)
    .then((response) => {
      if (response.data && response.data.data && response.data.data.length) {
        // Map the API response to include event details
        const events = response.data.data.map((event) => ({
          title: event.batch,   // Use 'batch' for event title
          date: event.date,     // Use 'date' for event date
          url: event.link,      // Use 'link' for event URL
        }));

        // Update the original events and calendar events
        this.originalEvents = events;
        this.calendarOptions.events = events;

        // Set selectedTitle to the first batch if available
        if (this.originalEvents.length > 0) {
          this.selectedTitle = this.originalEvents[1].title;
        }

        console.log("Mapped Calendar Events:", this.calendarOptions.events);
      } else {
        console.log("No events found in API response.");
      }
    })
    .catch((error) => {
      console.error("Error fetching calendar events:", error.message);
    });
},

  // Filter events based on selectedTitle
  filterEvents() {
    console.log("Selected Title:", this.selectedTitle);
    if (this.selectedTitle) {
      // Filter events based on the selected title
      const filteredEvents = this.originalEvents.filter(
        (event) => event.title === this.selectedTitle
      );

      // Update calendar events with the filtered list
      this.calendarOptions.events = filteredEvents;
    } else {
      // Show no events if no title is selected
      this.calendarOptions.events = [];
    }
  },

  // Fetch calendar events from the API


  // Update event details when an event is clicked
  updateEventDetails(event) {
    // Find the selected event from the originalEvents
    const selectedEvent = this.originalEvents.find(e => e.title === event.title && e.date === event.startStr);

    // If the event is found, update the eventDetails
    if (selectedEvent) {
      this.eventDetails = {
        start: selectedEvent.start,
        batch: selectedEvent.batch,
        end: selectedEvent.end,
        course: selectedEvent.course,
        topic: selectedEvent.topic,
        title: selectedEvent.title
      };
    } else {
      // Reset the eventDetails if the event is not found
      this.eventDetails = {
        start: '',
        batch: '',
        end: '',
        course: '',
        topic: '',
        title: ''
      };
    }
  },

  // Handle the event click to update the blue boxes
  eventClick(info) {
    window.open(info.event.url, '_blank');  // Prevent the default behavior (e.g., opening the URL)

    // Call updateEventDetails to change the boxes' content based on the clicked event
    this.updateEventDetails(info.event);
  },
  drawDoughnutChart() {
      const canvas = this.$refs.doughnutChart;
      const ctx = canvas.getContext("2d");

      // Calculate angles
      const endAngle = (2 * Math.PI * this.percentage) / 100;

      // Draw base circle (gray background)
      ctx.beginPath();
      ctx.arc(75, 75, 70, 0, 2 * Math.PI);
      ctx.fillStyle = "#EAF1FF";
      ctx.fill();
      ctx.closePath();

      // Draw progress (blue arc)
      ctx.beginPath();
      ctx.arc(75, 75, 70, -Math.PI / 2, endAngle - Math.PI / 2);
      ctx.lineTo(75, 75);
      ctx.fillStyle = "#5479F7";
      ctx.fill();
      ctx.closePath();

      // Inner circle (white)
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.closePath();

      // Add percentage text
      ctx.fillStyle = "#5479F7";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${this.percentage}%`, 75, 75);
    },
  
},


  mounted() {
  const profileStore = useProfileStore();
  const { user } = storeToRefs(profileStore);
  this.drawDoughnutChart();


  this.fetchCalendarEvents();
  this.fetchEnrollmentAssignments();
  this.fetchDeletedLabVms();
  
  if (user.value) {
    this.user = user.value;
    this.getUserData();
  } else {
    console.warn("User data not found in store.");
  }
},
watch: {
  // Watch for changes in selectedTitle and call filterEvents
  selectedTitle(newTitle) {
    this.filterEvents(newTitle);
  },
},
};
</script>

<style scoped>
.folder{
  display: flex;
  justify-content: center;
  text-align: center;
  /* width: 400px; */
  height: 250px;
  cursor: pointer;
}
.column1 {
  background-color: #5479F7;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center !important; /* Align items to the top */
  justify-content: flex-start !important; /* Ensure content starts from the top */
  padding-top: 20px; /* Optional: Add spacing from the top */
  padding-bottom: 20px;
  padding-right: 10px;
  padding-right: 10px;
  border-radius: 20px;
}

.user-profile-container {
  
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: transparent !important;
}
.fc {
    display: flex;
    flex-direction: column;
    font-size: 0.6em !important;
}

.row {
  display: flex;
}

.user-image {
  width: 96%;
  margin-left: 4%;
  height: 150px;
  border: 2px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  /* border: 2px solid red; */
  justify-content: center;
  align-items: center;
}
/* .zoom-container {
  transform: scale(0.75); 
  transform-origin: top left; 
  width: 133.33%; 
} */


.user-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.user-image .placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  color: #aaa;
  font-size: 14px;
}

.user-details h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #42b983;
}
.user-details{
    display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.event-details {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.box {
  width: 45%; /* Adjust box width */
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.blue-box {
  background-color: #007BFF; /* Blue background */
  color: white; /* White text color */
}

.user-details ul {
  list-style: none;
  padding: 0;
}

.user-details li {
  margin: 8px 0;
  font-size: 16px;
}

.calendar-container {
  padding: 10px;
  /* height: fit-content !important; */
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  
  background-color: #f9f9f9;
}

.col-4 {
  flex: 1;
  padding: 10px;
}

.progress-container {
  width: 80%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
  font-family: Arial, sans-serif;
}

.progress-label {
  margin-bottom: 1px;
  font-weight: bold;
  font-size: 1rem;
  color: #5479F7;
}

.progress-bar {
  width: 100%;
  margin-bottom: 15px;
  height: 15px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: #5479F7; /* Green color */
  width: 0%;
  border-radius: 10px;
  transition: width 0.3s ease;
}
</style>
