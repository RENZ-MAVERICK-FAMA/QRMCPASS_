<template>
  <main class="mt-10 p-5 flex justify-center" >
    <RouterLink to="/kioskminimum" >
      <div class="bg-green-100 size-[300px] rounded-[50%] shadow p-3 hover:bg-slate-50" >
        <div class="bg-green-200 rounded-[50%] shadow w-full  hover:animate-pulse h-full grid place-content-center" >
          <div class="text-center" >
            <i class="pi pi-money-bill text-[50px]" ></i>
            <h6 class="text-[35px] font-extrabold text-black/80" >TOP UP</h6>
          </div>
        </div>
      </div>
    </RouterLink>
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