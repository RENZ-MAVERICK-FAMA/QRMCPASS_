
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
              <label for="unit">Select Body Number:</label>
              <select v-model="selectedUnit" class="form-control" id="unit" name="unit" required>
    <option v-for="unit in filteredUnits" :key="unit.id" :value="unit">{{ unit.unit_info }}</option>
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
          <div class="container">
      <h2>Delinquencies</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Unit ID</th>
            <th>Date of Payment</th>
            <!-- Add more table headers as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(delinquency, index) in delinquencies" :key="index">
            <td>{{ delinquency.unit_id }}</td>
            <td>{{ delinquency.date_of_payment }}</td>
            <!-- Add more table cells to display additional delinquency data -->
          </tr>
        </tbody>
      </table>
    </div>
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
  
          <!-- <button @click="generateExcel" class="generate-btn">Generate Report</button> -->
          <button @click="generateReportWithQRAndDelinquency" class="generate-btn">Generate QR Codes and Delinquencies Report</button>
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
              <span v-for="unit in getUnitsByType('multicab')" :key="unit.id">{{ unit.unit_info }}</span>
            </div>
                </tbody>
              </table>
            </template>
          </td>
        
        </tr>
      </tbody>
    </table>
    <button @click="resetScannedData" class="btn btn-danger">Reset Scanned Data</button>
  </div>
  </template>
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
    <option v-for="unit in filteredUnits" :key="unit.id" :value="unit">{{ unit.unit_info }}</option>
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
          <div class="container">
      <h2>Delinquencies</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Unit ID</th>
            <th>Date of Payment</th>
            <!-- Add more table headers as needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(delinquency, index) in delinquencies" :key="index">
            <td>{{ delinquency.unit_id }}</td>
            <td>{{ delinquency.date_of_payment }}</td>
            <!-- Add more table cells to display additional delinquency data -->
          </tr>
        </tbody>
      </table>
    </div>
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
  
          <!-- <button @click="generateExcel" class="generate-btn">Generate Report</button> -->
          <button @click="generateReportWithQRAndDelinquency" class="generate-btn">Generate QR Codes and Delinquencies Report</button>
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
              <span v-for="unit in getUnitsByType('multicab')" :key="unit.id">{{ unit.unit_info }}</span>
            </div>
                </tbody>
              </table>
            </template>
          </td>
        
        </tr>
      </tbody>
    </table>
    <button @click="resetScannedData" class="btn btn-danger">Reset Scanned Data</button>
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
            showMulticab: true,
        showMulticab: true,
        delinquencies: []
            
        };
        },
        created() {
        this.fetchUnits();
        this.enumerateDevices();
        this.date = new Date().toISOString().substring(0, 10);
        const savedDetectedCodes = localStorage.getItem('detectedCodesMulticab');
    if (savedDetectedCodes) {
        this.detectedCodes = JSON.parse(savedDetectedCodes);
    }
    this.clearLocalStorageAtMidnight();
    this.fetchDelinquencies();
        },
        beforeDestroy() {
    
    clearInterval(this.clearLocalStorageInterval);
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
        }, filteredUnits() {
        return this.units.filter(unit => unit.unit_type === 'multicab');
        }
    },
        methods: {
        clearError() {
            this.error = '';
        },
        clearSuccess() {
            this.success = '';
        },
        saveDetectedCodesToLocalStorage() {
    localStorage.setItem('detectedCodesMulticab', JSON.stringify(this.detectedCodes));
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
        },clearLocalStorageAtMidnight() {
      // Check and clear local storage every midnight
      this.clearLocalStorageInterval = setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
          localStorage.removeItem('detectedCodesMulticab');
          this.detectedCodesMulticab = []; // Optionally, clear the detectedCodes array in the component
        }
      }, 60000); // Check every minute
        },
        deduct() {
            
        if (!this.selectedUnit) {
        this.error = 'Please select a unit';
        return;
    }

    let unitType = this.selectedUnit.unit_type;
    let amount = unitType === 'Multicab' ? 6 : (unitType === 'multicab' ? 11 : 0);
    
    let data = {
        unit_id: this.selectedUnit.id,
        unit_type: this.selectedUnit.unit_type,
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

    // Assuming the detected QR code value is the unit's wr_code attribute
    const detectedWrCode = detectedStrings[0]; // Assuming only one QR code is detected

    // Query the database to check if the unit_info exists for Multicab units
    const response = await axios.get(`http://127.0.0.1:9000/api/check-unit/multicab?unit_info=${detectedWrCode}`);

    if (!response.data.exists) {
        this.error = `Unit with QR code "${detectedWrCode}" is not a Multicab unit.`;
        return;
    }

    const confirmation = window.confirm(`Detected QR Code: ${detectedWrCode}. Do you want to accept it?`);

    if (confirmation) {
        // Check if the detected QR code has already been scanned
        const newCodes = detectedStrings.filter(code => !this.detectedCodes.includes(code));
        if (newCodes.length === 0) {
        alert('QR Code already scanned. Please scan a different QR Code.');
        return;
        }

        // Add new detected codes to the list
        this.detectedCodes.push(...newCodes);

        // Save detected codes to local storage
        this.saveDetectedCodesToLocalStorage();

        // Find the unit in the dropdown options that matches the detected QR code value
        this.selectedUnit = this.units.find(unit => unit.unit_info === detectedWrCode);

        // If unit is not found, show an error message
        if (!this.selectedUnit) {
        this.error = `Unit with QR code "${detectedWrCode}" not found.`;
        return;
        }

        // Additional logic can be added here, such as saving the QR codes
        const saveResponse = await axios.post('http://127.0.0.1:8000/api/record-scan', {
        codes: newCodes,
        });
        console.log('QR codes saved successfully:', saveResponse.data);
    }

    // Increment the key to force re-rendering of the QR code scanner component
    this.qrCodeKey += 1;
    },
    generateExcel() {
// Prepare data for Excel
const data = [
  // Headers
  ['Unit ID', 'Date of Payment'],

  // Delinquency data
  ...this.delinquencies.map(delinquency => [
    delinquency.unit_id,
    delinquency.date_of_payment
  ])
];

// Create a new workbook
const wb = XLSX.utils.book_new();

// Add the data to a new worksheet
const ws = XLSX.utils.aoa_to_sheet(data);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(wb, ws, 'Delinquencies');

// Generate the Excel file
const filename = 'delinquencies_report.xlsx';
XLSX.writeFile(wb, filename);
},
    fetchDelinquencies() {
    axios.get('http://127.0.0.1:9000/delinquencies/multicab', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then((response) => {
      this.delinquencies = response.data.delinquencies;
    })
    .catch((error) => {
      console.error('Error fetching delinquencies:', error);
    });
  },
  generateReportWithQRAndDelinquency() {
// Get today's date
const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// Prepare data for Excel
const data = [
[`Province of Bukidnon`],
[`City of Malaybalay`],
[`Market Site Brgy 9,Malaybalay City Bukidnon`],
[`City Economic Enterprise Development and Management Office`],
[`CEEDMO Multicab Booth`],
[],
  [],
  // Header for Today's Report
 [`Today's Report -                                                            ${formattedDate}`],

  // Empty row for separation
  [],
  [],
  

  // Title for the report
  ['Multicab QR Codes and Delinquencies'],

  // Empty row for separation
  [],

  // Headers for QR codes
  ['Index', 'QR Code Value'],

  // Detected QR codes
  ...this.detectedCodes.map((code, index) => [
    index + 1,
    code
  ]),

  // Empty row for separation
  [],

  // Headers for delinquency data
  ['Unit ID', 'Date of Payment'],
  ...this.delinquencies.map(delinquency => [
    delinquency.unit_id,
    delinquency.date_of_payment
  ]),

  // Empty row for separation
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  // Names at the bottom
  ['Prepared by:'],
  [],
  [],
  [`Verified by:`],
  [],
  [],
  [`Approved by:`],
  ['', '', '']
];

// Create a new workbook
const wb = XLSX.utils.book_new();

// Add the data to a new worksheet
const ws = XLSX.utils.aoa_to_sheet(data);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(wb, ws, 'QR Codes and Delinquencies');

// Generate the Excel file
const currentDate = new Date().toISOString().split('T')[0]; 
const filename = `Multicab booth qrcodes and delinquencies report for ${currentDate}.xlsx`;
XLSX.writeFile(wb, filename);
},
resetScannedData() {
    // Clear the detected QR codes array
    this.detectedCodes = [];

    // Clear the detected QR codes from local storage
    localStorage.removeItem('detectedCodesMulticab');
  },


  },
};
</script>

<style scoped>
.container{
  margin-top: 50px;
  background-color: white; /* White background */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5); /* Gray shadow */
  padding: 20px; /* Add padding for spacing */
  border-radius: 5%;
}
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
.btn, .generate-btn{
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
.btn:hover, .generate-btn:hover{
  background-color: #04791e;
  padding: 12px 37px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 20px;
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
th{
  text-transform: uppercase;
  font-weight: bold;
  font-size: medium;
  text-align: center;
}
td{
  text-transform: uppercase;
  font-weight: normal;
  font-size: medium;
  text-align: center;
}
</style>
