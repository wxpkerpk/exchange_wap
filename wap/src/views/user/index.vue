<template>
<div class="flexPage darkPage">
    <div class="flexHead">
        <div class="currencyHead themeHead">
            <navbar :params="pageInfo" /> 
        </div>
        <div class="assetsHeader noTopPadding">
            <dl>
                <dt @click="$store.state.app.uploadhead.show = true"><span class="editHead"><van-icon name="edit" /></span><img :src="head" alt=""></dt>
                <dd>
                    <h3>{{username}}</h3>
                    <p><span>UID</span> <span>{{uid}}</span></p>
                </dd>
            </dl>
            <div class="switchModel">
                <i class="iconfont iconsun" @click="onChangeTheme(true)" v-if="!$store.state.app.nightModel" ></i>
                <i class="iconfont iconmoon" @click="onChangeTheme(false)" v-if="$store.state.app.nightModel"></i>
                <van-switch
                    v-model="$store.state.app.nightModel"
                    size="24px"
                    active-color="#333"
                    inactive-color="#fff"
                    @change="onChangeTheme"
                />
            </div>
        </div>
    </div>
    <div class="flexContent">
        <div class="userWrapper">
            <div class="featuresBox">
                <dl @click="$mts.goto('inviteQr')">
                    <dt>
                        <i class="iconfont iconShareAPP_white"></i>
                    </dt>
                    <dd>{{$t('assets.personal.share')+'App'}}</dd>
                </dl>
                <dl @click="$mts.goto('invite')">
                    <dt>
                        <i class="iconfont iconInvitationcode_white"></i>
                    </dt>
                    <dd>{{$t('assets.personal.myInvite')}}</dd>
                </dl>
                <dl @click="$mts.goto('kyc')">
                    <dt>
                        <i class="iconfont iconVerified_white"></i>
                    </dt>
                    <dd>{{$t('assets.personal.kyc')}}</dd>
                </dl>
                <dl @click="$mts.goto('myteam')">
                    <dt>
                        <i class="iconfont iconteam_white"></i>
                    </dt>
                    <dd>{{$t('assets.personal.myteam')}}</dd>
                </dl>
            </div>
            <!-- 内容板块 -->
            <div class="usercenterList">
                <van-cell-group>
                    <van-cell @click="$mts.goto('safe')" :title="$t('assets.personal.safe')" icon="birthday-cake-o" is-link value=""  >
                        <i class="iconfont iconsecurity lefticon" slot="icon"></i>
                    </van-cell>
                    <van-cell @click="$mts.goto('payaccount')" :title="$t('assets.personal.payAccount')" icon="peer-pay" is-link value=""  >
                        <i class="iconfont iconpayments lefticon" slot="icon"></i>
                    </van-cell>
                    <van-cell @click="$mts.goto('coinaddress')" :title="$t('form.assets.tbAddr')" icon="points" is-link value=""  >
                        <i class="iconfont iconwithdrawaddress lefticon" slot="icon"></i>
                    </van-cell>
                    <van-cell @click="$mts.goto('message')" :title="$t('assets.personal.message')" icon="chat-o" is-link value="" >
                        <i class="iconfont iconapp-message lefticon" slot="icon"></i>
                    </van-cell>
                    <van-cell @click="$mts.goto('worklist')" :title="$t('assets.personal.turnWorklist')" icon="chat-o" is-link value="">
                        <i class="iconfont iconworkorder lefticon" slot="icon"></i>
                    </van-cell>
                    <van-cell @click="rate.show = true" :title="$t('assets.personal.chooseRate')" icon="cashier-o" is-link :value= "vRate" >
                        <i class="iconfont iconexchange lefticon" slot="icon"></i>
                    </van-cell>
                    <van-cell @click="lang.show = true" :title="$t('assets.personal.changeLang')" icon="flag-o" is-link :value="showLang" >
                        <i class="iconfont iconlanguage lefticon" slot="icon"></i>
                    </van-cell>
                    <!--<van-cell @click="$mts.gourl('message')" title="消息中心" icon="coupon-o" is-link value=""  />
                    <van-cell @click="$mts.gourl('service')" title="联系客服" icon="service-o" is-link value=""  /> -->
                </van-cell-group>
            </div>
            <div class="submitBtn">
                <van-button class="themeBtn" size="large" @click="logout.show = true">{{$t('button.assets.logout')}}</van-button>
            </div>
        </div>
    </div>
    
    <van-action-sheet
        v-model="lang.show"
        :actions="lang.actions" @select="onSelectLanguage"
    />    
    <van-action-sheet
        v-model="rate.show"
        :actions="curr" @select="onSelectRate"
    />

    <van-dialog
        v-model="logout.show"
        :title="$t('button.assets.logout')"
        show-cancel-button
        :confirmButtonText="$t('button.otc.sure')"
        :cancelButtonText="$t('button.otc.cancel')"
        @confirm="onConfirm"
        @cancel="onCancel"
    >
        <div class="contentBox">{{$t('validate.assets.t1')}}</div>
    </van-dialog>
    
    <uploadhead @uploadsuccess="saveHead"></uploadhead>
