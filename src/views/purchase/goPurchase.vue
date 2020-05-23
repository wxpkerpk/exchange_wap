<template>  
    <div class="flexPage go-purchase">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent fbg">
            <div class="purChaseOrder">
                <div class="orderHead flexLevel" v-for="(item,index) in list" :key="index">
                    <dl class="lt">
                        <dt v-if="!theme"><img :src="nowCoin[0].icon" alt=""></dt>
                        <dt v-if="theme"><img :src="item.coinCodeIcon" alt=""></dt>
                        <dd>{{item.title}}</dd>
                    </dl>
                    <dl class="rt">
                        <dt>{{$mkt.fmtZero(item.price,item.scale)+' '+item.symbol}}</dt>
                        <dd>x 1</dd>
                    </dl>
                </div>
                <div class="orderCenter">
                    <div class="title">{{$t('purchase.purchaseNum')}}</div>
                    <div class="calcBox">
                        <span @click="reduce"><i class="iconfont iconjianhao"/></span>
                        <div class="inputBox">
                            <input :placeholder="$t('validate.purchase.t1')" type="number" v-model="form.number" @input="onInput">
                        </div>
                        <span @click="add"><i class="iconfont iconaddto" /></span>
                    </div>
                    <!-- <div class="switch flexLevel">
                        <div class="prizeSale" v-for="(item,index) in coinList" :key="index">{{$t('purchase.prizeAccount',{total: ' '+vPrize+' '+item.coinCode})}}<span>{{' '+useable+' '+item.coinCode}}</span></div>
                        <van-switch v-model="checked" size="16px" inactive-color="#666" active-color="#FFAD00" v-if="theme" />
                        <van-switch v-model="checked" size="16px" inactive-color="#fff" active-color="#FFAD00" v-if="!theme" />
                    </div> -->
                </div>
                <div class="orderBottom">
                    <p><span>{{$t('purchase.purchaseTotal')}}</span><b>{{$mkt.fmtZero(vTotal) +' '+ list[0].symbol}}</b></p>
                    <!-- <p><span>{{$t('purchase.deduction')}}</span><b>{{vDe}}</b></p> -->
                </div>
                <div class="account flexLevel" @click="$router.push({name:'deposit'})">
                    <dl v-for="(item,index) in coinList" :key="index">
                        <dt><img :src="item.icon" alt=""></dt>
                        <dd>
                            <b>{{item.coinCode}}</b>
                            <span>{{$t('user.index.available')}}<span>{{' '+vBalance+' '+coinList[0].coinCode}}</span></span>
                        </dd>
                    </dl>
                    <div class="rt">
                        <span v-if="available == 0">{{$t('activity.noMoney')}}</span>
                        <i class="iconfont icondibudaohanglan-" />
                    </div> 
                </div>
                <div class="bottom flexLevel">
                    <div class="total">{{vSale}}<span>USDT</span></div>
                    <van-button @click="goOrder">{{$t('button.purchase.makeOrder')}}</van-button>
                </div> 
            </div>
        </div>
        <!-- 提示去设置PIN -->
        <van-popup v-model="showToast" class="showMore">
            <div class="goModal dark">
                <h3>{{$t('message.public.systemTitle')}}</h3>
                <p>{{$t('message.safe.noFund')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showToast = false">{{$t('button.public.know')}}</span>
                    <span class="btn2" @click="$router.push({name: 'changeFundPsw'})">{{$t('button.user.setting')}}</span>
                </div>
            </div>
        </van-popup>

        <!-- 订单 -->
        <van-popup v-model="showOrder" position="bottom">
            <div class="purchaseModal">
                <div class="title flexLevel">
                    <b>{{$t('nav.n4')}}</b>
                    <i class="iconfont iconbaseline-close-px" @click="showOrder = false"></i>
                </div>
                <div class="detail" v-for="(item,index) in list" :key="index">
                    <dl><dt>{{$t('purchase.purchaseCoin')}}</dt><dd>{{item.coinCode}}</dd></dl>
                    <dl><dt>{{$t('purchase.purchasePrice')}}</dt><dd>{{item.price}} {{coinList[0].coinCode}}</dd></dl>
                    <dl><dt>{{$t('purchase.purchaseNum')}}</dt><dd>{{form.number}}<span v-if="item.type !== 'point'">{{item.coinCode}}</span><span v-else> TSOL矿机</span></dd></dl>
                    <dl><dt>{{$t('purchase.purchaseAmount')}}</dt><dd>{{vTotal}} {{coinList[0].coinCode}}</dd></dl>
                    <!-- <dl><dt>{{$t('purchase.deduction')}}</dt><dd class="sale">{{vDe}} {{coinList[0].coinCode}}</dd></dl> -->
                    <dl><dt>{{$t('activity.fundPsw')}}</dt><dd>
                    <van-field type="password" v-model="form.fundPsw" :placeholder="$t('validate.withdrawal.t3')" maxlength="6" clearable /></dd></dl>
                </div>
                <div class="btn">
                    <span @click="onConfirm">{{$t('button.purchase.now')}}</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>  

<script>  
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return{
                backUrl:{
                    url: ''
                },
                status: 'pending',
                list:[{price:''}],
                showOrder: false,
                showToast: false,
                checked: false,
                form:{
                    number:'',
                    sale:'',
                    fundPsw:''
                },
                coinList:[{coinCode: 'USDT'}],
                available: 0,
                timeout:null,
                nowCoin:[{icon:''}]
            }
        },
        computed:{
            useable(){ // 最大可抵扣金额
                let that = this;
                if((that.coinList && that.coinList.length > 0) && (that.list && that.list.length > 0)){
                    let buySale = that.$mkt.fmtZero(that.list[0].price * that.form.number * that.list[0].maxDudect,that.list[0].scale);
                    if(Number(that.vPrize) >= Number(buySale)){
                        return buySale;
                    }else{
                        return that.vPrize;
                    }
                }
            },
            vPrize(){ // 冻结奖励金
                let that = this;
                if(that.coinList && that.coinList.length > 0){
                    return that.$mkt.fmtZero(that.coinList[0].prizeFrozen * that.coinList[0].price,that.coinList[0].scale)
                }
            },
            vTotal(){ // 认购总额
                let that = this;
                if(that.list && that.list.length > 0){
                    return that.$mkt.fmtZero(that.form.number * that.list[0].price,that.list[0].scale);
                }
            },
            vBalance(){ // 币币usdt账户余额
                let that = this;
                if(that.coinList && that.coinList.length > 0){
                    return that.$mkt.fmtZero(that.coinList[0].available * that.coinList[0].price,that.coinList[0].scale);
                }
            },
            vDe(){ // 抵扣奖励金
                return this.checked ? this.useable : 0;
            },
            vSale(){ // 折后价
                if(this.list && this.list.length > 0){
                    return this.$mkt.fmtZero(this.vTotal - this.vDe,this.list[0].scale);
                }
            },
            vDudect(){ // 抵扣数量
                let that = this;
                if((that.coinList && that.coinList.length > 0) && (that.list && that.list.length > 0)){
                    let buySale = that.$mkt.fmtZero(that.list[0].price * that.form.number * that.list[0].maxDudect,that.list[0].scale);
                    if(Number(that.vPrize) >= Number(buySale)){
                        return this.checked ? this.$mkt.fmtZero(this.form.number * this.list[0].maxDudect,this.list[0].scale) : 0;
                    }else{
                        return this.checked ? this.$mkt.fmtZero(that.vDe / this.list[0].price,this.list[0].scale) : 0;
                    }
                }
            },
            scale(){
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
            theme(){
                return JSON.parse(localStorage.getItem('theme'));
            }
        },
        components:{
            backbar
        },
        mounted(){
            let that = this;
            that.$mts.checkExpire('clear',true,()=>{
                if (that.$store.state.isLogin) {
                    this.ininPage();
                }
            });
        },
        watch:{
            // 'form.number': function(newVal,oldVal){
            //     const regex = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/
            //     if(newVal && !regex.test(newVal)) {//如果小于等于零
            //         // this.form.number = oldVal //恢复原值
            //     }
            // }
        },
        methods:{
            ininPage(){
                let that = this;
                that.$mts.checkExpire('clear', true,()=>{
                    if (that.$store.state.isLogin) {
                        that.$mts.getCoins();
                        that.getCoins();
                        that.getChase();
                    }
                });
            },
            getChase(){
                let that = this;
                that.$mts.posts({
                    url:'api/activity/labsApply/labsApply?status='+that.status,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.list = response.data.data.filter((item) => {return item.id == that.$route.query.id});
                            // console.log(that.list);
                            that.form.number = that.list[0].buyMinAmount; 
                        }
                    }
                })
            },
            getCoins(){ // 获取币种列表
                let that = this;
                that.$mts.posts({
                    url: 'api/me/balance/info',
                    data:{},
                    success(response){
                        if(response.status == 200){
                            that.coinList = response.data.data.balance.filter((item => {return item.coinCode == 'USDT'}));      
                            that.nowCoin = response.data.data.balance.filter((item => {return item.coinCode == 'USDT'}));      
                            that.available = that.$mkt.fmtZero(that.coinList[0].available * that.coinList[0].price,that.coinList[0].scale);
                            console.log(that.coinList, that.nowCoin, that.available)
                        }else{
                            that.$mts.toast(that.$t('message.public.dataError'));
                        }
                    }
                });
            },
            reduce(){
                let that = this;
                let min = that.list[0].buyMinAmount;
                that.form.number = that.form.number - min
                if(that.form.number < min){
                    that.form.number = min;
                    that.$mts.toast('单次购买数量最少为1台');
                }
            },
            add(){
                let that = this;
                let max = that.list[0].buyMaxAmount;
                let min = that.list[0].buyMinAmount;
                that.form.number = that.form.number + min
                if(that.form.number > max){
                    that.form.number = max;
                    that.$mts.toast('每人限购2台');
                }
            },
            onInput(){
                let that = this;
                let val = '';
                clearTimeout( that.timeout);
                that.timeout = setTimeout(()=>{
                    if(that.form.number >= that.list[0].buyMaxAmount){
                        val = Number(that.list[0].buyMaxAmount);
                    }else if(that.form.number < that.list[0].buyMinAmount){
                        val = Number(that.list[0].buyMinAmount);
                    } else if(that.form.number.split('.').length){
                        val = Number(that.list[0].buyMinAmount);
                    } else {
                        val = Number(that.form.number);
                    }
                    that.form.number = that.$mkt.fmtZero(val, that.scale);
                    clearTimeout( that.timeout);
                }, 800)
            },
            goOrder(){
                let that = this;
                let available = Number(that.vBalance);
                let total = Number(that.vTotal);
                if (total > available) {
                    that.$mts.toast(that.$t('endNotice.purchase.noMoney'));
                } else {
                    let flag = JSON.parse(localStorage.getItem('setFundPsw'));
                    if(flag){
                        that.showOrder = true
                    } else {
                        that.showToast = true;
                    }
                }
            },
            onConfirm(){
                let that = this;
                if(that.form.fundPsw == ''){
                    that.$mts.toast(that.$t('message.withdrawal.fundPswEmpty'));
                    return;
                }else{
                    let flag = JSON.parse(localStorage.getItem('setFundPsw'));
                    if(flag){ // 已设置资金密码
                        that.$mts.posts({
                            url:'api/activity/labsApply/apply',
                            data:{
                                number: that.form.number,
                                dudect: that.vDudect,
                                pin: that.form.fundPsw,
                                labsProjectId: that.list[0].id
                            },
                            success(response){
                                if(response.data.status == 200){
                                    that.showOrder = false;
                                    that.$mts.toast(that.$t('message.purchase.purchaseSuc'));
                                    that.$router.push('/purchase');
                                }else if(response.data.status == 700){
                                    that.$mts.toast('超过最大购买数量');
                                }else if(response.data.status == 800){
                                    that.$mts.toast(that.$t('endNotice.purchase.noMoney'));
                                }else if(response.data.status == 990){
                                    that.$mts.toast(that.$t('endNotice.purchase.timeExpired'));
                                }else if(response.data.status == 604){
                                    that.$mts.toast(that.$t('endNotice.purchase.noNumber'));
                                }else if(response.data.status == 40002){
                                    that.$mts.toast(that.$t('endNotice.purchase.fundPswError'));
                                }else if(response.data.status == 601){
                                    that.$mts.toast(that.$t('endNotice.purchase.noRemind'));
                                }
                            }
                        });
                    }else{
                        that.$mts.toast(that.$t('message.safe.noFund'));
                        that.$router.push({path:'/changeFundPsw',query:{path: '/goPurchase?id='+that.$route.query.id}});
                    }
                }
            }
        }
    }
</script>  

<style lang="scss">
    .go-purchase {
        .back {
            background-color: #fff;
        }
    }
</style>