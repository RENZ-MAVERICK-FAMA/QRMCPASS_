<template>
  <main class="p-5 md:px-[10%] bg-slate-100">
    <div class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px]">
      <RouterLink to="/officeteller">
        <div class="flex gap-5 h-[40px] items-center hover:text-slate-300">
          <i class="pi pi-arrow-left"></i>
          <span>Go Back</span>
        </div>
      </RouterLink>
     <DataTable
        showGridlines
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        class="mt-3"
        :value="filteredTransactions"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span>Recent Cash In</span>
            <InputText 
        v-model="searchQuery" 
        placeholder="Search..." 
        class="w-1/3 md:w-1/4"
      />
            <Button
              @click="showModal = true"
              label="Cash In"
              icon="pi pi-plus"
              severity="success"
              class="md:w-[200px]"
            />
          </div>
        </template>
        <template #empty>
          <div class="flex justify-center">
            <small class="font-extralight capitalize">no data found. </small>
          </div>
        </template>
        <Column header="Reference Number" field="reference" />
        <Column header="Body Number" field="unitid" />
        <Column header="Amount" field="amount" />
        <Column header="Date of Payment">
          <template #body="{ data }">
            {{ new Date(data.date).toISOString().split("T")[0] }}
          </template>
        </Column>
        <Column header="Time">
          <template #body="{ data }">
            {{
              new Date(data.date).toLocaleTimeString("en-US", {
                timeZone: "GMT",
              })
            }}
          </template>
        </Column>
        <Column header="Receipt" field="/">
  <template #body="{ data }">
    <td class="border border-slate-300 pl-[5px] font-light flex justify-center p-2">
      <!-- Pass only reference_key and unit_id to the method -->
      <Button 
        severity="success" 
        @click="generateReceipt(data.reference, data.unitid)" 
        icon="pi pi-file-pdf" 
        label="Receipt" />
    </td>
  </template>
</Column>

      </DataTable>
    </div>
  </main>
  <Dialog header="TOP UP" modal v-model:visible="showModal">
    <form @submit.prevent="topup" class="w-full md:w-[400px]">
      <div class="mt-3 grid">
        <label for="">Body Number</label>
        <Select
          v-model="selectedUnit"
          editable
          :options="units"
          optionValue="id"
          optionLabel="unit_info"
          placeholder="Select Unit"
        ></Select>
      </div>
      <div class="mt-3 grid">
        <label>Branch</label>
        <InputText
          v-model="selectedBranch"
          class="w-full md:max-w-[400px]"
          placeholder="Office"
          value="office"
          required
          readonly
        />
      </div>
      <div class="mt-3 grid">
        <label for="">Cash In</label>
        <InputNumber v-model="amount" required />
      </div>
      <Button
        type="button"
        icon="pi pi-check"
        severity="success"
        label="Confirm"
        class="mt-3 w-full"
        @click="confirmTransaction"
      />
    </form>
  </Dialog>

  <!-- Confirmation Modal -->
  <Dialog header="Confirm Transaction" modal v-model:visible="showConfirmModal">
    <p>Please enter your transaction password to confirm:</p>
    <div class="mt-4">
      <!-- Input field for transaction password -->
      <InputText 
        v-model="transactionPassword" 
        type="password" 
        placeholder="Enter Transaction Password" 
        class="w-full"
      />
      <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
    </div>
    <div class="flex justify-end mt-4">
      <Button label="Cancel" class="p-button-text" @click="showConfirmModal = false" />
      <Button 
        label="Confirm" 
        class="p-button-danger" 
        @click="validateTransactionPassword" 
      />
    </div>
  </Dialog>

  <!-- <Dialog modal v-model:visible="showSuccessModal">
    <div class="  bg-white justify-center items-center w-[400px]">

      <h2 class="text-green-600 uppercase font-extrabold text-4xl" icon="pi pi-check">Successfull Top Up!</h2>
      <Button
      label="close"
      icon="pi pi-times"
      text
      @click="showSuccessModal= false"
      />

      <img src="/src/assets/check-mark-svgrepo-com.svg" alt="" class="w-[150px]" >
    </div>

  </Dialog> -->
