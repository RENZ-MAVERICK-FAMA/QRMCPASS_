<template>
  <div>
    <br>
    <button class="btn btn-warning">
      <RouterLink class="nav-link" to="/HomeSuperAdmin">Go Back</RouterLink>
    </button>
    <div class="container-sm">
      <h1 class="display-1">All Units</h1>
      <div>
        <input type="text" v-model="searchTerm" placeholder="Search...">
      </div>
      <br>
      <table class="units-table">
        <thead>
          <tr>
            <th>Unit Info</th>
            <th>Unit Type</th>
            <th>Color</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="unit in filteredUnits" :key="unit.id">
            <td>{{ unit.unit_info }}</td>
            <td>{{ unit.unit_type }}</td>
            <td>{{ unit.color }}</td>
            <td>  <button @click="editAdmin(unit)" class="add-operator-btn">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
    <!-- Edit Teller Modal -->
<div v-if="showEditModal" class="modal">
  <div class="modal-content">
    <span class="close" @click="closeModal">&times;</span>
    <h2>Edit Unit</h2>
    <form @submit.prevent="updateTeller">
    
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
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      units: [],
      searchTerm: '',
      showEditModal: false,
      editedTeller: {
        id: null,
        password: ''
      }
    };
  },
  mounted() {
    this.fetchUnits();
  },
  computed: {
    filteredUnits() {
      if (!this.searchTerm) {
        return this.units; // If no search term, return all units
      }

      // Convert search term to lowercase for case-insensitive search
      const searchTermLower = this.searchTerm.toLowerCase();

      // Filter units based on search term
      return this.units.filter(unit => {
        return (
          unit.unit_info.toLowerCase().includes(searchTermLower) || // Filter by unit info
          unit.unit_type.toLowerCase().includes(searchTermLower) || // Filter by unit type
          unit.color.toLowerCase().includes(searchTermLower) // Filter by color
        );
      });
    }
  },
  methods: {
    async fetchUnits() {
      try {
        const response = await axios.get('http://localhost:9000/units');
        this.units = response.data.units;
      } catch (error) {
        console.error(error);
      }
    }, closeModal(){

this.showEditModal = false;

      },editAdmin(unit) {
      
      this.editedTeller.id = unit.id;
      
      this.editedTeller.password = unit.password1 ; 
     
      this.showEditModal = true;
    },
    updateTeller() {
      const { id, password } = this.editedTeller;
      const updatedData = {password };
      console.log(updatedData);
      console.log(id);
      axios.put(`http://127.0.0.1:9000/updateUnit/${id}`, updatedData)
        .then(response => {
          this.fetchUnits();
          this.showEditModal = false; 
        })
        .catch(error => {
          console.error(error);
        });
    },
  }
};
</script>

<style scoped>
.units-table {
  width: 100%;
  border-collapse: collapse;
}

.units-table th,
.units-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.units-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.container-sm {
  width: 100%;
  height: 500px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  margin-top: 30px;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
}

.display-1 {
  font-size: 45px;
  text-transform: uppercase;
}
</style>
