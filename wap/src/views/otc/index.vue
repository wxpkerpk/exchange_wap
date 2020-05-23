<template>
<div class="flexPage darkPage">
	<div class="flexContent" id="otcBox">
		<van-tabs type="card" class="otcTab" @change="onchangeTab" v-model="typeName">
			<div class="menuIcon">
				<span  @click="rightShow = true"><i class="iconfont iconfilter"></i></span>
				<span @click="popMenu.show = true"><icons type="ios" name="more"/></span>
			</div>
			<van-tab :title="$t('trade.buyIn')" name="SELL">
				<div class="secondMenus otcB">
					<div class="menusHeader">
						<ul class="tab noLine">
							<li v-for="(item,index) in coin" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index,item)">{{item}}<span></span></li>
						</ul>
					</div>
					<div class="otclistBox">
						<loading />
						<nodata v-if="list.length==0"></nodata>
						<ul class="otclist" v-if="list.length>0">
							<li v-for="(item,index) of list" :key="index">
								<img :src="!item.headImg?head:item.headImg" alt="">
								<div class="centerSpan">
									<b>{{item.nickName}}</b>
									<p><span>{{$t('otc.index.limitAmount')}}</span> {{item.limitDown}} - {{item.limitUp}} {{item.rate}}</p>
									<div class="payChoose">
										<span>{{$t('otc.index.pay')}}</span>
										<span v-for="(it,idx) of item.payList" :key="idx" >
											<i v-if="it == 'aliPay'" class="iconfont iconAlipay alipayColor"></i>
											<i v-if="it == 'wePay'" class="iconfont iconWeChatpay wechatColor"></i>
											<i v-if="it == 'PayPal'" class="iconfont iconpaypal paypalColor"></i>
											<i v-if="it == 'bankPay'" class="iconfont iconbank-payment cardColor"></i>
										</span>
									</div>
								</div>
								<div class="rightSpan">
									<div class="allSum">{{item.price}} {{item.rate}}</div>
									<van-button @click.native="$router.push({name:'otcbook',params:{id:item.id,type:'BUY'}})" size="small">{{$t('button.otc.buy')}}</van-button>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</van-tab>
			<van-tab :title="$t('trade.sellOut')" name="BUY">
				<div class="secondMenus otcB">
					<div class="menusHeader">
						<ul class="tab noLine">
							<li v-for="(item,index) in coin" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index,item)">{{item}}<span></span></li>
						</ul>
					</div>
					<div class="otclistBox">
						<loading />
						<nodata v-if="list.length==0"></nodata>
						<ul class="otclist" v-if="list.length>0">
							<li v-for="(item,index) of list" :key="index">
								<img :src="!item.headImg?head:item.headImg" alt="">
								<div class="centerSpan">
									<b>{{item.nickName}}</b>
									<p><span>{{$t('otc.index.limitAmount')}}</span> {{item.limitDown}} - {{item.limitUp}} {{item.rate}}</p>
									<div class="payChoose">
										<span>{{$t('otc.index.pay')}}</span>
										<span v-for="(it,idx) of item.payList" :key="idx" >
											<i v-if="it == 'aliPay'" class="iconfont iconAlipay alipayColor"></i>
											<i v-if="it == 'wePay'" class="iconfont iconWeChatpay wechatColor"></i>
											<i v-if="it == 'PayPal'" class="iconfont iconpaypal paypalColor"></i>
											<i v-if="it == 'bankPay'" class="iconfont iconbank-payment cardColor"></i>
										</span>
									</div>
								</div>
								<div class="rightSpan">
									<div class="allSum">{{item.price}} {{item.rate}}</div>
									<van-button @click.native="$router.push({name:'otcbook',params:{id:item.id,type:'SELL'}})" size="small">{{$t('button.otc.sell')}}</van-button>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</van-tab>
		</van-tabs>
	</div>
	<!-- 自选区弹出框 -->
	<van-popup v-model="rightShow" position="right" class="filterBoxWrapper">
		<div class="filterBox">
			<div class="filterContent">
				<h3>{{$t('otc.index.payWays')}}</h3>
				<ul>
					<li v-for="(item,index) in payWays" :key="index" :class="{active: payType == item.name}" @click="onChangePayType(item)">
						{{item.title}}
					</li>
				</ul>
			</div>
			<div class="filterContent">
				<h3>{{$t('assets.index.legalcurrency')}}</h3>
				<ul>
					<li v-for="(item,index) in coinList" :key="index" :class="{active: coinType == item.name}" @click="onChangeCoinType(item)">
						{{item.title}}
					</li>
				</ul>
			</div>
			<div class="filterBtn">
				<van-button size="large" @click="onReset">{{$t('otc.index.reset')}}</van-button>
				<van-button size="large" @click="onFilter">{{$t('otc.index.filter')}}</van-button>
			</div>
		</div>
	</van-popup>
	<!-- 下拉弹出框 -->
	<van-action-sheet v-model="popMenu.show" :actions="actions" @select="onMenuSelect" class="downToUp" />
	<downbar/>
