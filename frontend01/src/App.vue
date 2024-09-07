<template>
  <div class="wrapper">
    <!-- Navbar with burger icon -->
    <nav class="navbar navbar-light bg-light" style="z-index: 10000; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);">
      <div class="container-fluid">
        <!-- <button class="navbar-toggler" type="button" @click="toggleSidebar">
          <span class="navbar-toggler-icon"></span>
        </button> -->
        <!-- Navbar brand/logo -->
        <router-link class="navbar-brand" to="/"> <img src="\src\assets\ceedmo-logo.png" alt="" class="logo-client">QRMCPASS </router-link>
        
        <button id="logout"class="btn btn-link logout-btn" v-if=authenticated @click="logout">Logout</button>
        <button id="logout"class="btn btn-link logout-btn" v-if="!authenticated">Log In</button>

      </div>
    </nav>

    <!-- Sidebar -->
    <!-- <nav id="sidebar" v-bind:class="{ 'active': isSidebarOpen }">
      <ul class="list-unstyled components">
        <div class="sidebar-header">
          <button type="button" id="sidebarCollapse" class="btn btn-dark" @click="toggleSidebar">
            <span class=""></span>
  </button>
  
      </div>

<li><br></li>
          
          <li>
            <RouterLink to="/" v-if="!authenticated">Login</RouterLink>
          </li>
          <li>
            <RouterLink to="/loginkiosk" v-if="!authenticated">Top Up</RouterLink>
          </li>
          <li v-if="authenticated">
  
</li>


<li><br>

</li> -->

          <!-- <li v-if="!authenticated">
            <RouterLink to="/addkiosk">Add Kiosk</RouterLink>
          </li> -->
        <!-- </ul>
    </nav> -->

    <!-- Page Content -->
    <div id="content">
      <!-- Main content -->
      <div class="container-fluid">
        <RouterView :showHomeButton="showHomeButton" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';
import { active_sessions } from '../src/global';
const isSidebarOpen = ref(false)
const router = useRouter()

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

<style scoped>
/* Your scoped styles here */

 
#sidebar {
    position: fixed;
    top: 0;
    left: -250px;
    height: 100vh;
    width: 180px;
    background: #343a40;
    color: #fff;
    transition: all 0.3s;
    z-index: 9999;
  }
  
  #sidebar.active {
    left:   0;
  }
  
  #sidebar .sidebar-header {
    padding: 20px;
    background: #343a40;
  }
  
  #sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
  }
  
  #sidebar ul p {
    padding: 10px;
  }
  
  #sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
  }
  
  #sidebar ul li a:hover {
    color: #333d68;
    background: #7a7979;
  }
  
  #sidebar ul li.active > a,
  a[aria-expanded="true"] {
    color: #928c8c;
    background: #343a40;
  
  }
  
  #sidebarCollapse {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 999;
    display: block;
    color: #fff;
    background: transparent;
    border: none;
    font-size: 24px;
  }
  
  
  .burger-icon {
    display: inline-block;
    width: 30px;
    height: 3px;
    background-color: rgba(84, 84, 84, 0.65);
    position: relative;
    border: 1px solid rgba(84, 84, 84, 0.65); /* Add border */
    border-radius: 2px; /* Add border radius for rounded corners */
    z-index: 10001; /* Ensure the burger icon appears above the sidebar */
  }
  
  .burger-icon::before,
  .burger-icon::after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background-color: rgba(84, 84, 84, 0.65);
    border: 1px solid rgba(84, 84, 84, 0.65);
    position: absolute;
    transition: transform 0.3s ease;
  }
  
  .burger-icon::before {
    top: -8px;
  }
  
  .burger-icon::after {
    bottom: -8px;
  }
  #sidebarCollapse {
    position: fixed;
    top: 20px;
    left: 20px;
 
  } 
  
  /* Rotate the before and after elements to create the burger icon effect */
  #sidebarCollapse.active .burger-icon::before {
    transform: rotate(45deg);
    top: 0;
  }
  
  #sidebarCollapse.active .burger-icon::after {
    transform: rotate(-45deg);
    bottom: 0;
  }
  #sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
    color: white; /* Change text color to white */
    text-decoration: none; /* Remove underline */
  }
  
  #sidebar ul li a:hover {
    color: #333d68;
    background: #fff;
    text-decoration: none; /* Remove underline */
  }
  
  /* Center the burger icon horizontally */
  #sidebarCollapse .burger-icon {
    margin: 0 auto;
  }
  @media (max-width: 768px) {
    #sidebar {
      margin-left: -250px;
    }
    #sidebar.active {
      margin-left: 0;
    }
  }

/* Other sidebar styles */

.navbar-toggler {
  color: white;
}
.logout-btn {
  color: #000;
  text-decoration: none;
  cursor: pointer;

  background: transparent;
  border: none;
  padding: 5px;


}

.logout-btn:hover {
  color: #fff;
  background-color: green;
  padding: 5px;
  transition: ease all 0.5s;
}
img{
  height: 35px;
  margin-right: 20px;
}
#logout{
  margin-left: 1000px;
}
.navbar-brand{
 font-weight: bold;
}
</style>
 <!-- why does the logout here  -->