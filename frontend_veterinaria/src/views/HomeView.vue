<script setup lang="ts">
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import FeaturedProducts from '@/components/dashboard/FeaturedProducts.vue'
import FeaturedServices from '@/components/dashboard/FeaturedServices.vue'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'
import DashboardAlerts from '@/components/dashboard/DashboardAlerts.vue'
</script>

<template>
  <main class="dashboard-container">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">
          <i class="pi pi-home"></i>
          Panel de Administración
        </h1>
        <p class="dashboard-subtitle">Bienvenido al sistema de gestión de PetCare Veterinaria</p>
      </div>
      <div class="header-actions">
        <span class="current-date">
          <i class="pi pi-calendar"></i>
          {{ new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </span>
      </div>
    </div>

    <!-- Estadísticas Principales -->
    <DashboardStats />

    <!-- Accesos Rápidos -->
    <QuickActions />

    <!-- Grid de Catálogos -->
    <div class="catalogs-grid">
      <div class="catalog-column">
        <FeaturedProducts />
      </div>
      <div class="catalog-column">
        <FeaturedServices />
      </div>
    </div>

    <!-- Grid de Actividad y Alertas -->
    <div class="activity-alerts-grid">
      <div class="activity-column">
        <RecentActivity />
      </div>
      <div class="alerts-column">
        <DashboardAlerts />
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 24px 32px 24px; /* Aumentado padding-top para evitar solapamiento */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.dashboard-header {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.header-content {
  flex: 1;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-title i {
  color: #ff6f61;
  font-size: 36px;
}

.dashboard-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-date {
  font-size: 14px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 500;
  text-transform: capitalize;
}

.current-date i {
  color: #ff6f61;
  font-size: 16px;
}

/* Grid de Catálogos */
.catalogs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.catalog-column {
  min-width: 0;
}

/* Grid de Actividad y Alertas */
.activity-alerts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.activity-column,
.alerts-column {
  min-width: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .catalogs-grid,
  .activity-alerts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 100px 16px 20px 16px; /* Ajustado para móviles */
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .dashboard-title i {
    font-size: 28px;
  }
  
  .dashboard-subtitle {
    font-size: 14px;
  }
  
  .current-date {
    font-size: 12px;
  }
}

/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-container > * {
  animation: fadeInUp 0.6s ease-out;
}

.dashboard-container > *:nth-child(1) {
  animation-delay: 0.1s;
}

.dashboard-container > *:nth-child(2) {
  animation-delay: 0.2s;
}

.dashboard-container > *:nth-child(3) {
  animation-delay: 0.3s;
}

.dashboard-container > *:nth-child(4) {
  animation-delay: 0.4s;
}

.dashboard-container > *:nth-child(5) {
  animation-delay: 0.5s;
}
</style>
