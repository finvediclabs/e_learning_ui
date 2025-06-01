<template>
  <div  class="group-discussion"
    :style="{ backgroundImage: 'url(' + topBgGd + ')' }">
   <div
   class="q-mx-xl q-mt-xl "
  >
    <div class="q-mt-xl" style="margin-left: 8%;margin-right: 8%;">
<div
  class="gd-background-container"
  :style="{ backgroundImage: 'url(' + gd_background + ')' }"
  v-if="displayedDiscussion"
>
  <!-- Text Overlay -->
  <div class="gd-text-overlay text-h4 text-black">
    <span><strong style="color: #09ca13;">Time:</strong> {{ displayedDiscussion.start }} - {{ displayedDiscussion.end }}</span><br />
    <span><strong style="color:#4b06a3">Date:</strong> {{ displayedDiscussion.date }}</span><br />
    <span><strong>Duration:</strong> {{ calculateDuration(displayedDiscussion.start, displayedDiscussion.end) }}</span>
  </div>

  <!-- Register Button / Status -->
  <div class="text-subtitle1 q-mt-sm q-pt-sm register-button2">
    <template v-if="displayedDiscussion.registeredEmails && displayedDiscussion.registeredEmails.includes(userEmail)">
      <div class="register-button-wrapper2">
        <div class="registered-btn2 highlight">
          <q-icon name="check_circle" class="arrow-icon" />
          Registered
        </div>
      </div>
    </template>
    <template v-else>
      <div class="register-button-wrapper2" @click.stop.prevent="handleRegistration(displayedDiscussion.id)">
        <button
          style="background-color: #2acce0; box-shadow: 0 20px 40px rgba(255, 255, 255, 1);"
          class="register-btn2 animate-on-click"
          :class="{ clicked: clickedButtonId === displayedDiscussion.id }"
        >
          <q-icon name="arrow_forward" class="arrow-icon moving-arrow" />
          Click to Register
        </button>
      </div>
    </template>
  </div>
</div>

</div>




    <div class="column  q-mb-lg">


</div>
    <div class="section q-mx-xl">
      <div class="text-h5 q-mb-md text-bold">Upcoming & Ongoing Discussions</div>
      <div class="cards-container ">
        <div
  v-for="discussion in upcomingAndOngoing"
  :key="discussion.id"
  class="card up-card"
  @click="goToLink(discussion.link)"
>
<div
  class="card-image"
  :style="{ backgroundImage: 'url(' + getRandomImage(discussion.id) + ')' }"
></div>

  <!-- <q-icon :name="getRandomIcon(discussion.id)" class="bg-icon-top" /> -->



  <!-- Title section -->
  <div class="card-title">
    {{ discussion.title || 'Untitled' }}
  </div>

  <!-- Content section -->
  <div class="card-content">
    <div><strong>Topic:</strong> {{ discussion.topic }}</div>
    <div><strong>Course:</strong> {{ discussion.course }}</div>
    <div><strong>Date:</strong> {{ discussion.date }}</div>
    <div><strong>Time:</strong> {{ discussion.start }} - {{ discussion.end }}</div>
    <!-- <div><strong>Created By:</strong> {{ discussion.createdBy || 'N/A' }}</div> -->
    <div><strong>Slots:</strong> {{ discussion.registeredSlotsFilled }}/{{ discussion.maxSlots || 'N/A' }}</div>

<!-- Registration Button or Status -->
<div class="text-subtitle1 q-mt-sm">
  <template v-if="discussion.registeredEmails && discussion.registeredEmails.includes(userEmail)">
    <div class="register-button-wrapper">
      <div class="registered-btn highlight">
        <q-icon name="check_circle" class="arrow-icon" />
        Registered
      </div>
    </div>
  </template>
  <template v-else>
    <div class="register-button-wrapper" @click.stop.prevent="handleRegistration(discussion.id)">
      <button class="register-btn animate-on-click" :class="{ clicked: clickedButtonId === discussion.id }">
        <q-icon name="arrow_forward" class="arrow-icon moving-arrow" />
        Register Now
      </button>
    </div>
  </template>
</div>


  </div>

  <!-- <q-icon :name="getRandomIcon(discussion.id)" class="bg-icon" /> -->
</div>

      </div>
    </div>

<!-- Completed Discussions -->
<div class="section q-mx-xl">
  <div class="text-h5 q-mb-md text-bold">Completed Discussions</div>
  <div class="cards-container completed-card">
    <div
  v-for="discussion in completed"
  :key="discussion.id"
  class="card"
