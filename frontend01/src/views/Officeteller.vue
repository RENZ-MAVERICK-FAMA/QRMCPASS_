<template>
 <main class="p-5 md:px-[10%]" >
 <div class=" w-full p-5 grid grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-3 md:w-full gap-2 justify-center items-center">
      
      <div class=" bg-white p-14 justify-center items-center rounded-[10px] shadow w-full md:w-full">
        <h1 class="text-[25px] font-bold">Manually TopUp</h1>
        <p class="font-light">Motorela & Multicab</p>
        <p class="font-extralight">Allows to Cash In manually.</p>
        <RouterLink class="nav-link" to="/topup">
          <Button
            label="Walk In Cash In"
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
     
    </div>
  </main>
</template>
