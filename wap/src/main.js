import Vue 					from 'vue'
import App 					from './App.vue'
import router 				from './router'
import store 				from './store'
import vant 				from 'vant'
import axios 				from 'axios'
import icons 				from '@/components/icons'
import nodata 				from '@/components/nodata'
import loading 				from '@/components/loading'
import VueQrcode 			from '@chenfengyuan/vue-qrcode';
import VueClipboard 		from 'vue-clipboard2'

import config 				from '@/config'
import mts 					from '@/assets/js/method'
import tool 				from '@/assets/js/tool'
import tdp 					from '@/assets/js/tradePage'
import vld 					from '@/assets/js/validator'



// 语言切换
import VueI18n from 'vue-i18n';
import locales from '@/locales'

//加载样式
import "ionicons/dist/css/ionicons.min.css"
import 'vant/lib/index.css'
import "@/assets/css/main.styl"


Vue.use(VueI18n);
Vue.use(icons);
Vue.use(vant);
Vue.use(nodata);
Vue.use(loading);
Vue.use(VueClipboard)
Vue.component(VueQrcode.name, VueQrcode);

Vue.prototype.$mts 			= mts;
Vue.prototype.$tdp 			= tdp;
Vue.prototype.$vld			= vld;
Vue.prototype.$tool			= tool;
Vue.prototype.$config 		= config;
Vue.prototype.$axios        = axios;




Vue.config.productionTip 				= false
axios.defaults.withCredentials 			= true;
axios.defaults.headers['Content-Type'] 	= 'application/json;charset=UTF-8';

// 自动设置多语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
let lang = window.localStorage.getItem('language') || localLang || 'en-US';
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
