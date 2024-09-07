<template>
  <br>
  <button class="btn btn-warning"> <RouterLink class="nav-link" to="/HomeSuperAdmin"> Go Back</RouterLink> </button>
  <div class="container-sm">
    <h1 class="display-1">All admins</h1>
      <button @click="showModal = true" class="add-operator-btn">Add Admin</button>
      <div>
        <input type="text" v-model="searchTerm" placeholder="Search...">
      </div>
      <table class="admins-table">
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
          <tr v-for="admins in filteredAdmins" :key="admins.id">
            <td>{{ admins.username }}</td>
            <td>{{ admins.first_name }}</td>
            <td>{{ admins.last_name }}</td>
            <td>{{ admins.address1 }}</td>
            <td>  <button @click="editAdmin(admins)" class="add-operator-btn">Edit</button></td>
          </tr>
        </tbody>
      </table>
      <div v-if="showModal" class="modal">
      <!-- Modal content here -->
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <form @submit.prevent="addTeller">

<h3 align="center"> admin Sign Up</h3>
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
    <h2>Edit Admin</h2>
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
        admins: [],
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
      this.fetchadmins();
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

      axios.post('http://127.0.0.1:9000/addAdmin', formData)
        .then(response => {
      this.username = '';
      this.firstName = '';
      this.lastName = '';
      this.address = '';
      this.password1 = '';
      this.password2 = '';
          this.$router.push('/admin');
          window.location.href = '/admin';
                this.showModal = false;
        
        })
        .catch(error => {
          this.loginError = error.response.data.message;
          console.error(this.loginError);
         
        });
    },closeModal(){

this.showEditModal = false;

      }, editAdmin(admins) {
      
      this.editedTeller.id = admins.id;
      this.editedTeller.username = admins.username;
      this.editedTeller.firstName = admins.first_name;
      this.editedTeller.lastName = admins.last_name;
      this.editedTeller.address = admins.address1 ;
      this.editedTeller.password = admins.password1 ; 
     
      this.showEditModal = true;
    },
    updateTeller() {
      const { id, username, firstName, lastName, address,password } = this.editedTeller;
      const updatedData = { username, firstName, lastName, address,password };
      console.log(updatedData);
      console.log(id);
      axios.put(`http://127.0.0.1:9000/updateAdmin/${id}`, updatedData)
        .then(response => {
          this.fetchadmins();
          this.showEditModal = false; 
        })
        .catch(error => {
          console.error(error);
        });
    },

      async fetchadmins() {
        try {
          const response = await axios.get('http://localhost:9000/admins');
          this.admins = response.data.admins;
        } catch (error) {
          console.error(error);
        }
      },
    },computed: {
    filteredAdmins() {
      if (!this.searchTerm) {
        return this.admins; // If no search term, return all units
      }

      // Convert search term to lowercase for case-insensitive search
      const searchTermLower = this.searchTerm.toLowerCase();

      // Filter units based on search term
      return this.admins.filter(admins => {
        return (
          admins.username.toLowerCase().includes(searchTermLower) || // Filter by unit info
          admins.first_name.toLowerCase().includes(searchTermLower) || // Filter by unit type
          admins.last_name.toLowerCase().includes(searchTermLower) || // Filter by unit type
          admins.address1.toLowerCase().includes(searchTermLower) 
        );
      });
    }
  },
  };
  </script>
  
  <style scoped>
  .admins-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .admins-table th, .admins-table td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  .admins-table th {
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
  