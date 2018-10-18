<template>
    <section>
        <main-top></main-top>
        <!-- <div class="container" id="content">
                
                
        </div> -->
        <main-footer></main-footer>
    </section>
</template>
<script>
import MainTop from './MainTop.vue';
import MainFooter from './MainFooter.vue';

export default {
    components: {
        mainTop: MainTop,
       mainFooter: MainFooter
    }
}
</script>
<style lang="css">
    @import '../css/MainCategory.css';
</style>
