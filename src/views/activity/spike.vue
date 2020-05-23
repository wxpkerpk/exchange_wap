<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" class="normal" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="spikeWrapper">
                <div class="spikeBox">
                    <div :class="['spikeTop',{en:vImg}]">
                        <div class="countdown flexLevel">
                            <span :class="{en:vImg}">{{$t('activity.happy')}}</span>
                        </div>
                        <div class="menus">
                            <ul>
                                <li v-for="(item,index) in tabs" :key="index" :class="{active: cur == index}" @click="onChange(index)">{{item}}</li>
                            </ul>
                        </div>
                    </div>
                    <!-- <loading v-if="submiting"/> -->
                    <div class="spikeList">
                            <ul v-if="cur == 0">
                                <p class="noRecord flexCenter white spike" v-if="!pending || pending.length == 0">
                                    <img src="@/assets/img/spike_nodata.png" alt="">
                                    <span>{{$t('list.nodata')}}</span>    
                                </p>
                                <li v-for="(item,index) in pending" :key="index">
                                    <div class="coinWrapper">
                                        <div class="coindetail flexLevel">
                                            <div class="lt"><img :src="$mkt.vCnField(item,'titleImage')" alt=""></div>
                                            <div class="rt">
                                                <h3>{{$mkt.vCnField(item,'title')}}</h3>
                                                <div class="center">
                                                    <van-progress
                                                        color="#E02020"
                                                        :percentage="Number($mkt.fmtZero((item.totalNumber - item.remindNumber)/item.buyMaxAmount,0))"
                                                        stroke-width="8px"
                                                        :show-pivot="false"
                                                    />
                                                    <span>{{Number($mkt.fmtNum((item.totalNumber - item.remindNumber)/item.buyMaxAmount,0)) + $t('activity.people')}}</span>
                                                </div>
                                                <div class="bottom flexLevel">
                                                    <div class="blt">
                                                        <div class="salePrice">{{item.price}}<span>{{item.symbol}}</span></div>
                                                        <span class="oldPrice">{{$t('activity.oldPrice')+item.primePrice+' '+item.symbol}}</span>
                                                    </div>
                                                    <div class="brt">
                                                        <van-button class="flexCenter red" @click="goSpike(item.id)"><img src="@/assets/img/hot.png" alt="">{{$t('activity.rightBuy')}}</van-button>
                                                        <span><van-count-down :time="vTime(item.endTime)" />{{$t('activity.toEnd')}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul v-if="cur == 1">
                                <p class="noRecord flexCenter white spike" v-if="!unStart || unStart.length == 0">
                                    <img src="@/assets/img/spike_nodata.png" alt="">
                                    <span>{{$t('list.nodata')}}</span>    
                                </p>
                                <li v-for="(item,index) in unStart" :key="index">
                                    <div class="coinWrapper">
                                        <div class="coindetail">
                                            <div class="lt"><img :src="$mkt.vCnField(item,'titleImage')" alt=""></div>
                                            <div class="rt">
                                                <h3>{{$mkt.vCnField(item,'title')}}</h3>
                                                <div class="block">
                                                    {{$t('activity.limit')+item.totalNumber+$t('activity.bout')}}
                                                    <span>|</span>
                                                    {{item.startTime.slice(5,-3) + $t('activity.toStart')}}
                                                </div>
                                                <div class="bottom flexLevel">
                                                    <div class="blt">
                                                        <div class="salePrice">{{item.price}}<span>{{item.symbol}}</span></div>
                                                        <span class="oldPrice">{{$t('activity.oldPrice')+item.primePrice+' '+item.symbol}}</span>
                                                    </div>
                                                    <div class="brt">
                                                        <van-button class="flexCenter gray" @click="$mts.toast($t('activity.spikeUnStarted'))">{{$t('activity.toastMe')}}</van-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul v-if="cur == 2">
                                <p class="noRecord flexCenter white spike" v-if="!finish || finish.length == 0">
                                    <img src="@/assets/img/spike_nodata.png" alt="">
                                    <span>{{$t('list.nodata')}}</span>    
                                </p>
                                <li v-for="(item,index) in finish" :key="index">
                                    <div class="coinWrapper">
                                        <div class="coindetail flexLevel">
                                            <div class="lt"><img :src="$mkt.vCnField(item,'titleImage')" alt=""></div>
                                            <div class="rt">
                                                <h3>{{$mkt.vCnField(item,'title')}}</h3>
                                                <div class="block">
                                                    {{$mkt.fmtZero((item.totalNumber - item.remindNumber)/item.buyMaxAmount,0) + $t('activity.people')}}
                                                    <span>|</span>
                                                    {{item.endTime.slice(5,-3) + $t('activity.toEnd')}}
                                                </div>
                                                <div class="bottom flexLevel">
                                                    <div class="blt">
                                                        <div class="salePrice">{{item.price}}<span>{{item.symbol}}</span></div>
                                                        <span class="oldPrice">{{$t('activity.oldPrice')+item.primePrice+' '+item.symbol}}</span>
                                                    </div>
                                                    <div class="brt">
                                                        <van-button class="flexCenter gray" @click="$mts.toast($t('activity.spikeFinished'))">{{$t('activity.finished')}}</van-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="spikeRules">
                            <div class="title flexCenter">
                                <!-- <img src="@/assets/img/s_dots.png" alt=""> -->
                                <!-- <span>{{$t('activity.rules')}}</span>
                                <img src="@/assets/img/s_dots.png" alt=""> -->
                            </div>
                            <!-- <div class="content" v-html="$t('activity.s1')"></div> -->
                        </div>
                </div>
            </div>
        </div>   

        <!-- 提示去设置PIN -->
        <van-popup v-model="showSet" class="showMore">
            <div class="goModal">
                <h3>{{$t('message.public.systemTitle')}}</h3>
                <p>{{$t('message.safe.noFund')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showSet = false">{{$t('button.public.know')}}</span>
                    <span class="btn2" @click="$router.push({name: 'changeFundPsw'})">{{$t('button.user.setting')}}</span>
                </div>
            </div>
        </van-popup>

        <!-- 提示去充值弹窗 -->
        <van-popup v-model="showToast" class="showMore">
            <div class="goModal">
                <h3>{{$t('activity.buyFail')}}</h3>
                <p>{{$t('activity.noMoney')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showToast = false">{{$t('button.public.know')}}</span>
                    <span class="btn2" @click="$router.push({name: 'deposit'})">{{$t('button.public.recharge')}}</span>
                </div>
            </div>
        </van-popup>
        <!-- 购买弹窗 -->
        <van-popup v-model="showBuy" position="bottom" class="showMore">
            <div class="tradeModal" v-for="(item,index) in nowBuy" :key="index">
                <div class="title flexLevel">
                    <span>{{$t('activity.spike')}}</span>
                    <i class="iconfont iconbaseline-close-px" @click="showBuy = false" />
                </div>
                <dl class="flexLevel">
                    <dt><img :src="$mkt.vCnField(item,'titleImage')" alt=""></dt>
                    <dd>
                        <b>{{$mkt.vCnField(item,'title')}}</b>
                        <span>{{item.price + ' ' + item.symbol}}</span>
                    </dd>
                </dl>
                <div class="inputBox">
                    <van-field :class="{en:vImg}" :label="$t('activity.buyPrice')" v-model="form.price" :disabled="true" class="red" />
                    <van-field :class="{en:vImg}" :label="$t('activity.buyNum')" :value="form.number +' ' + item.id" :disabled="true" class="red" />
                    <van-field :class="{en:vImg}" :label="$t('trade.sumPrice')" v-model="form.total" :disabled="true" class="red" />
                    <van-field :class="{en:vImg}" type="password" :label="$t('activity.fundPsw')" v-model="form.fundPsw" :placeholder="$t('validate.withdrawal.t3')" clearable/>
                </div>
                <div class="btn">
                    <span @click="onConfirm">{{$t('button.public.confirmBuy')}}</span>
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
                leftText: this.$t('activity.spike'),
                rightText:this.$t('activity.mySpike'),
                path:'mySpike',
            },
            cur: 0,
            tabs: [this.$t('activity.nowBuy'),this.$t('activity.nowStart'),this.$t('activity.finished')],
            showToast: false,
            showBuy:false,
            showSet: false,
            form:{
                submiting: false,
                price: '',
                number:'',
                total:'',
                fundPsw:''
            },
            status: '',
            sum: [],
            unStart:[],
            pending:[],
            finish:[],
            nowBuy:[], // 当前购买
            interval: null,
            submiting: false,
        }
    },
    components:{backbar},
    computed:{
        isLogin(){
            return this.$store.state.isLogin;
        },
        vImg(){
            return localStorage.getItem('language') === 'en-US' ? true : false;
        },
    },
	mounted(){
        let that = this;
        that.$mts.checkExpire('clear', true, ()=>{
            that.ininPage();
        });
    },
    beforeRouteLeave (to, from, next) {
        let that = this;
        clearInterval(that.interval);
        next();
    },
    beforeDestory(){
        let that = this;
        clearInterval(that.interval);
    },
    watch:{
        
    },
	methods:{
        ininPage(){
            this.getChase();
        },
        onChange(index){
            let that = this;
            that.cur = index;
        },
        goSpike(id){
            let that = this;
            if (that.isLogin) {
                let flag = JSON.parse(localStorage.getItem('setFundPsw'));
                if (flag) {
                    that.showBuy = true;
                    that.nowBuy = that.pending.filter((item) => {return item.id === id});
                    that.form.price = that.nowBuy[0].price + ' ' + that.nowBuy[0].symbol;
                    that.form.number = that.nowBuy[0].buyMaxAmount;
                    that.form.total = (that.nowBuy[0].price * that.nowBuy[0].buyMaxAmount) + ' ' + that.nowBuy[0].symbol;
                } else {
                    that.showSet = true;
                }  
            } else {
                that.$mts.signout('needback','spike');
            }
        },
        vTime(endTime){
            return new Date(endTime.replace(/-/g,'/')).getTime() - new Date().getTime();
        },
        getChase(){
            let that = this;
            let date = new Date()
            if(!that.submiting){
                that.submiting = true;
                that.$mts.posts({
                    url:'api/activity/labsApply/query?status='+that.status,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.submiting = false;
                            that.sum = response.data.data.filter((item) => {
                                item.startTime = item.startTime.replace(/-/g,'/');
                                item.endTime = item.startTime.replace(/-/g,'/');
                                return item.rush === 1});
                            that.unStart = that.sum.filter((item) => {return new Date(item.startTime) >  date});
                            that.pending = that.sum.filter((item) => {
                                return new Date(item.startTime) <=  date && new Date(item.endTime) >=  date && item.remindNumber > 0
                            });
                            that.finish = that.sum.filter((item) => {return new Date(item.endTime ) <  date || item.remindNumber == 0});
                            // 定时器获取秒杀情况
                            if(that.pending && that.pending.length > 0){
                                that.interval = setInterval(()=>{
                                    that.getChase();
                                }, 10000);
                            }
                        }
                    }
                })
            }
        },
        onConfirm(){
            let that = this;
            if(that.form.fundPsw == ''){
                that.$mts.toast(that.$t('message.withdrawal.fundPswEmpty'));
                return;
            }else{
                let flag = JSON.parse(localStorage.getItem('setFundPsw'));
                if(flag){ // 已设置资金密码
                    that.$mts.posts({
                        url:'api/activity/labsApply/apply',
                        data:{
                            number: that.nowBuy[0].buyMaxAmount,
                            dudect: 0,
                            pin: that.form.fundPsw,
                            labsProjectId: that.nowBuy[0].id
                        },
                        success(response){
                            if(response.data.status == 200){
                                that.form.submiting = false;
                                that.showBuy = false;
                                that.$mts.toast(that.$t('message.purchase.spikeSuc'));
                            }else if(response.data.status == 700){
                                that.$mts.toast(that.$t('endNotice.spike.noRange'));
                            }else if(response.data.status == 800){
                                that.$mts.toast(that.$t('endNotice.spike.noMoney'));
                            }else if(response.data.status == 990){
                                that.$mts.toast(that.$t('endNotice.spike.timeExpired'));
                            }else if(response.data.status == 604){
                                that.$mts.toast(that.$t('endNotice.spike.noNumber'));
                            }else if(response.data.status == 40002){
                                that.$mts.toast(that.$t('endNotice.spike.fundPswError'));
                            }
                        }
                    })
                }else{
                    that.$mts.toast(that.$t('message.safe.noFund'));
                    that.$router.push({path:'/changeFundPsw',query:{path: '/spike'}});
                }
            }
        }
	}
}
</script>
