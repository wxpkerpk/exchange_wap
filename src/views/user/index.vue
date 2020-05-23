<template>  
    <div class="flexPage">
        <div class="flexHead userHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="userWrapper">
                <div class="userTitle">
                    <h3>{{$t('user.mine.my')}}</h3>
                </div>
                <div class="userFeatures">
                    <div class="avatar flexLevel" @click="$router.push({name:'mine'})">
                        <dl>
                            <dt @click.stop="$store.state.app.uploadAvatar.show = true"><img :src="!headImg ? defaultAvatar : headImg" alt=""></dt>
                            <dd>
                                <b>{{userInfo.nickName}}</b>
                                <span>UID {{$mkt.makeUid(userInfo.sysUserID)}}</span>
                            </dd>
                        </dl>
                        <van-icon name="arrow" />
                    </div>
                    <van-cell-group>
                        <van-cell :title="$t('user.mine.security')" icon="shop-o" is-link @click="$router.push({name:'security'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconSafety" v-if="!theme"></use>
                                <use xlink:href="#iconb_anquan" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('user.setting.set')" is-link @click="$router.push({name:'setting'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconsetting" v-if="!theme"></use>
                                <use xlink:href="#iconb_shezhi" v-else></use>
                            </svg>
                        </van-cell>
                        <!-- <van-cell :title="$t('user.article.announcement')" is-link @click="$router.push({name:'announcement'})">
                            <i class="iconfont iconsecurity lefticon" slot="icon"></i>
                        </van-cell> -->
                        <van-cell :title="$t('user.withdrawal.withdrawalAddr')" is-link @click="$router.push({name:'withdrawalAddress'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#icontibidiz" v-if="!theme"></use>
                                <use xlink:href="#iconb_tibidizhi" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('purchase.invite')" is-link @click="$router.push({name:'invite'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconInvitation" v-if="!theme"></use>
                                <use xlink:href="#iconb_yaoqing" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('user.mine.workOrder')" is-link @click="$router.push({name:'workorder'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconWorkorder" v-if="!theme"></use>
                                <use xlink:href="#iconb_gongdan" v-else></use>
                            </svg>
                        </van-cell>
                        <van-cell title="支付绑定" is-link @click="$router.push({name:'payBind'})">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconloginpassword"></use>
                            </svg>
                        </van-cell>
                        <van-cell :title="$t('form.sign.signOut')" is-link @click="showSignOut = true">
                            <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                                <use xlink:href="#iconshort" v-if="!theme"></use>
                                <use xlink:href="#iconb_tuichu" v-else></use>
                            </svg>
                        </van-cell>
                    </van-cell-group>
                </div>
                <!-- 退出登录 -->
                <van-popup v-model="showSignOut" position="center">
                    <div class="modal sm">
                        <div class="head flexLevel">
                            <span></span>
                            <van-icon name="cross" @click="showSignOut = false" />
                        </div>
                        <div class="content">
                            <div class="toast">{{$t('message.sign.signOut')}}</div>
                        </div>
                        <div class="btnBox noMt flexLevel">
                            <van-button class="smallBtn default" @click="showSignOut = false">{{$t('button.public.cancel')}}</van-button>
                            <van-button class="smallBtn active" @click="onSignOut">{{$t('button.public.confirm')}}</van-button>
                        </div>
                    </div>
                </van-popup> 
            </div>
        </div>
        <uploadAvatar @uploadsuccess="saveAvatar" />
    </div>
</template>  

<script>  
    import backbar from '@/views/modules/back.vue'
    import uploadAvatar from '@/views/modules/uploadAvatar.vue'
    import avatar from '@/assets/img/defaultAvatar.png'
    export default {
        data(){
            return{
                backUrl:{
                    url: 'assets'
                },
                showSignOut: false,
                defaultAvatar: avatar, // 默认头像
                userInfo:JSON.parse(localStorage.getItem('user')) || {}
            }
        },
        computed:{
            headImg(){
                return this.$mts.getUserValue('avatar');
            },
            theme(){
                return this.$store.state.app.theme;
            }
        },
        components:{
            backbar,
            uploadAvatar
        },
        beforeRouteLeave (to, from, next) {
            this.$store.state.app.uploadAvatar.show = false;
            next();
        },
        mounted(){
            let that = this;
            if(!that.$store.state.isLogin){
                that.$router.push({name:'signin'});
            }
        },
        watch:{

        },
        methods:{
            saveAvatar(url){// 上传头像
                let that = this;
                that.submiting = true;
                if(that.submiting){
                    that.$mts.posts({
                        url:"api/me/user/setUserInfo",
                        data:{
                            username: '',
                            nickName: '',
                            avatar: url,
                            sign: ''
                        },
                        success(response){
                            that.submiting = false;
                            if(response.data.status == 200){
                                that.$mts.toast(that.$t('message.public.avatarSuc'));
                                that.$store.state.app.uploadAvatar.show = false;
                                that.getUserInfo();
                            }
                        },error(error){

                        }
                    });
                }
            },
            getUserInfo(){
                let that = this;
                that.$mts.posts({
                    url:"api/me/user/info",
                    data:{},
                    success(response){
                        that.submiting = false;
                        if(response.data.status == 200){
                            localStorage.setItem("user",JSON.stringify(response.data.data));
                            that.defaultAvatar = response.data.data.avatar;
                            that.$router.push({name:'assets'});
                        }
                    },error(error){

                    }
                });
            },
            onSignOut(){ // 登出
                this.showSignOut = false;
                this.$mts.signout();
            }
        }
    }
</script>  

<style lang="scss" scoped>

</style>

<style lang="scss">
    .userHead {
        .back {
            background-color: #E4EEEF;
        }
    }
    .userWrapper {
        .userFeatures {
            .avatar {
                border-bottom: 1px solid #d5d5d5;
            }
            .van-cell-group {
                .van-cell {
                    background-color: #E4EEEF;
                    border-bottom: 1px solid #d5d5d5;
                }
            }
        }
    }
</style>