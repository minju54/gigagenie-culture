<template>
    <section>
        <main-top></main-top>
        <div id="div-result">
            <div id="yellow-box">추천결과</div>

            <div class="row">
                <div class="col-sm-4" id="div-left">
                    <h3 id="show-title"> {{ show_title }}</h3>
                    <img v-bind:src="show_thumbnail"  id="thumbnail"/>
                    <br>
                    <button id="btn-bookmark">
                        <img src="../../assets/star.png"> 북마크</button>
                </div>

                <div class="col-sm-7" id="rect-round-grey-large">
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
                        <div class="col-sm-9" id="text-content">{{ show_fee }}</div>
                    </div>
                    <div class="row" id="text-content-row">
                        <div class="col-sm-3" id="text-title"><b>문의</b></div>
                        <div class="col-sm-9" id="text-content">{{ show_phone_number }}</div>
                    </div>
                    <div class="row" id="text-content-row">
                        <div class="col-sm-3" id="text-title"><b>내용</b></div>
                        <div class="col-sm-8" id="text-content">{{ show_contents }}...</div>
                    </div>
                </div> 
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
      show_fee: "",
      show_phone_number: "",
      show_contents: "",
      show_thumbnail: "",
      userGroup: "",
      userFavor: "",
      userFee: "",
      userDate: "",
      dt_start: new Date(),
      dt_end: new Date(),
      categoryCode: "",
      showSeqNum: ""
    };
  },
  created() {
    this.getRecommandData();
  },
  components: {
    mainTop: MainTop,
    mainFooter: MainFooter
  },
  methods: {
    // 선택한 데이터에 따른 추천 로직
    getRecommandData() {
      this.userGroup = this.$store.getters.getGroup;
      this.userFavor = this.$store.getters.getFavor;
      this.userFee = this.$store.getters.getFee;
      this.userDate = this.$store.getters.getDate;
      console.log(this.userGroup + ", " + this.userFavor + this.userFee + ", " + this.userDate);

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
      $.ajax({
        url: `${this.$store.getters.getBaseURI}/realm?ServiceKey=${this.$store.getters.getServiceKey}&realmCode=${this.categoryCode}&cPage=1&rows=20&from=${this.dt_start}&to=${this.dt_end}&sido=서울`,
        type: "GET",
        dataType: "xml",
        async: false,
        success: res => {
          console.log('res', res);

          var seqArray = new Array(); // API 1번을 통해 가져온 seq 리스트들을 저장
          $(res).find("msgBody").find("perforList").find("seq").each(function(index) {
            seqArray.push($(this).text());
          }); 

          this.getDetailResult(seqArray);
        },
        error: err => console.log("getShowSeqNum error: ", err)
      });
    },

    getDetailResult(seqArray) {
      var detailList = [];
      var idx;
      for (idx in seqArray) {
        console.log('seqArray: ' + seqArray[idx]);
        detailList.push(axios.get(`${this.$store.getters.getBaseURI}/d/?ServiceKey=${this.$store.getters.getServiceKey}&seq=${seqArray[idx]}`));
      }

      // axios를 사용해서 API 2번 10개를 동시 처리, 답 발견할 시 break를 통해 화면에 데이터 바인딩
      var resArray = [];
      axios.all(detailList).then(axios.spread((...resArray) => {
        // 받아온 리스트 중에서 무료 / 유료 따로 뽑아내기
        for (idx in resArray) {
          var detailData = resArray[idx].data;
          var feeValue = $(detailData).find("price").text();
          
          if (this.$store.getters.getFee === "nothing") { // 금액 상관없으면 바로 row[0] 가져오고 break
            console.log('seqNum: ', $(detailData).find("seq").text());
            break;
          } else {
            if (feeValue.match(/무료/)) {
              if (this.$store.getters.getFee === "free") {
                console.log('seqNum: ', $(detailData).find("seq").text());
                break;
              }
            } else {
              if (this.$store.getters.getFee === "pay") {
                console.log('seqNum: ', $(detailData).find("seq").text());
                break;
              }
            }
          }  
        }
        
        // 화면에 데이터 뿌리기 (썸네일, 타이틀, 가격, 문의, 장소)
        this.show_thumbnail = $(detailData).find("imgUrl").text();
        this.show_title = $(detailData).find("title").text();
        this.show_fee = $(detailData).find("price").text();
        this.show_phone_number = $(detailData).find("phone").text();
        if ($(detailData).find("placeAddr").text().length > 0) {
          this.show_place = $(detailData).find("placeAddr").text();
        } else {
          this.show_place = $(detailData).find("place").text();
        }
        // (날짜)
        var startD = $(detailData).find("startDate").text();
        var endD = $(detailData).find("endDate").text();
        startD = startD.substr(0, 4) + "." + startD.substr(4, 2) + "." + startD.substr(6.2);
        endD = startD + " ~ " +endD.substr(0, 4) + "." + endD.substr(4, 2) + "." + endD.substr(6.2);
        this.show_date = endD;
        // (내용)
        var content = $(detailData).find("contents1").text();
        var origin_content = $(detailData).find("contents1").text();
        // console.log('bf content: ',content);
        content = content.replace(/(<([^>]+)>)/gi, "");
        if (content.length > 15) {
          content = content.substr(0, 500);
          this.show_contents = content;
        } else {
          origin_content = origin_content.split('alt="')[1];
          origin_content = origin_content.split('"')[0];
          origin_content = origin_content.substr(0, 500);
          this.show_contents = origin_content;
        }

      })).catch((err) => {
        console.log('axios err: ', err);
      });
    }
  }
};
</script>

<style lang="css">
@import "../css/ResultMain.css";
</style>

