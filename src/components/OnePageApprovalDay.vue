<template>
  <div class="q-pa-md w-100 row items-center justify-center">
    <q-table
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="_id"
      class="w-100 my-sticky-header-table"
      selection="multiple"
      v-model:selected="selected"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <q-input outlined label="年" v-model="select.year" class="col-1"/>
        <q-select
          v-model="select.month"
          outlined
          :options="member.monthoption"
          label="月份"
          class="q-mx-xs"
        />
        <q-select
          v-model="select.day"
          outlined
          :options="member.dayoption"
          label="月份"
          class="q-mx-xs"
        />
        <div class="text-h6 q-mx-md">日打卡紀錄</div>
        <q-btn label="補打卡" @click="punchin = true" color="secondary"/>
      </template>
      <template v-slot:body-cell-onClockIn="props">
        <q-td
          class="text-center q-gutter-sm"
          :class="backgroundAM(props.row.onClockIn, props.row.team)"
        >
          {{ props.row.onClockIn }}
          <q-badge
            v-if="props.row.editClockInStatus"
            color="red"
            transparent
            rounded
          />
        </q-td>
      </template>
      <template v-slot:body-cell-onClockOut="props">
        <q-td
          class="text-center q-gutter-sm"
          :class="backgroundPM(props.row.onClockOut, props.row.team)"
        >
          {{ props.row.onClockOut }}
          <q-badge
            v-if="props.row.editClockOutStatus"
            color="red"
            transparent
            rounded
          />
        </q-td>
      </template>
      <template v-slot:body-cell-edit="props">
        <q-td class="text-center q-gutter-sm">
          <q-btn
            icon="mdi-pencil"
            color="teal"
            fab-mini
            unelevated
            size="sm"
            @click="openDialog(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <div class="row w-100 justify-center">
      <q-btn
        v-if="selected.length > 0"
        label="通過"
        color="green-4"
        @click="approve"
        class="q-mt-xl"
      />
    </div>
  </div>
  <!-- -------------------------------------------------------- -->
  <q-dialog v-model="punchin">
    <q-card>
      <ManualPunchin />
    </q-card>
  </q-dialog>
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">_id</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          readonly
          v-model="editform._id"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">計算上班</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          mask="##:##"
          v-model="editform.editClockIn"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">計算下班</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="editform.editClockOut"
          mask="##:##"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <!-- <q-card-section>
        <div class="text-h6">加班一(小時)</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="editform.overhourfirst"
          autofocus
        />
        </q-card-section>
        <q-card-section>
        <div class="text-h6">加班二(小時)</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="editform.overhoursecond"
          autofocus
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">加班三(小時)</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="editform.overhourthird"
          autofocus
        />
        </q-card-section> -->
      <q-card-section>
        <q-checkbox v-model="editform.breaktimehalf" label="休息扣半小時" />
        <q-checkbox v-model="editform.breaktime" label="休息扣一小時" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="修改" v-close-popup @click="Submittime" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue' // computed
import { DateTime } from 'luxon'
import { apiAuth } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/users'
import { useHoursStore } from 'src/stores/hours'
// import { useRoute } from 'vue-router'
import { useMemberStore } from 'src/stores/member'
import ManualPunchin from 'src/pages/Admin/ManualPunchin.vue'
// ------------------------------------------------------------------

// const fivePM = DateTime.fromObject({ hour: 17 })

// ------------------------------------------------------------------
const user = useUserStore()
const hours = useHoursStore()
const member = useMemberStore()
// const route = useRoute()
const punchin = ref(false)
const prompt = ref(false)
const $q = useQuasar()
const selected = ref([])
const today = DateTime.now()
const title = ref(`${today.month.toString().padStart(2, '0')}月打卡記錄`)
const select = ref({
  month: today.month.toString().padStart(2, '0'),
  year: today.year,
  day: today.day.toString().padStart(2, '0')
})
const rows = reactive([])
const getAllTime = async () => {
  try {
    rows.splice(0, rows.length)
    await hours.getDayHours(select.value)
    for (let i = 0; i < hours.work.length; i++) {
      const record = hours.work[i]
      if (user.team === '人事' || record.team === user.team) {
        record.editClockIn = roundTimeIn(record.editClockIn)
        if (record.editClockOut) {
          record.editClockOut = roundTimeOut(record.editClockOut)
        } else {
          record.editClockOut = record.editClockIn
        }
        record.editClockOut = roundTimeOut(record.editClockOut)
        rows.push(record)
      } else {
        continue
      }
    }
  } catch (error) {
    console.error('An error occurred in getAllTime:', error)
    // 在这里，您可以根据需要添加其他错误处理逻辑，或继续执行其他操作
  }
}

