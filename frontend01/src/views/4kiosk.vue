<template>
  <div class="container">
    <div>
      <h2>Pag cash in sa Balance</h2>
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
      <div v-if="showPopup" class="alert alert-danger" role="alert">
        Sorry, not enough coins for topup. Please insert more coins.
      </div>
      <div class="container-two">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <form @submit.prevent="topup">
              <div class="form-group">
                <label for="unit">Ibutang ang imong Unit:</label>
                <select v-model="selectedUnit" class="form-control" id="unit" name="unit" required>
                  <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.unit_info }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="amt">Kantidad nga Gi hulog sa coin slot:</label>
                <input v-model="amount" type="number" class="form-control" id="amt" name="amt" placeholder="Ipasulod ang kantidad" required readonly>
              </div>
              <button type="submit" class="btn btn-primary">I cash in</button>
            </form>
          </div>
        </div>
        <br>  
      </div>
    </div>
    <!-- Camera part -->
    <div class="container-md" style="position: flex; top: 0; right: 0; width:400px;height: 300px;">
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
    <!-- End of Camera part -->
  </div>
  <div class="container-three">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Unit</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions.slice(0, 10).reverse()" :key="transaction.id">
          <td>{{ transaction.id }}</td>
          <td>{{ transaction.unitid }}</td>
          <td>{{ transaction.amount }}</td>
          <td>{{ transaction.date_of_payment }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

    
<script>
  import { ref, toHandlers, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { QrcodeStream } from 'vue-qrcode-reader';
  import 'jspdf-autotable';
  import axios from 'axios'
  const authenticated = ref(false)
  const route = useRoute()
  const router = useRouter()

  
  export default {
    components: { QrcodeStream },
      data() {
          return {
              units: [],
              selectedBranch:'market',
              showPopup: false,
              selectedUnit:'',
              amount: '',
        success: '',
        error: '',
        transactions: [],
        isValid: undefined,
      paused: false,
      result: null
          };
      },
      computed: {
    validationPending() {
      return this.isValid === undefined && this.paused
    },

    validationSuccess() {
      return this.isValid === true
    },

    validationFailure() {
      return this.isValid === false
    }
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

    try {
        const response = await axios.get(`http://127.0.0.1:9000/api/check-unit/motorela?unit_info=${detectedWrCode}`);

        if (!response.data.exists) {
            this.error = `Unit with QR code "${detectedWrCode}" is not a Motorela unit.`;
            return;
        }

        const confirmation = window.confirm(`Detected QR Code: ${detectedWrCode}. Do you want to accept it?`);

        if (confirmation) {
            const newCodes = detectedStrings.filter(code => !this.detectedCodes.includes(code));

            if (newCodes.length === 0) {
                alert('QR Code already scanned. Please scan a different QR Code.');
                return;
            }

            const paymentResponse = await axios.get(`http://127.0.0.1:9000/payment-details?unit_info=${detectedWrCode}`);


            
                const paymentDetails = paymentResponse.data;
                console.log('payment:',paymentDetails);
                this.openModal(paymentDetails);
            

            // this.openModal(`QR Code accepted: ${detectedWrCode}`);

            this.detectedCodes.push(...newCodes);
            this.saveDetectedCodesToLocalStorage();

            
        }

        this.selectedUnit = this.units.find(unit => unit.unit_info === detectedWrCode);

        if (!this.selectedUnit) {
            this.error = `Unit with QR code "${detectedWrCode}" not found.`;
            return;
        }

      

        this.qrCodeKey += 1;
    } catch (error) {
        console.error('An error occurred:', error);
        this.error = 'An error occurred. Please try again.';
    }
  },
  onError: console.error,

  resetValidationState() {
    this.isValid = undefined
  },
      async onDetect([firstDetectedCode]) {
      this.result = firstDetectedCode.rawValue
      this.paused = true

      // pretend it's taking really long
      await this.timeout(3000)
      this.isValid = this.result.startsWith('http')

      // some more delay, so users have time to read the message
      await this.timeout(2000)
      this.paused = false
    },
        onCameraOn() {
      this.loading = false
    },
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
      this.amount = response.data.inserted_coins;
      if (this.amount < 5) {
      this.showPopup = true;
      this.amount = 0;
    }else if(this.amount > 5){
        this.showPopup = false;
        this.amount = response.data.inserted_coins;
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
  
    let data = {
      selectedBranch: this.selectedBranch,
      selectedUnit: this.selectedUnit,
      unit_type: unit.unit_type,
      amount: this.amount,
      teller: this.teller.id,
    };
  
    axios.post('http://127.0.0.1:9000/kiosktopup', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
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
  } ,fetchRecentTransactions() {
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
    width: 500px;
    height: 500px;
    margin-top: 50px;
    background-color: white; /* White background */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* Gray shadow */
    padding: 20px; /* Add padding for spacing */
    border-radius: 5%;
  }
  .container-three {
  width: 350px;
  margin-top: -435px;
  margin-left: -400px;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 5%;
}
  h2{
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
  }
  label{
    margin-bottom: 10px;
    text-transform: uppercase;
    font-size: small;
    font-weight: bold;
    margin-top: 20px;
  }
  .btn{
    background-color: #4CAF50; /* Green background */
    border: none; /* Remove borders */
    color: white; /* White text */
    padding: 10px 35px; /* Padding */
    text-align: center; /* Center text */
    text-decoration: none; /* Remove underline */
    display: inline-block; /* Make the button a block element */
    font-size: 16px; /* Font size */
    border-radius: 20px; /* Rounded corners */
    cursor: pointer; /* Add cursor pointer */
    transition: background-color 0.3s ease;
    margin-top: 10px;
    margin-left: 50px;
    text-transform: uppercase;
  }
  .btn:hover{
    background-color: #04791e;
    padding: 12px 37px;
  }
    </style>
