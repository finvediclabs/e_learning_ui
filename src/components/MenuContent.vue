<template>
  <!-- View Public Profile Section -->
  <div v-if="selectedMenu === 'View Profile'" class="p-4 shadow-md rounded-lg sample viewp">
                  <q-form @submit="verifyData">
              <div class="row">
              <div class="col-2 text-center q-mb-md">
                <q-avatar size="120px" class="shadow-3" :class="{ 'rounded-borders': editProfile.profileBg == 'square' }" :square="editProfile.profileBg == 'square'">
                  <q-img :src="imageUrl" class="fit" />
                </q-avatar>
                <div class="q-mt-md" v-if="!disableEdit">
                  <label for="fileInput" class="profile-label">Change Profile</label>
                  <br /><br />
                  <input id="fileInput" name="file" type="file" class="hidden-input" ref="file" @change="onChange" accept=".jpg,.png">
                </div>
              </div>
              </div>

              <!-- Main Form Grid: 3 Columns -->
              <div class="row">
              <!-- Column 1 -->
              <div class="col-3">
                <q-input label="Name" class="form-field" v-model="profile.name" :disable="disableEdit" />
                <q-input label="Email" type="email" class="form-field" v-model="profile.email" disable />
                <q-input label="Phone Number" class="form-field" v-model="profile.phoneNumber" :disable="disableEdit"
                  :rules="[ val => val && val.length > 0 || 'Phone Number is required', val => /^[0-9]+$/.test(val) || 'Phone Number must not contain letters', val => /^\d{10}$/.test(val) || 'Phone Number must be exactly 10 digits' ]" />
              </div>
              <div class="col-1"></div>
              <!-- Column 2 -->
              <div class="col-3">
                <q-input label="Date of Birth" type="date" class="form-field" v-model="profile.dob" :disable="disableEdit"
                  :rules="[ val => val && isValidDate(val) || 'Date of Birth is required', val => isValidAge(val) || 'Age must be between 18 and 70 years' ]" />
                <q-input label="Highest Qualification" class="form-field" v-model="profile.graduationDegree" :disable="disableEdit"
                  :rules="[ val => val && val.trim().length > 0 || 'Highest Qualification is required' ]" />
                <q-input label="Qualification Year" class="form-field" v-model="profile.qualificationYear" :disable="disableEdit"
                  :rules="[ val => val && /^\d+$/.test(val) || 'Qualification Year must be a number', val => isValidYear(val) || 'Qualification Year must be a valid year' ]" />
              </div>
              <div class="col-1"></div>

              <!-- Column 3 -->
              <div class="col-3">
                <q-select class="form-field" v-model="profile.role" label="Role" :options="roles" option-value="id" option-label="name" disable />
                <q-input label="Specialization" class="form-field" v-model="profile.specialization" :disable="disableEdit"
                  :rules="[ val => val && val.trim().length > 0 || 'Specialization is required', val => /^[a-zA-Z\s]+$/.test(val) || 'Specialization must contain only letters and spaces' ]" />
                <q-select label="Gender" class="form-field" v-model="profile.gender" :options="genders" option-value="value" option-label="label" :disable="disableEdit" />
              </div>
              <div class="col-1"></div>
              </div>

              <!-- Buttons -->
              <div class="button-container">
              <q-btn label="Edit" no-caps class="custom-btn edit-btn" @click="disableEdit = false" size="md" v-if="disableEdit" />
              <q-btn label="Cancel" no-caps class="custom-btn cancel-btn" @click="cancelEdit()" size="md" v-if="!disableEdit" />
              <q-btn label="Update" no-caps class="custom-btn update-btn" type="submit" :disable="loading" size="md" v-if="!disableEdit" />
              <q-btn label="Reset Password" no-caps class="custom-btn edit-btn" @click="showResetPasswordDialog" size="md" />

    <!-- Reset Password Dialog -->
    <q-dialog v-model="showResetPassword" class="custom-dialog">
      <q-card class="custom-card">
        <q-card-section>
          <div class="text-h6">Reset Password</div>
        </q-card-section>

        <q-card-section>
          <q-input class="shadow-3 q-px-md fin-br-8 q-ma-md" v-model="resetPasswordForm.oldPassword" type="password" label="Enter Old Password" />
          <q-input class="shadow-3 q-px-md fin-br-8 q-ma-md" v-model="resetPasswordForm.newPassword" type="password" label="Enter New Password" />
          <q-input class="shadow-3 q-px-md fin-br-8 q-ma-md" v-model="resetPasswordForm.confirmNewPassword" type="password" label="Confirm New Password" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="custom-button " v-close-popup />
          <q-btn flat label="Submit" class="custom-button" @click="resetPassword"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

              </div>
              </q-form>

  </div>
  <div v-else-if="selectedMenu === 'Subscriptions'" class="p-4 subscrip">
  <q-list class="row q-col-gutter-md justify-center">
    <!-- First column with empty space -->
    <div class="col-md-4 col-sm-">
  <q-item v-for="(category, index) in categories.slice(0, 5)" :key="index" class="q-mb-md">
    <q-card class="full-width q-pa-md shadow-3 rounded-borders">
      <div class="row items-center no-wrap">
        <div class="col-grow text-subtitle1 text-gray-8 font-medium"
             style="white-space: normal; word-break: break-word; flex: 1 1 auto;">
          {{ category }}
        </div>
        <q-btn
          @click="enroll(category)"
          color="primary"
          glossy
          class="q-px-sm q-py-xs rounded-borders shadow-2 hover-scale text-caption"
          href="https://finvedic.com/enroll.html"
          target="_blank"
          label="Enroll"
          style="flex: 0 0 auto;"
        />
      </div>
    </q-card>
  </q-item>
