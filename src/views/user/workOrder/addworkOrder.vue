<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg add-work-order">   
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead">
                        <h3>{{$t('user.workOrder.submit')}}</h3>
                    </div>
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('user.workOrder.theme')}}</div>
						<van-field v-model="form.data.theme.value" :placeholder="$t('validate.workOrder.t1')"></van-field>
                    </div>
                    <div class="cellGroup">
                        <div class="title">{{$t('trade.tradeType')}}</div>
						<van-field v-model="form.data.type.value">
                            <i slot="right-icon" class="iconfont iconDrop-downmenu"  @click="showType = true" />
                        </van-field>
                    </div>
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('table.coin')}}</div>
						<van-field v-model="form.data.coin.value" :placeholder="$t('validate.workOrder.t2')">
                            <i slot="right-icon" class="iconfont iconDrop-downmenu"  @click="showCoin = true" />
                        </van-field>
                    </div>
                    <!-- <div class="cellGroup mt4">
                        <div class="title">{{$t('user.workOrder.hash')}}</div>
						<van-field v-model="form.data.hash.value" :placeholder="$t('validate.workOrder.t3')"></van-field>
                    </div> -->
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('user.workOrder.introduction')}}</div>
						<van-field v-model="form.data.introduction.value" :placeholder="$t('validate.workOrder.t4')"></van-field>
                    </div>
                    <div class="cellGroup mt4">
                        <div class="title">{{$t('user.workOrder.img')}}</div>
						<div class="mt2">
                            <van-uploader
                                v-model="fileList"
                                multiple
                                :max-count="3"
                                :max-size="8388608"
                                @oversize="oversize()" 
                                :after-read="onRead"
                                @delete="onDelete"
                            />
                        </div>
                    </div>
                    <div class="assetsBtn fixed">
                        <van-button size="large" class="active" @click="onSave">{{$t('user.workOrder.submit')}}</van-button>
                    </div>
                </div>
            </div>
        </div> 

        <!-- 选择交易类型 -->
        <van-popup v-model="showType" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('form.workOrder.type')}}</span>
                    <van-icon name="cross" @click="showType = false" />
                </div>
                <div class="content">
                    <ul>
                        <li v-for="(item,index) in types" :key="index" :class="{active:cur == index}" @click="cur = index"><span>{{item}}</span></li>
                    </ul>
                </div>
                <div class="btnBox"><van-button size="large" @click="onChooseType" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup>   

        <!-- 选择币种 -->
        <van-popup v-model="showCoin" position="bottom">
            <div class="modal">
                <div class="head flexLevel">
                    <span>{{$t('user.public.chooseCoin')}}</span>
                    <van-icon name="cross" @click="showCoin = false" />
                </div>
                <div class="content">
                    <ul>
                        <li v-for="(item,index) in coinList.balance" :key="index" :class="{active:defaultCoin == index}" @click="defaultCoin = index"><span><img :src="item.icon" alt="">{{item.coinCode}}</span></li>
                    </ul>
                </div>
                <div class="btnBox"><van-button size="large" @click="onChooseCoin" class="active">{{$t('button.public.submit')}}</van-button></div>
            </div>
        </van-popup>   
	</div>
