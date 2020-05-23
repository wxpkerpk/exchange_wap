<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent">
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('form.sign.forget')}}</h3>
                </div>
                <div class="signForm" v-if="cur == 0">
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.mobile')}}</p>
                        <div class="inputBox">
                        <span class="areaCode" @click="$router.push({path: '/areaCode',query:{back: 'forget'}})">+{{number}}<i class="iconfont iconDrop-downmenu" /></span>
                            <van-field type="tel" class="nbd" v-model="formMobile.data.mobile.value" maxlength="20" :placeholder="$t('validate.safe.m1')" clearable @blur="onBlur"></van-field>
                        </div>
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.newPsw')}}</p>
                        <van-field type="password" v-model="formMobile.data.newPsw.value" :placeholder="$t('validate.sign.newPsw')" maxlength="16" clearable></van-field>
                    </div>
                    <div class="cellGroup lastCell">
                        <p class="title">{{$t('form.safe.repPsw')}}</p>
                        <van-field type="password" v-model="formMobile.data.repPsw.value" :placeholder="$t('validate.sign.repPsw')" maxlength="16" clearable></van-field>
                    </div>
                    <div class="cellGroup lastCell">
                        <p class="title">{{$t('form.safe.smsCode')}}</p>
                        <van-field type="number" v-model="formMobile.data.smsCode.value" :placeholder="$t('validate.safe.m2')" maxlength="6" clearable :disabled="sms.status == 0">
                            <span slot="button" @click="sendSms()" class="sendSms" :disabled="sms.status == 1">{{smsBtn}}</span>
                        </van-field>
                    </div>
                    <div class="btnBox"><van-button size="large" @click="submit()" :class="{active: formMobile.btnStatus}">{{$t('button.public.confirm')}}</van-button></div>
                    <p class="signin flexLevel"><span @click="cur = 1">{{$t('form.sign.changeEmail')}}</span></p>
                </div>
                <div class="signForm" v-if="cur == 1">
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.email')}}</p>
                        <van-field type="text" v-model="formEmail.data.email.value" maxlength="64" :placeholder="$t('validate.safe.e1')" clearable @blur="onBlur"></van-field>
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.safe.newPsw')}}</p>
                        <van-field type="password" v-model="formEmail.data.newPsw.value" :placeholder="$t('validate.sign.newPsw')" maxlength="16" clearable></van-field>
                    </div>
                    <div class="cellGroup lastCell">
                        <p class="title">{{$t('form.safe.repPsw')}}</p>
                        <van-field type="password" v-model="formEmail.data.repPsw.value" :placeholder="$t('validate.sign.repPsw')" maxlength="16" clearable></van-field>
                    </div>
                    <div class="cellGroup lastCell">
                        <p class="title">{{$t('form.safe.emailCode')}}</p>
                        <van-field type="number" v-model="formEmail.data.emailCode.value" :placeholder="$t('validate.safe.e2')" maxlength="6" clearable :disabled="emailSms.status == 0">
                            <span slot="button" @click="sendSms()" class="sendSms" :disabled="emailSms.status == 1">{{emailBtn}}</span>
                        </van-field>
                    </div>
                    <div class="btnBox"><van-button size="large" @click="submit()" :class="{active: formEmail.btnStatus}">{{$t('button.public.confirm')}}</van-button></div>
                    <p class="signin flexLevel"><span @click="cur = 0">{{$t('form.sign.changeMobile')}}</span></p>
                </div>
            </div>
        </div>
    </div>
</template>  

