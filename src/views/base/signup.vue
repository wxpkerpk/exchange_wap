<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent">
            <div class="signWrapper">
                <img src="@/assets/svg/logo.svg" alt="" class="logo">
                <div class="signType">
                    <span
                        @click="onChangeTab('mobile')"
                        :class="!cur && 'title-active'"
                    >{{$t('form.sign.mSignup')}}</span>
                    <span
                        @click="onChangeTab('email')"
                        :class="cur && 'title-active'"
                    >{{$t('form.sign.eSignup')}}</span>
                </div>
                <!-- 手机注册 -->
                <div class="signForm" v-if="cur == 0">
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="tel" class="nbd" v-model="formMobile.data.mobile.value" maxlength="20" :placeholder="$t('validate.sign.mobile')" clearable @blur="onBlur('mobile')" />
                        </div>
                    </div>
                    <!-- <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="tel" v-model="formMobile.data.mobile.value" maxlength="20" :placeholder="$t('validate.safe.c1')" clearable>
                                <p slot="right-icon" class="signin flexLevel"><span class="sendSms" @click="$router.push('/forget')">{{$t('button.public.sent')}}</span></p>
                            </van-field>
                        </div>
                    </div> -->
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="password" v-model="formMobile.data.password.value" :placeholder="$t('validate.sign.password')" clearable maxlength="16">
                                <div slot="right-icon" @click="onToast" class="ml3"><van-icon name="question-o" /></div>
                            </van-field>
                        </div>
                    </div>
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="password" v-model="formMobile.data.confirmPsw.value" :placeholder="$t('validate.sign.repPsw')" clearable maxlength="16"></van-field>
                        </div>
                    </div>
                    <div class="cellGroup lastCell">
                        <div class="inputBox">
                            <van-field type="text" v-model="formMobile.data.inviteCode.value" :placeholder="$t('validate.sign.inviteCode')" clearable maxlength="6" />
                        </div>
                    </div>
                    <div class="rules">
                        <i :class="['iconfont', formMobile.checkStatus ? 'iconxuanzhong' : 'iconweixz']" @click="formMobile.checkStatus = !formMobile.checkStatus" />
                        {{$t('form.sign.read')}}
                        <span>{{$t('form.sign.userRules')}}</span>
                    </div>
                    <div class="btnBox btn"><van-button size="large" @click="submit" :class="{active: formMobile.btnStatus}">{{$t('form.sign.signup')}}</van-button></div>
                </div>
                <!-- 邮箱注册 -->
                <div class="signForm" v-if="cur == 1">
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="text" v-model="formEmail.data.email.value" maxlength="64" :placeholder="$t('validate.sign.email')" clearable @blur="onBlur('email')" />
                        </div>
                    </div>
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="password" v-model="formEmail.data.password.value" :placeholder="$t('validate.sign.password')" clearable maxlength="16">
                                <div slot="right-icon" @click="onToast" class="ml3"><van-icon name="question-o" /></div>
                            </van-field>
                        </div>
                    </div>
                    <div class="cellGroup">
                        <div class="inputBox">
                            <van-field type="password" v-model="formEmail.data.confirmPsw.value" :placeholder="$t('validate.sign.repPsw')" clearable maxlength="16"></van-field>
                        </div>
                    </div>
                    <div class="cellGroup lastCell">
                        <div class="inputBox">
                            <van-field type="text" v-model="formEmail.data.inviteCode.value" :placeholder="$t('validate.sign.inviteCode')" clearable maxlength="6" />
                        </div>
                    </div>
                    <div class="rules">
                        <i :class="['iconfont', formEmail.checkStatus ? 'iconxuanzhong' : 'iconweixz']" @click="formEmail.checkStatus = !formEmail.checkStatus" />
                        {{$t('form.sign.read')}}
                        <span>{{$t('form.sign.userRules')}}</span>
                    </div>
                    <div class="btnBox btn"><van-button size="large" @click="submit" :class="{active: formEmail.btnStatus}">{{$t('form.sign.signup')}}</van-button></div>
                </div>
            </div>
        </div>
        <canvas id="canvas2">
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
                    url: 'signin'
                },
                cur: 0, 
                showEmail: false,
                number: '', // 手机区域码
                isRegister:false,
                formMobile:{ // 手机注册表单
                    eyesOn: false,
                    checkStatus: false,
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
                        confirmPsw:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        inviteCode:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        // token:{
                        //     value:'',
                        //     isDefault: true,
                        //     isError: false,
                        // } 
                    }   
                },
                formEmail:{// 邮箱注册表单
                    eyesOn: false,
                    checkStatus: false,
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
                        confirmPsw:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        inviteCode:{
                            value: '',
                            isDefault: true,
                            isError: false,
                        },
                        // token:{
                        //     value:'',
                        //     isDefault: true,
                        //     isError: false,
                        // } 
                    }   
                },
                // vaptchaObj:null,
                cnLink:'/service/%2Fhc%2Fzh-cn%2Farticles%2F360036254431-%25E6%259C%258D%25E5%258A%25A1%25E5%258D%258F%25E8%25AE%25AE',
                enLink:'/service/%2Fhc%2Fen-001%2Farticles%2F360036254431-Service-agreement'
            }
        },
        computed:{
            vLanguage(){
                return localStorage.getItem('language') === 'zh-CN' ? this.cnLink : this.enLink;
            }
        },
        activated(){
            this.number = this.$route.query.areaCode || 86;
            // this.initNec();
            this.getShare();    
        },
        mounted() {
            this.initCanvas();
        },
        beforeRouteLeave(to, from, next){
            const canvas = document.getElementById('canvas2');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            next();
        },
        components:{
            backbar,
        },
        watch:{
            "formMobile.data.mobile.value":function(){
                if(!this.formMobile.data.mobile.value){
                    this.$mts.toast(this.$t('message.sign.mobileEmpty'));
                }
                this.formMobile.data.mobile.isDefault = false;
                this.formMobile.data.mobile.isError = !this.formMobile.data.mobile.value;
                this.checkAllForm('mobile');
            },
            "formEmail.data.email.value":function(){
                if(!this.formEmail.data.email.value){
                    this.$mts.toast(this.$t('message.sign.emailEmpty'));
                }
                this.formEmail.data.email.isDefault = false;
                this.formEmail.data.email.isError = !this.formEmail.data.email.value;
                this.checkAllForm('email');
            },
            "formMobile.data.password.value":function(){
                if(!this.formMobile.data.password.value){
                    this.$mts.toast(this.$t('message.sign.passwordEmpty'));
                }
                this.formMobile.data.password.isDefault = false;
                this.formMobile.data.password.isError = !this.formMobile.data.password.value;
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
            "formMobile.data.confirmPsw.value":function(){
                if(!this.formMobile.data.confirmPsw.value){
                    this.$mts.toast(this.$t('message.safe.repPswEmpty'));
                }
                this.formMobile.data.confirmPsw.isDefault = false;
                this.formMobile.data.confirmPsw.isError = !this.formMobile.data.confirmPsw.value;
                this.checkAllForm();
            },
            "formEmail.data.confirmPsw.value":function(){
                if(!this.formEmail.data.confirmPsw.value){
                    this.$mts.toast(this.$t('message.safe.repPswEmpty'));
                }
                this.formEmail.data.confirmPsw.isDefault = false;
                this.formEmail.data.confirmPsw.isError = !this.formEmail.data.confirmPsw.value;
                this.checkAllForm();
            },
            // "formMobile.data.inviteCode.value":function(){
            //     if(!this.formMobile.data.inviteCode.value){
            //         this.$mts.toast(this.$t('message.sign.inviteCodeEmpty'));
            //     }   
            //     this.formMobile.data.inviteCode.isDefault = false;
            //     this.formMobile.data.inviteCode.isError = !this.formMobile.data.inviteCode.value;
            //     this.checkAllForm();
            // },
            // "formEmail.data.inviteCode.value":function(){
            //     if(!this.formEmail.data.inviteCode.value){
            //         this.$mts.toast(this.$t('message.sign.inviteCodeEmpty'));
            //     }   
            //     this.formEmail.data.inviteCode.isDefault = false;
            //     this.formEmail.data.inviteCode.isError = !this.formEmail.data.inviteCode.value;
            //     this.checkAllForm();
            // },
        },
        methods:{
            initCanvas() {
                bgCanvas('canvas2');
            },
            checkAllForm(){
                let arr = [];
                let validate = true;
                if(this.cur == 0){
                    arr = [
                        this.formMobile.data.mobile.isDefault,
                        this.formMobile.data.mobile.isError,
                        this.formMobile.data.password.isDefault,
                        this.formMobile.data.password.isError,
                        this.formMobile.data.confirmPsw.isDefault,
                        this.formMobile.data.confirmPsw.isError,
                        // this.formMobile.data.inviteCode.isDefault,
                        // this.formMobile.data.inviteCode.isError,
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
                        this.formEmail.data.confirmPsw.isDefault,
                        this.formEmail.data.confirmPsw.isError,
                        // this.formEmail.data.inviteCode.isDefault,
                        // this.formEmail.data.inviteCode.isError,
                    ];
                    for(let i in arr){
                        if(arr[i]){
                            validate = false;
                        }
                    }
                    this.formEmail.btnStatus = validate;
                }
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
            onToast(){
                this.$mts.toast(this.$t('message.public.pswError'));
            },
            getShare(){
                let that = this;
                let obj = that.$mkt.getSplit(location.hash);
                if(obj != null){
                    for(var key in obj){
                        if(key == 'inviteCode'){
                            that.formMobile.data.inviteCode.value = obj.inviteCode;
                            that.formEmail.data.inviteCode.value = obj.inviteCode;
                        }
                    }
                }else{
                    let inviteCode = localStorage.getItem('inviteCode');
                    if(inviteCode){
                        that.formMobile.data.inviteCode.value = inviteCode;
                        that.formEmail.data.inviteCode.value =  inviteCode;
                    }
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
                                that.isRegister = false;
                            }else if(response.data.status==700){
                                that.$mts.toast(that.$t('message.sign.mobileError'));
                                that.isRegister = true;
                            }else if(response.data.status==901){
                                that.$toast(that.$t('message.sign.userSigned'));
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
                                that.isRegister = false;
                            }else if(response.data.status==700){
                                that.$mts.toast(that.$t('message.sign.emailError'));
                                that.isRegister = true;
                            }else if(response.data.status==901){
                                that.$toast(that.$t('message.sign.userSigned'));
                                that.isRegister = true;
                            }
                        }
                    });
                }
            },
            submit(token = ''){
                let that = this;
                if(that.cur == 0){
                    if(that.formMobile.btnStatus){
                        if(!that.$vld.checkValue(that.formMobile.data.password.value,'password')){
                            that.$mts.toast(that.$t('message.public.pswError'));
                            return;
                        }
                        if(that.formMobile.data.password.value != that.formMobile.data.confirmPsw.value){
                            that.$mts.toast(that.$t('message.public.repPswError'));
                            return;
                        }
                        if(!that.formMobile.checkStatus){
                            that.$mts.toast(that.$t('message.public.checked'));
                            return;
                        }
                        if(!that.isRegister){
                            localStorage.setItem('areaCode',that.number);
                            // that.formMobile.data.token.value = token;
                            that.$router.push({path:'/smscode',query:{param: JSON.stringify({...that.formMobile.data,url: 'signup',type: 'mobile'})}});
                        }else{
                            that.$mts.toast(that.$t('message.sign.noRepeat'));
                        }
                    }else{
                        that.$mts.toast(that.$t('message.public.notEmpty'));
                    }
                }else if(that.cur == 1){
                    if(that.formEmail.btnStatus){
                        if(!that.$vld.checkValue(that.formEmail.data.email.value.trim(),'email')){
                            that.$mts.toast(that.$t('message.sign.emailError'));
                            return;
                        }
                        if(!that.$vld.checkValue(that.formEmail.data.password.value,'password')){
                            that.$mts.toast(that.$t('message.public.pswError'));
                            return;
                        }
                        if(that.formEmail.data.password.value != that.formEmail.data.confirmPsw.value){
                            that.$mts.toast(that.$t('message.public.repPswError'));
                            return;
                        }
                        if(!that.formEmail.checkStatus){
                            that.$mts.toast(that.$t('message.public.checked'));
                            return;
                        }
                        if(!that.isRegister){
                            // that.formEmail.data.token.value = token;
                            that.$router.push({path:'/smscode',query:{param: JSON.stringify({...that.formEmail.data,url: 'signup',type: 'email'})}});
                        }else{
                            that.$mts.toast(that.$t('message.sign.noRepeat'));
                        }
                    }else{
                        that.$mts.toast(that.$t('message.public.notEmpty'));
                    }
                }
            }
        }
    }
</script>  

<style lang="scss" scoped>
    .flexContent {
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
    .logo {
        display: block;
        width: 45vw;
        margin: auto;
        padding-right: 8vw;
    }
    .signType {
        margin-top: -10vw;
    }
    .btn {
        margin-top: 20vw!important;
    }
</style>

<style lang="scss">
    canvas{
        background-color: #F7F7F7;
        position: absolute;
        top: 11.7333vw;
        z-index: 0;
        width: 100%;
        height: calc(100% - 11.7333vw);
    }
</style>
