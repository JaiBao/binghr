<template>

  <div class="q-pa-md">
    <OnePageApproval/>
  </div>
  <!-- <div class="q-pa-lg">
    <FullCalendar/>
  </div> -->
  <div class="q-pa-md row justify-center">
    <!-- <q-select v-model="selected.month" :options="options" label="選擇月份" class="w-50 q-pr-lg" rounded outlined />
    <q-btn @click="get" label="get"></q-btn>
  </div>
  <div class="q-pa-md">
    <div class="row justify-center">
      <q-input v-model="employees.month" rounded outlined  label="月份" class="q-pa-xs" />
      <q-input v-model="employees.name" rounded outlined  label="名字" class="q-pa-xs"/>
      <q-input v-model="employees.number" rounded outlined  label="工號" class="q-pa-xs" />
      <q-input v-model="employees.totaloverhour" rounded outlined  label="總加班時數" class="q-pa-xs" />
    </div>
    <div class="row justify-center">
      <q-input v-model="employees.overhourfirst"  rounded outlined  label="1.34" class="q-pa-xs"/>
      <q-input v-model="employees.overhoursecond" rounded outlined  label="1.67" class="q-pa-xs"/>
      <q-input v-model="employees.overhourthree"  rounded outlined label="2" class="q-pa-xs"/>
      <q-input v-model=" employees.totalhour" rounded outlined label="總時數" class="q-pa-xs"/>
    </div> -->
    <!-- <div class="row justify-center">
      <q-btn @click="submit" label="submit" class="q-mt-md"></q-btn>
    </div> -->
  </div>
</template>

<script setup>
// import FullCalendar from 'src/components/FullCalendarHour.vue'
import { apiAuth } from 'src/boot/axios'
import { onBeforeMount, ref } from 'vue'
import OnePageApproval from 'src/components/OnePageApprovalDay.vue'
// import { useHolidayStore } from 'src/stores/workingdate'
import { useRoute } from 'vue-router'
import { DateTime } from 'luxon'
// import { useHoursStore } from 'src/stores/hours'
// import { useQuasar } from 'quasar'
// const hours = useHoursStore()

// const $q = useQuasar()
const today = DateTime.now()
const month = today.month.toString().padStart(2, '0')
const route = useRoute()
// const gethour = ref({
//   month,
//   year: today.year
// })
// hours.gethours(route.params.number, gethour.value)
onBeforeMount(async () => {
  // useHolidayStore().getjson()
})
// const user = useUserStore()
// const options = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const selected = ref({ month })

// 使用 ref 建立一個響應式的變數
const employees = ref({
  month: '',
  name: '',
  totaloverhour: '',
  overhourfirst: '',
  overhoursecond: '',
  overhourthree: '',
  totalhour: '',
  number: ''
})
// 從 API 取得資料並將其指派給 employees 變數
const calculate = async () => {
  const sent = apiAuth.post(`/work/calculate/${route.params.number}/${selected.value.month}`)
  console.log(sent)
}
calculate()
const get = async () => {
  console.log(route.params.number)
  employees.value = {}
  const data = await apiAuth.get(
    `/work/calculate/${route.params.number}/${selected.value.month}`
  )
  console.log(data)
  employees.value.month = data.data.message.month
  employees.value.name = data.data.message.name
  employees.value.overhourfirst = data.data.message.overhourfirst
  employees.value.overhoursecond = data.data.message.overhoursecond
  employees.value.overhourthree = data.data.message.overhourthree
  employees.value.totalhour = data.data.message.totalhour
  employees.value.number = data.data.message.number
  employees.value.totaloverhour = data.data.message.totaloverhour
}
get()

// const submit = async () => {
//   try {
//     const result = await apiAuth.post('work/calculate/update', employees.value)
//     console.log(result)
//     $q.notify({
//       color: 'green-4',
//       textColor: 'white',
//       icon: 'cloud_done',
//       message: '送出成功'
//     })
//   } catch (error) {
//     $q.notify({
//       color: 'red-4',
//       textColor: 'white',
//       icon: 'cloud_done',
//       message: '送出失敗'
//     })
//   }
// }
</script>
