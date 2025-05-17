<template>
  <q-layout view="lHh Lpr lFf " style="min-height: unset;">
    <q-toolbar>
        <!-- Left Side: Logo, q-select, q-search -->
        <q-toolbar-title class="row items-center q-py-sm q-mt-lg">
          <!-- Menu for small screens -->
          <q-btn
            flat
            dense
            round
            icon="menu"
            class="lt-md"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <!-- Placeholder for logo -->
          <div class="q-ml-md logo">
            <!-- Logo will be added here later -->
            <q-item class="logo_in" to="/">
              <q-img :src="new_logo1" style="width: 280px;"></q-img>
        </q-item>
          </div>



<!-- <q-input
  v-if="!$q.screen.lt.md"
  dense
  outlined
  placeholder="Explore, Fuel Your Curiosity..."
  class="q-ml-md search-box"
  bg-color="transparent"
  color="#4E5BF8"
  rounded
  style="width: 300px;"
>
  <template v-slot:append>
    <q-icon name="search" />
  </template>
</q-input> -->

        </q-toolbar-title>

        <!-- Right Side: Navigation Links (Hidden on Mobile) -->
        <div class="row items-center q-gutter-md gt-sm q-mt-sm">
          <q-select
  v-if="!$q.screen.lt.sm"
  v-model="selectedExplore"
  :options="exploreOptions"
  clearable
  label="Courses"
  dense
  outlined
  emit-value
  color="#4E5BF8"
  map-options
  class="q-ml-md explore"
  style="min-width: 140px;"
/>
          <!-- <q-btn noCaps flat label="Courses" class="nav-link" /> -->
          <q-btn noCaps flat label="Certifications" class="nav-link" />
          <q-btn noCaps flat label="Login" class="nav-link" :to="'/login'" style="color: #4E5BF8" />
          <q-btn noCaps label="Join for Free" unelevated class="join-btn" style="background-color: #4E5BF8; color: white;" />

        </div>
      </q-toolbar>

      <q-drawer v-model="leftDrawerOpen" side="left" overlay class="bg-white">
  <!-- Close Button -->
  <div class="row justify-end q-pa-md">
    <q-btn flat dense round icon="close" @click="leftDrawerOpen = false" />
  </div>

  <q-list>
    <q-item clickable v-ripple>
      <q-item-section>Courses</q-item-section>
    </q-item>
    <q-item clickable v-ripple>
      <q-item-section>Career</q-item-section>
    </q-item>
    <q-item clickable v-ripple :to="'/login'">
      <q-item-section>Login</q-item-section>
    </q-item>
    <q-item clickable v-ripple>
      <q-item-section>
        <q-btn noCaps label="Join for Free" unelevated class="full-width" style="background-color: #4E5BF8; color: white;" />
      </q-item-section>
    </q-item>

  </q-list>
</q-drawer>
<q-page >
    <q-card class="q-pa-lg shadow-2 form-card">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Registration Form</div>
      </q-card-section>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">First Name</div>
              <q-input
                v-model="form.firstName"
                label="First Name"
                outlined
                dense
                class="rounded-borders"
                required
              />
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">Last Name</div>
              <q-input
                v-model="form.lastName"
                label="Last Name"
                outlined
                dense
                class="rounded-borders"
                required
              />
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">Phone Number</div>
              <q-input
                v-model="form.phoneNo"
                label="Phone Number"
                outlined
                dense
                class="rounded-borders"
                required
              />
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">Email</div>
              <q-input
                v-model="form.email"
                label="Email"
                type="email"
                outlined
                dense
                class="rounded-borders"
                required
              />
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">About Me</div>
              <q-input
                v-model="form.aboutMe"
                label="About Me"
                type="textarea"
                outlined
                dense
                class="rounded-borders"
                autogrow
                required
              />
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">Profession</div>
              <q-select
                v-model="form.profession"
                :options="professions"
                label="Profession"
                outlined
                dense
                class="rounded-borders"
                required
              />
            </div>
          </div>
        </div>

        <div class="q-mt-xl flex flex-center">
          <q-btn
            label="Register"
            type="submit"
            color="primary"
            class="q-px-xl"
          />
        </div>
      </q-form>
    </q-card>
</q-page>
</q-layout>
</template>


<script>
import axios from 'axios';
import bg_img from "src/assets/scalefradepng1.png";
import new_logo from "src/assets/new_logo1.svg";
import new_logo1 from "src/assets/ScaleGrad_blue.svg";
export default {
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        phoneNo: '',
        aboutMe: '',
        email: '',
        profession: '',
      },
      professions: [
        'I am a student/fresh graduate',
        'I am a working professional',
        'I am just researching',
      ],
      bg_img,
      leftDrawerOpen: false,
      new_logo,
      new_logo1:new_logo1
    };
  },
  methods: {
    async handleSubmit() {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = baseUrl + 'api/web-enrolls';

  try {
    const response = await axios.post(apiUrl, this.form);
    this.$q.notify({
      type: 'positive',
      message: 'Registration successful!',
    });
    this.resetForm();

    // Wait for 3 seconds before redirecting
    setTimeout(() => {
      this.$router.push('/home');  // 👈 Redirect to home
    }, 3000);  // 3000ms = 3 seconds
  } catch (error) {
    console.error('Error:', error);
    this.$q.notify({
      type: 'negative',
      message: 'Registration failed. Try again.',
    });
  }
},
    resetForm() {
      this.form = {
        firstName: '',
        lastName: '',
        phoneNo: '',
        aboutMe: '',
        email: '',
        profession: '',
      };
    },
  },
};
</script>

<style scoped>
.form-card {
  width: 60%;
  background-color: #f8f9fa;
  color: #4E5BF8 !important;
  border-radius: 20px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  /* max-width: 800px; */
}

.logo_in {
  min-height: 0px !important;
  cursor: pointer;
}
.bg-Customblue {
  background-color: #4E5BF8;
}

@media (max-width: 600px) {
  .form-card {
    width: 90%;
  }
}
</style>