</template>
<script>
import { ref, toHandlers, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import jsPDF from 'jspdf';
import axios from "axios";

const authenticated = ref(false);
const route = useRoute();
const router = useRouter();

export default {
  data() {
    return {
      showModal: false,
      showConfirmModal: false,
      units: [],
      selectedBranch: "market",
       office: 'Office',
      selectedUnit: "",
      amount: "",
      success: "",
      error: "",
      transactions: [],
      searchQuery: '',
      transactionPassword: "",
      errorMessage: ''
      
      
    };
  },
  created() {
    this.fetchUnits();
  },
  setup() {
    const teller = ref({
      id: null,
      username: "",
      first_name: "",
      last_name: "",
    });

    axios
      .get("https://qrmcpass.loca.lt/Teller", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        teller.value = response.data;
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    return { teller };
  },
  computed: {
    reversedTransactions() {
      // return this.transactions.slice(0, 10).reverse();
       return this.transactions.slice(0, 10);
    }, filteredTransactions() {
      if (!this.searchQuery) return this.reversedTransactions;
      
      const query = this.searchQuery.toLowerCase();
      
      return this.reversedTransactions.filter(transaction => {
        return Object.values(transaction).some(value =>
          String(value).toLowerCase().includes(query)
        );
      });
    }
  },
  mounted() {
    this.fetchRecentTransactions();
    setInterval(() => {
      this.fetchRecentTransactions();
    }, 1000);
  },
  methods: { 
    async validateTransactionPassword() {
    this.errorMessage = ''; // Clear previous errors

    // Ensure password input is provided
    if (!this.transactionPassword) {
      this.errorMessage = 'Transaction password is required.';
      return;
    }

    try {
      // Send the password and teller ID to the backend for validation
      const response = await axios.post('https://qrmcpass.loca.lt/api/validate-transaction-password', {
        teller_id: this.teller.id, // Replace with dynamic teller ID
        transaction_password: this.transactionPassword,
      });

      if (response.data.success) {
        // Password validated successfully
        this.topup(); // Proceed with the transaction logic
        this.showConfirmModal = false; // Close the modal
      }
    } catch (error) {
      // Handle errors from the backend
      if (error.response && error.response.data && error.response.data.message) {
        this.errorMessage = error.response.data.message; // Show backend error message
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    }
  },
    generateReceipt(reference, unitid) {
    // Fetch the transaction and unit data using reference and unitid
    axios.get(`https://qrmcpass.loca.lt/api/transactions/${reference}/${unitid}`)
      .then(response => {
        const transaction = response.data.transaction;
        const unit = response.data.unit;

        // Format the date for the receipt
        const date = new Date(transaction.date_of_payment);
        const formattedDate = date.toISOString().split('T')[0];

        // Generate the filename for the receipt
        const filename = `${formattedDate}_${transaction.type.toLowerCase()}_receipt.pdf`;

        // Create a new PDF document
        const doc = new jsPDF({
          unit: 'mm',
          format: [90, 180]  // Width x Height in mm
        });
        let yPos = 10; // Initial Y position for text placement
        const logo  = "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b5gzZ85f/uVf3nr7bXv27X3jG9+otd64cePo6OjSpUsHBwd37do1e/bsVatWrVu3bmhoaO7cuaecdmqmpfDdH/9gaGDw7LPPXrJkyaZNm5555pnFixefe/a5DIw423dg///6X/+rVCp9/vOff+KpJ2fOnHn3vfcIV1x++eVPPfXUWWedpbV+/PHH165d+/Of/9xae8EFFwQqPnTsSGTUvY/+Zs+ePfPnz1+1atXdd9+dz+f37Nlz/fXXb9iwwfO8J598cvXq1c8999zpp58+f/78devWbdq06Ywzzli4cOH9991TLBa3bNmydu3aX//613v37v3Yxz6mgIaOH3300R07dnR1dV177bUPPvigEOLZp595z7vf6bruLbfcUigUtu7cUY/CXL7EHTlcGXvimaevf8fbNm/fNjQybAS78967Dxw4MH3qjCsuuexXt/8ql8tt27btmmuumTRp0g9+8IOR8thVV101efLkm2++mXPe0tKyatWq/fv3r3vqmQULFpx/3vkPPPRAo9GoVCrd3d1btmy56KKL5s2e97Of/6yvr+9tb3ubUmr9+vWHDhzobO8499xzP/+lL15yySXvf8/7E2a3bt/2q7t/feONN4Zx9OlPf/q+xx685Ve3lUqlvYcP7Tq4/+rrrhkaHJwyc/rO/XvuvPPOrq6uSy+9tL+//+GHH87lcidIkTUlH1KsptOJnjWLz0gquugWdKysstCcaalDm3eLFDlZXspRi2kwlVAlaIQi3Na3dd/IHtd1YaE1du7dPWfB3ECF1171hnPXnrd9546nnnmaSzG5p7tQKn7/hz9ItPrSV76sjAYonyk0wuAfv/ylz3zus9/53nf3HznwqU/fcNkVlw+NDO/eu+fL//SVM88+a/fePff95v5nnnv2/gd+s2jJ4q9+/WvD5bHPfv7zl1x22cZNm359992PP/nkU888k8nlvv3d786eO/cnP/vZ8Ojorb/4xfDo6D997WvXXndd/+Dg/iMH/GwmgRoYGvze92/6u89+5l++9c2RsdGvfv1ri5cueXHD+pc2b5rUPXnm7FkPPvzQ0+ueO+e88/7m7/5urFL59ne/62Uy/YOD3/7udy+74oof/OhHBw4d+vqNN0ZJ0tHV9a1vf/uBhx566plnZs2Z/chjjwZR+K1v/+ua00/76c0/e2nrpsjGsUpyhTwYtXW0L1y86IX1L/7zN27smjx5rFz+9V13Pbdu3aOPPXbbL34xODR00/e/X280PN//2c03N4KgWqtt2LjxnnvvPefcc3/8k5/s2bv3Rz/+sZBSG3PT97+/ZevWx594or2j46tf+9rpZ5zxuc9/PgjDX91++2mnn37jN74RxfEPfvSjsUplrFJ5dt06P5stlEqdkybVVZBovW3HjuWnnHLv/fcfOXbsq1//ehjHbV2d9/7m/q//8z8TY7PnzR0eHfHyWQVjGFUa9SnTpz3z3LOu7zmO03fkcBhHZ597zg9++MOd+/b8+t57SIpyvfbks8+s3/SSm8/2TJ1y4zf/5YGHH9q2Z9fS5Sd99ov/MDw2euM3/+W8iy649Re37dy767s3fY8Jvn7jhnUvPN8zpfeHP/7Rr+66ff/BAytWrfzbz/zdzt27fvPgA+dffNGtv/rl/r5D2WKhZ8a0BMaR/hPPPH3GuWcL3y20tiw+admLm1/q6p7c1T156ozpXIjWjva777lnz969N37jG6euXs2F2PjSS1/+ylemz5gxMjoqbDpnPy6HBEAQpAu2eulZDzxzt+/7DVMhSw53TEKeYTJyjdbcuJK5cFnVjnrFbJyE/aP9T7z4+KxzlxUTz8s4k7q7hkdHsn72oScfyeVyTAguZam11c9mp06f3t3b+9Ajj+QKhSVLlhmgFtUcz3v729/e29ubzWZHR0e7Jk+e1N197XXX9fX1GWDRkiVH+/sffPDBNWvWdPf2nrJyZazUoUOHstlsd2/PilUrX3zxxfQEMMb6jhxeuHhR7aa647nVeu3AoYO5Qn761BnXXd+Vd3IAGknDy2Te/d73FgoFrbWUUjjOrJlzeqdOrQeBn832Tp26ffv2o0eP3nzzzcKR9aDR2t523dVvvOs3d5108vJiS2nOvLn7Dux3PPeCiy4UQghHrjx11fadO351xx1tbW0H+/p27t79qzvuaG1vb4RhqlrQCMMwjhOtvUymxfcfeeyxWCk/6zHG1q5de9999w0MDNxwww1f+MIXhBD9/f2+72utfd/fvn37ihUrpkyZIoQol8vGmEWLFgkh7r//fsdxVq1a1dnZuXHjxmXLlmmtH3744SAIbrvttmw2u2/fvkSrpScta4TBwYMH58yZMzQynHGyCmpkbHT/wQODw0P9gwNcikndk+fMmzswMBBFcaz05J7eGbPmZPNFz80kRtdqDSndRYuW3PzTW84866ybb765pdD65GNPPfrQY2AERkf7j5284pSdu3eNjI06Rw4/v/7FtHiwc8/uhYsXzZ+3cP7CBX1Hj/T19f3rv/7r5MmTR0ZG4jhesWLF7t27Z82aVSgUrLW7d+/eunVro9FI3TODIJg9fbbjuR1dncroST3dBlbDdE6etH7DBl9mCGzfgf1Lly4FIFynZ+oU6Tozp82uVGpKmQMHDk2dOv2UU1YODw8fOzZw7733W2uZGUdwH591gQt4FmLO5PnTO2apuvG4a5VFwngkW1jb9PbZ7/2j9332Q5/79Ec+99a3vKsj310fCePIGGGe3/7c0doB5USaYe68mb+47ec/u+Vnt95yy+jwMFkbh2Ehl4vDcHR4+OILL/zXb37z3LPPHhkZUjb2HMcotW3Llj27dt179935bHbg2LFnn37605/61NHDh2HMr++449mnnz7/vPNUHIeNRsHNqThua2sLw/ClDRt/fcedq1as1IkK6o16tRYFYRxG9WqNE+ts75g5fUZlrHzPfXf/r7/4+PZdW4O4zgBHiOefe+6+e+7ZvnVrtVxub22N4iCJIsl5a6n07NNPn7J8eaFQWL169eKFi6w2pULRQHNizz+3buP6DTu375g1Y6YrHaP0pJYuR8gXn39h/959a0499eD+/S3F4vSpU8864wydJLNmzEhMZKFVHG/auPHXd9zxw+9/f/WqVcuXLVu0YEGxUFi6ZMkpJ5986OBBzlh35+SVK1ZkfH/ypElTentLxaIU4uTly++7997NmzYFjUY+lysWCo89+ui999yzaOHCtF4xOjLie155bIwRXXnFFUePHLnowgs72tsXLlhQzBeM0o6QcRhxYrVKte/YoTiOjh05emDf/tPXnBYFIVnUKtUkivP5fLVanTZt2vr16++9+27PcUaGhlzmdhY7Mq63cN78g/v2z589J+9nDh08WB0du+4Nb4gagStkZ1t7WG8Uc/koCI/0HXaIz+idyizOWHPa04898fAjD+7Ytr2zrb170uTr33DdwLH+3u6eYr7AQIVcfmhgMJfJxmG0fNlJvd09p685ra2ltVQodrZ3JDrWiYqCMJ/PjwwOMbAkiVavXLV927af/vwnt95+S/+Ro2efeVZLsZT3Mtwg6/kCjCw62toXzl/wyEMPf+Hv/2HTxpem9PSevua0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";
        // Calculate the page width
        doc.addImage(logo, 'PNG', 5, 10, 8, 8);
        const pageWidth = doc.internal.pageSize.getWidth();

        // Function to center text
        function centerText(text, y, fontSize = 4) {
          doc.setFontSize(fontSize);
          const textWidth = doc.getTextWidth(text);
          const x = (pageWidth - textWidth) / 2;
          doc.text(text, x, y);
        }

        // Header content
        centerText('Province of Bukidnon', yPos, 8);
        yPos += 5;
        centerText('City Government of Malaybalay', yPos, 8);
        yPos += 5;
        centerText('City Economic Enterprise Development and Management Office', yPos, 6);
        yPos += 5;
        centerText('Market Site Brgy 9, Malaybalay City Bukidnon', yPos, 8);
        yPos += 10;
        centerText('Official Receipt', yPos, 9);
        yPos += 5;
        centerText(transaction.branch, yPos, 8);  // Set branch dynamically if needed
        yPos += 10;

        // Draw a box around the receipt content
        const boxWidth = pageWidth - 20;
        doc.rect(10, yPos - 5, boxWidth, 80);

        // Receipt content
        doc.setFontSize(10);
        doc.text(`Branch: ${transaction.branch}`, 11, yPos);
        yPos += 7;
        doc.text(`Date: ${formattedDate}`, 11, yPos);
        yPos += 7;
        doc.text(`Teller: ${transaction.teller}`, 11, yPos);
        yPos += 7;
        doc.text(`Amount: PHP ${transaction.amount.toFixed(2)}`, 11, yPos);
        yPos += 7;
        doc.text(`Type: ${transaction.type}`, 11, yPos);
        yPos += 7;
        doc.text(`Reference: ${transaction.reference_key}`, 11, yPos);
        yPos += 7;
        doc.text(`Unit: ${unit.unit_info}`, 11, yPos);
        yPos += 7;
        doc.text(`Unit Type: ${unit.unit_type}`, 11, yPos);
        yPos += 10;

        // Draw a horizontal line
        doc.line(10, yPos + 5, 10 + boxWidth, yPos + 5);

        // Footer or Remarks
        yPos += 10;
        centerText('Thank you for your payment!', yPos, 8);
        yPos += 5;
        centerText('For any inquiries, please contact us at (123) 456-7890.', yPos, 7);
        yPos += 5;
        centerText('This is a computer-generated receipt and does not require a signature.', yPos, 7);

        // Save the PDF
        doc.save(filename);

      })
      .catch(error => {
        console.error('Error fetching transaction data:', error);
      });
  },
    confirmTransaction() {
      // Close the initial modal and open the confirmation modal
      this.showModal = false;
      this.showConfirmModal = true;
    },proceedTransaction() {
      // Handle the confirmed transaction here
      this.showConfirmModal = false;
      this.topup(); // Call the topup method to proceed
    },
    clearError() {
      this.error = "";
    },

    clearSuccess() {
      this.success = "";
    },
    fetchUnits() {
      axios
        .get("https://qrmcpass.loca.lt/units", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log(response.data.units); // Check if units are received
          this.units = response.data.units;
          this.fetchBalances();
        })
        .catch((error) => {
          console.error("Error fetching user units:", error);
        });
    },
    fetchBalances() {
      // Fetch balances for each unit
      this.units.forEach((unit) => {
        axios
          .get(`https://qrmcpass.loca.lt/unit/${unit.id}/balances`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log(response.data.balances); // Check if balances are received
            unit.balances = response.data.balances; // Directly assign balances to unit
          })
          .catch((error) => {
            console.error("Error fetching balances for unit:", unit.id, error);
          });
      });
    },
    topup() {
      if (!this.selectedUnit) {
        this.error = "Please select a unit";
        return;
      }

      let unit = this.units.find((unit) => unit.id === this.selectedUnit);
      if (!unit) {
        this.error = "Selected unit not found";
        return;
      }
      if (this.amount === 0) {
        this.error = "Amount cannot be 0";
        return;
      }

      let data = {
        selectedBranch: this.selectedBranch,
        selectedUnit: this.selectedUnit,
        unit_type: unit.unit_type,
        amount: this.amount,
        teller: this.teller.id,
      };

      axios
        .post("https://qrmcpass.loca.lt/topup", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
            "X-Frontend-URL": window.location.href,
            "X-Forwarded-For": window.ipAddress,
          },
        })
        .then((response) => {
          console.log("Top up response:", response.data);
          if (response.data.message === "Top up successful!") {
            this.selectedBranch = "";
            this.selectedUnit = "";
            this.amount = "";
            this.success = "Topup successful!";
            this.fetchRecentTransactions();
          } else {
            console.error("Top up failed:", response.data.message);
            alert("Top up failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            this.error = error.response.data.error;
          } else {
            this.error = "An error occurred. Please try again.";
          }
        });
    },
    fetchRecentTransactions() {
      axios
        .get("https://qrmcpass.loca.lt/recent_topup_transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          const newTransactions = response.data.transactions.filter(
            (transaction) =>
              !this.transactions.map((t) => t.id).includes(transaction.id)
          );
          newTransactions.forEach((transaction) => {
            this.transactions.unshift(transaction);
          });
          this.transactions.sort((a, b) => b.id - a.id); // Sort transactions by ID in descending order
          this.transactions = this.transactions.slice(0, 10); // Limit to the latest 10 transactions
        })
        .catch((error) => {
          console.error("Error fetching recent transactions:", error);
        });
    },
  },watch: {
  searchTerm() {
    // Forces re-evaluation when searchTerm changes
    this.filteredTransactions;
  }
}
};
</script>
