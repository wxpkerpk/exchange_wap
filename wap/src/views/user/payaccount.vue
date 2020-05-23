<template>
<div class="flexPage themePage">
	<div class="flexHead">
		<div class="payHead">
			<navbar :params="pageInfo" />
			<p class="addAcount" @click="addAccount"><van-icon name="add-o"></van-icon>{{$t('trade.add')}}</p>
		</div>
	</div>
	<div class="flexContent">
		<div class="">
			<div class="paylist">
           	 	<loading />
           		<nodata v-if="!payList || payList.length==0"></nodata>
				<ul>
					<li v-for="(item,index) of payList" :key="index" :class="item.payType" v-if="payList.length>0">
						<dl>
							<!-- <dt><img :src="payImg(item)" alt=""></dt> -->
							<dt>
								<i v-if="item.payType == 'aliPay'" class="iconfont iconAlipay"></i>
								<i v-if="item.payType == 'wePay'" class="iconfont iconWeChatpay"></i>
								<i v-if="item.payType == 'PayPal'" class="iconfont iconpaypal"></i>
								<i v-if="item.payType == 'bankPay'" class="iconfont iconbank-payment"></i>
							</dt>
							<dd>
								<p class="uName">{{item.username}}</p>
								<p class="uAcount">{{item.account}}</p>
							</dd>
						</dl>
						<div @click="removePay(item)">
							<van-icon style="z-index: 99" name="close" ></van-icon>
						</div>
						<span class="payBg one"></span>
						<span class="payBg two"></span>
						<span class="payLogo flexSpindle"><img :src="payIcon(item)" alt=""></span>
					</li> 
				</ul>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import navbar from '@/views/modules/navbar.vue'
import aliPayLogo from '@/assets/img/aliPay.png'
import wePayLogo from '@/assets/img/wePay.png'
import bankPayLogo from '@/assets/img/bankPay.png'
import aliPayIcon from '@/assets/img/aliPayIcon.png'
import wePayIcon from '@/assets/img/wePayIcon.png'
import bankPayIcon from '@/assets/img/bankPayIcon.png'
import paypalIcon from '@/assets/img/paypalIcon.png'
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.personal.payAccount'),
				navbarStyle: 'normal',
				backname:"user"
			},
    		payList:[],
    		popMenu:{
    			show:false,
    			actions:[
			        {name: this.$t('otc.index.alipay'),value:"aliPay"},
			        {name: this.$t('otc.index.wepay'),value:"wePay"},
			        {name: this.$t('otc.index.bankpay'),value:"bankPay"},
			        {name: 'payPal',value:"payPal"}
				],
			},
			imgArr:[
				{name: 'aliPay',imgUrl: aliPayLogo,imgIcon: aliPayIcon},
				{name: 'wePay',imgUrl: wePayLogo,imgIcon: wePayIcon},
				{name: 'bankPay',imgUrl: bankPayLogo,imgIcon: bankPayIcon},
				{name: 'PayPal',imgUrl: paypalIcon,imgIcon: paypalIcon}
			]
    	}
    },
  	components:{navbar},
  	watch:{},
  	computed:{
  	},
	mounted(){
		this.$mts.checkLogin('needback',(res)=>{
			if (res) {
				this.paymentList();
				this.$mts.getKyc();
			}
		},'payaccount');
	},
	methods:{
		addAccount(){
			//通过C2后才能添加支付账户
			console.log(this.$store.state.user.kycState)
			if(this.$store.state.user.kycState>5){
				this.$router.push('/addNewAccount/aliPay')
			}else{
				this.$toast(this.$t("assets.kyc.needC2"));
			}
		},
  		payIcon(item){
  			for(let m of this.imgArr){
  				if(item.payType == m.name){
  					return m.imgIcon
  				}
  			}
  			return ''
  		},

  		payImg(item){
  			for(let m of this.imgArr){
  				if(item.payType == m.name){
  					return m.imgUrl
  				}
  			}
  			return ''
  		},
		addNew(){
			this.popMenu.show = true;
		},
		removePay(item){
			var that = this;
			if(item.state == 2){
	          	that.$toast(that.$t('message.assets.p1'));
				return;
			}
			this.$dialog.confirm({
			  	title: that.$t('message.assets.p2'),
				message: that.$t('message.assets.p3'),
				confirmButtonText: that.$t('button.otc.sure'),
                cancelButtonText: that.$t('button.otc.cancel')
			}).then(() => {
			  	that.$mts.post({
	                url:'payment/delete/' + item.id,
	                data:{}, //
	                success(response){
	                    if(response.data.code == 200){
	          				that.$toast(that.$t('message.assets.deleteSuc'));
	                        that.paymentList();
	                    }
	                }, error( error){
	                    that.$toast(that.$t('message.assets.deleteFailed'));
	            	}
	        	});
			}).catch(() => {
  			});
		},
		paymentList(){
            var that = this;
            this.$mts.post({
                url:'payment/query',
                data:{},
                success(response){
                    if(response.data.code == 200){
                       that.payList = response.data.data;
                     }
                }, error( error){}
            });
        },
        changeDefault(item){
        	var that = this;
            this.$mts.post({
                url:'payment/priority/'+item.id,
                data:{},
                success(response){
                    if(response.data.code == 200){
                    	that.paymentList();
                    }
                }, error( error){}
            });
  		}
	}
}
</script>
