<template>
    <div id="content">
        <div class="container">
            <div>
                <p id="text-top">"이번 주말에 친구랑 볼 수 있는 연극 알려줘"</p>
                <p id="text-middle">"가족과 볼 수 있는 음악회 추천해줘"</p>
            </div>
            <div class="row">
                <div class="col-sm-2" id="category-div">
                    <div id="white-boder-circle">
                        <img id="category-img" src="../../assets/main-family.png">
                        <p><b>인원</b></p>
                    </div>
                </div>
                <div class="col-sm-2" id="category-div">
                    <div id="white-boder-circle">
                        <img id="category-img" src="../../assets/main-piano.png">
                        <p><b>취향</b></p>
                    </div>
                </div>
                <div class="col-sm-2" id="category-div">
                    <div id="white-boder-circle">
                        <img id="category-img" src="../../assets/main-hand.png">
                        <p><b>요금</b></p>
                    </div>
                </div>
                <div class="col-sm-2" id="category-div">
                    <div id="white-boder-circle">
                        <img id="category-img" src="../../assets/main-map.png">
                        <p><b>위치</b></p>
                    </div>
                </div>
                <div class="col-sm-2" id="category-div">
                    <div id="white-boder-circle">
                        <img id="category-img" src="../../assets/main-calendar.png">
                        <p><b>날짜</b></p>
                    </div>
                </div> 
            </div>
            <div>
                <img src="../../assets/down-arrow.png" id="start-arrow" width="40px" height="40px">
                <p id="text-bottom" @click="start()">간단한 선택을 통해 맞춤 문화 정보를 추천해드려요</p>
            </div>
            <div>
                <!-- <h3 id="text-start" @click="start()"><b>"기가지니 시작하기"</b></h3> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options : {}
        }
    },
    created() {
        this.init();
        this.getVoiceCommand();
    },
    methods: {
        init() {
            this.options.appid = this.$store.getters.getAppId;
            this.options.keytype = this.$store.getters.getKeyType;
            this.options.apikey = this.$store.getters.getAPIKey;
            
            var self = this;
            gigagenie.init(this.options, function(result_cd, result_msg, extra) {
                if (result_cd === 200) {
                    self.sendTTS("기가지니와 함께하는 문화 알리미[P5]간단한 선택을 통해 당신에게 딱 맞는 문화 정보를 추천해드려요."); 
                } else {
                    console.log('[MainContent] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        sendTTS(tts) {
            this.options = {};
            this.options.ttstext = tts;
            var self = this;
            gigagenie.voice.sendTTS(this.options, function(result_cd, result_msg, extra) {
                if(result_cd===200){
                    if (this.options.ttstext === "문화알리미를 종료합니다") {
                        self.exitApp();
                    } else {
                        self.start();
                    }
                } else {
                    console.log("[MainContent]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[MainContent]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[MainContent]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        getVoiceCommand() {
            var self = this;
            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        console.log('[MainContent] 이전 페이지');
                        self.sendTTS("이전 페이지가 없습니다.");
                        break;
                    case 'nextPage':
                        self.start();
                        console.log('[MainContent] 다음 페이지');
                        break;
                    
                    default:
                        break;
                }
            };

            gigagenie.voice.onActionEvent=function(extra) {
                if (extra.actioncode === 'MainMenu') {
                    self.sendTTS("홈화면으로 이동합니다");
                    self.$router.replace({path: '/'});
                } 
            }

            gigagenie.voice.onRequestClose=function(){
                var options={};
                gigagenie.voice.svcFinished(options,function(result_cd,result_msg,extra){
                    self.stopTTS();
                });
            };
        },
        stopTTS() {
        // TTS중단, 음성인식 중지 
            var options={};
            gigagenie.voice.stopTTS(options,function(result_cd, result_msg, extra) {
                if (result_cd==200) {
                    // console.log("음성인식 중단 성공");
                }
                else if (result_cd==404) {
                    console.log("음성인식 실행 중이 아님");
                }
                else {
                    console.log("음성인식 중단 실패: " + result_msg);
                }
            });
        },
        start() {
            var self = this;
            // setTimeout(function() {self.$router.push('/detail/favor')}, 2000);
            setTimeout(function() {self.$router.push('/mainCategory')}, 2000);
            self.getUserSetting();
        },
        getUserSetting() {
            // 사용자 주소 설정
            var address = '';
            var self = this;
            gigagenie.appinfo.getAddress(null,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    address = extra.address.substr(0,2);
                    console.log("[MainContent]GiGA Genie Home Address= " + address);
                } else if(result_cd===404){
                    console.log("[MainContent]Address is not found");
                } else {
                    console.log("[MainContent]Getting Home Address fail.");
                }
                if (address == "") {
                    address = '서울'; // 기본값 서울
                }
                self.$store.commit('setAddress', address);
            });

            // 사용자 namespace 설정
            this.options = {};
            this.options.namespace = 'bookmark';
            this.options.shareflag = 'N';
            gigagenie.appdata.createNameSpace(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log("[MainContent]Namespace Bookmark creation is success.");
                } else if (result_cd===409){
                    console.log("[MainContent]Namespace Bookmark creation already exist.");
                } else {
                    console.log("[MainContent]Namespace Bookmark creation is fail.");
                }
            });
        },
        exitApp() { 
            console.log('exitAPP');
            // 음성종료, 리모컨 나가기 키 클릭
            var self = this;
            gigagenie.voice.onRequestClose=function(){
                console.log('[MainContent]exitAPP onRequestClose');
                var options={};
                gigagenie.voice.svcFinished(options,function(result_cd,result_msg,extra){
                    console.log('[MainContent]exitAPP svcFinished');
                    self.stopTTS();
                });
            };
        }, 
        stopTTS() {
            console.log('stopTTS');
            // TTS중단, 음성인식 중지 
            var options={};
            gigagenie.voice.stopTTS(options,function(result_cd, result_msg, extra) {
                if (result_cd==200) {
                    console.log("[MainContent]음성인식 중단 성공");
                }
                else if (result_cd==404) {
                    console.log("[MainContent]음성인식 실행 중이 아님");
                }
                else {
                    console.log("[MainContent]음성인식 중단 실패: " + result_msg);
                }
            });
        }
    }
};


</script>

<style lang="css">
    @import '../css/MainContent.css';
</style>


