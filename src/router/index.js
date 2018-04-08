import Vue from 'vue'
import Router from 'vue-router'




//electronic card
import J_index from '@/components/J_index'
import Login from '@/components/Login'
import Register from '@/components/Register/Register'
import SetPhone from '@/components/Register/SetPhone'
import SetPassword from '@/components/Register/SetPassword'

import Dredge from '@/components/Dredge'
import Protocol from '@/components/Protocol'

import main from '@/components/main'
import J_main from '@/components/Main/J_main'
import J_Record from '@/components/Main/J_Record'
import MyCard from '@/components/Main/MyCard'
import Approver from '@/components/Main/Approver'
import Credit from '@/components/Main/Credit'
import AddCredit from '@/components/Main/AddCredit'
import Realname from '@/components/Main/Realname'
 

import Service from '@/components/service'
import J_service from '@/components/Service/J_service'
import Natice from '@/components/Service/Natice'
import NaticeContent from '@/components/Service/NaticeContent'


import j_Quick from '@/components/Quick'
import Quick from '@/components/Quick/Quick'
import Select from '@/components/Quick/Select'
import QuickPay from '@/components/Quick/QuickPay'
import Sccessful from '@/components/Quick/Sccessful'



Vue.use(Router)

export default new Router({
	// mode: 'history',
  	routes: [
        {path:'/jpay',name: 'J_index',component: J_index,},
        {path:'/jpay/login', name: 'Login', component: Login,},
        {path:'/jpay/dredge',name:'Dredge',component:Dredge},//商户
        {path: '/jpay/protocol', name: 'Protocol', component:Protocol },//用户协议
        {path: '/jpay/register', name: 'Register', component: Register,
          children:[
            { path: '/jpay/register/setphone', name: 'SetPhone', component: SetPhone },
            { path: '/jpay/register/setpassword', name: 'SetPassword', component: SetPassword },
            { path: '/', redirect: "/jpay/register/setphone" },
            { path: '*', redirect: "/jpay/register/setphone" }
          ] 
      
        },



        {path:'/jpay/main',name:'main',component:main,
          children:[
            {path:'/jpay/main/index',name:'J_main',component:J_main},
            {path: '/jpay/main/record', name: 'J_Record', component:J_Record },
            {path: '/jpay/main/mycard', name: 'MyCard', component:MyCard },
            {path: '/jpay/main/approver', name: 'Approver', component:Approver },
            {path: '/jpay/main/realname', name: 'Realname', component:Realname },
            {path: '/jpay/main/credit', name: 'Credit', component:Credit },
            {path: '/jpay/main/addcredit', name: 'AddCredit', component:AddCredit },
            { path: '/', redirect:"/jpay/main/index"},
            { path: '*', redirect:"/jpay/main/index"}
          ]
        },
        {path:'/jpay/service',name:'Service',component:Service,
            children:[
                {path:'/jpay/service/index',name:'J_service',component:J_service},
                {path:'/jpay/service/natice',name:'Natice',component:Natice},
                {path:'/jpay/service/natice/content/:id',name:'NaticeContent',component:NaticeContent},
              { path: '/', redirect:"/jpay/service/index"},
              { path: '*', redirect:"/jpay/service/index"}
            ]
        },
      {
        path: '/jpay/quick', name: 'j_Quick', component: j_Quick,
          children:[
            { path: '/jpay/quick/index', name: 'Quick', component: Quick},
            {path: '/jpay/quick/select/:oriderid', name: 'Select', component:Select },
            {path: '/jpay/quick/quickpay/:orderid/:cardid', name: 'QuickPay', component:QuickPay },
            {path: '/jpay/quick/pay/sccessful/:orderid', name: 'Sccessful', component:Sccessful },
            { path: '/', redirect:"/jpay/quick/index"},
            { path: '*', redirect:"/jpay/quick/index"}
          ]
        },
        {path:'/',redirect:"/jpay"},
        {path:'*',redirect:"/jpay"}
	]
})
