<template>
    <div class="p-4 bg-white shadow-md rounded-lg">
      <!-- View Public Profile Section -->
      <div v-if="selectedMenu === 'View Public Profile'">
        <h2 class="text-xl font-semibold mb-1">Profile Details</h2>
        <p class="text-gray-500 text-sm mb-4">You can change your profile details here seamlessly.</p>
  
        <!-- Basic Details -->

        <div class="mb-4">
          <h3 class="text-sm font-semibold">Basic Details</h3>
          <div class="flex space-x-4 mt-1">
            <div class="w-1/2">
              <label class="block text-gray-600 text-xs mb-1">First Name</label>
              <input v-model="profile.firstName" class="input-field text-sm" type="text" />
            </div>
            <div class="w-1/2">
              <label class="block text-gray-600 text-xs mb-1">Last Name</label>
              <input v-model="profile.lastName" class="input-field text-sm" type="text" />
            </div>
          </div>
        </div>
  
        <!-- Bio Description -->
         
        <div class="mb-4">
          <h3 class="text-sm font-semibold">Bio Description</h3>
          <textarea v-model="profile.bio" class="input-field text-sm h-20"></textarea>
          <p class="text-gray-400 text-xs text-right">{{ profile.bio.length }}/300</p>
        </div>
  
        <!-- Language Selection -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold">Language</h3>
          <select v-model="profile.language" class="input-field text-sm">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
  
        <!-- Social Media Links -->
        <div class="mb-4">
          <h3 class="text-sm font-semibold">Social Media Links</h3>
          <div v-for="(link, platform) in profile.socialLinks" :key="platform" class="flex items-center space-x-2 mt-1">
            <span class="bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-xs">{{ platform }}</span>
            <input v-model="profile.socialLinks[platform]" class="input-field text-sm flex-1" type="text" />
          </div>
        </div>
  
        <!-- Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <button class="btn-cancel text-xs px-3 py-1">Cancel</button>
          <button class="btn-save text-xs px-3 py-1">Save</button>
        </div>
      </div>
  
      <!-- Default Content for Other Menu Items -->
      <div v-else>
        <h2 class="text-xl font-semibold mb-2">{{ selectedMenu }}</h2>
        <p class="text-gray-700 text-sm">{{ menuContent }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, reactive, onMounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    selectedMenu: String
  });
  
  const profile = reactive({
    firstName: "",
    lastName: "",
    bio: "",
    language: "",
    socialLinks: {}
  });
  
  onMounted(async () => {
    try {
      const response = await axios.get('https://api.example.com/user/profile'); // Replace with your API endpoint
      Object.assign(profile, response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  });
  
  const content = {
    "Photo": "Update your profile picture here.",
    "Account Security": "Manage your passwords and security settings.",
    "Subscriptions": "View and manage your subscription details.",
    "Payment Method": "Update your payment options.",
    "Notification Preferences": "Customize how you receive notifications.",
    "API Clients": "Manage API access and authentication.",
    "Close Account": "Permanently close your account."
  };
  
  const menuContent = computed(() => content[props.selectedMenu] || "Select a menu item to view details.");
  </script>
  
  <style scoped>
  .input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #f9fafb;
    outline: none;
  }
  .input-field:focus {
    border-color: #6366f1;
  }
  
  .btn-cancel {
    background: #e5e7eb;
    color: #333;
    padding: 6px 12px;
    border-radius: 6px;
  }
  .btn-save {
    background: #6366f1;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
  }
  </style>
  