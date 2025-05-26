<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navigation Bar -->
 <q-header class="bg-Customblue text-white" elevated>
      <q-toolbar>

        <!-- Hamburger button for mobile -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="drawer = !drawer"
        />

        <!-- Logo -->
        <div
          class="nav-container"
          :class="{'q-ml-md': $q.screen.gt.sm, 'q-toolbar-title text-center': $q.screen.lt.md}"
          style="flex: 1"
        >
          <q-item class="logo_in">
            <q-img :src="new_logo2" style="width: 220px;" />
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
            dense
            filled
            options-dense
            class="bg-white text-black"
            style="min-width: 160px; border-radius: 20px;"
            v-model="selectedCourse"
            :options="courseOptions"
            label="Courses"
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
            class="text-white"
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
        <router-view />
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
  methods: {
    isActiveRoute(path) {
      return this.$route.path === path;
    },
      goToLogin() {
      this.drawer = false  // close drawer if open
      this.$router.push('/login')  // navigate to /login route
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
</style>
