<template>
  <main class="p-5 md:px-[10%] bg-slate-100" >
    <div class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px]" >
      <RouterLink to="/HomeSuperAdmin" >
          <div class="flex gap-5 h-[40px] items-center hover:text-slate-300" >
            <i class="pi pi-arrow-left" ></i>
            <span>Go Back</span>
          </div>
      </RouterLink>
      <DataTable showGridlines :value="filteredUnit" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" class="mt-3">
        <template #header >
          <div class="flex items-center justify-between" >
            <span>ALL UNITS</span>
          </div>
          <div>
        <!-- <input type="text" v-model="searchTerm" placeholder="Search..."> -->
        <InputText v-model:modelValue="searchTerm" placeholder="Search..." class="w-full"/>
      </div>
        </template>
        <template #empty>
          <div class="flex justify-center" >
            <small class="font-extralight capitalize" >no data found. </small>
          </div>
        </template>
        
        <Column header="Unit Info" field="unit_info" />
        <Column header="Unit Type" field="unit_type" />
        <Column header="Color" field="color" />
        
      </DataTable>
      <Dialog v-model:visible="showEditModal" header="Update Admin" modal class=" w-full md:w-[600px]" >
      <div class="modal-content">
    <span class="close" @click="closeModal">&times;</span>
 
    <form @submit.prevent="updateTeller">
      <!-- Username -->
      <div class="mt-3">
        <label>Unit Info</label>
        <InputText v-model="editedTeller.unit_info" type="text" id="editUsername" required class="w-full" />
      </div>
      <!-- First Name -->
      <div class="mt-3">
        <label>Unit Type</label>
        <InputText v-model="editedTeller.unit_type" type="text" id="editFirstname" required class="w-full"  />
      </div>
      <!-- Last Name -->
      <div class="mt-3">
        <label>Color</label>
        <InputText v-model="editedTeller.color" type="text" id="editLastname" required class="w-full" />
      </div>
      <!-- Address -->
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
    </div>
  </main>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      units: [],
      searchTerm: '',
      showEditModal: false,
      password: '',
      unit_info: '',
      Unit_type: '',
      color: '', editedTeller: {
        id: null,
        color: '',
        unit_type: '',
        unit_info: '',
        password: ''
      }
    };
  },
  mounted() {
    this.fetchUnits();
  },
  methods: {
    async fetchUnits() {
      try {
        const response = await axios.get('https://zfhlpd2pxk.loclx.io/units');
        this.units = response.data.units;
      } catch (error) {
        console.error(error);
      }
    },editAdmin(admin) {
      this.editedTeller = {
        id: admin.id,
       color: admin.color,
        unit_info: admin.unit_info,
        unit_type: admin.unit_type,
        password: admin.password1
      };
      this.showEditModal = true;
    },
    closeModal() {
      this.showEditModal = false;
    },
    updateTeller() {
  const { id, color, unit_info, unit_type, password } = this.editedTeller;
  const updatedData = { color, unit_info, unit_type, password };

  axios.put(`https://zfhlpd2pxk.loclx.io/updateUnit/${id}`, updatedData)
    .then(response => {
      // Find the index of the unit in the array
      const index = this.units.findIndex(unit => unit.id === id);
      
      // If the unit exists, update the array locally
      if (index !== -1) {
        this.units[index] = { id, color, unit_info, unit_type,password };
      }
      
      // Close the modal after updating
      this.showEditModal = false;
      
      // Optionally, reset the editedTeller object
      this.editedTeller = {
        id: null,
        color: '',
        unit_info: '',
        unit_type: '',
        password: ''
      };
      
      console.log('Unit updated successfully!');
    })
    .catch(error => {
      console.error(error);
    });
}
, 
  },computed: {
    filteredUnit() {
      if (!this.searchTerm) {
        return this.units; // If no search term, return all units
      }

      // Convert search term to lowercase for case-insensitive search
      const searchTermLower = this.searchTerm.toLowerCase();

      // Filter units based on search term
      return this.units.filter(units => {
        return (
          units.unit_info.toLowerCase().includes(searchTermLower) || // Filter by unit info
          units.color.toLowerCase().includes(searchTermLower) || // Filter by unit type
          units.unit_type.toLowerCase().includes(searchTermLower) // Filter by unit type
          
        );
      });
    }
  },
};
</script>

<style scoped>
.units-table {
  width: 100%;
  border-collapse: collapse;
}

.units-table th, .units-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.units-table th {
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
