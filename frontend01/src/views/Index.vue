<template>
  <div class="container">
    <div class='title-homepage'>
      <h1 class="homepage-desc">Hello, Welcome</h1>
      <h2>sa <span class="client-name">QRMCPASS</span></h2>
      <p>Maayong pag-abot sa QRMCPASS, ang imong tiwala nga solusyon alang sa pagdumala sa kalidad ug katalagman sa imong mga proyekto.</p>
      <p>Pinaagi sa QRMCPASS, makapapalong ka sa imong mga proseso sa pagdumala sa proyekto, makailhan sa mga potensyal nga katalagman, ug makasiguro nga ang mga pamatasan sa kalidad gipatuman.</p>
      <p>Usbagon ang among mga gibug-atan ug kuhaon ang kumander sa imong proyekto.</p>

    </div>
    <div class="logo-client">
      <img class="client-logo" src="..\assets\ceedmo-logo.png" alt="CEEDMO LOGO">
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Duha ka mga kolum, kada usa nga nagdala ug katunga sa sulod sa container */
  gap: 20px; /* Gap tali sa mga kolum */
}

.title-homepage {
  padding: 20px;
  margin-top: 50px;
  margin-left: 50px;
}

.client-name {
  color: green;
  font-weight: bold;
}

.logo-client {
  padding: 20px;
  margin-top: 50px;
  margin-right: 50px;
  text-align: center;
}

.client-logo {
  max-width: 100%; /* Paniguroa nga ang logo dili mobalik sa kadako sa iyang kontainer */
}

.snd-btn {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 25px;
}

.snd-btn:hover {
  background-color: #45a049; /* Mas dunggon nga berde sa hover */
}
</style>
