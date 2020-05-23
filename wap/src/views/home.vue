<template>
<div class="flexPage darkPage">
    <div class="flexContent">
        <div class="homePage">
            <div class="logo" v-if="isLogin">
                <img :src="$store.state.app.nightModel ? logo.white : logo.black" alt="logo">
            </div>
            <div v-if="!isLogin" class="logo noLogin"><img :src="$store.state.app.nightModel ? logo.white : logo.black" alt="logo"><span><router-link :to="{name:'signin'}">{{$t('form.signin.submit')}}</router-link><router-link class="ml3" :to="{name:'signup'}">{{$t('form.signup.submit')}}</router-link></span></div>
            <div class="indexSwipe">
                <van-swipe :autoplay="3000" indicator-color="white">
                    <van-swipe-item v-for="(item,index) of bannerVO" :key="index" @click="clickBanner(item)"><img :src="item.banner" alt=""></van-swipe-item>
                </van-swipe>
            </div>
            <div class="">
                <div class="noticeBarWrap" v-if="noticeVO.length>0">
                    <div class="noticeBar">
                        <van-notice-bar v-if="noticeVO[0]" v-for="(item,index) of noticeVO" :key="index" @click="$router.push({path:item.linkUrl})" :scrollable="true" :text="item.title" left-icon="volume" >
                            <!-- <i class="iconfont iconmessage" slot="left-icon"></i> -->
                        </van-notice-bar>
                    </div>
                </div>
                <div class="quotation">
                    <ul>
                        <li @click="$router.push({name:'secondContract',params:{symbol:item.symbol}})" v-for="(item,index) of sRanking" :key="index">
                            <div class="symbol">{{item.symbol.replace(/_/g,"/")}}</div>
                            <div class="price" :class="reClass(((item.cl- item.op )/item.cl*100).toFixed(2))">{{item.cl}}</div>
                            <div class="rate" :class="reClass(((item.cl- item.op )/item.cl*100).toFixed(2))">{{((item.cl- item.op )/item.cl*100).toFixed(2)}}%</div>
                            <div class="cny" v-html="sccuy(item)"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="Menus">
            <div class="indexMenus">
                <div class="gridBtn" @click="$mts.goto('notice')">
                    <i class="iconfont iconannouncement"></i>
                    <p>{{$t('home.i1')}}</p>
                </div>
                <div class="gridBtn" @click="$mts.goto('helpcenter')">
                    <i class="iconfont iconnoviceguidance"></i>
                    <p>{{$t('home.i2')}}</p>
                </div>
                <div class="gridBtn" @click="$mts.goto('secondContract',{symbol:'ETH_USDT'})">
                    <i class="iconfont iconmargin_selected"></i>
                    <p>{{$t('home.i3')}}</p>
                </div>
                <div class="gridBtn" @click="$mts.goto('otc')">
                    <i class="iconfont iconotc_home"></i>
                    <p>OTC</p>
                </div>
                <div class="gridBtn" v-if="!$store.state.isAPP" @click="$mts.goto('download')">
                    <!-- <icons name="arrow-down"/> -->
                    <i class="iconfont iconapp_download"></i>
                    <p>{{$t('home.i4')}}</p>
                </div>
                <div class="gridBtn" v-if="$store.state.isAPP" @click="$mts.goto('worklist')">
                    <i class="iconfont iconservice"></i>
                    <p>{{$t('home.i5')}}</p>
                </div>
            </div>
            <div class="ad">
                <span v-for="(item,index) of drawVO" :key="index" @click="$router.push({name:'turntable',params:{id:item.id}})"><img src=".././assets/img/ad.png"  v-if="$mts.getLangSm() == 'zh'" :alt="item.name"><img src=".././assets/img/ad_en.png"  v-if="$mts.getLangSm() != 'zh'" :alt="item.name"></span>
            </div>
        </div>
        <div class="secondMenus homeMenus">
            <div class="menusHeader">
                <ul class="tab">
                    <li v-for="(item,index) in tabs" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index)">{{item.title}}<span></span></li>
                </ul>
            </div>
            <div class="listTitle">
                <span>{{$t('home.l1')}}</span>
                <span>{{$t('home.l2')}}</span>
                <span>24H {{$t('home.l3')}}</span>
            </div>
            <div>
                <nodata v-if="!rankingVO||rankingVO.length==0"></nodata>
                <!-- 涨幅榜 -->
                <ul class="coinlist" v-show="typeActive==0">
                    <li v-for="(item,index) of rankingVO" :key="index" @click="$router.push({name:'tradeDetail',params:{symbol:item.symbol+'_'+item.market}})">
                        <div class="clleft">
                            <p><b>{{item.symbol}}</b><span class="op5">/{{item.market}}</span></p>
                            <p><span class="vol">24H {{$t('home.sl')}}</span><span v-html="$tdp.format(item, 'total')"></span></p>
                        </div>
                        <div class="clcenter">
                            <p><b v-html="$tdp.format(item, 'close')"></b></p>
                            <p><span class="cur" v-html="$tdp.format(item, 'money')"></span></p>
                        </div>
                        <div class="clright">
                            <span class="zdbtn" :class="getClass($tdp.format(item, 'changeRange'))" v-html="$tdp.format(item, 'changeRange')"></span>
                        </div>
                    </li>
                </ul>
                <!-- 跌幅榜 -->
                <ul class="coinlist" v-show="typeActive==1">    
                    <li v-for="(item,index) of rankingVO" :key="index" @click="$router.push({name:'tradeDetail',params:{symbol:item.symbol+'_'+item.market}})">
                        <div class="clleft">
                            <p><b>{{item.symbol}}</b><span class="op5">/{{item.market}}</span></p>
                            <p><span class="vol">24H {{$t('home.sl')}}</span><span v-html="$tdp.format(item, 'total')"></span></p>
                        </div>
                        <div class="clcenter">
                            <p><b v-html="$tdp.format(item, 'close')"></b></p>
                            <p><span class="cur" v-html="$tdp.format(item, 'money')"></span></p>
                        </div>
                        <div class="clright">
                            <span class="zdbtn" :class="getClass($tdp.format(item, 'changeRange'))" v-html="$tdp.format(item, 'changeRange')"></span>
                        </div>
                    </li>
                </ul>
                <!-- 新币榜 -->
                <ul class="coinlist" v-show="typeActive==2"> 
                    <li v-for="(item,index) of rankingVO" :key="index" @click="$router.push({name:'tradeDetail',params:{symbol:item.symbol+'-'+item.market}})">
                        <div class="clleft">
                            <p><b>{{item.symbol}}</b><span class="op5">/{{item.market}}</span></p>
                            <p><span class="vol">24H {{$t('home.sl')}}</span><span v-html="$tdp.format(item, 'total')"></span></p>
                        </div>
                        <div class="clcenter">
                            <p><b v-html="$tdp.format(item, 'close')"></b></p>
                            <p><span class="cur" v-html="$tdp.format(item, 'money')"></span></p>
                        </div>
                        <div class="clright">
                            <span class="zdbtn" :class="getClass($tdp.format(item, 'changeRange'))" v-html="$tdp.format(item, 'changeRange')"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <downbar/>
