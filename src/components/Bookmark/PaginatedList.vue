<template>
    <div>
        <div class="row" id="content-row">
            <div class="col-sm-3" id="item-col" v-for="(p, idx) in paginatedData" :key="p.seq">
                <img id="idx-circle" v-if="idx === 0" src="../../assets/numCircle1.png">
                <img id="idx-circle" v-else-if="idx === 1" src="../../assets/numCircle2.png">
                <img id="idx-circle" v-else src="../../assets/numCircle3.png">
                
                <div id="bookmark-item" >
                    <p id="show-title"><b>{{p.title}}</b></p>  
                    <img id="thumbnail" v-bind:src="p.thumbnail" width="270px" height="300px">
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

                <button id="delete-button"><img src="../../assets/delete-button.png" id="delete-img" @click="deleteBookmark(idx)"></button>
            </div>
            
        </div>
        <div id="btn-cover">
            <button :disabled="pageNum === 0" @click="prevPage" id="prev-button">
                <img src="../../assets/left-arrow.png" id="arrow-img">
            </button>
            <span id="page-count">{{ pageNum + 1 }} / {{ pageCount }} 페이지</span>
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
    created() {
        gigagenie.voice.onActionEvent=function(extra){
            console.log('[PaginatedList]발화 문장: ' + extra.uword + " " + extra.actioncode);
            switch(extra.actioncode){   
                case 'AddBookmark':
                    self.sendTTS("북마크에 이미 추가되었습니다.");
                    break;
                case 'DeleteBookmark':
                    self.sendTTS("북마크에서 삭제했습니다.");
                    idx = extra.parameter['NE-B-Ordinal'];
                    deleteBookmark(idx);
                    break;
                default:
                    break;
            }
        }
    },
    methods: {
        nextPage () {
            this.pageNum += 1;
        },
        prevPage () {
            this.pageNum -= 1;
        },
        deleteBookmark(idx) {
            idx = this.pageNum * 3 + idx;
            console.log('[PaginatedList] delete bf) listArray: ' + this.listArray);
            this.listArray.splice(idx, 1);
            console.log('[PaginatedList] delete af) listArray: ' + this.listArray);

            // 전체 북마크 데이터 삭제
            var self = this;
            this.options={};
            this.options.namespace='bookmark';
            this.options.key='info';
            gigagenie.appdata.delKeyData(this.options,function(result_cd,result_msg,extra){
                if(result_cd===200){
                    console.log("[PaginatedList] Bookmark delete success");
                    // 정제한 JSON데이터로 다시 북마크 저장
                    self.options.data = JSON.stringify(self.listArray);
                    self.setBookmarkData(self.options);
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