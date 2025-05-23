import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layout/MainLayout.vue';

// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const routes = [
  // Rutas públicas sin layout
  { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue') },
  { path: '/forgot-password', component: () => import('@/pages/ForgotPasswordPage.vue') },
  { path: '/register', component: () => import('@/pages/RegisterPage.vue') },

  // Redirección dinámica según autenticación
  {
    path: '/',
    redirect: () => (isAuthenticated() ? '/home' : '/login')
  },

  // Rutas privadas con layout
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', component: () => import('@/pages/HomePage.vue') },
      { path: 'clients', component: () => import('@/pages/ClientsPage.vue') },
      { path: 'clients/:id', name: 'ClientDetail', component: () => import('@/pages/ClientsDetailPage.vue') },
      { path: 'routes', component: () => import('@/pages/RoutesPage.vue') },
      { path: 'routes/:id', name: 'RouteDetail', component: () => import('@/pages/RoutesDetailPage.vue') },
      { path: 'productos', name: 'productos', component: () => import('@/pages/Articulos.vue') },
      { path: 'productos/:id', name: 'detalleArticulo', component: () => import('@/pages/DetalleArticulo.vue') },
      { path: 'carrito', component: () => import('@/pages/CarritoPage.vue') },
      { path: 'providers', name: 'providers', component: () => import('@/pages/ProvidersPage.vue') },
      { path: 'providerDetail/:id', name: 'providerDetail', component: () => import('@/pages/ProviderDetailPage.vue') },

      // ← Aquí agregamos las rutas de Servicios
      { path: 'services',           name: 'services',     component: () => import('@/pages/ServicesPage.vue') },
      { path: 'services/new',       name: 'serviceNew',   component: () => import('@/pages/ServiceFormPage.vue') },
      { path: 'services/:id/edit',  name: 'serviceEdit',  component: () => import('@/pages/ServiceFormPage.vue') },
      { path: 'services/:id/clone', name: 'serviceClone', component: () => import('@/pages/ServiceClonePage.vue') },
      { path: 'catalog', name: 'catalog', component: () => import('@/pages/CatalogPage.vue') },
      { path: 'pricing', name: 'pricing', component: () => import('@/pages/PricingPage.vue') },
      { path: 'requests',    name: 'requests',   component: () => import('@/pages/RequestsPage.vue') },
      { path: 'requests/new', name: 'requestNew', component: () => import('@/pages/RequestFormPage.vue') },
      { path: 'status', name: 'status', component: () => import('@/pages/ServiceStatusPage.vue') },
      { path: 'integration', name: 'integration', component: () => import('@/pages/IntegrationPage.vue') },
      { path: 'invoice', name: 'invoice', component: () => import('@/pages/InvoicePage.vue') },
      { path: 'summary', name: 'summary', component: () => import('@/pages/SummaryPage.vue') },
      { path: 'audit', name: 'audit', component: () => import('@/pages/AuditPage.vue') }



    ]
  },

  // Catch-all: página no encontrada
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de ruta global
router.beforeEach((to, from, next) => {
  // Si el usuario no está autenticado y trata de acceder a una ruta privada
  // pero la ruta es login, registro o recuperación de contraseña, se permite
  if (
    (to.path !== '/login' && to.path !== '/register' && to.path !== '/forgot-password') &&
    !isAuthenticated()
  ) {
    next('/login'); // Redirige al login si no está autenticado
  } else {
    next(); // Permite el acceso si está autenticado o si la ruta es pública
  }
});

export default router;
