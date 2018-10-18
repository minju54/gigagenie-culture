<template>
    <section>
        <main-top></main-top>
        <router-view></router-view>
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
    },
    created() {
        // eventBus.$on('group', function(data) {
        //     console.log("group data : ", data);
        // });
    }
}
</script>
