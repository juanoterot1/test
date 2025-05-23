<template>
  <main class="integration-page">
    <BlissHeader />

    <div class="form-container">
      <h2>Entrega y Pago</h2>

      <form @submit.prevent="process">
        <label>
          Servicio
          <select v-model="form.serviceId" required>
            <option disabled value="">Selecciona servicio</option>
            <option v-for="s in services" :key="s.id" :value="s.id">
              {{ s.title }} ({{ s.rate }} USD)
            </option>
          </select>
        </label>

        <label>
          Fecha y hora
          <input v-model="form.dateTime" type="datetime-local" required />
        </label>

        <label>
          Modalidad de entrega
          <select v-model="form.deliveryType" required>
            <option disabled value="">Selecciona entrega</option>
            <option value="google">Google Meet</option>
            <option value="zoom">Zoom</option>
            <option value="webex">Webex</option>
            <option value="home">Visita domiciliaria</option>
            <option value="file">Archivo adjunto</option>
          </select>
        </label>

        <label v-if="form.deliveryType === 'home'">
          Ubicación
          <input v-model="form.location" type="text" placeholder="Dirección" required />
        </label>

        <label>
          Método de pago
          <select v-model="form.paymentType" required>
            <option disabled value="">Selecciona pago</option>
            <option value="paypal">PayPal</option>
            <option value="nequi">Nequi</option>
            <option value="pse">PSE</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>
        </label>

        <div class="buttons">
          <button type="button" @click="resetForm">Limpiar</button>
          <button type="submit">Confirmar</button>
        </div>
      </form>

      <div v-if="deliveryResult" class="result">
        <p><strong>Entrega:</strong> {{ deliveryResult }}</p>
        <p><strong>Pago:</strong> {{ paymentResult }}</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import { loadProfiles } from '@/services/profiles';
import {
  GoogleMeetAdapter, ZoomAdapter, WebexAdapter,
  HomeVisitAdapter, FileDeliveryAdapter,
  DeliveryService,
  PayPalAdapter, NequiAdapter, PSEAdapter,
  CardAdapter, TransferAdapter,
  PaymentService
} from '@/services/integration';

const services = ref([]);
onMounted(() => { services.value = loadProfiles(); });

const form = ref({
  serviceId: '',
  dateTime: '',
  deliveryType: '',
  location: '',
  paymentType: ''
});
const deliveryResult = ref('');
const paymentResult = ref('');

function process() {
  const svc = services.value.find(s => s.id === +form.value.serviceId);

  // Adapter + Bridge para entrega
  let delImpl;
  switch(form.value.deliveryType) {
    case 'google': delImpl = new GoogleMeetAdapter(); break;
    case 'zoom':   delImpl = new ZoomAdapter();     break;
    case 'webex':  delImpl = new WebexAdapter();    break;
    case 'home':   delImpl = new HomeVisitAdapter();break;
    case 'file':   delImpl = new FileDeliveryAdapter(); break;
  }
  const deliverySvc = new DeliveryService(delImpl);
  deliveryResult.value = deliverySvc.deliver({
    service: svc,
    dateTime: form.value.dateTime,
    location: form.value.location
  });

  // Adapter + Bridge para pago
  let payImpl;
  switch(form.value.paymentType) {
    case 'paypal':   payImpl = new PayPalAdapter();    break;
    case 'nequi':    payImpl = new NequiAdapter();     break;
    case 'pse':      payImpl = new PSEAdapter();       break;
    case 'card':     payImpl = new CardAdapter();      break;
    case 'transfer': payImpl = new TransferAdapter();  break;
  }
  const paymentSvc = new PaymentService(payImpl);
  paymentResult.value = paymentSvc.pay(svc.rate);
}

function resetForm() {
  form.value = {
    serviceId: '', dateTime: '', deliveryType: '',
    location: '', paymentType: ''
  };
  deliveryResult.value = paymentResult.value = '';
}
</script>

<style scoped src="@/styles/integration.css"></style>
