<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

interface QuickAction {
  title: string
  description: string
  icon: string
  route: string
  color: string
}

const actions: QuickAction[] = [
  {
    title: 'Nueva Venta',
    description: 'Registrar una nueva venta',
    icon: 'pi-shopping-cart',
    route: '/ventas',
    color: 'blue',
  },
  {
    title: 'Nuevo Cliente',
    description: 'Registrar nuevo cliente',
    icon: 'pi-user-plus',
    route: '/clientes',
    color: 'green',
  },
  {
    title: 'Nueva Mascota',
    description: 'Registrar nueva mascota',
    icon: 'pi-heart',
    route: '/mascotas',
    color: 'purple',
  },
  {
    title: 'Productos',
    description: 'Gestionar inventario',
    icon: 'pi-box',
    route: '/productos',
    color: 'orange',
  },
  {
    title: 'Servicios',
    description: 'Gestionar servicios',
    icon: 'pi-briefcase',
    route: '/servicios',
    color: 'pink',
  },
  {
    title: 'Categorías',
    description: 'Gestionar categorías',
    icon: 'pi-tags',
    route: '/categorias',
    color: 'teal',
  },
]

function navigateTo(route: string) {
  router.push(route)
}
</script>

<template>
  <div class="quick-actions-container">
    <h2 class="section-title">
      <i class="pi pi-bolt"></i>
      Accesos Rápidos
    </h2>

    <div class="actions-grid">
      <div
        v-for="action in actions"
        :key="action.route"
        :class="['action-card', `action-${action.color}`]"
        @click="navigateTo(action.route)"
      >
        <div class="action-icon">
          <i :class="['pi', action.icon]"></i>
        </div>
        <div class="action-content">
          <h3 class="action-title">{{ action.title }}</h3>
          <p class="action-description">{{ action.description }}</p>
        </div>
        <div class="action-arrow">
          <i class="pi pi-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quick-actions-container {
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

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.action-card:hover::before {
  width: 100%;
  opacity: 0.08;
}

.action-card:hover .action-arrow {
  transform: translateX(4px);
}

.action-card:active {
  transform: translateY(-2px);
}

/* Colores para cada acción */
.action-blue .action-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-blue::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-green .action-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.action-green::before {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.action-purple .action-icon {
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
}

.action-purple::before {
  background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%);
}

.action-orange .action-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-orange::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-pink .action-icon {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
}

.action-pink::before {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
}

.action-teal .action-icon {
  background: linear-gradient(135deg, #0ba360 0%, #3cba92 100%);
}

.action-teal::before {
  background: linear-gradient(135deg, #0ba360 0%, #3cba92 100%);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon i {
  font-size: 24px;
  color: white;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.action-description {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0;
}

.action-arrow {
  color: #bdc3c7;
  transition: all 0.3s ease;
  font-size: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 20px;
  }
}
</style>
