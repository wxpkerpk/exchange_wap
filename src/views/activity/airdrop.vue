<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="airdropWrapper">
                <div class="head flexLevel">
                    <ul>
                        <li v-for="(item,index) in tabs" :key="index" :class="{active: cur == index}" @click="cur = index">{{item}}</li>
                    </ul>
                </div>
                <ul class="airdropList">
                    <van-pull-refresh v-model="submiting" @refresh="refresh">
                        <van-list
                            v-model="$store.state.app.loading"
                            :finished="finished"
                            @load="getAirdrop"
                            :offset="50"
                        >
                            <loading v-if="$store.state.app.loading" />
                            <li class="flexLevel" v-for="(item,index) in list" :key="index">
                                <dl>
                                    <dt>{{$t('table.coin')}}</dt>
                                    <dd>
                                        <b><img :src="item.icon" alt=""></b>
                                        <span>{{item.coinCode}}</span>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>{{$t('trade.number')}}</dt>
                                    <dd>{{item.amount}}</dd>
                                </dl>
                                <van-button size="small" :class="item.status === 'PENDING' ? '' : 'cant'" @click="goReceive(item.id)">{{item.status === 'PENDING' ? $t('button.airdrop.receive') : $t('button.airdrop.received')}}</van-button>
                            </li>
                        </van-list>
                    </van-pull-refresh>
                </ul>
            </div>
        </div>   
	</div>
</template>
<script>
import backbar from "@/views/modules/back.vue"
export default {
	data(){
        return {
            cur: 0,
            backUrl:{
                url: 'home',
                leftText:this.$t('activity.airdrop'),
            },
            tabs:[this.$t('activity.all'),this.$t('button.airdrop.received'),this.$t('button.airdrop.unReceive')],
            size: 10,
            pageNum: 0,
            submiting: false
        }
    },
    components:{backbar},
    computed:{
        list(){
            switch(this.cur){
                case 0:
                    return this.$store.state.app.vanList;
                case 1:
                    return this.$store.state.app.vanList.filter((item) => {
                        return item.status !== 'PENDING';
                    });
                case 2:
                    return this.$store.state.app.vanList.filter((item) => {
                        return item.status !== 'FINISHED';
                    });
                default:
                    return this.$store.state.app.vanList;
            }
        },
        finished(){
            return this.$store.state.app.finished;
        },
    },
	mounted(){
        let that = this;
        that.$mts.checkExpire('clear',true,()=>{
            if (that.$store.state.isLogin) {
                that.refresh();
            }
        });
    },
    watch:{
        
    },
	methods:{
        refresh(){
            this.size = 10;
            this.pageNum = 0;
            this.$mts.initPage();
            this.submiting = false;
            this.$store.state.app.loading = true;
            this.getAirdrop();
        },
        getAirdrop(){
            let that = this;
            that.pageNum++;
            if (!that.submiting) {
                that.submiting = true;
                that.$mts.posts({
                    url:'api/activity/airdrop/query?page='+that.pageNum+'&size='+that.size,
                    data:{},
                    success(response){
                        if (response.data.status == 200) {
                            that.submiting = false;
                            that.$mts.loading(response.data.data, 10 * that.pageNum, that.pageNum);
                        }
                    }
                })
            }
        },
        goReceive(id){
            let that = this;
            that.$mts.posts({
                url:'api/activity/airdrop/withdraw?id='+id,
                data:{},
                success(response){
                    if (response.data.status == 200) {
                        that.$mts.toast(that.$t('message.airdrop.success'));
                        that.refresh();
                    }else if(response.data.status == 901){
                        that.$mts.toast(that.$t('message.airdrop.receive'));
                    }
                }
            })
        }
	}
}
</script>
