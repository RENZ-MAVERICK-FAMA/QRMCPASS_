<template>
  <ToastProvider>
    <div class="container">
      <form @submit.prevent="addTeller" class="signup-form">

        <h3 class="signup-heading">Sign Up</h3>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="username"
            class="form-control"
            id="username"
            v-model="username"
            placeholder="Enter username"
            required />
        </div>
        <div class="row">
          <div class="col-md-6">
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
          </div>
          <div class="col-md-6">
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
          </div>
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
        <div class="row">
          <div class="col-md-6">
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
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="password2">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="password2"
                v-model="password2"
                placeholder="Confirm password"
                required />
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-signup">Submit</button>
      </form>
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

      axios.post('http://127.0.0.1:9000/addTeller', formData)
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

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.signup-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.signup-heading {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.btn-signup {
  border-radius: 25px;
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  color: #fff;
  transition: background-color 0.3s ease;
}

.btn-signup:hover {
  background-color: #0056b3;
}

.alert {
  margin-top: 15px;
}
</style>
