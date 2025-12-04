<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { onMounted, ref } from 'vue'
import { Dialog, Button } from 'primevue'

const ventas = ref<Venta[]>([])
const loading = ref(true)
const ventaDetalle = ref<Venta | null>(null)
const mostrarDetalleDialog = ref(false)
const detalles = ref<any[]>([])

async function obtenerVentasRecientes() {
  try {
    loading.value = true
    const response = await http.get('ventas')
    // Tomar las últimas 5 ventas y ordenar por ID descendente (más reciente primero)
    ventas.value = response.data
      .sort((a: Venta, b: Venta) => {
        // Primero intentar ordenar por fecha
        const fechaA = parsearFecha(a.fecha).getTime()
        const fechaB = parsearFecha(b.fecha).getTime()
        if (fechaA !== fechaB) {
          return fechaB - fechaA
        }
        // Si las fechas son iguales, ordenar por ID (más reciente = ID mayor)
        return (b.id || 0) - (a.id || 0)
      })
      .slice(0, 5)
  } catch (error) {
    console.error('Error al obtener ventas:', error)
  } finally {
    loading.value = false
  }
}

function parsearFecha(fecha: string | Date): Date {
  if (fecha instanceof Date) return fecha;

  const fechaStr = fecha.toString();

  // Formato YYYY-MM-DD (sin hora)
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const partes = fechaStr.split('-');
    // Asegurarnos de tener las 3 partes
    if (partes.length === 3) {
      const y = Number(partes[0]);
      const m = Number(partes[1]);
      const d = Number(partes[2]);

      // Verificar que sean números válidos
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        return new Date(y, m - 1, d); // constructor local: año, mesIndexadoEn0, día
      }
    }
    // Si las partes no son válidas, caeremos al fallback más abajo
  }

  // Fallback: intentar construir la fecha con el constructor estándar
  const parsed = new Date(fechaStr);
  // Si parsed es inválido (NaN), devolver la fecha actual como último recurso
  if (Number.isNaN(parsed.getTime())) {
    console.warn('parsearFecha: fecha inválida recibida ->', fechaStr);
    return new Date();
  }
  return parsed;
}



function formatearFecha(fecha: string | Date): string {
  const date = parsearFecha(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  const fechaComparar = new Date(date);
  fechaComparar.setHours(0, 0, 0, 0);

  if (fechaComparar.getTime() === hoy.getTime()) {
    return 'Hoy';
  } else if (fechaComparar.getTime() === ayer.getTime()) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}


function calcularTotal(venta: Venta): number {
  // Por ahora retornamos el total de la venta directamente
  return Number(venta.total) || 0
}

async function verDetalle(venta: Venta) {
  ventaDetalle.value = venta
  
  // Obtener los detalles desde el backend
  try {
    const detallesRaw = await http.get(`detalle-ventas/venta/${venta.id}`).then((res) => res.data)
    
    // Enriquecer los detalles con los nombres de productos/servicios
    const detallesEnriquecidos = await Promise.all(
      detallesRaw.map(async (item: any) => {
        if (item.idProducto) {
          try {
            const producto = await http.get(`productos/${item.idProducto}`).then((res) => res.data)
            return { ...item, producto }
          } catch (error) {
            console.error('Error al obtener producto:', error)
            return item
          }
        } else if (item.idServicio) {
          try {
            const servicio = await http.get(`servicios/${item.idServicio}`).then((res) => res.data)
            return { ...item, servicio }
          } catch (error) {
            console.error('Error al obtener servicio:', error)
            return item
          }
        }
        return item
      })
    )
    
    detalles.value = detallesEnriquecidos
    mostrarDetalleDialog.value = true
  } catch (error) {
    console.error('Error al obtener detalle de venta:', error)
  }
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
      <div 
        v-else-if="ventas.length > 0" 
        v-for="venta in ventas" 
        :key="venta.id" 
        class="activity-item clickable"
        @click="verDetalle(venta)"
      >
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

    <!-- Dialog de Detalle de Venta -->
    <Dialog
      v-model:visible="mostrarDetalleDialog"
      header="Detalle de la Venta"
      :style="{ width: '45rem' }"
      modal
    >
      <div v-if="ventaDetalle">
        <p style="color: #2c3e50; margin-bottom: 8px;">
          <b style="color: #ff6f61">Cliente:</b> {{ ventaDetalle.cliente?.nombres }} {{ ventaDetalle.cliente?.apellidos }}
        </p>
        <p style="color: #2c3e50; margin-bottom: 8px;">
          <b style="color: #ff6f61">Fecha:</b> {{ formatearFecha(ventaDetalle.fecha.toString()) }}
        </p>
        <p style="color: #2c3e50; margin-bottom: 16px;">
          <b style="color: #ff6f61">Total:</b> <span style="color: #27ae60; font-weight: 700;">Bs. {{ calcularTotal(ventaDetalle).toFixed(2) }}</span>
        </p>

        <h4 style="color: #27ae60; margin: 20px 0 12px 0;">Items de la venta</h4>

        <table class="styled-table">
          <thead>
            <tr>
              <th class="text-center">Tipo</th>
              <th class="text-center">Descripción</th>
              <th class="text-center">Cant.</th>
              <th class="text-center">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in detalles" :key="item.id">
              <td class="text-center">
                {{ item.idProducto ? 'Producto' : 'Servicio' }}
              </td>
              <td class="text-center">
                <span v-if="item.tipoItem === 'producto' && item.producto">
                  {{ item.producto.nombre }}
                </span>
                <span v-else-if="item.tipoItem === 'servicio' && item.servicio">
                  {{ item.servicio.nombre }}
                </span>
                <span v-else>Desconocido</span>
              </td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-center">Bs. {{ Number(item.precioUnitario).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <Button label="Cerrar" @click="mostrarDetalleDialog = false" severity="secondary" />
      </template>
    </Dialog>
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
  color: #27ae60;
  flex-shrink: 0;
}

.activity-item.clickable {
  cursor: pointer;
}

.activity-item.clickable:hover {
  background: linear-gradient(to right, #f0f9ff, #ffffff);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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

/* Estilos de tabla para el dialog de detalle */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.styled-table thead tr {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  text-align: center;
  font-weight: 600;
}

.styled-table th,
.styled-table td {
  padding: 12px 16px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #ecf0f1;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f8f9fa;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #667eea;
}

.styled-table tbody tr:hover {
  background-color: #e8eaf6;
}

.text-center {
  text-align: center;
}
</style>
