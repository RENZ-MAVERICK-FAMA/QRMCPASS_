<template>
  <main class="p-5 md:px-[10%] lg:px-[20%]" >
    <div class=" p-5 md:p-10 bg-white rounded-[10px] shadow-sm mt-5 md:mt-10" >
      <div class="flex justify-end" >
        <RouterLink to="/addkiosk" >
          <Button label="ADD KIOSK" severity="success" class=" w-full sm:w-[200px]" />
        </RouterLink>
      </div>
      <div class="grid md:grid-cols-2 md:grid-rows-2 mt-5 gap-5" >
        <RouterLink to="/unit">
          <div class="bg-slate-100  hover:bg-green-500 hover:text-white hover:shadow p-6 rounded-[10px] grid grid-cols-[80px,1fr] items-center"  >
            <div class="grid place-content-center" >
              <i class="pi pi-car font-light text-[25px]" ></i>
            </div>
            <p class=" text-[20px] md:text-[25px]" >UNITS</p>
          </div>
        </RouterLink>
        <RouterLink to="/teller">
          <div class="bg-slate-100  hover:bg-green-500 hover:text-white hover:shadow p-6 rounded-[10px] grid grid-cols-[80px,1fr] items-center"  >
            <div class="grid place-content-center" >
              <i class="pi pi-user font-light text-[25px]" ></i>
            </div>
            <p class=" text-[20px] md:text-[25px]" >TELLER</p>
          </div>
        </RouterLink>
        <RouterLink to="/admin">
          <div class="bg-slate-100  hover:bg-green-500 hover:text-white hover:shadow p-6 rounded-[10px] grid grid-cols-[80px,1fr] items-center"  >
            <div class="grid place-content-center" >
              <i class="pi pi-users font-light text-[25px]" ></i>
            </div>
            <p class=" text-[20px] md:text-[25px]" >ADMINS</p>
          </div>
        </RouterLink>
        <RouterLink to="/user">
          <div class="bg-slate-100  hover:bg-green-500 hover:text-white hover:shadow p-6 rounded-[10px] grid grid-cols-[80px,1fr] items-center"  >
            <div class="grid place-content-center" >
              <i class="pi pi-cog font-light text-[25px]" ></i>
            </div>
            <p class="text-[20px] md:text-[25px]" >OPERATORS</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';

export default {
  data() {
    return {
      loggedInUserCount: null,
      activeAccountsCount: null
    };
  },
  methods: {
    getActiveAccountsCount() {
    axios.get('https://qrmcpass.loca.lt/active_sessions')
        .then(response => {
            this.activeAccountsCount = response.data.active_sessions;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

  }
};
</script>
