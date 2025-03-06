<template>
  <div class="background_grey q-py-xl">
    <span class="text-black header_toolsd">Learn With Us to Get Placed</span>
    <div class="scroll-container">
      <div class="scroll-content autoplay">
        <img v-for="(tool, index) in tools" :key="index" class="custom_img" :src="tool" alt="Tool Logo" />
      </div>
    </div>

    <div class="scroll-container q-mt-lg">
      <div class="scroll-content autoplay1">
        <img v-for="(tool, index) in tools_2" :key="index" class="custom_img2" :src="tool" alt="Tool Logo" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';

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

export default {
  name: 'OurTools',
  data() {
    return {
      tools: [tools1, tools2, tools3, tools4, tools5, tools6, tools7],

      tools_2: [tools9, tools10, tools11, tools12, tools8, tools13, tools14]
    };
  },
  mounted() {
    $(document).ready(() => {
      $('.autoplay').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 200,
        arrows: false, // 💡 No navigation buttons
        dots: false
      });

    });

    $(document).ready(() => {
      $('.autoplay1').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 200,
        arrows: false, // 💡 No navigation buttons
        dots: false
      });

    });

  }
};
</script>

<style scoped>
.background_grey {
  background-color: #fff;
  text-align: center;
  width: 100%;
  overflow: hidden;
}

.header_toolsd {
  font-family: sans-serif;
  font-size: 3rem;
  font-weight: 700;
}

.scroll-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.custom_img {
  max-width: 60%; /* Adjust as needed */
  flex-shrink: 0;
  margin-left: 20px;
  max-height: 80px !important;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 20px; /* Adds space between images */
}

.custom_img2 {
  max-width: 60%; /* Adjust as needed */
  flex-shrink: 0;
  margin-left: 20px;
  max-height: 120px !important;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 20px; /* Adds space between images */
}


.slick-slide {
  display: flex !important;
  justify-content: center;
}
.autoplay{
  margin-top: 2%;
}
@media (max-width: 600px){
  .header_toolsd {
  font-family: sans-serif;
  font-size: 18px;
  font-weight: 700;
}
.custom_img {
  max-width: 100%; /* Adjust as needed */
  flex-shrink: 0;
  margin-left: 20px;
  max-height: 80px !important;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 20px; /* Adds space between images */
}

.custom_img2 {
  max-width: 100%; /* Adjust as needed */
  flex-shrink: 0;
  margin-left: 20px;
  max-height: 120px !important;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 20px; /* Adds space between images */
}
}
</style>
