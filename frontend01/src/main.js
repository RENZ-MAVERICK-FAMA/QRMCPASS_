import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue';
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'
import Aura from '@/presets/aura';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Select from 'primevue/select';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Fieldset from 'primevue/fieldset';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Divider from 'primevue/divider';


const app = createApp(App);
app.use(router)
app.use(PrimeVue, {
    unstyled: true,
    pt: Aura
});

app.component('Button',Button);
app.component('InputText',InputText);
app.component('InputGroup',InputGroup);
app.component('InputGroupAddon',InputGroupAddon);
app.component('Select',Select);
app.component('DataTable',DataTable);
app.component('Column',Column);
app.component('Fieldset',Fieldset);
app.component('DatePicker',DatePicker);
app.component('Dialog',Dialog);
app.component('InputNumber',InputNumber);
app.component('Divider',Divider);

app.mount('#app')
