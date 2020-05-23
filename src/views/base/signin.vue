<template>  
    <div class="flexPage">
        <div class="flexHead">
            <div class="back">
                <div class="left">
                    <i class="iconfont iconreturn" @click="goBack"/>
                </div>
                <div class="right">
                    <router-link tag="li" to="signup">注册</router-link>
                </div>
            </div>
        </div>
        <div class="flexContent">
            <input type="hidden" name="captchaId" value="c1e1fe6b13da4ca69e03e0977f5a6e93">
            <div id="captcha"></div>
            <div class="signWrapper">
                <img src="@/assets/svg/logo.svg" alt="" class="logo">
                <div class="signType">
                    <span
                        @click="onChangeTab('mobile')"
                        :class="!cur && 'title-active'"
                    >{{$t('form.sign.mSignin')}}</span>
                    <span
                        @click="onChangeTab('email')"
                        :class="cur && 'title-active'"
                    >{{$t('form.sign.eSignin')}}</span>
                </div>
                <div class="signForm pt3" v-if="cur == 0">
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="tel" v-model="formMobile.data.mobile.value" maxlength="20" :placeholder="$t('validate.safe.m1')" clearable></van-field>
                        </div>
                    </div>
                    <!-- <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="tel" v-model="formMobile.data.mobile.value" maxlength="20" :placeholder="$t('validate.safe.c1')" clearable>
                                <p slot="right-icon" class="signin flexLevel"><span class="sendSms" @click="$router.push('/forget')">{{$t('button.public.sent')}}</span></p>
                            </van-field>
                        </div>
                    </div> -->
                    <div class="cellGroup lastCell">
                        <div class="inputBox">
                            <van-field :type="formMobile.eyesOn?'text':'password'" v-model="formMobile.data.password.value" :placeholder="$t('form.sign.password')" maxlength="16" clearable>
                                <p slot="right-icon" class="signin flexLevel"><span class="forgetPsw" @click="$router.push('/forget')">{{$t('form.sign.forget')}}</span></p>
                            </van-field>
                        </div>
                    </div>
                    <div class="btnBox"><van-button size="large" @click="submit" :class="{active: formMobile.btnStatus}">{{$t('form.sign.signin')}}</van-button></div>
                </div>
                <div class="signForm pt3" v-if="cur == 1">
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="text" v-model="formEmail.data.email.value" maxlength="64" :placeholder="$t('validate.safe.e1')" clearable></van-field>
                        </div>
                    </div>
                    <div class="cellGroup lastCell">
                        <div class="inputBox">
                            <van-field :type="formEmail.eyesOn?'text':'password'" v-model="formEmail.data.password.value" :placeholder="$t('form.sign.password')" maxlength="16" clearable>
                                <p slot="right-icon" class="signin flexLevel"><span class="forgetPsw" @click="$router.push('/forget')">{{$t('form.sign.forget')}}</span></p>
                            </van-field>
                        </div>
                    </div>
                    <div class="btnBox"><van-button size="large" @click="submit" :class="{active: formEmail.btnStatus}">{{$t('form.sign.signin')}}</van-button></div>
                </div>
            </div>
        </div>
        <canvas id="canvas1">
            Your Browser Don't Support Canvas, Please Download Chrome ^_^``
        </canvas>
    </div>
</template>  

