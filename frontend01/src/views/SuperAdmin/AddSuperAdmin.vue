<template>
    <ToastProvider>
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
    
  </ToastProvider>
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

      axios.post('http://127.0.0.1:9000/addSuperAdmin', formData)
        .then(response => {
      this.username = '';
      this.firstName = '';
      this.lastName = '';
      this.address = '';
      this.password1 = '';
      this.password2 = '';
          this.$router.push('/');
        
        })
        .catch(error => {
          this.loginError = error.response.data.message;
          console.error(this.loginError);
         
        });
    }
  }
};
  </script>

<style scoped>
.container{
  width: 500px;
  margin-top: 50px;
  background-color: white; /* White background */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* Gray shadow */
  padding: 20px; /* Add padding for spacing */
  border-radius: 5%;
}
label{
  margin-bottom: 10px;
  margin-top: 10px;
  text-transform: uppercase;
  font-size: small;
  font-weight: bold;
}
h3{
  text-transform: uppercase;
  text-align: center;
}
button{
  background-color: #4CAF50; /* Green background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 10px 35px; /* Padding */
  text-align: center; /* Center text */
  text-decoration: none; /* Remove underline */
  display: inline-block; /* Make the button a block element */
  font-size: 16px; /* Font size */
  border-radius: 20px; /* Rounded corners */
  cursor: pointer; /* Add cursor pointer */
  transition: background-color 0.3s ease;
  margin: auto;
  margin-top: 10px;
}
button:hover{
  background-color: #2BA842;
}
</style>
