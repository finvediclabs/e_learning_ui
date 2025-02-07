<template>
  <div class="home">
    <h3>Welcome back {{ user?.name }}</h3>
  </div>
</template>

<script>
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
import { storeToRefs } from "pinia";

export default {
  name: "Home",
  setup() {
    // Access session store
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    // Access profile store
    const profileStore = useProfileStore();
    const { user } = storeToRefs(profileStore);

    return {
      user,
    };
  },
};
</script>

<style scoped>
@font-face {
  font-family: "Poppins";
  src: url("@/assets/fonts/Poppins/Poppins-ExtraBold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
}
.home {
  font-family: "Poppins";
  text-align: left;

  margin-left: 1%;
}

h3 {
  font-size: x-large;
  color: #141414;
  font-weight: 600;
}

</style>
