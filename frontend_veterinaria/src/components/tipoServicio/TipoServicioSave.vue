<script setup lang="ts">
import type { Producto } from '@/models/producto'
import type { Servicio } from '@/models/servicio'
import type { TipoServicio } from '@/models/tipo-servicio'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText } from 'primevue'
import { computed, ref, watch } from 'vue'
import ServicioSave from '../servicio/ServicioSave.vue'


const ENDPOINT = 'tipo-servicios'
const props = defineProps({
  mostrar: Boolean,
  tipoServicio: {
    type: Object as () => TipoServicio,
    default: () => ({}) as TipoServicio,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const tipoServicios = ref<TipoServicio[]>([])

// Estado para el diálogo de mascota
const mostrarDialogoMascota = ref(false)
const tipoServicioGuardado = ref<TipoServicio | null>(null)
const servicioParaRegistrar = ref<Servicio>({} as Servicio)

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) {
      emit('close')
      tipoServicioGuardado.value = null
      servicioParaRegistrar.value = {} as Servicio
    }
  },
})

const tipoServicio = ref<TipoServicio>({ ...props.tipoServicio })
watch(
  () => props.tipoServicio,
  (newVal) => {
    tipoServicio.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: tipoServicio.value.nombre,
    }

    let tipoServicioId = tipoServicio.value.id

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${tipoServicio.value.id}`, body)
    } else {
      const response = await http.post(ENDPOINT, body)
      tipoServicioId = response.data.id
    }

    emit('guardar')
    tipoServicio.value = {} as TipoServicio
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar el tipo de servicio')
  }
}

// Función para abrir el diálogo de servicio (guarda el tipo de servicio primero)
async function abrirDialogoServicios() {
  if (!tipoServicio.value.nombre) {
    alert('Por favor complete primero la información del tipo de el servicio antes de agregar servicios')
    return
  }
  
  try {
    // Guardar el tipo de servicios con la información del formulario
    const body = {
      nombre: tipoServicio.value.nombre,
    }

    let tipoServicioId: number
    let tipoServicioCompleto: TipoServicio

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${tipoServicio.value.id}`, body)
      tipoServicioId = tipoServicio.value.id
      tipoServicioCompleto = { ...tipoServicio.value, ...body }
    } else {
      const response = await http.post(ENDPOINT, body)
      tipoServicioId = response.data.id
      tipoServicioCompleto = { id: tipoServicioId, ...body }
    }

    // Guardar el tipo de servicio completo
    tipoServicioGuardado.value = tipoServicioCompleto
    
    // Crear objeto mascota con el tipos de servicio pre-seleccionado
    servicioParaRegistrar.value = {
      idTipoServicio: tipoServicioId,
      tipoServicio: tipoServicioCompleto,
    } as Servicio
    
    // Abrir el diálogo de mascota
    mostrarDialogoMascota.value = true
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar el tipo de servicio')
  }
}

// Cuando se guarda una mascota, cerrar ambos diálogos
function handleMascotaGuardada() {
  mostrarDialogoMascota.value = false
  // Emitir evento de guardado y cerrar el diálogo de tipo de servicio
  emit('guardar')
  tipoServicio.value = {} as TipoServicio
  tipoServicioGuardado.value = null
  servicioParaRegistrar.value = {} as Servicio
  dialogVisible.value = false
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio'"
      style="width: 35rem"
      :modal="true"
    >
      <!-- SECCIÓN: INFORMACIÓN PERSONAL -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-user section-icon"></i>
          <h4 class="section-title">Información del Tipo de Servicio</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-id-card label-icon"></i>
              Nombres
            </label>
            <InputText
              v-model="tipoServicio.nombre"
              class="flex-auto"
              autocomplete="off"
              maxlength="40"
              autofocus
              placeholder="Ingrese el nombre"
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
        <Button
          label="Registrar Servicios"
          icon="pi pi-heart"
          severity="success"
          @click="abrirDialogoServicios"
        />
        <Button label="Guardar Tipo de Servicio" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>

    <!-- Diálogo de Mascota -->
    <ServicioSave
      :mostrar="mostrarDialogoMascota"
      :servicio="servicioParaRegistrar"
      :modoEdicion="false"
      @guardar="handleMascotaGuardada"
      @close="mostrarDialogoMascota = false"
    />
  </div>
</template>

<style>
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

/* Personalizar el overlay/mask del diálogo (fondo detrás del diálogo) */
:deep(.p-dialog-mask) {
  background-color: rgba(255, 245, 230, 0.9) !important;
  backdrop-filter: blur(4px);
}

/* Personalizar el contenido del diálogo */
:deep(.p-dialog) {
  background-color: #fff5e6 !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
}

/* Personalizar el header del diálogo */
:deep(.p-dialog-header) {
  background: linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%) !important;
  color: white !important;
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
  padding: 1.25rem 1.5rem !important;
}

:deep(.p-dialog-title) {
  color: white !important;
  font-weight: 600 !important;
  font-size: 1.25rem !important;
}

:deep(.p-dialog-header-close) {
  color: white !important;
}

:deep(.p-dialog-header-close:hover) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

/* Personalizar inputs */
:deep(.p-inputtext) {
  border: 2px solid #ffd4cc !important;
  border-radius: 8px !important;
  padding: 0.75rem !important;
  transition: all 0.3s ease !important;
}

:deep(.p-inputtext:focus) {
  border-color: #ff6f61 !important;
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1) !important;
}

:deep(.p-inputnumber-input) {
  border: 2px solid #ffd4cc !important;
  border-radius: 8px !important;
  padding: 0.75rem !important;
  transition: all 0.3s ease !important;
}

:deep(.p-inputnumber-input:focus) {
  border-color: #ff6f61 !important;
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1) !important;
}
</style>
