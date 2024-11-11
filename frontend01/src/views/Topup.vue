<template>
  <main class="p-5 md:px-[10%] bg-slate-100">
    <div class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px]">
      <RouterLink to="/homeTeller">
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
        :value="reversedTransactions"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span>Recent Cash In</span>
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
        <Column header="Unit" field="unitid" />
        <Column header="Amount" field="amount" />
        <Column header="Date 0f Payment">
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
    <p>Please confirm to continue your transaction.</p>
    <div class="flex justify-end mt-4">
      <Button label="Cancel" class="p-button-text" @click="showConfirmModal = false" />
      <Button label="Confirm" class="p-button-danger" @click="proceedTransaction" />
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
    },
  },
  mounted() {
    this.fetchRecentTransactions();
    setInterval(() => {
      this.fetchRecentTransactions();
    }, 1000);
  },
  methods: {
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
  },
};
</script>
