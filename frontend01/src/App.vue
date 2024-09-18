<template>
  <div class="h-screen w-screen select-none" 
  :class="{'bg-[url(@/assets/opt2.jpg)] bg-center bg-cover bg-no-repeat': route.path == '/' || route.path == '/login' || route.path == '/loginkiosk'  , 'bg-slate-100': route.path != '/'}" >
    <nav  class="bg-white h-[80px] z-50 shadow" >
      <div class="px-[5%] flex items-center justify-between h-full">
        <router-link class="flex items-center gap-3" to="/" >
         
          <h2 class="font-bold" >QRMCPASS</h2>
        </router-link>
        
        <button id="logout" class="px-4 py-2 rounded hover:text-green-500"  v-if=authenticated @click="logout">Logout</button>
        <button id="logout" class="px-4 py-2 rounded hover:text-green-500" v-if="!authenticated" >Log In</button>
      </div>
    </nav>
    <div id="content">
      <RouterView :showHomeButton="showHomeButton" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';
import { active_sessions } from '../src/global';
const isSidebarOpen = ref(false)
const router = useRouter()
const route = useRoute();

const authenticated = ref(localStorage.getItem('access_token') !== null)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const logout = async () => {
  
    // Send a POST request to the logout endpoint
  

    // Clear local storage and update authenticated ref
    localStorage.removeItem('access_token');
    localStorage.removeItem('accountType');
    localStorage.removeItem('user_info');
    authenticated.value = false;
    router.push('/'); // Redirect to the home page
  
}

// Listen for the removeUserInfo event
window.addEventListener('removeUserInfo', () => {
  localStorage.removeItem('user_info')
})
</script>
 <!-- why does the logout here  -->