// ----------------------------------------------------------------
// const props = defineProps(['rows'])
const backgroundAM = (clockIn, team) => {
  // const clockInTime = DateTime.fromFormat(clockIn, 'HH:mm')
  // let targetTime

  // switch (team) {
  //   case '早班':
  //     targetTime = DateTime.fromObject({ hour: 9 })
  //     break
  //   case '晚班':
  //     targetTime = DateTime.fromObject({ hour: 22 })
  //     break
  //   default:
  //     return ''
  // }

  // const diff = clockInTime.diff(targetTime, 'minutes').as('minutes')
  // return diff < 0 ? '' : 'bg-red-5'
  return 'bg-yellow-5'
}
// ------------------------------------------------------------------
const backgroundPM = (clockIn, team) => {
  // if (team !== '早班') return '' // 不是早班就不變色

  // const clockInTime = DateTime.fromFormat(clockIn, 'HH:mm')
  // const diff = clockInTime.diff(fivePM, 'minutes').as('minutes')

  // if (diff < 0) return 'bg-red-5'
  // if (diff <= 29) return ''
  return 'bg-yellow-5'
}
// const fivePM = DateTime.fromObject({ hour: 16, minutes: 30 })
// ------------------------------------------------------------------
const editform = ref({
  _id: '',
  editClockIn: '',
  editClockOut: '',
  breaktimehalf: false,
  breaktime: false,
  holiday: false,
  breakday: false,
  overhourfirst: 0,
  overhoursecond: 0,
  overhourthird: 0
})
// ------------------------------------------------------------------
//  上班時間至00 30
const roundTimeIn = (timeStr) => {
  try {
    let [hours, minutes] = timeStr.split(':').map(Number)

    if (minutes > 5 && minutes <= 30) {
      minutes = 30
    } else if (minutes > 30) {
      minutes = 0
      hours++
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
  } catch (error) {
    console.error('An error occurred in roundTimeIn:', error)
    return '' // 或者返回一个默认的时间字符串
  }
}

const roundTimeOut = (timeStr) => {
  try {
    let [hours, minutes] = timeStr.split(':').map(Number)
    if (minutes > 0 && minutes < 30) {
      minutes = 0
    } else if (minutes >= 30) {
      minutes = 30
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
  } catch (error) {
    console.error('An error occurred in roundTimeOut:', error)
    return '' // 或者返回一个默认的时间字符串
  }
}

const openDialog = (props) => {
  prompt.value = true
  editform.value._id = props._id
  editform.value.editClockIn = roundTimeIn(props.onClockIn)
  editform.value.editClockOut = roundTimeOut(props.onClockOut)
}

const closeDialog = (props) => {
  prompt.value = false
  editform.value._id = ''
  editform.value.editClockIn = ''
  editform.value.editClockOut = ''
  editform.value.breaktime = false
  editform.value.breaktimehalf = false
}
const Submittime = async () => {
  console.log(editform.value)
  await apiAuth.patch('/work/approve/edittime', editform.value)
  await closeDialog()
  await getAllTime()
}
const selectedIds = computed(() => selected.value.map((item) => item._id))
const approveform = ref({
  _id: selectedIds,
  state: '已審核'
})
const approve = async () => {
  try {
    const result = await apiAuth.patch('/work/check', approveform.value)
    $q.notify({
      color: 'positive',
      icon: 'cloud_done',
      message: '已更新' + result.data
    })
  } catch (error) {
    console.log(error)
  }
  await getAllTime()
}
// const reject = async () => {
//   await apiAuth.patch('/work/check', rejectform.value)
//   await $q.notify({
//     color: 'positive',
//     icon: 'cloud_done',
//     message: '已更新'
//   })
//   await getAllTime()
// }
watch(
  () => member.punched,
  (newValue, oldValue) => {
    if (newValue === true) {
      console.log('Punched in!')
      getAllTime()
    }
    member.punched = false
  }

)

if (hours.shouldChangeMonth) {
  console.log('month change!')
  select.value.month = hours.month
  // getAllTime()
  // duty.shouldChangeMonth = false
}
getAllTime()
// watch select value to do getalltime()
watch(
  () => [select.value.day, select.value.month, select.value.year],
  (newValue, oldValue) => {
    console.log('select change!')
    getAllTime()
  }
)

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
    field: 'team',
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
  },
  {
    name: 'edit',
    align: 'center',
    label: '編輯',
    field: 'edit',
    sortable: true
  }
]
</script>
