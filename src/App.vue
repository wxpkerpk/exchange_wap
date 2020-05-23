<template>
    <div id="app" :class="$store.state.app.theme ? 'dark' : ''">
        <div class="startPage" v-if="showLoading">
            <div class="startInside">
                <!-- <span class="start-word">huodun</span> -->
            </div>
        </div>
        <div class="containerBox" v-else>
            <transition :name="transitionName">
                <keep-alive v-if="$route.meta.keepAlive">
                    <router-view style="opacity: 1" class="router-view"/>    
                </keep-alive>    
                <router-view style="opacity: 1" v-else class="router-view"/>    
            </transition>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data(){
            return{
                isIos:false,
                showLoading: true,
                transitionName:"",
                interval: null,
            }
        },
        mounted(){
            this.appInit();
            setTimeout(()=>{
                this.showLoading = false
            },2500)
            // this.$mts.checkVersion();
            // 默认黑夜模式
            // if(localStorage.getItem('theme') == "" || localStorage.getItem('theme') == null){
            //     this.$store.state.app.theme = true;
            //     localStorage.setItem('theme',JSON.stringify(true));
            // }
        },
        beforeDestroy(){
            // 清除定时任务
            clearInterval(this.interval);
        },
        watch:{
            //当页面发生跳转时，根据to和from的index大小做动画（左滑还是右滑）
            $route(to, from) {
                if(to.meta.index > from.meta.index){
                    this.transitionName = 'slide-left';
                }else if(to.meta.index < from.meta.index){
                    this.transitionName = 'slide-right';
                }else{
                    this.transitionName = "";
                }
            },
        },
        methods:{
            appInit(){
                const that = this;
                that.$mts.getCoins();
                // that.showLoading=true;
                that.interval = setInterval(()=>{
                    that.$mts.refreshToken(); //刷新token,2个小时
                },2*60*60*1000)

                document.addEventListener("plusready", onPlusReady, false); 

                localStorage.setItem('downloadModal',true);

                function onPlusReady(){
                    document.addEventListener("resume",()=>{ // 后台切前台
                        let cltxt = that.$mts.getClipbordText();
                        if(cltxt){
                            let url = cltxt.split('¢')[1];
                            let obj = that.$mkt.getSplit(url);
                            if(obj != null){
                                localStorage.setItem('shareId',obj.shareId);
                                localStorage.setItem('inviteCode',obj.inviteCode);
                                if(that.$store.state.isLogin){
                                    if(!obj.shareId){
                                        return;
                                    }else{
                                        that.$router.push({name: 'redDetail'});
                                        that.$mts.setClipbordText();
                                    }
                                }else{
                                    that.$mts.signout('needback','redEnvelope');
                                }
                            }
                        }
                    }, false);

                    // document.addEventListener("pause",() => { // 前台切后台
                    //     that.$mts.setClipbordText();
                    // }, false);
                    
                    localStorage.setItem("isAPP",true);

                    // 获取当前网路类型
                    var types = {};
                    types[plus.networkinfo.CONNECTION_UNKNOW] = that.$t('network.unknown');
                    types[plus.networkinfo.CONNECTION_NONE] = that.$t('network.none');
                    types[plus.networkinfo.CONNECTION_ETHERNET] = that.$t('network.ethernet');
                    types[plus.networkinfo.CONNECTION_WIFI] = that.$t('network.wifi');
                    types[plus.networkinfo.CONNECTION_CELL2G] = that.$t('network.cellularTwo');
                    types[plus.networkinfo.CONNECTION_CELL3G] = that.$t('network.cellularThree');
                    types[plus.networkinfo.CONNECTION_CELL4G] = that.$t('network.cellularFour');

                    
                    setTimeout(()=>{
                        that.$mts.checkVersion();
                    },2000);


                    // 如果是打包的APP  显示开机启动界面
                    that.showLoading = true;
                    var u = navigator.userAgent;
                    if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){ //ios
                        that.isIos = true;
                    }else{
                        that.isIos = false
                    }
                    setTimeout(()=>{
                        that.showLoading = false
                    },2500)
                }
                // app 进行图片保存
                mui.init({
					
                    gestureConfig: {
                        longtap:true
                    },
                });
                mui.plusReady(function() {
                    // 监听长按状态
                    document.addEventListener('longtap', function(e) {
                        var target = e.target;
                        that.$mts.savePic(target);
                    });

                    // 监听当前数据状态
                    document.addEventListener("netchange", onNetChange, false);
                    //获取当前网络类型
                    function onNetChange() {
                        const net = plus.networkinfo.getCurrentType();
                        switch (net) {
                            case plus.networkinfo.CONNECTION_ETHERNET:
                            case plus.networkinfo.CONNECTION_WIFI:
                                mui.toast(that.$t('network.isWifi'));
                                break;
                            case plus.networkinfo.CONNECTION_CELL2G:
                            case plus.networkinfo.CONNECTION_CELL3G:
                            case plus.networkinfo.CONNECTION_CELL4G:
                                mui.toast(that.$t('network.noWifi'));
                                break;
                            default:
                                mui.toast(that.$t('network.noNetwork'));
                                break;
                        }

                        // app自动更新
                        // plus.runtime.getProperty(plus.runtime.appid, function(inf) {
                        //     const ver = inf.version; 
                        //     const url= `${severUlr}version/gainApkVersion`; 
                        //     // const client; 
                        //     const ua = navigator.userAgent.toLowerCase(); 
                        //     if(/android/.test(ua)) {  
                        //         mui.ajax(url,{ 
                        //         data:{ 
                        //             apkVersion: ver, 
                        //         }, 
                        //         dataType:'json', 
                        //         type:'POST', 
                        //         timeout:10000, 
                        //         success:function(data){   
                        //             if(data.success){   
                        //                 mui.toast("发现新版本:V"+data.data.apkVersion);//获取远程数据库中上新andriod版本号                        
                        //                 const dtask = plus.downloader.createDownload(data.data.apkUrl, {}, function(d, status) { 
                        //                     if (status == 200) {                                         
                        //                         plus.nativeUI.toast("正在准备环境，请稍后！"); 
                        //                         sleep(1000); 
                        //                         const path = d.filename;//下载apk 
                        //                         plus.runtime.install(path); // 自动安装apk文件 
                        //                     }else { 
                        //                         alert('版本更新失败:' + status); 
                        //                     } 
                        //                 }); 
                        //                 dtask.start();  
                        //             }else{ 
                        //                 console.log('当前版本号已是最新'); 
                        //                 return; 
                        //             } 
                        //         }, 
                        //             error: function(xhr, type, errerThrown) { 
                        //                 mui.toast('网络异常,请稍候再试'); 
                        //             } 
                        //         }); 
                        //     } 
                        // }); 
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
    #app{
        background-color: #E4EEEF;
        min-height:100vh;
        font-family:'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
        &.dark{
            background: #11141C;
        }
        // .router-view{
        //     position: absolute;
        //     top: 0;
        // }
    }
    .startInside {
        background: url('./assets/svg/start_logo.svg');
        .start-word {
            font-size: 20px;
        }
    }
</style>
