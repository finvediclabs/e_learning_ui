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
                      <q-btn
  :label="['Fintech Sandbox', 'Maang Sandbox'].includes(lab.title) ? 'Download' : (isCreatingVm ? '' : 'Start')"
  :loading="isCreatingVm"
  class="act-btn"
  @click="['Fintech Sandbox', 'Maang Sandbox'].includes(lab.title) ? download(lab) : handleStart(lab.title)"
/>
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
                    <q-btn
  :label="['Fintech Sandbox', 'Maang Sandbox'].includes(lab.title) ? 'Download' : (isCreatingVm ? '' : 'Start')"
  :loading="isCreatingVm"
  class="act-btn"
  @click="['Fintech Sandbox', 'Maang Sandbox'].includes(lab.title) ? download(lab) : handleStart(lab.title)"
/>
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
<!-- <fin-portlet-item>
        <div class="scroll_on">
          <div class="row" style="width: 100%;margin-left: auto;margin-right: auto;">
            <div class="col-12 col-sm-6 col-md-6 col-lg-6 q-pa-lg" v-for="(lab, index) in filteredLabs" :key="lab.id"
              style="padding-top: 0;">
              <q-card class="shadow-8"
                :style="{ border: getBorderColor(lab.provisioningState, lab.locked), height: '100%' }"
                style="background-color: #5479F7">
                <q-card-section horizontal>
                  <q-card-section class="q-pa-md lab-img flex items-center">
                    <q-img :src="labImg" class="full-width" />
                  </q-card-section>
                  <q-card-section class="" style="width: 70%;font-size: 13px;">
                    <div class="column full-width">
                      <div class="col flex items-center">
                        <span  style="color: white;"><strong>VM Name :</strong> {{ lab.name }}</span>
                        <q-space />
                        <q-img v-if="lab.provisioningState === 'Creating'" :src="loader"
                          style="width: 30px; height: 30px;" />
                      </div>
                      <div class="flex" style="color: white;">
                        <span><strong>Created By :</strong> {{ lab.studentName }}</span>
                      </div>
                      <div class="flex" style="color: white;">
                        <p><strong>Date :</strong> {{ lab.createdDate }}</p>
                      </div>

                      <div class="col flex">
                        <div class="q-px-md shadow-4 rounded-borders q-pa-xs text-center"
                          style="width:90px;font-size: 8px;background-color: white;"
                          @click="lab.provisioningState !== 'Deleting' && lab.provisioningState !== 'Deleted' && lab.provisioningState !== 'Failed' ? download(lab) : null"
                          :class="{ 'pointer-events-none': lab.locked }">
                          {{ lab.provisioningState === 'Deleting' || lab.provisioningState === 'Failed' ||
                            lab.provisioningState === 'Deleted' ? lab.provisioningState : "Download" }}
                        </div>
                        <q-space />
                        <q-btn :label="lab.locked ? 'Locked' : 'Shutdown'" size="8px" dense
                          class="q-px-md text-weight-bold" rounded
                          :style="{ background: (lab.locked || lab.provisioningState === 'Deleting' || lab.provisioningState === 'Deleted' || lab.provisioningState === 'Failed') ? '#D49F8A' : '#7BFF90' }"
                          :disable="!canShutdown(lab)" @click="shutdown(lab)">
                          <q-icon name="lock" size="14px" class="q-pl-sm"></q-icon>
                        </q-btn>
                      </div>

                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>

          </div>
        </div>
      </fin-portlet-item> -->
</template>

<script>
import windows_lab from "src/assets/windows_lab.jpg";
import ubuntu_lab from "src/assets/ubuntu_lab.jpg";
import MySql_lab from "src/assets/MySql_lab.jpg";
import redis_lab from "src/assets/redis_lab.jpg";
import extra_lab1 from "src/assets/extra_lab1.jpg";
import extra_lab2 from "src/assets/extra_lab2.jpg";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import circ_d1 from "src/assets/Circ_D1.png";
import extra_lab3 from "src/assets/extra_lab3.jpg";
import dojo from "src/assets/dojo.jpg";
import white_board from "src/assets/white_board.jpg";
import jupyter from "src/assets/jupyter.jpg";
import { urls } from "./Urls";

