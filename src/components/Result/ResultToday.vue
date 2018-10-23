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
                    <button id="btn-bookmark-active" v-if="bookmarkState == -1" @click="checkBookMarkState()"><img src="../../assets/star.png" > 북마크</button>
                    <button id="btn-bookmark" v-else @click="checkBookMarkState()"><img src="../../assets/star.png" > 북마크</button>
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
              <p id="no-result-text-top">죄송합니다. 오늘 해당하는 전시가 없습니다.</p>
              <p id="no-result-text-bottom">다른 카테고리를 선택해보세요.</p>
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
            show_seqNum: "",
            show_title: "",
            show_place: "",
            show_place_detail: "",
            show_date: "",
            show_price: "",
            show_phone_number: "",
            show_contents: "",
            show_thumbnail: "",
            dt_today: new Date(),
            bookmarkState: '', // -1안함, 1함
            bookmarkListJson: '',
            msg : ''
        }
    },
    created() {
        this.init();
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
                    self.getRecommandData();
                    self.voiceSelectMode()
                } else {
                    console.log('[ResultToday] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        voiceSelectMode() {
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

            // this.options.mode = 2;
            // this.options.timeout = 30;
            // gigagenie.voice.getVoiceText(this.options,function(result_cd,result_msg,extra){
            //     if(result_cd===200){
            //         console.log("[ResultToday] Received Text is "+extra.voicetext);
            //     } else if (result_cd === 500) { //  timeout난 경우
            //         console.log("[ResultToday] timeout");
            //     }
            // });

            gigagenie.voice.onActionEvent=function(extra){
                console.log('[ResultToday]발화 문장: ' + extra.uword + " " + extra.actioncode);
                switch(extra.actioncode){   
                    case 'AddBookmark':
                        if (self.bookmarkState == 1) {
                            self.sendTTS("북마크에 이미 추가되었습니다.");
                        } else {
                            self.sendTTS("북마크에 저장했습니다.");
                            self.checkBookMarkState();
                        }
                        break;
                    case 'DeleteBookmark':
                        if (self.bookmarkState == 1) {
                            self.sendTTS("북마크에 저장했습니다.");
                            self.checkBookMarkState();
                        } else {
                            self.sendTTS("북마크에 존재하지않는 정보입니다.");
                        }
                        break;
                    default:
                        break;
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
            var self = this;
            this.options = {};
            this.options.ttstext = msg;

            gigagenie.voice.sendTTS(this.options, function(result_cd, result_msg, extra) {
                if(result_cd===200){

                } else {
                    //extra.reason 에 voice 오류 전달.
                    console.log("[ResultToday]gigagenie.voice.sendTTS - result_cd:" + result_cd + " " + result_msg);
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
                //url: `${this.$store.getters.getBaseURI}/period?ServiceKey=${this.$store.getters.getServiceKey}&cPage=1&rows=50&from=20181024&to=20181024&sortStdr=1`,
                type: "GET",
                dataType: "xml",
                async: false,
                success: res => {
                    var self = this;
                    var seqArray = new Array();
                    $(res).find("msgBody").find("perforList").each(function(index){
                        if ($(this).find("area").text() == userAddress) {
                            self.show_seqNum = $(this).find("seq").text();
                            console.log('[ResultToday]show_seqNum:', self.show_seqNum);
                            self.getDetailData(self.show_seqNum);
                            self.infoMatched = 1;
                            return false; // 하나 찾고 loop 중지
                        } else {
                            self.infoMatched = 0;
                            //console.log('[ResultToday] false: ', $(this).find("area").text());
                        }
                    }); 
                },
                error: err => console.log('[ResultToday]getRecommandData err', err)
            });
            this.getBookMarkState();
        },
        getDetailData(seq) {
            var self = this;
            $.ajax({
                url: `${this.$store.getters.getBaseURI}/d/?ServiceKey=${this.$store.getters.getServiceKey}&seq=${seq}`,
                type: "GET",
                dataType: "xml",
                async: false,
                success: res => {
                    this.show_title = $(res).find("title").text();
                    this.show_thumbnail = $(res).find("imgUrl").text();
                    if ($(res).find("placeAddr").text() > 0) {
                        this.show_place = $(res).find("placeAddr").text();
                    } else {
                        this.show_place = $(res).find("place").text();
                    }
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
        },
        getBookMarkState() { // 사용자가 이미 북마크한 정보인지 알아본다.
            var self = this;
            this.options = {};
            this.options.namespace = 'bookmark';
            this.options.key='info';
                            
            gigagenie.appdata.getKeyData(this.options,function(result_cd,result_msg,extra){
                switch(result_cd) {
                    case 200:
                        self.bookmarkListJson = JSON.parse(extra.data);
                        $.each(self.bookmarkListJson, function (index, data) {
                            //console.log('bookmarkList key ', index)
                            if (data.seq === self.show_seqNum) {
                                self.bookmarkState = 1;
                            } else {
                                self.bookmarkState = -1;
                            }
                        })
                        console.log("[ResultToday]getKeyData success, " + self.options.key + " --> " + extra.data);
                        break;
                    case 403:
                        self.bookmarkState = -1;
                        console.log("[ResultToday]bookmark namespace가 존재하지않음");
                        break;
                    case 404:
                        self.bookmarkState = -1;
                        console.log("[ResultToday]seq키가 존재하지않음");
                        break;
                    case 500:
                        self.bookmarkState = -1;
                        console.log("[ResultToday]system error");
                        break;
                    default:
                        self.bookmarkState = -1;
                        console.log('[ResultToday]code: '+ result_cd+ ", msg: "+result_msg);
                        break;
                }
                if (self.infoMatched === 1) {
                    self.msg = self.info_text + " " + self.show_title + " 는 어떠세요?";
                } else {
                    self.msg = "죄송합니다. 오늘 해당하는 전시가 없습니다.";
                }
                self.sendTTS(self.msg);
            });      
        },
        checkBookMarkState() {
            var self = this;
            this.options = {};
            this.options.namespace = 'bookmark';
            this.options.key = 'info';
            
            if (this.bookmarkState == 1) { // 북마크가 이미 된 경우 -> 클릭하면 북마크 해제
                // 북마크 취소할 데이터를 빼고 다시 json 데이터를 만듬
                console.log('delete bf) bookmarkListJson: ' + this.bookmarkListJson );
                $.each(this.bookmarkListJson, function (index, data) {
                    // console.log('index: ' + index + ", data: " + data.seq + ", seq: " + self.show_seqNum);
                    if (data.seq === self.show_seqNum) {
                        self.bookmarkListJson.splice(index, 1);
                    } 
                });
                console.log('delete af) bookmarkListJson: ' + this.bookmarkListJson );

                // 전체 북마크 데이터 삭제
                this.options={};
                this.options.namespace='bookmark';
                this.options.key='info';
                gigagenie.appdata.delKeyData(this.options,function(result_cd,result_msg,extra){
                    if(result_cd===200){
                        console.log("[ResultToday] Bookmark delete success");
                        // 정제한 JSON데이터로 다시 북마크 저장
                        self.options.data = JSON.stringify(self.bookmarkListJson);
                        self.setBookmarkData(self.options);
                    } else {
                        console.log("[ResultToday] Bookmark delete Error "+ result_cd + " : " + result_msg);
                    }
                });
            } else { // 북마크 안되어 있음 -> 클릭하면 북마크 하기!
                // 북마크에 추가할 내용
                var newData = 
                    {   seq:this.show_seqNum, 
                        title:this.show_title, 
                        thumbnail:this.show_thumbnail, 
                        date:this.show_date, 
                        place:this.show_place, 
                        price:this.show_price, 
                        phone:this.show_phone_number
                    };
                this.bookmarkListJson.push(newData);
                this.options.data = JSON.stringify(this.bookmarkListJson);
                this.setBookmarkData(this.options);
            }
        },
        setBookmarkData(options) {
            var self = this;
            gigagenie.appdata.setKeyData(options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    self.bookmarkState *= -1;
                    console.log('[ResultToday]북마크 성공! state: ' + self.bookmarkState);
                } else {
                    console.log("[ResultToday]북마크 실패");
                }
            });
        },
        makeNamespace() {
            // 사용자 namespace 설정
            this.options = {};
            this.options.namespace = 'bookmark';
            this.options.shareflag = 'N';
            gigagenie.appdata.createNameSpace(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log("[ResultToday]Namespace Bookmark creation is success.");
                } else if (result_cd===409){
                    console.log("[ResultToday]Namespace Bookmark creation already exist.");
                } else {
                    console.log("[ResultToday]Namespace Bookmark creation is fail.");
                }
            });
        }
    }
}
</script>
<style lang="css">
    @import '../css/Result.css';
</style>
