<template>
  <div class=" h-auto p-5 grid place-content-center mt-5 md:mt-10" >
      <div class="bg-white shadow rounded-[20px] p-10 grid grid-rows-[100px,1fr] grid-cols-1 md:grid-rows-1 md:grid-cols-2 md:w-[800px]" >
        <div class="" >
          <h1 class=" text-[25px] md:text-[30px] font-medium  text-center md:text-left " >Welcome sa</h1>
          <h2 class="text-[35px] md:text-[40px] font-bold  text-center md:text-left "> QRMCPASS</h2>
          <p class="hidden md:block font-light" >Maayong pag-abot sa QRMCPASS, ang imong tiwala nga solusyon alang sa pagdumala sa kalidad ug katalagman sa imong mga proyekto.</p><br/>
          <p class="hidden md:block font-light" >Pinaagi sa QRMCPASS, makapapalong ka sa imong mga proseso sa pagdumala sa proyekto, makailhan sa mga potensyal nga katalagman, ug makasiguro nga ang mga pamatasan sa kalidad gipatuman.</p><br/>
          <p class="hidden md:block font-light" >Usbagon ang among mga gibug-atan ug kuhaon ang kumander sa imong proyekto.</p><br/>
        </div>
        <div class=" md:p-5 h-full">
          <form @submit.prevent="loginall" class=" rounded-[20px] w-full h-full md:p-5 flex items-center" >
            <div class="" >
              <div class="flex items-center justify-center w-full mb-5" >
                <img src="\src\assets\ceedmo-logo.png" alt="" class=" hidden md:block w-[180px]">
              </div>
              <AlertMessage :loginError="loginError" />
              <InputGroup class="mt-3" >
                  <InputText v-model="formData.username" id="username"  type="text" placeholder="Username" />
                  <InputGroupAddon class="bg-white" >
                      <i class="pi pi-user"></i>
                  </InputGroupAddon>
              </InputGroup>
              <InputGroup class="mt-3" >
                  <InputText v-model="formData.password" id="password" type="password" placeholder="Password" />
                  <InputGroupAddon  class="bg-white" >
                      <i class="pi pi-eye"></i>
                  </InputGroupAddon>
              </InputGroup>
              <Button type="submit" label="Login" icon="pi pi-sign-in" class="w-full mt-3" severity="success" />
              
            </div>
          </form>
        </div>
      </div>
  </div>
</template>
<script>
import axios from 'axios';
import { defineAsyncComponent } from 'vue';

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      loginError: ''
    };
  },
  components:{
    AlertMessage: defineAsyncComponent(()=>import('@/components/errors/AlertMessage.vue'))
  },
  methods: {
    loginall() {
      const currentUrl = window.location.href;
    const clientIp = window.ipAddress;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'X-Frontend-URL': currentUrl,
    'X-Client-IP': clientIp  // Assuming 'window.ipAddress' is the client's IP address
  };
    axios.post('https://y2mifxhqo2.loclx.io/loginall', this.formData, { headers })
      .then(response => {
        // Store the access token in local storage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('accountType', response.data.accountType);
        
        if (localStorage.getItem('access_token')) {
  switch (localStorage.getItem('accountType')) {
    case 'operator':
      this.$router.push('/home');
      window.location.href = '/home';
      break;
    case 'admin':
      this.$router.push('/homeAdmin');
      window.location.href = '/homeAdmin';
      break;
    case 'teller':
      this.$router.push('/homeTeller');
      window.location.href = '/homeTeller';
      break;
    case 'unit':
      this.$router.push('/homeunit');
      window.location.href = '/homeunit';
      break;
      case 'SuperAdmin':
      this.$router.push('/HomeSuperAdmin');
      window.location.href = '/HomeSuperAdmin';
      break;
      case 'kiosk':
      this.$router.push('/kioskminimum');
      window.location.href = '/kioskminimum';
      break;
    default:
      console.error('Invalid accountType');
  }
}
      })
      .catch(error => {
        this.loginError = error.response.data.message;
        console.error(this.loginError);
      });
  }
},
  
created() {
  const isAuthenticated = localStorage.getItem('access_token') && localStorage.getItem('accountType') === 'operator';
  if (isAuthenticated) {
    this.$emit('show', true);
    this.$emit('authenticated', true);
  }
}
};
</script>
