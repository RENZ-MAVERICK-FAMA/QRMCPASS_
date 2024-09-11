<template>
  <main  class=" select-none flex justify-center p-4" >
      <form @submit.prevent="signup" class="bg-white w-[500px] mt-10 p-5 rounded-[10px] shadow">
        <h1 class="uppercase text-[25px]" >Operator Sign Up</h1>
        <AlertMessage :loginError="loginError" />
        <div class="mt-3" >
          <label>Username</label>
          <InputText type="text" v-model="email" id="email" placeholder="Enter Username" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Firstname</label>
          <InputText type="text" v-model="firstName" id="firstName" placeholder="Enter Firstname" required minlength="1" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Lastname</label>
          <InputText type="text" v-model="lastName" id="lastName" placeholder="Enter Lastname" required minlength="1" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Address</label>
          <InputText type="text" v-model="address" id="address" placeholder="Enter Address" required minlength="1" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Driver License Number</label>
          <InputText type="text" v-model="license" id="license" placeholder="Enter Driver License Number" required  unique class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Permit</label>
          <input  type="file" id="permit" @change="handleFileChange" required class="file:bg-slate-300 file:p-2 w-full file:border-none file:h-[40px] file:rounded" />
        </div>
        <div class="mt-3" >
          <label>Password</label>
          <InputText type="password" v-model="password1" id="license" placeholder="Enter Password" required minlength="7" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Confirm Password</label>
          <InputText type="password" v-model="password2" id="license" placeholder="Confirm Password" required minlength="7" class="w-full" />
        </div>
        <Button type="submit" class="mt-3 w-full" severity="success" icon="pi pi-plus" label="Submit" />
      </form>
  </main>
</template>
<script>
import axios from 'axios';
import { defineAsyncComponent } from 'vue';
export default {
  data() {
    return {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      license: '',
      permitFile: '',
      password1: '',
      password2: '',
      loginError: ''
    };
  },
  components:{
    AlertMessage: defineAsyncComponent(()=>import('@/components/errors/AlertMessage.vue'))
  },
  methods: {
    signup() {
      if (this.password1 !== this.password2) {
        this.loginError = 'Passwords do not match.';
        return;
      }
      axios.get(`http://127.0.0.1:9000/check_email/${this.email}`)
        .then(response => {
          if (response.data.exists) {
            this.loginError = 'Email already exists.';
          } else {
            let formData = new FormData();
            formData.append('email', this.email);
            formData.append('firstName', this.firstName);
            formData.append('lastName', this.lastName);
            formData.append('address', this.address);
            formData.append('license', this.license);
            formData.append('permit', this.permitFile);
            formData.append('password1', this.password1);
            formData.append('password2', this.password2);

            axios.post('http://127.0.0.1:9000/signup', formData)
              .then(response => {
                this.email = '';
                this.firstName = '';
                this.lastName = '';
                this.address = '';
                this.license = '';
                this.permitFile = '';
                this.password1 = '';
                this.password2 = '';
                this.$router.push('/login');
              })
              .catch(error => {
                this.loginError = error.response.data.message;
                console.error(this.loginError);
              });
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleFileChange(event) {
      this.permitFile = event.target.files[0];
    }
  }
};
</script>
