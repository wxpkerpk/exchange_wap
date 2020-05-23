<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="userWrapper">
                <div class="userTitle">
                    <h3>{{$t('user.mine.security')}}</h3>
                </div>
                <div class="userFeatures">
                    <van-cell-group>
                        <van-cell :title="$t('user.safe.modifyPsw')" icon="shop-o" :value="$t('form.safe.changePsw')" is-link @click="$router.push({name:'changePsw'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconloginpassword" v-if="!theme"></use>
                                <use xlink:href="#iconb_denglumima" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('user.safe.modifyFundPsw')" :value="$t('form.safe.changePsw')" is-link @click="$router.push({name:'changeFundPsw'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconpassword" v-if="!theme"></use>
                                <use xlink:href="#iconb_zijinmima" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('user.kyc.verified')+'(KYC)'" :value="form.data.kyc.status == -1 ? $t('user.safe.unbind') : $t('user.safe.bind')" is-link @click="$router.push({name:'c1'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconVerified_white" v-if="!theme"></use>
                                <use xlink:href="#iconb_shiminrz" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('user.safe.bindMobile')" :value="form.data.sms.status == 0 ? $t('user.safe.unbind') : $mkt.hideName(form.data.sms.show)" :is-link="form.data.sms.status == 0 ? true : false" @click="checkMobile">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconiPhone" v-if="!theme"></use>
                                <use xlink:href="#iconb_shoujihaoma" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('user.safe.bindEmail')" :value="form.data.email.status == 0 ? $t('user.safe.unbind') : $mkt.hideName(form.data.email.show)" :is-link="form.data.email.status == 0 ? true : false" @click="checkEmail">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">>
                                <use xlink:href="#iconemail" v-if="!theme"></use>
                                <use xlink:href="#iconb_email" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('user.safe.noFish')" :value="form.data.antiPhishingCode.status == 0 ? $t('user.safe.unbind') : $t('user.safe.bind')" is-link @click="$router.push({name:'nofish',params:{name:form.data.antiPhishingCode.show}})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconfishingcode" v-if="!theme"></use>
                                <use xlink:href="#iconb_diaoyuma" v-else></use>
                            </svg>
                        </van-cell>
                    </van-cell-group>
                </div>
            </div>
        </div>

        <!-- 是否绑定手机/邮箱 -->
        <!-- <van-popup v-model="showModal.show" position="center">
            <div class="modal sm">
                <div class="head flexLevel">
                    <span></span>
                    <van-icon name="cross" @click="showModal.show = false" />
                </div>
                <div class="content">
                    <div class="toast f32" v-if="mobile">{{$t('message.safe.mobileModal',{mobile:form.data.sms.show})}}</div>
                    <div class="toast f32" v-else>{{$t('message.safe.emailModal',{email:form.data.email.show})}}</div>
                </div>
                <div class="btnBox noMt flexLevel">
                    <van-button class="active" @click="showModal.show = false" size="large">{{$t('button.public.know')}}</van-button>
                </div>
            </div>
        </van-popup>  -->
    </div>
</template>  

<script>  
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return{
                backUrl:{
                    url: 'user'
                },
                form:{
                    data:{
                        loginPassword:{
                            status: ''
                        },
                        pin:{
                            status: ''
                        },
                        kyc:{
                            status: ''
                        },
                        sms:{
                            status: ''
                        },
                        email:{
                            status: ''
                        },
                        antiPhishingCode:{
                            status: ''
                        },
                    }
                },
                showModal:{
                    show: false
                },
                mobile: false,
                userInfo:{
                    telPhone:'',
                    email:''
                }
            }
        },
        computed:{
            theme(){
                return this.$store.state.app.theme;
            }
        },
        components:{
            backbar
        },
        mounted(){
            this.initPage();
        },
        watch:{

        },
        methods:{
            initPage(){
                this.getStatus();
                this.getUserInfo();
            },
            getStatus(){
                let that = this;
                that.$mts.posts({
                    url: 'api/me/security/securityStatus',
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.form.data = response.data.data;
                        }
                    },
                })
            },
            getUserInfo(){
                let that = this;
                that.userInfo = JSON.parse(localStorage.getItem('user'));
            },
            checkMobile(){
                if(this.form.data.sms.status){
                    this.showModal.show = true;
                    this.mobile = true;
                }else{
                    this.$router.push({name:'bindMobile'});
                }
            },
            checkEmail(){
                if(this.form.data.email.status){
                    this.showModal.show = true;
                    this.mobile = false;
                }else{
                    this.$router.push({name:'bindEmail'});
                }
            }
        }
    }
</script>  

<style lang="scss">

</style>