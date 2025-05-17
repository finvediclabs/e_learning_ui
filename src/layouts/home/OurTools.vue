<template>
  <div   class="background_grey q-py-xl"
  :style="isMobile ? { backgroundImage: `url(${mobileBackground})` } : {}" >
    <span class="text-black header_toolsd">
      Master <span style=" color: #2528CB ">Latest and Essential Tools & Technologies</span><br>
      with ScaleGrad for Your Career Success
    </span>

    <!-- First Row (Left Sliding) -->
    <div class="scroll-container q-mt-xl">
      <div class="scroll-wrapper">
        <div class="scroll-content scroll-left">
          <img v-for="(tool, index) in infiniteTools" :key="'row1-' + index" class="custom_img" :src="tool" alt="Tool Logo" />
        </div>
      </div>
    </div>

    <!-- Second Row (Right Sliding) -->
    <div class="scroll-container q-py-lg">
      <div class="scroll-wrapper">
        <div class="scroll-content scroll-right">
          <img v-for="(tool, index) in infiniteTools_2" :key="'row2-' + index" class="custom_img2" :src="tool" alt="Tool Logo" />
        </div>
      </div>
    </div>

    <!-- Third Row (Only on Mobile, Left Sliding Again) -->
    <div class="scroll-container q-py-lg third-row" v-if="isMobile">
      <div class="scroll-wrapper">
        <div class="scroll-content scroll-left">
          <img v-for="(tool, index) in infiniteTools" :key="'row3-' + index" class="custom_img" :src="tool" alt="Tool Logo" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ourToolsBg from 'src/assets/ourToolsBg.svg';
import tools1 from 'src/assets/Logos_all/1.png';
import tools2 from 'src/assets/Logos_all/2.png';
import tools3 from 'src/assets/Logos_all/3.png';
import tools4 from 'src/assets/Logos_all/4.png';
import tools5 from 'src/assets/Logos_all/5.png';
import tools6 from 'src/assets/Logos_all/6.png';
import tools7 from 'src/assets/Logos_all/7.png';
import tools8 from 'src/assets/Logos_all/8.png';
import tools9 from 'src/assets/Logos_all/9.png';
import tools10 from 'src/assets/Logos_all/10.png';
import tools11 from 'src/assets/Logos_all/11.png';
import tools12 from 'src/assets/Logos_all/12.png';
import tools13 from 'src/assets/Logos_all/13.png';
import tools14 from 'src/assets/Logos_all/14.png';
import tools15 from 'src/assets/Logos_all/15.png';
import tools16 from 'src/assets/Logos_all/16.png';

export default {
  data() {
    return {
      mobileBackground: ourToolsBg,
      tools: [tools1, tools2, tools3, tools4, tools5, tools6, tools9, tools15],
      tools_2: [tools7, tools10, tools11, tools12, tools8, tools13, tools14, tools16],
      isMobile: false
    };
  },
  computed: {
    infiniteTools() {
      return [...this.tools, ...this.tools, ...this.tools];
    },
    infiniteTools_2() {
      return [...this.tools_2, ...this.tools_2, ...this.tools_2];
    }
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 600;
    }
  }
};

</script>

<style scoped>
/* General Styling */
.background_grey {
  /* background-color: #fff; */
  background-color: #f6f6f6 !important;
  text-align: center;
  width: 100%;
  overflow: hidden;
}

.header_toolsd {
  font-family: sans-serif;
  font-size: 2rem;
  font-weight: 700;
}

/* Scroll Container */
.scroll-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  display: flex;
  justify-content: center;
}

/* Wrapper for Sliding Effect */
.scroll-wrapper {
  display: flex;
  overflow: hidden;
  width: 100%;
}

/* Step-based Sliding Animations */
.scroll-content {
  display: flex;
  align-items: center;
  gap: 20px;
  width: calc(200px * 20); /* Large enough to ensure continuous scrolling */
}

/* First row slides left */
.scroll-left {
  animation: scrollLeft 15s linear infinite;
}

/* Second row slides right */
.scroll-right {
  animation: scrollRight 15s linear infinite;
}

/* First Row (Slide Left) */
@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); } /* Moves by 1/3rd of total width */
}

/* Second Row (Slide Right) */
@keyframes scrollRight {
  0% { transform: translateX(-33.33%); }
  100% { transform: translateX(0); }
}

/* Image Styling */
.custom_img, .custom_img2 {
  max-width: 90px;
  width: 90px;
  height: auto;
  flex-shrink: 0;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .background_grey {
    background: url('src/assets/ourToolsBg.svg') repeat;
    background-size: contain;
  }
  .header_toolsd {
    font-size: 18px;
  }
  .custom_img, .custom_img2 {
    max-width: 80px;
  }
}
/* ================================== */
/* Increase Tool Image Size */
.custom_img, .custom_img2 {
  max-width: 180px;
  height: auto;
  flex-shrink: 0;
}

/* Increase Gap Between Logos */
.scroll-content {
  gap: 100px;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .header_toolsd {
    font-size: 18px;
  }

  .custom_img, .custom_img2 {
    max-width: 100px;
  }

  .scroll-content {
    gap: 30px;
  }
}

</style>
