<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="_id"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:body-cell-edit="props">
        <q-td auto-width :props="props">
          <q-btn
            size="md"
            color="primary"
            round
            dense
            icon="edit"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { apiAuth } from 'src/boot/axios'
const rows = reactive([])

const selected = ref([])
const selectedIds = ref([])

const get = async () => {
  try {
    const { data } = await apiAuth.get('/overhour/all') // Create an empty array to store the data
    for (let i = 0; i < data.message.length; i++) {
      const item = data.message[i]
      rows.push(item) // Push each item from data.message into the rows array
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
get()
const columns = [
  {
    name: 'name',
    label: '名字',
    field: 'name',
    sortable: true
  },
  { name: 'number', label: '工號', field: 'number', sortable: true },
  { name: 'type', label: '種類', field: 'type', sortable: true },
  { name: 'year', label: '年', field: 'year', sortable: true },
  { name: 'month', label: '月', field: 'month', sortable: true },
  { name: 'day', label: '日', field: 'day', sortable: true },
  { name: 'hours', label: '時', field: 'hours', sortable: true },
  { name: 'onClockIn', label: '加班開始', field: 'onClockIn', sortable: true },
  {
    name: 'onClockOut',
    label: '加班結束',
    field: 'onClockOut',
    sortable: true
  },
  { name: 'state', label: '狀態', field: 'state', sortable: true },
  { name: 'edit', label: '修改', field: 'edit', sortable: true }
]

watch(selected, (newValue, oldValue) => {
  if (newValue) {
    selectedIds.value = newValue.map(item => item._id)
  }
})

</script>
