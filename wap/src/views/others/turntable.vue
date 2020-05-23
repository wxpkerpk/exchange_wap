<template>
	<div class="flexPage">
        <div class="flexContent">
            <div class="turnWrapper">
                <div class="currencyHead tTHead">
                    <navbar :params="pageInfo" />   
                </div>
                <div class="turnHead">
                    <img v-if="$mts.getLangSm() == 'zh'" src="../../assets/img/turnTitle.png" alt="">
                    <img v-if="$mts.getLangSm() != 'zh'" src="../../assets/img/turnTitle_en.png" alt="">
                    <div class="messageBoxWrap">
                        <div class="messageBoxContent">
                            <div class="messageBox flexBothSidesVertical" v-for="(item,index) of logList" :key="index">
                                <p class="flexSpindle"><van-icon name="volume"></van-icon><span>{{item[0]}}</span></p>
                                <b>{{Number(item[1]).toFixed(0)}} {{item[2]}}</b>
                                <span>{{item[3]}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- turnTableWrapper背景需要切换，达到闪烁效果 -->
                <div class="turnTableWrapper">
                    <div class="turnTable">
                        <ul>
                            <!--  -->
                            <li class="flexSpindle" v-for="(item,index) of drawVO.prize" :key="index" :class="{active:cur== index}">
                                <div v-if="item.words == $t('home.turntable.thanks')">
                                    <h3 class="thankJoin" v-html="$t('home.turntable.thankJoin')"></h3>
                                </div>

                                <div v-else>
                                    <h3>{{item.num}}</h3>
                                    <span>{{item.symbol}}{{index}}</span>
                                </div>
                            </li>
                        </ul>
                        <span class="startBtn flexSpindle active" v-html="$t('home.turntable.start')" @click="prize()"></span>
                    </div>
                </div>
                <div class="chooseNum">
                    <p>
                        {{$t('home.turntable.your')}}<b>{{num}}</b>{{$t('home.turntable.yourtimes')}}
                    </p>
                    <span class="flexSpindle" @click="$router.push({name:'myprize',params:{id:drawId}})">{{$t('home.turntable.myprize')}}</span>
                </div>
                <div class="turnContent">
                    <div class="contentTop">
                        <h2>{{$t('home.turntable.gettimes')}}</h2>
                        <div class="getlotteryNums flexBothSidesVertical">
                            <dl>
                                <dt>{{$t('home.i3')}}</dt>
                                <dd v-html="$t('home.turntable.h1')"></dd>
                            </dl>
                            <span>{{contractVO}} / {{drawVO.contractNum}}</span>
                            <span class="flexSpindle" @click="$mts.goto('secondContract',{symbol:'BTC_USDT'})" v-html="$t('home.turntable.o1')"></span>
                        </div>
                        <div class="getlotteryNums flexBothSidesVertical">
                            <dl>
                                <dt>{{$t('home.turntable.recommend')}}</dt>
                                <dd v-html="$t('home.turntable.h2')"></dd>
                            </dl>
                            <span>{{kycVO}} / {{drawVO.kycNum}}</span>
                            <span class="flexSpindle" @click="$mts.goto('invite')" v-html="$t('home.turntable.o2')"></span>
                        </div>
                    </div>
                    <div class="contentMiddle">
                        <h2>{{$t('home.turntable.rules')}}</h2>
                        <div class="activityInfo" v-html="$t('home.turntable.s1')"></div>
                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model="prizeVO.own" class="prizePopup" :overlay-style="{opacity: 0.6}" >
            <div class="prizeBox" v-if="prizeVO.prize == 'Y'">
                <p class='prizeTitle'>{{$t('home.turntable.popup.congratulations')}}</p>  
                <h2 :class="{en: isEn}">{{prizeVO.bullet[0][1]}} {{prizeVO.bullet[0][2]}}</h2>
                <p>{{$t('home.turntable.popup.i1')}}</p>
                <van-button type="default" size="large" @click="prizeVO.own = false">{{$t('home.turntable.popup.know')}}</van-button>
            </div>
            <div class="prizeBox" v-else>
                <p class='prizeTitle'>{{$t('home.turntable.popup.unfortunately')}}</p>  
                <h2 :class="{en: isEn}">{{$t('home.turntable.popup.i2')}}</h2>
                <p class="mt5">{{$t('home.turntable.popup.i3')}}</p>
                <van-button type="default" size="large" @click="prizeVO.own = false">{{$t('home.turntable.popup.know')}}</van-button>
            </div>
        </van-popup>
	</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default{
	data(){
		return {
			pageInfo: {
                title: this.$t('home.turntable.lucky'),
                url: '/winlist/' + this.$route.params.id,
                value: this.$t('home.turntable.winlist'),
                navbarStyle: 'darkTTable'
            },
            popup:{
                show: false,
            },
            type: this.$t('home.turntable.thanks'),
            cur: 6, // 转盘起点
            drawVO:{},
            detail:{},
            kycVO:0,  //kyc 次数
            contractVO:0,  //秒合约次数
            num:0, //抽奖次数
            logList:[],
            params:{},
            roll:null,
            activeIndex: 0,
            websocket:null,
            heartbeat: null,
            prizeVO:{

            },
            effect:false,
            interval: null,
            zIndex:[6, 5, 3 , 0, 1, 2,4 , 7],
            position:{},
            roulette: 0,
            leng:0,
            polling:null,
            running:false,
            interval:null
		}
    },
    components:{navbar},
    watch:{
        // "noticeVO":function(cur,old){
        //     if(cur.length>1){
        //         clearInterval(this.interval)
        //         this.interval = setInterval(()=>{
        //             var tp = "-26px";
        //             if(parseInt($(".messageBoxWrap .messageBoxContent").css("top")) <= -26 * (cur.length - 1)){
        //                 tp = "0"
        //             }
        //             $(".messageBoxContent").animate({
        //                 top: tp,
        //             },200, function() {
                        
        //             });
        //         },5000)
        //     }else{
        //         clearInterval(this.interval)
        //     }
        // },
        "effect":function(cur, old){
            let that = this;
            if (cur) {
                that.interval = setInterval(()=>{
                    if ( that.roulette < 7) {
                        that.roulette ++;
                    } else {
                        that.roulette = 0;
                    }
                    that.cur = that.zIndex[that.roulette];
                },150);
            } else {
                that.cur = that.position[ that.prizeVO.number] - 1;
                clearInterval(that.interval)
            }
        },
    },
    computed:{
        drawId(){
            return this.$route.params.id;
        },
        top(){
            return - this.activeIndex * 26 + 'px';
        },
        isEn(){
            return localStorage.getItem('language') == 'en-US' ? true : false;
        }
    },

    beforeRouteLeave (to, from, next) {
        let that = this;
        clearInterval(that.roll);
        clearInterval(that.polling);
        clearInterval(that.interval);
        next();
    },
    beforeDestory(){
        clearInterval(this.roll);
        clearInterval(this.polling);
        clearInterval(this.interval);
    },
	mounted(){
        let that = this;
        that.params = this.$route.params;
        that.pageInit();
        // 滚动数据
        that.roll = setInterval(()=>{
            if(that.leng > 9){
                that.leng = 9;
            }
            if ( that.activeIndex < that.leng) {
                that.activeIndex ++;
            } else {
                that.activeIndex = 0;
            }
            $(".messageBoxContent").animate({
                top: that.top,
            },200, function() {
                
            });
        }, 5000);

	},
	methods:{
        pageInit(){
            this.draw();
            this.interval = setInterval(()=>{
                this.list();
            }, 10000)
            this.$mts.checkLogin('clear',()=>{
                if (this.$store.state.isLogin){
                    this.details();
                }
            });
        },
        onmessage(ws){
            let that = this;
            if(ws){
                if (ws.bullet && ws.bullet.length >= 0) {
                    if ( ws.bullet.length == 1 || ws.bullet.length == 0) { 
                        if (ws.own) {
                            let isOwn = ws.own;
                            ws.own = false;
                            that.prizeVO = ws;

                            setTimeout(()=>{
                                that.prizeVO.own = isOwn;
                                that.details();
                                that.effect = false;
                                that.running = false;

                                let list = that.logList.concat( ws.bullet);

                                if ( list.length > 9) {
                                    list.splice(0, 1);
                                }
                                that.logList = list;
                                that.leng = ws.bullet.length;

                            }, 3000);
                        } else {
                            let list = that.logList.concat( ws.bullet);
                            if ( list.length > 9) {
                                list.splice(0, 1);
                            }
                            that.logList = list;
                            that.leng = ws.bullet.length;
                        }
                    } else {
                        that.logList = ws.bullet;
                    }
                }
            }
        },
        //奖项
        draw(){
            var that = this;
            that.$mts.post({
                url:'draw/' + this.$route.params.id,
                data:{
                },success(response){
                    if (response.data.code==200) {
                        that.drawVO = response.data.data;
                        for (let idx = 0;idx < that.drawVO.prize.length;idx ++) {
                            that.position[that.drawVO.prize[idx].prize]
                             = that.drawVO.prize[idx].position;
                        }
                        that.list();
                    }
                }
            });
        },
        //用户抽奖次数统计
        details(){
            let that = this;
            //登录后才能获取抽奖次数
            that.$mts.post({
                url:'draw/info',
                data:{
                    id: that.params.id,
                },success(response){
                    if (response.data.code==200) {
                        if(response.data.data){
                            that.num = response.data.data.num;
                            that.kycVO = response.data.data.kyc;
                            that.contractVO = response.data.data.contract;
                        }
                    }
                }
            });
        },
        list(){
            let that = this;
            that.$mts.post({
                url:'draw/history',
                data:{
                    drawId: that.drawVO.id
                },
                success(response){
                    if (response.data.code==200) {
                        that.onmessage(response.data.data);
                    }
                }
            });
        },
        //抽奖
        prize(){
            var that = this;
            if(that.running){
                return;
            }
            if (!that.$store.state.isLogin) {
                that.$router.push({name:"signin"});
            } else {
                if(that.num <= 0){
                    that.$toast(that.$t('home.turntable.notimes')) 
                }else{
                    that.running = true;
                    if (!that.effect) {
                        that.effect = true;
                        that.$mts.post({
                            url:'draw/prize',
                            data:{
                                id:this.$route.params.id
                            },success(response){
                                if (response.data.code == 200) {
                                    that.onmessage(response.data.data);
                                    // setTimeout(()=>{
                                    //     that.effect = false;
                                    // }, 4000);
                                    that.details();
                                }
                            }
                        });
                    }
                } 
            } 
        },
	}
}
</script>

