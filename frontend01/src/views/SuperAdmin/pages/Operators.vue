<template>
  <br>
  <button class="btn btn-warning"> <RouterLink class="nav-link" to="/HomeSuperAdmin"> Go Back</RouterLink> </button> 
  <div class="container-sm">
    <h1 tex>All Users</h1>
    <button @click="showModal = true" class="add-operator-btn">Add Operator</button>
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
        <tr v-for="user in filteredUnits" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.last_name }}</td>
          <td>{{ user.address1 }}</td>
          <td>  <button @click="editUser(user)" class="add-operator-btn">Edit</button></td>
        </tr>
      </tbody>
    </table>
    <div v-if="showModal" class="modal">
      <!-- Modal content here -->
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <form @submit.prevent="signup">
      <div v-if="loginError" class="alert alert-danger" role="alert">
        {{ loginError }}
      </div>
   
        <div class="form-group">
          <label for="email">Username</label>
          <input
            type="text"
            class="form-control"
            id="email"
            v-model="email"
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
            required minlength="1" />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            class="form-control"
            id="lastName"
            v-model="lastName"
            placeholder="Enter last name"
            required minlength="1" />
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
          <label for="license">Driver License Number</label>
          <input type="text" class="form-control" id="license" v-model="license" name="license" placeholder="Enter Driver license number" required unique />
        </div>
        <div class="form-group">
          <label for="permit">Permit</label><br>
          <input type="file" id="permit" @change="handleFileChange" required />
        </div>
        <div class="form-group">
          <label for="password1">Password</label>
          <input
            type="password"
            class="form-control"
            id="password1"
            v-model="password1"
            placeholder="Enter password"
            required minlength="7" />
        </div>
        <div class="form-group">
          <label for="password2">Password (Confirm)</label>
          <input
            type="password"
            class="form-control"
            id="password2"
            v-model="password2"
            placeholder="Confirm password"
            required minlength="7" />
        </div>
        <br />
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
      </div>
    </div>
  </div>
   
  <div>
    <div v-if="showEditModal" class="modal">
  <div class="modal-content">
    <span class="close" @click="closeModal">&times;</span>
    <h2>Edit Operator</h2>
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
    <br>
    
   
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      users: [],
      showModal: false,
      showEditModal: false,
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      license: '',
      permitFile: '',
      password1: '',
      password2: '',
      loginError: '',
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
    this.fetchUsers();
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
    },closeModal(){

this.showEditModal = false;

      }, editUser(user) {
      // Populate editedTeller with the selected teller's details
      this.editedTeller.id = user.id;
      this.editedTeller.username = user.username;
      this.editedTeller.firstName = user.first_name;
      this.editedTeller.lastName = user.last_name;
      this.editedTeller.address = user.address1 ;
      this.editedTeller.password = user.password ; 
      // Show the Edit Teller modal
      this.showEditModal = true;
    },
    updateTeller() {
      const { id, username, firstName, lastName, address,password } = this.editedTeller;
      const updatedData = { username, firstName, lastName, address,password };
      console.log(updatedData);
      console.log(id);
      axios.put(`http://127.0.0.1:9000/updateOperator/${id}`, updatedData)
        .then(response => {
          this.fetchUsers();
          this.showEditModal = false; 
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleFileChange(event) {
      this.permitFile = event.target.files[0];
    }
  }, computed: {
    filteredUnits() {
      if (!this.searchTerm) {
        return this.users; // If no search term, return all units
      }

      // Convert search term to lowercase for case-insensitive search
      const searchTermLower = this.searchTerm.toLowerCase();

      // Filter units based on search term
      return this.users.filter(user => {
        return (
          user.username.toLowerCase().includes(searchTermLower) || // Filter by unit info
          user.first_name.toLowerCase().includes(searchTermLower) || // Filter by unit type
          user.last_name.toLowerCase().includes(searchTermLower) || // Filter by unit type
          user.address1.toLowerCase().includes(searchTermLower) 
        );
      });
    }
  },
};
</script>

<style>
.tellers-table {
  width: 100%;
  border-collapse: collapse;
}

.tellers-table th,
.tellers-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.tellers-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.add-operator-btn {
  float: right;
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-operator-btn:hover {
  background-color: #0056b3;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px; /* Optional: Set max width for the modal */
}

/* Close Button */
.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
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