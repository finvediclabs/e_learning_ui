<template>
  <div>
    <!-- Mobile View -->
    <div class="mobilepart" v-if="isMobile">
      <div class="mobile-content">
        <p style="text-align: center; padding-top: 50%;">📢 Currently, there is no upcoming seminar</p>
      </div>
    </div>

    <!-- Desktop View -->
    <div class="desk" v-else>
      <!-- <div class="desktop-content">
        <p style="text-align: center; font-size: 40px; padding-top: 20%;">📢 Currently, there is no upcoming seminar</p>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Hackathonevent from 'src/assets/seminarEvent.png'

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
