<template>

  <div class="attendance-box" @click="viewAll">
    <div class="attendance-header row items-center">
      <div class="col-4 flex flex-center">
        <q-img :src="assignment_vector" class="attendance-vector" alt="Assignment Icon" />
      </div>
      <div class="col-8 text-left" style="margin-top: -4%;">
        <span class="attendance-title text-left text-h3">Assignment</span>
        <div class="row attendance-content" style="margin-top: -10%;">
      <div class="col-10 attendance-bar">
        <div
          class="attendance-fill"
          :class="attendanceColor"
          :style="{ width: attendancePercentage + '%' }"
        ></div>
      </div>
      <div class="col-2" style="font-size: 12px;">
        <span>{{ attendancePercentage }}%</span>
      </div>
    </div>
      </div>
    </div>

  </div>
</template>
<script>
import assignment_vector from 'src/assets/assignment.png';
import { useSessionStore } from "src/stores/session";
import { storeToRefs } from "pinia";
import { useProfileStore } from "src/stores/profile";

export default {
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const profileStore = useProfileStore();
    const currentUserId = profileStore.user.id || '';
    console.log("Current User Id:", currentUserId);

    return {
      userType,
      currentUserId,
    };
  },
  data() {
    return {
      attendancePercentage: 0, // Initial attendance percentage
      assignment_vector,
      reportData: [], // To store fetched report data
    };
  },
  computed: {
    attendanceColor() {
      if (this.attendancePercentage < 30) {
        return "red-fill";
      } else if (this.attendancePercentage < 60) {
        return "orange-fill";
      } else {
        return "blue-fill";
      }
    },
  },
  methods: {
    viewAll() {
      this.$router.push("/assignment");
    },
    async fetchReportData() {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const apiUrl = baseUrl + 'api/enrollmentsAssignments/with-assignments?studentId=' + this.currentUserId;
        const response = await this.$api.get(apiUrl);
        console.log("Fetched report data:", response.data);

        // Check if user is not a Student, set attendance to 60%
       if (this.userType !== 'Student' && this.userType !== 'SaasUser') {
  this.attendancePercentage = 60;
  return; // Exit the method since we don't need to process the report data
}

        // Assuming the response is an array with at least one object
        const data = response.data[0];
        if (data) {
          const totalAssignments = data.totalAssignments;
          const totalStudentAssignments = data.totalStudentAssignments;

          // Calculate attendance percentage dynamically
          if (totalAssignments > 0) {
    this.attendancePercentage = Math.round((totalStudentAssignments / totalAssignments) * 100);
  }
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    },
  },
  mounted() {
    this.fetchReportData();
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
