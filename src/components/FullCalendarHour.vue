<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useRoute } from 'vue-router'
import { useHolidayStore } from 'src/stores/workingdate'

const route = useRoute()
const calendarComponent = ref(null)
const today = DateTime.now()
const holiday = useHolidayStore()

onMounted(() => {
  // 当组件挂载后，使用引用访问 FullCalendar 组件
  const calendarApi = calendarComponent.value.getApi()

  // 现在可以使用 calendarApi.gotoDate(), calendarApi.next(), 等等...
  calendarApi.gotoDate(new Date())
})
// --------------------------------------------------------------------
// 轉國定假日進日曆
function transformData (dataArray) {
  return dataArray.map((data) => {
    const year = data.year
    const month = data.month.padStart(2, '0')
    const day = data.day.padStart(2, '0')

    return {
      start: `${year}-${month}-${day}`,
      end: `${year}-${month}-${day}`,
      display: 'background',
      title: data?.description
    }
  })
}

// --------------------------------------------------------------------
onBeforeMount(async () => {
  // await holiday.getjson()
  const transformedData = transformData(holiday.holidayData)
  const transformData2 = transformData(holiday.manualData)
  try {
    const result = await apiAuth.get(`/work/${route.params.number}`)
    if (result.data && Array.isArray(result.data.result)) {
      const events = result.data.result.map((item) => ({
        title: `上班時間 : ${item.editClockIn} - ${item.editClockOut}`,
        date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(
          2,
          '0'
        )}`
      }))
      console.log(events)
      calendarOptions.value.events = events.concat(transformedData, transformData2) // 將events和transformedData兩個陣列合併
    } else {
      console.error('Unexpected data format from API.')
    }
  } catch (err) {
    console.error('Error fetching data from API:', err)
  }
})

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: [],
  locale: 'zh-tw'
})
const selected = ref({
  year: today.year,
  month: today.month.toString().padStart(2, '0')
})

const optionsyear = [
  2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
]
const optionsmonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

const searchmonth = async () => {
  const result = await apiAuth.post(
    `/work/month/${route.params.number}`,
    selected.value
  )
  const events = await result.data.message.map((item) => ({
    title: `時間 : ${item.editClockIn} - ${item.editClockOut}`,
    date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(
      2,
      '0'
    )}`
  }))
  const transformedData = transformData(holiday.holidayData)
  const transformData2 = transformData(holiday.manualData)
  calendarOptions.value.events = events.concat(transformedData, transformData2)
  // 跳轉到選擇的月份
  const selectedDate = `${selected.value.year}-${selected.value.month
    .toString()
    .padStart(2, '0')}-01`
  const calendarApi = calendarComponent.value.getApi()
  calendarApi.gotoDate(selectedDate)
}
const searchyear = async () => {
  const result = await apiAuth.post(
    `/work/year/${route.params.number}`,
    selected.value
  )
  const events = result.data.message.map((item) => ({
    title: `時間 : ${item.editClockIn} - ${item.editClockOut}`,
    date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(
      2,
      '0'
    )}`
  }))
  const transformedData = transformData(holiday.holidayData)
  const transformData2 = transformData(holiday.manualData)
  calendarOptions.value.events = events.concat(transformedData, transformData2)
}
</script>
<template>
  <div class="q-pa-md w-100 row items-center justify-center">
    <q-select
      filled
      v-model="selected.year"
      :options="optionsyear"
      label="year"
      class="w-25 q-ma-xs"
    />
    <q-select
      filled
      v-model="selected.month"
      :options="optionsmonth"
      label="month"
      class="w-25 q-ma-xs"
    />
    <q-btn label="查指定月" class="q-ma-xs" @click="searchmonth"></q-btn>
    <q-btn label="查年" class="q-ma-xs" @click="searchyear"></q-btn>
  </div>
  <FullCalendar
    :options="calendarOptions"
    class="w-100"
    ref="calendarComponent"
  />
</template>
