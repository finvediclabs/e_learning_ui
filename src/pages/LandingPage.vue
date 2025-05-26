<template>
  <div class="row justify-center whole">
    <div class="col-12" >
      <div class="row">
    <!-- Left Section: Gurukul Text + Image -->
    <div class="col-12 col-sm-6 col-lg-7 flex q-pb-md">
        <div class="gurukul-text flex column q-mr-md" style="padding-right: 3%;" >
            <h5 class="text-h5 text-weight-bolder" style="margin-bottom: 1%; font-size:3rem;">Welcome to <br> <span class="gur" style="font-size: 3.2rem;line-height: 2;"><q-img :src="new_logo1" width="25vw" class="wel_logo" ></q-img></span></h5>
            <p class="descr">ScaleGrad is an interactive learning platform offering financial education through curated resources, courses, and collaborative tools for students, faculty, and professionals.</p>
        </div>
        <q-img :src="LandingImg" class="responsive-img" fit="contain" />
    </div>

    <!-- Right Section: Login Page -->
    <div class="col-12 col-sm-6 col-lg-4 self-center">
        <create-account-page v-if="currentPage === 'createPage'" @changePage="changePage" style="padding-top: 10%;" class="create-account-page" />
        <log-in-page v-if="currentPage === 'loginPage'" @changePage="changePage" />
        <reset-password-page v-if="currentPage === 'resetPasswordPage'" @changePage="changePage" />
    </div>
</div>

    </div>
  </div>
</template>

<script>
import new_logo from "src/assets/new_logo1.svg";
import new_logo1 from "src/assets/ScaleGrad_blue.svg";
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
      new_logo: new_logo,
      new_logo1: new_logo1
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
    max-width: 50%;
    height: auto;
    display: block;
    margin: 0 ;
}

@media (max-width: 600px) {
    .gurukul-text h5, .gur {
        font-size: 2rem !important;
    }

    .gurukul-text p {
        display: none;
    }

    .responsive-img {
        max-width: 80%;
        width: 80%;
        height: auto;
        display: block;
        margin: 0 auto;
    }

    .whole{
      background: #f6f6f6;
    }
    .create-account-page{
      padding-top: 3% !important;
    }



}


 .wel_logo {
  width: 25vw !important;
}

@media (max-width: 1024px) and (max-width: 1368px) {
  .wel_logo {
    width: max(35vw, 250px) !important;
  }
}


@media (max-width: 600px) {
  .wel_logo {
    width: 50vw !important;
  }
}


</style>
