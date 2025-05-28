<template>
  <div class="footer">
    <div class="row col-12 border_samp q-pt-xl q-col-gutter-md">
      <div class="col-12 col-sm-2"></div>

      <div class="col-12 col-sm-2 q-mb-md">
        <span class="head_foot">Technical Skills</span>
        <ul class="no-bullets">
          <li>ChatGPT</li>
          <li>Coding</li>
          <li>Generative AI</li>
          <li>Java Programming</li>
          <li>Python</li>
          <li>Web Development</li>
        </ul>
      </div>

      <div class="col-12 col-sm-2 q-mb-md">
        <span class="head_foot">Analytical Skills</span>
        <ul class="no-bullets">
          <li>Artificial Intelligence</li>
          <li>Data Analytics</li>
          <li>Data Science</li>
          <li>Financial Modeling</li>
          <li>Machine Learning</li>
          <li>SQL</li>
        </ul>
      </div>

      <div class="col-12 col-sm-2 q-mb-md">
        <!-- <span class="head_foot">Business Skills</span>
        <ul class="no-bullets">
          <li>Accounting</li>
          <li>Digital Marketing</li>
          <li>E-commerce</li>
          <li>Finance</li>
          <li>Google</li>
          <li>Graphic Design</li>
          <li>IBM</li>
          <li>Marketing</li>
          <li>Project Management</li>
          <li>Social Media Marketing</li>
        </ul> -->
        <span class="head_foot">ScaleGrad</span>
        <ul class="no-bullets">
          <li>About</li>
          <li>What We Offer</li>
          <li>Careers</li>
          <li>Professional Certificates</li>
          <li>Become a Partner</li>
          <li>Free Courses</li>
        </ul>
      </div>

      <div class="col-12 col-sm-3 q-mb-md">
        <span class="head_foot">Career Resources</span>
        <ul class="no-bullets">
          <li>High-Income Skills to Learn</li>
          <li>Career Education Articles</li>
          <li>Career Development Resources</li>
          <li>Career Aptitude Test</li>
        </ul>
        <div class="row q-mt-sm q-pt-sm web_view" style="width: 100%">
          <q-img :src="googleStore" style="width: 34%"></q-img>
        </div>
        <div class="row q-mt-sm q-pt-sm  mobile_view" style="width: 100%;padding-left: 10%;">
          <q-img :src="googleStore" style="width: 36%"></q-img>
        </div>
      </div>

      <div class="col-12 col-sm-1"></div>
    </div>

    <div class="row col-12 border_samp q-pt-xl q-col-gutter-md no_view">
      <div class="col-12 col-sm-2"></div>

      <div class="col-12 col-sm-2 q-mb-md">
        <!-- <span class="head_foot">ScaleGrad</span>
        <ul class="no-bullets">
          <li>About</li>
          <li>What We Offer</li>
          <li>Leadership</li>
          <li>Careers</li>
          <li>Catalog</li>
          <li>Professional Certificates</li>
          <li>Degrees</li>
          <li>Become a Partner</li>
          <li>Social Impact</li>
          <li>Free Courses</li>
          <li>ECTS Credit Recommendations</li>
        </ul> -->
      </div>

      <div class="col-12 col-sm-2 q-mb-md">
        <!-- <span class="head_foot">Community</span>
        <ul class="no-bullets">
          <li>Learners</li>
          <li>Partners</li>
          <li>Beta Testers</li>
          <li>Blog</li>
          <li>The Coursera Podcast</li>
          <li>Tech Blog</li>
          <li>Teaching Center</li>
        </ul> -->
      </div>

      <div class="col-12 col-sm-2 q-mb-md">
        <!-- <span class="head_foot">More</span>
        <ul class="no-bullets">
          <li>Press</li>
          <li>Investors</li>
          <li>Terms</li>
          <li>Privacy</li>
          <li>Help</li>
          <li>Accessibility</li>
          <li>Contact</li>
          <li>Articles</li>
          <li>Directory</li>
          <li>Affiliates</li>
          <li>Modern Slavery Statement</li>
          <li>Manage Cookie Preferences</li>
        </ul> -->
      </div>

      <div class="col-12 col-sm-3 q-mb-md paddinG_left web_view">
        <!-- <div class="row q-mb-xl q-pb-sm" style="width: 100%">
          <q-img :src="appStore" style="width: 40%"></q-img>
        </div> -->

        <!-- <div class="row q-mt-xl q-pt-xl" style="width: 100%">
          <q-img :src="googleStore" style="width: 40%"></q-img>
        </div> -->
        <!-- <div class="row q-mt-xl q-pt-sm" style="width: 100%">
          <q-img :src="b_logo" style="width: 20%; margin-left: 10%"></q-img>
        </div> -->
      </div>

      <div class="col-12 col-sm-3 q-mb-md paddinG_left mobile_view">
        <div class="row q-mb-xl q-pb-sm" style="width: 100%">
          <!-- <div class="col-6">
            <q-img :src="appStore" style="width: 80%"></q-img>
          </div> -->
          <div class="col-6">
            <q-img :src="googleStore" style="width: 80%"></q-img>
          </div>
        </div>
        <!-- <div class="row q-mt-xl q-pt-sm" style="width: 100%">
          <q-img :src="b_logo" style="width: 20%; margin-left: 10%"></q-img>
        </div> -->
      </div>

      <div class="col-12 col-sm-1"></div>
    </div>

    <div class="hr-line"></div>
    <div class="row col-12 border_samp q-pt-sm  q-pb-md q-col-gutter-md web_view">
      <div class="col-1"></div>
      <div class="col-5">
        <span class="head_foot2">© 2025 FinVedic. All rights reserved.</span>
      </div>
      <div class="col-5 logo_foot">
        <a href="https://www.facebook.com/ScaleGrad" target="_blank"><q-img :src="fb_logo" class="logo_foot_img"></q-img></a>
        <a href="https://www.linkedin.com/company/95730566/admin/page-posts/published/" target="_blank"><q-img :src="ln_logo" class="logo_foot_img"></q-img></a>
        <a href="https://x.com/ScaleGrad" target="_blank"><q-img :src="x_logo" class="logo_foot_img"></q-img></a>
        <a href="https://www.youtube.com/@scalegrad" target="_blank"><q-img :src="yt_logo" class="logo_foot_img"></q-img></a>
        <a href="https://www.instagram.com/scalegrad/" target="_blank"><q-img :src="insta_logo" class="logo_foot_img"></q-img></a>
      </div>
    </div>
    <div class="row col-12 q-pb-sm border_samp q-col-gutter-md mobile_view" >
      <div class="col-12 row" style="display: flex;align-items: center;justify-content: center;width: 100%;">
        <a href="https://www.facebook.com/ScaleGrad" target="_blank"><q-img :src="fb_logo" class="logo_foot_img"></q-img></a>
        <a href="https://www.linkedin.com/company/95730566/admin/page-posts/published/" target="_blank"><q-img :src="ln_logo" class="logo_foot_img"></q-img></a>
        <a href="https://x.com/ScaleGrad" target="_blank"><q-img :src="x_logo" class="logo_foot_img"></q-img></a>
        <a href="https://www.youtube.com/@scalegrad" target="_blank"><q-img :src="yt_logo" class="logo_foot_img"></q-img></a>
        <a href="https://www.instagram.com/scalegrad/" target="_blank"><q-img :src="insta_logo" class="logo_foot_img"></q-img></a>
      </div>
      <div class="row text-center"  style="display: flex;align-items: center;justify-content: center;width: 100%;">
        <span class="head_foot2">© 2025 FinVedic. All rights reserved.</span>
      </div>
    </div>

  </div>
