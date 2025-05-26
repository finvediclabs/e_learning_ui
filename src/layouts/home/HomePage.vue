<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navigation Bar -->
 <q-header class="bg-Customblue text-white" elevated >
      <q-toolbar>

        <!-- Hamburger button for mobile -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md inn-blue"
          @click="drawer = !drawer"
        />

<!-- Logo -->
<div
  class="nav-container"
  :class="{
    'q-ml-md': $q.screen.gt.sm,
    'q-toolbar-title justify-center': $q.screen.lt.md
  }"
  style="flex: 1"
>
  <q-item class="logo_in no-hover-effect" clickable @click="goToHome">
    <q-img :src="new_logo2" class="logo-img" />
  </q-item>
</div>


        <!-- Spacer -->
        <q-space />

        <!-- Right side buttons on desktop only -->
        <div
          class="row items-center no-wrap q-mr-md"
          style="gap: 16px; flex-wrap: nowrap;"
          v-show="$q.screen.gt.sm"
        >
          <!-- Courses Dropdown -->
  <q-select
  v-if="!$q.screen.lt.sm"
  v-model="selectedExplore"
  :options="exploreOptions"
  label="Courses"
  dense
  filled
  options-dense
  emit-value
  map-options
  color="primary"
  dropdown-icon="keyboard_arrow_down"
  class="q-ml-md bg-white text-black"
  style="min-width: 160px; border-radius: 20px;"
  @update:model-value="onCourseSelect"
/>


          <!-- Our Certifications -->
          <q-btn
            flat
            class="text-white"
            :label="'Our Certifications'"
            style="white-space: nowrap; min-width: 150px;"
            @click="onCertifications"
          />

          <!-- Platform Login -->
          <q-btn
            flat
            class="text-white light_blue_BG"

            :label="'Platform Login'"
            style="white-space: nowrap; min-width: 140px;"
             @click="goToLogin"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Mobile Drawer -->
    <q-drawer
      v-model="drawer"
      side="left"
      overlay
      behavior="mobile"
      class="bg-white text-black"
      show-if-above
      :breakpoint="500"
    >
      <q-list padding>
        <q-item clickable @click="onCourseSelect; drawer = false">
          <q-item-section>Courses</q-item-section>
        </q-item>

        <q-item clickable @click="onCertifications; drawer = false">
          <q-item-section>Our Certifications</q-item-section>
        </q-item>

        <q-item clickable  @click="goToLogin">
          <q-item-section>Platform Login</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="flex">
        <router-view :key="$route.fullPath" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import new_logo2 from "src/assets/ScaleGrad_White.svg";
import new_logo from "src/assets/new_logo1.svg";
export default {
  name: "HomePage",
  data() {
    return {
       routeUniqueId: "",
     selectedExplore: null,
      exploreOptions: [],
      navItems: [
        { label: "Individuals", to: "/" },
        { label: "Corporates", to: "/corporates" },
        { label: "Colleges", to: "/colleges" }
      ],
       new_logo2: new_logo2,
      new_logo: new_logo,
drawer: false,
    };
  },
  mounted()
  {
    this.fetchExploreOptions();
  },
  methods: {
    isActiveRoute(path) {
      return this.$route.path === path;
    },
      goToLogin() {
      this.drawer = false  // close drawer if open
      this.$router.push('/login')  // navigate to /login route
    },
   async fetchExploreOptions() {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const response = await fetch(baseUrl + 'api/chapterCategoriess');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    this.exploreOptions = data.map(item => {
      const label = item.categoryName === 'Specialization'
        ? 'Equities & Electronic Trading'
        : item.categoryName;

      return {
        label: label,
        value: item.id
      };
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
},
goToHome() {
    this.selectedExplore = null;
    this.$router.push('/home');
  },
onCourseSelect(courseId) {
    if (courseId) {
      this.$router.push({ path: `/course/${courseId}` });

    }
  }



  }
};
</script>

<style scoped>
.nav-container {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
}
.light_blue_BG{
  background-color: #41C0FD !important;
  border-radius: 12px;
}
.nav-item {
  position: relative;
  transition: color 0.3s ease-in-out;
}

.active-link {
  text-decoration: underline;
  text-underline-offset: 6px;
}

.bg-Customblue {
  background-color: #2528CB;
}

@media (max-width: 768px) {
  .nav-container{
    margin:  0 7%;
  }
  .nav-item {
    font-size: 14px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    flex-direction: row;

  }
  .nav-item {
    font-size: 11px;
    padding: 6px 8px;
    text-align: center;
    flex-grow: 1;
  }
}

.nav-container {
  display: flex;
  align-items: center;
  width: 100%;
}

/* Ensures logo doesn't have any hover effects */
.logo_in:hover {
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

.no-hover-effect::before {
  background: none !important;
}

.logo-img {
  width: 220px;
  margin: 0 auto;
}

</style>
