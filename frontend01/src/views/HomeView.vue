<template>
  <main class=" select-none bg-slate-100 px-[5%] sm:px-[10%] md:px-[15%] py-10" >
    <div class="grid gap-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 " >
      <div class="p-5 rounded-[10px] shadow bg-white" >
        <h1 class="text-[20px] md:text-[25px] font-extrabold text-center" >{{ motorelaPaidCount }}/{{ motorelaCount }}</h1>
        <label class="t font-extralight" >Paid Motorela Today</label>
      </div>
      <div class="p-5 rounded-[10px] shadow bg-white" >
        <h1 class="text-[20px] md:text-[25px] font-extrabold text-center" >{{ motorelaPaidCount }}/{{ motorelaCount }}</h1>
        <label class="t font-extralight" >Paid Multicab Today</label>
      </div>
      <div class="p-5 rounded-[10px] shadow bg-white" >
        <h1 class="text-[20px] md:text-[25px] font-extrabold text-center" >{{ motorelaPaidCount }}/{{ motorelaCount }}</h1>
        <label class="t font-extralight" >Delinquent Motorela Today</label>
      </div>
      <div class="p-5 rounded-[10px] shadow bg-white" >
        <h1 class="text-[20px] md:text-[25px] font-extrabold text-center" >{{ motorelaPaidCount }}/{{ motorelaCount }}</h1>
        <label class="t font-extralight" >Delinquent Multicab Today</label>
      </div>
    </div>
    <div class="bg-white p-5 shadow mt-5 rounded-[10px]" >
      <h1 class="text-[25px]" >
        WELCOME 
        <span id="operator-name" class="font-bold">
        {{ user.first_name }} {{ user.last_name }}!</span>
      </h1>
      <div class="grid  md:gap-10 md:grid-cols-2" >
        <div class="py-3" >
          <RouterLink to="/units" >
            <Button label="UNITS" severity="success" class="w-full" />
          </RouterLink>
        </div>
        <div class="py-3" >
          <RouterLink to="/addunit" >
            <Button label="ADD UNIT" severity="success" class="w-full" />
          </RouterLink>
        </div>
      </div>
    </div>
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

    axios.get('https://k1dobevofh.ap.loclx.io/user', {
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
    axios.get('https://k1dobevofh.ap.loclx.io/operator/analytics', {
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
    axios.get('https://k1dobevofh.ap.loclx.io/operator/paid_units_today', {
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
axios.get('https://k1dobevofh.ap.loclx.io/operator/delinquent_units_today', {
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
      axios.post('https://k1dobevofh.ap.loclx.io/logout')
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
