<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Select, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const categorias = ref<Categoria[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const producto = ref<Producto>({ ...props.producto })
watch(
  () => props.producto,
  (newVal) => {
    producto.value = { ...newVal }
    producto.value.idCategoria = newVal?.categoria?.id
  },
)

async function obtenerCategorias() {
  categorias.value = await http.get('categorias').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idCategoria: producto.value.idCategoria,
      nombre: producto.value.nombre,
      categoria: producto.value.categoria,
      descripcion: producto.value.descripcion,
      precio: producto.value.precio,
      stock: producto.value.stock,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerCategorias()

      if (props.producto?.id) {
        producto.value = { ...props.producto }
        producto.value.idCategoria = props.producto.categoria?.id
      } else {
        producto.value = {} as Producto
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Producto' : 'Nuevo Producto'"
      style="width: 35rem"
      :modal="true"
    >
      <!-- SECCIÓN: INFORMACIÓN DEL PRODUCTO -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-box section-icon"></i>
          <h4 class="section-title">Información del Producto</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-tag label-icon"></i>
              Nombre
            </label>
            <InputText
              v-model="producto.nombre"
              class="flex-auto"
              autocomplete="off"
              autofocus
              placeholder="Nombre del producto"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-list label-icon"></i>
              Categoría
            </label>
            <Select
              v-model="producto.idCategoria"
              :options="categorias"
              optionLabel="nombre"
              optionValue="id"
              class="flex-auto"
              placeholder="Seleccionar categoria"
              :filter="true"
              @change="producto.idCategoria = Number(producto.idCategoria)"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-align-left label-icon"></i>
              Descripción
            </label>
            <InputText
              v-model="producto.descripcion"
              class="flex-auto"
              autocomplete="off"
              placeholder="Descripción del producto"
            />
          </div>
        </div>
      </div>

      <!-- SECCIÓN: PRECIO Y STOCK -->
      <div class="section-card">
        <div class="section-header">
          <i class="pi pi-dollar section-icon"></i>
          <h4 class="section-title">Precio y Stock</h4>
        </div>

        <div class="section-content">
          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-money-bill label-icon"></i>
              Precio
            </label>
            <InputNumber
              v-model="producto.precio"
              class="flex-auto"
              autocomplete="off"
              mode="decimal"
              :min-fraction-digits="2"
              :max-fraction-digits="2"
              placeholder="0.00"
            />
          </div>

          <div class="form-row">
            <label class="form-label">
              <i class="pi pi-database label-icon"></i>
              Stock
            </label>
            <InputNumber
              v-model="producto.stock"
              class="flex-auto"
              autocomplete="off"
              :min="0"
              placeholder="Cantidad disponible"
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
        <Button label="Guardar Producto" icon="pi pi-save" @click="handleSave" />
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
