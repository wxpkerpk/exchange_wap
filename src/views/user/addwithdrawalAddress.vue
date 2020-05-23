<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div> 
        <div class="flexContent whiteBg">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead flexLevel">
                        <h3>{{$t('user.withdrawal.addwithdrawalAddr')}}</h3>
                    </div>
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('user.public.chooseCoin')}}</div>
						<van-field v-model="form.coin" disabled>
                            <i slot="right-icon" class="iconfont iconDrop-downmenu"  @click="showCoin = true" />
                        </van-field>
                    </div>
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('user.withdrawal.withdrawalAddr')}}</div>
						<van-field v-model="form.address" :placeholder="$t('validate.withdrawal.t1')" @blur="onBlur"></van-field>
                    </div>
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('user.withdrawal.note')}}</div>
						<van-field v-model="form.note" :placeholder="$t('validate.withdrawal.t4')"></van-field>
                    </div>
                    <div class="assetsBtn fixed">
                        <van-button class="active" size="large" @click="onSubmit">{{$t('button.public.submit')}}</van-button>
                    </div>
                </div>
            </div>
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
                        <li v-for="(item,index) in coins" :key="index" :class="{active:defaultCoin == index}" @click="defaultCoin = index"><span><img :src="item.icon" alt="">{{item.coinCode}}</span></li>
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
            return {
                backUrl:{
                    url: '',
                },
                btnStatus:false,
                form:{
                    coin: 'USDT',
                    address: '',
                    note: ''
                },
                defaultCoin: 0,
                showCoin: false,
                flag: false,
            }
        },
        computed:{
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
                that.$mts.checkExpire('needback','addwithdrawalAddress',()=>{
                    if (that.$store.state.isLogin) {
                        that.$mts.getCoins();
                    }
                });
            },
            onChooseCoin(){
                let that = this;
                that.form.coin = that.coins[that.defaultCoin].coinCode;
                that.showCoin = false;
                that.onBlur();
            },
            onBlur(){
                let that = this;
                if(that.form.address){
                    that.$mts.posts({
                        url:'api/me/balanceWithdrawin/checkAddress?address='+that.form.address+'&coinCode='+that.form.coin,
                        data:{},
                        success(response){
                            if (response.data.data == true) {
                                that.$mts.toast(that.$t('message.withdrawal.checkSuc'));
                                that.flag = true;
                            }else{
                                that.$mts.toast(that.$t('message.withdrawal.checkError'));
                            }
                        }
                    });
                }else{
                    that.$mts.toast(that.$t('message.withdrawal.withdrawalEmpty'));
                }
            },
            onSubmit(){
                let that = this;
                if(!that.form.address){
                    that.$mts.toast(that.$t('message.withdrawal.withdrawalEmpty'));
                    return;
                }
                if(that.flag){
                    that.$mts.posts({
                        url:'api/me/withdrawAddress/add',
                        data:{
                            coinCode: that.form.coin,
                            address: that.form.address,
                            label:'',
                            note:that.form.note
                        },
                        success(response){
                            if (response.data.status == 200) {
                                that.flag = false;
                                that.$mts.toast(that.$t('message.public.addSuc'));
                                that.$router.push({name: 'withdrawalAddress'});
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