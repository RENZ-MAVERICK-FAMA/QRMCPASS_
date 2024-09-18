<template>
  <main class="p-5 px-[10%]">
    <DataTable
      showGridlines
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      class="mt-5 md:mt-10 p-5 bg-white rounded-[10px] shadow"
      :value="reversedTransactions"
    >
 
      <Column header="ID" field="id" />
      <Column header="Unit" field="unitid" />
      <Column header="Amount" field="amount" />
      <Column header="Date">
        <template #body="{ data }">
          {{ new Date(data.date).toDateString() }}
        </template>
      </Column>
      <Column header="Time">
        <template #body="{ data }">
          {{
            new Date(data.date).toLocaleTimeString("en-US", { timeZone: "GMT" })
          }}
        </template>
      </Column>
    </DataTable>
  </main>

  <Dialog v-model:visible="modal" header="TOP UP" modal class="">
    <form @submit.prevent="topup" class="">
      <div class="grid">
        <label class="m-0 p-0">Select Unit</label>
        <Select
          v-model="selectedUnit"
          :options="units"
          optionLabel="unit_info"
          optionValue="id"
        ></Select>
      </div>
      <div class="grid">
        <label class="m-0 p-0">Top Up</label>
        <InputNumber
          v-model="amount"
          type="number"
          class="w-full"
          placeholder="Enter Top Up"
          required
          readonly
        />
      </div>
      <Button
        type="submit"
        label="Save"
        icon="pi pi-save"
        severity="success"
        class="w-full mt-3"
      />
    </form>
  </Dialog>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  data() {
    return {
      units: [],
      selectedBranch: "kiosk",
      selectedUnit: "",
      amount: "",
      success: "",
      error: "",
      transactions: [],
      modal: false,
    };
  },
  mounted() {
    this.fetchCoins();
    setInterval(() => {
      this.fetchCoins();
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
  computed: {
    reversedTransactions() {
      // return this.transactions.slice(0, 10).reverse();
      return this.transactions.slice(0, 10);
    },
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
        .get("http://127.0.0.1:9000/units", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          this.units = response.data.units;
          this.fetchBalances();
        })
        .catch((error) => {
          console.error("Error fetching user units:", error);
        });
    },
    fetchCoins() {
      axios
        .get("http://127.0.0.1:9000/inserted_coins", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          this.amount = response.data.inserted_coins;
        })
        .catch((error) => {
          console.error("Error fetching inserted coins:", error);
        });
    },
    fetchBalances() {
      this.units.forEach((unit) => {
        axios
          .get(`http://127.0.0.1:9000/unit/${unit.id}/balances`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            unit.balances = response.data.balances;
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
        .get("http://127.0.0.1:9000/inserted_coins", {
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

          let data = {
            selectedBranch: this.selectedBranch,
            selectedUnit: this.selectedUnit,
            unit_type: unit.unit_type,
            amount: this.amount,
            teller: "kiosk",
          };

          axios
            .post("http://127.0.0.1:9000/kiosktopup", data, {
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
        .get("http://127.0.0.1:9000/recent_topup_transactions", {
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
