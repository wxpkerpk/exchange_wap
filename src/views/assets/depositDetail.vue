<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead flexLevel">
                        <h3>{{$t('user.deposit.depositRecord')}}</h3>
                    </div>
                    <div class="withdrawDetail">
                        <div class="top">
                            <p class="amount">100 USDT</p>
                            <p class="status">{{$t('user.public.nowStatus')}}<span :class="detail.status == 'Completed' ? 'green' : 'blue'">{{detail.status == 'Completed' ? $t('user.public.success') : $t('user.public.pending')}}</span></p>
                        </div>
                        <dl>
                            <dt>{{$t('user.deposit.depositAddr')}}</dt>
                            <dd>{{detail.address}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('user.public.orderId')}}</dt>
                            <dd>{{detail.orderId}}</dd>
                        </dl>
                        <dl>
                            <dt>Txid</dt>
                            <dd>{{detail.txId}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('table.time')}}</dt>
                            <dd>{{$mkt.dateFormat('yyyy/mm/dd HH:MM:SS',detail.time)}}</dd>
                        </dl>
                        <div class="btnBox flexLevel" v-if="detail.status == 'Completed'">
                            <a class="copy" @click="copy">{{$t('button.user.copyTxid')}}</a>
                            <a class="confirm" href="">{{$t('button.user.confirmTxid')}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return {
                backUrl:{
                    url: '',
                    icon: ''
                },
                detail:{
                    
                }
            }
        },
        computed:{

        },
        components:{
            backbar
        },
        mounted(){
            this.getDetail();
        },
        watch:{

        },
        methods:{
            copy(){
                this.$mts.copy()
            },
            getDetail(){
                let that = this;
                that.$mts.posts({
                    url:'api/me/balanceWithdrawin/detail?orderId='+that.$route.params.id,
                    data:{},
                    success(response){
                        // 发送成功
                        if (response.data.status == 200) {
                            that.detail = response.data.data;
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="scss">

</style>