<template>
<div class="flexPage darkPage">
    <div class="currencyHead fixed themeHead" >
        <navbar :params="pageInfo"/>
    </div>  
    <div class="flexContent">
        <div class="zcInfoWrapper">
            <div class="patmentInfo flexBothSidesVertical">
                <dl>
                    <dt>{{pageState}}</dt>
                    <dd v-if="orderVO.state == 1">{{countTime.time}} {{$t('otc.order.i2')}}</dd>
                </dl>   
                <dl class="flexSide chatme" @click="chatVO.show = true">
                    <dt>
                       <!--  <div v-if="orderVO.chatNum > 0" class="unread">
                            {{orderVO.chatNum}}
                        </div> -->
                    <img src="../../assets/img/message.png" alt=""></dt>
                    <dd>{{$t('otc.order.call')}}</dd>
                </dl>         
            </div> 
			<div class="zcInfo">
                <div class="chatInfo">
                    <div class="chatInfoTop">
                        <dl>
                            <dt>{{$t('otc.detail.price')}}</dt>
                            <dd>{{orderVO.price}} {{orderVO.rate}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('trade.number')}}</dt>
                            <dd>{{orderVO.num}} {{orderVO.symbol}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('otc.order.seller')}}</dt>
                            <dd>{{orderVO.sellerTel}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('otc.order.orderNum')}}<i class="iconfont iconcopy" @click="copy(orderVO.orderNumber)" /></dt>
                            <dd>{{orderVO.orderNumber}}</dd>
                        </dl>
                    </div>
                </div> 
            </div>

            <div class="zcInfo">
                <div class="orderDetInfo payType">
                    <van-cell-group>
                        <van-cell  :title="$t('otc.index.payWays')" 
                            :class="formatClass(orderVO.payType)" :value="formatName(orderVO.payType)">
                        </van-cell>
                        <van-cell title="收款人">
                            <div class="cellCon">
                                <span>{{orderVO.sellerName}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.sellerName)"/>
                            </div>
                        </van-cell>
                        <van-cell :title="$t('otc.order.payee')">
                            <div class="cellCon">
                                <span>{{orderVO.receiveAccount}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.receiveAccount)"/>
                            </div>
                        </van-cell>
                        <!-- 二维码 支付宝和微信-->
                        <van-cell :title="$t('otc.order.qrCode')" v-if="orderVO.payType=='aliPay' || orderVO.payType=='wePay'">
                        </van-cell>
                        <div class="rightImg" v-if="orderVO.payType=='aliPay' || orderVO.payType=='wePay'"><img  :src="orderVO.order.receiveAddress" alt=""></div>

                        <!-- 银行 -->
                        <van-cell title="银行" v-if="orderVO.payType=='bankPay'">
                            <div class="cellCon">
                                <span>{{orderVO.bankName}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.bankName)"/>
                            </div>
                        </van-cell>
                        <!-- 开户行 -->
                        <van-cell title="开户行" v-if="orderVO.payType=='bankPay'">
                            <div class="cellCon">
                                <span>{{orderVO.order.receiveAddress}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.order.receiveAddress)"/>
                            </div>
                        </van-cell>


                        <van-cell :title="$t('otc.order.mark')">
                            <div class="cellCon">
                                <span>{{orderVO.remarkCode}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.remarkCode)"/>
                            </div>
                        </van-cell>
                        <van-cell :title="$t('otc.order.paytime')" :value="orderVO.createTime"></van-cell>
                    </van-cell-group>
                </div>
            </div>
            <div class="zcInfo">
                <div class="orderDetInfo payType">
                    <van-cell-group>
                        <van-cell :title="$t('otc.order.payAccount')" :value="orderVO.payAccount">
                            <div class="cellCon">
                                <span>{{orderVO.payAccount}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.payAccount)"/>
                            </div>
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
           <!--  <div class="zcInfo">
                <div class="orderDetInfo">
                    <van-cell-group>
                        <van-cell v-for="item in orderInfo" :key="item.title" :title="item.title">
                            <div class="cellCon">
                                <span>{{item.value}}</span>
                                <i class="iconfont iconcopy" @click="copy(item.value)"/>
                            </div>
                        </van-cell>
                    </van-cell-group>
                </div>
            </div> -->
            <div class="promptInfo" v-html="$t('otc.order.t1')"></div>
        </div>
        <div class="orderHandleDH"></div>
        <div class="orderHandle flexBothSidesVertical">
            <b>{{orderVO.amount}} {{orderVO.rate}}</b><p><van-button v-if="orderVO.state == 1" @click="onCancelOrder">{{$t('button.otc.cancelOrder')}}</van-button><van-button v-if="orderVO.state == 1 || orderVO.state == 3" :disabled="orderVO.state==3" @click="onConfirmOrder">我已付款</van-button></p>
        </div>
    </div>

    <!-- 二维码 -->
    <div class="QRBox" v-if="showQRCode" @click="showQRCode = false">
        <div class="QRCode">
            <qrcode class="qrcode" :value="walletAddress" :options="{ size: 300 }"></qrcode>
        </div>
    </div>
    <!--选择支付方式-->
    <van-popup v-model="choosePayWays.show"  :default-index="1" position="bottom" :overlay="true">
        <div class="zcInfo">
            <div class="orderDetInfo popUpPayWays">
                <van-cell-group>
                    <van-cell v-for="item in choosePayWays.data" :key="item.title" :title="item.title" :class="item.icon == 'alipay' ? 'alipayColor' : (item.icon == 'card' ? 'cardColor' : 'wechatColor')" :icon="item.icon" is-link :value="item.account" @click="onPayWaysClick(item)"> 
                    </van-cell>
                </van-cell-group>
            </div>
        </div>
    </van-popup>
    <!-- 联系卖家 -->
    <chatbar :show="chatVO.show" :advertno="chatVO.advertno" :orderid="chatVO.orderid" :orderno="chatVO.orderno" @onClose="onClose" />
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
import chatbar from "@/views/modules/chatbar.vue";
import {countdown} from "@/assets/js/class/index.js";
export default {
    data(){
        return {
            pageInfo:{
                title: this.$t('button.otc.buy') + 'USDT',
                url: '/otcRepresentation',
                value: this.$t('otc.order.state'),
                navbarStyle: 'blue'
            },
            pageState:'',
            orderNumber: '',
            orderInfo: [],
            choosePayWays:{
                show: false,
                data: [],
                payName: this.$t('otc.index.alipay'),
                icon: 'alipay',
                account:'',
                payType:'',
            },
            chatVO:{
                show: false,
                advertno:'',
                orderno:'',
                orderid:0,
            },
            showQRCode: false,
            orderVO:{},
            countTime:{
                clear(){
                    
                }
            },
            serInter:null
        }
    },
    components:{navbar,chatbar},
    watch:{
    },
    computed:{
    },
    beforeRouteLeave (to, from, next) {
        this.countTime.clear();
        clearInterval(this.serInter)
        next();
    },
    mounted(){
        this.$mts.checkLogin('needback',()=>{ 
            this.details()
            this.pay()
            this.serInter =  setInterval(()=>{
                this.details();
            },2000)
        }, 'otcDetail/' + this.$route.params.id);
    },
    methods:{
        // 关闭聊天框
        onClose(){
            this.chatVO.show = false;
        },
        toChangePayWays(){
            this.choosePayWays.show = true;
        },
        formatState(item){
            let that = this;
            switch(item.state){
                case 1:
                    that.pageState = that.$t('otc.order.p6');
                    break;
                case 2:
                    that.pageState = that.$t('otc.order.p2');
                    break;
                case 3:
                    that.pageState = that.$t('otc.order.p3');
                    break;
                case 4:
                    that.pageState = that.$t('otc.order.p4');
                    break;
                case 5:
                    that.pageState = that.$t('otc.order.p5');
                    break;                 
            }
        },
        formatClass(type){
            let that = this;
            switch(type){
                case 'aliPay':
                    return 'alipayColor';
                    break;
                case 'wePay':
                    return 'wechatColor';
                    break;
                case 'bankPay':
                    return 'cardColor';
                    break;
                case 'PayPal':
                    return 'payPalColor';
                    break;                 
            }
        },
        formatIcon(type){
            let that = this;
            switch(type){
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
        formatName(type){
            let that = this;
            switch(type){
                case 'aliPay':
                    return that.$t('otc.index.alipay');
                    break;
                case 'wePay':
                    return that.$t('otc.index.wepay');
                    break;
                case 'bankPay':
                    return that.$t('otc.index.bankpay');
                    break;
                case 'PayPal':
                    return 'PayPal';
                    break;                 
            }
        },
        onPayWaysClick(params){
            this.choosePayWays.payName = params.title;
            this.choosePayWays.icon = params.icon;
            this.choosePayWays.account = params.account;
            this.choosePayWays.payType = params.payType;
            this.choosePayWays.show = false; 
        },
        onCancelOrder(){
            let that = this;
            this.$dialog.confirm({
                message: that.$t('message.otc.cancelOrder'),
                confirmButtonText: that.$t('button.otc.sure'),
                cancelButtonText: that.$t('button.otc.cancel')
            }).then(() => {
                //调用取消订单接口
                this.$mts.post({
                    url:'otc/order/cancel/' + this.$route.params.id,
                    data:{
                    },success(response){
                        if (response.data.code==200) {
                            that.send( that.$t('message.otc.p2'));
                            that.$router.push({name:'otcCancel',params:{id:response.data.data}});
                        }
                    }
                });
            }).catch((error) => {
                console.log(error)
            })
        },
        onConfirmOrder(){
            let that = this;
            this.$dialog.confirm({
                message: that.$t('message.otc.confirmPay'),
                confirmButtonText: that.$t('button.otc.sure'),
                cancelButtonText: that.$t('button.otc.cancel')
            }).then(() => {
                //调用付款接口
                this.$mts.post({
                    url:'otc/order/pay',
                    data:{
                        id: that.$route.params.id,
                        payType: that.choosePayWays.payType,
                        payAccount:that.choosePayWays.account,
                },success(response){
                    if (response.data.code==200) {
                        //更新订单详情
                        that.details();
                        that.$toast.success({
                            message: that.$t('validate.trade.coin.orderSuc'),
                            duration: 2000
                        })
                        that.send( that.$t('message.otc.p3'));
                    }
                }
            });
            }).catch((error) =>{
                console.log(error)
            })    
        },
        send(content){
            let that = this;
            that.$mts.posts({
                url:'/otc/chat/send',
                data:{
                    orderNumber: that.orderVO.orderNumber,
                    advertNumber: that.orderVO.advertNumber,
                    content: content
                },success(response){
                    if (response.data.code = 200) {
                    }
                }
            });
        },
        copy(text){
            this.$copyText(text).then((e)=> {
                this.$toast(this.$t('message.copy.success'))  
            }, function (e) {})
        },
        details(){
            let that = this;
            that.$mts.post({
                url:'otc/order/details/' + this.$route.params.id,
                data:{
                },success(response){
                    if (response.data.code==200) {
                        that.orderVO = response.data.data;
                        // that.order( response.data.data);
                        that.formatState( response.data.data)
                        that.chatVO.advertno = that.orderVO.advertNumber;
                        that.chatVO.orderno = that.orderVO.orderNumber;
                        that.chatVO.orderid = that.orderVO.id;
                        if (that.orderVO.state == 1) {
                            that.countDown();
                        }
                    }
                }
            });
        },
        format(item){
            let that = this;
            let title = '';
            let icon = '';
            switch( item.payType){
                case 'aliPay':
                    title = that.$t('otc.index.alipay');
                    icon = 'alipay';
                    break;
                case 'wePay':
                    title = that.$t('otc.index.wepay');
                    icon = 'wechat';
                    break;  
                case 'bankPay':
                    title = that.$t('otc.index.bankpay');
                    icon = 'card';
                    break;
                case 'PayPal':
                    title = 'PayPal';
                    icon = 'paypal';
                    break; 
            }
            let data = {title: title, icon: icon,account: item.account,payType:item.payType};
            that.choosePayWays.data.push( data);
            return data;
        },
        pay(){
            let that = this;
            let result = [];
            console.log(112);
            that.$mts.post({
                url:'payment/list',
                data:{
                },success(response){
                    if (response.data.code==200) {
                        result = response.data.data;
                        for(let idx = 0;idx < result.length; idx ++){
                            let data = that.format( result[idx]);
                            //若为默认
                            if( result[idx].state == 2 || result.length == 1){
                                that.choosePayWays.payName = data.title;
                                that.choosePayWays.icon = data.icon;
                                that.choosePayWays.account = result[idx].account;
                            }
                        } 
                    }
                }
            });
        },
        countDown(){
            let that = this;
            that.countTime = new countdown({
                startTime:that.orderVO.nowTime,
                endTime:that.orderVO.endTime,
                endhanlder(){
                    //倒计时结束
                    that.$mts.post({
                        url:'otc/order/cancel/' + that.$route.params.id,
                        data:{
                        },success(response){
                            if (response.data.code==200) {
                                that.$router.push({name:'otcCancel',params:{id:response.data.data}});
                            }
                        }
                    });
                }
            })
        }
    }
}
</script>
<style lang="stylus"></style>