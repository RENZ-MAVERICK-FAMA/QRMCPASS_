<template>
  <main class="p-5 flex justify-center">
    <div
      class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px] w-full md:w-[600px]"
    >
      <form @submit.prevent="deduct" class="mt-3">
        <h1 class="text-[20px] font-bold">Pay Delinquency</h1>
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
        <div class="mt-3 grid">
          <label for="">Unit</label>
          <Select
            v-model="selectedUnit"
            :options="units"
            optionValue="id"
            optionLabel="unit_info"
            placeholder="Select Unit"
          ></Select>
        </div>
        <div class="mt-3 grid">
          <label for="">Toll Booth</label>
          <Select
            v-model="selectedBranch"
            :options="branches"
            optionValue="value"
            optionLabel="label"
            placeholder="Select Toll Booth"
            required
            readonly
          ></Select>
        </div>
        <div class="mt-3 grid">
          <label for="">Payment Date</label>
          <input
            v-model="date"
            type="date"
            class="h-[45px] border border-slate-200 px-2 rounded outline-none"
            id="date"
            name="date"
            required
          />
        </div>
        <div class="grid sm:grid-cols-2 gap-5 mt-3">
          <Button
            type="submit"
            icon="pi pi-check"
            severity="success"
            label="Confirm"
            class="w-full"
          />
          <RouterLink to="/homeTeller">
            <Button
              severity="secondary"
              icon="pi pi-times"
              label="Cancel"
              class="w-full"
            />
          </RouterLink>
        </div>
      </form>
    </div>
  </main>
</template>
<script>
import { ref } from "vue";
import axios from "axios";

export default {
  data() {
    return {
      units: [],
      selectedUnit: "",
      selectedBranch: "",
      date: "",
      error: "",
      success: "",
      teller: "",
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
      .get("http://127.0.0.1:9000/Teller", {
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
        .get("http://127.0.0.1:9000/units", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log(response.data.units);
          this.units = response.data.units;
          this.fetchBalances();
        })
        .catch((error) => {
          console.error("Error fetching user units:", error);
        });
    },

    deduct() {
      if (!this.selectedUnit) {
        this.error = "Please select a unit";
        return;
      }

      let unitType = this.selectedUnit.unit_type;
      let amount =
        unitType === "motorela" ? 6 : unitType === "multicab" ? 11 : 0;

      let data = {
        unit_id: this.selectedUnit.id,
        date: this.date,
        unit_type: this.selectedUnit.unit_type,
        selectedBranch: this.selectedBranch,
        amount: amount,
        teller: this.teller.id,
      };

      console.log("data to be sent:", data);

      axios
        .post("http://127.0.0.1:9000/paymentdel", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
            "X-Frontend-URL": window.location.href,
            "X-Forwarded-For": window.ipAddress,
          },
        })
        .then((response) => {
          console.log("Deduct response:", response.data);
          if (response.data.message === "Payment Successful with Delinquency") {
            this.selectedUnit = "";
            this.date = "";
            this.success = response.data.message;
          } else {
            console.error("Deduct failed:", response.data.message);
            this.error = response.data.message;
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
  },
};
</script>