</div>


<div class="col-md-4 col-sm-">
  <q-item v-for="(category, index) in categories.slice(5, 10)" :key="index" class="q-mb-md">
    <q-card class="full-width q-pa-md shadow-3 rounded-borders">
      <div class="row items-center no-wrap">
        <div class="col-grow text-subtitle1 text-gray-8 font-medium"
             style="white-space: normal; word-break: break-word; flex: 1 1 auto;">
          {{ category }}
        </div>
        <q-btn
          @click="enroll(category)"
          color="primary"
          glossy
          class="q-px-sm q-py-xs rounded-borders shadow-2 hover-scale text-caption"
          label="Enroll"
          style="flex: 0 0 auto;"
        />
      </div>
    </q-card>
  </q-item>
</div>
<div class="col-md-4 col-sm-">
  <q-item v-for="(category, index) in categories.slice(10, 15)" :key="index" class="q-mb-md">
    <q-card class="full-width q-pa-md shadow-3 rounded-borders">
      <div class="row items-center no-wrap">
        <div class="col-grow text-subtitle1 text-gray-8 font-medium"
             style="white-space: normal; word-break: break-word; flex: 1 1 auto;">
          {{ category }}
        </div>
        <q-btn
          @click="enroll(category)"
          color="primary"
          glossy
          class="q-px-sm q-py-xs rounded-borders shadow-2 hover-scale text-caption"
          label="Enroll"
          style="flex: 0 0 auto;"
        />
      </div>
    </q-card>
  </q-item>
</div>
  </q-list>
</div>





  <!-- Default Content for Other Menu Items -->
  <div v-else>
    <h2 class="text-xl font-semibold mb-2">{{ selectedMenu }}</h2>
    <p class="text-gray-700 text-sm">{{ menuContent }}</p>
  </div>

</template>

<script>
import { computed, defineProps } from 'vue';
import FinPortlet from "src/components/Portlets/FinPortlet.vue";
import FinPortletHeader from "src/components/Portlets/FinPortletHeader.vue";
import FinPortletHeading from "src/components/Portlets/FinPortletHeading.vue";
import FinPortletItem from "src/components/Portlets/FinPortletItem.vue";
import profileImg from "src/assets/profile.png";
import { useProfileStore } from "src/stores/profile";
import { storeToRefs } from "pinia";
import { useRolesStore } from "src/stores/roles";
import axios from 'axios';

