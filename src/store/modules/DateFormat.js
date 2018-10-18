const date = {
    df : new Date(),
    today : this.df.getDate(),
    tomorrow : this.df.getDate() + 1,
    week : this.df.getDate() + 7,

    month : this.df.getMonth() + 1,
    year : this.df.getFullYear()
}

const getters = {
    getDay() {
        return date.today;
    },
    getTomorrow() {
        return date.tomorrow;
    },
    getMonth() {
        return date.month;
    },
    getYear() {
        return date.year;
    }
}

export default {
    date,
    getters
}