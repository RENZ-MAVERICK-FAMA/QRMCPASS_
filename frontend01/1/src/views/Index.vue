<template>
  <div class="landing-container">
    <h1>Welcome to QRMCPASS</h1>
    <p class="subtitle">Streamlined QR Code Automation for Toll Booth Systems</p>
    <p class="description">
      QRMCPass is a cutting-edge QR code automation payment system designed to revolutionize toll booth operations. 
      By leveraging advanced QR code technology, QRMCPass offers seamless, contactless transactions, ensuring 
      efficient and secure toll payment experiences for commuters.
    </p>
    <router-link to="/login" class="get-started-btn">Let's Get Started</router-link>
    <!-- <button @click="sendMessage" class="send-message-btn">Send Message</button>
    <div class="response">{{ response }}</div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:9000');
const response = ref('');

socket.on('response', (data) => {
  response.value = data.data;
});

const sendMessage = () => {
  socket.emit('message', 'Hello from Vue.js!');
};
</script>

<style scoped>
.landing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #333;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #666;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #444;
}

.get-started-btn {
  padding: 10px 30px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

.get-started-btn:hover {
  background-color: #0056b3;
}

.send-message-btn {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-message-btn:hover {
  background-color: #0056b3;
}

.response {
  margin-top: 20px;
  font-size: 1.1rem;
  color: #444;
}
</style>
