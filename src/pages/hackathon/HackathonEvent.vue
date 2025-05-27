<template>
  <div>
    <!-- Mobile View -->
    <div class="mobilepart" v-if="isMobile">
      <div
        class="mobile-content"
        style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100vw; height: 50vh; padding: 20px; background-color: #f9f9f9; color: #333; text-align: center;"
      >
        <h1 style="font-size: 2em; font-weight: bold; color: #007bff; margin-bottom: 15px;">Hackathon</h1>
        <p style="font-size: 1.2em; margin: 5px 0;">📅 Date: December 15, 2024</p>
        <p style="font-size: 1.2em; margin: 5px 0;">🌐 Mode: Online</p>
        <p style="font-size: 1.2em; margin: 5px 0;">📌 Topic: AI & ML in Fintech</p>
        <p style="font-size: 1.2em; margin: 5px 0;">🏆 Prizes Worth: Up to 50,000</p>
        <div style="margin-top: 20px; width: 100%;">
          <a
            href="https://fnbackendprod.finvedic.in/api/checkout?PCode=H001"
            class="btn rounded-pill text-white"
            style="font-size: 1.3em; background-color: #007bff; padding: 12px 25px; text-decoration: none; border-radius: 30px; width: 100%; max-width: 250px;"
          >
            Click to Register
          </a>
        </div>
      </div>
    </div>

    <!-- Desktop View -->
    <div class="desk" v-else>
    <div
    :style="{
      backgroundImage: `url(${Hackathonevent})`,
      width: '100vw',
      height: '80vh',
      backgroundSize: 'cover',
      position: 'relative'
    }"
  >
  <div
  style="
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  "
>
  <a
    href="https://fnbackendprod.finvedic.in/api/checkout?PCode=H001"
    class="register-btn"
  >
    Click to Register
  </a>
</div>

  </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Hackathonevent from 'src/assets/Hackathonevent.png'

const isMobile = ref(window.innerWidth <= 768)

const updateScreen = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', updateScreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreen)
})
</script>
