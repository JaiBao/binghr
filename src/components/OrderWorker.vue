<template>
  <div class="col-md-6 col-xs-12">
    <q-splitter v-model="splitterModel" style="height: 600px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-date
            v-model="date"
            mask="YYYY-MM-DD"
            color="pink-3"
            :events="events"
            event-color="teal"
            style="height: 450px;"
          />
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h5">日期：{{ date }} {{ DateTime.fromISO(date).weekdayLong }}</div>
          <q-input outlined v-model.number="form.needworker" label="需要人員" class="q-ma-xs"/>
          <q-input outlined v-model.number="form.available" label="可用人員" class="q-ma-xs"/>
          <q-input outlined v-model.number="form.cowork" label="尚缺人員" class="q-ma-xs"/>

          <q-btn
            v-if="form._id"
            color="secondary"
            label="更新"
            @click="update()"
            class="q-mt-md"/>
          <q-btn
            v-else
            color="primary"
            label="儲存"
            @click="save()"
            class="q-mt-md"/>
            <!-- <div class="text-grey-4">{{ form._id }}</div> -->
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { apiAuth } from 'src/boot/axios' // apiLogin
import { DateTime } from 'luxon'
import { useQuasar } from 'quasar'

// ---------------------------------------------
const today = DateTime.now()
const $q = useQuasar()
const events = ref([])
const splitterModel = ref(50)
const date = ref(today.toFormat('yyyy-MM-dd'))

const getWorker = async () => {
  const { data } = await apiAuth.post('/indeed/find/month', { year: date.value.split('-')[0], month: date.value.split('-')[1] })
  console.log(data.data)
  data.data.forEach(element => {
    events.value.push(element.date.replace(/-/g, '/'))
  })
  console.log(events.value)
}

// -----------------------------------
const save = async () => {
  try {
    form.value.year = form.value.date.split('-')[0]
    form.value.month = form.value.date.split('-')[1]
    const result = await apiAuth.post('/indeed/create', form.value)
    console.log(result)
    $q.notify({
      message: '儲存成功',
      color: 'info',
      icon: 'warning',
      position: 'bottom'
    })
  } catch (error) {
    $q.notify({
      message: '儲存失敗' + error,
      color: 'red',
      icon: 'warning',
      position: 'bottom'
    })
  }
}
const update = async () => {
  try {
    form.value.year = form.value.date.split('-')[0]
    form.value.month = form.value.date.split('-')[1]
    const result = await apiAuth.patch('/indeed/edit', form.value)
    console.log(result)
    $q.notify({
      message: '更新成功',
      color: 'info',
      icon: 'warning',
      position: 'bottom'
    })
  } catch (error) {
    $q.notify({
      message: '儲存失敗' + error,
      color: 'red',
      icon: 'warning',
      position: 'bottom'
    })
  }
}
const form = ref({
  needworker: '',
  available: '',
  cowork: '',
  year: '',
  month: '',
  added: false,
  date,
  _id: ''
})

watchEffect(async () => {
  const dateVal = date.value
  console.log(dateVal)
  const { data } = await apiAuth.post('/indeed/find/', { date: dateVal })
  await getWorker()
  console.log(data.data)
  if (data.data[0] === undefined) {
    form.value.needworker = 0
    form.value.available = 0
    form.value.cowork = 0
    form.value._id = ''
  }
  form.value.needworker = data.data[0].needworker
  form.value.available = data.data[0].available
  form.value.cowork = data.data[0].cowork
  form.value._id = data.data[0]._id
  await getWorker()
})

// -----------------------------------
onBeforeMount(async () => {
  await getWorker()
})

onMounted(() => {})

</script>

<style lang="scss" scoped></style>
