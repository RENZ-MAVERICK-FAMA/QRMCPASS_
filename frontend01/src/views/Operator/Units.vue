<template>
  <main class="px-[15%] mt-10">
    <div class="bg-white p-5 rounded-[10px] shadow">
      <div class="flex justify-between">
        <h1 class="text-[25px]">UNITS</h1>
        <RouterLink to="/home">
          <Button icon="pi pi-arrow-left" label="Go Back" text />
        </RouterLink>
      </div>
      <DataTable
        showGridlines
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :value="units"
        class="min-w-full mt-3"
      >
        <Column header="Unit Info" field="unit_info" />
        <Column header="Unit Type" field="unit_type" />
        <Column header="Picture">
          <template #body="{ data }">
            <img
              :src="data.picture"
              alt="QR Code"
              style="width: 70px; height: 70px"
            />
          </template>
        </Column>
        <Column header="QR Code">
          <template #body="{ data }">
            <img
              :src="data.qrcode"
              alt="QR Code"
              style="width: 70px; height: 70px"
            />
          </template>
        </Column>
        <Column header="Color" field="color" />
        <Column header="Balance">
          <template #body="{ data }">
            <strong v-for="balance in data.balances" :key="balance.id">{{
              balance.balance
            }}</strong>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              class="w-full"
              @click="showDelinquencies(data)"
              label="Delinquencies"
              severity="success"
            />
            <Button
              class="w-full mt-3"
              @click="showTransactions(data)"
              label="Transactions"
              severity="success"
            />
          </template>
        </Column>
        <Column header="Download QR Code">
          <template #body="{ data }">
            <Button
              class="w-full mt-3"
              @click="downloadQRCode(data)"
              icon="pi pi-download"
              text
              severity="info"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="showModal"
      modal
      header="Deliquencies For Unit"
      class="w-[800px]"
    >
      <div class="">
        <div class="flex justify-center mt-2">
          <div class="flex items-center gap-5 mb-2">
            <Button
              @click="goToPreviousMonth"
              label="Previous"
              icon="pi pi-angle-double-left"
              severity="info"
              text
            />
            <strong>{{ currentMonthName }} {{ currentYear }}</strong>
            <Button
              @click="goToNextMonth"
              label="Next"
              icon="pi pi-angle-double-right"
              iconPos="right"
              severity="info"
              text
            />
          </div>
        </div>
        <table class="w-full">
          <thead class="h-[50px] text-left bg-slate-100">
            <tr>
              <th
                class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                v-for="day in weekDays"
                :key="day"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="h-[45px]" v-for="week in calendarWeeks" :key="week">
              <td
                class="border border-slate-300 pl-[5px] font-light"
                v-for="day in week"
                :key="day"
                :class="getCellClass(day)"
              >
                <strong v-if="day">{{ day }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="showModalTransactions"
      modal
      header="Transaction"
      class="w-[800px]"
    >
      <div>
        <div class="modal-content">
          <table class="w-full">
            <thead class="h-[50px] text-left bg-slate-100">
              <tr>
                <th
                  class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                >
                  Date
                </th>
                <th
                  class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                >
                  Time
                </th>
                <th
                  class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                >
                  Amount
                </th>
                <th
                  class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                >
                  Branch
                </th>
                <th
                  class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                >
                  Reference Number
                </th>
                <th
                  class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                >
                  Teller
                </th>
                <th
                  class="pl-[5px] text-black uppercase border border-slate-300/80 font-semibold"
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="h-[45px]"
                v-for="transaction in paginatedTransactions"
                :key="transaction.id"
              >
                <td class="border border-slate-300 pl-[5px] font-light">
                  {{
                    new Date(transaction.date_of_payment)
                      .toISOString()
                      .split("T")[0]
                  }}
                </td>

                <td class="border border-slate-300 pl-[5px] font-light">
                  {{
                    new Date(transaction.date_of_payment).toLocaleTimeString(
                      "en-US",
                      { timeZone: "GMT" }
                    )
                  }}
                </td>

                <td class="border border-slate-300 pl-[5px] font-light">
                  {{ transaction.amount }}
                </td>
                <td class="border border-slate-300 pl-[5px] font-light">
                  {{ transaction.branch }}
                </td>
                <td class="border border-slate-300 pl-[5px] font-light">
                  {{ transaction.reference_key }}
                </td>
                <td class="border border-slate-300 pl-[5px] font-light">
                  {{ transaction.teller }}
                </td>
                <td class="border border-slate-300 pl-[5px] font-light">
                  <strong>{{ transaction.type.toUpperCase() }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-center mt-2">
            <div class="flex items-center gap-5">
              <Button
                @click="prevPageTransactions"
                :disabled="currentTransactionsPage === 0"
                label="Previous"
                icon="pi pi-angle-double-left"
                severity="info"
                text
              />
              <span
                >Page {{ currentTransactionsPage + 1 }} of
                {{ totalPagesTransactions }}</span
              >
              <Button
                @click="nextPageTransactions"
                :disabled="
                  currentTransactionsPage === totalPagesTransactions - 1
                "
                label="Next"
                icon="pi pi-angle-double-right"
                iconPos="right"
                severity="info"
                text
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      units: [
        {
          color: "blue",
          id: 1,
          picture:
            "https://res.cloudinary.com/dgkj964hl/image/upload/v1714494984/picture/hjzfahcjvwahr6ql6iji.jpg",
          qrcode:
            "https://res.cloudinary.com/dgkj964hl/image/upload/v1714494983/qrcodes/ujov4x8icyb1fcspcpha.png",
          unit_info: "001",
          unit_type: "motorela",
          balances: [
            {
              balance: 0,
              id: 1,
            },
          ],
        },
        {
          color: "green",
          id: 2,
          picture:
            "https://res.cloudinary.com/dgkj964hl/image/upload/v1714953492/picture/k3sau3gfewac9ee3ufv5.jpg",
          qrcode:
            "https://res.cloudinary.com/dgkj964hl/image/upload/v1714953491/qrcodes/xhnyjdfplfjupmamdym2.png",
          unit_info: "374",
          unit_type: "motorela",
          balances: [
            {
              balance: 109,
              id: 2,
            },
          ],
        },
      ],
      selectedUnit: null, // Add selectedUnit state
      showModal: false,
      showModalTransactions: false,
      selectedUnitDelinquencies: [],
      transactions: [],
      transactionsPerPage: 20,
      currentTransactionsPage: 0,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendarWeeks: [],
    };
  },
  computed: {
    paginatedTransactions() {
      const start = this.currentTransactionsPage * this.transactionsPerPage;
      return this.transactions.slice(start, start + this.transactionsPerPage);
    },
    totalPagesTransactions() {
      return Math.ceil(this.transactions.length / this.transactionsPerPage);
    },
    currentMonthName() {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return monthNames[this.currentMonth];
    },
  },
  created() {
    this.fetchUnits();
    this.updateCalendarData();
  },
  methods: {
    downloadQRCode(unit) {
      axios
        .get(unit.qrcode, {
          responseType: "blob",
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "image/png" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${unit.unit_info}_QRCODE.png`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading QR code:", error);
        });
    },
    fetchUnits() {
      axios
        .get("http://127.0.0.1:9000/user_units", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          this.units = response.data.units;
          console.log("Units data:", this.units);

          this.units.forEach((unit) => {
            this.fetchBalance(unit);
          });
        })
        .catch((error) => {
          console.error("Error fetching user units:", error);
        });
    },

    fetchBalance(unit) {
      axios
        .get(`http://127.0.0.1:9000/unit/${unit.id}/balances`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          unit.balances = response.data.balances;
          console.log(`Balance for unit ${unit.id}:`, unit.balances);
        })
        .catch((error) => {
          console.error(`Error fetching balance for unit ${unit.id}:`, error);
        });
    },

    showDelinquencies(unit) {
      this.selectedUnit = unit; // Set the selected unit

      // Fetch delinquencies and transactions concurrently using Promise.all
      Promise.all([
        axios.get(`http://127.0.0.1:9000/unit/${unit.id}/delinquencies`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }),
        axios.get(`http://127.0.0.1:9000/unit/${unit.id}/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }),
      ])
        .then((responses) => {
          const delinquenciesResponse = responses[0];
          const transactionsResponse = responses[1];

          this.selectedUnitDelinquencies =
            delinquenciesResponse.data.delinquencies;
          this.transactions = transactionsResponse.data.transactions;

          // Show the modal after data is fetched
          this.showModal = true;

          // Update calendar data if needed
          this.updateCalendarData();
        })
        .catch((error) => {
          console.error(
            `Error fetching delinquencies and transactions for unit ${unit.id}:`,
            error
          );
        });
    },
    updateCalendarData() {
      const daysInMonth = new Date(
        this.currentYear,
        this.currentMonth + 1,
        0
      ).getDate();
      const firstDayOfMonth = new Date(
        this.currentYear,
        this.currentMonth,
        1
      ).getDay();
      let calendar = [];
      let week = [];
      let dayOfMonth = 1;

      // Fill the first week with empty days if necessary
      for (let i = 0; i < firstDayOfMonth; i++) {
        week.push(null);
      }

      // Fill the calendar with days of the month
      while (dayOfMonth <= daysInMonth) {
        if (week.length === 7) {
          calendar.push(week);
          week = [];
        }
        week.push(dayOfMonth);
        dayOfMonth++;
      }

      // Add the remaining week
      if (week.length > 0) {
        calendar.push(week);
      }

      this.calendarWeeks = calendar;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatTransactionDate(transaction) {
      const date =
        transaction.type === "top-up"
          ? new Date(transaction.date_of_payment)
          : new Date(transaction.date);
      return date.toLocaleDateString();
    },
    showTransactions(unit) {
      this.selectedUnit = unit; // Set the selected unit
      axios
        .get(`http://127.0.0.1:9000/unit/${unit.id}/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          this.transactions = response.data.transactions;

          this.showModalTransactions = true;
        })
        .catch((error) => {
          console.error(
            `Error fetching transactions for unit ${unit.id}:`,
            error
          );
        });
    },
    hasPaymentOnDate(date) {
      const formattedDate = this.formatDate(date);

      return this.transactions.some((transaction) => {
        // Get the timestamp from the transaction date and subtract 8 hours (in milliseconds)
        const transactionTimestamp =
          new Date(transaction.date).getTime() - 8 * 60 * 60 * 1000;

        // Create a new Date object using the adjusted timestamp
        const adjustedTransactionDate = new Date(transactionTimestamp);

        // Format the adjusted transaction date using the formatDate function
        const transactionDate = this.formatDate(adjustedTransactionDate);

        // Check if the adjusted transaction date and type match the criteria
        return (
          transactionDate === formattedDate &&
          (transaction.type === "toll payment" ||
            transaction.type === "delinquency payment")
        );
      });
    },
    hasUnpaidDelinquencyOnDate(date) {
      const formattedDate = this.formatDate(date);
      return this.selectedUnitDelinquencies.some((delinquency) => {
        const delinquencyDate = this.formatDate(
          new Date(delinquency.date_of_payment)
        );
        return (
          delinquencyDate === formattedDate && delinquency.status === "unpaid"
        );
      });
    },
    getCellClass(day) {
      if (!day) {
        return {};
      }

      const date = new Date(this.currentYear, this.currentMonth, day);
      const hasPayment = this.hasPaymentOnDate(date);
      const hasUnpaidDelinquency = this.hasUnpaidDelinquencyOnDate(date);

      if (hasPayment) {
        return { "cell-green": true };
      } else if (hasUnpaidDelinquency) {
        return { "cell-red": true };
      }

      return {};
    },
    goToPreviousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.updateCalendarData();
    },
    goToNextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.updateCalendarData();
    },
    prevPageTransactions() {
      if (this.currentTransactionsPage > 0) {
        this.currentTransactionsPage--;
      }
    },
    nextPageTransactions() {
      if (this.currentTransactionsPage < this.totalPagesTransactions - 1) {
        this.currentTransactionsPage++;
      }
    },
    closeModal() {
      this.showModal = false;
      this.selectedUnitDelinquencies = []; // Reset state when modal is closed
    },
    closeModalTransactions() {
      this.showModalTransactions = false;
      this.transactions = []; // Reset state when modal is closed
    },
  },
};
</script>
<style scoped>
.cell-red {
  background-color: red;
  color: white;
}

.cell-green {
  background-color: lightgreen;
  color: black;
}
</style>
