<template>
	<div>
		<div class="tradeHeaderWrap">
			<div class="tradeHeader" :class="{fixed:$store.state.app.trade.scrollTop > 56}">
				<div class="thLeft flexSpindle">
					<i class="iconfont iconlist_left" @click="$store.state.app.drawer.show = true"></i>
					<span>{{coin}}/{{market}}</span>
				</div>
				<div class="thRight flexSpindle">
					<i class="iconfont iconmarkets_" @click="$router.push({name:'tradeDetail'})" ></i>
					<icons class="flexSpindle" name="more" @click.native="popMenu.show = true" type="ios" />
				</div>
			</div>
		</div>
		<div class="tradeBox">
			<div class="tradeLeft">
				<div class="tradeBtn">
					<div class="flexSpindle buying" :class="{active:tradeTypeBuy}" @click="changeType(true)"><span>{{$t('trade.buyIn')}}</span></div>
					<div class="flexSpindle selling" :class="{active:!tradeTypeBuy}" @click="changeType(false)"><span>{{$t('trade.sellOut')}}</span></div>
				</div>
				<div class="pt2">
					<number v-model="form.price" :placeholder="placeholder($t('home.l2'), market)" :min="0" :max="1000000" :step="0.0001" :fixed="digit" />
					<div class="sumPrice sumLow">{{money}}</div>
				</div>
				<div class="pt2">
					<number v-model="form.number" :placeholder="placeholder($t('trade.number'), coin)" :min="minNumber || 0 " :max="maxNumber" :step="0.0001" :fixed="digit" />
					
					<div class="sumPrice" v-if="tradeTypeBuy">
						{{$t('trade.use')+'：'}}<b>{{base}}</b> {{market}}
					</div>
					<div class="sumPrice" v-if="!tradeTypeBuy">
						{{$t('trade.use')+'：'}}<b>{{product}}</b> {{coin}}
					</div>
				</div>
				<div class="tradeSlider">
					<div class="vslider">
						<van-slider bar-height="0.6vw" v-model="percent" :active-color="$store.state.app.nightModel ? '#1789FA':'#333'">
							<div slot="button" class="customButton">
								<span></span>	
								<!--  {{ percent + '%' }} -->
								<!-- <icons name="menu" type="ios" /> -->
							</div>
						</van-slider>
					</div>
					<div class="vsliderNum">
						<span>0</span><span>100% {{tradeTypeBuy?market:coin}}</span>
					</div>
					<div class="tradeSliderDownI" :class="{buying:tradeTypeBuy}"><i class="active"></i><i :class="{active:percent>=25}"></i><i
						:class="{active:percent>=50}"></i><i :class="{active:percent>=75}"></i><i :class="{active:percent>=100}"></i></div>
				</div>
				<div class="pt2">
					<div class="sumPrice">{{$t('trade.tradeAmount')}}<b>{{$tdp.fmtZero(total,digit)}}</b> {{market}}</div>
				</div>
				<div class="pt3">
					<van-button v-if="!islogin" size="large" class="tradeSubmit" @click="$mts.goto('signin')" type="info">{{$t('form.signin.submit')+'/'+$t('form.signup.submit')}}</van-button>
					<van-button @click="business()" v-if="islogin && tradeTypeBuy" class="tradeSubmit buying" size="large">{{$t('trade.buyIn')}}</van-button>
					<van-button @click="business()" v-if="islogin && !tradeTypeBuy" class="tradeSubmit selling" size="large">{{$t('trade.sellOut')}}</van-button>
				</div>
				<!-- <div class="pt3 bsTag">
					<label><i></i><span>买</span></label>
					<label><i></i><span>卖</span></label>
				</div> -->
			</div>
			<!-- 买卖盘 -->
			<div class="tradeRight">
				<div class="trThead flexBothSidesVertical">
					<span>{{$t('home.l2')}}</span><span>{{$t('trade.number')}}</span>
				</div>
				<ul class="trList sell">
					<li v-for="(item,idx) of sell" :key="idx" @click="itemClick(item)">
						<!-- <span>{{sell.length - idx}}</span> -->
						<span v-html="$tdp.formartNumber(item.price, digit)"></span>
						<span v-html="$tdp.meter(item.number)"></span>
						<span class="dbg" :style="$tdp.volume(item.total, den)"></span>
					</li>
				</ul>
				<div class="trPrice">
					<h5 :class="vClass(tick.close)" v-html="close(tick.close)"></h5>
					<div v-html="$tdp.money(tick.close, market)"></div>
				</div>
				<ul class="trList buy">
					<li v-for="(item,idx) of buy" :key="idx" @click="itemClick(item)">
						<!-- <span>{{idx + 1}}</span> -->
						<span v-html="$tdp.formartNumber(item.price, digit)"></span>
						<span v-html="$tdp.meter(item.number)"></span>
						<span class="dbg" :style="$tdp.volume(item.total, den)"></span>
					</li>
				</ul>
			</div>
			
		</div>
		<div class="tradeContent">
			<div class="tradeTitle flexBothSidesVertical">
				<b>{{$t('trade.entrustNow')}}</b>
				<span @click="clickMore()">{{$t('trade.all')}}</span>
			</div>
			<div class="tradeHistory">
				<loading />
				<nodata v-if="order.length==0"></nodata>
				<ul class="assetsList" v-if="!nodata">
					<li v-for="(item,idx) of order" :key="idx">
						<div class="assetsTop flexBothSidesVertical">
							<p class="assetsTopLeft">
								<span :class="[item.type=='BUY'?'green':'red','flexSpindle']">{{item.type=='BUY' ? $t('trade.buy'):$t('trade.sell')}}</span>
								<b>{{item.coin}}</b>
								<span>{{item.time}}</span>
							</p>
							<p class="assetsTopRight">
								<span>{{Math.ceil(vRange(item).replace("%",""))>0 ? $t('trade.someDeal') : $t('trade.failedDeal')}}</span>
								<span @click="revoke(item)" class="rebackBtn">{{$t('trade.withdrawal')}}</span>	
							</p>
						</div>	
						<div class="assetsDl three flexBothSidesVertical">
							<dl>
								<dt>{{$t('trade.entrustPrice')}}({{item.market}})</dt>
								<dd>{{item.price}}</dd>
							</dl>
							<dl>
								<dt>{{$t('trade.entrustNum')}}({{item.coin}})</dt>
								<dd>{{$tdp.format(item, 'number', digit)}}</dd>
							</dl>
							<dl>
								<dt>{{$t('trade.entrustAmount')}}({{item.market}})</dt>
								<dd>{{$tdp.format(item, 'total', digit)}}</dd>
							</dl>
						</div>
						<div class="assetsDl three flexBothSidesVertical">
							<dl>
								<dt>{{$t('trade.successDeal')}}({{item.coin}})</dt>
								<dd>{{$tdp.fmtZero(item.number - item.surplus, digit)}}</dd>
							</dl>
							<dl>
								<dt>{{$t('trade.failedDeal')}}({{item.coin}})</dt>
								<dd>{{$tdp.format(item, 'surplus', digit)}}</dd>
							</dl>
							<dl>
								<dt>{{$t('trade.dealPercent')}}</dt>
								<dd>{{vRange(item)}}</dd>
							</dl>
						</div>
					</li>	
				</ul>
			</div>
		</div>
		<van-action-sheet v-model="popMenu.show" :actions="popMenu.actions" @select="onMenuSelect" />
	</div>
