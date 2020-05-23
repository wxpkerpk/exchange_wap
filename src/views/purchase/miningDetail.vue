<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent">
            <div class="miningWrapper">
                <div class="miningTitle">
                    <h3>{{$t('purchase.superMining')}}</h3>
                </div>
                <div class="miningTop">
                    <dl>
                        <dt>{{$t('purchase.power')+'(Du/h)'}}</dt>
                        <dd>10.002053</dd>
                    </dl>
                    <dl>
                        <dt>{{$t('purchase.nowPower')+'(Du/h)'}}</dt>
                        <dd class="orange">0.00000</dd>
                    </dl>
                    <dl>
                        <dt>{{$t('purchase.output')+'(Du)'}}</dt>
                        <dd>2346753.0000</dd>
                    </dl>
                    <dl>
                        <dt>{{$t('purchase.income')+'(Du)'}}</dt>
                        <dd>0.00000</dd>
                    </dl>
                </div>
                <div class="countdownBox flexLevel">
                    <p><span>{{$t('purchase.countdown')}}</span><span class="ml2">24:00:00</span></p>
                    <span class="blue" @click="showActive = true">{{$t('purchase.active')}}</span>
                </div>
                <p class="line"></p>
                <div class="miningDetail">
                    <div class="block">
                        <div class="title">{{$t('purchase.developer')}}</div>
                        <div class="content">{{$t('purchase.t1')}}</div>
                    </div>
                    <div class="block">
                        <div class="title">{{$t('purchase.buyPower')}}</div>
                        <div class="content">{{$t('purchase.t2')}}</div>
                    </div>
                    <p><span>{{$t('purchase.calc')}}</span><b>{{$t('purchase.buyPrice')+"(BCB)*"+$t('purchase.powerPrice')+"/(100*24)"}}</b></p>
                    <p><span>{{$t('purchase.powerPrice')}}</span><b>1 Du/h = 0.1 BCB</b></p>
                    <p><span>{{$t('purchase.exchange')}}</span><b>0.000 Du/h</b></p>
                </div>
                <div class="miningBtn">
                    <span>{{$t('button.purchase.buy')}}</span>
                </div>
                <p class="line"></p>
                <div class="inviteBox">
                    <div class="invite">
                        <div class="title">{{$t('purchase.invite')}}</div>
                        <div class="content">{{$t('purchase.t3')}}</div>
                        <p><span>{{$t('purchase.powerAdd')}}</span><b>0.0000 Du/h</b></p>
                        <div class="inviteBtn flexLevel">
                            <span @click="$router.push({name:'miningTeam'})">{{$t('button.purchase.miningTeam')}}</span>
                            <span>{{$t('button.purchase.invite')}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 立即激活 -->
        <van-popup v-model="showActive" position="center">
            <div class="modal">
                <div class="head flexLevel">
                    <span></span>
                    <van-icon name="cross" @click="showActive = false" />
                </div>
                <div class="content">
                    <div class="toast">当前BCB余额不足<br/>无法激活</div>
                </div>
                <div class="btnBox noMt"><van-button size="large" @click="showActive = false" class="active">{{$t('button.public.know')}}</van-button></div>
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
                showActive: false,
            }
        },
        computed:{

        },
        components:{
            backbar
        },
        watch:{

        },
        methods:{

        }
    }
</script>  

<style lang="scss">

</style>