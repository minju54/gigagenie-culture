<template>
    <div id="footer">
        <div class="row" id="div-row">
            <div class="col-sm-6">
                <p v-if="seen===1" id="home-text"> {{msg[0]}} </p>
                <p v-else-if="seen===2" id="home-text"> {{msg[1]}}</p>
                <p v-else-if="seen===3" id="home-text"> {{msg[2]}}</p>
                <p v-else id="home-text"> {{msg[3]}}</p>
            </div>
            <div class="col-sm-6">
                <p v-if="seen===1" id="end-text"> {{msg2[0]}} </p>
                <p v-else-if="seen===2" id="end-text"> {{msg2[1]}}</p>
                <p v-else id="end-text"> {{msg2[2]}}</p>
                <!-- <p v-else id="home-text"> {{msg2[3]}}</p> -->
                <!-- <p id="end-text">종료하려면 "기가지니, 나가기"</p> -->
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg : [
                '처음 화면으로 이동하고 싶다면 \"기가지니, 홈으로\"',
                '이전 화면으로 이동하고 싶다면 \"기가지니, 이전 페이지\"',
                '다음 화면으로 이동하고 싶다면 \"기가지니, 다음 페이지\"',
                '종료하려면 \"기가지니, 나가기\"'
            ],
            msg2 : [
                '북마크에 저장하려면 \"기가지니, 북마크 저장\"',
                '북마크에서 삭제하려면 \"기가지니, 북마크 삭제\"',
                '목록에서 특정 북마크를 삭제하려면 \"기가지니, 1번 북마크 삭제\"'
            ], 
            intervalid : '',
            seen : 1
        }
    },
    mounted() {
        this.changeMsg();
    },
    beforeDestroy() {
        clearInterval(this.intervalid);
    },
    methods: {
        changeMsg() {
            this.intervalid = setInterval(function(){
                // this.changes = ((Math.random() * 100).toFixed(2))+'%';
                this.seen++;
                if (this.seen > 4) {
                    this.seen = 1;
                }
                }.bind(this), 2000);
            }
    }
}
</script>

<style lang="css">
    @import '../css/MainFooter.css';
</style>

// 종료하려면 "기가지니, 나가기"
// 시작하려면 "문화알리미, 시작하기"
// 기가지니 이전페이지, 기가지니 다음 페이지
// 
