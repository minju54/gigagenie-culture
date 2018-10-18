<template>
    <div id="footer">
        <div class="row" id="div-row">
            <div class="col-sm-6">
                <p v-if="seen===1" id="home-text"> {{msg[0]}} </p>
                <p v-else-if="seen===2" id="home-text"> {{msg[1]}}</p>
                <p v-else id="home-text"> {{msg[2]}}</p>
            </div>
            <div class="col-sm-6">
                <p id="end-text">종료하려면 "기가지니, 나가기"</p>
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
                '다음 화면으로 이동하고 싶다면 \"기가지니, 다음 페이지\"'
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
                if (this.seen > 3) {
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
