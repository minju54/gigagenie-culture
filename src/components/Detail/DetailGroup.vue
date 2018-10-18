<template>
    <section>
        <div class="container" id="content">
            <div id="category-top">
                <button type="button" id="grey-button" @click="pageMove(1)">취향</button>
                <button type="button" id="yellow-button" @click="pageMove(2)">인원</button>
                <button type="button" id="grey-button" @click="pageMove(3)">요금</button>
                <button type="button" id="grey-button" @click="pageMove(4)">날짜</button>
            </div>
            <div>
                <h4 id="category-text"> {{ info_text }} <b>"기가지니, 3번"</b></h4>
            </div>
            <div class="row">
                <div class="col-sm-4" id="category-col">
                    <div id="category-content-click" @click="selectGroup(1)" v-if="selectIdx===1">
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div>
                            <img id="category-pic" src="../../assets/group-one.jpg">
                        </div>
                        <p id="category-text"><b>혼자</b></p>
                    </div>
                    <div id="category-content" @click="selectGroup(1)" v-else>
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div>
                            <img id="category-pic" src="../../assets/group-one.jpg">
                        </div>
                        <p id="category-text">혼자</p>
                    </div>
                </div> 
                <div class="col-sm-4" id="category-col">
                    <div id="category-content-click" @click="selectGroup(2)" v-if="selectIdx===2">
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div>
                            <img id="category-pic" src="../../assets/group-two.jpg">
                        </div>
                        <p id="category-text"><b>친구</b></p>
                    </div>
                    <div id="category-content" @click="selectGroup(2)" v-else>
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div>
                            <img id="category-pic" src="../../assets/group-two.jpg">
                        </div>
                        <p id="category-text">친구</p>
                    </div>
                </div> 
                <div class="col-sm-4" id="category-col">
                    <div id="category-content-click" @click="selectGroup(3)" v-if="selectIdx===3">
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div>
                            <img id="category-pic" src="../../assets/group-family.jpg">
                        </div>
                        <p id="category-text"><b>가족</b></p>
                    </div>
                    <div id="category-content" @click="selectGroup(3)" v-else>
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div>
                            <img id="category-pic" src="../../assets/group-family.jpg">
                        </div>
                        <p id="category-text">가족</p>
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
            info_text : '함께 가는 그룹의 번호를 말씀해 보세요.',
            selectIdx : 0
        }
    },
    created() {
        this.init();
        this.getUserVoice();
        // this.sendTTS();
        this.getVoiceCommand();
        this.setVoiceFlag();
        this.exitApp();
    },
    methods: {
        init() {
            this.options.appid = this.$store.getters.getAppId;
            this.options.keytype = this.$store.getters.getKeyType;
            this.options.apikey = this.$store.getters.getAPIKey;
            
            var self = this;
            gigagenie.init(this.options, function(result_cd, result_msg, extra) {
                if (result_cd === 200) {

                } else {
                    console.log('[DetailGroup] gigagenie init error: '+ result_cd+ ", " + result_msg);
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
                    console.log("[DetailGroup]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[DetailGroup]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[DetailGroup]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
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
        getVoiceCommand() {
            var self = this;
            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        self.$router.replace({path: '/detail/favor'});
                        console.log('[DetailGroup] 이전 페이지');
                        break;
                    case 'nextPage':
                        if (self.selectIdx === 0) {
                            self.sendTTS("그룹을 먼저 선택해주세요");
                        } 
                        console.log('[DetailGroup] 다음 페이지');
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
                    console.log("[DtailGroup]Received Text is " + extra.voicetext);
                    if (extra.voicetext == "1번" || extra.voicetext == "혼자") {
                        self.selectGroup(1);
                    } else if (extra.voicetext == "2번" || extra.voicetext == "친구") {
                        self.selectGroup(2);
                    } else if (extra.voicetext == "3번" || extra.voicetext == "가족") {
                        self.selectGroup(3);
                    } else {
                        //self.getUserVoice();
                    }
                } else {
                    console.log('[DtailGroup]getUserVoice err: ' +  result_cd + ": " + result_msg);
                }; 
            });
        },
        getUserSelectedNum(event) {
            var self = this;
            gigagenie.voice.onSelectedIndex=function(event){
                switch(event){
                    case 1:
                        self.selectGroup(1);
                        break;
                    case 2:
                        self.selectGroup(2);
                        break;
                    case 3:
                        self.selectGroup(3);
                    default:
                        break;
                };
            }
        },
        selectGroup(id) {
            if (id == 1) {
                this.selectIdx = 1;
                this.$store.commit('setGroup', 'alone');
            } else if (id == 2) {
                this.selectIdx = 2;
                this.$store.commit('setGroup', 'friend');
            } else {
                this.selectIdx = 3;
                this.$store.commit('setGroup', 'family');
            }
            this.goDetailPrice();
        },
        goDetailPrice() {
            var self = this;
            setTimeout(function() {self.$router.push('/detail/price')}, 1000);
            // this.$router.push({path: '/detail/price'});
        },
        pageMove(id) { // 기가지니할때는 없애기!!
            // switch(id) {
            //     case 1:
            //         this.$router.push({path: '/detail/favor'});
            //         break;
            //     case 2:
            //         this.$router.push({path: '/detail/group'});
            //         break;
            //     case 3:
            //         this.$router.push({path: '/detail/price'});
            //         break;
            //     case 4:
            //         this.$router.push({path: '/detail/date'});
            //         break;
            //     default:
            //         break;
            // }
        }
    }
}
</script>
<style lang="css">
    @import '../css/Detail.css';
</style>
