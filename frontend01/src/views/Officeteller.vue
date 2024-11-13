<template>
 <main class="p-5 md:px-[10%]" >
  <RouterLink to="/HomeSuperAdmin" >
          <div class="flex gap-5 h-[40px] items-center hover:text-slate-300" >
            <i class="pi pi-arrow-left" ></i>
            <span>Go Back</span>
          </div>
      </RouterLink> 
 <div class="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 gap-10 md:pt-20 pt-10">
      <RouterLink to="/topup" >
      <div class="bg-green-100 size-[300px] rounded-[50%] shadow p-3 hover:bg-slate-50" >
        <div class="bg-green-200 rounded-[50%] shadow w-full  hover:animate-pulse h-full grid place-content-center" >
          <div class="text-center" >
            <i class="pi pi-money-bill text-[50px]" ></i>
            <h6 class="text-[35px] font-extrabold text-black/80" >Walk In Cash In</h6>
          </div>
        </div>
      </div>
    </RouterLink>

    <RouterLink to="/deduct" >
      <div class="bg-green-100 size-[300px] rounded-[50%] shadow p-3 hover:bg-slate-50" >
        <div class="bg-green-200 rounded-[50%] shadow w-full  hover:animate-pulse h-full grid place-content-center" >
          <div class="text-center" >
            <i class="pi pi-truck text-[50px]" ></i>
            <h6 class="text-[35px] font-extrabold text-black/80" >Payment Deliquency</h6>
          </div>
        </div>
      </div>
    </RouterLink>

    </div>
  </main>
</template>
