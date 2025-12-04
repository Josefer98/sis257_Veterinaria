<script setup lang="ts">
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import FeaturedProducts from '@/components/dashboard/FeaturedProducts.vue'
import FeaturedServices from '@/components/dashboard/FeaturedServices.vue'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'
import DashboardAlerts from '@/components/dashboard/DashboardAlerts.vue'
import TipsOfTheDay from '@/components/dashboard/TipsOfTheDay.vue'
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
        
        <!-- Info Cards -->
        <div class="header-info-cards">
          <div class="info-card">
            <i class="pi pi-calendar"></i>
            <div class="info-card-content">
              <span class="info-label">Fecha</span>
              <span class="info-value">{{ new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-clock"></i>
            <div class="info-card-content">
              <span class="info-label">Última actualización</span>
              <span class="info-value">{{ new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-user"></i>
            <div class="info-card-content">
              <span class="info-label">Usuario</span>
              <span class="info-value">Administrador</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-check-circle"></i>
            <div class="info-card-content">
              <span class="info-label">Estado del sistema</span>
              <span class="info-value status-active">Activo</span>
            </div>
          </div>
        </div>
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
        <div class="mt-4">
          <TipsOfTheDay />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 24px 32px 24px; /* Aumentado padding-top para evitar solapamiento */
}

.dashboard-header {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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
  margin: 0 0 24px 0;
}

/* Info Cards */
.header-info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.info-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 4px solid #ff6f61;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-card i {
  font-size: 24px;
  color: #ff6f61;
}

.info-card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 11px;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 700;
}

.status-active {
  color: #27ae60;
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
