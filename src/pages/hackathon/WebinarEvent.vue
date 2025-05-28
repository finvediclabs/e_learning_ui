<template>
  <div>
    <!-- Mobile View -->
    <div class="mobilepart" v-if="isMobile">
      <div class="mobile-content">
        <p class="text-2xl font-semibold text-gray-800" style="text-align: center; padding-top: 20%;">
        🎥 Currently, there is no up-coming webinar
      </p>
      </div>
    </div>

    <!-- Desktop View -->
    <div class="desk" v-else>
     <!-- <div class="flex items-center justify-center h-[calc(100vh-64px)] bg-white">
    <div class="text-center">
      <p class="text-2xl font-semibold text-gray-800" style="padding-top: 40%; font-size: 40px;">
        🎥 Currently, there is no up-coming webinar
      </p>
    </div>
  </div> -->
    <div
   :style="{
  backgroundImage: `url(${Hackathonevent})`,
  width: '80vw',              // reduce width
  height: '80vh',             // maintain height
  backgroundSize: 'contain',  // 👈 show full image
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  position: 'relative',
  margin: '0 auto'            // center it horizontally
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
  </div>
</template>

<script setup>
import Hackathonevent from 'src/assets/Hackathonevent.png'
import { ref, onMounted, onBeforeUnmount } from 'vue'

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