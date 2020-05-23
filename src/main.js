import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from 'vant'
import axios from 'axios'
import icons from '@/components/icons'
import nodata from '@/components/nodata'
import loading from '@/components/loading'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import VueClipboard from 'vue-clipboard2'
import 'vue-fullpage/vue-fullpage.css'
import VueFullpage from 'vue-fullpage'
import dayjs from 'dayjs'

import config from '@/config'
import vld from '@/assets/js/validator'
import mts from '@/assets/js/method'
import mkt from '@/assets/js/market'
import { Progress, Radio, } from 'element-ui';



// 语言切换
import VueI18n from 'vue-i18n';
import locales from '@/locales'

//加载样式
import 'vant/lib/index.css'
import '@/assets/iconfont/iconfont.css'
import "@/assets/css/main.scss"
import "@/assets/iconfont/iconfont.js"
import 'element-ui/lib/theme-chalk/index.css'
import 'animate.css';

Vue.use(Progress)
Vue.use(Radio)
Vue.use(VueI18n);
Vue.use(icons);
Vue.use(vant);
Vue.use(nodata);
Vue.use(loading);
Vue.use(VueClipboard)
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(VueFullpage)

Vue.prototype.$mts = mts;
Vue.prototype.$vld = vld;
Vue.prototype.$config = config;
Vue.prototype.$axios = axios;
Vue.prototype.$mkt = mkt;
Vue.prototype.$dayjs = dayjs;




Vue.config.productionTip 				= false
axios.defaults.withCredentials 			= true;
axios.defaults.headers['Content-Type'] 	= 'application/json;charset=UTF-8';

// 自动设置多语言
// const navLang = navigator.language;
// const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
let lang = 'zh-CN';
localStorage.setItem('language',lang);
const i18n = new VueI18n({
    locale: lang,
	messages:locales,
	silentTranslationWarn: true
});

window._vm = new Vue({
	router,
	store,
	i18n,  
	render: h => h(App)
}).$mount('#app')
