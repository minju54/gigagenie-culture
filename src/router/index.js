import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Detail from '../components/Detail/Detail.vue'
import DetailFavor from '../components/Detail/DetailFavor.vue'
import DetailFee from '../components/Detail/DetailFee.vue'
import DetailGroup from '../components/Detail/DetailGroup.vue'
import DetailDate from '../components/Detail/DetailDate.vue'
import ResultMain from '../components/Result/ResultMain.vue'
import NotFound from '../components/NotFound.vue'

// 뷰 어플리케이션에 라우터 플러그인을 추가
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, 
    {
      path: '/detail',
      name: 'detail',
      component: Detail,
      children: [
        {
          path: 'group',
          name: 'detailGroup',
          component: DetailGroup
        },
        {
          path: 'favor',
          name: 'detailFavor',
          component: DetailFavor
        },
        {
          path: 'fee',
          name: 'detailFee',
          component: DetailFee
        }, {
          path: 'date',
          name: 'detailDate',
          component: DetailDate
        }
      ]
    },
    {
      path: '/resultMain',
      name: 'resultMain',
      component: ResultMain
    }, 
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
