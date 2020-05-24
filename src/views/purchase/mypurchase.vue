<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="purchaseWrapper nopd">
                <div class="purchaseTitle">
                    <h3>{{$t('purchase.mypurchase')}}</h3>
                </div>
                <div class="purchaseList">
                    <nodata v-if="!list || list.length == 0" />   
                    <ul v-else>
                        <van-pull-refresh v-model="submiting" @refresh="refresh">
                            <van-list
                                v-model="$store.state.app.loading"
                                :finished="finished"
                                @load="query"
                                :offset="50"
                            >

                                <li v-for="(item,index) in list" :key="index">
                                    <div class="content">
                                        <div class="top flexLevel">
                                            <dl>
                                                <dt><img :src="item.project.coinCodeIcon" alt=""></dt>
                                                <dd>{{item.project.title}}</dd>
                                            </dl>
                                            <span class='date'>{{item.log.createTime}}</span>
                                        </div>
                                        <div class="detail">
                                            <dl>
                                                <dt>{{$t('purchase.purchasePrice')+'('+item.log.symbol+')'}}</dt>
                                                <dd>{{$mkt.fmtZero(item.log.price,item.project.scale)}}</dd>
                                            </dl>
                                            <dl>
                                                <dt>{{$t('purchase.purchaseNum')}}</dt>
                                                <dd>{{$mkt.fmtZero(item.log.number + item.log.dudect,item.project.scale)}}</dd>
                                            </dl>
                                            <dl>
                                                <dt>{{$t('purchase.purchaseAmount')+'('+item.log.symbol+')'}}</dt>
                                                <dd>{{$mkt.fmtZero($mkt.fmtZero((item.log.number + item.log.dudect) * item.log.price,item.project.scale))}}</dd>
                                            </dl>
                                            <!-- <dl>
                                                <dt>{{$t('purchase.deduction')+'('+item.log.symbol+')'}}</dt>
                                                <dd>{{$mkt.fmtZero(item.log.dudect * item.log.price,item.project.scale)}}</dd>
                                            </dl> -->
                                        </div>
                                    </div>
                                </li>
                            </van-list>
                        </van-pull-refresh> 
                    </ul>
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
                    url: ''
                },
                end: '',
                size: 10,
                submiting: false,
                nsList:[]
            }
        },
        computed:{
            list(){
                return this.$store.state.app.vanList;
            },
            finished(){
                return this.$store.state.app.finished;
            },
            theme(){
                return JSON.parse(localStorage.getItem('theme'));
            }
        },
        mounted(){
            let that = this;
            that.$mts.checkExpire('needback','invite',()=>{
                that.initPage();
            });
        },
        beforeDestroy(){
            this.$mts.initPage();
        },
        components:{
            backbar
        },
        watch:{

        },
        methods:{
            initPage(){
                this.refresh();
            },
            refresh(){
                this.$mts.initPage();
                this.$store.state.app.loading = true;
                this.end = '';
                this.submiting = false;
                this.query();
            },
            query(){
                let that = this;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url:'api/activity/labsApply/queryLogs?end='+that.end+'&size='+that.size,
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                that.submiting = false;
                                let arr = response.data.data;
                                that.$mts.loading(arr,that.size);
                                if (arr && arr.length > 0) {
                                    that.end = new Date(arr[arr.length - 1].log.createTime.replace(/-/g,'/')).getTime();
                                }
                            }
                        }
                    })
                }
            }
        }
    }
</script>  

<style lang="scss">

</style>