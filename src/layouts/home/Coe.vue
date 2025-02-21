<template>
  <div class="coe">
    <h1>Welcome to the CoE Page</h1>
    <p>This is a dummy template for the CoE page.</p>
  </div>
</template>

<script>
export default {
  name: 'Coe',
  data() {
    return {
      message: 'Hello, CoE!'
    };
  },
  methods: {
    greet() {
      alert(this.message);
    }
  }
};
</script>

<style scoped>
.coe {
  text-align: center;
  margin-top: 50px;
}
</style>
