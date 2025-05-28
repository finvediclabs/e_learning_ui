<template>
  <div class="attendance-box"  @click="viewAll">
    <div class="attendance-header row items-center">
      <div class="col-4 flex flex-center">
        <q-img :src="hackathon_vector" class="attendance-vector" alt="Hackathon Icon" />
      </div>
      <div class="col-8 text-left"  style="margin-top: -4%;">
        <span class="attendance-title text-left text-h3">Hackathon</span>
        <div class="row attendance-content" style="margin-top: -10%;">
      <div class="col-10 attendance-bar">
        <div
          class="attendance-fill"
          :class="attendanceColor"
          :style="{ width: attendancePercentage + '%' }"
        ></div>
      </div>
      <div class="col-2 text-center">
        <span style="font-size: 12px;">{{ attendancePercentage }}%</span>
      </div>
    </div>
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
