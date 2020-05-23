<template>
	<div class="tradeMain">
		<div class="flexPage">
			<div class="flexHead">
				<div class="tmHead">
					<div class="tmhLeft">
						<van-icon name="arrow-left" @click="$mts.goto('coinlist')" />
						<b>{{coin}}/{{market}}</b>
					</div>
					<div class="tmhRight">
						<van-icon @click="addFav(false)" name="star-o" v-if="!isFav" />
						<van-icon @click="addFav(true)" name="star" v-if="isFav" class="active" />
					</div>
				</div>
				<div class="tmInfo">
					<div class="tmiLeft">
						<div class=""><b class="buycolor tmiLeftBold">{{close}}</b> {{money}}</div>
						<div class="mt1">{{$t('home.sl')}} 
							<b class="lightest" v-html="$tdp.format(tick,'total',digit)"></b> 
							<span class="ml1" v-html="$tdp.format(tick,'changeRange')"></span>
							<span class="ml1 buycolor" v-html="$tdp.format(tick,'changeValue',digit)"></span>
						</div>
					</div>
					<div class="tmiRight">
						<div><span>{{$t('trade.sec.high')}}</span><b v-html="$tdp.format(tick,'high', digit)"></b></div>
						<div class="mt3"><span>{{$t('trade.sec.low')}}</span><b v-html="$tdp.format(tick,'low',digit)"></b></div>
					</div>
				</div>
			</div>
			<div class="flexContent">
				<div class="tradingViewBox" v-show="tabActive==1">
					<div class="tradingViewHead">
						<span :class="item.ratio == interval?'active':''" v-if="index<=4" v-for="(item,index) of resolutions" :key="index"
							@click="changeTv(item.ratio)">
							{{item.name}}
						</span>
						<span @click="popMenu.show = true" :class="{active:(interval=='1D'||interval=='1W')}">{{$t('trade.sec.more')}}</span>
					</div>
					<div class="tradingView" id="tvbox1">
					</div>
				</div>
				<div class="trading" v-show="tabActive==2">
					<div class="tradingTop">
						<div class="ttHead">
							<span>{{$t('trade.sec.buyplate')}}</span>
							<span>{{$t('trade.number')}}({{coin}})</span>
							<span>{{$t('home.l2')}}({{market}})</span>
							<span>{{$t('trade.number')}}({{coin}})</span>
							<span>{{$t('trade.sec.sellplate')}}</span>
						</div>
						<div class="ttList">
							<div class="ttlBuy">
								<ul>
									<li v-for="(item,index) of buy" :key="index">
										<span>{{index+1}}</span>
										<span v-html="$tdp.meter(item.number, digit)"></span>
										<span v-html="$tdp.format(item,'price',digit)"></span>
										<span class="dbg" :style="$tdp.volume(item.total, den)"></span>
									</li>
								</ul>
							</div>
							<div class="ttlSell">
								<ul>
									<li v-for="(item,index) of sell" :key="index">
										<span v-html="$tdp.format(item,'price',digit)"></span>
										<span v-html="$tdp.meter(item.number, digit)"></span>
										<span>{{index+1}}</span>
										<span class="dbg" :style="$tdp.volume(item.total, den)"></span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="tradingDown">
						<div class="bt dark mini">
							<h5>{{$t('trade.sec.dealDetails')}}</h5>
							<div class="tdHead">
								<span>{{$t('trade.sec.time')}}</span>
								<span>{{$t('trade.sec.direction')}}</span>
								<span>{{$t('home.l2')}}</span>
								<span>{{$t('trade.number')}}</span>
							</div>
						</div>
						<div class="tdList">
							<ul>
								<li v-for="(item,index) of history" :key=(index)>
									<span>{{item.time}}</span>
									<span :class="vClass(item.type)" v-html="$tdp.type(item.type)"></span>
									<span v-html="$tdp.format(item,'price',digit)"></span>
									<span v-html="$tdp.format(item,'number',digit)"></span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="" v-show="tabActive==3">
					<div class="flexBox">
						<div class="bt dark mini"></div>
						<div class="fbContent coinInfo">
							<h5>{{explain?explain.chineseName:''}} <span class="ml1">({{explain?explain.coinfullname:''}})</span></h5>
							<div class="info">
								<div class="title">{{$t('trade.summary.issueTime')}}</div>
								<div class="value">{{explain?explain.issueTime:''}}</div>
							</div>
							<!-- <div class="info">
                            <div class="title">发行总量</div>
                            <div class="value" v-html="format(explain, 'issue')"></div>
                        </div>
                        <div class="info">
                            <div class="title">流通总量</div>
                            <div class="value" v-html="format(explain, 'circulation')"></div>
                        </div> -->
							<div class="info">
								<div class="title">{{$t('trade.summary.issueTotal')}}</div>
								<div class="value" v-html="format(explain, 'circulation')"></div>
							</div>
							<!--  <div class="info">
                            <div class="title">众筹价格</div>
                            <div class="value" v-html="format(explain, 'price')"></div>
                        </div> -->
							<div class="infoArea">
								<div class="title">{{$t('trade.summary.whitepaper')}}</div>
								<div class="value" v-html="format(explain, 'whitepaper')"></div>
							</div>
							<div class="infoArea">
								<div class="title">{{$t('trade.summary.network')}}</div>
								<div class="value" v-html="format(explain, 'website')"></div>
							</div>
							<div class="infoArea">
								<div class="title">{{$t('trade.summary.block')}}</div>
								<div class="value" v-html="format(explain, 'blockUrl')"></div>
							</div>
							<div class="infoArea">
								<div class="title">{{$t('trade.summary.introduction')}}</div>
								<div class="value" v-html="format(explain, 'explain')"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ul class="tmbar">
				<li class="tmtab" :class="{active:tabActive==1}" @click="tabActive = 1">
					<van-icon name="chart-trending-o" />
					<span>{{$t('trade.sec.kl')}}</span>
				</li>
				<li class="tmtab" :class="{active:tabActive==2}" @click="tabActive = 2">
					<van-icon name="cashier-o" />
					<span>{{$t('trade.sec.plate')}}</span>
				</li>
				<li class="tmtab" :class="{active:tabActive==3}" @click="tabActive = 3">
					<van-icon name="description" />
					<span>{{$t('trade.summary.introduction')}}</span>
				</li>
				<li class="tmBtn">
					<router-link :to="{name:'trade'}">{{$t('button.trade.gotrade')}}</router-link>
				</li>
			</ul>
		</div>


		<van-action-sheet class="dark" v-model="popMenu.show" :actions="popMenu.actions" @select="onMenuSelect" />


	</div>
