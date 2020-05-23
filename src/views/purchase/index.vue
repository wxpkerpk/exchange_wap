<template>  
    <div class="flexPage">
        <div class="flexHead">
            <div class="purchaseHead flexLevel">
                <span>{{$t('purchase.title')}}</span>
                <van-icon name="balance-list-o" @click="$router.push({name:'mypurchase'})" />
            </div>
        </div>
        <div class="flexContent whiteBg">
            <div class="purchaseWrapper">
                <!-- <p class="title" v-if="pending.length > 0">{{$t('user.public.pending')}}</p> -->
                <div class="purchase">
                    <!-- <loading v-if="submiting" /> -->
                    <nodata v-if="unStart.length || pending.length == 0" />
                    <div class="block" v-else>
                        <ul v-if="pending.length > 0">
                            <li v-for="(item,index) in pending" :key="index" @click="$router.push({name: 'purchasedetail',params:{id:item.id}})">
                                <div class="content">
                                    <div :class="['cTop','pending',vColor(item.coinCode)]">
                                        <div class="topOne">
                                            <h3>{{$mkt.vCnField(item,'title')}}</h3>
                                            <div class="toast">{{vIntroduction($mkt.vCnField(item,'introduction'))}}</div>
                                            <div class="detail">
                                                <dl>
                                                    <dt v-if="item.type !== 'point'">{{$t('purchase.totalRounds')+'('+item.coinCode+')'}}</dt>
                                                    <dt v-else>认购重量</dt>
                                                    <dd>{{$mkt.fmtZero(item.totalNumber,item.scale)}}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>{{$t('purchase.purchasePrice')+'('+item.symbol+')'}}</dt>
                                                    <dd>{{$mkt.fmtZero(item.price,item.scale)}}</dd>
                                                </dl>
                                            </div>
                                            <!-- <span class="mark">{{$t('purchase.limitTime')}}</span> -->
                                            <span><img :src="item.coinCodeIcon" alt=""></span>
                                        </div>
                                    </div>
                                    <div class="cBot">
                                        <div class="progress">
                                            <van-progress :percentage="Number($mkt.fmtZero((item.totalNumber - item.remindNumber) / item.totalNumber,item.scale) * 100)" stroke-width="10" color="#FFA524" track-color="#FFF4E4" :show-pivot="false" /> 
                                            <div class="countdown">
                                                <van-count-down :time="vTime(item.endTime)" />
                                                <span>{{$t('activity.toEnd')}}</span>
                                            </div>
                                        </div>  
                                        <div class="buy flexLevel">
                                            <div class="limit">{{$t('purchase.last',{number:$mkt.fmtZero(item.remindNumber,item.scale)+ ' ' + item.coinCode})}}</div>
                                            <van-button class="pending">{{$t('button.purchase.now')}}</van-button>
                                        </div>   
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <!-- <p class="title" v-if="unStart.length > 0">{{$t('purchase.start')}}</p> -->
                        <ul v-if="unStart.length > 0">
                            <li v-for="(item,index) in unStart" :key="index" @click="$router.push({name: 'purchasedetail',params:{id:item.id}})">
                                <div class="content">
                                    <div :class="['cTop','finish',vColor(item.coinCode)]">
                                        <div class="topOne">
                                            <h3>{{$mkt.vCnField(item,'title')}}</h3>
                                            <div class="toast">{{vIntroduction($mkt.vCnField(item,'introduction'))}}</div>
                                            <div class="detail">
                                                <dl>
                                                    <dt>{{$t('purchase.totalRounds')+'('+item.coinCode+')'}}</dt>
                                                    <dd>{{$mkt.fmtZero(item.totalNumber,item.scale)}}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>{{$t('purchase.purchasePrice')+'('+item.symbol+')'}}</dt>
                                                    <dd>{{$mkt.fmtZero(item.price,item.scale)}}</dd>
                                                </dl>
                                            </div>
                                            <span><img :src="item.coinCodeIcon" alt=""></span>
                                        </div>
                                    </div>
                                    <div class="cBot"> 
                                        <div class="buy flexLevel">
                                            <span class="start">
                                                {{item.startTime+' '+$t('activity.toStart')}}
                                                <span class="timezone">(UTC+8)</span>
                                            </span>
                                            <van-button class="finish">{{$t('button.purchase.unstart')}}</van-button>
                                        </div>   
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <!-- <p class="title" v-if="finish.length > 0">{{$t('purchase.end')}}</p> -->
                        <!-- <ul v-if="finish.length > 0">
                            <li v-for="(item,index) in finish" :key="index" @click="$router.push({name: 'purchasedetail',params:{id:item.id}})">
                                <div class="content">
                                    <div :class="['cTop','finish',vColor(item.coincode)]">
                                        <div class="topOne">
                                            <h3>{{$mkt.vCnField(item,'title')}}</h3>
                                            <div class="toast">{{vIntroduction($mkt.vCnField(item,'introduction'))}}</div>
                                            <div class="detail">
                                                <dl>
                                                    <dt>{{$t('purchase.totalRounds')+'('+item.coinCode+')'}}</dt>
                                                    <dd>{{$mkt.fmtZero(item.totalNumber,item.scale)}}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>{{$t('purchase.purchasePrice')+'('+item.symbol+')'}}</dt>
                                                    <dd>{{$mkt.fmtZero(item.price,item.scale)}}</dd>
                                                </dl>
                                            </div>
                                            <span><img :src="item.coinCodeIcon" alt=""></span>
                                        </div>
                                    </div>
                                    <div class="cBot">
                                        <div class="progress">
                                            <van-progress :percentage="Number($mkt.fmtZero((item.totalNumber - item.remindNumber) / item.totalNumber,item.scale) * 100)" stroke-width="10" color="#FFA524" track-color="#FFF4E4" :show-pivot="false" /> 
                                            <div class="countdown">
                                                <span>{{vDate(item.endTime)+' '+$t('activity.toEnd')}}</span>
                                            </div>
                                        </div>  
                                        <div class="buy flexLevel">
                                            <div class="limit">{{$t('purchase.last',{number:$mkt.fmtZero(item.remindNumber,item.scale)+ ' ' + item.coinCode})}}</div>
                                            <van-button class="finish">{{$t('button.purchase.end')}}</van-button>
                                        </div>   
                                    </div>
                                </div>
                            </li>
                        </ul> -->
                    </div>
                </div>
            </div>
        </div>
        <downbar />
    </div>
