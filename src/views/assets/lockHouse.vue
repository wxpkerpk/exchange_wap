<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="purchaseWrapper nopd">
                <div class="purchaseTitle">
                    <h3>{{$t('user.index.lockhouse')}}</h3>
                </div>
                <div class="purchaseList">
                    <nodata v-if="!list || list.length == 0" />   
                    <ul v-else>
                        <li v-for="(item,index) in list" :key="index">
                            <div class="content">
                                <div class="top flexLevel">
                                    <dl>
                                        <dt><img :src="item.icon" alt=""></dt>
                                        <dd>{{item.coinCode}}</dd>
                                    </dl>
                                    <span class='date'>{{item.createTime}}</span>
                                </div>
                                <div class="detail sm">
                                    <dl>
                                        <dt>{{$t('purchase.totalAmount')}}({{item.coinCode}})</dt>
                                        <dd>{{$mkt.fmtZero(item.number,$mkt.getTokenScale(item.coinCode))}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>{{$t('purchase.released')}}</dt>
                                        <dd>{{$mkt.fmtZero((item.number - item.remind),$mkt.getTokenScale(item.coinCode))}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>{{$t('purchase.unReleased')}}</dt>
                                        <dd>{{item.remind}}</dd>
                                    </dl>
                                </div>
                            </div>
                        </li> 
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue';
    export default {
        data(){
            return{
                backUrl:{
                    url: '',
                },
                list:[]
                // endTime:'',
                // submiting: false,
                // size: 10
            }
        },
        computed:{
            // list(){
            //     return this.$store.state.app.vanList;
            // },
            // finished(){
            //     return this.$store.state.app.finished;
            // },
        },
        components:{
            backbar
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
                that.$mts.checkExpire('needback','lockhouse',()=>{
                    if (that.$store.state.isLogin) {
                        that.$mts.getCoins();
                        that.getBasic();
                    }
                })
            },
            getBasic(){
                let that = this;
                that.$mts.posts({
                    url:'api/activity/lockPosition/query',
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.list = response.data.data;
                        }
                    }
                })
            },
            refresh(){
                this.$mts.initPage();
                this.$store.state.app.loading = true;
                this.submiting = false,
                this.endTime = "";
                this.query();
            },
            query(){
                let that = this;
                if(!that.submiting){
                    that.submiting = true;
                    that.$mts.posts({
                        url:'api/activity/lockPosition/queryLog?endTime'+that.endTime+'&size='+that.size,
                        data:{},
                        success(response){
                            if(response.data.status == 200){
                                that.submiting = false;
                                let arr = response.data.data;
                                that.$mts.loading(arr,that.size);
                                that.endTime = new Date(arr[arr.length - 1].createTime.replace(/-/g,'/')).getTime();
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