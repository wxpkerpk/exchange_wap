<template>
	<div class="flexPage darkPage">
		<div class="flexHead">
			<div class="currencyHead fixed themeHead">
				<navbar :params="pageInfo" />                               
			</div>
		</div>
		<div class="flexContent">
			<div class="zcInfoWrapper">
				<div class="zcInfo adver">
					<!-- 表单 -->
					<div class="payTypes">
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.addType')}}</div>
							<van-cell-group>
								<van-cell :title="payType" :value="$t('form.otc.initiateAd.goChoose')" is-link @click="choosePayType.show=true"/>
							</van-cell-group>
						</div>
					</div>                                                                                                                                                     
					<!-- 银行 -->
					<div class="form" v-if="payType == $t('otc.index.bankpay')">
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.chooseBank')}}</div>
							<van-cell-group>
								<van-cell :title="bankPay.bankName" :value="$t('form.otc.initiateAd.goChoose')" is-link @click="chooseBank.show=true"/>
							</van-cell-group>
						</div>
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.bankName')}}</div>
							<van-field clearable v-model="bankPay.address" :placeholder="$t('assets.payAccount.b1')"></van-field>
						</div>
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.bankUser')}}</div>
							<van-field clearable v-model="bankPay.username" :placeholder="$t('assets.payAccount.b2')"></van-field>
						</div>
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.bankCard')}}</div>
							<van-field clearable v-model="bankPay.account" :placeholder="$t('assets.payAccount.b3')"></van-field>
						</div>
					</div>
					<!-- 支付宝 -->
					<div class="form" v-if="payType == $t('otc.index.alipay')">
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.realname')}}</div>
							<van-field clearable v-model="aliPay.username" :placeholder="$t('assets.payAccount.p1')"></van-field>
						</div>
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.alipayAccount')}}</div>
							<van-field clearable v-model="aliPay.account" :placeholder="$t('assets.payAccount.p2')"></van-field>
						</div>
						<div class="photoBox">
                        	<p>{{$t('assets.payAccount.uploadCode')}}</p>
							<div class="photoUpdate">
                                <van-uploader class="miniLoader" :after-read="onRead">
                                    <van-icon v-if="!upload" name="photograph" />
                                    <img v-if="upload" :src="aliPay.address" class="picUploader" />
                                </van-uploader>
                            </div>
						</div>
					</div>
					<!-- 微信 -->
					<div class="form" v-if="payType == $t('otc.index.wepay')">
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.realname')}}</div>
							<van-field clearable v-model="wePay.username" :placeholder="$t('assets.payAccount.p1')"></van-field>
						</div>
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.wepayAccount')}}</div>
							<van-field clearable v-model="wePay.account" :placeholder="$t('assets.payAccount.p3')"></van-field>
						</div>                                                                                                                                                       
						<div class="photoBox">
							<p>{{$t('assets.payAccount.uploadCode')}}</p>
							<div class="photoUpdate">
                                <van-uploader class="miniLoader" :after-read="onRead"  multiple>
                                    <van-icon v-if="!upload" name="photograph" />
									<img v-if="upload" :src="wePay.address" class="picUploader" />
                                </van-uploader>
                            </div>
						</div>
					</div>
					<!-- Paypal -->                                                                                                                                                                                      
					<div class="form" v-if="payType == 'PayPal'">
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.realname')}}</div>
							<van-field clearable v-model="PayPal .username" :placeholder="$t('assets.payAccount.p1')"></van-field>
						</div>
						<div class="cellGroup">
							<div class="tbTitle">{{$t('assets.payAccount.paypalAccount')}}</div>
							<van-field clearable v-model="PayPal.account" :placeholder="$t('assets.payAccount.p4')"></van-field>
						</div>
					</div>	
					<div class="mt5">
						<van-button @click="submit()" size="large" type="info">{{$t('button.otc.sure')}}</van-button>
					</div>
				</div>
			</div>
		</div>
		<!--选择支付类型-->
		<van-popup v-model="choosePayType.show"  :default-index="1" position="bottom" :overlay="true">
			<van-picker :columns="choosePayType.data" show-toolbar  @cancel="choosePayType.show=false" @confirm="onPayTypeConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')"/>
		</van-popup>
		<!--选择银行-->
		<van-popup v-model="chooseBank.show"  :default-index="1" position="bottom" :overlay="true">
			<van-picker :columns="chooseBank.data" show-toolbar  @cancel="chooseBank.show=false" @confirm="onBankConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
		</van-popup>
	</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
