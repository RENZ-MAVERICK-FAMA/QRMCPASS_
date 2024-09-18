<template>
  <main class=" select-none grid justify-center p-4"  >
    <form @submit.prevent="loginall" class="mt-10 p-5 bg-white shadow rounded-[20px] w-full h-full md:p-5 flex items-center" >
      <div class="" >
        <div class="flex items-center justify-center w-full mb-5" >
          <img src="\src\assets\ceedmo-logo.png" alt="" class=" w-[180px]">
        </div>
        <AlertMessage :loginError="loginError" />
        <InputGroup class="mt-3" >
            <InputText v-model="formData.username" type="text" id="username" placeholder="Username" />
            <InputGroupAddon class="bg-white" >
                <i class="pi pi-user"></i>
            </InputGroupAddon>
        </InputGroup>
        <InputGroup class="mt-3" >
            <InputText v-model="formData.password" type="password" id="password" placeholder="Password" />
            <InputGroupAddon  class="bg-white" >
                <i class="pi pi-eye"></i>
            </InputGroupAddon>
        </InputGroup>
        <Button type="submit" label="Login" icon="pi pi-sign-in" class="w-full mt-3" severity="success" />
        <RouterLink to="/reset" >
          <p class="mt-2 text-center font-light hover:text-slate-300" >Forgot Password?</p>
        </RouterLink>
      </div>
    </form>
  </main>
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
    axios.post('http://127.0.0.1:9000/loginall', this.formData)
      .then(response => {
        // Store the access token in local storage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('accountType', response.data.accountType);
        // Redirect to the home page or perform any other action
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
