<template>
  <div class="q-pa-md">
    <q-table
      title="用戶資料"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="姓名"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-edit="props">
        <q-td class="text-center q-gutter-sm">
          <q-btn
            icon="mdi-pencil"
            color="info"
            fab-mini
            unelevated
            size="sm"
            @click="openDialog(props.row)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td class="text-center q-gutter-sm">
          <q-btn
            icon="delete"
            color="red"
            fab-mini
            unelevated
            size="md"
            @click="deleteuser(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">_id</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          readonly
          v-model="accountForm._id"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">名字</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="accountForm.name"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">工號</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="accountForm.number"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">密碼</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          type="password"
          v-model="accountForm.password"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">權限 0:使用者 1:管理員</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          v-model="accountForm.role"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">組別</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          dense
          :options="options"
          v-model="accountForm.team"
          autofocus
          @keyup.enter="prompt = false"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="修改" v-close-popup @click="Submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- ---------------------------------------------------- -->
</template>
<script setup>
import { ref, reactive } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { useQuasar } from 'quasar'
// import { useUserStore } from 'src/stores/users'
import { useMemberStore } from 'src/stores/member'

const options = ref(null)
// const user = useUserStore()
const member = useMemberStore()
const $q = useQuasar()
const prompt = ref(false)
const accountForm = reactive({
  _id: '',
  name: '',
  number: '',
  password: '',
  role: '',
  team: ''
})
const getteam = async () => {
  const result = await apiAuth.get('/users/team')
  options.value = result.data
}
getteam()
const filter = ref('')
const openDialog = (props) => {
  prompt.value = true
  accountForm._id = props._id
  accountForm.name = props.name
  accountForm.number = props.number
  accountForm.role = props.role
  accountForm.team = props.team
}
const closeDialog = (props) => {
  prompt.value = false
  accountForm._id = ''
  accountForm.name = ''
  accountForm.number = ''
  accountForm.role = ''
  accountForm.password = ''
  accountForm.team = ''
}
const Submit = async () => {
  await apiAuth.patch(`/users/admin/${accountForm._id}`, accountForm)
  closeDialog()
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: '修改成功'
  })
  rows.value = []
  getuser()
}
const columns = [
  {
    name: 'name',
    align: 'left',
    label: '名字',
    field: 'name',
    sortable: true
  },
  {
    name: 'number',
    align: 'left',
    label: '工號',
    field: 'number',
    sortable: true
  },
  {
    name: 'team',
    align: 'left',
    label: '班別',
    field: 'team',
    sortable: true
  },
  {
    name: 'edit',
    align: 'center',
    label: '編輯',
    field: 'edit',
    sortable: false
  },
  // {
  //   name: 'year',
  //   align: 'left',
  //   label: '到職年',
  //   field: 'year',
  //   sortable: true
  // },
  // {
  //   name: 'month',
  //   align: 'left',
  //   label: '月',
  //   field: 'month',
  //   sortable: true
  // },
  // {
  //   name: 'day',
  //   align: 'left',
  //   label: '日',
  //   field: 'day',
  //   sortable: true
  // },
  {
    name: 'delete',
    align: 'center',
    label: '刪除',
    field: 'delete',
    sortable: true
  },
  {
    name: 'role',
    align: 'right',
    label: '權限 0=用戶 1=管理員',
    field: 'role',
    sortable: true
  },
  { name: '_id', align: 'right', label: '_id', field: '_id', sortable: true }
]
const rows = ref([])
const getuser = async () => {
  rows.value = []
  await member.getMember()
  rows.value = member.member
}
getuser()

const deleteuser = async (row) => {
  await apiAuth.delete(`/users/delete/${row._id}`)
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: '修改成功'
  })
  await getuser()
}
</script>
