<template>
    <button class="btn btn-warning"><router-link class="nav-link" to="/addkiosk">Add Kiosk</router-link></button>
    <div class="container">
      <div class="card-container">
      <router-link to="/unit" class="card">
        <div class="card-content"> Units</div>
      </router-link>
      <router-link to="/teller" class="card">
        <div class="card-content"> Teller</div>
      </router-link>
      <router-link to="/admin" class="card">
        <div class="card-content"> Admins</div>
      </router-link>
      <router-link to="/user" class="card">
        <div class="card-content"> Operators</div>
      </router-link>
    </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loggedInUserCount: null,
      activeAccountsCount: null
    };
  },
  methods: {
    getActiveAccountsCount() {
    axios.get('http://127.0.0.1:9000/active_sessions')
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

<style scoped>
.card-container {
  /* display: flex; */
  flex-wrap: wrap;
  width: 400px;
  margin-left: 25px;
  text-transform: uppercase;
  
}

.card {
  flex: 1 1 200px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  height: 100px;
  justify-content: center;
}



.card-content {
  font-weight: bold;
  background-color: #fff;
}

.container{
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  padding: 20px;
  margin-top: 50px;
  border-radius: 20px;
  width: 500px;
  background-color: #fff;
}
.btn{
  margin-top: 20px;
}
div{
  background-color: #fff;
}

</style>
