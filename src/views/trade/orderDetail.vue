<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead flexLevel">
                        <h3>{{$t('trade.orderdetail')}}</h3>
                    </div>
                    <div class="orderDetail">
                        <div class="top flexLevel">
                            <p class="amount">
                                <span :class="vColor(detail.direction)">{{vText(detail.direction)}}</span>
                                <b>{{$mkt.vPair(detail.pair)}}</b>
                            </p>
                            <span :class="detail.status == 'FULL_COMPLETED' || detail.status == 'PARTIAL_COMPLETED' ? 'green' : 'red'">{{vStatus(detail.status)}}</span>
                        </div>
                        <dl><dt>{{$t('trade.o1')}}</dt><dd>{{$mkt.fmtNum(detail.completed,amountScale)}}/{{$mkt.fmtNum(detail.amount,amountScale)}}</dd></dl>
                        <dl><dt>{{$t('trade.o2')}}</dt><dd>{{$mkt.fmtZero(detail.averagePrice,priceScale)}}/{{$mkt.fmtZero(detail.price,priceScale)}}</dd></dl>
                        <dl><dt>{{$t('trade.o3')}}</dt><dd>{{$mkt.fmtNum(detail.fee, amountScale)}} {{detail.feeCoinCode}}</dd></dl>
                        <dl><dt>{{$t('trade.o4')}}</dt><dd>{{$mkt.fmtNum(detail.total, amountScale)}} {{detail.totalCoinCode}}</dd></dl>
                    </div>
                </div>
            </div>
        </div> 
	</div>
</template>
<script>
import backbar from "@/views/modules/back.vue"
export default {
	data(){
        return {
            backUrl:{

                url: '',
                leftText: '',
            },
            detail:{},
            submiting: false,
        }
    },
    components:{backbar},
    computed:{
        priceScale(){
            let that = this;
            let array = that.$store.state.app.pairs;
            return that.$mkt.getScale(array, that.defaultPair, true);
        },
        amountScale(){
            let that = this;
            let array = that.$store.state.app.pairs;
            return that.$mkt.getScale(array, that.defaultPair, false);
        },
    },
	mounted(){
        let that = this;
        that.details();
        that.$mts.initPage();
        that.$mts.currency();
    },
    watch:{
        
    },
	methods:{
        vStatus(status){
            let that = this;
            switch(status){
                case 'FULL_COMPLETED': // 已成交
                    return that.$t('trade.clinch');
                case 'FULL_CANCELLED': // 已取消
                    return that.$t('trade.canceled');
                case 'PARTIAL_CANCELLED  ':
                    return that.$t('trade.someCancel');
                case 'PARTIAL_COMPLETED':
                    return that.$t('trade.someExecuted');        
                default:
                    return that.$t('trade.Unexecuted');  
            }
        },
        vText(direction){
            if (direction == 'buy') {
                return this.$t('trade.buy');
            }
            return this.$t('trade.sell');
        },
        vColor(direction){
            if (direction == 'buy') {
                return 'green';
            }
            return 'red';
        },
        details(){
            let that = this;
            if (!that.submiting) {
                that.submiting = true;
                that.$mts.posts({
                    url:'api/v2/getPersonOrderDetail?orderId=' + that.$route.params.id,
                    data:{},
                    success(response){
                        if (response.data.status == 200) {
                            that.detail = response.data.data;
                        } else {
                            that.$toast(that.$t('message.public.dataError'));
                        }
                    }
                }); 
            }
        }
	}
}
</script>
