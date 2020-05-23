<template>
    <div class="flexPage" v-cloak>
        <div class="flexHead"></div>
        <div class="flexContent whiteBg">   
            <div class="userWrapper">
                <div class="userHead flexLevel">
                    <dl>
                        <dt @click="toUser"><img :src="!headImg ? defaultAvatar : headImg" onerror="this.src='https://bitcolachina.oss-cn-shanghai.aliyuncs.com/image/20190102/c4153aaa37aa47a08955bfc230ee5ee8.png'" /></dt>
                        <dd v-if="isLogin">
                            <b>{{userInfo.nickName}}</b>
                            <span>UID {{$mkt.makeUid(userInfo.sysUserID)}}</span>
                        </dd>
                    </dl>
<!--                    <i class="iconfont iconjilu" @click="$router.push({name:'fundRecord'})" />-->
                </div>
                <div class="swiper-box">
                    <swiper
                        :options="swiperOption"
                        @slideChange="slideChange"
                        ref="mySwiper"
                    >
                        <swiper-slide
                            v-for="(item, index) in accounts"
                            :key="index"
                            :style="`background: ${pageStyle[index]}`"
                        >
                            <div class="account-container">
                                <template v-if="isLogin">
                                    <span class="title">
                                        {{$t('user.index.total')+'('+$mkt.VCoinType()+')'}}：
                                        <!-- <van-icon :name="eyesOn?'closed-eye':'eye-o'" @click="clickEye" /> -->
                                        <span class="asset" v-if="!eyesOn">{{allAssets}}</span>
                                    </span>
                                    <span class="mid">
                                        {{ item }}资产折合
                                        <span>{{'('+$mkt.VCoinType()+')'}}</span>：
                                        <span v-if="cur === 0">{{ allBalance }}</span>
                                        <span v-if="cur === 1">{{ allBonus }}</span>
                                        <span v-if="cur === 2">{{ allPurchase }}</span>
                                    </span>
                                </template>
                                <div
                                    v-else
                                    class="btn-container"
                                >
                                    <van-button
                                        size="small"
                                        round
                                        :to="{name:'signin',query:{path: '/assets'}}"
                                    >
                                        点击登陆
                                    </van-button>
                                </div>
                            </div>
                        </swiper-slide>
                        <div class="swiper-pagination"  slot="pagination"></div>
                    </swiper>
                </div>
                <!-- <div class="line"></div> -->
                <div class="userContent">
                    <div class="userTop flexLevel">
                        <div class="hide" @click="checkStatus.show = !checkStatus.show">
                            <i :class="['iconfont', checkStatus.show ? 'iconxuanzhong' : 'iconweixz']" />
                            <span>{{$t('user.index.hide')}}</span>
                        </div>
                        <div class="search"><i class="iconfont iconsearch" /><input :placeholder="$t('user.index.search')" v-model="searchValue" /></div>
                    </div>
                    <div class="list">
                        <!-- <loading v-if="submiting"/> -->
                        <nodata v-if="!balances || balances.length == 0"/>
                        <ul v-if="cur == 0 && balances.length > 0">
                            <li
                                v-for="(item,index) in balances"
                                :key="index"
                                @click="toWallet(item, cur, 'isUse')"
                            >
                                <div class="coinHead">
                                    <img :src="item.icon" alt="">
                                    <div class="coinHeadRight">
                                        <span class="coin">{{item.coinCode}}</span>
                                        <span>{{$mkt.vSymbol() + $mkt.fmtNum((item.available + item.frozen) * item.price * $mkt.vPrice(),item.scale)}}</span>
                                    </div>
                                </div>
                                <div class="coinBottom">
                                    <span>{{$t('user.index.available')}}：{{$mkt.fmtNum(item.available,item.scale)}}</span>
                                    <span>{{$t('user.index.freeze')}}：{{$mkt.fmtNum(item.frozen,item.scale)}}</span>
                                    <span v-if="item.coinCode === 'TSOL'">可售：{{$mkt.fmtNum(item.allowSell,item.scale)}}</span>
                                </div>
                            </li>
                        </ul>
                        <ul v-if="cur == 1 && balances.length > 0">
                            <li 
                                v-for="(item,index) in balances" 
                                :key="index"  
                                class="sm"
                                @click="toWallet(item, cur)"
                            >
                                <div class="coinHead">
                                    <img :src="item.icon" alt="">
                                    <div class="coinHeadRight">
                                        <span class="coin">{{item.coinCode}}</span>
                                        <span>{{$mkt.vSymbol() + $mkt.fmtNum(item.mining * item.price * $mkt.vPrice(),item.scale)}}</span>
                                    </div>
                                </div>
                                <div class="coinBottom">
                                    <span>{{$t('user.index.available')}}：{{$mkt.fmtNum(item.mining,item.scale)}}</span>
                                </div>
                                <!-- <dl class="status">
                                    <dd>{{$t('user.index.freeze')}}</dd>
                                    <dd>{{$t('user.index.equal')+'('+$mkt.VCoinType()+')'}}</dd>
                                </dl>
                                <dl class="amount">
                                    <dd v-if="eyesOn">******</dd>
                                    <dd v-else>{{$mkt.fmtNum(item.prizeFrozen,item.scale)}}</dd>
                                    <dd v-if="eyesOn">******</dd>
                                    <dd v-else>{{$mkt.vSymbol() + $mkt.fmtNum(item.prizeFrozen * item.price * $mkt.vPrice(),item.scale)}}</dd>
                                </dl> -->
                            </li>
                        </ul>
                        <ul v-if="cur == 2 && balances.length > 0">
                            <li 
                                v-for="(item,index) in balances" 
                                :key="index" 
                                class="sm"
                                @click="toWallet(item, cur)"
                            >
                                <div class="coinHead">
                                    <img :src="item.icon" alt="">
                                    <div class="coinHeadRight">
                                        <span class="coin">{{item.coinCode}}</span>
                                        <span>{{$mkt.vSymbol() + $mkt.fmtNum(item.applyAmount * item.price * $mkt.vPrice(),item.scale)}}</span>
                                    </div>
                                </div>
                                <div class="coinBottom">
                                    <span>{{$t('user.index.apply')}}：{{$mkt.fmtNum(item.applyAmount,item.scale)}}</span>
                                </div>
                                <!-- <dl class="status">
                                    <dd>{{$t('user.index.apply')}}</dd>
                                    <dd>{{$t('user.index.equal')+'('+$mkt.VCoinType()+')'}}</dd>
                                </dl>
                                <dl class="amount">
                                    <dd v-if="eyesOn">******</dd>
                                    <dd v-else>{{$mkt.fmtNum(item.applyAmount,item.scale)}}</dd>
                                    <dd v-if="eyesOn">******</dd>
                                    <dd v-else>{{$mkt.vSymbol() + $mkt.fmtNum(item.applyAmount * item.price * $mkt.vPrice(),item.scale)}}</dd>
                                </dl> -->
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- 提示去设置PIN -->
        <van-popup v-model="showToast" class="showMore">
            <div class="goModal dark">
                <h3>{{$t('message.public.systemTitle')}}</h3>
                <p>{{$t('message.safe.noFund')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showToast = false">{{$t('button.public.know')}}</span>
                    <span class="btn2" @click="$router.push({name: 'changeFundPsw',query:{path:'/withdrawal'}})">{{$t('button.user.setting')}}</span>
                </div>
            </div>
        </van-popup> 
        <downbar />  
	</div>
</template>
<script>
    import backbar from "@/views/modules/back.vue"
    import downbar from "@/views/modules/downbar.vue"
    import avatar from '@/assets/img/defaultAvatar.png'
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    // require styles
    import 'swiper/dist/css/swiper.css';

    export default {
        data(){
            return {
                swiperOption: {
                    // loop: true,
                    slidesPerView: 1.1,
                    centeredSlides: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                },
                backUrl:{
                    url: ''
                },
                showToast: false,
                eyesOn: JSON.parse(localStorage.getItem('eyesOn')) || false,
                cur: 0,
                searchValue: '',
                userInfo: {
                    telPhone: '',
                    nickName: ''
                },
                checkStatus:{
                    show: false,
                },
                accounts:[this.$t('user.index.a1'),'挖矿',this.$t('user.index.a3')],
                pageStyle: [
                    'linear-gradient(to right, #7089A8, #C3CFE9);',
                    'linear-gradient(to right, #48D7AD, #53DFEC);',
                    'linear-gradient(to right, #EAB45E, #FFE3B1);',
                ],
                allAssets: '', // 总资产
                allBalance: '', // 币币账户
                allBonus: '', // 奖励金账户
                allPurchase: '', // 认购账户
                coinList:{
                    balance:[]
                },
                defaultAvatar: avatar,
                interval: null,
                submiting: false,
            }
        },
        components:{
            backbar,
            downbar,
            swiper,
            swiperSlide
        },
        computed:{
            swiper() {
                return this.$refs.mySwiper.swiper
            },
            headImg(){
                return this.$mts.getUserValue('avatar');
            },
            balances(){
                let that = this;
                let arr = that.coinList.balance;
                let value = that.searchValue;
                return value ? arr.filter((item)=>{
                    return item.coinCode.indexOf(String(value).toUpperCase()) != -1 ;
                }) : arr;
            },
            isLogin() {
                return this.$store.state.isLogin;
            }
        },
        beforeRouteLeave (to, from, next) {
            clearInterval(this.interval);
            next();
        },
        activated() {
            console.log(this.balances)
            if(this.$store.state.isLogin){
                this.initPage();
            }
        },
        mounted(){
            if(this.$store.state.isLogin){
                this.initPage();
            }
        },
        watch:{
            
        },
        methods:{
            toUser() {
                if(!this.$store.state.isLogin){
                    this.$router.push({name:'signin'});
                } else {
                    this.$router.push({name:'user'});
                }
            },
            toWallet(item, index, isUse) {
                localStorage.setItem('walletData', JSON.stringify(item));
                this.$router.push({
                    name: 'wallet',
                    query: {
                        index,
                        type: isUse
                    }
                })
            },
            slideChange() {
                // console.log(this.swiper.realIndex);
                this.cur = this.swiper.realIndex;
            },
            clickEye(){
                let that = this;
                that.eyesOn = !that.eyesOn;
                localStorage.setItem('eyesOn', that.eyesOn);
            },
            initPage(){
                let that = this;
                that.$mts.rates();
                that.getUserInfo();
                that.getCoins();
                that.interval = setInterval(()=>{
                    that.getCoins();
                }, 10*60*1000);
            },
            // goWithdrawal(){
            //     let that = this;
            //     let flag = JSON.parse(localStorage.getItem('setFundPsw'));
            //     if (flag) {
            //         that.$router.push({name:'withdrawal'})
            //     } else {
            //         that.showToast = true;
            //     }
            // },
            getBalance(){ // 获取总资产
                let that = this;
                let arr = that.coinList.balance;
                let scale = arr[0].scale;
                let sum1 = 0,sum2 = 0,sum3 = 0;
                for(var i = 0; i < arr.length; i++){
                    sum1 += (arr[i].available + arr[i].frozen) * arr[i].price;
                    sum2 += arr[i].mining * arr[i].price;
                    sum3 += arr[i].applyAmount * arr[i].price;
                }
                that.allBalance = '≈ ' + that.$mkt.vSymbol() + that.$mkt.fmtNum(sum1 * that.$mkt.vPrice(),scale);
                that.allBonus = '≈ ' + that.$mkt.vSymbol() + that.$mkt.fmtNum(sum2 * that.$mkt.vPrice(),scale);
                that.allPurchase = '≈ ' + that.$mkt.vSymbol() + that.$mkt.fmtNum(sum3 * that.$mkt.vPrice(),scale);
                that.allAssets = '≈ ' + that.$mkt.vSymbol() + that.$mkt.fmtNum((sum1 + sum2 + sum3) * that.$mkt.vPrice(),scale);
            },
            getUserInfo(){ // 获取用户信息
                let that = this;
                that.userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
            },
            getCoins(){ // 获取币种列表
                let that = this;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url: 'api/me/balance/info',
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                that.submiting = false;
                                that.coinList = response.data.data;
                                that.getBalance();                         
                            }else{
                                that.$mts.toast(that.$t('message.public.dataError'));
                            }
                        }
                    });
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .list {
        ul {
            display: flex;
            flex-wrap: wrap;
            li {
                width: 43%;
                background-color: #fff;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                border-radius: 5px;
                &:nth-child(odd) {
                    margin-right: 5%;
                }
                .coinHead {
                    justify-content: space-between;
                    border-bottom: 1px solid #eee;
                    padding: 0 0 1vw 0;
                    .coinHeadRight {
                        display: flex;
                        flex-direction: column;
                        margin-right: 3px;
                        span {
                            text-align: end;
                        }
                        span:first-child {
                            font-weight: 700;
                        }
                        span:last-child {
                            font-size: 3.2vw;
                        }
                    }
                }
                .coinBottom {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 2vw;
                    span:first-child {
                        font-weight: 700;
                    }
                    span:nth-child(2), span:nth-child(3) {
                        font-size: 3.2vw;
                        color: #999;
                    }
                }
            }
        }
    }
    .userWrapper {
        position: relative;
    }
    .swiper-box {
        position: relative;
        top: -16vw;
        overflow: hidden;
    }
    .swiper-container {
        margin-bottom: 20px;
        // position: absolute;
        // top: 20vw;
    }
    .swiper-slide {
        height: 30vw;
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
            font-size: 3.5vw;
            color: #fff;
            .title, .mid {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                i {
                    margin-left: 1.5vw;
                }
            }
            .mid {
                margin-top: 1vw;
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
    .van-button {
        background: linear-gradient(to right, #1F7076, #46A7AD)!important;
        color: #fff!important;
    }
</style>

<style lang="scss">
    .swiper-pagination-bullet {
        background-color: #fff;
        width: 6px;
        height: 6px;
    }
    .swiper-pagination-bullet-active {
        background-color: #999;
    }
</style>
