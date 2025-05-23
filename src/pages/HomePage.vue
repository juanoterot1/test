<template>
  <div class="home-page">
    <!-- Componente de encabezado -->
    <BlissHeader />

    <div class="content custom-background">
      <div class="home-container">
        <!-- Contenedor para el logo -->
        <div class="left-container">
          <img src="@/assets/Bliss.png" alt="Logo" class="Bliss-logo-home" />
        </div>

        <!-- Contenedor para el texto "Bienvenido" y las tarjetas -->
        <div class="right-container">
          <h1 class="welcome-title">Bienvenido</h1>

          <!-- Tarjetas de navegación -->
          <div class="menu-grid">
            <div
              class="menu-card"
              v-for="item in menuItems"
              :key="item.label"
              @click="mostrarAlerta(item.label)"
            >
              <span class="menu-icon">
                <component :is="item.icon" />
              </span>
              <p>{{ item.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { CubeIcon, UsersIcon, MapIcon, ShoppingCartIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

const menuItems = [
  { label: 'Gestión de Inventario', icon: CubeIcon, route: '/productos' },
  { label: 'Gestión de Clientes', icon: UsersIcon, route: '/clients' },
  { label: 'Gestión de Rutas', icon: MapIcon, route: '/routes' },
  { label: 'Gestión de Proveedores', icon: BuildingOfficeIcon, route: '/providers' }
];

const mostrarAlerta = (label) => {
  const item = menuItems.find(i => i.label === label);
  if (item?.route) {
    router.push(item.route).catch((err) => console.log(err));
  } else {
    alert(`Has presionado: ${label}`);
  }
};
</script>

<style scoped src="@/styles/home.css"></style>
