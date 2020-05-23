<template>
<div class="">
    <div class="dh"></div>
    <van-tabbar :value="activeIndex" class="downbar">
        <van-tabbar-item @click.native="$mts.goto('home')" icon="home-o">
            <i class="iconfont iconhome" v-if="activeIndex!=0" slot="icon"></i>
            <i class="iconfont iconhome_selected" v-if="activeIndex==0" slot="icon"></i>
        {{$t('nav.n1')}}</van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('coinlist')" icon="chart-trending-o">
            <i class="iconfont iconmarkets" v-if="activeIndex!=1" slot="icon"></i>
            <i class="iconfont iconmarkets_selected" v-if="activeIndex==1" slot="icon"></i>
        {{$t('nav.n2')}}</van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('trade',{symbol:'BTC_USDT'})" icon="exchange">
            <i class="iconfont iconmargin" v-if="activeIndex!=2" slot="icon"></i>
            <i class="iconfont icontransaction_selected" v-if="activeIndex==2" slot="icon"></i>
        {{$t('nav.n3')}}</van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('otc')" :info="chatCount" icon="idcard">
            <i class="iconfont iconotc" v-if="activeIndex!=3" slot="icon"></i>
            <i class="iconfont iconotc_selected" v-if="activeIndex==3" slot="icon"></i>
        {{$t('nav.n4')}}</van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('assets')" icon="diamond-o">
            <i class="iconfont iconassets" v-if="activeIndex!=4" slot="icon"></i>
            <i class="iconfont iconassets_selected" v-if="activeIndex==4" slot="icon"></i>
        {{$t('nav.n5')}}</van-tabbar-item>
    </van-tabbar>
</div>
</template>
<script>
export default {
    data(){
        return {
        
        }
    },
    components:{},
    watch:{},
    computed:{
        activeIndex(){
            switch(this.$route.name){
                case "home":
                    return 0;
                case "coinlist":
                    return 1;
                case "trade":
                    return 2;
                case "otc":
                    return 3;
                case "assets":
                    return 4;
                default:
                    return 100;
            }
        },
        chatCount(){
            if (this.$store.state.isLogin) {
                return this.$store.state.newChat.count > 0 ? this.$store.state.newChat.count : '';
            }
            return '';
        }
    },
    mounted(){
        
    },
    methods:{}
}
</script>
<style lang="stylus"></style>