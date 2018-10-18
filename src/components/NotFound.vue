<template>
    <section>
        <main-top></main-top>
        <div>
            찾을 수 없는 페이지입니다.
        </div>
        <main-footer></main-footer>
    </section>
</template>

<script>
import MainTop from './Main/MainTop.vue';
import MainFooter from './Main/MainFooter.vue';

export default {
    components: {
        mainTop: MainTop,
        mainFooter: MainFooter
    }
}
</script>
