<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { onMounted, ref } from 'vue'

const productosStockBajo = ref<Producto[]>([])
const loading = ref(true)

async function obtenerProductosStockBajo() {
  try {
    loading.value = true
    const response = await http.get('productos')
    // Filtrar productos con stock menor a 10
    productosStockBajo.value = response.data
      .filter((p: Producto) => p.stock < 10)
      .sort((a: Producto, b: Producto) => a.stock - b.stock)
  } catch (error) {
    console.error('Error al obtener productos:', error)
  } finally {
    loading.value = false
  }
}

function getAlertClass(stock: number) {
  if (stock === 0) return 'alert-danger'
  if (stock < 5) return 'alert-warning'
  return 'alert-info'
}

function getAlertIcon(stock: number) {
  if (stock === 0) return 'pi-times-circle'
  if (stock < 5) return 'pi-exclamation-triangle'
  return 'pi-info-circle'
}

onMounted(() => {
  obtenerProductosStockBajo()
})
</script>

<template>
  <div class="dashboard-alerts-container">
    <h2 class="section-title">
      <i class="pi pi-bell"></i>
      Alertas y Notificaciones
    </h2>

    <div class="alerts-list">
      <!-- Skeleton Loading -->
      <div v-if="loading" v-for="i in 3" :key="i" class="alert-item skeleton-item">
        <div class="alert-icon skeleton-icon"></div>
        <div class="alert-content">
          <div class="skeleton-text skeleton-title"></div>
          <div class="skeleton-text skeleton-subtitle"></div>
        </div>
      </div>

      <!-- Alertas de Stock Bajo -->
      <div
        v-else-if="productosStockBajo.length > 0"
        v-for="producto in productosStockBajo"
        :key="producto.id"
        :class="['alert-item', getAlertClass(producto.stock)]"
      >
        <div class="alert-icon">
          <i :class="['pi', getAlertIcon(producto.stock)]"></i>
        </div>
        <div class="alert-content">
          <h4 class="alert-title">
            {{ producto.stock === 0 ? 'Producto Agotado' : 'Stock Bajo' }}
          </h4>
          <p class="alert-message">
            <strong>{{ producto.nombre }}</strong> - Solo quedan
            <strong>{{ producto.stock }} unidades</strong>
            {{ producto.stock === 0 ? '(Agotado)' : '' }}
          </p>
        </div>
        <div class="alert-action">
          <router-link to="/productos" class="alert-link">
            Ver producto
            <i class="pi pi-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <!-- Mensaje si no hay alertas -->
      <div v-else class="no-alerts">
        <i class="pi pi-check-circle"></i>
        <p>¡Todo en orden! No hay alertas en este momento</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-alerts-container {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title i {
  color: #ff6f61;
  font-size: 28px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alert-item {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.alert-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Tipos de alerta */
.alert-danger {
  border-left-color: #e74c3c;
  background: linear-gradient(to right, #fef5f5, #ffffff);
}

.alert-danger .alert-icon {
  background: #e74c3c;
}

.alert-warning {
  border-left-color: #f39c12;
  background: linear-gradient(to right, #fffbf5, #ffffff);
}

.alert-warning .alert-icon {
  background: #f39c12;
}

.alert-info {
  border-left-color: #3498db;
  background: linear-gradient(to right, #f5f9fc, #ffffff);
}

.alert-info .alert-icon {
  background: #3498db;
}

.alert-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon i {
  font-size: 20px;
  color: white;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 6px 0;
}

.alert-message {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

.alert-message strong {
  color: #2c3e50;
}

.alert-action {
  flex-shrink: 0;
}

.alert-link {
  color: #ff6f61;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.alert-link:hover {
  gap: 10px;
  color: #ff8a7a;
}

/* Skeleton Loading */
.skeleton-item {
  pointer-events: none;
  border-left-color: #e0e0e0;
}

.skeleton-icon {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 6px;
}

.skeleton-title {
  width: 150px;
  height: 18px;
}

.skeleton-subtitle {
  width: 300px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* No Alerts */
.no-alerts {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  color: #155724;
}

.no-alerts i {
  font-size: 64px;
  color: #28a745;
  margin-bottom: 16px;
}

.no-alerts p {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 20px;
  }
  
  .alert-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .alert-action {
    align-self: flex-end;
  }
}
</style>