export default {
name: 'profile',
components: {
  FinPortlet,
  FinPortletHeader,
  FinPortletHeading,
  FinPortletItem,
},
props: {
selectedMenu: String
},
setup() {
  const profileStore = useProfileStore();
  const { user } = storeToRefs(profileStore);
  const { setUserData } = profileStore;
  const rolesStore = useRolesStore();
  const { roles } = storeToRefs(rolesStore);
  const props = defineProps({
  selectedMenu: String
  });
  const content = {
  "Payment Method": "Update your payment options.",
  "Close Account": "Permanently close your account."
};

const menuContent = computed(() => content[props.selectedMenu] || content["View Profile"]);
  return {
    menuContent,
    roles,
    user,
    setUserData,
  };
},
data() {
  return {
    profile: {},
    error: {},
    selectedFile: null,
    loading: false,
    disableEdit: true,
    profileData: {},
    editProfile: {
      mail: '',
      fName: '',
      lName: '',
      profile: '',
      UserType: '',
      selectedMenu: localStorage.getItem('selectedMenu') || "View Profile", // Default value
      categories: []
    },
    options: [
      'Admin',
      'Faculty',
      'Student',
    ],
    imageUrl: '',
    getUserUrl: '',
    showResetPassword: false,
    resetPasswordForm: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    genders: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female'}
    ]
  };
},
watch: {
      selectedMenu(newValue) {
        localStorage.setItem('selectedMenu', newValue);
      },
    },
    mounted() {
      const savedMenu = localStorage.getItem('selectedMenu');
      if (savedMenu) {
        this.selectedMenu = savedMenu;
      }
      this.getUserData();
  },
computed: {
  uploadDocumentLabel() {
    const fullPath = this.profile.uploadDocumentPath;
    const base64FileName = fullPath ? fullPath.split('/').pop() : '';
    try {
      const decodedFileName = atob(base64FileName);
      return decodedFileName;
    } catch (error) {
      return 'Upload Your Certificates (PDF only, max 5MB)';
    }
  }
},
async mounted() {
    this.getUserData();
    await this.fetchCategories(); // Fetch categories when component loads
  },
