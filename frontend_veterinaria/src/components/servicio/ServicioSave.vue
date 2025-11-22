<script setup lang="ts">
import type { Servicio } from '@/models/servicio'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'servicios'
const props = defineProps({
  mostrar: Boolean,
  servicio: {
    type: Object as () => Servicio,
    default: () => ({}) as Servicio,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const servicio = ref<Servicio>({ ...props.servicio })
watch(
  () => props.servicio,
  (newVal) => {
    servicio.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: servicio.value.nombre,
      descripcion: servicio.value.descripcion,
      tipoServicio: servicio.value.tipoServicio,
      precio: servicio.value.precio,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${servicio.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    servicio.value = {} as Servicio
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Servicio' : 'Nuevo Servicio'"
      style="width: 35rem"
      :modal="true"
    >
      <!-- SECCIÓN: INFORMACIÓN DEL SERVICIO -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-briefcase section-icon"></i>
          <h4 class="section-title">Información del Servicio</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-tag label-icon"></i>
              Nombre
            </label>
            <InputText
              v-model="servicio.nombre"
              class="flex-auto"
              autocomplete="off"
              autofocus
              placeholder="Nombre del servicio"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-align-left label-icon"></i>
              Descripción
            </label>
            <InputText
              v-model="servicio.descripcion"
              class="flex-auto"
              autocomplete="off"
              placeholder="Descripción del servicio"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-list label-icon"></i>
              Tipo de Servicio
            </label>
            <InputText
              v-model="servicio.tipoServicio"
              class="flex-auto"
              autocomplete="off"
              placeholder="Ej: Consulta, Vacunación"
            />
          </div>
        </div>
      </div>

      <!-- SECCIÓN: PRECIO -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-dollar section-icon"></i>
          <h4 class="section-title">Precio</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-money-bill label-icon"></i>
              Precio
            </label>
            <InputNumber
              v-model="servicio.precio"
              class="flex-auto"
              autocomplete="off"
              mode="decimal"
              :min-fraction-digits="2"
              :max-fraction-digits="2"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="action-buttons">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button label="Guardar Servicio" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* ===== SECCIONES CON TARJETAS ===== */
.section-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.section-header {
  background: linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  color: white;
  font-size: 18px;
}

.section-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.3px;
}

.section-content {
  padding: 20px;
}

/* ===== FORMULARIOS ===== */
.form-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-label {
  font-weight: 600;
  color: #333;
  min-width: 140px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.label-icon {
  color: #ff6f61;
  font-size: 16px;
}

/* ===== BOTONES DE ACCIÓN ===== */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
