<template>
<div id="app" :class="$store.state.app.nightModel ? 'darkModel' : 'whiteModel'">
    <div class="startPage" v-if="showLoading" >
        <span><img src="@/assets/img/start_inside.png" alt=""></span>
    </div>
    <div class="container"><transition :name="transitionName"><router-view style="opacity: 1" /></transition></div>
</div>
</template>
<script>
export default {
    data(){
        return {
            isIos:false,
            showLoading:false,
            transitionName:"",
            interval: null
        }
    },
    beforeRouteEnter (to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不能获取组件实例 `this`
        // 因为当钩子执行前，组件实例还没被创建
        next();
    },
    beforeRouteUpdate (to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        next();
    },
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        next();
    },
    computed:{
        
    },
    components:{
        
    },
    beforeDestroy(){
        clearInterval( this.interval);
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
        "$store.state.isLogin":{
            handler:function(cur, old){
                if (cur) {
                    this.initChat();
                    clearInterval(this.interval);
                    this.interval = setInterval(()=>{
                        this.initChat();
                    }, 2800);
                }
            },
            deep:true
        }
    },
    mounted(){
        this.appInit();
        this.$mts.checkLogin('clear');
        setInterval(()=>{
            this.$mts.rates();//页面初始化完成
        },360000)

        if(localStorage.getItem("rate")=="CNY,USD"){
            localStorage.setItem("rate",'CNY');
        }

        //默认黑色
        if(localStorage.getItem('nightModel')==""||localStorage.getItem('nightModel')==null){
            this.$store.state.app.nightModel = true
            localStorage.setItem('nightModel',true)
        }

    },
    methods:{
        appInit(){
            let that = this;
            $(window).scroll(()=>{
                that.$store.state.app.scrollTop = $(window).scrollTop();
            });


            document.addEventListener("plusready", onPlusReady, false); 
            function onPlusReady(){
                localStorage.setItem("isAPP",true);
                setTimeout(()=>{
                    that.$mts.checkVersion();
                },2000)

                plus.navigator.setStatusBarStyle('dark'); 
                plus.navigator.setStatusBarBackground('#ffffff');
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
                },3000)
            }
            mui.init({
                gestureConfig: {
                    longtap:true
                }
            });
            mui.plusReady(function() {
                document.addEventListener('longtap', function(e) {
                    var target = e.target;
                    that.$mts.savePic(target);
                });
            });
        },
        initChat() {
            let that = this;
            if (that.$store.state.isLogin) {
                that.$mts.post({
                    url:'/otc/chat/unread',
                    data:{},
                    success(response){
                        if (response.data.code == 200) {
                            let oriChat = that.$store.state.newChat;
                            let nowChat = response.data.data;
                            if (oriChat.timestamp > 0 && nowChat.timestamp > oriChat.timestamp
                                && nowChat.count > oriChat.count) {
                                that.$notify({
                                    type: 'success',
                                    message:'您有新<OTC>未读消息，请及时查看！'
                                });
                            }
                            that.$store.state.newChat = nowChat;
                        }
                    }
                });
            }
        }
    }
}
</script>
<style lang="stylus"></style>