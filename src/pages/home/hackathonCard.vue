<template>
  <div class="attendance-box"  @click="viewAll">
    <div class="attendance-header row">
      <div class="col-4">
        <q-img :src="hackathon_vector" class="attendance-vector" alt="Hackathon Icon" />
      </div>
      <div class="col-8">
        <h3 class="attendance-title text-left">Hackathon</h3>
      </div>
    </div>
    <div class="row attendance-content">
      <div class="col-9 attendance-bar">
        <div
          class="attendance-fill"
          :class="attendanceColor"
          :style="{ width: attendancePercentage + '%' }"
        ></div>
      </div>
      <div class="col-3">
        <span>{{ attendancePercentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import hackathon_vector from 'src/assets/hackathon_vector.png';

export default {
  data() {
    return {
      attendancePercentage: 58, // Example percentage
      hackathon_vector,
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
      this.$router.push("/hackathon");
    },
  },
};
</script>

<style scoped>
.attendance-box {
  width: 95%;
  margin: auto;
  padding: 10px;
  border-radius: 20px;
  background-color: #fff;
  text-align: center;
  cursor: pointer;
}

.attendance-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.attendance-vector {
  width: 60%;
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
  justify-content: center;
}

.attendance-bar {
  width: 60%;
  height: 16px;
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
