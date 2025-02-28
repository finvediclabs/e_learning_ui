<template>
  <div class="recently-viewed">
    <div class="row w-100 text-left">
      <span class="text-black q-pb-sm" style="width: 100%; font-size: x-large; color: #141414; font-weight: 600; margin-left: 1%;">
        Recently Viewed Programs
      </span>
    </div>

    <!-- Show loading spinner -->
    <q-spinner v-if="loading" color="primary" size="2em" />

    <!-- Show recently viewed programs -->
    <q-list class="row col-12" v-else-if="recentlyViewed.length" style="width: 100%;">
      <div class="row" style="display: flex; flex-wrap: wrap; width: 100%;">
        <div v-for="item in recentlyViewed.slice(0, 2)" :key="item.id"
             class="col-md-6 col-sm-6 col-xs-12 q-px-sm"
             style="display: flex;">

          <q-card class="program-card"
                  style="width: 100%; height: 300px; display: flex; flex-direction: column;">

            <div class="row" style="width: 100%; height: 100%;">

              <!-- Left Side: Image (Full Height) -->
              <div class="col-6" style="display: flex;">
                <q-img :src="item.imagePath" fit="fill"
                       style="width: 100%; height: 100%;" />
              </div>

              <!-- Right Side: Text (Centered) -->
              <div class="col-6"
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

    <!-- Show default programs only if no recently viewed programs exist -->
    <q-list class="row col-12" v-else-if="defaultPrograms.length" style="width: 100%;">
      <div class="row" style="display: flex; flex-wrap: wrap; width: 100%;">
        <div v-for="item in defaultPrograms.slice(0, 2)" :key="item.id"
             class="col-md-6 col-sm-6 col-xs-12 q-px-sm"
             style="display: flex;">

          <q-card class="program-card"
                  style="width: 100%; height: 300px; display: flex; flex-direction: column;">

            <div class="row" style="width: 100%; height: 100%;">

              <!-- Left Side: Image (Full Height) -->
              <div class="col-6" style="display: flex;">
                <q-img :src="item.imagePath" fit="fill"
                       style="width: 100%; height: 100%;" />
              </div>

              <!-- Right Side: Text (Centered) -->
              <div class="col-6"
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
    async fetchRecentlyViewed() {
  console.log("Fetching recently viewed programs...");

  if (!this.user || !this.user.id) {
    console.warn("User not found, skipping API call.");
    this.fetchDefaultPrograms(); // Fetch default programs if user is not available
    return;
  }

  this.loading = true;

  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
    let url = `${baseUrl}api/recently-viewed/${this.user.id}`;
    const response = await this.$api.get(url, {
      headers: { Authorization: `Bearer ${this.token}` },
    });

    if (Array.isArray(response.data) && response.data.length > 0) {
      this.recentlyViewed = response.data.slice(0, 2).map((item) => ({
        id: item.id,
        name: item.programHeading,
        imagePath: item.programImagePath ? item.programImagePath : this.DummyBook,
        description: item.programDescription,
      }));

      console.log("Fetched recently viewed programs:", this.recentlyViewed);

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
      console.log("No recently viewed programs found. Fetching default programs.");
      this.fetchDefaultPrograms();
    }
  } catch (error) {
    console.error("Error fetching recently viewed programs:", error);
    this.fetchDefaultPrograms();
  } finally {
    this.loading = false;
  }
},

    async fetchDefaultPrograms() {
  console.log("fetchDefaultPrograms: Start fetching default programs.");
  this.loading = true;

  try {
    const baseUrl1 = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
    const getURL = `${baseUrl1}api/programs`;
    const response = await this.$api.get(getURL);
    this.loading = false;
    console.log("fetchDefaultPrograms: Response received.", response);

    if (Array.isArray(response.data)) {
      console.log("fetchDefaultPrograms: Parsing item data.");
      this.defaultPrograms = response.data.map((item) => ({
        id: item.id,
        name: item.programHeading,
        imagePath: item.programImagePath ? item.programImagePath : this.DummyBook, // Default if no image
        description: item.programDescription,
      }));

      console.log("fetchDefaultPrograms: Items parsed successfully.", this.defaultPrograms);

      // Fetch images using POST if they are from a downloadable source
      const baseUrl = (process.env.VUE_APP_CORE_URL || "").replace(/\/$/g, "") + "/";
      this.defaultPrograms.forEach((item, index) => {
        console.log(`fetchDefaultPrograms: Processing item [${index}] with ID: ${item.id}.`);
        const imgBaseUrl = `${baseUrl}fs/download/`;

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
              const blob = new Blob([downloadResponse.data]);
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
    } else {
      console.error("fetchDefaultPrograms: Unexpected API response format:", response);
    }
  } catch (error) {
    this.loading = false;
    console.error("fetchDefaultPrograms: Error occurred during fetch:", error);
  } finally {
    console.log("fetchDefaultPrograms: Finished fetching default programs.");
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
</style>
