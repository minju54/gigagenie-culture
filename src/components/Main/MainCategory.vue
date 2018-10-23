<template>
    <section>
        <main-top></main-top>
        <div class="container" id="content">
            <!-- <h3 @click="pageMove(1)">오늘의 추천 문화</h3>
            <h3 @click="pageMove(2)">선택하기</h3>
            <h3 @click="pageMove(3)">북마크</h3>  -->
            <p id="text-title-top">원하는 번호를 선택해주세요. <b>"기가지니, 1번"</b></p>
            <div class="row">
                <div class="col-sm-6">
                    <button id="btn-select" @click="pageMove(1)">
                        <img id="num-circle-left" src="../../assets/numCircle1.png">
                        <p id="text-select"><b>맞춤 추천</b></p>
                        <p id="text-info-top">조건에 따라 맞춤 문화 정보를 추천해드려요 </p>
                        <p id="text-info-bottom">장르, 인원, 요금, 날짜 4가지만 선택해주세요</p>
                    </button>
                       
                </div>
                <div class="col-sm-6">
                    <button id="btn-today" @click="pageMove(2)">
                        <img id="num-circle-right" src="../../assets/numCircle2.png">
                        <p id="text-today"><b>오늘의 추천 문화</b></p>
                        <p id="text-info">오늘의 문화 정보를 한가지 추천해드려요</p>
                    </button>
                    <button id="btn-book" @click="pageMove(3)">
                        <img id="num-circle-right" src="../../assets/numCircle3.png">
                        <p id="text-book"><b>북마크</b></p>
                        <p id="text-info">북마크한 목록을 볼 수 있어요</p>
                    </button>
                </div>
                <!-- <div class="col-sm-6" id="div-select">
                    <img id="num-circle" src="../../assets/numCircle1.png">
                    <p id="text-select"><b>맞춤 추천</b></p>
                    <p id="text-info-top">조건에 따라 맞춤 문화 정보를 추천해드려요</p>
                    <p id="text-info-bottom">장르, 인원, 요금, 날짜 4가지만 선택해주세요</p>   
                </div> -->
                <!-- <div class="col-sm-6">
                    <div id="div-today">
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <p id="text-today"><b>오늘의 추천 문화</b></p>
                        <p id="text-info">오늘의 문화 정보를 한가지 추천해드려요</p>
                    </div>
                    <div id="div-book">
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <p id="text-book"><b>북마크</b></p>
                        <p id="text-info">북마크한 목록을 볼 수 있어요</p>
                    </div>
                </div> -->
            </div>
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
        // this.divClickable();
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
                    self.voiceSelectMode();
                    // self.sendTTS(self.info_text);
                } else {
                    console.log('[MainCategory] gigagenie init error: '+ result_cd+ ", " + result_msg);
                    self.voiceSelectMode();
                }
            });
        },
        voiceSelectMode() {
            var self = this;
            this.options={};
            this.options.flag=1; //  ContainerApp 에서 음성선택번호 및 확인/취소 수신
            gigagenie.voice.setKwsVoiceRecv (this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    //self.getUserSelectedNum(extra);
                };
            });

            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        self.$router.replace({path: '/'});
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

            this.options={};
            this.options.voicemsg= this.info_text;
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

            gigagenie.voice.onRequestClose=function(){
                var options={};
                gigagenie.voice.svcFinished(options,function(result_cd,result_msg,extra){
                    self.stopTTS();
                });
            };

            this.options={};
            this.options.voicemsg= this.info_text;
            gigagenie.voice.getVoiceText(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log("[MainCategory]Received Text is " + extra.voicetext);
                    if (extra.voicetext == "1번") {
                        self.pageMove(1);
                    } else if (extra.voicetext == "2번") {
                        self.pageMove(2);
                    } else if (extra.voicetext == "3번") {
                        self.pageMove(3);
                    } else {
                        //self.getUserVoice();
                    }
                } else {
                    console.log('[MainCategory]getUserVoice err: ' +  result_cd + ": " + result_msg);
                }; 
            });

            gigagenie.voice.onSelectedIndex=function(event){
                switch(event){
                    case 1:
                        self.pageMove(1);
                        break;
                    case 2:
                        self.pageMove(2);
                        break;
                    case 3:
                        self.pageMove(3);
                    default:
                        break;
                };
            }
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
                    setTimeout(function() {self.$router.push('/detail/favor')}, 1000);
                    break;
                case 2:
                    setTimeout(function() {self.$router.push('/resultToday')}, 1000);
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
