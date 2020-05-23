<template>
    <div class="flexPage">
        <div class="flexContent" style="position: relative;">
            <a href="javascript:void(0)" class="backToLink" @click="$router.go(-1)"><van-icon name="arrow-left" /></a>
            <div class="qrcodeImg" ref="imageWrapper">
                <img class="real_pic" ref="image" :src="dataURL" style="position: absolute;left:0;right:0;width:100%;top:0;z-index:200" />
                <slot>
                    <div :class="['downPic',vImg ? '' : 'en']">
                        <div class="shareBox">
                            <div class="head">
                                <dl>
                                    <dt><img :src="userInfo.avatar" alt=""></dt>
                                    <dd>{{userInfo.nickName}}</dd> 
                                </dl>
                            </div>
                            <div class="help">{{$t('activity.help')}}</div>
                            <div class="qrCodeBox">
                                <div class="qrcode flexCenter">
                                    <qrcode :value="inviteUrl" tag="img" :options="{ width: 150 }"></qrcode>
                                </div>
                            </div>
                            <div class="btn">
                                <span class="flexCenter" @click="onShare">{{$t('activity.shareLink')}}<img src="@/assets/img/s_share.png" alt=""></span>
                            </div>
                        </div>
                    </div>
                </slot>
            </div>
        </div>

        <!-- 弹窗 -->
        <van-popup v-model="showMore" position="bottom" class="showMore">
            <div class="moreModal flexLevel">
                <div class="btn1 flexCenter" @click="onShow"><i class="iconfont iconlianjie" />{{$t('activity.sharePassword')}}</div>
                <div class="btn2 flexCenter" @click="copy()"><i class="iconfont iconlianjie" />{{$t('activity.shareLink')}}</div>
            </div>
        </van-popup>

        <!-- 展示邀请口令 -->
        <van-popup v-model="showPassword" position="center">
            <div class="tModal">
                <div class="success flexCenter">{{$t('activity.copySuc')}}</div>
                <div class="content">
                    <div class="shareKey" v-html="invitePassword"></div>
                    <div class="goToShare">{{$t('activity.zlsm')}}</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import html2canvas from "html2canvas"
    export default {
        data(){
            return {
                dataURL:"",
                timeout:null,
                inviteUrl: '--',
                userInfo:{},
                showMore:false,
                showPassword: false, 
                invitePassword:""
            }
        },
        components:{},
        watch:{},
        computed:{
            vImg(){
                return localStorage.getItem('language') === 'zh-CN' ? true : false;
            }
        },
        beforeRouteLeave (to, from, next) { // 生成图片覆盖div
            clearTimeout(this.timeout)
            next();
        },
        mounted(){
            this.initPage();
        },
        methods:{
            initPage(){
                this.query();
                this.getUserInfo();
            },
            getUserInfo(){
                let that = this;
                that.userInfo = JSON.parse(localStorage.getItem('user'));
            },
            query(){
                let that = this;
                that.$mts.posts({
                    url: 'api/activity/redPackHelp/query',
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.basicInfo = response.data.data[0];
                            that.getInviteCode();
                        }
                    }
                });
            },
            getInviteCode(){
                let that = this;
                that.$mts.posts({
                    url: 'api/me/referralRewards/getReferralCode',
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.inviteCode = response.data.data.invitationCode;
                            that.inviteUrl = that.$config.domain+'/#/redEnvelope?shareId='+that.basicInfo.id+'&inviteCode='+that.inviteCode;
                            that.invitePassword = that.$t('activity.yqkl',{url: that.inviteUrl});
                        }
                    }
                });
            },
            downLoad(){
                let that = this;
                that.showMore = false;
                that.toImage();
                setTimeout(() => {
                    if(that.dataURL){
                        that.$mts.savePic(that.$refs.image);
                    }
                },1500);
            },
            onShare(){
                this.showMore = true;
            },      
            copy(){
                this.$mts.copy(this.inviteUrl);
            },
            toImage() {
                html2canvas(this.$refs.imageWrapper,{
                    backgroundColor: null,
                    useCORS: true,
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.dataURL = dataURL;
                });
            },
            isWeixin(){
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    return true;
                } else {
                    return false;
                }
            },
            onShow(){
                let that = this;
                let u = navigator.userAgent;
                let iFrame = null;
                let url = "dogex://"
                let downloadLink = that.$config.domain+'/#/download';
                that.$copyText(that.invitePassword.replace(/<\/?[^>]+>/g,'')).then(function (e) {
                    that.showPassword = true;
                    that.showMore = false;
                    if(localStorage.getItem('isAPP')){
                        return;
                    }
                    if(that.isWeixin()){ // 微信
                        window.location.href = downloadLink;
                        return;
                    }
                    if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){ // 安卓
                        iFrame = document.createElement("iframe");
                        iFrame.setAttribute("src", url);
                        iFrame.setAttribute("style", "display:none;");
                        iFrame.setAttribute("height", "0px");
                        iFrame.setAttribute("width", "0px");
                        iFrame.setAttribute("frameborder", "0");
                        document.body.appendChild(iFrame);
                        // 发起请求后这个 iFrame 就没用了，所以把它从 dom 上移除掉
                        iFrame.parentNode.removeChild(iFrame);
                        iFrame = null;
                        // 如果用户没有安装APP，则提示用户去安装APP
                        setTimeout(() => {
                            window.location.href = downloadLink;
                        },3000);
                    }else{ // IOS
                        window.location.href = url;
                        setTimeout(() => {
                            window.location.href = downloadLink;
                        },3000);
                    }
                }, function (e) {
                    
                })
            },
        }
    }
