<template>
  <q-layout view="lHh Lpr lFf " style="min-height: unset;">

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
handleSubmit() {
  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const apiUrl = baseUrl + 'api/checkout';

  // Get product code from route query or use default H001
  const productCode = this.$route.query.product || 'H001';

  const params = new URLSearchParams({
    PCode: productCode,
    firstName: this.form.firstName,
    lastName: this.form.lastName,
    email: this.form.email,
    phone: this.form.phoneNo
  });

  // Proceed with API request or redirection
  window.location.href = `${apiUrl}?${params.toString()}`;
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

