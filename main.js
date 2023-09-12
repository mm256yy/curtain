import Vue from 'vue';
import App from './App';
import uView from "uview-ui";
import { diaplayTime,changeText } from 'static/utils/utils.js'; 
import dayjs from 'dayjs'
Vue.prototype.dayjs = dayjs;
Vue.use(uView);
Vue.config.productionTip = false;
Vue.prototype.diaplayTime = diaplayTime;
Vue.prototype.changeText = changeText;
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
