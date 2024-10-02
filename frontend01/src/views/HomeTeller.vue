<template>
  <main class="select-none justify-center p-4 bg-slate-100" >
    <div class=" bg-green-600 w-full mt-2 p-5 rounded-[10px] shadow md:w-full">
      <h1 class="text-[25px] text-white" >
        WELCOME! Teller, 
        <span id="operator-name" class="font-bold text-white uppercase">
        {{ teller.first_name }} {{ teller.last_name }}!</span>
      </h1>
    </div>
    
    <div class=" w-full p-5 grid grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-3 md:w-full gap-2">
      
      <div class=" bg-white p-14 justify-center items-center rounded-[10px] shadow w-full md:w-full">
        <h1 class="text-[25px] font-bold">Manually TopUp</h1>
        <p class="font-light">Motorela & Multicab</p>
        <p class="font-extralight">Allows to Top Up manually.</p>
        <RouterLink class="nav-link" to="/topup">
          <Button
            label="Manually TopUp"
            class="mt-3 w-full"
            icon="pi pi-money-bill"
            severity="success"
          />
        </RouterLink>
      </div>
      <!-- <Divider /> -->
      <div class="bg-white p-14 justify-center items-center rounded-[10px] shadow w-full md:w-full">
        <h1 class="text-[25px] font-bold">Pay Delinquencies</h1>
        <p class="font-light">Motorela & Multicab</p>
        <p class="font-extralight">Allows to pay deliquinces.</p>
        <RouterLink class="nav-link" to="/deduct">
          <Button
            label="Pay Delinquency"
            class="mt-3 w-full"
            icon="pi pi-money-bill"
            severity="success"
          />
        </RouterLink>
      </div>
      <!-- <Divider /> -->
      <div class="bg-white p-14 justify-center items-center rounded-[10px] shadow w-full md:w-full">
        <h1 class="text-[25px] font-bold">Pay with QR</h1>
        <p class="font-light">QR Payment Scan for Motorela</p>
        <p class="font-extralight">Allows to pay via QR.</p>
        <RouterLink class="nav-link" to="/motorelascan">
          <Button
            label="Motorela Scan"
            class="mt-3 w-full"
            icon="pi pi-qrcode"
            severity="success"
          />
        </RouterLink>
        <RouterLink class="nav-link" to="/multicabscan">
          <Button
            label="Multicab Scan"
            class="mt-3 w-full"
            icon="pi pi-qrcode"
            severity="success"
          />
        </RouterLink>
      </div>
    </div>
  </main>
</template>
<script>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const authenticated = ref(false);

    const route = useRoute();
    const router = useRouter();

    // Check authentication status
    if (localStorage.getItem("access_token")) {
      authenticated.value = true;
    }

    watch(authenticated, (newValue) => {
      if (newValue) {
        // User is authenticated

        router.push("/homeTeller");
      } else {
        // User is not authenticated

        router.push("/loginTeller");
      }
    });

    const teller = ref({
      id: null,
      username: "",
      first_name: "",
      last_name: "",
    });

    axios
      .get("https://mvothocqom.ap.loclx.io/Teller", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        // Assuming response.data contains the user details
        teller.value = response.data;
     
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    const logout = () => {
      axios
        .post("https://mvothocqom.ap.loclx.io/logout")
        .then((response) => {
          // Handle successful logout
          console.log(response.data.message);
          // Remove access token from local storage
          localStorage.removeItem("access_token");
          // Redirect to the login page
          router.push("/loginTeller");

          // window.location.href = '/'; // Not needed if using router.push
        })
        .catch((error) => {
          // Handle logout error
          console.error(error.response.data.message);
        });
    };

    return {
      authenticated,
      logout,
      teller
    };
  },
};
</script>
