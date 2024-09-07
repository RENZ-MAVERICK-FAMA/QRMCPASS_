<template>
  <div class="container">
    <!-- Flex container for horizontal layout -->
    <div class="flex-container">
      <!-- Recent Transactions Container -->
      <div class="section-container">
        <h3>Recent Transactions</h3>
        <div class="transaction-container">
          <table class="table">
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
      <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="center-image">
        <img :src="modalImage" alt="Unit Picture" style="width: 200px; height: 200px;" />
      </div>
      <strong><h2>Body Number: {{ ModalUnit }}</h2></strong>
      <strong><h3>Balance: {{ Balance }}</h3></strong>
      <strong><h3>Unit Type: {{ unit_type }}</h3></strong>
      <div class="modal-content-container">
        <div class="modal-content-left" >
          {{ modalContent}}
        </div>
        <br>
        <br>
        <br>
        <div class="modal-content-right">
          {{ payment }}
        </div>
      </div>

      <button class="approve-button" @click="closeModal">Approve</button>
    </div>
  </div>
      <!-- Cash-in Form Container -->
      <div class="section-container">
        <h3>Cash-in Form</h3>
        <div class="form-container">
          <form @submit.prevent="topup">
            <div class="form-group">
              <label for="unit">Ibutang ang imong Unit:</label>
              <select v-model="selectedUnit" class="form-control" required>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.unit_info }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="amt">Kantidad nga Gi hulog sa coin slot:</label>
              <input v-model="amount" type="number" class="form-control" placeholder="Ipasulod ang kantidad" required readonly>
            </div>
            <br>
            <button type="submit" id="submit" class="btn btn-primary large-button">I cash in</button>

          </form>
        </div>
      </div>
      
      <!-- Camera Container -->
      <div class="section-container">
        <h3>Camera</h3>
        <div class="camera-container">
          <qrcode-stream
            :key="qrCodeKey"
            :constraints="{ deviceId: selectedDevice ? selectedDevice.deviceId : null }"
            @error="onScannerError"
            @detect="onDetect"
            v-if="selectedDevice !== null"
          />
          <p v-else class="no-camera-error">No cameras available on this device</p>
          <select v-model="selectedDevice" class="form-select form-select-sm">
            <option disabled value="">Select Camera</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device">{{ device.label }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
    
      <script>
    import { ref, toHandlers, watch,onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { QrcodeStream } from 'vue-qrcode-reader';
    import axios from 'axios'
    import io from 'socket.io-client';
    const authenticated = ref(false)
    const route = useRoute()
    const router = useRouter()

    
    export default {
    name: 'TopupWithQRScanner',
    components: {
      QrcodeStream,
    },
    data() {
      return {
        units: [],
        selectedUnit: '',
        amount: '',
        success: '',
        error: '',
        transactions: [],
        selectedBranch: 'Toll-Booth',
        scannerError: '',
        qrCodeKey: 0,
        selectedDevice: null,
        devices: [],
        detectedCodes: [],
        showModal: false,
        modalContent: '',
        modalImage: '',
        payment:''
      };
    },
        mounted(){
    
          this.fetchCoins(); // Fetch coins immediately when the component is mounted
        setInterval(() => {
          this.fetchCoins(); // Fetch coins every 10 seconds
        }, 10000);
        this.fetchRecentTransactions();
      setInterval(() => {
        this.fetchRecentTransactions();

      }, 1000);
        },
        created() {
      this.fetchUnits();
      this.fetchCoins();
      
      this.enumerateDevices();
        
      const savedDetectedCodes = localStorage.getItem('detectedCodesMotorela');
      if (savedDetectedCodes) {
        this.detectedCodes = JSON.parse(savedDetectedCodes);
      } else {
        this.detectedCodes = []; 
      }
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
    },fetchCoins() {
      axios.get('http://127.0.0.1:9000/inserted_coins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      .then(response => {
        const originalAmount = response.data.inserted_coins;
        this.amount = response.data.inserted_coins;
        if (this.amount < 5) {
        this.showPopup = true;
        this.amount = 0;
      }else if(this.amount > 5){
          this.showPopup = false;
          this.amount = response.data.inserted_coins;
      }
      if (this.amount !== originalAmount) {
        this.error = 'Amount has been tampered with';
        return;
      }
      })
      .catch(error => {
        console.error('Error fetching inserted coins:', error);
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
    }, topup() {
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

      // Check if the amount is 0
      if (this.amount === 0) {
        this.error = 'Amount cannot be 0';
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
  }
  ,fetchRecentTransactions() {
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
      this.transactions.sort((a, b) => b.id - a.id); 
      this.transactions = this.transactions.slice(0, 10); 
    })
    .catch(error => {
      console.error('Error fetching recent transactions:', error);
    });
  },   openModal(unit) {
    
    let unitDetails = ``;
  

   
    
    let delinquencies = `Delinquencies:\n\nDate:\n`;

  

// Determine the starting index for the latest 7 delinquencies
const startIndex = Math.max(unit.delinquencies.length - 7, 0);

// Iterate over the latest 7 delinquencies (or fewer if there are less than 7)
unit.delinquencies.slice(startIndex).forEach((delinquency, index) => {
    // Extract the date part from the delinquency's date_of_payment
    const paymentDate = new Date(delinquency.date_of_payment);
    const formattedDate = paymentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // Append the formatted date and status to the delinquencies string
    delinquencies += `  ${formattedDate}: ${delinquency.status}\n`;
});

let transactions = `\nPayment History :\n\nDate:\n`;

// Determine the starting index for the last 7 transactions
const startIndex1 = Math.max(unit.transactions.length - 7, 0);

// Iterate over the last 7 transactions (or fewer if there are less than 7)
unit.transactions.slice(startIndex1).forEach((transaction, index) => {
    const paymentDate = new Date(transaction.date_of_payment);
    const formattedDate = paymentDate.toISOString().split('T')[0];
    const formattedTime = paymentDate.toLocaleTimeString('en-US', { timeZone: 'GMT' });

    transactions += `  ${formattedDate} ${formattedTime}\n`;
});
  
    // Combine all information
    this.unit_type = unit.unit_type;
    this.modalContent = `${unitDetails}\n${delinquencies}`;
    this.payment = `${transactions}`;
    this.ModalUnit = unit.unit_info;
    this.modalImage = unit.picture;
    this.Balance = unit.balance;
    this.showModal = true;
  
  }
    ,
          
          // Close the modal
          closeModal() {
            this.showModal = false;
          },
        
          
        
          clearError() {
            this.error = '';
          },
          clearSuccess() {
            this.success = '';
          },
        
    
          
          enumerateDevices() {
            onMounted(async () => {
            
              this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(({ kind }) => kind === 'videoinput');
    
              if (this.devices.length > 0) {
                
                this.selectedDevice = this.devices[0];
              }
            });
          },
          onScannerError(error) {
            this.scannerError = error;
          },
          async onDetect(detectedQRCodes) {
      const detectedStrings = detectedQRCodes.map((code) => code.rawValue);
      this.clearError();
      this.clearSuccess();

      const detectedWrCode = detectedStrings[0];

     
          const newCodes = detectedStrings.filter(code => !this.detectedCodes.includes(code));

          const paymentResponse = await axios.get(`http://127.0.0.1:9000/payment-details?unit_info=${detectedWrCode}`);

          const paymentDetails = paymentResponse.data;
          console.log('payment:', paymentDetails);
          this.openModal(paymentDetails);

      

          // Find the unit ID corresponding to the detectedWrCode
          const unit = this.units.find(unit => unit.unit_info === detectedWrCode);
          if (unit) {
              this.selectedUnit = unit.id; // Set selectedUnit to the ID of the unit
          } else {
              console.error('Unit not found for QR code:', detectedWrCode);
          }
      
  },


      }};
    </script>
    
    <style scoped>
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 50px auto;
      padding: 20px;
      background-color: white;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
      border-radius: 10px;
    }
    
    .flex-container {
      display: flex;
      justify-content: space-between;
    }
    
    .section-container {
      flex: 1;
      margin-right: 20px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    
    .camera-container {
      height: 300px; /* Adjust height as needed */
    }
    
    .no-camera-error {
      color: red;
      font-weight: bold;
    }
    
    @media (max-width: 768px) {
      .flex-container {
        flex-direction: column;
      }
      
      .section-container {
        margin-bottom: 20px;
        margin-right: 0;
      }
    }
    .center-image {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin-bottom: 20px; /* Optional margin below the image */
}


.approve-button {
  margin-top: 20px;
  padding: 10px 20px;
  border: 2px solid #007bff; /* Border style */
  border-radius: 5px;
  background-color: transparent;
  color: #007bff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
.modal-content-left, .modal-content-right {
  flex: 1;
  white-space: pre-line;
  overflow: auto;
}.modal-content-container {
  display: flex;
}

.large-button {
    font-size: 20px;
    padding: 8px 125px;
    /* Additional styling for a larger button */
}

    </style>  