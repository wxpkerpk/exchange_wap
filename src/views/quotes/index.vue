<template>  
    <div class="flexPage" v-cloak>
        <div class="flexHead"></div>
        <div class="flexContent">
            <div class="quotesWrapper">
                <div class="quotesHead flexLevel">
                    <h3>{{$t('quotes.index.title')}}</h3>
                    <i class="iconfont iconsearch" @click="$router.push({path: '/search',query:{backUrl:'quotes'}})" />
                </div>
                <div class="secondMenus">
                    <ul>
                        <li :class="{active:cur == -1}" @click="onSetFav">{{$t('nav.fav')}}</li>
                        <li v-for="(item,index) in coins" :key="index" :class="{active:cur == index}" @click="onChangeTab(item,index)">{{item.name}}</li>
                    </ul>
                </div>
                <div class="pairList">
                    <dl class="pairHead">
                        <dd>
                            {{$t('table.coin')}}
                            <div class="sort">
                                <span class="rise"></span>
                                <span class="fall"></span>
                            </div>   
                        </dd>
                        <dd @click="onSort('vol')">
                            <span>24H {{$t('table.volume')}}</span>
                            <svg class="icon sm" aria-hidden="true" slot="icon" v-if="sortType == 'vol'">
                                <use :xlink:href="'#'+vSort"></use>
                            </svg>
                        </dd>
                        <dd @click="onSort('price')">
                            <span>{{$t('table.price')}}</span>
                            <svg class="icon sm" aria-hidden="true" slot="icon" v-if="sortType == 'price'">
                                <use :xlink:href="'#'+vSort"></use>
                            </svg>
                        </dd>
                        <dd @click="onSort('change')">
                            <span>24H {{$t('table.change')}}</span>
                            <svg class="icon sm" aria-hidden="true" slot="icon" v-if="sortType == 'change'">
                                <use :xlink:href="'#'+vSort"></use>
                            </svg>
                        </dd>
                    </dl>
                    <!-- <loading v-if="submiting" /> -->
                    <nodata v-if="pairList.length == 0 || !pairList" />
                    <div v-else>
                        <ul v-if="cur == -1">
                            <li v-for="(item,index) in pairList" :key='index' @click="$router.push({path: '/tradedetail',query:{pair: item.pair}})">
                                <dl class="pairContent">
                                    <dd class="coinIcon"><img :src="item.icon" alt=""></dd>
                                    <dd class="volume">
                                        <p><b>{{item.pair.split('_')[0]}}</b><span>/{{item.pair.split('_')[1]}}</span></p>
                                        <span>{{$mkt.fmtZero(item.vol,$mkt.getScale($store.state.app.pairs, item.pair, false))}}</span>
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
                        <ul v-for="(item,index) in coins.length" :key="index" v-if="cur == index">
                            <li v-for="(item,index) in pairList" :key='index' @click="$router.push({path: '/tradedetail',query:{pair: item.pair}})">
                                <dl class="pairContent">
                                    <dd class="coinIcon"><img :src="item.icon" alt=""></dd>
                                    <dd class="volume">
                                        <p><b>{{item.pair.split('_')[0]}}</b><span>/{{item.pair.split('_')[1]}}</span></p>
                                        <span>{{$mkt.fmtZero(item.vol, $mkt.getScale($store.state.app.pairs, item.pair, false))}}</span>
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
        <downbar /> 
    </div>
</template>  

