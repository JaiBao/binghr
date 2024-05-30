import { defineStore } from 'pinia'
// import { LocalStorage } from 'quasar'
import { apiAuth, apiShit } from 'src/boot/axios'
import { DateTime } from 'luxon'
export const UseSearchStore = defineStore('search', {
  state: () => ({
    income: {},
    Monthincome: {},
    telephone: [],
    name: [],
    products: {},
    length: '',
    month: DateTime.now().toFormat('yyyy-MM'),
    day: DateTime.now().toFormat('yyyy-MM-dd'),
    monthoption: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  }),
  actions: {
    async searchname (val) {
      try {
        this.name.splice(0, this.name.length)
        const result = await apiAuth.get(`member/member?&page=1&filter_name=${val}`)
        for (let i = 0; i < result.data.data.length; i++) {
          this.name.push({ label: result.data.data[i].name, value: result.data.data[i].name })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async searchphone (val) {
      try {
        if (val.length > 3) {
          this.cellphone.splice(0, this.cellphone.length)
          const { data } = await apiAuth.get(`member/member?&page=1&filter_phone=${val}`)
          console.log(data.data)
          for (let i = 0; i < data.data.length; i++) {
            this.cellphone.push({ label: data.data[i].name + ' ' + data.data[i].mobile, value: data.data[i].mobile })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async searchtelephone (val) {
      try {
        this.telephone.splice(0, this.telephone.length)
        const { data } = await apiAuth.get(`member/member?&page=1&filter_phone=${val}`)
        console.log(data.data)
        for (let i = 0; i < data.data.length; i++) {
          this.telephone.push({ label: data.data[i].telephone, value: data.data[i].telephone })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async get () {
      try {
        const data = {}
        const res = await apiShit.post('newcus', {
          startDate: this.month,
          endDate: this.month
        })
        data.value = await res.data
        length.value = Object.keys(data.value).length
      } catch (error) {
        console.log(error)
      }
    },
    async getIncome (val1, val2) {
      const result2 = await apiShit.get('/read4')
      const result5 = await apiShit.get('/price')
      const result87 = await apiShit.post('/productsonedaylength', {
        startDate: val1, endDate: val2
      })
      this.Monthincome = Object.entries(result2.data)
      this.income = Object.entries(result5.data)
      const updatedRows = result87.data.rows.map(row => {
        const deliveryDateInUTC = DateTime.fromISO(row.deliveryDate, { zone: 'utc' })
        const deliveryDateInLocal = deliveryDateInUTC.setZone('Asia/Taipei')
        return {
          ...row,
          deliveryDate: deliveryDateInLocal.toFormat('yyyy-MM-dd')
        }
      })
      this.length = updatedRows
    }
  }
})
