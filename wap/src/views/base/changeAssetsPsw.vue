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
				<div class="center pb3 sellcolor">{{$t("validate.public.changeAssetsPswToast")}}</div>
				<div class="center pb3 sellcolor" v-if="!hasMobile">{{$t("form.needMobile")}}</div>
				<div class="center pb3 sellcolor" v-if="!hasEmail">{{$t("form.needEmail")}}</div>
				<div class="form">
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.oldpwd')}}</div>
						<van-field type="password" v-model="form.oldPassword" clearable :placeholder="$t('form.account.o2')" right-icon="question-o" @click-right-icon="$toast($t('validate.public.changeAssetsPswToast'))"></van-field>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.sms')}}</div>
						<van-field v-model="form.sms" :placeholder="$t('form.signup.m2')" clearable>
						</van-field>
						<van-button slot="button"  class="smsBtn" :disabled="sms.status==1 || !hasMobile" @click="sendSms('mobile')">{{smsBtn}}</van-button>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.signup.emailCode')}}</div>
						<van-field v-model="form.email" :placeholder="$t('form.signup.e2')" clearable>
						</van-field>
						<van-button slot="button"  class="smsBtn" :disabled="email.status==1 || !hasEmail" @click="sendSms('email')">{{emailBtn}}</van-button>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.newpwd')}}</div>
						<van-field type="password" v-model="form.newPassword" clearable :placeholder="$t('form.account.n2')" ></van-field>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.repwd')}}</div>
						<van-field type="password" v-model="form.rePassword" clearable :placeholder="$t('form.account.r2')" ></van-field>
					</div>
					<div class="submitBox">
						<van-button size="large" @click="submit()" :disabled="submiting">{{$t('button.otc.sure')}}</van-button>
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
				title: this.$t('form.signup.changeAssetsPsw'),
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
    		form:{
    			oldPassword:"",
    			sms:"",
    			email:'',
    			newPassword:"",
    			rePassword:""
    		},
    		submiting:false,
    		hasMobile:false,
    		hasEmail:false,
    	}
    },
  	components:{navbar},
  	watch:{},
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
        },
  	},
	mounted(){
		this.$mts.checkLogin('needback',()=>{
			this.$mts.mustBondAll();
			this.hasEmail = this.$mts.getUserValue('email')?true:false;
			this.hasMobile = this.$mts.getUserValue('mobile')?true:false;
		});
	},
	methods:{
		sendSms(type){ // 发送验证码
			let that = this;
			// 需要验证原密码是否正确
			if (that.$vld.checkValue(that.form.oldPassword,'password')) {
				if( type == 'mobile'){
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
			            	url:'/user/cipher/captcha',
			            	data:{
				            	password: that.form.oldPassword,
				            	type:type
			            	},success(response){
			            		that.$toast(that.$t('message.sms.s1'));
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
			            	url:'/user/cipher/captcha',
			            	data:{
				            	password: that.form.oldPassword,
				            	type:type
			            	},success(response){
			            		that.$toast(that.$t('message.sms.s1'));
			            	}
		        		});
					}
				}
			} else {
				that.$toast(that.$t('validate.public.oldPswError'));
			}	
		},
		submit(){
			let that = this;
			if(!that.$vld.checkValue(that.form.oldPassword,'password')){
				that.$toast(that.$t('message.assets.t6'));
				return;
			}
			if(!that.$vld.checkValue(that.form.newPassword,'password')
				|| !that.$vld.checkValue(that.form.rePassword,'password')){
				that.$toast(that.$t('validate.public.passwordError'));
				return;
			}
			if (that.form.newPassword != that.form.rePassword) {
				that.$toast(that.$t('validate.public.notSame'));
				return;
			}
			if(!that.$vld.checkValue(that.form.sms,'sms4')){
				that.$toast(that.$t('validate.public.smsError'));
				return;
			}
			if (!that.submiting) {
				that.submiting = true;
				that.$mts.post({
					url:'user/cipher/password',
					data:{
						password: that.form.oldPassword,
						newPassword: that.form.newPassword,
						againPassword: that.form.rePassword,
						sms: that.form.sms,
						eml:that.form.eml,
					},success(response){
						if (response.data.code==200) {
							that.submiting = false;
							that.$toast(that.$t('validate.public.changeAssetsPswSuc'));
							that.$router.push({name:'user'});
						}
					}
				});
			}
		}
	}
}
</script>
