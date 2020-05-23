<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="purchaseWrapper npd">
                <div class="purchaseDetail" v-for="(item,index) in list" :key="index">
                    <div class="top">
                        <div class="topOne">
                            <img :src="$mkt.vCnField(item,'titleImage')" alt="">
                        </div>
                        <div class="toptwo">
                            <div class="progress flexLevel">
                                <van-progress
                                    pivot-text=""
                                    color="#FFA524"
                                    :percentage="percent"
                                    stroke-width="12px"
                                />
                                <span>{{percent+'%'}}</span>
                            </div> 
                            <div class="time">
                                <span>{{vStatus}}</span>
                                <van-count-down :time="time" :format="$t('message.purchase.time')" class="countdown" v-if="vStatus == $t('purchase.activityAndTime')"/>
                            </div>
                        </div>
                    </div>
                    <div class="center">
                        <dl>
                            <dt>{{$t('purchase.limitBuy')}}</dt>
                            <dd>
                                {{$mkt.fmtZero(item.remindNumber,item.scale) + ' '}}
                                <span v-if="item.type !== 'point'">{{ item.coinCode }}</span>
                            </dd>
                        </dl>
                        <dl>
                            <dt>最大可买</dt>
                            <dd>
                                <span v-if="item.type !== 'point'">{{$mkt.fmtZero((item.totalNumber - item.remindNumber), item.scale) + ' '}}</span>
                                <span v-else>2</span>
                                <span v-if="item.type !== 'point'">{{ item.coinCode }}</span>
                            </dd>
                        </dl>
                        <dl>
                            <dt>{{$t('purchase.totalRounds')}}</dt>
                            <dd>
                                {{$mkt.fmtZero(item.totalNumber,item.scale) + ' '}}
                                <span v-if="item.type !== 'point'">{{ item.coinCode }}</span>
                            </dd>
                        </dl>
                        <!-- <dl>
                            <dt>{{$t('purchase.deductionSale')}}</dt>
                            <dd class="orange">{{vPrize}}</dd>
                        </dl> -->
                    </div>
                    <p class="line"></p>
                    <div class="purchaseBox">
                        <div class="title">{{$t('purchase.purchaseTitle')}}</div>
                        <div class="about">{{vIntroduction($mkt.vCnField(item,'introduction').slice(0,30))}}<span @click="$router.push({name:'introduction',params:{id:item.id}})">{{$t('purchase.seeDetail')}}</span></div>
                        <ul class="list">
                            <!-- <li><span>{{$t('purchase.internet')}}</span><b class="blue" @click="$mts.copy(item.introduction_url)">{{item.introduction_url}}</b></li>
                            <li><span>{{$t('purchase.whitePaper')}}</span><b class="blue" @click="$mts.copy(item.whitePaperUrl)">{{item.whitePaperUrl}}</b></li> -->
                            <li><span>{{$t('purchase.coinName')}}</span><b>{{item.coinCodeFullName}}</b></li>
                            <li><span>{{$t('purchase.stage')}}</span><b>{{$t('purchase.step',{step:item.round})}}</b></li>
                            <li><span>{{$t('purchase.purchasePrice')}}</span><b>{{$mkt.fmtZero(item.price,item.scale) + ' ' + item.symbol}}</b></li>
                        </ul>
                    </div>
                    <div class="parchaseBtn">
                        <span @click="goPurchase" :class="vColor">{{vBtn}}</span>
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
            return{
                backUrl:{
                    url: 'purchase'
                },
                status: 'pending',
                list:[],
                coinList:[]
            }
        },
        computed:{
            time(){
                if(this.list && this.list.length > 0){
                    return new Date(this.list[0].endTime).getTime() - new Date().getTime();
                }
            },
            percent(){
                if(this.list && this.list.length > 0){
                    return Number(this.$mkt.fmtZero((this.list[0].totalNumber - this.list[0].remindNumber) / this.list[0].totalNumber * 100,2));
                }
            },
            vStatus(){
                let that = this;
                let date = new Date();
                if(that.list && that.list.length > 0){
                    if(new Date(that.list[0].startTime) > date){
                        return that.list[0].startTime + ' ' + that.$t('activity.toStart');
                    }else if(new Date(that.list[0].startTime) <= date && new Date(that.list[0].endTime) >= date && that.list[0].remindNumber > 0){
                        return that.$t('purchase.activityAndTime');
                    }else if(new Date(that.list[0].endTime) < date || that.list[0].remindNumber == 0){
                        return that.list[0].endTime + ' ' + that.$t('activity.toEnd');
                    }
                }
            },
            vBtn(){
                let that = this;
                let date = new Date();
                if(that.list && that.list.length > 0){
                    if(new Date(that.list[0].startTime) > date){
                        return that.$t('button.purchase.unstart');
                    }else if(new Date(that.list[0].startTime) <= date && new Date(that.list[0].endTime) >= date && that.list[0].remindNumber > 0){
                        return that.$t('button.purchase.now');
                    }else if(new Date(that.list[0].endTime) < date || that.list[0].remindNumber == 0){
                        return that.$t('button.purchase.end');
                    }
                }
            },
            vPrize(){ // 冻结奖励金
                let that = this;
                if(that.$store.state.isLogin){
                    if((that.coinList && that.coinList.length > 0) && (that.list && that.list.length > 0)){
                        if(that.list[0].maxDudect !== 0){
                            return that.$store.state.isLogin ? that.$mkt.fmtZero(that.coinList[0].prizeFrozen * that.coinList[0].price,that.coinList[0].scale) : 0;
                        }else{
                            return 0;
                        }
                    }
                }else{
                    return 0;
                }
            },
            vColor(){
                let that = this;
                let date = new Date();
                if(that.list && that.list.length > 0){
                    if(new Date(that.list[0].startTime) > date){
                        return 'cant';
                    }else if(new Date(that.list[0].startTime) <= date && new Date(that.list[0].endTime) >= date && that.list[0].remindNumber > 0){
                        return '';
                    }else if(new Date(that.list[0].endTime) < date || that.list[0].remindNumber == 0){
                        return 'cant';
                    }
                }
            },
        },
        components:{
            backbar
        },
        mounted(){
            this.ininPage();
        },
        watch:{
            
        },
        methods:{
            ininPage(){
                let that = this;
                that.$mts.checkExpire('clear', true,()=>{
                    that.getChase();
                    if (that.$store.state.isLogin) {
                        that.getCoins();
                    }
                });
            },
            getChase(){
                let that = this;
                that.coinId = that.$route.params.id;
                that.$mts.posts({
                    url:'api/activity/labsApply/labsApply?status='+that.status,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.list = response.data.data.filter((item) => {
                                item.startTime = item.startTime.replace(/-/g,'/');
                                item.endTime = item.endTime.replace(/-/g,'/');
                                return item.rush != 1 && item.id == that.coinId});
                        }
                    }
                })
            },
            goPurchase(){
                let that = this;
                let date = new Date()
                if(that.$store.state.isLogin){
                    if(new Date(that.list[0].startTime) <= date && new Date(that.list[0].endTime) >= date && that.list[0].remindNumber > 0){
                        that.$router.push({path: '/goPurchase',query:{id:that.coinId}});
                    }else if(new Date(that.list[0].startTime) > date){
                        that.$mts.toast(that.$t('message.purchase.unStart'));
                    }else if(new Date(that.list[0].endTime) < date || that.list[0].remindNumber == 0){
                        that.$mts.toast(that.$t('message.purchase.finish'));
                    }
                }else{
                    that.$router.push({name:'signin',query:{path: '/purchasedetail/'+that.$route.params.id}})
                }   
            },
            getCoins(){ // 获取币种列表
                let that = this;
                that.$mts.posts({
                    url: 'api/me/balance/info',
                    data:{},
                    success(response){
                        if(response.status == 200){
                            that.coinList = response.data.data.balance.filter((item => {return item.coinCode == 'USDT'}));                      
                        }else{
                            that.$mts.toast(that.$t('message.public.dataError'));
                        }
                    }
                });
            },
            vIntroduction(str){
                return str.replace(/<\/?[^>]+>/g,'') + '...';
            }
        }
    }
</script>  

<style lang="scss">

</style>