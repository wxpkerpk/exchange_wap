<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="assetsWrapper npd">
                <div class="assetsForm">
                    <div class="assetsHead flexLevel pd4">
                        <h3>{{$t('user.withdrawal.withdrawalAddr')}}</h3>
                        <i class="iconfont iconshaixuan2" @click="showFilter = true" />
                    </div>
                    <div class="withdrawAddr">
                        <nodata v-if="!list || list.length == 0" />
                        <loading v-if="submiting" />
                        <ul v-else>
                            <li v-for="(item,index) in list" :key="index">
                                <div class="flexLevel">
                                    <dl>
                                        <dt><img :src="vPic[0].icon" alt=""></dt>
                                        <dd>
                                            <span class="address">{{item.address}}<i class="iconfont iconcopy" @click="copy(item.address)" /></span>
                                            <span class="note">{{item.note}}</span>
                                        </dd>
                                    </dl>
                                    <i class="iconfont icondelete1" @click="onDelete(item)" />
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="assetsBtn fixed" @click="$router.push({name:'addwithdrawalAddress'})">
                        <van-button size="large" class="active">{{$t('button.public.addWithdraw')}}</van-button>
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

        <!-- 确认删除 -->
        <van-popup v-model="showToast" class="showMore">
            <div class="goModal dark">
                <h3>{{$t('message.public.systemTitle')}}</h3>
                <p>{{$t('message.withdrawal.confirmDelete')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showToast = false">{{$t('button.public.cancel')}}</span>
                    <span class="btn2" @click="onMakeSure">{{$t('button.public.confirm')}}</span>
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
                    url: 'user',
                },
                defaultCoin: 'USDT',
                cur: 0,
                showToast: false,
                list:[],
                showFilter: false,
                id:'',
                submiting:false
            }
        },
        computed:{
            vPic(){
                return this.coins.filter((item) => {return item.coinCode == this.defaultCoin});
            },
            coins(){
                let item = JSON.parse(localStorage.getItem('coins'));
                if (item) {
                    return item.balance.filter((item) => {return item.allowWithdraw == 1});
                }
                return [];
            }
        },
        components:{
            backbar
        },
        mounted(){
            this.initPage();
        },
        watch:{

        },
        methods:{
            initPage(){
                let that = this;
                that.$mts.checkExpire('needback','withdrawalAddress',()=>{
                    if (that.$store.state.isLogin) {
                        that.$mts.getCoins();
                        that.getAddress();
                    }
                });
            },
            getAddress(){
                let that = this;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url:'api/me/withdrawAddress/get?coinCode='+that.defaultCoin,
                        data:{},
                        success(response){
                            // 发送成功
                            if (response.data.status == 200) {
                                that.submiting = false;
                                that.list = response.data.data;
                            }
                        }
                    });
                }
            },
            onDelete(item){
                let that = this;
                that.deleteId = item.id;
                that.showToast = true;
            },
            onMakeSure(){
                let that = this;
                that.$mts.posts({
                    url:'api/me/withdrawAddress/delete?id='+that.deleteId,
                    data:{},
                    success(response){
                        if (response.data.status == 200) {
                            that.showToast = false;
                            that.$mts.toast(that.$t('message.public.withdrawSuc'));
                            that.getAddress();
                        }
                    }
                });
            },
            copy(address){
                this.$mts.copy(address);
            },
            onReset(){
                this.cur = 0;
            },
            onConfirm(){
                let that = this;
                that.defaultCoin = that.coins[that.cur].coinCode;
                that.showFilter = false;
                that.getAddress();
            },
        }
    }
</script>

<style lang="scss">

</style>