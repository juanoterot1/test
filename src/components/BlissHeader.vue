<template>
  <header class="custom-toolbar">
    <h1 class="custom-title">Bliss</h1>
    <div class="custom-buttons">
      <button class="round-button" @click="toggleMenu" aria-label="Abrir perfil">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4
          v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- Menú de perfil -->
  <div v-if="menuVisible" class="profile-menu active">
    <div class="profile-menu-header">
      <p>Perfil</p>
      <div class="info-row">
        <span class="label">Nombre: </span>
        <span class="value">{{ usuario.username || usuario.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">Correo: </span>
        <span class="value">{{ usuario.email }}</span>
      </div>
    </div>
    <button class="logout-btn" @click="cerrarSesion">Cerrar Sesión</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const menuVisible = ref(false);
const router = useRouter();
const route = useRoute();

// Computed que lee usuario desde localStorage
const usuario = computed(() => {
  const stored = localStorage.getItem('user') || '{}';
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
});

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

// Cierra el menú al cambiar de ruta
watch(route, () => {
  menuVisible.value = false;
});
</script>

<style scoped src="@/styles/bliss-header.css"></style>
