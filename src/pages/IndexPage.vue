<template></template>

<script>
import { storeToRefs } from "pinia";
import { useSessionStore } from "src/stores/session";

export default {
  name: 'IndexPage',
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);

    console.log('Session Store:', session);

    return {
      token,
      userType,
      roles: [] // Initialize roles array to store fetched roles
    };
  },
  mounted() {
    this.verifyToken(); // Ensure verifyToken is called when the component is mounted
  },
  methods: {
    async fetchRoles() {
      try {
        const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
        const getRolesURL = baseUrl + 'api/roles';
        const response = await this.$api.get(getRolesURL, {
          headers: {
            Authorization: `Bearer ${this.token}` // Adding Bearer token to the header
          }
        });
        console.log('Fetched Roles:', response.data);
        this.roles = response.data.data; // Store the fetched roles
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },
    async verifyToken() {
      console.log('User Type:', this.userType);
      console.log('Available Roles:', this.roles);

      if (this.token) {
        // Fetch roles before proceeding with the redirection
        await this.fetchRoles();

        // Redirect to home page after verification
        this.$router.push({ path: '/homeProfile' });
      } else {
        // Redirect to login if no token is present
        this.$router.push('/home');
      }
    }
  }
}
</script>
