<template>
	<div class="drawPage">
		<van-popup v-model="$store.state.app.drawer.show" position="left" :duration=0.3>
			<div class="drawHead flexBothSidesVertical">
				<span>{{chooseType}}</span>
				<i class="iconfont iconlist_right" @click="$store.state.app.drawer.show = false"></i>
				<!-- <van-icon name="bars" @click="$store.state.app.drawer.show = false" /> -->
			</div>
			<div class="secondMenus quotesB">
				<!-- 标题切换 -->
				<div class="menusHeader">
					<van-tabs class="vanTab" v-model="active">
						<van-tab>
							<div slot="title">{{$t('market.fav')}}</div>
						</van-tab>
						<van-tab v-for="(item,index) in marketList" :key="index">
							<div slot="title">{{item.market}}</div>
						</van-tab>
					</van-tabs>
					<!-- 请不要删，保留的 -->
					<!-- <van-tabs class="vanTab">
						<van-tab>
							<div slot="title" @click="ranking('自选')">自选</div>
						</van-tab>
						<van-tab v-for="(item,index) in tabs" :key="index">
							<div slot="title" @click="ranking(item)">{{item}}</div>
						</van-tab>
					</van-tabs> -->
				</div>
				<!-- 内容切换 -->
				<div class="drawContent">
           			<nodata v-if="!rankingVO || rankingVO.length==0"></nodata>

					<ul class="drawUl" v-if="rankingVO  && vIndex == 0 && rankingVO.length>0" >
						<li class="flexSpindleVertical" v-for="(item,index) of rankingVO" :key="index"  @click="itemClick(item)">
							<b>{{market==$t('market.fav') ? item.symbol+"/"+item.market:item.symbol}}</b>
							<span v-html="$tdp.format(item,'close')"></span>
							<span v-html="$tdp.format(item,'changeRange')"></span>
						</li>
					</ul>

					<ul class="drawUl" v-if="rankingVO  && vIndex == 1 && rankingVO.length>0" >
						<li class="flexSpindleVertical" v-for="(item,index) of rankingVO" :key="index"  @click="itemClick(item)">
							<b>{{market==$t('market.fav')?item.symbol.replace('_','/'):item.symbol.split('_')[0]}}</b>
							<span v-html="$tdp.format(item,'cl')"></span>
							<span v-html="format(item,'changeRange')"></span>
						</li>
					</ul>
				</div>
			</div>
		</van-popup>

	</div>
</template>
<script>
export default {
	data(){
    	return{
    		rankingVO:[],
			marketList:[],
			// contractMarketList:[],
			market:this.$t('market.fav'),
			active: 0,
			secondsChoice:null,
			fav:[],
			vIndex:0,
    	}
    },
  	components:{},
  	watch:{
		"active":function(n,old){
			let that = this;
			if (that.marketList && that.marketList.length > 0) {
				that.rankingVO=[];
				if (n == 0) {
					that.ranking( that.$t('market.fav'))			
				} else {
					that.ranking( that.marketList[n - 1].market);
				}
			}
		},
		"$store.state.app.trade.chooseType":function(n,old){
			this.vIndex = n;
			this.rankingVO=[];
			this.markets();
		}
	},
  	computed:{
  		chooseType(){
  			switch(this.$store.state.app.trade.chooseType){
  				case 0:
  					return this.$t('trade.t1');
  				case 1:
  					return this.$t('home.i3');
  				default:
  					return this.$t('trade.t1');
  			}
  		} 
  	},
	mounted(){
		let type = this.$route.name;
		if (type == 'trade' && this.marketList && this.marketList.length <= 0) {
			this.markets();
		}
	},
	methods:{
		itemClick(item){
			this.$store.state.app.drawer.show = false;
			if(this.$store.state.app.trade.chooseType == 0){
				this.$store.state.symbol = item.symbol+'_'+item.market;
				this.$router.push({name:'trade',params:{symbol:item.symbol+'_'+item.market}})
			}else{
				this.$store.state.symbol = item.symbol;
				this.$router.push({name:'secondContract',params:{symbol:item.symbol}})
			}
		},
		ranking(param){
			var that = this;
			that.market = param;
			that.rankingVO = [];
			if(that.vIndex == 0 ){//币币
				if(param == this.$t('market.fav')){
					if(that.$store.state.isLogin){
						that.$mts.posts({
							url:'user/favor',
							data:{
							},success(response){
								if(response.data.code==200){
									that.rankingVO = response.data.data;
								}
							}
						});
					}
				}else{
					that.$mts.posts({
						url:'quotation/ranking',
						data:{
							"market":param
						},success(response){
							if(response.data.code==200){
								if(that.$store.state.app.trade.chooseType == 1 ){
									for(var key in response.data.data){
										if(that.secondsChoice[param].indexOf(response.data.data[key].symbol) > -1){
											that.rankingVO.push(response.data.data[key])
										}
									}
								}else{
									that.rankingVO = response.data.data;
								}
								
							}
						}
					});
				}
			}else {//秒合约
				if(param == this.$t('market.fav')){
					if(that.$store.state.isLogin){
						that.$mts.posts({
							url:'secondsContract/favor',
							data:{
							},success(response){
								if(response.data.code==200){
									that.fav = response.data.data;
								}
							}
						});
					}
				}else{
					that.$mts.posts({
						url:'second',
						data:{
							"market":param
						},success(response){
							if(response.data.code==200){
								that.rankingVO = response.data.data;
							}
						}
					});
				}
			}
			
		},
		markets(){
			var that = this;
			if(that.vIndex == 0 ){//币币
				that.$mts.post({
					url:'quotation/markets',
					data:{
					},success(response){
						if(response.data.code==200){
							that.marketList = response.data.data;
							if ( that.marketList.length > 0) {
								that.active = 1;
							}
						}
					}
				});
			}else{//秒合约
				that.$mts.get({
				    url:'/secondsContract/secondsQuery',
				    data:{
				    },
					success(response){
						if (response.data.code == 200) {
							let scmarkets = [];
							let array = response.data.data;
							for(var key in array){
								scmarkets.push({"market":key})
							}
							that.marketList = scmarkets;
							if (scmarkets.length > 0) {
								that.active = 1;
							}
						}
				    }
				});
			}
		},
		marketFormat(coinPair){
			// console.log(coinPair);
			return coinPair.split("_")[1];
		},
		format(item){
			let close = item.cl - item.op;
			return '<span class="' +
                this.$tdp.rangeClass( close) +'"> ' +
                // 显示值
                this.$tdp.fmtZero(close, 2)
                + '</span>';
		}
	}
}
</script>