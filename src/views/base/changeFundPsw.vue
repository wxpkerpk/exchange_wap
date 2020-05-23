<template>
<div class="flexPage">
	<div class="flexHead">
        <backbar :back="backUrl" />
	</div>
	<div class="flexContent whiteBg">
		<div class="signWrapper">
            <div class="signHead">
                <h3>{{$t('user.safe.modifyFundPsw')}}</h3>
            </div>
            <div class="signForm">
                <div class="cellGroup">
                    <div class="title">{{$t('form.safe.newFundPsw')}}</div>
                    <van-field type="password" v-model="form.newFundPsw.value" :placeholder="$t('validate.sign.fundPsw')" clearable maxlength="6"></van-field>
                </div>
                <div class="cellGroup">
                    <div class="title">{{$t('form.safe.repFundPsw')}}</div>
                    <van-field type="password" v-model="form.confirmFundPsw.value" :placeholder="$t('validate.sign.repPsw')" clearable maxlength="6" />
                </div>
                <div class="cellGroup">
                    <p class="title">{{$t('form.safe.code')}}</p>
                    <van-field type="text" v-model="form.code.value" :placeholder="$t('validate.safe.c1')" clearable maxlength="6" :disabled="sms.status==0">
                        <span slot="button" @click="sendSms()" :disabled="sms.status==1" class="sendSms">{{smsBtn}}</span>
                    </van-field>
                </div>
                <div class="btnBox">
                    <van-button :class="{active: btnStatus}"  size="large" @click="onSubmit">{{$t('button.public.submit')}}</van-button>
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
			sms:{
				status: 0,
                second: 60
			},
            emailSms:{
                status: 0,
                second: 60
            },
            btnStatus: false,
            form:{
                newFundPsw:{
                    value: '',
                    isDefault: true,
                    isError: false
                },
                confirmFundPsw:{
                    value: '',
                    isDefault: true,
                    isError: false
                },
                code: {
                    value: '',
                    isDefault: true,
                    isError: false
                },
            },
            areaCode: localStorage.getItem('areaCode') || '86',
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
                    return  that.$t('button.public.sent');
                    break;
                case 1:     //发送中
                    return  that.$t('button.public.sending')+"("+that.sms.second+"s)";
                    break;
                case 2:     //重新发送
                    return  that.$t('button.public.resend');
                    break;
            }
		},
    },
	mounted(){
        
    },
    watch:{
        "form.newFundPsw.value":function(){
            if(!this.form.newFundPsw.value){
                this.$mts.toast(this.$t('message.safe.newFundPswEmpty'));
            }
            this.form.newFundPsw.isDefault = false;
            this.form.newFundPsw.isError = !this.form.newFundPsw.value;
            this.checkAllForm();
		},
		"form.confirmFundPsw.value":function(){
            if(!this.form.confirmFundPsw.value){
                this.$mts.toast(this.$t('message.safe.repPswEmpty'));
            }
            this.form.confirmFundPsw.isDefault = false;
            this.form.confirmFundPsw.isError = !this.form.confirmFundPsw.value;
            this.checkAllForm();
        },
        "form.code.value":function(){
            if(!this.form.code.value){
                this.$mts.toast(this.$t('message.sign.smsCode'));
            }
            this.form.code.isDefault = false;
            this.form.code.isError = !this.form.code.value;
            this.checkAllForm();
        },
    },
	methods:{
        checkAllForm(){
			let arr = [
				this.form.newFundPsw.isDefault,
				this.form.newFundPsw.isError,
				this.form.confirmFundPsw.isDefault,
                this.form.confirmFundPsw.isError,
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
		sendSms(){
			let that = this;
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
                if(that.telPhone){
                    that.$mts.posts({
                        url:'api/me/sms/captcha?areaCode='+that.areaCode+'&phoneNumber='+that.telPhone+'&modules=profile',
                        data:{},
                        success(response){
                            // 发送成功
                            if(response.data.status == 200){
                                that.$mts.toast(that.$t('message.public.smsSuc'));
                            }else if(response.data.status == 700){
                                that.$mts.toast(that.$t('endNotice.sms.limitTimes'));
                            }else if(response.data.status == 900){
                                that.$mts.toast(that.$t('endNotice.sms.smsError'));
                            }
                        }
                    });
                }else if(that.email){
                    that.$mts.posts({
                        url:'api/me/mail/captcha?email='+that.email+'&modules=profile',
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
                
            }
		},
        onSubmit(){
            let that = this;
            // if(that.btnStatus){
				if (!that.$vld.checkValue(that.form.newFundPsw.value,'sms6')) {
					that.$mts.toast(that.$t('message.public.fundError'));
					return;
				}
				if(that.form.newFundPsw.value != that.form.confirmFundPsw.value){
					that.$mts.toast(that.$t('message.public.repPswError'));
					return;
                }
                if (that.telPhone || that.email) {
                    that.$mts.posts({
                        url:'api/me/security/editTransactionPin',
                        data:{
                            newPin: that.form.newFundPsw.value,
                            captcha: that.form.code.value,
                            areaCode: that.telPhone ? that.areaCode : ''
                        },success(response){
                            if (response.data.status == 200) {
                                that.$mts.checkFundPsw();
                                that.$mts.toast(that.$t('message.safe.fundSuc'));
                                if(that.$route.query.path){
                                    that.$router.push({path: that.$route.query.path});
                                }else{
                                    that.$router.push({name:'security'});
                                }
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
            // }else{
            //     this.$mts.toast(that.$t('message.public.notEmpty'));
            // }
        }
	}
}
</script>
