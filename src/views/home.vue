<template>  
    <div class="flexPage" v-cloak>
        <div class="flexHead homeFlexHead">
            <!-- <div class="homeHead">
                <div class="logo">
                    <img src="@/assets/svg/logo_title.svg" alt=""/>
                </div>
                <div class="avatar" @click="goUrl('user')">
                    <img v-if="isLogin" :src="!headImg ? defaultAvatar : headImg" alt="">
                    <img v-else :src="defaultAvatar" alt="">
                </div>
            </div> -->
            <div class="swiper">
                <swiper
                    :options="swiperOption"
                    ref="mySwiper"
                >
                    <swiper-slide
                        v-for="(item,index) of bannerVO"
                        :key="index"
                    >
                        <img
                            :src="item.banner"
                            alt=""
                            @click="clickBanner(item.url)"
                        >
                    </swiper-slide>
                    <div class="swiper-pagination"  slot="pagination"></div>
                </swiper>
            </div>
            <div class="noticeBar">
                <span><i class="iconfont icontongzhi" /></span>
                <van-swipe :autoplay="5000" :vertical="true" :show-indicators="false">
                    <van-swipe-item v-for="(item,index) of noticeV0" :key="index" @click="$router.push({ name: 'announcementDetail', params: { item } })">{{item.title}}</van-swipe-item>
                </van-swipe>
            </div>
        </div>
        <div class="homeContent">
            <div class="moreFeatures">
                <dl v-for="(item,index) in features" :key="index" @click="goPath(item.name)">
                    <dt><img :src="item.icon" alt=""></dt>
                    <dd>{{item.title}}</dd>
                </dl>
            </div>
        </div>
        <div class="node">
            <div class="hexagon-box">
                <div class="hex-border" v-if="showHex == 1">
                    <div class="hexagons">
                        <div class="hexagon"></div>
                        <div class="hexagon"></div>
                        <div class="hexagon"></div>
                        <div class="hexagon"></div>
                        <div class="hexagon"></div>
                        <div class="hexagon"></div>
                        <div class="hexagon"></div>
                    </div>
                </div>
            </div>
            <div class="data">
                <span>全网算力：{{ currentPower }}MH/s</span>
                <span>全网产出：{{ currentProduce }}</span>
            </div>
        </div>
        <div class="secondMenus bpd">
            <ul>
                <li v-for="(item,index) in tabs" :key="index" :class="{active:cur == index}" @click="onChangeTab(index)">{{item}}</li>
            </ul>
        </div>
        <div class="flexContent flexContentHome">
            <div class="flexContentContainer">
                <div class="homeWrapper" >
                    <div class="homeList">
                        <div class="pairList">
                            <dl class="pairHead">
                                <dd>
                                    {{$t('table.coin')}}
                                    <div class="sort">
                                        <span class="rise"></span>
                                        <span class="fall"></span>
                                    </div>   
                                </dd>
                                <dd>{{ $t('table.volume') }}</dd>
                                <dd>{{$t('table.price')}}</dd>
                                <dd>{{$t('table.change')}}
                                    <div class="sort">
                                        <span class="rise"></span>
                                        <span class="fall"></span>
                                    </div>
                                </dd>
                            </dl>
                            <!-- <loading v-if="submiting" /> -->
                            <nodata v-if="rankList.length == 0 || !rankList" />
                            <div
                                v-else
                                class="pairListItem"
                            >
                                <ul v-if="cur == 0">
                                    <li v-for="(item,index) in rankList" :key="index" @click="$router.push({path: '/tradedetail',query:{pair: item.pair,back:'home'}})">
                                        <dl class="pairContent">
                                            <dd class="coinIcon"><img :src="item.icon" alt=""></dd>
                                            <dd class="volume">
                                                <p><b>{{item.pair.split('_')[0]}}</b><span>/{{item.pair.split('_')[1]}}</span></p>
                                                <span>{{changeVol(item.vol, item.pair)}}</span>
                                            </dd>
                                            <dd class="price">
                                                <b>{{$mkt.fmtNum(item.price,$mkt.getScale($store.state.app.pairs, item.pair, true))}}</b>
                                                <span>{{$mkt.vMoney(item.worth)}}</span>
                                            </dd>
                                            <dd class="change">
                                                <van-button :class="[$mkt.vColor(item.gain_24)]">{{$mkt.format(item,item.gain_24)}}</van-button>
                                            </dd>
                                        </dl>
                                    </li>
                                </ul>
                                <ul v-if="cur == 1">
                                    <li v-for="(item,index) in rankList" :key="index" @click="$router.push({path: '/tradedetail',query:{pair: item.pair,back:'home'}})">
                                        <dl class="pairContent">
                                            <dd class="coinIcon"><img :src="item.icon" alt=""></dd>
                                            <dd class="volume">
                                                <p><b>{{item.pair.split('_')[0]}}</b><span>/{{item.pair.split('_')[1]}}</span></p>
                                                <span>{{changeVol(item.vol)}}</span>
                                            </dd>
                                            <dd class="price">
                                                <b>{{$mkt.fmtNum(item.price,$mkt.getScale($store.state.app.pairs, item.pair, true))}}</b>
                                                <span>{{$mkt.vMoney(item.worth)}}</span>
                                            </dd>
                                            <dd class="change">
                                                <van-button :class="[$mkt.vColor(item.gain_24)]">{{$mkt.format(item,item.gain_24)}}</van-button>
                                            </dd>
                                        </dl>
                                    </li>
                                </ul>
                                <ul v-if="cur == 2">
                                    <li v-for="(item,index) in rankList" :key="index" @click="$router.push({path: '/tradedetail',query:{pair: item.pair,back:'home'}})">
                                        <dl class="pairContent">
                                            <dd class="coinIcon"><img :src="item.icon" alt=""></dd>
                                            <dd class="volume">
                                                <p><b>{{item.pair.split('_')[0]}}</b><span>/{{item.pair.split('_')[1]}}</span></p>
                                                <span>{{changeVol(item.vol)}}</span>
                                            </dd>
                                            <dd class="price">
                                                <b>{{$mkt.fmtNum(item.price,$mkt.getScale($store.state.app.pairs, item.pair, true))}}</b>
                                                <span>{{$mkt.vMoney(item.worth)}}</span>
                                            </dd>
                                            <dd class="change">
                                                <van-button :class="[$mkt.vColor(item.gain_24)]">{{$mkt.format(item,item.gain_24)}}</van-button>
                                            </dd>
                                        </dl>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <downbar />
        <!-- <van-popup v-model="showDownload" position="bottom">
            <div class="downloadModal flexLevel">
                <div class="lt">
                    <img src="@/assets/img/logo_dark.png" alt="">
                    <span>{{$t('update.fast')}}</span>
                </div>
                <dl>
                    <dt @click="download">{{$t('update.app')}}</dt>
                    <dd @click="showDownload = false"><i class="iconfont iconbaseline-close-px" /></dd>
                </dl>
            </div>
        </van-popup> -->
    </div>
