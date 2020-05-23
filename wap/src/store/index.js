import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  	state: {
  	  apiSecret:'!@`tcrs87261%$#',
      timestamp:0,
      coin:{}, // 货币配置信息
      rate:{},  //汇率配置
      isLogin: false, // 用户是否登录
	  isAPP:false,    //是否APP
	  symbol:'',
	  scrollTop:0,
	  ws:{ // websocket 返回数据
	    tick:{ },// 交易行情
	    capital:{},// 资产
	    buys:null,// 买单
	    sells:null,//卖单
	    history:[
	      
	    ],// 成交历史
	    actives:null,// 委托数据
	  },
	  currency:'CNY',
	  nowCurrency:'CNY',
	  favor:[], // 用户自选列表
	  webSocket:null,
	  chatWs: null,
	  drawWs:null,
	  chatData:{
	  	no:'', //订单编号
	  	list:[], //聊天记录
	  },
	  newChat:{
	  	timestamp: -1,
	  	count: 0
	  }, // 记录数据
	  openWs: false,
	  tradeWs: false,
	  bidask: true, // 买卖单都更新
	  bid:false,
	  ask:false,
	  onload:false,
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
