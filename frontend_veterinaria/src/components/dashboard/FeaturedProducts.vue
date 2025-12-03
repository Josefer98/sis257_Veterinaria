<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { onMounted, ref } from 'vue'

const productos = ref<Producto[]>([])
const loading = ref(true)

async function obtenerProductosDestacados() {
  try {
    loading.value = true
    console.log('Iniciando petición de productos...')
    const response = await http.get('productos')
    console.log('Respuesta productos:', response)
    
    // Manejar si la respuesta es un array directo o un objeto paginado
    const data = Array.isArray(response.data) ? response.data : response.data.data
    
    if (Array.isArray(data)) {
      productos.value = data.slice(0, 6)
      console.log('Productos cargados:', productos.value.map(p => ({ id: p.id, nombre: p.nombre, imagenUrl: p.imagenUrl })))
    } else {
      console.error('Formato de respuesta inesperado en productos:', response.data)
      productos.value = []
    }
  } catch (error) {
    console.error('Error al obtener productos:', error)
  } finally {
    loading.value = false
    console.log('Finalizó carga de productos')
  }
}

function getStockClass(stock: number) {
  if (stock === 0) return 'stock-empty'
  if (stock < 10) return 'stock-low'
  return 'stock-good'
}

function getStockText(stock: number) {
  if (stock === 0) return 'Agotado'
  if (stock < 10) return 'Stock Bajo'
  return 'Disponible'
}

onMounted(() => {
  obtenerProductosDestacados()
})
</script>

<template>
  <div class="featured-products-container">
    <div class="section-header">
      <h2 class="section-title">
        <i class="pi pi-box"></i>
        Productos Destacados
      </h2>
      <router-link to="/productos" class="view-all-link">
        Ver todos
        <i class="pi pi-arrow-right"></i>
      </router-link>
    </div>

    <div class="products-grid">
      <!-- Skeleton Loading -->
      <div v-if="loading" v-for="i in 6" :key="i" class="product-card skeleton-card">
        <div class="product-image skeleton-image"></div>
        <div class="product-info">
          <div class="skeleton-text skeleton-title"></div>
          <div class="skeleton-text skeleton-category"></div>
          <div class="skeleton-text skeleton-price"></div>
        </div>
      </div>

      <!-- Productos -->
      <div v-else v-for="producto in productos" :key="producto.id" class="product-card">
        <div class="product-image">
          <img 
            v-if="producto.imagenUrl" 
            :src="producto.imagenUrl" 
            :alt="producto.nombre"
            class="product-img-real"
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
          <div class="image-placeholder" v-if="!producto.imagenUrl">
            <i class="pi pi-box"></i>
          </div>
          <span :class="['stock-badge', getStockClass(producto.stock)]">
            {{ getStockText(producto.stock) }}
          </span>
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ producto.nombre }}</h3>
          <p class="product-category">
            <i class="pi pi-tag"></i>
            {{ producto.categoria.nombre }}
          </p>
          <div class="product-footer">
            <span class="product-price">Bs. {{ Number(producto.precio).toFixed(2) }}</span>
            <span class="product-stock">
              <i class="pi pi-database"></i>
              {{ producto.stock }} unid.
            </span>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay productos -->
      <div v-if="!loading && productos.length === 0" class="no-products">
        <i class="pi pi-inbox"></i>
        <p>No hay productos registrados</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.featured-products-container {
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
  color: #ff6f61;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-img-real {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img-real {
  transform: scale(1.05);
}

.image-placeholder {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-placeholder i {
  font-size: 36px;
  color: #ff6f61;
}

.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stock-good {
  background: #d4edda;
  color: #155724;
}

.stock-low {
  background: #fff3cd;
  color: #856404;
}

.stock-empty {
  background: #f8d7da;
  color: #721c24;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-category {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.product-category i {
  font-size: 12px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #ecf0f1;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff6f61;
}

.product-stock {
  font-size: 13px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-stock i {
  font-size: 12px;
}

/* Skeleton Loading */
.skeleton-card {
  pointer-events: none;
}

.skeleton-image {
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
  width: 80%;
  height: 20px;
}

.skeleton-category {
  width: 60%;
}

.skeleton-price {
  width: 40%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* No Products */
.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.no-products i {
  font-size: 64px;
  color: #bdc3c7;
  margin-bottom: 16px;
}

.no-products p {
  font-size: 16px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .product-image {
    height: 140px;
  }
}
</style>
