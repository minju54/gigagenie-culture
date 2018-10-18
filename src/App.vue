<template>
  <!-- <div id="app" class="image" > -->
  <div id="app">
    <!-- <div style="{ 'background-image': 'url('./assets/bg.png')' }" class="image"> -->
      <!-- <app-nav></app-nav> -->
      <router-view/> <!--  여기에 라우터가 컴포넌트 넣는다. --> 
    <!-- </div> -->
  </div>
</template>

<script>
// App.vue -> 루트 컴포넌트
import Home from './components/Home.vue';
export default {
  name: "App",
  created() {
    // this.init();
  },
  data() {
    return {
      options: null
    };
  },
  methods: {
  }
};
</script>

<style lang="css">
  @import './components/css/App.css';
</style>
