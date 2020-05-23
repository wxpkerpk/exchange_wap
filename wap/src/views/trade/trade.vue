<template>
	<div class="flexPage darkPage">
		<div class="flexContent" id="tradeBox">
			<div class="chooseTradeType flexSpindle">
				<span :class="[{active:$store.state.app.trade.chooseType == 0},'flexSpindle','trading']" @click="changeTab(0)">{{$t('trade.t1')}}</span>
				<span :class="[{active:$store.state.app.trade.chooseType == 1},'flexSpindle','trading']"  @click="changeTab(1)">{{$t('home.i3')}}</span>
				<!-- <span :class="[{active:$store.state.app.trade.chooseType == 2},'flexSpindle','trading']"  @click="changeTab(1)">大合约</span> -->
			</div>
			<!-- 交易页面 -->
			<tradeModule v-if="$store.state.app.trade.chooseType == 0" />
		</div>
		<drawer />
		<downbar />
		<van-dialog v-model="$store.state.user.auth.show" class="assetsPop" @confirm="auth()"  :title="$t('trade.popup.fundpassword')" show-cancel-button :confirmButtonText="$t('button.otc.sure')" :cancelButtonText="$t('button.otc.cancel')">
			<div class=""><van-field class="assetInput" v-model="cipher" type="password" :placeholder="$t('trade.popup.p1')" /></div>
		</van-dialog>
	</div>
</template>
<script>
import drawer from "@/views/modules/drawer";
import downbar from "@/views/modules/downbar.vue";
import tradeModule from "@/views/trade/module/tradeModule";
export default {
    data(){
		return {
			cipher:'',
			show: true
		}
    },
    beforeRouteLeave (to, from, next) {
        this.$store.state.app.drawer.show = false;
        this.$store.state.app.trade.chooseType = 0;
        this.$store.state.app.trade.scrollTop = 0;
        next();
    },
    components:{
		downbar,drawer,tradeModule
    },
    watch:{},
    computed:{},
    mounted(){
    	this.$mts.rates();
        this.tradeInit();
        this.$store.state.symbol = this.$route.params.symbol;
    },
    beforeDestroy(){
        this.$store.state.app.trade.scrollTop = 0;
    },
    methods:{
        tradeInit(){
            $("#tradeBox").scroll(()=>{
                this.$store.state.app.trade.scrollTop = $("#tradeBox").scrollTop();
            })
        },
        changeTab(n){
			this.$store.state.app.trade.chooseType = n;
            switch(n){
                case 0:
                    break;
                case 1:
                	let symbol = this.$store.state.symbol;
                	if (symbol != 'ETH_USDT' && symbol != 'BTC_USDT') {
                		symbol = 'BTC_USDT';
                	}
                    this.$mts.goto('secondContract',{symbol});
                    break;
                default:
                    break;
            }
        },
		auth(){ // 交易授权
			let that = this;
			if ( !that.$vld.checkValue(that.cipher,'password')) {
				that.$toast(that.$t('validate.trade.coin.funderror'));
				return;
			}
			that.$mts.posts({
				url:'user/auth',
				data:{
					cipher: that.cipher
				},
				success(response){
					if (response.data.code==200) {
						that.$toast(that.$t('validate.trade.coin.success'));
						that.$store.state.user.auth.show = false;
					}
				}
			});
			
		}
		
    }
}
</script>
