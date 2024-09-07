
   <template>
    <div class="container">
    
  
      <!-- QR Code Scanner Section -->
      <div class="row justify-content-center mt-5">
        <div class="col-md-6">
          <h1>QR Code Scanner</h1>
          <p>
             Pick the Camera:
            <select v-model="selectedDevice" class="camera-select">
              <option disabled value="">Select Camera</option>
              <option
                v-for="device in devices"
                :key="device.deviceId"
                :value="device"
              >
                {{ device.label }}
              </option>
            </select>
          </p>
          <p class="error">{{ scannerError }}</p>

          <div>
    <h2 align="center">Payment</h2>
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
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <form @submit.prevent="deduct">
            <div class="form-group">
              <label for="unit">Select Unit:</label>
              <select v-model="selectedUnit" class="form-control" id="unit" name="unit" required>
                <option v-for="unit in units" :key="unit.id" :value="unit">{{ unit.unit_info }}</option>
              </select>
            </div>
            <label for="branch">Branch:</label>
            <br>
            <input v-model="selectedBranch" name="branch" id="branch" value="market" placeholder="Market" required readonly >

            <!-- <select v-model="selectedBranch" name="branch" id="branch" required>
              <option value="market">Market</option>
            </select><br>  -->
            <div class="form-group">
              <label for="date">Payment Date:</label>
              <input v-model="date" type="date" class="form-control" id="date" name="date" required>
            </div>
            <button type="submit" class="btn btn-primary">deduct</button>
          </form>
        </div>
      </div>
    </div>

    
  </div>
  
          <p class="decode-result">
            Last results:
          </p>
  
          <table class="qr-code-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>QR Code Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(code, index) in detectedCodes" :key="index">
                <td style="width: 20px; height: 10px; border: 1px solid black;">{{ index + 1 }}</td>
                <td style="width: 100px; height: 10px; border: 1px solid black;">{{ code }}</td>
              </tr>
            </tbody>
          </table>
  
          <div class="camera-wrapper" style="position: absolute; top: 55px; right: 0; width:300px;height: 200px;">
    <qrcode-stream
        :key="qrCodeKey"
        :constraints="{ deviceId: selectedDevice ? selectedDevice.deviceId : null }"
        @error="onScannerError"
        @detect="onDetect"
        v-if="selectedDevice !== null"
    />
    <p v-else class="no-camera-error">No cameras available on this device</p>
</div>
<br>
  
          <button @click="generateExcel" class="generate-btn">Generate Report</button>
        </div>
      </div>
    </div>
    <div class="container">
    <!-- Table for Units -->
    <table class="table">
      <thead>
        <tr>
          <th><strong>Motorela</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <button @click="showMotorela = !showMotorela">Show Motorela</button>
            <template v-if="showMotorela">
              <table class="inner-table">
                <tbody>
                  <div class="unit-list">
              <span v-for="unit in getUnitsByType('motorela')" :key="unit.id">{{ unit.unit_info }}</span>
            </div>
                </tbody>
              </table>
            </template>
          </td>
        
        </tr>
      </tbody>
    </table>
  </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { QrcodeStream } from 'vue-qrcode-reader';
  import axios from 'axios';
  import * as XLSX from 'xlsx';
  
  export default {
    name: 'PaymentWithQRScanner',
    components: {
      QrcodeStream,
      
    },
    data() {
      return {
        units: [],
        selectedUnit: '',
        selectedBranch: '',
        date: new Date().toISOString().substring(0, 10),
        error: '',
        success: '',
        scannerError: '',
        qrCodeKey: 0,
        selectedDevice: null,
        devices: [],
        detectedCodes: [],
        showMotorela: true,
      showMulticab: true
        
      };
    },
    created() {
      this.fetchUnits();
      this.enumerateDevices();
      this.date = new Date().toISOString().substring(0, 10);
    },
    setup(){
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
    computed: {
    getUniqueUnitTypes() {
      return [...new Set(this.units.map(unit => unit.unit_type))];
    },
    getUnitsByType() {
      return (type) => this.units.filter(unit => unit.unit_type === type);
    }
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
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
          .then((response) => {
            console.log(response.data.units);
            this.units = response.data.units;
            this.fetchBalances();
          })
          .catch((error) => {
            console.error('Error fetching user units:', error);
          });
      },
      fetchBalances() {
        // Implement your logic for fetching balances here
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
    selectedBranch: this.selectedBranch,
    amount: amount,
    teller: this.teller.id,
  };

  console.log('data to be sent:', data);

  axios.post('http://127.0.0.1:9000/deduct', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Deduct response:', response.data);
    if (response.data.message === 'Balance deducted successfully') {
      this.selectedUnit = '';
      this.date = '';
      this.success = 'Deduct successful!';
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
},
      enumerateDevices() {
        onMounted(async () => {
          // Enumerate available devices
          this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(({ kind }) => kind === 'videoinput');
  
          if (this.devices.length > 0) {
            // If there are devices available, select the first one by default
            this.selectedDevice = this.devices[0];
          }
        });
      },
      onScannerError(error) {
        this.scannerError = error;
      },
      async onDetect(detectedQRCodes) {
  const detectedStrings = detectedQRCodes.map((code) => code.rawValue);
  const confirmation = window.confirm(`Detected QR Codes: ${detectedStrings.join(', ')}. Do you want to accept them?`);

  if (confirmation) {
    // Check if the detected QR code has already been scanned
    const newCodes = detectedStrings.filter(code => !this.detectedCodes.includes(code));
    if (newCodes.length === 0) {
        alert('QR Code already scanned. Please scan a different QR Code.');
        return;
    }

    // Add new detected codes to the list
    this.detectedCodes.push(...newCodes);

    // Assuming the detected QR code value is the unit's wr_code attribute
    const detectedWrCode = newCodes[0]; // Assuming only one QR code is detected

    // Find the unit in the dropdown options that matches the detected QR code value
    this.selectedUnit = this.units.find(unit => unit.unit_info === detectedWrCode);

    // If unit is not found, show an error message
    if (!this.selectedUnit) {
      this.error = `Unit with QR code "${detectedWrCode}" not found.`;
    } else {
      // Additional logic can be added here, such as saving the QR codes
      const saveResponse = await axios.post('http://127.0.0.1:8000/api/record-scan', {
        codes: newCodes,
      });
      console.log('QR codes saved successfully:', saveResponse.data);
    }
  }

  // Increment the key to force re-rendering of the QR code scanner component
  this.qrCodeKey += 1;
},

      generateExcel() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(this.detectedCodes.map((code, index) => ({ Index: index + 1, 'QR Code Value': code })));
        XLSX.utils.book_append_sheet(wb, ws, 'QR Codes');
        XLSX.writeFile(wb, 'detected_qr_codes.xlsx');
      },
    },
  };
  </script>
  
<style>
.inner-table td {
  width: auto;
  height: auto;
  padding: 5px;
}
.unit-list {
  display: flex;
  flex-wrap: wrap;
}

.unit-list span {


  border: 1px solid black;
  padding: 5px;
  width:60px;
}
</style>
  