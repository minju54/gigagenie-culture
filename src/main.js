// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 전역 처리 선언
// import 'event-source-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/Store';

// import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app', // index.html의 <div id="app"> </div> 여기에 vue 컴포넌트들이 마운트 된다.
  router,   // vue-router 사용할 수 있게 해줌
  store,
  components: { App },  // app컴포넌트 사용
  // template: '<App/>'  // #app 에 마운팅 되는 컴포넌트는 <App/>
  render: h => h(App)
})
