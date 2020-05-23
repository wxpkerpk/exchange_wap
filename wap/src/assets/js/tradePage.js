import store    from '@/store/index'

const tradePage = {
    verifyNumber(num){ // 驗證輸入是否為數字
        //let reNum = /^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;    
        let reNum = /^[0-9]+.?[0-9]*$/;
        return reNum.test(num)
    },
    market(){
        let coinPair = _vm.$store.state.coinPair;
        if(coinPair){
            return coinPair.split("-")[1];
        }
        return '';
    },
    clearData(){ // 清除数据
        _vm.$store.state.ws.tick = {};
        _vm.$store.state.ws.buys = null;
        _vm.$store.state.ws.sells = null;
        // _vm.$store.state.ws.capital = {};
        _vm.$store.state.ws.actives = null;
        _vm.$store.state.ws.history = [];
    },
    format(data, field, digit){
        let res = '';
        switch( field) {
            case 'close':
                res = tradePage.fmtZero(data[field],digit);
                break;
            case 'changeRange':
                res = '<span class="zdbtn ' +
                
                tradePage.rangeClass( data[field])
    
                + '"> '+
                // 显示值
                Number(data[field]*100).toFixed(2) + '%'
                + '</span>';
                break;
            case 'changeValue':
                res = '<span class="' +
                tradePage.rangeClass( data[field]) +'"> ' +
                // 显示值
                tradePage.fmtZero(data[field], digit)
                + '</span>';
                break;    
            case 'money':
                let c = tradePage.getCurrency(data['market']); // 当前汇率
                if (c) {
                    res = '≈ ' + Number(c.last * data['close']).toFixed(2) + ' ' + c.symbol;
                } else {
                    let currency = localStorage.getItem('rate')?localStorage.getItem('rate'):_vm.$store.state.currency;

                    res = '≈ ' + '0.00 ' + currency;
                }
                break;
            case 'total':
                res = tradePage.toThousands( tradePage.fmtZero( data[field], digit));
                break;
            default:
                res = tradePage.fmtZero(data[field], digit);
                break;  
        }
        return res;
    },
    rangeClass(range){
        let c = Number(range);
        if(!c || c == 0){
            return '';
        }
        return c > 0 ? 'buycolor green' : 'sellcolor red';
    },
    type(value){
        if (value) {
            return value == 'BUY' ? '买入':'卖出';
        }
        return '买入'
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
            str = tradePage.fmtZero(v,digit);
        } else if(v > 1000){ // 千
            str = tradePage.fmtZero(Number(v/1000).toFixed(digit)) + 'K';
        } 
        // else { // 百万
        //     str = tradePage.fmtZero(Number(v/1000000).toFixed(digit)) + 'M';
        // }
        return str;
    },
    money(value, market){
        let c = tradePage.getCurrency(market); // 当前汇率
        let currency = localStorage.getItem('rate')?localStorage.getItem('rate'):_vm.$store.state.nowCurrency;
        if (!c) {
            // 获取当前汇率
            return '≈ 0.00 ' + currency;  
        } else {
            let n = isNaN(tradePage.fmtZero(Number(c.last * value).toFixed(2)))?"--":tradePage.fmtZero(Number(c.last * value).toFixed(2))

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
    getNotZeroLength(price,l){ // 从末尾开始不为0的长度
        if(typeof(price) == 'undefined' || price == 'NaN'){
            price = 0;
        }
        l = typeof(l) != 'function' && typeof(l) != 'undefined'?l:8;
    
        if(String(price).indexOf("e") != -1 ||
            String(price).indexOf("E") != -1){
            price = Number(price).toFixed(l);
        }else{
            price = Number(price).toFixed(l)
        }
    
        let length = 0;
        let str = tradePage.formartNumber(price,l);
        if( str.indexOf(".") == -1){
            return l;
        }
        let nz = str.split(".")[1];
        for(let i = 0;i < nz.length;i ++){
            if( nz.charAt(i) != "0"){
                length = i;
                break;
            }
        }
        return nz.length - length;
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
    getCoins(coins, balance, type){
        let result = [];
        for(let i = 0;i < coins.length;i ++) {
            var coin = coins[i];
            if( type && type == 'IN' && coin.allowIn == 'N'){
                continue;
            }
            if( type && type == 'OUT' && coin.allowOut == 'N'){
                continue;
            }
            if(balance && balance.length>0){
                for(let x = 0;x < balance.length;x ++) {
                    if( coin.symbol == balance[x].symbol){
                        let bal = balance[x]['balance'][0];
                        coin['block'] = tradePage.formartNumber(bal.block);
                        coin['useable'] = tradePage.formartNumber(bal.useable);
                        coin['address'] = bal.address;
                        result.push( coin);
                    }
                }
            } else {
                coin['block'] = tradePage.formartNumber(0);
                coin['useable'] = tradePage.formartNumber(0);
                coin['address'] = '';
                result.push( coin);
            }
        }
        return result;
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
    formartNumber(price,l){
        if(typeof(price) == 'undefined' || price == 'NaN'){
            price = 0;
        }
        // 不删多余的0，最多8（参数）位小数 格式化科学计数法/超过8位 备用
        let length = typeof(l) != 'function' && typeof(l) != 'undefined'?l:8;
        
        if(String(price).indexOf("e") != -1 ||
            String(price).indexOf("E") != -1){
            price = tradePage.convertNumber(price);
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
    fmtNT(price,step){
        step = step?step:8;
        if(String(price).indexOf("e") != -1 ||
            String(price).indexOf("E") != -1){
            price = Number(price).toFixed(step);
        }     //    
        return price;
    },
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
    //定时获取所有法币汇率并存储进localStorage 
    setAllCurrency(){
        _vm.$mts.posts({
            url: 'wallet/currencies',
            data:{},
            success(response){
                if(response.data.code == 200){
                    _vm.$store.state.rates = response.data.data;
                    localStorage.setItem("rates",response.data.data);
                }
            }
        });
        return null
    },
    //半透明效果
    formartPrice(price,h,l){
        if(typeof(price) == 'undefined' || price == 'NaN'){
            price = 0;
        }
        let length = typeof(l) != 'function' 
                    && typeof(l) != 'undefined' ? l : 8;
        
        if(String(price).indexOf("e") != -1 ||
            String(price).indexOf("E") != -1){
            price = Number(price).toFixed(length);
        }
        let parr = String(price).split(".");
        let gz = parr[0];                           //整數部分
        let lz = parr.length <= 1 ? "" : parr[1];   //小數部分
        
        let nlz = '';
        for(let i = 0; i < length; i ++) {
            let c = i < lz.length ? lz.charAt(i) : '0';
            nlz += c;
        }
        let arr = nlz.split("");
        let index = 0;     // 为0的长度
        for(let i = arr.length - 1; i >= 0; i--){
            if(arr[i] != "0"){        //找到位數
                break;
            } else {
                index ++;      
            }
        }
        // 小数点前位数 + 小数点后不为0 的高亮
        let a = gz + '.';
        let b = '';
        if(index == 0){
            a += nlz;
        } else {
            a += nlz.substring(0, nlz.length - index);
            b = nlz.substring(nlz.length - index, nlz.length);
        }
        let divarr = [];
        if(h){
            if(b.length <= 0 || b == ""){
                divarr = [h('span',a)]
            }else{
                divarr = [h('span',a),h('span',{class:"op5"},b)]
            }
            return h('span',{},divarr);
        }else{
            if(b.length <= 0 || b == ""){
                return "<span>"+a+"</span>"
            }else{
                return "<span>"+a+"</span><span class='op5'>"+b+"</span>"
            }
        }
    
    },
    dateFormat(fmt,date){   
      var o = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
      };   
      if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      return fmt;   
    },
    getLastDealPrice(symbol, arr){
        let price = 0;
        for(let i = 0;i < arr.length;i ++){
            if( symbol == arr[i].symbol){
                price = Number(arr[i]['close']);
            }
        }
        return price;
    },
    setPrice(price,num){
        _vm.$store.state.tradePage.price     = '';
        _vm.$store.state.tradePage.num       = '';
        // 重新赋值
        _vm.$store.state.tradePage.price     = this.formartNumber(price);
        if(num){
            _vm.$store.state.tradePage.num   = this.formartNumber(num);
        }
    },
}
export default tradePage;