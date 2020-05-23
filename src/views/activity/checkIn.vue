<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" class="normal" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="checkWrapper">
                <div class="calendar">
                    <div class="total">{{$t('purchase.checkInDay',{total:total})}}</div>
                    <div class="record">
                        <dl>
                            <dd v-for="(item,index) in day" :key="index">
                                <span :class="item.isSelected == 1 ? 'checked' : (item.isSelected == 2 ? '' : 'uncheck')">{{index + 1}}</span>
                            </dd>
                        </dl>
                        <div class="btn">
                            <span @click="onCheckIn" :class="btnStatus ? 'not' : ''">{{vBtn}}</span>
                        </div>
                    </div>
                </div>
                <div class="checkRules">
                    <div class="title flexCenter">
                        <img src="@/assets/img/s_dots.png" alt="">
                        <span>{{$t('activity.checkRules')}}</span>
                        <img src="@/assets/img/s_dots.png" alt="">
                    </div>
                    <div class="content" v-html="$t('activity.c1')"></div>
                </div>
            </div>
        </div> 

        <!-- 提示签到成功 -->
        <van-popup v-model="showToast">
            <!-- <div class="closeIcon" @click="showToast = false"><i class="iconfont iconbaseline-close-px" /></div> -->
            <div class="checkModal">
                <div class="icon flexCenter"><img src="@/assets/img/130x130.png" alt=""></div>
                <p class="amount">
                    <b>{{$t('activity.checkSuc')}}</b>
                    <span v-if="amount">{{$t('activity.priceFreed',{amount:amount+coinCode})}}</span>
                    <span v-if="!amount">{{$t('activity.noPrice')}}</span>
                </p>
                <div class="btn flexLevel">
                    <span class="big" @click="showToast = false" v-if="amount">{{$t('button.public.confirm')}}</span>
                    <span class="confirm" @click="showToast = false" v-if="!amount">{{$t('button.public.confirm')}}</span>
                    <span class="more" @click="getMore" v-if="!amount">{{$t('button.public.toGet')}}</span>
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
                leftText: this.$t('activity.checkIn'),
            },
            btnStatus: false,
            showToast: false,
            day: [],
            nowday: '', // 今天签到时间
            lastDay:'', // 昨天签到时间
            nowMonthDay: [],
            total: 0,
            amount: 0,
            coinCode: 'USDT',
            prize:'',
        }
    },
    components:{backbar},
    computed:{
        vBtn(){
            return this.btnStatus == true ? this.$t('button.public.checked') : this.$t('button.public.checkIn');
        },
    },
	mounted(){
        this.initPage();
    },
    watch:{
        
    },
	methods:{
        initPage(){
            let that = this;
            that.$mts.checkExpire('clear', true,()=>{
                that.getDays();
                if (that.$store.state.isLogin) {
                    that.getCheckIn();
                } else {
                    that.btnStatus = false;
                }
            });
        },
        onCheckIn(){
            let that = this;
            if (that.btnStatus) {
                that.$mts.toast(that.$t('activity.checkInToast'));
                return;
            }
            if (that.$store.state.isLogin) {
                that.$mts.posts({
                    url:'api/activity/signin/sign',
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.btnStatus = true;
                            that.showToast = true;
                            that.amount = response.data.data.amount;
                            that.getCheckIn();
                        }else if(response.data.status == 900){
                            that.$mts.toast(that.$t('activity.checkInToast'));
                        }
                    }
                });
            } else {
                that.$mts.signout('needback', 'checkIn');
            }
        },
        getDays(){ // 获取当月天数
            let that = this;
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let times = new Date(year,month,0).getDate()
            let arr = [];
            for(var i= 0; i < times; i++){
                arr.push(i+1);
            }
            that.day = arr.map(item => {
                return {...item,isSelected:2}
            });
            // 未签到，今天之前（0） 签到，今天（1） 未签到，今天之后（2）
        },
        getCheckIn(){ // 获取当月签到记录
            let that = this;
            let date = new Date();
            let month = date.getMonth()+1;
            let nowday = new Date().getDate();
            that.$mts.posts({
                url:'api/activity/signin/query?page=1&size=31',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        that.nowMonthDay = response.data.data.filter((item) => {return item.createTime.split('-')[1] == month});
                        that.total = that.nowMonthDay.length; // 总签到数
                        that.coinCode = that.nowMonthDay.length > 0  ? that.nowMonthDay[0].coinCode : 'USDT';
                        that.lastDay = that.nowMonthDay.length > 0 ? new Date(that.nowMonthDay[0].createTime.replace(/-/g,'/')).getDate() : nowday - 1;
                        if(that.nowMonthDay.length > 0){
                            if(nowday == that.lastDay){
                                that.btnStatus = true;
                            }else{
                                that.btnStatus = false;
                            }
                        }
                        that.calcCheckIn();
                    }
                }
            });
        },
        calcCheckIn(){ // 计算实际签到天数
            let that =this;
            let date = new Date();
            let nowDate = date.getDate();
            let newArr = [];
            for(var i = 0; i < that.nowMonthDay.length; i++){
                newArr.push(Number(that.nowMonthDay[i].createTime.split('-')[2].slice(0,2)))
            }
            if(!that.btnStatus){ // 是否已经完成本日签到
                nowDate -= 1;
            }
            for(var j = 0; j < nowDate; j++){
                that.day[j].isSelected = 0;
                for(var k = 0; k < newArr.length; k++){
                    if(j+1 == newArr[k]){
                        that.day[j].isSelected = 1;
                    }
                }
            }
        },
        getMore(){
            this.$router.push({name: 'bonus'});
            this.showToast = false;
        }
	}
}
</script>
