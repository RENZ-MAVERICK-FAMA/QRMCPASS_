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
  import axios from 'axios';


  export default {
  data() {
    return {
      username: '',
      password1: '',
      password2: '',
      loginError: null
    };
  },
    methods: {
      addkiosk() {
  let formData = new FormData();
  formData.append('username', this.username);
  formData.append('password1', this.password1);
  formData.append('password2', this.password2);

  console.log('Form Data:', formData);

  axios.post('https://qrmcpass.loca.lt/addkiosk', formData)
    .then(response => {
      this.username = '';
      this.password1 = '';
      this.password2 = '';
      this.$router.push('/homeSuperAdmin');
    })
    .catch(error => {
      this.loginError = error.response.data.message;
      console.error(this.loginError);
    });
}

  }
};
  </script>
