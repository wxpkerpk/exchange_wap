<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" class="normal" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="activityWrapper">
                <div class="activityBox">
                    <div class="topBox">
                        <div class="head flexCenter">{{$t('activity.sendOut')}} {{sum}} USDT</div>
                        <div class="content">
                            <div class="withdraw" @click="onWithdraw">{{$t('user.index.withdrawal')}}</div>
                            <div class="amount" v-if="len > 0">{{$mkt.fmtZero(basicInfo[0].currentAmount,coinList[0].scale)}}<span>{{basicInfo[0].coinCode}}</span></div>
                            <p class="dashed"></p>
                            <div class="time"><van-count-down :time="vTime" />{{$t('activity.overTime')}}</div>
                            <div class="share">
                                <span class="flexCenter" @click="onShare">{{$t('activity.share')}}</span>
                            </div>
                            <div class="total" v-if="len > 0">{{$t('activity.total',{total:basicInfo[0].finishAmount+basicInfo[0].coinCode})}}</div>
                        </div>
                    </div>
                    <div class="invite">{{$t('activity.invite')}}</div>
                    <div class="listBox">
                        <div class="listHead"></div>  
                        <div class="listContent">
                            <ul class="title">
                                <li v-for="(item,index) in tabs" :key="index" @click="cur = index" :class="{active: cur == index}">{{item}}</li>
                            </ul>
                            <ul class="boost" v-if="cur == 0">
                                <p class="noRecord flexCenter" v-if="!list || list.length == 0">
                                    <span>{{$t('list.nodata')}}</span>    
                                </p>
                                <van-pull-refresh v-model="submiting" @refresh="refresh" v-else>
                                    <van-list
                                        v-model="$store.state.app.loading"
                                        :finished="finished"
                                        :finished-text="$t('list.nomore')"
                                        @load="getRecords()"
                                        :offset="50"
                                    >
                                        <li v-for="(item,index) in list" :key="index">
                                            <dl>
                                                <dt><img :src="item.icon" alt=""></dt>
                                                <dd>{{$t('activity.inviteLog',{userName:item.mobile ? $mkt.hideName(item.mobile) : $mkt.hideName(item.email), amount: item.amount})}}</dd>
                                            </dl>
                                        </li>
                                    </van-list>
                                </van-pull-refresh>
                            </ul>
                            <ul class="record" v-if="cur == 1">
                                <p class="noRecord flexCenter" v-if="!payList.logs || payList.logs.length == 0">
                                    <span>{{$t('list.nodata')}}</span>    
                                </p>
                                <li v-for="(item,index) in payList.logs" :key="index">
                                    <div>
                                        <dl>
                                            <dt><img :src="item.icon" alt=""></dt>
                                            <dd class="username">{{$mkt.hideCode(item.userName)}}</dd>
                                            <dd class="toast flexCenter">+{{item.amount+' '+(item.coinCode || 'USDT')}}</dd>
                                        </dl>
                                        <p>{{$t('activity.inviteFriends',{sum:item.amount+' '+(item.coinCode || 'USDT')})}}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="bottomBox">
                        <div class="rulesHead">
                            <span><img src="@/assets/img/copper.png" /></span>
                            {{$t('activity.rules')}}
                            <span><img src="@/assets/img/copper.png" /></span>
                        </div>
                        <div class="rulesContent" v-html="$t('activity.a1')"></div>
                    </div>
                </div>
            </div>
        </div>  

        <!-- 提现进度 -->
        <van-popup v-model="showRed">
            <div class="redBoxWrapper">
                <div class="close">
                    <i class="iconfont iconbaseline-close-px" @click="showRed = false" />
                </div>
                <div class="redBox">
                    <div class="topRed">
                        <div class="amount" v-if="len > 0">{{basicInfo[0].currentAmount}}<span>{{basicInfo[0].coinCode}}</span></div>
                        <div class="getRed">{{$t('activity.unWithdraw')}}</div>
                    </div>
                    <div class="topCenter">
                        <div class="toast" v-if="len > 0">{{$t('activity.total',{total:basicInfo[0].finishAmount+' '+basicInfo[0].coinCode})}}</div>
                        <div class="progress" ref="ref">
                            <van-progress
                                color="#FFCB00"
                                :percentage="percent"
                                :show-pivot="false"
                                :stroke-width="8"
                            />
                            <div class="processToast percent">{{vStatus}}</div>
                        </div>
                        <div class="publish">
                            <p class="noRecord flexCenter white" v-if="!payList.logs || payList.logs.length == 0">
                                <span>{{$t('list.nodata')}}</span>    
                            </p>
                            <div class="swipeBox" v-else>
                                <van-swipe :autoplay="3000" :show-indicators="false" :vertical="true">
                                    <van-swipe-item v-for="(item,index) in payList.logs" :key="index">
                                        <div class="record flexLevel">
                                            <dl>
                                                <dt><img :src="coinList[0].icon" alt=""></dt>
                                                <dd>+{{item.amount}}</dd>
                                            </dl>
                                            <p>{{$mkt.hideCode(item.userName) + $t('activity.inviteFriends',{sum:item.amount+' '+(item.coinCode||'USDT')})}}</p>
                                        </div>
                                    </van-swipe-item>
                                </van-swipe>
                            </div>
                        </div>
                        <div class="btn">
                            <span @click="onClick">{{vBtn}}</span>
                        </div>
                    </div>
                </div>
                <div class="more" @click="onShare">
                    {{$t('activity.inviteMore')}}
                </div>
            </div>    
        </van-popup> 

        <!-- 自己助力自己 -->
        <!-- <van-popup v-model="showMHelp">
            <div class="closeIcon"><i class="iconfont iconbaseline-close-px" @click="showMHelp = false" /></div>
            <div class="helpWrap">
                <div class="helpPerson">{{$t('activity.helpSuc')}}</div>
                <div class="content flexCenter">
                    <div class="inside">
                        <div class="con">{{$t('activity.conY')}}</div>
                        <div class="amount">{{shareOwnAmount}}<span>USDT</span></div>
                    </div>
                </div>
                <div class="btn flexCenter">
                    <span @click="showMHelp = false">{{$t('button.public.confirm')}}</span>
                </div>
            </div>
        </van-popup> -->

        <!-- 助力好友 -->
        <van-popup v-model="showHelp">
            <div class="closeIcon"><i class="iconfont iconbaseline-close-px" @click="onRufuse" /></div>
            <div :class="['helpWrap',vImg ? 'en' : '']">
                <div class="head">
                    <dl>
                        <dt><img :src="beAssistedUser.avatar" alt=""></dt>
                        <dd>{{beAssistedUser.username}}</dd> 
                    </dl>
                </div>
                <div class="toast">{{$t('activity.helpOther')}}</div>
                <div class="btn flexCenter">
                    <span @click="goHelp">{{$t('button.public.help')}}</span>
                </div>
            </div>
        </van-popup>

        <!-- 成功助力 -->
        <van-popup v-model="showSuc">
            <div class="closeIcon"><i class="iconfont iconbaseline-close-px" @click="onSuccess" /></div>
            <div :class="['helpWrap',vImg ? 'en' : '']">
                <div class="helpPerson">{{$t('activity.for')}}<span>{{beAssistedUser.username}}</span>{{$t('activity.helpSuc')}}</div>
                <div class="content flexCenter">
                    <div class="inside">
                        <div class="con">{{$t('activity.con')}}</div>
                        <div class="amount">{{$mkt.fmtZero(helpInfo.amount, coinList[0].scale)}}<span>USDT</span></div>
                    </div>
                </div>
                <div class="btn flexCenter">
                    <span @click="onSuccess">{{$t('button.public.confirm')}}</span>
                </div>
            </div>
        </van-popup>

        <!-- 助力成功领红包 -->
        <van-popup v-model="showOwn">
            <div class="activityContent nobg">
                <div class="redBox">
                    <div class="logo flexCenter"><img src="@/assets/img/r_logo.png" alt=""></div>
                    <div class="limit">{{$t('activity.limitAmount')}}</div>
                    <div :class="['toast',{en: vImg}]">{{$t('activity.congratulations')}}</div>
                    <div :class="['open','flexCenter',{en: vImg}]" @click="onOpen">{{$t('activity.open')}}</div>
                </div>
            </div>
        </van-popup>

        <!-- 提现成功  -->
        <van-popup v-model="showToast" @close="onClose">
            <div class="prizeModal">
                <h3>{{$t('activity.good')}}</h3>
                <p v-if="len > 0">{{$t('activity.getThirty')}}</p>
                <div class="btnBox flexLevel" @click="onClose">
                    <van-button size="large">{{$t('button.public.confirm')}}</van-button>
                </div>
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
                url: 'home',
                leftText: this.$t('activity.title'),
            },
            num: 0,
            cur: 0,
            tabs:[this.$t('activity.getRecord'),this.$t('activity.showList')],
            showRed: false,
            // showMHelp: false,
            showToast: false,
            showHelp: false,
            showSuc: false,
            showOwn: false,
            percent: 0, // 进度
            basicInfo:[],
            len: 0,
            userInfo:{}, // 当前用户
            shareId: '', 
            beAssistedUser:{}, // 被助力用户
            shareOwnAmount: '',
            page: 0,
            size: 10,
            recordList:[],
            payList:[],
            pFirst: [],
            pSecond:[],
            sum: 0,
            coinList:[{icon:''}],
            helpInfo:{}, // 助力信息
            submiting: false,
        }
    },
    components:{backbar},
    computed:{
        vStatus(){
            let that = this;
            if(that.basicInfo && that.len > 0){
                return that.percent == 100 ? that.$t('activity.canGet') + that.basicInfo[0].finishAmount + that.basicInfo[0].coinCode : that.$t('activity.stillNeed') + that.$mkt.fmtNum(that.basicInfo[0].finishAmount - this.basicInfo[0].currentAmount,4) + that.basicInfo[[0]].coinCode;
            }
        },
        vBtn(){
            return this.percent == 100 ? this.$t('user.index.withdrawal') : this.$t('activity.share');
        },
        vTime(){
            let that = this;
            if(that.basicInfo && that.len > 0){     
                let time = that.basicInfo[0].expireTime;
                return new Date(time).getTime() - new Date().getTime();
            }
        },
        vImg(){
            return localStorage.getItem('language') === 'en-US' ? true : false;
        },
        list(){
            return this.$store.state.app.vanList;
        },
        finished(){
            return this.$store.state.app.finished;
        }
    },
    beforeRouteLeave (to, from, next) {
        let that = this;
        clearInterval( that.interval);
        next();
    },
    beforeDestory(){
        let that = this;
        that.$mts.initPage();
        clearInterval( that.interval);
    },
	mounted(){
        let that = this;
        that.$mts.checkExpire('needback','redDetail',()=>{
            that.shareId = localStorage.getItem('shareId');
            if(that.shareId){ // 获取被助力用户信息
                localStorage.removeItem('inviteCode');
                that.showHelp = true;
                that.query();
                that.queryUserInfo();
            }else{
                that.initPage();
            } 
        });
    },
    watch:{
        
    },
	methods:{
        initPage(){
            let that = this;
            that.query();
            that.getCoins();
            that.getPaying();
            setTimeout(() => {
                that.refresh();
            },1000);
            that.interval = setInterval(()=>{
                that.page = 0;
                that.query();
            }, 15000);
        },
        calcDistance(){
            if(this.percent > 36 && this.percent < 100){
                let distance = (this.percent - 44) + 'vw';
                $('.progress .processToast').animate({left: distance});
            }
        },
        onWithdraw(){ // 提现
            let that = this;
            that.showRed = true;
        },
        onOWnClick(){
            let that = this;
            that.$mts.posts({
                url: 'api/activity/redPackHelp/share?id='+that.basicInfo[0].id,
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.shareOwnAmount = response.data.data.amount;
                    }
                }
            });
        },
        onShare(){
            let that = this;
            if(that.basicInfo[0].status == 'UNSHARE'){
                that.onOWnClick();
                that.$router.push('/shareImg');
            }else if('SHARED'){
                that.$router.push('/shareImg');
            }
        },
        getCoins(){ // 获取币种列表
            let that = this;
            that.$mts.posts({
                url: 'api/me/balance/info',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.coinList = response.data.data.balance.filter((item) => {return item.coinCode == 'USDT'});
                    }else{
                        that.$mts.toast(that.$t('message.public.dataError'));
                    }
                }
            });
        },
        query(){
            let that = this;
            that.$mts.posts({
                url: 'api/activity/redPackHelp/query',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.basicInfo = response.data.data;
                        that.len = that.basicInfo.length;
                        that.basicInfo[0].expireTime = that.basicInfo[0].expireTime.replace(/-/g,'/');
                        if(that.basicInfo && that.len > 0){
                            that.percent = Number(that.$mkt.fmtNum((that.basicInfo[0].currentAmount / that.basicInfo[0].finishAmount) * 100,0));
                            if(that.percent === 100 && that.basicInfo[0].status === "FINISHED"){
                                that.showRed = true;
                            }
                        }
                    }
                }
            });
        },
        queryUserInfo(){
            let that = this;
            that.$mts.posts({
                url: 'api/activity/redPackHelp/queryUserInfo',
                data:{
                    shareId: that.shareId
                },
                success(response){
                    if(response.data.status == 200){
                        if (response.data.data) {
                            that.beAssistedUser = response.data.data;
                        } else {
                            that.$mts.gourl('home');
                        }
                        localStorage.removeItem('shareId'); 
                    }
                }
            });
        },
        onClick(){
            let that = this;
            if(that.percent < 100){
                that.$router.push({name: 'shareImg'});
            }else{
                if(that.basicInfo[0].status === 'FINISHED'){
                    that.$mts.posts({
                        url: 'api/activity/redPackHelp/withdraw?shareId='+that.basicInfo[0].id,
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                that.showRed = false;
                                that.showToast = true;
                            }
                        }
                    });
                }
            }
        },
        onClose(){
            let that = this;
            that.showToast = false;
            that.$router.push({name:'home'});
        },
        onOpen(){
            let that = this;
            that.showOwn = false;
        },
        getRed(){ // 助力成功自己申请红包
            let that = this;
            that.$mts.posts({
                url: 'api/activity/redPackHelp/apply',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.query();
                    }
                }
            });
        },
        onRufuse(){
            let that = this;
            let date = new Date();
            that.showHelp = false;
            localStorage.removeItem('shareId');
            if(that.basicInfo && that.len > 0){ // 开过红包
                if(date > that.basicInfo[0].expireTime){
                    that.showOwn = true;
                    that.getRed();
                }else{
                    that.query()
                    that.$router.push({name: 'home'});
                }
            }else{ // 未开过红包
                that.showOwn = true;
                that.getRed();
            }
        },
        onSuccess(){
            let that = this;
            let date = new Date();
            that.showSuc = false;
            if(that.basicInfo && that.len > 0){ // 开过红包
                if(date > that.basicInfo[0].expireTime){
                    that.showOwn = true;
                    that.getRed();
                }else{
                    that.query()
                    that.$router.push({name: 'home'});
                }
            }else{ // 未开过红包
                that.showOwn = true;
                that.getRed();
            }
        },
        goHelp(){
            let that = this;
            let date = new Date();
            that.$mts.posts({ // 判断是否重复助力
                url:"api/activity/redPackHelp/judgeRepeat",
                data:{
                    shareId:that.shareId
                },
                success(response){
                    if(response.data.status == 200){
                        if(response.data.data){ // 已助力
                            that.$mts.toast(that.$t('activity.helped'));
                            that.showHelp = false;
                            localStorage.removeItem('shareId');
                            that.$router.push({name: 'home'});
                        }else{ // 未助力
                            that.$mts.posts({ 
                                url: 'api/activity/redPackHelp/help?id='+ that.shareId,
                                data:{},
                                success(response){
                                    if(response.data.status == 200){
                                        that.showHelp = false;
                                        that.showSuc = true;
                                        that.helpInfo = response.data.data;
                                        localStorage.removeItem('shareId'); // 助力成功删除shareId
                                    }
                                }
                            });
                        }
                    }
                }
            })
        },
        refresh(){
            this.$mts.initPage();
            this.$store.state.app.loading = true;
            this.page = 0;
            this.submiting = false;
            this.getRecords();
        },
        getRecords(){
            let that = this; 
            that.page++;
            if(!that.subminting){
                that.submiting = true;
                that.$mts.posts({
                    url: 'api/activity/redPackHelp/queryLogs?page='+that.page+'&size='+that.size+'&shareId=' + that.basicInfo[0].id,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.submiting = false;
                            let arr = response.data.data.filter((item) => {return item.type !== 'share'});
                            that.$mts.loading(arr,that.size);
                        }
                    }
                });
            }
        },
        getPaying(){
            let that = this; 
            that.$mts.posts({
                url: 'api/activity/redPackHelp/requestStage',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.payList = response.data.data;
                        that.sum = that.payList.sum;
                    }
                }
            });
        }
	}
}
</script>
