<template>
<div class="flexPage" style="background: #071927;">
	<div class="flexContent" style="position: relative;">
		<a href="javascript:void(0)" class="backToLink" @click="$router.go(-1)"><van-icon name="arrow-left" /></a>
		<div class="qrcodeImg" ref="imageWrapper">
    		<img class="real_pic" :src="dataURL" style="position: absolute;left:0;right:0;width:100%;top:0;z-index:200" />
			<slot>
				<img src="@/assets/img/btbit-white.png" class="showLogo" alt="">
				<div style="background: #071927; position: relative; height:100vh;">
					<img src="@/assets/img/sharebg.jpg" alt="">
					<div class="qrcontent">
						<h1>{{$t('assets.invite.give')}}</h1>
						<h2>5~9USDT</h2>
						<div class="qrimg">
							<qrcode :value="inviteUrl" style="background: #fff;padding:2px;" class="qrcode" :options="{ size: 210 }"></qrcode>
							<p>{{$t('assets.invite.t1')}}</p>
						</div>
					</div>
					<p class="downP">{{$t('assets.invite.t2')}}</p>
				</div>
			</slot>
		</div>
	</div>
</div>
</template>
<style scoped lang="stylus">
.backToLink{font-size:6vw;font-weight:bold;
	color:#fff;position: fixed;z-index:201;left:3vw;top:4vw;display: flex;align-items:center;
}
.qrcontent{
	position:absolute;width:100vw;left:0;top:15vw;margin:0 0 0 0px; text-align:center;color:#fff;
	h1{color:#fff;font-size:7.0vw;}
	h2{color:#fff;padding:0 0 0px 0;font-size:12vw;}
	.qrimg{
		p{padding-top:10px;}
	}
}
.downP{padding:0px 10px; position:absolute;left:0;text-align:center; bottom:10vw;right:0;color:#fff;}
.showLogo{
	width:20vw;position:absolute;left:13vw;top:3vw;z-index:232;
}
</style>
<script>
import html2canvas from "html2canvas"
export default {
	data(){
    	return {
    		dataURL:"",
    		timeout:null
    	}
    },
  	components:{},
  	watch:{},
  	computed:{
  		inviteUrl(){
  			let that = this;
  			let inviteCode = that.$mts.getUserValue('invitationCode');
            return that.$config.domain+"/#/signup?i=" + inviteCode;
        },
  	},
    beforeRouteLeave (to, from, next) {
        clearTimeout(this.timeout)
        next();
    },
	mounted(){
		this.timeout = setTimeout(()=>{
			this.toImage()
		},1000)
	},
	methods:{
		toImage() {
		    html2canvas(this.$refs.imageWrapper,{
		        backgroundColor: null
		    }).then((canvas) => {
		        let dataURL = canvas.toDataURL("image/png");
		        this.dataURL = dataURL;
		    });
		}
	}
}
</script>
