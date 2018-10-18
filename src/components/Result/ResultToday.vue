<template>
    <section>
        <main-top></main-top>
        <div id="div-result">
            <div id="result-text">추천문화</div>
            <div class="row" id="result-body" v-if="infoMatched == 1">
                <div class="col-sm-4" id="div-left">
                    <h3 id="show-title"> {{ show_title }}</h3>
                    <img v-bind:src="show_thumbnail"  id="thumbnail"/>
                    <br>
                    <button id="btn-bookmark">
                        <img src="../../assets/star.png" @click="setBookmark()"> 북마크</button>
                </div>
                <div class="col-sm-8" id="rect-round-grey-large">
                  <br>
                  <div class="row" id="text-detail"><b>상세정보</b></div>
                  <div class="row" id="text-content-row">
                      <div class="col-sm-3" id="text-title"><b>장소</b></div>
                      <div class="col-sm-9" id="text-content">{{ show_place }}</div>
                  </div>
                  <div class="row" id="text-content-row">
                      <div class="col-sm-3" id="text-title"><b>일정</b></div>
                      <div class="col-sm-9" id="text-content">{{ show_date }}</div>
                  </div>
                  <div class="row" id="text-content-row">
                      <div class="col-sm-3" id="text-title"><b>요금</b></div>
                      <div class="col-sm-9" id="text-content">{{ show_price }}</div>
                  </div>
                  <div class="row" id="text-content-row">
                      <div class="col-sm-3" id="text-title"><b>문의</b></div>
                      <div class="col-sm-9" id="text-content">{{ show_phone_number }}</div>
                  </div>
                  <br/>
                  <div class="row" id="text-detail"><b>상세내용</b></div>
                  <div class="row" id="text-content-row">
                      <div id="text-content-show">{{ show_contents }}...</div>
                  </div>
                  <br>
                </div> 
            </div>
            <div v-else id="result-body">
              <img src="../../assets/not-found.png" id="not-found">
              <p id="no-result-text-top">죄송합니다. 선택하신 카테고리에 해당하는 정보가 없습니다.</p>
              <p id="no-result-text-bottom">다른 카테고리로 선택해보세요.</p>
            </div>
        </div>
        <main-footer></main-footer>
    </section>
</template>
<script>
import MainTop from '../Main/MainTop.vue';
import MainFooter from '../Main/MainFooter.vue';

export default {
    data() {
        return {
            options: {},
            info_text: "오늘의 추천 문화입니다.",
            infoMatched : 1,
            show_title: "",
            show_place: "",
            show_place_detail: "",
            show_date: "",
            show_price: "",
            show_phone_number: "",
            show_contents: "",
            show_thumbnail: "",
            dt_today: new Date()
        }
    },
    created() {
        this.init();
        this.sendTTS();
        this.getRecommandData();
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
                    self.sendTTS(self.info_text);
                } else {
                    console.log('[ResultToday] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        getVoiceCommand() {
            var self = this;
            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        self.$router.replace({path: '/mainCategory'});
                        console.log('[ResultToday] 이전 페이지');
                        break;
                    case 'nextPage':
                        self.sendTTS("다음 페이지가 없습니다.");
                        console.log('[ResultToday] 다음 페이지');
                        break;
                    default:
                        break;
                }
            };
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
                    console.log("[ResultToday]음성인식 중단 성공");
                }
                else if (result_cd==404) {
                    console.log("[ResultToday]음성인식 실행 중이 아님");
                }
                else {
                    console.log("[ResultToday]음성인식 중단 실패: " + result_msg);
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
                    console.log("[ResultToday]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[ResultToday]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[ResultToday]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        getRecommandData() {
            var day = this.dt_today.getDate();
            var month = this.dt_today.getMonth() + 1;
            var year = this.dt_today.getFullYear() + "";
            if (day < 10) {
                day = "0" + day;
            }
            this.dt_today = year.concat(month, day);
            var userAddress = this.$store.getters.getAddress;
            if (userAddress == "" ) {
                userAddress = '서울';
            }
            console.log('[ResultToday]userAddress: ' + userAddress);
            // 오늘 하는 문화 정보 찾기
            $.ajax({
                url: `${this.$store.getters.getBaseURI}/period?ServiceKey=${this.$store.getters.getServiceKey}&cPage=1&rows=50&from=${this.dt_today}&to=${this.dt_today}&sortStdr=3`,
                type: "GET",
                dataType: "xml",
                async: false,
                success: res => {
                    var self = this;
                    var seqArray = new Array();
                    $(res).find("msgBody").find("perforList").each(function(index){
                        var seqNum = $(this).find("seq").text();
                        console.log('[ResultToday]seqNum: ', seqNum);
                        if ($(this).find("area").text() == userAddress) {
                            self.getDetailData(seqNum);
                            return false; // 하나 찾고 loop 중지
                        } 
                    }); 
                },
                error: err => console.log('[ResultToday]getRecommandData err', err)
            });
        },
        getDetailData(seqNum) {
            $.ajax({
                url: `${this.$store.getters.getBaseURI}/d/?ServiceKey=${this.$store.getters.getServiceKey}&seq=${seqNum}`,
                type: "GET",
                dataType: "xml",
                async: false,
                success: res => {
                    // var detailData = $(res).find("msgBody").find("perforInfo");
                    this.show_title = $(res).find("title").text();
                    this.show_thumbnail = $(res).find("imgUrl").text();
                    this.show_place = $(res).find("placeAddr").text();
                    this.show_price = $(res).find("price").text();
                    this.show_phone_number = $(res).find("phone").text();
                    // (날짜)
                    var startD = $(res).find("startDate").text();
                    var endD = $(res).find("endDate").text();
                    if (startD === endD) {
                    endD = startD.substr(0, 4) + "." + startD.substr(4, 2) + "." + startD.substr(6.2);
                    } else {
                    startD = startD.substr(0, 4) + "." + startD.substr(4, 2) + "." + startD.substr(6.2);
                    endD = startD + " ~ " +endD.substr(0, 4) + "." + endD.substr(4, 2) + "." + endD.substr(6.2);
                    }
                    this.show_date = endD;
                    // (내용)
                    var content = $(res).find("contents1").text();
                    var origin_content = $(res).find("contents1").text();
                    content = content.replace(/(<([^>]+)>)/gi, "");
                    content = content.replace(/&nbsp;/gi, "");
                    content = content.replace(/&bull/gi, "");
                    if (content.length > 15) {
                    content = content.substr(0, 500);
                    this.show_contents = content;
                    } else {
                    origin_content = origin_content.split('alt="')[1];
                    origin_content = origin_content.split('"')[0];
                    origin_content = origin_content.substr(0, 500);
                    this.show_contents = origin_content;
                    }
                },
                error: err => console.log('[ResultToday]getRecommandData err', err)
            });
        }
    }
}
</script>
<style lang="css">
    @import '../css/Result.css';
</style>
