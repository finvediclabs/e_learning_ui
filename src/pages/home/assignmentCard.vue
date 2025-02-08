<template>
  <div class="attendance-box">
    <div class="attendance-header row">
      <div class="col-4">
        <q-img :src="assignment_vector" class="attendance-vector" />
        </div>
      <div class="col-4">
        <h3 class="attendance-title">Assignment</h3>
     </div>
     <div class="col-4"></div>
    </div>
    <div class="row attendance-content">
      <div class="col-9 attendance-bar">
        <div class="attendance-fill" :style="{ width: attendancePercentage + '%' }"></div>
      </div>
    <div class="col-3">
      <span>{{ attendancePercentage }}%</span>
    </div>
    </div>

  </div>
</template>

<script>
import assignment_vector from 'src/assets/assignment_vector.png';
export default {
  components: {
    assignment_vector,
  },
  data() {
    return {
      attendancePercentage: 59, // Example percentage
      assignment_vector: assignment_vector,
    };
  },
};
</script>

<style scoped>
.attendance-box {
  width: 80%;
  margin-right: auto;
  margin-left: auto;
  padding: 10px;
  /* border: 1px solid #ccc; */
  border-radius: 20px;
  background-color: #fff;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  text-align: center;
}

.attendance-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.attendance-vector {
  width:60%;
  height: 60%;
  margin-right: 8px;
}

.attendance-title {
  font-size: 18px;
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
  background-color: #0255C4;
  transition: width 0.3s ease;
}
</style>
