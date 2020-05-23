<template>
<div class="flexPage darkPage">
    <div class="currencyHead fixed themeHead">
		<navbar :params="pageInfo" />
	</div>
    <div class="flexContent">
        <div class="zcInfoWrapper">
            <div class="zcInfo adver">
                <div class="form">
                    <div class="checkBox">
                        <div class="tbModle f32">{{$t('form.otc.initiateAd.tradeMode')}}</div>
                        <van-radio-group v-model="form.type">
                            <van-radio name="BUY" icon-size="3.4667vw">{{$t('trade.buyIn')}}</van-radio>
                            <van-radio name="SELL" icon-size="3.4667vw">{{$t('trade.sellOut')}}</van-radio>
                        </van-radio-group>
                    </div>
                    <div class="cellGroup">
                        <div class="tbTitle">{{$t('form.otc.initiateAd.legalcurrency')}}</div>
                        <van-cell :title="form.legalCurrency" :value="$t('form.otc.initiateAd.goChoose')" @click="chooseLegalCurrency.show=true" is-link />
                    </div>
                    <div class="checkBox">
                        <div class="tbModle f32">{{$t('form.otc.initiateAd.payWays')}}</div>
                        <van-checkbox-group v-model="payType">
                            <van-checkbox
                                v-for="(item,index) in form.payList"
                                :key="index"
                                :name="item"
                                icon-size="3.4667vw"
                            >
                                <i v-if="item == 'aliPay'" class="iconfont mr1 iconAlipay alipayColor"></i>
                                <i v-if="item == 'wePay'" class="iconfont mr1 iconWeChatpay wechatColor"></i>
                                <i v-if="item == 'PayPal'" class="iconfont iconpaypal paypalColor"></i>
                                <i v-if="item == 'bankPay'" class="iconfont iconbank-payment cardColor"></i>
                            </van-checkbox>
                        </van-checkbox-group>
                    </div>
                    <div class="cellGroup">
                        <div class="tbTitle">{{$t('form.otc.initiateAd.coin')}}</div>
                        <van-cell :title="form.currency" :value="$t('form.otc.initiateAd.goChoose')" @click="chooseCurrency.show=true" is-link />
                    </div>
                    <div class="cellGroup">
                        <div class="tbTitle">{{$t('form.otc.initiateAd.setCoinPrice')}}</div>
                        <van-field v-model="form.price" :placeholder="$t('form.otc.initiateAd.i1')" />
                    </div>
                    <div class="otcBookDown">
                        <p class="f32">{{$t('form.otc.initiateAd.inputAmount')}}</p>
                        <div class="color f32">{{$t('form.otc.initiateAd.limitAmount')}} {{form.limitDown}} - {{form.limitUp}} {{form.legalCurrency}}</div>
                        <div class="otcBookInput">
                            <div class="inputBox"><input type="text" :placeholder="$t('form.otc.initiateAd.minAmount')" v-model="form.limitDown" @blur="onChange"><b>{{form.legalCurrency}}</b></div>
                            <div class="wave">～</div>
                            <div class="inputBox"><input type="text" :placeholder="$t('form.otc.initiateAd.maxAmount')" v-model="form.limitUp" @blur="onChange"><b>{{form.legalCurrency}}</b></div>
                        </div>
                    </div>
                    <div class="textArea">
                        <p>{{$t('form.otc.initiateAd.remarks')}}</p>
                        <textarea v-model="form.remark" :placeholder="$t('form.otc.initiateAd.t1')"></textarea>
                    </div>
                    <div>
                        <van-button 
                            :loading="formValidate.submiting" 
                            @click="submit()" 
                            :loading-text="$t('button.otc.sure')" size="large">{{$t('button.otc.sure')}}
                        </van-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--选择法币-->
    <van-popup v-model="chooseLegalCurrency.show"  :default-index="1" position="bottom" :overlay="true">
        <van-picker :columns="curr" show-toolbar  @cancel="chooseLegalCurrency.show=false" @confirm="onLegalCurrencyConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
    </van-popup>
    <!--选择币种-->
    <van-popup v-model="chooseCurrency.show"  :default-index="1" position="bottom" :overlay="true">
        <van-picker :columns="coin" show-toolbar  @cancel="chooseCurrency.show=false" @confirm="onCurrencyConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')"/>
    </van-popup>

    <!--提交成功-->
    <van-popup v-model="popup.show" class="successPopup"  :default-index="1" :overlay="true">
        <div class="successText">
            <p><van-icon name="cross" @click="onClose"></van-icon></p>
            <h3 class="flexSpindle">{{$t('otc.popup.success')}}</h3>
            <div class="toastText">
                {{$t('message.otc.i3')}}
            </div>
            <van-button size="large" @click="onClose">{{$t('otc.popup.ok')}}</van-button>
        </div>
    </van-popup>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
    data(){
        return {
            pageInfo:{
                title: this.$t('otc.popup.playAd'),
                navbarStyle: 'blue'
            },
            popup:{
                show: false,
            },
            chooseLegalCurrency: {
                show: false,
            },
            payType:[],
            wallet:{},
            config:{},
            chooseCurrency: {
                show: false

            },
            form:{
                type: 'BUY', // 交易模式 
                legalCurrency: "CNY",
                currency:"USDT",
                price:"",
                limitDown:"",
                limitUp:"",
                remark:"",
                payList: [],
            },
            formValidate:{
                submiting:false,
                validateAll:false,
                validateTwice:false,
                data:{
                    limitDown:{
                        value:"",
                        isError:false,
                        isDefault: true
                    },
                    limitUp:{
                        value:"",
                        isError:false,
                        isDefault: true
                    },
                    remark:{
                        value:"",
                        isError:false,
                        isDefault: true
                    }
                }
            }
        }
    },
    computed:{
        rates(){
            let that = this;
            let actions = [];
            let map = that.$store.state.rates;
            if( map){
                let m = map[Object.keys(map)[0]]
                for(let idx = 0; idx < m.length; idx ++){
                    actions.push( m[idx].symbol)
                }
            }
            return actions;
        },
        //获取所有的货币
        coin(){
            let that = this;
            let actions = [];
            let map = that.$store.state.coin;
            for(let coin in map){
                let m = map[coin]
                if(m && m.isOtc == 'Y'){
                    actions.push(coin)
                }
            }
            return actions;
        },
        //法币
        curr(){
            let that = this;
            return that.$store.state.currency;
        },

    },
    components:{
        navbar
    },
    watch:{
    },
    mounted(){
        //汇率
        this.$mts.rates();
        //货币
        this.$mts.configure();
        //法币
        this.$mts.currency();
        this.pageInit();
    },
    methods:{
        pageInit(){
            //支付方式
            this.pay();
            //广告配置
            this.advert();
            //钱包信息
            this.walletInfo();
        },
        onChangeRadio(str){
            this.radio = str;
        },
        juageAount(){
            if(this.form.limitDown < 0){
                this.$toast({
                    message: this.$t('message.otc.min'),
                    duration: 2000
                });
            }else if(this.form.limitUp < 0){
                this.$toast({
                    message: this.$t('message.otc.max'),
                    duration: 2000
                });
            } 
        },
        //计算用户最大额度（卖出时）
        max(){
            let that = this;
            if(that.form.type = 'SELL'){
                //计算最大额度
                return that.form.price * that.wallet.usableOtc;
            }
        },
        onChange(){
            this.juageAount();
        },
        onCheck(){

        },
        formatClass(item){
            switch (item){
                case 'aliPay':
                    return 'alipayColor payIcon';
                    break;
                case 'wePay':
                    return 'wechatColor payIcon';
                    break; 
                case 'bankPay':
                    return 'cardColor payIcon';
                    break;
                case 'PayPal':
                    return 'paypalColor payIcon';
                    break;          
            }
        },
        formatName(item){
            switch (item){
                case 'aliPay':
                    return 'alipay';
                    break;
                case 'wePay':
                    return 'wechat';
                    break; 
                case 'bankPay':
                    return 'card';
                    break;
                case 'PayPal':
                    return 'paypal';
                    break;          
            }
        },
        onLegalCurrencyConfirm(tag,index){
            this.form.legalCurrency = tag;
            this.chooseLegalCurrency.show = false;
        },
        onPayWaysConfirm(tag,index){
            this.form.pay = tag;
			this.choosePayWays.show = false;
        },
        onCurrencyConfirm(tag,index){
            this.form.currency = tag;
			this.chooseCurrency.show = false;
            this.walletInfo();
        },
        advert(){
            let that = this;
            that.$mts.post({
                url:'advert/config',
                data:{
                },success(response){
                    if (response.data.code == 200) {
                        that.config = response.data.data;
                    }
                }
            });
        },
        pay(){
            let that = this;
            that.$mts.post({
                url:'payment/type',
                data:{
                },success(response){
                    if (response.data.code == 200) {
                        that.form.payList = response.data.data;
                        if(that.form.payList.length==0){
                            that.$toast(that.$t("message.otc.needPayAccount"))
                            that.$router.push({name:"payaccount"})
                        }
                    }
                }
            });
        },
        //用户当前货币钱包信息
        walletInfo(){
            let that = this;
            that.$mts.post({
                url:'wallet/info',
                data:{
                    symbol:that.form.currency
                },success(response){
                    if (response.data.code == 200) {
                        that.wallet = response.data.data;
                    }
                }
            });
        },
        submit(){
            //弹出成功提示框
            //this.popup.show = true;
            
            let that = this;



            if(that.limitDown >= that.limitUp){
                that.$toast("最小输入值不能大于最大输入值")
                return;
            }

            if (!that.formValidate.validateAll) {
                if ( !that.formValidate.submiting) {
                    that.formValidate.submiting = true;
                    that.$mts.posts({
                        url:'otc/advert/modify',
                        data:{
                            type: that.form.type,  //类型（买入/卖出）
                            rate: that.form.legalCurrency, //法币
                            payType:that.payType.toString(),   //支付方式
                            symbol:that.form.currency,  //货币简称
                            price:that.form.price,  //单价
                            limitDown:that.form.limitDown,  //下限
                            limitUp:that.form.limitUp,    //上限
                            remark:that.form.remark  //商家留言
                        },success(response){
                            that.formValidate.submiting=false;
                            if ( response.data.code == 200) {
                                that.$toast(that.$t('message.otc.playSuc'));
                                that.$router.push({'name':'otc'});
                            }
                        }
                    });
                }
            } else {
                that.$toast(that.$t('message.otc.require'));
            }
        },
        // 关闭提示框
        onClose(){
            this.popup.show = false;
        }
    }
}
</script>
<style lang="stylus"></style>