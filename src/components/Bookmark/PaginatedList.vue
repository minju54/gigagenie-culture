<template>
    <div>
        <div class="row" id="content-row">
            <div class="col-sm-3" id="bookmark-item" v-for="p in paginatedData" :key="p.seq">
                <img id="idx-circle" src="getImageUrl">
                
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
                <button id="delete-button"><img src="../../assets/delete-button.png" id="delete-img"></button>
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
            numCircle : [
                "../../assets/numCircle1.png",
                "../../assets/numCircle2.png",
                "../../assets/numCircle3.png"
            ]
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
    methods: {
        nextPage () {
            this.pageNum += 1;
        },
        prevPage () {
            this.pageNum -= 1;
        },
        getImageUrl() {
            numCircle[page];
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
