<template>
    <div class="sandbox q-px-lg q-mx-md">
        <div class="row">
      <div class="col-12 q-pt-lg">
        <span class="text-h5 text-bold">Labs</span>
        <div class="carousel-container q-mt-md" v-if="!isMobile">
          <q-btn icon="arrow_left" flat @click="prevSlide" class="arrow-btn" />
    <!-- <div class="q-mb-xl CircD1"> <q-img :src="circ_d1" style="width: 100%;" /> </div> -->

          <div class="carousel-view">
            <div class="carousel-row" :style="{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }">
              <div v-for="(lab, index) in loopLabs" :key="index" class="lab-card-container">
                <div class="card-title text-weight-medium text-h6">{{ lab.title }}</div>
                <q-card
  class="sandbox-card"
  :class="{
    grayscale: lab.title === 'Tech Sandbox' && hasRequestedVm && !isTechSandboxSucceeded
  }"
>
<div
    v-if="lab.title === 'Tech Sandbox' && isTechSandboxCreating"
    class="vm-creating-overlay"
  >
    <div class="overlay-content">
      <q-spinner-dots color="white" size="40px" />
      <div class="q-mt-sm">Your VM is being created...</div>
    </div>
  </div>

  <q-img :src="lab.img" class="sandbox-img" />

  <q-card-section>
    <div class="action-buttons">
      <q-btn
        label="Restart"
        color=""
        outline
        class="q-mr-sm act-btn"
        v-if="lab.title !== 'Tech Sandbox'"
      />
      <q-btn
        label="Shutdown"
        color=""
        outline
        class="q-mr-sm act-btn"
        v-if="lab.title === 'Tech Sandbox'"
        @click="shutdown(labsData.find(vm => vm.userName === currentUserName))"
      />
      <q-btn
        :label="['Fintech Sandbox', 'MAANG Sandbox'].includes(lab.title)
          ? 'Download'
          : (lab.title === 'Tech Sandbox' && labsData.some(vm => vm.userName === currentUserName && vm.provisioningState === 'Succeeded'))
          ? 'Download VM'
          : (isCreatingVm ? '' : 'Start')"
        :loading="isCreatingVm"
        class="act-btn"
        @click="['Fintech Sandbox', 'MAANG Sandbox'].includes(lab.title)
          ? handleLabAction(lab)
          : (lab.title === 'Tech Sandbox' && labsData.some(vm => vm.userName === currentUserName && vm.provisioningState === 'Succeeded'))
          ? downloadVm(labsData.find(vm => vm.userName === currentUserName && vm.provisioningState === 'Succeeded'))
          : handleLabAction(lab)"
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
                    <q-btn label="Restart" color="" outline class="q-mr-sm act-btn" v-if="lab.title !== 'Tech Sandbox'" />
                    <q-btn
  label="Shutdown"
  color=""
  outline
  class="q-mr-sm act-btn"
  v-if="lab.title === 'Tech Sandbox'"
  @click="shutdown(labsData.find(vm => vm.userName === currentUserName))"
/>
                    <q-btn
  :label="
    ['Fintech Sandbox', 'MAANG Sandbox'].includes(lab.title)
      ? 'Download'
      : (lab.title === 'Tech Sandbox' && labsData.some(vm => vm.userName === currentUserName && vm.provisioningState === 'Succeeded'))
        ? 'Download VM'
        : (isCreatingVm ? '' : 'Start')
  "
  :loading="isCreatingVm"
  class="act-btn"
  @click="
    ['Fintech Sandbox', 'MAANG Sandbox'].includes(lab.title)
      ? handleLabAction(lab)
      : (lab.title === 'Tech Sandbox' && labsData.some(vm => vm.userName === currentUserName && vm.provisioningState === 'Succeeded'))
        ? downloadVm(labsData.find(vm => vm.userName === currentUserName && vm.provisioningState === 'Succeeded'))
        : handleLabAction(lab)
  "
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
    <DemoUserPopUp v-if="showPopup" @close="showPopup = false" />
