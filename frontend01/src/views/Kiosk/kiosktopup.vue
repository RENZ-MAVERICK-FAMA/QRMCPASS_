<template>

<div class="container">

<div class="row">

makita details sa gi select nga unit
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
            <label class="display-3" for="unit">Select Unit:</label>
                    <select v-model="selectedUnit" class="form-control" id="unit" name="unit" required>
                      <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.unit_info }}</option>
                    </select>
          </div>
        
          <div class="">
            <label class="display-3" for="amt">Top Up:</label>
            <input v-model="amount" type="number" class="form-control" id="amt" name="amt" placeholder="Enter amount" required readonly>
          </div>
          <button   type="submit" class="btn btn-success">Top Up</button>
      
         
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
      <th>ID</th>
      <th>Unit</th>
      <th>Amount</th>
      <th>Date</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
<tr v-for="transaction in transactions.slice(0, 10).reverse()" :key="transaction.id">
<td>{{ transaction.id }}</td>
<td>{{ transaction.unitid }}</td>
<td>{{ transaction.amount }}</td>
<td>{{ new Date(transaction.date).toDateString() }}</td>
    <td>{{ new Date(transaction.date).toLocaleTimeString('en-US', { timeZone: 'GMT' }) }}</td> 
</tr>
</tbody>
</table>
</div>
</div>
 
</div> 
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      units: [],
      selectedBranch: 'kiosk',
      selectedUnit: '',
      amount: '',
      success: '',
      error: '',
      transactions: []
    };
  },
  mounted() {
    this.fetchCoins();
    setInterval(() => {
      this.fetchCoins();
    }, 10000);
    this.fetchRecentTransactions();
    setInterval(() => {
      this.fetchRecentTransactions();

    }, 1000);
  },
  created() {
    this.fetchUnits();
    this.fetchCoins();
  },
  methods: {
    clearError() {
      this.error = '';
    },
    clearSuccess() {
      this.success = '';
    },
    fetchUnits() {
      axios.get('http://127.0.0.1:9000/units', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      .then(response => {
        this.units = response.data.units;
        this.fetchBalances();
      })
      .catch(error => {
        console.error('Error fetching user units:', error);
      });
    },
    fetchCoins() {
      axios.get('http://127.0.0.1:9000/inserted_coins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      .then(response => {
        this.amount = response.data.inserted_coins;
      })
      .catch(error => {
        console.error('Error fetching inserted coins:', error);
      });
    },
    fetchBalances() {
      this.units.forEach(unit => {
        axios.get(`http://127.0.0.1:9000/unit/${unit.id}/balances`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          unit.balances = response.data.balances;
        })
        .catch(error => {
          console.error('Error fetching balances for unit:', unit.id, error);
        });
      });
    },
    topup() {
  if (!this.selectedUnit) {
    this.error = 'Please select a unit';
    return;
  }

  let unit = this.units.find(unit => unit.id === this.selectedUnit);
  if (!unit) {
    this.error = 'Selected unit not found';
    return;
  }

  // Fetch the original amount from the database
  axios.get('http://127.0.0.1:9000/inserted_coins', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  })
  .then(response => {
    const originalAmount = response.data.inserted_coins;

    // Compare the submitted amount with the original amount
    if (this.amount !== originalAmount) {
      this.error = 'Amount has been tampered with';
      return;
    }

    let data = {
      selectedBranch: this.selectedBranch,
      selectedUnit: this.selectedUnit,
      unit_type: unit.unit_type,
      amount: this.amount,
      teller: 'kiosk'
    };

    axios.post('http://127.0.0.1:9000/kiosktopup', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
        'X-Frontend-URL': window.location.href,
        'X-Forwarded-For': window.ipAddress, 
      }
    })
    .then(response => {
      if (response.data.message === 'Top up successful!') {
        this.selectedBranch = '';
        this.selectedUnit = '';
        this.amount = '';
        this.success = 'Topup successful!';
       
        this.fetchRecentTransactions(); // Update the transaction table
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
  })
  .catch(error => {
    console.error('Error fetching original amount:', error);
    this.error = 'An error occurred. Please try again.';
  });
},
      fetchRecentTransactions() {
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

  }
};
</script>

<style scoped>
.container{
  display: flex;
}
.container-sm{
  margin-left: 150px;
  width: 300px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 5%;
  justify-content: center;
}
.container-md{
  margin-left: 100px;
  width: 600px; /* Increase the width to make the table bigger */
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
  width: 100%; /* Make the table fill the container width */
}
#text-recent{
  font-weight: bold;
  color: #004807;
}
</style>