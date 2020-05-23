<template>
<div class="flexPage themePage">
    <div class="flexHead">
        <h3 class="quotesHead flexSpindle ">{{$t('nav.n2')}}</h3>
    </div>
    <div class="flexContent">
        <div class="secondMenus">
            <div class="menusHeader">
                <ul class="tab">
                    <li :class="{active: typeActive==-1}" @click="onChooseTab(-1)">{{$t('market.fav')}}<span></span></li>
                    <li v-for="(item,index) of markets" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index,item)">{{item}}<span></span></li>
                </ul>
            </div>
            <!-- 最新价{{vMarket}} -->
            <div class="tradeListTitle">
                <span>{{$t('home.l1')}}</span>
                <span>{{$t('home.l2')}}{{vMarket}}</span>
                <span>24H {{$t('home.l3')}}</span>
            </div>
        </div>
		
        <div>
            <loading />
            <nodata v-if="!rankingVO || rankingVO.length==0"></nodata>
            <ul class="coinlist" >
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
        </div>
    </div>
    <downbar/>
</div>
</template>
<script>
import downbar from "@/views/modules/downbar.vue";
export default {
    data(){
        return {
            typeActive:0,
            activeTab: '',
            rankingVO:[],
            polling:null,
            vRate: localStorage.getItem('rate')?localStorage.getItem('rate'):'CNY',
            rateVO:null
        }
    },
	beforeRouteLeave (to, from, next) {
	    clearInterval(this.polling);
	    next();
	},
    components:{downbar},
    watch:{
        "activeTab":function(cur,old){
            let that = this;
            if (cur) {
                if (cur == 'OWN') {
                    if (this.$store.state.isLogin) {
                        that.optional();
                    }
                } else {
                    that.ranking();
                }
            }   
        }
    },
    computed:{
        vMarket(){
            let that = this;
            if (that.typeActive == -1) {
                return '';
            }

            let n = that.activeTab?that.activeTab:''
            return '('+ n +')';
        },
        markets(){
            let that = this;
            let marketVO = that.$store.state.app.market;
            if(marketVO){
                that.activeTab = marketVO[0]
                // this.ranking();
            }
            return marketVO;
        }
    },
    beforeDestroy(){
        clearInterval(this.polling);
    },
    mounted(){
        //交易市场
        this.$mts.market()
        this.$mts.rates();
        this.$mts.checkLogin('clear');
        this.pageInit()
    },
    methods:{
        getClass(num){
            if(num>0){
                return "green"
            }else if(num<0){
                return "red"
            }else{
                return "normal"
            }
        },
        onChooseTab(index,item){
            this.typeActive = index;
            if(index == -1){
                this.activeTab = 'OWN';
				clearInterval(this.polling);
				this.polling = setInterval(()=>{
				    this.optional();
				}, 10000);
            }else{
                this.activeTab = item;
				clearInterval(this.polling);
				this.polling = setInterval(()=>{
				    this.ranking();
				}, 10000);
            }
        },
        pageInit(){
            if( this.activeTab && this.activeTab=='OWN'){
				// 设置定时请求
				this.optional();
				this.polling = setInterval(()=>{
				    this.optional();
				}, 10000);
            }else{
				// 设置定时请求
				this.ranking();
				this.polling = setInterval(()=>{
				    this.ranking();
				}, 10000);
			}
        },
        ranking(){
            let that = this;
            that.$mts.post({
                url:'quotation/ranking',
                data:{
                    market: that.activeTab
                },success(response){
                    if(response.data.code==200){
                        that.rankingVO = response.data.data;
                    }
                }
            });
        },
        optional(){
            let that = this;
            that.$mts.posts({
                url:'quotation/optional',
                data:{
                },success(response){
					that.rankingVO = [];
                    if(response.data.code==200){
						for(var key in response.data.data){
							that.rankingVO = that.rankingVO.concat(response.data.data[key]);
						}
                    }
					console.log(that.rankingVO)
                }
            });
        }
    }
}
</script>
