<template>
	<div class="tradeContainer" :class="{openSideBar:$store.state.app.drawer.show}">
		<div class="tradeMain">
			<div class="flexPage">
				<div class="flexHead">
					<div class="tmHead">
						<div class="tmhLeft">
							<van-icon name="arrow-left" @click="$router.push({name:'trade',params:{'symbol': $store.state.symbol}})" />
							<b>{{$t('home.i3')}} - {{coin}}/{{market}}</b>
						</div>
						<div class="tmhRight">
							<van-icon name="replay" @click="reload()" />
							<i class="iconfont iconlist_left" @click="showDrawer()"></i>
							<icons name="more" type="ios" @click.native="popMenu.show = true" />
						</div>
					</div>
					<div class="tmInfo">
						<div class="tmiLeft">
							<div class="leftTop"><p><b class=" tmiLeftBold" :class="tick.close>tick.open?'buycolor':'sellcolor'">{{tick.close}}</b><span class="mhArrow" :class="tick.close>tick.open?'buycolor':'sellcolor'">{{tick.close>tick.open?"↑":"↓"}} </span></p><span class="mhText">≈{{raestzh}}CNY</span></div>
							<div class="riseInfo  " :class="tick.close>tick.open?'buycolor':'sellcolor'"> <span>{{tick.close>tick.open ? $t('trade.sec.rise') : $t('trade.sec.fall')}} </span> <span class="ml2 " >{{isNaN(Number(Math.abs(tick.close-tick.open)).toFixed(3))?0:Number(Math.abs(tick.close-tick.open)).toFixed(3)}}</span> </div>
						</div>
						<div class="tmiRight">
							<div><span>{{'24h' + $t('trade.sec.high')}}</span><b>{{tick.high}}</b></div>
							<div class="mt3"><span>{{'24h' + $t('trade.sec.low')}}</span><b>{{tick.low}}</b></div>
						</div>
					</div>
				</div>
				<div class="flexContent">
					<div class="tradingViewBox dark">
						<!-- 分时线 -->
						<!-- <div class="tradingViewHead bt dark">
							<span :class="item.ratio == interval?'active':''" v-if="index<=4" v-for="(item,index) of resolutions" :key="index"
								@click="changeTv(item.ratio)">
								{{item.name}}
							</span>
							<span @click="times.show = true" :class="{active:(interval=='1D'||interval=='1W')}">{{$t('trade.sec.more')}}</span>
						</div> -->
						<van-loading color="#1989fa" v-if="tvloading" />
						<div class="trade-view" id="tvbox" style="height:50vh;">
							
						</div>

						<div class="bt dark">
							<div class="tradeTitle" style="borderBottom: 1px solid #081823">
								<b style="color:#A2AEBF;">{{$t('trade.sec.order')}}</b>
								<span @click="clickMore()" style="color:#A2AEBF;">{{$t('trade.all')}}</span>
							</div>
							<div class="tradeHistory">
								<loading />
            					<nodata v-if="!recordings||recordings.length==0" />
								<ul class="ordersList contractList" v-if="recordings&&recordings.length>0">
									<li v-if="item.coinPair == coin+'_'+market && !item.hide" v-for="(item,index) of recordings" :key="index" style="borderBottom: 1px solid #081823">

										<div class="orderTitle">
											<div>
												<b :class="item.type == 1?'greenColor':'redColor' ">{{item.type == 1? $t('trade.sec.buyUp'):$t('trade.sec.buyDown') }}</b>
												<b class="ml1">{{item.coinPair.replace(/_/g,"/")}}</b>
												<span class="orderDate">{{$tool.dataFormat(new Date(item.dealingTime),'yyyy-MM-dd hh:mm:ss')}}</span>
											</div>
											<span class="orderStatus">
												<span><van-count-down @finish="finishMe(item,index)" style="color:#fff;" :time="item.countDownTime*1000" /></span>
											</span>
										</div>
										<div class="assetsDl three constactDl">
											<dl>
												<dt>{{$t('trade.sec.investAmount')}}({{item.payCoin}})</dt>
												<dd>{{item.price}}</dd>
											</dl>
											<dl>
												<dt>{{$t('trade.sec.openDate')}}</dt>
												<dd>{{item.section/60}}M</dd>
											</dl>
											<dl>
												<dt>{{$t('trade.sec.profit')}}</dt>
												<dd>{{item.profit}}</dd>
											</dl>
										</div>
										<div class="assetsDl three constactDl">
											<dl>
												<dt>{{$t('trade.sec.nowPrice')}}({{item.coinPair.split("_")[1]}})</dt>
												<dd>{{tick.close}}</dd>
											</dl>
											<dl>
												<dt>{{$t('trade.sec.buyPrice')}}({{item.coinPair.split("_")[1]}})</dt>
												<dd>{{item.startPrice}}</dd>
											</dl>
											<dl>
												<dt>{{$t('trade.sec.expected')}}({{item.priceCion}})</dt>
												<dd>{{item.price*item.profit*0.01}}</dd>
											</dl>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="secondBtn shadow">
					<div class="secondOrders" @click="orderlist.show = true">
						<dl>
							<dt>{{payNum}}</dt>
							<dd>{{$t('trade.number')}}</dd>
						</dl>
						<dl>
							<dt>{{isNaN(secondsSections[secondsSectionsIndex]/60)?"0":secondsSections[secondsSectionsIndex]/60}}M</dt>
							<dd>{{$t('trade.sec.time')}}</dd>
						</dl>
						<dl>
							<dt>{{secondsProfit[secondsSectionsIndex]}}%</dt>
							<dd>{{$t('trade.sec.get')}}</dd>
						</dl>
						<van-icon name="arrow-down" />
					</div>
					<div class="buyup" @click="submitw(1)">{{$t('trade.sec.buyUp')}}</div>
					<div class="buydown" @click="submitw(2)">{{$t('trade.sec.buyDown')}}</div>
				</div>
			</div>

			<!--下单-->
			<!-- <van-dialog v-model="book.show" show-cancel-button @confirm="submitq()" :confirmButtonText="$t('button.otc.sure')" :cancelButtonText="$t('button.otc.cancel')">
				<div class="secPop">
					<h5>{{payType==1? $t('trade.sec.buyUp'):$t('trade.sec.buyDown')}} - {{payCoin}}</h5>
					<van-cell-group class="mt3">
						<van-cell :title="$t('trade.sec.payPrice')" :value="tick.close" />
						<van-cell :title="$t('trade.sec.tradeNum')" :value="payNum" />
						<van-cell :title="$t('trade.sec.timeLong')" :value="section/60+'M'" />
						<van-cell :title="$t('trade.sec.get')" :value="secondsProfit[secondsSectionsIndex] + '%' " />
					</van-cell-group>
				</div>
			</van-dialog> -->
			
			<van-dialog v-model="$store.state.user.auth.show" @confirm="auth()"  :title="$t('trade.popup.fundpassword')" show-cancel-button :confirmButtonText="$t('button.otc.sure')" :cancelButtonText="$t('button.otc.cancel')">
				<div class="pt3 pb3"><van-field class="assetInput" v-model="cipher" type="password" :placeholder="$t('trade.popup.p1')" /></div>
			</van-dialog>

			<!-- 下单列表 -->
			<van-popup v-model="orderlist.show" :round="false" position="bottom" class="downToUp constactPopup">
				<div class="secOrderBox">
					<div class="secOrderBoxCon">
						<div>
							<div class="secTitle">{{$t('trade.sec.openType')}}</div>
							<div class="secSel mt1">

								<span @click="payCoin = vTradeMarket;payNum = ''" :class="{ active: payCoin==vTradeMarket }" >{{vTradeMarket}}</span>
								<span @click="payCoin = vTradeCoin;payNum = ''" :class="{ active: payCoin==vTradeCoin }">{{vTradeCoin}}</span> 
							</div>
							<div class="secTitle mt3">{{$t('trade.sec.openNum')}}</div>
							<div class="secSel mt1" >
								<span  v-if="secondsCoinPair[0] == payCoin" v-for="(item,index) of secondsCoinNums" :key="index"  :class="{ active: payNum==item }" @click="payNum = item">{{item}}</span>
								<span  v-if="secondsCoinPair[1] == payCoin" v-for="(item,index) of secondsMarketNums" :key="index"  :class="{ active: payNum==item }" @click="payNum = item">{{item}}</span>
							</div>
							<div class="secTitle mt3">{{$t('trade.sec.openDate')}}</div>
							<div class="secSel mt1" >
								<span v-for="(item,index) of secondsSections" :key="index" :class="{ active: section==item }" @click="section=item;secondsSectionsIndex = index">{{item/60}}M</span>
							</div>
							<div class="secFlex mt3">
								<div>{{$t('trade.sec.myFund')+':'}}<b>{{balance}}</b> {{payCoin}}</div>
								<div>{{$t('trade.sec.get')+':'}}<b class="buycolor">{{secondsProfit[secondsSectionsIndex]}}%</b></div>
							</div>
							<div class="mt3 secPopBtn">
								<van-button @click="submit(1)">{{$t('trade.sec.buyUp')}}</van-button>
								<van-button @click="submit(2)">{{$t('trade.sec.buyDown')}}</van-button>
							</div>
						</div>
					</div>
				</div>
			</van-popup>
			<van-action-sheet class="dark" v-model="popMenu.show" :actions="popMenu.actions" @select="onMenuSelect" />
			<van-action-sheet class="dark" v-model="times.show" :actions="times.actions" @select="onMenuSelect" />
		</div>
		<drawer />
	</div>
