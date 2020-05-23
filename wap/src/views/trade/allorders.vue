<template>
	<div class="flexPage themeColor">
		<div class="flexHead">
			<div class="chooseTradeType mini flexSpindle">
				<van-icon name="arrow-left" @click="$router.go(-1)"></van-icon>
				<span :class="[{active:tabIndex==0},'historyOrder']" @click="changeTab(0)">{{$t('trade.entrustNow')}}</span>
				<span :class="[{active:tabIndex==1},'historyOrder']" @click="changeTab(1)">{{$t('trade.entrustHistory')}}</span>
			</div>
		</div>
		<div class="dropDownMenus">
			<van-dropdown-menu active-color="#1789FA">
				<van-dropdown-item @change="screen" v-model="nowCoin" :options="chooseCoin" />
				<van-dropdown-item @change="screen" v-model="nowType" :options="chooseType" />
				<van-dropdown-item @change="screen" v-model="nowDate" :options="chooseDate" />
			</van-dropdown-menu>
		</div>
		<div class="flexContent">
            <nodata v-if="!list||list.length==0" />
			<ul class="assetsList">
				<van-pull-refresh v-model="submiting" @refresh="refresh">
					<van-list
						v-model="$store.state.app.loading"
						:finished="finished"
						@load="records(10)"
						:offset="50"
					>
						<loading slot="loading" />
						<li v-for="(item,index) of list" :key="index">
							<div class="assetsTop flexBothSidesVertical">
								<p class="assetsTopLeft">
									<span class="flexSpindle" :class="[item.direction=='BUY'?'green':'red','flexSpindle']">{{item.direction=="BUY"?$t('trade.buy'):$t('trade.sell')}}</span>
									<b>{{vCoin( item.symbol)}}</b>
									<span>{{item.time}}</span>
								</p>
								<p class="assetsTopRight">
									<span>{{vState(tabIndex,vRange(item))}}</span>
									<span class="rebackBtn" v-if="tabIndex!=1" @click="revoke(item)">{{$t('trade.withdrawal')}}</span>	
								</p>
							</div>	
							<div class="assetsDl three flexBothSidesVertical">
								<dl>
									<dt>{{$t('trade.entrustPrice')}}({{item.symbol.split('_')[1]}})</dt>
									<dd>{{item.price}}</dd>
								</dl>
								<dl>
									<dt>{{$t('trade.entrustNum')}}({{item.symbol.split('_')[0]}})</dt>
									<dd>{{item.num}}</dd>
								</dl>
								<dl>
									<dt>{{$t('trade.entrustAmount')}}({{item.symbol.split('_')[1]}})</dt>
									<dd>{{item.amount}}</dd>
								</dl>
							</div>
							<div class="assetsDl three flexBothSidesVertical" v-if="tabIndex==0">
								<dl>
									<dt>{{$t('trade.successDeal')}}({{item.symbol.split('_')[0]}})</dt>
									<!--这里的6 需要根据币种来获取小数位数-->
									<dd>{{$tdp.fmtZero(item.num - item.surolus,6)}}</dd>
								</dl>
								<dl>
									<dt>{{$t('trade.failedDeal')}}({{item.symbol.split('_')[0]}})</dt>
									<dd>{{item.surolus}}</dd>
								</dl>
								<dl>
									<dt>{{$t('trade.dealPercent')}}({{item.symbol.split('_')[0]}})</dt>
									<dd>{{$tdp.fmtZero((item.num - item.surolus)/item.num * 100,2)}}%</dd>
								</dl>
							</div>
						</li>	
					</van-list>
				</van-pull-refresh>
			</ul>
			
		</div>

		<!-- TODO: 用户授权 -->

		<van-dialog v-model="showAuth" class="assetsPop" @confirm="auth()"  :title="$t('trade.popup.fundpassword')" show-cancel-button :confirmButtonText="$t('button.otc.sure')" :cancelButtonText="$t('button.otc.cancel')">
			<div class=""><van-field class="assetInput" v-model="cipher" type="password" :placeholder="$t('trade.popup.p1')" /></div>
		</van-dialog>


		<!-- <van-popup v-model="showAuth">
			<div class="assetBox">
				<h5 class="center">{{$t('trade.popup.user')}}</h5>
				<div class="pt3 pb3"><van-field class="assetInput" v-model="cipher" type="password" :placeholder="$t('trade.popup.p1')" /></div>
				<van-button @click="auth" :loading="submiting" :loading-text="$t('trade.popup.warrant')" size="large" type="info">{{$t('trade.popup.warrant')}}</van-button>
			</div>
		</van-popup> -->
	</div>