<script>  
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return{
                backUrl:{
                    url: 'signin'
                },
                cur: 0,
                number: '', // 手机区域码
                isRegister: false,
                sms:{
                    status: 0,
                    second: 60
                },
                emailSms:{
                    status: 0,
                    second: 60
                },
                formMobile:{
                    btnStatus: false,
                    data:{
                        mobile: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        newPsw: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        }, 
                        repPsw:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        smsCode:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                    }
                },
                formEmail:{
                    btnStatus: false,
                    data:{
                        email: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        newPsw: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        }, 
                        repPsw:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        emailCode:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        }
                    }   
                }
            }
        },
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
        components:{
            backbar 
        },
        activated(){
            this.number = this.$route.query.areaCode || 86;
        },
        watch:{
            "formMobile.data.mobile.value":function(){
                if(!this.formMobile.data.mobile.value){
                    this.$mts.toast(this.$t('message.safe.mobileEmpty'));
                }
                this.formMobile.data.mobile.isDefault = false;
                this.formMobile.data.mobile.isError = !this.formMobile.data.mobile.value;
                this.checkAllForm();
            },
            "formMobile.data.newPsw.value":function(){
                if(!this.formMobile.data.newPsw.value){
                    this.$mts.toast(this.$t('message.safe.newPswEmpty'));
                }
                this.formMobile.data.newPsw.isDefault = false;
                this.formMobile.data.newPsw.isError = !this.formMobile.data.newPsw.value;
                this.checkAllForm();
            },
            "formMobile.data.repPsw.value":function(){
                if(!this.formMobile.data.repPsw.value){
                    this.$mts.toast(this.$t('message.safe.repPswEmpty'));
                }
                this.formMobile.data.repPsw.isDefault = false;
                this.formMobile.data.repPsw.isError = !this.formMobile.data.repPsw.value;
                this.checkAllForm();
            },
            "formMobile.data.smsCode.value":function(){
                if(!this.formMobile.data.smsCode.value){
                    this.$mts.toast(this.$t('message.safe.smsCodeEmpty'));
                }
                this.formMobile.data.smsCode.isDefault = false;
                this.formMobile.data.smsCode.isError = !this.formMobile.data.smsCode.value;
                this.checkAllForm();
            },
            "formEmail.data.email.value":function(){
                if(!this.formEmail.data.email.value){
                    this.$mts.toast(this.$t('message.safe.emailEmpty'));
                }
                this.formEmail.data.email.isDefault = false;
                this.formEmail.data.email.isError = !this.formEmail.data.email.value;
                this.checkAllForm();
            },
            "formEmail.data.newPsw.value":function(){
                if(!this.formEmail.data.newPsw.value){
                    this.$mts.toast(this.$t('message.safe.newPswEmpty'));
                }
                this.formEmail.data.newPsw.isDefault = false;
                this.formEmail.data.newPsw.isError = !this.formEmail.data.newPsw.value;
                this.checkAllForm();
            },
            "formEmail.data.repPsw.value":function(){
                if(!this.formEmail.data.repPsw.value){
                    this.$mts.toast(this.$t('message.safe.repPswEmpty'));
                }
                this.formEmail.data.repPsw.isDefault = false;
                this.formEmail.data.repPsw.isError = !this.formEmail.data.repPsw.value;
                this.checkAllForm();
            },
            "formEmail.data.emailCode.value":function(){
                if(!this.formEmail.data.emailCode.value){
                    this.$mts.toast(this.$t('message.safe.emailCodeEmpty'));
                }
                this.formEmail.data.emailCode.isDefault = false;
                this.formEmail.data.emailCode.isError = !this.formEmail.data.emailCode.value;
                this.checkAllForm();
            },
        },
        methods:{
            checkAllForm(){
                let arr = [];
                let validate = true;
                if(this.cur == 0){
                    arr = [
                        this.formMobile.data.mobile.isDefault,
                        this.formMobile.data.mobile.isError,
                        this.formMobile.data.newPsw.isDefault,
                        this.formMobile.data.newPsw.isError,
                        this.formMobile.data.repPsw.isDefault,
                        this.formMobile.data.repPsw.isError,
                        this.formMobile.data.smsCode.isDefault,
                        this.formMobile.data.smsCode.isError,
                    ];
                    for(let i in arr){
                        if(arr[i]){
                            validate = false;
                        }
                    }
                    this.formMobile.btnStatus = validate;
                }else{
                    arr = [
                        this.formEmail.data.email.isDefault,
                        this.formEmail.data.email.isError,
                        this.formEmail.data.newPsw.isDefault,
                        this.formEmail.data.newPsw.isError,
                        this.formEmail.data.repPsw.isDefault,
                        this.formEmail.data.repPsw.isError,
                        this.formEmail.data.emailCode.isDefault,
                        this.formEmail.data.emailCode.isError,
                    ];
                    for(let i in arr){
                        if(arr[i]){
                            validate = false;
                        }
                    }
                    this.formEmail.btnStatus = validate;
                }
            },
            onBlur(){
                let that = this;
                if(that.cur == 0 && that.formMobile.data.mobile.value){
                    that.$mts.posts({
                        url:'api/me/user/checkRepeat?areaCode='+that.number+'&telPhone='+that.formMobile.data.mobile.value,
                        data:{},
                        success(response){
                            if (response.data.status==200) {
                                that.$mts.toast(that.$t('message.sign.noRegister'));
                                that.isRegister = false;
                            }else{
                                that.isRegister = true;
                            }
                        }
                    });
                }else if(that.cur == 1 && that.formEmail.data.email.value){
                    that.$mts.posts({
                        url:'api/me/user/checkRepeat?email='+that.formEmail.data.email.value,
                        data:{},
                        success(response){
                            if (response.data.status==200) { 
                                that.$mts.toast(that.$t('message.sign.noRegister'));
                                that.isRegister = false;
                            }else{
                                that.isRegister = true;
                            }
                        }
                    });
                }
            },
            sendSms(){
                let that = this;
                if(!that.isRegister){
                    that.$mts.toast(that.$t('message.sign.noRegister'));
                    return;
                }
                if(that.cur == 0){
                    if(that.formMobile.data.mobile.value !== ''){
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
                                url:'api/me/sms/captcha?areaCode='+that.number+'&phoneNumber='+that.formMobile.data.mobile.value+'&modules=profile',
                                data:{},
                                success(response){
                                    if(response.data.status == 200){
                                        that.$mts.toast(that.$t('message.public.smsSuc'));
                                    }else if(response.data.status == 700){
                                        that.$mts.toast(that.$t('endNotice.sms.limitTimes'));
                                    }else if(response.data.status == 900){
                                        that.$mts.toast(that.$t('endNotice.sms.smsError'));
                                    }
                                }
                            });
                        }
                    }else{
                        that.$mts.toast(that.$t('message.safe.mobileEmpty'));
                    }
                }else{
                    if(!that.formEmail.data.email.value){
                        that.$mts.toast(that.$t('message.safe.emailEmpty'));
                        return;
                    }
                    if(that.$vld.checkValue(that.formEmail.data.email.value,'email')){
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
                                url:'api/me/mail/captcha?email='+that.formEmail.data.email.value+'&modules=profile',
                                data:{},
                                success(response){
                                    if(response.data.status == 200){
                                        that.$mts.toast(that.$t('message.public.smsSuc'));
                                    }else if(response.data.status == 700){
                                        that.$mts.toast(that.$t('endNotice.sms.limitTimes'));
                                    }else if(response.data.status == 900){
                                        that.$mts.toast(that.$t('endNotice.sms.smsError'));
                                    }
                                }
                            });
                        }else{
                            that.$mts.toast(that.$t('message.safe.emailError'));
                        }
                    }
                }
            },
            submit(){
                let that = this;
                if(that.cur == 0){
                    if(that.formMobile.btnStatus){
                        if(!that.$vld.checkValue(that.formMobile.data.newPsw.value,'password')){
                            that.$mts.toast(that.$t('message.public.pswError'));
                            return;
                        }
                        if(that.formMobile.data.newPsw.value != that.formMobile.data.repPsw.value){
                            that.$mts.toast(that.$t('message.public.repPswError'));
                            return;
                        }
                        that.$mts.posts({
                            url:'api/me/security/forgetLoginPasswordByPhone',
                            data: {
                                phone:that.formMobile.data.mobile.value,
                                areaCode:that.number,
                                captcha: that.formMobile.data.smsCode.value,
                                newPassword:that.formMobile.data.newPsw.value
                            },success(response){
                                if(response.data.status == 200){
                                    that.$mts.toast(that.$t('message.safe.modifySuc'));
                                    that.$router.push('/signin');
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.forgot.paramsError'));
                                }else if(response.data.status == 701){
                                    that.$mts.toast(that.$t('endNotice.forgot.codeError'));
                                }else if(response.data.status = 1000){
                                    that.$mts.toast(that.$t('message.sign.noRegister'));
                                }
                            }
                        });
                    }else{
                        that.$mts.toast(that.$t('message.public.notEmpty'));
                    }
                }else {
                    if(that.formEmail.btnStatus){
                        if(!that.$vld.checkValue(that.formEmail.data.email.value,'email')){
                            that.$mts.toast(that.$t('message.sign.emailError'));
                            return;
                        }
                        if(!that.$vld.checkValue(that.formEmail.data.newPsw.value,'password')){
                            that.$mts.toast(that.$t('message.public.pswError'));
                            return;
                        }
                        if(that.formEmail.data.newPsw.value != that.formEmail.data.repPsw.value){
                            that.$mts.toast(that.$t('message.public.repPswError'));
                            return;
                        }
                        that.$mts.posts({
                            url:'api/me/security/forgetLoginPasswordByEmail',
                            data: {
                                email:that.formEmail.data.email.value,
                                captcha: that.formEmail.data.emailCode.value,
                                newPassword:that.formEmail.data.newPsw.value
                            },success(response){
                                if(response.data.status == 200){
                                    that.$mts.toast(that.$t('message.safe.modifySuc'));
                                    that.$router.push('/signin');
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.forgot.overtimes'));
                                }else if(response.data.status == 701){
                                    that.$mts.toast(that.$t('endNotice.forgot.codeError'));
                                }else if(response.data.status = 1000){
                                    that.$mts.toast(that.$t('message.sign.noRegister'));
                                }
                            }
                        });
                    }else{
                        that.$mts.toast(that.$t('message.public.notEmpty'));
                    }
                }
            }
        }
    }
</script>  

<style lang="scss">

</style>