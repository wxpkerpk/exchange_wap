<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="signWrapper">
                <div class="signHead">
                    <h3 v-if="kycStatus != 3">{{$t('user.kyc.verified')}}</h3>
                    <h3 v-if="kycStatus == 3">{{$t('user.kyc.verifiedSuc')}}</h3>
                </div>
                <div class="signForm kyc" v-if="kycStatus == 'LV0'">
                    <div class="cellGroup">
                        <p class="title">{{$t('form.kyc.firstName')}}</p>
                        <van-field v-model="form.firstName.value" :placeholder="$t('validate.kyc.t3')" clearable />
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.kyc.lastName')}}</p>
                        <van-field v-model="form.lastName.value" :placeholder="$t('validate.kyc.t4')" clearable />
                    </div>
                    <div class="cellGroup">
                        <p class="title">{{$t('form.kyc.idNumber')}}</p>
                        <van-field v-model="form.documentNumber.value" :placeholder="$t('validate.kyc.t2')" clearable></van-field>
                    </div>
                    <div class="btnBox fixed"><van-button size="large" @click="onNext" :class="{active: btnStatus}">{{$t('button.public.next')}}</van-button></div>
                </div>
                <div class="kycStatus" v-if="kycStatus == 'LV1_CHECK'">
                    <h3>{{$t('message.kyc.s1')}}</h3>
                    <p v-html="$t('message.kyc.n1')"></p>
                </div>
                <div class="kycStatus" v-if="kycStatus == 'LV1_REFUSE'">
                    <h3>{{$t('message.kyc.s2')}}</h3>
                    <p v-html="$t('message.kyc.n2')"></p>
                    <div class="btnBox"><van-button size="large" @click="goAgain">{{$t('button.public.recertification')}}</van-button></div>
                </div>
                <div class="signForm kyc" v-if="kycStatus == 'LV1_PASS'">
                    <van-cell-group>
                        <van-cell :title="$t('form.kyc.kycLevel')" :value="vLevel()" />
                        <van-cell :title="$t('form.kyc.realname')" :value="form.realName.value" />
                        <van-cell :title="$t('form.kyc.idType')" :value="form.documentType.value" />
                        <van-cell :title="$t('form.kyc.idNumber')" :value="$mkt.hideCode(form.documentNumber.value)" />
                    </van-cell-group>
                </div>
                <div class="signForm kyc" v-if="kycStatus == 'LV2_PASS'">
                    <van-cell-group>
                        <van-cell :title="$t('form.kyc.kycLevel')" :value="vLevel()" />
                        <van-cell :title="$t('form.kyc.realname')" :value="form.realName.value" />
                        <van-cell :title="$t('form.kyc.idType')" :value="form.documentType.value" />
                        <van-cell :title="$t('form.kyc.idNumber')" :value="$mkt.hideCode(form.documentNumber.value)" />
                    </van-cell-group>
                </div>
            </div>
        </div>    
	</div>
</template>
<script>
import backbar from "@/views/modules/back.vue"
export default {
	data(){
        return {
            backUrl:{
                url: 'security'
            },
            btnStatus: false,
            kycStatus: 'LV0',
            form:{
                realName:{
                    value: '',
                    isDefault: true,
                    isError: false
                },
                firstName: {
                    value: '',
                    isDefault: true,
                    isError: false
                },
                lastName: {
                    value: '',
                    isDefault: true,
                    isError: false
                },
                documentNumber:{
                    value: '',
                    isDefault: true,
                    isError: false
                },
                documentType:{
                    value: '',
                    isDefault: true,
                    isError: false
                }
            }
        }
    },
    components:{backbar},
    computed:{
        
    },
	mounted(){
        this.initPage();
    },
    watch:{
        "form.firstName.value":function(){
            if(!this.form.firstName.value){
                this.$mts.toast(this.$t('message.kyc.firstNameEmpty'));
            }
            this.form.firstName.isDefault = false;
            this.form.firstName.isError = !this.form.firstName.value;
            this.checkAllForm();
        },
        "form.lastName.value":function(){
            if(!this.form.lastName.value){
                this.$mts.toast(this.$t('message.kyc.lastNameEmpty'));
            }
            this.form.lastName.isDefault = false;
            this.form.lastName.isError = !this.form.lastName.value;
            this.checkAllForm();
        },
        "form.documentNumber.value":function(){
            if(!this.form.documentNumber.value){
                this.$mts.toast(this.$t('message.kyc.idCardEmpty'));
            }
            this.form.documentNumber.isDefault = false;
            this.form.documentNumber.isError = !this.form.documentNumber.value;
            this.checkAllForm();
        },
    },
	methods:{
        initPage(){
            let that = this;
            that.$mts.posts({
                url: 'api/me/security/kycStatus',
                data:{},
                success(response){
                    if(response.data.status == 200){
                        let data = response.data.data.data;
                        that.kycStatus = response.data.data.status;
                        if (data) {
                            that.form.realName.value = '*' + data.lastName;
                            that.form.documentType.value = data.documentType == 'NationalID' ? that.$t('form.kyc.idCard') : that.$t('form.kyc.passport');
                            that.form.documentNumber.value = data.documentNumber; 
                        }
                    }
                },
            })
        },
        checkAllForm(){
            let arr = [
                this.form.firstName.isDefault,
                this.form.firstName.isError,
                this.form.lastName.isDefault,
                this.form.lastName.isError,
                this.form.documentNumber.isDefault,
                this.form.documentNumber.isError,
            ];
            let validate = true;
            for(let i in arr){
                if(arr[i]){
                    validate = false;
                }
            }
            this.btnStatus = validate;
        },
        onNext(){
            let that = this;
            // if(that.btnStatus){
                // if(!that.$vld.checkValue(that.form.documentNumber.value,'idcard')){
                //     that.$mts.toast(that.$t('message.kyc.idCardError'));
                // }else{
                //     that.$router.push({path:'/c2',query:{param:that.form}});
                // }
            that.$router.push({path:'/c2',query:{param:that.form}});
            // }else{
            //     that.$mts.toast(that.$t('message.public.notEmpty'));
            // }
        },
        vLevel(){
            let that = this;
            if(that.kycStatus){
                switch(that.kycStatus){
                    case 'LV1_PASS':
                        return 'LV1';
                    case 'LV2_PASS':
                        return 'LV2';
                    default: 
                        return 'LV1';
                }
            }
        },
        goAgain(){
            this.kycStatus = 'LV0';
        }
	}
}
</script>
