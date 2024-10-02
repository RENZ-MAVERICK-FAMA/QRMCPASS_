<template>
  <div>
   
    <h1>admin login</h1>
    <div class="container">
      <div class="form-container">
      
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Admin Username</label>
            <input v-model="formData.username" type="text" class="form-control" id="username" placeholder="Enter username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="formData.password" type="password" class="form-control" id="password" placeholder="Enter password">
          </div> 
          
          <br>
          <button type="submit" class="btn btn-primary">Login</button>
         
        </form>

        <div v-if="loginError" class="alert alert-danger" role="alert">
          {{ loginError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      loginError: ''
    };
  },
  methods: {
  login() {
    axios.post('https://k1dobevofh.ap.loclx.io/loginAdmin', this.formData)
      .then(response => {
        // Store the access token in local storage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('accountType', response.data.accountType); // Use 'accountType' here
 // Store account type separately

        // Redirect to the home page or perform any other action
        if (localStorage.getItem('access_token') && localStorage.getItem('accountType') === 'admin') {
          
          this.$router.push('/homeAdmin');
          
          window.location.href = '/login'; // No need for this line
        }
      })
      .catch(error => {
        this.loginError = error.response.data.message;
        console.error(this.loginError);
      });
  }
},
  
created() {
  const isAuthenticated = localStorage.getItem('access_token') && localStorage.getItem('accountType') === 'admin';
  if (isAuthenticated) {
    this.$emit('show', true);
    this.$emit('authenticated', true);
  }
}
};
</script>
<style scoped>
/* Navbar styles */
.navbar {
  display: flex;
  justify-content: flex-start;
}


.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px; /* Adjust the height as needed */
  width: 300px;
  background-color: none;
  margin: 0;
  margin-left: 525px;
  margin-top: 50px;
  border-radius: 10%;
  /* border: 2px solid #124410; */
  background-color: #fff; /* Set the background color of your div */
  box-shadow: 0 4px 8px #363a37; /* Add a shadow effect */
}
#reset {
    color: black;
    transition: color 0.3s ease;
}

#reset:hover {
    color: rgb(3, 112, 255);
}
.alert {
  margin-top: 15px;
}
.form-group {
margin-bottom: 20px; /* Add spacing between form groups */
}
label{
  font-weight: none;
  text-transform: uppercase;
  margin-bottom: 5px;
  font-size: small;
  font-weight: bold;
  color:#124410;
}
.nav-link{
  text-transform: uppercase;
  font-size: small;
  color: #071d8b;
  text-decoration: underline;
}
.btn{
  background-color: #1f5425;
  border-color: #1f5425;
  text-transform: uppercase;
  font-size: normal;
  margin: auto;
  margin-left: 70px;
  margin-top: 25px;
}
.btn:hover{
  background-color: #1da124;
}
h1{
  text-transform: uppercase;
  font-size: large;
  text-align: center;
  margin-top: 50px;
  color: black;
}

</style>
