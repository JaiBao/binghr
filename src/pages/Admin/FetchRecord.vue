<template>
  <div class="row w-100 q-pa-md"></div>
  <div class="w-100 q-pa-md">
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="timemark"
      class="w-100 my-sticky-header-table"
      :filter="filter"
    >
      <template v-slot:top>
        <q-input outlined class="col-1" v-model="select.year" label="年" />
        <q-select
          outlined
          class="col-1"
          v-model="select.month"
          label="月"
          :options="member.monthoption"
        />
        <q-btn label="搜尋" @click="get()" color="primary" class="q-mx-xs" />
        <q-space></q-space>
        <div class="text-h6 q-mx-xs">選人</div>
        <q-select
          filled
          debounce="300"
          v-model="person"
          label="姓名"
          class="col-2 q-mx-xs"
          :options="optionsmember"
          clearable
        />

        <div class="text-h6 q-mx-xs">選天</div>
        <q-input filled v-model="filter" clearable>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="filter" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-act="props">
        <q-td class="text-center q-gutter-sm">
          {{ props.row.act === 1 ? "上班" : "下班" }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'
import { useMemberStore } from 'src/stores/member'
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
const member = useMemberStore()
const today = DateTime.now()
const rows = ref([])
const select = ref({
  year: today.year,
  month: today.month.toString().padStart(2, '0')
})
// -============================================================================
const optionsmember = ref([])
member.getMember().then(() => {
  member.member.forEach((item) => {
    if (item.role !== 3) { optionsmember.value.push(item.name) }
  })
})
const person = ref('')
watch(person, async () => {
  console.log(person.value)
  await get()
  if (person.value !== null) {
    rows.value = rows.value.filter((item) => item.display_name === person.value)
  } else if (person.value === null) {
    await get()
  }
}, { deep: true })
// -----------------------------------------------------------------------------
const get = async () => {
  const form = new FormData()
  form.append('company_token', process.env.COMPANY_TOKEN)
  // form.append('account_token', process.env.ACCOUNT_TOKEN)
  form.append(
    'date_start',
    `${select.value.year}-${select.value.month}-01 00:00:00`
  )
  form.append(
    'date_end',
    `${select.value.year}-${select.value.month}-31 23:59:59`
  )
  try {
    const { data } = await axios.post(process.env.FETCH_API, form)
    await rows.value.splice(0, rows.value.length)
    for (let i = 0; i < data.formated_punches.length; i++) {
      if (!data.formated_punches[i].emp_id.includes('L')) {
        continue
      } else {
        rows.value.push(data.formated_punches[i])
      }
    }
    console.log(rows.value)
  } catch (error) {
    console.log(error)
  }
}
const filter = ref('')
onMounted(() => {
  get()
})
const columns = [
  {
    name: 'emp_id',
    align: 'center',
    label: '工號',
    field: 'emp_id',
    sortable: true
  },
  {
    name: 'display_name',
    align: 'center',
    label: '名字',
    field: 'display_name',
    sortable: true
  },
  {
    name: 'timemark',
    align: 'center',
    label: '時間',
    field: 'timemark',
    sortable: true
  },
  {
    name: 'act',
    align: 'center',
    label: '上/下班',
    field: 'act',
    sortable: true
  }
]
</script>
