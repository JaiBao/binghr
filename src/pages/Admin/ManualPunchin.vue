<template>
  <div class="q-pa-md">
    <div class="row w-100 justify-center items-center">
      <div class="col-12 q-ma-md text-h6 text-center">補打卡</div>

      <q-select
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.name"
        label="姓名"
        :options="optionsname"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.number"
        readonly
        label="工號"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.time"
        mask="##:##"
        label="時間"
      />
      <q-input
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        v-model="form.year"
        label="年"
      />
      <q-select
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        :options="member.monthoption"
        v-model="form.month"
        label="月"
      />
      <q-select
        class="col-xs-12 col-md-6 col-lg-3 q-ma-md"
        outlined
        :options="member.dayoption"
        v-model="form.day"
        label="日"
      />
    </div>
    <div class="row justify-center items-center w-100 q-mt-md">
      <q-btn
        class="q-mx-md"
        color="primary"
        label="補上班"
        @click="submit('on')"
      />
      <q-btn
        class="q-mx-md"
        color="secondary"
        label="補下班"
        @click="submit('off')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMemberStore } from 'src/stores/member'
import { DateTime } from 'luxon'
import { apiAuth } from 'src/boot/axios'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
// ----------------------------------------------------------------
const today = DateTime.now()
const $q = useQuasar()
const member = useMemberStore()
const route = useRoute()
member.getMember().then(() => {
  member.member.forEach((item) => {
    optionsname.value.push(item.name)
  })
})
const optionsname = ref([])
const form = ref({
  name: '',
  number: '',
  year: today.year,
  month: today.month.toString().padStart(2, '0'),
  day: today.day.toString().padStart(2, '0'),
  time: '',
  punchtype: ''
})
onMounted(() => {
  if (route.params.number) {
    form.value.number = route.params.number
    const foundMember = member.member.find(
      (item) => item.number === route.params.number
    )
    if (foundMember) {
      form.value.name = foundMember.name
    }
  }
})

// ----------------------------------------------------------------
watch(
  () => form.value.name,
  (newName) => {
    const foundMember = member.member.find((item) => item.name === newName)
    if (foundMember) {
      form.value.number = foundMember.number
    }
  }
)
// ----------------------------------------------------------------

const submit = async (val) => {
  if (val === 'on') {
    try {
      const { data } = await apiAuth.post('/work/on', form.value)
      console.log(data)
      $q.notify({
        message: data.data.name + '補打卡成功',
        color: 'green-4',
        icon: 'warning',
        position: 'center'
      })
      member.punched = true
    } catch (error) {
      $q.notify({
        message: error.response.data.message,
        color: 'negative',
        icon: 'warning',
        position: 'center'
      })
    }
  }
  if (val === 'off') {
    try {
      const { data } = await apiAuth.patch('/work/off', form.value)
      $q.notify({
        message: data.data.name + '補打卡成功',
        color: 'green-4',
        icon: 'warning',
        position: 'center'
      })
      member.punched = true
    } catch (error) {
      $q.notify({
        message: error.response.data.message,
        color: 'negative',
        icon: 'warning',
        position: 'center'
      })
    }
  }
}
</script>
