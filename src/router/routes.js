const routes = [
  {
    path: '/',
    component: () => import('layouts/PunchLayout.vue'),
    children: [
      // {
      //   path: '/punch',
      //   component: () => import('pages/Punch/PunchPage.vue'),
      //   meta: {
      //     title: '差勤系統',
      //     login: false,
      //     admin: false
      //   }
      // },
      {
        path: '/',
        component: () => import('src/pages/Punch/LoginPageDts.vue'),
        meta: {
          title: '差勤系統 | 登入',
          login: false,
          admin: false
        }
      }
      // {
      //   path: '/',
      //   component: () => import('src/pages/Punch/LoginPageWater.vue'),
      //   meta: {
      //     title: '差勤系統 | 登入',
      //     login: false,
      //     admin: false
      //   }
      // }
    ]
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/User/IndexPage.vue'),
        meta: {
          title: '差勤系統 | 用戶',
          login: true,
          admin: false
        }
      },
      {
        path: '/user/my',
        component: () => import('pages/User/MyPunchPage.vue'),
        meta: {
          title: '差勤系統 | 我的差勤',
          login: true,
          admin: false
        }
      },
      {
        path: '/user/mytime',
        component: () => import('pages/User/WorkHour.vue'),
        meta: {
          title: '差勤系統 | 我的工時',
          login: true,
          admin: false
        }
      },
      {
        path: '/user/calendar',
        component: () => import('pages/User/EditCalendar.vue'),
        meta: {
          title: '差勤系統 | 我的工時圖',
          login: true,
          admin: false
        }
      },
      {
        path: '/user/workschedule',
        component: () => import('pages/User/WorkSchedule.vue'),
        meta: {
          title: '差勤系統 | 我的班表',
          login: true,
          admin: false
        }
      }

    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Admin/IndexPage.vue'),
        meta: {
          title: '差勤系統 | 管理員',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/user',
        component: () => import('pages/Admin/UserAdmin.vue'),
        meta: {
          title: '差勤系統 | 用戶管理',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/register',
        component: () => import('pages/Admin/RegisterPage.vue'),
        meta: {
          title: '差勤系統 | 建立用戶',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/calendar',
        component: () => import('pages/Admin/CalendarPage.vue'),
        meta: {
          title: '差勤系統 | 差勤統計',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/approval',
        component: () => import('pages/Admin/WorkApproval.vue'),
        meta: {
          title: '差勤系統 | 班表審核',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/hours',
        component: () => import('pages/Admin/HoursPage.vue'),
        meta: {
          title: '差勤系統 | 工時管理',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/day',
        component: () => import('pages/Admin/HourPageDay.vue'),
        meta: {
          title: '差勤系統 | 工時管理',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/approved',
        component: () => import('pages/Admin/WorkApproved.vue'),
        meta: {
          title: '差勤系統 | 已審核清單',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/workschedule',
        component: () => import('pages/Admin/WorkSchedule.vue'),
        meta: {
          title: '差勤系統 | 班表',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/holidaydate',
        component: () => import('pages/Admin/HolidayDate.vue'),
        meta: {
          title: '差勤系統 | 假期列表',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/overtimeapprove',
        component: () => import('pages/Admin/OvertimeApprove.vue'),
        meta: {
          title: '差勤系統 | 加班審核',
          login: true,
          admin: true
        }
      },
      {
        path: 'hours/:number',
        component: () => import('pages/Admin/HourPageOne.vue'),
        meta: {
          title: '差勤系統 | 工時see',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/overtime',
        component: () => import('src/pages/Admin/OvertimeEdit.vue'),
        meta: {
          title: '差勤系統 | 加班申請',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/manual',
        component: () => import('src/pages/Admin/ManualPunchin.vue'),
        meta: {
          title: '差勤系統 | 補打卡',
          login: true,
          admin: true
        }
      },
      {
        path: '/admin/punchrecord',
        component: () => import('src/pages/Admin/FetchRecord.vue'),
        meta: {
          title: '差勤系統 | 打卡紀錄',
          login: true,
          admin: true
        }
      }, {
        path: '/admin/worker',
        component: () => import('src/pages/Admin/OrderWorker.vue'),
        meta: {
          title: '差勤系統 | 人員調度',
          login: true,
          admin: true
        }
      }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
