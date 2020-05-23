<template>
<div class="flexPage themeColor">
	<div class="flexHead">
        <navbar :params="pageInfo" />  
    </div>
	<div class="flexContent">
		<div class="signWrapper forgetWrapper">
            <div class="signForm" style="padding-top:5vw">
                <van-cell-group>
                    <van-field type="text" clearable v-model="form.username" maxlength="64" :placeholder="$t('form.username')" />
                    <van-field clearable  class="mt4" maxlength="4" v-model="form.code" :placeholder="$t('form.verifyCode')" >
                        <van-button slot="button" :disabled="sms.status==1" size="small" @click="sendSms">{{smsBtn}}</van-button>
                    </van-field>
                    <van-field class="mt4" :type="eyesOn?'text':'password'" v-model="form.password" clearable :placeholder="$t('form.newPassword')" maxlength="64">
                        <div slot="right-icon" class="ml3" @click="eyesOn = !eyesOn"><van-icon :name="eyesOn?'eye-o':'closed-eye'" /></div>
                    </van-field>
                </van-cell-group>
                <div class="pt8"><van-button :class="!submitStatus ? 'active' :''" size="large" @click="submit()">{{$t('form.submit')}}</van-button></div>
            </div>
        </div>
	</div>
</div>
</template>
<script>
import navbar from '@/views/modules/navbar.vue'
export default {
	data(){
    	return {
            pageInfo:{
                title: this.$t('form.forgot.resetPsw'),
                url: '/sign',
                navbarStyle: 'normal'
            },
    		submitStatus:false,
    		eyesOn:false,
    		sms:{
                status:0,
                second:60
            },
    		form:{
	    		username:"",
	    		password:"",
	    		code:"",
    		},
            initOk: false,
    		geetest: null, // 极验对象
            dto:{
            }
    	}
    },
  	components:{navbar},
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
        let that = this;
        that.$mts.initGt(( geetest)=>{
            that.callback( geetest); // 加载完成
        },(res)=>{ // 参数回调
            that.dto.gt_server_status = res.gt_server_status;
            that.dto.txHash = res.txHash;
        });
    },
	methods:{
		callback(geetest){
            var that = this;
            that.geetest = geetest;
            geetest.onReady(function(){
                //验证码ready之后才能调用verify方法显示验证码
                that.initOk = true;
            }).onSuccess(function(){
                that.changePsw();
            }).onError(function(){
                that.$toast(that.$t('validate.robot'));
            });
        },
        sendSms(){ // 发送验证码
            let that = this;
            // 需要验证原密码是否正确
            if (that.$vld.checkValue(that.form.username,'mobile') ||
                    that.$vld.checkValue(that.form.username,'email')) {
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
                        url:'user/forget/captcha',
                        data:{
                            username: that.form.username,
                            method:'forget'
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
            if(!this.$vld.checkValue(this.form.username,'username')){
                that.$toast(that.$t("validate.signup.usernameError"));
                return;
            }
            if(!this.$vld.checkValue(this.form.password,'password')){
                that.$toast(that.$t("validate.public.passwordError"));
                return;
            }
            this.submitStatus = true;
            //完成输入框前端校验后  再调极验 
            if ( that.initOk) {
                that.geetest.verify();
            } else {
                that.$toast(that.$t('validate.robot'));
            }

        },
        changePsw(){
            let that = this;
            let validate = that.geetest.getValidate();
            that.$mts.post({
                url:"user/forget",
                data:{
                    username: that.form.username,
                    password: that.form.password,
                    code: that.form.code,
                    geetest_challenge: validate.geetest_challenge,
                    geetest_validate: validate.geetest_validate,
                    geetest_seccode: validate.geetest_seccode,
                    gt_server_status: that.dto.gt_server_status,
                    txHash: that.dto.txHash
                },success(response){
                    if(response.data.code == 200){
                        that.$toast(that.$t("validate.forget.success"));
                        that.$router.push({name:'signin'});
                    }else{
                        that.$toast(that.$t("validate.forget.fail"));
                    }
                }
            });
        }
	}
}
</script>
