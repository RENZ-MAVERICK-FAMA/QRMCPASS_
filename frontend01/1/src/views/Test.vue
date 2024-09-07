<template>
  <div>
    <h1>Units</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Date</th>
          
          <th>Branch</th>
          <th>Date of Payment</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.amount }}</td>
          <td>{{ transaction.date }}</td>
          
          <td>{{ transaction.branch }}</td>
          <td>{{ transaction.date_of_payment }}</td>
          <td><strong>{{ transaction.type }}</strong></td>
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
      transactions: []
    };
  },
  created() {
  this.fetchtransactions();
}
,
methods: {
  fetchtransactions() {
        axios.get('http://127.0.0.1:9000/transactions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
          .then((response) => {
            console.log(response.data.transactions);
            this.transactions = response.data.transactions;
            
          })
          .catch((error) => {
            console.error('Error fetching user transactions:', error);
          });
      },
}
};
</script>
