<template>
  <div>
    <div class="text-h5 text-weight-bolder">Reset Password</div>
    <div class="text-grey-8">Reset your password by providing your email or phone number below</div>

    <div v-if="step === 0">
      <q-input
        outlined
        class="q-my-sm"
        v-model="emailOrPhone"
        label="Email Address or Phone Number"
        dense
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Email/Phone Field Is Required']"
      />
      <q-btn color="primary" class="full-width sub-btn" padding="md" label="Next" @click="sendResetLink" />
    </div>

    <div v-if="step === 1">
      <q-input
        outlined
        class="q-my-sm"
        v-model="verificationCode"
        label="Verification Code"
        dense
        lazy-rules
        :rules="[val => val && val.length > 0 || 'Verification Code Is Required']"
      />
      <q-input
        outlined
        class="q-my-sm"
        v-model="newPassword"
        label="New Password"
        dense :type="isPwd ? 'password' : 'text'"
        lazy-rules
        :rules="[val => val && val.length > 0 || 'New Password Is Required']"
      >
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-btn color="primary" class="full-width sub-btn" padding="md" label="Reset Password" @click="resetPassword" />
    </div>

    <!-- Button to go back to the login page -->
    <q-btn
      v-if="step === 0 || step === 1"
      color="secondary"
      class="full-width sub-btn"
      padding="md"
      label="Back to Login"
      @click="goToLogin"
    />
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ResetPasswordPage',
  data() {
    return {
      step: 0, // 0: Initial, 1: Verification and Password Reset
      emailOrPhone: '', // This will hold email or phone number
      verificationCode: '',
      newPassword: '',
      isPwd: true, // For password visibility toggle
    }
  },
  methods: {
    // This method handles both email and phone number input
    async sendResetLink() {
      try {
        let emailOrPhone = this.emailOrPhone.trim();

        // Check if it's a phone number and it's 10 digits long
        if (emailOrPhone.length === 10) {
          // Try without adding country code
          const responseWithoutCountryCode = await this.checkUserExistence(emailOrPhone);

          if (responseWithoutCountryCode.data.success) {
            this.step = 1; // Show the next step if user is found
            return;
          }

          // If user is not found, try adding country code "91"
          emailOrPhone = '91' + emailOrPhone;
        }

        // Now, check with the country code
        const responseWithCountryCode = await this.checkUserExistence(emailOrPhone);

        if (responseWithCountryCode.data.success) {
          this.step = 1; // Show the next step if user is found
        } else {
          this.showErrorMessage("User not found");
        }
      } catch (error) {
        console.error('Error sending reset link:', error);
      }
    },

    async checkUserExistence(emailOrPhone) {
      const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
      const pushForgetPasswordUrl = baseUrl + 'api/auth/forgot-password';
      try {
        const response = await axios.post(pushForgetPasswordUrl, {
          emailOrPhone: emailOrPhone
        });
        return response;
      } catch (error) {
        console.error('Error checking user existence:', error);
        return { data: { success: false } }; // Return a failed response if there's an error
      }
    },

    async resetPassword() {
  try {
    const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
    const putResetPasswordUrl = baseUrl + 'api/auth/forget/reset-password';

    // Check if it's a 10-digit phone number
    let emailOrPhone = this.emailOrPhone;

    // If it's a 10-digit phone number, send it as-is (do not prepend '91')
    if (emailOrPhone.length === 10) {
      // Send the 10-digit phone number without any modification
      emailOrPhone = this.emailOrPhone;  // No need to change it for backend
    }

    // Log the data being sent
    console.log('Sending reset password request with:', {
      email: emailOrPhone,  // Pass the email or phone as-is
      code: this.verificationCode,
      newPassword: this.newPassword
    });

    // Send the request to backend with email or phone
    const response = await axios.put(putResetPasswordUrl, {
      email: emailOrPhone,  // Pass the email or phone as-is
      code: this.verificationCode,
      newPassword: this.newPassword
    });

    console.log('Reset password response:', response.data);

    if (response.data.success) {
      console.log('Password reset successfully');
      this.emailOrPhone = '';
      this.verificationCode = '';
      this.newPassword = '';
      this.step = 0; // Optionally reset step to initial
      this.goToLogin(); // Redirect to login page
    } else {
      console.error('Error response:', response.data.message);
    }
  } catch (error) {
    console.error('Error resetting password:', error);
  }
},

    goToLogin() {
      this.$emit('changePage', 'loginPage'); // Emit an event to change page
    },

    showErrorMessage(message) {
      console.error(message);
      // Optionally show a UI message to inform the user that the user was not found
    }
  }
});
</script>



<style scoped>
.sub-btn {
  margin-top: 20px;
}
</style>
