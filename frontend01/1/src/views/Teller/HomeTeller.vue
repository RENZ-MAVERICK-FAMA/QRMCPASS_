<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Toll Booth Section -->
      <div class="col-md-6 mb-4">
        <h4 class="mb-3">Toll Booth</h4>
        <div class="card">
          <img :src="tollBoothImage" alt="Toll Booth">


          <div class="card-body">
            <button class="btn btn-primary btn-block mb-2"><router-link class="text-white" to="/scanmotorela">Scan Motorela</router-link></button>  
            <button class="btn btn-primary btn-block mb-2"><router-link class="text-white" to="/scanmulticab">Scan Multicab</router-link></button>
          </div>
        </div>
      </div>
      <!-- Office Section -->
      <div class="col-md-6 mb-4">
        <h4 class="mb-3">Office</h4>
        <div class="card">
          <img :src="officeImage" alt="Office">
          <div class="card-body">
            <button class="btn btn-primary btn-block mb-2"><router-link class="text-white" to="/topup">Add Balance</router-link></button> 
            <button class="btn btn-primary btn-block mb-2"><router-link class="text-white" to="/deduct">Deduct</router-link></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import tollBoothImage from './bg_tollbooth.png'
import officeImage from './bg_tolloffice.jpg'

export default {
  setup() {
    const authenticated = ref(false)
    const route = useRoute()
    const router = useRouter()
    const teller = ref({ id: null, username: '', first_name: '', last_name: '' })

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
        router.push('/login');
      }
    })

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
          router.push('/login')
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
