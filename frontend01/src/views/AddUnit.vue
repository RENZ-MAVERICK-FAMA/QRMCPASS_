<template>
  <main class="select-none flex justify-center p-4">
    <form
      @submit.prevent="addunit"
      class="bg-white w-[500px] mt-10 p-5 rounded-[10px] shadow"
    >
      <h1 class="text-[25px] font-bold">ADD UNIT</h1>
      <hr />
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
      <div class="mt-3">
        <label>Unit Type</label>
        <Select
          v-model="unittype"
          id="unittype"
          placeholder="Select Unit Type"
          :options="unitTypeOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
        ></Select>
      </div>
      <div class="mt-3">
        <label>Color</label>
        <InputText
          type="text"
          v-model="color"
          id="color"
          pattern="[a-zA-Z]*"
          required
          class="w-full"
        />
      </div>
      <div class="mt-3">
        <label>Body Information</label>
        <InputText
          type="text"
          v-model="unitinfo"
          id="unitinfo"
          pattern="^[a-zA-Z0-9]([ -]?[a-zA-Z0-9])*$"
          required
          class="w-full"
        />
      </div>
      <div class="mt-3">
        <label>Motorela Picture</label>
        <input
          type="file"
          id="picture"
          name="picture"
          @change="handleFileChange"
          required
          class="file:bg-slate-300 file:p-2 w-full file:border-none file:h-[40px] file:rounded"
        />
      </div>
      <div class="mt-3">
        <label>Password</label>
        <InputText
          type="password"
          v-model="password1"
          id="password1"
          class="w-full"
        />
      </div>
      <div class="mt-3">
        <label>Confirm Password</label>
        <InputText
          type="password"
          v-model="password2"
          id="password2"
          class="w-full"
        />
      </div>
      <div class="grid grid-cols-2 gap-10 mt-3">
        <Button
          type="submit"
          icon="pi pi-save"
          label="Save"
          severity="success"
          class="w-full"
        />
        <RouterLink to="/home">
          <Button
            type="text"
            icon="pi pi-times"
            label="Cancel"
            severity="secondary"
            class="w-full"
          />
        </RouterLink>
      </div>
    </form>
  </main>
</template>

<script>
import axios from "axios";
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      unittype: "",
      color: "",
      unitinfo: "",
      password1: "",
      password2: "",
      authenticated: true,
      success: "",
      error: "",
      picture: null, // Initialize picture as null,
      unitTypeOptions: [
        { label: "Motorela", value: "motorela" },
        { label: "Multicab", value: "multicab" },
      ],
    };
  },
  components: {
    AlertMessage: defineAsyncComponent(() =>
      import("@/components/errors/AlertMessage.vue")
    ),
  },
  methods: {
    clearError() {
      this.error = "";
    },
    clearSuccess() {
      this.success = "";
    },
    handleFileChange(event) {
      if (event.target.files.length > 0) {
        this.picture = event.target.files[0];
      }
    },
    addunit() {
      this.clearError();
      this.clearSuccess();

      let formData = new FormData();
      formData.append("color", this.color);
      formData.append("unitinfo", this.unitinfo);
      formData.append("unittype", this.unittype);
      formData.append("picture", this.picture);
      formData.append("password1", this.password1);
      formData.append("password2", this.password2);

      axios
        .post("https://y2mifxhqo2.loclx.io/addunit", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          this.color = "";
          this.unitinfo = "";
          this.unittype = "";
          this.picture = null; // Reset picture to null
          this.password1 = "";
          this.password2 = "";
          this.success = "Unit Added Successfully!";
          document.querySelector(".add-btn").removeAttribute("disabled");
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
