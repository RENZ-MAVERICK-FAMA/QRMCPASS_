<template>
  <main  class=" select-none flex justify-center p-4" >
      <form @submit.prevent="addTeller" class="bg-white w-[500px] md:mt-10 p-5 rounded-[10px] shadow">
        <h1 class="text-[25px] font-bold" >ADMIN SIGN UP</h1>
        <div class="mt-3" >
          <label>Username</label>
          <InputText type="text" v-model="username" id="username" placeholder="Enter Username" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Firstname</label>
          <InputText type="text" v-model="firstName" id="firstName" placeholder="Enter Firstname" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Lastname</label>
          <InputText type="text" v-model="lastName" id="lastName" placeholder="Enter Lastname" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Address</label>
          <InputText type="text" v-model="address" id="address" placeholder="Enter Address" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Password</label>
          <InputText type="password" v-model="password1" id="license" placeholder="Enter Password" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Confirm Password</label>
          <InputText type="password" v-model="password2" id="license" placeholder="Confirm Password" required class="w-full" />
        </div>
        <Button type="submit" class="mt-3 w-full" severity="success" icon="pi pi-plus" label="Submit" />
      </form>
  </main>
    <!-- <ToastProvider>
      <div class="container">
        <div>
      <form @submit.prevent="addTeller">

        <h3 align="center"> admin Sign Up</h3>
        <div class="form-group">
          <label for="username">username</label>
          <input
            type="username"
            class="form-control"
            id="username"
            v-model="username"
            placeholder="Enter username"
            required />
        </div>
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            type="text"
            class="form-control"
            id="firstName"
            v-model="firstName"
            placeholder="Enter first name"
            required />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            class="form-control"
            id="lastName"
            v-model="lastName"
            placeholder="Enter last name"
            required />
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            class="form-control"
            id="address"
            v-model="address"
            placeholder="Enter address"
            required />
        </div>
        <div class="form-group">
          <label for="password1">Password</label>
          <input
            type="password"
            class="form-control"
            id="password1"
            v-model="password1"
            placeholder="Enter password"
            required />
        </div>
        <div class="form-group">
          <label for="password2">Password (Confirm)</label>
          <input
            type="password"
            class="form-control"
            id="password2"
            v-model="password2"
            placeholder="Confirm password"
            required />
        </div>
        <br />
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
      </div>
    
  </ToastProvider> -->
  </template>

  <script>

import axios from 'axios';


  export default {
  data() {
    return {
      username: '',
      firstName: '',
      lastName: '',
      address: '',
      password1: '',
      password2: '',
      loginError: null
    };
  },
    methods: {
      addTeller() {
      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('firstName', this.firstName);
      formData.append('lastName', this.lastName);
      formData.append('address', this.address);
      formData.append('password1', this.password1);
      formData.append('password2', this.password2);

      axios.post('https://qrmcpass.loca.lt/addAdmin', formData)
        .then(response => {
      this.username = '';
      this.firstName = '';
      this.lastName = '';
      this.address = '';
      this.password1 = '';
      this.password2 = '';
          this.$router.push('/login');
        
        })
        .catch(error => {
          
          this.loginError = error.response.data.message;
          console.error(this.loginError);
         
        });
    }
  }
};
  </script>
