<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead flexLevel">
                        <h3>{{$t('user.deposit.depositRecord')}}</h3>
                        <i class="iconfont iconshaixuan2" @click="showFilter = true" />
                    </div>
                    <div class="depositList">
                        <dl class="title flexLevel">
                            <dd>{{$t('user.deposit.date')}}</dd>
                            <dd>{{$t('user.deposit.depositNum')}}</dd>
                        </dl>
                        <nodata v-if="!list || list.length==0"></nodata>
                        <ul v-else>
                            <van-pull-refresh v-model="submiting" @refresh="refresh">
                                <van-list
                                    v-model="$store.state.app.loading"
                                    :finished="finished"
                                    :finished-text="$t('list.nomore')"
                                    @load="query"
                                    :offset="50"
                                >
                                    <loading v-if="$store.state.app.loading" />
                                    <li v-for="(item,index) in list" :key="index" @click="$router.push({name: 'depositDetail',params:{id:item.id}})">
                                        <dl class="listItem">
                                            <dt>
                                                <img :src="item.icon" alt="">
                                            </dt>
                                            <dd>
                                                <b class="coin">{{item.coinCode}}</b>
                                                <span class="date">{{$mkt.dateFormat('yyyy.mm.dd HH:MM:SS',item.time)}}</span>
                                            </dd>
                                            <dd>
                                                <span class="status">{{item.confirmation}}</span>
                                                <b class="number">{{item.number}}</b>
                                            </dd>
                                        </dl>
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
                        <p class="title">{{$t('user.public.chooseCoin')}}</p>
                        <dl>
                            <dd v-for="(item,index) in coins" :key="index" :class="{active: cur == index}" @click="cur = index">{{item.coinCode}}</dd>
                        </dl>
                    </div>
                    <div class="btnBox">
                        <span @click="onReset">{{$t('button.trade.reset')}}</span>
                        <span @click="onConfirm">{{$t('button.public.confirm')}}</span>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return {
                backUrl:{
                    url: '',
                    icon: ''
                },
                submiting: false, 
                cur: 0,
                size: 10, 
                defaultCoin: 'USDT',
                showFilter: false,
                coins: [],
                endTime: '',
            }
        },
        computed:{
            list(){
                return this.$store.state.app.vanList;
            },
            finished(){
                return this.$store.state.app.finished;
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
                this.getCoins();
                this.refresh();
                this.vCur();
            },
            getCoins(){
                let that = this;
                that.$mts.posts({
                    url: 'api/me/balance/info',
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.coins = response.data.data.balance.filter((item) => {return item.allowDeposit == 1});  
                        }
                    }
                });
            },
            refresh(){
                this.$mts.initPage();
                this.$store.state.app.loading = true;
                this.endTime = "";
                this.submiting = false;
                this.query();
            },
            query(){
                var that = this;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url:'api/me/balanceWithdrawin/list?coinCode='+that.defaultCoin+'&size='+that.size+'&keyWord=&startTime=&endTime='+that.endTime+'&type=Deposit',
                        data:{},
                        success(response){
                            if (response.data.status == 200) {
                                that.submiting = false;
                                let arr = response.data.data;
                                that.$mts.loading(arr,that.size);
                                if (arr && arr.length > 0) {
                                    that.endTime = arr[arr.length - 1].time;
                                }
                            }
                        }
                    });
                }
            },
            onReset(){
                this.cur = 0;
            },
            onConfirm(){
                let that = this;
                that.defaultCoin = that.coins[that.cur].coinCode;
                that.showFilter = false;
                that.refresh();
            },
            vCur(){
                let that = this;
                if(that.coins && that.coins.length > 0){
                    for(let i = 0; i < that.coins.length; i++){
                        if(that.coins[i].coinCode == that.defaultCoin){
                            that.cur = i;
                        }
                    } 
                }
            }
        }
    }
</script>  

<style>
    
</style> 