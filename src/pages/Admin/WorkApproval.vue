<template>
  <div class="q-pa-md w-100 row items-center justify-center">
    <q-table
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="_id"
      class="w-100"
      filter=""
      selected="multiple"
      v-model:selected="selected"
    >
      <template v-slot:top-right> </template>
      <template v-slot:body-cell-onClockIn="props">
        <q-td
          class="text-center q-gutter-sm"
          :class="backgroundAM(props.row.onClockIn,props.row.team)"
        >
          {{ props.row.onClockIn }}
        </q-td>
      </template>
      <template v-slot:body-cell-onClockOut="props">
        <q-td
          class="text-center q-gutter-sm"
          :class="backgroundPM(props.row.onClockOut,props.row.team)"
        >
          {{ props.row.onClockOut }}
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
    <div class="row q-ma-md">
      <q-btn
        v-show="selected.length > 0"
        label="通過"
        @click="approve"
        color="teal"
        class="q-ma-md"
      />
    </div>
  </div>
  <div class="column w-100 justify-center items-center">
    <h6>新增excel補打卡</h6>
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-file name="poster_file" v-model="file" filled label="檔案" />
      <q-btn v-if="file" label="送出" type="submit" color="primary" />
      <q-btn label="下載表格" color="green" :href="href" />
    </q-form>
  </div>
  <!-- -------------------------------------------------------- -->
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
        <q-checkbox v-model="editform.breaktime" label="是否扣休息一小時" />
        <q-checkbox v-model="editform.breakday" label="休息日" />
        <q-checkbox v-model="editform.holiday" label="例假日 | 國定假日" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="取消" v-close-popup />
        <q-btn flat label="修改" v-close-popup @click="Submittime" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { DateTime } from 'luxon'
import { apiAuth } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/users'
// ------------------------------------------------------------------

// const fivePM = DateTime.fromObject({ hour: 17 })

// ------------------------------------------------------------------
const user = useUserStore()
const href = ref(`${process.env.VITE_API}download/work`)
const prompt = ref(false)
const $q = useQuasar()
const file = ref(null)
const today = DateTime.now()
const title = ref(`${today.month.toString().padStart(2, '0')}月打卡記錄`)
const rows = reactive([])
const selected = ref([])
const getAllTime = async () => {
  rows.splice(0, rows.length)
  const result = await apiAuth.get(`/work/year/${today.year}`)
  console.log(result)
  for (let i = 0; i < result.data.message.length; i++) {
    const record = result.data.message[i]
    if (
      (user.team === '人事' && record.state === '已審核') ||
      (record.team === user.team && record.state === '已審核')
    ) {
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
}

getAllTime()
// ----------------------------------------------------------------
// const props = defineProps(['rows'])
const backgroundAM = (clockIn, team) => {
  if (team !== '早班') return '' // 不是早班就不變色

  const clockInTime = DateTime.fromFormat(clockIn, 'HH:mm')
  const diff = clockInTime.diff(eightAM, 'minutes').as('minutes')
  return diff < 0 ? 'bg-blue-5' : 'bg-red-5'
}
const eightAM = DateTime.fromObject({ hour: 8 })
// ------------------------------------------------------------------
const backgroundPM = (clockIn, team) => {
  if (team !== '早班') return '' // 不是早班就不變色

  const clockInTime = DateTime.fromFormat(clockIn, 'HH:mm')
  const diff = clockInTime.diff(fivePM, 'minutes').as('minutes')

  if (diff < 0) return 'bg-red-5'
  if (diff <= 29) return ''
  return 'bg-yellow-5'
}
const fivePM = DateTime.fromObject({ hour: 17 })
// ------------------------------------------------------------------
const editform = ref({
  _id: '',
  editClockIn: '',
  editClockOut: '',
  breaktime: false,
  holiday: false,
  breakday: false
})
// ------------------------------------------------------------------
//  上班時間至00 30
const roundTimeIn = (timeStr) => {
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
}
//  下班時間至00 30
const roundTimeOut = (timeStr) => {
  let [hours, minutes] = timeStr.split(':').map(Number)
  if (minutes > 0 && minutes < 30) {
    minutes = 0
  } else if (minutes >= 30) {
    minutes = 30
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
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
}
const Submittime = async () => {
  await apiAuth.patch('/work/approve/edittime', editform.value)
  await closeDialog()
  await getAllTime()
}
const selectedIds = computed(() => selected.value.map((item) => item._id))
const approveform = ref({
  _id: selectedIds,
  state: '已審核'
})

// const rejectform = ref({
//   _id: selectedIds,
//   state: '已退回'
// })
// ------------------------------------------------------------------
const approve = async () => {
  await apiAuth.patch('/work/check', approveform.value)
  await $q.notify({
    color: 'positive',
    icon: 'cloud_done',
    message: '已更新'
  })
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
// ----------------------------------------------------------------
const onSubmit = async (evt) => {
  if (file.value) {
    console.log(file.value)
    try {
      const formData = new FormData()
      formData.append('file', file.value, file.value.name)
      const result = await apiAuth.post('/work/csvtowork', formData)

      console.log(result)

      if (result.status === 200) {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '上傳成功'
        })
        getAllTime()
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}
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
