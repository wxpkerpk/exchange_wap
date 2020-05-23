<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" class="normal" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="activityContent">
                <div class="redBox">
                    <div class="logo flexCenter"><img src="@/assets/img/r_logo.png" alt=""></div>
                    <div class="limit">{{$t('activity.limitAmount')}}</div>
                    <div :class="['toast',{en: vImg}]">{{$t('activity.congratulations')}}</div>
                    <div :class="['open','flexCenter',{en: vImg}]" @click="onOpen">{{$t('activity.open')}}</div>
                    <!-- <div class="over" v-html="$t('activity.over')"></div> -->
                </div>
            </div>
        </div>   
	</div>
</template>
<script>
import backbar from "@/views/modules/back.vue"
export default {
	data(){
        return {
            backUrl:{
                url: '',
                leftText: this.$t('activity.title'),
            },
        }
    },
    components:{backbar},
    computed:{
        vImg(){
            return localStorage.getItem('language') === 'en-US' ? true : false;
        },
        isLogin(){
            return this.$store.state.isLogin;
        }
    },
	mounted(){
        let that = this;
        that.getShare();
        if(that.$store.state.isLogin){
            that.checkOpen();
        }
    },
    watch:{
        
    },
	methods:{
        onOpen(){
            let that = this;
            if (that.isLogin) {
                that.getRed();
                that.checkOpen();
            } else {
                that.$mts.signout('needback','redEnvelope');
            }
        },
        getRed(){ // 申请红包
            let that = this;
            that.$mts.posts({
                url: 'api/activity/redPackHelp/apply',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.$router.push({name: 'redDetail'});
                    }
                }
            });
        },
        getShare(){
            let that = this;
            let clipbordText = localStorage.getItem('clipbordText');
            if(clipbordText != null){ // APP内部打开
                let url = clipbordText.split('¢')[1];
                let obj = that.$mkt.getSplit(url);
                if(obj != null){
                    localStorage.setItem('shareId',obj.shareId);
                    localStorage.setItem('inviteCode',obj.inviteCode);
                    localStorage.removeItem('clipbordText');
                }
            }else{ // 浏览器打开
                let obj = that.$mkt.getSplit(location.hash);
                if(obj != null){
                    localStorage.setItem('shareId',obj.shareId);
                    localStorage.setItem('inviteCode',obj.inviteCode);
                }
            }
        },
        checkOpen(){
            let that = this;
            let arr = [];
            that.$mts.posts({
                url: 'api/activity/redPackHelp/query',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        arr = response.data.data;
                        if(arr && arr.length > 0){
                            if(arr[0].status == 'SHARED' || arr[0].status == 'UNSHARE' || arr[0].status == 'FINISHED'){
                                that.$router.push({name:'redDetail'});
                            }
                        }
                    }
                }
            });
        }
	}
}
</script>
