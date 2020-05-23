<template>
<div class="flexPage darkPage">
	<div class="currencyHead fixed themeHead">
		<navbar :params="pageInfo" />
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper">
			<div class="zcInfo hz">
				<div class="payBox">
					<div class="dot flexSpindle">
						<span></span>
					</div>
					<div class="payGroup">
						<div class="cell" @click="chooseWalletFrom.show=true">
							<div class="hzLeft">
								<span>{{$t('form.assets.from')}}</span>
								<b>{{walletTypeName(chooseWalletFrom.name)}}</b>
							</div>
							<van-icon name="arrow"></van-icon>
						</div>
						<span class="line"></span>
						<div class="cell" @click="chooseWalletTo.show=true" >
							<div class="hzLeft">
								<span>{{$t('form.assets.to')}}</span>
								<b>{{walletTypeName(chooseWalletTo.name)}}</b>
							</div>
							<van-icon name="arrow"></van-icon>
						</div>
					</div>
					<div class="exchange">
						<span @click="onExchange"></span>
					</div>
				</div>
				<!-- 表单 -->
				<div class="form">
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.otc.initiateAd.coin')}}</div>
						<van-cell-group>
							<van-cell :title="chooseCoin.name" :value="$t('form.otc.initiateAd.goChoose')" is-link @click="chooseCoin.show = true"/>
						</van-cell-group>
					</div>
					<div class="cellGroup hz">
						<div class="tbTitle">{{$t('form.assets.transferNum')}}</div>
						<van-field v-model="chooseCoin.amount" :placeholder="$t('form.assets.p2')" >
							<span slot="button"><span @click="chooseCoin.amount = chooseCoin.balance" class="transAll">{{$t('form.assets.alltransfer')}}</span></span>
						</van-field>
					</div>
					<div class="hzAcount">{{$t('form.assets.cantransfer')}} {{chooseCoin.balance}}</div>
					<div class="submitBox">
						<van-button size="large" @click="submit()" >{{$t('button.assets.transferSure')}}</van-button>
					</div>
				</div>
			</div>
			<div class="promptInfo" v-html="$t('form.assets.s3')"></div>
		</div>
	</div>
	<!--从-->
	<van-popup v-model="chooseWalletFrom.show"  :default-index="1" position="bottom" :overlay="true">
		<van-picker :columns="fromWallets" show-toolbar  @cancel="chooseWalletFrom.show=false" @confirm="onFromConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')"/>
	</van-popup>
	<!--转到-->
	<van-popup v-model="chooseWalletTo.show"  :default-index="1" position="bottom" :overlay="true">
		<van-picker :columns="toWallets" show-toolbar  @cancel="chooseWalletTo.show=false" @confirm="onToConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
	</van-popup>
	<!--选择币种-->
	<van-popup v-model="chooseCoin.show" :default-index="1" position="bottom" :overlay="true">
		<van-picker :columns="coins" show-toolbar  @cancel="chooseCoin.show=false" @confirm="onCoinConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
	</van-popup>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
