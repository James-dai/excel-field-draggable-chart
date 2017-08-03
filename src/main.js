// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/less/font-awesome.less';
import  vCharts from "v-charts"
import  elementUI from "element-ui"
import 'element-ui/lib/theme-default/index.css'
import vueXlsxTable from 'vue-xlsx-table'

Vue.use(vCharts);
Vue.use(elementUI);
Vue.use(vueXlsxTable);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
