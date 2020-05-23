<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <navbar :params="pageInfo" /> 
        </div>
        <div class="flexContent">
            <div class="otcUserHead">
                <div class="otcUserHeadLeft">
                    <img :src="advert.headImg ==''?head:advert.headImg" alt="">
                    <div>{{advert.nickName}}</div>
                </div>
                <!-- <div class="otcUserHeadRight"><van-icon name="chat-o" /><span>联系商户</span></div> -->
            </div>
            <div class="otcUserCenter">
                <div class="otcUserPay">
                    <dl>
                        <dt>{{$t('otc.detail.price')}}</dt>
                        <dd>{{advert.price}} {{advert.rate}}</dd>
                    </dl>
                    <dl>
                        <dt>{{$t('otc.detail.payWays')}}</dt>
                        <dd>
                            <span v-for="(it,idx) of advert.payList" :key="idx" >
                                <i v-if="it == 'aliPay'" class="iconfont iconAlipay alipayColor"></i>
                                <i v-if="it == 'wePay'" class="iconfont iconWeChatpay wechatColor"></i>
                                <i v-if="it == 'PayPal'" class="iconfont iconpaypal paypalColor"></i>
                                <i v-if="it == 'bankPay'" class="iconfont iconbank-payment cardColor"></i>
                            </span>
                        </dd>
                    </dl>
                </div>
                <div class="otcUserPay twoPay"> 
                    <dl>
                        <dt>{{$t('otc.index.limitAmount')}}</dt>
                        <dd>{{advert.limitDown}} - {{advert.limitUp}} {{advert.rate}}</dd>
                    </dl>
                    <dl>
                        <dt>{{$t('otc.detail.payTime')}}</dt>
                        <dd>
                            15{{$t('otc.detail.min')}}
                        </dd>
                    </dl>
                </div>
                <van-cell-group class="chooseM">
                    <van-cell @click.native="popPayType.show = true" is-link :title="advert.type == 'SELL'?$t('form.otc.initiateAd.payWays'):$t('form.otc.initiateAd.reciveWays')" :value="popPayType.active" />
                </van-cell-group>
                <div class="otcUserPay twoPay">
                    <dl>
                        <dt>{{$t('form.otc.initiateAd.remarks')}}</dt>
                        <dd>{{advert.remark}}</dd>
                    </dl>
                </div>
                <div class="otcdes">
                    <p v-html="$t('otc.detail.s1')"></p>
                </div>
            </div>
        </div>
        <p class="pline"></p>
        <div class="otcBookDown">
            <h2>{{tradetype}}</h2>
            <div class="otcLimit">
                <span v-if="isRange">
                    {{$t('form.otc.initiateAd.limitAmount')}}<span>{{advert.limitDown}} - {{advert.limitUp}} {{advert.rate}}</span>
                </span>
                <span style="color: #f94e65;" v-if="!isRange">
                    {{$t('form.otc.initiateAd.over')}}
                </span>
            </div>
            <div class="otcBookInput">
                <div><input type="number" :placeholder="p1" @keyup="enterAmount" :value="amount"><b>{{advert.rate}}</b></div>
                <div class="exchangePayWays"><img src="../../assets/img/bothArrow.png" alt=""></div>
                <div><input type="number" :placeholder="p2" @keyup="enterNum" :value="num"><b>{{advert.symbol}}</b></div>
            </div>
            <div class="otcBookDownBtn">
                <van-button :disabled="submiting" @click="beforeConfirm()">{{vBtn}}</van-button>
            </div>
        </div>
    
        <van-action-sheet
            class="makeBuy"
            v-model="popup.show"
            :actions="popup.actions"
        >
            <h3 class="flexBothSidesVertical"><span>{{$t('button.otc.buySure')}}</span><van-icon name="cross"  @click="popup.show = false"></van-icon></h3>
            <van-cell-group class="mt3">
                <van-cell :title="$t('trade.sec.payPrice')" :value="advert.price" />
                <van-cell :title="$t('trade.sec.tradeNum')" :value="num" />
                <van-cell :title="$t('otc.popup.totalAmount')" :value="amount" />
            </van-cell-group>
            <div class="bothBtn flexBothSidesVertical">
                <span class="flexSpindle cancle" @click="popup.show = false">{{$t('button.otc.cancel')}}</span>
                <span class="flexSpindle confirm" @click="confirm()">{{$t('button.otc.sure')}}</span>
            </div>
        </van-action-sheet>

        <van-action-sheet
          v-model="popPayType.show"
          :actions="popPayType.list"
          @select="onChoosePayType"
        />

    </div>
