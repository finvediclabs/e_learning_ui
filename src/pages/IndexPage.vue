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

        // Find the role that matches the userType
        const matchedRole = this.roles.find(role => role.name === this.userType);
        // console.log('Matched Role:', matchedRole);
        
        if (matchedRole) {
          // Ensure defaultPath starts with a "/"
          if (matchedRole.defaultPath == null) {
        matchedRole.defaultPath = 'library/books';
      }

          let defaultPath = '/' + matchedRole.defaultPath || '/library/books';
          // console.log('matchedRole.default_path:', matchedRole.default_path);
          // console.log('Redirecting to:', defaultPath);
          if (!defaultPath.startsWith('/')) {
            defaultPath = '/' + defaultPath; // Add leading slash if missing
          }
          this.$router.push({ path: defaultPath });
        } else {
          console.log('No matching role found, redirecting to /library/books');
          this.$router.push('/library/books'); // Default path if no role matches
        }
      } else {
        this.$router.push('/login');
      }
    }
  }
}
</script>
