<template>
  <div class="seminar-card">
    <img class="seminar-image" :src="seminarImage" alt="Seminar Image" />
    <div class="seminar-content">
      <h3 class="seminar-heading">Webinar</h3>
      <p class="seminar-details">Time: {{ time }}</p>
      <p class="seminar-details">Date: {{ date }}</p>
    </div>
  </div>
</template>

<script>
import seminarImage from 'src/assets/WebinarCard.png'; // Example image path
export default {
  name: 'WebinarDetailsCard',
  data() {
    return {
     seminarImage: seminarImage // Default image
    };
  },
  props: {
    imageSrc: {
      type: String,
      default: 'https://via.placeholder.com/300x180?text=Seminar'
    },
    time: {
      type: String,
      default: '10:00 AM'
    },
    date: {
      type: String,
      default: '2025-05-28'
    }
  }
};
</script>

<style scoped>
.seminar-card {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  background: #fff;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: auto;
}
.seminar-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
.seminar-content {
  padding: 0.2rem;
  text-align: left;
  padding-left: 1rem;
}
.seminar-heading {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: #2528CB;
}
.seminar-details {
  margin: 0.2rem 0;
  color: #555;
  font-size: 1rem;
}
</style>
