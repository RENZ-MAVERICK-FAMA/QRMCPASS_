<template>
   <!-- <button class="btn btn-dark"><RouterLink class="nav-link" t0="/home">Go Back</RouterLink></button> -->
   <br>
   <button class="btn btn-warning"> <RouterLink class="nav-link" to="/home">Go Back</RouterLink> </button>

  <div class="container">

    <div>
    <!-- <p v-if="authenticated">Authenticated</p>
    <p v-else>Not Authenticated</p> -->
    <div v-if="error" class="alert alert-danger" role="alert">
  {{ error }}
  <button @click="clearError" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
  </button>
</div>  
      <div v-if="success" class="alert alert-success" role="alert">
  {{ success }}
  <button @click="clearSuccess" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div v-if="loginError" class="alert alert-danger" role="alert">
          {{ loginError }}
        </div>

    <div>

      <h1>Add Unit</h1>
      <form @submit.prevent="addunit">
        <label for="unittype">Unit Type:</label>
        <select class="form-control"v-model="unittype" id="unittype">
          <option value="motorela">Motorela</option>
          <option value="multicab">Multicab</option>
        </select><br>
        <label for="color">Color:</label><br>
        <input class="form-control"v-model="color" type="text" id="color" pattern="[a-zA-Z]*" required><br>
        <label for="unitinfo">Body Information:</label><br>
        <input class="form-control" v-model="unitinfo" type="text" id="unitinfo" pattern="[a-zA-Z0-9]*"  required >
        <br>
        <div class="form-group">
          <label for="picture">Motorela Picture</label><br>
          <input class="form-control" type="file" id="picture" name="picture" @change="handleFileChange" required />

        </div>
        <br>
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
        <br>
        <div class="form-group">
          <label for="password2">Password (Confirm)</label>
          <input
            type="password"
            class="form-control"
            id="password2"
            v-model="password2"
            placeholder="Confirm password"
            required />
        </div><br>
        <div class="btn-option">
          <button id="add-unit"type="submit" class="btn btn-success">Add Unit</button>
        </div>
       
      </form>
    </div>
  </div>
  </div>
  
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      unittype: '',
      color: '',
      unitinfo: '',
      password1: '',
      password2: '',
      authenticated: true,
      success: '',
      error: '',
      picture: null // Initialize picture as null
    };
  },
  methods: {
    clearError() {
      this.error = '';
    },
    clearSuccess() {
      this.success = '';
    },
    handleFileChange(event) {
      if (event.target.files.length > 0) {
        this.picture = event.target.files[0];
      }
    },
    addunit() {
      this.clearError();
      this.clearSuccess();

      let formData = new FormData();
      formData.append('color', this.color);
      formData.append('unitinfo', this.unitinfo);
      formData.append('unittype', this.unittype);
      formData.append('picture', this.picture);
      formData.append('password1', this.password1);
      formData.append('password2', this.password2);

      axios
        .post('http://127.0.0.1:9000/addunit', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        .then(response => {
          this.color = '';
          this.unitinfo = '';
          this.unittype = '';
          this.picture = null; // Reset picture to null
          this.password1 = '';
          this.password2 = '';
          this.success = 'Unit Added Successfully!';
          document.querySelector('.add-btn').removeAttribute('disabled');
        })
        .catch(error => {
          console.error('An error occurred:', error);
          if (error.response && error.response.data && error.response.data.error) {
            this.error = error.response.data.error;
          } else {
            this.error = 'An error occurred. Please try again.';
          }
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
h1{
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 40px;
}
  label{
 /* margin-bottom: 10px; */
  text-transform: uppercase;
  font-size: small;
  font-weight: bold;
}
#add-unit{
  width: 27pc;
  margin-left: 10px;
}
</style>