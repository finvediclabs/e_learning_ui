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

<q-input outlined class="q-my-sm input" v-model="phoneNumber" label="Phone Number" dense lazy-rules
:rules="[val => val && val.length > 0 || 'Phone Number is required']" />

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
  <q-dialog v-model="otpDialog">
  <q-card style="min-width: 300px">
    <q-card-section>
      <div class="text-h6">Verify OTP</div>
    </q-card-section>

    <q-card-section>
  <q-input
    outlined
    v-model="enteredOtp"
    label="Enter OTP"
    dense
    :rules="[val => val && val.length === 6 || 'Enter a valid 6-digit OTP']"
  />
  <div class="text-caption text-negative q-mt-sm" v-if="countdown > 0">
    OTP expires in {{ countdownDisplay }}
  </div>
</q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn color="primary" label="Verify" @click="verifyOtp" />
    </q-card-actions>
  </q-card>
</q-dialog>
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
      countdown: 300,
    countdownDisplay: '',
    countdownInterval: null,
      confirmPassword: '',
      phoneNumber: '',
      otpDialog: false,
enteredOtp: '',
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
  let cleanedPhone = this.phoneNumber.replace(/\D/g, ""); // remove non-numeric characters

  if (cleanedPhone.length === 10) {
    cleanedPhone = "91" + cleanedPhone;
  } else if (cleanedPhone.startsWith("91") && cleanedPhone.length === 12) {
    // already correctly formatted
  } else {
    this.showMsg("Invalid phone number format", 'negative');
    return;
  }

  this.$api.post(urls.registerUrl, {
    name: this.name,
    username: this.userName,
    email: this.email,
    password: this.password,
    phoneNumber: cleanedPhone,
  }).then(response => {
    if (response.data.success || response.status === 200) {
      this.showMsg("OTP sent to your phone", 'positive');
      this.otpDialog = true;
    } else {
      this.showMsg(response.data.message, 'negative');
    }
  }).catch(error => {
    this.showMsg(error.response?.data.message || error.message, 'negative');
  });
},
verifyOtp() {
  let cleanedPhone = this.phoneNumber.replace(/\D/g, "");

  if (cleanedPhone.length === 10) {
    cleanedPhone = "91" + cleanedPhone;
  } else if (cleanedPhone.startsWith("91") && cleanedPhone.length === 12) {
    // it's good
  } else {
    this.showMsg("Invalid phone number format", 'negative');
    return;
  }

  this.$api.post(urls.verifyOtpUrl, {
    phoneNumber: cleanedPhone,
    otp: this.enteredOtp
  }).then(res => {
    this.showMsg("OTP verified. You can now login.", 'positive');
    this.otpDialog = false;
    this.$router.push('/');
  }).catch(err => {
    this.showMsg(err.response?.data || 'OTP verification failed', 'negative');
  });
},
startCountdown() {
  this.countdown = 300;
  this.updateCountdownDisplay();
  if (this.countdownInterval) clearInterval(this.countdownInterval);

  this.countdownInterval = setInterval(() => {
    if (this.countdown > 0) {
      this.countdown--;
      this.updateCountdownDisplay();
    } else {
      clearInterval(this.countdownInterval);
      this.showMsg("OTP expired. Please request a new one.", 'negative');
      this.otpDialog = false;
    }
  }, 1000);
},

updateCountdownDisplay() {
  const minutes = Math.floor(this.countdown / 60);
  const seconds = this.countdown % 60;
  this.countdownDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
  },
  watch: {
  otpDialog(val) {
    if (val) {
      this.startCountdown();
    } else {
      clearInterval(this.countdownInterval);
    }
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