</template>
<script>
import navbar from '@/views/modules/navbar.vue';
import headInfo from '@/assets/img/head.jpg';
export default {
    data(){
        return {
            // pageInfo:{
            //     title: '购买',
            //     navbarStyle: 'normal'
            // },
            popPayType:{
                show:false,
                active:"",
                list:[]
            },
            userPayList:[],
            popup:{
                show:false,
                actions: [],
            },
            advert:{},
            wallet:{},
            amount:'',
            num:'',
            type:'',
            params:{},
            head: headInfo,
            submiting: false,
            isRange: true,
        }
    },
    components:{navbar},
    watch:{
        "amount":function(cur,old){
            if (cur && cur > 0) {
                let advert = this.advert;
                if (cur > advert.limitUp
                    || cur < advert.limitDown) {
                    this.isRange = false;
                } else {
                    this.isRange = true;
                }
            } else {
                this.isRange = true;
            }
        }
    },
    computed:{
        pageInfo(){
            return {'title': this.title, 'navbarStyle':'normal'};
        },
        title(){
            return (this.advert.type == 'SELL' ? this.$t('button.otc.buy'):this.$t('button.otc.sell')) + this.advert.symbol;
        },
        isLogin() {
            return this.$store.state.isLogin;
        },
        username(){
            return this.$mts.getUserValue('username');
        },
        tradetype(){
            return (this.advert.type == 'SELL' ? this.$t('otc.detail.howMuchBuy'):this.$t('otc.detail.howMuchSell'));
        },
        p1(){
            return (this.advert.type == 'SELL' ? this.$t('otc.detail.i1'):this.$t('otc.detail.i3'));
        },
        p2(){
            return (this.advert.type == 'SELL' ? this.$t('otc.detail.i2'):this.$t('otc.detail.i4'));
        },
        //获取当前代币的小数位数
        digit(){
            let that = this;
            let digit = 8;
            let map = that.$store.state.coin;
            for(let coin in map){
                if(coin == that.advert.symbol){
                    let m = map[coin].digit
                    digit = m[0]
                }
            }
            return digit;
        },
        vBtn(){
            if (this.advert.type == 'SELL') {
                return this.$t('button.otc.buyNow');
            }
            return this.$t('button.otc.sellNow');
        }
    },
    mounted(){
        this.$mts.checkLogin('needback',()=>{
            if (this.$store.state.isLogin) {
                this.params = this.$route.params;
                this.pageInit();
                this.$mts.getKyc((kycstate)=>{
                    if(kycstate<3){
                        this.$toast(this.$t("assets.kyc.needC1"));
                        this.$router.push({name:"c1"})
                    }
                })
            }
        });
    },
    methods:{

        payTypeList(list){
            let payArr = []
            for(let item of list){
                switch(item){
                    case "aliPay":
                        payArr.push({name:this.$t("otc.index.alipay")})
                        break;
                    case "wePay":
                        payArr.push({name:this.$t("otc.index.wepay")})
                        break;
                    case "bankPay":
                        payArr.push({name:this.$t("otc.index.bankpay")})
                        break;
                    case "PayPal":
                        payArr.push({name:'PayPal'})
                        break;
                }
            }
            return payArr
        },
        onChoosePayType(item){
            this.popPayType.active = item.name;
            this.popPayType.show = false;
        },
        pageInit(){
            this.$mts.configure();
            this.getUserPayment();
            
        },
        onClickRight(){
            
        },
        enterAmount(event){
            let that = this;
            let price = that.advert.price; //单价
            let amount = $(event.target).val();
            //计算过程
            that.num = that.$tdp.fmtZero( amount/price, that.digit);
            that.amount = amount;
        },
        enterNum(event){
            let that = this;
            let price = that.advert.price;
            let num = $(event.target).val();
            //计算过程
            that.amount = that.$tdp.fmtZero( num * price, 4);
            that.num = num;
        },
        //获取下单用户的支付方式，然后可以选择下单用户和商户公有的支付方式
        getUserPayment(){
            var that = this;
            this.$mts.post({
                url:'payment/query',
                data:{},
                success(response){
                    if(response.data.code == 200){
                        //用户的支付方式列表 that.userPayList
                        let list = []
                        for(let i of response.data.data){
                            list.push(i.payType)
                        }
                        that.userPayList = list;
                        that.detail()
                    }
                }, error( error){}
            });
        },
        detail(){
            var that = this;
            that.$mts.post({
                url:'otc/advert/detail/' + this.$route.params.id,
                data:{
                },success(response){
                    if (response.data.code==200) {
                        that.advert = response.data.data;
                        //商户的支付方式列表that.advert.payList
                        let clist = that.advert.payList.filter(function(v){
                            return that.userPayList.indexOf(v)!==-1
                        })
                        that.popPayType.list = that.payTypeList(clist)
                        if(that.popPayType.list==0){
                            that.$toast(that.$t("otc.index.supportPay"))
                        }
                        that.popPayType.active=that.popPayType.list[0].name
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
        beforeConfirm(){
            let that = this;
            if ( that.amount && that.amount > 0
                && that.isRange) {
                that.confirm();
            } else {
                that.$toast(that.$t('message.otc.over'));
            }
        },
        confirm(){
            var that = this;
            let path = '';
            
            that.$mts.checkLogin('needback',()=>{
                if ( !that.submiting) {

                    that.submiting = true;
                    switch(that.advert.type){
                        case 'SELL' :
                            path = 'otc/order/buy';
                            break;
                        case 'BUY':
                            path = "otc/order/sell";    
                    }

                    let payme = "";
                    switch(that.popPayType.active){
                        case "支付宝":
                            payme = 'aliPay'
                            break;
                        case "微信":
                            payme = 'wePay'
                            break;
                        case "银行卡":
                            payme = 'bankPay'
                            break;
                        case "PayPal":
                            payme = 'PayPal'
                            break;
                    }

                    that.$mts.post({
                        url:path,
                        data:{
                            type:that.advert.type=='BUY'?'SELL':'BUY',
                            advertId:that.params.id,
                            amount:that.amount,
                            num:that.num,
                            payType:payme
                        },success(response){
                            that.submiting = false;
                            if (response.data.code==200) {
                                if(that.params.type == 'BUY'){
                                    that.$router.push({name:'otcDetail',params:{id:response.data.data}});
                                }else{
                                    that.$router.push({name:'otcSellDetail',params:{id:response.data.data}});
                                }
                            }
                        }
                    });
                }
            }); 
        }
    }
}
</script>
<style lang="stylus"></style>