</template>  

<script>  
    import downbar from '@/views/modules/downbar.vue'
    import avatar from '@/assets/img/defaultAvatar.png'
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    // require styles
    import 'swiper/dist/css/swiper.css';
    import '@/assets/css/hexagon.css';

    const cache = {}; // 缓存数据列表
    export default {
        components:{
            downbar,
            swiper,
            swiperSlide,
        },
        data(){
            return{
                currentPower: 0, // 全网算力
                currentProduce: 0, // 全网产出
                currentTransform: 0, //全网产出叠加
                swiperOption: {
                    autoplay:true,
                    // effect : 'coverflow',
                    loop : true,

                    slidesPerView: 1.1,
                    spaceBetween: -25,
                    // slidesPerView: 1.2,
                    // spaceBetween: -20,
                    centeredSlides: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                },
                defaultAvatar: avatar,
                bannerVO: JSON.parse(localStorage.getItem('banner')) || [],
                bannerUrl:[],
                noticeV0:[],
                cur: 0,
                showHex:0,
                tabs:[this.$t('home.rise'),this.$t('home.fall'),this.$t('home.executed')],
                rankList: JSON.parse(localStorage.getItem('marketAll')) || [],
                homeList: [],
                features:[
                    {title:this.$t('home.features.h1'),icon:require('@/assets/svg/h1.svg'),name: 'mining'},
                    {title:'公益',icon:require('@/assets/svg/h8.svg'),name: 'publicWelfare'},
                    {title:'邀请',icon:require('@/assets/svg/h3.svg'),name: 'invite'},
                    {title:'今日抢购',icon:require('@/assets/svg/h4.svg'),name: 'spike'},
                    {title:'小程序',icon:require('@/assets/svg/h5.svg'),name: 'applets'},
                    {title:'快捷买币',icon:require('@/assets/svg/h6.svg'),name: 'buyCoins'},
                    {title:'签到',icon:require('@/assets/svg/h7.svg'),name: ''},
                    {title:'公告',icon:require('@/assets/svg/h2.svg'),name: 'announcement'},
                ],
                interval: null,
                showDownload: false,
                submiting:false,
                timeOut: null,
            }
        },
        beforeRouteLeave (to, from, next) {
            
            let that = this;

            // 登陆后禁止从首页直接进入登录页
            if (this.isLogin) {
                if (to.name === 'signin') return;
            }
            clearInterval(that.interval);
            clearTimeout(this.timeOut);
            that.showHex = 0;

            next();

        },
        beforeDestory(){
        },
        activated(){
            let that = this;
            if(localStorage.getItem('downloadModal') && !localStorage.getItem('isAPP')){
                // that.showDownload = true;
                // localStorage.removeItem('downloadModal');
            }
            that.initPage();
            this.getComPower();
        },
        computed:{
            isLogin(){
                return this.$store.state.isLogin;
            },
            headImg(){
                return this.$mts.getUserValue('avatar');
            },
            theme(){
                return this.$store.state.app.theme;
            }
        },
        watch:{

        },
        methods:{
            initPage(){
                let that = this;
                this.timeOut = setTimeout(()=>{
                    that.banner();
                    that.getMarketAll(); // 获取全部市场行情
                    that.$mts.rates();
                    that.$mts.currency();
                    that.notice();
                    that.showHex = 1;

                },780)


                // that.CheckShareId();
                that.$mts.checkExpire('clear',false,()=>{
                    // 登录之后获取余额
                    // if (that.isLogin) {
                    //     that.$mts.getCoins();
                    // }
                });
                // 定时器获取行情

            },
            // 获取首页节点展示
            getComPower() {
                let that = this;
                this.$mts.posts({
                    url: 'api/activity/mining/queryStage',
                    data:{},
                    success(res){
                        if(res.data.status == 200){
                            that.currentPower = res.data.data.currentPower;
                            that.currentProduce = Number(res.data.data.currentProduce.toFixed(2));
                            that.currentTransform = Number(res.data.data.currentTransform.toFixed(2));
                            that.interval = setInterval(() => {
                                that.currentProduce = Number((that.currentProduce + that.currentTransform).toFixed(2));
                            }, 500);
                        }
                    }
                });
            },
            goUrl(url){
                let that = this;
                if (!that.isLogin) {
                    that.$router.push({name: 'signin'});

                } else {
                    that.$mts.gourl(url);
                }
            },
            goPath(path){
                let that = this;
                let arr = [];
                if (!path) {
                    this.$toast({ type: 'fail', message: '敬请期待' });
                }
                if(path == 'redEnvelope'){
                    if(that.isLogin){
                        that.$mts.posts({
                            url: 'api/activity/redPackHelp/query',
                            data:{},
                            success(response){
                                if(response.data.status == 200){
                                    arr = response.data.data;
                                    if(arr && arr.length > 0){
                                        if(arr[0].status == 'SHARED' || arr[0].status == 'UNSHARE' || arr[0].status == 'FINISHED'){
                                            that.$router.push({name: 'redDetail'});
                                        }else{
                                            that.$router.push({name: path});
                                        }
                                    }else{
                                        that.$router.push({name: path});
                                    }
                                }
                            }
                        });
                    } else {
                        that.$router.push({name: path});
                    }
                } else if(path == 'deposit'){
                    if (that.isLogin) {
                        that.$router.push({name: path}); 
                    } else {
                        that.$mts.signout();
                    }
                }else if(path == 'invite'){
                    that.$router.push({name: path, params:{backUrl: 'home'}});
                } else if (path == 'announcement') {
                    that.$router.push({name: path});
                } else {
                    if (that.isLogin) {
                        that.$router.push({name: path});
                    } else {
                        that.$router.push({name: 'signin'});
                    }
                }
            },
            CheckShareId(){
                let that = this;
                let shareId = localStorage.getItem('shareId');
                if(that.isLogin){
                    if(shareId != null){
                        that.$router.push({name: 'redDetail'});
                    }
                }
            },
            clickBanner(url){
                // console.log(url)
                if(url == 'redEnvelope'){
                    this.goPath(url);
                }else{
                    this.$mts.openUrl(url);
                }
            },
            notice(){
                let that = this;
                const noticeV0Expire = localStorage.getItem('noticeV0Expire');
                if (Number(noticeV0Expire) - Date.now() > 0) {
                    that.noticeV0 = JSON.parse(localStorage.getItem('noticeV0'));
                } else {
                    that.$mts.posts({
                        url: 'api/me/app/lastNews?page=1&size=5',
                        data:{},
                        success(response){
                            if (response.status == 200) {
                                if(response.data.data)
                                that.noticeV0 = response.data.data;
                                localStorage.setItem('noticeV0', JSON.stringify(that.noticeV0));
                                localStorage.setItem('noticeV0Expire', JSON.stringify(Date.now() + 30000 * 10))
                            }
                        }
                    });
                }
            },
            banner(){
                let that = this;
                let arr = [];
                const bannerExpire = localStorage.getItem('bannerExpire');
                // console.log(Number(localStorage.getItem('bannerExpire')), Number(bannerExpire) - Date.now() > 0)
                if (Number(bannerExpire) - Date.now() > 0) {
                    that.bannerVO = JSON.parse(localStorage.getItem('banner'));
                } else {
                    // console.log(1);
                    that.$mts.posts({
                        url: 'api/me/app/banner',
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                arr = response.data.data.filter((item) => {
                                    return item.type == 'APP';
                                });
                                that.bannerVO = arr.sort(that.$mkt.fallSort('index'));
                                localStorage.setItem('banner', JSON.stringify(arr.sort(that.$mkt.fallSort('index'))));
                                localStorage.setItem('bannerExpire', JSON.stringify(Date.now() + 30000 * 60))
                            }
                        }
                    });
                }
            },
            getMarketAll(){ 
                let that = this;
                // this.rankList = JSON.parse(localStorage.getItem('marketAll'));
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url: 'api/v2/marketAll',
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                    that.submiting = false;
                                    let list = response.data.data;
                                    let array = [];
                                    for (var i = list.length - 1; i >= 0; i--) {
                                        array.push(list[i])
                                    }
                                    that.homeList = array.sort(that.$mkt.fallSort('sort'));
                                    that.rankList = list.sort(that.$mkt.riseSort('gain_24'));
                                    if(that.cur == 0){
                                        that.rankList = that.rankList.sort(that.$mkt.fallSort('gain_24'));
                                    }else if(that.cur == 1){
                                        that.rankList = that.rankList.sort(that.$mkt.riseSort('gain_24'));
                                    }else if(that.cur == 2){
                                        that.rankList.sort(that.$mkt.fallSort('vol'));
                                    }
                                    localStorage.setItem('marketAll', JSON.stringify(list));
                                    localStorage.setItem('marketAllExpire', JSON.stringify(Date.now() + 10000 * 60));

                                }
                            else{
                                that.$mts.toast(that.$t('message.public.dataError'));
                            }
                        }
                    });
                }
            },
            onChangeTab(index){
                let that = this;
                that.cur = index;
                if(index == 0){ // 涨幅榜
                    that.rankList.sort(that.$mkt.fallSort('gain_24'));
                }else if(index == 1){ // 跌幅榜
                    that.rankList.sort(that.$mkt.riseSort('gain_24'));
                }else if(index == 2){ // 成交榜
                    that.rankList.sort(that.$mkt.fallSort('vol'));
                }
                // document.querySelector('.flexContentContainer').scrollTop = 0;
            },
            changeVol(vol, pair){
                let that = this;
                if(Number(vol) >= 1000000){
                    return that.$mkt.fmtZero((vol/1000000), that.$mkt.getScale(that.$store.state.app.pairs, pair, false))+"M";
                }else if(Number(vol) >= 1000){
                    return that.$mkt.fmtZero((vol/1000), that.$mkt.getScale(that.$store.state.app.pairs, pair, false))+"K";
                }else{
                    return that.$mkt.fmtZero(vol, that.$mkt.getScale(that.$store.state.app.pairs, pair, false));
                }
            },
            download(){
                let that = this;
                // console.log(that.$config.domain + '/#/download');
                window.location.href = that.$config.domain + '/#/download';
            }
        }
    }
