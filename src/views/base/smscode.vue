<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('form.sign.smsCode')}}</h3>
                    <img src="@/assets/svg/logo.svg" alt="" class="logo">
                </div>
                <div class="signForm signFormSms">
                    <div class="smsBox">
                        <van-password-input
                            :value="value"
                            :length="6"
                            :mask="false"
                            :focused="true"
                            @focus="onBlur"
                        />
                    </div>
                    <div class="btnBox"><van-button size="large" @click="submit()" class="active">{{$t('button.public.submit')}}</van-button></div>
                </div>
                <van-number-keyboard
                    v-model="value"
                    :show="show"
                    extra-key="."
                    maxlength="6"
                    :close-button-text="$t('form.sign.completed')"
                    @blur="show = false"
                    @input="onInput"
                    @delete="onDelete"
                />
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
                    url: ''
                },
                sms:{
                    status: 0,
                    second: 60
                },
                value: '',
                showKeyboard:false,
                show:true,
                param: {},
                areaCode: localStorage.getItem('areaCode') || 86,
            }
        },
        computed:{

        },
        mounted(){
            // console.log(this.$route.query.param)
            this.param = JSON.parse(this.$route.query.param)
            this.sendSms();
        },
        components:{
            backbar 
        },
        watch:{
            
        },
        methods:{
            onBlur(value){
                this.showKeyboard = true;
                this.show = true;
            },
            onInput(){
                
            },
            onDelete(){

            },
            saveUserInfo(){
                let that = this;
                that.$mts.posts({
                    url:'api/me/user/info',
                    data: {},
                    success(response){
                        if (response.data.status == 200) {
                            localStorage.setItem('user',JSON.stringify(response.data.data));
                            that.$mts.checkFundPsw();
                            if(that.$route.query.path){
                                that.$router.push({path:that.$route.query.path});
                            }else{
                                that.$router.push({ name: 'home'});
                            }
                        }
                    }
                });
            },
            sendSms(){
                let that = this;
                if(that.param.url == 'signup'){
                    if (that.param.type == 'mobile') {
                        that.$mts.posts({
                            url:'api/me/sms/captcha?areaCode='+that.areaCode+'&phoneNumber='+that.param.mobile.value+'&modules=signUp',
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
                    } else if(that.param.type == 'email'){
                        that.$mts.posts({
                            url:'api/me/mail/captcha?email='+that.param.email.value+'&modules=signUp',
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
                }else if(that.param.url == 'signin'){
                    if (that.param.type == 'mobile') {
                        that.$mts.posts({
                            url:'api/me/sms/captcha?areaCode='+that.areaCode+'&phoneNumber='+that.param.mobile.value+'&modules=login',
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
                    } else if(that.param.type == 'email'){
                        that.$mts.posts({
                            url:'api/me/mail/captcha?email='+that.param.email.value+'&modules=login',
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
                }
            },
            submit(){
                let that = this;
                if(!that.value){
                    that.$mts.toast(that.$t('message.sign.smsCode'));
                    return;
                }
                // console.log(that.param);
                if(that.param.url == 'signup'){
                    if(that.param.type == 'email'){
                        that.$mts.posts({
                            url:'api/me/user/register',
                            data:{
                                type: 'email',
                                password: that.param.password.value,
                                email: that.param.email.value || '',
                                captcha: that.value,
                                c: that.param.inviteCode.value,
                                // token: that.param.token.value
                            },success(response){
                                if (response.data.status == 200) {
                                    that.$toast(that.$t('message.public.signupSuc'));
                                    that.$store.state.isLogin = true;
                                    localStorage.setItem("token",response.data.data.token);
                                    localStorage.setItem("expire",response.data.data.expire);
                                    localStorage.setItem('loginTime',new Date().getTime());
                                    localStorage.setItem("login",JSON.stringify(that.$store.state.isLogin));
                                    that.saveUserInfo();
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.signup.paramsError'));
                                }else if(response.data.status == 701){
                                    that.$mts.toast(that.$t('endNotice.signup.codeError'));
                                }
                            }
                        });
                    }else if(that.param.type == 'mobile'){
                        that.$mts.posts({
                            url:'api/me/user/register',
                            data:{
                                areaCode:that.areaCode,
                                type: 'telPhone',
                                password: that.param.password.value,
                                telPhone: that.param.mobile.value,
                                captcha: that.value,
                                c: that.param.inviteCode.value,
                                // token: that.param.token.value
                            },success(response){
                                if (response.data.status == 200) {
                                    that.$toast(that.$t('message.public.signupSuc'));
                                    that.$store.state.isLogin = true;
                                    localStorage.setItem("token",response.data.data.token);
                                    localStorage.setItem("expire",response.data.data.expire);
                                    localStorage.setItem('loginTime',new Date().getTime());
                                    localStorage.setItem("login",JSON.stringify(that.$store.state.isLogin));
                                    that.saveUserInfo();
                                }else if(response.data.status == 700){
                                    that.$mts.toast(that.$t('endNotice.signup.paramsError'));
                                }else if(response.data.status == 701){
                                    that.$mts.toast(that.$t('endNotice.signup.codeError'));
                                }
                            }
                        });
                    }
                }else if(that.param.url == 'signin'){
                    if(that.param.type == 'email'){
                        that.$mts.posts({
                            url:'api/me/security/login',
                            data: {
                                areaCode:that.areaCode,
                                username: that.param.email.value,
                                password: that.param.password.value,
                                captcha: that.value,
                                // token: that.param.token.value
                            },
                            success(response){
                                if (response.data.status == 200) {
                                    that.$toast(that.$t('message.public.signinSuc'));
                                    that.$store.state.isLogin = true;
                                    localStorage.setItem("token",response.data.data.token);
                                    localStorage.setItem("expire",response.data.data.expire);
                                    localStorage.setItem('loginTime',new Date().getTime());
                                    localStorage.setItem("login",JSON.stringify(that.$store.state.isLogin));
                                    that.saveUserInfo();
                                } else if(response.data.status == 701){
                                    that.$mts.toast(that.$t('endNotice.signup.codeError'));
                                }else if(response.data.status == 703){
                                    that.$mts.toast(that.$t('endNotice.signup.codeRepeat'));
                                } else {
                                    that.$mts.toast(response.data.message);
                                }
                            }
                        });
                    }else if(that.param.type == 'mobile'){
                        that.$mts.posts({
                            url:'api/me/security/login',
                            data: {
                                areaCode:that.areaCode,
                                username: that.param.mobile.value,
                                password: that.param.password.value,
                                captcha: that.value,
                                // token: that.param.token.value
                            },
                            success(response){
                                if (response.data.status == 200) {
                                    that.$toast(that.$t('message.public.signinSuc'));
                                    that.$store.state.isLogin = true;
                                    localStorage.setItem("token",response.data.data.token);
                                    localStorage.setItem("expire",response.data.data.expire);
                                    localStorage.setItem('loginTime',new Date().getTime());
                                    localStorage.setItem("login",JSON.stringify(that.$store.state.isLogin));
                                    that.saveUserInfo();
                                }else if(response.data.status == 701){
                                    that.$mts.toast(that.$t('endNotice.signup.codeError'));
                                }else if(response.data.status == 703){
                                    that.$mts.toast(that.$t('endNotice.signup.codeRepeat'));
                                } else {
                                    that.$mts.toast(response.data.message);
                                }
                            }
                        });
                    }
                }
            }
        }
    }
</script>  

<style lang="scss">
    .logo {
        display: block;
        width: 45vw;
        margin: auto;
        padding-right: 8vw;
    }
    .signFormSms {
        margin-top: -10vw;
    }
</style>