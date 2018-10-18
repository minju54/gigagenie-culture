<template>
    <section>
        <div class="container" id="content">
            <div id="category-top">
                <button type="button" id="grey-button" @click="pageMove(1)">취향</button>
                <button type="button" id="grey-button" @click="pageMove(2)">인원</button>   
                <button type="button" id="grey-button" @click="pageMove(3)">요금</button>
                <button type="button" id="yellow-button" @click="pageMove(4)">날짜</button>
            </div>
            <div>
                <h4 id="category-text"> {{ info_text }} <b>"기가지니, 2번"</b></h4>
            </div>
            <div class="row">
                <div class="col-sm-3" id="category-col">
                    <div id="category-content-click" @click="selectDate(1)" v-if="selectIdx===1">
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body"><h3 id="date-text">{{ date_today }}</h3></div>
                        </div>
                        <p id="category-text"><b>오늘</b></p>
                    </div>
                    <div id="category-content" @click="selectDate(1)" v-else>
                        <img id="num-circle" src="../../assets/numCircle1.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body"><h3 id="date-text">{{ date_today }}</h3></div>
                        </div>
                        <p id="category-text">오늘</p>
                    </div>
                </div> 
                <div class="col-sm-3" id="category-col">
                    <div id="category-content-click"  @click="selectDate(2)" v-if="selectIdx===2">
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body"><h3 id="date-text">{{ date_tomorrow }}</h3></div>
                        </div>
                        <p id="category-text"><b>내일</b></p>
                    </div>
                    <div id="category-content"  @click="selectDate(2)" v-else>
                        <img id="num-circle" src="../../assets/numCircle2.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body"><h3 id="date-text">{{ date_tomorrow }}</h3></div>
                        </div>
                        <p id="category-text">내일</p>
                    </div>
                </div> 
                <div class="col-sm-3" id="category-col">
                    <div id="category-content-click" @click="selectDate(3)" v-if="selectIdx===3">
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body">
                                <h3 id="text-date-top"><b>{{ date_today }}</b></h3>
                                <h3 id="text-date-bottom"> <b>~ {{ date_week }}</b></h3>
                            </div>
                        </div>
                        <p id="category-text">일주일</p>
                    </div>
                    <div id="category-content" @click="selectDate(3)" v-else>
                        <img id="num-circle" src="../../assets/numCircle3.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body">
                                <h3 id="text-date-top">{{ date_today }}</h3>
                                <h3 id="text-date-bottom"> ~ {{ date_week }}</h3>
                            </div>
                        </div>
                        <p id="category-text">일주일</p>
                    </div>
                </div> 
                <div class="col-sm-3" id="category-col">
                    <div id="category-content-click" @click="selectDate(4)" v-if="selectIdx===4">
                        <img id="num-circle" src="../../assets/numCircle4.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body">
                                <h3 id="text-date-top"><b>{{ date_today }}</b></h3>
                                <h3 id="text-date-bottom"><b>~ {{ date_month }}</b></h3>
                            </div>
                        </div>
                        <p id="category-text">이번 달</p>
                    </div>
                    <div id="category-content" @click="selectDate(4)" v-else>
                        <img id="num-circle" src="../../assets/numCircle4.png">
                        <div id="calendar-top"></div>
                        <div>
                            <div id="calendar-body">
                                <h3 id="text-date-top">{{ date_today }}</h3>
                                <h3 id="text-date-bottom">~ {{ date_month }}</h3>
                            </div>
                        </div>
                        <p id="category-text">이번 달</p>
                    </div>
                </div> 
            </div>
            <!-- <h3 @click="goResultPage()">결과보기</h3> -->
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            options : {},
            info_text : '원하는 관람 날짜의 번호를 말씀해 보세요.',
            date_today : '',
            date_tomorrow : '',
            date_week : '',
            date_month : '',
            selectIdx : 0
        }
    }, 
    created() {
        this.init();
        this.setCategoryDate(); // 화면에 날짜 목록 바인딩
        // this.sendTTS();
        this.getVoiceCommand();
        this.getUserVoice();
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
                    console.log('[DetailDate] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        sendTTS(msg) {
            this.options = {};
            this.options.ttstext = this.info_text;
            var self = this;
            gigagenie.voice.sendTTS(this.options, function(result_cd, result_msg, extra) {
                if(result_cd===200){

                } else {
                    console.log("[DetailDate]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[DetailDate]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[DetailDate]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        getVoiceCommand() {
            var self = this;
            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        self.$router.replace({path: '/detail/price'});
                        console.log('[DetailDate] 이전 페이지');
                        break;
                    case 'nextPage':
                        if (self.selectIdx === 0) {
                            self.sendTTS("일정을 먼저 선택해주세요");
                        } 
                        console.log('[DetailDate] 다음 페이지');
                        break;
                    default:
                        break;
                }
            };
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
        setCategoryDate() {
            var dt_day = new Date();
            var today = dt_day.getDate();
            var today_month = dt_day.getMonth() + 1;

            var dt_tomorrow = new Date();
            dt_tomorrow.setDate(dt_tomorrow.getDate() + 1);
            var tomorrow = dt_tomorrow.getDate();
            var tomorrow_month = dt_tomorrow.getMonth() + 1;
            
            var dt_week = new Date();
            dt_week.setDate(dt_week.getDate() + 7);
            var week_day = dt_week.getDate();
            var weeK_month = dt_week.getMonth() + 1;

            var dt_month = new Date(dt_day.getFullYear(), dt_day.getMonth() + 1, 0);
            var month_day = dt_month.getDate();
            
            if (today < 10) {
                today = "0" + today;
            } 
            if (tomorrow < 10) {
                tomorrow = "0" + tomorrow;
            } 
            if (week_day < 10) {
                week_day = "0" + week_day;
            } 

            today_month = today_month + "";
            tomorrow_month = tomorrow_month + "";
            weeK_month = weeK_month + "";

            this.date_today = today_month.concat(".", today);
            this.date_tomorrow = tomorrow_month.concat(".", tomorrow);
            this.date_week = weeK_month.concat(".", week_day);
            this.date_month = today_month.concat(".", month_day);
        },
        
        getUserVoice() {
            this.options={};
            this.options.voicemsg= this.info_text;
            var self = this;
            gigagenie.voice.getVoiceText(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log("[DetailDate]Received Text is " + extra.voicetext);
                    if (extra.voicetext == "1번" || extra.voicetext == "오늘") {
                        self.selectDate(1);
                    } else if (extra.voicetext == "2번" || extra.voicetext == "내일") {
                        self.selectDate(2);
                    } else if (extra.voicetext == "3번" || extra.voicetext == "일주일") {
                        self.selectDate(3);
                    } else if (extra.voicetext == "4번" || extra.voicetext == "이번달") {
                        self.selectDate(4);
                    } else {
                        // self.getUserVoice();
                    }
                } else {
                    console.log('[DetailDate]getUserVoice err: ' +  result_cd + ": " + result_msg);
                }; 
            });
        },
        getUserSelectedNum(event) {
            var self = this;
            gigagenie.voice.onSelectedIndex=function(event){
                switch(event){
                    case 1:
                        self.selectDate(1);
                        break;
                    case 2:
                        self.selectDate(2);
                        break;
                    case 3:
                        self.selectDate(3);
                    case 4:
                        self.selectDate(4);
                        break;
                    default:
                        break;
                };
            }
        },
        selectDate(id) {
            if (id == 1) {
                this.selectIdx = 1;
                this.$store.commit('setDate', 'today');
            } else if (id == 2) {
                this.selectIdx = 2;
                this.$store.commit('setDate', 'tomorrow');
            } else if (id == 3) {
                this.selectIdx = 3;
                this.$store.commit('setDate', 'week');
            } else {
                this.selectIdx = 4;
                this.$store.commit('setDate', 'month');
            }
            this.goResultPage();
        },
        goResultPage() {
            var self = this;
            setTimeout(function() {self.$router.push('/resultMain')}, 1000);
            //this.$router.push({path: '/resultMain'})
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
<style lang='css'>
    @import '../css/Detail.css';
</style>
