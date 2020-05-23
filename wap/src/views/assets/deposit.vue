<template>
<div class="flexPage darkPage">
	<div class="currencyHead fixed themeHead">
		<navbar :params="pageInfo" />
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper">
			<div class="zcInfo cb">
				<div class="cell" @click="chooseCoin.show = true">
					<div class="cellLeft">
						<span>{{$t('form.otc.initiateAd.coin')}}</span>
						<b>{{chooseCoin.name}}</b>
					</div>
					<van-icon name="arrow"></van-icon>
				</div>
				<div class="many" v-if="isMany">
					<div>
						<div class="manyTab"><span @click="vProtocolIndex=index" :class="{active:vProtocolIndex==index}" v-for="(item,index) of protocolType" :key="index">{{item}}</span>
						</div>
						<div v-for="(item,index) of protocolType" class="manyCon" :class="{active:vProtocolIndex==index}" :key="index" :title="item">
							<div class="qrCode">
								<div class="codeImg">
									<qrcode class="qrcode" :value="walletAddress" :options="{ size: 240 }"></qrcode>
								</div>
								<p>{{$t('form.assets.saveCode')}}</p>
							</div>
							<div class="acountAddr">
								<h3>{{$t('form.assets.cbAddr')}}</h3>
								<div class="addr">{{walletAddress}}</div>
								<p @click="$mts.copy(walletAddress)">{{$t('form.assets.copyAddr')}}</p>
							</div>
						</div>
					</div>
					<!-- <van-tabs v-model="vProtocolIndex" class="manyTab">
					  	<van-tab v-for="item,index of protocolType" :key="index" :title="item">
					  		<div class="qrCode">
								<div class="codeImg">
									<qrcode class="qrcode" :options="{ size: 240 }">{{walletAddress}}</qrcode>
								</div>
								<p>{{$t('form.assets.saveCode')}}</p>
							</div>
							<div class="acountAddr">
								<h3>{{$t('form.assets.cbAddr')}}</h3>
								<div class="addr">{{walletAddress}}</div>
								<p @click="$mts.copy(walletAddress)">{{$t('form.assets.copyAddr')}}</p>
							</div>
					  	</van-tab>
					</van-tabs> -->
				</div>
				<div class="single" v-if="!isMany">
					<div class="qrCode">
						<div class="codeImg">
							<qrcode class="qrcode" :value="walletAddress" :options="{ size: 240 }"></qrcode>
						</div>
						<p>{{$t('form.assets.saveCode')}}</p>
					</div>
					<div class="acountAddr">
						<h3>{{$t('form.assets.cbAddr')}}</h3>
						<div class="addr">{{walletAddress}}</div>
						<p @click="$mts.copy(walletAddress)">{{$t('form.assets.copyAddr')}}</p>
					</div>
				</div>
			</div>
			<div class="promptInfo">
				{{$t('form.assets.t1')}}<br>
				{{$t('form.assets.t2')}}<b class="sellcolor" v-html="format(token, 'lowerLimitIn')"></b> <b class="sellcolor" v-html="format(token, 'symbol')"></b>。{{$t('form.assets.t3')}} <b class="sellcolor" v-html="format(token, 'symbol')"></b> {{$t('form.assets.t4')}}<br>
			</div>
		</div>
	</div>
	<van-action-sheet
		v-model="chooseCoin.show"
		:actions="coins"
		@select="onSelect"
	/>


	<van-dialog
		v-model="qrcode.show"
		:title="$t('form.assets.p1')"
	>	<div class="pt3 pb3">
		<qrcode class="qrcode" :value="walletAddress" :options="{ size: 220 }"></qrcode>
		</div>
	</van-dialog>

</div>
</template>
<script>
import number  from "@/views/modules/number.vue";
import navbar from "@/views/modules/navbar.vue"
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.index.n1'),
				url: '/depositHistory',
				value: '',
				icon: 'orders-o',
				navbarStyle: 'blue'
			},
    		defaultFrom:1,
    		chooseCoin:{
    			show:false,
    			name:"USDT"
			},
    		qrcode:{
    			show:false,

    		},
    		walletAddress:'--',
    		submiting:false,
    		vProtocolIndex:0,
    	}
    },
  	components:{number,navbar},
  	watch:{
  		"vProtocolIndex":function(cur,old){
  			if (cur != old) {
  				let array = this.protocolType;
  				if (cur < array.length) {
  					// 准备获取地址
  				}
  			}
  		}
  	},
  	computed:{
  		coins(){
  			let that = this;
  			let actions = [];
  			let map = that.$store.state.coin;
  			for(let coin in map){
  				let m = map[ coin];
  				if (m && m.allowIn == 'Y') {
  					actions.push({'name': coin});
  				}
  			}
  			return actions;
  		},
  		token(){
  			let that = this;
  			let map = that.$store.state.coin;
  			if(map){
  				return map[that.chooseCoin.name]
  			}
  			return {walletAddress:'',isManyProtocol:0,manyProtocolType:''}
  		},
  		isMany(){
  			let token = this.token;
  			if (token) {
  				return !token.isManyProtocol || token.isManyProtocol == 0 ? false : true;
  			}
  		},
  		protocolType(){
  			return this.token.manyProtocolType.split(',');
  		}
  	},
	mounted(){
		this.pageInit()
	},
	methods:{
		pageInit(){
			const that = this;
			that.$mts.checkLogin('needback',(res)=>{
				if (res) {
					that.$mts.configure();//  代币配置
					that.address();
				}
			},'deposit');
		},
		onSelect(item){
			this.chooseCoin.name = item.name;
			this.address();
			this.chooseCoin.show = false;
		},
		format(data, field){
			let empty = '--';
			if (data) {
				return data[ field];
			}
			return empty;
		},
		onCoinConfirm(tag,index){
			this.chooseCoin.name = tag;
			this.chooseCoin.show = false;
		},
		//钱包地址
		address(){
			let that = this;
			that.$mts.post({
                url:'chain/address',
                data:{
                	symbol:that.chooseCoin.name
                }, 
                success(response){
                    if(response.data.code == 200){
                    	console.log(response.data.data)
	          			that.walletAddress = response.data.data;
                    }
                }
		     });
		},
		submit(){
			let that = this;
			if (!that.submiting) {
				that.submiting = true;
				that.$mts.post({
					url:'wallet/deposit',
					data:{
						symbol: that.chooseCoin.name,
						number: that.form.number,
						imgUrl: that.form.imgUrl
					},success(response){
						if (response.data.code==200) {
							that.submiting = false;
							that.$toast(that.$t('message.assets.t1'));
							that.$router.push({name:'assets'});
						}
					}
				});
			}
		},
		showQrcode(){
			this.qrcode.show = true
		}
	}
}
</script>
