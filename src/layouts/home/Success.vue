<template>
    <div class="q-pa-md Success-Stud">
      <div class="text-center text-h4 q-mb-lg">
        <span class="text-black text-h4 text-bold">
          Our <span style="color: #2528CB">Successful </span>Students
        </span>
      </div>

      <div class="slider-container">
        <div class="slider-track">
          <div
          v-for="(video, index) in loopedVideos"
            :key="index"
            class="slider-item"
          >


          <q-card class="q-hoverable rounded-card">
  <q-card-section class="q-pa-none video-wrapper">
    <video
      :src="video"
      autoplay
      muted
      loop
      playsinline
      class="video-player rounded-video"
      @click="openVideoDialog(video)"
      @contextmenu.prevent
    ></video>

      <!-- PLAY ICON (moved inside wrapper) -->
      <q-icon
      name="play_circle"
      size="lg"
      class="video-play-icon"
    />
    <!-- TEXT OVERLAY -->
    <div class="video-overlay">
      <div class="text-subtitle1 text-white">{{ names[index % names.length] }}</div>
      <div class="text-caption text-grey-4">{{ descriptions[index % descriptions.length] }}</div>
    </div>
  </q-card-section>
</q-card>

          </div>
        </div>
      </div>

      <!-- Video Dialog -->
      <q-dialog v-model="showDialog" persistent>
  <q-card class="bg-black text-white" style="width: 90vw; max-width: 800px;">
    <!-- Logo & Close Button -->
    <div class="dialog-header">
      <!-- Logo (Top-Left on Mobile) -->
      <q-img
        src="src/assets/new_logo1.svg"
        class="video-logo-overlay"
        fit="contain"
      />
      <!-- Close Button (Top-Right) -->
      <q-btn
        flat
        dense
        icon="close"
        color="white"
        @click="closeDialog"
        class="dialog-close-button"
      />
    </div>

    <!-- Video Player -->
    <q-card-section class="q-pa-none">
      <video
        v-if="selectedVideo"
        :src="selectedVideo"
        controls
        autoplay
        class="full-video-player"
      ></video>
    </q-card-section>
  </q-card>
</q-dialog>




    </div>
  </template>


  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'

  import HarshaVideo from 'src/assets/Harsha.mp4'
  import ScaleGradExpoVideo from 'src/assets/ScaleGradExpo.mp4'
  import YashVideo from 'src/assets/Yash.mp4'

  const videoSources = ref([
    HarshaVideo,
    ScaleGradExpoVideo,
    YashVideo
  ])

  const names = [
    'Harsha M',
    'ScaleGrad Expo',
    'Yash'
  ]

  const descriptions = [
    'Qualified for reputed Company',
    'Our Latest Event',
    'Qualified for well-known Company'
  ]

  const loopedVideos = computed(() => {
  const repeats = 5
  return Array.from({ length: repeats }).flatMap(() => videoSources.value)
})


  let animationFrameId

  // Dialog controls
  const showDialog = ref(false)
  const selectedVideo = ref(null)

  function openVideoDialog(videoUrl) {
    selectedVideo.value = videoUrl
    showDialog.value = true
  }

  function closeDialog() {
    selectedVideo.value = null
    showDialog.value = false
  }

  onMounted(() => {
    const container = document.querySelector('.slider-container')
    const track = container.querySelector('.slider-track')

    let isDown = false
    let startX
    let scrollLeft
    let speed = window.innerWidth <= 600 ? 1.5 : 0.5

    container.addEventListener('mousedown', (e) => {
      isDown = true
      startX = e.pageX - container.offsetLeft
      scrollLeft = container.scrollLeft
      container.style.cursor = 'grabbing'
    })

    container.addEventListener('mouseleave', () => {
      isDown = false
      container.style.cursor = 'grab'
    })

    container.addEventListener('mouseup', () => {
      isDown = false
      container.style.cursor = 'grab'
    })

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - container.offsetLeft
      const walk = (x - startX) * 2
      container.scrollLeft = scrollLeft - walk
    })

    container.addEventListener('touchstart', (e) => {
      isDown = true
      startX = e.touches[0].pageX - container.offsetLeft
      scrollLeft = container.scrollLeft
    })

    container.addEventListener('touchend', () => {
      isDown = false
    })

    container.addEventListener('touchmove', (e) => {
      if (!isDown) return
      const x = e.touches[0].pageX - container.offsetLeft
      const walk = (x - startX) * 2
      container.scrollLeft = scrollLeft - walk
    })

    const animate = () => {
      if (!isDown) {
        container.scrollLeft += speed
        const maxScroll = track.scrollWidth / 2
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
  })
  </script>


  <style scoped>
  .slider-container {
    overflow: hidden;
    position: relative;
    cursor: grab;
  }

  .slider-track {
    display: flex;
    gap: 16px;
    padding-bottom: 10px;
  }

  .slider-item {
    flex: 0 0 calc(33.333% - 10px);
    scroll-snap-align: start;
  }

  /* Full video inside dialog */
  .full-video-player {
    width: 100%;
    height: 60vh;
    object-fit: contain;
    background: black;
  }

  /* Rounded card */
  .rounded-card {
    border-radius: 16px;
    overflow: hidden;
  }

  .rounded-video {
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }

  @media (max-width: 1024px) {
    .slider-item {
      flex: 0 0 calc(50% - 10px);
    }
  }

  @media (max-width: 600px) {
    .slider-item {
      flex: 0 0 100%;
    }
  }

  .text-center {
    text-align: center;
  }

  .video-wrapper {
  position: relative;
}

