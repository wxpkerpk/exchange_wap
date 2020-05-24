<template>  
    <div class="flexPage">
        <div class="flexHead">
            <div class="back">
                <i class="iconfont iconreturn" @click="$router.go(-1)" />
                <i v-if="cur == 1" class="iconfont iconshaixuan1" @click="showFilter = true" />
            </div>
        </div>
        <div class="flexContent whiteBg">
            <div class="orderWrapper">
                <div class="orderHead">
                    <ul>
                        <li v-for="(item,index) in tabs" :key="index" @click="clickTab(index)" :class="{active: cur == index}">{{item}}</li>
                    </ul>
                </div>
                <!-- 当前委托 -->
                <div class="orderList" v-if="cur == 0">
                    <div class="orderTop flexLevel">
                        <div class="switch">
                            <van-switch @change="changeCheck"
                                v-model="checked"
                                active-color="#07c160"
                                inactive-color="#fff"
                                size="16px"
                            />
                            <span>{{$t('trade.onlyNowPair')}}</span>
                        </div>
                        <span v-if="checked && list.length > 0" @click="cancelOrder">{{$t('trade.cancelAll')}}</span>
                    </div>

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
                                    <li v-for="(item,index) in list" :key="index" @click="$router.push({name: 'orderdetail',params:{id: item.id}})">
                                        <div class="tradeItem">
                                            <div class="title">
                                                <span class="status" :class="vColor(item.direction)">{{vText(item.direction)}}</span>
                                                <span class="pair">{{vPair(item.pair)}}</span>
                                                <span class="date">{{$mkt.dateFormat('mm.dd HH:MM:SS',item.timestamp)}}</span>
                                            </div>
                                            <div class="content">

                                                <div class="detail">
                                                    <p><span>{{$t('trade.executedPrice')}}</span><b>{{$mkt.fmtNum(item.price, priceScale)}}</b></p>   
                                                    <p><span>{{$t('trade.clinch') +'/'+ $t('trade.entrust')}}</span><b>{{$mkt.fmtNum(Number(item.number) - Number(item.remain),amountScale)}} / {{$mkt.fmtNum(item.number, amountScale)}}</b></p>   
                                                </div>
                                                <span @click.stop="cancelOrder(item)" class="cancel">{{$t('button.public.cancel')}}</span> 
                                            </div> 
                                        </div> 
                                    </li>
                                </van-list>
                            </van-pull-refresh>        
                        </ul>
                    </div>
                </div>

                <!-- 历史委托 -->
                <div class="orderList" v-if="cur == 1">
                    <dl class="orderTitle">
                        <dd>{{$t('trade.market')}}</dd>
                        <dd>{{$t('table.price')+'/'+$t('trade.orderNum')}}</dd>
                        <dd>{{$t('trade.executedNum')}}</dd>
                    </dl>
                    <div class="tradeHistory">
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
                                    <li v-for="(item,index) in list" :key="index" @click="$router.push({name: 'orderdetail',params:{id: item.id}})">
                                        <div class="tradeItem">
                                            <dl class="tradeCoin">
                                                <dt>
                                                    <span :class="vColor(item.direction)">{{vText(item.direction)}}</span>
                                                    <b>{{vPair(item.pair)}}</b>
                                                </dt>
                                                <dd>{{$mkt.dateFormat('mm.dd HH:MM:SS',item.timestamp)}}</dd>
                                            </dl>
                                            <dl class="tradeDetail">
                                                <dt :class="vColor(item.direction)">{{$mkt.fmtNum(item.price, priceScale)}}</dt>
                                                <dd>{{$mkt.fmtNum(item.number, amountScale)}}</dd>
                                            </dl>
                                            <dl class="tradeStatus">
                                                <dt :class="vColor(item.status)">{{vStatus(item.status)}}</dt>
                                                <dd>{{$mkt.fmtNum(item.number-item.remain, amountScale)}}</dd>
                                            </dl>
                                        </div>
                                    </li>
                                </van-list>
                            </van-pull-refresh>        
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- 筛选弹窗 -->
        <van-popup
            v-model="showFilter"
            position="right"
        >
            <div class="filter">
                <div class="headTitle">{{$t('trade.title')}}</div>
                <div class="content">
                    <div class="cell">
                        <p class="title">{{$t('trade.coin')}}</p>
                        <div class="pair flexLevel">
                            <div class="inputBox">
                                <input type="text" v-model="form.defaultCoin" :placeholder="$t('validate.trade.inputPair')">
                                <!-- <van-dropdown-menu :overlay="false">
                                    <van-dropdown-item v-model="form.defaultCoin" :options="tokens" />
                                </van-dropdown-menu> -->
                                <!--  <van-dropdown-menu :overlay="false">
                                    <van-dropdown-item v-model="form.defaultCoin" :options="form.option" />
                                </van-dropdown-menu> -->
                            </div>
                            <span>/</span>
                            <div class="selectBox">
                                <van-dropdown-menu :overlay="false">
                                    <van-dropdown-item v-model="form.defaultOption" :options="form.option" />
                                </van-dropdown-menu>
                            </div>  
                        </div> 
                    </div>
                    <div class="cell">
                        <p class="title">{{$t('trade.tradeType')}}</p>
                        <dl>
                            <dd v-for="(item,index) in form.types" :key="index" :class="{active: form.defaultType == index}" @click="form.defaultType = index">{{item}}</dd>
                        </dl>
                    </div>
                    <div class="cell">
                        <p class="title">{{$t('trade.orderStatus')}}</p>
                        <dl>
                            <dd v-for="(item,index) in form.status" :key="index" :class="{active: form.defaultStatus == index}" @click="form.defaultStatus = index">{{item}}</dd>
                        </dl>
                    </div>
                    <div class="cell">
                        <p class="title">{{$t('trade.date')}}</p>
                        <div class="date flexLevel">
                            <div class="time flexLevel" @click="showStartDate = true">
                                <span>{{startDate}}</span>
                                <i class="iconfont iconrili" />
                            </div>
                            <span>{{$t('trade.to')}}</span>    
                            <div class="time flexLevel" @click="showEndDate = true">
                                <span>{{endDate}}</span>
                                <i class="iconfont iconrili" />
                            </div>
                        </div>
                    </div>
                    <div class="btnBox">
                        <span @click="onReset">{{$t('button.trade.reset')}}</span>
                        <span @click="onConfirm">{{$t('button.public.confirm')}}</span>
                    </div>
                </div>
            </div>
        </van-popup>
        <!-- 开始时间 -->
        <van-popup 
            v-model="showStartDate"
            position="bottom"
            class="chooseDate"
        >
            <van-datetime-picker
                v-model="startTime"
                type="date"
                :formatter="formatter"
                @confirm="confirmStartTime"
                @cancel="showStartDate = false"
            />
        </van-popup>
        <!-- 终止时间 -->
        <van-popup 
            v-model="showEndDate"
            position="bottom"
            class="chooseDate"
        >
            <van-datetime-picker
                v-model="endTime"
                type="date"
                :formatter="formatter"
                @confirm="confirmEndTime"
                @cancel="showEndDate = false"
            />
        </van-popup>
    </div>
