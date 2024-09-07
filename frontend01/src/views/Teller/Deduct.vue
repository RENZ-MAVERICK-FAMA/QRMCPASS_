<template>
  <button class="btn btn-warning">
    <RouterLink class="nav-link" to="/homeTeller"> Go Back</RouterLink>
  </button>
  <div class="container">
    <div>
    <h2 align="center">Pay Delinquency</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
  {{ error }}
  <button @click="clearError" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
  </button>
</div>  
<div v-if="success" class="alert alert-success" role="alert">
  {{ success }}
  <button @click="clearSuccess" class="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<br>
    <div class="container-two">
      <div class="row">
        <div class="col-md-6">
          <form @submit.prevent="deduct">
            <div class="form-group">
              <label class="display-3" for="unit">Select Unit</label>
              <select v-model="selectedUnit" class="form-control"  id="unit" name="unit" required>
                <option v-for="unit in units" :key="unit.id" :value="unit">{{ unit.unit_info }}</option>
              </select>
            </div>
            <br>

            <label class="display-3" for="branch">Toll Booth</label>
            <select class="form-control" v-model="selectedBranch" name="branch" id="branch" required>
              <option value="Office">Office</option>
            </select><br> 
            <div class="form-group">
              <label class="display-3" for="date">Payment Date</label>
              <input v-model="date" type="date" class="form-control" id="date" name="date" required>
            </div>
            <button id="deduct" type="submit" class="btn btn-success">Deduct</button>
          </form>
        </div>
      </div>
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
    selectedUnit: '',
    selectedBranch: '',
    date: '',
    error: '',
    success: '',
    teller:''
  }
},

created() {
  this.fetchUnits()
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
      console.log(response.data.units);
      this.units = response.data.units;
      this.fetchBalances();
    })
    .catch(error => {
      console.error('Error fetching user units:', error);
    });
  },

  deduct() {
    if (!this.selectedUnit) {
      this.error = 'Please select a unit';
      return;
    }

    let unitType = this.selectedUnit.unit_type;
    let amount = unitType === 'motorela' ? 6 : (unitType === 'multicab' ? 11 : 0);
    
    let data = {
      unit_id: this.selectedUnit.id,
      date: this.date,
      unit_type: this.selectedUnit.unit_type,
      selectedBranch: this.selectedBranch,
      amount: amount,
      teller: this.teller.id,
    };

    console.log('data to be sent:', data);

    axios.post('http://127.0.0.1:9000/paymentdel', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
        'X-Frontend-URL': window.location.href,
        'X-Forwarded-For': window.ipAddress, 
      }
    })
    .then(response => {
      console.log('Deduct response:', response.data);
      if (response.data.message === 'Payment Successful with Delinquency') {
        this.selectedUnit = '';
        this.date = '';
        this.success = response.data.message;
      } else {
        console.error('Deduct failed:', response.data.message);
        this.error = response.data.message;
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
  }
}
}
</script>

<style scoped>
.container{
  width: 500px;
  margin-top: 50px;
  background-color: white; /* White background */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* Gray shadow */
  padding: 20px; /* Add padding for spacing */
  border-radius: 5%;
}
h2{
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
}
.btn{
  margin-top: 10px;
}
/* .container-two{
  align-items: center;
} */
/* #deduct{
  margin-left: 70px;
  margin-top: 20px;
} */
.display-3{
  font-size: 20px;
}
.form-control{
  width: 450px;
}
#deduct{
  width: 450px;
  margin-top: 20px;
}
</style>