/* .video-player {
  width: 100%;
  height: 300px;
  background: black;
  object-fit: cover;
  display: block;
} */

.video-player {
  width: 100%;
  aspect-ratio: 9 / 16 !important;
  object-fit: cover;
  background: black;
  display: block;
}

.slider-item {
  flex: 0 0 300px;
  scroll-snap-align: start;
}


.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  /* background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent 60%); */
  z-index: 1;
  color: white;
  font-weight: bold;
}

.video-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 50px !important;
  pointer-events: none;
}


.video-dialog-wrapper {
  position: relative;
}

.video-logo-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 200px;
  height: auto;
  z-index: 2;
  opacity: 0.9;
}


.dialog-header {
  position: relative;
  height: 0;
}

/* Logo in top-left corner for all screens */
.video-logo-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 150px;
  height: auto;
  z-index: 2;
  opacity: 0.9;
}

/* Close button in top-right corner */
.dialog-close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
}


.slider-container {
  overflow: hidden;
  position: relative;
  cursor: grab;
}

.slider-track {
  display: flex;
  gap: 16px;
  padding-bottom: 10px;
  animation: scrollLoop 20s linear infinite;
}

@keyframes scrollLoop {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.slider-item {
  flex: 0 0 300px;
  scroll-snap-align: start;
}

@media (max-width: 1024px) {
  .slider-item {
    flex: 0 0 calc(50% - 10px);
  }
}

@media (max-width: 600px) {
  .slider-item {
    flex: 0 0 100%;
  }
  .Success-Stud{
    padding: 16px 0px;
    background: linear-gradient(45deg, #9999995e, #ffffff);
  }
  
}

.video-wrapper {
  position: relative;
}

.video-player {
  width: 100%;
  aspect-ratio: 9 / 16 !important;
  object-fit: cover;
  background: black;
  display: block;
}

.rounded-card {
  border-radius: 16px;
  overflow: hidden;
}

.rounded-video {
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}

.video-play-icon {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 64px !important;
  pointer-events: none;
  z-index: 2;
}

.video-overlay {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
  color: white;
  z-index: 2;
}

.video-overlay .text-subtitle1 {
  font-size: 1rem;
  font-weight: bold;
}

.video-overlay .text-caption {
  font-size: 0.85rem;
  color: #ccc;
}

/* Dialog styles */
.full-video-player {
  width: 100%;
  height: 60vh;
  object-fit: contain;
  background: black;
}

.dialog-header {
  position: relative;
  height: 0;
}

.video-logo-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 150px;
  height: auto;
  z-index: 2;
  opacity: 0.9;
}

.dialog-close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
}

@keyframes scrollLoop {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-80%);
  }
}



  </style>
