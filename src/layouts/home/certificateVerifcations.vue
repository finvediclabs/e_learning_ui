<template>
  <div class="certificate-verification q-py-xl" id="CertificateValidation">
    <h4 class="text-h4 q-mb-sm q-pb-sm" style="
    margin-top: 0px;"><b>Certificate of Authentication</b></h4>
    <p class="text-h5 q-mb-lg">
      Online authentication of certification to the legitimacy of digital identities
    </p>

    <div class="row justify-center q-col-gutter-md" style="width: 80%; margin: auto;">
      <div class="row justify-center q-col-gutter-md" style="width: 80%; margin: auto;padding: 0%;">
  <div class="col-8" style="padding: 0% !important;">
    <q-input
  v-model="uniqueId"
  placeholder="Enter FinVedic Certificate ID for authentication"
  outlined
  dense
  rounded
  class="full-width"
  bg-color="white"
  style="position: relative;"
>
  <template v-slot:append>
    <q-btn
      label="Check Here"
      color="primary"
      unelevated
      rounded
      dense
      class="q-px-none"
      style="position: absolute; right: 1px; min-width: 120px; height: calc(100% - 4px); border: 2px solid #fff;"
      @click="submitUniqueId"
    />
  </template>
</q-input>

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

</style>
