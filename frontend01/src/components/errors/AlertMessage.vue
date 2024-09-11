<script setup>
    const props = defineProps({
        loginError:{
            type: String,
            default: ""
        }
    });
</script>
<template>
    <div  v-if="loginError != ''" class=" text-red-500 mt-3 bg-red-100 p-5 text-center rounded-[10px] text-[14px] font-light" role="alert">
        {{ loginError }}
    </div>
</template>