>
  <!-- Image like Upcoming -->
  <div
    class="card-image"
    :style="{ backgroundImage: 'url(' + getRandomImage(discussion.id) + ')' }"
  ></div>

  <!-- Title -->
  <div class="card-title">
    {{ discussion.title || 'Untitled' }}
  </div>

  <!-- Content -->
  <div class="card-content">
    <div><strong>Topic:</strong> {{ discussion.topic }}</div>
    <div><strong>Course:</strong> {{ discussion.course }}</div>
    <div><strong>Date:</strong> {{ discussion.date }}</div>
    <div><strong>Time:</strong> {{ discussion.start }} - {{ discussion.end }}</div>

  </div>

  <!-- Buttons -->
  <div class="card-actions">
    <q-btn
      label="View Transcript"
      class="btn-transcript"
       @click="onCompletedCardClick2(discussion)"
    />
    <q-btn
      label="Observations"
      class="btn-observations"
       @click="onCompletedCardClick(discussion)"
    />
  </div>

  <!-- <q-icon :name="getRandomIcon(discussion.id)" class="bg-icon" /> -->
</div>


  </div>
</div>
</div>

    <!-- Result Dialog -->
   <!-- Result Dialog -->
<q-dialog v-model="resultDialogVisible" persistent>
  <q-card style="min-width: 400px; max-width: 600px;">
    <q-card-section>
      <div class="text-h6">Discussion Result</div>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="highlightedResults.length">
      <div
        v-for="result in highlightedResults"
        :key="result.name"
        style="margin-bottom: 1.5rem;"
      >
        <div class="text-subtitle1">
          <strong>{{ result.name }}</strong> — <em>{{ result.marks }}</em>
        </div>
        <div><strong>Performance:</strong> {{ result.performance }}</div>
        <div><strong>Insights:</strong> {{ result.insights }}</div>
        <div><strong>Remarks:</strong> {{ result.remarks }}</div>
      </div>
    </q-card-section>

    <q-card-section v-else>
      <div>No feedback available.</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Close" color="primary" v-close-popup @click="resultDialogVisible = false" />
    </q-card-actions>
  </q-card>
</q-dialog>


<q-dialog v-model="transcriptDialogVisible" persistent>
  <q-card style="min-width: 400px; max-width: 600px;">
    <q-card-section>
      <div class="text-h6">Transcript</div>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="selectedTranscript && selectedTranscript.sentences && selectedTranscript.sentences.length">
      <div v-for="sentence in selectedTranscript.sentences" :key="sentence.id" style="margin-bottom: 1rem;">
        <strong>{{ sentence.speaker }}:</strong> {{ sentence.transcript }}

      </div>
    </q-card-section>

    <q-card-section v-else>
      <div>No transcript available.</div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Close" color="primary" v-close-popup @click="transcriptDialogVisible = false" />
    </q-card-actions>
  </q-card>
</q-dialog>
  </div>
</template>


