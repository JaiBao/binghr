<template>
  <div class="row justify-center">
    <h3 id="clock">現在時間 {{ formattedHour }} : {{ formattedMinute }} : {{ formattedSecond }}</h3>
  </div>
  <div class="q-px-md column justify-center">
    <div class="q-px-xs-md">
      <div class="column items-center">
        <q-input
          rounded
          outlined
          v-model="loginform.number"
          label="工號"
          class="q-ma-md w-75"
        />
        <q-input
          rounded
          outlined
          type="password"
          v-model="loginform.password"
          label="密碼"
          class="q-ma-md w-75"
        />
      </div>
    </div>
    <div class="q-pa-md row items-center justify-center">
      <q-btn
        label="上班"
        color="red"
        @click="onSubmit"
        class="q-ma-md"
        size="40px"
      />
      <q-btn
        label="下班"
        color="teal"
        @click="onSubmit2"
        class="q-ma-md"
        size="40px"
      />
      <!-- <q-btn
        label="換人打卡"
        color="teal"
        @click="changeworker"
        class="q-ma-md"
        size="40px"
      /> -->
      <q-toggle color="teal" v-model="punchoutform.overday" label="跨天"/>
    </div>
    <div class="row justify-center" v-if="user.name">
      <h3>您好，{{ user.name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from 'src/stores/users'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const user = useUserStore()

const formattedHour = ref('')
const formattedMinute = ref('')
const formattedSecond = ref('')
// 時間轉換
const today = DateTime.now()
const hour = today.hour
const minute = today.minute
formattedHour.value = today.toFormat(`${hour < 10 ? '0' : ''}H`)
formattedMinute.value = today.toFormat(`${minute < 10 ? '0' : ''}m`)

function updateClock () {
  const today = DateTime.now()
  const hour = today.hour
  const minute = today.minute
  const second = today.second
  formattedHour.value = today.toFormat(`${hour < 10 ? '0' : ''}H`)
  formattedMinute.value = today.toFormat(`${minute < 10 ? '0' : ''}m`)
  formattedSecond.value = today.toFormat(`${second < 10 ? '0' : ''}s`)
}

onMounted(() => {
  // 初始化時鐘
  updateClock()

  // 每秒更新一次
  setInterval(() => {
    updateClock()
  }, 1000)
})
// form
const loginform = ref({
  number: user.number || '',
  password: ''
})
const punchform = ref({
  name: user.name,
  number: user.number,
  state: '審核中',
  month: today.month,
  day: today.day,
  onClockIn: formattedHour.value + ':' + formattedMinute.value
})
const punchoutform = ref({
  number: user.number,
  month: today.month,
  day: today.day,
  onClockOut: formattedHour.value + ':' + formattedMinute.value,
  overday: false
})
// 打卡上班
const punch = async () => {
  try {
    const result = await apiAuth.post('/work/on', punchform.value)
    if (result.status === 200) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: `${user.name} 打卡成功`
      })
    }
  } catch (error) {
    if (error.response.status === 500) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: '打卡失敗，你今天打過了'
      })
    } else {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: error.response.statusText
      })
    }
  }
}

// 打卡下班
const punchout = async () => {
  if (punchoutform.value.overday === true) {
    punchoutform.value.day = today.day - 1
  } else {
    punchoutform.value.day = today.day
  }
  try {
    const result = await apiAuth.patch('/work/off', punchoutform.value)
    if (result.status === 200) {
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: `${user.name} 打卡成功`
      })
    }
  } catch (error) {
    if (error.response.status === 500) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: `${user.name} 打卡失敗，是不是沒打上班卡，或是跨天忘記勾`
      })
    } else {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: '打卡失敗'
      })
    }
  }
}

// 送出上班打卡
const onSubmit = async () => {
  await user.login(loginform.value)
  punchform.value.name = user.name
  punchform.value.number = user.number
  await punch()
}
// 送出下班
const onSubmit2 = async () => {
  await user.login(loginform.value)
  punchoutform.value.name = user.name
  punchoutform.value.number = user.number
  await punchout()
}
// const changeworker = async () => {
//   await user.logout()
//   loginform.value.number = ''
//   loginform.value.password = ''
// }
</script>

<style lang="scss" scoped></style>
