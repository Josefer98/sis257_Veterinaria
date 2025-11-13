<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import type { Venta } from '@/models/venta'
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

const ENDPOINT = 'ventas'
const props = defineProps({
  mostrar: Boolean,
  venta: {
    type: Object as () => Venta,
    default: () => ({}) as Venta,
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

const venta = ref<Venta>({ ...props.venta })
watch(
  () => props.venta,
  (newVal) => {
    venta.value = { ...newVal }
  },
)

async function obtenerCliente() {
  clientes.value = await http.get('clientes').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idCliente: venta.value.idCliente,
      fecha: venta.value.fecha,
      total: venta.value.total,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${venta.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    venta.value = {} as Venta
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

const ventas = ref<Venta>({ ...props.venta })
const idCliente = ref<number>(0)
watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerCliente()

      if (props.venta?.id) {
        venta.value ={ ...props.venta  }
        idCliente.value = props.venta.cliente.id
      } else {
        idCliente.value = 0
        venta.value = {} as Venta
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
        <label for="cliente" class="font-semibold w-3">Nombre del cliente</label>
        <Select
          id="cliente"
          v-model="venta.idCliente"
          :options="clientes"
          optionLabel="nombres"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fecha" class="font-semibold w-3">Fecha</label>
        <Calendar
          id="fecha"
          v-model="venta.fecha"
          class="flex-auto"
          dateFormat="yy-mm-dd"
          showIcon
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="total" class="font-semibold w-3">Total</label>
        <InputNumber
          id="total"
          v-model="venta.total"
          class="flex-auto"
          autocomplete="off"
          maxlength="30"
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
