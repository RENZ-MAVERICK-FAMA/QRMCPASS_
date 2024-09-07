<template>
  <div class="container">
    <form @submit.prevent="signup" class="signup-form">
      <div v-if="loginError" class="alert alert-danger" role="alert">
        {{ loginError }}
      </div>
      <h3 class="signup-heading">Sign Up as a Operator</h3>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter email" required />
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" class="form-control" id="firstName" v-model="firstName" placeholder="Enter first name" required minlength="1" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" class="form-control" id="lastName" v-model="lastName" placeholder="Enter last name" required minlength="1" />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="address">Address</label>
        <input type="text" class="form-control" id="address" v-model="address" placeholder="Enter address" required />
      </div>
      <div class="form-group">
        <label for="license">License Number</label>
        <input type="text" class="form-control" id="license" v-model="license" name="license" placeholder="Enter license number" required unique />
      </div>
      <div class="form-group">
        <label for="permit">Permit</label><br>
        <input type="file" id="permit" @change="handleFileChange" required />
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="password1">Password</label>
            <input type="password" class="form-control" id="password1" v-model="password1" placeholder="Enter password" required minlength="7" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="password2">Confirm Password</label>
            <input type="password" class="form-control" id="password2" v-model="password2" placeholder="Confirm password" required minlength="7" />
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-signup">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

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
