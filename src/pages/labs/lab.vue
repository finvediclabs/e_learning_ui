<template>
    <div class="sandbox q-px-lg q-mx-md">
        <div class="row">
      <div class="col-12">
        <span class="text-h5 text-bold">Labs</span>
        <div class="carousel-container q-mt-md" v-if="!isMobile">
          <q-btn icon="arrow_left" flat @click="prevSlide" class="arrow-btn" />
    <!-- <div class="q-mb-xl CircD1"> <q-img :src="circ_d1" style="width: 100%;" /> </div> -->

          <div class="carousel-view">
            <div class="carousel-row" :style="{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }">
              <div v-for="(lab, index) in loopLabs" :key="index" class="lab-card-container">
                <div class="card-title text-weight-medium text-h6">{{ lab.title }}</div>
                <q-card class="sandbox-card">
                  <q-img :src="lab.img" class="sandbox-img" />
                  <q-card-section>
                    <div class="action-buttons">
                      <q-btn label="Restart" color="" outline class="q-mr-sm act-btn" />
                      <q-btn label="Start" class="act-btn" />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
          <q-btn icon="arrow_right" flat @click="nextSlide" class="arrow-btn" />
        </div>
        <div class="grid-view q-mt-md" v-else>
          <div class="grid-row">
            <div v-for="(lab, index) in labs" :key="index" class="grid-card-container">
              <div class="card-title text-weight-medium text-h6">{{ lab.title }}</div>
              <q-card class="sandbox-card">
                <q-img :src="lab.img" class="sandbox-img" />
                <q-card-section>
                  <div class="action-buttons">
                    <q-btn label="Restart" color="" outline class="q-mr-sm act-btn" />
                    <q-btn label="Start" class="act-btn" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="row q-mt-xl q-pb-xl">
          <!-- <div class="q-mb-xl CircD2"> <img src="src/assets/Circ_D1.png"> </div> -->
        <div class="col-12">
          <span class="text-h5 text-bold">Tools</span>
          <div class="row justify-center q-mt-md">
            <div v-for="(tool, index) in tools" :key="index" class="tool-card-container">
              <div class="card-title text-weight-medium text-h6">{{ tool.title }}</div>
              <q-card class="sandbox-card"  clickable @click="openTool(tool.link)">
                <q-img :src="tool.img" class="sandbox-img" />
            </q-card>
        </div>
    </div>
</div>

</div>
</div>
</template>

<script>
import windows_lab from "src/assets/windows_lab.jpg";
import ubuntu_lab from "src/assets/ubuntu_lab.jpg";
import MySql_lab from "src/assets/MySql_lab.jpg";
import redis_lab from "src/assets/redis_lab.jpg";
import extra_lab1 from "src/assets/extra_lab1.jpg";
import extra_lab2 from "src/assets/extra_lab2.jpg";
import circ_d1 from "src/assets/Circ_D1.png";
import extra_lab3 from "src/assets/extra_lab3.jpg";
import dojo from "src/assets/dojo.jpg";
import white_board from "src/assets/white_board.jpg";
import jupyter from "src/assets/jupyter.jpg";
export default {
  data() {
    return {
      windows_lab: windows_lab,
      ubuntu_lab: ubuntu_lab,
      MySql_lab: MySql_lab,
      redis_lab: redis_lab,
      extra_lab1: extra_lab1,
      circ_d1:circ_d1,
      extra_lab2: extra_lab2,
      extra_lab3: extra_lab3,
      dojo: dojo,
      white_board: white_board,
      jupyter: jupyter,
      currentSlide: 0,
      itemsPerSlide: this.getItemsPerSlide(),
      isMobile: window.innerWidth <= 768,
      labs: [
        { title: "Tech Sandbox", img: windows_lab },
        { title: "Linux Sandbox", img: ubuntu_lab },
        { title: "MySQL Server", img: MySql_lab },
        { title: "Redis Server", img: redis_lab },
        { title: "Extra Lab 1", img: extra_lab1 },
        { title: "Extra Lab 2", img: extra_lab2 },
        { title: "Extra Lab 3", img: extra_lab3 }
      ],
      tools: [
    { title: "Gurukul Dojo", img: dojo, link: "https://gurukul.finvedic.com/dojo/" },
    { title: "Gurukul Whiteboard", img: white_board, link: "#" },
    { title: "Gurukul Notebook", img: jupyter, link: "#" }
]
    };
  },
  computed: {
    loopLabs() {
      return [...this.labs, ...this.labs];
    }
  },
  methods: {
    openTool(link) {
        window.open(link, "_blank");
    },
    nextSlide() {
      this.currentSlide++;
      if (this.currentSlide >= this.labs.length) {
        setTimeout(() => {
          this.currentSlide = 0;
        }, 400);
      }
    },
    prevSlide() {
      this.currentSlide--;
      if (this.currentSlide < 0) {
        setTimeout(() => {
          this.currentSlide = this.labs.length - 1;
        }, 400);
      }
    },
    getItemsPerSlide() {
      const width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 1024) return 3;
      return 4;
    },
    handleResize() {
      this.itemsPerSlide = this.getItemsPerSlide();
      this.isMobile = window.innerWidth <= 768;
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style scoped>
.CircD1{
  position: absolute;
  top: 1%;
  left: 7%;
  transform: translate(-50%, -50%);
  rotate: -60deg;
}
/* .CircD2{
  position: absolute;
  bottom: 0%;
  left: 61%;
  transform: translate(-50%, -50%);
  rotate: -60deg;
} */
.sandbox-card {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  border: 1px solid #777 !important;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: none!important;
}
.sandbox-img {
  width: 90%;
  height: auto;
  margin: 5%;
  border-radius: 12px !important;
  object-fit: cover;
  aspect-ratio: 16 / 9;
}
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}
.carousel-view {
  width: calc(100% - 100px);
  overflow: hidden;
}
.carousel-row {
  display: flex;
  gap: 20px;
  transition: transform 0.4s ease-in-out;
}
.lab-card-container {
  text-align: center;
  width: calc(100% / 4 - 20px); /* Fixed size */
  flex-shrink: 0;
}
.card-title {
  margin-bottom: 10px;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  color: #4E5BF8;
}
.act-btn{
    border-radius: 10px !important;
    border: 1px solid #4E5BF8 !important;
}
.act-btn:hover{
    background-color: #4E5BF8 !important;
    color: white;
}
.tool-card-container {
  width: 25%;
  text-align: center;
  margin-bottom: 20px;
  margin: 0 10px;
}
.arrow-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #4E5BF8;
  color: #8d8d8d;
  border: 1px solid #8d8d8d;
}
.arrow-btn:hover {
  background-color: #4E5BF8;
  color: #fff;
}
@media (max-width: 768px) {
  .lab-card-container, .tool-card-container {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .lab-card-container {
    width: calc(100% / 3 - 20px);
  }
  .action-buttons {
    gap: 0px;
  }
  .act-btn{
    padding: 5px 10px;
}
}


.grid-view {
  display: flex;
  justify-content: center;
}
.grid-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 100%;
  padding: 0 10px;
}
.grid-card-container {
  text-align: center;
  width: 100%;
}
.sandbox-card {
  width: 100%;
  aspect-ratio: 16 / 9;
}
@media (max-width: 344px), (min-width: 344px) and (max-width: 530px) {
  .grid-row {
    grid-template-columns: repeat(1, 1fr);
  }
}

</style>
