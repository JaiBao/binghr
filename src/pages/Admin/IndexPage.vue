<template>
  <div class="column items-center w-100 q-pa-md">
    <q-avatar size="200px" color="secondary" text-color="white" class="q-my-lg">
      <img :src='user.image'  />
    </q-avatar>
    <div class="w-75">
      <q-input
        rounded
        outlined
        v-model="form.name"
        label="姓名"
        class="q-ma-md"
      />
      <q-input
        rounded
        outlined
        v-model="form.number"
        label="工號"
        class="q-ma-md"
      />
      <q-input
        rounded
        outlined
        type="password"
        v-model="form.password"
        label="密碼"
        class="q-ma-md"
      />
    </div>
    <q-btn
      label="修改"
      color="red"
      @click="onSubmit"
      class="q-ma-md"
      size="20px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from 'src/stores/users'
import { apiAuth } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useHolidayStore } from 'src/stores/workingdate'
useHolidayStore().getjson()
const $q = useQuasar()
const user = useUserStore()
const router = useRouter()
if (user.isLogin === false) {
  router.push('/login')
  $q.notify({
    color: 'red-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: '請先登入'
  })
}

const form = ref({
  name: user.name,
  number: user.number,
  password: ''
})

const onSubmit = async () => {
  const result = await apiAuth.patch(`/users/${user._id}`, form.value)
  if (result.status === 200) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '修改成功'
    })
  }
}
</script>
