<template>
  <main class="mt-10 p-5 md:px-[5%] lg:px-[15%]">
    <div class="bg-white rounded-[10px] p-5">
      <div class="grid md:grid-cols-[350px,1fr] gap-5">
        <div
          class="md:p-3 w-full md:h-[350px] grid grid-rows-[1fr,60px] bg-white md:shadow rounded-[10px]"
        >
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
          <div class="mt-3 w-full">
            <select v-model="selectedDevice" class="h-[45px] w-full md:max-w-[400px] border rounded hover:border-slate-400 outline-none border-slate-200">
            <option disabled value="">Select Camera</option>
            <option v-for="device in devices" :key="device.deviceId" :value="device">{{ device.label }}</option>
          </select>
          </div>
        </div>
        <form @submit.prevent="topup" class="mt-5 md:mt-0">
          <h1 class="text-[20px]">Cash In Form</h1>
          <div class="grid mt-3s">
            <label>Ibutang ang imonga Unit</label>
            <select v-model="selectedUnit" class="h-[45px] w-full md:max-w-[400px] border rounded hover:border-slate-400 outline-none border-slate-200" required>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.unit_info }}</option>
            </select>
          </div>
          <div class="grid mt-3">
            <label>Kantidad nga Gi hulog sa coin slot</label>
            <InputText
              v-model="amount"
              type="number"
              class="w-full md:max-w-[400px]"
              placeholder="0"
              required
              readonly
            />
          </div>
          <Button
            label="Cash In"
            icon="pi pi-money-bill"
            severity="success"
            class="mt-3"
          />
        </form>
      </div>
      <DataTable
        showGridlines
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        class="mt-5 md:mt-10 p-5 bg-white rounded-[10px] shadow"
        :value="reversedTransactions"
      >
       
        <Column header="ID" field="id" />
        <Column header="Body Number" field="unitid" />
        <Column header="Amount" field="amount" />
        <Column header="Date">
          <template #body="{ data }">
            {{ new Date(data.date).toDateString() }}
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
      </DataTable>
    </div>
  </main>
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
</template>


<script>
import { ref, toHandlers, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { QrcodeStream } from "vue-qrcode-reader";
import axios from "axios";
import io from "socket.io-client";
const authenticated = ref(false);
const route = useRoute();
const router = useRouter();

export default {
  name: "TopupWithQRScanner",
  components: {
    QrcodeStream,
  },
  data() {
    return {
      units: [],
      selectedUnit: "",
      amount: "",
      success: "",
      error: "",
      transactions: [],
      selectedBranch: "Toll-Booth",
      scannerError: "",
      qrCodeKey: 0,
      selectedDevice: null,
      devices: [],
      detectedCodes: [],
      showModal: false,
      modalContent: "",
      modalImage: "",
      payment: "",
    };
  },
  mounted() {
    this.fetchCoins(); // Fetch coins immediately when the component is mounted
    setInterval(() => {
      this.fetchCoins(); // Fetch coins every 10 seconds
    }, 10000);
    this.fetchRecentTransactions();
    setInterval(() => {
      this.fetchRecentTransactions();
    }, 1000);
  },
  computed: {
    reversedTransactions() {
      return this.transactions.slice(0, 10);
    },
  },
  created() {
    this.fetchUnits();
    this.fetchCoins();

    this.enumerateDevices();

    const savedDetectedCodes = localStorage.getItem("detectedCodesMotorela");
    if (savedDetectedCodes) {
      this.detectedCodes = JSON.parse(savedDetectedCodes);
    } else {
      this.detectedCodes = [];
    }
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
  methods: {
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
    fetchCoins() {
      axios
        .get("https://qrmcpass.loca.lt/inserted_coins", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })

        .then((response) => {
          const originalAmount = response.data.inserted_coins;
          this.amount = response.data.inserted_coins;
          if (this.amount < 5) {
            this.showPopup = true;
            this.amount = 0;
          } else if (this.amount > 5) {
            this.showPopup = false;
            this.amount = response.data.inserted_coins;
          }
          if (this.amount !== originalAmount) {
            this.error = "Amount has been tampered with";
            return;
          }
        })
        .catch((error) => {
          console.error("Error fetching inserted coins:", error);
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

      // Fetch the original amount from the database
      axios
        .get("https://qrmcpass.loca.lt/inserted_coins", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          const originalAmount = response.data.inserted_coins;

          // Compare the submitted amount with the original amount
          if (this.amount !== originalAmount) {
            this.error = "Amount has been tampered with";
            return;
          }

          // Check if the amount is 0
          if (this.amount === 0) {
            this.error = "Amount cannot be 0";
            return;
          }

          let data = {
            selectedBranch: this.selectedBranch,
            selectedUnit: this.selectedUnit,
            unit_type: unit.unit_type,
            amount: this.amount,
            teller: "kiosk",
          };

          axios
            .post("https://qrmcpass.loca.lt/kiosktopup", data, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
                "X-Frontend-URL": window.location.href,
                "X-Forwarded-For": window.ipAddress,
              },
            })
            .then((response) => {
              if (response.data.message === "Top up successful!") {
                this.selectedBranch = "";
                this.selectedUnit = "";
                this.amount = "";
                this.success = "Topup successful!";

                this.fetchRecentTransactions(); // Update the transaction table
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
        })
        .catch((error) => {
          console.error("Error fetching original amount:", error);
          this.error = "An error occurred. Please try again.";
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
          this.transactions.sort((a, b) => b.id - a.id);
          this.transactions = this.transactions.slice(0, 10);
        })
        .catch((error) => {
          console.error("Error fetching recent transactions:", error);
        });
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
        const formattedDate = paymentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
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
        const formattedDate = paymentDate.toISOString().split("T")[0];
        const formattedTime = paymentDate.toLocaleTimeString("en-US", {
          timeZone: "GMT",
        });

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
    },
    // Close the modal
    closeModal() {
      this.showModal = false;
    },

    clearError() {
      this.error = "";
    },
    clearSuccess() {
      this.success = "";
    },

    enumerateDevices() {
      onMounted(async () => {
        this.devices = (await navigator.mediaDevices.enumerateDevices()).filter(
          ({ kind }) => kind === "videoinput"
        );

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

      const newCodes = detectedStrings.filter(
        (code) => !this.detectedCodes.includes(code)
      );

      const paymentResponse = await axios.get(
        `https://qrmcpass.loca.lt/payment-details?unit_info=${detectedWrCode}`
      );

      const paymentDetails = paymentResponse.data;
      console.log("payment:", paymentDetails);
      this.openModal(paymentDetails);

      // Find the unit ID corresponding to the detectedWrCode
      const unit = this.units.find((unit) => unit.unit_info === detectedWrCode);
      if (unit) {
        this.selectedUnit = unit.id; // Set selectedUnit to the ID of the unit
      } else {
        console.error("Unit not found for QR code:", detectedWrCode);
      }
    },
  },
};
</script>
