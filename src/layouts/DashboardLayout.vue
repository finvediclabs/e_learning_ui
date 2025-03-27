<template>
  <q-layout view="hHh Lpr fFf  " :class="backgroundStyle" >
    <q-header >
  <q-toolbar class="q-pa-md q-pr-lg mainHeader" >
    <q-item class="mobile_padding">
      <q-item-section avatar class="ham">
        <q-btn
          v-if="isMobile"
          flat
          dense
          round
          icon="menu"
          class="menu-button"
          @click="drawerLeft = !drawerLeft"
        />
        <q-icon
          name="arrow_back"
          style="font-weight: bold;"
          class="cursor-pointer"
          @click="$router.go(-1)"
          v-if="!showDrawer && !isMobile"
        />
      </q-item-section>

      <!-- Placeholder for logo -->
      <div class="q-ml-md logo">
            <!-- Logo will be added here later -->
            <q-item class="logo_in">
              <q-img :src="new_logo" style="width: 220px;"></q-img>
        </q-item>
          </div>
    </q-item>

    <!-- Hamburger Menu Button for Mobile -->


    <!-- Horizontal Navigation Bar -->
    <div class="nav-bar row items-center q-gutter-sm" v-if="!isMobile" >
      <q-select
  v-if="!$q.screen.lt.sm"
  v-model="selectedExplore"
  :options="exploreOptions"
  clearable
  label="Explore"
  dense
  outlined
  emit-value
  color="#4E5BF8"
  map-options
  class="q-ml-md explore"
  style="min-width: 140px;"
/>
      <q-input
  v-if="!isMobile"
  color="bg-finvedic"
  rounded
  outlined
  v-model="text"
  label="Search"
  style="width: 40%;">
  <template v-slot:append>
    <q-icon name="search" />
  </template>

</q-input>



    </div>

    <q-space />





<!-- ================================== -->
<template v-for="(module, index) in otherModules2" :key="index">
  <q-btn
  v-if="!module.menu && !isMobile"
    flat
    class="text-body1 secondary-nav-btn help_button"
    @click="changeLocation(module)"
    v-ripple
  >
    <q-icon :name="module.icon" class="q-mr-sm" size="32px" />
  </q-btn>
</template>
<!-- ================================== -->

    <q-btn
      icon="notifications_active"
      round
      class=" text-white notifs"
    >
      <div v-if="notificationList.length" class="notification-badge">
        {{ notificationList.length }}
      </div>
      <q-menu
        class="fin-br-8 q-py-md shadow-0"
        min-width="120px"
        style="width:230px;background: transparent!important;"
        :offset="[-0, 10]"
        transition-show="flip-right"
        transition-hide="rotate"
      >
        <!-- Notifications menu content -->
      </q-menu>
    </q-btn>

    <q-avatar class="shadow-4" :size="isMobile ? '40px' : '50px'">
          <q-img :src="imageUrl || profileImg" class="profileImg cursor-pointer rounded full-width full-height" />
          <q-menu :offset="[-5, 5]" max-width="300px" style="width:230px;background: transparent!important;"
            class="fin-br-8 q-py-md shadow-0" transition-show="flip-right" transition-hide="rotate">
            <div style="background-color: #EAEAEA;opacity:0.99" class="q-py-md shadow-2 fin-br-8">
              <div class="q-pa-sm absolute-top-right arrow" style="margin-top: -19px">
                <q-icon name="arrow_drop_up" size="xl" style="color: #EAEAEA"></q-icon>
              </div>
              <q-list style="min-width: 200px" class="text-weight-bold">
                <q-item @click="$router.push('/profile')" clickable v-close-popup>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item v-if="isEligible" @click="$router.push('/StudentProfile')" clickable v-close-popup>
                  <q-item-section>Student Profile</q-item-section>
                </q-item>
                <q-item @click="logout" clickable v-close-popup>
                  <q-item-section>Log Out</q-item-section>
                  <q-item-section>
                    <svg width="27" height="9" viewBox="0 0 27 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path id="Arrow 3"
                        d="M26.3536 4.85355C26.5488 4.65829 26.5488 4.34171 26.3536 4.14644L23.1716 0.964464C22.9763 0.769202 22.6597 0.769202 22.4645 0.964464C22.2692 1.15973 22.2692 1.47631 22.4645 1.67157L25.2929 4.5L22.4645 7.32843C22.2692 7.52369 22.2692 7.84027 22.4645 8.03553C22.6597 8.23079 22.9763 8.23079 23.1716 8.03553L26.3536 4.85355ZM4.37114e-08 5L26 5L26 4L-4.37114e-08 4L4.37114e-08 5Z"
                        fill="black" />
                    </svg>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-menu>
        </q-avatar>

  </q-toolbar>
  <!-- <q-toolbar v-if="!isMobile" class="second_navbar q-pr-lg">

  <div class="nav-bar row items-center">
    <template v-for="(module, index) in otherModules" :key="index">
      <q-btn
        v-if="!module.menu"
        flat
        class="q-mx-sm text-body1 secondary-nav-btn"
        :class="{ 'active-nav-item': isActive(module) }"
        @click="changeLocation(module)"
        v-ripple
      >
        <q-icon :name="module.icon" class="q-mr-sm" />
        {{ module.label }}
      </q-btn>
      <q-btn-dropdown
        v-else
        flat
        class="q-mx-sm text-body1 secondary-nav-btn"
        :icon="module.icon"
        :label="module.label"
        no-caps
      >
        <q-list>
          <q-item
            v-for="(item, i) in module.menu"
            :key="item.value"
            clickable
            class="q-my-xs q-px-md"
            @click="changeLocation(module, item)"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
  </div>
