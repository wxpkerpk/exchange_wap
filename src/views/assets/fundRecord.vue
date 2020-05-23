<template>
    <div class="flexPage">
        <loading v-if="$store.state.app.loading" />
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead flexLevel">
                        <h3>{{$t('user.public.fundRecord')}}</h3>
                        <i class="iconfont iconshaixuan2" @click="showFilter = true" />
                    </div>
                    <div class="fundRecord">
                        <nodata v-if="!list || list.length == 0" />
                        <ul>
                            <van-pull-refresh v-model="submiting" @refresh="refresh">
                                <van-list
                                    v-model="$store.state.app.loading"
                                    :finished="finished"
                                    @load="query"
                                    :offset="50"
                                >
                                    <li v-for="(item,index) in list" :key="index">
                                        <div class="flexLevel">
                                            <dl>
                                                <dt><img :src="vIcon(item.actionType)" alt=""></dt>
                                                <dd>
                                                    <b>{{vChange(item.actionType)}}</b>
                                                    <span>{{$mkt.dateFormat('yy-mm-dd HH:MM:SS',item.time)}}</span>
                                                </dd>
                                            </dl>
                                            <dl>
                                                <dd class="rt">
                                                    <b :class="$mkt.vMColor(item.account)">{{$mkt.fmtZero(item.account,12) + ' ' + (item.coinCode || 'USDT')}}</b>
                                                    <span>{{vAccount(item.source)}}</span>
                                                </dd>
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
                        <dl>
                            <dd :class="{active: cur == -1}" @click="onChooseCoin('',-1)">{{$t('filter.all')}}</dd>
                            <dd v-for="(item,index) in coinList" :key="index" :class="{active: cur == index}" @click="onChooseCoin(item,index)">{{item.coinCode}}</dd>
                        </dl> 
                    </div>
                    <div class="cell">
                        <p class="title">{{$t('trade.tradeType')}}</p>
                        <dl>
                            <dd v-for="(item,index) in types" :key="index" :class="{active: type == index}" @click="type = index">{{item.name}}</dd>
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
    import backbar from "@/views/modules/back.vue"
    export default {
        data(){
            return {
                backUrl:{
                    url: '',
                    leftText: '',
                },
                cur: -1,
                type: 0,
                form:{
                    defaultCoin: '',
                    defaultOption: '',
                    option:[
                        {text:this.$t('user.withdrawal.all'),value:0},
                    ],
                    startTime: '',
                    endTime: '',
                },
                types:[
                    {name:this.$t('filter.all'),symbol:""},
                ],
                showFilter: false,
                showStartDate: false,
                showEndDate: false,
                startDate: '',
                endDate: '',
                startTime: new Date(),
                endTime: new Date(),
                pair: '',
                limit: 20,
                page: 0,
                submiting: false,
                allTypes:{},
                features:[
                    {icon:require('@/assets/img/f1.png')},
                    {icon:require('@/assets/img/f2.png')},
                    {icon:require('@/assets/img/f3.png')},
                    {icon:require('@/assets/img/f4.png')},
                    {icon:require('@/assets/img/f5.png')},
                    {icon:require('@/assets/img/f6.png')},
                    {icon:require('@/assets/img/f7.png')},
                    {icon:require('@/assets/img/f8.png')},
                    {icon:require('@/assets/img/f9.png')},
                    {icon:require('@/assets/img/f10.png')},
                    {icon:require('@/assets/img/f11.png')},
                    {icon:require('@/assets/img/f12.png')},
                    {icon:require('@/assets/img/f13.png')},
                    {icon:require('@/assets/img/f14.png')},
                ]
            }
        },
        computed:{
            list(){
                return this.$store.state.app.vanList;
            },
            finished(){
                return this.$store.state.app.finished;
            },
            coinList(){
                let arr = this.$store.state.coins;
                if(arr && arr.length > 0){
                    return arr.balance;
                }
            }
        },
        components:{
            backbar
        },
        mounted(){
            this.initPage();
        },
        beforeDestroy(){
            this.$mts.initPage();
        },
        watch:{

        },
        methods:{
            initPage(){
                let that = this;
                that.$mts.checkExpire('needback','lockhouse',()=>{
                    if (that.$store.state.isLogin) {
                        // that.getCoins();
                        that.refresh();
                        that.getFilter();
                        that.$mts.getCoins();
                    }
                })
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
            onChooseCoin(item,index){
                let that = this;
                that.cur = index;
                that.form.defaultCoin = item.coinCode;
            },
            refresh(){
                this.page = 0;
                this.$mts.initPage();
                this.submiting = false;
                this.$store.state.app.loading = true;
                this.query();
            },
            query(){
                let that = this;
                // if(that.form.defaultOption === 0){
                //     that.pair = '';
                // }else{
                //     that.pair = that.form.defaultCoin + '_' + that.form.option.filter((item) => {return item.value == that.form.defaultOption})[0].text;
                // }
                if(!that.submiting){
                    that.submiting = true;
                    that.page++;
                    that.$mts.posts({
                        url:'api/me/financialRecord/list',
                        data:{
                            action:that.types[that.type].symbol,
                            excludeInviteRewards: 0,
                            startTime:that.form.startTime,
                            endTime:that.form.endTime,
                            keyWord:"",
                            limit:that.limit,
                            page:that.page,
                            asset:that.form.defaultCoin,
                        },
                        success(response){
                            that.submiting = false;
                            if (response.data.status == 200) {
                                that.$mts.loadMore(response.data.data);
                            }
                        }
                    });
                }
            },
            getFilter(){
                let that = this;
                that.$mts.posts({
                    url:'api/me/financialRecord/actionList',
                    data:{},
                    success(response){
                        if (response.data.status == 200) {
                            that.allTypes = response.data.data;
                            that.getCalc();
                        }
                    }
                });
            },
            onReset(){
                this.cur = -1;
                this.type = 0;
                this.form.startTime = null;
                this.form.endTime = null;
                this.startDate = '';
                this.endDate = '';
            },
            onConfirm(){
                let that = this;
                that.showFilter = false;
                this.page = 0;
                that.$mts.initPage();
                that.query();
            },
            getCalc(){
                let that = this;
                for(let value of that.allTypes){
                    that.types.push({name: that.vChange(value),symbol: value})
                }
            },
            vChange(value){
                let that = this;
                switch(value){
                    case 'Deposit':
                        return that.$t('filter.desposit');
                    case 'Withdraw':
                        return that.$t('filter.withdraw');
                    case 'Invite rewards':
                        return that.$t('filter.invite');
                    case 'System reward':
                        return that.$t('filter.system');
                    case 'Activity reward':
                        return that.$t('filter.activity');
                    case 'tradeIn':
                        return that.$t('filter.tradeIn');
                    case 'tradeOut':
                        return that.$t('filter.tradeOut');
                    case 'feeOut':
                        return that.$t('filter.fee');
                    case 'transformIn':
                        return that.$t('filter.transferIn');
                    case 'transformOut':
                        return that.$t('filter.transferOut');
                    case 'unLockIn':
                        return that.$t('filter.unLockIn');
                    case 'unLockOut':
                        return that.$t('filter.unLockOut');
                    case 'apply':
                        return that.$t('filter.purchase');
                    case 'unLock':
                        return that.$t('filter.unLock');
                    default:
                        return;
                }
            },
            vIcon(type){
                let that = this;
                switch(type){
                    case 'Deposit':
                        return that.features[0].icon;
                    case 'Withdraw':
                        return that.features[1].icon;
                    case 'Invite rewards':
                        return that.features[2].icon;
                    case 'System reward':
                        return that.features[3].icon;
                    case 'Activity reward':
                        return that.features[4].icon;
                    case 'tradeIn':
                        return that.features[6].icon;
                    case 'tradeOut':
                        return that.features[5].icon;
                    case 'feeOut':
                        return that.features[7].icon;
                    case 'transformIn':
                        return that.features[8].icon;
                    case 'transformOut':
                        return that.features[9].icon;
                    case 'unLockIn':
                        return that.features[10].icon;
                    case 'unLockOut':
                        return that.features[11].icon;
                    case 'apply':
                        return that.features[12].icon;
                    case 'unLock':
                        return that.features[13].icon;    
                    default:
                        return ;
                }
            },
            vAccount(type){
                switch(type){
                    case 'BALANCE':
                        return this.$t('user.index.a1');
                        break;
                    case 'PRIZE_BALANCE_FROZEN':
                        return this.$t('user.index.a2');
                        break;
                    case 'APPLY_AMOUNT':
                        return this.$t('user.index.a3');
                        break;
                    default:
                        return this.$t('user.index.a1');
                        break;
                }
            }
        },
    }
</script>

<style lang="scss">

</style>