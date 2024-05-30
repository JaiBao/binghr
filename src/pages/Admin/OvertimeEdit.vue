<template>
  <div class="row w-100 justify-center">
    <div class="q-pa-md w-75">
      <q-select
        outlined
        :options="options"
        v-model="form.type"
        label="加班形式"
        class="q-my-md"
      />
      <q-select
        outlined
        :options="optionname"
        label="名字"
        v-model="form.name"
        @update:model-value="getOptionNumber(form.name)"
        class="q-my-md"
      />
      <q-input outlined label="工號" v-model="form.number" class="q-my-md" />
      <q-input outlined label="標題" v-model="form.title" class="q-my-md" />
      <!-- -------------------------------------------------------------------- -->
      <q-input
        outlined
        v-model="form.onClockIn"
        mask="time"
        :rules="['time']"
        label="開始時間"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="form.onClockIn" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- -------------------------------------------------------------------- -->
      <q-input
        outlined
        v-model="form.onClockOut"
        mask="time"
        :rules="['time']"
        label="結束時間"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="form.onClockOut" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- -------------------------------------------------------------------- -->
      <q-input
        outlined
        v-model="date"
        mask="date"
        :rules="['date']"
        label="日期"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="date" today-btn>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- ---------------------------------------------------------------- -->
      <q-btn label="送出" @click="submit()" color="green" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect, reactive } from 'vue'
import { useUserStore } from 'src/stores/users'
import { useMemberStore } from 'src/stores/member'
import { apiAuth } from 'src/boot/axios'
import { DateTime } from 'luxon'
const user = useUserStore()
const member = useMemberStore()
const options = ref([])
const optionname = reactive([])
const date = ref('2023/08/01')
const today = DateTime.now().toFormat('yyyy-MM-dd')
date.value = today
const year = computed(() => date.value.split('-')[0])
const month = computed(() => date.value.split('-')[1])
const day = computed(() => date.value.split('-')[2])
const getMember = async () => {
  await member.getMember()
}
const getOptionMember = async () => {
  for (let i = 0; i < member.member.length; i++) {
    const item = member.member[i]
    optionname.push(item.name)
    console.log()
  }
}
const getOptionNumber = async (val) => {
  console.log(val)
  const item = member.member.find(obj => obj.name === val)
  form.value.number = item.number
}
// --------------------------------------------------------------------
if (member.member.length === 0) {
  getMember().then(() => {
    getOptionMember()
  })
} else {
  getOptionMember()
}

const form = ref({
  type: '',
  name: user.name,
  number: user.number,
  title: '',
  onClockIn: '',
  onClockOut: '',
  year: year.value,
  month: month.value,
  day: day.value
})
watchEffect(() => {
  form.value.year = year.value
  form.value.month = month.value
  form.value.day = day.value
})

// --------------------------------------------------------------------
const submit = async () => {
  const result = await apiAuth.post('/overhour/create', form.value)
  console.log(result)
}
const get = async () => {
  const result = await apiAuth.get('/overhour/type')
  options.value = result.data
}
get()
</script>
