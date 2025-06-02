<template>
 <router-link
  :to="'/hackathon'"
  style="text-decoration: none;"
>
  <div class="seminar-card">
    <img class="seminar-image" :src="seminarImage" alt="Seminar Image" />
    <div class="seminar-content">
      <h3 class="seminar-heading">Hackathon</h3>
     <p class="seminar-details">Duration & Time: {{ time }}</p>
      <p class="seminar-details">Date: {{ date }}</p>
      <p class="seminar-details">Slots: {{ slots }}</p>
    </div>
  </div>
  </router-link>
</template>

<script>
import seminarImage from 'src/assets/HackathonCard.png'; // Example image path
export default {
  name: 'HackathonDetailsCard',
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
      default: '60 Minutes, 10:00 AM'
    },
    date: {
      type: String,
      default: '2025-05-28'
    },
    slots: {
      type: String,
      default: '120/200'
    }
  },
  methods: {
    viewAll() {
    this.$router.push("/hackathonEvent");
    console.log("View All Clicked from MostPopular");
  },
    // You can add methods here if needed
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
  margin: 1rem auto;
}
.seminar-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
.seminar-card:hover {
  transform: scale(1.05); /* Enlarges by 5% */
  transition: transform 0.3s ease;
  cursor: pointer; /* Changes cursor to pointer */
}
.seminar-content {
  padding: 0.2rem;
  text-align: left;
  padding-left: 1rem;
}
.seminar-heading {
  margin: 0 0 0.2rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: #2528CB;
}
.seminar-details {
  margin: 0.2rem 0;
  color: #555;
  font-size: 0.8rem;
}
</style>
