<template>
    <div>
        <div class="row" id="content-row">
            <div class="col-sm-3" id="item-col" v-for="(p, idx) in paginatedData" :key="p.seq">
                <img id="idx-circle" v-if="idx === 0" src="../../assets/numCircle1.png">
                <img id="idx-circle" v-else-if="idx === 1" src="../../assets/numCircle2.png">
                <img id="idx-circle" v-else src="../../assets/numCircle3.png">
                <!-- <button id="delete-button"><img src="../../assets/dlt-btn.png" id="delete-img" @click="deleteBookmark(idx)"></button> -->
                <div id="bookmark-item" >
                    <p id="show-title"><b>{{p.title}}</b></p>  
                    <img id="thumbnail" v-bind:src="p.thumbnail">
                    <div class="row">
                        <div class="col-sm-3" id="t-text"><b>날짜</b></div>
                        <div class="col-sm-9" id="c-text">{{p.date}}</div>
                    </div>
                    <div class="row">
                        <div class="col-sm-3" id="t-text"><b>장소</b></div>
                        <div class="col-sm-9" id="c-text">{{p.place}}</div>
                    </div>
                    <div class="row">
                        <div class="col-sm-3" id="t-text"><b>가격</b></div>
                        <div class="col-sm-9" id="c-text">{{p.price}}</div>
                    </div>
                    <div class="row">
                        <div class="col-sm-3" id="t-text"><b>문의</b></div>
                        <div class="col-sm-9" id="c-text">{{p.phone}}</div>
                    </div>
                </div>

                <button id="delete-button"><img src="../../assets/dlt-btn.png" id="delete-img" @click="deleteBookmark(idx)"></button>
            </div>
            
        </div>
        <div id="btn-cover">
            <button :disabled="pageNum === 0" @click="prevPage" id="prev-button">
                <img src="../../assets/left-arrow.png" id="arrow-img">
            </button>
            <span id="page-count">{{ pageNum + 1 }} / {{ pageCount }} 목록</span>
            <button :disabled="pageNum >= pageCount - 1" @click="nextPage" id="next-button">
            <img src="../../assets/right-arrow.png" id="arrow-img">
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            pageNum: 0,
            options : {}
        }
    },
    props: {
        listArray: {
            type: Array,
            required: true
        },
        pageSize: {
            type: Number,
            required: false,
            default: 3
        }
    },
    updated() {
        this.init();
        // var thumbnail_img = document.getElementById('thumbnail');
        // if(thumbnail_img && thumbnail_img.style) {
        //     thumbnail_img.style.height = '310px';
        //     thumbnail_img.style.width = '270px';
        // }
    },
    watch: {
        // listArray, pageSize 바껴야함
    },
    methods: {
        nextPage () {
            this.pageNum += 1;
            console.log('nextPage : ' + this.pageNum );
        },
        prevPage () {
            this.pageNum -= 1;
        },
        init() {
            this.options.appid = this.$store.getters.getAppId;
            this.options.keytype = this.$store.getters.getKeyType;
            this.options.apikey = this.$store.getters.getAPIKey;
            
            var self = this;
            gigagenie.init(this.options, function(result_cd, result_msg, extra) {
                if (result_cd === 200) {
                    self.voiceSelectMode();
                } else {
                    console.log('[PaginatedList] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        voiceSelectMode() {
            var self = this;
            gigagenie.voice.onActionEvent=function(extra){
            console.log('[PaginatedList]발화 문장: ' + extra.uword + " " + extra.actioncode);
            switch(extra.actioncode){   
                case 'AddBookmark':
                    self.sendTTS("북마크에 이미 추가되었습니다.");
                    break;
                case 'DeleteBookmark':
                    var idx = '';
                    //var sentence = '';
                    idx = extra.uword.substr(0,1);
                    // if (extra.parameter['NE-B-Ordinal'] == "") {
                    //     idx = extra.parameter['NE-B-Nation'].toString().substr(0, 1);
                    // } else {
                    //     idx = extra.parameter['NE-B-Ordinal'].toString();
                    //     idx = idx.replace("번", "");
                    // }
                    if (isNaN(idx) == true) { // 문자
                        if (idx == "일") {
                            idx = 1;
                        } else if (idx == "이") {
                            idx = 2;
                        } else if (idx == "삼") {
                            idx = 3;
                        }
                    } 
                    idx -= 1; // index는 0부터 시작
                    if (idx < self.listArray.length) {
                        self.deleteBookmark(idx);
                    } else {
                        console.log('[PaginatedList] idx범위 초과');
                    }
                    break;
                case 'MainMenu':
                    self.sendTTS("홈화면으로 이동합니다");
                    self.$router.replace({path: '/mainCategory'});
                    break;
                case 'PreList':
                    if (self.pageNum === 0) {
                        self.sendTTS("이전 목록이 없습니다");
                    } else  {
                        self.prevPage();
                    }
                    break;
                case 'NextList':
                    console.log('[PaginatedList] nextlist enter');
                    if (self.pageNum >= self.pageCount() - 1) {
                        self.sendTTS("다음 목록이 없습니다");
                    } else {
                        console.log('nextList gogo!!');
                        self.nextPage();
                    }
                    break;
                default:
                    break;
                }
            }
        },
        sendTTS(msg) {
            var self = this;
            this.options = {};
            this.options.ttstext = msg;

            gigagenie.voice.sendTTS(this.options, function(result_cd, result_msg, extra) {
                if(result_cd===200){

                } else {
                    //extra.reason 에 voice 오류 전달.
                    console.log("[PaginatedList]gigagenie.voice.sendTTS - result_cd:" + result_cd + " " + result_msg);
                    console.log("[PaginatedList]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        deleteBookmark(idx) {
            idx *= 1; // string to number
            idx = this.pageNum * 3 + idx;
            console.log('[PaginatedList]idx: ' + idx);
            this.listArray.splice(idx, 1);

            // 전체 북마크 데이터 삭제
            var self = this;
            this.options={};
            this.options.namespace='bookmark';
            this.options.key='info';
            gigagenie.appdata.delKeyData(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    // 정제한 JSON데이터로 다시 북마크 저장
                    self.options.data = JSON.stringify(self.listArray);
                    self.setBookmarkData(self.options);
                    self.sendTTS("북마크에서 삭제했습니다.");
                } else {
                    console.log("[PaginatedList] Bookmark delete Error "+ result_cd + " : " + result_msg);
                }
            });
        },
        setBookmarkData(options) {
            var self = this;
            gigagenie.appdata.setKeyData(options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log('[PaginatedList]북마크 삭제 성공!');
                } else {
                    console.log("[PaginatedList]북마크 삭제 실패");
                }
            });
        }
    },
    computed: {
        pageCount () {
            let listLeng = this.listArray.length,
                listSize = this.pageSize,
                page = Math.floor(listLeng / listSize);
            if (listLeng % listSize > 0) page += 1;
            
            return page;
        },
        paginatedData () {
            console.log('computed pageNum: '+this.pageNum + ' pageCount: ' + this.pageCount);
            const start = this.pageNum * this.pageSize,
                end = start + this.pageSize;
            return this.listArray.slice(start, end);
        }

    }
}
</script>
<style>
@import "../css/Bookmark.css";
</style>

// 기가지니 호출어
// 이전 목록, 다음 목록
// 1번 삭제
// 이전 페이지, 다음 페이지, 