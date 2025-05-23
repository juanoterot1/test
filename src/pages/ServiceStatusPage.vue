<template>
  <main class="status-page">
    <BlissHeader />

    <div class="status-container">
      <h1>Estado de Servicios</h1>

      <div class="services-grid">
        <div
          v-for="ctx in contexts"
          :key="ctx.service.id"
          class="status-card"
        >
          <h3>{{ ctx.service.title }}</h3>
          <p class="state">
            Estado: <strong>{{ ctx.state.name }}</strong>
          </p>
          <div class="actions">
            <button
              v-for="act in ctx.transitions()"
              :key="act"
              @click="ctx[act]()"
            >
              {{ labels[act] }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlissHeader from '@/components/BlissHeader.vue';
import { loadProfiles } from '@/services/profiles';
import {
  ServiceMediator,
  CalendarModule,
  NotificationModule,
  BillingModule,
  AvailabilityModule,
  StatePersistenceModule,
  ServiceContext
} from '@/services/serviceState';

const labels = {
  reserve: 'Reservar',
  start: 'Iniciar',
  complete: 'Finalizar',
  pause: 'Pausar',
  resume: 'Reanudar',
  cancel: 'Cancelar'
};

const contexts = ref([]);

onMounted(() => {
  const med = new ServiceMediator();
  med.register(new CalendarModule());
  med.register(new NotificationModule());
  med.register(new BillingModule());
  med.register(new AvailabilityModule());
  med.register(new StatePersistenceModule());

  const services = loadProfiles();
  contexts.value = services.map(s => new ServiceContext(s, med));
});
</script>

<style scoped src="@/styles/serviceStatus.css"></style>
