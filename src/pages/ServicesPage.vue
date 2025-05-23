<!-- src/pages/ServicesPage.vue -->
<template>
  <main>
    <BlissHeader />

    <div class="page-header">
      <h1>Mis Servicios</h1>
      <button
        @click="goNew"
        aria-label="Agregar servicio"
        class="icono-boton"
      >
        <CubeIcon class="icono-btn" />
      </button>
    </div>

    <div v-if="profiles.length === 0" class="no-services">
      No hay servicios aún. Pulsa “+” para crear uno.
    </div>

    <div v-else class="services-grid">
      <div
        v-for="p in profiles"
        :key="p.id"
        class="service-card"
        @click="goEdit(p.id)"
      >
        <img
          v-if="p.imageUrl"
          :src="p.imageUrl"
          :alt="`Imagen de ${p.title}`"
          class="service-image"
        />
        <h3 class="service-title">{{ p.title }}</h3>
        <p class="service-desc">
          {{ p.description || 'Sin descripción' }}
        </p>
        <div class="card-actions">
          <button @click.stop="goEdit(p.id)">✎</button>
          <button @click.stop="goClone(p.id)">⧉</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BlissHeader from '@/components/BlissHeader.vue';
import { CubeIcon } from '@heroicons/vue/24/outline';
import { loadProfiles, saveProfiles } from '@/services/profiles';

const router = useRouter();
const profiles = ref([]);

// Tus tres servicios por defecto con URL de imagen
const defaultProfiles = [
  {
    id: 1,
    title: 'Desarrollo Web',
    description: 'Creación de sitios web modernos',
    experience: '5 años',
    rate: 50,
    location: 'Remoto',
    deliveryModes: ['online'],
    contact: 'web@ejemplo.com',
    videoUrl: '',
    imageUrl:
      'https://i0.wp.com/niaxus.com/wp-content/uploads/2024/08/c2b30-desarrollo-web-a-medida.webp?resize=1200%2C628&ssl=1',
    scheduleExtended: false,
    groupService: false
  },
  {
    id: 2,
    title: 'Consultoría AWS',
    description: 'Optimización de infra en AWS',
    experience: '3 años',
    rate: 80,
    location: 'Bogotá',
    deliveryModes: ['online', 'presencial'],
    contact: 'aws@ejemplo.com',
    videoUrl: '',
    imageUrl:
      'https://lituus.cl/Analytics/cloud-computing/IMG/Logo-AWS-smile.webp',
    scheduleExtended: true,
    groupService: false
  },
  {
    id: 3,
    title: 'Diseño UX/UI',
    description: 'Interfaces intuitivas y atractivas',
    experience: '4 años',
    rate: 60,
    location: 'Remoto',
    deliveryModes: ['online'],
    contact: 'ux@ejemplo.com',
    videoUrl: '',
    imageUrl:
      'https://imgcom.masterd.es/1/blog/2022/04/diferencia_ux_ui_rrss.jpg',
    scheduleExtended: false,
    groupService: true
  }
];

onMounted(() => {
  const stored = loadProfiles();
  if (!Array.isArray(stored) || stored.length === 0) {
    // primera vez: cargamos completos
    profiles.value = defaultProfiles;
    saveProfiles(defaultProfiles);
  } else {
    // ya había datos: rellenamos imageUrl donde falte
    const merged = stored.map(p => {
      const def = defaultProfiles.find(d => d.id === p.id);
      return {
        ...p,
        imageUrl: p.imageUrl || (def ? def.imageUrl : '')
      };
    });
    profiles.value = merged;
    saveProfiles(merged);
  }
});

function goNew() {
  router.push({ name: 'serviceNew' });
}
function goEdit(id) {
  router.push({ name: 'serviceEdit', params: { id } });
}
function goClone(id) {
  router.push({ name: 'serviceClone', params: { id } });
}
</script>

<style scoped>
main {
  padding-top: 140px;
  padding-bottom: 100px;
  min-height: 100vh;
  background-color: #f3ddff;
  position: absolute;
  left: 0;
  right: 0;
  overflow-x: hidden;
  font-family: 'Bahnschrift', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto 30px;
  padding: 0 2rem;
}
.page-header h1 {
  font-size: 2.2rem;
  color: #6e1b93;
}

.icono-boton {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #6e1b93;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}
.icono-boton:hover {
  transform: translateY(-2px);
}
.icono-btn {
  width: 40px;
  height: 40px;
  color: #6b21a8;
}

.no-services {
  text-align: center;
  color: #6e1b93;
  font-size: 1.1rem;
  margin-top: 2rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

.service-card {
  position: relative;
  background: linear-gradient(135deg, #d7c9f7cc, #f3e8ffcc);
  border: 2px solid #bda6f5;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(189, 166, 245, 0.25);
  cursor: pointer;
  transition: transform 0.35s ease, box-shadow 0.35s ease,
    background 0.35s ease;
}
.service-card:hover {
  background: linear-gradient(135deg, #cbb9f7ee, #e8d9ffee);
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 15px 40px rgba(189, 166, 245, 0.4);
}

.service-card::before {
  content: '★ BLISS';
  position: absolute;
  top: 10px;
  left: 20px;
  background-color: #bda6f5;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(189, 166, 245, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.service-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 16px;
}

.service-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #5e4db2;
  margin-bottom: 0.5rem;
}
.service-desc {
  font-size: 1rem;
  color: #584d7a;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.card-actions {
  display: flex;
  gap: 1rem;
}
.card-actions button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6a1b9a;
  cursor: pointer;
  transition: color 0.2s ease;
}
.card-actions button:hover {
  color: #3d1368;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
