<template>
  <main class="select-none flex justify-center p-4">
    <form @submit.prevent="addkiosk" class="bg-white w-[500px] mt-10 p-5 rounded-[10px] shadow">
      <h1 class="text-[25px] font-bold">ADD KIOSK</h1>
      <hr />
      <div class="mt-3">
        <label>Kiosk Name</label>
        <InputText v-model="username" type="text" placeholder="Enter Username" required class="w-full" />
      </div>
      <div class="mt-3">
        <label>Password</label>
        <InputText type="password" v-model="password1" id="password1" placeholder="Password" class="w-full" />
      </div>
      <div class="mt-3">
        <label>Confirm Password</label>
        <InputText type="password" v-model="password2" id="password2" placeholder="Confirm Password" class="w-full" />
      </div>
      <div class="grid grid-cols-2 gap-10 mt-3">
        <!-- Save Button that triggers the modal -->
        <Button type="button" icon="pi pi-save" label="Save" severity="success" class="w-full" @click="showConfirmModal = true" />
        <RouterLink to="/HomeSuperAdmin">
          <Button type="text" icon="pi pi-times" label="Cancel" severity="secondary" class="w-full" />
        </RouterLink>
      </div>
    </form>

    <!-- Transaction Confirmation Modal -->
    <Dialog header="Confirm Transaction" v-model:visible="showConfirmModal">
      <p>Please enter your transaction password to confirm:</p>
      <div class="mt-4">
        <InputText v-model="transactionPassword" type="password" placeholder="Enter Transaction Password" class="w-full" />
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>
      <div class="flex justify-end mt-4">
        <Button label="Cancel" class="p-button-text" @click="showConfirmModal = false" />
        <Button label="Confirm" class="p-button-danger" @click="validateTransactionPassword" />
      </div>
    </Dialog>
  </main>
</template>


<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  data() {
    return {
      username: '',
      password1: '',
      password2: '',
      loginError: null,
      transactionPassword: '',
      errorMessage: '',
      showConfirmModal: false, // The modal visibility state
    };
  },
  setup() {
    const superadmin = ref({
      id: null,
      username: '',
      first_name: '',
      last_name: '',
    });

    axios
      .get('https://qrmcpass.loca.lt/Superadmin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        superadmin.value = response.data;
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });

    return { superadmin };
  },
  methods: {
    async validateTransactionPassword() {
      if (!this.superadmin.value.id) {
        this.errorMessage = 'Superadmin ID is missing. Please try again.';
        return;
      }

      if (!this.transactionPassword) {
        this.errorMessage = 'Please enter your transaction password.';
        return;
      }

      try {
        const response = await axios.post('https://qrmcpass.loca.lt/api/transaction-password', {
          superadmin_id: this.superadmin.value.id,
          transaction_password: this.transactionPassword,
        });

        if (response.data.success) {
          this.errorMessage = '';
          this.showConfirmModal = false; // Close the modal after validation success
          console.log('Validation successful. Proceeding with account creation...');
          this.addkiosk(); // Proceed with adding the kiosk
        } else {
          this.errorMessage = response.data.message || 'Invalid transaction password.';
        }
      } catch (error) {
        this.errorMessage = 'Failed to validate transaction password. Please try again.';
        console.error('Error validating transaction password:', error);
      }
    },

    addkiosk() {
      // Password match check
      if (this.password1 !== this.password2) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('password1', this.password1);
      formData.append('password2', this.password2);

      console.log('Form Data:', formData);

      axios
        .post('https://qrmcpass.loca.lt/addkiosk', formData)
        .then((response) => {
          this.username = '';
          this.password1 = '';
          this.password2 = '';
          this.$router.push('/homeSuperAdmin');
        })
        .catch((error) => {
          this.loginError = error.response.data.message;
          console.error(this.loginError);
        });
    },
  },
};
</script>