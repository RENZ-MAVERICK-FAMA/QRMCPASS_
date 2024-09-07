<template>
  <div class="container">
  <h1 class="display-1">Units</h1>
  <button class="btn btn-warning"> <RouterLink class="nav-link" to="/home">Go Back</RouterLink> </button>
  <br>
  <table class="table">
    <thead>
      <tr>
        <th>Unit Info</th>
        <th>Unit Type</th>
        <th>Picture</th>
        <th>QR Code</th>
        <th>Color</th>
        <th>Balance</th>
        <th>Actions</th>
        <th>Download</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="unit in units" :key="unit.id">
        <td>{{ unit.unit_info }}</td>
        <td>{{ unit.unit_type }}</td>
        <td><img :src="unit.picture" alt="Picture" style="width: 70px; height: 70px;"></td>
        <td><img :src="unit.qrcode" alt="QR Code" style="width: 70px; height: 70px;"></td>
        <td>{{ unit.color }}</td>
        <td>
          <strong v-for="balance in unit.balances" :key="balance.id">{{ balance.balance }}</strong>
        </td>
        <td>
          <div class="btn-option gap-2">
            <button class="btn btn-success" @click="showDelinquencies(unit)">Delinquencies</button>
          <button class="btn btn-success" @click="showTransactions(unit)">Transactions</button>
          </div>
         
        </td>
         <td>
          <button class="btn btn-primary" @click="downloadQRCode(unit)">Download <br> QR Code</button>

        </td>
      </tr>
    </tbody>
  </table>
  

  <!-- Delinquencies Modal -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Delinquencies for Unit</h2>

      <div class="calendar-container">
        <div class="calendar-header">
          <button @click="goToPreviousMonth">Previous</button>
          <span>{{ currentMonthName }} {{ currentYear }}</span>
          <button @click="goToNextMonth">Next</button>
        </div>
        <table class="calendar-table">
          <thead>
            <tr>
              <th v-for="day in weekDays" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in calendarWeeks" :key="week">
              <td v-for="day in week" :key="day" :class="getCellClass(day)">
                <strong v-if="day">{{ day }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
  </div>

  <!-- Transactions Modal -->
  <div v-if="showModalTransactions" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModalTransactions">&times;</span>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>Branch</th>
            <th>Reference Number</th>
            <th>Teller</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
            
            <td>{{ new Date(transaction.date_of_payment).toISOString().split('T')[0] }}</td>

<td>{{ new Date(transaction.date_of_payment).toLocaleTimeString('en-US', { timeZone: 'GMT' }) }}</td> 




              <td>{{ transaction.amount }}</td>
              <td>{{ transaction.branch }}</td>
              <td>{{ transaction.reference_key }}</td>
              <td>{{ transaction.teller }}</td>
            <td><strong>{{ transaction.type.toUpperCase() }}</strong></td>
          </tr>
        </tbody>
      </table>
      

      <div>
        <button @click="prevPageTransactions" :disabled="currentTransactionsPage === 0">Previous</button>
        <span>Page {{ currentTransactionsPage + 1 }} of {{ totalPagesTransactions }}</span>
        <button @click="nextPageTransactions" :disabled="currentTransactionsPage === totalPagesTransactions - 1">Next</button>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      units: [],
      selectedUnit: null, // Add selectedUnit state
      showModal: false,
      showModalTransactions: false,
      selectedUnitDelinquencies: [],
      transactions: [],
      transactionsPerPage: 20,
      currentTransactionsPage: 0,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      calendarWeeks: [],
    };
  },
  computed: {
    paginatedTransactions() {
      const start = this.currentTransactionsPage * this.transactionsPerPage;
      return this.transactions.slice(start, start + this.transactionsPerPage);
    },
    totalPagesTransactions() {
      return Math.ceil(this.transactions.length / this.transactionsPerPage);
    },
    currentMonthName() {
      const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December',
      ];
      return monthNames[this.currentMonth];
    },
  },
  created() {
    this.fetchUnits();
    this.updateCalendarData();
  },
  methods: {
    downloadQRCode(unit) {
  axios.get(unit.qrcode, {
    responseType: 'blob'
  })
  .then(response => {
    const blob = new Blob([response.data], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${unit.unit_info}_QRCODE.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error('Error downloading QR code:', error);
  });
},
    fetchUnits() {
        axios.get('http://127.0.0.1:9000/user_units', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        .then(response => {
            this.units = response.data.units;
            console.log('Units data:', this.units);
           
            this.units.forEach(unit => {
                this.fetchBalance(unit);
                
            });
        })
        .catch(error => {
            console.error('Error fetching user units:', error);
        });
    },

  
    fetchBalance(unit) {
        axios.get(`http://127.0.0.1:9000/unit/${unit.id}/balances`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
        .then(response => {
            
            unit.balances = response.data.balances;
            console.log(`Balance for unit ${unit.id}:`, unit.balances);
        })
        .catch(error => {
            console.error(`Error fetching balance for unit ${unit.id}:`, error);
        });
    },

    showDelinquencies(unit) {
  this.selectedUnit = unit; // Set the selected unit

  // Fetch delinquencies and transactions concurrently using Promise.all
  Promise.all([
    axios.get(`http://127.0.0.1:9000/unit/${unit.id}/delinquencies`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }),
    axios.get(`http://127.0.0.1:9000/unit/${unit.id}/transactions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
  ])
    .then(responses => {
      const delinquenciesResponse = responses[0];
      const transactionsResponse = responses[1];

      this.selectedUnitDelinquencies = delinquenciesResponse.data.delinquencies;
      this.transactions = transactionsResponse.data.transactions;
     
      // Show the modal after data is fetched
      this.showModal = true;

      // Update calendar data if needed
      this.updateCalendarData();
    })
    .catch(error => {
      console.error(`Error fetching delinquencies and transactions for unit ${unit.id}:`, error);
    });
},
    updateCalendarData() {
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
      let calendar = [];
      let week = [];
      let dayOfMonth = 1;

      // Fill the first week with empty days if necessary
      for (let i = 0; i < firstDayOfMonth; i++) {
        week.push(null);
      }

      // Fill the calendar with days of the month
      while (dayOfMonth <= daysInMonth) {
        if (week.length === 7) {
          calendar.push(week);
          week = [];
        }
        week.push(dayOfMonth);
        dayOfMonth++;
      }

      // Add the remaining week
      if (week.length > 0) {
        calendar.push(week);
      }

      this.calendarWeeks = calendar;
    },
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    formatTransactionDate(transaction) {
      const date = transaction.type === 'top-up'
        ? new Date(transaction.date_of_payment)
        : new Date(transaction.date);
      return date.toLocaleDateString();
    },
    showTransactions(unit) {
      this.selectedUnit = unit; // Set the selected unit
      axios.get(`http://127.0.0.1:9000/unit/${unit.id}/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
        .then(response => {
          this.transactions = response.data.transactions;
         
          this.showModalTransactions = true;
        })
        .catch(error => {
          console.error(`Error fetching transactions for unit ${unit.id}:`, error);
        });
    }, hasPaymentOnDate(date) {
  const formattedDate = this.formatDate(date);

  return this.transactions.some(transaction => {
    // Get the timestamp from the transaction date and subtract 8 hours (in milliseconds)
    const transactionTimestamp = new Date(transaction.date).getTime() - 8 * 60 * 60 * 1000;

    // Create a new Date object using the adjusted timestamp
    const adjustedTransactionDate = new Date(transactionTimestamp);

    // Format the adjusted transaction date using the formatDate function
    const transactionDate = this.formatDate(adjustedTransactionDate);

    // Check if the adjusted transaction date and type match the criteria
    return transactionDate === formattedDate && (transaction.type === 'toll payment' || transaction.type === 'delinquency payment');
  });
},
    hasUnpaidDelinquencyOnDate(date) {
        const formattedDate = this.formatDate(date);
        return this.selectedUnitDelinquencies.some(delinquency => {
            const delinquencyDate = this.formatDate(new Date(delinquency.date_of_payment));
            return delinquencyDate === formattedDate && delinquency.status === 'unpaid';
        });
    },
getCellClass(day) {
    if (!day) {
        return {};
    }

    const date = new Date(this.currentYear, this.currentMonth, day);
    const hasPayment = this.hasPaymentOnDate(date);
    const hasUnpaidDelinquency = this.hasUnpaidDelinquencyOnDate(date);
    
    if (hasPayment) {
        return { 'cell-green': true };
    } else if (hasUnpaidDelinquency) {
        return { 'cell-red': true };
    }

    return {};
},
    goToPreviousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.updateCalendarData();
    },
    goToNextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.updateCalendarData();
    },
    prevPageTransactions() {
      if (this.currentTransactionsPage > 0) {
        this.currentTransactionsPage--;
      }
    },
    nextPageTransactions() {
      if (this.currentTransactionsPage < this.totalPagesTransactions - 1) {
        this.currentTransactionsPage++;
      }
    },
    closeModal() {
      this.showModal = false;
      this.selectedUnitDelinquencies = []; // Reset state when modal is closed
    },
    closeModalTransactions() {
      this.showModalTransactions = false;
      this.transactions = []; // Reset state when modal is closed
    },
  },
};
</script>
<style scoped>
/* Modal styles */
.modal {
      display: block; /* Displayed by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto; /* Enable scroll if needed */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal content box (customize as needed) */
    .modal-content {
  background-color: #fefefe;
  margin: 5% auto; /* 5% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
  max-width: 1000px; /* Limit the maximum width of the modal */
  max-height: 80%; /* Limit the maximum height of the modal */
  overflow-y: auto; /* Enable vertical scroll if needed */
}

    /* Close button (customize as needed) */
    .close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

/* Close button hover/focus state */
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}


/* Button styles */
/* button {
  background-color: #4CAF50; 
  border: none; 
  color: white; 
  text-align: center; 
  text-decoration: none; 
  display: inline-block; 
  font-size: 16px; 
  border-radius: 20px; 
  cursor: pointer; 
  transition: background-color 0.3s ease;
  margin-top: auto;
  margin-right: 10px;
  margin-left: 25px;
} */

/* button:hover {
  background-color: #04791e;
  padding: 12px 37px;
} */

/* Container styles */
.container {
  margin-top: 50px;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* Gray shadow */
  padding: 20px; /* Add padding for spacing */
  border-radius: 20px;
  /* display: flex; */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 50px;
}

table th,
table td {
  padding: 12px;
  border: 1px solid #ddd; /* Add a border to all cells */
  text-align: left;
}

table th.header-cell {
  background-color: #3498db; /* Change background color of header cells */
  color: white; /* Change text color of header cells */
}

table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternate row background color */
}

table tbody tr:hover {
  background-color: #f5f5f5; /* Hover effect for rows */
}

th {
  text-transform: uppercase;
  font-weight: bold;
  font-size: medium;
  text-align: center;
}

td {
  text-transform: uppercase;
  font-weight: normal;
  font-size: medium;
  text-align: center;
}

/* h1 {
  text-transform: uppercase;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  font-size: 30px;
} */

.cell-red {
  background-color: red;
  color: white;
}

.cell-green {
  background-color: lightgreen;
  color: black;
}
.btn-option{
  display: flex;
}
.display-1{
  text-align: center;
  text-transform: uppercase;
  font-size: 50px;
}
/* .btn{
  height: 60px;
  margin-left: 20px;
} */
</style>