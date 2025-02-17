<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navigation Bar -->
    <q-header class="bg-black text-white" elevated>
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
        { label: "For Individuals", key: "individuals" },
        { label: "For Corporates", key: "corporates" },
        { label: "For COE (Center of Excellence)", key: "coe" }
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
.nav-item::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
}

/* Underline on Active Tab (Always Visible) */
.active-link::after {
  width: 100%;
  left: 0;
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