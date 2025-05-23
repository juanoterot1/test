<!-- src/pages/RequestsPage.vue -->
<template>
  <main class="requests-list-page">
    <BlissHeader />

    <div class="list-header">
      <h2>Mis Solicitudes</h2>
      <button
        @click="goNew"
        aria-label="Nueva solicitud"
        class="icono-boton"
      >
        <PlusIcon class="icono-btn" />
      </button>
    </div>

    <div v-if="requests.length === 0" class="empty">
      No has enviado ninguna solicitud aún.
    </div>

    <div v-else class="requests-grid">
      <div
        v-for="r in requests"
        :key="r.id"
        class="request-card"
      >
        <h3 class="service-title">{{ r.service.title }}</h3>
        <p class="info"><strong>Fecha:</strong> {{ formatDate(r.dateTime) }}</p>
        <p class="info"><strong>Modalidad:</strong> {{ r.modality }}</p>
        <p class="info"><strong>Ubicación:</strong> {{ r.location || '—' }}</p>
        <p class="info" v-if="r.observations">
          <strong>Obs.:</strong> {{ r.observations }}
        </p>
        <div class="status" :class="r.status">{{ r.status }}</div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BlissHeader from '@/components/BlissHeader.vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { loadProfiles } from '@/services/profiles';

const router = useRouter();
const requests = ref([]);

// Carga o inicializa solicitudes en localStorage
function loadRequests() {
  return JSON.parse(localStorage.getItem('service_requests') || '[]');
}

const services = loadProfiles();

onMounted(() => {
  let all = loadRequests();
  if (all.length === 0) {
    // Si no hay, creamos dos de ejemplo
    const now = new Date();
    const sample1 = {
      id: Date.now(),
      service: services[0],
      dateTime: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      modality: services[0].deliveryModes[0] || 'online',
      location: services[0].location,
      observations: 'Me gustaría comenzar pronto',
      status: 'confirmada'
    };
    const sample2 = {
      id: Date.now() + 1,
      service: services[1],
      dateTime: new Date(now.getTime() + 48 * 3600 * 1000).toISOString(),
      modality: services[1].deliveryModes[0] || 'online',
      location: '',
      observations: '',
      status: 'confirmada'
    };
    all = [sample1, sample2];
    localStorage.setItem('service_requests', JSON.stringify(all));
  }
  requests.value = all;
});

function goNew() {
  router.push({ name: 'requestNew' });
}

function formatDate(dt) {
  return new Date(dt).toLocaleString();
}
</script>

<style scoped>
.requests-list-page {
  padding-top: 140px;
  padding-bottom: 100px;
  min-height: 100vh;
  background-color: #f3ddff;
  font-family: 'Bahnschrift', sans-serif;
  position: absolute;
  left: 0; right: 0;
  overflow-x: hidden;
}

.list-header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-header h2 {
  color: #6e1b93;
  font-size: 2rem;
}

.icono-boton {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #6e1b9a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.icono-boton:hover {
  transform: translateY(-2px);
}

.icono-btn {
  width: 24px;
  height: 24px;
  color: #6b21a8;
}

.empty {
  text-align: center;
  color: #6e1b93;
  margin-top: 2rem;
}

.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1280px;
  margin: 1rem auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

.request-card {
  background: white;
  border: 2px solid #bda6f5;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(123,31,162,0.25);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.service-title {
  font-weight: 800;
  color: #5e4db2;
  font-size: 1.25rem;
}

.info {
  font-size: 0.95rem;
  color: #4a3c71;
}

.status {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
}

.status.confirmada {
  background: #e5ffe5;
  color: #2e7d32;
  border: 1px solid #81c784;
}

.status.cancelada {
  background: #ffe5e5;
  color: #c62828;
  border: 1px solid #e57373;
}

@media (max-width: 768px) {
  .requests-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
