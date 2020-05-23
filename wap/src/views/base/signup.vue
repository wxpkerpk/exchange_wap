<template>
<div class="flexPage themeColor">
	<div class="flexHead">
		<div class="signHead">
			<span class="signLogo"><img v-if="!$store.state.app.nightModel" src="../../assets/img/logo2.png"  alt=""><img v-if="$store.state.app.nightModel" src="../../assets/img/logo2_white.png" alt=""></span>
			<van-icon name="cross" @click="$router.go(-1)"></van-icon>
		</div>
	</div>
	<div class="flexContent">
		<div class="signWrapper">
			<ul>
				<li :class="{active: cur==0}" @click="onClick(0)">{{$t('form.signup.mobile')}}</li>
				<li :class="{active: cur==1}" @click="onClick(1)">{{$t('form.signup.email')}}</li>
			</ul>

			<div class="signForm" v-show="cur==0">
				<van-cell-group>
					<van-field type="tel" clearable v-model="form.username" maxlength="32" :placeholder="$t('form.mobile')" />
					<van-field clearable  class="mt4" maxlength="4" v-model="form.code" :placeholder="$t('form.verifyCode')" >
						<van-button slot="button" :disabled="sms.status==1" size="small" @click="sendSms">{{smsBtn}}</van-button>
					</van-field>
					<van-field class="mt4" :type="eyesOn?'text':'password'" v-model="form.password" clearable :placeholder="$t('form.password')" maxlength="64">
						<div slot="right-icon" @click="eyesOn = !eyesOn"><van-icon :name="eyesOn?'eye-o':'closed-eye'" /></div>
					</van-field>
					<van-field class="mt4" :readonly="inviteDisable" type="text" v-model="form.invitationCode" clearable :placeholder="$t('form.signup.recCode')" maxlength="7" />
				</van-cell-group>
				<div class="pt8"><van-button size="large" :class="!submitStatus ? 'active' :''" @click="submit()">{{$t('form.signup.submit')}}</van-button></div>
				<p @click="$router.push('/signin')">{{$t('form.signup.goSignin')}}</p>
			</div>
			<div class="signForm" v-show="cur==1">
				<van-cell-group>
					<van-field type="text" clearable v-model="form.username" maxlength="64"  :placeholder="$t('form.email')" />
					<van-field clearable  class="mt4" maxlength="4" v-model="form.code" :placeholder="$t('form.verifyCode')" >
						<van-button slot="button" :disabled="sms.status==1" size="small" @click="sendSms">{{smsBtn}}</van-button>
					</van-field>
					<van-field class="mt4" :type="eyesOn?'text':'password'" v-model="form.password" clearable :placeholder="$t('form.password')" maxlength="64">
						<div slot="right-icon" class="ml3" @click="eyesOn = !eyesOn"><van-icon :name="eyesOn?'eye-o':'closed-eye'" /></div>

					</van-field>
					<van-field class="mt4" :readonly="inviteDisable" type="text" v-model="form.invitationCode" clearable :placeholder="$t('form.signup.recCode')" maxlength="7" />
				</van-cell-group>
				<div class="pt8"><van-button :class="!submitStatus ? 'active' :''" size="large" @click="submit()">{{$t('form.signup.submit')}}</van-button></div>
				<p @click="$router.push('/signin')">{{$t('form.signup.goSignin')}}</p>
			</div>
		</div>
	</div>