</template>  

<script>  
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return{
                cur: localStorage.getItem('nowStatus') || 0,
                tabs:[this.$t('trade.nowOrder'),this.$t('trade.historyOrder')],
                showFilter:false,
                checked: true,
                currentRate: 20,
                rate: (4.5/50)*100,
                form:{
                    defaultCoin: '',
                    defaultOption:0, // 市价
                    option:[
                        {text:this.$t('user.withdrawal.all'),value:0},
                        {text:'USDT',value:'USDT'},
                        {text:'BTC',value:'BTC'},
                        {text:'ETH',value:'ETH'}
                    ],
                    defaultType:0, // 买&卖
                    types:[this.$t('trade.buyandsell'),this.$t('trade.buyin'),this.$t('trade.sellout')],
                    defaultStatus:0, // 全部
                    status:[this.$t('user.withdrawal.all'),this.$t('trade.Unexecuted'),this.$t('trade.executed'),
                    this.$t('trade.someExecuted'),this.$t('trade.someCancel'),this.$t('trade.canceled')],
                    startTime: null,
                    endTime: null,
                },
                showStartDate: false,
                showEndDate: false,
                startDate: '',
                endDate: '',
                startTime: new Date(),
                endTime: new Date(),
                size: 0,
                defaultPair: this.$route.query.pair || 'BTC_USDT', // 默认交易对
                submiting: false,
                pageNum: 0,
            }
        },
        computed:{
            list(){
                let that = this;
                let list = that.$store.state.app.vanList;
                for(let idx = 0;idx < list.length;idx ++){
                    let item = list[ idx];
                    if (item.number == item.remain) {
                        item.currentRate = 0;
                    } else {
                        item.currentRate = Number(
                            that.$mkt.fmtZero(Number(Number(item.number - item.remain)/Number(item.number) * 100).toFixed(2)));
                    }
                    item.rate = 100;
                }
                return list;
            },
            finished(){
                return this.$store.state.app.finished;
            },
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
            tokens(){
                let that = this;
                let array = that.$store.state.app.pairs;
                return [{
                    text: that.$t('user.withdrawal.all'), 
                    value: 0
                }]
            }
        },
        components:{
            backbar
        },
        beforeRouteLeave (to, from, next) {
            this.$mts.initPage();
            next();
        },
        beforeDestory(){
            this.$mts.initPage();
        },
        mounted(){
            let that = this;
            that.$mts.initPage();
            that.getNowTrade();
            that.$mts.currency();
        },
        watch:{

        },
        methods:{
            vColor(value){
                if (value == 'buy' || value == 'FULL_COMPLETED' || value == 'PARTIAL_COMPLETED') {
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
            vPair(pair){
                return pair.replace('_', "/");
            },
            vStatus(status){
                let that = this;
                switch(status){
                    case 'FULL_COMPLETED': // 已成交
                        return that.$t('trade.clinch');
                    case 'FULL_CANCELLED': // 已取消
                        return that.$t('trade.canceled');
                    case 'PARTIAL_CANCELLED  ':
                        return that.$t('trade.someCancel');
                    case 'PARTIAL_COMPLETED':
                        return that.$t('trade.someExecuted');        
                    default:
                        return that.$t('trade.Unexecuted');  
                }
            },
            formatter(type, value) {
                if (type === 'year') {
                    return `${value}`+this.$t('button.public.year');
                } else if (type === 'month') {
                    return `${value}`+this.$t('button.public.month');
                } else {
                    return `${value}`+this.$t('button.public.day');
                }
                return value;
            },
            confirmStartTime(value){
                this.showStartDate = false;
                this.startDate = this.$mkt.dateFormat('yyyy-mm-dd',value);
                this.form.startTime = value.getTime();
            },
            confirmEndTime(value){
                this.showEndDate = false;
                this.endDate = this.$mkt.dateFormat('yyyy-mm-dd',value);
                this.form.endTime = new Date(this.endDate + " 23:59:59").getTime();
            },
            onReset(){// 重置选项
                this.form.defaultCoin = '';
                this.form.defaultOption = 0;
                this.form.defaultType = 0;
                this.form.defaultStatus = 0;
                this.form.startTime = null;
                this.form.endTime = null;
                this.startDate = '';
                this.endDate = '';
            },
            onConfirm(){
                this.showFilter = false;
                // 查询数据
                this.size = 0;
                this.pageNum = 0;
                this.refresh();
            },
            refresh(){
                this.size = 0;
                this.pageNum = 0;
                this.$mts.initPage();
                this.$store.state.app.loading = true;
                this.getNowTrade();
            },
            changeCheck(checked){
                let that = this;
                that.checked = checked;
                that.$mts.initPage();
                that.getNowTrade();
            },
            clickTab(index){
                let that = this;
                that.cur = index;
                localStorage.setItem('nowStatus',that.cur);
                that.pageNum = 0;
                that.size = 0;
                that.$mts.initPage();
                that.getNowTrade();
            },
            getState(state){
                switch(state){
                    case 1:
                        return 'PENDING';
                    case 2:
                        return 'FULL_COMPLETED';
                    case 3:
                        return 'PARTIAL_COMPLETED';
                    case 4:
                        return 'PARTIAL_CANCELLED';
                    case 5:
                        return 'FULL_CANCELLED';                
                    default:
                        return '';    
                }
            },
            getNowTrade(){ 
                let that = this;
                that.size += 10;
                that.pageNum ++;

                // 生成查询条件
                let urlSuffix = "";
                if (that.cur == 1 && that.form.defaultType > 0) {
                    urlSuffix += "&type="+(that.form.defaultType==1?'buy':'sell');
                }
                // 交易对
                if (that.cur == 1 && that.form.defaultOption && that.form.defaultOption != 0) {
                    urlSuffix += "&pairR="+that.form.defaultOption;
                }
                // 交易货币
                if (that.cur == 1 && that.form.defaultCoin && that.form.defaultCoin != 0) {
                    urlSuffix += "&pairL="+that.form.defaultCoin.toUpperCase();
                }
                if (that.cur == 1 && that.form.startTime) {
                    urlSuffix += "&startTime=" + that.form.startTime;
                }

                if (that.cur == 1 && that.form.endTime) {
                    urlSuffix += "&endTime=" + that.form.endTime;
                }

                let url = 'api/v2/orderManagement?size='+that.size+'&state=' 
                        + (that.cur == 0 ? 'PENDING' : that.getState(that.form.defaultStatus))
                        + (that.checked && that.cur == 0 ? '&pair=' + that.defaultPair : '')
                        + urlSuffix;
                if (that.cur == 0) {
                    url = 'api/v2/getPersonOrder?size='+that.size+'&isPending=1'
                        + (that.checked && that.cur == 0 ? '&pair=' + that.defaultPair : '');
                }

                that.$mts.posts({
                    url: url,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            if (that.cur == 0) {
                                that.$mts.loading(response.data.data, that.size, that.pageNum, false);
                            } else {
                                that.$mts.loading(response.data.data.rows, that.size, that.pageNum, !that.cur == 0);
                            }
                        }else{
                            that.$mts.toast(that.$t('message.public.dataError'));
                        }
                    }
                });
            },
            cancelOrder(item){ // 取消订单
                let that = this;
                if (!that.form.submiting) {
                    that.form.submiting = true;
                    let data = {
                        pair: that.defaultPair
                    }
                    if (item) { // 撤销
                        data.orderId = item.id;
                    }
                    if (!data.orderId && that.list.length <= 0) {
                        that.form.submiting = false;
                        return;
                    }
                    that.$mts.posts({
                        url:"api/v2/cancelOrder",
                        data
                        ,success(response){
                            that.form.submiting = false;
                            if (response.data.status == 200) {
                                that.$mts.toast(that.$t('message.trade.cancelSuc'));
                                setTimeout(()=>{
                                    that.size = 10;
                                    that.pageNum = 0;
                                    that.getNowTrade();
                                }, 500);
                            } else {
                                that.$mts.toast(that.$t('message.trade.cancelFail'));
                            }
                        }
                    });
                }
            }
        }
    }
</script>  

<style lang="scss">

</style>