<template>
  <main class=" p-5" >
    <div class="flex items-center justify-center mt-10 p-4" >
      <div class="" >
        <div class="flex justify-center" >
          <div class="size-[80px] grid place-content-center rounded-[50%] bg-green-100" >
            <div class="size-[60px] grid place-content-center rounded-[50%] bg-green-200/80" >
              <i class="pi pi-key text-[25px] text-green-500" ></i>
            </div>
          </div>
        </div>
        <div>
          <h1 class="text-[30px] font-bold text-center" >Forgot Password?</h1>
          <div class="mt-3" >
            <label for="email">Email</label>
            <InputGroup>
              <InputText v-model="email" type="email" id="email" placeholder="example@gmail.com" required />
              <InputGroupAddon>
                <i class="pi pi-envelope" ></i>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button @click="resetPassword" severity="success" class="mt-3 mb-4 w-full" label="Reset Password" />
          <RouterLink  to="/" class=" flex justify-center" >
            <div class="grid grid-cols-[50px,1fr] items-center h-[40px] hover:text-slate-300" >
              <i class="pi pi-arrow-left" ></i>
              <span>Back to login</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template> 
<script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: ''
      };
    },
    methods: {
      resetPassword() {
        // Make an HTTP POST request to the backend
        axios.post('http://127.0.0.1:9000/forgot_password', { 
            email: this.email 
        })
          .then(response => {
            // Check the response for success or error messages
            if (response.data.success) {
              // Display success message
              
              // Redirect or perform any other actions as needed
            } else {
              // Display error message
              alert(response.data.message);
            }
          })
          .catch(error => {
            console.error('Error resetting password:', error);
            alert('An error occurred. Please try again.');
          });
      }
    }
  };
</script>