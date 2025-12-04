<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Tip {
  icon: string
  title: string
  content: string
  color: string
}

const tips: Tip[] = [
  {
    icon: 'pi pi-heart',
    title: 'Hidratación es clave',
    content: 'Asegúrate de que tu mascota siempre tenga acceso a agua fresca y limpia, especialmente en días calurosos.',
    color: '#ff6f61'
  },
  {
    icon: 'pi pi-sun',
    title: 'Paseos seguros',
    content: 'Evita pasear a tu perro en las horas de mayor calor para prevenir quemaduras en sus almohadillas.',
    color: '#f9ca24'
  },
  {
    icon: 'pi pi-apple',
    title: 'Alimentación balanceada',
    content: 'Consulta con nuestros veterinarios sobre la dieta ideal para la edad y raza de tu mascota.',
    color: '#6ab04c'
  },
  {
    icon: 'pi pi-shield',
    title: 'Vacunación al día',
    content: 'Mantener el calendario de vacunación actualizado es la mejor forma de prevenir enfermedades graves.',
    color: '#686de0'
  }
]

const currentTip = ref<Tip>(tips[0]!)

onMounted(() => {
  // Cambiar tip aleatoriamente cada vez que se carga
  const randomIndex = Math.floor(Math.random() * tips.length)
  currentTip.value = tips[randomIndex]!
})
</script>

<template>
  <div class="tip-card">
    <div class="tip-header">
      <div class="tip-icon-wrapper" :style="{ backgroundColor: currentTip.color + '20' }">
        <i :class="currentTip.icon" :style="{ color: currentTip.color }"></i>
      </div>
      <h3 class="tip-title">Consejo del Día</h3>
    </div>
    <div class="tip-content">
      <h4>{{ currentTip.title }}</h4>
      <p>{{ currentTip.content }}</p>
    </div>
    <div class="tip-decoration">
      <i class="pi pi-info-circle"></i>
    </div>
  </div>
</template>

<style scoped>
.tip-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-left: 4px solid #ff6f61;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.tip-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-icon-wrapper i {
  font-size: 24px;
}

.tip-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.tip-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.tip-content p {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
}

.tip-decoration {
  position: absolute;
  bottom: -10px;
  right: -10px;
  opacity: 0.05;
}

.tip-decoration i {
  font-size: 100px;
  color: #2c3e50;
}
</style>
