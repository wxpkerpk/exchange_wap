<template>
<div class="flexPage darkPage">
	<div class="flexHead">
		<div class="currencyHead fixed themeHead">
			<navbar :params="pageInfo" />
		</div>
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper">
			<div class="zcInfo">
				<!-- 表单 -->
				<div class="form">
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.otc.initiateAd.coin')}}</div>
						<van-cell-group>
							<van-cell :title="chooseCoin.name" :value="$t('form.otc.initiateAd.goChoose')" is-link @click="chooseCoin.show = true"/>
						</van-cell-group>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.tbAddr')}}</div>
						<van-field v-model="formValidate.data.address.value"  :placeholder="$t('form.assets.p3')" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('assets.coinaddr.mark')}}</div>
						<van-field v-model="formValidate.data.remark.value" :placeholder="$t('assets.coinaddr.p1')" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.tradePsw')}}</div>
						<van-field v-model="formValidate.data.password.value" type="password" :placeholder="$t('form.assets.p5')" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.sms')}}</div>
						<van-field v-model="formValidate.data.sms.value" :placeholder="$t('form.assets.p6')" >
						</van-field>
						<van-button slot="button"  class="smsBtn" :disabled="sms.status==1" @click="sendSms('mobile')">{{smsBtn}}</van-button>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.signup.emailCode')}}</div>
						<van-field v-model="formValidate.data.email.value" :placeholder="$t('form.signup.e2')" >
						</van-field>
						<van-button slot="button"  class="smsBtn" :disabled="email.status==1" @click="sendSms('email')">{{emailBtn}}</van-button>
					</div>
					<div class="submitBox">
						<van-button size="large" @click="submit()">{{$t('button.assets.sure')}}</van-button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!--选择币种-->
	<van-popup v-model="chooseCoin.show"  :default-index="1" position="bottom" :overlay="true">
		<van-picker :columns="coins" show-toolbar  @cancel="chooseCoin.show=false" @confirm="onCoinConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
	</van-popup>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.coinaddr.addCoinAddr'),
				navbarStyle: 'blue'
			},
    		sms:{
				status:0,
				second:60
			},
			email:{
				status:0,
				second:60
			},
    		chooseCoin:{
    			show:false,
    			name:"USDT",
			},
    		formValidate:{
    			submiting:false,
    			validateAll:false,
    			data:{
    				address:{
    					value:'',
    					isError:false,
    					isDefault:true
    				},
    				remark:{
    					value:'',
    					isError:false,
    					isDefault:true
    				},
    				password:{
    					value:'',
    					isError:false,
    					isDefault:true
    				},
    				sms:{
    					value:'',
    					isError:false,
    					isDefault:true
    				},
    				email:{
    					value:'',
    					isError:false,
    					isDefault:true
    				}
    			}
    		}
    	}
    },
  	components:{navbar},
  	watch:{
  		"formValidate.data.address.value":function(){
  			this.formValidate.data.address.isDefault = false;
  			this.formValidate.data.address.isError = !this.formValidate.data.address.value;
  			this.checkAllForm();
  		},
  		"formValidate.data.remark.value":function(){
  			this.formValidate.data.remark.isDefault = false;
  			this.formValidate.data.remark.isError = !this.formValidate.data.remark.value;
  			this.checkAllForm();
  		},
  		"formValidate.data.password.value":function(){
  			this.formValidate.data.password.isDefault = false;
  			this.formValidate.data.password.isError = !this.formValidate.data.password.value;
  			this.checkAllForm();
  		},
  		"formValidate.data.sms.value":function(){
  			this.formValidate.data.sms.isDefault = false;
  			this.formValidate.data.sms.isError = !this.formValidate.data.sms.value;
  			this.checkAllForm();
  		},
  		"formValidate.data.email.value":function(){
  			this.formValidate.data.email.isDefault = false;
  			this.formValidate.data.email.isError = !this.formValidate.data.email.value;
  			this.checkAllForm();
  		}
  	},
  	computed:{
  		coins(){
  			let that = this;
  			let result = [];
  			let map = that.$store.state.coin;
  			for(let coin in map){
  				let m = map[ coin];
  				if ( m && m.allowOut == 'Y') {
  					result.push( coin);
  				}
  			}
  			return result;
  		},
  		smsBtn(){
  			let that = this;
            switch(that.sms.status){
                case 0:     //正常
                    return that.$t('button.assets.sendSms');
                    break;
                case 1:     //发送中
                    return that.$t('button.assets.hasSend')+"("+that.sms.second+"s)"
                    break;
                case 2:     //重新发送
                    return that.$t('button.assets.reSend');
                    break;
            }
        },
        emailBtn(){
  			let that = this;
            switch(that.email.status){
                case 0:     //正常
                    return that.$t('button.assets.sendSms');
                    break;
                case 1:     //发送中
                    return that.$t('button.assets.hasSend')+"("+that.email.second+"s)"
                    break;
                case 2:     //重新发送
                    return that.$t('button.assets.reSend');
                    break;
            }
        }
  	},
	mounted(){
		// 获取币种配置
		this.$mts.mustBondAll();
		this.$mts.configure();
	},
	methods:{
		checkAllForm(){
			let arr = [
                this.$data.formValidate.data.address.isDefault,
                this.$data.formValidate.data.address.isError,
                this.$data.formValidate.data.sms.isDefault,
                this.$data.formValidate.data.sms.isError,
                this.$data.formValidate.data.remark.isDefault,
                this.$data.formValidate.data.remark.isError,
                this.$data.formValidate.data.password.isDefault,
                this.$data.formValidate.data.password.isError,
                this.$data.formValidate.data.email.isDefault,
                this.$data.formValidate.data.email.isError,
            ]
            let validate = true;
            for(let m in arr){
                if(arr[m]){
                    validate = false;
                }
            }
            this.$data.formValidate.validateAll = validate;
		},
		sendSms(type){ // 发送验证码
			let that = this;
			// 需要验证原密码是否正确
			if (that.$vld.checkValue(that.formValidate.data.password.value,'password')) {
				if(type == 'mobile'){
					if(that.$data.sms.status!=1){
					that.$data.sms.second = 60;
		            that.$data.sms.status = 1;
		             //点击发送验证码按钮后，按钮禁用。60秒后才能调用
		            var countdown = setInterval(()=>{
		                that.$data.sms.second --;
		                if(that.$data.sms.second <= 0){
		                    that.$data.sms.status = 2;
		                    clearInterval(countdown);
		                }
		            },1000);
		            that.$mts.post({
		            	url:'cheque/captcha',
		            	data:{
		            		password: that.formValidate.data.password.value,
		            		type:type
		            	},success(response){
		            		// 发送成功
		            		if (response.data.code==200) {
		            			that.$toast(that.$t('validate.smsStatus.sucess'));
		            		}
		            	}
		            });
				}
				}else{
					if(that.$data.email.status!=1){
						that.$data.email.second = 60;
			            that.$data.email.status = 1;
			             //点击发送验证码按钮后，按钮禁用。60秒后才能调用
			            var countdown = setInterval(()=>{
			                that.$data.email.second --;
			                if(that.$data.email.second <= 0){
			                    that.$data.email.status = 2;
			                    clearInterval(countdown);
			                }
			            },1000);
			            that.$mts.post({
			            	url:'cheque/captcha',
			            	data:{
			            		password: that.formValidate.data.password.value,
			            		type:type
			            	},success(response){
			            		// 发送成功
			            		if (response.data.code==200) {
			            			that.$toast(that.$t('validate.smsStatus.sucess'));
			            		}
			            	}
			            });
					}
				}	
			} else {
				that.$toast(that.$t('message.assets.t6'));
			}	
		},
		submit(){
			let that = this;
			if (that.formValidate.validateAll) {
				if ( !that.formValidate.submiting) {
					that.formValidate.submiting = true;
					that.$mts.post({
						url:'cheque/modify',
						data:{
							token: that.chooseCoin.name,
							address: that.formValidate.data.address.value,
							remark: that.formValidate.data.remark.value,
							password: that.formValidate.data.password.value,
							sms: that.formValidate.data.sms.value,
							eml:that.formValidate.data.email.value,
						},success(response){
							that.formValidate.submiting = false;
							if (response.data.code==200) {
								that.$toast(that.$t('message.assets.t8'));
								that.$router.push({name:"coinaddress"})
							}
						}
					});
				}
			} else {
				that.$toast(that.$t('message.assets.t9'));
			}
		},
		onCoinConfirm(tag,index){
			this.chooseCoin.name = tag;
			this.chooseCoin.show = false;
		}
	}
}
</script>
