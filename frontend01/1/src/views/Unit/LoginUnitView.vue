<template>
  <div class="login-container">
    <div class="form-container">
      <h2>Log in as a Unit</h2>
      <form @submit.prevent="loginunit">
        <div class="form-group">
          <label for="unit">Unit</label>
          <input v-model="formData.unit" type="text" class="form-control" id="unit" placeholder="Enter Unit">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="formData.password" type="password" class="form-control" id="password" placeholder="Enter password">
        </div>
        <div class="form-group">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="rememberMe">
            <label class="form-check-label" for="rememberMe">
              Remember Me
            </label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Login</button>
      </form>

      <div class="mt-3">
        <router-link class="forgot-password" to="/reset">Forgot password?</router-link>
      </div>

      <div v-if="loginError" class="alert alert-danger mt-3" role="alert">
        {{ loginError }}
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
        unit: '',
        password: ''
      },
      loginError: ''
    };
  },
  methods: {
    loginunit() {
      axios.post('http://127.0.0.1:9000/loginunit', this.formData)
        .then(response => {
          localStorage.setItem('access_token', response.data.access_token);
          if (localStorage.getItem('access_token')) {
            this.$router.push('/homeunit');
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
      this.$emit('authenticated', true);
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa; /* Light gray background */
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

.form-check {
  margin-top: 15px;
}

.forgot-password {
  color: #000;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #036eff; /* Blue color on hover */
}

.alert {
  margin-top: 15px;
}
</style>
