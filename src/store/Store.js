import Vue from 'vue';
import Vuex from 'vuex';
import condition from './modules/Condition';
import key from './modules/key';
import gigagenie from './modules/gigagenieSDK';

Vue.use(Vuex)

export default new Vuex.Store({
    modules : {
        condition,
        key,
        gigagenie
        // DateFormat
    }
});
