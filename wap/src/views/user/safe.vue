<template>
<div class="flexPage themeColor">
	<div class="flexHead">
	    <navbar :params="pageInfo" />
	</div>
	<div class="flexContent">
		<div class="">
			<van-cell-group class="normalCell">
				<van-cell :title="$t('assets.safe.bindEmail')" @click.native="$mts.goto(!email ? 'bindEmail' : '')" is-link :value="!email ? $t('assets.safe.notBind') : email" label="" />
				<van-cell :title="$t('assets.safe.bindMobile')" @click.native="$mts.goto(!mobile ? 'bindMobile' : '')" is-link :value="!mobile ? $t('assets.safe.notBind') : mobile" label="" />
				<van-cell :title="$t('form.password')" @click.native="$mts.goto('changePsw')" is-link :value="$t('assets.safe.modify')" label="" />
				<van-cell :title="$t('form.assets.tradePsw')" @click.native="$mts.goto('changeAssetsPsw')" is-link :value="$t('assets.safe.modify')" label="" />
			</van-cell-group>
		</div>
	</div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.personal.safe'),
				navbarStyle: 'normal',
				backname:"user"
			},
    		form:{

    		}
    	}
    },
  	components:{navbar},
  	watch:{},
  	computed:{
  		isLogin() {
            return this.$store.state.isLogin;
        },
        email(){
            return this.$mts.getUserValue('email');
        },
        mobile(){
        	return this.$mts.getUserValue('mobile');
        }
  	},
	mounted(){
	},
	methods:{
		
	}
}
</script>
