<template>
  <div class="column items-center w-100 q-pa-md">
    <q-avatar size="200px" color="secondary" text-color="white" class="q-my-lg">
      <img
        :src='user.image'
      />
    </q-avatar>
    <div class="w-75">
      <q-input
        rounded
        outlined
        v-model="form.name"
        label="姓名"
        readonly
        class="q-ma-md"
      />
      <q-input
        rounded
        outlined
        readonly
        v-model="form.number"
        label="工號"
        class="q-ma-md"
      />
      <q-input
        rounded
        outlined
        :type="isPwd ? 'password' : 'text'"
        v-model="form.password"
        label="密碼"
        class="q-ma-md"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-input
        rounded
        outlined
        :type="isPwd ? 'password' : 'text'"
        v-model="form.confirmpassword"
        label="密碼確認"
        class="q-ma-md"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-select
        rounded
        outlined
        v-model="form.team"
        :options="options"
        label="組別"
        class="q-ma-md"
        readonly
      />
    </div>
    <div class="row w-75 justify-center items-center">
      <q-input
        rounded
        outlined
        v-model="user.year"
        label="到職年"
        readonly
        class="col-3 q-pa-xs"
      />
      <q-input
        rounded
        outlined
        v-model="user.month"
        readonly
        label="月"
        class="col-3 q-pa-xs"
      />
      <q-input
        rounded
        outlined
        v-model="user.day"
        readonly
        label="日"
        class="col-3 q-pa-xs"
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
import { apiAuth, api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const user = useUserStore()
const router = useRouter()
const isPwd = ref(true)
if (user.isLogin === false) {
  router.push('/login')
  $q.notify({
    color: 'red-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: '請先登入'
  })
}
// ----------------------------------------------------------------
const options = ref([])
const getoption = async () => {
  const result = await api.get('/users/team')
  console.log(result.data)
  options.value = result.data
}
getoption()

const form = ref({
  name: user.name,
  number: user.number,
  password: '',
  comfirmpassword: '',
  team: user.team
})

const onSubmit = async () => {
  if (form.value.password !== form.value.confirmpassword) {
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '密碼不一致'
    })
  } else {
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
}
</script>
