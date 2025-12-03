<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { onMounted, ref } from 'vue'

const ventas = ref<Venta[]>([])
const loading = ref(true)

async function obtenerVentasRecientes() {
  try {
    loading.value = true
    const response = await http.get('ventas')
    // Tomar las últimas 5 ventas y ordenar por fecha descendente
    ventas.value = response.data
      .sort((a: Venta, b: Venta) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      })
      .slice(0, 5)
  } catch (error) {
    console.error('Error al obtener ventas:', error)
  } finally {
    loading.value = false
  }
}

function formatearFecha(fecha: string): string {
  const date = new Date(fecha)
  const opciones: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return date.toLocaleDateString('es-ES', opciones)
}

function calcularTotal(venta: Venta): number {
  // Por ahora retornamos el total de la venta directamente
  return Number(venta.total) || 0
}

onMounted(() => {
  obtenerVentasRecientes()
})
</script>

<template>
  <div class="recent-activity-container">
    <h2 class="section-title">
      <i class="pi pi-clock"></i>
      Actividad Reciente
    </h2>

    <div class="activity-list">
      <!-- Skeleton Loading -->
      <div v-if="loading" v-for="i in 5" :key="i" class="activity-item skeleton-item">
        <div class="activity-icon skeleton-icon"></div>
        <div class="activity-content">
          <div class="skeleton-text skeleton-title"></div>
          <div class="skeleton-text skeleton-subtitle"></div>
        </div>
        <div class="skeleton-text skeleton-amount"></div>
      </div>

      <!-- Ventas -->
      <div v-else-if="ventas.length > 0" v-for="venta in ventas" :key="venta.id" class="activity-item">
        <div class="activity-icon">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <div class="activity-content">
          <h4 class="activity-title">Venta #{{ venta.id }}</h4>
          <p class="activity-subtitle">
            <i class="pi pi-user"></i>
            {{ venta.cliente ? `${venta.cliente.nombres} ${venta.cliente.apellidos}` : 'Cliente no especificado' }}
          </p>
          <p class="activity-date">
            <i class="pi pi-calendar"></i>
            {{ formatearFecha(venta.fecha.toString()) }}
          </p>
        </div>
        <div class="activity-amount">
          Bs. {{ calcularTotal(venta).toFixed(2) }}
        </div>
      </div>

      <!-- Mensaje si no hay ventas -->
      <div v-else class="no-activity">
        <i class="pi pi-inbox"></i>
        <p>No hay ventas recientes</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-activity-container {
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

.activity-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #ecf0f1;
  transition: all 0.3s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: linear-gradient(to right, #fff5f3, #ffffff);
}

.activity-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon i {
  font-size: 20px;
  color: white;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 6px 0;
}

.activity-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.activity-subtitle i {
  font-size: 12px;
}

.activity-date {
  font-size: 13px;
  color: #95a5a6;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.activity-date i {
  font-size: 11px;
}

.activity-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ff6f61;
  flex-shrink: 0;
}

/* Skeleton Loading */
.skeleton-item {
  pointer-events: none;
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
  width: 120px;
  height: 18px;
}

.skeleton-subtitle {
  width: 180px;
}

.skeleton-amount {
  width: 80px;
  height: 20px;
  margin: 0;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* No Activity */
.no-activity {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.no-activity i {
  font-size: 64px;
  color: #bdc3c7;
  margin-bottom: 16px;
}

.no-activity p {
  font-size: 16px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .section-title {
    font-size: 20px;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .activity-amount {
    align-self: flex-end;
  }
}
</style>
