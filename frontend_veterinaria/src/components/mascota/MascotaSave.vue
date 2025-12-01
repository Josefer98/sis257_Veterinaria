<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import type { Mascota } from '@/models/mascota'
import http from '@/plugins/axios'
import {
  Button,
  Calendar,
  Dialog,
  Dropdown,
  InputMask,
  InputNumber,
  InputText,
  Select,
  Textarea,
} from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'mascotas'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Mascota,
    default: () => ({}) as Mascota,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const clientes = ref<Cliente[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const mascota = ref<Mascota>({ ...props.mascota })
watch(
  () => props.mascota,
  (newVal) => {
    mascota.value = { ...newVal }
    mascota.value.idCliente = newVal?.clientes?.id
  },
)

async function obtenerCliente() {
  clientes.value = await http.get('clientes').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idCliente: mascota.value.idCliente,
      nombre: mascota.value.nombre,
      especie: mascota.value.especie,
      raza: mascota.value.raza,
      edad: mascota.value.edad,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${mascota.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    mascota.value = {} as Mascota
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerCliente()

      if (props.mascota?.id) {
        mascota.value = { ...props.mascota }
        mascota.value.idCliente = props.mascota.clientes?.id
      } else {
        mascota.value = {} as Mascota
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Mascota' : 'Nueva Mascota'"
      style="width: 35rem"
      :modal="true"
    >
      <!-- SECCIÓN: PROPIETARIO -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-user section-icon"></i>
          <h4 class="section-title">Propietario</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-user label-icon"></i>
              Cliente
            </label>
            <Select
              v-model="mascota.idCliente"
              :options="clientes"
              optionLabel="nombres"
              optionValue="id"
              class="flex-auto"
              placeholder="Seleccionar cliente"
              :filter="true"
              @change="mascota.idCliente = Number(mascota.idCliente)"
            />
          </div>
        </div>
      </div>

      <!-- SECCIÓN: INFORMACIÓN DE LA MASCOTA -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-heart section-icon"></i>
          <h4 class="section-title">Información de la Mascota</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-tag label-icon"></i>
              Nombre
            </label>
            <InputText
              v-model="mascota.nombre"
              class="flex-auto"
              autocomplete="off"
              placeholder="Nombre de la mascota"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-list label-icon"></i>
              Especie
            </label>
            <InputText
              v-model="mascota.especie"
              class="flex-auto"
              autocomplete="off"
              placeholder="Ej: Perro, Gato"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-info-circle label-icon"></i>
              Raza
            </label>
            <InputText
              v-model="mascota.raza"
              class="flex-auto"
              autocomplete="off"
              placeholder="Raza de la mascota"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-calendar label-icon"></i>
              Edad
            </label>
            <InputNumber
              v-model="mascota.edad"
              class="flex-auto"
              autocomplete="off"
              :min="0"
              suffix=" años"
              placeholder="Edad"
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
        <Button label="Guardar Mascota" icon="pi pi-save" @click="handleSave" />
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