</q-toolbar> -->

</q-header>

<!-- Sidebar Drawer for Mobile Navigation -->
<q-drawer v-if="isMobile" v-model="drawerLeft" side="left" overlay persistent>
  <q-list>
    <!-- Close Button -->
    <q-item>
          <q-btn
            flat
            dense
            round
            icon="close"
            class="menu-close-button"
            @click="drawerLeft = false"
          />
        </q-item>
        <template v-for="(module, index) in modules" :key="index">
      <q-item
        clickable
        @click="changeLocation(module)"
        :class="{ 'active-nav-item': isActive(module) }"
      >
        <q-item-section>
          {{ module.label }}
        </q-item-section>
      </q-item>
    </template>

    <!-- Secondary Navbar Items (Mobile Only) -->
    <q-separator class="q-my-md" />
    <!-- <q-item-label header>More</q-item-label> -->
    <template v-for="(module, index) in otherModules" :key="'other-' + index">
      <q-item
        clickable
        @click="changeLocation(module)"
        :class="{ 'active-nav-item': isActive(module) }"
      >
        <q-item-section>
          {{ module.label }}
        </q-item-section>
      </q-item>

    </template>

     <!-- ✅ Help Button Inside Drawer (ONLY FOR MOBILE) -->
     <q-item v-if="isMobile" clickable @click="changeLocation({ value: 'help' })">

      <q-item-section>Help</q-item-section>
    </q-item>
  </q-list>
</q-drawer>




    <q-page-container >
      <q-page >
        <router-view style="background-color: rgba(255, 255, 255, 0); " v-if="token" />
        <chatbot/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import new_logo from "src/assets/new_logo1.svg";
import { useSessionStore } from "src/stores/session";
import { toRaw } from 'vue';
import { setToken } from "src/boot/axios";
import axios from "axios";
import { useProfileStore } from "src/stores/profile";
import profileImg from "src/assets/profile.png";
import Chatbot from "src/layouts/ChatBot.vue";