</template>
<script>
	import number from "@/views/modules/number.vue";

	export default {
		data() {
			return {
				tradeTypeBuy: true,
				submiting: false,
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
							name: this.$t('trade.add') + '/' + this.$t('trade.cancelChoice'),
							value: "fav"
						}
					]
				},
				percent: 0,
				form: { // 表单
					total: 0,
					price: "",
					number: "",
				},
				den: 1, // 分母 最大买卖盘
				actualBase: 0,
				actualProduct: 0,
				c: null,
				lastTick: {}, // 记录上一次tick
				showAll: true
			}
		},
		components: {
			number
		},
		watch: {
			"percent": function(cur, old) {
				let scale = Number(cur / 100);
				let number = Number(this.actualProduct) * scale;
				if (this.tradeTypeBuy) { // 如果是买
					// 折算可买数量
					if (this.form.price) {
						number = Number(this.actualBase / this.form.price) * scale;
					}
				}
				// 滚动到最左边 设置为最小值
				if (number < this.minNumber) {
					number = this.minNumber;
				}
				if (this.tradeTypeBuy) {
					number = this.actualBase > 0 ? number : "";
				} else {
					number = this.actualProduct > 0 ? number : "";
				}
				this.form.number = this.$tdp.fmtZero(number, this.digit);
			},
			"$store.state.symbol": function(cur, old) {
			
				this.den = 0;
			},
			"$store.state.bidask":{
				handler:function(cur,old){
					if (!cur) {
						this.calculation();
						this.$store.state.bidask = true;
					}
				},
				deep:true
			}
		},
		computed: {
			islogin() {
				return this.$store.state.isLogin;
			},
			coin() {
				return this.$mts.getVs(this.$store.state.symbol, 0);
			},
			market() {
				return this.$mts.getVs(this.$store.state.symbol, 1);
			},
			wallet() { // 当前交易货币钱包
				let w = this.$store.state.ws.capital;
				if (!w || this.$mts.isEmpty(w)) {
					return false;
				}
				return w;
			},
			base() { // 基础货币
				let that = this;
				if (!that.wallet || !that.wallet[that.market]) {
					return '--';
				}
				let w = that.wallet[that.market];
				that.actualBase = w.usable;
				return that.$tdp.meter(w.usable, that.digit);
			},
			product() { // 商品货币
				let that = this;
				if (!that.wallet) {
					return '--';
				}
				let w = that.wallet[that.coin];
				that.actualProduct = w.usable
			
				return that.$tdp.meter(w.usable, that.digit);
			},
			tick() { // 交易行情
				let that = this;
				let tick = that.$store.state.ws.tick;
				if (tick) {
					return tick;
				}
				return {close: 0};
			},
			money() {
				return this.$tdp.money(this.form.price, this.market);
			},
			closeMoney() {
				return this.$tdp.money(this.price, this.market);
			},
			current() { // 当前交易货币配置
				if (!this.market || !this.$store.state.coin) {
					return null;
				}
				return this.$store.state.coin[this.market];
			},
			trade() {
				if (!this.coin || !this.$store.state.coin) {
					return null;
				}
				return this.$store.state.coin[this.coin];
			},
			digit() {
				let token = this.current;
				if (token && token.digit) {
					return token.digit[0];
				}
				return 8;
			},
			step() {
				return Math.pow(0.1, this.digit);
			},
			maxNumber() {
				if (this.trade) {
					if (this.islogin) { // 登录状态
						if (this.tradeTypeBuy) {
							let base = this.actualBase;
							if (this.form.price) {
								let max = this.$tdp.fmtZero(Number(base / this.form.price), this.digit);
								
								return Number(max);
							} else {
								return base;
							}
						} else {
							return this.actualProduct;
						}
					}
					return this.trade.maxbuy;
				}
				
				
				return 0;
			},
			minNumber() {
				if (this.trade) {
					if (this.islogin && this.tradeTypeBuy) {
						return this.actualBase > 0 ? this.trade.minbuy : 0;
					}
					if (this.islogin && !this.tradeTypeBuy) {
						return this.actualProduct > 0 ? this.trade.minbuy : 0;
					}
					return this.trade.minbuy;
				}
				return 0;
			},
			total() { // 交易总额
				let price = this.form.price;
				let number = this.form.number;
				if (this.percent == 100) {
					return this.tradeTypeBuy ? this.actualBase : this.actualProduct * this.form.price;
				}
				return this.$tdp.toThousands(this.$tdp.fmtZero(Number(price * number), this.digit));
			},
			buy() { // 买盘数据
				let that = this;
				let list = [];
				let buys = that.$store.state.ws.buys;
				if (buys && buys[that.digit]) {
					list = buys[that.digit];
					// 获取最大值
					for (let idx = 0; idx < list.length; idx++) {
						if (that.den < Number(list[idx].total)) {
							that.den = list[idx].total;
						}
						// 设置初始默认值
						if (idx == 0 && !that.tradeTypeBuy &&
							!that.form.price) {
							that.form.price = that.$tdp.fmtZero(list[idx].price);
						}
					}
				}
				return list;
			},
			sell() { // 卖盘数据

				let that = this;
				let list = [];
				let sells = that.$store.state.ws.sells;
				
				if (sells && sells[that.digit]) {
					list = sells[that.digit];
					// 获取最大值
					for (let idx = 0; idx < list.length; idx++) {
						if (that.den < Number(list[idx].total)) {
							that.den = list[idx].total;
						}
						if (idx == list.length - 1 && that.tradeTypeBuy &&
							!that.form.price) {
							that.form.price = that.$tdp.fmtZero(list[idx].price);
						}
					}
				}
				return list;
			},
			order() { // 委托订单
				let that = this;
				if (that.$store.state.ws.actives) {
					let list = that.$store.state.ws.actives.list;
					let total = that.$store.state.ws.actives.total;
					if (total >= list.length) {
						that.showAll = false;
					}
					return list;
				}
				return [];
			},
			nodata() { // 无数据
				if (this.order.length == 0 || !this.islogin) {
					return true;
				}
				return false;
			}
			
			
		},
		mounted() { 
			this.$mts.rates();
		},
		beforeDestroy() {
			clearInterval(this.c);
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
			vRange(item) {
				let already = item.number - item.surplus;
				return Number((already / item.number) * 100).toFixed(2) + '%';
			},
			placeholder(prefix, value) {
				return prefix + value;
			},
			close(value) { // 最新价格
				if (value) {
					return this.$tdp.fmtZero(this.$tdp.toThousands(value), this.digit);
				}
				return '--';
			},
			vClass(n) {
				let last = this.$tdp.fmtZero(this.lastTick.close); // 历史数据
				let now = this.$tdp.fmtZero(n);
				if (!last || last == now) {
					return '';
				}
				return last > now ? 'sellcolor' : 'buycolor';
			},
			business() { // 开始下单
				let that = this;
				if (that.submiting) return //防止多次提交
				that.submiting = true
				that.$mts.posts({
					url: 'order/business',
					data: {
						price: that.form.price,
						num: that.form.number,
						total: that.form.total,
						type: that.tradeTypeBuy ? 'BUY' : 'SELL',
						coinPair: that.$route.params.symbol
					},
					success(response) {
						that.submiting = false
						if (response.data.code == 401) {
							that.$store.state.user.auth.show = true; //需要输入资金密码
						} else if (response.data.code == 200) {
							that.$toast(that.$t('validate.trade.coin.orderSuc'));
						}
					}
				});
			},
			revoke(item) {
				let that = this;
				if (that.submiting) return
				that.submiting = true
				that.$mts.posts({
					url: 'order/revoke',
					data: {
						id: item.id,
						type: item.type,
						symbol: that.$route.params.symbol
					},
					success(response) {
						that.submiting = false
						if (response.data.code == 401) {
							that.$store.state.user.auth.show = true; //需要输入资金密码
						} else if (response.data.code == 200) {
							that.$toast(that.$t('validate.trade.coin.withdrawalSuc'));
						}
					}
				});
			},
			itemClick(item) {
				if (item) {
					this.form.price = this.$tdp.fmtZero(item.price, 4);
				}
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
							that.$mts.post({
								url: 'user/optional',
								data: {
									symbol: that.coin + "_" + that.market
								},
								success(response) {
									if (response.data.code == 200) {
										that.$mts.favor(() => {
											that.$toast(that.$t('validate.success'));
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
									path: 'trade/' + that.coin + "_" + that.market
								}
							});
						}
						break;
				}
			},
			changeType(type) {
				this.tradeTypeBuy = type;
				if (type && this.sell.length > 0) {
					this.form.price = this.$tdp.fmtZero(this.sell[this.sell.length - 1].price, this.digit);
				} else if (!type && this.buy.length > 0) {
					this.form.price = this.$tdp.fmtZero(this.buy[0].price, this.digit);
				} else {
					this.form.price = "";
				}
				this.form.number = "";
			},
			clickMore() {
				this.$router.push({
					name: 'allorders'
				});
			},
		}
	}
</script>
