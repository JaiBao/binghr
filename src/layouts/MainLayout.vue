<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-teal text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>差勤系統 | 使用者</q-toolbar-title>
        <q-spacer></q-spacer>
        <q-span>您好，{{ user.name }}</q-span>
        <q-fab
          color="teal"
          icon="keyboard_arrow_down"
          direction="down"
          class="q-ml-lg"
        >
          <q-fab-action color="teal" text-color="white" icon="home" to="/" />
          <q-fab-action
            color="teal"
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
            <q-item
              :to="menuItem.a"
              clickable
              :active="menuItem.label === 'Outbox'"
              v-ripple
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer bordered class="bg-teal text-white"> </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from 'src/stores/users'
import { useRouter } from 'vue-router'
// import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
// import { useI18n } from 'vue-i18n'
const user = useUserStore()
const router = useRouter()
// ------------------------------------------------------------------------------------------------
// eslint-disable-nextline
// const { t } = useI18n()
const $q = useQuasar()
if (user.isAdmin) {
  // router.push('/admin')
} else if (!user.isLogin) {
  router.push('/')
  $q.notify({
    color: 'red-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: '請先登入'
  })
}

const drawer = ref(false)
const miniState = ref(true)
function toggleLeftDrawer () {
  drawer.value = !drawer.value
}

const logout = async () => {
  await user.logout()
  router.push('/')
}
const baseMenu = [
  { icon: 'info', label: '關於我', separator: false, a: '/user' },
  // { icon: 'punch_clock', label: '打卡紀錄', separator: false, a: '/user/my' },
  { icon: 'history', label: '工時統計', separator: false, a: '/user/mytime' }
  // { icon: 'table_rows', label: '工時統計(圖)', separator: false, a: '/user/calendar' }
]

const menuList = computed(() => {
  if (user.isAdmin) {
    return [{ icon: 'credit_card', label: '回管理員', separator: true, a: '/admin' }, ...baseMenu]
  }
  return baseMenu
})
</script>

<style lang="scss"></style>
