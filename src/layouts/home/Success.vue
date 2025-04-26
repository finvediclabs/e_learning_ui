<template>
    <div class="q-pa-md">
      <div class="text-center text-h4 q-mb-lg">
      <span class="text-black text-h4 text-bold"> Our <span style=" color: #4e5bf8 ">Successful </span>Students </span>
      </div>
  
      <div class="slider-container">
        <div class="slider-track">
          <div
            v-for="(video, index) in doubleVideos"
            :key="index"
            class="slider-item"
          >
            <q-card class="q-hoverable">
              <q-card-section class="q-pa-none">
                <video
                  :src="video.url"
                  autoplay
                  muted
                  loop
                  playsinline
                  class="video-player"
                  @contextmenu.prevent
                ></video>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle1">{{ video.name }}</div>
                <div class="text-caption text-grey-7">{{ video.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
  const videos = ref([
    {
      name: 'Harsha M',
      description: 'Qualified for Soulpage of Code 2025',
      url: 'src/assets/Harsha.mp4'
    },
    {
      name: 'ScaleGrad Expo',
      description: 'Our Latest Event',
      url: 'src/assets/ScaleGradExpo.mp4'
    },
    {
      name: 'Yash',
      description: 'Qualified for Soulpage of Code 2025',
      url: 'src/assets/Yash.mp4'
    }
  ])
  
  const doubleVideos = computed(() => [...videos.value, ...videos.value])
  
  let animationFrameId
  
  onMounted(() => {
    const container = document.querySelector('.slider-container')
    const track = container.querySelector('.slider-track')
  
    let isDown = false
    let startX
    let scrollLeft
    let speed = window.innerWidth <= 600 ? 1.5 : 0.5 // Faster on mobile
  
    // Manual dragging
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
  
    // Touch support
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
  
    // Infinite scroll animation
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
   