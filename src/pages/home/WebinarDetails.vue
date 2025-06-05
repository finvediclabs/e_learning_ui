<template>
   <router-link
  :to="'/groupDiscussion'"
  style="text-decoration: none;"
>
  <div class="seminar-card">
    <img class="seminar-image" :src="webiNarImage" alt="Seminar Image" />
    <div class="seminar-content">
      <h3 class="seminar-heading">Group Discussions</h3>
      <p class="seminar-details">Duration & Time: {{ time }}</p>
      <p class="seminar-details">Date: {{ date }}</p>
      <p class="seminar-details">Slots: {{ slots }}</p>
    </div>
  </div>
  </router-link>
</template>

<script>
import webiNarImage from 'src/assets/WebinarCard.png'; // Example image path
export default {
  name: 'WebinarDetailsCard',
  data() {
    return {
     webiNarImage: webiNarImage // Default image
    };
  },
  props: {

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
      default: '10/20'
    }
  },

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
.seminar-card:hover {
  transform: scale(1.05); /* Enlarges by 5% */
  transition: transform 0.3s ease;
  cursor: pointer; /* Changes cursor to pointer */
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
