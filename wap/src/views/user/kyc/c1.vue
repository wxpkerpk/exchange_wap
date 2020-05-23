<template>
<div class="flexPage themePage">
	<div class="flexHead">
	    <navbar :params="pageInfo" />
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper">
			<div class="zcInfo adver">
				<div class="form">
					<div class="cellGroup">
						<div class="tbTitle">{{$t('assets.kyc.country')}}</div>
						<van-cell v-model="formValidate.data.country.value" :title="formValidate.data.country.value" @click="chooseContry.show=true" is-link size="large" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.lastname')}}</div>
						<van-field v-model="formValidate.data.firstName.value" :placeholder="$t('assets.kyc.l1')"  />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.firstname')}}</div>
						<van-field v-model="formValidate.data.lastName.value" :placeholder="$t('assets.kyc.f1')"  />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('assets.kyc.documentType')}}</div>
						<van-cell v-model="formValidate.data.idType.value" :title="formValidate.data.idType.value" @click="chooseCard.show=true" is-link size="large" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('assets.kyc.documentNum')}}</div>
						<van-field v-model="formValidate.data.idNo.value" :placeholder="$t('assets.kyc.n1')"  />
					</div>
					<div class="mt5">
						<van-button 
							:disabled="formValidate.submiting"
							@click="submit()" 
							size="large">{{$t('form.submit')}}
						</van-button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!--选择国家-->
	<van-popup v-model="chooseContry.show"  :default-index="1" position="bottom" :overlay="true">
		<van-picker :columns="chooseContry.data" show-toolbar  @cancel="chooseContry.show=false" @confirm="onContryConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
	</van-popup>
	<!-- 选择证件 -->
	<van-popup v-model="chooseCard.show"  :default-index="1" position="bottom" :overlay="true">
		<van-picker :columns="chooseCard.data" show-toolbar  @cancel="chooseCard.show=false" @confirm="onCardConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
	</van-popup>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.kyc.c1'),
				navbarStyle: 'blue'
			},
    		chooseContry:{
    			data:[this.$t('assets.kyc.china'),this.$t('assets.kyc.usa')],
    			show:false,
			},
			chooseCard:{
    			data:[],
    			show:false,
    		},
    		formValidate:{
    			submiting:false,
    			validateAll:false,
    			data:{
    				lastName:{
    					value:'',
    					isDefault:true,
    					isError:false
    				},
    				firstName:{
    					value:'',
    					isDefault:true,
    					isError:false
    				},
    				country:{
    					value:this.$t('assets.kyc.china'),
    					isDefault:false,
    					isError:false
    				},
    				idType:{
    					value:this.$t('assets.kyc.idCard'),
    					isDefault:false,
    					isError:false
    				},
    				idNo:{
    					value:'',
    					isDefault:true,
    					isError:false
    				}
    			}
    		}
    	}
    },
  	components:{navbar},
  	watch:{
  		// 'formValidate.data.firstName.value':function(){
    //         this.$data.formValidate.data.firstName.isDefault = false;
    //         this.$data.formValidate.data.firstName.isError = this.$vld.checkValue(this.formValidate.data.firstName.value,'string');
    //         this.checkAllForm();
    //     },
    //     'formValidate.data.lastName.value':function(){
    //         this.$data.formValidate.data.lastName.isDefault = false;
    //         this.$data.formValidate.data.lastName.isError = this.$vld.checkValue(this.formValidate.data.lastName.value,'string');
    //         this.checkAllForm();
    //     },
    //     'formValidate.data.idNo.value':function(){
    //         this.$data.formValidate.data.idNo.isDefault = false;
    //         this.$data.formValidate.data.idNo.isError = !this.$vld.checkValue(this.formValidate.data.idNo.value,'idcard');
    //         this.checkAllForm();
    //     }
  	},
  	computed:{
  	},
	mounted(){
		this.step();
		this.dict();
	},
	methods:{
		checkAllForm(){
			let arr = [
                this.$data.formValidate.data.firstName.isDefault,
                this.$data.formValidate.data.firstName.isError,
                this.$data.formValidate.data.lastName.isDefault,
                this.$data.formValidate.data.lastName.isError,
                this.$data.formValidate.data.country.isDefault,
                this.$data.formValidate.data.country.isError,
                this.$data.formValidate.data.idType.isDefault,
                this.$data.formValidate.data.idType.isError,
                this.$data.formValidate.data.idNo.isDefault,
                this.$data.formValidate.data.idNo.isError
            ]
			console.log(arr);
            let validate = true;
            for(let m in arr){
                if(arr[m]){
                    validate = false;
                }
            }
            this.$data.formValidate.validateAll = validate;
		},
		step(){
			let that = this;
			that.$mts.post({
				url:'kyc/details',
				data:{
				},success(response){
					if (response.data.code == 200) {
						if (response.data.data) {
							that.info = response.data.data;
							if(that.info){
								that.formValidate.data.firstName.value =  that.info.firstName;
								that.formValidate.data.lastName.value =  that.info.lastName;
								that.formValidate.data.country.value =  that.info.country;
								that.formValidate.data.idType.value =  that.info.idType;
							}
							if (that.info.step >= 1) {
								that.$router.push({'name': 'kyc'});
							}
						}
					}
				}
			});
		},
		submit(){
			let that = this;
			if(!this.formValidate.data.lastName.value){
				that.$toast(that.$t('message.otc.require'));
				return
			}
			if(!this.formValidate.data.firstName.value){
				that.$toast(that.$t('message.otc.require'));
				return
			}
			if(!this.formValidate.data.idNo.value){
				that.$toast(that.$t('message.otc.require'));
				return
			}
			if (!that.formValidate.submiting) {
				that.formValidate.submiting = true;
				that.$mts.posts({
					url:'kyc/authC1',
					data:{
						firstName: that.formValidate.data.firstName.value,
						lastName: that.formValidate.data.lastName.value,
						country: that.formValidate.data.country.value,
						idType: that.formValidate.data.idType.value,
						idNo: that.formValidate.data.idNo.value
					},success(response){
						that.formValidate.submiting=false;
						if ( response.data.code == 200) {
							that.$router.push({'name':'c2'});
						}
					}
				});
			}
		},
		onContryConfirm(value,index){
			this.formValidate.data.country.value = value;
			this.chooseContry.show = false;
		},
		onCardConfirm(value,index){
			this.formValidate.data.idType.value = value;
			this.chooseCard.show = false;
		},
		dict(){
            let that = this;
            that.$mts.post({
                url:'dict',
                data:{
                    type:'C1'
                },success(response){
                    if(response.data.code == 200){
                        that.chooseCard.data = response.data.data
                    }
                }
            });
        },
	}
}
</script>