import windows from "../../assets/Windows.png";
import { useProfileStore } from "src/stores/profile";
import { version } from "jszip";
export default {
  components: {
    FinPortletItem,
  },
  data() {
    return {
      isCreatingVm:false,
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
      instance: "Standard_D2s_v3=3",
      region: "East US",
      version:"windows",
      labImg: windows,
      labsData: [],
      labs: [
      { title: "Fintech Sandbox", img: extra_lab1 },
      { title: "Maang Sandbox", img: extra_lab2 },
        { title: "Tech Sandbox", img: windows_lab },
        { title: "Linux Sandbox", img: ubuntu_lab },
        { title: "MySQL Server", img: MySql_lab },
        { title: "Redis Server", img: redis_lab },

        { title: "Extra Lab 1", img: extra_lab3 }
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
    },
    canShutdown() {
      return (lab) => {
        const profileStore = useProfileStore();
        const profileUsername = profileStore.user.username;
        const isAdmin = profileStore.user.roles.some(role => role.name === 'Admin');
        return (isAdmin || lab.userName === profileUsername) &&
          lab.provisioningState !== 'Deleting' &&
          lab.provisioningState !== 'Deleted' &&
          lab.provisioningState !== 'Failed';

      };
    },
    getBorderColor() {
      return function (provisioningState, locked) {
        return locked ? '0px solid #FF7F50' : (provisioningState === 'Succeeded' ? '0px solid #FF7F50' : '0px solid #FF7F50');
      };
    },
    filteredLabs() {
      const profileStore = useProfileStore();
      const profileUsername = profileStore.user.username;
      const isAdmin = profileStore.user.roles.some(role => role.name === 'Admin');

      if (isAdmin) {
        return this.labsData;
      } else {
        return this.labsData.filter(lab => lab.userName === profileUsername || lab.userRole === 'Admin');
      }
    },
    isUserExistsInLabs() {
      const profileStore = useProfileStore();
      const profileUsername = profileStore.user.username;

      return this.labsData.some(lab => lab.userName === profileUsername && lab.provisioningState === 'Succeeded' || lab.userName === profileUsername && lab.provisioningState === 'Creating');
    }
  },
  methods: {
    openTool(link) {
        window.open(link, "_blank");
    },
    handleStart(title) {
  console.log(`${title} Start button pressed`);

  let osMapping = {
    "Tech Sandbox": "Windows",
    "Linux Sandbox": "Linux",
    "MySQL Server": "Linux",
    "Redis Server": "Linux"
  };

  let selectedOS = osMapping[title] || "Windows"; // Default to Windows

  this.createVm(selectedOS);
},
download(lab) {
    let rdpContent = "";
    let fileName = "";

    if (lab.title === "Fintech Sandbox") {
        rdpContent = `full address:s:fnvedicprodlabs2201442271007.eastus.cloudapp.azure.com:58082
prompt for credentials:i:1
username:s:srikanth001\\srikanth
connection type:i:6
networkautodetect:i:1
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0`;
        fileName = "FinTech_Sandbox.rdp";
    } else if (lab.title === "Maang Sandbox") {
        rdpContent = `full address:s:fnvedicprodlabs2201442271007.eastus.cloudapp.azure.com:58082
prompt for credentials:i:1
username:s:srikanth002\\srikanth
connection type:i:6
networkautodetect:i:1
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0`;
        fileName = "Maang_Sandbox.rdp";
    } else {
        console.warn("No RDP available for this lab.");
        return;
    }

    const blob = new Blob([rdpContent], { type: "application/x-rdp" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
},
    async shutdown(lab) {
      const profileStore = useProfileStore();
      const profileUsername = profileStore.user.username;
      const isAdmin = profileStore.user.roles.some(role => role.name === 'Admin');

      // Check if the user is an Admin or if the lab belongs to the user
      if (!isAdmin && lab.userName !== profileUsername) {
        this.showMsg('You do not have permission to perform this action.', 'negative');
        return;
      }

      if (lab.provisioningState === 'Deleted' || lab.provisioningState === 'Deleting' || lab.provisioningState === 'Failed') {
        this.showMsg('Cannot perform shutdown action as the lab is already deleted or deleting or failed.', 'negative');
        return;
      }

      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const getDeleteVMUrl = baseUrl + 'deletevm/';
        const response = await this.$api.get(getDeleteVMUrl + lab.name);
        // console.log('success');
        lab.locked = true;
        this.saveLockedStates(); // Save locked states to local storage
      } catch (error) {
        console.error(error);
      }
    },
    loadLockedStates() {
      const lockedStates = JSON.parse(localStorage.getItem('lockedStates')) || {};
      this.labsData.forEach((lab) => {
        if (lockedStates.hasOwnProperty(lab.name)) {
          lab.locked = lockedStates[lab.name];
        }
      });
    },
    saveLockedStates() {
      const lockedStates = {};
      this.labsData.forEach((lab) => {
        lockedStates[lab.name] = lab.locked;
      });
      localStorage.setItem('lockedStates', JSON.stringify(lockedStates));
    },
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => { } }
        ]
      });
    },
    getAzureVmsData() {
      this.loading = true;
      this.$api.get(urls.getAzureVmsUrl).then(response => {
        this.loading = false;
        this.labsData = response.data.data.map(vm => {
          const createdDateIST = new Date(vm.createdDate).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return {
            ...vm,
            userName: vm.userName,
            createdDate: createdDateIST, // Replace with IST formatted date
          };
        });
      }).catch(error => {
        this.loading = false;
        this.showMsg(error.response?.data.message || error.message, 'negative');
      });
    },
    nextSlide() {
      this.currentSlide++;
      if (this.currentSlide >= this.labs.length) {
        setTimeout(() => {
          this.currentSlide = 0;
        }, 400);
      }
    },
    showMsg(message, type) {
    this.$q.notify({
      type: type, // 'positive' or 'negative'
      message: message,
      position: 'top'
    });
  },

    logProfile(){
      const profileStore = useProfileStore();
      const userNameAdmin = profileStore.user.username;
      const userRoleAdmin = profileStore.user.roles.length >= 0 ? profileStore.user.roles[0].name : "";
      console.log(userNameAdmin, userRoleAdmin);
    },

    async createVm(selectedOS) {
  if (!selectedOS) {
    this.showMsg('Please select an operating system.', 'negative');
    return;
  }

  const profileStore = useProfileStore();
  const user = profileStore.user;
  const createdAt = user.createdAt ? user.createdAt : new Date().toISOString();
  const userRole = user.roles.length > 0 ? user.roles[0].name : "";

  const requestData = {
    userId: user.id,
    accountId: user.accountId,
    name: user.name,
    username: user.username,
    email: user.email,
    userRole: userRole,
    createdAt: createdAt,
    timestamp: new Date().toISOString(),
    status: 'Requested',
    operatingSystem: selectedOS
  };

  console.log("Requesting VM with data:", requestData);

  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const requestVMsUrl = baseUrl + 'api/request-vms';

    this.isCreatingVm = true; // Show loading indicator
    const response = await this.$api.post(requestVMsUrl, requestData);
    this.isCreatingVm = false; // Hide loading after response

    this.showMsg(response.data.message, 'positive');
  } catch (error) {
    this.isCreatingVm = false; // Hide loading if there's an error
    console.error('Error sending VM request:', error);
    const errorMessage = error.response?.data?.message || 'Something went wrong!';
    this.showMsg(errorMessage, 'negative');
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
    this.getAzureVmsData();
    this.loadLockedStates();
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
.lab-img {
  width: 30%;
  box-shadow: 0px 0px 10px 0px #bbbbbb inset !important;
  background-color: #81D265;
}

.q-btn:before {
  box-shadow: none !important;
}

.scroll_on {
  height: 62vh;
  /* border: 2px solid red; */
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
  width: 60vw;
}

.image-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-btn-container1 {
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 2px solid red; */
  /* margin-top: 28%; */
}

.image-btn {
  width: 180px;
  height: 180px;
  margin: 0 10px;
  /* Adjust as needed */
}

.image-btn1 {
  width: 220px;
  height: 220px;
  margin: 0 10px;
  /* Adjust as needed */
}

.outer {
  width: 1px;
  height: 180px;
  margin: auto;
  position: relative;
  overflow: hidden;
}

.inner {
  position: absolute;
  width: 100%;
  height: 40%;
  background: #5479F7;
  top: 30%;
  box-shadow: 0px 0px 30px 20px #5479F7;
}

.outer1 {
  width: 1px;
  height: 340px;
  margin: auto;
  position: relative;
  overflow: hidden;
}

.inner1 {
  position: absolute;
  width: 100%;
  height: 40%;
  background: #5479F7;
  top: 30%;
  box-shadow: 0px 0px 30px 20px #5479F7;
}

.bg-green {
  background: #b2ccfc !important;
  border-radius: 20px;
}

.scroll_on::-webkit-scrollbar {
  width: 10px;
  /* Width of the scrollbar */
}

.scroll_on::-webkit-scrollbar-track {
  background-color: white;
  /* margin-top: 18px;  */
  border-radius: 5px;
  /* Color of the track */
}

.scroll_on::-webkit-scrollbar-thumb {
  background-color: #5479F7;
  /* Color of the thumb */
  border-radius: 5px;
  height: 3%;
  /* Rounded corners for the thumb */
}

.User_heading {
  color: #5479F7;
  margin-left: 4%;
}

.styled-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  width: 60% !important;

  padding: 8px 14px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  background-color: #5479F7;
  color: white;
  border-radius: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
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
