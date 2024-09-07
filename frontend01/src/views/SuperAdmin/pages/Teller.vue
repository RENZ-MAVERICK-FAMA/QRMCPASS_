<template>
  <br>
  <button class="btn btn-warning"> <RouterLink class="nav-link" to="/HomeSuperAdmin"> Go Back</RouterLink> </button>
  <div class="container-sm">
    <h1 class="display-1">All Tellers</h1>
    <button @click="showModal = true" class="add-operator-btn">Add Teller</button>
    <div>
        <input type="text" v-model="searchTerm" placeholder="Search...">
      </div>
    <table class="tellers-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="teller in filteredTeller" :key="teller.id">
          <td>{{ teller.username }}</td>
          <td>{{ teller.first_name }}</td>
          <td>{{ teller.last_name }}</td>
          <td>{{ teller.address1 }}</td>
          
        <td>  <button @click="editTeller(teller)" class="add-operator-btn">Edit</button></td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModal" class="modal">
      <!-- Modal content here -->
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <form @submit.prevent="addTeller">
          <div class="form-group">
          <label for="username">username</label>
          <input
            type="username"
            class="form-control"
            id="username"
            v-model="username"
            placeholder="Enter username"
            required />
        </div>
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            type="text"
            class="form-control"
            id="firstName"
            v-model="firstName"
            placeholder="Enter first name"
            required />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            class="form-control"
            id="lastName"
            v-model="lastName"
            placeholder="Enter last name"
            required />
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            class="form-control"
            id="address"
            v-model="address"
            placeholder="Enter address"
            required />
        </div>
        <div class="form-group">
          <label for="password1">Password</label>
          <input
            type="password"
            class="form-control"
            id="password1"
            v-model="password1"
            placeholder="Enter password"
            required />
        </div>
        <div class="form-group">
          <label for="password2">Password (Confirm)</label>
          <input
            type="password"
            class="form-control"
            id="password2"
            v-model="password2"
            placeholder="Confirm password"
            required />
        </div>
        <br />
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      </div>
    </div>
    <!-- Edit Teller Modal -->
<div v-if="showEditModal" class="modal">
  <div class="modal-content">
    <span class="close" @click="closeModal">&times;</span>
    <h2>Edit Teller</h2>
    <form @submit.prevent="updateTeller">
      <!-- Username -->
      <div class="form-group">
        <label for="editUsername">Username</label>
        <input type="text" class="form-control" id="editUsername" v-model="editedTeller.username" required />
      </div>
      <!-- First Name -->
      <div class="form-group">
        <label for="editFirstName">First Name</label>
        <input type="text" class="form-control" id="editFirstName" v-model="editedTeller.firstName" required />
      </div>
      <!-- Last Name -->
      <div class="form-group">
        <label for="editLastName">Last Name</label>
        <input type="text" class="form-control" id="editLastName" v-model="editedTeller.lastName" required />
      </div>
      <!-- Address -->
      <div class="form-group">
        <label for="editAddress">Address</label>
        <input type="text" class="form-control" id="editAddress" v-model="editedTeller.address" required />
      </div>
      <br />
      <div class="form-group">
        <label for="editPassword">Password</label>
        <input type="text" class="form-control" id="editPassword" v-model="editedTeller.password" required />
      </div>
      <br />
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</div>

    </div>


    <br>
    
    
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
      password1: '',
      password2: '',
      loginError: null,
      searchTerm: '',
      editedTeller: {
        id: null,
        username: '',
        firstName: '',
        lastName: '',
        address: ''
      }
    };
  },
  mounted() {
    this.fetchTellers();
  },computed: {
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
      closeModal(){

this.showEditModal = false;

      }, editTeller(teller) {
      // Populate editedTeller with the selected teller's details
      this.editedTeller.id = teller.id;
      this.editedTeller.username = teller.username;
      this.editedTeller.firstName = teller.first_name;
      this.editedTeller.lastName = teller.last_name;
      this.editedTeller.address = teller.address1 ;
      this.editedTeller.password = teller.password1 ; 
      // Show the Edit Teller modal
      this.showEditModal = true;
    },
    updateTeller() {
      const { id, username, firstName, lastName, address,password } = this.editedTeller;
      const updatedData = { username, firstName, lastName, address,password };
      console.log(updatedData);
      console.log(id);
      axios.put(`http://127.0.0.1:9000/updateTeller/${id}`, updatedData)
        .then(response => {
          this.fetchTellers();
          this.showEditModal = false; 
        })
        .catch(error => {
          console.error(error);
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

<style scoped>
.tellers-table {
  width: 100%;
  border-collapse: collapse;
}

.tellers-table th, .tellers-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.tellers-table th {
  background-color: #f2f2f2;
  text-align: left;
}
.container-sm{
  width: 100%;
  height: 500px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  margin-top: 30px;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
}
.display-1{
  font-size: 45px;
  text-transform: uppercase;
}
</style>
