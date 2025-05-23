<template>
  <main class="service-form-page">
    <BlissHeader />

    <div class="form-container">
      <h2>
        {{ isClone ? 'Clonar Perfil' : isEdit ? 'Editar Perfil' : 'Nuevo Perfil' }}
      </h2>

      <form @submit.prevent="onSubmit">
        <label>
          Título
          <input v-model="form.title" type="text" required />
        </label>

        <label>
          Descripción
          <textarea v-model="form.description" required />
        </label>

        <label>
          Experiencia
          <input v-model="form.experience" type="text" placeholder="Años / Detalles" />
        </label>

        <label>
          Tarifa (USD)
          <input v-model.number="form.rate" type="number" min="0" />
        </label>

        <label>
          Ubicación
          <input v-model="form.location" type="text" />
        </label>

        <fieldset>
          <legend>Modos de entrega</legend>
          <label><input type="checkbox" value="online" v-model="form.deliveryModes" /> En línea</label>
          <label><input type="checkbox" value="presencial" v-model="form.deliveryModes" /> Presencial</label>
        </fieldset>

        <label>
          Contacto (email o teléfono)
          <input v-model="form.contact" type="text" />
        </label>

        <label>
          URL de Imagen
          <input v-model="form.imageUrl" type="url" placeholder="https://..." />
        </label>

        <label>
          Video presentación (URL)
          <input v-model="form.videoUrl" type="url" />
        </label>

        <label>
          <input type="checkbox" v-model="form.scheduleExtended" />
          Horario extendido
        </label>

        <label>
          <input type="checkbox" v-model="form.groupService" />
          Servicio grupal
        </label>

        <div class="buttons">
          <button type="button" @click="cancel">Cancelar</button>
          <button type="submit">
            {{ isEdit || isClone ? 'Guardar Cambios' : 'Crear Perfil' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BlissHeader from '@/components/BlissHeader.vue';
import {
  ProfileBuilder,
  ServiceProfile,
  loadProfiles,
  saveProfiles
} from '@/services/profiles';

const router = useRouter();
const route = useRoute();

const form = reactive({
  id: null,
  title: '',
  description: '',
  experience: '',
  rate: 0,
  location: '',
  deliveryModes: [],
  contact: '',
  imageUrl: '',
  videoUrl: '',
  scheduleExtended: false,
  groupService: false
});

const profiles = loadProfiles();
const isEdit = computed(() => route.name === 'serviceEdit');
const isClone = computed(() => route.name === 'serviceClone');
const pid = computed(() => Number(route.params.id));

onMounted(() => {
  if (isEdit.value || isClone.value) {
    const existing = profiles.find(p => p.id === pid.value);
    if (!existing) return router.replace({ name: 'services' });
    // Cargar todos los campos, incluida imageUrl
    Object.assign(form, existing);
    if (isClone.value) {
      const clone = new ServiceProfile(existing).clone();
      Object.assign(form, clone, { imageUrl: existing.imageUrl });
    }
  }
});

function cancel() {
  router.push({ name: 'services' });
}

function onSubmit() {
  const b = new ProfileBuilder()
    .setTitle(form.title)
    .setDescription(form.description)
    .setExperience(form.experience)
    .setRate(form.rate)
    .setLocation(form.location)
    .setDeliveryModes(form.deliveryModes)
    .setContact(form.contact)
    .setVideoUrl(form.videoUrl)
    .enableScheduleExtended(form.scheduleExtended)
    .enableGroupService(form.groupService);

  let prof = b.build();
  // Asignar la imagen manualmente
  prof.imageUrl = form.imageUrl;

  if (isEdit.value) {
    prof.id = form.id;
    const idx = profiles.findIndex(p => p.id === form.id);
    profiles.splice(idx, 1, prof);
  } else {
    profiles.push(prof);
  }
  saveProfiles(profiles);
  router.push({ name: 'services' });
}
</script>

<style scoped>
.service-form-page {
  padding-top: 140px;
  padding-bottom: 100px;
  min-height: 100vh;
  background-color: #f9f5ff;
  position: absolute; left: 0; right: 0;
  overflow-x: hidden;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.form-container h2 {
  margin-bottom: 1.5rem;
  color: #6a1b9a;
  font-family: 'Bahnschrift', sans-serif;
}

.form-container label {
  display: block;
  margin-bottom: 1rem;
  font-family: 'Bahnschrift', sans-serif;
}

.form-container input,
.form-container textarea {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

fieldset {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  font-family: 'Bahnschrift', sans-serif;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.buttons button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Bahnschrift', sans-serif;
}

.buttons button:first-child {
  background: #eee;
}

.buttons button:last-child {
  background: #6a1b9a;
  color: white;
}
</style>
