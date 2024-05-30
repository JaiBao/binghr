<template>
  <q-layout view="hHh lpR fFf">
    <q-header :class="bgcolor" class="text-white">
      <!-- bg-blue-5 bg-accent  -->
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>差勤系統 | 管理員</q-toolbar-title>
        <q-spacer></q-spacer>
        <q-span>您好，{{ user.name }} ，早安</q-span>
        <q-fab
          color="blue-10"
          icon="keyboard_arrow_down"
          direction="down"
          class="q-ml-lg"
        >
          <q-fab-action color="blue" text-color="white" icon="home" to="/" />
          <q-fab-action
            color="blue"
            text-color="white"
            icon="logout"
            @click="logout"
          />
        </q-fab>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-2"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item :to="menuItem.a" clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useUserStore } from 'src/stores/users'
import { useHolidayStore } from 'src/stores/workingdate'
import { useRouter } from 'vue-router'
// import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
// import { useI18n } from 'vue-i18n'
const user = useUserStore()
const holiday = useHolidayStore()
const router = useRouter()
const team = process.env.TEAM
const bgcolor = computed(() => {
  if (team === '世間水') {
    return 'bg-blue-5'
  } else {
    return 'bg-accent'
  }
})
// ------------------------------------------------------------------------------------------------
// eslint-disable-nextline
// const { t } = useI18n()
const $q = useQuasar()
watchEffect(() => {
  if (user.isAdmin === false) {
    router.push('/')
    $q.notify({
      color: 'red-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '你沒有權限'
    })
  }
})
// if (user.isAdmin === false) {
//   router.push('/')
//   $q.notify({
//     color: 'red-4',
//     textColor: 'white',
//     icon: 'cloud_done',
//     message: '你沒有權限'
//   })
// }

const drawer = ref(false)
const miniState = ref(true)
function toggleLeftDrawer () {
  drawer.value = !drawer.value
}
console.log(holiday.holidayData)
const logout = async () => {
  await user.logout()
  router.push('/')
}
const menuList = [
  {
    icon: 'person_add',
    label: '看自己',
    separator: true,
    a: '/user'
  },
  {
    icon: 'person_add',
    label: '建立用戶',
    separator: false,
    a: '/admin/register'
  },
  {
    icon: 'pets',
    label: '員工管理',
    separator: false,
    a: '/admin/user'
  },
  {
    icon: 'timer',
    label: '工時(打卡紀錄)',
    separator: false,
    a: '/admin/calendar'
  },
  {
    icon: 'table_chart',
    label: '工時查詢與修改',
    separator: false,
    a: '/admin/hours'
  },
  {
    icon: 'table_chart',
    label: '人員調度',
    separator: false,
    a: '/admin/worker'
  },
  // {
  //   icon: 'check',
  //   label: '班表審核',
  //   separator: false,
  //   a: '/admin/approval'
  // },
  {
    icon: 'task_alt',
    label: '班表總表',
    separator: false,
    a: '/admin/approved'
  },
  {
    icon: 'task_alt',
    label: '打卡紀錄總表',
    separator: false,
    a: '/admin/punchrecord'
  }
  // {
  //   icon: 'table_rows',
  //   label: '班表查看',
  //   separator: false,
  //   a: '/admin/workschedule'
  // },
  // {
  //   icon: 'table_rows',
  //   label: '假期列表',
  //   separator: false,
  //   a: '/admin/holidaydate'
  // }
  // {
  //   icon: 'table_rows',
  //   label: '加班審核',
  //   separator: false,
  //   a: '/admin/overtimeapprove'
  // },
  // {
  //   icon: 'table_rows',
  //   label: '新增加班',
  //   separator: false,
  //   a: '/admin/overtime'
  // },
  // {
  //   icon: 'table_rows',
  //   label: '補打卡',
  //   separator: false,
  //   a: '/admin/manual'
  // }
]
</script>

<style lang="scss"></style>
