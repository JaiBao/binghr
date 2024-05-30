<template>
  <div class="q-pa-lg">
    <q-table
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="西元日期"
    />
  </div>
  <div class="div">

  </div>
  <h4 class="text-center">新增節日</h4>
  <div class="row w-100 justify-center">
    <q-input v-model="holidayform.year" label="年"></q-input>
    <q-input v-model="holidayform.month" label="月"></q-input>
    <q-input v-model="holidayform.day" label="日"></q-input>
    <q-input v-model="holidayform.description" label="敘述"></q-input>
    <q-input v-model="holidayform.isHoliday" label="是否放假"></q-input>
    <q-input v-model="holidayform.week" label="星期"></q-input>
  </div>
  <div class="row w-100 justify-center q-mt-xl">
    <q-btn @click="addHoliday" label="添加" color="blue" class="q-mx-auto" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHolidayStore } from 'src/stores/workingdate'
const holiday = useHolidayStore()
const holidayform = ref({
  day: '',
  description: '',
  isHoliday: '',
  month: '',
  week: '',
  year: ''
})
const addHoliday = () => {
  holiday.addHoliday({
    date: holidayform.value.date,
    day: holidayform.value.day,
    description: holidayform.value.description,
    isHoliday: holidayform.value.isHoliday,
    month: holidayform.value.month,
    week: holidayform.value.week,
    year: holidayform.value.year
  })
}

const rows = ref([])
rows.value = holiday.holidayData.concat(holiday.manualData)
console.log(rows.value)
const columns = [
  {
    name: 'year',
    align: 'center',
    label: '年',
    field: 'year',
    sortable: true
  },
  {
    name: 'month',
    align: 'center',
    label: '月',
    field: 'month',
    sortable: true
  },
  {
    name: 'day',
    align: 'center',
    label: '日',
    field: 'day',
    sortable: true
  },
  {
    name: 'number',
    align: 'center',
    label: '放假',
    field: 'isHoliday',
    sortable: true
  },
  {
    name: 'number',
    align: 'center',
    label: '假別',
    field: 'description',
    sortable: true
  }
]
</script>
