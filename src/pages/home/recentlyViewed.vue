<template>
  <div class="recently-viewed">
    <div class="row w-100 text-left">
      <span class="text-black q-pb-sm" style="width: 100%; font-size: x-large; color: #141414; font-weight: 600; margin-left: 1%;">
        Recently Viewed Programs
      </span>
    </div>

  <!-- Loading State -->
 <div v-if="loading" class="loading-container">
  <q-spinner-hourglass size="40px" color="primary" />
  <p class="loading-text">Recently Viewed...</p>
</div>
    <!-- Show recently viewed programs -->
    <q-list class="row col-12" v-else-if="recentlyViewed.length" style="width: 100%; ">
      <div class="row" style="display: flex; flex-wrap: wrap; width: 100%;">
        <div v-for="item in recentlyViewed.slice(0, 2)" :key="item.id"
             class="col-md-6 col-sm-6 col-xs-12 q-px-sm"
             style="display: flex;"

             >

          <q-card class="program-card"
                  style="width: 100%; height: 220px; display: flex; flex-direction: column; padding: 8px;"
                  >

            <div class="row" style="width: 100%; height: 100%; cursor: pointer;" >

              <!-- Left Side: Image (Full Height) -->
              <div class="col-6" style="display: flex; padding: 8px;">
                <q-img :src="item.imagePath" fit="fill"
                       style="width: 100%; height: 100%; border-radius: 8px;" @click="navigateToCourse(item.programId)" />
              </div>

              <!-- Right Side: Text (Centered) -->
              <div class="col-6 rgt q-pt-md"
                   style="display: flex;  height: 100%; ">
                <q-card-section style="width: 100%; text-align: center;">
                  <q-item-label style="font-size: 1.2em; font-weight: bold; text-align: left;" @click="navigateToCourse(item.programId)">{{ item.name }}</q-item-label>
               <div class="row" style="overflow-y: auto; height: 120px;"> <!-- Set a height to enable scrolling -->
  <q-item-label caption class="description-text" :class="{ expanded: item.expanded }" @click="navigateToCourse(item.programId)">
    {{ item.description }}
  </q-item-label>
  <span
    flat
    dense
    class="read-more-btn "
    v-if="shouldShowReadMore(item.description)"
    @click="item.expanded = !item.expanded"
  >
    {{ item.expanded ? 'Read less' : 'Read more' }}
  </span>
</div>


                </q-card-section>
              </div>

            </div>
          </q-card>

        </div>
      </div>
    </q-list>

    <!-- Show default programs only if no recently viewed programs exist -->
    <q-list class="row col-12" v-else-if="defaultPrograms.length" style="width: 100%;">
      <div class="row" style="display: flex; flex-wrap: wrap; width: 100%;">
        <div v-for="item in defaultPrograms.slice(0, 2)" :key="item.id"
             class="col-md-6 col-sm-6 col-xs-12 q-px-sm"
             style="display: flex;">

          <q-card class="program-card"
                  style="width: 100%; height: 300px; display: flex; flex-direction: column; padding: 8px;">

            <div class="row" style="width: 100%; height: 100%;">

              <!-- Left Side: Image (Full Height) -->
              <div class="col-6" style="display: flex; padding: 8px;">
                <q-img :src="item.imagePath" fit="fill"
                       style="width: 100%; height: 100%; border-radius: 8px;" />
              </div>

              <!-- Right Side: Text (Centered) -->
              <div class="col-6 rgt"
                   style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <q-card-section style="width: 100%; text-align: center;">
                  <q-item-label style="font-size: 1.2em; font-weight: bold; text-align: left;">{{ item.name }}</q-item-label>
                  <q-item-label caption
                                style="font-size: 0.9em; color: gray; word-wrap: break-word; text-align: left;">
                    {{ item.description }}
                  </q-item-label>
                </q-card-section>
              </div>

            </div>
          </q-card>

        </div>
      </div>
    </q-list>

    <!-- Display message if no programs found at all -->
    <div v-else class="no-programs" style="display: flex; align-items: center; justify-content: center; height: 200px; text-align: center;">
      <p style="font-size: 1.2em; font-weight: bold; color: gray;">No programs available.</p>
    </div>
    <div class="col-12 q-mt-none text-right q-pt-sm" style="width: 98%;margin-left: auto;margin-right: auto;">
          <span style="color: #4E5BF8;cursor: pointer;" @click="viewAll">View More Courses →</span>
        </div>
  </div>