</template>

<script>
import appStore from "src/assets/app_store.png";
import googleStore from "src/assets/google_store.png";
import b_logo from "src/assets/b_logo.png";
import fb_logo from "src/assets/fb_logo.svg";
import ln_logo from "src/assets/ln_logo.svg";
import x_logo from "src/assets/x_logo.png";
import yt_logo from "src/assets/yt_logo.svg";
import insta_logo from "src/assets/insta_logo.png";
export default {
  name: "Footer",
  data() {
    return {
      appStore: appStore,
      googleStore: googleStore,
      b_logo: b_logo,
      fb_logo: fb_logo,
      ln_logo: ln_logo,
      x_logo: x_logo,
      yt_logo: yt_logo,
      insta_logo: insta_logo,
    };
  },
};
</script>

<style scoped>
.footer {
  background-color: #f6f6f6;
  width: 100%;
}
.border_samp {
  width: 100%;
}
.no-bullets {
  list-style-type: none;
  padding-left: 0;
  margin-top: 1vh;
}
.hr-line {
  width: 80%;
  height: 3px;
  margin-left: auto !important;
  margin-right: auto !important;
  background-color: #ccc; /* Light gray */
  border: none;
  margin: 10px 0;
}
.no-bullets li {
  margin-bottom: 1.5vh;
  /* Adjust the margin as needed */
  font-size: 12px;
}
.head_foot {
  font-weight: bold;
  font-size: 18px;
  color: #000;
}
.head_foot2{
  padding-left: 4%;
}
.mobile_view {
  display: none;
}
.logo_foot{
  text-align: right;
  /* padding-right: 5%; */
}
.logo_foot_img{
  margin-right: 2%;
  width: 4%;
}
.no_view{
  display: none;
}
@media (max-width: 600px) {
  .head_foot {
    padding-left: 10%;
  }
  .no-bullets {
    padding-left: 10%;
  }
  .paddinG_left {
    padding-left: 10%;
  }
  .web_view {
    display: none;
  }
  .mobile_view {
    display: block;
  }
  .logo_foot_img{
  margin-right: 2%;
  margin-left: 2%;
  width: 10%;
}
.hr-line{
  display: none;
}
}
</style>
