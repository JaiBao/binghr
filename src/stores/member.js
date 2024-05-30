import { defineStore } from 'pinia'
import { apiAuth } from 'src/boot/axios'
import { useUserStore } from 'src/stores/users.js'
const user = useUserStore()
export const useMemberStore = defineStore('member', {
  state: () => ({
    member: [],
    geted: false,
    punched: false,
    monthoption: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    dayoption: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  }),
  getters: {

  },
  actions: {
    async getMember () {
      if (this.geted === true) {
        console.log('already get member ')
      } else {
        this.member.splice(0, this.member.length)
        const result = await apiAuth.get('/users/all')
        for (let i = 0; i < result.data.message.length; i++) {
          if (user.team === '人事' || useUserStore().team === '管理') {
            this.member.push(result.data.message[i])
          } else if (result.data.message[i].team !== user.team) {
            continue
          } else {
            this.member.push(result.data.message[i])
          }
        }
        this.geted = true
      }
    }
  }
})
