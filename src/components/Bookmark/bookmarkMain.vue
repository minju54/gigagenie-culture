<template>
    <section>
        <main-top></main-top>
        <div id="body">
            <div id="title-top">북마크 목록</div>
            <paginated-list :list-array="pageArray" />
        </div>
        <main-footer></main-footer>
    </section>
</template>

<script>
import MainTop from '../Main/MainTop.vue';
import MainFooter from '../Main/MainFooter.vue';
import PaginatedList from './PaginatedList.vue';

export default {
    components: {
        mainTop: MainTop,
        mainFooter: MainFooter,
        PaginatedList
    },
    data () {
        return {
            options: {},
            info_text: "북마크 목록입니다.",
            show_title: "",
            show_date: "",
            show_place: "",
            show_price: "",
            show_phone: "",
            show_thumbnail: "" ,
            bookmarkListJson: "",
            bookmarkListArr : "",
            pageArray: []
        }
    },
    created() {
        this.init();
        this.getVoiceCommand();
        this.datainit(); // test 용도
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
                    self.sendTTS(self.info_text);
                    self.getBookMarkList();
                } else {
                    console.log('[bookmarkMain] gigagenie init error: '+ result_cd+ ", " + result_msg);
                }
            });
        },
        datainit() {
            this.show_title = "titletitle";
            this.show_date = "2018.10.10 ~ 2018.10.11";
            this.show_place = "국립중앙박물관";
            this.show_price = "1000원";
            this.show_phone = "01011111111";
            this.show_thumbnail = "";
        },
        getVoiceCommand() {
            var self = this;
            gigagenie.voice.onVoiceCommand=function(event){
                switch(event){
                    case 'prevPage':
                        self.$router.replace({path: '/mainCategory'});
                        console.log('[bookmarkMain] 이전 페이지');
                        break;
                    case 'nextPage':
                        self.sendTTS("다음 페이지가 없습니다.");
                        console.log('[bookmarkMain] 다음 페이지');
                        break;
                    default:
                        break;
                }
            };
        },
        sendTTS(msg) {
            this.options = {};
            this.options.ttstext = msg;
            var self = this;
            gigagenie.voice.sendTTS(this.options, function(result_cd, result_msg, extra) {
                if(result_cd===200){

                } else {
                    //extra.reason 에 voice 오류 전달.
                    console.log("[bookmarkMain]gigagenie.voice.sendTTS - result_cd:" + result_cd);
                    console.log("[bookmarkMain]gigagenie.voice.sendTTS - result_msg:" + result_msg);
                    console.log("[bookmarkMain]gigagenie.voice.sendTTS - extra:" + JSON.stringify(extra));
                };
            });
        },
        getBookMarkList() {
            var self = this;
            this.options = {};
            this.options.namespace = 'bookmark';
            this.options.key='info';
            gigagenie.appdata.getKeyData(this.options,function(result_cd,result_msg,extra){
                switch(result_cd) {
                    case 200:
                        self.bookmarkListJson = JSON.parse(extra.data);
                        //console.log('extra.data: ' + extra.data);
                        console.log('[BookmarkMain]bookmark length: ' + Object.keys(self.bookmarkListJson).length);
                        //console.log('index 0 : ' + JSON.stringify(self.bookmarkListJson[0]) + self.bookmarkListJson[0].title);
                       
                        self.pageArray = self.bookmarkListJson;
                        $.each(self.bookmarkListJson, function (index, data) {
                            console.log('bookmarkList key ', self.bookmarkListJson[index].title)
                            
                            // self.show_title = data.title;
                        });
                        break;
                    case 403:
                        self.bookmarkState = -1;
                        console.log("[bookmarkMain]bookmark namespace가 존재하지않음");
                        break;
                    case 404:
                        self.bookmarkState = -1;
                        console.log("[bookmarkMain]seq키가 존재하지않음");
                        break;
                    case 500:
                        self.bookmarkState = -1;
                        console.log("[bookmarkMain]system error");
                        break;
                    default:
                        self.bookmarkState = -1;
                        console.log('[bookmarkMain]code: '+ result_cd+ ", msg: "+result_msg);
                        break;
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
                    console.log("[bookmarkMain]음성인식 중단 성공");
                }
                else if (result_cd==404) {
                    console.log("[bookmarkMain]음성인식 실행 중이 아님");
                }
                else {
                    console.log("[bookmarkMain]음성인식 중단 실패: " + result_msg);
                }
            });
        }
    }
        
    
}
</script>
<style lang="css">
@import "../css/Bookmark.css";
</style>
