<template>
  <div class="q-pa-md w-100 row items-center justify-center">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
      class="w-100 my-sticky-header-table"
      :filter="filter"
      :rows-per-page-options="[5,0]"
    >
      <template v-slot:top>
        <q-input
      filled
      v-model="selected.year"
      label="年"
      class="col-2 q-ma-xs"
    />
        <q-select
      filled
      v-model="selected.month"
      :options="optionsmonth"
      label="月"
      class="col-2 q-ma-xs"
    />
    <q-btn label="查這個月" color="primary" class="col-1 q-mx-lg" @click="reset" />
    <q-btn label="看今天" to="/admin/day" color="secondary" class="col-1 q-mx-lg"/>
        <q-select
          outlined
          debounce="300"
          v-model="filter"
          label="姓名"
          class="col-2"
          :options="optionsmember"
        />
      </template>
      <!-- <template v-slot:body-cell-actions="props">
        <q-td class="text-center q-gutter-sm">
          <q-btn
            icon="mdi-calculator"
            color="info"
            fab-mini
            unelevated
            size="sm"
            @click="openDialog(props.row)"
          />
        </q-td>
      </template> -->
      <template v-slot:body-cell-seeall="props">
        <q-td class="text-center q-gutter-sm">
          <q-btn
            icon="menu"
            color="info"
            fab-mini
            unelevated
            size="sm"
            @click="gotoSelectmonth(props.row.number)"
          >
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ calculateform.name }} {{ calculateform.number }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          總工作時數
          {{ calculateform.hours }}
        </q-card-section>
        <q-card-section>
          總工作天數
          {{ calculateform.count }}
        </q-card-section>
        <q-card-section>
          8-10小時時數
          {{ calculateform.overtime8to10 }}
        </q-card-section>
        <q-card-section>
          >10小時時數
          {{ calculateform.overtimeOver10 }}
        </q-card-section>
        <q-card-section>
          休息日
          {{ calculateform.breakday }}
        </q-card-section>
        <q-card-section>
          例假日 | 國定假日
          {{ calculateform.holiday }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  <div class="row w-100 items-center justify-center">
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
import { ref, reactive, watch } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useRouter } from 'vue-router'
import { exportFile, useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/users'
import { useMemberStore } from 'src/stores/member'
import { useHoursStore } from 'src/stores/hours'
// ----------------------------------------------------------------
const user = useUserStore()
const member = useMemberStore()
const hour = useHoursStore()
const $q = useQuasar()
const router = useRouter()
const date = ref([])
const rows = reactive([])
const today = DateTime.now()
const filter = ref('')
const selected = ref({ year: today.year, month: today.month.toString().padStart(2, '0') })
const dialog = ref(false)
const optionsmonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const optionsmember = ref([])
member.getMember().then(() => {
  member.member.forEach((item) => {
    if (item.role === 0) {
      optionsmember.value.push(item.name)
    }
  })
})
// click seeall to go to selected month's admin/hours
const gotoSelectmonth = (val) => {
  hour.month = selected.value.month
  hour.year = selected.value.year
  hour.shouldChangeMonth = true
  router.push(`/admin/hours/${val}`)
}
// ----------------------------------------------------------------
// const openDialog = async (row) => {
//   dialog.value = true
//   const findform = ref({
//     month: selected.value,
//     year: today.year
//   })
//   console.log(row)
//   calculateform.value.name = row.name
//   calculateform.value.number = row.number
//   calculateform.value.count = row.count
//   calculateform.value.hours = row.hours
//   calculateform.value.breakday = 0
//   calculateform.value.holiday = 0
//   const result = await apiAuth.post(
//     `/work/month/${row.number}`,
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
//     const breakFlag = record.break // Assuming you have a break flag in each record
//     const holidayFlag = record.holiday // Assuming you have a holiday flag in each record

//     if (holidayFlag) {
//       totalHoursOver10 += hours
//       totalMinutesOver10 += minutes
//       calculateform.value.holiday++
//     } else if (breakFlag) {
//       if (hours > 10) {
//         totalHoursOver10 += hours - 2
//         totalMinutesOver10 += minutes
//         totalHours8to10 += 2
//         calculateform.value.breakday++
//       } else if (hours > 8) {
//         totalHoursOver10 += hours - 2
//         totalHours8to10 += 2
//         totalMinutes8to10 += minutes
//         calculateform.value.breakday++
//       }
//     } else if (hours > 10) {
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

//   calculateform.value.overtime8to10 = `${totalHours8to10.toString().padStart(2, '0')}:${totalMinutes8to10.toString().padStart(2, '0')}`
//   calculateform.value.overtimeOver10 = `${totalHoursOver10.toString().padStart(2, '0')}:${totalMinutesOver10.toString().padStart(2, '0')}`
// }

// ----------------------------------------------------------------
const calculateform = ref({
  name: '',
  number: '',
  count: '',
  hours: '',
  overtime8to10: '',
  overtimeOver10: '',
  breakday: 0,
  holiday: 0
})
const reset = () => {
  selected.value.month = today.month.toString().padStart(2, '0')
  selected.value.year = today.year
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
    label: '姓名',
    field: 'name',
    sortable: true
  },
  {
    name: 'count',
    align: 'center',
    label: '總工作天數',
    field: 'count',
    sortable: true
  },
  {
    name: 'hours',
    align: 'center',
    label: '總工作時數',
    field: 'hours',
    sortable: true
  },
  // {
  //   name: 'actions',
  //   label: '試算',
  //   field: 'actions',
  //   align: 'center',
  //   sortable: false
  // },
  {
    name: 'seeall',
    label: '看他',
    field: 'seeall',
    align: 'center',
    sortable: false
  }
]
// ----------------------------------------------------------------------
const getAllTime = async () => {
  const result = await apiAuth.get(`/work/month/${selected.value.year}/${selected.value.month}`)
  const userTeam = user.team // 假设你已经获取到了用户所在的团队
  let filteredRecords = result.data.message

  if (userTeam !== '人事') {
    filteredRecords = filteredRecords.filter(
      (record) => record.team === userTeam
    )
  }

  date.value = filteredRecords

  const uniqueNamesSet = new Set(filteredRecords.map((record) => record.name))
  const uniqueNames = Array.from(uniqueNamesSet)

  uniqueNames.forEach((name) => {
    const recordsOfThisName = filteredRecords.filter(
      (record) => record.name === name
    )

    const validRecordsOfThisName = recordsOfThisName.filter(record => {
      const hoursMinutes = record.hours.split(':')
      return hoursMinutes.length === 2 && !isNaN(hoursMinutes[0]) && !isNaN(hoursMinutes[1])
    })

    const totalHoursMinutes = validRecordsOfThisName.reduce(
      (sum, record) => {
        const [hours, minutes] = record.hours.split(':').map(Number)
        return [sum[0] + hours, sum[1] + minutes]
      },
      [0, 0]
    )

    // 將超過 60 分鐘的時間轉為小時
    let [totalHours, totalMinutes] = totalHoursMinutes
    totalHours += Math.floor(totalMinutes / 60)
    totalMinutes = totalMinutes % 60

    const formattedHours = String(totalHours).padStart(2, '0')
    const formattedMinutes = String(totalMinutes).padStart(2, '0')

    rows.push({
      name,
      number: recordsOfThisName[0].number, // 添加 number
      count: recordsOfThisName.length,
      hours: `${formattedHours}:${formattedMinutes}`
    })
  })

  // console.log(rows)
}

// getAllTime()

// ----------------------------------------------------
watch([selected.value], () => {
  console.log('selected changed')
  rows.splice(0, rows.length)
  getAllTime()
}, {
  immediate: true, deep: true
})

// ----------------------------------------------------

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
  const status = exportFile('export.csv', '\ufeff' + content, 'text/csv')

  if (status !== true) {
    $q.notify({
      message: '無法下載',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>
