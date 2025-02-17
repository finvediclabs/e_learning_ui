<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Navigation Bar -->
    <q-header class="bg-black text-white" elevated>
      <q-toolbar>
        <div class="q-gutter-md">
          <q-btn
            v-for="(item, index) in navItems"
            :key="index"
            flat
            noCaps
            :label="item.label"
            @click="activeTab = item.key"
            class="text-white"
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
.q-gutter-md {
  display: flex;
  align-items: center;
}

.active-link {
  border-bottom: 2px solid white; /* Adds underline to active tab */
}
</style>
