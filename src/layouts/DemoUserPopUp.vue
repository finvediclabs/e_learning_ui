<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <button class="close-btn" @click="$emit('close')">×</button>
      <div class="icon-wrapper">
        <q-icon name="lock" size="48px" color="red-6" />
      </div>
      <p class="popup-message">Access Denied</p>
      <p class="popup-subtext">You don’t have permission to access this feature in demo mode.</p>
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
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.popup-content {
  position: relative;
  background-color: #ffffff;
  padding: 2.5rem 2rem;
  margin: 0 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 320px;
  max-width: 400px;
  animation: scaleIn 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  color: #555;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #000;
}

.icon-wrapper {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.popup-message {
  font-size: 20px;
  font-weight: bold;
  color: #d32f2f;
  margin-bottom: 0.5rem;
}

.popup-subtext {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
