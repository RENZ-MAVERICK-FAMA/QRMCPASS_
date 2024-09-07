
<template>

  <div class="container-fluid">
    <div id="top-card"class="card">
        <div class="card-body">
          <h5 class="card-title">Manual TopUp</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">Motorela & Multicab</h6>
          <p class="card-text">Allows to Top Up manually.</p>
          <button class="btn btn-success"><RouterLink class="nav-link" to="/topup">Manual Topup</RouterLink></button> 
        </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card">
        <div class="card-body">
          <h5 class="card-title">Pay Delinquencies</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">Motorela & Multicab</h6>
          <p class="card-text">Allows to pay deliquinces.</p>
          <button class="btn btn-success"><RouterLink class="nav-link" to="/deduct">Pay Delinquency</RouterLink></button> 
        </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card">
        <div class="card-body">
          <h5 class="card-title">Pay with QR</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">QR Payment Scan for Motorela</h6>
          <p class="card-text">Allows to pay via QR.</p>
          <button class="btn"><RouterLink class="nav-link" to="/motorelascan">Motorela Scan</RouterLink></button>
          <button class="btn"><RouterLink class="nav-link" to="/multicabscan">Multicab Scan</RouterLink></button>
        </div>
    </div>
  </div>
  
  
</template>
<!-- RouterView -->
<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
 setup() {
   const authenticated = ref(false)
 
 
   const route = useRoute()
   const router = useRouter()

   // Check authentication status
   if (localStorage.getItem('access_token')) {
     authenticated.value = true
 
   
   }

   watch(authenticated, (newValue) => {
 if (newValue) {
   // User is authenticated

   router.push('/homeTeller');
 } else {
   // User is not authenticated
   
   router.push('/loginTeller');
 }
})
  
const teller = ref({ id: null, username: '', first_name: '', last_name: '' })

axios.get('http://127.0.0.1:9000/Teller', {
headers: {
 Authorization: `Bearer ${localStorage.getItem('access_token')}`
}
})
.then(response => {
// Assuming response.data contains the user details
teller.value = response.data
})
.catch(error => {
console.error('Error fetching user:', error)
})

   const logout = () => {
     axios.post('http://127.0.0.1:9000/logout')
       .then(response => {
         // Handle successful logout
         console.log(response.data.message)
         // Remove access token from local storage
         localStorage.removeItem('access_token')
         // Redirect to the login page
         router.push('/loginTeller')
         
         // window.location.href = '/'; // Not needed if using router.push
         
       })
       .catch(error => {
         // Handle logout error
         console.error(error.response.data.message)
       })
   }

   return {
     authenticated,
     logout
   }
 }
}
</script>

<style scoped>
.card{
width: 500px;
height: 1px80;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
transition: ease all 0.5s;
margin-top: 10px;
margin-left: 400px;
text-align: center;
}
.card:hover{
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
transition: ease all 0.5s;
}
.btn{
  background-color:#015a1b;
  color: #fff;
  border: none;
  text-align: center;
  margin-left: 20px;
  border-radius: 5px;
  width: 320px;
  text-transform: uppercase;
  margin: 2px;
}
.btn:hover{
  background-color: #fff;
  color: #015a1b;
  /* padding: 10px; */
  transition: ease all 0.5s;
  border: 1px solid #015a1b;
  font-weight: bolder;
}
#top-card{
  margin-top: 50px;
}
</style>