
<template>
  <main class="mt-1 p-5 md:px-[5%] lg:px-[15%] bg-slate-100">
    <div class="bg-white rounded-[10px] p-5">
      <RouterLink to="/homeTeller">
        <Button icon="pi pi-arrow-left" label="Go Back" text class="mb-2" />
      </RouterLink>
      <p class="text-red-500">{{ scannerError }}</p>
      <div
        v-if="error"
        class="text-red-500 mt-3 relative bg-red-100 p-5 text-center rounded-[10px] text-[14px] font-light"
        role="alert"
      >
        <i
          @click="clearError"
          class="pi pi-times-circle text-red-500 text-[18px] absolute top-1 right-1 cursor-pointer"
        ></i>
        {{ error }}
      </div>
      <div
        v-if="success"
        class="text-green-500 mt-3 relative bg-green-100 p-5 text-center rounded-[10px] text-[14px] font-light"
        role="alert"
      >
        <i
          @click="clearSuccess"
          class="pi pi-times-circle text-green-500 text-[18px] absolute top-1 right-1 cursor-pointer"
        ></i>
        {{ success }}
      </div>
      <div class="grid md:grid-cols-[350px,1fr] gap-5">
        <div class="md:p-3 w-full grid grid-rows-[1fr,auto]">
          <qrcode-stream
            class="bg-slate-100 rounded-[10px]"
            :key="qrCodeKey"
            :constraints="{
              deviceId: selectedDevice ? selectedDevice.deviceId : null,
            }"
            @error="onScannerError"
            @detect="onDetect"
            v-if="selectedDevice !== null"
          />
          <p v-else class="no-camera-error">
            No cameras available on this device
          </p>
          <div>
            <div class="mt-3 w-full">
              <select v-model="selectedDevice" class="h-[45px] w-full border rounded hover:border-slate-400 outline-none border-slate-200">
                <option disabled value="">Select Camera</option>
                <option v-for="device in devices" :key="device.deviceId" :value="device">{{ device.label }}</option>
              </select>
            </div>
            <Button
              type="submit"
              @click="generateAndDownloadPDF"
              label="Generate PDF Report"
              icon="pi pi-file-pdf"
              severity="success"
              class="mt-3 w-full"
            />
            <Button
              type="submit"
              @click="clearDetectedCodes"
              label="Reset Scanned Data"
              icon="pi pi-refresh"
              severity="danger"
              outlined
              class="mt-3 w-full"
            />
          </div>
        </div>
        <form @submit.prevent="onFormSubmit" class="mt-5 md:mt-0">
          <h1 class="text-[20px]">Motorela Payment</h1>
          <div class="grid mt-3">
            <label>Body Number</label>
            <select v-model="selectedUnit" class="h-[45px] w-full md:max-w-[400px] border rounded hover:border-slate-400 outline-none border-slate-200" id="unit" name="unit" required>
              <option v-for="unit in filteredUnits" :key="unit.id" :value="unit">{{ unit.unit_info }}</option>
            </select>
          </div>
          <div class="grid mt-3">
            <label>Branch</label>
            <InputText
              v-model="selectedBranch"
              class="w-full md:max-w-[400px]"
              placeholder="Toll-Booth"
              value="Toll-Booth"
              required
              readonly
            />
          </div>
          <div class="mt-3 grid">
            <label for="">Payment Date</label>
            <input
              v-model="date"
              type="date"
              class="h-[45px] border border-slate-200 px-2 rounded outline-none md:max-w-[400px]"
              id="date"
              name="date"
              required
              readonly
            />
          </div>
          <div class="grid gap-5 mt-3 md:max-w-[400px]">
            <Button
              type="submit"
              @click="deduct"
              label="Payment"
              icon="pi pi-money-bill"
              severity="success"
              class=""
            />
            <Button
              type="submit"
              @click="confirmTransaction"
              label="Manually Payment"
              icon="pi pi-money-bill"
              severity="success"
              class=""
            />
          </div>
        </form>
        <Dialog header="Confirm Transaction" modal v-model:visible="showConfirmModal">
    <p>Please confirm to continue your transaction.</p>
    <div class="flex justify-end mt-4">
      <Button label="Cancel" class="p-button-text" @click="showConfirmModal = false" />
      <Button label="Confirm" class="p-button-danger" @click="manual" />
    </div>
  </Dialog>
      </div>
      <div class="p-5 bg-slate-100 mt-3 shadow rounded">
        <table class="table w-full">
  <thead>
    <tr>
      <th>
        <strong class="text-[40px]">Motorela</strong>
        <span class="ml-4 text-green-500">
          Paid: {{ totalPaidUnits }}
        </span>
        <span class="ml-4 text-red-500">
          Delinquent: {{ totalDelinquentUnits }}
        </span>
        <span class="ml-4 text-gray-700">
          Total: {{ totalUnits }}
        </span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <template v-if="showMotorela">
           <table class="w-full">
            <tbody>
              <div class="flex gap-2 flex-wrap"> 
                <tr v-for="unit in sortedUnits" :key="unit.id">
                  <td
                    :class="{
                      'bg-green-400 text-white p-2': unit.has_toll_payment_today,
                      'bg-red-400 text-white p-2': unit.has_delinquency_unpaid,
                    }"
                  >
                    {{ unit.unit_info }}
                  </td>
                </tr>
              </div>
            </tbody>
          </table>
        </template>
      </td>
    </tr>
  </tbody>
