<template>
  <main class="p-5 flex justify-center bg-slate-100">
    <div class="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 gap-5">
      <div class="bg-white p-5 rounded-[10px] w-full md:w-[450px]">
      <form @submit.prevent="deduct" class="mt-3">
        <h1 class="text-[20px] font-bold">Pay Delinquency</h1>

        <!-- Error Message -->
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

        <!-- Success Message -->
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

        <!-- Select Unit -->
        <div class="mt-3 grid">
          <label for="unit">Unit</label>
          <Select
            class="w-full"
            v-model="selectedUnit"
            :options="units"
            optionLabel="unit_info"
            placeholder="Select Unit"
            @change="fetchUnitDelinquencies"
          />
        </div>

        <!-- Select Toll Booth -->
        <div class="mt-3 grid">
          <label for="branch">Toll Booth</label>
          <!-- <Select
            class="w-full"
            v-model="selectedBranch"
            :options="branches"
            optionValue="value"
            optionLabel="label"
            placeholder="Select Toll Booth"
            required
            readonly
          ></Select> -->
          <InputText
              v-model="selectedBranch"
              class="w-full md:max-w-[400px]"
              placeholder="Office"
              value="office"
              required
              readonly
            />
        </div>

        <!-- Payment Date -->
        <div class="mt-3 grid">
          <label for="date">Payment Date</label>
          <input
            v-model="date"
            type="date"
            class="h-[45px] border border-slate-200 px-2 rounded outline-none w-full"
            id="date"
            name="date"
            required
          />
        </div>

        <!-- Confirm and Cancel Buttons -->
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

    <!-- <div class="p-5 shadow bg-white rounded-[10px] w-full">
    <h2 class="text-[18px] font-bold">Delinquencies</h2>
    <ul >
      <li
        v-for="(delinquency, index) in visibleDelinquencies"
        :key="delinquency.id"
        class="mt-2 p-2 border rounded"
      >
        <p><strong>Date:</strong> {{ delinquency.date_of_payment }}</p>
        <p><strong>Status:</strong> {{ delinquency.status }}</p>
      </li>
    </ul>
    <p v-if="delinquencies.length === 0" class="text-gray-500">
      No delinquencies for the selected unit.
    </p>
    <button
      v-if="delinquencies.length > 5"
      @click="toggleShowMore"
      class="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
    >
      {{ showMore ? 'Show Less' : 'See More' }}
    </button>
  </div> -->

  <div class="p-5 shadow bg-white rounded-[10px] w-full">
    <div class=" grid grid-rows-1 grid-cols-2 gap-1">
      <h2 class="text-[18px] font-bold">Delinquencies</h2>
    <!-- <button
      v-if="delinquencies.length > 5"
      @click="toggleShowMore"
      class=" px-4 py-2 bg-blue-500 text-white rounded"
    >
      {{ showMore ? 'Show Less' : 'See More' }}
    </button> -->
    </div>
   
    <div class="scrollable-list mt-2">
      <ul>
      <li v-for="(delinquency, index) in visibleDelinquencies" :key="delinquency.id" class="mt-2 p-2 border rounded">
        <p><strong>Date:</strong> {{ delinquency.date_of_payment }}</p>
        <p><strong>Status:</strong> {{ delinquency.status }}</p>
      </li>
    </ul>
    <p v-if="delinquencies.length === 0" class="text-gray-500">
      No delinquencies for the selected unit.
    </p>
  </div>
  </div>
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
      selectedUnit: null,
      branches: [{ label: "Office", value: "office" }],
      date: "",
      error: "",
      success: "",
      teller: "",
      delinquencies: []
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
  },mounted() {
    
    this.fetchUnitDelinquencies();
    setInterval(() => {
      this.fetchUnitDelinquencies();
    }, 2000); 
  },
  computed: {
    visibleDelinquencies() {
      return this.showMore ? this.delinquencies : this.delinquencies.slice(0, 5);
    },
  },
  methods: {
    toggleShowMore() {
      this.showMore = !this.showMore;
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
          this.units = response.data.units;
        })
        .catch((error) => {
          console.error("Error fetching units:", error);
        });
    },

    fetchUnitDelinquencies() {
      if (this.selectedUnit) {
        axios
          .get(`https://qrmcpass.loca.lt/units/${this.selectedUnit.id}/delinquencies`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((response) => {
            this.delinquencies = response.data.delinquencies;
            console.log(this.delinquencies);
          })
          .catch((error) => {
            console.error("Error fetching delinquencies:", error);
          });
      }
    },

    deduct() {
      if (!this.selectedUnit) {
        this.error = "Please select a unit";
        return;
      }

      let unitType = this.selectedUnit.unit_type;
      let amount = unitType === "motorela" ? 6 : unitType === "multicab" ? 11 : 0;

      let data = {
        unit_id: this.selectedUnit.id,
        date: this.date,
        unit_type: this.selectedUnit.unit_type,
        selectedBranch: this.selectedBranch,
        amount: amount,
        teller: this.teller.id,
      };

      axios
        .post("https://qrmcpass.loca.lt/paymentdel", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.message === "Payment Successful with Delinquency") {
            this.selectedUnit = null;
            this.date = "";
            this.success = response.data.message;
          } else {
            this.error = response.data.message;
          }
        })
        .catch((error) => {
          if (error.response && error.response.data.error) {
            this.error = error.response.data.error;
          } else {
            this.error = "An error occurred. Please try again.";
          }
        });
    },
  },
};
</script>
