<template>
    <section>
        <main-top></main-top>
        <div class="container" id="content">
            <h3 @click="pageMove(1)">오늘의 추천 문화</h3>
            <h3 @click="pageMove(2)">선택하기</h3>
            <h3 @click="pageMove(3)">북마크</h3> 
        </div>
        <main-footer></main-footer>
    </section>
</template>
<script>
import MainTop from './MainTop.vue';
import MainFooter from './MainFooter.vue';

export default {
    data() {
        return {
            options: {},
            info_text: "번호를 말씀해주세요"
        }
    },
    created() {
        this.init();
        this.getUserVoice();
        this.setVoiceFlag();
        this.getVoiceCommand();
        this.exitApp();
    },
    components: {
        mainTop: MainTop,
        mainFooter: MainFooter
    },
    methods: {
        init() {
            this.options.appid = this.$store.getters.getAppId;
            this.options.keytype = this.$store.getters.getKeyType;
            this.options.apikey = this.$store.getters.getAPIKey;
            
            var self = this;
            gigagenie.init(this.options, function(result_cd, result_msg, extra) {
                if (result_cd === 200) {
                    // self.sendTTS(self.info_text);
                } else {
                    console.log('[MainCategory] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        getVoiceCommand() {
            var self = this;
            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        // self.$router.replace({path: '/'});
                        console.log('[MainCategory] 이전 페이지');
                        break;
                    case 'nextPage':
                        self.sendTTS("번호를 먼저 선택해주세요");
                        console.log('[MainCategory] 다음 페이지');
                        break;
                    default:
                        break;
                }
            };
        },
        getUserVoice() {
            this.options={};
            this.options.voicemsg= this.info_text;
            var self = this;
            gigagenie.voice.getVoiceText(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log("[MainCategory]Received Text is " + extra.voicetext);
                    if (extra.voicetext == "1번") {
                        self.pageMove(1);
                    } else if (extra.voicetext == "2번") {
                        self.pageMove(2);
                    } else if (extra.voicetext == "3번") {
                        self.pageMove(3);
                    }
                } else {
                    console.log('[MainCategory]getUserVoice err: ' +  result_cd + ": " + result_msg);
                }; 
            });
        },
        setVoiceFlag() {
            var self = this;
            this.options={};
            this.options.flag=1; //  ContainerApp 에서 음성선택번호 및 확인/취소 수신
            gigagenie.voice.setKwsVoiceRecv (this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    self.getUserSelectedNum(extra);
                };
            });
        }, 
        getUserSelectedNum(event) {
            var self = this;
            gigagenie.voice.onSelectedIndex=function(event){
                switch(event){
                    case 1:
                        pageMove(1);
                        break;
                    case 2:
                        pageMove(2);
                        break;
                    case 3:
                        pageMove(3);
                    default:
                        break;
                };
            }
        },
        exitApp() {
            // 음성종료, 리모컨 나가기 키 클릭
            var self = this;
            gigagenie.voice.onRequestClose=function(){
                var options={};
                gigagenie.voice.svcFinished(options,function(result_cd,result_msg,extra){
                    this.stopTTS();
                });
            };
        }, 
        stopTTS() {
            // TTS중단, 음성인식 중지 
            var options={};
            gigagenie.voice.stopTTS(options,function(result_cd, result_msg, extra) {
                if (result_cd==200) {
                    console.log("[MainCategory]음성인식 중단 성공");
                }
                else if (result_cd==404) {
                    console.log("[MainCategory]음성인식 실행 중이 아님");
                }
                else {
                    console.log("[MainCategory]음성인식 중단 실패: " + result_msg);
                }
            });
        },
        sendTTS(msg) {
            this.options = {};
            this.options.ttstext = msg;
            var self = this;
            gigagenie.voice.sendTTS(this.options, function(result_cd, result_msg, extra) {
                if(result_cd===200){

                } else {
                    //extra.reason 에 voice 오류 전달.
                    console.log("[MainCategory]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[MainCategory]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[MainCategory]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        pageMove(id) {
            var self = this;
            switch(id) {
                case 1:
                    setTimeout(function() {self.$router.push('/resultToday')}, 1000);
                    break;
                case 2:
                    setTimeout(function() {self.$router.push('/detail/favor')}, 1000);
                    break;
                case 3:
                    setTimeout(function() {self.$router.push('/bookmarkMain')}, 1000);
                    break;
                default:
                    break;
            }
            
        }
    }
}
</script>
<style lang="css">
    @import '../css/MainCategory.css';
</style>