</table>
      </div>
    </div>
    <Dialog
    v-model:visible="showModal"
    modal
    header="Edit Profile"
    class="md:w-[500px]"
  >
    <div class="">
      <img
        :src="modalImage"
        alt="Unit Picture"
        class="md:h-[300px] bg-slate-100"
      />
      <br />
      <p>Body Number: {{ ModalUnit }}</p>
      <p>Balance: {{ Balance }}</p>
      <p>Unit Type: {{ unit_type }}</p>
      <div class="grid grid-cols-2 my-3">
        <div>
          {{ modalContent }}
        </div>
        <div>
          {{ payment }}
        </div>
      </div>
      <Button
        @click="closeModal"
        label="Approve"
        icon="pi pi-check"
        severity="success"
        class="w-full"
      />
    </div>
  </Dialog>
  </main>
</template>
<script>
  import logos from './base64-logos.json';
  import { ref, onMounted } from 'vue';
  import { QrcodeStream } from 'vue-qrcode-reader';
  import axios from 'axios';
  import * as XLSX from 'xlsx';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import DatePicker from 'vue3-datepicker';
  import { RouterLink } from 'vue-router';
  export default {
    name: 'PaymentWithQRScanner',
    components: {
      QrcodeStream,
      
    },
    data() {
      
      return {
        units: [],
        selectedUnit: '',
        selectedBranch: 'Toll-Booth',
        date: '',
        error: '',
        success: '',
        scannerError: '',
        qrCodeKey: 0,
        selectedDevice: null,
        devices: [],
        detectedCodes: [],
        showMotorela: true,
        showModal: false,
        showConfirmModal: false,
        modalContent: '',
      delinquencies: []
        
      };
    },
    mounted() {
    
      this.updateDate(); // Update the date every 2 seconds
      this.fetchDelinquencies();
      setInterval(() => {
        this.fetchDelinquencies();
      }, 2000); 
      this.fetchUnits();
      setInterval(() => {
        this.fetchUnits();
      }, 2000);},
    created() {
      this.fetchUnits();
  this.enumerateDevices();
  const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to midnight
          const localDate = today.toISOString().split('T')[0];
  this.date = localDate

  const savedDetectedCodes = localStorage.getItem('detectedCodesMotorela');
  if (savedDetectedCodes) {
    this.detectedCodes = JSON.parse(savedDetectedCodes);
  } else {
    this.detectedCodes = []; 
  }

  this.clearLocalStorageAtMidnight();
  this.fetchDelinquencies();
    }, beforeDestroy() {
    
    clearInterval(this.clearLocalStorageInterval);
  },
    setup(){
      const teller = ref({ id: null, username: '', first_name: '', last_name: '' })

  axios.get('https://qrmcpass.loca.lt/Teller', {
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
    computed: { totalPaidUnits() {
    return this.sortedUnits.filter(unit => unit.has_toll_payment_today).length;
  },
  totalDelinquentUnits() {
    return this.sortedUnits.filter(unit => unit.has_delinquency_unpaid).length;
  },
  totalUnits() {
    return this.sortedUnits.length;
  },
  sortedUnits() {
          return this.filteredUnits.slice().sort((a, b) => a.id - b.id);
      },
    getUniqueUnitTypes() {
      return [...new Set(this.units.map(unit => unit.unit_type))];
    },
    getUnitsByType() {
      return (type) => this.units.filter(unit => unit.unit_type === type);
    }, filteredUnits() {
      return this.units.filter(unit => unit.unit_type === 'motorela');
    }
  },
    methods: {   confirmTransaction() {
      // Close the initial modal and open the confirmation modal
      this.showModal = false;
      this.showConfirmModal = true;
    },proceedTransaction() {
      // Handle the confirmed transaction here
      this.showConfirmModal = false;
      this.manual(); // Call the topup method to proceed
    },


      openModal(unit) {
    
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
      updateDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(today.getDate()).padStart(2, '0');
      this.date = `${year}-${month}-${day}`;
      console.log(this.date);
  },
  generateAndDownloadPDF() {
    // Create a new PDF document
    const doc = new jsPDF();
    // Add an image to the PDF
    // Set the header with centered text
    doc.addImage(logos.citylogo, 'PNG', 18,14, 15, 15);
    doc.setFontSize(10);
    doc.addImage(logos.ceedmologo, 'PNG', 36,14, 15, 15);
    doc.setFontSize(10);
    doc.addImage(logos.qrlogo, 'PNG', 180,14, 15, 15);
    doc.setFontSize(10);
    const pageWidth = doc.internal.pageSize.getWidth();

    let text99 = 'Province Of Bukidnon';
    let text99X = (pageWidth - doc.getTextWidth(text99)) / 2;
    doc.text(text99, text99X, 15);
    let text1 = 'City Government of Malaybalay';
    let text1X = (pageWidth - doc.getTextWidth(text1)) / 2;
    doc.text(text1, text1X, 20);

    let text2 = 'City Economic Enterprise Development and Management Office';
    let text2X = (pageWidth - doc.getTextWidth(text2)) / 2;
    doc.text(text2, text2X, 25);
    let text9 = 'Collection Office';
    let text9X = (pageWidth - doc.getTextWidth(text9)) / 2;
    doc.text(text9, text9X,30);
    let text0 = 'Public Market Building, Barangay 9, Malaybalay City, Bukidnon';
    let text0X = (pageWidth - doc.getTextWidth(text0)) / 2;
    doc.text(text0, text0X, 35);
    

    doc.setFontSize(12);
    let headerText = 'Daily Motorela Collection Report';
    let headerTextX = (pageWidth - doc.getTextWidth(headerText)) / 2;
    doc.text(headerText, headerTextX, 80)

    doc.setFontSize(12);
    const leftMargin = 10; // Left margin
const rightMargin = 10; // Right margin
const docWidth = pageWidth - leftMargin - rightMargin; // Total width available after margins

let dateText = `Date: ${new Date().toLocaleDateString()}`;
let dateTextWidth = doc.getTextWidth(dateText);

// X position considering the right margin
let dateTextX = pageWidth - dateTextWidth - rightMargin; 
let dateTextY = 60; // Y-coordinate where the text should appear

// Apply text to the document
doc.text(dateText, dateTextX, dateTextY);


const minCellWidth =20; 
const columns = Math.floor(docWidth / minCellWidth); 
const cellWidth = docWidth / columns; 
const cellHeight = 10; 

// Define initial position for table
let startX = 10;
let startY = 90 + (cellHeight / 2); // Start at the center of the cell height

// Variables to calculate total collected and count of delinquencies
let totalCollected = 0;
let delinquencyCount = 0;
let count = 0;
let delcount = 0;
let totalUnits = 0; 
// Loop through sortedUnits and add each unit to the table
this.sortedUnits.forEach((unit, index) => {
    let status = '';
    let color = '';
    let textclr = '';

    if (unit.has_toll_payment_today) {
        status = 'Payment Done';
        color = '#90ee90'; // Green
        totalCollected += 6;
        count ++;
    } else if (unit.has_delinquency_unpaid) {
        status = 'Delinquency Unpaid';
        color = '#FF0000';
        textclr = '#FFFF';
        delinquencyCount+= 6;
        delcount ++;
    } else {
        status = 'No Payment/Delinquency';
        color = '#fff'; // Default
    }

    // Set fill and text color for each cell
    doc.setFillColor(color);
    doc.setTextColor(textclr);
    doc.rect(startX, startY - (cellHeight / 2), cellWidth, cellHeight, 'F');
    doc.setTextColor(0); // Reset to black for text

    // Display unit info
    if (unit.unit_info) {
        doc.text(unit.unit_info, startX + 2, startY + 2);
    }

    // Draw cell outline
    doc.rect(startX, startY - (cellHeight / 2), cellWidth, cellHeight);

    // Move to the next column
    startX += cellWidth;

    // Move to the next row after reaching the calculated number of columns
    if ((index + 1) % columns === 0) {
        startX = 10; // Reset to left margin
        startY += cellHeight; // Move down by cell height
    }
    totalUnits++;
});

    doc.setFontSize(12);
 // Set initial coordinates for positioning
const labelX = 100; 
const labelxy = 130;      // X position for labels
const countX = 160;       // X position for count values
const amountX = 180;      // X position for amount values
const headerY = startY + 30;  // Y position for the header row
const lineSpacing1 = 5;   // Spacing between lines

// Headers
doc.setFontSize(12);
doc.text("Total Number of Motorela", labelxy, headerY);
doc.text("Total Amount", amountX, headerY);

// Values
doc.setFontSize(10);
doc.text(`Total number of payments:`, labelX, headerY + lineSpacing1 * 2);
doc.setFont("helvetica", "bold"); // Set font to bold
doc.text(`${count}`, countX, headerY + lineSpacing1 * 2);
doc.text(`${totalCollected}`, amountX, headerY + lineSpacing1 * 2);
doc.setFont("helvetica", "normal");

doc.text(`Total number of delinquents:`, labelX, headerY + lineSpacing1 * 4);
doc.setFont("helvetica", "bold"); // Set font to bold
doc.text(`${delcount}`, countX, headerY + lineSpacing1 * 4);
doc.text(`${delinquencyCount}`, amountX, headerY + lineSpacing1 * 4);
doc.setFont("helvetica", "normal");

doc.text(`Overall total amount:`, labelX, headerY + lineSpacing1 * 6);
doc.setFont("helvetica", "bold"); // Set font to bold
doc.text(`${count+delcount}`, countX, headerY + lineSpacing1 * 6);
doc.text(`${totalCollected + delinquencyCount}`, amountX, headerY + lineSpacing1 * 6);
doc.setFont("helvetica", "normal");

 
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 10; // Margin from the bottom-right corner
const lineSpacing = 8; // Space between lines

// Define the text positions
const startXy = pageWidth - 60; // Adjust X position based on available space
const startYx= pageHeight - margin - 30; // Adjust Y position for the text block

// Draw "Prepared by:" and name
doc.text("Prepared by:", startXy, startYx);
const nameX = startXy + doc.getTextWidth("Prepared by: ") + 2; // Position name next to "Prepared by:"
doc.text(`${this.teller.first_name} ${this.teller.last_name}`, nameX, startYx);

// Underline the name
const nameWidth = doc.getTextWidth(`${this.teller.first_name} ${this.teller.last_name}`);
doc.line(nameX, startYx + 1, nameX + nameWidth, startYx + 1); // Adjust Y for underline position

// Draw "Collection Officer" below the name
doc.text("Collection Officer", nameX, startYx + lineSpacing);

// Draw "Approved by:" below "Collection Officer"
doc.text("Approved by:", startXy, startYx + lineSpacing * 3);


    // Save the PDF with a filename based on the current date
    const filename = `Motorela_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
}


,
      clearError() {
        this.error = '';
      },
      clearSuccess() {
        this.success = '';
      }, clearDetectedCodes() {
      localStorage.removeItem('detectedCodesMotorela');
      this.detectedCodes = []; // Clear the detected codes array in the component
    },
      saveDetectedCodesToLocalStorage() {
  localStorage.setItem('detectedCodesMotorela', JSON.stringify(this.detectedCodes));
  }, fetchDelinquencies() {
        axios.get('https://qrmcpass.loca.lt/admin/delinquencies/motorela/daily', {
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
      fetchUnits() {
        axios.get('https://qrmcpass.loca.lt/unitpaid', {
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
      },clearLocalStorageAtMidnight() {
      
    
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
    unit_type: this.selectedUnit.unit_type,
    date: this.date,
    selectedBranch: this.selectedBranch,
    amount: amount,
    
    teller: this.teller.id,
  };

  console.log('data to be sent:', data);

  axios.post('https://qrmcpass.loca.lt/deduct', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
        'X-Frontend-URL': window.location.href,
        'X-Forwarded-For': window.ipAddress, 
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
  }, manual() {
    
        if (!this.selectedUnit) {
        this.error = 'Please select a unit';
        return;
      }
      this.showConfirmModal = false;
      let unitType = this.selectedUnit.unit_type;
      let amount = unitType === 'multicab' ? 11 : (unitType === 'motorela' ? 6 : 0);
      
      let data = {
        unit_id: this.selectedUnit.id,
        unit_type: this.selectedUnit.unit_type,
        date: this.date,
        selectedBranch: this.selectedBranch,
        amount: amount,
        
        teller: this.teller.id,
      };
      
      console.log('data to be sent:', data);
      
      axios.post('https://qrmcpass.loca.lt/manualpay', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        'X-Frontend-URL': window.location.href,
        'X-Forwarded-For': window.ipAddress, 
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
        const response = await axios.get(`https://qrmcpass.loca.lt/api/check-unit/motorela?unit_info=${detectedWrCode}`);

        if (!response.data.exists) {
            this.error = `Unit with QR code "${detectedWrCode}" is not a Motorela unit.`;
            return;
        }

      
            const newCodes = detectedStrings.filter(code => !this.detectedCodes.includes(code));

            if (newCodes.length === 0) {
                alert('QR Code already scanned. Please scan a different QR Code.');
                return;
            }

            const paymentResponse = await axios.get(`https://qrmcpass.loca.lt/payment-details?unit_info=${detectedWrCode}`);


                const paymentDetails = paymentResponse.data;
                console.log('payment:',paymentDetails);
                this.openModal(paymentDetails);
            

            // this.openModal(`QR Code accepted: ${detectedWrCode}`);

            this.detectedCodes.push(...newCodes);
            this.saveDetectedCodesToLocalStorage();

            
        

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

      generateExcel() {

  const data = [

    ['Unit ID', 'Date of Payment'],


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
    
  generateReportWithQRAndDelinquency() {
    // Get today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `Motorela booth qrcodes and delinquencies report for ${currentDate}.pdf`;

    // Prepare data for PDF
    const data = [
      `Province of Bukidnon`,
      `City of Malaybalay`,
      `Market Site Brgy 9,Malaybalay City Bukidnon`,
      `City Economic Enterprise Development and Management Office`,
      `CEEDMO Motorela Booth`,
      ``,
      ``,
      // Header for Today's Report
      `Today's Report -                                                            ${formattedDate}`,
      ``,
      ``,
      // Title for the report
      'Motorela QR Codes and Delinquencies',
      ``,
      ``,
      // Headers for QR codes
      'Index, QR Code Value',
      ...this.detectedCodes.map((code, index) => `${index + 1}, ${code}`),
      ``,
      // Headers for delinquency data
      'Unit ID, Date of Payment',
      ...this.delinquencies.map(delinquency => `${delinquency.unit_id}, ${delinquency.date_of_payment}`),
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      // Names at the bottom
      `Prepared by:`,
      ``,
      ``,
      `Verified by:`,
      ``,
      ``,
      `Approved by:`,
      ``
    ];

    // Create a new PDF document
    const doc = new jsPDF();
    doc.text(data, 10, 10);

    // Save the PDF file
    doc.save(filename);
  },
  resetScannedData() {
      // Clear the detected QR codes array
      this.detectedCodes = [];

      // Clear the detected QR codes from local storage
      localStorage.removeItem('detectedCodesMotorela');
    },


    },
  };
  </script>     