methods: {
  async fetchCategories() {
      try {
        const response = await this.$api.get("api/chapterCategoriess/all");
        this.categories = response.data.map(category => category.categoryName);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
  showMsg(message, type) {
    this.$q.notify({
      message: message || "Something Went Wrong!",
      type: type,
      position: 'top-right',
      actions: [
        { icon: 'close', color: 'white', handler: () => { } }
      ]
    });
  },
  previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      this.profile.picture = e.target.result;
    };
    reader.readAsDataURL(file);
  }
},
  getUserData() {
this.$api.get(`api/users/${this.user.id}`).then(response => {
  if (response.data.success) {
    var user = response.data.data;
    this.profile = {
      name: user.name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      graduationDegree: user.graduationDegree,
      qualificationYear: user.qualificationYear,
      specialization: user.specialization,
      phoneNumber: user.phoneNumber,
      uploadDocumentPath: user.uploadDocumentPath,  // Set to empty string if null or undefined
      role: this.user.roles ? this.user.roles[0] : []
    };

    if (this.profile.uploadDocumentPath) {
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const removeImagePath = baseUrl + 'fs/download/';

      // Extract the filename by removing the base URL
      const filename = this.profile.uploadDocumentPath.replace(removeImagePath, '');

      // Create a FormData object
      const formData = new FormData();
      formData.append('filename', filename);

      const ImagePath = baseUrl + 'fs/download';

      // Send POST request with FormData
      axios.post(ImagePath, formData, { responseType: 'blob' })
        .then(response => {
          // Create a URL for the image blob
          const url = window.URL.createObjectURL(new Blob([response.data]));
          this.imageUrl = url;
          console.log('Image URL:', this.imageUrl);
          console.log('Upload Document Path:', this.profile.uploadDocumentPath);
        })
        .catch(error => {
          this.showMsg(error.response?.data.message || error.message, 'negative');
        });
    } else {
      this.imageUrl = '';  // Set imageUrl to an empty string if no document path
    }
  } else {
    this.showMsg(response.data.message, 'negative');
  }
}).catch(error => {
  this.loading = false;
  this.showMsg(error.response?.data.message || error.message, 'negative');
});
},
  verifyData() {
    var errorCount = 0;
    this.profile.name ? '' : errorCount++;
    this.profile.email ? '' : errorCount++;
    this.profile.gender ? '' : errorCount++;
    this.profile.graduationDegree ? '' : errorCount++;
    this.profile.qualificationYear ? '' : errorCount++;
    this.profile.specialization ? '' : errorCount++;
    // this.profile.uploadDocumentPath ? '' : errorCount++;
    this.profile.phoneNumber ? '' : errorCount++;
    this.profile.role ? '' : errorCount++;
    if (!errorCount) {
      this.profile.file ? this.uploadImg() : this.updateProfile();
    } else {
      this.error = {
        name: "Name is required",
        email: "Email is required",
        gender: "Gender is required",
        dob: "DOB is required",
        graduationDegree: "Graduation degree is required",
        qualificationYear: "Qualification year is required",
        specialization: "Specialization is required",
        // uploadDocumentPath: "Upload document path is required",
        phoneNumber: "Phone number is required",
        role: "Role is required",
      };
    }
  },
  uploadImg() {
    if (!this.loading) {
      this.loading = true;
      let formData = new FormData();
      formData.append('file', this.profile.file);
      this.$api.post('fs/upload-file', formData).then(response => {
        this.imageUrl = response.data.uri;
        this.updateProfile();
      }).catch(error => {
        this.showMsg(error.response?.data.message || error.message, 'negative');
      });
    }
  },

  updateProfile() {
const genderValue = typeof this.profile.gender === 'object' ? this.profile.gender.value : this.profile.gender;
var user = this.user;

// If there's no new file, retain the existing photoPath
const filePathPromise = this.profile.file ? this.uploadFile(this.profile.file) : Promise.resolve(this.profile.uploadDocumentPath);

filePathPromise
  .then(filePath => {
    var request = {
      user,
      name: this.profile.name,
      email: this.profile.email,
      gender: genderValue,
      dob: this.profile.dob,
      graduationDegree: this.profile.graduationDegree,
      qualificationYear: this.profile.qualificationYear,
      specialization: this.profile.specialization,
      uploadDocumentPath: filePath,
      phoneNumber: this.profile.phoneNumber,
      photoPath: this.imageUrl || filePath, // Ensure photoPath is set correctly
      password: this.user.password,
    };

    return this.$api.put(`api/users/${this.user.id}`, request);
  })
  .then(response => {
    if (response.data.success) {
      this.cancelEdit();
      window.location.reload();
    } else {
      this.showMsg(response.data.message, 'negative');
    }
  })
  .catch(error => {
    this.loading = false;
    this.showMsg(error.response?.data.message || error.message, 'negative');
  });
},
  onChange() {
    this.profile.file = this.$refs.file.files.length ? this.$refs.file.files[0] : '';
    if (typeof this.profile.file === 'object') {
      let fileSrc = URL.createObjectURL(this.profile.file);
      this.imageUrl = fileSrc;
    }
  },
  showResetPasswordDialog() {
    this.showResetPassword = true;
  },
  resetPassword() {
    if (this.resetPasswordForm.newPassword !== this.resetPasswordForm.confirmNewPassword) {
      this.showMsg("New passwords do not match", 'negative');
      return;
    }

    this.loading = true;
    const request = {
      userId: this.user.id,
      oldPassword: this.resetPasswordForm.oldPassword,
      newPassword: this.resetPasswordForm.newPassword,
    };

    this.$api.put('api/users/reset-password', request).then(response => {
      this.loading = false;
      if (response.data.success) {
        this.showMsg("Your password is updated successfully", 'positive');
        this.showResetPassword = false;
      } else {
        this.showMsg(response.data.message, 'negative');
      }
    }).catch(error => {
      this.loading = false;
      this.showMsg(error.response?.data.message || error.message, 'negative');
    });
  },
  enroll(item) {
  console.log(`Enrolled in ${item.name}`);
  // Add your enroll logic here
  },
  async uploadFile(file) {
  if(file){
    this.loading = true;
    try {
      // Check if the file type is JPG or PNG
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG and PNG files are allowed.');
      }

      // Proceed with uploading the file if validation passes
      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const getFileUrl = baseUrl + 'fs/upload-file';

      const response = await fetch(getFileUrl, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }

      console.log(data)

      const filePath = data.uri;
      console.log('File uploaded:', filePath);
      return filePath; // Return the file path
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      this.loading = false; // Ensure loading is set to false after completion
    }

  }
},

cancelEdit() {
    this.disableEdit = true; // Assuming this disables the edit mode
  },

