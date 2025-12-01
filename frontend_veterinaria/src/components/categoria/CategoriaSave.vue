<script setup lang="ts">

import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText } from 'primevue'
import { computed, ref, watch } from 'vue'

import type { Categoria } from '@/models/categoria'
import type { Producto } from '@/models/producto'
import ProductoSave from '../producto/ProductoSave.vue'

const ENDPOINT = 'categorias'
const props = defineProps({
  mostrar: Boolean,
  categoria: {
    type: Object as () => Categoria,
    default: () => ({}) as Categoria,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const categorias = ref<Categoria[]>([])

// Estado para el diálogo de mascota
const mostrarDialogoProducto = ref(false)
const categoriaGuardado = ref<Categoria | null>(null)
const productoParaRegistrar = ref<Producto>({} as Producto)

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) {
      emit('close')
      categoriaGuardado.value = null
      productoParaRegistrar.value = {} as Producto
    }
  },
})

const categoria = ref<Categoria>({ ...props.categoria })
watch(
  () => props.categoria,
  (newVal) => {
    categoria.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: categoria.value.nombre,
    }

    let categoriaId = categoria.value.id

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${categoria.value.id}`, body)
    } else {
      const response = await http.post(ENDPOINT, body)
      categoriaId = response.data.id
    }

    emit('guardar')
    categoria.value = {} as Categoria
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar La categoria')
  }
}

// Función para abrir el diálogo de mascota (guarda el cliente primero)
async function abrirDialogoProducto() {
  if (!categoria.value.nombre) {
    alert('Por favor complete primero la información de la categoria antes de agregar productos')
    return
  }
  
  try {
    // Guardar el cliente con la información del formulario
    const body = {
      nombre: categoria.value.nombre,
    }

    let categoriaId: number
    let categoriaCompleto: Categoria

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${categoria.value.id}`, body)
      categoriaId = categoria.value.id
      categoriaCompleto = { ...categoria.value, ...body }
    } else {
      const response = await http.post(ENDPOINT, body)
      categoriaId = response.data.id
      categoriaCompleto = { id: categoriaId, ...body }
    }

    // Guardar el cliente completo
    categoriaGuardado.value = categoriaCompleto
    
    // Crear objeto mascota con el cliente pre-seleccionado
    productoParaRegistrar.value = {
      idCategoria: categoriaId,
      categoria: categoriaCompleto,
    } as Producto
    
    // Abrir el diálogo de mascota
    mostrarDialogoProducto.value = true
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar el categoria')
  }
}

// Cuando se guarda un produto, cerrar ambos diálogos
function handleMascotaGuardada() {
  mostrarDialogoProducto.value = false
  // Emitir evento de guardado y cerrar el diálogo de cliente
  emit('guardar')
  categoria.value = {} as Categoria
  categoriaGuardado.value = null
  productoParaRegistrar.value = {} as Producto
  dialogVisible.value = false
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Categoria' : 'Nueva Categoria'"
      style="width: 35rem"
      :modal="true"
    >
      <!-- SECCIÓN: INFORMACIÓN PERSONAL -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-user section-icon"></i>
          <h4 class="section-title">Información de Categoria</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-id-card label-icon"></i>
              Nombre de categoria
            </label>
            <InputText
              v-model="categoria.nombre"
              class="flex-auto"
              autocomplete="off"
              maxlength="40"
              autofocus
              placeholder="Ingrese los nombre"
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
          label="Registrar Producto"
          icon="pi pi-heart"
          severity="success"
          @click="abrirDialogoProducto"
        />
        <Button label="Guardar categoria" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>

    <!-- Diálogo de Mascota -->
    <ProductoSave
      :mostrar="mostrarDialogoProducto"
      :producto="productoParaRegistrar"
      :modoEdicion="false"
      @guardar="handleMascotaGuardada"
      @close="mostrarDialogoProducto = false"
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
