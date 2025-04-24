<template>
  <div class="certificate-verification q-py-xl" id="CertificateValidation">
    <h4 class="text-h4 q-mb-sm q-pb-sm" style="
    margin-top: 0px;"><b>Certificate of Authentication</b></h4>
    <p class="text-h5 q-mb-lg">
      Online authentication of certification to the legitimacy of digital identities
    </p>

    <div class="row justify-center q-col-gutter-md mob-place" style="width: 80%; margin: auto;">
      <div class="row justify-center q-col-gutter-md mob-place" style="width: 80%; margin: auto;padding: 0%;">
  <div class="col-8" style="padding: 0% !important;"> 
    <div class="cert-input-container">
  <q-input
    v-model="uniqueId"
    placeholder="Enter FinVedic Certificate ID for authentication"
    outlined
    dense
    rounded
    class="cert-input"
    bg-color="white"
  >
    <template v-slot:append>
      <q-btn
        label="Check Here"
        color="primary"
        unelevated
        rounded
        dense
        class="check-btn hide-on-mobile"
        @click="submitUniqueId"
      />
      <q-icon
        name="arrow_forward"
        class="arrow-btn show-on-mobile"
        size="md"
        @click="submitUniqueId"
      />
    </template>
  </q-input>
</div>



  </div>
</div>

</div>

  </div>
</template>

<script>
export default {
  name: "CertificateVerifications",
  data() {
    return {
      uniqueId: "",
    };
  },
  methods: {
    submitUniqueId() {
  if (this.uniqueId.trim()) {
    this.$router.push({
      path: '/certificateValidation',
      query: { uniqueId: this.uniqueId.trim() }
    });
  } else {
    this.$q.notify({
      type: 'warning',
      message: 'Please enter a valid certificate ID.',
    });
  }
}
}
};
</script>

<style scoped>
.certificate-verification {
  text-align: center;
 width: 80%;
 border-radius: 20px;
 background-color: #4E5BF8;
 color: white;
  margin: auto;
}

.check-btn {
  position: absolute;
  right: 1px;
  min-width: 120px;
  height: calc(100% - 4px);
  border: 2px solid #fff;
  z-index: 2;
}

.arrow-btn {
  cursor: pointer;
  color: #4E5BF8;
  font-size:large !important;
  margin-left: 0px !important;
}

/* Mobile-specific visibility handling */
@media screen and (max-width: 600px) {
  .hide-on-mobile {
    display: none !important;
  }

  .show-on-mobile {
    display: inline-block !important;
  }

  .check-btn {
    display: none;
  }

  .mob-place {
    width: 100% !important;
  }

  .cert-input{
    font-size: x-small;
  }
}

/* @media screen and (min-width: 601px) {
  .show-on-mobile {
    display: none !important;
  }
} */

/* .cert-input-container {
  width: 100% !important;
  display: flex;
  justify-content: center;
}

.cert-input {
  width: 100% !important;
  max-width: 600px; 
}

.check-btn {
  position: absolute;
  right: 1px;
  min-width: 120px;
  height: calc(100% - 4px);
  border: 2px solid #fff;
  z-index: 2;
}

.arrow-btn {
  cursor: pointer;
  color: #4E5BF8;
  padding-right: 8px;
} */

/* Mobile-specific visibility */
/* @media screen and (max-width: 600px) {
  .hide-on-mobile {
    display: none !important;
  }
  .show-on-mobile {
    display: inline-block !important;
  }
  .check-btn {
    display: none;
  }
} */

/* @media screen and (min-width: 601px) {
  .show-on-mobile {
    display: none !important;
  }
} */



</style>