// Method to handle file input change
onChange(event) {
  const file = event.target.files[0];
  if (file) {
    this.profile.file = file; // Update profile.file with the new file
    let fileSrc = URL.createObjectURL(file);
    this.imageUrl = fileSrc; // Update image preview if necessary
  }
},

  validatePhoneNumber(number) {
    // Check if the number is exactly 10 digits and does not contain letters
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number) && /^[0-9]+$/.test(number);
  },
  validateForm() {
    this.error.phoneNumber = this.validatePhoneNumber(this.profile.phoneNumber) ? '' : 'Invalid phone number';
    this.error.graduationDegree = this.isValidDegree(this.profile.graduationDegree) ? '' : 'Invalid Highest Qualification';
    this.error.qualificationYear = this.isValidYear(this.profile.qualificationYear) ? '' : 'Invalid Qualification Year';
    this.error.span = this.isValidSpecialization(this.profile.specialization) ? '' : 'Invalid Specialization';

  },

  isValidDate(date) {
    return !!date;
  },
  isValidAge(date) {
const today = new Date();
const birthYear = new Date(date).getFullYear();
const currentYear = today.getFullYear();

const age = currentYear - birthYear;
return age >= 18 && age <= 70;
},
  isValidDegree(degree) {
return degree && /^[a-zA-Z\s.,'-]+$/.test(degree);
},
isValidYear(year) {
const yearNumber = parseInt(year, 10);
return yearNumber;
},
  isValidSpecialization(specialization)
  {
    return specialization && /^[a-zA-Z\s.,'-]+$/.test(specialization);
  }

},
watch: {
  user() {
    this.getUserData();
  },
  'profile.phoneNumber': function(newValue) {
    this.validateForm();
  }
},
' profile.dob': function(newValue) {
    this.validateForm();
  },
  'profile.graduationDegree': function(newValue) {
    this.validateForm();
  },
  'profile.qualificationYear': function(newValue) {
    this.validateForm();
  },
  'profile.specialization': function(newValue) {
    this.validateForm();
  },
};
</script>

<style>
.hidden-input {
opacity: 0;
overflow: hidden;
position: absolute;
width: 1px;
height: 1px;
}
.viewp
{
  padding-top: 4% !important;
}

.profile-label {
border-radius: 10px;
border: 2px solid #fff;
color: #5479F7;
font-weight: bold;
box-shadow: 0px 4px 10px rgba(84, 121, 247, 0.5);
padding: 4px 8px;
transition: all 0.3s ease-in-out;
}

.profile-label:hover {
background-color: #D3D3D3; /* Light gray */
color: #333; /* Darker text for contrast */
box-shadow: 0px 6px 15px rgba(169, 169, 169, 0.7); /* Soft gray shadow */
transform: translateY(-2px);
}


.custom-dialog .q-card {
width: 500px;
max-width: 90vw;
}

.custom-button {
transition: background-color 0.3s, color 0.3s;
}

.custom-button:hover {
background-color: #5479F7;
color: white;
}
.button-container {
display: flex;
justify-content: left;
gap: 12px; /* Adds spacing between buttons */
min-height: 70px;
}

.custom-btn {
min-width: 80px;
height: 35px;
font-size: 14px;
font-weight: bold;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
transition: all 0.3s ease-in-out;
border: none;
cursor: pointer;
}

.custom-btn:hover {
opacity: 0.9;
transform: translateY(-2px);
}

.edit-btn {
background: hsl(225, 100%, 50%);
/* filter: brightness(150%);  */
color: #fff;
transition: background 0.3s ease-in-out;
margin-left: 1%;
}

.edit-btn:hover {
background: linear-gradient(135deg, #555555, #333333); /* Dark gray gradient */
color: #ffffff; /* Light text for better contrast */
}



/* Dark Red for Cancel Button */
.cancel-btn {
background: linear-gradient(135deg, #990000, #660000);
color: #ffffff;
margin-left: 1%;
}

/* Light Green for Update Button */
.update-btn {
background: hsl(225, 100%, 50%); /* Standard blue */
filter: brightness(100%); /* Decrease brightness to reduce contrast */
color: #fff; /* Dark text for contrast */
transition: background 0.3s ease-in-out;
}

.form-field {
padding: 10px 15px;
margin-bottom: 12px;
border-radius: 8px;
}
.subscription-item {
display: flex;
justify-content: space-between;
align-items: center;
background-color: #f9f9f9;
padding: 18px;
border-radius: 8px;
margin-bottom: 12px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.subscrip
{
  padding-top: 4% !important;
}

.item-name {
font-size: 16px;
font-weight: 500;
color: #333;
}


.q-btn {
  transition: all 0.3s ease-in-out;

}

.q-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 255, 0.3);
}

</style>
