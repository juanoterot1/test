<template>
  <main class="request-page">
    <BlissHeader />

    <div class="form-container">
      <h2>Solicitar Servicio</h2>

      <form @submit.prevent="submitRequest">
        <label>
          Servicio
          <select v-model="form.serviceId" required>
            <option disabled value="">Selecciona uno</option>
            <option
              v-for="s in services"
              :key="s.id"
              :value="s.id"
            >{{ s.title }}</option>
          </select>
        </label>

        <label>
          Fecha y hora
          <input
            v-model="form.dateTime"
            type="datetime-local"
            required
          />
        </label>

        <label>
          Modalidad
          <select v-model="form.modality" required>
            <option disabled value="">Selecciona modalidad</option>
            <option value="online">En línea</option>
            <option value="presencial">Presencial</option>
            <option value="urgente">Urgente</option>
          </select>
        </label>

        <label>
          Ubicación (opcional)
          <input
            v-model="form.location"
            type="text"
            placeholder="Ciudad o dirección"
          />
        </label>

        <label>
          Observaciones
          <textarea
            v-model="form.observations"
            placeholder="Escribe aquí tus comentarios"
          />
        </label>

        <div class="buttons">
          <button type="button" @click="resetForm">Limpiar</button>
          <button type="submit">Enviar solicitud</button>
        </div>
      </form>

      <div v-if="result" class="result" :class="{ error: !result.ok }">
        <p>{{ result.ok ? '✅ ' : '❌ ' }}{{ result.message }}</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import { loadProfiles } from '@/services/profiles';
import {
  RequestCommand,
  createRequestChain
} from '@/services/requests';

const services = ref([]);
onMounted(() => {
  services.value = loadProfiles();
});

const form = reactive({
  serviceId: '',
  dateTime: '',
  modality: '',
  location: '',
  observations: ''
});

const result = ref(null);

function submitRequest() {
  const service = services.value.find(s => s.id === Number(form.serviceId));
  const requestData = {
    service,
    dateTime: form.dateTime,
    modality: form.modality,
    location: form.location,
    observations: form.observations
  };

  const chain = createRequestChain();
  const cmd = new RequestCommand(requestData, chain);
  const res = cmd.execute();

  if (res.ok) {
    result.value = { ok: true, message: 'Solicitud confirmada.' };
    resetForm();
  } else {
    result.value = { ok: false, message: res.message };
  }
}

function resetForm() {
  form.serviceId = '';
  form.dateTime = '';
  form.modality = '';
  form.location = '';
  form.observations = '';
  result.value = null;
}
</script>

<style scoped src="@/styles/requests.css"></style>
