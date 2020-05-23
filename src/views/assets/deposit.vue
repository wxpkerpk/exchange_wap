<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div> 
        <div class="flexContent whiteBg">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead">
                        <h3>{{$t('user.index.deposit')}}</h3>
                    </div>
                    <van-cell :title="defaultCoin"></van-cell>
                    <div class="coinBox">
                        <div class="usdtColor" v-if="defaultCoin == 'USDT'" v-html="$t('user.deposit.usdt')">
                        </div>
                        <div class="qrCodeBox">
                            <div class="qrcode">
                                <qrcode :value="walletAddress" tag="img" :options="{ width: 180 }"></qrcode>
                            </div>
                            <p>{{$t('user.deposit.save')}}</p>
                        </div>
                        <div class="address">
                            <h3>{{$t('user.deposit.depositAddr')}}</h3>
                            <div class="link">{{walletAddress}}</div>
                            <p><span @click="$mts.copy(walletAddress)">{{$t('button.user.copy')}}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="warnInfo" v-html="$t('user.deposit.t1',{number:depositMin,symbol:defaultCoin})"></div>
        </div>  

        <!-- 选择币种 -->
        <van-popup v-model="showCoin" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('user.public.chooseCoin')}}</span>
                    <van-icon name="cross" @click="showCoin = false" />
                </div>
                <div class="content">
                    <ul>
                        <li v-for="(item,index) in coins" :key="index" :class="{active:cur == index}" @click="cur = index"><span><img :src="item.icon" alt="">{{item.coinCode}}</span></li>
                    </ul>
                </div>
                <div class="btnBox"><van-button size="large" @click="onChooseCoin" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup> 
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return{
                backUrl:{
                    url: '',
                    icon: 'iconrecording',
                    path:'depositHistory'
                },
                showCoin:false,
                defaultCoin: this.$store.state.app.coinCode,
                walletAddress: '--',
                cur: 0,
                nowCoin:{
                    depositMin: 10
                }
            }
        },
        computed:{
            depositMin(){
                let that = this;
                if(that.nowCoin){
                    return that.nowCoin.depositMin;
                }
                return 10;
            },
            coins(){
                let arr = this.$store.state.app.coins.balance;
                if(arr && arr.length > 0){
                    return arr.filter((item) => {return item.allowDeposit == 1});
                }
            }
        },
        components:{
            backbar
        },
        mounted(){
            let that = this;
            that.$mts.checkExpire('needback','deposit',()=>{
                if (that.$store.state.isLogin) {
                    that.initPage();
                }
            });
        },
        methods:{
            initPage(){
                // this.$mts.getCoins();
                this.address();
            },
            onChooseCoin(item){
                let that = this;
                that.defaultCoin = that.coins[that.cur].coinCode;
                that.showCoin = false;
                that.address();
            },
            //钱包地址
            address(){
                let that = this;
                that.$mts.posts({
                    url:'api/me/balance/getAddress',
                    data:{
                        coinCode: that.defaultCoin
                    },
                    success(response){
                        if(response.data.status == 200){
                            that.nowCoin = response.data.data;
                            that.walletAddress = response.data.data.address;
                        }
                    }
                })
            },
        }
    }
</script>  

<style>
    .usdtColor{color:#f30;font-size:4vw;padding-bottom:3vw; text-align: center;}
</style> 