<script>
import Img1 from 'src/assets/GD_1.jpg';
import Img2 from 'src/assets/GD_2.jpg';
import gd_background from 'src/assets/gd_background.png';
import topBgGd from 'src/assets/top_bg_gd.png';
import { useProfileStore } from "src/stores/profile";
import { storeToRefs } from "pinia";
export default {
  name: 'GroupDiscussion',
  setup() {
    const profileStore = useProfileStore();
    const { profile, user } = storeToRefs(profileStore);

    console.log("User:", user.value);
    console.log("Profile:", profile.value);
    console.log("email:", user.value.email);
     const userEmail = user.value?.email || '';

    return {
      user,
      profile,
      userEmail,
    };
  },
  data() {
    return {
      discussions: [],
      selectedResult: null,
      clickedButtonId: null,
      gd_background,
      topBgGd,
      resultDialogVisible: false,
        transcriptDialogVisible: false,
    selectedDiscussion: null,
     selectedTranscript: null,
      cardImages: [
      '/src/assets/BG_New.png',
      '/src/assets/Drona_BG.png',

    ],
    imagePalette: [
  Img1, Img2,
],
      gradientPalette: [
        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)',
        'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
      ],
      educationIcons: ['school', 'menu_book', 'local_library', 'emoji_objects', 'lightbulb', 'auto_stories'],
    };
  },
  computed: {
    upcomingAndOngoing() {
      return this.discussions.filter(d => {
    const now = new Date();
    const discussionDate = d.date && d.start ? new Date(`${d.date} ${d.start}`) : null;
const endDate = d.date && d.end ? new Date(`${d.date} ${d.end}`) : null;
if (!discussionDate || !endDate) return false;
    return discussionDate > now || (discussionDate <= now && endDate >= now);
  });
},
 displayedDiscussion() {
    if (!this.upcomingAndOngoing || this.upcomingAndOngoing.length === 0) return null;

    const now = new Date();
    const firstDiscussion = this.upcomingAndOngoing[0];
    const secondDiscussion = this.upcomingAndOngoing[1];

    // Parse the start time of the first discussion (assumes it's ISO or compatible string)
    const firstStart = new Date(firstDiscussion.start);

    // Calculate difference in minutes
    const diffMinutes = (firstStart - now) / 1000 / 60;

    // If less than 30 minutes from now, use second discussion if available
    if (diffMinutes >= 0 && diffMinutes < 30 && secondDiscussion) {
      return secondDiscussion;
    }
    return firstDiscussion;
  },
completed() {
  const now = new Date();
  return this.discussions
    .filter(d => {
      if (!d.date || !d.end) return false;

      // Normalize the end time (ensure it includes ":")
      const endTime = d.end.includes(':') ? d.end : `${d.end}:00`;

      // Construct end datetime using space (not "T", which may fail if time format is odd)
      const endDate = new Date(`${d.date} ${endTime}`);
      return !isNaN(endDate) && endDate < now;
    })
    .sort((a, b) => {
      const endA = new Date(`${a.date} ${a.end.includes(':') ? a.end : `${a.end}:00`}`);
      const endB = new Date(`${b.date} ${b.end.includes(':') ? b.end : `${b.end}:00`}`);
      return endB - endA; // latest completed first
    });
},
  sortedTranscript() {
    if (!this.selectedDiscussion || !this.selectedDiscussion.transcriptParsed) return [];

    // Access sentences array
    const sentences = this.selectedDiscussion.transcriptParsed.sentences || [];
    // Sort by timestamp ascending if needed
    return sentences.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },
     sortedResultFromAiParsed() {
    if (!this.selectedResult || !this.selectedResult.resultFromAiParsed) return [];

    // Convert object entries into array and parse marks
    return Object.entries(this.selectedResult.resultFromAiParsed)
      .filter(([name, data]) => !data.empty)
      .map(([name, data]) => {
        // Extract numeric marks from string like "17/20"
        const marks = parseFloat(data.marks.split('/')[0]);
        return {
          name,
          feedback: data.feedback,
          marks,
          marksString: data.marks
        };
      })
      .sort((a, b) => b.marks - a.marks); // highest marks first
  },
    highlightedResults() {
    if (!this.selectedResult || !this.selectedResult.resultFromAiParsed) return [];

    return Object.entries(this.selectedResult.resultFromAiParsed)
      .map(([name, data]) => ({
        name,
        marks: data.marks,
        performance: data.performance,
        insights: data.insights,
        remarks: data.remarks,
      }));
  },
  },
  methods: {
    getRandomImage(seed) {
  const index = seed % this.imagePalette.length;
  return this.imagePalette[index];
},
  onCompletedCardClick2(discussion) {
      this.selectedDiscussion = discussion;
      this.transcriptDialogVisible = true;
    },
    getRandomCardImage(id) {
    const index = id % this.cardImages.length;
    return this.cardImages[index];
  },
    handleRegistration(id) {
    this.clickedButtonId = id;
    this.registerUser(id); // your existing registration logic

    // Remove animation class after a while
    setTimeout(() => {
      this.clickedButtonId = null;
    }, 1500);
  },
     async registerUser(discussionId) {
      const profileStore = useProfileStore();
      const { user } = storeToRefs(profileStore);

      const email = user.value?.email;
const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const url = baseUrl + `api/groupDiscussions/register/${discussionId}?userEmail=${encodeURIComponent(email)}`;

      try {
        const response = await this.$api.post(url);
        console.log('Registration success:', response.data);
        this.fetchDiscussions();
        // Optionally, show a notification or update UI here
      } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        // Optionally, show error notification here
      }
    },
    fetchDiscussions() {
       const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
              const fetchDiscussions = baseUrl + 'api/groupDiscussions';
      this.$api.get(fetchDiscussions)
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            console.log('Fetched discussions:', response.data.data);
            this.discussions = response.data.data;
          } else {
            console.warn('Unexpected response structure:', response);
            this.discussions = [];
          }
        })
        .catch((error) => {
          console.error('Error fetching discussions:', error);
          this.discussions = [];
        });
    },
   onCompletedCardClick2(discussion) {
  const groupId = discussion.id;
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const fetchTranscriptUrl = baseUrl + 'api/groupDiscussionResults/by-group-id/' + groupId;

  this.$api.get(fetchTranscriptUrl)
    .then((response) => {
      // Assuming the transcriptParsed is inside the response data
      this.selectedTranscript = response.data?.transcriptParsed || null;

      if (!this.selectedTranscript) {
        this.selectedTranscript = { message: 'No transcript found' };
      }

      this.transcriptDialogVisible = true;
    })
    .catch((error) => {
      console.error('Error fetching transcript:', error);
      this.selectedTranscript = { error: 'Failed to load transcript.' };
      this.transcriptDialogVisible = true;
    });
},
onCompletedCardClick(discussion) {
      const groupId = discussion.id;
       const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
       const fetchDiscussionsResults = baseUrl + 'api/groupDiscussionResults/by-group-id/' + groupId;
      this.$api.get(fetchDiscussionsResults)
        .then((response) => {
          this.selectedResult = response.data || { message: 'No data found' };
          this.resultDialogVisible = true;
        })
        .catch((error) => {
          console.error('Error fetching discussion results:', error);
          this.selectedResult = { error: 'Failed to load results.' };
          this.resultDialogVisible = true;
        });
    },
    getGradient(seed) {
      const index = seed % this.gradientPalette.length;
      return this.gradientPalette[index];
    },
    getRandomIcon(seed) {
      const index = seed % this.educationIcons.length;
      return this.educationIcons[index];
    },
    goToLink(url) {
      if (url) {
        window.open(url, '_blank');
      }
    },
    calculateDuration(start, end) {
    // Assuming time format is 'HH:mm'
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    let startDate = new Date();
    let endDate = new Date();

    startDate.setHours(startHour, startMin, 0);
    endDate.setHours(endHour, endMin, 0);

    let diffMs = endDate - startDate;

    // Handle overnight discussions (end is next day)
    if (diffMs < 0) {
      endDate.setDate(endDate.getDate() + 1);
      diffMs = endDate - startDate;
    }

    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  }
  },
  mounted() {
    this.fetchDiscussions();
  },
  watch: {
  discussions: {
    immediate: true,
    handler(val) {
      console.log('All Discussions:', val);
      console.log('Upcoming & Ongoing:', this.upcomingAndOngoing);
      console.log('Completed Discussions:', this.completed);

    }
  }
}
};
</script>


