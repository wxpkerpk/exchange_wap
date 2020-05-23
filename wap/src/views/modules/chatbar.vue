<template>  
    <!-- 联系卖家 -->
    <van-popup
        :value="show"
        position="bottom"
        class="downToUp chatToUp"
        round
        @click-overlay="$emit('onClose')"
    >
        <div class="popupPage">
            <div class="concactHead">
                <div class="userInfo">
                    <div class="userLeft">
                        <img :src="!orderVO.headImage ? head : orderVO.headImage" alt="头像">
                        <b>{{orderVO.merchantNick}}</b>
                    </div>
                    <van-icon name="cross" @click="$emit('onClose')"></van-icon>
                </div>
                <div class="acountInfo">
                    <p><span>{{$t('otc.order.tradeTotal')}}</span><span>{{orderVO.updateTime}}</span></p>
                    <p><b>{{orderVO.amount}}</b><b v-html="formatState(orderVO.state)"></b></p>
                </div>
            </div>
            <div class="concatContent">
                <!-- <p class="inDate">2019-7-16 10:24；40</p>
                <div class="orderInfo">您已成功下单，请及时支付。</div> -->
                <!-- 卖家 -->
                <!-- <div class="concactBox seller">
                    <img src="../../assets/img/avatar.jpeg" alt="头像">
                    <div class="content">
                        <span class="triangle"></span>
                        在线，打款就可以了，请勿备注任何信息。合作请联系
                    </div>
                </div> -->
                <!-- 买家 -->
                <!-- <div class="concactBox buyer">
                    <div class="content">
                        <span class="triangle"></span>
                        好的呐
                    </div>
                    <img src="../../assets/img/avator1.png" alt="头像">
                </div> -->
                <div :class="item.own == 'Y'?'concactBox buyer':'concactBox seller'" v-for="(item,index) of list" :key="index">
                    <div class="" v-if="item.own!='Y'">
                        <img :src=" !item.headImage ? head : item.headImage" alt="头像" />
                        <div class="content">
                            <span class="triangle"></span>
                            {{item.content}}
                        </div>
                    </div>
                    <div class="" v-if="item.own=='Y'">
                        
                        <div class="content">
                            <span class="triangle"></span>
                            {{item.content}}
                        </div>
                        <img :src=" !item.headImage ? head : item.headImage" alt="头像" />
                    </div>
                </div> 
            </div>
            <!-- 回复框 -->
            <div class="chatInput flexBothSidesVertical">
                <div class="inputText">
                    <input type="text" :placeholder="$t('otc.order.i5')" v-model="content">
                    <!-- <van-icon name="photo-o"></van-icon> -->
                </div>
                <span @click="onsend">{{$t('button.otc.send')}}</span>
            </div>
        </div>
    </van-popup>
</template>

<script> 
import headInfo from '@/assets/img/head.jpg'
export default {
    data(){
        return{
            content: '',
            param:{}, //参数
            orderVO:{}, //订单详情
            head:headInfo,
            chatList:[],
            interval: null,
        }
    },
    props:{
        show:{
            type: Boolean,
            default: false,
            validator: function (value) {
                return true;
            }
        },
        orderid:{
            type: Number,
            default: 0,
            validator: function (value) {
                return true;
            }
        },
        orderno:{
            type: String,
            default: '',
            validator: function (value) {
                return true;
            }
        },
        advertno:{
            type: String,
            default: '',
            validator: function (value) {
                return true;
            }
        },
    },
    beforeDestroy(){
        clearInterval( this.interval);
    },
    mounted(){
        // this.pageInit()
    },
    watch:{
        "orderid":function(cur, old){
            //this.details();
        },
        "show":function(cur, old){
            if (cur) {
                this.onopen();
                this.details();
                this.hisotry();
                clearInterval( this.interval);

                this.interval = setInterval(()=>{
                    this.hisotry();
                }, 3000);
            } else {
                this.chatList = []
                this.orderVO = {}
                clearInterval( this.interval);
            }
        }
    },
    computed:{
        list(){
            let that = this;
            return that.chatList;
        },   
    },
    methods:{
        pageInit(){
            this.onopen();
            this.details();
        },
        onopen(){
            let that = this;
            that.$store.state.chatData.list = [];
        },  
        //订单详情
        details(){
            let that = this;
            if(!that.orderid == 0){
                that.$mts.post({
                url:'otc/order/details/' + that.orderid,
                data:{
                },success(response){
                    if (response.data.code==200) {
                        that.orderVO = response.data.data;
                    }
                }
            });
            }
        },
        hisotry(){
            let that = this;
            if(that.advertno&&that.orderno){
                that.$mts.posts({
                    url:'/otc/chat/query',
                    data:{
                        advertNumber: that.advertno,
                        orderNumber: that.orderno,
                    },success(response){
                        if (response.data.code == 200) {
                            that.chatList = response.data.data;
                        }
                    }
                });
            }
        },
        onsend(){
            let that = this;
            that.$mts.posts({
                url:'/otc/chat/send',
                data:{
                    orderNumber: that.orderno,
                    advertNumber: that.advertno,
                    content: that.content
                },success(response){
                    if (response.data.code == 200) {
                        that.content = ""; // 置空
                        that.hisotry();
                    }
                }
            });
        },
        formatState(state){
            let that = this;
            switch(state){
                case 1:
                    return that.$t('otc.order.p6');
                    break;
                case 2:
                    return that.$t('otc.order.p2');
                    break;
                case 3:
                    return that.$t('otc.order.p3');
                    break;
                case 4:
                    return that.$t('otc.order.p4');
                    break;
                case 5:
                    return that.$t('otc.order.p5');
                    break;                 
            }
        },
    }
}

</script>

<style lang="stylus">

</style>