<template>
  <div class="group-discussion q-mx-xl">
    <div class="column  q-mb-lg">


</div>
    <div class="section">
      <div class="text-h5 q-mb-md text-bold">Upcoming & Ongoing Discussions</div>
      <div class="cards-container">
        <div
          v-for="discussion in upcomingAndOngoing"
          :key="discussion.id"
          class="card"
          :style="{ background: getGradient(discussion.id) }"
          @click="goToLink(discussion.link)"
        >
          <div class="text-h5">{{ discussion.title || 'Untitled' }}</div>
          <div class="text-body-1"><strong>Topic:</strong> {{ discussion.topic }}</div>
          <div class="text-body-1"><strong>Course:</strong> {{ discussion.course }}</div>
          <div class="text-body-1"><strong>Date:</strong> {{ discussion.date }}</div>
          <div class="text-body-1"><strong>Time:</strong> {{ discussion.start }} - {{ discussion.end }}</div>
          <div class="text-body-1"><strong>Created By:</strong> {{ discussion.createdBy || 'N/A' }}</div>
          <q-icon :name="getRandomIcon(discussion.id)" class="bg-icon" />
          <div class="text-subtitle1 q-mt-md">
  <q-btn color="primary" label="Register" @click="registerUser" />
  </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="text-h5 q-mb-md text-bold">Completed Discussions</div>
      <div class="cards-container">
        <div
          v-for="discussion in completed"
          :key="discussion.id"
          class="card"
          :style="{ background: getGradient(discussion.id) }"
          @click="onCompletedCardClick(discussion)"
        >
          <div class="text-h5">{{ discussion.title || 'Untitled' }}</div>
          <div class="text-body-1"><strong>Topic:</strong> {{ discussion.topic }}</div>
          <div class="text-body-1"><strong>Course:</strong> {{ discussion.course }}</div>
          <div class="text-body-1"><strong>Date:</strong> {{ discussion.date }}</div>
          <div class="text-body-1"><strong>Time:</strong> {{ discussion.start }} - {{ discussion.end }}</div>
          <div class="text-body-1"><strong>Created By:</strong> {{ discussion.createdBy || 'N/A' }}</div>
          <q-icon :name="getRandomIcon(discussion.id)" class="bg-icon" />
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

  </div>
</template>


<script>
export default {
  name: 'GroupDiscussion',
  data() {
    return {
      discussions: [],
      selectedResult: null,
      resultDialogVisible: false,
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

    completed() {
      const now = new Date();
      return this.discussions
        .filter(d => {
          const endDateTime = new Date(`${d.date}T${d.end}:00`);
          return endDateTime < now; // event ended
        })
        .sort((a, b) => {
          const endA = new Date(`${a.date}T${a.end}:00`);
          const endB = new Date(`${b.date}T${b.end}:00`);
          return endB - endA; // most recent end first
        });
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
    registerUser() {
  const email = this.$store?.getters?.['profile/email'] || 'user@example.com';
  console.log('Register clicked by:', email);
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
    }
  }
}
};
</script>


<style scoped>
.group-discussion {
  padding: 2rem 0;
}
.section {
  margin-bottom: 3rem;
}
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.card {
  position: relative;
  flex: 0 1 calc(33.333% - 1rem);
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
</style>
