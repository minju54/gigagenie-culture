import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import MainCategory from '../components/Main/MainCategory.vue'
import Detail from '../components/Detail/Detail.vue'
import DetailFavor from '../components/Detail/DetailFavor.vue'
import DetailPrice from '../components/Detail/DetailPrice.vue'
import DetailGroup from '../components/Detail/DetailGroup.vue'
import DetailDate from '../components/Detail/DetailDate.vue'
import ResultMain from '../components/Result/ResultMain.vue'
import ResultToday from '../components/Result/ResultToday.vue'
import BookmarkMain from '../components/Bookmark/bookmarkMain.vue'
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
      path: '/mainCategory',
      name: 'mainCategory',
      component: MainCategory
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
          path: 'price',
          name: 'detailPrice',
          component: DetailPrice
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
      path: '/resultToday',
      name: 'resultToday',
      component: ResultToday
    }, 
    {
      path: '/bookmarkMain',
      name: 'bookmarkMain',
      component: BookmarkMain
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
})
