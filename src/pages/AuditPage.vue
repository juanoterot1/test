<!-- src/pages/AuditPage.vue -->
<template>
  <main class="audit-page">
    <BlissHeader />

    <div class="audit-container">
      <h1>Auditoría de Servicios</h1>

      <div class="actions-top">
        <button @click="undoLast" class="btn-undo" :disabled="!canUndo">
          Deshacer última
        </button>
      </div>

      <div class="services-grid">
        <div
          v-for="s in services"
          :key="s.id"
          class="audit-card"
        >
          <h3>{{ s.title }}</h3>
          <p><strong>Tarifa actual:</strong> {{ s.rate }} USD</p>

          <!-- Solo la modificación en línea -->
          <div class="card-actions">
            <input
              type="number"
              v-model.number="newRates[s.id]"
              placeholder="Nueva tarifa"
            />
            <button @click="onModify(s.id)">Modificar</button>
          </div>

          <!-- Botón de eliminar abajo -->
          <div class="card-delete">
            <button @click="onDelete(s.id)" class="danger">Eliminar</button>
          </div>
        </div>
      </div>

      <div v-if="message" class="msg">{{ message }}</div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import { loadProfiles } from '@/services/profiles';
import { ServiceAdminProxy } from '@/services/audit';

const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const proxy = new ServiceAdminProxy(currentUser);

const services = ref([]);
const newRates = reactive({});
const message = ref('');
const canUndo = ref(false);

function load() {
  services.value = loadProfiles();
  services.value.forEach(s => { newRates[s.id] = s.rate; });
}
onMounted(() => load());

function onModify(id) {
  try {
    proxy.modifyRate(id, newRates[id]);
    message.value = 'Tarifa modificada con éxito.';
    canUndo.value = true;
    load();
  } catch (e) {
    message.value = e.message;
  }
}

function onDelete(id) {
  try {
    proxy.deleteService(id);
    message.value = 'Servicio eliminado.';
    canUndo.value = true;
    load();
  } catch (e) {
    message.value = e.message;
  }
}

function undoLast() {
  try {
    const prev = proxy.undo();
    if (prev) {
      message.value = 'Operación revertida.';
      canUndo.value = false;
      load();
    } else {
      message.value = 'Nada que deshacer.';
    }
  } catch (e) {
    message.value = e.message;
  }
}
</script>

<style scoped src="@/styles/audit.css"></style>
