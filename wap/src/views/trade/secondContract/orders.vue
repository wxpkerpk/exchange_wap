<template>
	<div class="flexPage themeColor">
		<div class="flexHead">
			<navbar :params="pageInfo" />
		</div>
		<div class="flexContent">
            <nodata v-if="!records||records.length==0" />
			<ul class="ordersList">
				<!-- <van-pull-refresh v-model="" @refresh="">
					<van-list
						v-model="$store.state.app.loading"
						:finished="finished"
						@load="records(10)"
						:offset="50"
					>
						<loading slot="loading" />
					</van-list>
				</van-pull-refresh> -->
				
				<li v-for="(item,index) of records" :key="index" v-if="item.state==1">
					<div class="orderTitle">
						<div>
							<b :class="item.type == 1?'green':'red'">{{item.type == 1? $t('trade.sec.buyUp') : $t('trade.sec.buyDown')}}</b>
							<span class="orderTName">{{item.coinPair.replace(/_/g,"/").split('/')[0]}}</span>
								<span class="orderDate">{{$tool.dataFormat(new Date(item.dealingTime),'yyyy-MM-dd hh:mm:ss')}}</span>
						</div>
						<span class="orderStatus">{{item.coinPair.replace(/_/g,"/")}}</span>
					</div>
					<div class="assetsDl three">
						<dl>
							<dt>{{$t('trade.sec.id')}}</dt>
							<dd>{{item.id+10000}}</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.payPrice')}}</dt>
							<dd>{{item.startPrice}}</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.countdown')}}</dt>
							<dd>
								<van-count-down @finish="finishMe" :time="item.countDownTime * 1000" />
							</dd>
						</dl>
					</div>
					<div class="assetsDl three">
						<dl>
							<dt>{{$t('trade.sec.openDate')}}</dt>
							<dd>{{item.section/60}}M</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.investAmount')}}({{item.payCoin}})</dt>
							<dd>{{item.price}}</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.income')}}</dt>
							<dd>--</dd>
						</dl>
					</div>
				</li>
				<li v-for="(item,index) of records" :key="index" v-if="item.state!=1">
					<div class="orderTitle">
						<div>
							<b :class="item.type == 1?'green':'red'">{{item.type == 1? $t('trade.sec.buyUp') : $t('trade.sec.buyDown')}}</b>
							<span class="orderTName">{{item.coinPair.replace(/_/g,"/").split('/')[0]}}</span>
							<span class="orderDate">{{$tool.dataFormat(new Date(item.dealingTime),'yyyy-MM-dd hh:mm:ss')}}</span>
						</div>
						<span class="orderStatus">{{item.coinPair.replace(/_/g,"/")}}</span>
					</div>
					<div class="assetsDl three">
						<dl>
							<dt>{{$t('trade.sec.id')}}</dt>
							<dd>{{item.id+10000}}</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.payPrice')}}</dt>
							<dd>{{item.startPrice}}</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.lastPrice')}}</dt>
							<dd>{{item.endPrice}}</dd>
						</dl>
					</div>
					<div class="assetsDl three">
						<dl>
							<dt>{{$t('trade.sec.openDate')}}</dt>
							<dd>{{item.section/60}}M</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.investAmount')}}({{item.payCoin}})</dt>
							<dd>{{item.price}}</dd>
						</dl>
						<dl>
							<dt>{{$t('trade.sec.income')}}</dt>
							<dd>
								<b v-if="item.winPrice>0" class="buycolor">{{
								item.winPrice
							}}</b>
								<b v-else class="sellcolor">{{
								"-"+item.price
							}}</b>
							</dd>
						</dl>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import navbar from "@/views/modules/navbar.vue"
	export default {
		data() {
			return {
				pageInfo:{
					title: this.$t('trade.sec.orderHistory'),
					navbarStyle: 'normal'
				},
				total: 0,
				pageSize: 100,
				pageNum: 1,
				pages: 0,
				records: [],
				finishTimeout:null
			}
		},
		components: {navbar},
		watch: {
			
		},
		computed: {
			
		},
		mounted() {
			this.$mts.checkLogin('',(res)=>{
				this.actives();
			})
		},
		beforeDestroy() {
			
		},
		methods: {
			finishMe(){
				if(this.finishTimeout){
					clearTimeout(this.finishTimeout);
				}
				this.finishTimeout = setTimeout(()=>{
					this.actives();
				},1000)
			},
			actives() {//秒合约订单
				let that = this;
				that.$mts.posts({
					url: 'secondsContract/actives',
					data: {
						pageSize: that.pageSize,
						pageNum: that.pageNum
					},
					success(response) {
						if (response.data.code == 200) {
							that.total = response.data.data.total;
							that.pageSize = response.data.data.size;
							that.pageNum = response.data.data.current;
							that.pages = response.data.data.pages;
							that.records = response.data.data.records;
						}
					}
				});
			},


		}
	}
</script>