</div>
</template>
<script>
import downbar from "@/views/modules/downbar"
export default {
    data(){
        return {
            type:'rise',
            typeActive:0,
            tabs:[
                { title: this.$t('home.sm1'),active: 'active'},
                { title: this.$t('home.sm2'),active: '' },
                { title: this.$t('home.sm3'),active: ''},
            ],
            logo: { 
                white: require('.././assets/img/btbit-white.png'),
                black: require('.././assets/img/btbit-black.png') 
            },
            bannerVO:[
                // { banner: require('.././assets/img/1.png') },
                // { banner: require('.././assets/img/2.png') }
            ],
            noticeVO:[{title:''}],
            rankingVO:[],
            drawVO:[],
            polling:null,
            interval:null,
			sRanking:[],
			sRankingSize:0
        }
    },
    beforeRouteLeave (to, from, next) {
        clearInterval(this.interval);
		clearInterval(this.polling);
        next();
    },
    beforeDestroy(){
        // 清除定时器
        clearInterval(this.interval);
        clearInterval(this.polling);
    },
    components:{downbar},
    watch:{
        "noticeVO":function(cur,old){
            if(cur.length>1){
                clearInterval(this.interval)
                this.interval = setInterval(()=>{
                    var tp = "-40px";
                    if(parseInt($(".noticeBarWrap .noticeBar").css("top")) <= -40 * (cur.length - 1)){
                        tp = "0"
                    }
                    $(".noticeBar").animate({
                        top: tp,
                    },200, function() {
                        
                    });
                },5000)
            }else{
                clearInterval(this.interval)
            }
        }
    },
    computed:{
        isLogin(){
            return this.$store.state.isLogin;
        }
    },
    created(){
    },
    mounted(){
        // 验证登录
        this.$mts.checkLogin('clear');
        // 当前汇率
        this.pageInit();

        //如果是APP
        if(localStorage.getItem("isAPP")){
            this.$store.state.isAPP = true
        }else{
            this.$store.state.isAPP = false
        };
    },
    methods:{
        reClass(n){
            if(n>0){
                return 'buycolor'
            }else if(n<0){
                return 'sellcolor'
            }else{
                return ''
            }
        },
        getClass(num){
            if(num>0){
                return "green"
            }else if(num<0){
                return "red"
            }else{
                return "normal"
            }
        },
        pageInit(){
            this.banner()
            this.notice()
            this.ranking()
            this.draw()

            this.$mts.rates();
			this.secondsRanking();
            // 设置定时请求
            this.polling = setInterval(()=>{
                this.secondsRanking();
                this.ranking();
            }, 5000);
        },
        onChooseTab(index){
			this.typeActive = index;
			this.formatName(index)
        },
        banner(){
            var that = this;
            that.$mts.post({
                url:'banner',
                data:{
                },success(response){
                    if(response.data.code === 200){
                    that.bannerVO = response.data.data;
                    }
                }
            });
        },
        clickBanner(item){
            if(item.linkUrl && item.linkUrl!="javascript:void(0);" && item.linkUrl!="javascript:void(0)"){
                this.$router.push({path:item.linkUrl})
            }
        },
        notice(){
            var that = this;
            that.$mts.post({
                url:'notice',
                data:{
                },success(response){
                    if(response.data.code==200){
                        that.noticeVO = response.data.data;
                    }
                }
            });
        },
        formatName(typeActive){
            let that = this;
            switch(typeActive){
                //涨幅榜
                case 0:
                    that.type = 'rise';
                    break;
                //跌幅榜    
                case 1:
                    that.type = 'fall'; 
                    break;
                //新币榜
                case 2:
                    that.type =  'coin';
                    break;       
            }
            that.ranking();
        },
        ranking(){
            let that = this;
            let list = [];
            that.$mts.post({
                url:'quotation/ranking',
                data:{
                    limit:6,
                    type:that.type
                },success(response){
                    if(response.data.code==200){
                        let result = response.data.data
                        for(let idx = 0;idx < result.length;idx ++){
                            if(result[idx]){
                                list.push(result[idx])
                            }
                        }
                        that.rankingVO = list;
                    }
                }
            });
        },
        draw(){
            var that = this;
            let result = [];
            that.$mts.post({
                url:'draw',
                data:{
                },success(response){
                    if(response.data.code==200){
                        result = response.data.data;
                        for (var idx = 0; idx < result.length; idx ++) {
                            if(result[idx] && result[idx].isHome == 'Y'){
                                that.drawVO.push(result[idx])
                            }
                        }
                    }
                }
            });
        },
		secondsRanking(){
			var that = this;
			that.$mts.post({
			    url:'second',
			    data:{
			    },success(response){
			        if(response.data.code==200){
			            that.sRanking = response.data.data;
						if(!that.sRanking){
							that.sRankingSize = that.sRanking.length
						}
			        }
			    }
			});
		},
		sccuy(item){
			let market = item.symbol.split("_")[1];
			// let c = this.$tdp.getCurrency(market); // 当前汇率
            // if (c) {
            //     return '≈ ' + c.symbol 
            //     + ' '+ Number(c.last * item['cl']).toFixed(2);
            // } else {
            //     return'≈ ' + _vm.$store.state.rate + ' 0.00';
            // }
            return this.$tdp.money(item['close'], market)
		}
    }
}
</script>

