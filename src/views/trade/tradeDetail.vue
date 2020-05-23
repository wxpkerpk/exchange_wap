<template>  
    <div class="flexPage">
        <div class="flexHead">
            <div class="back">
                <i class="iconfont iconreturn" @click="goBack" />
                <span class="coinType" @click="$router.push({path:'/search',query:{backUrl: 'tradedetail'}})">{{defaultPair.split('_')[0]+'/'+defaultPair.split('_')[1]}}<i class="iconfont iconClick" /></span>
                <i class="iconfont iconfavorites" v-if="!nowCoin[0].isFav" @click="$mts.onSetFav(nowCoin[0])" />
                <i class="iconfont iconfavorites_selected" v-if="nowCoin[0].isFav" @click="$mts.onCancelFav(nowCoin[0])" />
            </div>
        </div>
        <div class="flexContent">
            <div class="tradeWrapper">
                <div class="tradeTop flexLevel" v-for="(item,index) in nowCoin" :key="index">
                    <div class="lt">
                        <div class="change">
                            <p :class="colorClass">
                                <b>{{$mkt.fmtZero(item.price, priceScale)}}</b>
                                <span v-if="colorClass != 'normal'" class="arrow">{{$mkt.vArrow(item.chg ? item.chg : item.gain_24)}}</span>
                            </p>
                            <div class="equal">
                                <span class="normal">{{$mkt.vMoney(item.price)}}</span>
                                <span class="percent" :class="$mkt.vMColor(item.gain_24)">{{Number(item.gain_24*100).toFixed(2)}}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="rt flexLevel">
                        <dl>
                            <dt>{{'24H '+$t('table.high')}}</dt>
                            <dd>{{$mkt.fmtZero(item.max_24h, priceScale)}}</dd>
                        </dl>
                        <dl>
                            <dt>{{'24H '+$t('table.low')}}</dt>
                            <dd>{{$mkt.fmtZero(item.min_24h, priceScale)}}</dd>
                        </dl>
                        <dl>
                            <dt>{{'24H '+$t('table.volume')}}</dt>
                            <dd>{{$mkt.fmtZero(item.vol, amountScale)}}</dd>
                        </dl>
                    </div>
                </div>
                <div class="changeTime">
                    <ul>
                        <li v-for="(item,index) in resolutions" :key="index" :class="{active: active == index}" @click="changeRes(index)">
                            {{item.name}}
                        </li>
                        <li :class="{active: active == -1}" @click="onChangeTime(-1)">
                            {{$t('trade.canvas.times')}}
                            <dl class="times" v-if="showtimes">
                                <dd v-for="(item,index) in times" :key="index" @click="onChangeTab(item.ratio)">{{item.name}}</dd>
                            </dl>    
                        </li>  
                    </ul>    
                </div> 
                <div class="Kline-div">
                    <!-- <div class="kline-tick">
                        <p>
                            <span><b>n</b></span>
                            <span>{{$t('form.kline.open')}}:<b>n</b></span>
                            <span>{{$t('form.kline.high')}}:<b>n</b></span></p >
                        <p>
                            <span>{{$t('form.kline.low')}}:<b>n</b></span>
                            <span>{{$t('form.kline.close')}}:<b>n</b></span>
                        </p >
                    </div> -->
                    <p class="kline-volume">
                        <span>{{$t('form.kline.volume')}}:<b class="volume">n</b></span>
                    </p>
                    <p class="kline-close">
                        <span>n</span>
                    </p>
                    <p class="kline-macd">
                        <span>MACD:<b class="macd">n</b></span>
                    </p>

                    <div id="tradeView" class="tradeView">
                    </div>
                </div>
                <div class="tradeDeep">
                    <div class="menuTabs">
                        <ul> 
                            <li v-for="(item,index) in tabs" :key="index" @click="clickHandle(index)" :class="{active: cur == index}">{{item}}</li>
                        </ul>
                    </div>
                    <div class="tradeList" v-if="cur == 0">
                        <dl class="title flexLevel">
                            <dd>{{$t('trade.buyNum')}}</dd>
                            <dd>{{$t('table.price')}}</dd>
                            <dd>{{$t('trade.sellNum')}}</dd>
                        </dl>
                        <div class="content flexLevel" style="align-items:baseline;">
                            <ul class="buy">
                                <li v-for="(item,index) in deepList.bids" :key="index">
                                    <span class="num">{{$mkt.fmtNum(item[1], amountScale)}}</span>
                                    <span class="price green">{{$mkt.fmtNum(item[0],priceScale)}}</span>
                                    <span class="dbg green" :style="$mkt.volume(item[2],denBids)"></span>
                                </li>
                            </ul>
                            <ul class="sell">
                                <li v-for="(item,index) in deepList.ask" :key="index">
                                    <span class="price red">{{$mkt.fmtNum(item[0],priceScale)}}</span>
                                    <span class="num">{{$mkt.fmtNum(item[1], amountScale)}}</span>
                                    <span class="dbg red" :style="$mkt.volume(item[2],denAsk)"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="tradeList" v-if="cur == 1">
                        <dl class="lastTitle">
                            <dd>{{$t('table.time')}}</dd>
                            <dd>{{$t('table.price')}}</dd>
                            <dd>{{$t('trade.executedNum')}}</dd>
                        </dl>
                        <div class="lastOrderList">
                            <ul>
                                <li v-for="(item,index) in tradeList" :key="index">
                                    <dl class="flexLevel">
                                        <dd>{{$mkt.dateFormat('HH:MM:SS',item.timestamp)}}</dd>
                                        <dd :class="item.direction == 'buy' ? 'green' : 'red'">{{$mkt.fmtNum(item.price, priceScale)}}</dd>
                                        <dd>{{$mkt.fmtNum(item.number, amountScale)}}</dd>
                                    </dl>
                                </li> 
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="tradeBtnBox flexLevel">
                    <span class="green" @click="onConfirm(0)">{{$t('trade.buyin')}}</span>
                    <span class="red" @click="onConfirm(1)">{{$t('trade.sellout')}}</span>
                </div>
            </div>
        </div>
    </div>
