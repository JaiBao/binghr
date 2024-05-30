import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { api, apiAuth } from 'src/boot/axios'
// import router from 'src/router'
// import { useRouter } from 'vue-router'
//
// const router = useRouter()
export const useUserStore = defineStore(
  'user',
  () => {
    const name = ref('')
    const number = ref('')
    const tokens = ref('')
    const role = ref(0)
    const _id = ref('')
    const team = ref('')
    const year = ref('')
    const month = ref('')
    const day = ref('')
    const image = ref('')
    const isLogin = computed(() => {
      return tokens.value.length > 0
    })
    const isAdmin = computed(() => {
      return role.value === 1
    })

    const $q = useQuasar()
    const login = async (form) => {
      try {
        const { data } = await api.post('/users/login', form)
        console.log(data.result)
        _id.value = data.result._id
        tokens.value = data.result.token
        number.value = data.result.number
        name.value = data.result.name
        role.value = data.result.role
        team.value = data.result.team
        year.value = data.result.year
        month.value = data.result.month
        day.value = data.result.day
        image.value = data.result.image
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '登入成功'
        })
      } catch (error) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'info',
          message: '登入失敗，是密碼錯誤嗎？'
        })
      }
    }
    // router 要改成function
    const logout = async () => {
      try {
        await apiAuth.delete('/users/logout')
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '登出成功'
        })
      } catch (error) {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: error.message
        })
      }
      tokens.value = ''
      number.value = ''
      name.value = ''
      role.value = ''
      _id.value = ''
      team.value = ''
      image.value = ''
      // router.push('/')
    }
    return {
      tokens,
      number,
      name,
      role,
      login,
      isLogin,
      isAdmin,
      _id,
      logout,
      team,
      year,
      month,
      day,
      image
    }
  },
  {
    persist: {
      key: '2023hrhr',
      paths: ['tokens', 'number', '_id', 'name', 'role', 'team']
    }
  },
  {}
)
