import store    	from '@/store/index';
import api      	from '@/config';
import qs       	from "qs";
import axios    	from 'axios'

const method = {
    ApiUrl: api.baseUrl + "/platform/",
	post(pram){
        axios.post(method.ApiUrl + pram.url,JSON.stringify(pram.data),{
            headers:{
            	'token':!localStorage.getItem('token')?'':localStorage.getItem('token'),
            	'lang':localStorage.getItem('language')?localStorage.getItem('language'):"en-US"
            }
        }).then((response)=>{
            if(pram.data.noNeedCode){
                pram.success(response);
                return;
            }
            if(response.data.code != 200 && response.data.code != 410){ //失败
                _vm.$toast.fail(response.data.message);
                pram.success(response);
            }else{ pram.success(response); }

        }).catch((error)=>{ console.log(error); });
    },
	
	stabilize:  'USDT',
	tvurl:      api.baseUrl + "/platform/chart",
	wsurl:      api.wssUrl  + "/platform/socket.io",
	nettyWsurl: api.nettyWssUrl  + "/trade/socket.io",
	uploadurl:  api.baseUrl + "api/v1/",
	chaturl:    api.chatWsUrl + "/chat/socket.io",
	drawWsUrl:  api.drawWsUrl + "/draw/socket.io",
	v:1.000, 
	
	//版本控制
	checkVersion(){
	    method.post({
	        url: 'version',
	        data: {
	            noNeedCode:true
	        },
	        success(response){
	            let datas = response.data.data;
	            if(plus.os.name != "Android"){ //IOS
	                if(plus.runtime.version < datas.iosVersion){
	                    _vm.$dialog.confirm({
	                        title: '发现Ios新版本 V'+ datas.iosVersion,
	                        message: '是否立刻更新？'
	                    }).then(() => {
	                        plus.runtime.openURL(datas.iosAddress,()=>{
	                        	//下载新版本失败，请去Btbit官网下载
	                        });
	                    }).catch(() => {});
	                }
	            }else{
	                if(plus.runtime.version < datas.androidVersion){
	                    _vm.$dialog.confirm({
	                        title: '发现Android新版本 V'+ datas.androidVersion,
	                        message: '是否立刻更新？'
	                    }).then(() => {
	                        plus.runtime.openURL(datas.androidAddress,()=>{
	                        	//下载新版本失败，请去Btbit官网下载
	                        });
	                    }).catch(() => {});
	                }
	            }
	        },error(error){

	        }
	    });
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
	post(pram){
	    axios.post(method.ApiUrl + pram.url,JSON.stringify(pram.data),{
	        headers:{'token':localStorage.getItem('token')}
	    }).then((response)=>{
	        if(pram.data.noNeedCode){
	            pram.success(response);
	            return;
	        }
	
	        if(response.data.code != 200 && response.data.code != 410 ){ //失败
	        	method.checkLogin('clear',()=>{
	        		if (store.state.isLogin) {
	            		_vm.$toast.fail(response.data.message);
	        		}
	        	});
	            pram.success(response);
	        }else{ pram.success(response); }
	
	    }).catch((error)=>{ console.log(error); });
	},
	posts(pram){ // 自动退出
	    axios.post(method.ApiUrl + pram.url,JSON.stringify(pram.data),{
	        headers:{'token':localStorage.getItem('token'),
	    			 'lang':localStorage.getItem('language')?localStorage.getItem('language'):"en-US"}
	    }).then((response)=>{
	        if(response.data.code != 200){ //失败
	            if (response.data.code == 410) {
	                method.signout('needback', _vm.$route.path);
	            } else {
	                if (response.data.code != 401) {
	                    _vm.$toast.fail(response.data.message);
	                }
	                pram.success(response);
	            }
	        }else{ pram.success(response); }
	    }).catch((error)=>{ console.log(error); });
	},
	upload(pram){
	    axios.post(method.ApiUrl + pram.url,pram.data,{
	        headers:{
	            'token':localStorage.getItem('token'),
	            "Content-Type": "multipart/form-data"
	        }
	    }).then((response)=>{
	        if(response.data.code != 200){ //失败
	            if (response.data.code == 606) {
	                method.signout('needback', _vm.$route.path);
	            } else {
	                if (response.data.code != 401) {
	                    _vm.$toast.fail(response.data.message);
	                }
	                pram.success(response);
	            }
	        }else{ pram.success(response); }
	    }).catch((error)=>{ console.log(error); });
	},   
	get(pram){
	    axios.get(method.ApiUrl + pram.url,qs.stringify(pram.data)).then((response)=>{
	        if(response.data.code != 200){ //失败
	            _vm.$toast.fail(response.data.message)
	        }else{ pram.success(response); }
	    }).catch((error)=>{ console.log(error); });
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
        console.log(scripts[i])
	    s[i].setAttribute("src",scripts[i]);
	    if(id){
	    	s[i].setAttribute("id",id);
	    }
	    HEAD.appendChild(s[i]);
	  };
	  recursiveLoad(0);
	},
	getKyc(callback){
		method.post({
			url:'kyc/details',
			data:{},success(res){
				if(res.data.code==200) {
					store.state.user.kycState = res.data.data.state;
					if(typeof(callback)=="function"){
						callback(store.state.user.kycState)
					}
				}
			}
		});
	},
	

	//================新方法=================
	isEmpty(object){
	    for(var key in object){
	        return false
	    }
	    return true;
	},
	getVs(symbol, idx){ // 根据symbol获取
	    if (symbol) {
	        if (symbol.indexOf('_') != -1) {
	            return symbol.split('_')[ idx];
	        } else {
	            _vm.$router.push({name:'home'})
	        }
	    }
	},
	gourl(name,params){
	    _vm.$router.push({name, })
	},
	initPage(){
	    store.state.app.loading = false;
	    store.state.app.finished = false;
	    store.state.app.vanList = [];
	},
	loading(page){
	    if (page) {
	        // vant list 临时数据
	        let list = store.state.app.vanList;
	        list = list.concat( page.list);
	        store.state.app.loading = false;
	        if ( list.length >= page.total || list.length == 0) {
	            store.state.app.finished = true;
	        }
	        store.state.app.vanList = list;
	    } else { // 没有数据
	        store.state.app.loading = false;
	        store.state.app.finished = true;
	    }
	},
	copy(value){
	    _vm.$copyText(value).then(function (e) {
	        _vm.$toast("复制成功!")
	    }, function (e) {
	        _vm.$toast("复制失败!")
	    })
	},
	mustBondAll(){
		if(method.getUserValue('email')&&method.getUserValue('mobile')){
			
		}else{
			_vm.$router.push({name:"safe"})
			_vm.$toast(_vm.$t('form.needMobileOrEmail'))
		}
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
	checkLogin(type, callback, path){ // 用户登录 获取 服务器时间戳
	    method.post({
	        url:'user/timestamp',
	        data:{
	        },success(response){
	            if (response.data.code == 410 || response.data.code == 400) {
	                method.signout(type, path); // 去登录
	            } else{
	                store.state.isLogin = true;
	                store.state.timestamp = response.data.data
	            }
	            // 执行回调
	            callback ? callback( store.state.isLogin) : '';
	        }
	    });
	},
	configure(){ // 配置中心
	    method.post({
	        url:'coin',
	        data:{
	        },success(response){
	            if (response.data.code == 200) {
	                store.state.coin = response.data.data;
	            }
	        }
	    });
	},
	// 系统汇率配置
	rates(){ 
	    method.post({
	        url:'rate',
	        data:{
	        },success(response){
	            if(response.data.code == 200){
	                store.state.rates = response.data.data;
	            }
	        }
	    });
	},
	currency(){
		method.post({
	        url:'currency',
	        data:{
	        },success(response){
	            if ( response.data.code ==200) {
	                store.state.currency = response.data.data;
	            }
	        }
	    });
	},
	market(){
		method.post({
	        url:'market',
	        data:{
	        },success(response){
	            if ( response.data.code ==200) {
	                store.state.app.market = response.data.data;
	            }
	        }
	    });
	},
	//otc 聊天消息方法
	onmessage(event){
        // 提示新消息
        //消息列表
        let list = store.state.chatData.list;
        //编号
        let no = store.state.chatData.no;
        // 缓存到页面
        let ws = JSON.parse(event.data);
        if ( ws.type == 'NUMBER') {
        	store.state.newChat = ws.data;
        } else {
	        if(ws && no && ws.orderNo == no){
	        	store.state.chatData.no = ws.orderNo;
	        	list = list.concat( ws.data);
	        }else{
	        	store.state.chatData.no = ws.orderNo;
	        	list = ws.data;
	        }

	        store.state.chatData.list = list;
        }
    },
	favor(callback){
	    method.post({
	        url:'user/favor',
	        data:{
	        },success(response){
	            if(response.data.code==200){
	                store.state.favor = response.data.data;
	                if(typeof(callback)=="function"){
	                    callback()
	                }
	            }
	        }
	    });
	},
	initGt(ready,callback){ // 初始化极验
	    method.post({
	        url:'user/geetest',
	        data:{
	        },success(response){ 
	            if(response.data.code==200) {
	                initGeetest({
	                    lang:'en', 
	                    gt:response.data.data.gt,
	                    challenge:response.data.data.challenge,
	                    product:"bind",
	                    offline:!response.data.data.success
	                }, ready);
	                callback(response.data.data);// 执行回调
	            }
	        }
	    });
	},
	signout(type, path){
		let token = localStorage.getItem("token");
		if (token) {

		    method.post({
		        url: 'user/logout',
		        data: {
		        	noNeedCode:true
		        },
		        success(response){}
		    });
		}
	    localStorage.removeItem("token");
	    localStorage.removeItem("user");
	    store.state.isLogin = false;
	    if(type == "clear"){
	        return;
	    }else if(type == "needback"){
	        _vm.$router.push({name:'signin',query:{path:path}});
	    }else{
	        _vm.$router.push({name:'signin'});
	    }
	},
    goto(name,params){
        _vm.$router.push({name, params})
    },


    //保存图片
    savePic(target) {
        if(target.tagName == 'IMG' && target.currentSrc.length > 0 ) { //确保图片链接不为空
            var imgUrl = target.src;
            var suffix = method.cutImageSuffix(imgUrl);
            _vm.$dialog.confirm({title:'保存图片',message:'是否保存此图片？'}).then(()=>{
                var timestamp = (new Date()).valueOf();
                var downLoader = plus.downloader.createDownload(imgUrl, {
                    method: 'GET',
                    filename: '_downloads/image/' + timestamp+'.png'
                }, function(download, status) {
                    var fileName = download.filename;
                    plus.gallery.save(fileName, function() {
                        _vm.$toast("保存成功" );
                    });
                });
                downLoader.start();
            }).catch(() => {});
        }
    },
    cutImageSuffix(imageUrl) {
        var index = imageUrl.lastIndexOf('.');
        return imageUrl.substring(index);
    }



}
export default method;