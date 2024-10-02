<template>
  <main class="p-5 md:px-[10%]">
    <div class="bg-white mt-5 md:mt-10 p-5 shadow rounded-[10px]">
      <RouterLink to="/HomeSuperAdmin">
        <div class="flex gap-5 h-[40px] items-center hover:text-slate-300">
          <i class="pi pi-arrow-left"></i>
          <span>Go Back</span>
        </div>
      </RouterLink>
      <DataTable
        showGridlines
        :value="kiosks"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        class="mt-3"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span>ALL KIOSKS</span>
          </div>
        </template>
        <template #empty>
          <div class="flex justify-center">
            <small class="font-extralight capitalize">no data found. </small>
          </div>
        </template>
        <Column header="ID" field="id" />
        <Column header="Name" field="username" />
        <Column header="Location" field="password" />
      </DataTable>
    </div>
  </main>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      kiosks: [],
    };
  },
  mounted() {
    this.fetchKiosks();
  },
  methods: {
    async fetchKiosks() {
      try {
        const response = await axios.get("https://zfhlpd2pxk.loclx.io/kiosk");
        this.kiosks = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
