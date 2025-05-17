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
            :to="item.to"
            class="text-white nav-item"
            :class="{ 'active-link': isActiveRoute(item.to) }"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      navItems: [
        { label: "Individuals", to: "/" },
        { label: "Corporates", to: "/corporates" },
        { label: "Colleges", to: "/colleges" }
      ]
    };
  },
  methods: {
    isActiveRoute(path) {
      return this.$route.path === path;
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
