<template>
    <section>
        <main-top></main-top>
        <div id="div-result">
            <div id="result-text">추천결과</div>

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
              <p id="no-result-text-top">죄송합니다. 선택하신 카테고리에 해당하는 정보가 없습니다.</p>
              <p id="no-result-text-bottom">다른 카테고리로 선택해보세요.</p>
            </div>
        </div>            
        <main-footer></main-footer>
    </section>
</template>

<script src="http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm?ServiceKey=UGkEey6oF8QfXBYMCV0pOgq%2FLzkfJB%2F9egyhbQZJp2m%2FlTgF2reGeMUGpbN%2F5llXBapUuXZKMPy3DSBK6WNA9w%3D%3D" 
        type="text/javascript"></script>
<script>
import MainTop from "../Main/MainTop.vue";
import MainFooter from "../Main/MainFooter.vue";

export default {
  data() {
    return {
      show_title: "",
      show_place: "",
      show_place_detail: "",
      show_date: "",
      show_price: "",
      show_phone_number: "",
      show_contents: "",
      show_thumbnail: "",
      userGroup: "",
      userFavor: "",
      userPrice: "",
      userDate: "",
      userAddress: "",
      dt_start: new Date(),
      dt_end: new Date(),
      categoryCode: "",
      showSeqNum: "",
      options : {},
      dateMatched : 1, 
      priceMatched : 0, // true : 1, false : 0
      infoMatched : 1, // 해당 정보가 아예 없는 경우 : 0
      retry : 0, // 탐색 한번만 할 수 있게 함,
      bookmarkState: '', // -1안함, 1함
      bookmarkListJson: ''
    };
  },
  created() {
    this.init();
    this.getRecommandData();
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
          } else {
              console.log('gigagenie init error: '+ result_cd+ ", " + result_msg);
          }
      });

      var thumbnail_img = document.getElementById('thumbnail');
      if(thumbnail_img && thumbnail_img.style) {
          thumbnail_img.style.height = '390px';
          thumbnail_img.style.width = '310px';
      }
    },
    voiceSelectMode() {
      var self = this;
        gigagenie.voice.onVoiceCommand=function(event){
          switch(event){
            case 'prevPage':
              self.$router.replace({path: '/detail/date'});
              console.log('[ResultMain] 이전 페이지');
              break;
            case 'nextPage':
              self.sendTTS('다음 페이지가 없습니다.');
              console.log('[ResultMain] 다음 페이지');
              break;
            default:
              break;
          }
      };
      gigagenie.voice.onRequestClose=function(){
        var options={};
        gigagenie.voice.svcFinished(options,function(result_cd,result_msg,extra){
            self.stopTTS();
        });
      };

      gigagenie.voice.onActionEvent=function(extra){
          console.log('[ResultMain]발화 문장: ' + extra.uword + " " + extra.actioncode);
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
              case 'MainMenu':
                self.sendTTS("홈화면으로 이동합니다");
                self.$router.replace({path: '/mainCategory'});
              default:
                  break;
          }
      }
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
    // 선택한 데이터에 따른 추천 로직
    getRecommandData() {
      this.userGroup = this.$store.getters.getGroup;
      this.userFavor = this.$store.getters.getFavor;
      this.userPrice = this.$store.getters.getPrice;
      this.userDate = this.$store.getters.getDate;
      this.userAddress = this.$store.getters.getAddress;
      console.log(this.userGroup + ", " + this.userFavor + ", " + this.userPrice + ", " + this.userDate + ", " + this.userAddress);

      // Favor
      if (this.userFavor === "play") {
        this.categoryCode = "A000";
      } else if (this.userFavor === "music") {
        this.categoryCode = "B000";
      } else if (this.userFavor === "dance") {
        this.categoryCode = "C000";
      } else { // art
        this.categoryCode = "D000";
      }

      // Date
      var bfday = this.dt_start.getDate();
      if (this.userDate === "tomorrow") {
        this.dt_end.setDate(bfday + 1);
      } else if (this.userDate === "week") {
        this.dt_end.setDate(bfday + 7);
      } else if (this.userDate === "month") {
        this.dt_end = new Date(this.dt_end.getFullYear(), this.dt_end.getMonth() + 1, 0);
      }

      var day = this.dt_start.getDate();
      var month = this.dt_start.getMonth() + 1;
      var year = this.dt_start.getFullYear() + "";
      if (day < 10) {
        day = "0" + day;
      }
      this.dt_start = year.concat(month, day);
      day = this.dt_end.getDate();
      month = this.dt_end.getMonth() + 1;
      year = this.dt_end.getFullYear() + "";
      if (day < 10) {
        day = "0" + day;
      }
      this.dt_end = year.concat(month, day);

      console.log("datetype: " + this.dt_start + " ~ " + this.dt_end);
      this.getShowSeqNum();
    },

    getShowSeqNum() {
      var self = this;
      if (this.retry == 0) { // 탐색 결과가 없는 경우 dt_end를 한달 마지막 날짜로 바꿔줌
        this.retry = 1; // 한번만 탐색하고 그만~
        this.infoMatched = 0;
        this.dateMatched = 0;
        this.dt_end = new Date(); // 오늘로 초기화
        this.dt_end = new Date(this.dt_end.getFullYear(), this.dt_end.getMonth() + 1, 0);
        var day = this.dt_end.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        var month = this.dt_end.getMonth() + 1;
        var year = this.dt_end.getFullYear() + "";
        this.dt_end = year.concat(month, day);
      } 
      $.ajax({
        url: `${this.$store.getters.getBaseURI}/realm?ServiceKey=${this.$store.getters.getServiceKey}&realmCode=${this.categoryCode}&cPage=1&rows=20&from=${this.dt_start}&to=${this.dt_end}&sido=${this.userAddress}`,
        type: "GET",
        dataType: "xml",
        async: false,
        success: res => {
          console.log('res', res);

          var seqArray = new Array(); // API 1번을 통해 가져온 seq 리스트들을 저장
          $(res).find("msgBody").find("perforList").find("seq").each(function(index) {
            seqArray.push($(this).text());
          }); 

          if (seqArray.length == 0) { // 결과가 없는 경우
            self.dateMatched = 0;
            if (this.retry == 0) {  // endDate 를 이번달 말까지 늘려서 재탐색   
              this.getShowSeqNum(); // 한번만 호출하고 그 다음에 빠져나가기! ex) 제주 - 무용을 선택했을때 결과 없어서 무한루프
            } else {
              this.makeInfoMsg();
              self.infoMatched = 0;
              console.log('이번달 말까지 탐색했을때 해당하는 정보가 없습니다.');
            }
          } else {
            self.infoMatched = 1;
            self.dateMatched = 1;
            console.log('정보 발견!');
            this.getDetailResult(seqArray);
          }
        },
        error: err => console.log("getShowSeqNum error: ", err)
      });
    },

    getDetailResult(seqArray) {
      var self = this;
      var detailList = [];
      var idx;
      for (idx in seqArray) {
        //console.log('seqArray: ' + seqArray[idx]);
        detailList.push(axios.get(`${this.$store.getters.getBaseURI}/d/?ServiceKey=${this.$store.getters.getServiceKey}&seq=${seqArray[idx]}`));
      }

      // axios를 사용해서 API 2번 10개를 동시 처리, 답 발견할 시 break를 통해 화면에 데이터 바인딩
      var resArray = [];
      axios.all(detailList).then(axios.spread((...resArray) => {
        // 받아온 리스트 중에서 무료 / 유료 따로 뽑아내기

        for (idx in resArray) {
          var detailData = '';
          detailData = resArray[idx].data;
          var priceValue = $(detailData).find("price").text();
          var area = $(detailData).find("area").text();
          
          self.showSeqNum = seqArray[idx];
          if (this.$store.getters.getPrice === "nothing") { // 금액 상관없으면 바로 row[0] 가져오고 break
            console.log('nothing seqNum: ', self.showSeqNum);
            self.priceMatched = 1;
            break;
          } else {
            if (priceValue.match(/무료/)) {
              if (this.$store.getters.getPrice === "free") {
                console.log('free seqNum: ', self.showSeqNum);
                self.priceMatched = 1;
                break;
              } 
            } else {
              if (this.$store.getters.getPrice === "pay") {
                console.log('pay seqNum: ', self.showSeqNum);
                self.priceMatched = 1;
                break;
              }
            }
          }  
        } // end of for
        
        // 화면에 데이터 뿌리기 (썸네일, 타이틀, 가격, 문의, 장소)
        console.log('[ResultMain]seqNum: ', self.showSeqNum);
        this.show_thumbnail = $(detailData).find("imgUrl").text();
        this.show_title = $(detailData).find("title").text();
        this.show_price = $(detailData).find("price").text();
        this.show_phone_number = $(detailData).find("phone").text();
        if ($(detailData).find("placeAddr").text().length > 0) {
          this.show_place = $(detailData).find("placeAddr").text();
        } else {
          this.show_place = $(detailData).find("place").text();
        }
        
        // (날짜)
        var startD = $(detailData).find("startDate").text();
        var endD = $(detailData).find("endDate").text();
        if (startD === endD) {
          endD = startD.substr(0, 4) + "." + startD.substr(4, 2) + "." + startD.substr(6.2);
        } else {
          startD = startD.substr(0, 4) + "." + startD.substr(4, 2) + "." + startD.substr(6.2);
          endD = startD + " ~ " +endD.substr(0, 4) + "." + endD.substr(4, 2) + "." + endD.substr(6.2);
        }
        this.show_date = endD;
        // (내용)
        var content = $(detailData).find("contents1").text();
        var origin_content = $(detailData).find("contents1").text();
        content = content.replace(/(<([^>]+)>)/gi, "");
        content = content.replace(/&nbsp;/gi, "");
        content = content.replace(/&bull/gi, "");
        if (content.length > 15) {
          content = content.substr(0, 450);
          this.show_contents = content;
        } else {
          origin_content = origin_content.split('alt="')[1];
          origin_content = origin_content.split('"')[0];
          origin_content = origin_content.substr(0, 450);
          this.show_contents = origin_content;
        }
        // this.sendTTS(msg);
        this.makeInfoMsg();
        this.getBookMarkState();
      })).catch((err) => {
        console.log('axios err: ', err);
      });
    },
    makeInfoMsg() {
      /*
      가격정보 O 날짜정보 O : 선택하신 정보와 딱 맞는 00을 추천해드려요
      가격정보 O 날짜정보 X : 선택하신 날짜에 해당하는 정보가 없어 가까운 날짜의 00 를 추천해드려요
      가격정보 X 날짜정보 O : 선택하신 가격대에 해당하는 정보가 없어 00 을 추천해드려요
      가격정보 X 날짜정보 X : 선택하신 가격대와 해당하는 날짜에 해당하는 정보가 없습니다. 대신 00을 추천해드려요
      */  
      console.log('[ResultMain]infoMatched: ' + this.infoMatched + ", priceMatched: " +  this.priceMatched + ", dateMatched: " + this.dateMatched);
      var msg = '';
      if (this.infoMatched == 0) { // 아예 그 장르의 문화 정보가 없는 경우
        msg = "죄송합니다. 선택하신 카테고리에 해당하는 정보가 없습니다.";
      } else {
        if (this.priceMatched == 1) {
          if (this.dateMatched == 1) {
            msg = "선택하신 정보와 딱 맞는 " + this.show_title + " 을 추천해드려요";
          } else {
            msg = "선택하신 날짜에 해당하는 정보가 없어 가까운 날짜의 " + this.show_title + " 을 추천해드려요";
          }
        } else {
          if (this.dateMatched == 1) {
            msg = "선택하신 가격대에 해당하는 정보가 없습니다. 대신 " + this.show_title + " 을 추천해드려요"
          } else {
            msg = "선택하신 가격대와 날짜에 해당하는 정보가 없습니다. 대신 " + this.show_title + " 을 추천해드려요"
          }
        }
      }
      this.sendTTS(msg);
    },
    sendTTS(msg) {
      this.options={};
      this.options.ttstext = msg;
      gigagenie.voice.sendTTS(this.options,function(result_cd,result_msg,extra){
          if(result_cd===200){
              //do next action
          }
      });
    },
    setBookmark() {
      this.options={};
      this.options.namespace="bookmark";
      this.options.shareflag='N';
      gigagenie.appdata.createNameSpace(this.options,function(result_cd,result_msg,extra){
        if(result_cd===200){
            test();
            console.log("Namespace creation is success.");
        } else if (result_cd ===409) {
          console.log("이미 존재하는 namespace");
        } else {
            console.log("Namespace creation is fail.");
        }
      });
    }, 
    deleteTestBookmark() {
      this.options={};
      this.options.namespace='bookmark';
      this.options.key='info';
      gigagenie.appdata.delKeyData(this.options,function(result_cd,result_msg,extra){
          if(result_cd===200){
              console.log("[ResultMain] Bookmark delete success");
          } else {
              console.log("[ResultMain] Bookmark delete Error "+ result_cd + " : " + result_msg);
          }
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
          if (data.seq === self.showSeqNum) {
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
              console.log("[ResultMain] Bookmark delete success");
              // 정제한 JSON데이터로 다시 북마크 저장
              self.options.data = JSON.stringify(self.bookmarkListJson);
              self.setBookmarkData(self.options);
          } else {
              console.log("[ResultMain] Bookmark delete Error "+ result_cd + " : " + result_msg);
          }
        });
      } else { // 북마크 안되어 있음 -> 클릭하면 북마크 하기!
        // 북마크에 추가할 내용
        var newData = [];
        newData = 
          {   seq:this.showSeqNum, 
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
            console.log('[ResultMain]북마크 성공! state: ' + self.bookmarkState);
            var msg = '';
            if (self.bookmarkState == 1) {
              msg = "북마크에 저장했습니다.";
            } else {
              msg = "북마크에서 해제했습니다.";
            }
            self.sendTTS(msg);
        } else {
            console.log("[ResultMain]북마크 실패" + result_cd + " " + result_msg);
        }
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
                if (data.seq === self.showSeqNum) {
                    console.log('[ResultMain] 북마크에 있음!!');
                    self.bookmarkState = 1;
                } else {
                    console.log('[ResultMain] 북마크에 없음');
                    self.bookmarkState = -1;
                }
            })
            console.log("[ResultMain]getKeyData success, " + self.options.key + " --> " + extra.data);
            break;
          case 403:
            self.bookmarkState = -1;
            console.log("[ResultMain]bookmark namespace가 존재하지않음");
            break;
          case 404:
            self.bookmarkState = -1;
            console.log("[ResultMain]seq키가 존재하지않음");
            break;
          case 500:
            self.bookmarkState = -1;
            console.log("[ResultMain]system error");
            break;
          default:
            self.bookmarkState = -1;
            console.log('[ResultMain]code: '+ result_cd+ ", msg: "+result_msg);
            break;
        }
      });     
    }
  }
};
</script>

<style lang="css">
@import "../css/Result.css";
</style>