</div>
</template>
<script>
export default {
	data(){
    	return {
			cur: 0,
    		active:'mobile',
    		submitStatus: false, // 是否校验成功
    		eyesOn:false,
    		username:"",
    		password:"",
    		sms:{
                status:0,
                second:60
            },
    		form:{
	    		username:"",
	    		password:"",
	    		code:"",
	    		invitationCode:""
    		},
    		inviteDisable:false,
    		initOk: false,
    		geetest: null, // 极验对象
    		dto:{
    		}
    	}
    },
  	components:{},
  	watch:{},
  	computed:{
  		smsBtn(){
  			let that = this;
            switch(that.sms.status){
                case 0:     //正常
                    return  that.$t("button.assets.sendSms")
                    break;
                case 1:     //发送中
                    return  that.$t("button.assets.hasSend")+"("+that.sms.second+"s)"
                    break;
                case 2:     //重新发送
                    return  that.$t("button.assets.reSend")
                    break;
            }
        }
  	},
	mounted(){
		// 初始化极验
		let that = this;
		// 获取验证码
		if(that.$route.query.i){
			that.form.invitationCode = that.$route.query.i;
			that.inviteDisable = true;
			console.log(that.inviteDisable)
		}
		

		that.$mts.initGt(( geetest)=>{
			that.callback( geetest); // 加载完成
		},(res)=>{ // 参数回调
            that.dto.gt_server_status = res.gt_server_status;
            that.dto.txHash = res.txHash;
		});
	},
	methods:{
		onClick(index){
			this.cur = index;
			switch(index){
				case 0 : 
					this.active = 'mobile';
					break;
				case 1 :
					this.active = 'email';
					break;
			}
		},
		callback(geetest){
            var that = this;
            that.geetest = geetest;
            geetest.onReady(function(){
                //验证码ready之后才能调用verify方法显示验证码
                that.initOk = true;
            }).onSuccess(function(){
                that.register();
            }).onError(function(){
            	that.$toast(that.$t('validate.robot'));
            });
        },

        sendSms(){ // 发送验证码
			let that = this;
			// 需要验证原密码是否正确
			if (that.$vld.checkValue(that.form.username,that.active)) {
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
		            	url:'user/register/captcha',
		            	data:{
		            		username: that.form.username,
		            		type: that.active
		            	},success(response){
		            		// 发送成功
		            		if (response.data.code==200) {
		            			that.$toast(that.$t('message.sms.s1'));
		            		}
		            	}
		            });
				}
			} else {
				that.$toast(that.$t("validate.signup.usernameError"));
			}	
		},
		submit(){
			let that = this;
			if(!that.$vld.checkValue(this.form.username,that.active)){
				that.$toast(that.$t("validate.signup.usernameError"));
				return;
			}
			if(!that.$vld.checkValue(this.form.password,'password')){
				that.$toast(that.$t("validate.public.passwordError"));
				return;
			}
			if(!that.$vld.checkValue(this.form.code,'sms4')){
				that.$toast(that.$t("validate.public.smsError"));

				return;
			}
			//邀请码非必填
			// if(that.form.invitationCode){
			// 	that.$toast(that.$t("validate.public.inviteCode"));
			// 	return;
			// }
			this.submiting = true;
			//完成输入框前端校验后  再调极验 
			if (that.initOk) {
				that.geetest.verify();
			} else {
				that.$toast(that.$t('validate.robot'));
			}
		},
		register(){
			let that = this;
			let validate = that.geetest.getValidate();

			that.submitStatus = true;
			that.$mts.post({
				url:'user/register',
				data:{
					username: that.form.username,
					password: that.form.password,
					invitationCode: that.form.invitationCode,
					code: that.form.code,
					type: that.active,
					gt_server_status: that.dto.gt_server_status,
            		txHash: that.dto.txHash,
					geetest_challenge: validate.geetest_challenge,
                	geetest_validate: validate.geetest_validate,
                	geetest_seccode: validate.geetest_seccode
				},success(response){
					if (response.data.code==200) {
						that.submitStatus = false;
                        that.$toast(that.$t("validate.signup.success"));
						if(localStorage.getItem("isAPP")){//如果是APP，直接去注册页
							that.$router.push({name:'signin'});
						}else{
							//如果不是  就去下载APP
							that.$router.push({name:'download'});
						}
					}
				}
			});
		}
	}
}
</script>