</template>  

<script>  
    import downbar from '@/views/modules/downbar.vue'
    export default {
        data(){
            return{
                status: 'pending', // 认购状态
                sum: [],
                unStart:[],
                pending:[],
                finish:[],
                submiting:false
            }
        },
        computed:{
            
        },
        components:{
            downbar
        },
        mounted(){
            this.ininPage();
        },
        activated() {
            this.ininPage();
        },
        watch:{

        },
        methods:{
            ininPage(){
                this.getChase();
            },
            vDate(date){
                date = date.replace(/-/g, '/');
                return this.$mkt.dateFormat('yyyy-mm-dd', date);
            },
            getChase(){
                let that = this;
                let date = new Date();
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url:'api/activity/labsApply/labsApply?status='+that.status,
                        data:{},
                        success(response){
                            // todo  逻辑待完善
                            if(response.data.status == 200){
                                that.submiting = false;
                                that.sum = response.data.data.filter((item) => {return item.rush != 1});
                                if(that.sum && that.sum.length > 0){
                                    // that.unStart = that.sum.filter((item) => {return new Date(item.startTime.replace(/-/g,'/')) >  date});
                                    // that.pending = that.sum.filter((item) => {
                                    //     return (new Date(item.startTime.replace(/-/g,'/')) <=  date && new Date(item.endTime.replace(/-/g,'/')) >=  date && item.remindNumber > 0)
                                    // });
                                    // that.finish = that.sum.filter((item) => {
                                    //     return (new Date(item.endTime.replace(/-/g,'/')) <  date || item.remindNumber == 0);
                                    // });
                                    // that.unStart = that.sum;
                                    that.pending = that.sum;
                                    that.finish = that.sum;

                                }
                            }
                        }
                    });
                }
            },
            vTime(endTime){
                return new Date(endTime.replace(/-/g,'/')).getTime() - new Date().getTime();
            },
            vIntroduction(str){
                return str.replace('<br/>','') + '...';
            },
            vColor(code){
                switch(code){
                    case 'NS':
                        return '';
                    case 'IEOS':
                        return 'ieos';
                    default:
                        return '';
                }
            }
        }
    }
</script>  

<style lang="scss" scoped>
    .topOne {
        width: 100%;
    }
</style>