<template>
    <section>
        <div class="container" id="content">
            <div id="category-top">
                <button type="button" id="yellow-button">취향</button>
                <button type="button" id="grey-button" @click="pageMove(2)">인원</button>   
                <button type="button" id="grey-button" @click="pageMove(3)">요금</button>
                <button type="button" id="grey-button" @click="pageMove(4)">날짜</button>
            </div>
            <div>
                <h4 id="category-text"> {{ info_text }} <b>"기가지니, 3번"</b></h4>
            </div>
            <div class="row">
                <div class="col-sm-3" id="category-col">       
                    <div id="category-content-click" @click="selectFavor(1)" v-if="selectIdx===1"> 
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-play.jpg">
                        </div>
                        <p id="category-text"><b>연극</b></p>
                    </div>
                    <div id="category-content" @click="selectFavor(1)" v-else> 
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-play.jpg">
                        </div>
                        <p id="category-text">연극</p>
                    </div>
                </div> 
                <div class="col-sm-3" id="category-col">
                    <div id="category-content-click" @click="selectFavor(2)" v-if="selectIdx==2">
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-art.jpg">
                        </div>
                        <p id="category-text"><b>미술</b></p>
                    </div>
                    <div id="category-content" @click="selectFavor(2)" v-else>
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-art.jpg">
                        </div>
                        <p id="category-text">미술</p>
                    </div>
                </div> 
                <div class="col-sm-3" id="category-col">
                    <div id="category-content-click" @click="selectFavor(3)" v-if="selectIdx==3">
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-music.jpg">
                        </div>
                        <p id="category-text"><b>음악</b></p>
                    </div>
                    <div id="category-content" @click="selectFavor(3)" v-else>
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-music.jpg">
                        </div>
                        <p id="category-text">음악</p>
                    </div>
                </div> 
                <div class="col-sm-3" id="category-col">
                    <div id="category-content-click" @click="selectFavor(4)" v-if="selectIdx==4">
                        <img id="num-circle" src="../../assets/numCircle4.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-dance.jpg">
                        </div>
                        <p id="category-text"><b>무용</b></p>
                    </div>
                    <div id="category-content" @click="selectFavor(4)" v-else>
                        <img id="num-circle" src="../../assets/numCircle4.png">
                        <div>
                            <img id="category-pic" src="../../assets/favor-dance.jpg">
                        </div>
                        <p id="category-text">무용</p>
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
            info_text : '원하는 장르의 번호를 말씀해 보세요.',
            selectIdx : 0
        }
    }, 
    created() {
        this.init();
        // this.sendTTS();
        this.getUserVoice();
        this.setVoiceFlag();
        this.getVoiceCommand();
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
                    console.log('[DetailFavor] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
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
                    console.log("[DetailFavor]음성인식 중단 성공");
                }
                else if (result_cd==404) {
                    console.log("[DetailFavor]음성인식 실행 중이 아님");
                }
                else {
                    console.log("[DetailFavor]음성인식 중단 실패: " + result_msg);
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
                    console.log("[DetailFavor]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[DetailFavor]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[DetailFavor]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        getVoiceCommand() {
            var self = this;
            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        self.$router.replace({path: '/mainCategory'});
                        console.log('[DetailFavor] 이전 페이지');
                        break;
                    case 'nextPage':
                        if (self.selectIdx === 0) {
                            self.sendTTS("취향을 먼저 선택해주세요");
                        } 
                        console.log('[DetailFavor] 다음 페이지');
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
                    console.log("[DetailFavor]Received Text is " + extra.voicetext);
                    if (extra.voicetext == "1번" || extra.voicetext == "연극") {
                        self.selectFavor(1);
                    } else if (extra.voicetext == "2번" || extra.voicetext == "미술") {
                        self.selectFavor(2);
                    } else if (extra.voicetext == "3번" || extra.voicetext == "음악") {
                        self.selectFavor(3);
                    } else if (extra.voicetext == "4번" || extra.voicetext == "무용") {
                        self.selectFavor(4)
                    } else {
                        //self.getUserVoice();
                    }
                } else {
                    console.log('[DetailFavor]getUserVoice err: ' +  result_cd + ": " + result_msg);
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
                        console.log('userSelect 1');
                        self.selectFavor(1);
                        break;
                    case 2:
                        console.log('userSelect 2');
                        self.selectFavor(2);
                        break;
                    case 3:
                        console.log('userSelect 3');
                        self.selectFavor(3);
                    case 4:
                        console.log('userSelect 4');
                        self.selectFavor(4);
                        break;
                    default:
                        break;
                };
            }
        },
        selectFavor(id) {
            if (id == 1) {
                this.selectIdx = 1;
                this.$store.commit('setFavor', 'play');
            } else if (id == 2) {
                this.selectIdx = 2;
                this.$store.commit('setFavor', 'art');
            } else if (id == 3) {
                this.selectIdx = 3;
                this.$store.commit('setFavor', 'music');
            } else {
                this.selectIdx = 4;
                this.$store.commit('setFavor', 'dance'); 
            }
            this.goDetailGroup();
        },
        goDetailGroup() {
            var self = this;
            setTimeout(function() {self.$router.push('/detail/group')}, 1000);
            // this.$router.push({path: '/detail/group'});
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
<style src="../css/Detail.css"  scoped>

</style>

