<template>
  <main class="summary-page">
    <BlissHeader />

    <div class="page-container">
      <h2>Resumen de Servicios</h2>

      <label>
        Periodo
        <select v-model="period">
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>
      </label>

      <button @click="generate">Generar Resumen</button>

      <pre v-if="summary" class="output">{{ summary }}</pre>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import { loadRequests } from '@/services/requests';
import { FacturaResumen } from '@/services/invoiceGenerator';

const period = ref('weekly');
const summary = ref('');
const requests = ref([]);

onMounted(() => {
  requests.value = loadRequests();
});

function generate() {
  summary.value = new FacturaResumen(requests.value, period.value).generate();
}
</script>

<style scoped src="@/styles/summary.css"></style>
