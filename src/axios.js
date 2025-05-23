// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',  // Cambia esta URL al endpoint base al backend
  timeout: 5000,  // Timeout de 5 segundos (opcional)
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
