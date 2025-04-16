<template>
  <div class="certificate-verification q-py-xl" id="CertificateValidation">
    <h4 class="text-h5 q-mb-sm">Certificate of Authentication</h4>
    <p class="text-subtitle2 q-mb-lg">
      Online authentication of certification to the legitimacy of digital identities
    </p>

    <div class="row justify-center items-stretch q-col-gutter-md" style="width: 80%;margin-left: auto;margin-right: auto;">
      <div class="col-12 col-md-9">
        <q-input
          v-model="uniqueId"
          placeholder="Enter FinVedic Certificate ID for authentication"
          outlined
          dense
          rounded
          class="full-height"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-btn
          label="Check Here"
          color="primary"
          rounded
          unelevated
          class="full-height full-width"
          @click="submitUniqueId"
        />
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
 width: 100%;
  margin: auto;
}
</style>
