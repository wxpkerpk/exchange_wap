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
						<div class="tbTitle">{{$t('form.email')}}</div>
						<van-field v-model="form.email" clearable :placeholder="$t('form.signup.e1')"></van-field>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.signup.emailCode')}}</div>
						<van-field v-model="form.sms" :placeholder="$t('form.signup.e2')" clearable>
						</van-field>
						<van-button slot="button" class="smsBtn" :disabled="sms.status==1" @click="sendSms">{{smsBtn}}</van-button>
					</div>
					<div class="submitBox">
						<van-button size="large" :loading="formValidate.submiting" :loading-text="$t('button.otc.sure')"  @click="submit()" :disabled="formValidate.submiting">{{$t('button.otc.sure')}}</van-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('form.signup.bindEmail'),
				navbarStyle: 'blue'
			},
			sms:{
                status:0,
                second:60
            },
    		form:{
    			email:"",
    			sms:"",
    		},
    		formValidate:{
    			submiting:false,
    			validateAll:false,
    			validateTwice:false,
    			data:{
	    			email:{
	    				isError:false,
	    				isDefault: true
	    			}
    			}
    		}
    	}
    },
  	components:{navbar},
  	watch:{
  		'form.email':function(){
            this.$data.formValidate.data.email.isDefault = false;

            if(this.$vld.checkValue(this.$data.form.email,'email')){ 
                this.$data.formValidate.data.email.isError = false;
            }else{
                this.$data.formValidate.data.email.isError = true;
            }
        }
  	},
	computed:{
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
        }
  	},
	mounted(){
		let that = this;
		that.$mts.checkLogin('needback',(res)=>{
			if (res) {
				// 已登录 do thing
			}
		},'changePsw');
	},
	methods:{
		sendSms(){ // 发送验证码
			let that = this;
			// 需要验证原密码是否正确
			if (that.$vld.checkValue(that.form.email,'email')) {
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
		            	url:'user/bind/captcha',
		            	data:{
		            		username: that.form.email,
		            		type:'email'
		            	},success(response){
		            		that.$toast(that.$t('message.emailSuc'));
		            	}
		            });
				}
			} else {
				that.$toast(that.$t('validate.public.emailError'));
			}	
		},
        checkAllForm(){
        	let that = this;
        	if ( that.formValidate.data.email.isDefault) {
        		return that.$t('validate.public.notNull');
        	}
        	// 验证通过
        	return false;
        },
		submit(){
			let that = this;
			if ( !that.formValidate.submiting) {
				let message = that.checkAllForm();
				if ( !message) { // 验证通过
					that.formValidate.submiting = true;
					that.$mts.posts({
						url:'user/bind',
						data:{
							username:that.form.email,
							code:that.form.sms,
							type:'email'
						},success(response){
							that.formValidate.submiting = false;
							if (response.data.code == 200) {
								that.$toast(that.$t('validate.public.bindEmailSuc'));
								//更新用户信息
								localStorage.setItem("user",JSON.stringify(response.data.data));
								that.$router.push({name:"safe"});
							}
						}
					});
				} else {
					that.$toast(message);
				}
			}
		}
	}
}
</script>
