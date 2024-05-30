<template>

<div class="row w-100 q-pa-md">
    <FullCalendarWorkAdmin />
  </div>
  <div class="column w-100 justify-center items-center">
    <h6>新增班表</h6>
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-file name="poster_file" v-model="file" filled label="選擇檔案" />
      <q-btn v-if="file" label="匯入班表" type="submit" color="primary" />
      <q-btn
        label="下載表格"
        color="green"
        :href='href'
      />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { apiAuth } from 'src/boot/axios'
import FullCalendarWorkAdmin from 'src/components/FullCalendarWorkAdmin.vue'
import { useQuasar } from 'quasar'
// import { useHolidayStore } from 'src/stores/workingdate'

// const holiday = useHolidayStore()

const $q = useQuasar()
const file = ref(null)
const href = ref(`${process.env.VITE_API}download/workschedule`)
const onSubmit = async (evt) => {
  if (file.value) {
    console.log(file.value)
    try {
      const formData = new FormData()
      formData.append('file', file.value, file.value.name)
      const result = await apiAuth.post('/workschedule/csvtowork', formData)

      console.log(result)

      if (result.status === 200) {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '上傳成功'
        })
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}

</script>
