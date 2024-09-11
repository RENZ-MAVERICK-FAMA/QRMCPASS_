<template>
  <main class="p-5 md:px-[10%]" >
    <div class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px]" >
      <RouterLink to="/HomeSuperAdmin" >
          <div class="flex gap-5 h-[40px] items-center hover:text-slate-300" >
            <i class="pi pi-arrow-left" ></i>
            <span>Go Back</span>
          </div>
      </RouterLink>
      <DataTable showGridlines :value="users"  paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" class="mt-3" >
        <template #header >
          <div class="flex items-center justify-between" >
            <span>ALL OPERATORS</span>
            <Button @click="showModal = true" label="ADD OPERATOR" icon="pi pi-plus" severity="success" />
          </div>
        </template>
        <template #empty>
          <div class="flex justify-center" >
            <small class="font-extralight capitalize" >no data found. </small>
          </div>
        </template>
        <Column header="ID" field="id" />
        <Column header="Firstname" field="first_name" />
        <Column header="Lastname" field="last_name" />
        <Column header="Address" field="address" />
      </DataTable>
    </div>
  </main>
  <Dialog v-model:visible="showModal" header="ADD OPERATOR" modal class=" w-full md:w-[600px]" >
    <form @submit.prevent="signup" >
      <AlertMessage :loginError="loginError" />
      <div class="mt-3" >
          <label>Username</label>
          <InputText type="text" v-model="email" id="email" placeholder="Enter Username" required class="w-full" />
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
          <label>Driver License Number</label>
          <InputText type="text" v-model="license" id="license" placeholder="Enter Driver License Number" required  unique class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Permit</label>
          <input  type="file" id="permit" @change="handleFileChange" required class="file:bg-slate-300 file:p-2 w-full file:border-none file:h-[40px] file:rounded" />
        </div>
        <div class="mt-3" >
          <label>Password</label>
          <InputText type="password" v-model="password1" id="license" placeholder="Enter Password" required minlength="7" class="w-full" />
        </div>
        <div class="mt-3" >
          <label>Confirm Password</label>
          <InputText type="password" v-model="password2" id="license" placeholder="Confirm Password" required minlength="7" class="w-full" />
        </div>
        <Button type="submit" class="mt-3 w-full" severity="success" icon="pi pi-plus" label="Submit" />
    </form>
  </Dialog>
</template>
<script>
import axios from 'axios';
import { defineAsyncComponent } from 'vue';
export default {
  data() {
    return {
      users: [],
      showModal: false,
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      license: '',
      permitFile: '',
      password1: '',
      password2: '',
      loginError: '',
    };
  },
  mounted() {
    this.fetchUsers();
  },
  components:{
    AlertMessage: defineAsyncComponent(()=>import('@/components/errors/AlertMessage.vue'))
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:9000/users');
        this.users = response.data.users; // Ensure to access the 'users' key from the response
      } catch (error) {
        console.error(error);
      }
    },signup() {
      if (this.password1 !== this.password2) {
        this.loginError = 'Passwords do not match.';
        return;
      }
      axios.get(`http://127.0.0.1:9000/check_email/${this.email}`)
        .then(response => {
          if (response.data.exists) {
            this.loginError = 'Email already exists.';
          } else {
            let formData = new FormData();
            formData.append('email', this.email);
            formData.append('firstName', this.firstName);
            formData.append('lastName', this.lastName);
            formData.append('address', this.address);
            formData.append('license', this.license);
            formData.append('permit', this.permitFile);
            formData.append('password1', this.password1);
            formData.append('password2', this.password2);

            axios.post('http://127.0.0.1:9000/signup', formData)
              .then(response => {
                this.email = '';
                this.firstName = '';
                this.lastName = '';
                this.address = '';
                this.license = '';
                this.permitFile = '';
                this.password1 = '';
                this.password2 = '';
                this.$router.push('/user');
                window.location.href = '/user';
                this.showModal = false;
              })
              .catch(error => {
                this.loginError = error.response.data.message;
                console.error(this.loginError);
              });
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleFileChange(event) {
      this.permitFile = event.target.files[0];
    }
  },
};
</script>