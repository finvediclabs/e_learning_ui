<template>
  <div>
    <!-- Mobile View -->
    <div class="mobilepart" v-if="isMobile">
      <div
        class="mobile-content"
        style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100vw; height: 50vh; padding: 20px; background-color: #f9f9f9; color: #333; text-align: center;"
      >
        <h1 style="font-size: 2em; font-weight: bold; color: #007bff; margin-bottom: 15px;">Hackathon</h1>
        <p style="font-size: 1.2em; margin: 5px 0;">📅 Date: June 15, 2025</p>
        <p style="font-size: 1.2em; margin: 5px 0;">🌐 Mode: Online</p>
        <p style="font-size: 1.2em; margin: 5px 0;">📌 Topic: AI & ML in Fintech</p>
        <p style="font-size: 1.2em; margin: 5px 0;">🏆 Prizes Worth: Up to 50,000</p>
        <div style="margin-top: 20px; width: 100%;">
          <router-link :to="'/register'" style="text-decoration: none; color: white;">
            <span
              class="btn rounded-pill text-white"
              style="font-size: 1.3em; background-color: #007bff; padding: 12px 25px; text-decoration: none; border-radius: 30px; width: 100%; max-width: 250px;"
            >
              Click to Register
            </span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Desktop View -->
    <div class="desk q-mt-xl" v-else>
      <div
        :style="{
          backgroundImage: `url(${backgroundImage})`,
          width: '80vw',
          height: '80vh',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
          margin: '0 auto'
        }"
      >
        <div
          style="
            position: absolute;
            margin-bottom: 8%;
            bottom: 40px;
            left: 47%;
            transform: translateX(-50%);
            text-align: center;
          "
        >
          <router-link :to="{ path: '/register', query: { product: 'H003' } }" style="text-decoration: none; color: white;">
            <span
              class="btn rounded-pill text-white"
              style="font-size: 1.3em; background-color: #007bff; padding: 12px 25px; text-decoration: none; border-radius: 30px; width: 100%; max-width: 250px;"
            >
              Click to Register
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'

// Import images
import Hackathonevent from 'src/assets/Hackathonevent.png'
import SeminarEvent from 'src/assets/seminarEvent.png'
import Webinar_Event from 'src/assets/Webinar_event.png'

// Track screen size
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

// Get route param
const route = useRoute()

// Select image based on route param id
const backgroundImage = computed(() => {
  const id = route.params.id
  if (id === '1') return SeminarEvent
  if (id === '2') return Webinar_Event
  if (id === '3') return Hackathonevent
  return Hackathonevent
})
</script>
