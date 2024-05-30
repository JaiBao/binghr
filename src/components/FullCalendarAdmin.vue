<script setup>
import { ref, onBeforeMount, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useUserStore } from 'src/stores/users'
import { useMemberStore } from 'src/stores/member'
// ------------------------------------------------
const today = DateTime.now()
const member = useMemberStore()
const user = useUserStore()
// const team = ref('')
const router = useRouter()
const calendarComponent = ref(null)
const teamOptions = ref([])
const getTeam = async () => {
  const result = await apiAuth.get('/users/team')
  teamOptions.value = result.data
  teamOptions.value.push({ label: '', value: '' })
}
// const currentEvents = ref([])
const firstget = async () => {
  calendarOptions.value.events = []
  const result = await apiAuth.get(`/work/month/${selected.value.year}/${selected.value.month}`)

  const events = result.data.message.filter(item => user.team === '人事' || item.team === user.team) // 添加筛选条件
    .map(item => {
      const color = item.onClockIn && item.onClockOut ? 'rgba(133, 105, 105,0.5)' : 'red'

      return {
        title: `${item.onClockIn || '?'} > ${item.onClockOut || '?'}   ${item.name}  ${item.team}`,
        date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(2, '0')}`,
        color
      }
    })
  calendarOptions.value.events = events
  // const selectedDate = `${selected.value.year}-${selected.value.month
  //   .toString()
  //   .padStart(2, '0')}-01`
  // const calendarApi = calendarComponent.value.getApi()
  // calendarApi.gotoDate(today.toFormat('yyyy-MM-dd'))
}
onBeforeMount(async () => {
  firstget()
  member.getMember()
  getTeam()
})
onMounted(() => {
  // 当组件挂载后，使用引用访问 FullCalendar 组件
  const calendarApi = calendarComponent.value.getApi()
  // 现在可以使用 calendarApi.gotoDate(), calendarApi.next(), 等等...
  calendarApi.gotoDate(today.toFormat('yyyy-MM-dd'))
})
const selected = ref({
  year: today.year,
  month: today.month.toString().padStart(2, '0')
})
const handleDateSelect = async (selectInfo) => {
  const nameToFind = selectname(selectInfo.event._def.title)
  const result = member.member.find((item) => item.name === nameToFind)
  console.log(result.number)
  router.push(`/admin/hours/${result.number}`)
}
const handleDate = async (selectInfo) => {
  console.log(selectInfo)
  // router.push(`/admin/hours/${result.number}`)
}
const selectname = (str) => {
  // const regex = /[\u4e00-\u9fa5]+/
  // const match = str.match(regex)
  const match = str.split(' ')[5]
  return match
}
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridWeek',
  events: [],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },
  locale: 'zh-tw',
  select: handleDate,
  eventClick: handleDateSelect,
  // editable: true,
  selectable: true
  // currentEvents: []
})
watch([calendarOptions.value.events, calendarOptions.value.currentEvents], () => {
  console.log(calendarOptions.value.currentEvents, calendarOptions.value.events)
})

// const selectTeam = async () => {
//   const result = await apiAuth.get(`/work/month/${today.month.toString().padStart(2, '0')}`)

//   const events = result.data.message.filter(item => item.team === team.value) // 添加筛选条件
//     .map(item => {
//       const color = item.onClockIn && item.onClockOut ? 'green' : 'red'

//       return {
//         title: `${item.onClockIn || '?'} > ${item.onClockOut || '?'}   ${item.name}  ${item.team}`,
//         date: `${item.year}-${item.month.padStart(2, '0')}-${item.day.padStart(2, '0')}`,
//         color
//       }
//     })
//   calendarOptions.value.events = events
// }
// 觀察team.value 變化時執行 selectTeam
watch(selected.value, async () => {
  if (selected.value.year.length !== 4) return
  await firstget()
  const selectedDate = `${selected.value.year}-${selected.value.month
    .toString()
    .padStart(2, '0')}-01`
  const calendarApi = calendarComponent.value.getApi()
  calendarApi.gotoDate(selectedDate)
})
const reset = async () => {
  selected.value.year = today.year
  selected.value.month = today.month.toString().padStart(2, '0')
  await firstget()
}

</script>
<template>
    <div class="q-pa-md w-100 row items-center justify-center">
    <q-input filled v-model="selected.year" label="年"  class="col-2 q-ma-xs"/>
    <q-select filled v-model="selected.month" :options="member.monthoption" label="月"  class="col-2 q-ma-xs"/>
    <!-- <q-select filled v-model="team" :options="teamOptions"  label="組別"  class="col-2 q-ma-xs"/> -->
    <!-- <q-btn label="查組別" class=" col-1 q-ma-xs" color="primary" @click="selectTeam()"/> -->
    <q-btn label="重來" class=" col-1 q-ma-xs" color="red" @click="reset()"/>
    <q-btn label="看今天" to="/admin/day" color="secondary" class="col-1 q-mx-lg"/>
  </div>
  <FullCalendar :options="calendarOptions"  class="w-100"
  ref="calendarComponent"/>
</template>
