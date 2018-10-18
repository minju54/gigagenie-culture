const state = {
    group : '', // alone, friend, family
    favor : '', // music, art, play, dance
    price : '',   // free, pay, nothing
    date : '',  // today, tomorrow, week, month
    address : ''
}

const getters = {
    getGroup() {
        return state.group;
    },
    getFavor() {
        return state.favor;
    },
    getPrice() {
        return state.price;
    },
    getDate() {
        return state.date;
    },
    getAddress() {
        return state.address;
    }
}

const mutations = {
    setGroup(state, payload) {
        state.group = payload;
    },
    setFavor(state, payload) {
        state.favor = payload;
    },
    setPrice(state, payload) {
        state.price = payload;
    },
    setDate(state, payload) {
        state.date = payload;
    },
    setAddress(state, address) {
        state.address = address;
    }
}

export default {
    state,
    getters,
    mutations
}
/*
기가지니 등록된 주소 -> 공연전시 주소
==============
강원도 -> 강원
경기도 -> 경기
경상남도 -> 경남
경상북도 -> 경북
광주광역시 -> 광주
대구광역시 -> 대구
대전광역시 -> 대전
부산광역시 -> 부산
서울특별시 -> 서울
세종특별자치시 -> 세종, 데이터가 별로 없음..
울산광역시 -> 울산
인천광역시 -> 인천
전라남도 -> 전남
전라북도 -> 전북
제주특별자치도 -> 제주
충청남도 -> 충남
충청북도 -> 충북
==============
*/

