<template>
	<div class="flexPage themeBlue">
		<div class="flexHead">
			<div class="currencyHead themeHead">
				<navbar :params="pageInfo" />	
			</div>
		</div>
		<div class="flexContent">
			<div class="zcInfoWrapper">
				<div class="zcInfo inviteCode flexSide">
					<h4>{{inviteCode}}</h4>
					<span class="yourCode pb3">{{$t('assets.invite.yourInvite')}}</span>
					<div class="qrCode flexSide">
						<div class="codeImg">
							<qrcode :value="inviteUrl" tag="img" class="qrcode" :options="{ size: 240 }"></qrcode>
						</div>
						<span>{{$t('form.assets.saveCode')}}</span>
					</div>
					<div class="acountAddr">
						<div class="addr" v-html="inviteUrl"></div>
						<p @click="copy(inviteUrl)">{{$t('assets.invite.copyInvite')}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default{
	data(){
		return {
			pageInfo: {
				title: this.$t('assets.personal.myInvite'),
				navbarStyle: 'blue'
			},
			form:{

			},
		}
    },
  	components:{navbar},
  	watch:{},
  	computed:{
  		inviteCode(){
  			 return this.$mts.getUserValue('invitationCode');
  		},
        inviteUrl(){
            return this.$config.domain+"/#/signup?i=" + this.inviteCode
		},
  	},
	mounted(){
	},
	methods:{
        copy(text){ // 快速复制
            var _self = this;
            this.$copyText(text).then( (e)=> {
                this.$toast(this.$t('message.copy.success'))  
            }, function (e) {})
        },
	}
}
</script>
