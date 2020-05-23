<template>  
    <div class="download">
        <div class="logo"><img src="@/assets/img/G-logo.png" alt=""></div>
        <div class="mark">Huodun</div>
        <div class="information">{{$t(vLanguage ? '当前版本：' : 'Current version: ')}}{{(isIOS ? iosVersion : androidVersion)}}</div>
        <div class="buttonWrapper" @click="downloadApp">
            <van-loading type="spinner" color="#1989fa" v-if="loading"/>
            <div class="button" v-else>
                <img src="@/assets/img/apple.png" alt="" v-if="isIOS">
                <img src="@/assets/img/android.png" alt="" v-if="!isIOS">
                {{vLanguage ? (isIOS ? '苹果下载' : '安卓下载') : (isIOS ? 'Apple download' : 'Android download')}}
            </div>
        </div>
        <div class="overlay" v-if="show">
            <img src="@/assets/img/goBrowser.png" alt="">
        </div>
    </div>
</template>
<script>  
export default {
    data(){
        return{
            show: false,
            iosUrl: '',
            androidUrl: '',
            iosVersion: '',
            androidVersion: '',
            isIOS: false,
            loading: false,
            vLanguage:localStorage.getItem('language')=='zh-CN' ? true : false
        }
    },
    computed:{
    },
    components:{},
    mounted(){
        let that = this;
        that.getUrl();
    },
    watch:{},
    methods:{
        getUrl(){
            let that = this;
            if(!that.loading){
                that.loading = true;
                that.$mts.posts({
                    url: 'api/me/app/config',
                    data: {noNeedCode:true},
                    success(response){
                        if(response.data.status == 200){
                            that.loading = false;
                            that.iosUrl = response.data.data.iosUrl;
                            that.androidUrl = response.data.data.androidUrl;
                            that.iosVersion = response.data.data.iosVersion;
                            that.androidVersion = response.data.data.androidVersion;
                            that.checkBrowser();
                        }
                    }
                });
            }
        },
        checkBrowser(){
            let that = this;
            let u = navigator.userAgent;
            let wx = that.isWeixin();
            if(u.indexOf('iPhone') > -1){ // apple mobile 
                if(that.isPC()){
                    that.isIOS = false;
                }else{
                    that.isIOS = true;
                }
            }else if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){ // Android mobile
                that.isIOS = false;
            }
            if(wx){ // 微信浏览器
                that.show = true;
                return;
            }
        },
        downloadApp(){ // 下载APP
            let that = this;
            if(that.isIOS){
                window.location.href = 'itms-services://?action=download-manifest&url=' + that.iosUrl;
            }else{
                window.location.href = that.androidUrl;
            }
        },
        isWeixin(){
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        isPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
            var flag = true; // PC端
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false; // 移动端
                    break;
                }
            }
            return flag;
        }
    }
}
</script> 

<style lang="scss" scoped>
    .download{width:100vw;height:100vh;background:linear-gradient(to bottom,#6badfb,#0553d4);display: flex;flex-direction: column;align-items:center;
        .logo{
            img{width:25vw;display: block;margin-top:15vh;}
        }
        .mark{font-size:6.6667vw;line-height:9.3333vw;color: #fff;margin: 6vw 0 8vw;}
        .information{font-size: 3.2vw;color:rgba(255,255,255,0.8);line-height:4.4vw;margin-bottom:15vw;}
        .buttonWrapper{display: flex;align-items:center;justify-content:center;width:84vw;height: 11.7333vw;border-radius: 7.3333vw;background: #fff;color:#2A80FA;font-size:4vw;font-weight: 500;
            .button{display: flex;align-items:center;justify-content:center;
                img{width:4.4vw;margin-right:2vw;transform: translateY(-1vw);}
            }
        }
        .noIOS{margin-top: 8vw;font-size: 4vw;color:#fff;}
    }
    .overlay{width:100vw;height:100vh;position:fixed;top:0;left:0;right:0;background: rgba(0,0,0,0.7);
        img{width: 60vw;float:right;margin-top:5vw;margin-right:8vw;}
    }
</style>