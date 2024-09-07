<template>
  <div>
    <div class="container">
      <div class="form-container">
        <h2>Welcome Back!</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input v-model="formData.email" type="email" class="form-control" id="email" placeholder="Enter email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="formData.password" type="password" class="form-control" id="password" placeholder="Enter password">
          </div> 
          <router-link class="forgot-password" to="/reset">Forgot password?</router-link>
          <button type="submit" class="btn btn-primary btn-block">Login</button>
          <p class="register-link">Not registered? <router-link to="/signup">Click here to register</router-link></p>
        </form>

        <div v-if="loginError" class="alert alert-danger mt-3" role="alert">
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
        email: '',
        password: ''
      },
      loginError: ''
    };
  },
  methods: {
    login() {
      axios.post('http://127.0.0.1:9000/login', this.formData)
        .then(response => {
          localStorage.setItem('access_token', response.data.access_token);
          if (localStorage.getItem('access_token')) {
            this.$router.push('/home');
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
      this.$emit('show', true);
      this.$emit('authenticated', true);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

.forgot-password {
  color: #000;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #036eff;
}

.alert {
  margin-top: 15px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