import { constants } from 'crypto';
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.payAccount.addPayAccount'),
				navbarStyle: 'blue'
			},
			type:"bankPay",
			payType: this.$t('otc.index.bankpay'),
			validateAll:false,
			submiting:false,
			choosePayType:{
				show:false,
				data:JSON.parse(this.$t('assets.payAccount.z1')),
			},
    		chooseBank:{
    			data:JSON.parse(this.$t('assets.payAccount.z2')),
    			show:false,
    			name:""
    		},
    		aliPay:{
				account:'',
				payType:'aliPay',
                payName:this.$t('otc.index.alipay'),
                address:'',
				username:''
    		},
    		wePay:{
				account:'',
				payType:'wePay',
                payName:this.$t('otc.index.wepay'),
                address:'',
				username:''
    		},
    		bankPay:{
				account:'',
				payType:'bankPay',
				payName:this.$t('otc.index.bankpay'),
				username:'',
				address:'',
				bankName:this.$t('assets.payAccount.defaultBank')
			},
			PayPal:{
				account:'',
				payType:'PayPal',
                payName:'PayPal',
				username:'',
    		},
    		upload: false, // 是否上次
    		payList:[],
    	}
    },
  	components:{navbar},
  	watch:{},
  	computed:{
  		
  	},
	mounted(){
		this.$mts.mustBondAll();
		this.paymentList();
	},
	methods:{
		formatName(){
  			switch(this.payType){
  				case this.$t('otc.index.bankpay'):
  					return "bankPay";
  					break;
  				case this.$t('otc.index.alipay'):
  					return "aliPay";
  					break;
  				case this.$t('otc.index.wepay'):
  					return "wePay";
  					break;
  				case 'PayPal':
  					return 'PayPal';
  					break;		
  			}
  		},
		submit(){
			let that = this;
			let validate = false;
			let data = that.aliPay;
			if(that.payType == this.$t('otc.index.wepay')) {
				data = that.wePay;
			}else if(this.payType == this.$t('otc.index.bankpay')){
				data = that.bankPay;
			}else if(this.payType == 'PayPal'){
				data = that.PayPal;
			}
			for(let m in data){
				if(!data[m]){
					this.$toast(that.$t('validate.needAll'));
					return false;
				}
				// 全部校验通过
				if(!this.submiting){
					this.submiting = true;
					this.$mts.post({
						url:'payment/add',
						data:data,
						success(response){
							if(response.data.code == 200){
								that.$router.push({name:"payaccount"});
							}
							that.submiting = false;
						}, error( error){
							that.$toast(that.$t('message.assets.addFailed'));
						}
					}); 
				}
			}
		},
		onPayTypeConfirm(tag,index){
			this.payType = tag;
			//验证
			for(let item of this.payList){
	            if(item.payName== tag){
		            this.$toast(this.$t('message.assets.hasAdd'));
	                return;
	            }
        	}
			switch(tag){
				case this.$t('otc.index.bankpay'):
					this.type =  'bankPay';
					break;
				case this.$t('otc.index.alipay'):
					this.type =  'aliPay';
					break;
				case this.$t('otc.index.wepay'):
					this.type = 'wePay';
					break;
				case 'PayPal':
					this.type = 'PayPal';
					break;		
			}
			this.choosePayType.show = false;
		},
		onBankConfirm(tag,index){
			this.bankPay.bankName = tag;
			this.chooseBank.show = false;
		},
		onRead(file, detail){
			// 开始上传图片
			let that = this;
			let data = new FormData();
			data.append('img', file.file);
			data.append('name', detail.name);
			that.$mts.upload({
				url:'payment/upload',
				data,
				success(response){
					if (response.data.code == 200) {
						that.upload = true; // 上次完成
						if(that.type == 'aliPay'){
							that.aliPay.address = response.data.data;
						} else if(that.type == 'wePay'){
							that.wePay.address = response.data.data;
						}
					}
				}
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
						console.log(response.data.data)
                    }
                }, error( error){}
            });
        },
	}
}
</script>
