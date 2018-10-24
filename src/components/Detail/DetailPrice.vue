<template>
    <section>
        <div class="container" id="content">
            <div id="category-top">
                <button type="button" id="grey-button" @click="pageMove(1)">취향</button>
                <button type="button" id="grey-button" @click="pageMove(2)">인원</button>
                <button type="button" id="yellow-button" @click="pageMove(3)">요금</button>
                <button type="button" id="grey-button" @click="pageMove(4)">날짜</button>
            </div>
            <div>
                <h4 id="category-text">{{ info_text }}<b>"기가지니, 1번"</b></h4>
            </div>
            <div class="row">
                <div class="col-sm-4" id="category-col">
                    <div id="category-content-click" @click="selectPrice(1)" v-if="selectIdx===1">
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div>
                            <img id="category-pic" src="../../assets/fee-no.jpg">
                        </div>
                        <p id="category-text"><b>무료</b></p>
                    </div>
                    <div id="category-content" @click="selectPrice(1)" v-else>
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div>
                            <img id="category-pic" src="../../assets/fee-no.jpg">
                        </div>
                        <p id="category-text">무료</p>
                    </div>
                </div> 
                <div class="col-sm-4" id="category-col">
                    <div id="category-content-click" @click="selectPrice(2)" v-if="selectIdx===2">
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div>
                            <img id="category-pic" src="../../assets/fee-yes.jpg">
                        </div>
                        <p id="category-text"><b>유료</b></p>
                    </div>
                    <div id="category-content" @click="selectPrice(2)" v-else>
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div>
                            <img id="category-pic" src="../../assets/fee-yes.jpg">
                        </div>
                        <p id="category-text">유료</p>
                    </div>
                </div> 
                <div class="col-sm-4" id="category-col">
                    <div id="category-content-click" @click="selectPrice(3)" v-if="selectIdx===3">
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div>
                            <img id="category-pic" src="../../assets/fee-matter.jpg">
                        </div>
                        <p id="category-text"><b>상관없음</b></p>
                    </div>
                    <div id="category-content" @click="selectPrice(3)" v-else>
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div>
                            <img id="category-pic" src="../../assets/fee-matter.jpg">
                        </div>
                        <p id="category-text">상관없음</p>
                    </div>
                </div> 
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            options : {},
            info_text : '원하는 요금의 번호를 말씀해 보세요.',
            selectIdx : 0
        }
    },
    created() {
        this.init();
        this.getUserVoice();
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
                } else {
                    self.voiceSelectMode();
                    console.log('[DetailPrice] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        voiceSelectMode() {
            // 음성종료, 리모컨 나가기 키 클릭
            var self = this;
            gigagenie.voice.onRequestClose=function(){
                var options={};
                gigagenie.voice.svcFinished(options,function(result_cd,result_msg,extra){
                    self.stopTTS();
                });
            };

            this.options={};
            this.options.flag=1; //  ContainerApp 에서 음성선택번호 및 확인/취소 수신
            gigagenie.voice.setKwsVoiceRecv (this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    self.getUserSelectedNum(extra);
                };
            });

            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        self.$router.replace({path: '/detail/Date'});
                        console.log('[DetailPrice] 이전 페이지');
                        break;
                    case 'nextPage':
                        if (self.selectIdx === 0) {
                            self.sendTTS("요금을 먼저 선택해주세요");
                        } 
                        console.log('[DetailPrice] 다음 페이지');
                        break;
                    default:
                        break;
                }
            };
            
            // 리모콘 key event 제어
            window.onkeydown = function(event) {
                switch(event.keyCode) {
                    case 49: // 1 
                        self.selectPrice(1);
                        break;
                    case 50:
                        self.selectPrice(2);   
                        break;
                    case 51:
                        self.selectPrice(3);
                        break;
                }
            }

            gigagenie.voice.onActionEvent=function(extra) {
                if (extra.actioncode === 'MainMenu') {
                    self.sendTTS("홈화면으로 이동합니다");
                    self.$router.replace({path: '/'});
                } 
            }
        },
        sendTTS(msg) {
            this.options = {};
            this.options.ttstext = msg;
            var self = this;
            gigagenie.voice.sendTTS(this.options, function(result_cd, result_msg, extra) {
                if(result_cd===200){

                } else {
                    console.log("[DetailPrice]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[DetailPrice]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[DetailPrice]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        stopTTS() {
            // TTS중단, 음성인식 중지 
            var options={};
            gigagenie.voice.stopTTS(options,function(result_cd, result_msg, extra) {
                if (result_cd==200) {
                    console.log("음성인식 중단 성공");
                }
                else if (result_cd==404) {
                    console.log("음성인식 실행 중이 아님");
                }
                else {
                    console.log("음성인식 중단 실패: " + result_msg);
                }
            });
        },
        getUserVoice() {
            this.options={};
            this.options.voicemsg= this.info_text;
            var self = this;
            gigagenie.voice.getVoiceText(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log("[DetailPrice]Received Text is " + extra.voicetext);
                    if (extra.voicetext == "1번" || extra.voicetext == "무료") {
                        self.selectPrice(1);
                    } else if (extra.voicetext == "2번" || extra.voicetext == "유료") {
                        self.selectPrice(2);
                    } else if (extra.voicetext == "3번" || extra.voicetext == "상관없어" || extra.voicetext == "상관없음") {
                        self.selectPrice(3);
                    } else {
                        // self.getUserVoice();
                    }
                } else {
                    console.log('[DetailPrice]getUserVoice err: ' +  result_cd + ": " + result_msg);
                }; 
            });
        },
        getUserSelectedNum(event) {
            var self = this;
            gigagenie.voice.onSelectedIndex=function(event){
                switch(event){
                    case 1:
                        self.selectPrice(1);
                        break;
                    case 2:
                        self.selectPrice(2);
                        break;
                    case 3:
                        self.selectPrice(3);
                    default:
                        break;
                };
            }
        },
        selectPrice(id) {
            if (id == 1) {
                this.selectIdx = 1;
                this.$store.commit('setPrice', 'free');
            } else if (id == 2) {
                this.selectIdx = 2;
                this.$store.commit('setPrice', 'pay');
            } else {
                this.selectIdx = 3;
                this.$store.commit('setPrice', 'nothing');
            }
            this.goDetailDate();
        },
        goDetailDate() {
            var self = this;
            setTimeout(function() {self.$router.push('/detail/date')}, 1000);
        }
    }
}
</script>
<style lang="css">
    @import '../css/Detail.css';
</style>
