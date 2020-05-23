<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsTitle">
                        <ul>
                            <li v-for="(item,index) in tabs" :key="index" :class="{active: cur == index}" @click="changeTabs(index)">{{item}}</li>
                        </ul>
                    </div>
                    <div class="myBouns">
                        <nodata v-if="!list || list.length==0" />
                        <ul class="myBounsList" v-else>
                            <van-pull-refresh v-model="submiting" @refresh="refresh">
                                <van-list
                                    v-model="$store.state.app.loading"
                                    :finished="finished"
                                    @load="query"
                                    :offset="50"
                                >
                                    <loading v-if="$store.state.app.loading" />
                                    <li v-for="(item,index) in list" :key="index">
                                        <dl class="flexLevel">
                                            <dt>
                                                <b>{{vText(item.amount)}}</b>
                                                <span>{{item.createTime}}</span>
                                            </dt>
                                            <dd>{{item.amount > 0 ? $mkt.fmtZero(item.amount) : $mkt.fmtZero(item.amount).slice(1)}} {{item.coinCode || 'USDT'}}</dd>
                                        </dl>
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
                url: 'bonus',
                leftText:this.$t('activity.bonusRecord'),
            },
            cur: 0,
            tabs:[this.$t('activity.all'),this.$t('activity.get'),this.$t('activity.release')],
            submiting: false, 
            size: 10,
            pageNum:0,
        }
    },
    components:{backbar},
    computed:{
        list(){
            return this.$store.state.app.vanList;
        },
        finished(){
            return this.$store.state.app.finished;
        }
    },
	mounted(){
        let that = this;
        that.$mts.checkExpire('needback','myBonus',()=>{
            if (that.$store.state.isLogin) {
                that.refresh();
            }
        })
    },
    beforeDestroy(){
        this.$mts.initPage();
    },
    watch:{
        
    },
	methods:{
        vText(number){
            if(number > 0){
                return this.$t('activity.getBouns');      
            } else if(number < 0){
                return this.$t('activity.freeBonus');      
            }          
        },
        refresh(){
            this.size = 10;
            this.pageNum = 0;
            this.$mts.initPage();
            this.submiting = false;
            this.$store.state.app.loading = true;
            this.query();
        },
        changeTabs(index){
            let that = this;
            that.cur = index;
            that.refresh();
        },
        query(){
            var that = this;
            if (!that.submiting) {
                that.submiting = true;
                that.pageNum ++;
                that.$mts.posts({
                    url:'api/activity/prize/queryLog?page='+that.pageNum+"&size="+10+'&status='+that.vStatus(),
                    data:{},
                    success(response){
                        if (response.data.status == 200) {
                            that.submiting = false;
                            that.$mts.loading(response.data.data, 10 * that.pageNum, that.pageNum);
                        }
                    }
                });
            }
        },
        vStatus(){
            let that = this;
            if (that.cur == 0) {
                return 'all';
            }
            if (that.cur == 1) {
                return 'gain';
            }
            return 'unLockOut';
        }
	}
}
</script>
