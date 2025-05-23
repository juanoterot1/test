<template>
    <div class="layout">
        <BlissHeader />

        <main class="routes-wrapper">
            <div class="routes-container">
                <!-- Campo de búsqueda y filtros -->
                <div class="filters-row">
                    <input v-model="filtroNombre" placeholder="Buscar rutas" class="search-input" />
                    <button class="filter-button" @click="mostrarFiltros = true">
                        <FunnelIcon class="icon" />
                        <span>Filtros</span>
                    </button>
                </div>

                <!-- Lista de rutas -->
                <div class="routes-list">
                    <div class="ruta-etiqueta" v-for="ruta in rutasFiltradas" :key="ruta.idRuta"
                        @click="verDetalle(ruta.idRuta)">
                        <h2>{{ ruta.nombreRuta }}</h2>
                        <div class="ruta-info">
                            <p>
                                Estado
                                <strong :class="ruta.estadoRuta === 'Activa' ? 'estado-activa' : 'estado-inactiva'">
                                    {{ ruta.estadoRuta }}
                                </strong>
                            </p>
                            <div class="right-info">
                                <p>Última modificación {{ formatFecha(ruta.ultimaModificacion) }}</p>
                                <p class="clientes-count">
                                    <UserGroupIcon class="icon-clientes" />
                                    {{ ruta.clientesAsignados?.length || 0 }}
                                </p>

                            </div>

                            <button @click.stop="toggleEstado(ruta)">
                                {{ ruta.estadoRuta === 'Activa' ? 'Desactivar' : 'Activar' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <BlissFooter />

        <!-- Modal Filtros -->
        <div v-if="mostrarFiltros" class="modal-overlay" @click.self="mostrarFiltros = false">
            <div class="modal">
                <h3>Filtrar rutas</h3>
                <label><input type="radio" value="Activa" v-model="filtroEstado" /> Activa</label>
                <label><input type="radio" value="Inactiva" v-model="filtroEstado" /> Inactiva</label>
                <label><input type="radio" value="" v-model="filtroEstado" /> Todas</label>
                <button @click="mostrarFiltros = false">Aplicar</button>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import rutasData from '@/json/routes.json'
import { FunnelIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import BlissHeader from '@/components/BlissHeader.vue'
import BlissFooter from '@/components/BlissFooter.vue'

export default {
    components: {
        BlissHeader,
        BlissFooter,
        UserGroupIcon,
        FunnelIcon
    },
    setup() {
        const rutas = ref([])
        const filtroNombre = ref('')
        const filtroEstado = ref('')
        const mostrarFiltros = ref(false)

        const router = useRouter()

        onMounted(() => {
            rutas.value = rutasData
        })

        const verDetalle = (id) => {
            router.push(`/routes/${id}`)
        }

        const toggleEstado = (ruta) => {
            ruta.estadoRuta = ruta.estadoRuta === 'Activa' ? 'Inactiva' : 'Activa'
            ruta.ultimaModificacion = new Date().toISOString()
        }

        const formatFecha = (iso) => {
            const d = new Date(iso)
            return d.toLocaleString()
        }

        const volver = () => {
            router.push('/home')
        }

        const rutasFiltradas = computed(() => {
            return rutas.value.filter((ruta) => {
                const nombreCoincide = ruta.nombreRuta.toLowerCase().includes(filtroNombre.value.toLowerCase())
                const estadoCoincide = filtroEstado.value === '' || ruta.estadoRuta === filtroEstado.value
                return nombreCoincide && estadoCoincide
            })
        })

        return {
            rutas,
            filtroNombre,
            filtroEstado,
            rutasFiltradas,
            toggleEstado,
            verDetalle,
            formatFecha,
            volver,
            mostrarFiltros
        }
    }
}
</script>

<style scoped src="@/styles/routes.css"></style>
