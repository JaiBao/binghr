<template>
  <q-table
    :rows="combinedDatas"
    :columns="columnslength"
    row-key="date"
    title="套數表"
    class="col-md-5 col-xs-12"
    :rows-per-page-options="[7, 0]"
    v-model:pagination="pagination"
  >
    <template v-slot:top>
      <div class="text-h6 q-px-xs col">近期訂單數查詢</div>
      <q-btn
          color="primary"
          icon-right="archive"
          no-caps
          @click="exportTable"
        />
      <q-input
        outlined
        v-model="select.startDate"
        class="col q-mx-xs"
        label="開始"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer q-ma-xs">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="select.startDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        outlined
        v-model="select.endDate"
        class="col q-px-xs"
        label="結束"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer q-ma-xs">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="select.endDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

    </template>
    <template v-slot:body-cell-desc="props">
      <q-td :props="props">
        <span class="text-h6">{{ props.row.date }}</span>
      </q-td></template
    >
    <template v-slot:body-cell-orderCount="props">
      <q-td :props="props">
        <span class="text-h6">{{ props.row.orderCount }}</span>
      </q-td></template
    >
    <template v-slot:body-cell-value="props">
      <q-td :props="props">
        <span class="text-h6">{{ props.row.value }}</span>
      </q-td></template
    >
    <template v-slot:body-cell-week="props">
      <q-td :props="props">
        <span class="text-h6">{{
          DateTime.fromISO(props.row.date).weekdayLong
        }}</span>
      </q-td></template
    >
  </q-table>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { apiShit } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { UseSearchStore } from 'src/stores/search'
import { exportFile, useQuasar } from 'quasar'
const search = UseSearchStore()

const $q = useQuasar()
const today = DateTime.now()
const lastDay = today.plus({ days: 10 }).toFormat('yyyy-MM-dd')
const startDay = today.minus({ days: 3 }).toFormat('yyyy-MM-dd')
const select = ref({
  startDate: startDay,
  endDate: lastDay
})
const columnslength = [
  {
    name: 'desc',
    required: true,
    label: '日期',
    field: (row) => row.date,
    align: 'left',
    sortable: true
  },
  {
    name: 'week',
    required: true,
    label: '星期',
    field: (row) => row.value,
    align: 'left',
    sortable: true
  },
  {
    name: 'value',
    required: true,
    label: '套數',
    field: (row) => row.value,
    align: 'left',
    sortable: true
  },
  { name: 'orderCount', label: '訂單數', field: 'orderCount', align: 'left' }
]

const pagination = ref({
  sortBy: 'desc'
})

const getedData = ref([])
const getedDataLength = ref([])
const combinedDatas = ref([])
const get = async () => {
  const { data } = await apiShit.post('/productsoneday', select.value)
  const convertedObject = {}
  for (const [key, value] of Object.entries(data.TOTAL_BY_DATE)) {
    const newKey = formatDateLuxon(key)
    convertedObject[newKey] = value
  }
  const resultArray = Object.entries(convertedObject).map(([date, value]) => {
    return { date, value }
  })
  getedData.value = resultArray
  getedDataLength.value = search.length
  console.log(getedData.value, getedDataLength.value)
  search.products = resultArray
}
const combineArrays = async () => {
  await get() // 假設這是你上面提到的 get 函數

  const dateValues = getedData.value
  const deliveryOrders = getedDataLength.value

  const allDates = new Set([
    ...dateValues.map((item) => item.date),
    ...deliveryOrders.map((item) => item.deliveryDate)
  ])

  const combinedData = Array.from(allDates).map((date) => {
    const dateValue = dateValues.find((item) => item.date === date)
    const deliveryOrder = deliveryOrders.find(
      (item) => item.deliveryDate === date
    )
    console.log(date)
    return {
      date,
      value: dateValue?.value,
      orderCount: deliveryOrder?.orderCount
    }
  })

  console.log(combinedData)
  combinedDatas.value = combinedData
}
const formatDateLuxon = (dateString) => {
  return DateTime.fromJSDate(new Date(dateString)).toFormat('yyyy-MM-dd')
}
watch(select.value, async () => {
  await search.getIncome(select.value.startDate, select.value.endDate)
  await get()
  await combineArrays()
})
onBeforeMount(async () => {
  await search.getIncome(select.value.startDate, select.value.endDate)
  await get()
  await combineArrays()
})

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
  const content = [columnslength.map((col) => wrapCsvValue(col.label))]
    .concat(
      combinedDatas.value.map((row) =>
        columnslength
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
    '報表.csv',
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
