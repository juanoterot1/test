<template>
  <div class="routes-detail-page">
    <BlissHeader />

    <div class="top-section"></div>

    <div v-if="ruta" class="ruta-card">
      <div class="ruta-header">
        <div class="nombre-con-icono">
          <User class="ruta-icon" />
          <span class="ruta-nombre">{{ ruta.nombreRuta }}</span>
        </div>
        <div class="chip-id">ID {{ ruta.idRuta }}</div>
      </div>

      <div class="ruta-info">
        <div :class="['chip', ruta.estadoRuta === 'Activa' ? 'chip-verde' : 'chip-roja']">
          <Check v-if="ruta.estadoRuta === 'Activa'" class="chip-icon" />
          <X v-else class="chip-icon" />
          {{ ruta.estadoRuta }}
        </div>

        <div class="ficha-item">
          <User class="icon" />
          <span>Repartidor: {{ ruta.repartidorAsignado ?? 'No asignado' }}</span>
        </div>

        <div class="ficha-item">
          <Clock class="icon" />
          <span>Última modificación: {{ formatFecha(ruta.ultimaModificacion) }}</span>
        </div>

        <div class="ficha-item">
          <Users class="icon" />
          <span>Total entregas: {{ ruta.historialEntregas?.length ?? 0 }}</span>
        </div>
      </div>

      <button class="fab-button" @click="abrirModalEditar">
        <Pencil class="icon" />
      </button>
    </div>

    <div class="boton-asignar-contenedor" v-if="ruta">
      <button class="boton-asignar-cliente" @click="abrirModalAsignar">
        <Plus class="icon" />
      </button>
    </div>

    <div v-if="ruta?.clientesAsignados?.length" class="clientes-asignados">
      <h3>Clientes Asignados</h3>
      <ul>
        <li v-for="cliente in ruta.clientesAsignados" :key="cliente.id" class="cliente-item">
          <span>{{ cliente.nombre }}</span>
          <button class="eliminar-cliente" @click="abrirModalEliminar(cliente)">
            <Trash2 class="icon-rojo" />
          </button>
        </li>
      </ul>
    </div>

    <!-- MODAL EDITAR -->
    <div v-if="showModalEditar" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalEditarTitle">
      <div class="custom-alert editar-modal">
        <h2 id="modalEditarTitle">Editar Ruta</h2>
        <form @submit.prevent="guardarEditarRuta" class="editar-form">
          <label class="form-label">
            Nombre de la ruta
            <input v-model="editarNombreRuta" type="text" class="form-input" />
          </label>
          <label class="form-label">
            Repartidor asignado
            <input v-model.number="editarRepartidor" type="number" min="0" class="form-input" />
          </label>
          <div class="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" @click="cerrarModalEditar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL ASIGNAR -->
    <div v-if="showModalAsignar" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalAsignarTitle">
      <div class="custom-alert">
        <h2 id="modalAsignarTitle">Seleccionar Clientes</h2>
        <!-- Loading indicator -->
        <div v-if="loadingCustomers" class="loading">Cargando clientes...</div>
        <form v-else @submit.prevent="guardarAsignarClientes">
          <div class="clientes-modal-list">
            <div v-for="cliente in clientesDisponibles" :key="cliente.id" class="checkbox-item cliente-modal-item">
              <label>
                <input type="checkbox" v-model="clientesSeleccionados" :value="cliente.id" />
                {{ cliente.nombre }}
              </label>
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit">Asignar</button>
            <button type="button" @click="cerrarModalAsignar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL ELIMINAR -->
    <div v-if="showModalEliminar" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalEliminarTitle">
      <div class="custom-alert">
        <h2 id="modalEliminarTitle">Confirmar eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar a <strong>{{ clienteAEliminar?.nombre }}</strong>?</p>
        <div class="modal-buttons">
          <button @click="cerrarModalEliminar">Cancelar</button>
          <button class="danger" @click="confirmarEliminarCliente">Eliminar</button>
        </div>
      </div>
    </div>

    <BlissFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import rutasData from '@/json/routes.json';
import api from '@/services/api';
import BlissHeader from '@/components/BlissHeader.vue';
import BlissFooter from '@/components/BlissFooter.vue';
import { User, Clock, Users, Pencil, Trash2, Plus, Check, X } from 'lucide-vue-next';

const route = useRoute();

const ruta = ref(null);
const allCustomers = ref([]);
const loadingCustomers = ref(false);

const showModalEditar = ref(false);
const showModalAsignar = ref(false);
const showModalEliminar = ref(false);
const editarNombreRuta = ref('');
const editarRepartidor = ref(null);
const clientesSeleccionados = ref([]);
const clienteAEliminar = ref(null);

// Carga solo la ruta desde JSON
const loadRuta = () => {
  const id = Number(route.params.id);
  ruta.value = rutasData.find(r => r.idRuta === id) || null;
};

onMounted(loadRuta);

const formatFecha = iso => new Date(iso).toLocaleString();

// Modal abrir asignar: carga clientes desde API
const abrirModalAsignar = async () => {
  if (!ruta.value) return;
  loadingCustomers.value = true;
  try {
    const resp = await api.get('/customers');
    allCustomers.value = resp.data.result.map(c => ({ id: c.id, nombre: c.name }));
  } catch (e) {
    console.error('Error loading customers:', e);
  } finally {
    loadingCustomers.value = false;
  }
  clientesSeleccionados.value = [];
  showModalAsignar.value = true;
};
const cerrarModalAsignar = () => (showModalAsignar.value = false);

// Computed clientes disponibles usando allCustomers
const clientesDisponibles = computed(() => (
  ruta.value ? allCustomers.value.filter(c => !ruta.value.clientesAsignados?.some(a => a.id === c.id)) : []
));

// Guardar asignación
const guardarAsignarClientes = () => {
  clientesSeleccionados.value.forEach(id => {
    const cliente = allCustomers.value.find(c => c.id === id);
    if (cliente) {
      ruta.value.clientesAsignados = ruta.value.clientesAsignados || [];
      ruta.value.clientesAsignados.push({ id: cliente.id, nombre: cliente.nombre });
    }
  });
  cerrarModalAsignar();
};

// Resto de modales (editar, eliminar)
const abrirModalEditar = () => {
  if (!ruta.value) return;
  editarNombreRuta.value = ruta.value.nombreRuta;
  editarRepartidor.value = ruta.value.repartidorAsignado;
  showModalEditar.value = true;
};
const cerrarModalEditar = () => (showModalEditar.value = false);
const guardarEditarRuta = () => {
  ruta.value.nombreRuta = editarNombreRuta.value;
  ruta.value.repartidorAsignado = editarRepartidor.value;
  ruta.value.ultimaModificacion = new Date().toISOString();
  cerrarModalEditar();
};

const abrirModalEliminar = cliente => {
  clienteAEliminar.value = cliente;
  showModalEliminar.value = true;
};
const cerrarModalEliminar = () => (showModalEliminar.value = false);
const confirmarEliminarCliente = () => {
  ruta.value.clientesAsignados = ruta.value.clientesAsignados.filter(c => c.id !== clienteAEliminar.value.id);
  ruta.value.ultimaModificacion = new Date().toISOString();
  cerrarModalEliminar();
};
</script>

<style scoped src="@/styles/route-detail.css"></style>
