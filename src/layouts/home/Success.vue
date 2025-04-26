<template>
    <div class="q-pa-md">
      <div class="text-center text-h4 q-mb-lg">
        <span class="text-black text-h4 text-bold">
          Our <span style="color: #4e5bf8">Successful </span>Students
        </span>
      </div>
  
      <div class="slider-container">
        <div class="slider-track">
          <div
            v-for="(video, index) in doubleVideos"
            :key="index"
            class="slider-item"
          >
            <q-card class="q-hoverable rounded-card">
              <q-card-section class="q-pa-none">
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
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle1">{{ names[index % names.length] }}</div>
                <div class="text-caption text-grey-7">{{ descriptions[index % descriptions.length] }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
  
      <!-- Video Dialog -->
      <q-dialog v-model="showDialog" persistent>
        <q-card class="bg-black text-white" style="width: 90vw; max-width: 800px;">
          <q-card-section class="q-pa-none">
            <video
              v-if="selectedVideo"
              :src="selectedVideo"
              controls
              autoplay
              class="full-video-player"
            ></video>
          </q-card-section>
          <q-card-actions align="center" class="q-pa-md">
            <q-btn flat label="Close" color="white" @click="closeDialog" />
          </q-card-actions>
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
    'Qualified for Soulpage of Code 2025',
    'Our Latest Event',
    'Qualified for Soulpage of Code 2025'
  ]
  
  const doubleVideos = computed(() => [...videoSources.value, ...videoSources.value])
  
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
  
  .video-player {
    width: 100%;
    height: 250px;
    background: black;
    object-fit: contain;
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
  </style>
  