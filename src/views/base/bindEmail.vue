<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('user.safe.bindEmail')}}</h3>
                </div>
                <div class="signForm">
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.email')}}</p>
                        <van-field v-model="form.data.email.value" :placeholder="$t('validate.safe.e1')" clearable maxlength="64" @blur="onBlur"/>
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.smsCode')}}</p>
                        <van-field type="number" v-model="form.data.smsCode.value" :placeholder="$t('validate.safe.m2')" clearable maxlength="6">
                            <span slot="button" @click="sendSms('mobile')" class="sendSms">{{smsBtn}}</span>
                        </van-field>
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.emailCode')}}</p>
                        <van-field type="number" v-model="form.data.emailCode.value" :placeholder="$t('validate.safe.e2')" clearable maxlength="6">
                            <span slot="button" @click="sendSms('email')" class="sendSms">{{emailBtn}}</span>
                        </van-field>
                    </div>
                    <div class="btnBox">
                        <van-button :class="{active: btnStatus}" size="large" @click="onSubmit">{{$t('button.public.submit')}}</van-button>
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
                url: ''
            },
            sms:{
                status: 0,
                second: 60
            },
            emailSms:{
                status: 0,
                second: 60
            },
            available: false,
            btnStatus: false,
            form:{
                data:{
                    email: {
                        value: '',
                        isDefault: true,
                        isError: false
                    },
                    smsCode:{
                        value: '',
                        isDefault: true,
                        isError: false
                    },
                    emailCode:{
                        value: '',
                        isDefault: true,
                        isError: false
                    }
                }
            },
            areaCode: localStorage.getItem('areaCode') || '86',
            defaultMobile: JSON.parse(localStorage.getItem('user')).telPhone,
        }
    },
    components:{backbar},
    computed:{
        smsBtn(){
            let that = this;
            switch(that.sms.status){
                case 0:     //正常
                    return  that.$t('button.public.sent');
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
            switch(that.emailSms.status){
                case 0:     //正常
                    return  that.$t('button.public.sent');
                    break;
                case 1:     //发送中
                    return that.$t('button.public.sending')+"("+that.emailSms.second+"s)";
                    break;
                case 2:     //重新发送
                    return that.$t('button.public.resend');
                    break;
            }
        }
    },
	mounted(){
        
    },
    watch:{
        "form.data.email.value":function(){
            if(!this.form.data.email.value){
                this.$mts.toast(this.$t('message.safe.emailEmpty'));
            }
            this.form.data.email.isDefault = false;
            this.form.data.email.isError = !this.form.data.email.value;
            this.checkAllForm();
        },
        "form.data.smsCode.value":function(){
            if(!this.form.data.smsCode.value){
                this.$mts.toast(this.$t('message.safe.smsCodeEmpty'));
            }
            this.form.data.smsCode.isDefault = false;
            this.form.data.smsCode.isError = !this.form.data.smsCode.value;
            this.checkAllForm();
        },
        "form.data.emailCode.value":function(){
            if(!this.form.data.emailCode.value){
                this.$mts.toast(this.$t('message.safe.emailCodeEmpty'));
            }
            this.form.data.emailCode.isDefault = false;
            this.form.data.emailCode.isError = !this.form.data.emailCode.value;
            this.checkAllForm();
        },
    },
	methods:{
        checkAllForm(){
            let arr = [
                this.form.data.email.isDefault,
                this.form.data.email.isError,
                this.form.data.smsCode.isDefault,
                this.form.data.smsCode.isError,
                this.form.data.emailCode.isDefault,
                this.form.data.emailCode.isError,
            ];
            let validate = true;
            for(let i in arr){
                if(arr[i]){
                    validate = false;
                }
            }
            this.btnStatus = validate;
        },
        onBlur(){
            let that = this;
            if(that.form.data.email.value){
                that.$mts.posts({
                    url:'api/me/user/checkRepeat?email='+that.form.data.email.value,
                    data:{},
                    success(response){
                        if (response.data.status==200) {
                            that.available = true;
                        }else{
                            that.$mts.toast(that.$t('message.sign.noRepeat'));
                        }
                    }
                });
            }
        },
		sendSms(type){
            let that = this;
            if(type == 'email'){
                if(!that.form.data.email.value){
                    that.$mts.toast(this.$t('message.safe.emailEmpty'));
                    return;
                }
                if(that.$vld.checkValue(that.form.data.email.value,'email')){
                    if(!that.available){
                        that.$mts.toast(that.$t('message.sign.noRepeat'));
                        return;
                    }
                    if(that.emailSms.status!=1){
                        that.emailSms.second = 60;
                        that.emailSms.status = 1;
                        var countdown = setInterval(()=>{
                            that.emailSms.second --;
                            if(that.emailSms.second <= 0){
                                that.emailSms.status = 2;
                                clearInterval(countdown);
                            }
                        },1000);
                        that.$mts.posts({
                            url:'api/me/mail/captcha?email='+that.form.data.email.value+'&modules=profile',
                            data:{},
                            success(response){
                                if(response.data.status == 200){
                                    that.$mts.toast(that.$t('message.safe.emailCodeSuc'));
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.sms.limitTimes'));
                                }else if(response.data.status == 900){
                                    that.$mts.toast(that.$t('endNotice.sms.smsError'));
                                }
                            }
                        });
                    }
                }else{
                    that.$mts.toast(that.$t('message.sign.emailError'));
                }
            }else if(type == 'mobile'){
                if(that.defaultMobile){
                    if(that.sms.status!=1){
                        that.sms.second = 60;
                        that.sms.status = 1;
                        var countdown = setInterval(()=>{
                            that.sms.second --;
                            if(that.sms.second <= 0){
                                that.sms.status = 2;
                                clearInterval(countdown);
                            }
                        },1000);
                        that.$mts.posts({
                            url:'api/me/sms/captcha?areaCode='+that.areaCode+'&phoneNumber='+that.defaultMobile+'&modules=profile',
                            data:{},
                            success(response){
                                if(response.data.status == 200){
                                    that.$mts.toast(that.$t('message.safe.smsCodeSuc'));
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.sms.limitTimes'));
                                }else if(response.data.status == 900){
                                    that.$mts.toast(that.$t('endNotice.sms.smsError'));
                                }
                            }
                        });
                    }
                }
            }
        },
        onSubmit(){
            let that = this;
            if(that.btnStatus){
                that.$mts.posts({
                    url:'api/me/security/bindEmail',
                    data:{
                        email:that.form.data.email.value,
                        smsCaptcha: that.form.data.smsCode.value,
                        emailCaptcha: that.form.data.emailCode.value,
                    },success(response){
                        if (response.data.status == 200) {
                            that.$mts.toast(that.$t('message.safe.bindSuc'));
                            that.$router.push({name:"security"});
                        }else if(response.data.status == 700){
                            that.$mts.toast(that.$t('endNotice.bind.paramsError'));
                        }else if(response.data.status == 701){
                            that.$mts.toast(that.$t('endNotice.bind.codeError'));
                        }else if(response.data.status == 901){
                            that.$mts.toast(that.$t('endNotice.bind.hasAccount'));
                        }else if(response.data.status == 900){
                            that.$mts.toast(that.$t('endNotice.bind.codeError'));
                        }
                    }
                });
            }else{
                that.$mts.toast(that.$t('message.public.notEmpty'));
            }
        }
	}
}
</script>
