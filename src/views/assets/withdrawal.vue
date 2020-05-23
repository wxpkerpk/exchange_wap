<template>
    <div class="flexPage withdrawal">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="assetsWrapper">
                <!-- <loading v-if="submiting"/> -->
                <div class="assetsForm">
                    <div class="assetsHead">
                        <h3>{{$t('user.index.withdrawal')}}</h3>
                    </div>
                    <van-cell :title="defaultCoin"></van-cell>
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('user.withdrawal.withdrawalAddr')}}</div>
						<van-field v-model="formValidate.data.withdrawAddr.value" :placeholder="$t('validate.withdrawal.t1')" @blur="onBlur('address')">
                            <i slot="right-icon" class="iconfont iconDrop-downmenu"  @click="showAddress = true" />
                        </van-field>
                    </div>
                    <div class="cellGroup">
                        <div class="title">{{$t('user.withdrawal.withdrawalNum')}}</div>
						<van-field type="number" v-model="formValidate.data.withdrawNum.value" @input="onInput" :placeholder="$t('validate.withdrawal.t2') + limitInfo.minWithdrawNumber+ ' ' + defaultCoin" @blur="onBlur('number')">
                            <span slot="button" @click="allExtract" class="select">{{$t('user.withdrawal.all')}}</span>
                        </van-field>
                        <div class="available">{{$t('user.withdrawal.available') + ' ' + limitInfo.balanceAvailable + ' ' + defaultCoin}}</div>
                    </div>
                    <div class="cellGroup">
                        <div class="title">{{$t('user.withdrawal.fee')}}</div>
						<van-field v-model="fee" class="fw" disabled>
                            <span slot="button" class="select fee">{{defaultCoin}}</span>
                        </van-field>
                    </div>
                    <div class="limitBox">
                        <p>{{$t('user.withdrawal.limit')}}</p>
                        <div class="limitInfo">
                            <dl>
                                <dd>{{$t('user.withdrawal.minAmount')}}</dd>
                                <dd>{{limitInfo.minWithdrawNumber + ' ' + defaultCoin}}</dd>
                            </dl>
                            <dl>
                                <dd>{{$t('user.withdrawal.maxAmount')}}</dd>
                                <dd>{{limitInfo.withdrawOne + ' ' + defaultCoin}}</dd>
                            </dl>
                            <dl>
                                <dd>{{$t('user.withdrawal.limitAmount')}}</dd>
                                <dd>{{limitInfo.withdrawAmount + ' ' + defaultCoin}}</dd>
                            </dl>
                            <dl>
                                <dd>{{$t('user.withdrawal.maxTimes')}}</dd>
                                <dd>{{limitInfo.dailyLimitNumber+ ' ' +$t('user.withdrawal.times')}}</dd>
                            </dl>
                        </div>
                    </div>
                    <div class="bottomFixed">
                        <div class="realAvailable flexLevel">
                            <span>{{$t('user.withdrawal.arriveNum')}}</span>
                            <span>{{availalbe+' '+defaultCoin}}</span>
                        </div>
                        <div class="assetsBtn">
                            <van-button class="active" size="large" @click="onFirst">{{$t('button.public.submit')}}</van-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>    

        <!-- 选择币种 -->
        <!-- <van-popup v-model="withdraw.showCoin" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('user.public.chooseCoin')}}</span>
                    <van-icon name="cross" @click="withdraw.showCoin = false" />
                </div>
                <div class="content">
                    <nodata v-if="!coins || coins.length == 0" />
                    <ul v-else>
                        <li v-for="(item,index) in coins" :key="index" :class="{active:cur == index}" @click="cur = index"><span><img :src="item.icon" alt="">{{item.coinCode}}</span></li>
                    </ul>
                </div>
                <div class="btnBox"><van-button size="large" @click="onChooseCoin" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup>  -->

        <!-- 确认提交 -->
        <van-popup v-model="withdraw.showCode" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('user.index.withdrawal')}}</span>
                    <van-icon name="cross" @click="withdraw.showCode = false" />
                </div>
                <div class="cellGroup mt4" v-if="userInfo.telPhone">
                    <div class="title">{{$t('form.safe.smsCode')}}</div>
                    <van-field v-model="formValidate.data.smsCode.value" :placeholder="$t('validate.safe.m2')">
                        <span slot="button" @click="sendSms('mobile')" :disabled="sms.status==1" class="select send">{{smsBtn}}</span>
                    </van-field>
                </div>
                <div class="cellGroup mt4" v-if="!userInfo.telPhone">
                    <div class="title">{{$t('form.safe.emailCode')}}</div>
                    <van-field v-model="formValidate.data.emailCode.value" :placeholder="$t('validate.safe.e2')">
                        <span slot="button" @click="sendSms('email')" :disabled="email.status==1" class="select send">{{emailBtn}}</span>
                    </van-field>
                </div>
                <div class="cellGroup">
                    <div class="title">{{$t('activity.fundPsw')}}</div>
                    <van-field type="password" v-model="formValidate.data.fundPsw.value" :placeholder="$t('validate.withdrawal.t3')" />
                </div>
                <div class="btnBox"><van-button size="large" @click="onSubmit" :class="{active: btnStatus}">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup> 

        <!-- 提示去认证KYC -->
        <van-popup v-model="showToast" class="showMore">
            <div class="goModal dark">
                <h3>{{$t('message.public.systemTitle')}}</h3>
                <p>{{$t('form.kyc.noKyc')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showToast = false">{{$t('button.public.know')}}</span>
                    <span class="btn2" @click="$router.push({name: 'c1'})">{{$t('button.public.goConfirm')}}</span>
                </div>
            </div>
        </van-popup> 

        <!-- 显示提币地址 -->
        <van-popup v-model="showAddress" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('user.withdrawal.withdrawalAddr')}}</span>
                    <van-icon name="cross" @click="showAddress = false" />
                </div>
                <div class="content">
                    <nodata v-if="!addressList || addressList.length == 0" />
                    <ul v-else>
                        <li v-for="(item,index) in addressList" :key="index" :class="{active:defaultAddress == index}" @click="defaultAddress = index"><span><img :src="vPic[0].icon" alt="">{{item.address}}</span></li>
                    </ul>
                </div>
                <div class="btnBox"><van-button size="large" @click="onChooseAddress" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup>  
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return {
                backUrl:{
                    url: '',
                    icon: 'iconrecording',
                    path: 'withdrawalHistory'
                },
                defaultCoin: this.$store.state.app.coinCode,
                cur: 0,
                defaultAddress:0,
                withdraw:{
                    showCoin: false,
                    showCode: false, 
                },
                sms:{
                    status: 0,
                    second: 60
                },
                email:{
                    status: 0,
                    second: 60
                },
                addressList:[],
                walletVO:{},
                firstCheck: false,
                btnStatus: false,
                showToast:false,
                showAddress: false,
                areaCode: localStorage.getItem('areaCode') || '86',
                formValidate:{
                    submiting: false,
                    data:{
                        withdrawAddr: {
                            value: '',
                            isDefault: true,
                            isError: false
                        },
                        withdrawNum: {
                            value: '',
                            isDefault: true,
                            isError: false
                        },
                        fundPsw:{
                            value: '',
                            isDefault: true,
                            isError: false
                        },
                        smsCode:{
                            value: '',
                            isDefault: true,
                            isError: false
                        },
                        emailCode:{
                            value: '',
                            isDefault: true,
                            isError: false
                        }
                    }
                },
                limitInfo:{},
                userInfo:{},
                timeout:null,
                kycStatus:'',
                submiting:false
            }
        },
        computed:{
            availalbe(){ // 实际到账
                let that = this;
                let number = that.formValidate.data.withdrawNum.value - that.fee;
                return number < 0 ? 0 : number.toFixed(4);
            },
            fee(){ // 计算手续费
                if(Object.keys(this.limitInfo).length > 0){
                    return this.limitInfo.feesFlat;
                }
            },
            scale(){ // 小数位数
                let that = this;
                let array = that.$store.state.app.coins.balance;
                let digit = 8;
                for (var i = array.length - 1; i >= 0; i--) {
                    let item = array[i];
                    if (item.coinCode == that.defaultCoin) {
                        digit = item.scale;
                    }
                }
                return digit;
            },
            smsBtn(){
                let that = this;
                switch(that.sms.status){
                    case 0:     //正常
                        return that.$t('button.public.sent');
                        break;
                    case 1:     //发送中
                        return that.$t('button.public.sending')+"("+that.sms.second+"s)";
                        break;
                    case 2:     //重新发送
                        return that.$t('button.public.resend');
                        break;
                }
            },
            emailBtn(){
                let that = this;
                switch(that.email.status){
                    case 0:     //正常
                        return  that.$t('button.public.sent');
                        break;
                    case 1:     //发送中
                        return that.$t('button.public.sending')+"("+that.email.second+"s)";
                        break;
                    case 2:     //重新发送
                        return that.$t('button.public.resend');
                        break;
                }
            },
            vPic(){
                return this.coins.filter((item) => {return item.coinCode == this.defaultCoin});
            },
            coins(){
                return this.$store.state.app.coins.balance.filter((item) => {return item.allowWithdraw == 1});
            }
        },
        components:{
            backbar
        },
        mounted(){
            let that = this;
            that.initPage();
        },
        watch:{
            "formValidate.data.withdrawAddr.value":function(){
                if(!this.formValidate.data.withdrawAddr.value){
                    this.$mts.toast(this.$t('message.withdrawal.withdrawalEmpty'));
                }
                this.formValidate.data.withdrawAddr.isDefault = false;
                this.formValidate.data.withdrawAddr.isError= !this.formValidate.data.withdrawAddr.value;
                this.checkAllForm();
            },
            "formValidate.data.withdrawNum.value":function(){
                if(!this.formValidate.data.withdrawNum.value){
                    this.$mts.toast(this.$t('message.withdrawal.withdrawalNumEmpty'));
                }
                this.formValidate.data.withdrawNum.isDefault = false;
                this.formValidate.data.withdrawNum.isError= !this.formValidate.data.withdrawNum.value;
                this.checkAllForm();
            },
            "formValidate.data.fundPsw.value":function(){
                if(!this.formValidate.data.fundPsw.value){
                    this.$mts.toast(this.$t('message.withdrawal.fundPswEmpty'));
                }
                this.formValidate.data.fundPsw.isDefault = false;
                this.formValidate.data.fundPsw.isError= !this.formValidate.data.fundPsw.value;
                this.checkAllForm();
            },
            "formValidate.data.smsCode.value":function(){
                if(!this.formValidate.data.smsCode.value){
                    this.$mts.toast(this.$t('message.safe.smsCodeEmpty'));
                }
                this.formValidate.data.smsCode.isDefault = false;
                this.formValidate.data.smsCode.isError= !this.formValidate.data.smsCode.value;
                this.checkAllForm();
            },
            "formValidate.data.emailCode.value":function(){
                if(!this.formValidate.data.emailCode.value){
                    this.$mts.toast(this.$t('message.safe.emailCodeEmpty'));
                }
                this.formValidate.data.emailCode.isDefault = false;
                this.formValidate.data.emailCode.isError= !this.formValidate.data.emailCode.value;
                this.checkAllForm();
            },
        },
        methods:{
            onInput(){
                let that = this;
                clearTimeout( that.timeout);
                that.timeout = setTimeout(()=>{
                    if (that.formValidate.data.withdrawNum.value) {
                        let val = Number(that.formValidate.data.withdrawNum.value);
                        let max = Number(that.limitInfo.withdrawOne);
                        let min = Number(that.limitInfo.minWithdrawNumber);
                        if (val > max) {
                            that.formValidate.data.withdrawNum.value = that.$mkt.fmtZero(max, that.scale);
                        } else if(val < min ){
                            that.formValidate.data.withdrawNum.value = that.$mkt.fmtZero(min, that.scale);
                        } else {
                            that.formValidate.data.withdrawNum.value = that.$mkt.fmtZero(val, that.scale);;
                        } 
                    }
                    clearTimeout( that.timeout);
                }, 1000);  
            },
            initPage(){
                let that = this;
                that.$mts.getCoins();
                that.getBasic();
                that.getUserInfo();
                that.$mts.getCoins();
                that.getKyc();
                that.getAddress();
            },
            getUserInfo(){
                let that = this;
                that.userInfo = JSON.parse(localStorage.getItem('user'));
            },
            getAddress(){
                let that = this;
                that.$mts.posts({
                    url:'api/me/withdrawAddress/get?coinCode='+that.defaultCoin,
                    data:{},
                    success(response){
                        // 发送成功
                        if (response.data.status == 200) {
                            that.addressList = response.data.data;
                        }
                    }
                });
            },
            onChooseAddress(){
                let that = this;
                that.formValidate.data.withdrawAddr.value = that.addressList[that.defaultAddress].address;
                that.showAddress = false;
            },
            checkAllForm(){
                let arr = [
                    this.formValidate.data.withdrawAddr.isDefault,
                    this.formValidate.data.withdrawAddr.isError,
                    this.formValidate.data.withdrawNum.isDefault,
                    this.formValidate.data.withdrawNum.isError,
                    this.formValidate.data.fundPsw.isDefault,
                    this.formValidate.data.fundPsw.isError,
                ];
                if(this.userInfo.telPhone){
                    arr.push(this.formValidate.data.smsCode.isDefault,this.formValidate.data.smsCode.isError);
                }else{
                    arr.push(this.formValidate.data.emailCode.isDefault,this.formValidate.data.emailCode.isError);
                }   
                let validate = true;
                for(let i in arr){
                    if(arr[i]){
                        validate = false;
                    }
                }
                this.btnStatus = validate;
            },
            onBlur(type){
                let that = this;
                if(type == 'number'){
                    if(that.formValidate.data.withdrawNum.value < that.limitInfo.minWithdrawNumber){
                        that.$mts.toast(that.$t('message.withdrawal.min'));
                    }else if(that.formValidate.data.withdrawNum.value > that.limitInfo.balanceAvailable){
                        that.$mts.toast(that.$t('message.withdrawal.max'));
                    }else{
                        return;
                    }
                }else if(type == 'address'){
                    if(that.formValidate.data.withdrawAddr.value){
                        that.$mts.posts({
                            url:'api/me/balanceWithdrawin/checkAddress?address='+that.formValidate.data.withdrawAddr.value+'&coinCode='+that.defaultCoin,
                            data:{},
                            success(response){
                                // 发送成功
                                if (response.data.data == true) {
                                    that.$mts.toast(that.$t('message.withdrawal.checkSuc'));
                                    that.firstCheck = true;
                                }else{
                                    that.$mts.toast(that.$t('message.withdrawal.checkError'));
                                }
                            }
                        });
                    }
                }
            },
            allExtract(){// 全部提取
                let that = this;
                if(Object.keys(that.limitInfo).length > 0){
                    that.formValidate.data.withdrawNum.value = that.limitInfo.balanceAvailable > that.limitInfo.withdrawOne ? that.limitInfo.withdrawOne : that.limitInfo.balanceAvailable;
                }
            },
            // onChooseCoin(item){
            //     let that = this;
            //     that.defaultCoin = that.coins[that.cur].coinCode;
            //     that.withdraw.showCoin = false;
            //     that.getBasic();
            //     that.getAddress();
            // },
            getBasic(){ // 获取提币基本信息
                let that = this;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url:'api/me/balanceWithdrawin/withdraw/info?coinCode='+ that.defaultCoin,
                        data:{},
                        success(response){
                            // 发送成功
                            if (response.data.status == 200) {
                                that.submiting = false;
                                that.limitInfo = response.data.data;
                            }
                        }
                    });
                }
            },
            onSelectAddr(item){
                this.formValidate.data.withdrawAddr.value = item.name;
                this.withdraw.showAddr = false;
            },
            sendSms(type){
                let that = this;
                // 需要验证交易密码格式是否正确
                if(type == 'mobile'){
                    if(that.sms.status!=1){
                        that.sms.second = 60;
                        that.sms.status = 1;
                        //点击发送验证码按钮后，按钮禁用。60秒后才能调用
                        var countdown = setInterval(()=>{
                            that.sms.second --;
                            if(that.sms.second <= 0){
                                that.sms.status = 2;
                                clearInterval(countdown);
                            }
                        },1000);
                        that.$mts.posts({
                            url:'api/me/sms/captcha?areaCode='+that.areaCode+'&phoneNumber='+that.userInfo.telPhone+'&modules=withdraw',
                            data:{},
                            success(response){
                                // 发送成功
                                if (response.data.status == 200) {
                                    that.$mts.toast(that.$t('message.public.smsSuc'));
                                }
                            }
                        });
                    }
                }else{
                    if(that.email.status!=1){
                        that.email.second = 60;
                        that.email.status = 1;
                        //点击发送验证码按钮后，按钮禁用。60秒后才能调用
                        var countdown = setInterval(()=>{
                            that.email.second --;
                            if(that.email.second <= 0){
                                that.email.status = 2;
                                clearInterval(countdown);
                            }
                        },1000);
                        that.$mts.posts({
                            url:'api/me/mail/captcha?email='+that.userInfo.email+'&modules=withdraw',
                            data:{},
                            success(response){
                                // 发送成功
                                if (response.data.code==200) {
                                    that.$mts.toast(that.$t('message.public.smsSuc'));
                                }
                            }
                        });
                    }
                }
            },
            onFirst(){
                let that = this;
                if(that.formValidate.data.withdrawAddr.value != '' && that.formValidate.data.withdrawNum.value != '' && that.firstCheck){
                    if(that.kycStatus != 'LV1_PASS' && that.kycStatus != 'LV2_PASS'){
                        that.showToast = true;
                    }else {
                        that.withdraw.showCode = true;
                    }
                }else{
                    that.$mts.toast(that.$t('message.withdrawal.t1'));
                }
            },
            getKyc(){
                let that = this;
                that.$mts.posts({
                    url: 'api/me/security/kycStatus',
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.kycStatus = response.data.data.status;
                        }
                    },
                })
            },
            onSubmit(){
                let that = this;
                if(that.btnStatus){
                    that.$mts.posts({
                        url:'api/me/balanceWithdrawin/withdraw',
                        data:{
                            areaCode: that.areaCode,
                            coinCode: that.defaultCoin,
                            address: that.formValidate.data.withdrawAddr.value,
                            number: that.formValidate.data.withdrawNum.value,
                            captcha: that.userInfo.telPhone ? that.formValidate.data.smsCode.value : that.formValidate.data.emailCode.value,
                            transactionPin: that.formValidate.data.fundPsw.value,
                        },success(response){
                            if (response.data.status == 200) {
                                that.$toast(that.$t('message.public.submitSuc'));
                                that.$router.push({name:'withdrawalHistory'});
                            }else if(response.data.status == 601){
                                that.$toast(that.$t('endNotice.withdraw.noFundPsw'));
                            }else if(response.data.status == 602){
                                that.$toast(that.$t('endNotice.withdraw.noKyc'));
                            }else if(response.data.status == 701){
                                that.$toast(that.$t('endNotice.withdraw.codeError'));
                            }else if(response.data.status == 800){
                                that.$toast(that.$t('endNotice.withdraw.noMoney'));
                            }else if(response.data.status == 902){
                                that.$toast(that.$t('endNotice.withdraw.coinLimit'));
                            }else if(response.data.status == 1000){
                                that.$toast(response.data.message);
                            }else if(response.data.status == 40002){
                                that.$toast(that.$t('endNotice.withdraw.fundPswError'));
                            }else if(response.data.status == 40003){
                                that.$toast(that.$t('endNotice.withdraw.userLimit'));
                            }
                        }
                    });
                }else{
                    that.$mts.toast(that.$t('message.public.notEmpty'));
                }
            }
        }
    }
</script>  

<style lang="scss">
    .withdrawal {
        .van-field__body {
            padding: 0 2.6667vw;
        }
        .btn2 {
            background-color: #337EFD;
        }
    }
</style> 