</template>

<script>
import windows_lab from "src/assets/windows_lab.jpg";
import ubuntu_lab from "src/assets/ubuntu_lab.jpg";
import MySql_lab from "src/assets/MySql_lab.jpg";
import redis_lab from "src/assets/redis_lab.jpg";
import extra_lab1 from "src/assets/fintech_banks.jpeg";
import extra_lab2 from "src/assets/extra_lab2.jpg";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import circ_d1 from "src/assets/Circ_D1.png";
import extra_lab3 from "src/assets/extra_lab3.jpg";
import dojo from "src/assets/dojo.jpg";
import white_board from "src/assets/white_board.jpg";
import jupyter from "src/assets/jupyter.jpg";
import { urls } from "./Urls";
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import windows from "../../assets/Windows.png";
import { useProfileStore } from "src/stores/profile";
import DemoUserPopUp from "src/layouts/DemoUserPopUp.vue";
import { version } from "jszip";
export default {
  components: {
    FinPortletItem,
    DemoUserPopUp,
  },
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const profileStore = useProfileStore();
    const currentUserName = profileStore.user.username || '';
    console.log("Current User Name:", currentUserName);

    return {
      userType,
      currentUserName,
    }
  },
  data() {
    return {
      isCreatingVm:false,
      showPopup: false,
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
      isTechSandboxSucceeded: false,
      isTechSandboxCreating: false,
      jupyter: jupyter,
      hasRequestedVm: false,
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
      { title: "MAANG Sandbox", img: extra_lab2 },
        { title: "Tech Sandbox", img: windows_lab },
        { title: "Linux Sandbox", img: ubuntu_lab },
        { title: "MySQL Server", img: MySql_lab },
        { title: "Redis Server", img: redis_lab },

        { title: "Extra Lab 1", img: extra_lab3 }
      ],
      tools: [
    { title: "Gurukul Dojo", img: dojo, link: "https://gurukul.finvedic.com/dojo/" },
    { title: "Gurukul Whiteboard", img: white_board, link: "https://excalidraw.com/"},
    { title: "Gurukul Notebook", img: jupyter, link: "https://jupyter.finvedic.in/" }
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
    userHasVm() {
    return this.labsData.some(vm => vm.userName === this.currentUserName);
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
    fetchRequestVms() {
    this.$api.get('/api/request-vms')
      .then(response => {
        console.log('Request VMS response:', response.data);

        const vms = response.data.data || [];

        vms.forEach(vm => {
          console.log('Requested VM username:', vm.username);
        });

        // compare usernames
        const session = useSessionStore();
        const profileStore = useProfileStore();
        const currentUserName = profileStore.user.username || '';

        this.hasRequestedVm = vms.some(vm => vm.username === currentUserName);
        console.log('Has requested VM:', this.hasRequestedVm);
      })
      .catch(error => {
        console.error('Error fetching request VMS:', error);
      });
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
username:s:srikanth001\\fnvedicuser
connection type:i:6
networkautodetect:i:1
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0`;
        fileName = "FinTech_Sandbox.rdp";
    } else if (lab.title === "MAANG Sandbox") {
        rdpContent = `full address:s:fnvedicprodlabs2201442271007.eastus.cloudapp.azure.com:56638
prompt for credentials:i:1
username:s:finvedic\\fnvedicuser
connection type:i:6
networkautodetect:i:1
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0`;
        fileName = "MAANG_Sandbox.rdp";
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
downloadVm(lab) {
  const sessionStore = useSessionStore(); // Access session store
  const profileStore = useProfileStore();

  if (!lab) {
    this.showMsg('Lab data is unavailable.', 'negative');
    return;
  }

  console.log("profile username:", profileStore.user?.username);
  console.log("lab username:", lab.userName);

  if (!profileStore.user) {
    this.showMsg('User profile is not available.', 'negative');
    return;
  }

  const isAdmin = profileStore.user.roles?.some(role => role.name === 'Admin');

  if (!isAdmin && profileStore.user.username !== lab.userName) {
    this.showMsg('You are not authorized to download this file.', 'negative');
    return;
  }

  const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  const downloadUrl = `${baseUrl}download/${lab.name}`;

  fetch(downloadUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStore.token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lab.name}.rdp`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      this.showMsg('Download started!', 'positive');
    })
    .catch(error => {
      this.showMsg('Download failed: ' + error.message, 'negative');
      console.error('Fetch error:', error.message);
    });
},

async shutdown(lab) {
  const profileStore = useProfileStore();
  const profileUsername = profileStore.user.username;
  const isAdmin = profileStore.user.roles.some(role => role.name === 'Admin');

  if (!lab) {
    this.showMsg('No VM found to shut down.', 'negative');
    return;
  }

  // 🚫 Access check: only Admin or owner can proceed
  if (!isAdmin && lab.userName !== profileUsername) {
    this.showMsg('You do not have permission to perform this action.', 'negative');
    return;
  }

  if (['Deleted', 'Deleting', 'Failed'].includes(lab.provisioningState)) {
    this.showMsg('Cannot perform shutdown action as the lab is already deleted, deleting, or failed.', 'negative');
    return;
  }

  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const getDeleteVMUrl = baseUrl + 'deletevm/';
    await this.$api.get(getDeleteVMUrl + lab.name);
    lab.locked = true;
    this.saveLockedStates();
    this.showMsg('Shutdown initiated!', 'positive');
    setTimeout(() => {
  window.location.reload();
}, 3000);
  } catch (error) {
    console.error(error);
    this.showMsg('There was an error initiating shutdown.', 'negative');
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
    handleLabAction(lab) {
  const isDownload = ['Fintech Sandbox', 'MAANG Sandbox'].includes(lab.title);
  const isGuest = this.userType === 'Guest';

  // console.log('Lab:', lab);
  // console.log('User Type:', this.userType);
  // console.log('Is Guest:', isGuest);
  // console.log('Is Download:', isDownload);
  // console.log('Is Locked:', lab.locked);

  if (isGuest) {
    console.log('Guest user → showing popup and blocking action');
    this.showPopup = true;
    return;
  }

  // For non-guests, proceed with action
  if (isDownload) {
    console.log('Non-guest → downloading...');
    this.download(lab);
  } else {
    console.log('Non-guest → starting lab...');
    this.handleStart(lab.title);
  }
},
    getAzureVmsData() {
      this.loading = true;
      this.$api.get(urls.getAzureVmsUrl).then(response => {
        this.loading = false;
        console.log('Raw API Response:', response.data.data);

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
        const session = useSessionStore();
const profileStore = useProfileStore();
const currentUserName = profileStore.user.username || '';
this.isTechSandboxSucceeded = this.labsData.some(
        vm =>
          vm.userName === currentUserName &&
          vm.provisioningState === 'Succeeded'
      );
      this.isTechSandboxCreating = this.labsData.some(
      vm =>
        vm.userName === currentUserName &&
        vm.provisioningState === 'Creating'
    );
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
    setTimeout(() => {
  window.location.reload();
}, 3000);
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
  // Add resize event listener
  window.addEventListener("resize", this.handleResize);

  // Initial data load
  this.getAzureVmsData();
  this.loadLockedStates();
  this.fetchRequestVms();

  // Periodically call getAzureVmsData every 2 minutes (120,000 ms) if route is '/labs'
  if (this.$route.path === '/labs') {
    this.intervalId = setInterval(() => {
      this.getAzureVmsData();
      this.fetchRequestVms();
    }, 120000); // 2 minutes
  }
},

beforeDestroy() {
  // Clear interval and remove resize event listener
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
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
.grayscale {
  filter: grayscale(100%);
  pointer-events: none;
  opacity: 0.6;
}
.vm-creating-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  color: white;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.overlay-content {
  text-align: center;
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
