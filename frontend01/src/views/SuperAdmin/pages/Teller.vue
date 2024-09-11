<template>
  <main class="p-5 md:px-[10%]" >
    <div class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px]" >
      <RouterLink to="/HomeSuperAdmin" >
          <div class="flex gap-5 h-[40px] items-center hover:text-slate-300" >
            <i class="pi pi-arrow-left" ></i>
            <span>Go Back</span>
          </div>
      </RouterLink>
      <DataTable showGridlines :value="tellers"  paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" class="mt-3" >
        <template #header >
          <div class="flex items-center justify-between" >
            <span>ALL TELLERS</span>
            <Button @click="showModal = true" label="ADD TELLER" icon="pi pi-plus" severity="success" />
          </div>
        </template>
        <template #empty>
          <div class="flex justify-center" >
            <small class="font-extralight capitalize" >no data found. </small>
          </div>
        </template>
        <Column header="username" field="id" />
        <Column header="Firstname" field="amount" />
        <Column header="Lastname" field="date" />
        <Column header="Address" field="branch" />
      </DataTable>
    </div>
  </main>
  <Dialog v-model:visible="showModal" header="ADD TELLER" modal class=" w-full md:w-[600px]" >
    <form @submit.prevent="addTeller" >
      <div class="mt-3" >
          <label>Username</label>
          <InputText type="text" v-model="username" id="username" placeholder="Enter Username" required class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Firstname</label>
          <InputText type="text" v-model="firstName" id="firstName" placeholder="Enter Firstname" required minlength="1" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Lastname</label>
          <InputText type="text" v-model="lastName" id="lastName" placeholder="Enter Lastname" required minlength="1" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Address</label>
          <InputText type="text" v-model="address" id="address" placeholder="Enter Address" required minlength="1" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Password</label>
          <InputText type="password" v-model="password1" id="password1" placeholder="Enter Password" required minlength="7" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Confirm Password</label>
          <InputText type="password" v-model="password2" id="password2" placeholder="Confirm Password" required minlength="7" class="w-full" />
        </div>
        <Button type="submit" class="mt-3 w-full" severity="success" icon="pi pi-plus" label="Submit" />
    </form>
  </Dialog>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tellers: [],
      showModal: false,
      username: '',
      firstName: '',
      lastName: '',
      address: '',
      password1: '',
      password2: '',
      loginError: null,
    };
  },
  mounted() {
    this.fetchTellers();
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

      axios.post('http://127.0.0.1:9000/addTeller', formData)
        .then(response => {
      this.username = '';
      this.firstName = '';
      this.lastName = '';
      this.address = '';
      this.password1 = '';
      this.password2 = '';
      
          this.$router.push('/teller');
          window.location.href = '/teller';
                this.showModal = false;
        
        
        })
        .catch(error => {
          this.loginError = error.response.data.message;
          console.error(this.loginError);
         
        });
      },
    async fetchTellers() {
      try {
        const response = await axios.get('http://localhost:9000/tellers');
        this.tellers = response.data.teller;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
