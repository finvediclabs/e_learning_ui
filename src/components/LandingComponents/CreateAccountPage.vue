<template>
  <div>
    <div class="text-h5 text-weight-bolder create">Create Account</div>
    <!-- <account-log-in />
    <div class="full-width text-center q-py-sm">OR</div> -->
    <div class="">
      <div class="">
        <q-form @submit="onSubmit">

          <q-input outlined class="q-my-sm input" v-model="name" label="Name" dense lazy-rules
            :rules="[val => val && val.length > 0 || 'Name is required']" />

          <q-input outlined class="q-my-sm input" v-model="userName" label="User Name" dense lazy-rules
            :rules="[val => val && val.length > 0 || 'User Name is required']" />

          <q-input outlined class="q-my-sm input" v-model="email" label="Email Address" dense lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Email is required',
              val => /@finvedic\.com$|@gmail\.com$/.test(val) || 'Email must end with @finvedic.com or @gmail.com'
            ]" />

          <q-input v-model="password" class="q-my-sm input" outlined label="Password" dense :type="isPwd ? 'password' : 'text'"
            lazy-rules :rules="[
              val => val && val.length > 0 || 'Password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters long',
              val => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
              val => /[0-9]/.test(val) || 'Password must contain at least one number'
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <q-input v-model="confirmPassword" class="q-my-sm input" outlined label="Confirm Password" dense
            :type="isCrmPwd ? 'password' : 'text'" lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Confirm Password is required',
              val => password === val || 'Passwords do not match'
            ]">
            <template v-slot:append>
              <q-icon :name="isCrmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isCrmPwd = !isCrmPwd" />
            </template>
          </q-input>

          <q-btn color="primary" class="full-width sub-btn text-body1 text-weight-medium sign-up" padding="md" label="Sign up" style="background-color: #4E5BF8 !important; color: #ffffff;"
            type="submit" />

        </q-form>
      </div>
      <div class="q-my-lg text-body2 already">
        Already have an account?
        <q-btn outline label="Log In" dense class="q-px-lg q-mx-md sub-btn-outline login-btn " @click="changePage('loginPage')" />
      </div>
    </div>
  </div>
</template>

<script>
import AccountLogIn from "./AccountLogIn.vue";
import { urls } from "./Urls";

export default {
  name: 'create-account-page',
  components: {
    AccountLogIn
  },
  data() {
    return {
      isPwd: true,
      isCrmPwd: true,
      name: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    showMsg(message, type) {
      this.$q.notify({
        message: message || "Something Went Wrong!",
        type: type,
        position: 'top-right',
        actions: [
          { icon: 'close', color: 'white', handler: () => {} }
        ]
      });
    },
    changePage(page) {
      this.$emit('changePage', page);
    },
    onSubmit() {
      this.$api.post(urls.registerUrl, {
        name: this.name,
        username: this.userName,
        email: this.email,
        password: this.password,
      }).then(response => {
        if (response.data.success) {
          this.showMsg(response.data.data, 'positive');
          this.showMsg("Please Login With Your credentials", 'positive');
        } else {
          this.showMsg(response.data.message, 'negative');
        }
        this.$router.push('/');
      }).catch(error => {
        this.showMsg(error.response?.data.message || error.message, 'negative');
      })
    }
  }
}
</script>
<style>
@media screen and (max-width: 576px) {
  
  .create {
    margin-bottom: 5px;
  }

  .input .q-field__control {
    border-radius: 12px; 
    padding: 0 12px; 
    box-shadow: 0 4px 2px -2px rgba(0, 0, 0, 0.2); 
    overflow: hidden; 
  }

  .sign-up {
    border-radius: 12px; 
    padding: 10px 12px !important; 
    background: #4E5BF8 !important;
    margin-top: 10px;
  }

  .login-btn {
    border-radius: 12px; 
    padding: 0 12px; 
    border: none !important;
  }

  .q-field__bottom{
    margin: 5px 0px;
  } 
  .login-btn:before {
    border: none;
  }
  .already{
    text-align: center;
    font-size:medium;
    color: #737373;
    font-weight: 500;
  }
  .login-btn {
  margin: 0 !important;
  padding: 0 !important;
  color: #0176FE;

}
}
</style>
