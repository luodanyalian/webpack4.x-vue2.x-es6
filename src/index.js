import Vue from 'vue'
import App from './pages/app'
import wx from 'weixin-js-sdk'
import {
    Alert,
    Confirm,
    Toast,
    Loading
} from 'wc-messagebox'
Vue.use(Alert);
Vue.use(Confirm);
Vue.use(Toast);
Vue.use(Loading)
import 'wc-messagebox/style.css'

Vue.prototype.wx = wx
import 'lib-flexible/flexible.js'
new Vue({
    el: '#root',
    template: '<App/>',
    components: {App}
});