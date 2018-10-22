<template>
    <section>
        <main-top></main-top>
        <div id="body">
            <div id="title-top">북마크 목록</div>
            <div class="row">
                <button id="prev-button"></button>
                <div class="col-sm-3"></div>
                <div class="col-sm-3"></div>
                <div class="col-sm-3"></div>
                <button id="next-button"></button>
            </div>
        </div>
        <main-footer></main-footer>
    </section>
</template>

<script>
import MainTop from '../Main/MainTop.vue';
import MainFooter from '../Main/MainFooter.vue';

export default {
    components: {
        mainTop: MainTop,
        mainFooter: MainFooter
    }
}
</script>
<style lang="css">
@import "../css/Bookmark.css";
</style>