export default {
  components: {
    Chatbot,
  },
  name: 'dashboard-layout',
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    console.log("Session Token:", token.value);
    const { setUserType, setSessionToken } = session;
    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    return {
      token,
      userType,
      setUserType,
      setSessionToken,
      user
    }
  },
  data() {
    return {
      new_logo: new_logo,
      drawerLeft: false,
      isMobile: window.innerWidth <= 600,
      backgroundStyle: '',
      profileImg: profileImg,
      imageUrl: '',
      profileMenu: false,
      CurrentDate: new Date().toDateString(),
      selectedModule: {},
      drawerLeft: window.innerWidth < 600 ? false : true,
      isMobile: window.innerWidth > 600 ? false : true,
      miniState: false,
      expand: {},
      notificationList: [],
      notificationInterval: null,
      batchNumber:null,
      otherModulesList: [


        {label: "Home", value: "homeProfile", icon: 'home'},
        // { icon: 'event', label: 'Calendar', value: 'calendar' },
        {
    icon: 'computer', label: 'Labs', value: 'labs',
  },

  {
    icon:"books", label:"program", value:"program"
  },
  { label: "Calendar", value: "class-room", icon: 'event' },

{ label: "Assignments", value: "assignment", icon: 'task' },



      {


           icon: 'chat', label: 'Collaboration', value: 'channel'
       },


      ],
      otherModules2List:[
        {label:"help", value:"help", icon: 'help'},
      ],

       modulesList: [


      //   { label: "Hackathons", value: "hackathons", icon: 'celebration' },
      //   {
      //     icon: 'library_books', label: 'Libraries', value: 'library', menu: [
      //       { label: "Books", value: 'books', icon: 'menu_book' },
      //       { label: "Videos", value: "videos", icon: 'switch_video' },
      //       { label: "Presentations", value: "presentations", icon: 'newspaper' },



      //     ]
      //   },
      //   {
      //      icon: 'summarize', label: 'Reports', value: 'reports',

      //  },



      ],
      expand: {},
      userOwner: '',
      defaultPath: "/library/books",
      userAccess: [],
      userType: '',

      //this all access is for testing only// Please remove unnessary profiles in this after testing
      // allAccess: [ "profile", "help","program","assignment","class-room","elearning","admin","library","hackathon","read-pdf"],54


      allAccess: [ "profile", "course","help","home","labs","library","homeProfile","reports","channel","class-room","calendar","books","videos","presentations","chat","read-pdf","program"],
      profiles: [], // Store fetched profiles here
      roles: [], // Store fetched roles here
      userRoles: [],
      rolesMap: {}
    }
  },
  created() {
  this.newfetchUserRoles(); // Call this when the component is created to fetch user roles dynamically
},
  computed: {
    widthSVG() { return window.innerWidth > 600 ? 197 : 150 },
    modules() {
    return this.modulesList.filter(module => this.userAccess.includes(module.value));
  },
  otherModules() {
      return this.otherModulesList.filter((module) => this.userAccess.includes(module.value));
    },
    otherModules2() {
      return this.otherModules2List.filter((module) => this.userAccess.includes(module.value));
    },
  isEligible() {
      const profileStore = useProfileStore();
      const roles = profileStore.user.roles.map(role => role.name);
      // Check if the user is admin or faculty
      return roles.includes('Student');
    },
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: true
    }
  },

  mounted() {
    window.addEventListener("resize", this.checkScreenSize);
    // Start polling when the component is mounted
    // this.notificationInterval = setInterval(() => {
    //   this.getNotifications();
    // }, 5000); // Fetch notifications every 5 seconds
    const sessionStore = useSessionStore(); // Access the session store
    // console.log("Token:", sessionStore.token); // Log the token
    if (!this.token) {
      this.$router.push('/');
    }

    if (this.userType === 'Guest') {
      document.body.classList.add('guest');
    } else {
      document.body.classList.remove('guest');
    }

    this.getUserData();
    this.getEventsDataNotification();
    this.getNotifications();
    this.selectedModule = {
      module: this.$route.meta.module,
      item: this.$route.meta.item
    };
    this.updateBackgroundStyle();
    this.knowModuleFunction();
    this.checkAccess();

    // Fetch profiles and roles to set access paths
    this.fetchProfiles();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenSize);
  },

  watch: {
    token(newVal) {
      if (!newVal) {
        this.$router.push('/');
      }
    },
    user() {
      this.getUserData();
    },
    $route(to, from) {
      this.updateBackgroundStyle();
      this.checkAccess();
    }
  },
  methods: {
    isActive(module) {
    return this.$route.path.startsWith(`/${module.value}`);
  },
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 600;
    },
    async fetchProfiles() {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  let url = `${baseUrl}api/userprofiles`;
        const response = await this.$api.get(url);
        this.profiles = response.data;
        // console.log("response:",response);
        this.fetchUserRoles();
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    },
    newfetchUserRoles() {
    // console.log('Fetching user roles...');  // Log at the start of the method
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    let url = `${baseUrl}api/roles`;
    this.$api.get(url)
      .then(response => {
        // console.log('Response received:', response);  // Log the entire response object

        // Assuming response.data.data is an array of objects with a 'name' field
        this.userRoles = response.data.data.map(role => role.name);
        // console.log('Fetched roles:', this.userRoles);  // Log the fetched roles (only names)

        // Safely initialize rolesMap with empty arrays without using $set
        this.userRoles.forEach(role => {
          // console.log(`Processing role: ${role}`);  // Log each role as it is processed

          // Initialize the role if it doesn't already exist in rolesMap
          if (!this.rolesMap[role]) {
            this.rolesMap[role] = [];  // Direct assignment for reactivity in Vue 3
            // console.log(`Initializing rolesMap for ${role}`);  // Log when a new role is initialized
          }

          this.rolesMap[role].push(role);  // Add role to the map
          // console.log(`Updated rolesMap for ${role}:`, this.rolesMap[role]);  // Log updated rolesMap for the current role
        });

        // console.log('Final updated rolesMap:', this.rolesMap);  // Log the final rolesMap after all roles are processed
      })
      .catch(error => {
        console.error('Error fetching user roles:', error);  // Log error if the API call fails
      });
},
    async fetchUserRoles() {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  let url = `${baseUrl}api/roles`;
        const response = await this.$api.get(url);
        this.roles = response.data.data;
        // console.log("response:",this.roles)
        this.setAccessPaths();
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    },