</template>
<script>
import backbar from "@/views/modules/back.vue"
export default {
	data(){
        return {
            backUrl:{
                url: '',
            },
            cur: 0,
            defaultCoin: 0,
            showType: false,
            showCoin: false,
            form:{
                btnStatus: false,
                validateAll: false,
                data:{
                    theme:{
                        value: '',
                        isDefault: true,
                        isError: false
                    },
                    type:{
                        value: this.$t('user.index.deposit'),
                        isDefault: true,
                        isError: false
                    },
                    coin:{
                        value: 'USDT',
                        isDefault: false,
                        isError: false
                    },
                    hash:{
                        value: '',
                        isDefault: true,
                        isError: false
                    },
                    introduction:{
                        value: '',
                        isDefault: true,
                        isError: false
                    }
                }
            },
            fileList:[],
            imageList: [],
            types:[this.$t('user.index.deposit'),this.$t('user.index.withdrawal'),this.$t('user.index.other')]
        }
    },
    components:{backbar},
    computed:{
        coinList(){
            return this.$store.state.app.coins;
        }
    },
	mounted(){
        this.$mts.getCoins();
    },
    beforeDestroy(){
        
    },
    watch:{
        "form.data.theme.value":function(){
            if(!this.form.data.theme.value){
                this.$mts.toast(this.$t('message.workOrder.themeEmpty'));
            }
            this.form.data.theme.isDefault = false;
            this.form.data.theme.isError = !this.form.data.theme.value;
            this.checkAllForm();
        },
        "form.data.coin.value":function(){
            if(!this.form.data.coin.value){
                this.$mts.toast(this.$t('message.workOrder.coinEmpty'));
            }
            this.form.data.coin.isDefault = false;
            this.form.data.coin.isError = !this.form.data.coin.value;
            this.checkAllForm();
        },
        "form.data.introduction.value":function(){
            if(!this.form.data.introduction.value){
                this.$mts.toast(this.$t('message.workOrder.introductionEmpty'));
            }
            this.form.data.introduction.isDefault = false;
            this.form.data.introduction.isError = !this.form.data.introduction.value;
            this.checkAllForm();
        },
    },
	methods:{
        checkAllForm(){
            let arr = [
                this.form.data.theme.isDefault,
                this.form.data.theme.isError,
                this.form.data.coin.isDefault,
                this.form.data.coin.isError,
                this.form.data.introduction.isDefault,
                this.form.data.introduction.isError,
            ];
            let validate = true;
            for(let i in arr){
                if(arr[i]){
                    validate = false;
                }
            }
            this.validateAll = validate;
        },
        onChooseType(){
            switch(this.cur){
                case 0:
                    this.form.data.type.value = this.$t('user.index.deposit');
                    break;
                case 1:
                    this.form.data.type.value = this.$t('user.index.withdrawal');
                    break;
                case 2:
                    this.form.data.type.value = this.$t('user.index.other');
                    break;
                default:
                    this.form.data.type.value = this.$t('user.index.deposit');
                    break;
            }
            this.showType = false
        },
        onChooseCoin(){
            this.form.data.coin.value = this.coinList.balance[this.defaultCoin].coinCode;
            this.showCoin = false;
        },
        oversize(){
            this.$mts.toast(that.$t('message.kyc.oversize'));
        },
        onRead(file,detail){
            let that = this;
            let data = new FormData();
            data.append('file', file.file);
            data.append('type', 'prove');
            data.append('name',detail.name);
            that.$mts.upload({
                url:'api/push/image/upload',
                data:data,
                success(response){
                    if (response.status == 200) {
                        that.imageList.push(response.data.data);
                    }
                }
            });
        },
        onDelete(file,detail){
            let that = this;
            let number = detail.index;
            that.imageList = that.imageList.filter((item,index) => {return number !== index;});
        },
        onSave(){
            let that = this;
            if(that.validateAll){
                if(that.fileList.length != 0){
                    that.$mts.posts({
                        url: "api/me/workOrder/create",
                        data:{
                            title:that.form.data.theme.value,
                            content:that.form.data.introduction.value,
                            coinCode:that.form.data.coin.value,
                            type:that.form.data.type.value,
                            imageList: that.imageList  
                        },
                        success(response){
                            if(response.data.status == 200){
                                that.$mts.toast(that.$t('message.workOrder.suc'));
                                that.$router.push('/workorder');
                            }
                        }
                    });
                }else{
                    that.$mts.toast(that.$t('message.workOrder.imgError'));
                }
            }else{
                that.$mts.toast(that.$t('message.public.notEmpty'));
            }
        },
	}
}
</script>

<style lang="scss">
    .add-work-order {
        .van-cell {
            background-color: #E4EEEF;
        }
    }
</style>
