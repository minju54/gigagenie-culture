<template>
    <section>
        <main-top></main-top>
        <main-content></main-content>
        <main-footer></main-footer>
    </section>
</template>

<script>
import MainTop from './Main/MainTop.vue';
import MainContent from './Main/MainContent.vue';
import MainFooter from './Main/MainFooter.vue';

export default {
    components: {
        mainTop: MainTop,
        mainContent: MainContent,
        mainFooter: MainFooter
    }
}
</script>
