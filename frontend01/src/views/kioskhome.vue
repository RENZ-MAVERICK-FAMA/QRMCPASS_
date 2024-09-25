<template>
  <main  class=" select-none flex justify-center p-4" >
      <form @submit.prevent="addkiosk" class="bg-white w-[500px] mt-10 p-5 rounded-[10px] shadow">
        <h1 class="text-[25px] font-bold" >ADD KIOSK</h1>
        <hr>
        <div class="mt-3" >
          <label>Kiosk Name</label>
          <InputText v-model="username" type="text" placeholder="Enter Username" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Password</label>
          <InputText type="password" v-model="password1" id="password1" placeholder="Password" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Confirm Password</label>
          <InputText type="password" v-model="password2" id="password2" placeholder="Confirm Password" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-10 mt-3" >
          <Button type="submit" icon="pi pi-save" label="Save" severity="success" class="w-full" />
          <RouterLink to="/HomeSuperAdmin" >
            <Button type="text" icon="pi pi-times" label="Cancel" severity="secondary" class="w-full" />
          </RouterLink>
        </div>
      </form>
  </main>
</template>
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
        axios.post('https://qrmcpass.loca.lt/logout')
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
