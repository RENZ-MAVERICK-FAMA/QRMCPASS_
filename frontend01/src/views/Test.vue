<template>
  <div class="container">
    <div class="row">
      <div class="cont-l">
      <h3 class="display-5">Welcome sa</h3>
      <h2 class="display-6"> QRMCPASS</h2>
      <br>
      <br>
      <p>Maayong pag-abot sa QRMCPASS, ang imong tiwala nga solusyon alang sa pagdumala sa kalidad ug katalagman sa imong mga proyekto.</p>
      <p>Pinaagi sa QRMCPASS, makapapalong ka sa imong mga proseso sa pagdumala sa proyekto, makailhan sa mga potensyal nga katalagman, ug makasiguro nga ang mga pamatasan sa kalidad gipatuman.</p>
      <p>Usbagon ang among mga gibug-atan ug kuhaon ang kumander sa imong proyekto.</p>
  </div>
    </div>
    <div class="row">
      <div class="form-container">
        <img src="\src\assets\ceedmo-logo.png" alt="" class="logo-client">
        <h1 class="display-7"> login</h1>
      
        <form @submit.prevent="loginall">
          <div class="form-group">
            <label for="floatingInput">Username</label>
            <input v-model="formData.username" type="text" class="form-control" id="username" placeholder="Enter username">
          </div>
          <div class="form-group">
            <label for="floatingPassword">Password</label>
            <input v-model="formData.password" type="password" class="form-control" id="password" placeholder="Enter password">
          </div> 

          <br>
         
          <button type="submit" class="btn btn-primary">Login</button>

          
         
        </form>

        <div v-if="loginError" class="alert alert-danger" role="alert">
          {{ loginError }}
        </div>
      </div>
    </div>
    
  
 
    </div>
 
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      loginError: ''
    };
  },
  methods: {
    loginall() {
      const currentUrl = window.location.href;
    const clientIp = window.ipAddress;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'X-Frontend-URL': currentUrl,
    'X-Client-IP': clientIp  // Assuming 'window.ipAddress' is the client's IP address
  };
    axios.post('http://127.0.0.1:9000/loginall', this.formData, { headers })
      .then(response => {
        // Store the access token in local storage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('accountType', response.data.accountType);
        
        if (localStorage.getItem('access_token')) {
  switch (localStorage.getItem('accountType')) {
    case 'operator':
      this.$router.push('/home');
      window.location.href = '/home';
      break;
    case 'admin':
      this.$router.push('/homeAdmin');
      window.location.href = '/homeAdmin';
      break;
    case 'teller':
      this.$router.push('/homeTeller');
      window.location.href = '/homeTeller';
      break;
    case 'unit':
      this.$router.push('/homeunit');
      window.location.href = '/homeunit';
      break;
      case 'SuperAdmin':
      this.$router.push('/HomeSuperAdmin');
      window.location.href = '/HomeSuperAdmin';
      break;
      case 'kiosk':
      this.$router.push('/kioskminimum');
      window.location.href = '/kioskminimum';
      break;
    default:
      console.error('Invalid accountType');
  }
}
      })
      .catch(error => {
        this.loginError = error.response.data.message;
        console.error(this.loginError);
      });
  }
},
  
created() {
  const isAuthenticated = localStorage.getItem('access_token') && localStorage.getItem('accountType') === 'operator';
  if (isAuthenticated) {
    this.$emit('show', true);
    this.$emit('authenticated', true);
  }
}
};
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 250px;
}

.container-sm{
  /* background-color: aqua; */
  width: 500px;
  
}
.form-container{
   background-color: #fff; 
  width: 400px;
  padding: 20px;
  margin-left: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  height: 600px;
}
.display-6{
  color: #012e0e;
  font-weight: bold;
}
.display-7{
  color: #000;
  text-transform: uppercase;
  text-align: center;
}
.form-group{
  color: #000;
  margin: 20px;
}
label{
  margin-bottom: 10px;
}
.btn{
  background-color:#015a1b;
  color: #fff;
  border: none;
  text-align: center;
  margin-left: 20px;
  border-radius: 5px;
  width: 320px;
  text-transform: uppercase;
}
.btn:hover{
  background-color: #fff;
  color: #015a1b;
  padding: 10px;
  transition: ease all 0.5s;
  border: 1px solid #015a1b;
}
.alert{
  margin-top: 20px;
}
.forgot{
  color: #fff;
  text-align: center;
  text-decoration: underline;
}
.logo-client{
  height: 100px;
  margin-left: 100px;
  margin-bottom: 50px;
}
.cont-l{
  width: 400px;
  background-color: white;
  padding: 30px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  border-radius: 20px;

}
p{
  font-size: 18px;
}
</style>
