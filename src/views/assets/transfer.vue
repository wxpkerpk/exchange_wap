<template>
    <div class="flexPage transfer">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div> 
        <div class="flexContent">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead">
                        <h3>{{$t('user.index.transfer')}}</h3>
                    </div>
                    <div class="accountBox flexLevel">
                        <div class="lt">
                            <p @click="showCoin = true">
                                <span>{{$t('user.index.from')}}</span>
                                <b>{{ balanceTypeCn }}</b>
                                <van-icon name="arrow" class="arrow"/>
                            </p>
                            <p><span>{{$t('user.index.to')}}</span><b>{{$t('user.index.a1')}}</b></p>
                        </div>
                        <span class="dot">
                            <img src="@/assets/img/dot.png" alt="" v-if="!theme">
                            <img src="@/assets/img/darkDot.png" alt="" v-if="theme">
                        </span>
                    </div>
                    <div class="cellGroup">
                        <div class="title">币种</div>
						<van-cell class="coinCell" v-model="form.defaultCoin"/>
                    </div>
                    <div class="cellGroup">
                        <div class="title">{{$t('user.transfer.transferNum')}}</div>
						<van-field type="number" v-model="form.amount" :placeholder="$t('validate.withdrawal.t2')" @input="onInput" class="coinCell2">
                            <span slot="button" @click="allTransfer" class="select">{{$t('user.withdrawal.all')}}</span>
                        </van-field>
                        <div class="available">{{$t('user.withdrawal.available') + ' ' + allPurchase}}</div>
                    </div>
                    <div class="limitBox">
                        <p>{{$t('user.transfer.transferToast')}}</p>
                        <div class="limitInfo">
                            <dl>
                                <dd>{{$t('user.transfer.minAmount')}}</dd>
                                <dd>{{minAmount}} {{form.defaultCoin}}</dd>
                            </dl>
                            <dl>
                                <dd>{{$t('user.transfer.direction')}}</dd>
                                <dd>只能从认购账户或挖矿账户划转到币币账户</dd>
                            </dl>
                        </div>
                    </div>
                    <div class="bottomFixed">
                        <div class="realAvailable flexLevel">
                            <span>{{$t('user.withdrawal.arriveNum')}}</span>
                            <span>{{(form.amount ? form.amount : 0)+' '+form.defaultCoin}}</span>
                        </div>
                        <div class="assetsBtn">
                            <van-button class="active" size="large" @click="onConfirm">{{$t('button.public.submit')}}</van-button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>  

        <!-- 选择币种 -->
        <van-popup v-model="showCoin" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>账户类型</span>
                    <van-icon name="cross" @click="showCoin = false" />
                </div>
                <div class="content">
                    <ul>
                        <li 
                            v-for="(item,index) in balanceTypeOptions" 
                            :key="index" 
                            :class="{active:cur == index}"
                            @click="cur = index"
                        >
                            <span>{{item.label}}</span>
                        </li>
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
                },
                showCoin:false,
                minAmount: 0.001,
                cur: 0,
                coinList: [],
                form:{
                    defaultCoin: 'TSOL',
                    amount: '',
                    balanceType: 'APPLY_AMOUNT',
                },
                allPurchase: '', // 认购账户
                allMining: '', // 挖矿账户
                check: false,
                timeout: null,
                balanceTypeCn: '认购账户',
                balanceTypeOptions: [
                    {
                        label: '认购账户',
                        value: 'APPLY_AMOUNT',
                    },
                    {
                        label: '挖矿账户',
                        value: 'MINING',
                    },
                ]
            }
        },
        computed:{
            theme(){
                return this.$store.state.app.theme;
            },
            scale(){
                let that = this;
                let array = that.$store.state.app.coins.balance;
                let digit = 8;
                for (var i = array.length - 1; i >= 0; i--) {
                    let item = array[i];
                    if (item.coinCode == that.defaultCoin) {
                        digit = item.scale;
                    }
                }
                return digit;
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
                this.getCoins();
            },
            onChooseCoin(){
                let that = this;
                this.balanceTypeCn = this.balanceTypeOptions[this.cur].label;
                this.form.balanceType = this.balanceTypeOptions[this.cur].value;
                that.showCoin = false;
                that.getPurchase();
                that.form.amount = '';
            },
            getCoins(){
                let that = this;
                that.$mts.posts({
                    url: 'api/me/balance/info',
                    data:{},
                    success(response){
                        if(response.status == 200){
                            that.coinList = response.data.data;  
                            that.getPurchase();               
                        }else{
                            that.$mts.toast(that.$t('message.public.dataError'));
                        }
                    }
                });
            },
            getPurchase(){ // 获取认购账户和挖矿账户余额
                let that = this;
                let arr = that.coinList.balance.filter((item) => {return item.coinCode == that.form.defaultCoin});
                that.allPurchase = arr[0].applyAmount;
                that.allMining = arr[0].mining;
            },
            onInput(){
                let that = this;
                let number = Number(that.form.amount);
                clearTimeout(that.timeout);
                that.timeout = setTimeout(() => {
                    if (that.form.amount) {
                        if(that.form.amount < 0){
                            that.form.amount = 0;
                        }else if(that.form.amount < that.minAmount){
                            that.form.amount = that.$mkt.fmtZero(that.minAmount, that.scale);
                        }else if(that.form.balanceType === 'APPLY_AMOUNT' ? that.form.amount > that.allPurchase : that.form.amount > that.allMining){
                            that.form.amount = that.$mkt.fmtZero(that.allPurchase, that.scale);
                        }else{
                            that.form.amount = that.$mkt.fmtZero(number, that.scale);
                            that.check = true;
                        } 
                    }
                    clearTimeout( that.timeout);
                }, 1000);  
            },
            allTransfer(){
                let that = this;
                that.check = true;
                if (that.form.balanceType === 'APPLY_AMOUNT') {
                    that.form.amount = that.allPurchase;
                } else {
                    that.form.amount = that.allMining;
                }
            },
            onConfirm(){
                let that = this;
                if(that.form.amount){
                    if(that.check){
                        that.$mts.posts({
                            url: `api/activity/transform/transform?coinCode=${that.form.defaultCoin}&amount=${that.form.amount}&balanceType=${that.form.balanceType}`,
                            data:{},
                            success(response){
                                if(response.data.status == 200){
                                    that.$mts.toast(that.$t('message.transfer.transferSuc'));
                                    that.$router.push('/assets');
                                } else {
                                    that.$toast('余额不足');
                                }
                            }
                        })
                    }else{
                        that.$mts.toast(that.$t('message.transfer.transferError'));
                    }
                }else{
                    that.$mts.toast(that.$t('message.transfer.transferEmpty'));
                }
            }
        }
    }
</script>  

<style lang="scss" scoped>
    .transfer {
        .arrow {
            margin-right: 2vw;
        }
    }
</style>

<style lang="scss">
    .transfer {
        .coinCell {
            background-color: #F7F7F7;
            border-radius: 5px;
        }
        .coinCell2, .limitBox {
            border-radius: 5px;
        }
    }
</style> 