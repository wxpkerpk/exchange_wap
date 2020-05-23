<template>
<div class="flexPage themePage">
    <div class="currencyHead fixed themeHead">
        <navbar :params="pageInfo"/>
    </div>  
    <div class="flexContent">
        <div class="zcInfoWrapper">
            <div class="patmentInfo flexBothSidesVertical">
                <dl>
                    <dt>{{pageState}}</dt>
                    <dd>{{$t('otc.order.i1')}}</dd>
                </dl>   
                <dl class="flexSide">
                    <dt @click="chatVO.show = true"><img src="../../assets/img/message.png" alt=""></dt>
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
                            <dd>{{orderVO.merchant}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('otc.order.orderNum')}}<i class="iconfont iconcopy" @click="copy(orderVO.orderNumber)" /></dt>
                            <dd>{{orderVO.orderNumber}}</dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="zcInfo">
                <div class="orderDetInfo">
                    <van-cell-group>
                        <van-cell :title="$t('otc.order.sellerNick')" :value="orderVO.merchantNick">
                            <div class="cellCon">
                                <span>{{orderVO.merchantNick}}</span>
                                <!-- <i class="iconfont iconcopy"  @click="copy(orderVO.merchantNick)"/> -->
                            </div>
                        </van-cell>
                        <van-cell :title="$t('otc.order.sellerName')" :value="orderVO.merchantReal">
                            <div class="cellCon">
                                <span>{{orderVO.merchantReal}}</span>
                                <!-- <i class="iconfont iconcopy"  @click="copy(orderVO.merchantReal)"/> -->
                            </div>
                        </van-cell>
                        <van-cell :title="$t('otc.order.orderNum')" :value="orderVO.orderNumber">
                            <div class="cellCon">
                                <span>{{orderVO.orderNumber}}</span>
                                <i class="iconfont iconcopy"  @click="copy(orderVO.orderNumber)"/>
                            </div>
                        </van-cell>
                        <van-cell :title="$t('otc.order.mark')" :value="orderVO.remarkCode">
                            <div class="cellCon">
                                <span>{{orderVO.remarkCode}}</span>
                                <i class="iconfont iconcopy"  @click="copy(orderVO.remarkCode)"/>
                            </div>
                        </van-cell>
                        <van-cell :title="$t('otc.order.paytime')" :value="orderVO.updateTime">
                            <div class="cellCon">
                                <span>{{orderVO.updateTime}}</span>
                                <i class="iconfont iconcopy"  @click="copy(orderVO.updateTime)"/>
                            </div>
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
        </div>
    </div>
    <!-- 联系卖家 -->
    <chatbar :show="chatVO.show" :advertno="chatVO.advertno" :orderid="chatVO.orderid" :orderno="chatVO.orderno" @onClose="onClose" />
    <downbar/>
</div>
</template>
<script>

import navbar from "@/views/modules/navbar.vue";
import downbar from "@/views/modules/downbar.vue";
import chatbar from "@/views/modules/chatbar.vue";
export default {
    data(){
        return {
            pageInfo:{
                title: this.$t('otc.order.cancelOrder'),
                navbarStyle: 'blue'
            },
            pageState:'',
            concact:{
                show: false
            },
            chatVO:{
                show: false,
                advertno:'',
                orderno:'',
                orderid:0,
            },
            orderVO:{}
        }
    },
    components:{downbar,chatbar,navbar},
    watch:{},
    mounted(){
        this.details()
    },
    methods:{
        onClose(){
            this.chatVO.show = false;
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
            var that = this;
            that.$mts.post({
                url:'otc/order/details/' + this.$route.params.id,
                data:{
                },success(response){
                    if (response.data.code==200) {
                        that.orderVO = response.data.data;
                        that.formatState(response.data.data);
                        that.chatVO.advertno = that.orderVO.advertNumber;
                        that.chatVO.orderno = that.orderVO.orderNumber;
                        that.chatVO.orderid = that.orderVO.id;
                    }
                }
            });
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