setAccessPaths() {
  const profileStore = useProfileStore();
  const userRoles = profileStore.user.roles.map(role => role.name); // Extract roles dynamically for the current user
  const profileUsername = profileStore.user.username;
  // console.log(`Processing roles for user: ${profileUsername}`, userRoles); // Debugging log

  // Start by adding all access paths
  const combinedUserAccess = [...this.allAccess]; // Initialize with allAccess
  // console.log('Initial allAccess:', this.allAccess);

  this.profiles.forEach(profile => {
    if (profile.active) { // Check if the profile is active
      // console.log(`Processing Profile: ${profile.profileName}`); // Debugging log

      const activeRoles = profile.roles; // Array of roles for the profile
      activeRoles.forEach(role => {
        // console.log(`Processing Role: ${role.name}`); // Debugging log

        // Check if the current role matches any of the user's roles
        if (userRoles.includes(role.name)) {
          // Add corresponding profile name to userAccess if it’s not already present
          if (!combinedUserAccess.includes(profile.profileName)) {
            combinedUserAccess.push(profile.profileName);
            // console.log(`Added profile: ${profile.profileName} to userAccess for role: ${role.name}`);
          } else {
            console.warn(`Profile ${profile.profileName} already exists in userAccess`);
          }

          // Special handling for "admin" role: ensure "admin" profile is always added
          if (role.name === 'Admin' && !combinedUserAccess.includes('admin')) {
            combinedUserAccess.push('admin');
            // console.log('Added admin profile to userAccess for admin role');
          }
        } else {
          console.warn(`Skipped role: ${role.name} (not matching user's roles)`);
        }
      });
    }
  });

  // Update userAccess with the combined access paths
  this.userAccess = combinedUserAccess;
  // console.log('Final userAccess:', this.userAccess); // Debugging log to show the final state
},
    async getNotifications() {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
  let url = `${baseUrl}api/getnotifications`;
        const response = await this.$api.get(url);
        if (response.data && Array.isArray(response.data)) {
          this.notificationList = response.data.map((notification) => ({
            ...notification,
            sendername: notification.username,
            message: notification.content,
            timestamp: notification.timestamp,
          }));
        }
      } catch (error) {
        // console.error("Error fetching notifications:", error);
      }
    },
    checkAccess() {
  // Wait until userAccess is populated
  if (!this.userAccess || this.userAccess.length === 0) {
    // console.log("User access not loaded yet.");
    return;
  }

  const path = this.$route.path;
  const access = this.userAccess.filter(value => path.startsWith("/" + value));

  if (!access.length) {
    // console.warn("Access not allowed for this path. Redirecting to default path.");
    this.$router.push({ path: this.defaultPath });
  }
},
    getEventsDataNotification() {
      var request = {
        categoryId: this.selectedCategory?.id,
        subCategoryId: this.selectedSubCategory?.id
      };
      this.loading = true;
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const getEvents = baseUrl + 'api/calendarEvents';

      this.$api.get(getEvents, {
        params: request
      }).then(response => {
        this.loading = false;
        if (response.data.success) {
          let events = response.data.data;

          // Map and sort events by date and start time
          events = events.map(event => ({
            title: event.title,
            date: event.date,
            start: event.start,
            end: event.end,
            link: event.link,
            topic: event.topic,
            color: 'white',
            width: '100%',
            height: '50px'
          })).sort((a, b) => new Date(`${a.date} ${a.start}`) - new Date(`${b.date} ${b.start}`));

          const now = new Date();
          let nextEvent = null;
          let lastEvent = null;

          // Find the next event
          nextEvent = events.find(event => new Date(`${event.date} ${event.start}`) > now);

          // Find the most recent past event if no next event is found
          if (!nextEvent) {
            lastEvent = events.reverse().find(event => new Date(`${event.date} ${event.start}`) <= now);
          }

          this.events = events;
          this.nextOrLastEvent = nextEvent || lastEvent;
          this.isNextEvent = !!nextEvent; // true if next event, false if last event
        } else {
          this.showMsg(response.data?.message, 'negative');
        }
      }).catch(error => {
        this.loading = false;
        this.showMsg(error.response?.data.message || error.message, 'negative');
      });
    },
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => {} }
        ]
      });
    },

    updateBackgroundStyle() {
      // Check if the current route is '/library/books'
      if  (this.$route.path === '/elearning') {
        this.backgroundStyle = 'Elearning_BackgroundStyle'; // Apply the background style class
      }
      else if  (this.$route.path === '/program') {
        this.backgroundStyle = 'Program_BackgroundStyle'; // Apply the background style class
      }
      else if  (this.$route.path === '/homeProfile') {
        this.backgroundStyle = 'Program_BackgroundStyle'; // Apply the background style class
      }
      else if  (this.$route.path === 'program/') {
        this.backgroundStyle = 'Program_BackgroundStyle2'; // Apply the background style class
      }
      else if  (this.$route.path === '/labs') {
        this.backgroundStyle = 'labs_BackgroundStyle'; // Apply the background style class
      }

      else if (this.$route.path === '/library/elearning') {
        this.backgroundStyle = 'Assignment_BackgroundStyle'; 
      }


      else if(this.$route.path === '/help'){
        this.backgroundStyle = 'help_backgroundStyle';

      }
      else if (this.$route.path === '/StudentProfile') {
        this.backgroundStyle = 'StudentProfile_backgroundStyle';
      }
      else if (this.$route.path === 'MenuContent') {
        this.backgroundStyle = 'MenuContent_backgroundStyle';
      }
      else if (this.$route.path === '/') {
        this.backgroundStyle = 'Dashboard_backgroundStyle';
      }
      else {
        this.backgroundStyle = ''; // Do not apply any background style
      }
    },
    getUserData() {
  this.$api.get(`api/users/${this.user.id}`).then(response => {
    if (response.data.success) {
      const user = response.data.data;
      this.profile = {
          name: user.name,
          dob:user.dob,
          graduationDegree: user.graduationDegree,
          qualificationYear: user.qualificationYear,
          specialization:user.specialization,
          gender:user.gender,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: this.user.roles ? this.user.roles[0] : [],
          //owner: user.owner,
      };
//console.log(this.profile);
   if (this.userType === 'Student'&& Object.values(this.profile).some(value => value === null || value === undefined)) {
           this.$router.push('/profile');
    }

     //console.log(this.profile)

      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const removeImagePath = baseUrl + 'fs/download/';

      //Check if uploadDocumentPath is not null or undefined
      if (user.uploadDocumentPath) {
        const filename = user.uploadDocumentPath.replace(removeImagePath, '');

        // Post the filename to get the image blob
        const formData = new FormData();
        formData.append('filename', filename);
        const ImagePath = baseUrl + 'fs/download';

        this.$api.post(ImagePath, formData, {
          responseType: 'blob'
        }).then(response => {
          const url = URL.createObjectURL(response.data);
          this.imageUrl = url;
        }).catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
      } else {
        this.imageUrl = ''; // Set imageUrl to an empty string if uploadDocumentPath is null
      }

    } else {
      this.showMsg(response.data.message, 'negative');
    }
  }).catch(error => {
    this.loading = false;
    this.showMsg(error.response?.data.message || error.message, 'negative');
  });
},



    toggleFunction() {
      if (screen.width < 576) {
        this.drawerLeft = !this.drawerLeft;
      } else {
        this.miniState = !this.miniState;
      }
    },
    knowModuleFunction() {
      var filteredModule = this.modulesList.filter(module => module.menu);
      filteredModule.forEach(module => {
        this.expand[module.value] = this.selectedModule.module == module.value;
      });
    },
    getActiveModuleClass(module) {
      return {
        "module-select-active inset-shadow shadow-5": module.value == this.selectedModule.module && !module.menu,
        "menu-class": module.menu
      }
    },

    getActiveMenuItemClass(module, item) {
      return {
        "module-select-active inset-shadow shadow-5": this.selectedModule.module === module.value && this.selectedModule.item == item.value
      }
    },

    getExpansionBoolean(module) {
      return this.selectedModule.module === module.value;
    },
    changeLocation(module, item) {
      let url = item ? `/${module.value}/${item.value}` : `/${module.value}`;
      this.$router.push({ path: url });
      if (this.isMobile) this.drawerLeft = false;
    },

    changeLocation(module, item) {

      let url;
      this.selectedModule = { module: module.value, item: item?.value };
      if (item) {
        url = `/${module.value}/${item.value}`;
        this.$router.push({ path: url })
      } else {
        url = `/${module.value}`;
        this.$router.push({ path: url })
      }
    },
    logout() {
      this.$q.dialog({
        title: 'Are You Sure Want To Log Out?',
        cancel: {
          label: 'No',
          color: 'black',
          flat: true
        },
        ok: {
          label: 'Yes',
          color: 'red',
          // flat: true,
        },
        persistent: true
      }).onOk(() => {
        sessionStorage.clear();
        this.setSessionToken();
        this.setUserType();
        this.$router.push('/');
      });
    }
  }
}
</script>
<style>
.active-web-nav {
  color: #5479F7 !important;
  font-weight: bold;
}

