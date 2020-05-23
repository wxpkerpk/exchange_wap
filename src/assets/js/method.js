import store from '@/store/index';
import api from '@/config';
import qs from "qs";
import axios from 'axios'

// let url = '';
let url  = api.baseUrl+"/";

const method = {
    ApiUrl: url,
	wsUrl: api.wsUrl + "/webSocket/v2",
	// wsUrl: 'ws://192.168.0.130:8765' + "/webSocket/v2",
	domain: api.domain,
	stabilize:  'Dogex',
	uploadurl:  api.baseUrl + "api/me/",
	v:1.000, 
	
	//版本控制
	checkVersion(){
		method.posts({
			url: 'api/me/app/config',
			data: {noNeedCode:true},
			success(response){
				if(response.data.status == 200){
					let datas = response.data.data;
					console.log(datas,888)
					if(plus.os.name != "Android"){ //IOS
						if(plus.runtime.version < datas.iosVersion){
							_vm.$dialog.confirm({
								title: _vm.$t('other.findIos') + datas.iosVersion,
								message: _vm.$t('other.isUpdate'),
								confirmButtonText:_vm.$t('button.public.confirm'),
								cancelButtonText:_vm.$t('button.public.cancel'),
							}).then(() => {
								plus.runtime.openURL('https://wap.huo-dun.com/download.html',()=>{
									//下载新版本失败，请去Dogex官网下载
								});
							}).catch(() => {});
						}
					}else{
						if(plus.runtime.version < datas.androidVersion){
							_vm.$dialog.confirm({
								title: _vm.$t('other.findAd') + datas.androidVersion,
								message: _vm.$t('other.isUpdate'),
								confirmButtonText:_vm.$t('button.public.confirm'),
								cancelButtonText:_vm.$t('button.public.cancel'),
							}).then(() => {
								plus.runtime.openURL('https://wap.huo-dun.com/download.html',()=>{
									//下载新版本失败，请去Dogex官网下载
								});
							}).catch(() => {});
						}
					}
				}
	        },error(error){

	        }
	    });
	},
	//获取剪切板内容
	getClipbordText() {  
		if(!window.plus) return;  
		if(mui.os.android) {
			var Context = plus.android.importClass("android.content.Context");  
			var main = plus.android.runtimeMainActivity();  
			var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);  
			return plus.android.invoke(clip, "getText");  
		} else {  
			var UIPasteboard = plus.ios.importClass("UIPasteboard");  
			var generalPasteboard = UIPasteboard.generalPasteboard(); 
			var _val = generalPasteboard.plusCallMethod({valueForPasteboardType:"public.utf8-plain-text"});  
			return _val || '';  
		}
	},
	// 设置剪贴板内容
	setClipbordText(text){
		if(!window.plus) return;  
		if(mui.os.android) {
			var Context = plus.android.importClass("android.content.Context");  
			var main = plus.android.runtimeMainActivity();  
			var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);  
			plus.android.invoke(clip, "setText",'');  
		} else {  
			var UIPasteboard = plus.ios.importClass("UIPasteboard");  
			var generalPasteboard = UIPasteboard.generalPasteboard(); 
			generalPasteboard.plusCallMethod({
				setValue:'',
				forPasteboardType: "public.utf8-plain-text"
			});
			generalPasteboard.plusCallMethod({
				valueForPasteboardType: "public.utf8-plain-text"
			});
		}
	},
	//语言
	getLangSm() {
		let langSm = method.getLang();
		switch(langSm){
			case "zh-CN":
				return "zh";
				break;
			case "zh-TW":
				return "zh_TW";
				break;
			case "en-US":
				return "en";
				break;
			default:
				return "en";
				break;
		}
	},
	getLang(){
		let navLang = navigator.language;
		let localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
		let lang = window.localStorage.getItem('language') || localLang || 'en-US';
		return lang;
	},
	get(pram){
		axios.get(method.ApiUrl + pram.url + '?' + qs.stringify(pram.data)).then((response)=>{
			if(response.status == 200){ 
				if (response.data.status == 40101 || response.data.status == 401) { //  token过期或错误
					_vm.$toast(_vm.$t('form.sign.expire'));
					method.signout('needback', _vm.$route.path);
				}else{
					pram.success(response); 
				}
			}
		}).catch((error)=>{ console.log(error); });
	},
	posts(pram){
		axios.post(method.ApiUrl + pram.url,JSON.stringify(pram.data),{
			headers:{
				'Content-Type': 'application/json',
				'Authorization':localStorage.getItem('token') ? localStorage.getItem('token') : '',
				'userAgent': navigator.userAgent,
				'deviceId': '123' || parseInt(Math.random() * 1000),
				'language':localStorage.getItem('language') === 'zh-CN' ? localStorage.getItem('language').split('-')[1] : "EN"
			}
		}).then((response)=>{
			if(response.status == 200){ 
				if (response.data.status == 40101 || response.data.status == 401) { //  token过期或错误
					_vm.$toast(_vm.$t('form.sign.expire'));
					method.signout('needback', _vm.$route.path);
				}else{
					pram.success(response); 
				}
			}
		}).catch((error)=>{ 
			console.log(error);
		});
	},
	postUrl(pram){
		let urlParams = '?';
		for (var key in pram.data) {
			urlParams += `${key}=${pram.data[key]}&`;
		}
		axios.post(method.ApiUrl + pram.url + urlParams,JSON.stringify(pram.data),{
			headers:{
				'Content-Type': 'application/json',
				'Authorization':localStorage.getItem('token') ? localStorage.getItem('token') : '',
				'userAgent': navigator.userAgent,
				'deviceId': '123' || parseInt(Math.random() * 1000),
				'language':localStorage.getItem('language') === 'zh-CN' ? localStorage.getItem('language').split('-')[1] : "EN"
			}
		}).then((response)=>{
			if(response.status == 200){ 
				if (response.data.status == 40101 || response.data.status == 401) { //  token过期或错误
					_vm.$toast(_vm.$t('form.sign.expire'));
					method.signout('needback', _vm.$route.path);
				}else{
					pram.success(response); 
				}
			}
		}).catch((error)=>{ 
			console.log(error);
		});
	},
	upload(pram){
		axios.post(method.ApiUrl + pram.url,pram.data,{
			headers:{
				'Content-Type': 'multipart/form-data',
				'Authorization':localStorage.getItem('token'),
				'userAgent': navigator.userAgent,
				'deviceId': '123' || parseInt(Math.random() * 1000),
				'language':localStorage.getItem('language') === 'zh-CN' ? localStorage.getItem('language').split('-')[1] : "EN"
			}
		}).then((response)=>{
			if(response.data.status != 200){ //失败
				if (response.data.status == 40101) {
					method.signout('needback', _vm.$route.path);
				} else {
					if (response.data.status && response.data.status != 801) {
						// _vm.$toast.fail(response.data.message);
					}
					pram.success(response);
				}
			}else{
				pram.success(response); 
			}
		}).catch((error)=>{ console.log(error); });
	},
	disconnect(){

	},
	close(){
		store.state.ws.lines = "";
		store.state.cur = [];
		clearInterval( store.state.heart);
		if (store.state.websocket) {
			store.state.websocket.close();
		}
	},
	getDecTime(range){
		let t = Number(60 * 1000);
		switch(range){
			case "1m":
				return t;
				break;
			case '5m':
				return 5 * t;
				break;
			case '15m':
				return 15 * t;
				break;
			case '1h':
				return 60 * t;
				break;
			case '4h':
				return 4 * 60 * t;
				break;
			case '8h':
				return 8 * 60 * t;
				break;
			case '12h':
				return 12 * 60 * t;
				break;
			case '1d':
				return 24 * 60 * t;
				break;
			default:
				return 15 * t;	
				break;
		}
	},
	makeKline(array, time, range){
		let t = method.getDecTime( range);
		for (let idx = 1;idx <= 60 - array.length;idx ++) {
			array.unshift([_vm.$mkt.dateFormat('yyyy-mm-dd HH:MM', time - idx * t),-1,-1,-1,-1,-1]);
		}

		return array;
	},
	getOpenTime(pair){
		let array = store.state.app.pairs;
		let item = null;
		for (var i = array.length - 1; i >= 0; i--) {
			let c = array[i].coinCode +'_'+ array[i].symbol;
			if(c == pair) {
				item = array[i];
			}
		}
		return item.buyOpenTime > item.sellOpenTime ? item.buyOpenTime : item.sellOpenTime;
	},
	connect(pair, callback, range){ // 连接ws
		let that = this;
		let websocket = store.state.websocket
		
		// 需要重连
		if ( !websocket || websocket.readyState != 1) {
			websocket = store.state.websocket = new WebSocket( method.wsUrl);
		} else {
			store.state.ws.lines = "";

			store.state.cur = [];
			websocket.send("{subscribe:[]}");
			
			// 重新订阅
			method.subscribe(pair, range);
		}

		// 开启
		websocket.onopen = (event)=>{

			store.state.ws.lines = "";

			store.state.cur = [];

			clearInterval( store.state.heart);
			// 开启心跳
			store.state.heart = setInterval(()=>{
				if (websocket.readyState != 1) {
					method.connect(pair, callback, range);
				} else {
					websocket.send('{"type":"ping"}');
				}
			}, 10000);
			// 开始关注
			method.subscribe(pair, range);
		};
		// 关闭
		websocket.onclose = method.onclose;
		// 异常
		websocket.onerror = method.onerror;
		// 消息
		websocket.onmessage = (event)=>{
			let data = event.data;
			if (data != 'ok') {
				if (typeof data == 'string') {
					data = JSON.parse( data);
				}
				// kline 数据
				if (data.topic.indexOf('all') != -1) {
					// 数据排序
					store.state.cur.push(data);

					if (store.state.cur.length == data.t) {
						let fulldata = [];

						let array = store.state.cur.sort((a,b)=>{
							return a.c > b.c;
						});

						for (var i = 0; i < array.length; i ++) {
							store.state.ws.lines += array[i].data;
						}
						let open = method.getOpenTime(pair);
						let lists = JSON.parse( store.state.ws.lines);
						lists = lists.filter((item)=>{
							return item[0] >= open;
						});

						for(let idx = 0;idx < lists.length; idx ++){
							let item = [_vm.$mkt.dateFormat('yyyy-mm-dd HH:MM',lists[idx][0]), lists[idx][1], lists[idx][4], lists[idx][3],lists[idx][2], lists[idx][5]];
							fulldata.push(item);
						}
						// if (fulldata.length < 30 && fulldata.length > 0) {
						// 	fulldata = method.makeKline( fulldata, lists[0][0], store.state.range);
						// }
						store.state.klineLoadAll = true;
						// 回调K线
						callback( fulldata, true);
					}
				}
				// 普通数据接收
				if (data.topic.indexOf('kline') != -1 && data.topic.indexOf('all') == -1) {
					if (store.state.klineLoadAll &&
						data.topic.indexOf(store.state.range) != -1) {
						callback( [data.data], true);
					}
				}
				// 订单数据
				if (data.topic.indexOf('depth') != -1
					&& data.topic.indexOf(store.state.symbol) != -1) {
					callback( data.data);
				}
				// 当前成交价
				if (data.topic.indexOf('price') != -1) {
					//
					let dv = data.data;
					let c = store.state.ws.depth.current;
					let chg = 0;
					if (c) {
						chg = dv.price - c.price;
					} else {
						chg = dv.gain_24;
					}
					store.state.ws.depth.current = {
						gain_24: dv.gain_24,
						max_24h: dv.max_24h,
						min_24h: dv.min_24h,
						pair: dv.pair,
						price: dv.price,
						vol: dv.vol,
						worth: dv.worth,
						isFav: store.state.ws.depth.current.isFav || false,
						openTime: store.state.ws.depth.current.openTime || dv.openTime,
						icon: store.state.ws.depth.current.icon,
						sort: store.state.ws.depth.current.sort || 89,
						chg: chg
					};
				}
				// 有新订单数据
				if (data.topic.indexOf('order') != -1) {
					let array = store.state.ws.order;
					let list = data.data;
					for (var idx = 0; idx < 50; idx ++){
						if (idx < array.length) {
							list.push( array[ idx]);
						}
					}
					store.state.ws.order = list;
				}
				if (data.topic.indexOf('personOrder') != -1) {
					callback( data.data);
				}
			}
		};		
	},
	onerror(event){
		// console.log('异常');
	},
	onclose(event){
		// console.log('关闭');
	},
	subscribe(pair, range){
		// 关注某个主题
		store.state.range = range;
		store.state.symbol = pair;
		store.state.klineLoadAll = false;
		let subscribe = method.formatTopic(pair, range);

		if(store.state.websocket.readyState===1){
		  store.state.websocket.send( subscribe);
		}else{
			setTimeout(()=>{
				method.subscribe(pair, range);

			}, 400);
		}
	},
	subscribeKline(pair, range){
		store.state.ws.lines = "";
		store.state.cur = [];
		if (store.state.websocket) {
				method.subscribe(pair, range);
		}
	},
    formatTopic(pair, range){ // t 主 p 交易对 r 分辨率
        let that = this;
        let topics = [];
        let topic = store.state.topics;
        for (let idx = 0; idx < topic.length; idx ++) {
            let str = topic[idx];
            if ( str.indexOf('%t') != -1) {
                str = str.replace('%t', pair);
            }
            if ( str.indexOf('%r') != -1) {
                str = str.replace('%r', range);
            }
            // 验证是否登录 获取用户个人订单
            if ( str.indexOf('%u') != -1 && store.state.isLogin) {
                str = str.replace('%u', method.getUserValue('sysUserID'));
                topics.push( str);
            } else {
                topics.push( str);
            }
        }
        return JSON.stringify({subscribe: topics});
    },
    sort(array, rule , idx){
    	if (array && array.length > 0) {
    		return array.sort((x, y)=>{
    			if (rule == 'asc') {
    				return x[ idx] - y[ idx];
    			} else {
    				return y[ idx] - x[ idx];
     			}
    		});
    	}
    },
	
	seriesLoadScripts(scripts,callback,id) {  
		if(typeof(scripts) != "object") var scripts = [scripts];
		var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
		var s = new Array(), last = scripts.length - 1, recursiveLoad = function(i) { //递归
			s[i] = document.createElement("script");
			s[i].setAttribute("type","text/javascript");
			s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
			if(!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
				this.onload = this.onreadystatechange = null; this.parentNode.removeChild(this); 
				if(i != last) recursiveLoad(i + 1); else if(typeof(callback) == "function") callback();
			}
			}
			s[i].setAttribute("src",scripts[i]);
			if(id){
				s[i].setAttribute("id",id);
			}
			HEAD.appendChild(s[i]);
		};
		recursiveLoad(0);
	},
	gourl(name,params){
		_vm.$router.push({name, })
	},
	openUrl(url){
		if(url.substr(0,4).toLowerCase() == "http"){
			if(localStorage.getItem("isAPP")){
				plus.runtime.openURL(url,()=>{});
			}else{
				window.location.href = url
			}
		}else{
			_vm.$router.push({path:url})
		}
	},
	initPage(){
		store.state.app.loading = false;
		store.state.app.finished = false;
		store.state.app.vanList = [];
	},
	loading(data, size, page, link = true){
		if (!data || data.length == 0) {
			store.state.app.loading = false;
			store.state.app.finished = true;
			if (page == 1) {
				store.state.app.vanList = [];
			}
		} else { // vant list 临时数据
			let list = store.state.app.vanList;
			list = link ? list.concat(data) : data;
			store.state.app.loading = false;
			if (size > data.length || size > list.length) {
				store.state.app.finished = true;
				store.state.app.loading = false;
			}
			store.state.app.vanList = list;
		}
	},
	loadMore(data){ // by page
	    if (data && data.rows.length > 0) {
	        // vant list 临时数据
	        let list = store.state.app.vanList;
	        list = list.concat(data.rows);
	        store.state.app.loading = false;
	        if (list.length >= data.total || list.length == 0) {
	            store.state.app.finished = true;
	            store.state.app.loading = false;
	        }
	        store.state.app.vanList = list;
	    } else { // 没有数据
	        store.state.app.loading = false;
	        store.state.app.finished = true;
	    }
	},
	copy(value){
		_vm.$copyText(value).then(function (e) {
			_vm.$toast({message: _vm.$t('button.public.copySuc'),duration:1500})
		}, function (e) {
			_vm.$toast({message: _vm.$t('button.public.copyFail'),duration:1500})
		})
	},
	toast(value,time){
		_vm.$toast({message:value,duration: time == '' ? time : 1500});
	},
	getUserValue(name){
		var jsonstr = localStorage.getItem('user');
		if(jsonstr == null || jsonstr == ''){
			return '';
		}
		return JSON.parse(jsonstr)[name];
	},
	setUserValue(name, value){
		var jsonstr = localStorage.getItem('user');
		if(jsonstr != null && jsonstr != ''){
			let user = JSON.parse(jsonstr);
			user[name] = value;
			localStorage.setItem("user", JSON.stringify(user));
		}
	},
	refreshToken(){
		let token = localStorage.getItem('token');
		if (token) {
			method.posts({
				url:'api/me/security/refreshToken',
				data:{},
				success(response){
					if (response.data.status ==200) {
						localStorage.setItem("token",response.data.data.token);
						localStorage.setItem("expire",response.data.data.expire);
					} else {
						method.signout('clear');
					}
				}
			});
		}
    },
	checkExpire(type, path, callback){
		let expire = localStorage.getItem('expire');
		let loginTime = localStorage.getItem('loginTime');
		let nowTime = new Date().getTime();
		// 判断登录用户是否过期
		let isExpire = expire && loginTime ? (Number(expire) + Number(loginTime) < nowTime) : true;
		if ((callback && !type && !path) || type == 'clear') {
			if (isExpire) {
				localStorage.removeItem("token");
				localStorage.removeItem("tradeToken");
				localStorage.removeItem("user");
				localStorage.removeItem('login');
				localStorage.removeItem('coins');
				localStorage.removeItem('loginTime');
				localStorage.removeItem('expire');
				localStorage.removeItem('areaCode');
				localStorage.removeItem('setFundPsw');
				localStorage.removeItem('defaultRate');
				localStorage.removeItem('nowStatus');
				
				// localStorage.removeItem('ratesExpire');
				// localStorage.removeItem('market');
				// localStorage.removeItem('coinsPlaceholderExpire');
				// localStorage.removeItem('banner');
				// localStorage.removeItem('pairs');
				// localStorage.removeItem('pairsExpireUSDT');
				// localStorage.removeItem('marketAllExpire');
				// localStorage.removeItem('marketAll');
				// localStorage.removeItem('coins');
				// localStorage.removeItem('rates');
				// localStorage.removeItem('bannerExpire');
				// localStorage.removeItem('pairsUSDT');
				// localStorage.removeItem('pairsExpire');
				// localStorage.removeItem('coinsPlaceholder');
				store.state.isLogin = false;
			}
			if (callback) {
				callback();
			}
		} else if(type && path){
			if (isExpire && type != 'clear') {
				method.signout(type, path);
			} else {
				callback();
			}
		} else if(isExpire){
			method.toast(_vm.$t('message.sign.signExpired'))
			method.goto('signin');
		}
	},
	ticker(){
		method.post({ // 交易编号
			url:'api/main/ticker',
			data:{

			},success(response){
				if (response.data.code == 200) {
					store.state.ticker = response.data.data;
				}
			}
		});
	},
	// 系统汇率配置
	rates(){
		const ratesExpire = localStorage.getItem('ratesExpire');
		if (Number(ratesExpire) - Date.now() > 0) {
			store.state.app.rates = JSON.parse(localStorage.getItem('rates'));
		} else {
			method.posts({
				url:'api/me/currency/rate',
				data:{},
				success(response){
					store.state.app.rates = response.data.data;
					localStorage.setItem('rates',JSON.stringify(store.state.app.rates));
					localStorage.setItem('ratesExpire', JSON.stringify(Date.now() + 10000 * 60));
				}
			});
		}
	},
	currency(market){ // 获取当前市场交易对
		market = (market ? market : '');
		if (market.indexOf('_') != -1) {
			market = market.split('_')[1];
		}
		const pairsExpire = localStorage.getItem(`pairsExpire${market}`);
		if (Number(pairsExpire) - Date.now() > 0) {
			store.state.app.pairs = JSON.parse(localStorage.getItem(`pairs${market}`));
		} else {
			method.posts({
				url: 'api/me/coinSymbol/getCoinSymbolBySymbol?symbol='+market,
				data:{},
				success(response){
					if(response.status == 200){
						store.state.app.pairs = response.data.data;
						localStorage.setItem(`pairs${market}`,JSON.stringify(store.state.app.pairs));
						localStorage.setItem(`pairsExpire${market}`, JSON.stringify(Date.now() + 10000 * 60));
					}
				}
			});
		}
	},
	allMarket(){ // 获取全部交易市场
		method.posts({
			url:'api/v2/pairAll',
			data:{
			},success(response){
				if (response.data.status == 200) {
					store.state.app.market = response.data.data;
				}
			}
		});
	},
	getCoins(){ // 获取币种列表
		method.posts({
			url: 'api/me/balance/info',
			data:{},
			success(response){
				if(response.status == 200){
					store.state.app.coins = response.data.data;  
					localStorage.setItem('coins',JSON.stringify(store.state.app.coins));
				}
			}
		});
	},
	onSetFav(item){ // 设置自选
		method.checkExpire(true, true, ()=>{
			if (store.state.isLogin) {
				item.isFav = !item.isFav;
				method.posts({
					url: 'api/me/coinUserchoose/insert',
					data:{
						pair: item.pair
					},
					success(response){
						if(response.data.status == 200){
							
						}
					}
				});
			}
		});
	},
	onCancelFav(item){ // 取消自选
		method.checkExpire(true, true, ()=>{
			if (store.state.isLogin) {
				item.isFav = !item.isFav;
				method.posts({
					url: 'api/me/coinUserchoose/remove',
					data:{
						pair: item.pair
					},
					success(response){
						if(response.data.status == 200){
							
						}
					}
				});
			}
		});
	},
	signout(type, path){ // 退出
		localStorage.removeItem("token");
		localStorage.removeItem("tradeToken");
		localStorage.removeItem("user");
		localStorage.removeItem('login');
		localStorage.removeItem('coins');
		localStorage.removeItem('loginTime');
		localStorage.removeItem('expire');
		localStorage.removeItem('areaCode');
		localStorage.removeItem('setFundPsw');
		localStorage.removeItem('defaultRate');
		localStorage.removeItem('nowStatus');
		
		localStorage.removeItem('ratesExpire');
		localStorage.removeItem('market');
		localStorage.removeItem('coinsPlaceholderExpire');
		localStorage.removeItem('banner');
		localStorage.removeItem('pairs');
		localStorage.removeItem('pairsExpireUSDT');
		localStorage.removeItem('marketAllExpire');
		localStorage.removeItem('marketAll');
		localStorage.removeItem('coins');
		localStorage.removeItem('rates');
		localStorage.removeItem('bannerExpire');
		localStorage.removeItem('pairsUSDT');
		localStorage.removeItem('pairsExpire');
		localStorage.removeItem('coinsPlaceholder');
		localStorage.removeItem('walletData');
		store.state.isLogin = false;
		if(type == "clear"){
			return;
		}else if(type == "needback"){
			_vm.$router.push({name:'signin',query:{path:path}});
		}else{
			_vm.$router.push({name:'signin'});
		}
	},

	checkFundPsw(){ // 是否设置资金密码
		method.posts({
			url: 'api/me/user/hasTransactionPin',
			data:{},
			success(response){
				if(response.data.status == 200){
					localStorage.setItem('setFundPsw',response.data.data);
				}
			}
		});
	},
	
    goto(name,params){
        _vm.$router.push({name, params})
    },

    //保存图片
    savePic(target) {
        if(target.tagName == 'IMG' && target.currentSrc.length > 0 ) { //确保图片链接不为空
			var imgUrl = target.src;
            var suffix = method.cutImageSuffix(imgUrl);
            _vm.$dialog.confirm({
					title:_vm.$t('activity.saveImg'),
					message:_vm.$t('other.isSaveImg'),
					confirmButtonText:_vm.$t('button.public.confirm'),
					cancelButtonText:_vm.$t('button.public.cancel'),
				}).then(()=>{
                var timestamp = (new Date()).valueOf();
                var downLoader = plus.downloader.createDownload(imgUrl, {
                    method: 'GET',
                    filename: '_downloads/image/' + timestamp+'.png'
                }, function(download, status) {
                    var fileName = download.filename;
                    plus.gallery.save(fileName, function() {
                        _vm.$toast(_vm.$t('message.public.imgSuc'));
                    });
                });
                downLoader.start();
            }).catch(() => {});
        }
    },
    cutImageSuffix(imageUrl) {
        var index = imageUrl.lastIndexOf('.');
        return imageUrl.substring(index);
    },
    clickNotice(url){
		method.goto('announcementDetail',{url:url});
	},
}
export default method;