</template>
<script>
	import drawer from "@/views/modules/drawer";
	import number from "@/views/modules/number.vue";
	import datafeeds from '@/assets/js/datafees.js'
	
	//id:首次请求,历史数据
	//id3:实时数据,订阅
	//id100:之后被动加载更久的历史数据
	export default {
		data() {
			return {
				tvloading:false,
				tabActive: 0,
				tradeTypeBuy: false,
				book: {
					percent: 0,
					amount: 0,
					show: false
				},
				orderlist: {
					show: false
				},
				cipher:'',
				popMenu: {
					show: false,
					actions: [{
							name: this.$t('assets.index.n1'),
							value: "deposit"
						},
						{
							name: this.$t('assets.index.n3'),
							value: "transfer"
						},
						{
							name: this.$t('trade.add')+'/'+this.$t('trade.cancelChoice'),
							value: "fav"
						}
					]
				},
				times: {
					show: false,
					actions: [
						// {
						// 	name: '8' + this.$t('trade.canvas.h2'),
						// 	value: 28800,
						// 	ratio: '480'
						// },
						{
							name: '1' + this.$t('trade.canvas.day'),
							value: 86400,
							ratio: '1D'
						},
						{
							name: '1' + this.$t('trade.canvas.week'),
							value: 604800,
							ratio: '1W'
						},
					],
				},
				resolutions: [
					// {
					// 	name: this.$t('trade.canvas.times'),
					// 	value: 60,
					// 	ratio: '1'
					// },
					{
						name: '5' + this.$t('trade.canvas.min'),
						value: 300,
						ratio: '5'
					},
					{
						name: '15' + this.$t('trade.canvas.min'),
						value: 900,
						ratio: '15'
					},
					{
						name: '30' + this.$t('trade.canvas.min'),
						value: 1800,
						ratio: '30'
					},
					{
						name: '1' + this.$t('trade.canvas.h'),
						value: 3600,
						ratio: '60'
					},
					{
						name: '8' + this.$t('trade.canvas.h2'),
						value: 28800,
						ratio: '480'
					},
					{
						name: '1' + this.$t('trade.canvas.day'),
						value: 86400,
						ratio: '1D'
					},
					{
						name: '1' + this.$t('trade.canvas.week'),
						value: 604800,
						ratio: '1W'
					},
				],
				heartbeat:null,
				//秒合约配置选项
				secondsContract:{},
				secondsCoinNums:[],
				secondsCoinPair:[],
				secondsContractId:'',
				secondsMarketNums:[],
				secondsProfit:[],
				secondsSections:[],
				secondsSectionsIndex:0,//选择时间的下标和利率联动
				payCoin:'',//下单的币种BTBT或USDT
				payNum:0,//下单数量()
				section:'60',//时间区间
				payType:null,//买涨1买跌2
				openTime:"",
				//秒合约配置选项end
				recordings: [],//秒合约进行中的订单
				
				scwebsocket: null,//秒合约ws,用于接收订单持仓种订单完成信息
				// hbsocket: new socket(),//接收火币数据的
				tick:{},//火币实时数据
				
				// period:0,//k线周期index
				// hbPeriodM: ["1", "5", "15", "30", "60"],//k线周期分钟
				//tv
				tvWidget: null,//tv图标对象
				datafeeds: new datafeeds(this),
				symbol: null,//商品
				interval: 1, // 默认订阅的 分辨率
				getBarTimer: null,
				isLoading: true,
				vTradeCoin:'',
				vTradeMarket:'',
				bars:[],
				vTfromCurrent:0,
				cacheData:{},
				lastTime:null,
				finishTimeout:null
			}
		},
		beforeRouteLeave (to, from, next) {
			let that = this;
			window.TradingView = null;
			$("#tvbox").html("");
			that.$route.params.symbol = "";
			that.$store.state.symbol = "";
			clearInterval(this.interval);

			$("#app").append('<div id="tvbox" class="tvbox"></div>')
		    next();
		},
		components: {
			number,
			drawer
		},
		watch: {
			"$store.state.symbol":function(cur,old){
				let that = this;
				that.bars=[];
				if (cur && cur != old) {
					that.dataInit();
				}
			},
			"secondsContract":function(cur,old){
				let that = this;
				if (cur) {
					let array = that.secondsContract.symbol.split('_');
				}
			}
		},
		computed: {
			coinPair() {
				return this.$store.state.symbol;
			},
			coin() {
				return this.$mts.getVs(this.$store.state.symbol, 0);
			},
			market() {
				return this.$mts.getVs(this.$store.state.symbol, 1);
			},
			raestzh(){
				if(!this.$store.state.rates
					|| !this.market ){
					return 0;
				}
				if(this.$store.state.rates[this.market][0]){
					let n = Number(this.$store.state.rates[this.market][0].last 
						* this.tick.close).toFixed(3)
					return isNaN(n)?0:n;
				}else{
					return 0;
				}
			},
			balance(){
				if(!this.$store.state.ws.capital || !this.$store.state.isLogin || !this.$store.state.ws.capital[this.payCoin]){
					return '--';
				}
				return this.$store.state.ws.capital[this.payCoin].balanceT;
			}
		},
		mounted() {
			$(".tvbox").remove()
        	this.$mts.rates(); 
			this.dataInit()
		},
		beforeDestroy() {
			window.TradingView = null;
			$("#tvbox").html("")
			clearInterval(this.interval);
		},
		methods: {
			finishMe(item,index){
				let that = this;
				this.recordings[index].hide = true
				// if(this.finishTimeout){
				// 	clearTimeout(this.finishTimeout);
				// }
				// setTimeout(()=>{
				// 	that.activeings()
				// },1000)

				// this.finishTimeout = setTimeout(()=>{
				// 	that.activeings()
				// },10000)
			},
			reload(){
				window.location.reload();
			},
			dataInit(){
				let that = this;
				that.$mts.checkLogin('clear',(res)=>{
					that.$store.state.symbol = that.$route.params.symbol;
					that.symbol = that.$route.params.symbol;
					that.initTv();
					that.initscWs();//订阅火币转发数据
					that.secondContract();
					that.datafeeds = new datafeeds( that);

					if(that.$store.state.isLogin){
						that.activeings();
						this.details();;
					}
					clearInterval(this.interval);
					this.interval = setInterval(()=>{
						if(that.$store.state.isLogin){
							this.details();
						}
						this.initscWs();
					}, 1000)
				})
			},
			// 分时配置
			changeTv(interval) {
				// 取消原有订阅
				window.udf.unsubscribeBars(this.getListenerGUID());

				this.interval = interval;
				const thats = window.tvWidget;
				if (interval === '1') {
					thats.chart().setChartType(3);
				} else {
					thats.chart().setChartType(1);
				}
				// 更新数据
				thats.chart().setResolution(interval, function onReadyCallback() {});
			},
			initscWs(){
				let that = this;
			   	that.$mts.post({
			   		url:'trade/sc/ticker',
			   		data:{
			   			symbol: that.$store.state.symbol
			   		},success(response){
			   			if (response.data.code==200) {
			   				that.tick = response.data.data;
			   			}
			   		}
			   	});
			},
			activeings(){ //进行中的秒合约订单
				let that = this;
				that.$mts.posts({
					url: '/secondsContract/activeings',
					data: {},
					success(response) {
						if (response.data.code == 200) {

							that.recordings = response.data.data;
						}
					}
				});
			},
			secondContract(){ //秒合约配置
				let that = this;
				that.$mts.posts({
					url:'/secondsContract/query',
					data:{
						symbol:that.coin+"_"+that.market
					},
					success(response){
						if(response.data.code == 200){
							that.secondsContract = null;
							that.secondsCoinNums = null;
							that.secondsCoinPair = null;
							that.secondsContractId = null;
							that.secondsMarketNums = null;
							that.secondsProfit = null;
							that.secondsSections = null;
							that.secondsContract = response.data.data;
							// console.log(that.secondsContract)
							if(that.secondsContract){
								that.secondsCoinNums = that.secondsContract.coinNums.split(',');
								that.secondsCoinPair = that.secondsContract.symbol.split('_');
								that.secondsContractId = that.secondsContract.id;
								that.secondsMarketNums = that.secondsContract.marketNums.split(',');
								that.secondsProfit = that.secondsContract.profit.split(',');
								that.secondsSections = that.secondsContract.sections.split(',');
								that.openTime = that.secondsContract.openTime;
								that.vTradeCoin = that.secondsCoinPair[0];
								that.vTradeMarket = that.secondsCoinPair[1];
								that.payCoin = that.secondsCoinPair[0];
								// that.payCoin = that.secondsCoinPair[1];
								that.payNum = Math.min.apply(null, that.secondsCoinNums);

								//切换到USDT
								that.payCoin = that.secondsCoinPair[1];
								that.payNum = Math.min.apply(null, that.secondsMarketNums);


							}
						}
					}
				});
			},
			showDrawer() {
				this.$store.state.app.drawer.show = true
				this.$store.state.app.trade.chooseType = 1;
			},
			auth(){ // 交易授权
				let that = this;
				if ( !that.$vld.checkValue(that.cipher,'password')) {
					that.$toast(that.$t('validate.trade.coin.funderror'));
					return false;
				}
				that.$mts.posts({
					url:'user/auth',
					data:{
						cipher: that.cipher
					},
					success(response){
						if (response.data.code==200) {
							that.$toast(that.$t('validate.trade.coin.success'));
							that.$store.state.user.auth.show = false;
						}
					}
				});
			},
			submit(value) {//押注请求
				let that = this;
				that.payType = value;
				if(that.payNum == 0){
					that.$toast(that.$t('validate.trade.coin.betNum'));
					return false;
				}
				that.$mts.posts({
					url: 'secondsContract/stake',
					data: {
						secondsContractId: that.secondsContractId,
						type: that.payType,
						price: that.payNum,
						coinPair: that.coin+"_"+that.market,
						payCoin: that.payCoin,
						section: that.section
					},
					success(response) {
						if (response.data.code == 401) {
							that.$store.state.user.auth.show = true; //需要输入资金密码
						} else if (response.data.code == 200) {
							that.orderlist.show = false;
							that.details();
							that.$toast(that.$t('validate.trade.coin.betSuccess'));
							that.activeings();
						}
					}
				});
			},
			submitw(value) {//押注
				let that = this;
				if(that.$store.state.isLogin){
					that.payType = value;
					if (value==1) {
						that.submitq();
					} else{
						that.submitq();
					}
				}else{
					that.$toast(that.$t('validate.public.signin'));
				}
			},
			submitq() {//确认押注
				let that = this;
				that.orderlist.show = false;
				if(that.payNum == 0){
					that.orderlist.show = true;
					return false;
				}
				let map = that.$store.state.ws.capital;
				that.$mts.posts({
					url: 'secondsContract/stake',
					data: {
						secondsContractId: that.secondsContractId,
						type: that.payType,
						price: that.payNum,
						coinPair: that.coin+"_"+that.market,
						payCoin: that.payCoin,
						section: that.section
					},
					success(response) {
						if (response.data.code == 401) {
							that.$store.state.user.auth.show = true; //需要输入资金密码
						} else if (response.data.code == 200) {
							that.activeings();

							that.$toast(that.$t('validate.trade.coin.betSuccess'));
						}
					}
				});
			},
			onMenuSelect(item) {
				switch (item.value) {
					case "deposit":
						this.$router.push({
							name: "deposit"
						})
						break;
					case "transfer":
						this.$router.push({
							name: "transfer"
						})
						break;
					case "fav":
						if (this.$store.state.isLogin) {
							const that = this;
							that.$mts.posts({
								url: 'user/optional',
								data: {
									symbol: that.coin + "_" + that.market
								},
								success(response) {
									if (response.data.code == 200) {
										that.$mts.favor(() => {
											that.$toast(that.$t('validate.success'))
										});
									} else {
										// 失败
										that.$toast(response.data.message);
									}
								}
							});
						} else {
							// 去登陆
							this.$router.push({
								name: 'signin',
								query: {
									path: 'secondContract/' + that.coin + "_" + that.market
								}
							});
						}
						break;
				}
			},
			clickMore() {
				this.$mts.goto("secondContractOrders")
			},
			//tv
			initTv() {
				// let scripts = [
				// 	"/charting_library/charting_library.min.js?v=" + this.$mts.v,
				// ];
				// let _self = this;
				// this.$mts.seriesLoadScripts(scripts, () => {
				// 	this.init();
				// });

				//that.orderlist.show = false;

				let scripts = [
					"https://s3.tradingview.com/tv.js"
				];
				   
				let that = this;
				this.$mts.seriesLoadScripts(scripts,()=>{
				    window.TradingView = new TradingView.widget(
					  	{
						  	"autosize": true,
						  	"symbol": "HUOBI:" + that.symbol.replace('_',''),
						  	"interval": "1",
						  	"timezone": "Asia/Shanghai",
						 	"theme": "Dark",
						  	"style": "1",
						  	"locale": "zh_CN",
						  	"toolbar_bg": "#f1f3f6",
						  	"enable_publishing": false,
						  	"hide_top_toolbar": false,
						  	"save_image": false,
						  	"hide_legend": true,
						  	"container_id": "tvbox"
						}
				    );
				    // if(that.$route.name != 'secondContract'){
				    // 	window.TradingView.remove()
				    // }
				},'tvb');
			},
			//tv
			init() {
				let that = this;
			  	if (!that.tvWidget) {
			    	that.tvWidget = new TradingView.widget({
				      width: "100%",
				      height: "100%",
				      fullscreen: false,
				      autosize: true,
				      timezone: "Asia/Shanghai",
				      symbol: that.symbol,
				      interval: 1, // 周期
				      container_id: "tvbox",
				      datafeed: that.datafeeds,
				      library_path: "/charting_library/",
				      locale: "en",
				      toolbar_bg: "#000",
				      drawings_access: {
				        type: 'black',
				        tools: [{
				          name: "Regression Trend",
				          grayed: true
				        }]
				      },
				      disabled_features: [
				        'header_symbol_search',
				        "use_localstorage_for_settings",
				        "left_toolbar",
				        'legend_context_menu',
				        "border_around_the_chart",
				        "timeframes_toolbar",
				        "volume_force_overlay",
				        "pane_context_menu",
				        "header_symbol_search",
				        "symbol_search_hot_key",
				        "header_undo_redo",
				        "header_compare",
				        "header_chart_type",
				        "header_screenshot",
				        "header_resolutions",
				        "header_widget",
				        "control_bar",
				        "adaptive_logo",
				        "display_market_status",
				        "pane_controls"
				      ],
				      enabled_features: [],
				      charts_storage_api_version: "1.1",
				      overrides: { //画布
				        "paneProperties.background": "#121b31", //整体画布背景
				        "paneProperties.vertGridProperties.color": "#555", //画布竖线颜色
				        "paneProperties.horzGridProperties.color": "#555", //画布横线颜色
				        "symbolWatermarkProperties.transparency": 90,
				        "scalesProperties.textColor": "#ccc", //画布文字颜色
				        "mainSeriesProperties.candleStyle.upColor": "#03be87", //涨
				        "mainSeriesProperties.candleStyle.downColor": "#e66b41", //跌
				
				        "mainSeriesProperties.candleStyle.borderColor": "#333",
				        "mainSeriesProperties.candleStyle.borderUpColor": "#03be87",
				        "mainSeriesProperties.candleStyle.borderDownColor": "#e66b41",
				
				        "linetoolicon.color": 'rgba( 0, 0, 0, 1)',
				
				        'paneProperties.vertGridProperties.style': 0,
				        'paneProperties.horzGridProperties.color': 'rgba(0,0,0,0)',
				        'paneProperties.vertGridProperties.color': 'rgba(0,0,0,0)',
				
				        "paneProperties.legendProperties.showLegend": false
				      },
				      studies_overrides: { //画布底部绘图区域
				        "volume.volume.color.0": "#e66b41",
				        "volume.volume.color.1": "#03be87",
				        "volume.volume.transparency": 70,
				        "volume.volume ma.color": "#FF0000",
				        "volume.volume ma.transparency": 30,
				        "volume.volume ma.linewidth": 5,
				        "volume.show ma": true,
				        "bollinger bands.median.color": "#33FF88",
				        "bollinger bands.upper.linewidth": 7
				      }
				    })
			  }
			},
			
			// sendMessage(data) {
			//   if (this.hbsocket.checkOpen()) {
			//     this.hbsocket.send(data)
			//   } else {
			//     this.hbsocket.on('open', () => {
			//       this.hbsocket.send(data)
			//     })
			//   }
			// },
			// unSubscribe() {
			//     this.sendMessage({"unsub": "market."+(this.coin+this.market).toLowerCase()+".kline."+this.hbPeriodM[this.period]+"min","id": "id3"})
			// },
			// subscribe() {
			//   	this.sendMessage({"sub": "market."+(this.coin+this.market).toLowerCase()+".kline."+this.hbPeriodM[this.period]+"min","id": "id3"})
			// },
			// onMessage(data) {
			// 	let that = this;
			// 	// console.log(data)
			//   	if(data.status == "error"){
			// 	  	return false;
			//   	}
			//   	
			//   	if(data.id == "id"){//获取的是历史数据
			//   		let ticker = that.symbol + "-" + that.hbPeriodM[that.period];
			//     	let bars = data.data.map(el => {
			//           	return {
			//            		time: el.id * 1000, 
			//            		low: el.low,
			//            		high: el.high,
			//            		open: el.open,
			//            		close: el.close,
			//            		volume: el.vol
			//           	}
			//     	})
			//     	that.bars = bars; //+ that.bars;
			//     	that.cacheData[ticker] = bars;
   //             	 	that.lastTime = bars[bars.length - 1].time
			// 		
			//     	that.hbsocket.send({"sub": "market."+(this.coin+this.market).toLowerCase()+".kline."+that.hbPeriodM[that.period]+"min","id": "id3"})//获取实时数据
			//   	} 
			// 	else if(data.id == "id100") {//加载老的
			// 		let ticker = that.symbol + "-" + that.hbPeriodM[that.period];
			// 		let bars = data.data.map(el => {
			// 		  	return {
			// 		   		time: el.id * 1000, 
			// 		   		low: el.low,
			// 		   		high: el.high,
			// 		   		open: el.open,
			// 		   		close: el.close,
			// 		   		volume: el.vol
			// 		  	}
			// 		})
			// 		console.log(bars)
			// 		that.bars = bars.concat(that.bars)
			// 	} 
			// 	else {//收到实时数据
			// 		if(!data.tick){return false;}
			// 		that.tick = data.tick;
			// 		that.datafeeds.barsUpdater.updateData()
			// 		let ticker = that.symbol + "-" + that.hbPeriodM[that.period];
   //                  let barsData = {
   //                      time: that.tick.id * 1000,
   //                      open: data.tick.open,
   //                      high: data.tick.high,
   //                      low: data.tick.low,
   //                      close: data.tick.close,
   //                      volume: data.tick.vol
   //                  }
   //                  if (barsData.time >= that.lastTime && that.cacheData[ticker] && that.cacheData[ticker].length) {
   //                      that.cacheData[ticker][that.cacheData[ticker].length - 1] = barsData;
   //                  }
			//   	}
			// },
			
			getBars(symbolInfo, resolution, from, to, onLoadedCallback, onErrorCallback, firstDataRequest) {
				let that = this;
				// let ticker = 'btcusdt1min';
				// var newBars = []
    //             this.bars.forEach(item => {
    //                 if (item.time >= from * 1000 && item.time <= to * 1000) {
    //                     newBars.push(item)
    //                 }
    //             });
				onLoadedCallback(that.bars)
				// if(!this.getBarTimer){
				// 	var self = this
				// 	this.getBarTimer = setTimeout(function() {
				// 		self.getBars(symbolInfo, resolution, from, to, onLoadedCallback, onErrorCallback, firstDataRequest)
				// 	}, 300)
				// }
			},

			historyTicker(from, to){//240条k线数据,1分钟的周期
				let that = this;
				that.$mts.posts({
					url: '/huobi/history',
					data: {
						symbol:that.coin + "_" + that.market,
						size: 300,
						period:"1min",
						from: (!from ? "" : from),
						to: (!to ? "" : to)
					},
					success(response) {
						if (response.data.code == 200) {
							let ticker = 'btcusdt1min';
							let list = response.data.data.map(el => {
							  	return {
							   		time: el.id * 1000, 
							   		low: el.low,
							   		high: el.high,
							   		open: el.open,
							   		close: el.close,
							   		volume: el.vol
							  	}
							});
							// 最后一次请求数据
							// console.log(that.cacheData[ticker]);
							that.bars = list;
							that.datafeeds.barsUpdater.updateData();
							// if ( !that.cacheData[ticker]) {
							// 	that.cacheData[ticker] = list;
							// 	that.lastTime = list[0].time / 1000;
							// } else {
							// 	let cLastTime = list[0].time / 1000;
							// 	let cPrevTime = that.cacheData[ticker][0].time / 1000;
							// 	// console.log(cLastTime, cPrevTime);
							// 	if (cPrevTime < cLastTime) {
							// 		that.cacheData[ticker] = that.cacheData[ticker].concat(list);
							// 	}
							// 	that.lastTime = list[0].time / 1000;
							// }
							// console.log( that.lastTime);
						}
					}
				});	
			},
			details(){
				let that = this;
	            that.$mts.posts({
	                url:'wallet/details',
	                data:{}, 
	                success(response){
	                    if(response.data.code == 200){
	                    	let map = {};
	                    	let array = response.data.data;
	                    	for(let idx = 0;idx < array.length;idx ++){
	                    		map[array[idx].token] = array[idx];
	                    	}
	                        that.$store.state.ws.capital = map;
	                    }
	                }
	            });
			}
		}
	}
</script>