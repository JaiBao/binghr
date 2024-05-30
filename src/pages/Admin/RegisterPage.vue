<template>
  <div class="row justify-center w-100">
    <div class="q-pa-md column w-100" style="max-width: 700px">
      <h5>建立新帳號</h5>
      <q-input outlined v-model="form.name" label="姓名" class="q-pa-md" />
      <q-input outlined v-model="form.number" label="工號" class="q-pa-md" />
      <q-input
        outlined
        v-model="form.password"
        label="密碼"
        class="q-pa-md"
        type="password"
      />
      <q-select
        outlined
        v-model="form.team"
        :options="options"
        label="組別"
        class="q-pa-md"
      />
      <div class="row">
        <q-input
          outlined
          v-model="form.year"
          label="到職年"
          class="q-pa-md col-3"
        />
        <q-input
          outlined
          v-model="form.month"
          label="月"
          class="q-pa-md col-3"
        />
        <q-input outlined v-model="form.day" label="日" class="q-pa-md col-3" />
        <q-toggle
          color="primary"
          true-value="1"
          false-value="0"
          v-model="form.role"
          label="是否為管理員"
          left-label
          class="col-3"
        />
      </div>
      <div class="row justify-center">
        <q-btn @click="submit" label="送出" color="green" class="col-3"></q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { DateTime } from 'luxon'
const $q = useQuasar()
const today = DateTime.now()
const options = ref(null)
const form = ref({
  name: '',
  number: '',
  password: '',
  team: '',
  role: 0,
  year: today.year,
  month: today.month.toString().padStart(2, '0'),
  day: today.day
})
const getteam = async () => {
  const result = await apiAuth.get('users/team')
  options.value = result.data
}
getteam()
const submit = async () => {
  const res = await apiAuth.post('/users', form.value)
  if (res.status === 200) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '建立成功'
    })
    form.value.name = ''
    form.value.number = ''
    form.value.password = ''
    form.value.team = ''
  } else {
    alert('註冊失敗')
  }
}
</script>
