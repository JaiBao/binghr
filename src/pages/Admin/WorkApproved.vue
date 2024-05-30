<template>
  <div class="q-pa-md w-100 items-center justify-center row"></div>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="_id"
      :filter="filter"
    >
      <template v-slot:top>
        <q-input
        v-model="selected.year"
        filled
        label="年"
        class="col-2 q-ma-xs"
        />
        <q-select
          filled
          v-model="selected.month"
          :options="optionsmonth"
          label="month"
          class="col-2 q-ma-xs"
        />
        <q-btn label="查這個月總時" class="col-3 q-ma-xs" @click="reset"  />
        <q-input outlined debounce="300" v-model="filter" placeholder="姓名">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
  <div class="row w-100 items-center justify-center">
    <q-btn
      v-if="selectedtable.length > 0"
      color="red-4"
      icon="close"
      label="返回審核中"
      no-caps
      @click="reject"
      class="q-ma-md"
    />
    <q-btn
      color="primary"
      icon-right="archive"
      label="下載檔案.csv"
      no-caps
      @click="exportTable"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useQuasar, exportFile } from 'quasar'
import { useUserStore } from 'src/stores/users'

// -----------------------------------------------------
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
const user = useUserStore()
const $q = useQuasar()
const filter = ref('')
const today = DateTime.now()
const rows = reactive([])
const selected = ref({ year: today.year, month: today.month.toString().padStart(2, '0') })
const selectedtable = ref([])
const title = ref(`${selected.value.year},${selected.value.month}月已審核清單`)
const getAllTime = async () => {
  rows.splice(0, rows.length)
  const result = await apiAuth.get(`/work/month/${selected.value.year}/${selected.value.month}`)
  for (let i = 0; i < result.data.message.length; i++) {
    const record = result.data.message[i]
    if (
      (user.team === '人事' && record.state === '已審核') ||
      (record.team === user.team && record.state === '已審核')
    ) {
      // 轉換為國字
      record.holiday = record.holiday ? '是' : '否'
      record.break = record.break ? '是' : '否'

      rows.push(record)
    } else {
      continue
    }
  }
}
onMounted(() => {
  getAllTime()
})

const columns = [
  {
    name: 'number',
    align: 'center',
    label: '工號',
    sortable: true,
    field: 'number'
  },
  {
    name: 'name',
    align: 'center',
    label: '姓名',
    field: 'name'
  },
  {
    name: 'year',
    align: 'center',
    label: '年',
    field: 'year'
  },
  {
    name: 'month',
    label: '月',
    field: 'month',
    align: 'center'
  },
  {
    name: 'day',
    label: '日',
    field: 'day',
    align: 'center'
  },
  {
    name: 'team',
    align: 'center',
    label: '組別',
    field: 'team'
  },
  {
    name: 'onClockIn',
    label: '打卡上班',
    field: 'onClockIn',

    align: 'center'
  },
  {
    name: 'onClockOut',
    label: '打卡下班',
    field: 'onClockOut',

    align: 'center'
  },
  {
    name: 'editClockIn',
    label: '計算上班',
    field: 'editClockIn',

    align: 'center'
  },
  {
    name: 'editClockOut',
    label: '計算下班',
    field: 'editClockOut',

    align: 'center'
  },
  {
    name: 'hours',
    label: '時數',
    field: 'hours',

    align: 'center'
  },
  {
    name: 'state',
    label: '狀態',
    field: 'state',

    align: 'center'
  },
  {
    name: 'break',
    label: '是否休息日',
    field: 'break',
    align: 'center'
  },
  {
    name: 'holiday',
    label: '是否例假日|國定假日',
    field: 'holiday',
    align: 'center'
  }
]
watch(selected.value, () => {
  rows.splice(0, rows.length)
  getAllTime()
  title.value = `${selected.value.year},${selected.value.month}月已審核清單`
})

const selectedIds = computed(() => selectedtable.value.map((item) => item._id))
const rejectform = ref({
  _id: selectedIds,
  state: '審核中'
})
const reject = async () => {
  console.log(selectedIds)
  await apiAuth.patch('/work/check', rejectform.value)
  await $q.notify({
    color: 'positive',
    icon: 'cloud_done',
    message: '已更新'
  })
  await getAllTime()
}
const reset = () => {
  selected.value = today.month.toString().padStart(2, '0')
}
// ----------------------------------------------------------------
function wrapCsvValue (val, formatFn, row2) {
  let formatted = formatFn !== undefined ? formatFn(val, row2) : val

  formatted =
    formatted === undefined || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

function exportTable () {
  // naive encoding to csv format
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      rows.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === undefined ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n')

  // 导出CSV文件的代码
  const status = exportFile(
    `${title.value}.csv`,
    '\ufeff' + content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: '無法下載',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>
