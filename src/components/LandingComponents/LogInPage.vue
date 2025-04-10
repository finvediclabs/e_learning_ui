<template>
  <div>
    <div class="text-h5 text-weight-bolder start">Login and start learning</div>
    <!-- <account-log-in />
    <div class="full-width text-center q-py-sm">OR</div> -->
    <div class="">
      <div class="">
        <q-form @submit="onSubmit">
          <q-input
  outlined
  class="q-my-sm"
  v-model="email"
  label="Email Address or Phone Number"
  dense
  lazy-rules
  :rules="[val => val && val.length > 0 || 'Email or phone number is required']"
/>

          <q-input v-model="password" outlined class="q-my-sm input" label="Password" dense :type="isPwd ? 'password' : 'text'"
            lazy-rules :rules="[val => val && val.length > 0 || 'Password is required']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <div class="row justify-between q-mb-sm items-center">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <a @click="changePage('resetPasswordPage')" class="cursor-pointer fin-text-blue">Forget password</a>
          </div>
          <q-btn no-caps class="full-width sub-btn text-body1 text-weight-medium sign-up" padding="md" label="Login" type="submit" style="background-color: #4E5BF8 !important; color: #ffffff;"
            :disable="loading">
            <q-spinner-ios color="white" class="q-pl-sm" v-if="loading" />
          </q-btn>
        </q-form>
      </div>

    </div>
    <div class="q-my-md already">
      Need an account?
      <q-btn outline label="Sign Up" dense class="q-px-lg q-mx-md sub-btn-outline login-btn" @click="changePage('createPage')" />
    </div>
  </div>
</template>
<script>
import AccountLogIn from "./AccountLogIn.vue";
import { urls } from "./Urls"
import { storeToRefs } from "pinia";
import { useSessionStore } from "src/stores/session";
import { useProfileStore } from "src/stores/profile";
export default {
  name: 'login-page',
  setup() {
    const session = useSessionStore();
    const { token, userType } = storeToRefs(session);
    const { setSessionToken, setUserType } = session;
    const profileStore  = useProfileStore();
    const { setUserData } = profileStore;
    return {
      setSessionToken,
      setUserType,
      token,
      userType,
      setUserData
    }
  },
  components: {
    AccountLogIn
  },
  data() {
    return {
      isPwd: true,
      rememberMe: false,
      email: "",
      password: "",
      loading: false,
    }
  },
  mounted() {
    if (this.token) {
      this.$router.push({ path: '/' });
    }
  },
  watch: {
    token() {
      if (this.token) {
        this.$router.push({ path: '/' });
      }
    },
    userType() {
      if (this.token) {
        this.$router.push({ path: '/' });
      }
    }
  },
  methods: {
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => { } }
        ]
      });
    },
    changePage(page) {
      this.$emit('changePage', page);
    },
    onSubmit() {
  if (!this.loading) {
    this.loading = true;
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const url = baseUrl + 'api/auth/signin';

    // Clean up input: remove +91 and spaces
    const cleanedInput = this.email.trim().replace(/^(\+91|0)/, '').replace(/\s+/g, '');

    this.$api.post(url, {
      usernameOrEmail: cleanedInput,
      password: this.password,
    }).then(response => {
      this.loading = false;
      sessionStorage.setItem('accessToken', response.data.accessToken);
      this.setUserData(response.data.user);
      this.setSessionToken(response.data.accessToken);

      const user = response.data.user;
      const roleName = user.roles?.length ? user.roles[0].name : 'Student';
      sessionStorage.setItem('userType', roleName);
      this.setUserType(roleName);

    }).catch(error => {
      this.loading = false;
      let errorMessage = error.response?.data.message || error.message;
      if (errorMessage.includes('properties of undefined')) {
        errorMessage = "You are not authorized to login";
      }
      this.showMsg(errorMessage, 'negative');
    });
  }
}
  }
}
</script>
<style>
@media screen and (max-width: 576px) {
  .q-input{
    padding-bottom: 10px !important;
  }
  .start{
    margin-bottom: 10px !important;
  }
}
</style>
./Urls
