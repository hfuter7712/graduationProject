import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Search from '@/components/Search'
import User from '@/components/User'
import Login from '@/components/login'
import Mine from '@/components/mine'
import Model from '@/components/model'
import myModel from '@/components/myModel'
import collectModel from '@/components/collectModel'
import color from '@/components/color'
import train from '@/components/train'
import admin from '@/components/admin'
import trainManage from '@/components/trainManage'
import modelManage from "../components/modelManage";
import record from '../components/record';
import userProfile from "../components/userProfile";

Vue.use(Router)

export default new Router({
  	mode:'history',
  	routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    },
      {
        path:'/model/:id',
        component: Model
      },
      {
        path:'/mymodel',
        component:myModel
      },
      {
        path:'/collectModel',
        component:collectModel
      },
      {
        path:'/color',
        component:color
      },
      {
        path:'/train',
        component:train
      },
      {
        path:'/admin',
        component:admin
      },
      {
        path:'/admin/trainManage',
        component:trainManage
      },
      {
        path:'/admin/modelManage',
        component:modelManage
      },
      {
        path:'/record',
        component:record
      },
      {
        path:'/userProfile',
        component:userProfile
      }

  ]
})
