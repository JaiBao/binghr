<template>
  <div class="q-pa-md w-100 column items-center justify-center">
    <h4>{{ selected.year }}年{{ selected.month }} 月總工作時數 {{ hour }}</h4>
    <!-- <h5>8 - 10 小時時數:{{ calculateform.overtime8to10 }}</h5> -->
    <!-- <h5>10 小時以上時數:{{ calculateform.overtimeOver10 }}</h5> -->
  </div>
  <div class="q-pa-md w-100 items-center justify-center row">
    <q-select
      filled
      v-model="selected.year"
      :options="optionsyear"
      label="月份"
      class="col-md-2 col-xs-4 q-ma-xs"
    />
    <q-select
      filled
      v-model="selected.month"
      :options="optionsmonth"
      label="月份"
      class="col-md-2 col-xs-4  q-ma-xs"
    />
    <q-btn
      label="查這個月總時"
      class="col-3 q-ma-xs"
      @click="selectedthismonth"
    />
  </div>
  <div class="q-pa-md">
    <q-table :rows="rows" :columns="columns" row-key="name" />
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { ref, watch } from 'vue'
import { useUserStore } from 'src/stores/users'
import { apiAuth } from 'src/boot/axios'

const today = DateTime.now()

const selected = ref({ month: today.month.toString().padStart(2, '0'), year: today.year })
const hour = ref('0')
const user = useUserStore()
const rows = ref([])

// const AllTime = ref('')
// const calculateform = ref({
//   overtime8to10: '',
//   overtimeOver10: ''
// })
// ----------------------------------------------------------------

// const getAllTime = async () => {
//   const result = await apiAuth.get(`/work/time/${user.number}`)
//   AllTime.value = result.data.message
// }
// getAllTime()
const getAllTime2 = async () => {
  const result = await apiAuth.post(
    `/work/month/${user.number}`,
    selected.value
  )
  rows.value = result.data.message
  console.log(rows.value)
  hour.value = calculateTotalHours(rows.value)
}
getAllTime2()
const optionsmonth = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]
const optionsyear = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]

// 改selected值
watch(
  () => selected.value,
  async (newValue) => {
    await getAllTime2()
  },
  { deep: true }
)

// 選擇月份
const selectedthismonth = async () => {
  // await getAllTime()
  const today = DateTime.now()
  selected.value.year = today.year
  selected.value.month = today.month.toString().padStart(2, '0')
}

// 算加班時數
// const calculate = async () => {
//   const findform = ref({
//     month: selected.value,
//     year: today.year
//   })

//   const result = await apiAuth.post(
//     `/work/month/${user.number}`,
//     findform.value
//   )
//   const data = result.data.message
//   let totalHours8to10 = 0
//   let totalMinutes8to10 = 0
//   let totalHoursOver10 = 0
//   let totalMinutesOver10 = 0

//   for (let i = 0; i < data.length; i++) {
//     const record = data[i]
//     const [hours, minutes] = record.hours.split(':').map(Number)

//     if (hours > 10) {
//       totalHoursOver10 += hours - 10
//       totalMinutesOver10 += minutes
//       totalHours8to10 += 2
//     } else if (hours > 8) {
//       totalHours8to10 += hours - 8
//       totalMinutes8to10 += minutes
//     }
//   }

//   totalHours8to10 += Math.floor(totalMinutes8to10 / 60)
//   totalMinutes8to10 = totalMinutes8to10 % 60

//   totalHoursOver10 += Math.floor(totalMinutesOver10 / 60)
//   totalMinutesOver10 = totalMinutesOver10 % 60

//   calculateform.value.overtime8to10 = `${totalHours8to10
//     .toString()
//     .padStart(2, '0')}:${totalMinutes8to10.toString().padStart(2, '0')}`
//   calculateform.value.overtimeOver10 = `${totalHoursOver10
//     .toString()
//     .padStart(2, '0')}:${totalMinutesOver10.toString().padStart(2, '0')}`
//   console.log(calculateform.value)
// }
// calculate()

const calculateTotalHours = (entries) => {
  let totalMinutes = 0

  entries.forEach((entry) => {
    const timeParts = entry.hours.split(':')
    if (
      timeParts.length !== 2 ||
      isNaN(Number(timeParts[0])) ||
      isNaN(Number(timeParts[1]))
    ) {
      console.error(`Invalid hours format in entry: ${entry.hours}`)
      return // Skip this entry and continue with the next
    }

    const hours = parseInt(timeParts[0], 10)
    const minutes = parseInt(timeParts[1], 10)
    totalMinutes += hours * 60 + minutes
  })

  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return `${totalHours.toString().padStart(2, '0')}:${remainingMinutes
    .toString()
    .padStart(2, '0')}`
}

// ----------------------------------------------------------------
const columns = [
  {
    name: 'number',
    align: 'center',
    label: '工號',
    field: 'number',
    sortable: true
  },
  {
    name: 'name',
    align: 'center',
    label: '名字',
    field: 'name',
    sortable: true
  },
  {
    name: 'year',
    align: 'center',
    label: '年',
    field: 'year',
    sortable: true
  },
  {
    name: 'month',
    label: '月',
    field: 'month',
    align: 'center',
    sortable: true
  },
  { name: 'day', label: '日', field: 'day', align: 'center', sortable: true },
  {
    name: 'team',
    align: 'center',
    label: '班別',
    field: 'team',
    sortable: true
  },
  {
    name: 'onClockIn',
    label: '打卡上班',
    field: 'onClockIn',
    sortable: true,
    align: 'center'
  },
  {
    name: 'onClockOut',
    label: '打卡下班',
    field: 'onClockOut',
    sortable: true,
    align: 'center'
  },
  {
    name: 'editClockIn',
    label: '計算上班',
    field: 'editClockIn',
    sortable: true,
    align: 'center'
  },
  {
    name: 'editClockOut',
    label: '計算下班',
    field: 'editClockOut',
    sortable: true,
    align: 'center'
  },
  {
    name: 'hours',
    label: '小時',
    field: 'hours',
    sortable: true,
    align: 'center'
  },
  {
    name: 'state',
    label: '狀態',
    field: 'state',
    sortable: true,
    align: 'center'
  }
]
</script>

<style lang="scss" scoped>
h4 {
  margin-block-start: 1rem;
  margin-block-end: 1rem;
}
h5 {
  margin-block-start: 1rem;
  margin-block-end: 1rem;
}
</style>
