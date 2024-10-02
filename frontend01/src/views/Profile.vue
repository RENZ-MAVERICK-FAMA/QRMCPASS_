<template>
  <div class="container">
    <div>
      <!-- <p v-if="authenticated">Authenticated</p>
      <p v-else>Not Authenticated</p>
      <p v-if="show">show</p>
      <p v-else>Not show</p> -->
      
      <div v-if="editable">
         <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="user.email"
              placeholder="Enter email"
              required />
          </div>
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              class="form-control"
              id="firstName"
              v-model="user.first_name"
              placeholder="Enter first name"
              required minlength="1" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              class="form-control"
              id="lastName"
              v-model="user.last_name"
              placeholder="Enter last name"
              required minlength="1" />
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input
              type="text"
              class="form-control"
              id="address"
              v-model="user.address"
              placeholder="Enter address"
              required />
          </div>
          <div class="form-group">
            <label for="license">License Number</label>
            <input type="text" class="form-control" id="license" v-model="user.license" name="license" placeholder="Enter license number" required unique />
          </div>
          <div class="form-group">
            <label for="permit">Permit</label><br>
            <input type="file" id="permit" @change="handleFileChange" required />
          </div>   
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="user.password"
              placeholder="Enter new password"
              required minlength="7" />
          </div>
          <br />
          <button @click="updateUser">Update</button>
      </div>
      
      <div v-else>
  
  <p>Name: <span>{{ user.first_name }} {{ user.last_name }}</span></p>
  <p>Email: <span class="email">{{ user.email }}</span></p>
  <p>Address: <span>{{ user.address }}</span></p>
  <p>License: <span>{{ user.license }}</span></p>
  <p>Permit:<img :src="user.permit" alt="Permit" style="width: 220px; height: 220px;"></p>
  
  <br>
  <button @click="editUser">Edit</button>
</div>
    </div>
  </div>
   
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
  export default {
    setup() {
      const authenticated = ref(false)
      const show = ref(false)
      const editable = ref(false)
  
      const route = useRoute()
      const router = useRouter()
  
      // Check authentication status
      if (localStorage.getItem('access_token')) {
        authenticated.value = true
        show.value = true
      }
  
      watch(authenticated, (newValue) => {
        if (newValue) {
          // User is authenticated
          show.value = true
          router.push('/home')
        } else {
          // User is not authenticated
          show.value = false
          router.push('/login')
        }
      })
  
      const user = ref({ id: null, email: '', first_name: '', last_name: '', address: '', license: '', password: '', permit: '' })
  
      axios.get('https://mvothocqom.ap.loclx.io/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(response => {
          // Assuming response.data contains the user details
          user.value = response.data
        })
        .catch(error => {
          console.error('Error fetching user:', error)
        })
  
      const updateUser = () => {
        axios.put('https://mvothocqom.ap.loclx.io/updateuser', user.value, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
          .then(response => {
            // Handle successful update
            console.log(response.data.message)
            editable.value = false
          })
          .catch(error => {
            // Handle update error
            console.error(error.response.data.message)
          })
      }
  
      const editUser = () => {
        editable.value = true
      }
  
      const logout = () => {
        axios.post('https://mvothocqom.ap.loclx.io/logout')
          .then(response => {
            // Handle successful logout
            console.log(response.data.message)
            // Remove access token from local storage
            localStorage.removeItem('access_token')
            // Redirect to the login page
            router.push('/login')
          })
          .catch(error => {
            // Handle logout error
            console.error(error.response.data.message)
          })
      }
  
      const handleFileChange = (event) => {
        const file = event.target.files[0]
        user.value.permit = file
      }
  
      return {
        authenticated,
        show,
        editable,
        user,
        updateUser,
        editUser,
        logout,
        handleFileChange
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any custom styles for the form here */
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
  text-transform: uppercase;
  font-size: small;
  font-weight: bold;
}
p{
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: 15px;
  font-weight: bold;
  
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
  margin-top: 10px;
} 
button:hover{
  background-color: #04791e;
}
img{
  margin-left: 20px;
}
.email{
  text-transform: lowercase;
  font-style: italic;
}
span{
  margin-left: 5px;
}
  </style>
  
  
