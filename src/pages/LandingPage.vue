<template>
  <div class="row justify-center">
    <div class="col-12" >
      <div class="row">
    <!-- Left Section: Gurukul Text + Image -->
    <div class="col-12 col-sm-6 col-lg-7 flex q-pb-md justify-center">
        <div class="gurukul-text flex column q-mr-md" >
            <h5 class="text-h5 text-weight-bolder" style="margin-bottom: 1%;">Welcome to <br> <span style="font-size: larger;">GURUKUL</span></h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</p>
        </div>
        <q-img :src="LandingImg" class="responsive-img" fit="contain" />
    </div>

    <!-- Right Section: Login Page -->
    <div class="col-12 col-sm-6 col-lg-4 self-center">
        <create-account-page v-if="currentPage === 'createPage'" @changePage="changePage" style="padding-top: 10%;" />
        <log-in-page v-if="currentPage === 'loginPage'" @changePage="changePage" />
        <reset-password-page v-if="currentPage === 'resetPasswordPage'" @changePage="changePage" />
    </div>
</div>

    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import CreateAccountPage from "../components/LandingComponents/CreateAccountPage.vue";
import LogInPage from "../components/LandingComponents/LogInPage.vue";
import ResetPasswordPage from "../components/LandingComponents/ResetPasswordPage.vue";
import LandingImg from "../assets/landing-1.png";

export default defineComponent({
  name: 'LandingLayout',
  components: {
    CreateAccountPage,
    LogInPage,
    ResetPasswordPage
  },
  data() {
    return {
      currentPage: ref('loginPage'),
      LandingImg: LandingImg,
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    }
  }
});
</script>

<style>
.responsive-img {
    max-width: 80%;  
    width: 100%;    
    height: auto; 
    margin-left: -15%;
}
</style>