</div>
</template>
<script>
import downbar from "@/views/modules/downbar.vue";
import headInfo from '@/assets/img/head.jpg'
export default {
	data(){
    	return {
    		typeName:"SELL",
			typeActive: 0,
			tabs:['USDT','ETC'],
			symbol:'',
			rightShow: false,
    		popMenu:{
    			show:false,
    		},
    		pageNum: 0, //当前页码
			submiting: false,
			head: headInfo,
			payType: '', // 默认选中第一个
			payWays:[
				{name:'',title:this.$t('trade.all')},
				{name:'aliPay',title:this.$t('otc.index.alipay')},
				{name:'wePay',title:this.$t('otc.index.wepay')},
				{name:'bankPay',title:this.$t('otc.index.bankpay')},
				{name:'PayPal',title:'PayPal'},
			],
			coinType:'CNY',
			coinList:[
				{name:'CNY',title:this.$t('otc.index.rmb')},
				{name:'USD',title:this.$t('otc.index.dollar')}]
    	}
    },
  	components:{downbar},
  	watch:{
  		"symbol":function(cur,old){
  			if (old && cur != old) {
                this.refresh();
            }
  		},
  		"typeName":function(cur,old){
  			if (old && cur != old) {
                this.refresh();
            }
  		}
  	},
  	computed:{
		isLogin() {
            return this.$store.state.isLogin;
        },
        actions(){
        	let result = [];
        	let merchant = this.$mts.getUserValue('isMerchant');
        	if(merchant == 'Y'){
        		result = [
			        {name: this.$t('otc.popup.playAd'),value:"otcAddAd"},
			        {name: this.$t('otc.popup.myAd'),value:"advertlist"},
			        {name: this.$t('otc.popup.setpayInfo'),value:"payaccount"},
			        {name: this.$t('otc.popup.seeHistory'),value:"otcorders"}
    			]
        	}else{
        		result = [
					{name: this.$t('otc.popup.setpayInfo'),value:"payaccount"},
					{name: this.$t('otc.popup.apply'),value:"toBePos"},
			        {name: this.$t('otc.popup.seeHistory'),value:"otcorders"}
    			]
        	}
        	return result;
        },
		list(){
  			return this.$store.state.app.vanList;
  		},
  		finished(){
  			return this.$store.state.app.finished;
  		},
  		//获取所有的货币
		coin(){
			let that = this;
			let actions = [];
			let map = that.$store.state.coin;
			for(let coin in map){
				let m = map[coin]
				if(m && m.isOtc == 'Y'){
					actions.push(coin)
				}
			}
			that.symbol = actions[0]
			return actions;
		},
  	},
	mounted(){
		this.$mts.rates();
		//货币配置
		this.$mts.configure();
		//初始页面
		this.pageInit();
	},
	methods:{
		onchangeTab(name,title){
			
		},
		pageInit(){
			this.refresh();
		},
		onChooseTab(index,item){

			this.typeActive = index;
			this.symbol = item;
		},
		//划转  订单记录  收款方式  资金密码
		onMenuSelect(item){
			switch(item.value){
				case "otcAddAd":
					this.$router.push({name:"otcAddAd"})
					break;
				case "payaccount":
					this.$router.push({name:"payaccount"})
					break;
				case "toBePos":
					this.$router.push({name:"toBePos"})
					break;
				case "otcorders":
					this.$router.push({name:"otcorders"})
					break;
				case "advertlist":
					this.$router.push({name:"advertlist"});	
					break;
			}
		},
		refresh(){
			this.pageNum = 0;
            this.$mts.initPage();
            this.$store.state.app.loading = true;
            this.query()
		},
		query(){
			var that = this;
			that.pageNum ++;
			that.$mts.post({
				url:'otc/advert/list',
				data:{
					type:that.typeName,      // 买入/卖出
					symbol:that.symbol ? that.symbol : 'BTC',    //货币符号
					state:1,
					pageNum: that.pageNum,
					payType:that.payType,  //支付方式
					rate:that.coinType,    //汇率
				},success(response){
					if (response.data.code == 200) {
						that.$mts.loading(response.data.data);
						that.submiting = false;
					}
				}
			});
		},
		// 切换支付方式
		onChangePayType(tag){
			this.payType = tag.name;
		},
		// 切换法币
		onChangeCoinType(tag){
			this.coinType = tag.name;
		},
		// 重置
		onReset(){
			this.payType = '';
			this.coinType = 'CNY';
			this.refresh()
			this.rightShow = false;
		},
		// 筛选
		onFilter(){
			this.refresh()
			this.rightShow = false;
		},
	}
}
</script>