</div>
</template>
<script>
import downbar from "@/views/modules/downbar.vue";
import navbar from '@/views/modules/navbar.vue'
import uploadhead from '@/views/modules/uploadHead.vue'
import { constants } from 'crypto';
import headInfo from '@/assets/img/head.jpg'
export default {
    data(){
        return {
            pageInfo:{
				title: '',
				url: '/depositHistory',
                icon: '',
                navbarStyle: 'blue',
                backname:"assets"
            },
            lang:{
                show:false,
                actions: [
                    { name: '简体中文' },
                    { name: 'English' }
                ]
            },
            rate:{
                show:false,
                actions: [
                ]
            },
            logout:{
                show: false
            },
            head:headInfo,
            vRate: localStorage.getItem('rate')?localStorage.getItem('rate'):'CNY',
            vLanguage:localStorage.getItem('language')?localStorage.getItem('language'):'zh-CN',
        }
    },
    beforeRouteLeave (to, from, next) {
        this.$store.state.app.uploadhead.show = false;
        next();
    },
    components:{downbar,navbar,uploadhead},
    watch:{},
    computed:{
        showLang(){
            switch(this.vLanguage){
                case "zh-CN":
                    return "简体中文";
                case "en-US":
                    return "English";
                default:
                    return "简体中文";
            }
        },
        isLogin() {
            return this.$store.state.isLogin;
        },
        username(){
            return this.$mts.getUserValue('username');
        },
        invitationCode(){
            return this.$mts.getUserValue('invitationCode');
        },
        uid(){
            return this.$mts.getUserValue('uid');
        },
        //法币
        curr(){
            let that = this;
            let result = this.$store.state.currency;
            let actions = [];
            for(let idx = 0; idx < result.length; idx ++){
                actions.push({name:result[idx]})
            }
            return actions;
        }
    },
    mounted(){
        //页面初始化完成
        this.pageInit()
        //法币
        this.$mts.currency();
    },
    methods:{
        pageInit(){
            this.$mts.checkLogin('clear',()=>{});
            let that = this;
            that.$mts.checkLogin('needback',()=>{
                if(that.$mts.getUserValue('headImage')){
                    that.head = that.$mts.getUserValue('headImage')
                }
            });
        },
        signin(){
            this.$router.push({name:'signin',query:{path:'user'}});
        },
        onConfirm(){
            this.logout.show = false;
            this.$mts.signout();
        },
        onCancel(){
            this.logout.show = false;
        },
        onSelectLanguage(item){
            this.lang.show = false;
            switch(item.name){
                case "简体中文":
                    this.vLanguage = 'zh-CN';
                    break;
                case "English":
                    this.vLanguage = 'en-US';
                    break;
                default:
                    this.vLanguage = 'zh-CN';
                    break;
            }
            localStorage.setItem("language",this.vLanguage);
            location.reload();
        },
        onSelectRate(item){
            this.rate.show = false;
            this.vRate = item.name;
            localStorage.setItem("rate",item.name);
            location.reload();
        },
        onChangeTheme(bool){
            this.$store.state.app.nightModel = bool
            localStorage.setItem('nightModel',bool)
        },
        saveHead(url){
            let that = this;
            that.$mts.post({
                url:"user/head/image",
                data:{
                    url:url,
                },success(response){
                    if(response.data.code == 200){
                        that.$toast(that.$t('validate.assets.t2'))
                        that.$store.state.app.uploadhead.show = false;
                        //更新用户信息
                        localStorage.setItem("user",JSON.stringify(response.data.data));
                        that.head = response.data.data.headImage;
                    }
                },error(error){}
            });
        }
    }
}
</script>


