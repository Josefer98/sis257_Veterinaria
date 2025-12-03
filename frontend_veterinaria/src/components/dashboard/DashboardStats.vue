<script setup lang="ts">
import http from '@/plugins/axios'
import { onMounted, ref } from 'vue'

interface Stats {
  totalClientes: number
  totalMascotas: number
  totalVentas: number
  productosStockBajo: number
}

const stats = ref<Stats>({
  totalClientes: 0,
  totalMascotas: 0,
  totalVentas: 0,
  productosStockBajo: 0,
})

const loading = ref(true)

async function obtenerEstadisticas() {
  try {
    loading.value = true
    
    // Obtener datos de todos los endpoints
    const [clientes, mascotas, ventas, productos] = await Promise.all([
      http.get('clientes').then((res) => res.data),
      http.get('mascotas').then((res) => res.data),
      http.get('ventas').then((res) => res.data),
      http.get('productos').then((res) => res.data),
    ])

    // Calcular estadísticas
    stats.value.totalClientes = clientes.length
    stats.value.totalMascotas = mascotas.length
    stats.value.totalVentas = ventas.length
    stats.value.productosStockBajo = productos.filter((p: any) => p.stock < 10).length
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  obtenerEstadisticas()
})
</script>

<template>
  <div class="stats-container">
    <h2 class="stats-title">
      <i class="pi pi-chart-line"></i>
      Estadísticas Generales
    </h2>
    
    <div class="stats-grid">
      <!-- Tarjeta: Total Clientes -->
      <div class="stat-card stat-card-blue">
        <div class="stat-icon">
          <i class="pi pi-users"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value" v-if="!loading">{{ stats.totalClientes }}</h3>
          <div class="stat-skeleton" v-else></div>
          <p class="stat-label">Clientes Registrados</p>
        </div>
      </div>

      <!-- Tarjeta: Total Mascotas -->
      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <i class="pi pi-heart"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value" v-if="!loading">{{ stats.totalMascotas }}</h3>
          <div class="stat-skeleton" v-else></div>
          <p class="stat-label">Mascotas en Cuidado</p>
        </div>
      </div>

      <!-- Tarjeta: Total Ventas -->
      <div class="stat-card stat-card-purple">
        <div class="stat-icon">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value" v-if="!loading">{{ stats.totalVentas }}</h3>
          <div class="stat-skeleton" v-else></div>
          <p class="stat-label">Ventas Realizadas</p>
        </div>
      </div>

      <!-- Tarjeta: Stock Bajo -->
      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value" v-if="!loading">{{ stats.productosStockBajo }}</h3>
          <div class="stat-skeleton" v-else></div>
          <p class="stat-label">Productos Stock Bajo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  margin-bottom: 40px;
}

.stats-title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-title i {
  color: #ff6f61;
  font-size: 28px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  width: 100%;
  opacity: 0.05;
}

/* Colores para cada tarjeta */
.stat-card-blue .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-blue::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-green .stat-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card-green::before {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card-purple .stat-icon {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
}

.stat-card-purple::before {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
}

.stat-card-orange .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card-orange::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon i {
  font-size: 28px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 500;
}

.stat-skeleton {
  width: 80px;
  height: 36px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-title {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 28px;
  }
}
</style>
