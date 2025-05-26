<template>
  <div class="all-certifications">
<div class="row w-100 text-left q-mt-md q-mx-xl">
      <span class="text-black header_freeCourses" style="width: 100%;">
        Start learning journey with our <span class="blue_color">Certifications</span>
      </span>
      <span class="text-black desc_mostPopular" style="width: 100%;">
        "Unlock endless learning opportunities with our Certifications, designed to expand your knowledge"
      </span>
    </div>
 <div class="q-mt-lg q-mx-xl">
      <div
        v-for="program in programs"
        :key="program.programId"
        class="q-pa-md q-mb-xl bg-white rounded-borders shadow-2"
      >
        <!-- Program Name -->
        <div class="text-h5 text-weight-bold q-mb-md">{{ program.heading }}</div>

        <!-- Content Row -->
        <div class="row" style="width: 100%;">

          <!-- Program Image + Description -->
          <div class="col-12 col-md-3">
            <q-img
              :src="program.localImageUrl"
              alt="Program Image"
              class="rounded-borders"
              style="max-height: 180px; object-fit: cover;"
              :ratio="4/3"
              spinner-color="primary"
              contain
            />
            <div class="text-grey q-mt-sm">
              {{ program.description }}
            </div>
          </div>

          <!-- Chapter Images + Chapter Names -->
          <div class="col-9">
  <div class="row col-12" style="width: 100%;">
    <div
      v-for="(img, idx) in program.localChapterImageUrls"
      :key="idx"
      class="col-4 text-center"
        >
      <q-img
        :src="img"
        class="rounded-borders"
        style="width: 60%;  object-fit: cover;"
        spinner-color="primary"
        contain
      />
      <div class="q-mt-xs">
        <q-badge class="text-body1" style="background-color: #2528CB;color: #ffff;">
          {{ program.chapterCategoryNames[idx] ? program.chapterCategoryNames[idx].trim() : '' }}
        </q-badge>
      </div>
    </div>
  </div>
</div>
        </div>


      </div>
    </div>


  </div>
</template>

<script>
import axios from 'axios';
export default {

  name: 'AllCertifications',
   data() {
    return {
      programs: [],

      baseUrl: 'https://fnbackendprod.finvedic.in/',
    };
  },
  async mounted() {
    await this.fetchPrograms();
  },
  // ...existing code...
  methods: {
 async fetchPrograms() {
  try {
    const response = await axios.get(`${this.baseUrl}api/programsInfo`);
    if (response.data.success) {
      const programs = response.data.data;
      const downloadUrl = `${this.baseUrl}fs/download`;

      const fetchImageAsBlobUrl = async (imageUrl) => {
        if (!imageUrl || !imageUrl.startsWith(`${this.baseUrl}fs/download/`)) {
          return imageUrl || this.DummyBook;
        }

        const filename = imageUrl.replace(`${this.baseUrl}fs/download/`, '');
        try {
          const formData = new FormData();
          formData.append('filename', filename);

          const downloadResponse = await axios.post(downloadUrl, formData, { responseType: 'blob' });
          const blob = new Blob([downloadResponse.data]);
          return window.URL.createObjectURL(blob);
        } catch (error) {
          console.error(`Error fetching image for filename: ${filename}`, error);
          return this.DummyBook;
        }
      };

      for (const program of programs) {
        program.localImageUrl = await fetchImageAsBlobUrl(program.imagePath);

        if (Array.isArray(program.chapterCategoryImagePaths) && program.chapterCategoryImagePaths.length > 0) {
          program.localChapterImageUrls = [];
          for (const chapterImageUrl of program.chapterCategoryImagePaths) {
            const localUrl = await fetchImageAsBlobUrl(chapterImageUrl);
            program.localChapterImageUrls.push(localUrl);
          }
        } else {
          program.localChapterImageUrls = [];
        }

        // ✅ Apply name replacement condition
        if (Array.isArray(program.chapterCategoryNames)) {
          program.chapterCategoryNames = program.chapterCategoryNames.map(name => {
            return name === 'Specialization' ? 'Equities & Electronic Trading' : name;
          });
        }
      }

      this.programs = programs;
    }
  } catch (error) {
    console.error('Error fetching programs:', error);
  }
}

    // You can add methods here if needed
  },
};
</script>

<style scoped>
.certification {
  padding: 2rem;
  text-align: center;
}
.blue_color{
  color: #4e5bf8 !important;
  /* font-size: 18px; */
}

.header_Program {
  font-family: sans-serif;
  font-size: 2rem;
  font-weight: 700;
}

.course-card8 {
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  text-align: left;
  overflow: hidden;
}

.course-image8 {
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 3%;
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}

.course-card8:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.girl-img-inner {
  width: 70%;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.girl-img {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}
.header_freeCourses{
  font-family: sans-serif;
  font-size: 2rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .mob_column {
    display: flex !important;
    flex-direction: column !important;
    align-items: center;
    width: 100%;
  }

  .col-6 {
    width: 100% !important;
  }



  .girl-img-inner {
    display: none !important;
    width: 90% !important;
  }

  .course-card8 {
    width: 100% !important;
  }
  .cert-pad{
    padding-bottom: 0px;
  }
}



</style>
