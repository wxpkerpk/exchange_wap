<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" class="normal" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="bonusWrapper">
                <div class="top">
                    <div class="title">{{$t('activity.myBonus')}}<img src="@/assets/img/checkIcon.png" alt=""></div>
                    <!-- <div class="record" @click="goUrl('myBonus')">{{$t('activity.bonusRecord')}}</div> -->
                </div>
                <div class="connectBox">
                    <div class="block_one">
                        <div class="content">
                            <dl>
                                <dt>{{$t('activity.obtained')}}({{defaultCoin}})</dt>
                                <dd>{{$mkt.fmtZero((detail.prizeFrozen || 0)+(detail.prizeReleased || 0))}}</dd>
                            </dl>
                            <dl>
                                <dt>{{$t('activity.hasRelease')}}({{defaultCoin}})</dt>
                                <dd>{{$mkt.fmtZero(detail.prizeReleased || 0)}}</dd>
                            </dl>
                        </div>
                        <span class="lock1"><img src="@/assets/img/connection.png" alt=""></span>
                        <span class="lock2"><img src="@/assets/img/connection.png" alt=""></span>
                    </div>
                    <div class="block_two">
                        <div class="content">
                            <div class="title">{{$t('activity.getBonus')}}</div>
                            <div class="pink"><span></span></div>
                            <div class="block flexLevel" @click="goUrl('deposit')">
                                <dl>
                                    <dt><img src="@/assets/img/p1.png" alt=""></dt>
                                    <dd>
                                        <b>{{$t('home.features.h7')}}</b>
                                        <span v-html="$t('activity.deposit')+defaultCoin"></span>
                                    </dd>
                                </dl>
                                <div class="inviteBtn">{{$t('button.public.recharge')}}</div>
                                <span class="dot1"></span>
                                <span class="dot2"></span>
                            </div>
                            <div class="block flexLevel" @click="goUrl('invite')">
                                <dl>
                                    <dt><img src="@/assets/img/p2.png" alt=""></dt>
                                    <dd>
                                        <b>{{$t('home.features.h6')}}</b>
                                        <span>{{$t('activity.signUpSuc')}}{{defaultCoin}}</span>
                                    </dd>
                                </dl>
                                <div class="inviteBtn">{{$t('activity.goInvite')}}</div>
                                <span class="dot1"></span>
                                <span class="dot2"></span>
                            </div>
                            <div class="block flexLevel" @click="goUrl('invite')">
                                <dl>
                                    <dt><img src="@/assets/img/p3.png" alt=""></dt>
                                    <dd>
                                        <b>{{$t('purchase.inviteMoney')}}</b>
                                        <span>{{$t('activity.inviteFirst')}}{{defaultCoin}}</span>
                                    </dd>
                                </dl>
                                <div class="inviteBtn">{{$t('activity.goInvite')}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="block_two">
                        <div class="content">
                            <div class="title">{{$t('activity.noFrozen')}}</div>
                            <div class="pink"><span></span></div>
                            <div class="block flexLevel" @click="todayCheckIn ?'':$mts.goto('checkIn')">
                                <dl>
                                    <dt><img src="@/assets/img/p4.png" alt=""></dt>
                                    <dd>
                                        <b>{{$t('activity.dayCheck')}}</b>
                                        <span v-if="!todayCheckIn">{{$t('activity.unchecked')}}</span>
                                        <span v-if="todayCheckIn">+{{$mkt.fmtZero(lastCheck.amount)}} {{lastCheck.coinCode}}</span>
                                    </dd>
                                </dl>
                                <div class="inviteBtn" :class="{active:todayCheckIn}">{{todayCheckIn?$t('activity.checked'):$t('activity.goCheckIn')}}</div>
                                <span class="lock3"><img src="@/assets/img/connection.png" alt=""></span>
                                <span class="lock4"><img src="@/assets/img/connection.png" alt=""></span>
                                <span class="dot1"></span>
                                <span class="dot2"></span>
                            </div>    
                            <div class="block flexLevel" @click="goUrl('invite')">
                                <dl>
                                    <dt><img src="@/assets/img/p4.png" alt=""></dt>
                                    <dd>
                                        <b>{{$t('activity.invitePurchase')}}</b>
                                        <span v-html="$t('activity.yourFriends')"></span>
                                    </dd>
                                </dl>
                                <div class="inviteBtn">{{$t('activity.goInvite')}}</div>
                            </div> 
                        </div> 
                    </div>
                    <div class="bonusRules">
                        <div class="title flexCenter">
                            <img src="@/assets/img/s_dots.png" alt="">
                            <span>{{$t('activity.bonusRules')}}</span>
                            <img src="@/assets/img/s_dots.png" alt="">
                        </div>
                        <div class="content" v-html="$t('activity.b1')"></div>
                    </div>
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
                url: 'home',
                leftText: this.$t('activity.bonus'),
                rightText:this.$t('activity.bonusRecord'),
                path:'myBonus'
            },
            list:[],
            defaultCoin: 'USDT',
            todayCheckIn: false,
            lastCheck:{
                amount: 0,
                coinCode: 'USDT'
            }
        }
    },
    components:{backbar},
    computed:{
        detail(){
            let that = this;
            if (that.$store.state.isLogin) {
                for (var i = that.list.length - 1; i >= 0; i--) {
                    let item = that.list[i];
                    if (item.coinCode == that.defaultCoin) {
                        return item;
                    }
                }
            }
            return {prizeFrozen: 0, prizeReleased: 0};
        },
    },
	mounted(){
        let that = this;
        that.$mts.checkExpire('clear',true,()=>{
            if (that.$store.state.isLogin) {
                that.balance(); // 获取资金列表
                that.signin();
            }
        });
    },
    watch:{
        
    },
	methods:{
        onOpen(){
            
        },
        balance(){
            let that = this;
            that.$mts.posts({
                url: 'api/me/balance/info',
                data:{},
                success(response){
                    if(response.status == 200){
                        that.list = response.data.data.balance;
                    }else{
                        that.$mts.toast(that.$t('message.public.dataError'));
                    }
                }
            });
        },
        signin(){
            let that = this;
            that.$mts.posts({
                url:'api/activity/signin/query?page=1&size=31',
                data:{},
                success(response){
                    if (response.data.status == 200) {
                        let list = response.data.data;
                        if (list && list.length > 0) {
                            that.lastCheck = list[0];
                            let lastCheckTime = that.$mkt.dateFormat('yyyymmdd',new Date(list[0].createTime.replace(/-/g,'/')));
                            let nowCheckTime = that.$mkt.dateFormat('yyyymmdd',new Date());
                            that.todayCheckIn = (lastCheckTime == nowCheckTime);
                        }
                    }
                }
            });
        },
        goUrl(url){
            let that = this;
            if (that.$store.state.isLogin) {
                that.$mts.gourl(url);
            } else {
                that.$mts.signout('needback', url);
            }
        }
	}
}
</script>
