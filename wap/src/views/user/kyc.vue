<template>
<div class="flexPage themePage">
	<div class="flexHead">
	    <navbar :params="pageInfo" />	
	</div>
	<div class="flexContent">
		<!--C1C2都未认证-->
		<div class="kycBox" v-if="type == 'c0'">
			<div>
				<p><span class="sellcolor">{{$t('assets.kyc.p1')}}</span><br/>{{$t('assets.kyc.p2')}}</p>
			</div>
			<div class="submitBtn">
				<van-button size="large" @click="$mts.gourl('c1')">{{$t('button.assets.toC1')}}</van-button>
			</div>
		</div>

		<!--C1认证完  未认证C2-->
		<div class="kycBox" v-if="type == 'c1'">
			<h3 class="flexSpindle">{{$t('assets.kyc.sC1')}}</h3>
			<div class="vanGroup">
				<van-cell-group>
					<van-cell :title="$t('form.account.username')" :value="truename" />
					<van-cell :title="$t('form.account.account')" :value="username" />
					<van-cell :title="$t('assets.kyc.country')" :value="country" />
					<van-cell :title="$t('assets.kyc.documentType')" :value="idType" />  <!-- 需要获取这个字段 -->
					<van-cell :title="$t('assets.kyc.documentNum')" :value="idNo" />
				</van-cell-group>
			</div>
			<div class="otcNotice">
				<p><span class="sellcolor">{{$t('assets.kyc.p3')}}</span><br>{{$t('assets.kyc.p4')}}</p>
			</div>
			<div class="submitBtn">
				<van-button size="large" @click="$mts.gourl('c2')"  type="info">{{$t('button.assets.todo')}}</van-button>
			</div>
		</div>

		<!-- C1认证失败 -->
		<div class="kycBox" v-if="type == 'c1fail'">
			<h3 class="flexSpindle">{{$t('assets.kyc.fC1')}}</h3>
			<p class="kycError flexSpindle">{{$t('assets.kyc.p5')}}</p>
			<div class="submitBtn">
				<van-button size="large" @click="$mts.gourl('c1')"  type="info">{{$t('button.assets.redo')}}</van-button>
			</div>
		</div>

		<!--C1、C2都认证完-->
		<div class="kycBox" v-if="type == 'c2'">
			<div class="formStyle">
				<div class="vanGroup">
					<van-cell-group>
						<van-cell :title="$t('form.account.username')" :value="truename" />
						<van-cell :title="$t('form.account.account')" :value="username" />
						<van-cell :title="$t('assets.kyc.country')" :value="country" />
						<van-cell :title="$t('assets.kyc.documentType')" :value="idType" />  <!-- 需要获取这个字段 -->
						<van-cell :title="$t('assets.kyc.documentNum')" :value="idNo" />
					</van-cell-group>
				</div>
				<div class="otcNotice">
					<p class="buycolor">{{$t('assets.kyc.p6')}}</p>
				</div>
			</div>
		</div>

		<!-- C2认证失败 -->
		<div class="kycBox" v-if="type == 'c2fail'">
			<h3 class="flexSpindle">{{$t('assets.kyc.fC2')}}</h3>
			<p class="kycError flexSpindle">{{remark}}</p>
			<div class="submitBtn">
				<van-button size="large" @click="$mts.gourl('c2')">{{$t('button.assets.redoC2')}}</van-button>
			</div>
		</div>

		<!-- 审核中 -->
		<div class="kycBox" v-if="type == 'Pending'">
			<h3 class="flexSpindle">{{$t('assets.kyc.review')}}</h3>
			<p class="kycError flexSpindle" v-html="$t('assets.kyc.p7')"></p>
		</div>

		<!-- 所有状态判断均已后端传入为准 -->
	</div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default {
	data(){
    	return {
			pageInfo: {
				title: this.$t('assets.personal.kyc'),
				navbarStyle: 'normal',
				backname:"user"
			},
    		form:{

    		},
    		info:{}
    	}
    },
  	components:{navbar},
  	watch:{},
  	computed:{
  		// 是否验证KYC
  		verified(){
  			let verified = this.$mts.getUserValue('verified');
  			return verified >= 3;
  		},
  		type(){
  			let v = 'c0';
  			let that = this;
  			if (!that.verified) {
				switch(that.info.step){
					case 3:
						v = 'c1';
						break;
					case 4:
						v = 'Pending';
						break;
					case 6:
						v = 'c2';
						break;	
					case 5:
						v = 'c2fail';
						break;		
					default :
						v = 'c0';	
				}
			} else {
				v = 'c2';
			}
  			return v;
  		},
  		uid(){
  			return this.$mts.getUserValue('uid');
  		},
  		username(){
  			return this.$mts.getUserValue('username');
  		},
  		truename(){
  			let that = this;
  			if (that.info && that.info.firstName) {
  				return that.info.firstName + '**';
  			}
  			return '';
  		},
  		country(){
  			let that = this;
  			if (that.info && that.info.country) {
  				return that.info.country;
  			}
  			return '';
  		},
  		idType(){
  			let that = this;
  			if (that.info && that.info.idType) {
  				return that.info.idType;
  			}
  			return '';
  		},
  		idNo(){
  			let that = this;
  			if (that.info && that.info.idNo) {
  				return that.info.idNo;
  			}
  			return '';
  		},
  		remark(){
  			let that = this;
  			if (that.info && that.info.remark) {
  				return that.info.remark;
  			}
  			return '';
  		},
  		state(){
  			let that = this;
  			if (that.info && that.info.state != 1) {
  				return that.info.state == 4 ? that.$t('assets.kyc.wait') : 
  						that.info.state == 6 ? that.$t('assets.kyc.success') : that.$t('assets.kyc.failed');
  			}
  			return '';
  		},
  		vColor(){
  			let that = this;
  			if (that.info && that.info.state != 1) {
  				return that.info.state == 2 ? 'sellcolor' : 
						that.info.state == 3 ? 'buycolor' : 'sellcolor';
  			}
  			return '';
  		}
  	},
	mounted(){
		let that = this;
		that.$mts.checkLogin('needback',(res)=>{
			if (res) {
				that.step(); 
			}
		},'kyc');
	},
	methods:{
		step(){
			let that = this;
			that.$mts.post({
				url:'kyc/details',
				data:{
				},success(response){
					if (response.data.code == 200) {
						console.log(response.data.data)

						if (response.data.data) {
							that.info = response.data.data;
						}
					}
				}
			});
		}
	}
}
</script>
