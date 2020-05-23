<template>  
    <div class="flexPage trade-home">
        <div class="flexHead"></div>
        <div class="flexContent whiteBg">
            <div class="tradeWrapper">
                <div class="tradeHead flexLevel">
                    <div class="pair" @click="$router.push({path:'/search',query:{backUrl: 'trade'}})">
                        <b>{{$mkt.vPair(defaultPair)}}</b>
                        <i class="iconfont iconClick" />
                    </div>
                    <div class="more">
                        <i class="iconfont iconfavorites" v-if="!deepList.current.isFav" @click="$mts.onSetFav(deepList.current)" />
                        <i class="iconfont iconfavorites_selected" v-if="deepList.current.isFav" @click="$mts.onCancelFav(deepList.current)" />
                        <i class="iconfont iconmarkets_" @click="$router.push({path:'/tradedetail',query:{pair:defaultPair}})" />
                    </div>
                </div>
                <div class="tradeContent">
                    <div class="tradeLt">
                        <div class="tradeBtn flexLevel">
                            <span @click="cur=0" :class="cur == 0 ? 'active' : ''" v-if="!theme">{{$t('trade.buyin')}}</span>
                            <span @click="cur=0" :class="cur == 0 ? 'active' : 'dark'" v-if="theme">{{$t('trade.buyin')}}</span>
                            <span @click="cur=1" :class="cur == 1 ? 'active' : ''" v-if="!theme">{{$t('trade.sellout')}}</span>
                            <span @click="cur=1" :class="cur == 1 ? 'active' : 'dark'" v-if="theme">{{$t('trade.sellout')}}</span>
                        </div>
                        <!-- <div class="select">
                            <van-dropdown-menu :overlay="false">
                                <van-dropdown-item v-model="defaultType" :options="option" @change="onChangeType" />
                            </van-dropdown-menu>
                        </div> -->
                        <div class="placeholder">
                            限价交易
                            <!-- <van-icon name="arrow-down" /> -->
                        </div>
                        <div class="calc">
                            <number v-model="form.price" :placeholder="$t('trade.inputPrice')" :min="minPrice || 0 " :max="maxPrice" :step="step(priceScale)" :fixed="priceScale" />
                            <div class="equal">{{$mkt.vMoney(form.price)}}</div>
                        </div>
                        <div class="calc">
                            <number v-model="form.number" :placeholder="$t('trade.inputAmount')" :min="minNumber || 0 " :max="maxNumber" :step="step(amountScale)" :fixed="amountScale" />
                            <ul class="flexLevel">
                                <li v-for="(item,index) in percents" :key="index" :class="vBgColor(index)" @click="onChoosePer(item)">{{item}}</li>
                            </ul>
                            <div v-if="cur == 1" class="available">{{$t('user.index.available')}} {{available}} {{$mkt.vToken(defaultPair, 0)}}</div>
                            <div v-if="cur == 0" class="available">{{$t('user.index.available')}} {{available}} {{$mkt.vToken(defaultPair, 1)}}</div>
                        </div>
                        <div class="tradeAmount">
                            <span>总计</span>
                            <span>{{$mkt.fmtNum(cur == 0 ? (Number(form.number) * Number(form.price)) : Number(form.number), amountScale)}} {{$mkt.vToken(defaultPair, cur == 0 ? 1 : 0)}}</span>
                        </div>
                        <div class="equal">≈ {{$mkt.vSymbol() + $mkt.fmtNum(Number(form.number) * Number(form.price) * $mkt.vPrice(), amountScale)}}</div>
                        <div class="btn" >
                            <van-button v-if="cur == 0 && isLogin" size="large" @click="onSubmitPrev" class="green">{{$t('trade.buyin')}}</van-button>
                            <van-button v-if="cur == 1 && isLogin" size="large" @click="onSubmitPrev" class="red">{{$t('trade.sellout')}}</van-button>
                            <van-button v-if="!isLogin" size="large" @click="$router.push({name: 'signin'})" class="blue">{{$t('trade.goSignin')}}</van-button>
                        </div>
                    </div>

                    <!-- 卖盘/买盘 -->
                    <div class="tradeRt">
                        <dl class="trHead flexLevel">
                            <dd>{{$t('table.price')}}</dd>
                            <dd>{{$t('trade.number')}}</dd>
                        </dl>
                        <div class="trList">
                            <!-- v-if="index > deepList.ask.length - 8"  -->
                            <dl class="flexLevel" v-for="(item,index) in deepList.ask" :key="index" @click="onSetPrice(item)">
                                <!-- <span>{{ item[2] }}</span> -->
                                <dd class="red">{{$mkt.fmtNum(item[0], deep)}}</dd>
                                <dd>{{$mkt.fmtNum(item[1], amountScale)}}</dd>
                                <dd class="dbg red" :style="$mkt.volume(item[2],denAsk)"></dd>
                            </dl>
                        </div>
                        <div class="trPrice">
                            <b :class="colorClass">{{$mkt.fmtZero(deepList.current.price, priceScale)}}</b>
                            <span>{{$mkt.vMoney(deepList.current.worth)}}</span>
                        </div>
                        <div class="trList trList-last">
                            <!-- v-if="index < 7"  -->
                            <dl class="flexLevel" v-for="(item,index) in deepList.bids" :key="index" @click="onSetPrice(item)">
                                <dd class="green">{{$mkt.fmtNum(item[0],deep)}}</dd>
                                <dd>{{$mkt.fmtNum(item[1],amountScale)}}</dd>
                                <dd class="dbg green" :style="$mkt.volume(item[2],bidsAsk)"></dd>
                            </dl>
                        </div>
                        <div class="deepMerge" @click="showDeep = !showDeep">
                            <!-- <span>{{$t('trade.deepMerge')}}</span> -->
                            <span>{{defaultDeep}}</span>
                            <i class="iconfont iconDrop-downmenu" />
                            <div class="dropMenu" v-if="showDeep">
                                <ul>
                                    <li v-for="(item,index) in deepOption" :key="index" @click="onSetDeep(item)">{{item.text}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 委托列表 -->
                <p class='line'></p>
                <div class="tradeBottom orderList">
                    <div class="tradeTitle flexLevel">
                        <h3>{{$t('trade.nowOrder')}}</h3>
                        <span @click="$router.push({name:'allorder', query:{pair: defaultPair}})">{{$t('trade.allOrder')}}</span>
                    </div>
                    <div class="orderWrapper">
                        <div class="orderList">
                            <div class="tradeNow">
                                <nodata v-if="!list || list.length == 0" />   
                                <ul v-else>
                                    <van-pull-refresh v-model="submiting" @refresh="refresh">
                                        <van-list
                                            v-model="$store.state.app.loading"
                                            :finished="finished"
                                            :finished-text="$t('list.nomore')"
                                            @load="getNowTrade"
                                            :offset="50"
                                        >
                                            <loading v-if="$store.state.app.loading" />
                                            <li v-for="(item,index) in list" :key="index">
                                                <div class="tradeItem">
                                                    <div class="title">
                                                        <span class="status" :class="vColor(item.direction)">{{vText(item.direction)}}</span>
                                                        <span class="pair">{{$mkt.vPair(item.pair)}}</span>
                                                        <span class="date">{{$mkt.dateFormat('mm.dd HH:MM:SS',item.timestamp)}}</span>
                                                    </div>
                                                    <div class="content">
                                                        <div class="detail" @click="$router.push({name: 'orderdetail',params:{id: item.id}})">
                                                            <p><span>{{$t('trade.executedPrice')}}</span><b>{{$mkt.fmtNum(item.price, priceScale)}}</b></p>
                                                            <p><span>{{$t('trade.clinch') +'/'+ $t('trade.entrust')}}</span><b>{{$mkt.fmtNum(Number(item.number) - Number(item.remain),amountScale)}} / {{$mkt.fmtNum(item.number, amountScale)}}</b></p>
                                                        </div>
                                                        <span @click.stop="canceOrder(item)" class="cancel">{{$t('button.public.cancel')}}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </van-list>
                                    </van-pull-refresh>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <downbar />

        <!-- 确认订单 -->
        <van-popup
            v-model="showOrder"
            position="bottom"
        >
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('trade.confirmOrder')}}</span>
                    <van-icon name="cross" @click="showOrder = false" />
                </div>
                <div class="content">
                    <dl>
                        <dd>
                            <span>{{cur == 0 ? $t('trade.buyPair') : $t('trade.sellPair')}}</span>
                            <b>{{$mkt.vPair(defaultPair)}}</b>
                        </dd>
                        <dd>
                            <span>{{cur == 0 ? $t('trade.buyPrice') : $t('trade.sellPrice')}}</span>
                            <b>{{$mkt.fmtZero(form.price, priceScale)}} {{$mkt.vToken(defaultPair, 1)}}</b>
                        </dd>
                        <dd>
                            <span>{{$t('trade.sumPrice')}}</span>
                            <b>{{$mkt.fmtZero(Number(form.number) * Number(form.price), amountScale)}} {{$mkt.vToken(defaultPair, 1)}}</b>
                        </dd>
                    </dl>
                </div>
                <div class="btnBox"><van-button size="large" @click="onConfirmOrder" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup>

        <!-- 提示去设置PIN -->
        <van-popup v-model="showToast" class="showMore">
            <div class="goModal dark">
                <h3>{{$t('message.public.systemTitle')}}</h3>
                <p>{{$t('message.safe.noFund')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showToast = false">{{$t('button.public.know')}}</span>
                    <span class="btn2" @click="$router.push({name: 'changeFundPsw',query:{path:'/trade'}})">{{$t('button.user.setting')}}</span>
                </div>
            </div>
        </van-popup> 

        <!-- 输入资金密码 -->
        <van-popup
            v-model="showFund"
            position="bottom"
        >
            <div class="modal amount-container">
                <div class="head flexLevel">
                    <span>{{$t('validate.withdrawal.t3')}}</span>
                    <van-icon name="cross" @click="showFund = false" />
                </div>
                <div class="content">
                    <div class="inputBox">
                        <van-password-input
                            :value="form.fund"
                            :focused="showKeyboard"
                            @focus="showKeyboard = true"
                        />
                        <span @click="$router.push({name: 'changeFundPsw'})" class="forgetPsw">{{$t('form.sign.forget')}}</span>
                        <van-number-keyboard
                            :show="showFund"
                            extra-key="."
                            close-button-text="完成"
                            @blur="show = false"
                            @input="onInput"
                            @delete="onDelete"
                        />
                    </div>
                </div>
                <div class="btnBox"><van-button size="large" @click="onSubmit" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup>
    </div>
</template>  

<script>  
    import downbar from '@/views/modules/downbar.vue'
    import number from '@/views/modules/number.vue'
    export default {
        data(){
            return{
                showKeyboard: true,
                cur: this.$route.query.side || 0, // 买入
                // defaultType:0, // 市价
                // option:[
                //     {text:this.$t('trade.marketPrice'),value:0},
                //     {text:this.$t('trade.limitPrice'),value:1}
                // ],
                percent: -1,
                form:{
                    price: '',
                    number:'',
                    type: this.cur == 0 ? 'buy' : 'sell',
                    pair: this.defaultPair,
                    fund: '',
                    submiting: false,
                },
                showSearch: false, // 搜索
                showOrder: false, // 订单确认
                showFund: false, // 资金密码
                showDeep: false,
                showToast: false,
                percents:['25%','50%','75%','100%'],
                den: 1, // 分母 最大买卖盘
                denAsk: 1,
                denBids: 1,
                defaultPair: this.$route.query.pair || 'BTC_USDT', // 默认交易对
                length: 1000, // 每次请求数据条数
                deep: 2, // 保留到小数点后几位
                size: 0, //  每次请求交易记录条数
                pageNum: 0,
                coinList:[], // 资金列表
                submiting:false,
                userInfo:{},
                deepOption:[],
                defaultDeep:'',
                colorClass:'normal',
                timeoutDo:null,
            }
        },
        computed:{
            isLogin(){
                return this.$store.state.isLogin;
            },
            list(){
                let that = this;
                let list = that.$store.state.app.vanList;
                for(let idx = 0;idx < list.length;idx ++){
                    let item = list[idx];
                    if (Number(item.number) == Number(item.remain)) {
                        item.currentRate = 0;
                    } else {
                        item.currentRate = Number(
                            that.$mkt.fmtZero(Number(Number(item.number - item.remain)/Number(item.number) * 100).toFixed(2)));
                    }
                }
                return list;
            },
            finished(){
                return this.$store.state.app.finished;
            },
            priceScale(){
                let that = this;
                let array = that.$store.state.app.pairs;
                let scale = that.$mkt.getScale(array, that.defaultPair, true);
                let list = [];
                for(let idx = scale;idx > (scale > 4 ? scale - 4 : 0);idx --){
                    let mes = that.$t('message.trade.decimals',{num: idx});
                    if (idx == scale) {
                        that.defaultDeep = mes;
                        that.deep = idx;
                    }
                    list.push({text: mes, deep: idx});
                }
                that.deepOption = list;
                return scale;
            },
            amountScale(){
                let that = this;
                let array = that.$store.state.app.pairs;
                return that.$mkt.getScale(array, that.defaultPair, false);
            },
            deepList(){
                let that = this;
                // let max = 0;
                // let ask = that.$store.state.ws.depth.ask || [];
                // for (let n = 0;n < ask.length;n ++) {
                //     let ma = ask[n][1]*ask[n][0];
                //     if ( max < ma && n > ask.length - 6 ) {
                //         max = ma;
                //     }
                // }
                // let bid = that.$store.state.ws.depth.bids || [];
                // for(let m = 0;m < bid.length; m ++){
                //     let ma = bid[m][1] * bid[m][0];
                //     if ( max < ma && m < 5) {
                //         max = ma;
                //     }
                // }
                // if ( max > 0) {
                //     that.den = max; // 最大深度
                // }
                const askTemp = that.$store.state.ws.depth.ask.slice(-7);
                const bidsTemp = that.$store.state.ws.depth.bids.slice(0, 7);

                askTemp.reverse().forEach((v, index) => {
                    v[2] = 0;
                    for(let i = 0; i <= index; i ++) {
                        v[2] += askTemp[i][1];
                    }
                });
                this.denAsk = askTemp.length ? askTemp[askTemp.length - 1][2] : 0;
                askTemp.reverse();

                bidsTemp.forEach((v, index) => {
                    v[2] = 0;
                    for(let i = 0; i <= index; i ++) {
                        v[2] += bidsTemp[i][1];
                    }
                });
                this.bidsAsk = bidsTemp.length ? bidsTemp[bidsTemp.length - 1][2] : 0;
                return {
                    ask: askTemp,
                    bids: bidsTemp,
                    current: that.$store.state.ws.depth.current
                };
            },
            theme(){
                return this.$store.state.app.theme;
            },
            available(){ // 可用资产
                let that = this;
                let available = 0;
                if (that.coinList && that.coinList.length > 0) {
                    let arr = that.coinList;
                    let idx = (that.cur == 0 ? 1 : 0);
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i].coinCode == that.$mkt.vToken(that.defaultPair, idx)){
                            available = that.$mkt.fmtNum(arr[i].balanceAvailable, that.amountScale);
                        }
                    }  
                }
                return available;
            },
            maxNumber(){
                let that = this;
                let field = that.cur == 0 ? 'buyMaxNumber' : 'sellMaxNumber';
                let maxNumber = Number(that.$mkt.getPairField(that.defaultPair, field));
                let usable = Number(that.available);
                return maxNumber > usable ? maxNumber : usable;
            },
            minNumber(){
                let that = this;
                let field = that.cur == 0 ? 'buyMinNumber' : 'sellMinNumber';
                let minNumber = Number(that.$mkt.getPairField(that.defaultPair, field));
                let usable = Number(that.available);
                return usable < minNumber ? 0 : minNumber;
            },
            minPrice(){
                let that = this;
                let field = that.cur == 0 ? 'buyMinPrice' : 'sellMinPrice';
                let minPrice = Number(that.$mkt.getPairField(that.defaultPair, field));
                return minPrice;
            },
            maxPrice(){
                let that = this;
                let field = that.cur == 0 ? 'buyMaxPrice' : 'sellMaxPrice';
                let maxPrice = Number(that.$mkt.getPairField(that.defaultPair, field));
                return maxPrice;
            }
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
        activated() {
            this.initPage();
        },
        mounted(){
            this.initPage();
        },
        components:{
            downbar,
            number,
        },
        watch:{
            "$route.query.pair":function(cur,old){
                if (cur && cur != old) {
                    this.defaultPair = cur;
                    this.initPage();
                }
                if (!cur) { // 返回上一步无数据情况
                    this.defaultPair = 'BTC_USDT';
                    this.initPage();
                }
            },
            "deepList.current":function(cur,old){
                let that = this;
                if (cur && old) {
                    if (cur.price != old.price) {
                        let cls = this.$mkt.vMColor(cur.chg);
                        that.colorClass = cls;
                        clearTimeout(that.timeoutDo);
                        that.timeoutDo = setTimeout(function(){
                            that.colorClass = 'normal';
                        }, 2000);  
                    }
                }
            }
        },
        methods:{
            onInput(key) {
                this.form.fund = (this.form.fund + key).slice(0, 6);
            },
            onDelete(key) {
                this.form.fund = this.form.fund.slice(0, this.form.fund.length - 1);
            },
            vBgColor(index){
                let that = this;
                if (that.percent == index) {
                    return that.cur == 0 ? 'active-green' : 'active-red'; 
                }
                return '';
            },
            vColor(direction){
                if (direction == 'buy') {
                    return 'green';
                }
                return 'red';
            },
            vText(direction){
                if (direction == 'buy') {
                    return this.$t('trade.buy');
                }
                return this.$t('trade.sell');
            },
            vRate(item){
                let that = this;
                let remain = item.remain;
                let number = item.number;
                return remain == number ? "0%" 
                        : that.$mkt.fmtZero(Number(Number(item.number-item.remain)/Number(item.number)*100).toFixed(2)) + '%';
            },
            step(scale) {
                let that = this;
                return Math.pow(0.1, scale);
            },
            initPage(){
                let that = this;
                that.$mts.rates(); // 获取汇率
                that.initWs();
                that.$mts.currency( this.defaultPair);
                that.getDeep(); 
                // 验证是否登录
                that.$mts.checkExpire(false,false,()=>{
                    if (that.isLogin) {
                        that.getCoins(); // 获取资金列表 
						setTimeout(()=>{
						 that.getNowTrade(); // 获取当前委托列表
						
						}, 700);
                    }
                });
            },
            initWs(){
                let that = this;
                that.$mts.connect( that.defaultPair,(data)=>{
                    // console.log(data,8)
                    if (data.ask || data.bids) {
                        that.calcDepth(data);
                    }
                    if (data == that.defaultPair) {
                        that.size = 0;
                        that.pageNum = 0;
                        that.getCoins();
                        that.getNowTrade();
                    }
                }, "5m");
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
                        if (Number(a[0]) == Number(b[0])) {
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

                that.$store.state.ws.depth.ask = that.$mts.sort(newask, 'desc', 0);

                // 买盘数据
                let newbids = [];
                let bk = true;
                for (let i = bids.length - 1; i >= 0; i--) {
                    let a = bids[i];
                    for (var j = bid.length - 1; j >= 0; j--) {
                        let b = bid[j];
                        if (Number(a[0]) == Number(b[0])) {
                            a[1] = b[1];
                            // console.log(a,b);
                            bk = false;
                        }
                    }
                    if (Number(a[1]) > 0) {
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
            refresh(){
                this.size = 0;
                this.pageNum = 0;
                this.$mts.initPage();
                this.$store.state.app.loading = true;
                this.submiting = false;
                this.getNowTrade();
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
            onChoosePer(item){ // 选择交易百分比
                let that = this;
                if(that.form.price != ''){
                    if (this.cur === 0) {
                        // 买
                        switch(item){
                            case '25%':
                                that.percent = 0;
                                that.form.number = that.$mkt.fmtNum(((0.25 * that.available)/that.form.price), that.amountScale);
                                break;
                            case '50%':
                                that.percent = 1;
                                that.form.number = that.$mkt.fmtNum(((0.5 * that.available)/that.form.price), that.amountScale);
                                break;
                            case '75%':
                                that.percent = 2;
                                that.form.number = that.$mkt.fmtNum(((0.75 * that.available)/that.form.price), that.amountScale);
                                break;
                            case '100%':
                                that.percent = 3;
                                that.form.number = that.$mkt.fmtNum((that.available/that.form.price), that.amountScale);
                                break;
                            default: 
                                that.percent = 1;
                                break;
                        }
                    } else {
                        // 卖
                        switch(item){
                            case '25%':
                                that.percent = 0;
                                that.form.number = that.$mkt.fmtNum(((0.25 * that.available)), that.amountScale);
                                break;
                            case '50%':
                                that.percent = 1;
                                that.form.number = that.$mkt.fmtNum(((0.5 * that.available)), that.amountScale);
                                break;
                            case '75%':
                                that.percent = 2;
                                that.form.number = that.$mkt.fmtNum(((0.75 * that.available)), that.amountScale);
                                break;
                            case '100%':
                                that.percent = 3;
                                that.form.number = that.$mkt.fmtNum((that.available), that.amountScale);
                                break;
                            default: 
                                that.percent = 1;
                                break;
                        }
                    }
                }else{
                    that.$mts.toast(that.$t('message.trade.price'))
                }
            },
            onSetPrice(item){
                let that = this;
                that.form.price = item[0].toString();
                that.form.number = item[1].toString();
            },
            onSetDeep(item){
                let that = this;
                if (that.deep != item.deep) {
                    that.defaultDeep = item.text;
                    that.deep = item.deep;
                    that.getDeep();  
                }
            },
            onSubmitPrev(){
                const coinItem = this.$store.state.app.pairs.filter(item => {
                    return this.defaultPair === `${item.coinCode}_${item.symbol}`;
                });
                // console.log(coinItem)
                if (this.cur === 0 && coinItem[0].buyOpenTime > new Date().getTime()) {
                    // 买
                    this.$toast('暂未开放买入');
                    return;
                } 
                if(this.cur === 1 && coinItem[0].sellOpenTime > new Date().getTime()) {
                    // 卖
                    this.$toast('暂未开放卖出');
                    return;
                }
                let that = this;
                if (that.form.price && that.form.number
                    && that.form.price > 0 && that.form.number > 0) {

                    let available = Number( that.available);
                    // 判断是否余额充足
                    let total = Number( that.form.price * that.form.number);
                    if (that.cur == 1) {
                        total = Number(that.form.number);
                    }
                    if (total > available) {
                        that.$toast(that.$t('message.purchase.over'));
                    } else {
                        let flag = JSON.parse(localStorage.getItem('setFundPsw'));
                        if (flag) {
                            that.onConfirmOrder();
                        } else {
                            that.showToast = true;
                        }
                    }
                } else {
                    that.$toast(that.$t('message.trade.price'));
                }
            },
            onConfirmOrder(){
                let that = this;
                let token = localStorage.getItem('tradeToken');
                if (token && token != 'undefined') {
                    // 加密
                    that.form.time = new Date().getTime();
                    that.form.type = that.cur == 0 ? 'buy' : 'sell';
                    that.form.pair = that.defaultPair;
                    let sign = that.$mkt.makeSign( that.form);
                    that.showOrder = false;
                    that.goTrade( sign);
                } else {
                    that.showOrder = false;
                    that.showFund = true;
                }
            },
            onSubmit(){
                let that = this;
                that.showFund = false;
                that.$mts.posts({
                    url: 'api/v2/getTransactionSign',
                    data:{
                        pin:that.form.fund,
                    },
                    success(response){
                        if(response.data.status == 200){
                            localStorage.setItem('tradeToken',response.data.data.token);
                            that.form.time = new Date().getTime();
                            that.form.type = that.cur == 0 ? 'buy' : 'sell';
                            that.form.pair = that.defaultPair;
                            let sign = that.$mkt.makeSign( that.form);
                            that.goTrade( sign);
                        }else if(response.data.status == 700){
                            that.$mts.toast(that.$t('endNotice.order.paramsError'))
                        }else if(response.data.status == 800){
                            that.$mts.toast(that.$t('endNotice.order.noMoney'))
                        }else if(response.data.status == 801){
                            that.$mts.toast(that.$t('endNotice.order.signatureExpired'))
                        }else if(response.data.status == 802){
                            that.$mts.toast(that.$t('endNotice.order.signatureError'))
                        }else if(response.data.status == 989){
                            that.$mts.toast(that.$t('endNotice.order.timeOut'))
                        }else if(response.data.status == 40003){
                            that.$mts.toast(that.$t('endNotice.order.limitOrder'))
                        } else if (response.data.status == 40002) {
                            that.$mts.toast('密码错误');
                        }
                    }
                });
            },
            canceOrder(item){ // 取消订单
                let that = this;
                if (!that.form.submiting) {
                    that.form.submiting = true;
                    that.$mts.posts({
                        url:"api/v2/cancelOrder",
                        data:{
                            pair: that.defaultPair,
                            orderId: item.id
                        },success(response){
                            that.form.submiting = false;
                            if (response.status == 200) {
                                that.$mts.toast(that.$t('message.trade.cancelSuc'));
                                setTimeout(()=>{
                                    that.size = 0;
                                    that.pageNum = 0;
                                    that.getNowTrade();
                                    that.getCoins();
                                }, 700);
                            } else {
                                that.$mts.toast(that.$t('message.trade.cancelFail'));
                            }
                        }
                    });
                }
            },
            goTrade( sign){
                let that = this;
                if (!that.form.submiting) {
                    that.form.submiting = true;
                    that.$mts.posts({
                        url: 'api/v2/makeOrder',
                        data:{
                            pair:that.defaultPair,
                            price: that.form.price,
                            number: that.form.number,
                            type: that.cur == 0 ? 'buy' : 'sell',
                            sign: sign,
                            time: that.form.time,
                        },
                        success(response){
                            that.form.submiting = false;
                            if(response.data.status == 200){
                                that.$mts.toast(that.$t('message.trade.tradeSuc'))
                                setTimeout(()=>{
                                    that.size = 0;
                                    that.pageNum = 0;
                                    that.getNowTrade();
                                    that.getCoins();
                                }, 700);
                            } else if (response.data.status == 801) {
                                that.showFund = true;
                            } else if (response.data.status === 707) {
                                that.$toast(response.data.message);
                            } else {
                                that.$mts.toast(that.$t('message.trade.tradeFail'));
                            }
                        }
                    });
                }
            },
            getCoins(){
                let that = this;
                that.$mts.posts({
                    url: 'api/v2/getBalance?pair=' + that.defaultPair,
                    data:{},
                    success(response){
                        if(response.status == 200){
                            that.coinList = response.data.data;
                        }else{
                            that.$mts.toast(that.$t('message.public.dataError'));
                        }
                    }
                });
            },
            getNowTrade(){ 
                let that = this;
                if (!that.submiting) {
                    that.submiting = true;
                    that.pageNum ++;
                    that.size += 10;
                    that.$mts.posts({
                        url: 'api/v2/getPersonOrder?pair='+that.defaultPair+'&size='+that.size+'&isPending=1',
                        data:{},
                        success(response){
                            that.submiting = false;
                            if(response.status == 200){
                                that.$mts.loading(response.data.data, that.size, that.pageNum, false);
                            }else{
                                that.$mts.toast(that.$t('message.public.dataError'));
                            }
                        }
                    }); 
                }
            },
            vTradeStatus(type){
                switch(type){
                    case 'FULL_COMPLETED':
                        return this.$t('trade.executed');
                    case 'PENDING':
                        return this.$t('trade.Unexecuted');
                    case 'PARTIAL_COMPLETED':
                        return this.$t('trade.someExecuted');
                    default:
                        return this.$t('trade.Unexecuted');
                }
            }
        },
    }
</script>  

<style lang="scss" scoped>
    .placeholder {
        width: 100%;
        height: 8.6667vw;
        border: 1px solid #D9D9D9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2vw;
        box-sizing: border-box;
        margin-top: 4vw;
        color: #888;
    }
    .van-button {
        // background: linear-gradient(to right, #1F7076, #46A7AD)!important;
        color: #fff!important;
    }
    .forgetPsw {
        display: block;
        text-align: right;
    }
</style>

<style lang="scss">
    .trade-home {
        .amount-container {
            margin-bottom: 75vw;
        }
        .van-password-input {
            padding: 2vw 0;
        }
    }
</style>
