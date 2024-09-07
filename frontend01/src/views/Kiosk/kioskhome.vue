
<template>
    <div class="container">
      <div>
 
       
    </div>
    
    <div class="btn-option">
      <!-- <button><RouterLink class="nav-link" to="/kiosktopup">Top up</RouterLink></button> -->
        <br> 
        <button><RouterLink class="nav-link" to="/kioskminimum">Top up</RouterLink></button>
        <hr>         
       
        <hr>  
      
  
    </div>
        
  
    </div>
    
  </template>
  RouterView
  <script>
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
  export default {
    setup() {
      const authenticated = ref(false)
      const show  = ref(false)
    
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
      show.value = true;
      router.push('/kioskhome');
    } else {
      // User is not authenticated
      show.value = false;
      router.push('/login');
    }
  })
     
     
      const logout = () => {
        axios.post('http://127.0.0.1:9000/logout')
          .then(response => {
            // Handle successful logout
            console.log(response.data.message)
            // Remove access token from local storage
            localStorage.removeItem('access_token')
            // Redirect to the login page
            router.push('/login')
            
            // window.location.href = '/'; // Not needed if using router.push
            
          })
          .catch(error => {
            // Handle logout error
            console.error(error.response.data.message)
          })
      }
  
      return {
        authenticated,
        show,
        logout
      }
    }
  }
  </script>
  <style scoped>
  .container{
    width: 500px;
    margin-top: 100px;
    background-color: white; /* White background */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* Gray shadow */
    padding: 20px; /* Add padding for spacing */
    border-radius: 5%;
  }
  .operator-name{
    text-transform: uppercase;
    margin-top: 20px;
    font-weight: bold;
    color: black;
    margin-left: 10px;
  }
  .greet{
    text-transform: capitalize;
    font-weight: bold;
    font-size: large;
    color: green;
  }
  .operator-username{
    text-transform: lowercase;
    font-weight: bold;
  }
  .operator-email{
    font-style: italic;
    margin-left: 10px;
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
    margin-top: 25px;
  }
  button:hover{
    background-color: #2BA842;
  }
  
  .btn-option{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>