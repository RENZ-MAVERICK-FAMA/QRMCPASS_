
<template>

     <!-- Analytic Cards -->

     <div class="row">
      <div class="container-md">
        <div class="analytics-card">
  <div class="card">
    <div class="card-body">
      <p class="card-title">Paid Motorela Today:</p>
      <p class="card-text"><strong>{{ motorelaPaidCount }}/{{ motorelaCount }}</strong></p>
    </div>
  </div>
</div>
<div class="analytics-card">
  <div class="card">
    <div class="card-body">
      <p class="card-title">Paid Multicab Today:</p>
      <p class="card-text"><strong>{{ multicabPaidCount }} /{{ multicabCount }}</strong></p>
    </div>
  </div>
</div>
<div class="analytics-card">
  <div class="card">
    <div class="card-body">
      <p class="card-title">Delinquent Motorela Today:</p>
      <p class="card-text"><strong>{{ motoreladelCount }}/{{ motorelaCount }}</strong></p>
    </div>
  </div>
</div>
<div class="analytics-card">
  <div class="card">
    <div class="card-body">
      <p class="card-title">Delinquent Multicab Today:</p>
      <p class="card-text"><strong>{{ multicabdelCount }} /{{ multicabCount }}</strong></p>
    </div>
  </div>
</div>
  </div>
      </div>

  <div class="container">
        <div class="cont-r">
      <p class="display-5">WELCOME <span id="operator-name" class="display-6">{{ user.first_name }} {{ user.last_name }}!</span></p>
      <!-- <p class="display-5">username: <span class="display-6">{{ user.email }}</span></p> -->
      <div class="btn-option">
        <button class="btn btn-success"><RouterLink class="nav-link" to="/units">Units</RouterLink></button>
      <button class="btn btn-success"><RouterLink class="nav-link" to="/addunit">Add Unit</RouterLink></button>
    </div>


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
    const motorelaCount = ref(0)
    const multicabCount = ref(0)
    const motorelaPaidCount = ref(0)
    const multicabPaidCount = ref(0)
    const motoreladelCount = ref(0)
    const multicabdelCount = ref(0)

    // Check authentication status
    if (localStorage.getItem('access_token')) {
      authenticated.value = true
      show.value = true

    }

    watch(authenticated, (newValue) => {
  if (newValue) {
    // User is authenticated
    show.value = true;
    router.push('/home');
  } else {
    // User is not authenticated
    show.value = false;
    router.push('/login');
  }
})

    const user = ref({ id: null, email: '', first_name: '', last_name: '' })

    axios.get('http://127.0.0.1:9000/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'X-Frontend-URL': window.location.href,
        'X-Forwarded-For': window.ipAddress,
      }
    })
    .then(response => {
      // Assuming response.data contains the user details
      user.value = response.data
    })
    .catch(error => {
      console.error('Error fetching user:', error)
    })
    axios.get('http://127.0.0.1:9000/operator/analytics', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => {
      motorelaCount.value = response.data.motorelaCount
      multicabCount.value = response.data.multicabCount
    })
    .catch(error => {
      console.error('Error fetching analytics:', error)
    })
    axios.get('http://127.0.0.1:9000/operator/paid_units_today', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
})
.then(response => {
  motorelaPaidCount.value = response.data.motorelaPaidCount
  multicabPaidCount.value = response.data.multicabPaidCount
})
.catch(error => {
  console.error('Error fetching paid units count:', error)
})
axios.get('http://127.0.0.1:9000/operator/delinquent_units_today', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
})
.then(response => {
  motoreladelCount.value = response.data.motoreladelCount
  multicabdelCount.value = response.data.multicabdelCount
})
.catch(error => {
  console.error('Error fetching paid units count:', error)
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

          window.location.href = '/'; // Not needed if using router.push

        })
        .catch(error => {
          // Handle logout error
          console.error(error.response.data.message)
        })
    }

    return {
      authenticated,
      show,
      user,
      logout,
      motorelaCount,
      multicabCount,
      motorelaPaidCount,
  multicabPaidCount,
  multicabdelCount,
  motoreladelCount
    }
  }
}
</script>

<style scoped>
.container{
  gap: 30px;
  margin-left: 220px;

}
.analytics-card{
  width: 200px;
  margin: 10px;
  border-radius: 10px;
  border: none;
}
.display-5{
  font-size: 30px;
}
.display-6{
  font-size: 30px;
  color: #012e0e;
  font-style: italic;
}
#operator-name{
  text-transform: uppercase;
  font-weight: bold;
}
.btn{
  margin: 20px;
  width: 50pc;
  margin-top: 50px;
  background-color: #7ABA78;
}
.btn-option{
  display: flex;
}
.card-body{
  background-color: #198754;
  color: #fff;
  border-radius: 10px;
  border: none;
  width: 200px;
  height: 100px;
}
/* .card-body:hover{
  background-color: #012e0e;
  color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: ease all 0.5s;
} */
.cont-r{
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 20px;
  width: 900px;
  margin-top: 30px;
  background-color: #fff;
}
.container-md{
  display: flex;
  margin-left: 250px;
  margin-top: 50px;

}
.card{
  background-color: #198754;
}
/* .card:hover{
  transition: ease all 0.5s;
  background-color: #012e0e;
  color: #fff;
} */
</style>
