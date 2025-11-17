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
  mascota: {
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
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="cliente" class="font-semibold w-3">Nombre del cliente</label>
        <Select
          id="cliente"
          v-model="mascota.idCliente"
          :options="clientes"
          optionLabel="nombres"
          optionValue="id"
          class="flex-auto"
          :filter="true"
          @change="mascota.idCliente = Number(mascota.idCliente)"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre de mascota</label>
        <InputText id="nombre" v-model="mascota.nombre" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="especie" class="font-semibold w-3">Especie</label>
        <InputText id="especie" v-model="mascota.especie" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="raza" class="font-semibold w-3">Raza</label>
        <InputText id="raza" v-model="mascota.raza" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="edad" class="font-semibold w-3">Edad</label>
        <InputNumber id="edad" v-model="mascota.edad" class="flex-auto" autocomplete="off" />
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
