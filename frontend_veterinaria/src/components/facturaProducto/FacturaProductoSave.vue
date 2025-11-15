<script setup lang="ts">
import type { FacturaProducto } from '@/models/facturaproducto'
import type { Producto } from '@/models/producto'
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { Button, Dialog, InputMask, InputNumber, InputText, Select, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'factura-productos'
const props = defineProps({
  mostrar: Boolean,
  facturaProducto: {
    type: Object as () => FacturaProducto,
    default: () => ({}) as FacturaProducto,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const productos = ref<Producto[]>([])
const ventas = ref<Venta[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const facturaProducto = ref<FacturaProducto>({ ...props.facturaProducto })
watch(
  () => props.facturaProducto,
  (newVal) => {
    facturaProducto.value = { ...newVal }
    facturaProducto.value.idProducto = newVal?.producto?.id
  },
)

async function obtenerVenta() {
  ventas.value = await http.get('ventas').then((response) => response.data)
}

async function obtenerProducto() {
  productos.value = await http.get('productos').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idProducto: facturaProducto.value.idProducto,
      idVenta: facturaProducto.value.idVenta,
      cantidad: facturaProducto.value.cantidad,
      total: facturaProducto.value.total,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${facturaProducto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    facturaProducto.value = {} as FacturaProducto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerProducto()
      obtenerVenta()
      if (props.facturaProducto?.id) {
        facturaProducto.value = { ...props.facturaProducto }
        facturaProducto.value.idProducto = props.facturaProducto.producto?.id
        facturaProducto.value.idVenta = props.facturaProducto.venta?.id
      } else {
        facturaProducto.value = {} as FacturaProducto
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="cliente" class="font-semibold w-3">Cliente</label>
        <Select
          id="cliente"
          v-model="facturaProducto.idVenta"
          :options="ventas"
          optionLabel="cliente.nombres"
          optionValue="id"
          class="flex-auto"
          :filter="true"
          @change="facturaProducto.idVenta = Number(facturaProducto.idVenta)"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="producto" class="font-semibold w-3">Productos</label>
        <Select
          id="producto"
          v-model="facturaProducto.idProducto"
          :options="productos"
          optionLabel="nombre"
          optionValue="id"
          class="flex-auto"
          :filter="true"
          @change="facturaProducto.idProducto = Number(facturaProducto.idProducto)"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="cantidad" class="font-semibold w-3">Cantidad</label>
        <InputNumber
          id="cantidad"
          v-model="facturaProducto.cantidad"
          class="flex-auto"
          autocomplete="off"
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="total" class="font-semibold w-3">Total</label>
        <InputNumber
          id="total"
          v-model="facturaProducto.total"
          class="flex-auto"
          autocomplete="off"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
