<template>
  <div class="attendance-box"  @click="viewAll">
    <div class="attendance-header row items-center">
      <div class="col-4 flex flex-center">
        <q-img :src="assignment_vector" class="attendance-vector" alt="Lab Usage Icon" />
      </div>
      <div class="col-8 text-left" style="margin-top: -4%;">
        <span class="attendance-title text-left text-h3">Lab Usage</span>
        <div class="row attendance-content" style="margin-top: -10%;">
      <div class="col-10 attendance-bar">
        <div
          class="attendance-fill"
          :class="attendanceColor"
          :style="{ width: attendancePercentage + '%' }"
        ></div>
      </div>
      <div class="col-2">
        <span style="font-size: 12px;">{{ attendancePercentage }}%</span>
      </div>
    </div>
      </div>
    </div>

  </div>
</template>

<script>
import assignment_vector from 'src/assets/lab_vector.png';
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import { useProfileStore } from "src/stores/profile";
export default {
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const profileStore = useProfileStore();
    const currentUserName = profileStore.user.username || '';
    console.log("Current User Name:", currentUserName);

    return {
      userType,
      currentUserName,
    }
  },
  data() {
    return {
      attendancePercentage: 60, // Example percentage
      assignment_vector,
    };
  },
  computed: {
    attendanceColor() {
      if (this.attendancePercentage < 30) {
        return "blue-fill";
      } else if (this.attendancePercentage < 80) {
        return "orange-fill";
      } else {
        return "red-fill";
      }
    },
  },
  mounted() {
  this.fetchDeletedLabVms();
   if (this.userType === 'SaasUser') {
    this.attendancePercentage = 0;
  }
},
  methods: {
    viewAll() {
      this.$router.push("/labs");
    },
    async fetchDeletedLabVms() {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const apiUrl = baseUrl + 'api/labVms/deleted';
    const response = await this.$api.get(apiUrl);
    const vms = response.data.data || [];

    const currentUser = this.currentUserName;
    const userVms = vms.filter(vm => vm.userName === currentUser);

    console.log(`Deleted Lab VMs for ${currentUser}:`, userVms);

    const totalActiveTime = userVms.reduce((sum, vm) => sum + (vm.activeTime || 0), 0);
    console.log('Total Active Time of Deleted VMs (in minutes):', totalActiveTime);

    const totalActiveTimeInHours = totalActiveTime / 60;
    console.log(`Total Active Time in Hours: ${totalActiveTimeInHours}`);

    if (this.userType === 'Guest') {
      this.attendancePercentage = 60;
      console.log(`Attendance Percentage for Guest: ${this.attendancePercentage}%`);
    } else {
      let attendancePercentage = Math.round((totalActiveTimeInHours / 200) * 100);
      if (attendancePercentage > 100) {
        attendancePercentage = 100;
      }
      this.attendancePercentage = attendancePercentage;
      console.log(`Final Attendance Percentage: ${attendancePercentage}%`);
    }
  } catch (error) {
    console.error('Error fetching deleted Lab VMs:', error);
  }
},
  },
};
</script>

<style scoped>
.attendance-box {
  width: 100%;
  margin: auto;
  /* padding: 10px; */
  border-radius: 20px;
  background-color: #fff;
  text-align: center;
  cursor: pointer;

}

.attendance-header {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 10px; */
  /* border: 2px solid red; */
}

.attendance-vector {
  width: 80%;
  border-radius: 2px;
  height: auto;
  margin-right: 8px;
}

.attendance-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.attendance-content {
  display: flex;
  align-items: center;
}


.attendance-bar {
  width: 80%;
  height: 8px;
  background-color: #D9D9D9;
  border-radius: 10px;
  overflow: hidden;
}
.attendance-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.red-fill {
  background-color: red;
}

.orange-fill {
  background-color: orange;
}

.blue-fill {
  background-color: #0255C4;
}
</style>
