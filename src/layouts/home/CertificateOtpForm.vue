<template>
<q-layout view="lHh Lpr lFf " style="min-height: unset">
    <!-- Navigation Bar -->

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
              <q-img :src="new_logo" style="width: 220px;"></q-img>
        </q-item>
          </div>



<q-input
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
</q-input>

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
<div style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
  <div class="q-pa-xl border" style="max-width: 600px; width: 100%;">
  <h4 class="text-h5 q-mx-md text-center" style="margin-top: 0%;"><b>Verify Certificate</b></h4>

  <!-- First Form: Personal Details and Purpose -->
  <q-form v-if="!otpRequested" @submit.prevent="requestOtp">
  <div class="q-mb-lg">
    <div class="text-subtitle2 q-mb-sm">Verifier Name</div>
    <q-input v-model="form.requesterName" label="Verifier Name" outlined dense class="rounded-borders" />
  </div>

  <div class="q-mb-lg">
    <div class="text-subtitle2 q-mb-sm">Verifier Email</div>
    <q-input v-model="form.requesterEmail" label="Verifier Email" type="email" outlined dense class="rounded-borders" />
  </div>

  <div class="q-mb-xl">
    <div class="text-subtitle2 q-mb-sm">Purpose of Request</div>
    <q-input v-model="form.purpose" label="Purpose of Request" outlined dense class="rounded-borders" />
  </div>

  <q-btn
    label="Submit" color="primary" unelevated class="full-width q-mb-lg rounded-borders" type="submit" />
</q-form>


  <!-- Second Form: Certificate Details + OTP -->
  <div v-else>
    <q-form @submit.prevent="verifyOtp">
  <div class="q-mb-lg"><div class="text-subtitle2 q-mb-sm">Certificate Unique ID</div><q-input v-model="form.uniqueId" label="Certificate Unique ID" outlined dense readonly disable class="rounded-borders" /></div>
  <div class="q-mb-lg"><div class="text-subtitle2 q-mb-sm">Certification Issued Date</div><q-input v-model="form.userDob" label="Certification Issued Date" type="date" outlined dense required class="rounded-borders" /></div>
  <div class="q-mb-xl"><div class="text-subtitle2 q-mb-sm">Enter OTP</div><q-input v-model="otp" label="Enter OTP" outlined dense maxlength="6" class="rounded-borders" /></div>
  <q-btn label="Verify OTP" color="primary" unelevated class="full-width rounded-borders" type="submit" />
</q-form>

  </div>

  <!-- Certificate Image Popup -->
  <q-dialog v-model="showDialog" persistent>
    <q-card style="max-width: 600px; width: 100%">
      <q-card-section>
        <div class="text-h6">Certificate</div>
      </q-card-section>
      <q-card-section>
        <img :src="certificateImageUrl" alt="Certificate" style="width: 100%" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup  clickable @click="$router.push('/homeProfile')"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</div>



</q-layout>
</template>


<script>
import axios from "axios";
import bg_img from "src/assets/scalefradepng1.png";
import new_logo from "src/assets/new_logo1.svg";

export default {
  name: "CertificateOtpForm",
  data() {
    return {
      form: {
        uniqueId: "",
        userDob: "",
        requesterName: "",
        requesterEmail: "",
        purpose: "",
      },
      otpRequested: false,
      leftDrawerOpen: false,
      showDialog: false,
      certificateImageUrl: "",
      otp: "", // Single OTP input for now
      bg_img,
      new_logo,
    };
  },
  mounted() {
    const routeUniqueId = this.$route.query.uniqueId;
    if (routeUniqueId) {
      this.form.uniqueId = routeUniqueId;
    }
  },
  methods: {
    async requestOtp() {
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const requestOTP = baseUrl + 'api/certification-verifications/request-otp';

      try {
        await axios.post(requestOTP, {
          requesterName: this.form.requesterName,
          requesterEmail: this.form.requesterEmail,
          purpose: this.form.purpose,
        });

        this.otpRequested = true;
        this.$q.notify({
          type: "positive",
          message: "OTP sent successfully to your email.",
        });
      } catch (err) {
        console.error("Error occurred:", err);
        this.$q.notify({
          type: "negative",
          message: "Failed to send OTP. Please check your details.",
        });
      }
    },

    async verifyOtp() {
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const verifyOtp = baseUrl + 'api/certification-verifications/verify-otp';
      const downloadUrl = baseUrl + 'fs/download';

      try {
        const response = await axios.post(
          verifyOtp,
          this.form,
          {
            params: {
              requesterEmail: this.form.requesterEmail,
              otp: this.otp,
            },
          }
        );

        const { imagePath } = response.data.data;

        if (imagePath && imagePath.startsWith(baseUrl + "fs/download/")) {
          const filename = imagePath.replace(baseUrl + "fs/download/", "");
          const formData = new FormData();
          formData.append("filename", filename);

          const downloadResponse = await fetch(downloadUrl, {
            method: "POST",
            body: formData,
          });

          if (!downloadResponse.ok) throw new Error("Download failed");

          const blob = await downloadResponse.blob();
          this.certificateImageUrl = URL.createObjectURL(blob);
        }

        this.$q.notify({
          type: "positive",
          message: "OTP verified successfully!",
        });

        this.showDialog = true;
      } catch (err) {
        this.$q.notify({
          type: "negative",
          message: "OTP verification failed. Please try again.",
        });
      }
    }
  }
}
</script>

<style scoped>
.logo_in {
  min-height: 0px !important;
  cursor: pointer;
}
.bg-Customblue {
  background-color: #4E5BF8;
}
.border{
  border: 1px solid #E2E8F0;
  border-radius: 20px;
}
</style>
