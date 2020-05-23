<template>
<div class="flexPage darkPage">
    <div class="flexHead">
        <div class="assetsHeader">
            <dl>
                <dt><img :src="head" alt=""></dt>
                <dd>
                    <h3>{{username}}</h3>
                    <p><span>UID</span> <span>{{uid}}</span></p>
                </dd>
            </dl>
            <p @click="$mts.goto('user')"><span>{{$t('assets.index.user')}}</span><span class="setImg"><img src="../../assets/img/setting.png" alt=""></span></p>
        </div>
    </div>
    <div class="flexContent">
        <div class="assetsWrapper">
            <div class="assetsBox">
                <p class="assetsTitle">{{$t('assets.index.allAssets')}}<van-icon class="eye" @click.native="eyesOn = !eyesOn" :name="eyesOn?'eye-o':'closed-eye'" /></p>
                <h2 class="lineHeight">{{eyesOn ? total+' '+market : '*****'}}</h2>
                <!-- <p class="result lineHeight">{{eyesOn ? '≈'+ money + vRate : '*****'}}</p> -->
                <div class="assetsHandle">
                    <p class="flexSpindle" @click="$router.push({name:'deposit'})">{{$t('assets.index.n1')}}</p>
                    <p class="flexSpindle" @click="$router.push({name:'withdrawal'})">{{$t('assets.index.n2')}}</p>
                    <p class="flexSpindle" @click="$router.push({name:'transfer',query:{from:'T'}})">{{$t('assets.index.n3')}}</p>
                    <p class="flexSpindle" @click="$router.push({name:'lockCoin',})">{{$t('assets.index.n4')}}</p>
                </div>
            </div>
            <div class="accountBox">
                <ul class="accountChoose">
                    <li class="lineHeight" v-for="(item,index) of accounts" :key="index" :class="{active: cur== index}" @click="onChangeAccount(index)">{{item.title}}</li>
                </ul>
                <div class="assetsClac" v-if="cur == 0">
                    <p class="calCTitle">{{$t('assets.index.coin')+$t('assets.index.allAssets')}}(USDT)</p>
                    <p><b>{{totalCategory}}</b><span>{{$tdp.money(totalCategory,market)}}</span></p>
                </div>
                <div class="assetsClac" v-if="cur == 1">
                    <p class="calCTitle">{{$t('assets.index.contract')+$t('assets.index.allAssets')}}(USDT)</p>
                    <p><b>{{totalCategory}}</b><span>{{$tdp.money(totalCategory,market)}}</span></p>
                </div>
                <div class="assetsClac" v-if="cur == 2">
                    <p class="calCTitle">{{$t('assets.index.legalcurrency')+$t('assets.index.allAssets')}}(USDT)</p>
                    <p><b>{{totalCategory}}</b><span>{{$tdp.money(totalCategory,market)}}</span></p>
                </div>
            </div>
            
            <!-- 内容展示部分 -->
            <!-- 币币账户 -->
            <div class="assetsConetent" v-if="cur == 0">
                <div class="assetsInfo">
                    <p class="check">
                        <van-checkbox @change="changeZero" v-model="hideZero"><span class="ml1">{{$t('assets.index.s1')}}</span></van-checkbox>
                    </p>
                    <ul class="detailInfo">
                        <loading />
                        <nodata v-if="!list || list.length==0"></nodata>
                        <li v-for="(item,index) of list" :key="index" v-if="!hideZero || (hideZero && (item.usable>0 || item.frozen >0))">
                            <h3 class="lineHeight">{{item.token}}</h3>
                            <div class="detailsList">
                                <dl>
                                    <dt>{{$t('trade.use')}}</dt>
                                    <dd>{{$tdp.fmtZero(item.usable,digit)}}</dd>
                                </dl>  
                                <dl>
                                    <dt>{{$t('assets.index.freeze')}}</dt>
                                    <dd>{{$tdp.fmtZero(item.frozen,digit)}}</dd>
                                </dl>  
                                <dl>
                                    <dt>{{$t('assets.index.equivalent')}}({{vRate}})</dt>
                                    <dd>{{$tdp.money($tdp.fmtZero(item.usable * getClose(item.token),digit),market)}}</dd>
                                </dl>  
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 合约账户 -->
            <div class="assetsConetent" v-if="cur == 1">
                <div class="assetsInfo">
                    <p class="check">
                        <van-checkbox v-model="hideZero"><span class="ml1">{{$t('assets.index.s1')}}</span></van-checkbox>
                    </p>
                    <ul class="detailInfo">
                        <loading />
                        <nodata v-if="!list || list.length==0"></nodata>
                        <li v-for="(item,index) of list" :key="index" v-if="!hideZero || (hideZero && (item.usableT>0 || item.frozenT >0))">
                            <h3 class="lineHeight">{{item.token}}</h3>
                            <div class="detailsList">
                                <dl>
                                    <dt>{{$t('trade.use')}}</dt>
                                    <dd>{{$tdp.fmtZero(item.usableT,digit)}}</dd>
                                </dl>  
                                <dl>
                                    <dt>{{$t('assets.index.freeze')}}</dt>
                                    <dd>{{$tdp.fmtZero(item.frozenT,digit)}}</dd>
                                </dl>  
                                <dl>
                                    <dt>{{$t('assets.index.equivalent')}}({{vRate}})</dt>
                                    <dd>{{$tdp.money($tdp.fmtZero(item.usableT * getClose(item.token),digit),market)}}</dd>
                                </dl>  
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 法币账户 -->
            <div class="assetsConetent" v-if="cur == 2">
                <div class="assetsInfo">
                    <p class="check">
                        <van-checkbox v-model="hideZero"><span class="ml1">{{$t('assets.index.s1')}}</span></van-checkbox>
                    </p>
                    <ul class="detailInfo">
                        <loading />
                        <nodata v-if="!list || list.length==0"></nodata>
                        <li v-for="(item,index) of list" :key="index" v-if="!hideZero || (hideZero && (item.usableOtc>0 || item.frozenOtc >0))">
                            <h3 class="lineHeight">{{item.token}}</h3>
                            <div class="detailsList">
                                <dl>
                                    <dt>{{$t('trade.use')}}</dt>
                                    <dd>{{$tdp.fmtZero(item.usableOtc,digit)}}</dd>
                                </dl>  
                                <dl>
                                    <dt>{{$t('assets.index.freeze')}}</dt>
                                    <dd>{{$tdp.fmtZero(item.frozenOtc,digit)}}</dd>
                                </dl>  
                                <dl>
                                    <dt>{{$t('assets.index.equivalent')}}({{vRate}})</dt>
                                    <dd>{{$tdp.money($tdp.fmtZero(item.usableOtc * getClose(item.token),digit),market)}}</dd>
                                </dl>  
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <downbar/>
</div>
</template>
<script>
import downbar from "@/views/modules/downbar.vue";
import headInfo from '@/assets/img/head.jpg'
export default {
    data(){
        return {
            eyesOn:true,
            tabActive:"trade",
            // list:[],
            result:[],
            cur: 0,
            accounts:[
                {title: this.$t('assets.index.a1')},
                {title: this.$t('assets.index.a2')},
                {title: this.$t('assets.index.a3')}
            ],
            trade:{
                pageNo:1,
                total:0,
                type:'TRADE',
                list:[]
            },
            otc:{
                pageNo:1,
                total:0,
                type:'OTC',
                list:[]
            },
            t:{
                pageNo:1,
                total:0,
                type:'T',
                list:[]
            },
            head:headInfo,
            market:'USDT',
            pendingOtc:0,
            hideZero:!localStorage.getItem('hideZero')?false:(localStorage.getItem('hideZero')=='Y'?true:false),
            isAssetsDetail:true,
            rankingVO:[],
            interval:null,
            vRate: localStorage.getItem('rate')?localStorage.getItem('rate'):'CNY'
        }
    },
    components:{downbar},
    watch:{
       
    },
    computed:{
        // 个人资金总价
        total(){ 
            let that = this;
            let total = 0;
            for(let idx = 0;idx < that.result.length;idx ++){
                let item = that.result[idx];
                let usable = Number( item.balance + item.balanceOtc + item.balanceT);
                total += Number(usable * that.getClose( item.token));
            }
            return that.$tdp.fmtZero(total, that.digit);
        },
        //折算成当前汇率对应的价格
        money(){
            let that = this;
            // 当前所有的汇率
            let rates = that.$store.state.rates;
            if(rates && rates[that.market]){
                let list = rates[that.market];
                for(let idx = 0;idx < list.length; idx ++){
                    if (that.vRate === list[idx].symbol) {
                        let c = list[idx];
                        if (c) {
                            return Number(c.last * that.total).toFixed(2);
                        }
                    }
                }
            }
            return Number(0).toFixed(2);
        },
        // 资金详情列表分类
        totalCategory(){ 
            let that = this;
            let total = 0;
            for(let idx = 0;idx < that.result.length;idx ++){
                let item = that.result[idx];
                //切换账户
                switch( that.cur){
                    //币币账户
                    case 0:
                        total += item.usable * that.getClose( item.token);
                        break;
                    //合约账户    
                    case 1:
                        total += item.usableT * that.getClose( item.token);
                        break; 
                    //法币账户    
                    default:
                        total += item.usableOtc * that.getClose( item.token);
                        break;  
                }
            }
            return that.$tdp.fmtZero(total, that.digit);
        },
        // 小数位
        digit(){ 
            let that = this;
            let coin = that.$store.state.coin;
            return coin && coin[that.market]?coin[ that.market].digit[0]:8;
        },
        isLogin() {
            return this.$store.state.isLogin;
        },
        username(){
            return this.$mts.getUserValue('username');
        },
        uid(){
            return this.$mts.getUserValue('uid');
        },
        list(){
            let that = this;
            let arr = that.result;

            let list = [];
            //币币账户
            if(that.cur == 0){
                list = arr;
            }else{
                for(let idx = 0; idx < arr.length; idx ++){
                    //合约账户
                    if( that.cur == 1 && arr[idx].isT == 'Y'){
                        list.push(arr[idx])
                    }
                    //法币账户
                    else if(that.cur == 2 && arr[idx].isOtc == 'Y'){
                        list.push(arr[idx])
                    }
                }
            }

            return list;
        }
    },
    beforeRouteLeave (to, from, next) {
        clearInterval( this.interval);
        next();
    },
    beforeDestroy(){
        clearInterval( this.interval);
    },
    mounted(){
        let that = this;

        that.$mts.checkLogin("needback",()=>{
            if (that.$store.state.isLogin) {
                that.pageInit();
                that.$mts.configure();
                that.$mts.rates();
                that.ranking();

                // alert(JSON.stringify(that.$store.state.rates))


                if(that.$mts.getUserValue('headImage')){
                    that.head = that.$mts.getUserValue('headImage')
                }

                that.interval = setInterval(()=>{
                    that.pageInit();
                }, 20000);
            }
        });
    },
    methods:{
        changeZero(bool){
            localStorage.setItem("hideZero",bool?'Y':'N')
        },
        onChangeAccount(index){
            this.cur = index;
        },
        // 获取收盘价
        getClose( symbol){ 
            let that = this;
            let tokens = that.$store.state.coin;
            if (that.rankingVO 
                    && that.rankingVO.length > 0
                    && tokens) {
                let arr = that.rankingVO;
                // 实际市值
                let close = tokens[symbol].marketPrice;
                for (var i = arr.length - 1; i >= 0; i--) {
                    if(arr[i].symbol === symbol
                        && arr[i].close > 0){
                        close = arr[i].close;
                    }
                }
                return close;
            }
            return 0;
        },
        pageInit(){
            let that = this;
            that.$mts.post({
                url:'wallet/details',
                data:{}, 
                success(response){
                    if(response.data.code == 200){
                        that.result =  response.data.data;
                    }
                }
             });
        },
        ranking(){
            var that = this;
            that.$mts.post({
                url:'quotation/ranking',
                data:{
                    market:that.$mts.stabilize
                },success(response){
                    if(response.data.code==200){
                        that.rankingVO = response.data.data;
                    }
                }
            });
        },    
    }
}
</script>
