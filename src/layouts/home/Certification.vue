<template>
  <div class="certification">
    <div class="q-pb-xl">
      <span class="text-black header_Program">Our Certifications</span>
    </div>
<div class="row col-12 mob_column" style="display: flex;align-items: center;">
  <div class="col-6 girl-img">
    <q-img :src="Hero_Girl" style="width: 60%;"></q-img>
  </div>
    <div class="row q-col-gutter-md col-6 mob_column" >
      <div class="col-6" v-for="program in programs" :key="program.programId" @click="goToProgram(program.programId)">
        <q-card class="course-card8">
          <q-img
            v-if="program.localImageUrl"
            :src="program.localImageUrl"
            alt="Program Image"
            class="course-image8 q-pa-lg"
          />
          <q-card-section>
            <p class="text-bold text-left blue_color">{{ program.heading }}</p>
            <span class="text-caption">{{ program.description }}</span>
            <p class="text-caption"><strong>Prerequisite:</strong> {{ program.eligibility }}</p>
            <p class="text-caption"><strong>Duration:</strong> {{ program.duration }} days</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import Hero_section from 'src/assets/Hero_section.png'
import Hero_Girl from 'src/assets/Hero_Girl.png'

export default {
  name: 'Certification',
  data() {
    return {
      programs: [],
      Hero_section:Hero_section,
      Hero_Girl:Hero_Girl,
      baseUrl: 'https://fnbackendprod.finvedic.in/', // Base URL
      DummyBook: 'https://via.placeholder.com/150', // Fallback image
    };
  },
  async mounted() {
    await this.fetchPrograms();
  },
  methods: {
    async fetchPrograms() {
      try {
        const response = await axios.get(`${this.baseUrl}api/programsInfo`);
        if (response.data.success) {
          const programs = response.data.data;

          // Fetch images inside the same method
          for (const program of programs) {
            let imageUrl = program.imagePath;
            if (imageUrl && imageUrl.startsWith(`${this.baseUrl}fs/download/`)) {
              console.log(`Fetching image for: ${program.heading}`);
              const downloadUrl = `${this.baseUrl}fs/download`;
              const filename = imageUrl.replace(`${this.baseUrl}fs/download/`, '');

              try {
                const formData = new FormData();
                formData.append('filename', filename);

                const downloadResponse = await axios.post(downloadUrl, formData, { responseType: 'blob' });
                const blob = new Blob([downloadResponse.data]);
                program.localImageUrl = window.URL.createObjectURL(blob);

                console.log(`Fetched image for: ${program.heading}`);
              } catch (error) {
                console.error(`Error fetching image for: ${program.heading}`, error);
                program.localImageUrl = this.DummyBook;
              }
            } else {
              program.localImageUrl = imageUrl || this.DummyBook;
            }
          }

          // Assign modified programs to the data property
          this.programs = programs;
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    },
    goToProgram(programId) {
    if (programId) {
      this.$router.push(`/finassociate/?programId=${programId}`);
    } else if (this.programs.length > 0) {
      this.$router.push(`/finassociate/?programId=${this.programs[0].programId}`);
    } else {
      this.$router.push('/finassociate/');
    }
  }
  }
};
</script>
<style scoped>
.certification {
  padding: 2rem;
  text-align: center;
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

  .girl-img {
    display: none;
  }

  .course-card8 {
    width: 100% !important;
  }
}

</style>
