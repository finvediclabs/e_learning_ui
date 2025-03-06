<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navigation Bar -->
    <q-header class="bg-Customblue text-white" elevated>
      <q-toolbar>
        <div class="nav-container">
          <q-btn
            v-for="(item, index) in navItems"
            :key="index"
            flat
            noCaps
            :label="item.label"
            @click="activeTab = item.key"
            class="text-white nav-item"
            :class="{ 'active-link': activeTab === item.key }"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center">
        <component :is="currentComponent" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Individual from "src/layouts/home/Individual.vue";
import Corporates from "src/layouts/home/Corporates.vue";
import Coe from "src/layouts/home/Coe.vue";

export default {
  name: "HomePage",
  components: {
    Individual,
    Corporates,
    Coe
  },
  data() {
    return {
      activeTab: "individuals", // Default tab
      navItems: [
        { label: "Individuals", key: "individuals" },
        { label: "Corporates", key: "corporates" },
        { label: "Colleges", key: "coe" }
      ]
    };
  },
  computed: {
    currentComponent() {
      switch (this.activeTab) {
        case "corporates":
          return "Corporates";
        case "coe":
          return "Coe";
        default:
          return "Individual";
      }
    }
  }
};
</script>

<style scoped>
/* Navigation Container */
.nav-container {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
}

/* Navigation Item */
.nav-item {
  /* font-size: 16px; */
  /* padding: 12px 15px; */
  position: relative;
  transition: color 0.3s ease-in-out;
}

/* Underline Effect (Default Hidden) */


.active-link{
  text-decoration: underline;
  text-underline-offset: 6px;
}

/* Underline on Active Tab (Always Visible) */
.active-link::after {
  width: 100%;
  left: 0;
}
.bg-Customblue{
  background-color: #4E5BF8;
  /* background-color: #7C89FA; */
  /* background-color: gray; */
}
/* Responsive Font Adjustments */
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
