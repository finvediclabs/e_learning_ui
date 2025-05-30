<template>
<div class="row" style="display: flex; width: 100%;">
  <!-- Sidebar (col-2) -->
  <div class="col-2" style="flex: 2;background-color: #ffff;height: 100vh;">
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

  <!-- Main Content (col-10) -->
  <div class="col-10" style="flex: 10;">
    <div class="top-nav row">
      <button v-for="item in menuItems" :key="item.name"
              @click="selectedMenu = item.name"
              class="menu-button"
              :class="{ 'active': selectedMenu === item.name }"
              style="margin-left: 20px;">
        {{ item.name }}
      </button>
    </div>
    <div class="row" style="width: 100%; display: flex;">
  <div class="content-area" style="width: 100%;">
    <MenuContent :selectedMenu="selectedMenu" />
  </div>
</div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MenuContent from 'src/components/MenuContent.vue';

const user = ref({
  name: '',
  email: '',
  profileImage: 'https://via.placeholder.com/150',
  role: 'Basic Member'
});

const menuItems = ref([
  { name: "View Profile" },
  { name: "Subscriptions" },
  // { name: "Payment Method" },
  // { name: "Close Account" },
]);

const selectedMenu = ref(menuItems.value[0].name);

const fetchUserData = async () => {
  try {
    const response = await axios.get(`/api/users/${user.value.id}`);
    if (response.data.success) {
      const data = response.data.data;
      let imageUrl = '';

      if (data.uploadDocumentPath) {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const removeImagePath = baseUrl + 'fs/download/';
        const filename = data.uploadDocumentPath.replace(removeImagePath, '');

        const formData = new FormData();
        formData.append('filename', filename);
        const imagePath = baseUrl + 'fs/download';

        try {
          const imgResponse = await axios.post(imagePath, formData, { responseType: 'blob' });
          imageUrl = window.URL.createObjectURL(new Blob([imgResponse.data]));
        } catch (imgError) {
          console.error("Failed to fetch user image:", imgError);
        }
      }

      user.value = {
        name: data.name,
        email: data.email,
        profileImage: imageUrl || 'https://via.placeholder.com/150',
        role: data.roles ? data.roles[0] : 'Basic Member'
      };
    } else {
      console.error("Failed to fetch user data:", response.data.message);
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

onMounted(fetchUserData);
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list-item {
  width: 16rem;
  width: 100%;
}

.list-link {
  display: block;
  width: 100%;
  border: none;
  padding: 14px 18px;
  text-align: left;
  /* background: linear-gradient(to right, #f9fafb, #eef1f5); */
  background: none;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  /* border: none; */
  border-radius: 6px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  outline: none;
  position: relative;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
}

.list-link:hover, .list-link.active {
  /* background: linear-gradient(to right, #e2e8f0, #cbd5e1); */
  background: #e7f0ff;
  color:  #4e5bf8;
  /* color: #1a202c; */
  font-weight: 500;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list-link:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.fixed {
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 14px 24px;
  background: linear-gradient(to right, #ffffff, #f8fafc);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1050;
  transition: all 0.3s ease-in-out;
}

.top-nav:hover {
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}


.menu-button {
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

.main-content {
  margin-left: 16rem;
}

@media screen and (max-width: 768px) {
  .col-2 {
    display: none;
  }
}

</style>
