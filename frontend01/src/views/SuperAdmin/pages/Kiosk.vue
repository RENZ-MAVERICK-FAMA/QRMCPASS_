<template>
    <div>
      <button class="btn btn-warning"> <RouterLink class="nav-link" to="/HomeSuperAdmin"> Go Back</RouterLink> </button>
      <h1>All Kiosks</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <!-- Add more columns as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="kiosk in kiosks" :key="kiosk.id">
            <td>{{ kiosk.id }}</td>
            <td>{{ kiosk.username }}</td>
            <td>{{ kiosk.password }}</td>
            <!-- Add more columns as needed -->
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        kiosks: [],
      };
    },
    mounted() {
      this.fetchKiosks();
    },
    methods: {
      async fetchKiosks() {
        try {
          const response = await axios.get('http://localhost:9000/kiosk');
          this.kiosks = response.data;
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  