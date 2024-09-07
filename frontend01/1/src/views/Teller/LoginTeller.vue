<template>
  <div class="container">
    <div class="form-container">
      <h2>Log in as a Teller</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Collector Username</label>
          <input v-model="formData.username" type="text" class="form-control" id="username" placeholder="Enter username">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="formData.password" type="password" class="form-control" id="password" placeholder="Enter password">
        </div> 
        <router-link class="nav-link" id="reset" to="/reset">Forgot password?</router-link>
        <br>
        <button type="submit" class="btn btn-primary btn-block">Login</button>
      </form>
      <div v-if="loginError" class="alert alert-danger mt-3" role="alert">
        {{ loginError }}
      </div>
      <p class="register-link">Not registered? <router-link to="/addteller">Click here to register</router-link></p>
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
      axios.post('http://127.0.0.1:9000/loginTeller', this.formData)
        .then(response => {
          localStorage.setItem('access_token', response.data.access_token);
          if (localStorage.getItem('access_token')) {
            this.$router.push('/homeTeller');
          }
        })
        .catch(error => {
          this.loginError = error.response.data.message;
          console.error(this.loginError);
        });
    }
  },
  created() {
    if (localStorage.getItem('access_token')) {
      this.$emit('authenticated', { authenticated: true, show: true });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Adjust the height as needed */
}

.form-container {
  background-color: #fff; /* White background for form */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Shadow for form */
  max-width: 400px;
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
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

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
