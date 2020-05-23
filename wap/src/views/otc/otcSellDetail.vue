<template>
<div class="flexPage themePage">
    <div class="currencyHead fixed themeHead" >
        <navbar :params="pageInfo"/>
    </div>  
    <div class="flexContent">
        <div class="zcInfoWrapper">
            <div class="patmentInfo flexBothSidesVertical">
                <dl>
                    <dt>{{pageState}}</dt>
                    <dd v-if="orderVO.state == 3">{{$t('otc.order.i4')}}</dd>
                </dl>
                <dl class="flexSide chatme" @click="chatVO.show = true">
                    <dt>
                        <!-- <div v-if="orderVO.chatNum > 0" class="unread">
                            {{orderVO.chatNum}}
                        </div> -->
                        <img src="../../assets/img/message.png" alt="">
                    </dt>
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
                            <dt>{{$t('otc.order.buyer')}}</dt>
                            <dd>{{orderVO.buyerTel}}</dd>
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
                        <van-cell :title="$t('otc.index.payWays')" :value="formatName(orderVO.payType)"></van-cell>


                        <van-cell title="付款人">
                            <div class="cellCon">
                                <span>{{orderVO.buyerName}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.buyerName)"/>
                            </div>
                        </van-cell>

                        <van-cell :title="$t('otc.order.payAccount')">
                            <div class="cellCon">
                                <span>{{orderVO.payAccount}}</span>
                                <i class="iconfont iconcopy"  @click="copy(orderVO.payAccount)"/>
                            </div>
                        </van-cell>

                        <!-- 二维码 -->
                        <!-- <van-cell :title="$t('otc.order.qrCode')" v-if="(orderVO.payType=='aliPay' || orderVO.payType=='wePay')&&orderVO.order.receiveAddress">
                        </van-cell>
                        <div class="rightImg" v-if="(orderVO.payType=='aliPay' || orderVO.payType=='wePay')&&orderVO.order.receiveAddress"><img  :src="orderVO.order.receiveAddress" alt=""></div> -->

                        <!-- 银行 -->
                        <van-cell :title="$t('assets.payAccount.bank')" v-if="orderVO.payType=='bankPay'">
                            <div class="cellCon">
                                <span>{{orderVO.bankName}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.bankName)"/>
                            </div>
                        </van-cell>

                        <!-- 开户行 -->
                        <van-cell :title="$t('assets.payAccount.bankName')" v-if="orderVO.payType=='bankPay'">
                            <div class="cellCon">
                                <span>{{orderVO.order.receiveAddress}}</span>
                                <i class="iconfont iconcopy" @click="copy(orderVO.order.receiveAddress)"/>
                            </div>
                        </van-cell>

                        <van-cell :title="$t('otc.order.mark')">
                            <div class="cellCon">
                                <span>{{orderVO.remarkCode}}</span>
                                <i class="iconfont iconcopy"  @click="copy(orderVO.remarkCode)"/>
                            </div>
                        </van-cell>
                        <van-cell :title="$t('otc.order.paytime')" :value="orderVO.createTime"></van-cell>
                    </van-cell-group>
                </div>
            </div>
            <div class="zcInfo">
                <div class="orderDetInfo payType">
                    <van-cell-group>
                        <van-cell :title="$t('otc.order.payee')">
                            <div class="cellCon">
                                <span>{{orderVO.receiveAccount}}</span>
                                <i class="iconfont iconcopy"  @click="copy(orderVO.receiveAccount)" />
                            </div>
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
            <div class="promptInfo sellInfo">
                {{$t('otc.order.t2')}}
            </div>
        </div>
        <div class="orderHandle flexBothSidesVertical">
            <b>{{orderVO.amount}} {{orderVO.rate}}</b><p><!-- <van-button @click="onCancelOrder">取消订单</van-button> -->
            <van-button v-if="orderVO.state != 2 && orderVO.state < 4" @click="showDialog" :disabled="submiting">{{$t('button.otc.freedcoin')}}</van-button></p>
        </div>

        <van-dialog 
            v-model="adopt.isShow" 
            class="assetsPop" 
            @confirm="onConfirmOrder()"  
            :title="$t('trade.popup.fundpassword')" 
            show-cancel-button 
            :confirmButtonText="$t('button.otc.sure')" 
            :cancelButtonText="$t('button.otc.cancel')">
            <div class="">
                <van-field class="assetInput" v-model="adopt.cipher" type="password" :placeholder="$t('trade.popup.p1')" /></div>
        </van-dialog>
    </div>

    <!-- 联系卖家 -->
    <chatbar :show="chatVO.show" :advertno="chatVO.advertno" :orderid="chatVO.orderid" :orderno="chatVO.orderno"  @onClose="onClose" />
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
import chatbar from "@/views/modules/chatbar.vue"
export default {
    data(){
        return {
            pageInfo:{
                title: this.$t('button.otc.sell')+'USDT',
                url: '/otcRepresentation',
                navbarStyle: 'blue'
            },
            pageState:'',
            orderNumber: '',
            choosePayWays:{
                show: false,
                data: [
                    {title: this.$t('otc.index.alipay'), icon: 'alipay',accountName: '1234@777.com'},
                    {title: this.$t('otc.index.bankpay'), icon: 'card',accountName: '***6875'},
                    {title: this.$t('otc.index.wepay'), icon: 'wechat',accountName: 'zhangsan55'}
                ],
                payName: this.$t('otc.index.alipay'),
                icon: 'alipay'
            },
            chatVO:{
                show: false,
                advertno:'',
                orderno:'',
                orderid:0,
            },
            orderVO:{},
            adopt:{
                isShow:false,
                cipher:'',
            },
            submiting:false,
            serInter:null
        }
    },
    components:{navbar,chatbar},
    watch:{},
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        clearInterval(this.serInter)
        next();
    },
    mounted(){
        this.$mts.checkLogin('needback',()=>{ 
            this.details()
            this.serInter = setInterval(()=>{
                this.details();
            },2000)
        }, 'otcselldetail/' + this.$route.params.id);
    },
    methods:{
        //弹出框
        showDialog(){
            this.adopt.isShow = true;
        },
        // 关闭聊天框
        onClose(){
            this.chatInfo.show = false;
        },
        toChangePayWays(){
            this.choosePayWays.show = true;
        },
        onPayWaysClick(params){
            this.choosePayWays.payName = params.title;
            this.choosePayWays.icon = params.icon;
            this.choosePayWays.show = false; 
        },
        onCancelOrder(){
            this.$dialog.confirm({
                message: this.$t('message.otc.cancelOrder'),
                confirmButtonText: this.$t('button.otc.sure'),
                cancelButtonText: this.$t('button.otc.cancel')
            }).then(() => {
                this.$router.push('/otccancel');
            }).catch((error) => {
                console.log(error)
            })
        },
        onConfirmOrder(){
            let that = this;
            // this.$dialog.confirm({
            //     message: that.$t('message.otc.confirmCoin'),
            //     confirmButtonText: that.$t('button.otc.sure'),
            //     cancelButtonText: that.$t('button.otc.cancel')
            // }).then(() => {
            //调用放币接口
            if( !that.$tool.isEmpty(that.adopt.cipher)){
                if (!that.submiting) {
                    that.submiting = true;
                    this.$mts.post({
                        url:'otc/order/adopt',
                        data:{
                            id:this.$route.params.id,
                            cipher:that.adopt.cipher
                        },success(response){
                            that.submiting = false;
                            if (response.data.code==200) {
                                //更新订单详情
                                that.$toast.success({
                                    message: that.$t('message.otc.successCoin'),
                                    duration: 2000
                                });
                                that.send();
                                that.$router.push({name:'otcorders'});
                            }
                        }
                    });
                }
            }else{
                that.$toast(this.$t('trade.popup.p1'))
            }    
            // }).catch((error) => {
            //     console.log(error)
            // })
        },
        send(){
            let that = this;
            that.$mts.posts({
                url:'/otc/chat/send',
                data:{
                    orderNumber: that.orderVO.orderNumber,
                    advertNumber: that.orderVO.advertNumber,
                    content: that.$t('message.otc.p1')
                },success(response){
                    if (response.data.code = 200) {
                    }
                }
            });
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
        details(){
            let that = this;
            that.$mts.post({
                url:'otc/order/details/' + this.$route.params.id,
                data:{
                },success(response){
                    if (response.data.code==200) {
                        that.orderVO = response.data.data;
                        that.formatState( response.data.data)
                        that.chatVO.advertno = that.orderVO.advertNumber;
                        that.chatVO.orderno = that.orderVO.orderNumber;
                        that.chatVO.orderid = that.orderVO.id;
                    }
                }
            });
        },
        onClose(){
            this.chatVO.show = false;
        },
        copy(text){
            this.$copyText(text).then( (e)=> {
                this.$toast(this.$t('message.copy.success'))  
            }, function (e) {})
        }
    }
}
</script>
<style lang="stylus"></style>