<template>
  <main class=" p-5" >
    <div class="flex items-center justify-center mt-10 p-4" >
      <div >
        <h1 class="text-green-600 font-black text-[80px] md:text-[100px]  lg:text-[200px] lg:mb-[-50px] text-center" >OOPS!</h1>
        <h1 class="text-[35px] md:text-[40px] font-extrabold text-center" >404 PAGE NOT FOUND</h1>
        <p class="text-center" >The page you’re looking for may have been moved or deleted, or it might be temporarily unavailable</p>
        <div class="flex justify-center mt-2" >
          <RouterLink to="/">
            <Button label="GO TO HOMEPAGE" severity="info"/>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template> 
<script>
  export default {
    name: 'NotFound'
  }
</script>
