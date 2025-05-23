<!-- src/views/Login.vue -->
<template>
  <div class="login-page">
    <!-- Overlay de carga -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <div class="login-container">
      <div class="login-header">
        <img src="@/assets/Bliss.png" alt="Logo" class="Bliss-logo" />
      </div>

      <div class="login-card">
        <form @submit.prevent="handleLogin" class="form-wrapper">
          <p class="welcome-text">Bienvenido de nuevo</p>
          <p class="instruction-text">
            Ingresa tu usuario y contraseña para continuar
          </p>

          <p class="label-text">Usuario</p>
          <input
            type="text"
            v-model="username"
            class="login-input"
            required
          />

          <p class="label-text">Contraseña</p>
          <input
            type="password"
            v-model="password"
            class="login-input"
            required
          />

          <div class="recover-password">
            <router-link to="/forgot-password" class="recover-link">
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="loading"
          >
            Iniciar Sesión
          </button>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <div class="register-link">
            ¿No tienes cuenta?
            <router-link to="/register" class="register-link-text">
              Regístrate
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = '';
  if (!username.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos.';
    return;
  }

  loading.value = true;
  try {
    const resp = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    });
    const token = resp.data.access_token;
    const user  = resp.data.user;
    if (!token) throw new Error('No se recibió access_token');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/home');
  } catch (err) {
    console.error(err);
    errorMessage.value =
      err.response?.data?.msg || err.message || 'Error al iniciar sesión.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped src="@/styles/login.css"></style>
