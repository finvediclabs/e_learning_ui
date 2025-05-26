<template>
  <q-layout>
    <q-page-container>
      <q-page class="login-class relative-position" style="height: 100vh;">
        <q-page style="z-index: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 0px; " class="q-pt-xl q-px-xl whole" >

          <landing-page style="z-index: 1;" />

        </q-page>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import LandingPage from 'src/pages/LandingPage.vue';

export default {
  name: 'landing-layout',
  components: {
    LandingPage
  },
  setup() {
  },
  data() {
    return {
      currentPage: 'loginPage',
      screenWidth:  window.innerWidth,
      logoColor: window.innerWidth < 600 ? '#303030' : '#fff',
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.screenWidth = window.innerWidth;
    });
  },
  watch: {
    screenWidth() {
      this.logoColor = this.screenWidth < 600 ? '#303030' : '#fff'
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    }
  }
}
</script>
<style>
.login-class {
  position:relative;
  /* background: #5479F7; */
  background: #f6f6f6;
}

.gurukul-text {
  color: #000000;
}

.fin-absolute {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 35%;
  z-index: 0;
  border-radius: 20px 0px 0px 20px;
}

@media screen and (max-width: 576px) {
  .gurukul-text {
    color: #211F1F;
  }

  .fin-absolute {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
    border-radius: 20px 0px 0px 20px;
  }
  .whole{
    min-height: 0px !important;
  }
  .q-px-xl{
    padding: 0px 25px;
  }

}
</style>
