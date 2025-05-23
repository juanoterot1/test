<template>
  <div class="forgot-page">
    <div class="forgot-container">
      <!-- Contenedor del logo -->
      <div class="forgot-header">
        <img src="@/assets/Bliss.png" alt="Logo" class="forgot-logo" />
      </div>

      <!-- Contenedor del formulario -->
      <div class="forgot-card">
        <h2 class="forgot-subtitle">Recuperar Contraseña</h2>
        <p class="forgot-instruction">
          Ingresa tu correo para poder recuperar tu contraseña
        </p>

        <p class="forgot-text">Correo Electrónico</p>
        <input
          type="email"
          v-model="email"
          class="forgot-input"
          required
        />

        <button @click="handleRecover" class="forgot-button">
          Recuperar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importa el hook useRouter

const email = ref('');
const router = useRouter(); // Usamos el hook de Vue Router para navegar

const handleRecover = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.value) {
    alert('Por favor ingresa tu correo.');
    return;
  }

  if (!emailRegex.test(email.value)) {
    alert('Por favor ingresa un correo válido.');
    return;
  }

  // Mostrar alerta de éxito
  alert(`Se ha enviado un enlace de recuperación a: ${email.value}`);

  // Redirigir al login después de enviar la alerta
  router.push({ name: 'login' }); 
};
</script>

<style src="@/styles/forgot-password.css"></style>
