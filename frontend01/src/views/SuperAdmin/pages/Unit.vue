<template>
  <main class="p-5 md:px-[10%]" >
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
        <input type="text" v-model="searchTerm" placeholder="Search...">
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
    };
  },
  mounted() {
    this.fetchUnits();
  },
  methods: {
    async fetchUnits() {
      try {
        const response = await axios.get('https://qrmcpass.loca.lt/units');
        this.units = response.data.units;
      } catch (error) {
        console.error(error);
      }
    },
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