<script>  
    import downbar from '@/views/modules/downbar.vue'
    export default {
        data(){
            return{
                showSearch:false,
                cur: 0, // USDT
                coins:JSON.parse(localStorage.getItem('coinsPlaceholder')) || [],
                pairList: JSON.parse(localStorage.getItem('market')) || [],
                sortType: 'vol',
                defaultIndex: 0,
                interval: null,
                submiting:false,
            }
        },
        computed:{
            vSort(){
                switch(this.defaultIndex){
                    case 0: 
                        return 'iconseleet';
                    case 1: 
                        return 'iconshaixuan';
                    case 2:
                        return 'iconshaixuanbeifen';
                    default:
                        return 'iconseleet';
                }
            },
        },
        components:{
            downbar
        },
        activated(){
            let that = this;
            that.$mts.rates(); // 获取汇率
            that.getPairAll(); // 获取交易介质
            that.onChangeTab({name: 'USDT'},0);
            that.$mts.currency();
            that.interval = setInterval(()=>{
                if (that.coins && that.coins.length > 0) {
                    that.onChangeTab({name: that.coins[that.cur].name}, that.cur);
                }
            }, 10*60*1000);
        },
        beforeRouteLeave (to, from, next) {
            let that = this;
            clearInterval( that.interval);
            next();
        },
        beforeDestory(){
            let that = this;
            clearInterval( that.interval);
        },
        // mounted(){
        //     let that = this;
        //     that.$mts.rates(); // 获取汇率
        //     that.getPairAll(); // 获取交易介质
        //     that.onChangeTab({name: 'USDT'},0);
        //     that.$mts.currency();
        //     that.interval = setInterval(()=>{
        //         if (that.coins && that.coins.length > 0) {
        //             that.onChangeTab({name: that.coins[that.cur].name}, that.cur);
        //         }
        //     }, 10*60*1000);
        // },
        watch:{
        },
        methods:{
            getPairAll(){
                let that = this;
                const coinsPlaceholderExpire = localStorage.getItem('coinsPlaceholderExpire');
                if (Number(coinsPlaceholderExpire) - Date.now() > 0) {
                    that.coins = JSON.parse(localStorage.getItem('coinsPlaceholder'));
                } else {
                    that.$mts.posts({
                        url: 'api/me/coinSymbol/getSymbol',
                        data:{},
                        success(response){
                            if(response.data.status == 200){

                                    that.coins = response.data.data;
                                    localStorage.setItem('coinsPlaceholder', JSON.stringify(that.coins));
                                    localStorage.setItem('coinsPlaceholderExpire', JSON.stringify(Date.now() + 60000 * 60));



                            }else{
                                that.$mts.toast(that.$t('message.public.dataError'));
                            }
                        }
                    });
                }
            },
            onSort(type){
                let that = this;
                that.sortType = type;
                if(that.defaultIndex < 2){
                    that.defaultIndex++;
                }else{
                    that.defaultIndex = 0;
                }
                // 判断sort
                if(type == 'vol' && that.defaultIndex == 1){
                    that.pairList.sort(that.$mkt.fallSort('vol'));
                }else if(type == 'vol' && that.defaultIndex == 2){
                    that.pairList.sort(that.$mkt.riseSort('vol'));
                }else if(type == 'price' && that.defaultIndex == 1){
                    that.pairList.sort(that.$mkt.fallSort('price'));
                }else if(type == 'price' && that.defaultIndex == 2){
                    that.pairList.sort(that.$mkt.riseSort('price'));
                }else if(type == 'change' && that.defaultIndex == 1){
                    that.pairList.sort(that.$mkt.fallSort('gain_24'));
                }else if(type == 'change' && that.defaultIndex == 2){
                    that.pairList.sort(that.$mkt.riseSort('gain_24'));
                }else{
                    that.onChangeTab({name: 'USDT'},0);
                }
            },
            onSetFav(){
                let that = this;
                that.cur = -1;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url: 'api/v2/market?symbol=&onlyFav=1',
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                that.submiting = false;
                                that.pairList = response.data.data;
                            }else{
                                that.$mts.toast(that.$t('message.public.dataError'));
                            }
                        }
                    });
                }
            },
            onChangeTab(pair,index){
                console.log(this.pairList)
                let that = this;
                that.cur = index;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url: 'api/v2/market?symbol='+pair.name,
                        data:{},
                        success(response){
                            if(response.data.status == 200){

                                that.submiting = false;
                                let array = response.data.data;
                                setTimeout(()=>{
                                    if(that.defaultIndex > 0) {
                                        if(type == 'vol' && that.defaultIndex == 1){
                                            that.pairList = array.sort(that.$mkt.fallSort('vol'));
                                        }else if(type == 'vol' && that.defaultIndex == 2){
                                            that.pairList = array.sort(that.$mkt.riseSort('vol'));
                                        }
                                    } else {
                                        that.pairList = array;
                                    }
                                    localStorage.setItem('market', JSON.stringify(array));
                                },480)

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
    .flexContent {
        background-color: #E4EEEF;
    }
</style>