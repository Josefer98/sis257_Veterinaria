<script setup lang="ts">
import type { Servicio } from '@/models/servicio'
import http from '@/plugins/axios'
import { onMounted, ref } from 'vue'

const servicios = ref<Servicio[]>([])
const loading = ref(true)

async function obtenerServiciosDestacados() {
  try {
    loading.value = true
    console.log('Iniciando petición de servicios...')
    const response = await http.get('servicios')
    console.log('Respuesta servicios:', response)
    
    // Manejar si la respuesta es un array directo o un objeto paginado
    const data = Array.isArray(response.data) ? response.data : response.data.data
    
    if (Array.isArray(data)) {
      servicios.value = data.slice(0, 6)
    } else {
      console.error('Formato de respuesta inesperado:', response.data)
      servicios.value = []
    }
  } catch (error) {
    console.error('Error al obtener servicios:', error)
  } finally {
    loading.value = false
    console.log('Finalizó carga de servicios')
  }
}

const iconosPorTipo: { [key: string]: { icon: string; color: string } } = {
  consulta: { icon: 'pi-heart', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  valoracion: { icon: 'pi-chart-bar', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  clinica: { icon: 'pi-heart-fill', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  vacuna: { icon: 'pi-shield', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  vacunacion: { icon: 'pi-shield', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  inyeccion: { icon: 'pi-shield', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  cirugia: { icon: 'pi-heart', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  operacion: { icon: 'pi-heart', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  esterilizacion: { icon: 'pi-heart', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  peluqueria: { icon: 'pi-scissors', color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  estetico: { icon: 'pi-star', color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  estetica: { icon: 'pi-star', color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  corte: { icon: 'pi-scissors', color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  pelo: { icon: 'pi-scissors', color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  emergencia: { icon: 'pi-exclamation-triangle', color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' },
  emergencias: { icon: 'pi-exclamation-triangle', color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' },
  urgencia: { icon: 'pi-exclamation-triangle', color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' },
  atencion: { icon: 'pi-phone', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  inmediata: { icon: 'pi-exclamation-triangle', color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' },
  hospedaje: { icon: 'pi-home', color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  default: { icon: 'pi-briefcase', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
}

function normalizarTexto(texto: string): string {
  return texto.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .trim()
}

function getEstiloServicio(tipoServicio: string | undefined): { icon: string; color: string } {
  if (!tipoServicio) return iconosPorTipo.default!
  
  const tipoNormalizado = normalizarTexto(tipoServicio)
  
  // Buscar coincidencia exacta o parcial
  const key = Object.keys(iconosPorTipo).find(k => {
    if (k === 'default') return false
    const keyNormalizada = normalizarTexto(k)
    return tipoNormalizado.includes(keyNormalizada) || keyNormalizada.includes(tipoNormalizado)
  })
  
  return iconosPorTipo[key || 'default']!
}

onMounted(() => {
  obtenerServiciosDestacados()
})
</script>

<template>
  <div class="featured-services-container">
    <div class="section-header">
      <h2 class="section-title">
        <i class="pi pi-briefcase"></i>
        Servicios Destacados
      </h2>
      <router-link to="/servicios" class="view-all-link">
        Ver todos
        <i class="pi pi-arrow-right"></i>
      </router-link>
    </div>

    <div class="services-grid">
      <!-- Skeleton Loading -->
      <div v-if="loading" v-for="i in 6" :key="i" class="service-card skeleton-card">
        <div class="service-icon skeleton-icon"></div>
        <div class="service-info">
          <div class="skeleton-text skeleton-title"></div>
          <div class="skeleton-text skeleton-type"></div>
          <div class="skeleton-text skeleton-description"></div>
          <div class="skeleton-text skeleton-price"></div>
        </div>
      </div>

      <!-- Servicios -->
      <div v-else v-for="servicio in servicios" :key="servicio.id" class="service-card">
        <div class="service-icon" :style="{ background: getEstiloServicio(servicio.tipoServicio?.nombre).color }">
          <i :class="['pi', getEstiloServicio(servicio.tipoServicio?.nombre).icon]"></i>
        </div>
        <div class="service-info">
          <h3 class="service-name">{{ servicio.nombre }}</h3>
          <p class="service-type">
            <i class="pi pi-tag"></i>
            {{ servicio.tipoServicio?.nombre || 'Sin tipo' }}
          </p>
          <p class="service-description">{{ servicio.descripcion }}</p>
          <div class="service-footer">
            <span class="service-price">Bs. {{ Number(servicio.precio).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay servicios -->
      <div v-if="!loading && servicios.length === 0" class="no-services">
        <i class="pi pi-inbox"></i>
        <p>No hay servicios registrados</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured-services-container {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title i {
  color: #ff6f61;
  font-size: 28px;
}

.view-all-link {
  color: #8e44ad;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  gap: 10px;
  color: #ff8a7a;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  gap: 16px;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}



.service-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  /* background se define dinámicamente */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-icon i {
  font-size: 28px;
  color: white;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.service-type {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.service-type i {
  font-size: 12px;
}

.service-description {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 16px 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #ecf0f1;
}

.service-price {
  font-size: 18px;
  font-weight: 700;
  color: #27ae60;
}



/* Skeleton Loading */
.skeleton-card {
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
  margin-bottom: 8px;
}

.skeleton-title {
  width: 70%;
  height: 20px;
}

.skeleton-type {
  width: 50%;
}

.skeleton-description {
  width: 100%;
  height: 40px;
}

.skeleton-price {
  width: 30%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* No Services */
.no-services {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.no-services i {
  font-size: 64px;
  color: #bdc3c7;
  margin-bottom: 16px;
}

.no-services p {
  font-size: 16px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style>
