import store from '@/store/index'
import md5   from 'js-md5'

const market = {
    vPrice(){ // 根据语言获取对应法币价格
        // console.log(store.state.app.rates.CNY.price)
        // let rate = localStorage.getItem('defaultRate');
        // if (store.state.app.rates && rate) {
        //     switch(rate){
        //         case 'CNY':
        //         case 'USD':
        //             return store.state.app.rates.USD.price;
        //         case 'EUR':
        //             return store.state.app.rates.EUR.price;
        //         case 'JPY':
        //             return store.state.app.rates.JPY.price;
        //         case 'GDP':
        //             return store.state.app.rates.GDP.price;
        //         default: 
        //             return store.state.app.rates.USD.price;
        //     } 
        // } else {
        //     return 0;
        // }
        return store.state.app.rates.CNY.price;
    },
    vSymbol(){ // 根据语言获取对应法币符号
        // let rate = localStorage.getItem('defaultRate');
        // if (store.state.app.rates && rate) {
        //     switch(rate){
        //         case 'CNY':
        //             return store.state.app.rates.CNY.unit;
        //         case 'USD':
        //             return store.state.app.rates.USD.unit;
        //         case 'EUR':
        //             return store.state.app.rates.EUR.unit;
        //         case 'JPY':
        //             return store.state.app.rates.JPY.unit;
        //         case 'GDP':
        //             return store.state.app.rates.GDP.unit;
        //         default: 
        //             return store.state.app.rates.USD.unit;
        //     }  
        // } else {
        //     return 0;
        // }
        return store.state.app.rates.CNY.unit;
    },
    VCoinType(){
        // let rate = localStorage.getItem('defaultRate');
        // if (store.state.app.rates) {
        //     switch(rate){
        //         case 'CNY':
        //             return 'CNY';
        //         case 'USD':
        //             return 'USD';
        //         case 'EUR':
        //             return 'EUR';
        //         case 'JPY':
        //             return 'JPY';
        //         case 'GDP':
        //             return 'GDP';
        //         default: 
        //             return 'USD';
        //     }  
        // }
        return 'CNY';
    },
    vMoney(worth){
        if (worth) {
            let value = Number(worth) * market.vPrice();
            return "≈ " + market.vSymbol() + Number(value).toFixed(2)
        }
        return "≈ " + market.vSymbol()+ "0.00";
    },
    vColor(num){
        if(num > 0){
            return "rise"
        }else if(num < 0){
            return "fall"
        }else{
            return "normal"
        }
    },
    vMColor(num){ 
        if(num > 0){
            return "green"
        }else if(num < 0){
            return "red"
        } else {
            return "normal";
        }
    },
    vArrow(num){
        if(num > 0){
            return "↑"
        }else if(num < 0){
            return "↓"
        } else {
            return "";
        }
    },
    vToken(pair, step){
        if (pair) {
            return pair.split('_')[step];
        }
    },
    vPair(pair){
        pair = pair || 'BTC_USDT';
        return pair.replace('_', '/')
    },
    format(data, field, digit){
        let res = '';
        if(field > 0){
            res = '+' + (Number(field*100).toFixed(2)) + '%';
        }else if(field < 0){
            res = (Number(field*100).toFixed(2))+ '%';
        }else{
            res = (Number(field*100).toFixed(2)) + '%';
        }
        return res;
    },
    riseSort(sort){ // 升序
        return function(a,b){
            var value1 = a[sort];
            var value2 = b[sort];
            return value1 - value2;
        }
    },
    fallSort(sort){ // 降序
        return function(a,b){
            var value1 = a[sort];
            var value2 = b[sort];
            return value2 - value1 ;
        }
    },
    vTradeColor(type){
        switch(type){ 
            case 'FULL_COMPLETED':
                return 'green';
            case 'PENDING':
                return 'red';
            case 'PARTIAL_COMPLETED':
                return 'green';
            default:
                return 'red';;
        }
    },
    volume(value, den){ // 获取深度
        let digit = 2;
        let v = Number(value)/Number(den);
        return 'width:' + Number(v * 100).toFixed(2) + '%';
    },
    meter(value, digit){ // 获取计量值
        digit = digit?digit:4;
        let str = value;
        let v = Number( value);
        if (v < 1000) {
            str = market.fmtZero(v,digit);
        } else if(v > 1000){ // 千
            str = market.fmtZero(Number(v/1000).toFixed(digit)) + 'K';
        } 
        // else { // 百万
        //     str = market.fmtZero(Number(v/1000000).toFixed(digit)) + 'M';
        // }
        return str;
    },
    money(value, market){
        let c = market.getCurrency(market); // 当前汇率
        let currency = localStorage.getItem('rate')?localStorage.getItem('rate'):_vm.$store.state.nowCurrency;
        if (!c) {
            // 获取当前汇率
            return '≈ 0.00 ' + currency;  
        } else {
            let n = isNaN(market.fmtZero(Number(c.last * value).toFixed(2)))?"--":market.fmtZero(Number(c.last * value).toFixed(2))

            return '≈ ' + n + ' ' + c.symbol;
        }
    },
    getDecimalLength(price){
        if(typeof(price) == 'undefined' || price == 'NaN'){
            return 0;
        }
        price = String(price);
        if(price.indexOf(".") == -1){
            return 0;
        }
        let dl = price.split(".")[1];
        return dl.length;
    },
    
    toThousands(nStr) {  
        nStr += ''; 
        let x = nStr.split('.'); 
        let x1 = x[0]; 
        let x2 = x.length > 1 ? '.' + x[1] : ''; 
        let rgx = /(\d+)(\d{3})/; 
        while (rgx.test(x1)) { 
            x1 = x1.replace(rgx, '$1' + ',' + '$2'); 
        } 
        return x1 + x2; 
    },
    convertNumber(price){
        // 科学计算法转换
        var numStr = String(price).toLowerCase();               //1.1e-7
        var numLeft = numStr.split("e")[0];                     //1.1
        var numLast = numStr.split("e")[1].replace("-","") - 1; //7 - 1 = 6;
        numLeft = numLeft.replace(".","");                      //11
    
        var numMiddle = "";
        for(var i=0;i<numLast;i++){
            numMiddle+="0"
        }
        var done = "0." + numMiddle + numLeft;
        return done;
    },
    fmtNum(price,l){ // 格式化保留小位数
        if(typeof(price) == 'undefined' || price == 'NaN'){
            price = 0;
        }
        // 不删多余的0，最多8（参数）位小数 格式化科学计数法/超过8位 备用
        let length = typeof(l) != 'function' && typeof(l) != 'undefined'?l:8;
        
        if(String(price).indexOf("e") != -1 ||
            String(price).indexOf("E") != -1){
            price = market.convertNumber(price);
        }
    
        let gz = '';
        let lz = '';
        // 如果数字中不包含小数点
        if(String(price).indexOf('.') == -1){
            gz = String(price);
        } else {
            let parr = String( price).split(".");
            gz = parr[0];
            lz = parr.length <= 1 ? "" : parr[1];
        }
        
        let nlz = '';
        for(let i = 0; i < length; i ++) {
            let c = i < lz.length ? lz.charAt(i) : '0';
            nlz += c;
        }
        price = gz + '.' + nlz;
        return price;
    },
    //不删多余的0，最多8（参数）位小数 格式化科学计数法
    fmtZero(price,step){
        // 删多余的0 最多八位
        step = step?step:8;
    
        if(String(price).indexOf("e") != -1 ||
            String(price).indexOf("E") != -1){
            price = Number(price).toFixed(step);
        }
        let parr = String(price).split(".");
        let gz = parr[0];
        let lz = parr.length <= 1 ? "" : parr[1];
        let zeroLength = 0;
        for(let m = lz.length -1;m >= 0;m --){
            if(lz.charAt(m) == '0'){
                zeroLength ++;
            } else {
                break;
            }
        }
        let length = lz.length > step ? step : (lz.length - zeroLength);
        let nlz = '';
        for(let i = 0; i < length; i ++) {
            let c = i < lz.length ? lz.charAt(i) : '0';
            nlz += c;
        }
        price = gz + '.' + nlz;
        if(nlz==""){
            price = gz;
        }
        return price;
    },
    getCurrency(market){
        //系统当前汇率
        let entryKey = localStorage.getItem('rate')?localStorage.getItem('rate'):_vm.$store.state.nowCurrency;
    
        // 当前所有的汇率
        let rates = _vm.$store.state.rates;
        if ( rates && rates[ market]) {
            let list = rates[ market];
            for (let idx = 0;idx < list.length;idx ++) {
                if ( entryKey === list[idx].symbol) {
                    return list[idx];
                }
            } 
        }      
        return null;
    },
    dateFormat(fmt,date){
        var date = new Date(date);
        let ret;
        let opt = {
            "y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;  
    },
    getLastDealPrice(symbol, arr){ // BTC - USDT
        let price = 0;
        for(let i = 0;i < arr.length;i ++){
            if( symbol == arr[i].symbol){
                price = Number(arr[i]['close']);
            }
        }
        return price;
    },
	isEmpty(object){
		for(var key in object){
			return false
		}
		return true;
	},
    getPairField(pair, field){
        let array = store.state.app.pairs;
        let c1 = market.vToken(pair, 0);
        let c2 = market.vToken(pair, 1);
        for (var i = array.length - 1; i >= 0; i--) {
            let item = array[i];
            if (item.coinCode ==  c1 && item.symbol == c2) {
                return item[field];
            }
        }
    },
    getScale(array, pair, step){
        if (array && array.length > 0) {
            let s = (pair && pair.indexOf('_') 
                                ? pair.split('_')[0] : 'BTC');
            let m = (pair && pair.indexOf('_') 
                                ? pair.split('_')[1] : 'USDT');
            for (var i = array.length - 1; i >= 0; i--) {
                let item = array[i]
                if (s == item.coinCode
                    && m == item.symbol) {
                    return step ? item.priceScale : item.amountScale;
                }
            }
        }
        return 8;
    },
    getTokenScale(coinCode){
        let array = store.state.app.coins;
        let list = array.balance || [];
        let usdt = null, now = null;
        for (var i = list.length - 1; i >= 0; i--) {
            if(list[i].coinCode == coinCode){
                now = list[i].scale;
            }
            if(list[i].coinCode == 'USDT'){
                now = list[i].scale;
            }
        }
        return now ? now : usdt;
    },
    getTokenScale(list,coinCode){
        let usdt = null, now = null;
        for (var i = list.length - 1; i >= 0; i--) {
            if(list[i].coinCode == coinCode){
                now = list[i].scale;
            }
            if(list[i].coinCode == 'USDT'){
                now = list[i].scale;
            }
        }
        return now ? now : usdt;
    },
    makeSign(param){
        let str = "";
        // 交易数量
        str += "number=" + market.fmtZero(param.number) + "&";
        // 交易对
        str += "pair=" + param.pair + "&";
        // 交易价格
        str += "price=" + market.fmtZero(param.price) + "&";
        // 时间戳
        str += "time=" + param.time + "&";
        // 交易token
        str += "token=" + localStorage.getItem('tradeToken') + '&';
        // 交易类型
        str += "type=" + param.type;
        return String(md5(str)).toLowerCase();
    },
    makeUid(id){
        id = String(id);
        if (id.length > 5) {
            return id;
        }
        return market.makeUid("0" + id);
    },
    hideName(value){
        if (value) {
            let check = _vm.$vld.checkValue(value, 'email');
            if (check) {
                return value.replace(/(\w?)(\w+)(\w)(@\w+\.[a-z]+(\.[a-z]+)?)/, "$1****$3$4")
            } else {
                return value.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")
            } 
        }
        return '***';
    },
    hideCode(value){
        if (value) {
            if (value.length < 6) {
                return value.substr(0,1)+'***'+value.substr(value.length-2,value.length);
            }
            return value.substr(0, 3)+'******'+ value.substr(value.length - 3, value.length);
        }  
        return '***';
    },
    vCnField(item, field){
        let lang = localStorage.getItem('language');
        if (lang == 'zh-CN') {
            return item[field+'Cn'] ? item[field+'Cn'] : item[field];
        }   
        return item[field];
    },
    getSplit(url){ // 获取url键值对
        if(!/\?/.test(url)) {
            return null;
        }
        let index = url.indexOf("?") + 1;
        let str = url.substr(index);
        let arr = str.split("&");
        let obj = {};
        for(let i = 0; i < arr.length; i++) {
            let newarr = arr[i].split("=");
            obj[newarr[0]] = newarr[1];
        }
        return obj;
    },
    checkNumber(value){
        // let value
    },
    getZendeskLang(){
        let lang = localStorage.getItem('language') || 'zh-CN'
        return lang == 'zh-CN' ? 'zh-cn' : 'en-001';
    },
}

export default market;