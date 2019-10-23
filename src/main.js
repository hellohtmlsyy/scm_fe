// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'
import layer from 'layui-layer'
import Print from 'vue-print-nb'
Vue.use(Print); //注册
import datePicker from 'vue-bootstrap-datetimepicker'; //日期选择
Vue.component('datePicker', datePicker);
import JsonExcel from 'vue-json-excel'//导出
Vue.component('downloadExcel', JsonExcel)
import VueClipboard from 'vue-clipboard2'//上传
Vue.use(VueClipboard)
// 公共样式
import "../src/assets/css/common.css"

// 公共方法
import common from "../src/assets/js/common.js"
Vue.prototype.common = common //基于原型链挂载，vue组件可访问使用


Vue.config.productionTip = false

Vue.filter('convertTime', function (timeStr) {
  return moment(timeStr).format('YYYY-MM-DD hh:mm:ss');
});
import headerBar from './components/common/headerbar.vue';
import pagination from './components/common/pagination.vue';
Vue.component('scm-header', headerBar);
Vue.component('scm-pagination', pagination);



import Axios from 'axios';
import qs from 'qs';
Vue.prototype.API = '/api';
// //挂载
Object.defineProperty(Vue.prototype, '$axios', {
    get() {
        return Axios;
    }
});
Axios.defaults.withCredentials = true;


import rootPath from './assets/config/api.js'; //接口路径


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    data: {
        urlPath: rootPath.pathUrl()
    },
})