</script>

<style scoped lang="scss">
.backToLink{font-size:6vw;font-weight:bold;color:#fff;position: fixed;z-index:201;left:3vw;top:4vw;display: flex;align-items:center;}
.downPic{width: 100vw;height: 100vh;background: url('../../assets/img/share_bg.jpg') no-repeat center center;background-size: 100% 100%;
    &.en{background: url('../../assets/img/share_bg_en.png') no-repeat center center;background-size: 100% 100%;}
    .shareBox{width: 100vw;height: 96.5333vw;background: url('../../assets/img/s_sbox.png') no-repeat center center;background-size: 100% 100%;position: absolute;left: 0;right: 0;bottom: 21.0667vw;display:flex;flex-direction:column;align-items:center;
        .head{
            dl{display: flex;flex-direction:column;justify-content:center;align-items:center;margin-top: -8.46667vw;
                dt{width: 16.9333vw;height: 16.9333vw;border-radius: 50%;overflow:hidden;border: 0.5333vw solid #FFB229;box-sizing:border-box;
                    img{width: 100%;display:block;}
                }
                dd{display: inline-block;min-width:30vw;height: 7.3333vw;line-height: 7.3333vw;border: 0.5333vw solid #FFB229;background: #FFDD8B;box-sizing: border-box;text-align: center;font-size: 3.2vw;color:#C07200;font-weight: 500;border-radius: 3.6667vw;margin-top: -1vw;}
            }
        }
        .help{width: 80vw;height: 11.4667vw;line-height: 15vw;text-align:center;background: url('../../assets/img/s_stoast.png') no-repeat center center;background-size: 100% 100%;margin-top:1.333vw;font-size: 3.7333vw;color:#FF8100;font-weight: 500;}
        .qrCodeBox{margin-top: 6vw;
            .qrcode{width: 36vw;height: 36vw;border: 1.8667vw solid #FDBE4F;background: #FDBE4F;border-radius: 1.0667vw;box-sizing:border-box;overflow:hidden;}
            p{font-size: 3.2vw;line-height: 4.4vw;color:#FD7A00;text-align:center;margin-top: 4vw;font-weight: 500;}
        }
        .btn{margin-top: 8vw;
            span{width:80vw;height:11.7333vw;line-height:11.7333vw;border-radius: 1.0667vw;font-size: 4.3333vw;font-weight:bolder;color:#fff;background: #FF8100;
                img{width:5vw;display: block;margin-left:1vw;}
            }
        }
    }
}
</style>

