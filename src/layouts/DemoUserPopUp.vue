<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <p>You don't have access to this.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemoUserPopUp",
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  position: relative;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  font-size: 18px;
  color: #ff0000;
  min-width: 300px;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #000;
}
</style>
