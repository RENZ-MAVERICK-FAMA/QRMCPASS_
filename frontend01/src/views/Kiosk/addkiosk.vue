<template>
   <button class="btn btn-dark"> <RouterLink class="nav-link" to="/HomeSuperAdmin"> Go Back</RouterLink> </button>
    <ToastProvider>
      <div class="container">
        <div>
      <form @submit.prevent="addkiosk">

        <h3 align="center"> Add Kiosk</h3>
        <div class="form-group">
          <label for="username">kiosk name</label>
          <input
            type="username"
            class="form-control"
            id="username"
            v-model="username"
            placeholder="Enter username"
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
      password1: '',
      password2: '',
      loginError: null
    };
  },
    methods: {
      addkiosk() {
  let formData = new FormData();
  formData.append('username', this.username);
  formData.append('password1', this.password1);
  formData.append('password2', this.password2);

  console.log('Form Data:', formData);

  axios.post('http://127.0.0.1:9000/addkiosk', formData)
    .then(response => {
      this.username = '';
      this.password1 = '';
      this.password2 = '';
      this.$router.push('/homeSuperAdmin');
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
