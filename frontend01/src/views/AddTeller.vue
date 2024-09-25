<template>
  <main class="select-none flex justify-center p-4">
    
    <div class="bg-white w-[450px] mt-10 p-5 rounded-[10px] shadow">
      <h1 class="text-[25px]" >
        WELCOME 
        <span id="operator-name" class="font-bold text-green-600">
        {{ teller.first_name }} {{ teller.last_name }}!</span>
      </h1>
      <div class="mt-4">
        <h1 class="text-[25px] font-bold">Manually TopUp</h1>
        <p class="font-light">Motorela & Multicab</p>
        <p class="font-extralight">Allows to Top Up manually.</p>
        <RouterLink class="nav-link" to="/topup">
          <Button
            label="Manually TopUp"
            class="mt-3 w-full"
            icon="pi pi-money-bill"
            severity="success"
          />
        </RouterLink>
      </div>
      <Divider />
      <div>
        <h1 class="text-[25px] font-bold">Pay Delinquencies</h1>
        <p class="font-light">Motorela & Multicab</p>
        <p class="font-extralight">Allows to pay deliquinces.</p>
        <RouterLink class="nav-link" to="/deduct">
          <Button
            label="Pay Delinquency"
            class="mt-3 w-full"
            icon="pi pi-money-bill"
            severity="success"
          />
        </RouterLink>
      </div>
      <Divider />
      <div>
        <h1 class="text-[25px] font-bold">Pay with QR</h1>
        <p class="font-light">QR Payment Scan for Motorela</p>
        <p class="font-extralight">Allows to pay via QR.</p>
        <RouterLink class="nav-link" to="/motorelascan">
          <Button
            label="Motorela Scan"
            class="mt-3 w-full"
            icon="pi pi-qrcode"
            severity="success"
          />
        </RouterLink>
        <RouterLink class="nav-link" to="/multicabscan">
          <Button
            label="Multicab Scan"
            class="mt-3 w-full"
            icon="pi pi-qrcode"
            severity="success"
          />
        </RouterLink>
      </div>
    </div>
  </main>
</template>
  <script>

import axios from 'axios';


  export default {
  data() {
    return {
      username: '',
      firstName: '',
      lastName: '',
      address: '',
      password1: '',
      password2: '',
      loginError: null
    };
  },
    methods: {
      addTeller() {
      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('firstName', this.firstName);
      formData.append('lastName', this.lastName);
      formData.append('address', this.address);
      formData.append('password1', this.password1);
      formData.append('password2', this.password2);

      axios.post('https://qrmcpass.loca.lt/addTeller', formData)
        .then(response => {
      this.username = '';
      this.firstName = '';
      this.lastName = '';
      this.address = '';
      this.password1 = '';
      this.password2 = '';
          this.$router.push('/teller  ');
        
        })
        .catch(error => {
          this.loginError = error.response.data.message;
          console.error(this.loginError);
         
        });
    }
  }
};
  </script>
