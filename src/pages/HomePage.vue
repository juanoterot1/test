<!-- src/pages/HomePage.vue -->
<template>
  <div class="home-page">
    <BlissHeader />
    <div class="content custom-background">
      <div class="home-container">
        <div class="left-container">
          <img src="@/assets/Bliss.png" alt="Logo" class="Bliss-logo-home" />
        </div>
        <div class="right-container">
          <h1 class="welcome-title">Bienvenido</h1>
          <div class="menu-grid">
            <div
              class="menu-card"
              v-for="item in menuItems"
              :key="item.name"
              @click="navigate(item)"
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
import { useRouter } from 'vue-router';
import {
  CubeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ReceiptIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();

const menuItems = [
  { label: 'Servicios',     icon: CubeIcon,                  name: 'services'     },
  { label: 'Catálogo',      icon: FolderIcon,                name: 'catalog'      },
  { label: 'Solicitudes',   icon: ClipboardDocumentListIcon, name: 'requests'     },
  { label: 'Tarifas',       icon: CurrencyDollarIcon,        name: 'pricing'      },
  { label: 'Estado',        icon: CheckCircleIcon,           name: 'status'       },
  { label: 'Entrega/Pago',  icon: CreditCardIcon,            name: 'integration'  },
  { label: 'Factura',       icon: ReceiptIcon,               name: 'invoice'      },
  { label: 'Resumen',       icon: ChartBarIcon,              name: 'summary'      },
  { label: 'Auditoría',     icon: ShieldCheckIcon,           name: 'audit'        }
];

function navigate(item) {
  router.push({ name: item.name }).catch(() => {});
}
</script>

<style scoped src="@/styles/home.css"></style>
