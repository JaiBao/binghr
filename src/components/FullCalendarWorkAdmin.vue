<script setup>
import { ref, onBeforeMount } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useUserStore } from 'src/stores/users'
// ------------------------------------------------
const today = DateTime.now()
const user = useUserStore()
onBeforeMount(async () => {
  const result = await apiAuth.get(`/workschedule/month/${today.month.toString().padStart(2, '0')}`)

  const events = result.data.message
    .filter(item => user.team === '人事' || item.team === user.team) // 添加筛选条件
    .map(item => ({
      title: `${item.ClockIn} > ${item.ClockOut}   ${item.name}`,
      date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(2, '0')}`
    }))

  calendarOptions.value.events = events
})

const selected = ref({
  year: today.year,
  month: today.month.toString().padStart(2, '0')
})

const optionsyear = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]
const optionsmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: [],
  locale: 'zh-tw'
})

const searchmonth = async () => {
  const result = await apiAuth.get(`/workschedule/month/${selected.value.month}`)

  const events = result.data.message
    .filter(item => user.team === '人事' || item.team === user.team) // 添加筛选条件
    .map(item => ({
      title: `${item.ClockIn} > ${item.ClockOut}   ${item.name} ${item.place}`,
      date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(2, '0')}`
    }))

  calendarOptions.value.events = events
}
const searchyear = async () => {
  const result = await apiAuth.get(`/workschedule/year/${selected.value.year}`)
  const events = result.data.message
    .filter(item => user.team === '人事' || item.team === user.team) // 添加筛选条件
    .map(item => ({
      title: `${item.ClockIn} > ${item.ClockOut}   ${item.name} ${item.place}`,
      date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(2, '0')}`
    }))

  calendarOptions.value.events = events
}

</script>
<template>
    <div class="q-pa-md w-100 row items-center justify-center">
    <q-select filled v-model="selected.year" :options="optionsyear" label="year"  class="w-25 q-ma-xs"/>
    <q-select filled v-model="selected.month" :options="optionsmonth" label="month"  class="w-25 q-ma-xs"/>
    <q-btn label="查指定月" class="q-ma-xs" @click="searchmonth"></q-btn>
    <q-btn label="查年" class="q-ma-xs" @click="searchyear"></q-btn>
  </div>
  <FullCalendar :options="calendarOptions"  class="w-100"/>
</template>
