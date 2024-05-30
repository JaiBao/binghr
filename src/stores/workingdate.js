import { defineStore } from 'pinia'
import axios from 'axios'
import { DateTime } from 'luxon'

// import csvtojson from 'csvtojson'
const today = DateTime.now()
export const useHolidayStore = defineStore('holiday', {
  persist: ['holidayData', 'manualData'],
  state: () => ({
    holidayData: [],
    manualData: [],
    today: DateTime.now()
  }),
  actions: {
    async getjson () {
      try {
        // 節假日json
        const response = await axios.get(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${today.year}.json`)
        const filteredData = response.data.reduce((acc, item) => {
          if (item.isHoliday === true) {
            item.isHoliday = '放假'
            item.year = item.date.slice(0, 4)
            item.month = item.date.slice(4, 6)
            item.day = item.date.slice(6, 8)
            acc.push(item)
          }
          return acc
        }, [])
        console.log(filteredData)
        this.holidayData = filteredData // 更新正確的狀態屬性
        console.log('JSON 完成。')
      } catch (error) {
        console.error('JSON 時發生錯誤：', error)
      }
    },
    async addHoliday (holiday) {
      this.manualData.push(holiday)
    }
  }
})
