<template>
<div class="downbar">
    <div class="dh"></div>
    <van-tabbar :value="activeIndex">
        <van-tabbar-item @click.native="$mts.goto('home')">
            <img src="@/assets/img/home2.png" v-if="activeIndex!=0 && !theme" slot="icon" /> 
            <img src="@/assets/img/home2_selected.png" v-if="activeIndex==0 && !theme" slot="icon"/> 
            {{$t('nav.n1')}}
        </van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('quotes')">
            <i class="iconfont iconmarkets" v-if="activeIndex!=1" slot="icon"></i>
            <i class="iconfont iconmarkets" v-if="activeIndex==1" slot="icon"></i>
            {{$t('nav.n2')}}
        </van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('trade',{symbol:'BTC_USDT'})">
            <i class="iconfont iconmargin" v-if="activeIndex!=2" slot="icon"></i>
            <i class="iconfont iconmargin" v-if="activeIndex==2" slot="icon"></i>
            {{$t('nav.n3')}}
        </van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('purchase')">
            <i class="iconfont iconSubscription" v-if="activeIndex!=3" slot="icon"></i>
            <i class="iconfont iconSubscription" v-if="activeIndex==3" slot="icon"></i>
            {{$t('nav.n4')}}
        </van-tabbar-item>
        <van-tabbar-item @click.native="$mts.goto('assets')">
            <i class="iconfont iconassets" v-if="activeIndex!=4" slot="icon"></i>
            <i class="iconfont iconassets" v-if="activeIndex==4" slot="icon"></i>
            {{$t('nav.n5')}}
        </van-tabbar-item>
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
                case "quotes":
                    return 1;
                case "trade":
                    return 2;
                case "purchase":
                    return 3;
                case "assets":
                    return 4;
                default:
                    return 100;
            }
        },
        // chatCount(){
        //     if (this.$store.state.isLogin) {
        //         return this.$store.state.newChat.count > 0 ? this.$store.state.newChat.count : '';
        //     }
        //     return '';
        // }
        theme(){
            return this.$store.state.app.theme;
        }
    },
    mounted(){
        
    },
    methods:{}
}
</script>
<style lang="scss" scoped>

</style>