</script>  

<style lang="scss" scoped>
    .flexPage {
        .homeFlexHead {
            // background-color: #024645;
            height: 50vw;
            .homeHead {
                position: absolute;
                top: 0;
                width: 92vw;
                z-index: 99;
            }
            .swiper {
                width: 100vw;
                height: 50vw;

                .van-swipe {
                    width: 100vw;
                    overflow: hidden;

                    img {
                        width: 100vw;
                        height: 50vw;
                        display: block;
                        // border-radius: 1.0667vw;
                    }

                    .van-swipe__indicators {
                        width: 15vw;
                        left: 88%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;

                        .van-swipe__indicator {
                            width: 1.2vw;
                            height: 0.8vw;
                            // border-radius: 0.4vw;
                        }

                        .van-swipe__indicator--active {
                            width: 2.9333vw;
                        }
                    }
                }
            }
            .noticeBar {
                // position: relative;
                top: 13vw;
                display: flex;
                align-items: center;
                // padding: 2vw 0;
                margin: 0 4vw;
                height: 30px;
                overflow: hidden;
                z-index: 1;
                // border-bottom: 1px solid #F2F2F2;

                >span {
                    height: 21px;
                    line-height: 21px;
                    transform: translateY(0vw);

                    i {
                        font-size: 3.2vw;
                        margin-right: 2vw;
                        color: #333;
                    }
                }

                .van-swipe {
                    flex: 1;
                    height: 21px;

                    .van-swipe-item {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        span {
                            color: #666;
                            font-size: 3.2vw;
                        }
                    }
                }
            }
            
        }
        @keyframes gradientBG {
            0% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0% 50%;
            }
        }
        .node {
            width: 92vw;
            overflow: hidden;
            height: 27vw;
            position: relative;
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradientBG 10s ease infinite;
            margin: 0 4vw;
            margin-top: 2vw;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
            .data {
                display: flex;
                flex-direction: column;
                width: 50%;
                justify-content: center;
                font-size: 4vw;
                span:first-child {
                    margin-bottom: 2vw;
                }
            }
        }
        .homeContent {
            // display: inline-block;
            width: 92vw;
            overflow: hidden;
            // position: absolute;
            background-color: #fff;
            margin: 0 4vw;
            margin-top: 8vw;
            border-radius: 5px;
            z-index: 1;
            .moreFeatures {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                margin: 4vw 0 1.3333vw;
                dl {
                    display: flex;
                    flex-direction: column;
                    width: 25%;
                    align-items: center;
                    dt {
                        width: 8vw;
                        height: 8vw;
                        // border-radius: 50%;
                        img {
                            display: block;
                            width: 100%;
                        }
                    }
                    dd{
                        font-size: 3.2vw;
                        line-height: 4.4vw;
                        color: #666;
                        margin-top: 1.6vw;
                        padding-bottom: 2.6667vw;}
                }
            }
        }
        .bpd {
            margin-top: 2vw;
        }
        .flexContentHome {
            display: flex;
            .flexContentContainer {
                flex: 1;
                // margin-top: 20vw;
                overflow-x: hidden;
                overflow-y: auto;
            }
            .homeList {
                // margin-top: 5vw;
                .pairListItem {
                    ul li {
                        padding: 3vw 0;
                    }
                }
            }
        }
    }
    
    .swiper-box {
        position: relative;
        top: -16vw;
        overflow: hidden;
    }
    .swiper-container {
        // margin-bottom: 20px;
        // position: absolute;
        // top: 20vw;
        width: 100vw;
        height: 50vw;
        img {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 1.0667vw;
        }
    }
    .swiper-slide {
        height: 50vw;
        text-align: center;
        font-size: 18px;
        background: #fff;
        border-radius: 5px;

        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        transition: 300ms;
        transform: scale(0.8);
        .account-container {
            width: 90%;
            height: 80%;
            display: flex;
            flex-direction: column;
            font-size: 3.2vw;
            .title, .mid {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                i {
                    margin-left: 1.5vw;
                }
            }
            .btn-container {
                flex: 1 1 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 3vw;
                .van-button {
                    width: 50%;
                }
            }
        }
    }
	.swiper-slide-active,.swiper-slide-duplicate-active{
        transform: scale(1);
    }
    .hexagon-box {
        width: 50%;
        height: 20vw;
        position: relative;
    }
</style>

<style lang="scss">
    .swiper-pagination-bullet {
        background-color: #CCCCCC;
        width: 6px;
        height: 6px;
    }
    .swiper-pagination-bullet-active {
        background-color: #999;
    }
</style>
