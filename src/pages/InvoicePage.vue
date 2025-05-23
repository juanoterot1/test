<template>
  <main class="invoice-page">
    <BlissHeader />

    <div class="page-container">
      <h2>Generar Factura Individual</h2>

      <label>
        Selecciona solicitud
        <select v-model="selectedId">
          <option disabled value="">– escoge una –</option>
          <option
            v-for="r in requests"
            :key="r.id"
            :value="r.id"
          >#{{ r.id }} – {{ r.service.title }}</option>
        </select>
      </label>

      <button @click="generate" :disabled="!selectedId">Generar Factura</button>

      <pre v-if="invoice" class="output">{{ invoice }}</pre>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import { loadRequests } from '@/services/requests';
import { FacturaIndividual } from '@/services/invoiceGenerator';

const requests = ref([]);
onMounted(() => {
  requests.value = loadRequests(); 
});

const selectedId = ref('');
const invoice = ref('');

function generate() {
  const req = requests.value.find(r => r.id === +selectedId.value);
  invoice.value = new FacturaIndividual(req).generate();
}
</script>

<style scoped src="@/styles/invoice.css"></style>
