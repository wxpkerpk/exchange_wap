import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		isLogin: JSON.parse(localStorage.getItem('login')) || false, // 是否登录
		isAPP:false, //是否APP
		ws: {
			lines: "",
			kline: [],
			price: {},
			depth: {
				current:{},
				ask: [],
				bids: []
			},
			order:[],// 历史订单
		},
		cur:[],
		websocket: null,
		heart: null,
        topics:[
            "kline_%t_%r",
            "depth_%t",
            "price_%t",
            "order_%t",
            "personOrder_%u",
        ],
        range:'15m',
        symbol:'BTC_USDT',
        klineLoadAll: false,
	},
	mutations: {

	},
	actions: {

	},
	modules: {
		user,
		app
	}
})
