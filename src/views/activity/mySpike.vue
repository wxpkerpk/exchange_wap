<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead">
                        <h3>{{$t('activity.mySpike')}}</h3>
                    </div>
                    <div class="mySpikeBox">
                        <nodata v-if="!list || list.length==0" />
                        <ul class="mySpikeList" v-else>
                            <van-pull-refresh v-model="submiting" @refresh="refresh">
                                <van-list
                                    v-model="$store.state.app.loading"
                                    :finished="finished"
                                    @load="query"
                                    :offset="50"
                                >
                                    <loading v-if="$store.state.app.loading" />
                                    <li v-for="(item,index) in list" :key="index">
                                        <div class="block">
                                            <div class="top flexLevel">
                                                <dl>
                                                    <dt><img :src="item.project.coinCodeIcon" alt=""></dt>
                                                    <dd>{{item.project.title}}</dd>
                                                </dl>
                                                <span>{{item.log.createTime}}</span>
                                            </div>
                                            <dl class="bottom flexLevel">
                                                <dl>
                                                    <dt>{{$t('activity.buyPrice')}}</dt>
                                                    <dd>{{item.log.price + ' ' + item.log.symbol}}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>{{$t('activity.buyNum')}}</dt>
                                                    <dd>{{item.log.number}}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>{{$t('trade.sumPrice')}}</dt>
                                                    <dd>{{$mkt.fmtZero(item.log.price*item.log.number,item.project.scale) + ' ' + item.log.symbol}}</dd>
                                                </dl>
                                            </dl>
                                        </div>
                                    </li>
                                </van-list>
                            </van-pull-refresh>
                        </ul>
                    </div>
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
                url: 'spike',
            },
            submiting: false, 
            size: 10,
        }
    },
    components:{backbar},
    computed:{
        list(){
            return this.$store.state.app.vanList;
        },
        finished(){
            return this.$store.state.app.finished;
        },
    },
	mounted(){
        this.initPage();
    },
    beforeDestroy(){
        this.$mts.initPage();
    },
    watch:{
        
    },
	methods:{
        initPage(){
            let that = this;
            that.$mts.checkExpire('needback','mySpike',()=>{
                that.refresh();
            });
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
                    url:'api/activity/labsApply/queryLogs?end='+that.end+'&size='+that.size+'&rush=1',
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
