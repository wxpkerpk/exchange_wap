<template>
<div class="flexPage" style="background: #081823">
    <div class="flexContent">
        <a href="javascript:void(0)" class="backToLink" @click="$router.push({name:'home'})"><van-icon name="arrow-left" /></a>
        <img src="@/assets/img/download.jpg" alt="">
        <a :href="appData.androidAddress" target="_blank" v-if="ready" class="downBtn android"><icons type="other" name="logo-android"/><span>{{$t('home.download.android')}}</span></a>
        <a :href="appData.iosAddress" target="_blank" v-if="ready" class="downBtn ios"><icons type="other" name="logo-apple"/><span>{{$t('home.download.IOS')}}</span></a>

        <!-- <a href="https://www.pgyer.com/tcrs"  target="_blank" class="downloadFailed">无法下载？点这里</a> -->
    </div>
</div>
</template>
<style scoped lang="stylus">
.backToLink{
    font-size:6vw;font-weight:bold;
    color:#fff;position:absolute;
    z-index:2;left:3vw;top:4vw;display: flex;align-items:center;
}
.downBtn{
    background: none;color:#1789FA; border-radius: 1000px; height:12vw;width:50vw;display: flex;justify-content:center;align-items:center;position: absolute;left:50%;margin:0 0 0 -25vw;border:1px solid #1789FA;box-sizing:border-box;font-size:4vw;
    i{font-size:6vw;margin-right:3vw;}
    &.android{bottom:15vw;}
    &.ios{bottom:35vw;}
}
.downloadFailed{
    background:#fff;z-index:22;color:#000;border-radius: 100px 100px;height:10vw;padding:0 0vw; text-align: center; position: absolute;left:50%;width:50vw;margin-left:-25vw; bottom:8%;color:#ff6600;font-weight:bold;line-height:10vw;border:1px solid #fff;border-right:0;}
</style>
<script>
export default {
    data(){
        return {
            ready:false,
            appData:{

                "iosAddress": "itms-services:///?action=download-manifest&url=https://wap.btbit.io/ipa.plist",
                "androidVersion": "1.0",
                "androidAddress": "https://wap.btbit.io/btbit.apk",
                "iosVersion": "1.0"
            }
        }
    },
    components:{},
    watch:{},
    computed:{
    },
    mounted(){
        if(localStorage.getItem("isAPP")){ //如果是APP，不允许访问这个页面
            this.$router.push({name:"home"})
        }else{
            this.getRar()
        }
    },
    methods:{
        getRar(){
            //ajax获取下载地址
            var that = this
            that.$mts.post({
                url:'/version',
                data:{
                    noNeedCode:true
                },success(response){
                    that.ready = true
                    that.appData = response.data.data;
                }
            });
        },
        downloadA(){
            // android 下载地址
            window.location.href = this.appData.androidAddress;
        },
        downloadB(){
            //ios 下载地址
            window.location.href = this.appData.iosAddress;
        }
    }
}
</script>
