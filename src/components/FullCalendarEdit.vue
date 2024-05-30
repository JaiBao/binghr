<script setup>
import { ref, onBeforeMount } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { apiAuth } from 'src/boot/axios'
import { useUserStore } from 'src/stores/users'
import { DateTime } from 'luxon'

const user = useUserStore()
const today = DateTime.now()
// --------------------------------------------------------------------
onBeforeMount(async () => {
  const result = await apiAuth.get(`/work/${user.number}`)
  const events = result.data.result.map((item) => ({
    title: `工作時間 : ${item.editClockIn} - ${item.editClockOut}`,
    date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(2, '0')}`
  }))
  calendarOptions.value.events = events
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

const optionsyear = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]
const optionsmonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const searchmonth = async () => {
  const result = await apiAuth.post(`/work/month/${user.number}`, selected.value)
  const events = await result.data.message.map((item) => ({
    title: `時間 : ${item.editClockIn} - ${item.editClockOut}`,
    date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(2, '0')}`
  }))
  calendarOptions.value.events = events
}
const searchyear = async () => {
  const result = await apiAuth.post(`/work/year/${user.number}`, selected.value)
  const events = result.data.message.map((item) => ({
    title: `時間 : ${item.editClockIn} - ${item.editClockOut}`,
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