.active-nav-item {
  color: #5479F7 !important;
  font-weight: bold;
}

.module-select {
  border-radius: 10px 0px 0px 10px;
}
.booksBackgroundStyle {
  background-image: url('/src/assets/BG_New.png');
  background-repeat: no-repeat;
  background-size: 100vw 70vh;

}
.Assignment_BackgroundStyle {
  background-image: url('/src/assets/ai_set_bg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top:3%;
}
.Elearning_BackgroundStyle {
 background-color: #F6F6F6;
 background-size: 100% 100%;

}
.Program_BackgroundStyle {
  background-color: #FFFFFF;
  background-size: 100% 100%;
  margin-top:3%;
}

.Program_BackgroundStyle2 {
  background-color: #ffff;
  background-size: 100% 100%;
  margin-top:3%;
}


.labs_BackgroundStyle {
  height: 100%;
  width: 100%;
  /* padding-top: 0%; */
  /* padding-bottom: 5%; */
  background-color: #FFFF;
  background-image: url('src/assets/Labs_tools.png');
  background-size: 100% 100%;
  background-position: cover;
  background-repeat: no-repeat;
}



body{
  /* background-color: #fff; */
  background-color: #F6F6F6;
  background-size: 100% 100%;
background-size: cover;
background-position: center;
background-repeat: no-repeat;
background-attachment: fixed;
}



.Lib_CL_Room_BackgroundStyle{
  background-image: url('/src/assets/BG_New.png');
  background-repeat: no-repeat;
  background-size: 100vw 40%;
}
.help_backgroundStyle{
  background-image: url('/src/assets/BackImg.png');
  background-repeat: no-repeat;
  background-size: 100vw 55vh;
  position: absolute;
  top: 120px;
}
.StudentProfile_backgroundStyle{
  background-color: #B2CCFC;
  background-size: 100vw 100vh;
}
.module-select-active {
  background: #fff;
  color: #5479F7;
}
.bg-white2{
  background-color: #0A004B;
}
.AI_Setup_BackgroundStyle{
  background-image: url('/src/assets/ai_set_bg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top:3%;
}
.Users_BackgroundStyle{
  background-image: url('/src/assets/ai_set_bg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top:3%;
}
.Classroom_BackgroundStyle{
  background-image: url('/src/assets/classroom_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top:3%;
}
.menu-class {
  padding: 0px 0px !important;
}

.fin-profile-bg {
  background: #E6E6E6;
}

.profileImg {
  background: #FF7F50;
}
.adminBackgroundStyle{
  background-color: #D0DFFA;
}

.left-drawer {
  min-height: 300px;
  height: calc(100vh - 345px);

}

.fin-drawer-style {
  margin-top: 40px;
  border: none !important;
  border-radius: 0px 20px 0px 0px;
  /* padding-top: 40px; */
  background: transparent!important;
}
.q-field--outlined.q-field--rounded .q-field__control {
    /* border-radius: 28px; */
    background-color: white;

}
.q-drawer {
  background-color: transparent;
}
.notifs{
  margin-right: 20px; font-size: 1rem;
}
.nav-bar .q-btn {
  font-family: 'Poppins', sans-serif;
  font-size: small;
  font-weight: 500; /* Adjust weight as needed (300, 400, 600, etc.) */
  /* color: var(--q-color-primary);  */
  color: #7D7D7D;
  text-transform: capitalize !important;
}
.nav-bar{
  justify-content: center !important;
  width: 80%;
}

.q-toolbar {
  font-family: 'Poppins', sans-serif;
}
.second_navbar{
  color: #ffff;
  background-color: #F6F6F6;
  width: 100%;
}
.mainHeader {
  background: #fff;
  /* background: #5479F7; */
  backdrop-filter: blur(19px);
}

.guest .chapters_show > div:nth-child(1),
.guest .chapter_right > div:nth-child(2){
    /* Styles for first, second, and last child divs */
    cursor: pointer; /* Change cursor to indicate it's clickable */
}
.guest .chapters_show> div:not(:nth-child(1)),
.guest .chapter_right > div:not(:nth-child(2)) {
    /* Styles for other child divs */
    pointer-events: none; /* Disable click events *//* Optionally reduce opacity to indicate non-clickable */
}


.q-item__section--avatar {
  min-width: inherit !important;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0px 6px;
  font-size: 12px;
}

.logo {
  /* height: 40px; */
  width: auto;
}

.logo_in{
  min-height: 0px !important;
}


@media only screen and (max-width:576px){

  /* .logo{
    display: none !important;
  } */
}
@media screen and (min-width: 1920px){
  .booksBackgroundStyle {
  background-image: url('/src/assets/BG_New.png');
  background-repeat: no-repeat;
  background-size: 100vw 60%;

}
}
@media (max-width: 768px) {
   .ham{
    padding: 0px;
   }

   .logo_in{
    min-height: 0px !important;
    padding: 0px;
   }

  .logo{
    margin-right: auto;
    margin-left: auto;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  .help_backgroundStyle{
  top: 60px;
  }

  .Elearning_BackgroundStyle {
    background-image: url('/src/assets/ai_set_bg.jpg');
  background-repeat:no-repeat;
  background-size: 100% 100%;
  background-position: center;
  background-attachment: fixed;
  top: 0px;
  }
}

.hidden-arrow {
  display: none;
}
/* ======================= */
.menu-button {
  /* color: white; */
  color: #7D7D7D;
  margin-left: auto;

}

.menu-button .q-item{
  padding: 0px 0px !important ;
}

.nav-bar {
  display: flex;
  gap: 15px;
  justify-content: flex-start !important;
}

.q-drawer {
  background: #fff;
  width: 250px;
}

.help_button{
  color: #7D7D7D;
}

.notifs{
  color: #7D7D7D !important;
}

.cursor-pointer {
color: #7D7D7D !important;
}

@media (max-width: 600px) {
  /* .nav-bar {
    display: none;
  } */
  .mobile-menu {
    display: block;
  }
  .notifs{
    margin-right:0px; font-size: 1rem;
  }
  .help_button{
    padding: 0px 0px !important;
    margin-right: 0% !important;
  }
  .mobile_padding{
      padding-left: 1% !important;
      padding: 0px;
    min-height: 0px !important;

  }
}

.otherModules2{
  border: 2px solid red !important;
}

.q-btn:before{
  box-shadow: none !important;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
  overflow: hidden;
}

/* Reduce font size on smaller laptop screens */
@media (max-width: 1440px) {
  .nav-bar {
    gap: 6px;
  }
  .nav-bar .q-btn {
    font-size: 14px;
    padding: 6px 10px;
  }
}

@media (max-width: 1280px) {
  .nav-bar .q-btn {
    font-size: 13px;
    padding: 5px 8px;
  }
}


.second_navbar {

  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Hide secondary navbar on mobile screens */
@media (max-width: 768px) {
  .second_navbar {
    display: none;
  }
}

.menu-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* .active-nav-item {
  background-color: #E6E6E6 !important;
  color: #000 !important;
  border-radius: 8px;
  margin: 0px 10px;
  font-size:medium;
} */
</style>