<style scoped>
.group-discussion {
  padding: 2rem 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.section {
  margin-bottom: 3rem;
}
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* gap between cards */
}

.card {
  position: relative;
  flex: 1 1 calc((100% - 2rem) / 3); /* 3 cards per row, 2 gaps of 1rem each */
  padding: 1.25rem;
  border-radius: 16px;
  color: #2e2e2e;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}
.bg-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 120px;
  color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
}
.bg-icon-top {
  position: absolute;
  top: 35px;
  right: 10px;
  font-size: 120px;
  color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

@media (max-width: 1024px) {
  .card {
    flex: 0 1 calc(50% - 1rem);
  }
}

/* ✅ Responsive: 1 card per row on mobile */
@media (max-width: 640px) {
  .card {
    flex: 0 1 100%;
  }
}

/* ================== */
.card {
  position: relative;
  flex: 0 1 calc(33.333% - 1rem);
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.card-content {
  padding: 1rem;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-content strong {
  color: #444;
}

.bg-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 100px;
  color: rgba(66, 72, 194, 0.1);
  pointer-events: none;
}

@media (max-width: 1024px) {
  .card {
    flex: 0 1 calc(50% - 1rem);
  }
}

@media (max-width: 640px) {
  .card {
    flex: 0 1 100%;
  }
}

.card-title {
  display: inline-block;
  color: #4248c2;
  background-color: #e5fef8;
  border-radius: 10px;
  padding: 0.4em 1em;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 1rem 0.9375rem 0 0.9375rem;
  margin-bottom: 0;
  max-width: max-content;
  transition: font-size 0.3s ease, padding 0.3s ease;
  word-break: break-word !important;
  overflow-wrap: anywhere;
}

/* For small screens, allow wrapping */
@media (max-width: 600px) {
  .card-title {
    font-size: 0.9rem;
    padding: 0.3em 0.8em;
    margin: 0.75rem 0.5rem 0 0.5rem;

    white-space: normal;
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}


.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 1.5rem;
  position: relative;
}

/* .register-button-wrapper {
  position: absolute;
  bottom: 2rem;
  right: 1rem;
} */


.register-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: black;
  color: white;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: bold;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.register-btn:active {
  transform: scale(0.97);
  opacity: 0.9;
}

.register-btn .arrow-icon {
  background-color: white;
  color: black;
  border-radius: 50%;
  padding: 4px;
  font-size: 16px;
}


.register-button-wrapper {
  display: flex;
  align-items: flex-end !important;
  justify-content: flex-end;
  /* margin-top: -35px; */
}

.register-button-wrapper2 {
  display: flex;
  align-items: flex-end !important;
  justify-content: flex-end;
  /* margin-top: -35px; */
}

.register-btn,
.registered-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #000;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.register-btn2,
.registered-btn2 {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #000;
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.register-btn2:hover {
  background-color: #1565c0;
}

.registered-btn2 {
  background-color: #4caf50; /* Green */
  cursor: default;
  pointer-events: none;
}


.register-btn:hover {
  background-color: #1565c0;
}

.registered-btn {
  background-color: #4caf50; /* Green */
  cursor: default;
  pointer-events: none;
}

.arrow-icon {
  background-color: white;
  color: #1976d2;
  border-radius: 50%;
  padding: 4px;
  font-size: 20px;
  transition: transform 0.5s ease;
}

.registered-btn .arrow-icon {
  background-color: white;
  color: #4caf50;
}

.clicked .moving-arrow {
  animation: slide-right 0.8s forwards;
}

.gd-background-container {
  position: relative;
  width: 100%;
  margin: auto;
  background-size: cover;
  background-position: center;
  height: 56vh; /* adjust as needed */
  border-radius: 10px;
}

.gd-text-overlay {
  position: absolute;
  bottom: 8vh;
  right: 6vw;
  text-align: left;
  color: white;
  font-weight: bold;
  /* optional: background for contrast */
  padding: 10px;
  border-radius: 6px;
}
.register-button2{
   position: absolute;
  bottom: 40%;
  right:-6%;
  text-align: left;
  color: white;
  font-weight: bold;
  /* optional: background for contrast */
  padding: 10px;
  border-radius: 6px;

}

@keyframes slide-right {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(8px);
  }
  100% {
    transform: translateX(0);
  }
}

.highlight {
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0px rgba(76, 175, 80, 0.6);
  }
  50% {
    box-shadow: 0 0 12px rgba(76, 175, 80, 0.9);
  }
  100% {
    box-shadow: 0 0 0px rgba(76, 175, 80, 0.6);
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  flex-grow: 1;
  padding: 1rem;
  color: #666;
  position: relative;
}

.card-image {
  height: 220px;
  background-size: cover;
  background-position: center;
}


.completed-card .card-title {
  display: inline-block;
  color: #994848 !important;
  background-color: #f3e5f5;
  border-radius: 10px;
  padding: 0.4em 1em;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 1rem 0.9375rem 0 0.9375rem;
  max-width: max-content;
  word-break: break-word;
  overflow-wrap: anywhere;
}


.card-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding: 0 1rem 1rem;
}

.btn-transcript {
  padding: 6px 26px;
  border-radius: 999px;
  background-image: linear-gradient(to right, #4cbbf6, #1253a6);
  color: white;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(76, 187, 246, 0.5);
}

.btn-observations {
  padding: 6px 26px;
  border-radius: 999px;
  background-color: #eef2f2;
  color: black;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap; /* allow wrapping on small screens */
  margin-top: 12px;
}

.btn-transcript,
.btn-observations {
  padding: 6px 18px;
  border-radius: 999px;
  font-weight: 500;
  text-transform: none;
  white-space: nowrap;
  max-width: 100%;
  font-size: 0.9rem;
}

.btn-transcript {
  background-image: linear-gradient(to right, #4cbbf6, #1253a6);
  color: white;
  box-shadow: 0 3px 10px rgba(18, 83, 166, 0.35);
}

.btn-observations {
  background-color: #eef2f2;
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Responsive scaling for ultra-small devices */
@media (max-width: 420px) {
  .btn-transcript,
  .btn-observations {
    font-size: 0.75rem;
    padding: 4px 12px;
  }
}


</style>
