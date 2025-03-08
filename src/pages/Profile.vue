<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-md h-full p-4 fixed">
      <!-- Profile Section -->
      <div class="flex items-center space-x-3 pb-4 border-b">
        <img class="w-12 h-12 rounded-full" :src="user.profileImage" alt="User Image" />
        <div>
          <h2 class="text-lg font-semibold">{{ user.name }}</h2>
          <p class="text-gray-500 text-sm">{{ user.email }}</p>
        </div>
      </div>

      <!-- Menu List (Sidebar) -->
      <ul class="mt-4">
        <li v-for="item in menuItems" :key="item.name" class="list-item">
          <button @click="selectedMenu = item.name"
                  class="list-link"
                  :class="{ 'active': selectedMenu === item.name }">
            {{ item.name }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 ml-64 main-content">
      <!-- Top Navigation Bar -->
      <div class="top-nav">
        <button v-for="item in menuItems" :key="item.name"
                @click="selectedMenu = item.name"
                class="menu-button"
                :class="{ 'active': selectedMenu === item.name }">
          {{ item.name }}
        </button>
      </div>

      <!-- Content Section -->
      <div class="content-area">
        <MenuContent :selectedMenu="selectedMenu" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MenuContent from 'src/components/MenuContent.vue';

// User data
const user = ref({
  name: '',
  email: '',
  profileImage: 'https://via.placeholder.com/150',
  role: 'Basic Member'
});

// Sidebar menu items
const menuItems = ref([
  { name: "View Public Profile" },
  { name: "Photo" },
  { name: "Account Security" },
  { name: "Subscriptions" },
  { name: "Payment Method" },
  { name: "Notification Preferences" },
  { name: "API Clients" },
  { name: "Close Account" },
]);

// Track selected menu
const selectedMenu = ref(menuItems.value[0].name);

// Fetch user data
const fetchUserData = async () => {
  try {
    const response = await fetch('https://api.example.com/user'); 
    const data = await response.json();
    user.value = {
      name: data.name,
      email: data.email,
      profileImage: data.profileImage || user.value.profileImage,
      role: data.role || 'Basic Member'
    };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

// Fetch user data on component mount
onMounted(fetchUserData);
</script>

<style scoped>
/* Sidebar styles */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list-item {
  width: 16rem;
  margin-bottom: 8px;
}

.list-link {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background-color: #f8f9fa;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.list-link:hover, .list-link.active {
  background-color: #d1d5db;
  color: #000;
  font-weight: 600;
}

/* Fix Sidebar Position */
.fixed {
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

/* Top Navigation Bar */
.top-nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px 0;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position:absolute;
  top: 0;
  z-index: 1000;
}

.menu-button {
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-button:hover, .menu-button.active {
  color: #000;
  border-bottom: 2px solid #000;
  font-weight: 600;
}

/* Main Content */
.main-content
{
  margin-left: 16rem;
}
.content-area {
  padding-top: 20px;
  min-height: calc(100vh - 50px);
  background: #f5f5f5;
}

</style>
