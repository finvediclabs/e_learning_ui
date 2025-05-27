<template>
  <a
  href="https://skilltest.finvedic.in/"
  target="_blank"
  rel="noopener noreferrer"
  class="attendance-box"
  style="display: block; text-decoration: none;"
>
  <div class="attendance-header row">
    <div class="col-4">
      <q-img :src="attendance_vector" class="attendance-vector" />
    </div>
    <div class="col-8 text-left">
      <span class="attendance-title text-h3">Assessment</span>
    </div>
  </div>
  <div class="row attendance-content">
    <div class="col-10 attendance-bar">
      <div
        class="attendance-fill"
        :class="attendanceColor"
        :style="{ width: attendancePercentage + '%' }"
      ></div>
    </div>
    <div class="col-2">
      <span>{{ attendancePercentage }}%</span>
    </div>
  </div>
</a>

</template>

<script>
import attendance_vector from 'src/assets/attendance_vector.png';

export default {
  data() {
    return {
      attendancePercentage: 80, // Example percentage
      attendance_vector,
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
  margin-bottom: 10px;
  /* border: 2px solid red; */
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
  width: 70%;
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
