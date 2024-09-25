<template>
  <main class="mt-10 p-5 md:px-[5%] lg:px-[15%]">
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
            <label>Unit</label>
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
              @click="manual"
              label="Manually Payment"
              icon="pi pi-money-bill"
              severity="success"
              class=""
            />
          </div>
        </form>
      </div>
      <div class="p-5 bg-slate-100 mt-3 shadow rounded">
        <table class="table">
          <thead>
            <tr>
              <th><strong class="text-[40px]">Motorela</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <template v-if="showMotorela">
                  <table class="w-full">
                    <tbody>
                      <div class="flex gap-2">
                        <tr v-for="unit in sortedUnits" :key="unit.id">
                          <td
                            :class="{
                              'bg-green-400 text-white p-2':
                                unit.has_toll_payment_today, // Payment is done
                              'bg-red-400 text-white p-2':
                                unit.has_delinquency_unpaid, // Unpaid delinquency
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

import axios from 'axios';


  export default {
  data() {
    return {
      username: '',
      firstName: '',
      lastName: '',
      address: '',
      password1: '',
      password2: '',
      loginError: null
    };
  },
    methods: {
      addTeller() {
      let formData = new FormData();
      formData.append('username', this.username);
      formData.append('firstName', this.firstName);
      formData.append('lastName', this.lastName);
      formData.append('address', this.address);
      formData.append('password1', this.password1);
      formData.append('password2', this.password2);

      axios.post('https://qrmcpass.loca.lt/addTeller', formData)
        .then(response => {
      this.username = '';
      this.firstName = '';
      this.lastName = '';
      this.address = '';
      this.password1 = '';
      this.password2 = '';
          this.$router.push('/teller  ');
        
        })
        .catch(error => {
          this.loginError = error.response.data.message;
          console.error(this.loginError);
         
        });
    }
  }
};
  </script>