</template>
<script>
export default {
	data(){
    	return {
    		submiting:false,
        	cipher:'',
        	showAuth:false,
    		tabIndex: 0,
    		nowCoin: "ALL",
		    nowType: 'ALL',
		    nowDate: 'ALL',
		    chooseCoin: [
		        { text: this.$t('trade.dropMenus.allCoin'), value: "ALL" }
		    ],
		    chooseType: [
		        { text: this.$t('trade.dropMenus.allType'), value: 'ALL' },
		        { text: this.$t('trade.buyIn'), value: 'BUY' },
		        { text: this.$t('trade.sellOut'), value: 'SELL' },
		    ],
		    chooseDate: [
		        { text: this.$t('trade.dropMenus.allTime'), value: 'ALL' },
		        { text: this.$t('trade.dropMenus.three'), value: '3D' },
		        { text: this.$t('trade.dropMenus.week'), value: '1W' },
		    ],
		    pageNum:0,
		    nowTotal:0,
			interval:null
    	}
    },
  	components:{},
  	watch:{
  		"tabIndex":function(cur,old){
  			if (cur != old) {
	  			this.pageNum = 0;
	  			this.$mts.initPage();
  			}
  		}
  	},
  	computed:{
  		list(){
  			return this.$store.state.app.vanList;
  		},
  		finished(){
  			return this.$store.state.app.finished;
  		}
  	},
	beforeRouteLeave (to, from, next) {
		if(this.interval){
			clearInterval(this.interval);
		}
	    next();
	},
	beforeDestroy(){
		this.$mts.initPage();
	},
	mounted(){
		let that = this;
		that.tabIndex = 0;
		that.pairs();// 货币配置
	},
	methods:{
		auth(){ // 交易授权
	      	let that = this;
	      	if ( !that.$vld.checkValue(that.cipher,'password')) {
	        	that.$toast(that.$t('validate.trade.coin.funderror'));
	        	return;
	     	}
	      	if (!that.submiting) {
	        	that.submiting = true;
	        	that.$mts.posts({
	            	url:'user/auth',
	            	data:{
	              		cipher: that.cipher
	            	},success(response){
	              		that.submiting = false;
	              		if (response.data.code==200) {
	                		that.$toast(that.$t('validate.trade.coin.success'));
	                	that.showAuth = false;
	              	}
	            }
	        });
	      }
	    },
		revoke(item){
	       	let that = this;
	        if(that.submiting)return
	        that.submiting = true
	        that.$mts.posts({
	            url:'order/revoke',
	            data:{
	              id: item.id,
	              type:item.direction,
	              symbol: item.symbol
	            },success(response){
	              that.submiting = false
	              if (response.data.code == 401) {
	                that.showAuth = true;
	              } else if( response.data.code == 200) {
	                that.$toast(that.$t('validate.trade.coin.withdrawalSuc'));
	                that.endRevoke();
	              }
	            }
	        });
 		},
  		digit(symbol){
  			let market = symbol.split('_')[1];
  			let token = this.$store.state.coin[market]
  			if ( token && token.digit) {
  				return token.digit[0];
  			}
  			return 8;
  		},
		vState(index,range){
			range = Math.ceil(range.replace("%",""));
			if(Math.ceil(range)>0){
				return index == 0 ? this.$t('trade.someDeal') : this.$t('trade.successDeal');
			}else{
				return index == 0 ? this.$t('trade.failedDeal') : this.$t('trade.successDeal');
			}
		},
		vCoin(symbol){
			return !symbol ? '' : symbol.replace('_', '/');
		},
		vSymbol(symbol){
			return !symbol ? '' : symbol.replace('_', '-');
		},
		vRange(item){
			let already = item.num - item.surolus;
			return Number((already / item.num) * 100).toFixed(2) + '%';
		},
		changeTab(n){
			if(this.tabIndex != n){
				this.tabIndex = n;
				this.pageNum = 0;
			}
		},
		refresh(){
			let that = this;
			that.pageNum = 0;
            that.$mts.initPage();
            that.$store.state.app.loading = true;
            that.records(2);
		},
		pairs(){
			let that = this;
			that.$mts.get({
				url:'pairs',
				data:{},
				success(response){
					if (response.data.code==200) {
						let list = response.data.data;
						for (let idx = 0; idx < list.length; idx ++) {
							that.chooseCoin.push({
								text: list[ idx],
								value: list[ idx]
							});
						}
					}
				}
			});
		},
		records(p){
			let that = this;
			that.pageNum ++;
			that.$mts.posts({
				url:'order/actives',
				data:{
					pageNum: that.pageNum,
					type: that.nowType,
					coinPair: that.nowCoin.replace(/\//g,"_"),
					scope: that.nowDate,
					tabIndex: that.tabIndex
				},success(response){
					if (response.data.code==200) {
						that.submiting = false;
						that.nowTotal = response.data.data.total;
						that.$mts.loading( response.data.data);
					}
				}
			});
		},
		screen(){
  			this.pageNum = 0;
  			this.$mts.initPage();
			this.records(3);
		},
		endRevoke(){
			let that = this;
			that.interval = setInterval(()=>{
				that.$mts.posts({
					url:'order/actives',
					data:{
						pageNum: 1,
						type: that.nowType,
						coinPair: that.nowCoin.replace(/\//g,"_"),
						scope: that.nowDate,
						tabIndex: that.tabIndex
					},success(response){
						if (response.data.code==200) {
							let length = response.data.data.total;
							if ( length < that.nowTotal) {
								clearInterval( that.interval);
								that.refresh();
							}
						} else {
							clearInterval( interval);
							that.refresh();
						}
					}
				});
			}, 1000);
		},
		
	}
}
</script>
