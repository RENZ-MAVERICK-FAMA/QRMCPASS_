<template>
  <main class="p-5 md:px-[10%]" >
    <div class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px]" >
      <RouterLink to="/HomeSuperAdmin" >
          <div class="flex gap-5 h-[40px] items-center hover:text-slate-300" >
            <i class="pi pi-arrow-left" ></i>
            <span>Go Back</span>
          </div>
      </RouterLink> 
      
      <DataTable showGridlines :value="filteredTeller" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" class="mt-3">
        <template #header >
          <div class="flex items-center justify-between" >
            <span>ALL TELLERS</span>
            <Button @click="showModal = true" label="ADD TELLER" icon="pi pi-plus" severity="success" />
          </div>
          <div>
        <!-- <input type="text" v-model="searchTerm" placeholder="Search..."> -->
        <InputText v-model:modelValue="searchTerm" placeholder="Search..." class="w-full mt-4"/>
      </div>
        </template>
        <template #empty>
          <div class="flex justify-center" >
            <small class="font-extralight capitalize" >no data found. </small>
          </div>
        </template>
        <Column header="username" field="username" />
        <Column header="Firstname" field="first_name" />
        <Column header="Lastname" field="last_name" />
        <Column header="Address" field="address1" />
        <Column header="Action">
    <template #body="{ data }">
      <!-- <button @click="editAdmin(data)" class="btn btn-primary">Edit</button> -->
      <Button @click="editAdmin(data)" severity="success" label="Edit" icon="pi pi-pencil"/>
    </template>
  </Column>
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
  <Dialog v-model:visible="showEditModal" header="Update Teller" modal class=" w-full md:w-[600px]" >
      <div class="modal-content">
    <span class="close" @click="closeModal">&times;</span>
    <h2>Edit Admin</h2>
    <form @submit.prevent="updateTeller">
      <!-- Username -->
      <div class="mt-3">
        <label>Username</label>
        <InputText v-model="editedTeller.username" type="text" id="editUsername" required class="w-full" />
      </div>
      <!-- First Name -->
      <div class="mt-3">
        <label>First Name</label>
        <InputText v-model="editedTeller.firstName" type="text" id="editFirstname" required class="w-full" />
      </div>
      <!-- Last Name -->
      <div class="mt-3">
        <label>Last Name</label>
        <InputText v-model="editedTeller.lastName" type="text" id="editLastname" required class="w-full" />
      </div>
      <!-- Address -->
      <div class="mt-3">
        <label>Address</label>
        <InputText v-model="editedTeller.address" type="text" id="editAddress" required class="w-full" />
      </div>
      <!-- Password -->
      <div class="mt-3">
        <label>Password</label>
        <InputText v-model="editedTeller.password" type="password" id="editPassword" required class="w-full" />
      </div>
      <br />
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</Dialog>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      tellers: [],
      showModal: false,
      showEditModal: false,
      username: '',
      firstName: '',
      lastName: '',
      address: '',
      searchTerm: '',
      password1: '',
      password2: '',
      loginError: null,
      editedTeller: {
        id: null,
        username: '',
        firstName: '',
        lastName: '',
        address: '',
        password: ''
      }
    };
  },
  mounted() {
    this.fetchTellers();
  },
  computed: {
    filteredTeller() {
      if (!this.searchTerm) {
        return this.tellers; // If no search term, return all units
      }

      // Convert search term to lowercase for case-insensitive search
      const searchTermLower = this.searchTerm.toLowerCase();

      // Filter units based on search term
      return this.tellers.filter(tellers => {
        return (
          tellers.username.toLowerCase().includes(searchTermLower) || // Filter by unit info
          tellers.first_name.toLowerCase().includes(searchTermLower) || // Filter by unit type
          tellers.last_name.toLowerCase().includes(searchTermLower) || // Filter by unit type
          tellers.address1.toLowerCase().includes(searchTermLower) 
        );
      });
    }
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
        const response = await axios.get('https://qrmcpass.loca.lt/tellers');
        this.tellers = response.data.teller;
      } catch (error) {
        console.error(error);
      }
    },
    editAdmin(admin) {
      this.editedTeller = {
        id: admin.id,
        username: admin.username,
        firstName: admin.first_name,
        lastName: admin.last_name,
        address: admin.address1,
        password: admin.password1
      };
      this.showEditModal = true;
    },
    closeModal() {
      this.showEditModal = false;
    },
    updateTeller() {
  const { id, username, firstName, lastName, address, password } = this.editedTeller;
  const updatedData = { username, firstName, lastName, address, password };

  axios.put(`https://qrmcpass.loca.lt/updateTeller/${id}`, updatedData)
    .then(response => {
      // Update the array locally if needed
      const index = this.tellers.findIndex(teller => teller.id === id);
      if (index !== -1) {
        this.tellers[index] = { id, username, first_name: firstName, last_name: lastName, address1: address };
      }

      // Close the modal
      this.showEditModal = false;
      
      // Optionally, reset the editedTeller object
      this.editedTeller = {
        id: null,
        username: '',
        firstName: '',
        lastName: '',
        address: '',
        password: ''
      };
      
      console.log('Teller updated successfully!');
    })
    .catch(error => {
      console.error(error);
    });
}

    },
  };
</script>
