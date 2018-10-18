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
    init() {
      this.options = {};
      this.options.appid = "E5002361";
      this.options.keytype = "GBOXDEVM";
      this.options.apikey = "RTUwMDIzNjF8R0JPWERFVk18MTUzNzI0NDg1NjA4NA==";
      
      gigageinie.init(this.options, function(result_cd, result_msg, extra) {
          if (result_cd === 200) {
          console.log("gigagenie initialize success");
          alert("init 실행완료");
          sendTTS("문화 알리미를 실행합니다.");
          }
      });
    }
    // sendTTS(tts) {
    //   this.options = {};
    //   options.ttstext = tts;
    //   gigagenie.voice.sendTTS(this.options, function(
    //       result_cd,
    //       result_msg,
    //       extra
    //   ) {
    //       console.log("gigagenie.voice.sendTTS - result_cd:" + result_cd);
    //       console.log("gigagenie.voice.sendTTS - result_msg:" + result_msg);
    //       console.log("gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
    //   });
    // },
    
  }
};
</script>

<style lang="css">
  @import './components/css/App.css';
</style>