</template>
<script>
	export default {
		data() {
			return {
				popMenu: {
					show: false,
					actions: [
						{
							name: '4' + this.$t('trade.canvas.h2'),
							value: 14400,
							ratio: '240'
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
				},


				tabActive: 1,
				den: 1,
				symbol: '', // 订阅的商品
				interval: '5', // 默认订阅的 分辨率
				resolutions: [
					{
						name: this.$t('trade.canvas.times'),
						value: 60,
						ratio: '1'
					},
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
						name: '4' + this.$t('trade.canvas.h2'),
						value: 14400,
						ratio: '240'
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
				]
			}
		},
		components: {},
		watch: {
			"$store.state.bidask":{
				handler:function(cur,old){
					if (!cur) {
						this.calculation();
						this.$store.state.bidask = true;
					}
				},
				deep:true
			},
			"$store.state.symbol":function(cur,old){
            	this.initTv();
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
			isFav() {
				let that = this;
				let isFav = false;
				if (that.$store.state.isLogin) {
					let favor = that.$store.state.favor;
					for (let idx = 0; idx < favor.length; idx++) {
						if (that.symbol && (favor[idx].symbol+"_"+favor[idx].market) == that.symbol) {
							isFav = true;
						}
					}
				}
				return isFav;
			},
			current() { // 当前交易货币配置
				if (!this.market || !this.$store.state.coin) {
					return null;
				}
				return this.$store.state.coin[this.market];
			},
			digit() {
				let token = this.current;
				if (token && token.digit) {
					return token.digit[0];
				}
				return 8;
			},
			tick() { // 交易行情
				let that = this;
				let tick = this.$store.state.ws.tick;
				if (tick) {
					return tick;
				}
				return {close: 0};
			},
			close() {
				let value = this.tick.close;
				if (value) {
					return this.$tdp.fmtZero(this.$tdp.toThousands(value), this.digit);
				}
				return '--';
			},
			explain() {
				if (!this.coin || !this.$store.state.coin) {
					return null;
				}
				return this.$store.state.coin[this.coin];
			},
			money() {
				let value = this.tick.close;
				return this.$tdp.money(value, this.market);
			},
			buy() { // 买盘数据
				let list = [];
				let buys = this.$store.state.ws.buys;
				if (buys && buys[this.digit]) {
					list = buys[this.digit];
					// 获取最大值
					for (let idx = 0; idx < list.length; idx++) {
						if (this.den < Number(list[idx].total)) {
							this.den = list[idx].total;
						}
					}
				}
				return list;
			},
			sell() { // 卖盘数据
				let list = [];
				let sells = this.$store.state.ws.sells;
				if (sells && sells[this.digit]) {
					list = sells[this.digit];
					// 获取最大值
					for (let idx = 0; idx < list.length; idx++) {
						if (this.den < Number(list[idx].total)) {
							this.den = list[idx].total;
						}
					}
				}
				list.reverse()
				return list;
			},
			history() {
				let list = this.$store.state.ws.history;
				return list;
			}
			
		},
		mounted() {
			this.$store.state.symbol = this.$route.params.symbol;
			this.symbol = this.$route.params.symbol;
			// 货币配置
			// this.$mts.configure();
			// 验证登录
			// this.$mts.checkLogin('clear', (res) => {
			// 	if (res) {
			// 		this.$mts.favor(); // 我的自选
			// 	}
			// });
			this.initTv();
		},

		beforeRouteLeave (to, from, next) {
			let that = this;
			that.$store.state.tradeWs = false;
			window.udf.unsubscribeBars(this.getListenerGUID());
		    next();
		},
		beforeDestroy() {
			if (window.udf) {
				// 移除订阅
				window.udf.unsubscribeBars(this.getListenerGUID());
				if (this.interval == '1W') {
					window.udf.unsubscribeBars(this.symbol + '_D');
				}
			}
		},
		methods: {
			calculation(){
				let that = this;
				let list = [];

				that.den = 0;
				if (that.$store.state.bid) {
					list = that.sell;
				}
				if (that.$store.state.ask) {
					list = that.buy;
				}
				for (let idx = 0; idx < list.length; idx++) {
					if (that.den < Number(list[idx].total)) {
						that.den = list[idx].total;
					}
				}
				that.$store.state.ask = false;
				that.$store.state.bid = false;
			},
			getListenerGUID() { // 监听的GUID
				return this.symbol + '_' + this.interval;
			},
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
			vClass(value) {
				if (value) {
					return value == 'BUY' ? 'buycolor' : 'sellcolor';
				}
				return ''
			},
			format(data, field) {
				if (!data) {
					return '';
				}
				let str = '',
					empty = '---';
				switch (field) {
					case 'price':
						str = data[field] ? this.$tdp.fmtZero(data[field]) + ' CNY' : empty;
						break;
					case 'issue':
					case 'circulation':
						str = data[field] ? this.$tdp.toThousands(data[field]) : empty;
						break;
					case 'explain':
						str = data[field] ? data[field] : this.$t('trade.canvas.noIntroduction');
						break;
					default:
						str = data[field] ? data[field] : empty;
						break;
				}
				return str;
			},

			onMenuSelect(item) {
				this.popMenu.show = false;
				this.changeTv(item.ratio)
			},
			initTv() {
				let scripts = [
					"charting_library/charting_library.min.js?v=" + this.$mts.v,
					"charting_library/datafeed/udf/datafeed.js?v=" + this.$mts.v
				];
				let _self = this;
				this.$mts.seriesLoadScripts(scripts, () => {
					this.initTradeView();
				});
			},
			initTradeView() {
				window.udf = new Datafeeds.UDFCompatibleDatafeed(this.$mts.tvurl, 5000);
				window.tvWidget = new TradingView.widget({
					width: "100%",
					height: "100%",
					fullscreen: false,
					autosize: true,
					timezone: "Asia/Shanghai",
					symbol: this.coinPair,
					interval: this.interval, // 分表率
					container_id: "tvbox1",
					datafeed: udf,
					library_path: "charting_library/",
					locale: this.$mts.getLangSm() || "en",
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
				});
				var thats = window.tvWidget;
				window.tvWidget.onChartReady(function() {
					let MaLine5 = thats.chart().createStudy('Moving Average', false, false, [5], null, {
						'Plot.color': '#ffffff'
					});
					let MaLine10 = thats.chart().createStudy('Moving Average', false, false, [10], null, {
						'Plot.color': '#03be87'
					});
					let MaLine30 = thats.chart().createStudy('Moving Average', false, false, [30], null, {
						'Plot.color': '#e66b41'
					});
					let MaLine60 = thats.chart().createStudy('Moving Average', false, false, [60], null, {
						'Plot.color': '#ff0000'
					});

					thats.chart().setEntityVisibility(MaLine5, false);
					thats.chart().setEntityVisibility(MaLine10, false);
					thats.chart().setEntityVisibility(MaLine30, false);
					thats.chart().setEntityVisibility(MaLine60, false);
				});
			},
			addFav(bool) { //加入自选
				if (this.$store.state.isLogin) {
					const that = this;
					that.$mts.post({
						url: 'user/optional',
						data: {
							symbol: that.symbol
						},
						success(response) {
							if (response.data.code == 200) {
								that.$mts.favor(() => {
									if (bool) {
										that.$toast(that.$t('validate.trade.coin.favFailed'))
									} else {
										that.$toast(that.$t('validate.trade.coin.favSuc'))
									}
								});
							} else {
								// 失败
								that.$toast(response.data.message);
							}
						}
					});
				} else {
					// 去登录
					this.$router.push({
						name: 'signin',
						query: {
							path: 'tradeDetail/' + this.symbol
						}
					});
				}
			},

			
		}
	}
</script>
