<template>
  <div class="row w-100 justify-center items-center">
    <div class="col">
      <div class="column" id="column">
        <h4 class="text-center q-pt-lg">差勤系統 | 登入</h4>
        <div class="column justify-center w-100">
          <div>
            <div class="column items-center">
              <q-input
                v-model="form.number"
                label="員工編號"
                class="q-py-md w-75"
              >
                <template v-slot:append> <q-icon name="person" /></template
              ></q-input>
              <q-input
                type="password"
                v-model="form.password"
                label="密碼"
                class="q-py-md w-75"
                ><template v-slot:append> <q-icon name="lock" /></template
              ></q-input>
            </div>
          </div>
          <div class="q-pa-md row items-center justify-center">
            <q-btn
              rounded
              label="登 入"
              @click="onSubmit"
              class="q-ma-md q-px-xl q-py-xs"
              size="30px"
              style="border-radius: 70px"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bg-black w-100 row justify-center items-center" id="copyright">
      <span class="q-pa-xs"
        >Copyright &copy; 2023 | DING TAI SHENG 著作權所有</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from 'src/stores/users'
import { useRouter } from 'vue-router'
import { useHolidayStore } from 'src/stores/workingdate'

const working = useHolidayStore()
working.getjson()
const user = useUserStore()
const router = useRouter()
if (user.isLogin === true) {
  router.push('/user')
}
const form = ref({
  number: '',
  password: ''
})

const onSubmit = async () => {
  await user.login(form.value)
  if (user.isAdmin) {
    router.push('/admin')
  } else if (user.isLogin) {
    router.push('/user')
  }
}
</script>

<style lang="scss" scoped>
.col {
  height: 100vh;
  .q-btn {
    color: #fff;
    background: #000;
  }
  @media (min-width: 1024px) {
    // background: url("../../assets/login.png") no-repeat 500% / cover;
    background: #fff;
    padding-top: 7%;
  }
}

</style>
