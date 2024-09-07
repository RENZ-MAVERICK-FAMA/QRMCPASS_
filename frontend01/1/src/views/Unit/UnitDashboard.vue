<template>
  <div class="container mx-auto p-8">
    <div v-if="authenticated" class="text-green-500 font-semibold">Authenticated</div>
    <div v-else class="text-red-500 font-semibold">Not Authenticated</div>

    <div class="mt-8">
      <h2 class="text-2xl font-semibold">Unit Information</h2>
      <p>{{ unit.unit_info }}</p>
    </div>

    <div class="mt-8">
      <h2 class="text-2xl font-semibold">Balance</h2>
      <p class="text-lg"><strong>Balance:</strong> ${{ balance }}</p>
    </div>

    <div class="mt-8">
      <h2 class="text-2xl font-semibold">QR Code</h2>
      <img :src="'http://127.0.0.1:9000/website/static/' + unit.qrcode" alt="QR Code" class="w-64 h-64" />
    </div>

    <div class="mt-8">
      <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted } from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      authenticated: false,
      unit: { id: null, unit_info: '', qrcode: '' },
      balance: null
    }
  },
  created() {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      this.authenticated = true
      this.fetchUnitDetails()
    }
  },
  methods: {
    fetchBalances(unitId) {
      axios.get(`http://127.0.0.1:9000/unit/${unitId}/balances`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(response => {
          this.balance = response.data.balances[0].balance;
        })
        .catch(error => {
          console.error('Error fetching balances for unit:', unitId, error);
        });
    },
    fetchUnitDetails() {
      axios.get('http://127.0.0.1:9000/unitdetails', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
        .then(response => {
          this.unit = response.data
          this.fetchBalances(this.unit.id)
        })
        .catch(error => {
          console.error('Error fetching user:', error)
        })
    },
    logout() {
      axios.post('http://127.0.0.1:9000/logout')
        .then(response => {
          console.log(response.data.message)
          localStorage.removeItem('access_token')
          this.authenticated = false
          this.$router.push('/login')
        })
        .catch(error => {
          console.error(error.response.data.message)
        })
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  }
}
</script>

<style scoped>
/* Add any additional styling here */
.container {
  max-width: 800px;
}
</style>
