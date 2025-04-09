<template>
  <transition name="toast">
    <div class="toast" v-if="visible">
      <q-icon name="lock" size="28px" color="red-6" class="q-mr-sm" />
      <div class="toast-content">
        <div class="toast-title">Access Denied</div>
        <div class="toast-subtext">You don’t have permission to access this feature in demo mode.</div>
      </div>
      <button class="toast-close" @click="close">×</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "DemoUserToast",
  data() {
    return {
      visible: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.close();
    }, 4000); // Auto-dismiss after 4 seconds
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.toast {
  position: fixed;
  top: 10%;
  right: 2%;
  background: #fff;
  border-left: 6px solid #f44336;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  min-width: 300px;
  max-width: 350px;
  z-index: 10000;
  animation: slideIn 0.3s ease;
}

.toast-content {
  flex-grow: 1;
}

.toast-title {
  font-size: 16px;
  font-weight: bold;
  color: #d32f2f;
}

.toast-subtext {
  font-size: 13px;
  color: #666;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #888;
  margin-left: 1rem;
  transition: color 0.2s;
}
.toast-close:hover {
  color: #000;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideIn {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
