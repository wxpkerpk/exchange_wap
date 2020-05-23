<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead flexLevel">
                        <h3>{{$t('user.withdrawal.withdrawalRecord')}}</h3>
                        <i class="iconfont iconshaixuan2" @click="showFilter = true" />
                    </div>
                    <div class="withdrawList">
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
                                    <li v-for="(item,index) in list" :key="index" @click="$router.push({name: 'withdrawalDetail',params:{id:item.id}})">
                                        <div class="listItem flexLevel">
                                            <div class="lt">
                                                <dl>
                                                    <dt><img :src="item.icon" alt=""></dt>
                                                    <dd>{{item.coinCode}}</dd>
                                                </dl>
                                                <span class="time">{{$mkt.dateFormat('yyyy-mm-dd HH:MM:SS',item.time)}}</span>
                                            </div>
                                            <div class="rt">
                                                <dl>
                                                    <dt :class="vColor(item.status)">{{item.status == 'Completed' ? $t('user.public.success') : $t('user.public.pending')}}</dt>
                                                    <dd><span>{{$t('user.withdrawal.arriveNum')}}</span><b>{{'：' + item.number + item.coinCode}}</b></dd>
                                                </dl>
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
            },
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
                that.coins = JSON.parse(localStorage.getItem('coins')).balance.filter((item) => {return item.allowWithdraw == 1});
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
                        url:'api/me/balanceWithdrawin/list?coinCode='+that.defaultCoin+'&size='+that.size+'&keyWord=&startTime=&endTime='+that.endTime+'&type=Withdraw',
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
            vColor(status){
                switch(status){
                    case 'Completed':
                        return 'green';
                    case 'Pending':
                        return '';
                    case 'Checking':
                        return '';
                    case 'Failed':
                        return '';
                    default: 
                        return 'green';
                }
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