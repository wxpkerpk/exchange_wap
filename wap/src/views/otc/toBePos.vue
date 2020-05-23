<template>
<div class="flexPage darkPage">
    <div class="currencyHead fixed themeHead">
		<navbar :params="pageInfo" />
	</div>
    <div class="flexContent">
        <div class="zcInfoWrapper" v-if="type == 'apply'">
            <div class="zcInfo adver">
                <div class="form">
                    <div class="cellGroup">
                        <div class="tbTitle">{{$t('form.otc.applyM.merchantName')}}</div>
                        <van-field v-model="formValidate.data.nickName.value" :placeholder="$t('form.otc.applyM.t1')" />
                    </div>
                    <div class="textArea">
                        <p>{{$t('form.otc.applyM.applyReason')}}</p>
                        <textarea maxlength="140" v-model="formValidate.data.reason.value" :placeholder="$t('form.otc.applyM.t2')"></textarea>
                    </div>
                    <div class="mt3">
                        <van-button 
                            :loading="formValidate.submiting" 
                            @click="submit()" 
                            :loading-text="$t('button.otc.sure')" size="large" type="info">{{$t('button.otc.sure')}}
                        </van-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 审核中提示 -->
        <div class="kycBox" v-if="type == 'pending'">
			<h3 class="flexSpindle">{{$t('message.pending')}}</h3>
			<p class="kycError flexSpindle" v-html="$t('message.otc.i1')"></p>
		</div>
        <!-- 审核失败提示 -->
        <div class="kycBox" v-if="type == 'failed'">
            <h3 class="flexSpindle">{{$t('message.failed')}}</h3>
            <p class="kycError flexSpindle" v-html="$t('message.otc.i2')"></p>
        </div>
    </div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
import { constants } from 'crypto';
export default {
    data(){
        return {
            pageInfo: {title: this.$t('form.otc.applyM.applyMerchant'),navbarStyle: 'blue'},
            radio: '2',
            merchant:{},
            type:'apply',
            formValidate:{
                submiting:false,
                validateAll:false,
                validateTwice:false,
                data:{
                    nickName:{
                        value:"",
                        isError:false,
                        isDefault: true
                    },
                    reason:{
                        value:"",
                        isError:false,
                        isDefault: true
                    },
                }
            }
        }
    },
    components:{navbar},
    watch:{
        // 'formValidate.data.nickName.value':function(){
        //     this.$data.formValidate.data.nickName.isDefault = false;
        //     this.$data.formValidate.data.nickName.isError = this.$vld.checkValue(this.formValidate.data.nickName.value,'string');
        //     this.checkAllForm();
        // },
        // 'formValidate.data.reason.value':function(){
        //     this.$data.formValidate.data.reason.isDefault = false;
        //     this.$data.formValidate.data.reason.isError = this.$tool.judgeLength(this.formValidate.data.reason.value,140);
        //     this.checkAllForm();
        // },
    },
    mounted(){
        this.$mts.checkLogin('needback',()=>{
            if (this.$store.state.isLogin) {
                this.detail();
            }
        },'toBePos');
    },
    methods:{
        // checkAllForm(){
        //     let arr = [
        //         this.$data.formValidate.data.nickName.isDefault,
        //         this.$data.formValidate.data.nickName.isError,
        //         this.$data.formValidate.data.reason.isDefault,
        //         this.$data.formValidate.data.reason.isError
        //     ]
        //     let validate = true;
        //     for(let m in arr){
        //         if(arr[m]){
        //             validate = false;
        //         }
        //     }
        //     this.$data.formValidate.validateAll = validate;
        // },
        onChange(str){
        },
        onMerchantTypeConfirm(tag,index){
            this.merchantType.name = tag;
			this.chooseMerchantType.show = false;
        },
        formatType(data){
            let that = this;
            if(!data){
                that.type = 'apply';
            }else if(data.state == 1){
                that.type = 'pending';
            }else if(data.state == 0){
                that.type = 'failed';
            }
        },
        detail(){
            let that = this;
            that.$mts.post({
                url:'otc/merchant/details',
                data:{
                },success(response){
                    if (response.data.code==200) {
                        that.merchant = response.data.data;
                        that.formatType(that.merchant);
                    }
                }
            });
        },
        submit(){
            let that = this;


            if(!this.$data.formValidate.data.nickName.value || !this.$data.formValidate.data.reason.value.length){
                that.$toast(this.$t("validate.needAll"));
                return;
            }
            if(this.$data.formValidate.data.reason.value.length > 140){
                that.$toast(this.$t("message.otc.failed"));
                return;
            }


            if ( !that.formValidate.submiting) {
                that.formValidate.submiting = true;
                that.$mts.posts({
                    url:'otc/merchant/apply',
                    data:{
                        nickName: that.formValidate.data.nickName.value,
                        reason: that.formValidate.data.reason.value,
                    },success(response){
                        that.formValidate.submiting=false;
                        if ( response.data.code == 200) {
                            that.$toast(that.$t('message.otc.success'));
                            that.$router.push({'name':'otc'});
                        }
                    }
                });
            }
        }
    }
}
</script>
<style lang="stylus"></style>