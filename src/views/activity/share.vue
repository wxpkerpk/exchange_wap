<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" class="normal" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="shareWrapper">
                <div class="shareBox">
                    <div class="head">
                        <dl>
                            <dt><img :src="userInfo.avatar" alt=""></dt>
                            <dd>{{userInfo.username}}</dd> 
                        </dl>
                    </div>
                    <div class="help">{{$t('activity.help')}}</div>
                    <div class="qrCodeBox">
                        <div class="qrcode flexCenter">
                            <qrcode :value="inviteUrl" tag="img" :options="{ width: 150 }"></qrcode>
                        </div>
                        <p>{{$t('user.deposit.save')}}</p>
                    </div>
                    <div class="btn">
                        <span class="flexCenter" @click="showMore = true">{{$t('activity.pullPeople')}}<img src="@/assets/img/s_share.png" alt=""></span>
                    </div>
                </div>
            </div>
        </div>   

        <!-- 弹窗 -->
        <van-popup v-model="showMore" position="bottom" class="showMore">
            <div class="moreModal flexLevel">
                <div class="btn1 flexCenter" @click="$router.push({path: '/shareImg',query:{inviteLink: inviteUrl}});"><img src="@/assets/img/imgIcon.png" alt="">{{$t('activity.saveImg')}}</div>
                <div class="btn2 flexCenter" @click="copy()"><img src="@/assets/img/copyIcon.png" alt="">{{$t('activity.shareLink')}}</div>
            </div>
        </van-popup>
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
            userInfo:{},
            basicInfo:{},
            inviteUrl: null,
            showMore:false
        }
    },
    components:{backbar},
    computed:{
        
    },
	mounted(){
        this.initPage();
    },
    watch:{
        
    },
	methods:{
        initPage(){
            this.query();
            this.getUserInfo();
            this.getInviteCode();
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
                        that.inviteUrl = that.$config.domain + '/#/signup?shareId='+that.basicInfo.id+'&inviteCode='+that.inviteCode;
                    }
                }
            });
        },
        copy(){
            this.$mts.copy(this.inviteUrl);
        }
	}
}
</script>