</template>  

<script>  
    export default {
        data(){
            return{
                firstCome: true,
                showSearch: false, // 搜索
                cur: 0, // 深度
                active: 2,
                tabs:[this.$t('trade.deep'),this.$t('trade.lastExecuted')] || [],
                den: 1,
                denAsk: 1,
                denBids: 1,
                defaultPair: this.$route.query.pair || 'BTC_USDT',
                size: 20 , // 每次请求条数
                // nowCoin: [{isFav: false}], // 当前币种信息
                showOrder: false, // 订单确认
                showFund: false, // 资金密码
                length: 1000,
                deep: 8,
                form:{
                    price: '',
                    number:'',
                    fund: '',
                },
                websocket: null,
                option: null,
                kline: null,
                userInfo:{},
                colorClass:'normal',
                timeoutDo:null,
                defaultIndex:1,
                resolutions: [
					{
						name: '1' + this.$t('trade.canvas.min'),
						value: 60,
						ratio: '1m'
					},
					{
						name: '5' + this.$t('trade.canvas.min'),
						value: 300,
						ratio: '5m'
					},
					{
						name: '15' + this.$t('trade.canvas.min'),
						value: 900,
						ratio: '15m'
					},
					{
						name: '1' + this.$t('trade.canvas.hour'),
						value: 3600,
						ratio: '1h'
					},
                ],
                showtimes:false,
                times:[
                    // {
					// 	name: '1' + this.$t('trade.canvas.min'),
					// 	value: 60,
					// 	ratio: '1m'
					// },
					// {
					// 	name: '5' + this.$t('trade.canvas.min'),
					// 	value: 300,
					// 	ratio: '5m'
					// },
					// {
					// 	name: '15' + this.$t('trade.canvas.min'),
					// 	value: 900,
					// 	ratio: '15m'
                    // },
					// {
					// 	name: '1' + this.$t('trade.canvas.hour'),
					// 	value: 3600,
					// 	ratio: '1h'
                    // },
                    {
						name: '4' + this.$t('trade.canvas.hour'),
						value: 7200,
						ratio: '4h'
                    },
                    {
						name: '8' + this.$t('trade.canvas.hour'),
						value: 14400,
						ratio: '8h'
                    },
                    {
						name: '12' + this.$t('trade.canvas.hour'),
						value: 28800,
						ratio: '12h'
                    },
                    {
						name: '1' + this.$t('trade.canvas.day'),
						value: 86400,
						ratio: '1d'
					},
                ],
                doClear: true,
            }
        },
        computed:{
            priceScale(){
                let that = this;
                let array = that.$store.state.app.pairs;
                return that.$mkt.getScale(array, that.defaultPair, true);
            },
            amountScale(){
                let that = this;
                let array = that.$store.state.app.pairs;
                return that.$mkt.getScale(array, that.defaultPair, false);
            },
            tradeList(){
                let that = this;
                return that.$store.state.ws.order;
            },
            deepList(){
                let that = this;
                const askTemp = that.$store.state.ws.depth.ask.slice(0, 20);
                const bidsTemp = that.$store.state.ws.depth.bids.slice(0, 20);

                askTemp.forEach((v, index) => {
                    v[2] = 0;
                    for(let i = 0; i <= index; i ++) {
                        v[2] += askTemp[i][1];
                    }
                });
                this.denAsk = askTemp.length ? askTemp[askTemp.length - 1][2] : 0;
                // askTemp.reverse();

                bidsTemp.forEach((v, index) => {
                    v[2] = 0;
                    for(let i = 0; i <= index; i ++) {
                        v[2] += bidsTemp[i][1];
                    }
                });
                this.denBids = bidsTemp.length ? bidsTemp[bidsTemp.length - 1][2] : 0;
                return {
                    ask: askTemp,
                    bids: bidsTemp,
                    current: that.$store.state.ws.depth.current
                };
            },
            nowCoin(){
                let that = this;
                let current = that.$store.state.ws.depth.current;
                if ( !current) {
                    current = {isFav: false};
                }
                return [current];
            }
        },
        components:{
        },
        beforeRouteLeave (to, from, next) {
            this.$mts.initPage();
            this.$mts.close();
            next();
        },
        beforeDestrory(){
            this.$mts.initPage();
            this.$mts.close();
        },
        mounted(){
            this.$mts.close();
            this.initPage();
            this.initCanvas();
        },
        watch:{
            "nowCoin":function(cur,old){
                let that = this;
                if (cur && old) {
                    let c = cur[0];
                    let cls = this.$mkt.vMColor(c.chg);
                    that.colorClass = cls;
                    clearTimeout(that.timeoutDo);
                    that.timeoutDo = setTimeout(function(){
                        that.colorClass = 'normal';
                    }, 2000);
                }
            }
        },
        methods:{
            initPage(){
                let that = this;
                that.$mts.rates(); 
                that.getMarketAll();
                that.getDeep();
                that.$mts.currency( that.defaultPair);
                that.$mts.connect( that.defaultPair, (data, kline = false)=>{
                    if (data.ask || data.bids) {
                        that.calcDepth(data);
                    } else if( kline) {
                        // console.log(data);
                        if (this.firstCome || data.length > 1) {
                            this.initData(data);
                            this.firstCome = false;
                        } else {
                            this.modifyData( data)
                        }
                    }
                }, '15m');
            },
            goBack(){
                let that = this;
                if(that.$route.query.back){
                    that.$router.push({name:that.$route.query.back});
                }else{
                    that.$router.push({path:'/trade',query:{pair:that.defaultPair}});
                }
            },
            onChangeTime(index){
                let that = this;
                that.showtimes = !that.showtimes;
                that.active = index;
            },
            clickHandle(index) {
                this.cur = index;
                if (index === 1) {
                    this.getTradeRecord();
                }
            },
            onChangeTab(value){
                let that = this;
                if (value) {
                    that.doClear = true;
                    that.$mts.subscribeKline(that.defaultPair, value);
                }  
            },
            calcDepth(data){
                let that = this;
                let ask = data.ask;

                let bid = data.bids;

                let asks = that.$store.state.ws.depth.ask || [];

                let bids = that.$store.state.ws.depth.bids || [];
                
                let newask = [];
                let ak = true;
                for (let i = 0; i < asks.length; i++) {
                    let a = asks[i];
                    for (var j = ask.length - 1; j >= 0; j--) {
                        let b = ask[j];
                        if (a[0] == b[0]) {
                            asks[i][1] = b[1];
                            ak = false;
                        }
                    }
                    if (Number(asks[i][1]) > 0) {
                        newask.push(a);
                    }
                }
                // 直接添加
                if ( ak) {
                    newask = newask.concat( ask);
                }

                newask = newask.filter((item)=>{
                    return item[1] > 0;
                });

                that.$store.state.ws.depth.ask = that.$mts.sort(newask, 'asc', 0);

                // 买盘数据
                let newbids = [];
                let bk = true;
                for (let i = bids.length - 1; i >= 0; i--) {
                    let a = bids[i];
                    for (var j = bid.length - 1; j >= 0; j--) {
                        let b = bid[j];
                        if (a[0] == b[0]) {
                            bids[i][1] = b[1];
                            bk = false;
                        }
                    }
                    if (Number(bids[i][1]) > 0) {
                        newbids.push(a);
                    }
                }
                if ( bk) {
                    newbids = newbids.concat( bid);
                }

                newbids = newbids.filter((item)=>{
                    return item[1] > 0;
                });
                
                that.$store.state.ws.depth.bids = that.$mts.sort(newbids, 'desc', 0);;
            },
            changeRes(index){
                let that = this;
                that.showtimes = false;
                if (that.active != index) {
                    that.active = index;
                    let item = that.resolutions[index];
                    // console.log(item);
                    if (item) {
                        that.doClear = true;
                        that.$mts.subscribeKline(that.defaultPair, item.ratio);
                    }  
                }
            },
            initCanvas() {
                let saveKlineData = [];
                const config = {
                    grid: {
                        horizontal: {
                        style: 'solid',
                        color: '#F8F8F8'
                        },
                        vertical: {
                        display: true,
                        style: 'solid',
                        color: '#F8F8F8'
                        }
                    },
                    candleStick: {
                        bar: {
                        upColor: '#0DBF7E',
                        downColor: '#FF4D4F',
                        noChangeColor:"#0DBF7E"
                        },
                        priceMark: {
                        last: {
                            upColor: '#0DBF7E',
                            downColor: '#FF4D4F',
                            noChangeColor:"#0DBF7E"
                        }
                        }
                    },
                    technicalIndicator: {
                        bar: {
                            upColor: '#0DBF7E',
                            downColor: '#FF4D4F',
                            noChangeColor:"#0DBF7E"
                        },
                        line: {
                        colors: ['#864434', '#52aca3', '#674d94', '#1587DD', '#50A300']
                        }
                    },
                    xAxis: {
                        axisLine: {
                            display: false
                        },
                        tickText: {
                            color: '#999999'
                        }
                    },
                    yAxis: {
                        axisLine: {
                            display: false
                        },
                        tickText: {
                            position: 'inside',
                            color: '#999999'
                        }
                    },
                    floatLayer: {
                        prompt: {
                        displayRule:'follow_cross',
                        candleStick: {
                            showType: 'rect',
                            labels: ['时间', '开', '收', '高', '低'],
                            rect: {
                            fillColor: '#ffffff',
                            right: 32,
                            },
                            text: {
                            color: '#999999',
                            size:10,
                            }
                        },
                        technicalIndicator:{
                            text:{
                                size:10
                            }
                        }
                        }
                    }
                }
                this.kline = klinecharts.init(document.getElementById('tradeView'),config);
                //成交量指标
                this.kline.addTechnicalIndicator('VOL',90);
                this.kline.setOffsetRightSpace(65);
                //蜡烛大小
                this.kline.setDataSpace(8);
                //mac线
                this.kline.setTechnicalIndicatorParams("MA",[5,10,30]);
            },
            initData(data,priceScale = 0){
                data.forEach(item => {
                    if (typeof(item[0]) === 'string') item[0] = new Date(item[0].replace(/-/g, '/')).getTime()
                });
                // console.log(data);
                if (data.length) {
                    priceScale = data[0][1].toString().split(".")[1] ? data[0][1].toString().split(".")[1].length : 0;
                }
                this.kline.setPrecision(2,0);
                // console.log(2);
                let newData = [];
                for(var i = 0;i<data.length;i++){
                    newData.push({
                        timestamp:data[i][0],
                        open:data[i][1],
                        high:data[i][2],
                        low:data[i][3],
                        close:data[i][4],
                        volume:data[i][5],
                        turnover:i
                    });
                }
                // console.log(newData);
                this.kline.applyNewData(newData);
                // console.log(4);
            },
            modifyData(data){
                data.forEach(item => {
                    if (typeof(item[0]) === 'string') item[0] = new Date(item[0].replace(/-/g, '/')).getTime();
                });
                this.kline.updateData({
                    timestamp:data[0][0],
                    open:data[0][1],
                    high:data[0][2],
                    low:data[0][3],
                    close:data[0][4],
                    volume:data[0][5],
                    turnover:1
                });
            },
            getDeep(){
                let that = this;
                let userId = that.$mts.getUserValue('sysUserID');
                that.$mts.posts({
                    url: 'api/v2/depth?pair='+that.defaultPair+'&length='+that.length+'&scale='+that.deep+'&userId='+userId,
                    data:{},
                    success(response){
                        if(response.status == 200){
                            that.$store.state.ws.depth = response.data.data;
                        }else{
                            that.$mts.toast(that.$t('message.public.dataError'));
                        }
                    }
                });
            },
            getTradeRecord(){
                let that = this;
                that.$mts.posts({
                    url: 'api/v2/getMarketOrder?pair='+that.defaultPair+'&size='+that.size,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.$store.state.ws.order = response.data.data;
                        }else{
                            that.$mts.toast(that.$t('message.public.dataError'));
                        }
                    }
                });
            },
            getMarketAll(){ 
                let that = this;
                const marketAllExpire = localStorage.getItem('marketAllExpire');
                if (Number(marketAllExpire) - Date.now() > 0) {
			        that.rankList = JSON.parse(localStorage.getItem('marketAll'));
                } else {
                    that.$mts.posts({
                        url: 'api/v2/marketAll',
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                that.rankList = response.data.data;
                                // that.nowCoin = that.rankList.filter((item) => {
                                //     return that.defaultPair == item.pair;
                                // });
                            }else{
                                that.$mts.toast(that.$t('message.public.dataError'));
                            }
                        }
                    });
                }
            },
            onConfirm(index){
                let that = this;
                that.$router.push({path: 'trade', query:{pair: that.defaultPair,side: index}});
            },
            onConfirmOrder(){
                let that = this;
                that.showOrder = false;
                that.showFund = true;
            },
        },
    }
</script>  

<style lang="scss" scoped>
    .Kline-div{
        position: relative;
    }
    .Kline-div p {
        display: none;
    }
    .Kline-div .kline-tick{
        position: absolute;
        z-index: 1;
        color: #fff;
        display:flex;
        flex-direction:column;
        font-size:3.2vw;
        left: 5px;
        width: 85%;
        p{
            display:flex;
            color: #1f212d;
            span{margin-right:2vw;}
        }
    }
    .Kline-div .kline-volume{
        position: absolute;
        z-index: 1;
        color: rgb(194, 194, 195);
        font-size: 1px;
        left: 5px;
        top: 65%;
        color: #1f212d;
    }
    .Kline-div .kline-close{
        position: absolute;
        left: 85.5%;
        top: 30px;
        color: #fff;
        background: #c72828;
        z-index: 1;
        font-size: 1px !important;
        padding: 1px 2px;
        display: none !important; 
    }
    .Kline-div .kline-macd{
        display: none !important;
        position: absolute;
        z-index: 1;
        color: rgb(194, 194, 195);
        font-size: 1px;
        left: 5px;
        top: 80%;
    }
    .Kline-div .show{
        display: block;
    }
    .changeTime {
        ul {
            background-color: inherit;
        }
    }
</style>