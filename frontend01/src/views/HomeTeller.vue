<template>
  <main class="select-none justify-center p-4 bg-slate-100" >
    <div class="bg-green-600 mt-2 p-5 rounded-[10px] shadow mx-auto md:w-full">
      <h1 class="text-[25px] text-white" >
        Welcome Collector, 
        <span id="operator-name" class="font-bold text-white uppercase" >
        {{ teller.first_name }} {{ teller.last_name }}!</span>
      </h1>
    </div>
    
    <div class=" w-full p-5 grid grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-3 md:w-full gap-2">
      
      <div class="bg-white p-14 justify-center items-center rounded-[10px] shadow w-full md:w-full">
        <h1 class="text-[25px] font-bold">Multicab Collector</h1>
         <p class="font-light">Multicab Toll Collection</p>
         <p class="font-extralight">Where Public Multicab, PUV, PUJ and Bus pay their daily toll fee</p>
        
        <RouterLink class="nav-link" to="/multicabscan">
          <Button
            label="Multicab Teller"
            class="mt-3 w-full"
            icon="pi pi-car"
            severity="success"
          />
        </RouterLink>
      </div>
    
      <!-- <Divider /> -->
      <div class="bg-white p-14 justify-center items-center rounded-[10px] shadow w-full md:w-full">
        <h1 class="text-[25px] font-bold">Motorela Collector</h1>
         <p class="font-light">Motorela Toll Collection</p>
         <p class="font-extralight">Where Public Motorela pay their daily toll fee</p>
     
        
        <RouterLink class="nav-link" to="/motorelascan">
          <Button
            label="Motorela Teller"
            class="mt-3 w-full"
            icon="pi pi-ticket"
            severity="success"
          />
        </RouterLink>
      </div>
      <div class="bg-white p-14 justify-center items-center rounded-[10px] shadow w-full md:w-full">
        <h1 class="text-[25px] font-bold">Office Teller</h1>
        <p class="font-light">CEEDMO Collection Office</p>
        <p class="font-extralight">Where driver or operators inquire their transaction record and pay delinquencies</p>
     

        <RouterLink class="nav-link" to="/officeteller">
          <Button
            label="Office Teller"
            class="mt-3 w-full"
            icon="pi pi-desktop"
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
      .get("https://qrmcpass.loca.lt/Teller", {
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
        .post("https://qrmcpass.loca.lt/logout")
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
