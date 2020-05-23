<template>
<div class="flexPage themeColor">
	<div class="flexHead">
		<div class="signHead">
			<span class="signLogo"><img v-if="!$store.state.app.nightModel" src="../../assets/img/logo2.png"  alt=""><img v-if="$store.state.app.nightModel" src="../../assets/img/logo2_white.png" alt=""></span>
			<van-icon name="cross" @click="$router.push({name:'home'})"></van-icon>
		</div>
	</div>
	<div class="flexContent">
		<div class="signWrapper">
			<!-- 用户登录 -->
			<div class="signForm">
				<van-cell-group>
					<van-field type="text" clearable v-model="formValidate.data.username.value" maxlength="64" :placeholder="$t('form.username')">
					</van-field>
					<van-field class="mt4" :type="eyesOn?'text':'password'" v-model="formValidate.data.password.value" clearable :placeholder="$t('form.password')" maxlength="64">
						<div slot="right-icon" @click="eyesOn = !eyesOn" class="ml3"><van-icon :name="eyesOn?'eye-o':'closed-eye'" /></div>
					</van-field>
				</van-cell-group>
				<div class="pt8"><van-button :class="!submitStatus ? 'active' :''" size="large" @click="submit()">{{$t('form.signin.submit')}}</van-button></div>
				<p class="flexBothSidesVertical"><span @click="$router.push('/signup')">{{$t('form.signin.register')}}</span><span class="forgetPsw" @click="$router.push('/forget')">{{$t('form.signin.forget')}}</span></p>
			</div>
		</div>
	</div>
</div>
</template>
<script>
export default {
	data(){
    	return {
			cur: 0,
			eyesOn:false,
			submitStatus: false, // 是否校验成功
    		formValidate:{
                submiting:false,
                validateAll:false,
                data:{
                    username:{
                        type:"username",
                        value:"",
                        isDefault:true,
                        isError:false
                    },
                    password:{
                        type:"password",
                        value:"",
                        isDefault:true,
                        isError:false
                    }
                }
            },
    		initOk: false,
    		geetest: null, // 极验对象
    		dto:{

    		}
    	}
    },
  	components:{},
  	watch:{

  	},
  	computed:{},
	mounted(){
		let that = this;
		// 初始化极验
		that.$mts.initGt(( geetest)=>{
			that.callback( geetest); // 加载完成
		},(res)=>{ // 参数回调
            that.dto.gt_server_status = res.gt_server_status;
            that.dto.txHash = res.txHash;
		});
	},
	methods:{
		callback(geetest){
            var that = this;
            that.geetest = geetest;
            geetest.onReady(function(){
                //验证码ready之后才能调用verify方法显示验证码
                that.initOk = true;
            }).onSuccess(function(){
                that.login();
            }).onError(function(){
            	// 人机验证初始化失败
            	that.$toast(that.$t('validate.robot'));
            	setTimeout(()=>{
            		window.location.reload();
            	},3000)
            });
        },
		submit(){ 
		// 提交
			let that = this;
			if(!that.$vld.checkValue(that.formValidate.data.username.value,'username')){
				that.$toast(that.$t("validate.signup.usernameError"));
				return;
			}

			if(!that.$vld.checkValue(that.formValidate.data.password.value,'password')){
				that.$toast(that.$t("validate.public.passwordError"));
				return;
			}
			this.submitStatus = true;
			//完成输入框前端校验后  再调极验 
			if (that.initOk) {
				that.geetest.verify();
			} else {
				//选项不能为空~
				that.$toast(that.$t("validate.public.notEmpty"));
            	setTimeout(()=>{
            		window.location.reload();
            	},3000)
			}
		},
		login(){ 
		// 开始登陆
			var that = this;
			let validate = that.geetest.getValidate();
			if ( validate ) {
                that.$data.formValidate.submiting = true;
				that.dto.username = that.formValidate.data.username.value;
				that.dto.password = that.formValidate.data.password.value;
				that.dto.geetest_challenge = validate.geetest_challenge;
                that.dto.geetest_validate = validate.geetest_validate;
                that.dto.geetest_seccode = validate.geetest_seccode;
                that.dto.type = that.$vld.checkValue(that.formValidate.data.username.value,'email')?"email":"mobile";
				that.$mts.post({
					url:'user/login',
					data: that.dto,
					success(response){
                        if (response.data.code == 200) {
                            that.$toast(that.$t("validate.signin.success"));
                            that.$store.state.isLogin = true;
                            localStorage.setItem("token",response.data.data.token);
                            localStorage.setItem("user",JSON.stringify(response.data.data));
                            that.$data.formValidate.submiting = false;
                            if(that.$route.query.path){
                                that.$router.push({ path:that.$route.query.path});
                            }else{
                                that.$router.push({ name: 'home'});
                            }
                        } else {
							that.$toast( response.data.message);
							that.$data.formValidate.submiting = false;
                        }
					}
				});
			} else {
				// 录入信息有误  人机验证初始化失败
				that.$toast(that.$t('validate.robot'));
			}
		}
	}
}
</script>
