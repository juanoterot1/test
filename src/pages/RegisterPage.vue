<!-- src/views/Register.vue -->
<template>
  <div class="register-page">
    <div class="register-header">
      <img src="@/assets/Bliss.png" alt="Logo" class="bliss-logo" />
    </div>

    <div class="register-container">
      <h2 class="title">Crea tu cuenta</h2>
      <form @submit.prevent="handleRegister" class="form-wrapper">
        <label class="register-text">Usuario</label>
        <input v-model="username" type="text" required />

        <label class="register-text">Correo electrónico</label>
        <input v-model="email" type="email" required />

        <label class="register-text">Contraseña</label>
        <input v-model="password" type="password" required />

        <label class="register-text">Confirmar contraseña</label>
        <input v-model="confirmPassword" type="password" required />

        <button type="submit" class="register-button">Registrarse</button>
        <button type="button" @click="goToLogin" class="login-link">
          Ya tengo cuenta
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const goToLogin = () => router.push('/login');

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (
    !username.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Por favor completa todos los campos.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  try {
    await api.post('/users', {
      username: username.value,
      email: email.value,
      password: password.value
    });
    successMessage.value = 'Usuario creado correctamente. Redirigiendo…';
    setTimeout(() => router.push('/login'), 1500);
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || 'Error al crear usuario.';
  }
};
</script>

<style scoped src="@/styles/register.css"></style>
<style scoped>
/* Ajustes un poco más grandes */
.register-container {
  max-width: 400px;
  margin: 1.5rem auto;
  padding: 1rem;
}
.title {
  font-size: 1.4rem;
  margin-bottom: 0.7rem;
}
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.form-wrapper input {
  padding: 0.6rem;
  font-size: 1rem;
}
.form-wrapper label {
  font-size: 0.95rem;
}
.register-button,
.login-link {
  font-size: 1rem;
  padding: 0.7rem;
}
.error-message,
.success-message {
  margin-top: 0.5rem;
  font-size: 0.85rem;
}
</style>