<script>  
    import backbar from '@/views/modules/back.vue';
    import bgCanvas from '@/utils/bgCanvas.js';

    export default {
        data(){
            return{
                backUrl:{
                    url: '',
                    icon: 'iconbaseline-close-px',
                    path: 'home'
                },
                cur: 0,
                number: '', // 手机区域码
                formMobile:{
                    eyesOn: false,
                    btnStatus: false,
                    data:{
                        mobile: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        password: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        }, 
                        // token: {
                        //     value: '',
                        //     isDefault: true,
                        //     isError: false
                        // }
                    }   
                },
                formEmail:{
                    eyesOn: false,
                    btnStatus: false,
                    data:{
                        email: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        password: {
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        // token: {
                        //     value: '',
                        //     isDefault: true,
                        //     isError: false,
                        // }
                    }   
                },
                // vaptchaObj:null,
            }
        },
        computed:{

        },
        components:{
            backbar
        },
        mounted() {
            // console.log(bgCanvas)
            this.initCanvas();
        },
        activated(){
            this.number = this.$route.query.areaCode || 86;
            // this.initNec();
        },
        beforeRouteLeave(to, from, next){
            const canvas = document.querySelector("#canvas1");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            next();
        },
        watch:{
            "formMobile.data.mobile.value":function(){
                if(!this.formMobile.data.mobile.value){
                    this.$mts.toast(this.$t('message.sign.mobileEmpty'));
                }
                this.formMobile.data.mobile.isDefault = false;
                this.formMobile.data.mobile.isError = !this.formMobile.data.mobile.value;
                this.checkAllForm();
            },
            "formMobile.data.password.value":function(){
                if(!this.formMobile.data.password.value){
                    this.$mts.toast(this.$t('message.sign.passwordEmpty'));
                }
                this.formMobile.data.password.isDefault = false;
                this.formMobile.data.password.isError = !this.formMobile.data.password.value;
                this.checkAllForm();
            },
            "formEmail.data.email.value":function(){
                if(!this.formEmail.data.email.value){
                    this.$mts.toast(this.$t('message.sign.emailEmpty'));
                }
                this.formEmail.data.email.isDefault = false;
                this.formEmail.data.email.isError = !this.formEmail.data.email.value;
                this.checkAllForm();
            },
            "formEmail.data.password.value":function(){
                if(!this.formEmail.data.password.value){
                    this.$mts.toast(this.$t('message.sign.passwordEmpty'));
                }
                this.formEmail.data.password.isDefault = false;
                this.formEmail.data.password.isError = !this.formEmail.data.password.value;
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
                        this.formMobile.data.password.isDefault,
                        this.formMobile.data.password.isError,
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
                        this.formEmail.data.password.isDefault,
                        this.formEmail.data.password.isError,
                    ];
                    for(let i in arr){
                        if(arr[i]){
                            validate = false;
                        }
                    }
                    this.formEmail.btnStatus = validate;
                }
            },
            goBack(){
                this.$router.push({name: 'home'});
            },
            onChangeTab(type){
                switch(type){
                    case 'mobile':
                        this.cur = 0;
                        break
                    case 'email':
                        this.cur = 1;
                        break
                    default:
                        this.cur = 0;
                        break
                }
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
                })
            },
            submit(token = ''){
                let that = this;
                if(that.cur == 0){
                    // if(that.formMobile.btnStatus){
                        // if(!that.$vld.checkValue(that.formMobile.data.mobile.value,'mobile')){
                        //     that.$mts.toast(that.$t('message.sign.mobileError'));
                        //     return;
                        // }
                        // if(!that.$vld.checkValue(that.formMobile.data.password.value,'password')){
                        //     that.$mts.toast(this.$t('message.sign.passwordError'));
                        //     return;
                        // }
                        localStorage.setItem('areaCode',that.number);
                        // that.formMobile.data.token.value = token;
                        that.$mts.posts({
                            url:'api/me/security/login',
                            data: {
                                areaCode:that.number,
                                username: that.formMobile.data.mobile.value,
                                password: that.formMobile.data.password.value,
                                captcha: '',
                                // token
                            },
                            success(response){
                                if (response.data.status == 200) {
                                    that.$toast(that.$t('message.public.signinSuc'));
                                    that.$store.state.isLogin = true;
                                    that.$mts.rates();
                                    localStorage.setItem("token",response.data.data.token);
                                    localStorage.setItem("expire",response.data.data.expire);
                                    localStorage.setItem('loginTime',new Date().getTime());
                                    localStorage.setItem("login",JSON.stringify(that.$store.state.isLogin));
                                    that.saveUserInfo();
                                }else if(response.data.status == 40102){
                                    // that.vaptchaObj.reset(); //重置验证码
                                    that.$router.push({path:'/smscode',query:{param:JSON.stringify({...that.formMobile.data,url: 'signin',type:'mobile'})}});
                                }else if(response.data.status == 40001){
                                    // that.vaptchaObj.reset(); //重置验证码
                                    that.$mts.toast(that.$t('endNotice.signin.error'));
                                }else if(response.data.status == 900){
                                    // that.vaptchaObj.reset(); //重置验证码
                                    that.$mts.toast(that.$t('endNotice.signin.overTimes'));
                                }else if(response.data.status == 40103){
                                    // that.vaptchaObj.reset(); //重置验证码
                                    that.$mts.toast(that.$t('endNotice.signin.limitAccount'));
                                }else if(response.data.status == 700){
                                    that.$mts.toast('请完善信息');
                                }else if(response.data.status == 1000){
                                    that.$mts.toast(response.data.message);
                                }
                            }
                        })
                    // }else{
                    //     that.$mts.toast(that.$t('message.public.notEmpty'));
                    // }
                }else if (that.cur == 1){
                    // if(that.formEmail.btnStatus){
                        // if(!that.$vld.checkValue(that.formEmail.data.email.value,'email')){
                        //     that.$mts.toast(that.$t('message.sign.emailError'));
                        //     return;
                        // }
                        // if(!that.$vld.checkValue(that.formEmail.data.password.value,'password')){
                        //     that.$mts.toast(this.$t('message.sign.passwordError'));
                        //     return;
                        // }
                        // that.formEmail.data.token.value = token;
                        that.$mts.posts({
                            url:'api/me/security/login',
                            data: {
                                username: that.formEmail.data.email.value,
                                password: that.formEmail.data.password.value,
                                captcha: '',
                                // token
                            },
                            success(response){
                                if (response.data.status == 200) {
                                    that.$toast(that.$t('message.public.signinSuc'));
                                    that.$store.state.isLogin = true;
                                    that.$mts.rates();
                                    localStorage.setItem("token",response.data.data.token);
                                    localStorage.setItem("expire",response.data.data.expire);
                                    localStorage.setItem('loginTime',new Date().getTime());
                                    localStorage.setItem("login",JSON.stringify(that.$store.state.isLogin));
                                    that.saveUserInfo();
                                } else if(response.data.status == 40102){
                                    that.$router.push({path:'/smscode',query:{param:JSON.stringify({...that.formEmail.data,url: 'signin',type:'email'})}})
                                }else if(response.data.status == 40001){
                                    that.$mts.toast(that.$t('endNotice.signin.error'));
                                }else if(response.data.status == 900){
                                    that.$mts.toast(that.$t('endNotice.signin.overTimes'));
                                }else if(response.data.status == 40103){
                                    that.$mts.toast(that.$t('endNotice.signin.limitAccount'));
                                }else if(response.data.status == 700){
                                    that.$mts.toast('请完善信息');
                                }else if(response.data.status == 1000){
                                    that.$mts.toast(response.data.message);
                                }
                            }
                        });
                    // }else{
                    //     that.$mts.toast(that.$t('message.public.notEmpty'));
                    // }
                }
            },
            initCanvas() {
                bgCanvas('canvas1');
            }
        }
    }
</script>  

<style lang="scss" scoped>
    .back {
        background-color: #fff;
    }
    .flexContent {
        // background-color: #F7F7F7;
        overflow: hidden;
        position: relative;
        z-index: 1;
    }
    .van-field {
        background-color: #F7F7F7;
    }
    .sendSms {
        color: #1D6C72;
    }
    canvas{
        background-color: #F7F7F7;
        position: absolute;
        top: 11.7333vw;
        z-index: 0;
        width: 100%;
        height: calc(100% - 11.7333vw);
    }
    .logo {
        display: block;
        width: 45vw;
        margin: auto;
        padding-right: 8vw;
    }
    .signType {
        margin-top: -10vw;
    }
</style>

<style lang="scss">
</style>
