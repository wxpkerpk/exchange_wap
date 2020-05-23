<template>
<div class="flexPage darkPage">
	<div class="flexHead">
	    <div class="currencyHead fixed themeHead">
			<navbar :params="pageInfo" />
		</div>
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper">
			<div class="zcInfo">
				<!-- 表单 -->
				<div class="form">
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.oldpwd')}}</div>
						<van-field type="password" v-model="formValidate.data.oldPassword.value" clearable :placeholder="$t('form.account.o1')" ></van-field>
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.newpwd')}}</div>
						<van-field type="password" v-model="formValidate.data.newPassword.value" clearable :placeholder="$t('form.account.n1')" />
					</div>
					<div class="cellGroup">
						<div class="tbTitle">{{$t('form.account.repwd')}}</div>
						<van-field type="password" v-model="formValidate.data.rePassword.value" clearable :placeholder="$t('form.account.r1')" />
					</div>
					<div class="submitBox">
						<van-button size="large" :loading="formValidate.submiting" @click="submit()">{{$t('button.otc.sure')}}</van-button>
					</div>
				</div>
			</div>
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
				title: this.$t('form.signup.changePsw'),
				navbarStyle: 'blue'
			},
    		formValidate:{
    			submiting:false,
    			validateAll:false,
    			validateTwice:false,
    			data:{
    				oldPassword:{
	    				value:"",
	    				isError:false,
	    				isDefault: true
	    			},
	    			newPassword:{
	    				value:"",
	    				isError:false,
	    				isDefault: true
	    			},
	    			rePassword:{
						value:"",
	    				isError:false,
	    				isDefault: true
	    			}
    			}
    		}
    	}
    },
  	components:{navbar},
  	watch:{
  		'formValidate.data.oldPassword.value':function(){
            this.$data.formValidate.data.oldPassword.isDefault = false;

            if(this.$vld.checkValue(this.$data.formValidate.data.oldPassword.value,'password')){ 
                this.$data.formValidate.data.oldPassword.isError = false;
            }else{
                this.$data.formValidate.data.oldPassword.isError = true;
            }
        },
        'formValidate.data.newPassword.value':function(){
            this.$data.formValidate.data.newPassword.isDefault = false;

            if(this.$vld.checkValue(this.$data.formValidate.data.newPassword.value,'password')){ 
            	this.$data.formValidate.data.newPassword.isError = false;
                //超过6位
                if(this.$data.formValidate.data.newPassword.value == this.$data.formValidate.data.rePassword.value){
                	this.$data.formValidate.validateTwice = true;
                }else{
                    //如果不相同
                    if(this.$data.formValidate.data.rePassword.isDefault){
                    	this.$data.formValidate.validateTwice = true;;
                    }else{
                    	this.$data.formValidate.validateTwice = false;
                    }
                }
            }else{
                this.$data.formValidate.data.newPassword.isError = true;
            }
        },
        'formValidate.data.rePassword.value':function(){
            this.$data.formValidate.data.rePassword.isDefault = false;

            if(this.$vld.checkValue(this.$data.formValidate.data.rePassword.value,'password')){ //1
            	this.$data.formValidate.data.rePassword.isError = false;
                if(this.$data.formValidate.data.newPassword.value == this.$data.formValidate.data.rePassword.value){
                	this.$data.formValidate.validateTwice = true;
                }else{
                    //如果不相同
                    if(this.$data.formValidate.data.newPassword.isDefault){
                    	this.$data.formValidate.validateTwice = true;;
                    }else{
                    	this.$data.formValidate.validateTwice = false;
                    }
                }
            }else{
                this.$data.formValidate.data.rePassword.isError = true;
            }
        }
  	},
  	computed:{
  	},
	mounted(){
		let that = this;
		that.$mts.checkLogin('needback',(res)=>{
			if (res) {
				// 已登录 do thing
			}
		},'changePsw');
	},
	methods:{
        checkAllForm(){
        	let that = this;
        	if ( that.formValidate.data.oldPassword.isDefault
        		|| that.formValidate.data.newPassword.isDefault
        		|| that.formValidate.data.rePassword.isDefault) {
                console.log(that.formValidate.data.oldPassword.isDefault)
                console.log(that.formValidate.data.newPassword.isDefault)
                console.log(that.formValidate.data.rePassword.isDefault)
        		return that.$t('validate.public.notNull');
        	}

        	if ( that.formValidate.data.oldPassword.isError) {
        		return that.$t('validate.public.oldPswError');
        	}
        	if ( that.formValidate.data.newPassword.isError ||
        		 that.formValidate.data.rePassword.isError) {
        		return that.$t('validate.public.newPswError');
        	}
        	if ( !that.formValidate.validateTwice) {
        		return that.$t('validate.public.notSame');
        	}
        	// 验证通过
        	return false;
        },
		submit(){
			let that = this;
			if ( !that.formValidate.submiting) {
				let message = that.checkAllForm();
				if ( !message) { // 验证通过
					that.formValidate.submiting = true;
					that.$mts.posts({
						url:'user/logon/password',
						data:{
							password:that.formValidate.data.oldPassword.value,
							newPassword:that.formValidate.data.newPassword.value,
							againPassword:that.formValidate.data.rePassword.value
						},success(response){
							that.formValidate.submiting = false;
							if (response.data.code == 200) {
								that.$toast(that.$t('validate.public.changePswSuc'));
								that.$mts.signout();
							}
						}
					});
				} else {
					that.$toast(message);
				}
			}
		}
	}
}
</script>
