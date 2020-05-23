<template>
    <div class="flexPage darkPage">
        <div class="currencyHead fixed themeHead">
            <navbar :params="pageInfo" />
        </div>
        <div class="flexContent">
            <div class="zcInfoWrapper">
                <div class="zcInfo adver">
                    <div class="form">
                        <div class="cellGroup">
                            <div class="tbTitle">{{$t('otc.order.orderNum')}}</div>
                            <van-field v-model="form.orderNumber" :placeholder="$t('form.otc.state.i1')" />
                        </div>
                        <div class="cellGroup">
                            <div class="tbTitle">{{$t('form.otc.state.stateType')}}</div>
                            <van-cell :title="Reason.name" :value="$t('form.otc.initiateAd.goChoose')" @click="chooseReason.show=true" is-link />
                        </div>
                        <div class="textArea">
                            <p>{{$t('form.otc.state.stateReason')}}</p>
                            <textarea v-model="form.reason" :placeholder="$t('form.otc.state.i2')"></textarea>
                        </div>
                        <div class="photoBox">
                            <p>{{$t('form.otc.state.evidence')}}</p>
                            <div class="photoUpdate">
                                <van-uploader v-model="form.materials" class="miniLoader" :after-read="onRead"  multiple>
                                    <van-icon name="photograph" />
                                </van-uploader>
                            </div>
                        </div>
                        <div class="mt5">
                            <van-button 
                                :loading="formValidate.submiting" 
                                @click="submit()" 
                                :loading-text="$t('button.otc.sure')" size="large">{{$t('button.otc.sure')}}
                            </van-button>
                        </div>
                    </div>
                </div>
            </div>
            <!--选择申述原因-->
            <van-popup v-model="chooseReason.show"  :default-index="1" position="bottom" :overlay="true">
                <van-picker :columns="chooseReason.data" show-toolbar  @cancel="chooseReason.show=false" @confirm="onReasonConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
            </van-popup>
        </div>
    </div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
    data(){
        return {
            pageInfo: {title: 'OTC' + this.$t('otc.order.state'),navbarStyle: 'blue'},
            orderNumber: '',
            Reason: {
                name: '卖家长时间未释放'
            },
            chooseReason:{
                show: false,
                name: this.$t('otc.order.stateReason'),
                data: ['卖家长时间未释放','订单金额不对','系统异常','其他']
            },
            form:{
                orderNumber: "",
                reason:"",
                materials:[],
            },
            formValidate:{
                submiting:false,
                validateAll:false,
                validateTwice:false,
                data:{
                    orderNumber:{
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
            },
            material:[],
        }
    },
    components:{navbar},
    watch:{},
    mounted(){},
    methods:{
        onClickRight(){

        },
        onReasonConfirm(tag,index){
			this.Reason.name = tag;
			this.chooseReason.show = false;
        },
        onRead(file, detail){
            // 开始上传图片
            let that = this;
            let data = new FormData();
            data.append('img', file.file);
            data.append('name', detail.name);
            that.$mts.upload({
                url:'otc/order/material',
                data,
                success(response){
                    if (response.data.code == 200) {
                        that.form.materials.push(response.data.data);
                        that.material.push(response.data.data)
                    }
                }
            });
        },
        submit(){
            let that = this;
            if(this.submiting)return;
            this.submiting = true;
            this.$mts.post({
                url:'otc/order/representation',
                data:{
                    orderNumber:that.form.orderNumber,
                    type:that.Reason.name,
                    reason:that.form.reason,
                    material:that.material.join(","),
                },success(response){
                    if(response.data.code == 200){
                        that.submiting = false;
                        that.$toast(that.$t('form.otc.state.stateSuc'));
                        that.$router.push({name:"otcDetail",params:{id:response.data.data}});
                    }
                }, error( error){
                    that.$toast(that.$t('form.otc.state.stateFailed'));
                }
            }); 
        },
    }
}
</script>
<style lang="stylus"></style>