let Base64 = require('js-base64').Base64;
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.index.n3'),
				navbarStyle: 'blue'
			},
			value: 'USDT',
    		list:[],
    		submiting:false,
    		fromWallets: [this.$t('assets.index.a1'),this.$t('assets.index.a2'),this.$t('assets.index.a3')],//
    		toWallets: [this.$t('assets.index.a1'),this.$t('assets.index.a2'),this.$t('assets.index.a3')],//
    		chooseCoin:{
    			show:false,
    			name:"USDT",
    			balance:0,
    			amount:0
    		},
    		chooseWalletFrom:{
    			name:"TRADE",
    			show:false
    		},
    		chooseWalletTo:{
    			name:"OTC",
    			show:false
			},
			form:{
				password: ''
			},
			sign:'',  //数字签名
			interval:null,
    	}
    },
  	components:{navbar},
  	watch:{

  	},
  	computed:{
  		coins(){
  			let that = this;
  			let result = [];
  			let map = that.$store.state.coin;
  			for(let coin in map){
  				let m = map[coin];
  				if (m) {
  					//判断当前转出的账户支持的货币
  					switch( that.chooseWalletFrom.name){
  						case "T":  //法币账户
  						if(m.isT == 'Y'){
  							result.push( coin);
  						}
  						break;
  						case "OTC":  //合约账户
  						if(m.isOtc == 'Y'){
  							result.push( coin);
  						}
  						break;
  						case "TRADE":  //币币账户
  						result.push( coin);
  						break;
  					}
  				}
  			}
  			if( result.length > 0){
  				that.chooseCoin.name = result[0];
  			}else{
  				that.chooseCoin.name = '';
  			}
  			return result;
  		},
  		token(){ // 当前货币
  			let that = this;
  			let map = that.$store.state.coin;
  			if (map && !that.$mts.isEmpty( map)) {
  				return map[that.chooseCoin.name];
  			}
  		}
  	},
  	beforeRouteLeave(to, from, next){
  		clearInterval( this.interval);
  		next();
  	},
  	beforeDestroy(){
		clearInterval( this.interval);
	},
	mounted(){
		this.walletType = this.$route.params.type;
		this.pageInit();
		this.resetNumber();
	},
	methods:{

		//每次改变值都去改变转出数量即可
		resetNumber(){
			this.balance();
		},

		formatWalletName(name){
			switch(name){
				case this.$t('assets.index.a2'):
					return "T";
				case this.$t('assets.index.a1'):
					return "TRADE";
				case this.$t('assets.index.a3'):
					return "OTC";
			} 
		},
		pageInit(){
			const that = this;
			that.$mts.checkLogin('needback',(res)=>{
				if (res) {
					that.$mts.configure();//  代币配置
					that.capital(); //我的资产
					that.signature(); //数字签名
					that.interval = setInterval(()=>{
						that.$mts.checkLogin('needback',()=>{
							that.signature();
						},'transfer');
					}, 9000);
				}
			},'transfer');
		},
		onFromConfirm(tag,index){
			if(this.formatWalletName(tag) == this.chooseWalletTo.name){
				this.$toast(this.$t('message.assets.t2'))
				return
			}
			this.chooseWalletFrom.name = this.formatWalletName(tag);
			this.chooseWalletFrom.show = false;
			this.balance();
		},
		onToConfirm(tag,index){
			if(this.formatWalletName(tag) == this.chooseWalletFrom.name){
				this.$toast(this.$t('message.assets.t2'))
				return
			}
			this.chooseWalletTo.name = this.formatWalletName(tag);
			this.chooseWalletTo.show = false;
			this.balance();
		},
		onCoinConfirm(tag,index){
			this.chooseCoin.name = tag;
			this.chooseCoin.show = false;
			this.balance();
		},
		submit(){
			let that = this;
			if(that.chooseCoin.amount <= 0){
				this.$toast(that.$t('message.assets.t3'))
				return
			}
			if(that.chooseCoin.amount > that.chooseCoin.balance){
				this.$toast(that.$t('message.assets.t4'))
				return
			}
			if(that.submiting)return;
			that.submiting = true;
			that.$mts.post({
                url:'wallet/transfer',
                data:{
					accountFrom: that.chooseWalletFrom.name,
					accountTo: that.chooseWalletTo.name,
					amount: that.chooseCoin.amount,
					symbol: that.chooseCoin.name,
					signature: that.sign,
                	nonce: that.nonce()
                },success(response){
                    if(response.data.code == 200){
						that.submiting = false;
						that.$toast(that.$t('message.assets.transferSuc'));
						that.$router.push({name:'assets'});
                    }else{
                    	that.signature()
                    }
                },error( error){
				}
			});
		},
		onExchange(){
			let temp = this.chooseWalletFrom.name;
			this.chooseWalletFrom.name = this.chooseWalletTo.name;
			this.chooseWalletTo.name = temp;
			this.chooseCoin.name    =  this.coins[0];
			this.balance();
		},
		nonce(){
			return Base64.encode(localStorage.getItem('token') + this.$store.state.timestamp + this.$store.state.apiSecret);
		},
		capital(){
			let that = this;
			this.$mts.post({
                url:'wallet/details',
                data:{}, //
                success(response){
                    if(response.data.code == 200){
						that.list = response.data.data;
						that.balance();
					}
                }, 
				error( error){
				}
			});
		},
		signature(){
			let that = this;
			if (!that.submiting) {
				that.submiting = true;
				that.$mts.post({
					url:'wallet/signature',
					data:{
						symbol: that.chooseCoin.name,
						nonce: that.nonce(),
						timestamp: that.$store.state.timestamp
					},success(response){
						that.submiting = false;
						if (response.data.code==200) {
							that.sign = response.data.data;
						}
					}
				});
			}
		},
		balance(){
			let that = this; 
			for (let m in that.list) {
				let item = that.list[m];
				if (item.token == that.chooseCoin.name) {
					switch(that.chooseWalletFrom.name){
						case 'T': //合约账户
							that.chooseCoin.balance = item.usableT;
							break;
						case 'TRADE': //币币账户
							that.chooseCoin.balance = item.usable;
							break;
						case 'OTC':   //法币账户
							that.chooseCoin.balance = item.balanceOtc;
							break;
					}
				}
			}
		},
		walletTypeName(type){
			switch(type){
                case 'T': 
                    return this.$t('assets.index.a2');
                    break;
                case 'TRADE': 
                    return this.$t('assets.index.a1');
                    break;
                case 'OTC': 
					return this.$t('assets.index.a3');         
					break;
			}
		}
	}
}
</script>
