<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('user.safe.modifyPsw')}}</h3>
                </div>
                <div class="signForm">
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.oldPsw')}}</p>
                        <van-field type="password" v-model="form.oldPsw.value"  :placeholder="$t('validate.safe.t1')" clearable maxlength="16" />
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.newPsw')}}</p>
                        <van-field type="password" v-model="form.newPsw.value" :placeholder="$t('validate.safe.t2')" clearable maxlength="16" />
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.repPsw')}}</p>
                        <van-field type="password" v-model="form.confirmPsw.value" :placeholder="$t('validate.safe.t3')" clearable maxlength="16" />
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.code')}}</p>
                        <van-field type="text" v-model="form.code.value" :placeholder="$t('validate.safe.c1')" clearable :disabled="sms.status==0" maxlength="6">
                            <span slot="button" @click="sendSms()" :disabled="sms.status==1" class="sendSms">{{smsBtn}}</span>
                        </van-field>
                    </div>
                    <div class="btnBox">
                        <van-button :class="{active: btnStatus}" :disabled="sms.status == 0" size="large" @click="onSubmit">{{$t('button.public.submit')}}</van-button>
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
				url:''
            },
            btnStatus: false,
            form:{
                oldPsw: {
                    value: '',
                    isDefault: true,
                    isError: false
                },
                newPsw:{
                    value: '',
                    isDefault: true,
                    isError: false
                },
                confirmPsw:{
                    value: '',
                    isDefault: true,
                    isError: false
                },
                code:{
                    value: '',
                    isDefault: true,
                    isError: false
                }
            },
            sms:{
                second: 60,
                status: 0
            },
            areaCode: localStorage.getItem('areaCode') || 86,
            telPhone: JSON.parse(localStorage.getItem('user')).telPhone,
            email: JSON.parse(localStorage.getItem('user')).email,
        }
    },
    components:{backbar},
    computed:{
        smsBtn(){
            let that = this;
            switch(that.sms.status){
                case 0:     //正常
                    return that.$t('button.public.sent');
                    break;
                case 1:     //发送中
                    return that.$t('button.public.sending')+"("+that.sms.second+"s)";
                    break;
                case 2:     //重新发送
                    return that.$t('button.public.resend');
                    break;
            }
        },
        emailBtn(){
            let that = this;
            switch(that.emailCode.status){
                case 0:     //正常
                    return that.$t('button.public.sent');
                    break;
                case 1:     //发送中
                    return that.$t('button.public.sending')+"("+that.emailCode.second+"s)";
                    break;
                case 2:     //重新发送
                    return that.$t('button.public.resend');
                    break;
            }
        },
},
	mounted(){
        
    },
    watch:{
        "form.oldPsw.value":function(){
            if(!this.form.oldPsw.value){
                this.$mts.toast(this.$t('message.safe.oldPswEmpty'));
            }
            this.form.oldPsw.isDefault = false;
            this.form.oldPsw.isError = !this.form.oldPsw.value;
            this.checkAllForm();
        },
        "form.newPsw.value":function(){
            if(!this.form.newPsw.value){
                this.$mts.toast(this.$t('message.safe.newPswEmpty'));
            }
            this.form.newPsw.isDefault = false;
            this.form.newPsw.isError = !this.form.newPsw.value;
            this.checkAllForm();
		},
		"form.confirmPsw.value":function(){
            if(!this.form.confirmPsw.value){
                this.$mts.toast(this.$t('message.safe.repPswEmpty'));
            }
            this.form.confirmPsw.isDefault = false;
            this.form.confirmPsw.isError = !this.form.confirmPsw.value;
            this.checkAllForm();
        },
        "form.code.value":function(){
            if(!this.form.code.value){
                this.$mts.toast(this.$t('message.safe.smsCode'));
            }
            this.form.code.isDefault = false;
            this.form.code.isError = !this.form.code.value;
            this.checkAllForm();
        },
    },
	methods:{
        checkAllForm(){
			let arr = [
				this.form.oldPsw.isDefault,
				this.form.oldPsw.isError,
				this.form.newPsw.isDefault,
				this.form.newPsw.isError,
				this.form.confirmPsw.isDefault,
                this.form.confirmPsw.isError,
                this.form.code.isDefault,
				this.form.code.isError,
			];
			let validate = true;
			for(let i in arr){
				if(arr[i]){
					validate = false;
				}
			}
			this.btnStatus = validate;
        },
        sendSms(type){
            let that = this;
            if(that.sms.status!=1){
                that.sms.second = 60;
                that.sms.status = 1;
                //点击发送验证码按钮后，按钮禁用。60秒后才能调用
                var countdown = setInterval(()=>{
                    that.sms.second --;
                    if(that.sms.second <= 0){
                        that.sms.status = 2;
                        clearInterval(countdown);
                    }
                },1000);
                if(that.telPhone){
                    that.$mts.posts({
                        url:'api/me/sms/captcha?areaCode='+that.areaCode+'&phoneNumber='+that.telPhone+'&modules=profile',
                        data:{},
                        success(response){
                            // 发送成功
                            if (response.data.status==200) {
                                if(response.data.status == 200){
                                    that.$mts.toast(that.$t('message.public.smsSuc'));
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.sms.limitTimes'));
                                }else if(response.data.status == 900){
                                    that.$mts.toast(that.$t('endNotice.sms.smsError'));
                                }
                            }
                        }
                    });
                }else if(that.email){
                    that.$mts.posts({
                        url:'api/me/mail/captcha?email='+that.email+'&modules=profile',
                        data:{},
                        success(response){
                            // 发送成功
                            if (response.data.status==200) {
                                if(response.data.status == 200){
                                    that.$mts.toast(that.$t('message.public.smsSuc'));
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.sms.limitTimes'));
                                }else if(response.data.status == 900){
                                    that.$mts.toast(that.$t('endNotice.sms.smsError'));
                                }
                            }
                        }
                    });
                }   
            }
        },
        onSubmit(){
            let that = this;
            if(that.btnStatus){
                if(!that.$vld.checkValue(that.form.oldPsw.value,'password')){
                    that.$mts.toast(that.$t('message.public.oldPswError'));
                    return;
                }
                if(!that.$vld.checkValue(that.form.newPsw.value,'password')){
                    that.$mts.toast(that.$t('message.public.pswError'));
                    return;
                }
                if(that.form.newPsw.value != that.form.confirmPsw.value){
                    that.$mts.toast(that.$t('message.public.repPswError'));
                    return;
                }
                if (that.telPhone) { // 验证通过
                    that.$mts.posts({
                        url:'api/me/security/editLoginPassword',
                        data:{
                            currentPassword:that.form.oldPsw.value,
                            newPassword:that.form.newPsw.value,
                            captcha:that.form.code.value,
                            areaCode: that.telPhone ? that.areaCode : '',
                        },success(response){
                            if (response.data.status == 200) {
                                that.$toast(that.$t('message.safe.modifySuc'));
                                that.$router.push('/security');
                            }else if(response.data.status == 700){
                                that.$mts.toast(that.$t('endNotice.modifyPsw.paramsError'));
                            }else if(response.data.status == 701){
                                that.$mts.toast(that.$t('endNotice.modifyPsw.codeError'));
                            }else if(response.data.status == 900){
                                that.$mts.toast(that.$t('endNotice.modifyPsw.overtimes'));
                            }
                        }
                    });
                } 
            }else{
                that.$mts.toast(that.$t('message.public.notEmpty'));
            }
        }
	}
}
</script>
