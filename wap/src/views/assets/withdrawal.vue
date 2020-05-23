<template>
<div class="flexPage darkPage">
	<div class="currencyHead fixed themeHead" >
		<navbar :params="pageInfo" />
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper">
			<div class="zcInfo tb">
				<div class="cell" @click="chooseCoin.show = true">
					<div class="cellLeft">
						<span>{{$t('form.otc.initiateAd.coin')}}</span>
						<b>{{chooseCoin.name}}</b>
					</div>
					<van-icon name="arrow"></van-icon>
				</div>
				<!-- 表单 -->
				<div class="form">
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.tbAddr')}}</div>
						<van-field v-model="form.address"  :placeholder="$t('form.assets.p3')">
							<span slot="button" @click="chooseAddressPop.show = true"><span class="transAll">{{$t('form.assets.chooseAddr')}}</span></span>
						</van-field>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.tbNum')}}
							<span class="tbMini">{{$t('form.assets.max')}}<span class="ml1">{{num}}</span> {{chooseCoin.name}}</span>
							<span class="setAll" @click="form.number = num">{{$t('trade.all')}}</span>
						</div>
						<van-field v-model="form.number" :placeholder="$t('form.assets.p4')" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.arrival')}}<span class="tbMini">{{$t('form.assets.fee')}} <span>{{token.outFee}} {{token.feeSymbol}}</span></span></div>
						<van-field class="sjAcount" placeholder="" :value="vReal" disabled/>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.tradePsw')}}</div>
						<van-field v-model="form.password" type="password" :placeholder="$t('form.assets.p5')" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.sms')}}</div>
						<van-field v-model="form.sms" :placeholder="$t('form.assets.p6')" clearable>
						</van-field>
						<van-button slot="button"  class="smsBtn" :disabled="sms.status==1" @click="sendSms('mobile')">{{smsBtn}}</van-button>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.assets.email')}}</div>
						<van-field v-model="form.email" :placeholder="$t('form.assets.p6')" clearable>
						</van-field>
						<van-button slot="button"  class="smsBtn" :disabled="email.status==1" @click="sendSms('email')">{{emailBtn}}</van-button>
					</div>
					<div class="submitBox">
						<van-button size="large" @click="submit()" :disabled="submiting">{{$t('button.assets.sure')}}</van-button>
					</div>
				</div>
			</div>
			<div class="promptInfo" v-html="$t('form.assets.s2',{lowerLimitOut:token.lowerLimitOut,symbol:token.symbol})"></div>
		</div>
	</div>


	<!--选择地址-->
	<van-popup v-model="chooseAddressPop.show"  :default-index="1" position="bottom" :overlay="true" class="downToUp">
		<div class="pop">
			<div class="adlist">
				<ul>
					<li @click="choose(item)" v-for="(item,index) of chooseAddressPop.data" :key="index">
						<p>{{item.token}} - {{item.address}}</p>
						<p>{{item.remark}}</p>
					</li>
				</ul>
			</div>
		</div>
	</van-popup>


	<!-- 选择币种 -->
	<van-action-sheet
		v-model="chooseCoin.show"
		:actions="coins"
		@select="onSelect"
	/>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.index.n2'),
				url: '/withdrawalHistory',
				value: '',
				icon: 'orders-o',
				navbarStyle: 'blue'
			},
			actions:[{name: 'ETC'},{name: 'EMC'},{name: 'USDT'}],
    		sms:{
                status:0,
                second:60
            },
            email:{
                status:0,
                second:60
            },
    		chooseAddressPop:{
    			show:false,
    			data:[]
    		},
    		chooseCoin:{
    			show:false,
    			name:'USDT'
    		},
    		form:{
    			address:'',
    			number:0,
    			password:'',
    			sms:'',
    			email:'',
    		},
    		submiting:false,
			list:[], // 资产数据
			num:0,
    	}
    },
  	components:{navbar},
  	watch:{
  		"chooseCoin.name":function(cur,old){
  			if (cur != old) {
  				this.address();
  			}
  		},
  		"form.number":function(cur,old){
  			if (Number(cur) > this.token.usable) {
  				this.form.number = this.token.usable;
  			}
  		}
  	},
  	computed:{
  		vReal(){ // 实际到账
			let that = this;
			let number = that.form.number;
			if (that.chooseCoin.name === that.token.feeSymbol) {
				let surplus = Number(that.form.number - that.token.outFee);
				return (surplus <= 0 ? 0 : that.$tdp.fmtZero(surplus)) + ' ' + that.chooseCoin.name;
			}
			return (!number ? 0 : number) + ' ' + that.chooseCoin.name;
		},
		coins(){
			let that = this;
			let actions = [];
			let map = that.$store.state.coin;
			for(let coin in map){
				let m = map[coin];
				if (m && m.allowOut == 'Y') {
					actions.push({'name': coin});
				}
			}
			return actions;
		},
  		token(){ // 当前货币
			let that = this;
			let map = that.$store.state.coin;
			if (map && map[that.chooseCoin.name]) {
				let token = map[that.chooseCoin.name];
				for(let idx = 0;idx < that.list.length;idx ++){
					let m = that.list[ idx];
					if (m.token == that.chooseCoin.name) {
						token['usable'] = m.usable;
					}
				}
				return token;
			}
			return {lowerLimitOut:'', feeSymbol:'USDT', outFee:''}
		},
		smsBtn(){
			let that = this;
            switch(that.sms.status){
                case 0:     //正常
                    return that.$t('button.assets.sendSms');
                    break;
                case 1:     //发送中
                    return that.$t('button.assets.hasSend')+"("+that.sms.second+"s)"
                    break;
                case 2:     //重新发送
                    return that.$t('button.assets.reSend');
                    break;
            }
        },
        emailBtn(){
			let that = this;
            switch(that.email.status){
                case 0:     //正常
                    return that.$t('button.assets.sendSms');
                    break;
                case 1:     //发送中
                    return that.$t('button.assets.hasSend')+"("+that.email.second+"s)"
                    break;
                case 2:     //重新发送
                    return that.$t('button.assets.reSend');
                    break;
            }
        }
	},
	mounted(){
		const that = this;
		that.$mts.checkLogin('needback',(res)=>{
			that.$mts.mustBondAll();
			if (res) {
				that.$mts.configure();//  代币配置
				that.address();
				that.assets();
				that.wallet();
			}
		},'withdrawal');
	},
	methods:{
		onSelect(item){
			this.chooseCoin.name = item.name;
			this.wallet();
			this.chooseCoin.show = false;
		},
		address(){
			let that = this;
			that.$mts.post({
				url:'cheque/list',
				data:{
					symbol: that.chooseCoin.name
				},success(response){
					if(response.data.code==200){
						that.chooseAddressPop.data = response.data.data;
					}
				}
			});
		},
		choose(item){
			this.chooseAddressPop.show = false;
			if (item) {
				this.form.address = item.address;
			}
		},
		assets(){ // 我的资产
			let that = this;
			that.$mts.post({
                url:'wallet/details',
                data:{}, //
                success(response){
                	console.log(response.data)
                    if(response.data.code == 200){
						that.list = response.data.data;
                    }
                }
			});
		},
		//用户当前货币钱包信息
        wallet(){
            let that = this;
            that.$mts.post({
                url:'wallet/info',
                data:{
                    symbol:that.chooseCoin.name,
                },success(response){
                    if (response.data.code == 200) {
                    	if( response.data.data){
                    		let info = response.data.data;
                        	that.num = info.balance - info.frozenBalance;
                    	}else{
                    		that.num = 0;
                    	}
                    }
                }
            });
        },
		sendSms(type){
			let that = this;
			if (!that.form.number || Number(that.form.number) < that.token.lowerLimitOut) {
				that.$toast(that.$t('message.assets.t5')+'【' 
					+ that.token.lowerLimitOut 
					+ ' '
					+ that.chooseCoin.name +'】');
				return;
			}
			// 需要验证原密码是否正确
			if (that.$vld.checkValue(that.form.password,'password')) {
				if(type == 'mobile'){
					if(that.$data.sms.status!=1){
						that.$data.sms.second = 60;
			            that.$data.sms.status = 1;
		             	//点击发送验证码按钮后，按钮禁用。60秒后才能调用
		            	var countdown = setInterval(()=>{
		                	that.$data.sms.second --;
		                	if(that.$data.sms.second <= 0){
		                    	that.$data.sms.status = 2;
		                    	clearInterval(countdown);
		                	}
		            	},1000);
		            	that.$mts.post({
		            		url:'chain/captcha',
		            		data:{
		            			password: that.form.password,
		            			type:type,
		            		},success(response){
		            			// 发送成功
		            			if (response.data.code==200) {
		            				that.$toast(that.$t('validate.smsStatus.sucess'));
		            			}
		            		}
		            	});
					}
				}else{
					if(that.$data.email.status!=1){
						that.$data.email.second = 60;
			            that.$data.email.status = 1;
		             	//点击发送验证码按钮后，按钮禁用。60秒后才能调用
		            	var countdown = setInterval(()=>{
		                	that.$data.email.second --;
		                	if(that.$data.email.second <= 0){
		                    	that.$data.email.status = 2;
		                    	clearInterval(countdown);
		                	}
		            	},1000);
		            	that.$mts.post({
		            		url:'chain/captcha',
		            		data:{
		            			password: that.form.password,
		            			type:type,
		            		},success(response){
		            			// 发送成功
		            			if (response.data.code==200) {
		            				that.$toast(that.$t('validate.smsStatus.sucess'));
		            			}
		            		}
		            	});
					}
				}	
			} else {
				that.$toast(that.$t('message.assets.t6'));
			}	
		},
		submit(){
			let that = this;
			if (!that.form.number || Number(that.form.number) < that.token.lowerLimitOut) {
				that.$toast(that.$t('message.assets.t5')+'【' 
					+ that.token.lowerLimitOut 
					+ ' '
					+ that.chooseCoin.name +'】');
				return;
			}

			switch(this.chooseCoin.name){
				case "ETH":
					if(!this.$vld.checkValue(this.form.address,'eth')){
						this.$toast(this.$t("assets.widthdraw.notEth"))
						return
					}
				break;
				case "BTBT":
					if(!this.$vld.checkValue(this.form.address,'eth')){
						this.$toast(this.$t("assets.widthdraw.notEth"))
						return
					}
				break;
				case "USDT":
					if(!this.$vld.checkValue(this.form.address,'eth')){
						this.$toast(this.$t("assets.widthdraw.notEth"))
						return
					}
				break;
			}



			if (!that.submiting) {
				that.submiting = true;
				that.$mts.post({
					url:'chain/withdraw',
					data:{
						symbol: that.chooseCoin.name,
						address: that.form.address,
						number: that.form.number,
						password: that.form.password,
						sms: that.form.sms,
						eml: that.form.email
					},success(response){
						if (response.data.code==200) {
							that.submiting = false;
							that.$toast(that.$t('message.assets.t7'));
							that.$router.push({name:'withdrawalHistory'});
						}
					}
				});
			}
		},
		onCoinConfirm(tag,index){
			this.chooseCoin.name = tag;
			this.form.number = '';
			this.chooseCoin.show = false;
		},
		onAddressConfirm(tag,index){
			this.chooseAddressPop.show = false;
		}
		
	}
}
</script>