</template>

<script>
import axios from "axios";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import { storeToRefs } from "pinia";

export default {
  name: "RecentlyViewed",

  data() {
    return {
      recentlyViewed: [],  // Stores recently viewed programs
      defaultPrograms: [], // Stores default programs if no recently viewed ones exist
      loading: false,
      DummyBook: "https://via.placeholder.com/100",
    };
  },

  computed: {
    token() {
      return storeToRefs(useSessionStore()).token.value;
    },
    user() {
      return storeToRefs(useProfileStore()).user.value;
    },
  },

  methods: {
    viewAll() {
      this.$router.push("/program");
      console.log("View All Clicked");
    },
    async fetchRecentlyViewed() {
  console.log("Fetching programs...");

  if (!this.user || !this.user.id) {
    console.warn("User not found, skipping API call.");
    this.fetchDefaultPrograms(); // Fetch default programs if user is not available
    return;
  }

  this.loading = true;

  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
    let url = `${baseUrl}api/programs`; // Updated URL
    const response = await this.$api.get(url, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
      this.recentlyViewed = response.data.data.slice(0, 2).map((item) => ({
        programId: item.programId,
        id: item.id,
        name: item.heading, // Updated field
        imagePath: item.imagePath ? item.imagePath : this.DummyBook,
        description: item.description, // Updated field
      }));

      console.log("Fetched programs:", this.recentlyViewed);

      // Fetch images if they are from a downloadable source
      const imgBaseUrl = `${baseUrl}fs/download/`;

      this.recentlyViewed.forEach((item, index) => {
        console.log(`Processing item [${index}] with ID: ${item.id}.`);

        if (item.imagePath && item.imagePath.startsWith(imgBaseUrl)) {
          console.log(`Item [${index}] has a downloadable image: ${item.imagePath}`);
          const downloadUrl = `${baseUrl}fs/download`;
          const removePrefix = imgBaseUrl;
          const filename = item.imagePath.replace(removePrefix, "");
          console.log(`Extracted filename for item [${index}]: ${filename}`);

          const formData = new FormData();
          formData.append("filename", filename);

          console.log(`Sending POST request for image of item [${index}].`);
          axios
            .post(downloadUrl, formData, { responseType: "blob" })
            .then((downloadResponse) => {
              console.log(`Received image blob for item [${index}].`);
              const blob = new Blob([downloadResponse.data]);
              const url = window.URL.createObjectURL(blob);
              item.imagePath = url; // Update item with the received blob URL
              console.log(`Updated image for item [${index}]: ${url}`);
            })
            .catch((error) => {
              console.error(`Error fetching image for item [${index}]:`, error);
              item.imagePath = this.DummyBook; // Fallback to default image on error
            });
        } else {
          console.log(`Item [${index}] has a static or missing image.`);
        }
      });
    } else {
      console.log("No programs found. Fetching default programs.");
      this.fetchDefaultPrograms();
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
    this.fetchDefaultPrograms();
  } finally {
    this.loading = false;
  }
},

async navigateToCourse(courseId) {
  console.log('Navigating to course with ID:', courseId);

  if (!this.user) {
    console.error('User data is not available!');
    return;
  }

  const userPayload = this.user; // Directly use this.user
  const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
  let url = `${baseUrl}api/programs/add?programId=${courseId}`; // Updated URL

  try {
    await this.$api.post(url, userPayload);
    console.log('Successfully added to recently viewed:', userPayload);
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }

  this.$router.push({ name: 'ProgramDetails', params: { id: courseId } });
},
 shouldShowReadMore(text) {
    return text && text.length > 100; // Adjust based on your text length
  },

async fetchDefaultPrograms() {
  console.log("fetchDefaultPrograms: Fetching default programs...");

  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
    let url = `${baseUrl}api/programs`;
    const response = await this.$api.get(url, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    console.log("fetchDefaultPrograms: Raw response received.", response);

    // Extracting the correct array from response
    let data = response.data.data.data; // <-- Extract 'data' key

    if (!Array.isArray(data)) {
      console.error("fetchDefaultPrograms: Unexpected API response format:", response);
      return; // Stop execution if data format is unknown
    }

    this.defaultPrograms = data.slice(0, 2).map((item) => ({
      id: item.programId, // Correct key name
      name: item.heading, // Correct key name
      imagePath: item.imagePath ? item.imagePath : this.DummyBook,
      description: item.description, // Correct key name
    }));

    console.log("fetchDefaultPrograms: Default programs parsed successfully.", this.defaultPrograms);

    // Fetch images if they are from a downloadable source
    const imgBaseUrl = `${baseUrl}fs/download/`;

    this.defaultPrograms.forEach((item, index) => {
      console.log(`fetchDefaultPrograms: Processing item [${index}] with ID: ${item.id}.`);

      if (item.imagePath && item.imagePath.startsWith(imgBaseUrl)) {
        console.log(`fetchDefaultPrograms: Item [${index}] has a downloadable image: ${item.imagePath}`);
        const downloadUrl = `${baseUrl}fs/download`;
        const removePrefix = imgBaseUrl;
        const filename = item.imagePath.replace(removePrefix, "");
        console.log(`fetchDefaultPrograms: Extracted filename for item [${index}]: ${filename}`);

        const formData = new FormData();
        formData.append("filename", filename);

        console.log(`fetchDefaultPrograms: Sending POST request for image of item [${index}].`);
        axios
          .post(downloadUrl, formData, { responseType: "blob" })
          .then((downloadResponse) => {
            console.log(`fetchDefaultPrograms: Received image blob for item [${index}].`);
            const blob = new Blob([downloadresponse.data.data]);
            const url = window.URL.createObjectURL(blob);
            item.imagePath = url; // Update item with the received blob URL
            console.log(`fetchDefaultPrograms: Updated image for item [${index}]: ${url}`);
          })
          .catch((error) => {
            console.error(`fetchDefaultPrograms: Error fetching image for item [${index}]:`, error);
            item.imagePath = this.DummyBook; // Fallback to default image on error
          });
      } else {
        console.log(`fetchDefaultPrograms: Item [${index}] has a static or missing image.`);
      }
    });
  } catch (error) {
    console.error("fetchDefaultPrograms: Error occurred while fetching default programs:", error);
  } finally {
    console.log("fetchDefaultPrograms: Finished processing.");
  }
},
  },

  mounted() {
    this.fetchRecentlyViewed();
  },
};
</script>

<style scoped>
.program-card {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.q-img__image {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.no-programs {
  font-size: 1.2em;
  font-weight: bold;
  color: gray;
}
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px; /* or 100vh if you want full screen */
  text-align: center;
  gap: 16px;
}
.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  font-size: 0.9em;
  color: gray;
  word-wrap: break-word;
  transition: all 0.3s ease;
}

.read-more-btn {
  color: blue;
  cursor: pointer;
  font-size: 0.9em;
}
.description-text.expanded {
  -webkit-line-clamp: unset;
  overflow: visible;
}
.loading-text {
  font-size: 20px;
  font-weight: 500;
  color: #4E5BF8;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .program-card {
    margin-bottom: 1rem;
    height: 95% !important;
    padding: 0px !important;
  }
  .q-item-label {
    font-size: 0.9em !important;
  }
  .col-6 {
    flex: 1 1 100%;
    padding: 4px;

  }

  .rgt {
    display: flex;
    align-items: start !important;
    justify-content: start !important;
  }
}

</style>
