<template>
  <div class="individual">
    <h1>Welcome to the Individual Component</h1>
    <p>This is a dummy template for the Individual component.</p>
  </div>
</template>

<script>
export default {
  name: 'Individual',
  data() {
    return {
      message: 'Hello, Vue!'
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
.individual {
  text-align: center;
  margin-top: 50px;
}
</style>
