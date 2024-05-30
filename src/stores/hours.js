import { defineStore } from 'pinia'
import { apiAuth } from 'src/boot/axios'

export const useHoursStore = defineStore('hours', {
  state: () => ({
    work: [],
    year: '',
    month: '',
    shouldChangeMonth: false
  }),
  getters: {
  },
  actions: {
    async gethours (number, date) {
      this.work.splice(0, this.work.length)
      const { data } = await apiAuth.post(`/work/month/${number}`, date)
      console.log(data.message)
      data.message.forEach((item) => {
        this.work.push(item)
      })
    },
    async getDayHours (date) {
      this.work.splice(0, this.work.length)
      const { data } = await apiAuth.post('/work/allday', date)
      console.log(data.result)
      data.result.forEach((item) => {
        this.work.push(item)
      })
    }
  }
})
