<template>
  <div class="background_grey q-pa-xl">
    <span class="text-black header_Associated">Learn With Us to Get Placed</span>
    <div class="row w-100 col-12 q-pt-md q-pb-md first_row">
  <div class="col-4 col-md-2">
    <q-img class="custom_img" :src="Associate1"></q-img>
  </div>
  <div class="col-4 col-md-2">
    <q-img class="custom_img" :src="Associate2"></q-img>
  </div>
  <div class="col-4 col-md-2">
    <q-img class="custom_img" :src="Associate3"></q-img>
  </div>
  <div class="col-4 col-md-2">
    <q-img class="custom_img" :src="Associate4"></q-img>
  </div>
  <div class="col-4 col-md-2">
    <q-img class="custom_img" :src="Associate5"></q-img>
  </div>
  <div class="col-4 col-md-2">
    <q-img class="custom_img" :src="Associate6"></q-img>
  </div>
</div>

    <div class="row w-100 col-12 q-pt-md q-pb-md first_row q-mt-lg">
      <div class="col-2 web_view">
      </div>
      <div class="col-4 col-md-2">
        <q-img class="custom_img" :src="Associate7"></q-img>
      </div>
      <div class="col-4 col-md-2">
        <q-img class="custom_img" :src="Associate8"></q-img>
      </div>
      <div class="col-4 col-md-2">
        <q-img  class="custom_img" :src="Associate9"></q-img>
      </div>
      <div class="col-4 col-md-2 web_view">
        <q-img class="custom_img" :src="Associate10"></q-img>
      </div>
      <div class="col-2 web_view">
      </div>
    </div>
  </div>
</template>

<script>
import Associate1 from 'src/assets/Associate_1.png'
import Associate2 from 'src/assets/Associate_2.png'
import Associate3 from 'src/assets/Associate_3.png'
import Associate4 from 'src/assets/Associate_4.png'
import Associate5 from 'src/assets/Associate_5.png'
import Associate6 from 'src/assets/Associate_6.png'
import Associate7 from 'src/assets/Associate_7.png'
import Associate8 from 'src/assets/Associate_8.png'
import Associate9 from 'src/assets/Associate_9.png'
import Associate10 from 'src/assets/Associate_10.png'

export default {
  name: 'Associated',
  data() {
    return {
      Associate1: Associate1,
      Associate2: Associate2,
      Associate3: Associate3,
      Associate4: Associate4,
      Associate5: Associate5,
      Associate6: Associate6,
      Associate7: Associate7,
      Associate8: Associate8,
      Associate9: Associate9,
      Associate10: Associate10,
    }
  }
}
</script>

<style scoped>
.background_grey {
  background-color: #F6F6F6;
  text-align: center;
  width: 100%;
  box-shadow: 0 10px 10px rgba(255, 255, 255, 0.7); /* White shadow */
  border-bottom: 40px solid #FFFFFF; /* White border line */
}
.first_row{
  justify-content: center;
  align-items: center;
}
.header_Associated{
  font-family: sans-serif;
  font-size: 3rem;
  font-weight: 700;
}
.custom_img{
  width: 60%;
}
.custom_img2{
  width: 30%;
}
@media (max-width: 600px){
  .header_Associated{
  font-family: sans-serif;
  font-size: 20px;
  font-weight: 700;
}
.background_grey {
  background-color: #F6F6F6;
  text-align: center;
  width: 100%;
  padding: 6%;
  box-shadow: 0 10px 10px rgba(255, 255, 255, 0.7); /* White shadow */
  border-bottom: 40px solid #FFFFFF; /* White border line */
}
.custom_img{
  width: 60%;
}
.web_view{
  display: none;
}
.first_row{
  padding: 0% !important;
  margin-top: 0%!important;
}
.custom_img{
  margin-bottom: 5%;
  margin-top: 5%;
}
}
</style>
