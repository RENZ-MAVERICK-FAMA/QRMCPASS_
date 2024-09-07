<template>
      <button class="btn btn-warning"> <RouterLink class="nav-link" to="/homeTeller">Go Back</RouterLink> </button>
  <div class="container">
    
    <div class="row">
    

<div class="container-sm">
  <h2 class="display-1" >Top Up Balance</h2>
  <div v-if="error" class="alert alert-danger" role="alert">
  {{ error }}
  <button @click="clearError" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
  </button>
</div> 
      <div v-if="success" class="alert alert-success" role="alert">
  {{ success }}
  <button @click="clearSuccess" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<!-- end sa error callback -->
          <div class="col-md-6">
            <form @submit.prevent="topup">
              <div class="">
                <label class="display-3" for="unit">Select Unit</label>
               
                
                <select v-model="selectedUnit" class="form-control" id="unit" name="unit" required>
                  <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.unit_info }}</option>
                </select>

              </div>
              <label class="display-3" for="branch">Toll Booth</label>
              <br>
              <select class="form-control"v-model="selectedBranch" name="branch" id="branch" required readonly>
                <option value="Office">Office</option>
              </select> 
              <div class="">
                <label class="display-3" for="amt">Top Up</label>
                <input v-model="amount" type="number" class="form-control" id="amt" name="amt" placeholder="Enter amount" required>
              </div>
              <button id="topup-btn"  type="submit" class="btn btn-success">Top Up</button>
          
             
            </form>
          </div>
      </div>
  </div>
  <div class="row">
    <div class="container-md">
      <h2 id="text-recent" class="display-1">RECENT TOPUP</h2>
  <table class="table table-success table-striped-columns table-hover">
    
      <thead>
        <tr>
      
          <th>Unit</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="transaction in transactions.slice(0, 10).reverse()" :key="transaction.id">
  
    <td>{{ transaction.unitid }}</td>
    <td>{{ transaction.amount }}</td>
    <td>{{ new Date(transaction.date).toISOString().split('T')[0] }}</td>

<td>{{ new Date(transaction.date).toLocaleTimeString('en-US', { timeZone: 'GMT' }) }}</td> 
  </tr>
</tbody>
    </table>
    </div>
    </div>
     
    </div> 
  </template>
  
  <script>
import { ref, toHandlers, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from 'axios'

const authenticated = ref(false)
const route = useRoute()
const router = useRouter()


export default {
    data() {
        return {
            units: [],
            selectedBranch:'market',
 
            selectedUnit:'',
            amount:'',
      success: '',
      error: '',
      transactions: []
        };
    },
    created() {
        this.fetchUnits();
        
   
    },
    setup() {
    const teller = ref({ id: null, username: '', first_name: '', last_name: '' })

    axios.get('http://127.0.0.1:9000/Teller', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    .then(response => {
      teller.value = response.data
    })
    .catch(error => {
      console.error('Error fetching user:', error)
    })

    return { teller }
  },
  mounted() {
   
    this.fetchRecentTransactions();
    setInterval(() => {
      this.fetchRecentTransactions();

    }, 1000);
  },
    methods: {
      clearError() {
    this.error = '';
  },
  
  clearSuccess() {
    this.success = '';
  } ,
        fetchUnits() {
    axios.get('http://127.0.0.1:9000/units', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => {
        console.log(response.data.units); // Check if units are received
        this.units = response.data.units;
        this.fetchBalances();
    })
    .catch(error => {
        console.error('Error fetching user units:', error);
    });
},
fetchBalances() {
    // Fetch balances for each unit
    this.units.forEach(unit => {
        axios.get(`http://127.0.0.1:9000/unit/${unit.id}/balances`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response.data.balances); // Check if balances are received
            unit.balances = response.data.balances; // Directly assign balances to unit
        })
        .catch(error => {
            console.error('Error fetching balances for unit:', unit.id, error);
        });
    });
},topup() {
  if (!this.selectedUnit) {
    this.error = 'Please select a unit';
    return;
  }

  let unit = this.units.find(unit => unit.id === this.selectedUnit);
  if (!unit) {
    this.error = 'Selected unit not found';
    return;
  }
  if (this.amount === 0) {
      this.error = 'Amount cannot be 0';
      return;
    }

  let data = {
    selectedBranch: this.selectedBranch,
    selectedUnit: this.selectedUnit,
    unit_type: unit.unit_type,
    amount: this.amount,
    teller: this.teller.id,
  };

  axios.post('http://127.0.0.1:9000/topup', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
        'X-Frontend-URL': window.location.href,
        'X-Forwarded-For': window.ipAddress, 
    }
  })
  .then(response => {
    console.log('Top up response:', response.data);
    if (response.data.message === 'Top up successful!') {
      this.selectedBranch = '';
      this.selectedUnit = '';
      this.amount = '';
      this.success = 'Topup successful!';
      this.fetchRecentTransactions(); 

    } else {
      console.error('Top up failed:', response.data.message);
      alert('Top up failed. Please try again.');
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
    if (error.response && error.response.data && error.response.data.error) {
      this.error = error.response.data.error;
    } else {
      this.error = 'An error occurred. Please try again.';
    }
  });
},fetchRecentTransactions() {
  axios.get('http://127.0.0.1:9000/recent_topup_transactions', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  .then(response => {
    const newTransactions = response.data.transactions.filter(transaction => !this.transactions.map(t => t.id).includes(transaction.id));
    newTransactions.forEach(transaction => {
      this.transactions.unshift(transaction);
    });
    this.transactions.sort((a, b) => b.id - a.id); // Sort transactions by ID in descending order
    this.transactions = this.transactions.slice(0, 10); // Limit to the latest 10 transactions
  })
  .catch(error => {
    console.error('Error fetching recent transactions:', error);
  });
}
  }};
</script>

<style scoped>
.container{
  display: flex;
}
.container-sm{
  margin-left: 150px;
  width: 500px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5 );
  padding: 20px;
  border-radius: 5%;
  justify-content: center;
  background-color: #fff;
}
.container-md{
  margin-left: 100px;
  width: 450px;
}
.row{
  margin-top: 20px;
  justify-content: left;
  text-align: left;
}
.display-1{
  font-size: 30px;
  text-transform: uppercase;
  text-align: center;
}
.display-3{
  font-size: 20px;
}
select, input{
  width: 150px;
  /* margin-top: 20px; */
}
label{
  margin-top: 20px;
}
.btn{
  margin-top: 20px;
  
}
table{
  text-align: center;
}
#text-recent{
  font-weight: bold;
  color: #004807;
}
.form-control{
  width: 450px;
}
#topup-btn{
  width: 450px;
  margin-top: 30px;
}
</style>