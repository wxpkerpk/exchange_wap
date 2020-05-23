<template>
<div class="flexPage themePage">
	<div class="flexHead">
		<navbar :params="pageInfo" />
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper">
			<div class="zcInfo adver kycCTwo">
				<div class="form">
					<div class="kycToast flexSpindle">{{$t('assets.kyc.t1')}}</div>
					<div class="uploadBox">
						<van-uploader :max-size="8388608" @oversize="oversize()" name="picFace" :after-read="onRead">
							<img v-if="!face" src="@/assets/img/picface.png" alt="" class="picface" />
							<img v-if="face" :src="formValidate.data.picFace.value" class="picUploader" />
						</van-uploader>
						<div v-if="!face" class="uploadBoxTitle">{{$t('assets.kyc.face')}}</div>
					</div>
					<div class="uploadBox">
						<van-uploader :max-size="8388608" @oversize="oversize()" name="picBack" :after-read="onRead">
							<img v-if="!back" src="@/assets/img/picback.png" alt="" class="picback">
							<img v-if="back" :src="formValidate.data.picBack.value" class="picUploader"/>
						</van-uploader>
						<div v-if="!back" class="uploadBoxTitle">{{$t('assets.kyc.back')}}</div>
					</div>
					<div class="uploadBox">
						<van-uploader :max-size="8388608" @oversize="oversize()" name="picHold" :after-read="onRead">
							<img v-if="!hold" src="@/assets/img/pichold.png" alt="" class="pichold">
							<img v-if="hold" :src="formValidate.data.picHold.value" class="picUploader"/>
						</van-uploader>
						<div v-if="!hold" class="uploadBoxTitle">{{$t('assets.kyc.hand')}}</div>
					</div>
					<div class="">
						<van-button size="large" @click="submit()" type="info">{{$t('button.assets.submit')}}</van-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default {
	data(){
		return {
			pageInfo:{
				title: 'C2认证',
				navbarStyle: 'blue'
			},
			formValidate:{
				submiting:false,
				validateAll:false,
				data:{
					picHold:{
						value:'',
						isError:true,
						isDefault:true
					},
					picBack:{
						value:'',
						isError:true,
						isDefault:true
					},
					picFace:{
						value:'',
						isError:true,
						isDefault:true
					}
				}
			},
    	}
    },
  	components:{navbar},
  	watch:{
  		"formValidate.data.picHold.value":function(){
  			this.formValidate.data.picHold.isDefault = false;
  			this.formValidate.data.picHold.isError = !this.formValidate.data.picHold.value;
  			this.checkAllForm();
  		},
  		"formValidate.data.picFace.value":function(){
  			this.formValidate.data.picFace.isDefault = false;
  			this.formValidate.data.picFace.isError = !this.formValidate.data.picFace.value;
  			this.checkAllForm();
  		},
  		"formValidate.data.picBack.value":function(){
  			this.formValidate.data.picBack.isDefault = false;
  			this.formValidate.data.picBack.isError = !this.formValidate.data.picBack.value;
  			this.checkAllForm();
  		}
  	},
  	computed:{
  		hold(){
  			let that = this;
  			if (that.formValidate.data && that.formValidate.data.picHold.value) {
  				return true;
  			}
  			return false;
  		},
  		face(){
  			let that = this;
  			if (that.formValidate.data && that.formValidate.data.picFace.value) {
  				return true;
  			}
  			return false;
  		},
  		back(){
  			let that = this;
  			if (that.formValidate.data && that.formValidate.data.picBack.value) {
  				return true;
  			}
  			return false;
  		}
  	},
	mounted(){
		 this.step();
	},
	methods:{
		checkAllForm(){
			let arr = [
                this.$data.formValidate.data.picHold.isDefault,
                this.$data.formValidate.data.picHold.isError,
                this.$data.formValidate.data.picBack.isDefault,
                this.$data.formValidate.data.picBack.isError,
                this.$data.formValidate.data.picFace.isDefault,
                this.$data.formValidate.data.picFace.isError
            ]
            // console.log(arr);
            let validate = true;
            for(let m in arr){
                if(arr[m]){
                    validate = false;
                }
            }
            this.$data.formValidate.validateAll = validate;
		},
		onRead(file, detail){
			// 开始上传图片
			let that = this;
			let data = new FormData();
			data.append('img', file.file);
			data.append('name', detail.name);
			that.$mts.upload({
				url:'kyc/upload',
				data,
				success(response){
					if (response.data.code == 200) {
						that.formValidate.data[ detail.name].value = response.data.data;
					}
				}
			});
		},
		step(){
			let that = this;
			that.$mts.post({
				url:'kyc/details',
				data:{
				},success(response){
					if (response.data.code == 200) {
						if (response.data.data) {
							let data = response.data.data
							that.formValidate.data.picBack.value = !data.picBack?'':data.picBack;
							that.formValidate.data.picFace.value = !data.picFace?'':data.picFace;
							that.formValidate.data.picHold.value = !data.picHold?'':data.picHold;
							if (data.step >= 6) {
								that.$router.push({'name': 'kyc'});
							}
						}
					}
				}
			});
		},
		oversize(){
			this.$toast(this.$t('assets.kyc.t2'));
		},
		submit(){
			let that = this;
			if ( that.formValidate.validateAll) {
				if ( !that.formValidate.submiting) {
					that.$mts.post({
						url:'/kyc/authC2',
						data:{
							picHold: that.formValidate.data.picHold.value,
							picBack: that.formValidate.data.picBack.value,
							picFace: that.formValidate.data.picFace.value
						},success(response){
							if (response.data.code == 200) {
								that.$toast(that.$t('assets.kyc.t3'));
								that.$router.push({'name':'kyc'});
							} 
						}
					});
				}
			} else {
				that.$toast(that.$t('assets.kyc.t4'));
			}
		}
	}
}
</script>
