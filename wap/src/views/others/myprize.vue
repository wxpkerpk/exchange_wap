<template>
    <div class="flexPage themeColor"> 
        <div class="currencyHead fixed">
            <navbar :params="pageInfo" />	
        </div>
        <div class="flexContent">
            <ul class="prizeList">
                <van-pull-refresh v-model="submiting" @refresh="refresh">
                    <nodata v-if="list.length==0"></nodata>
                    <van-list
                        v-model="$store.state.app.loading"
                        :finished="finished"
                        :finished-text="list.length > 0 ? '' : $t('message.nodata')"
                        :offset="50"
                        @load="query"
                        v-else
                    >
                        <li v-for="(item,index) of list" :key="index">
                            <!-- <dl>
                                <dt><img :src="!item.headImage ? head : item.headImage" alt=""></dt>
                                <dd>{{item.username}}</dd>
                            </dl> -->
                            <b>{{$tdp.fmtZero(item.num,2)}} {{item.symbol}}</b>
                            <span>{{item.time}}</span>
                        </li>
                    </van-list>
                </van-pull-refresh>   
            </ul>
        </div>
    </div>
</template>
<script>
    import navbar from "@/views/modules/navbar.vue";
    import headInfo from '@/assets/img/head.jpg'
    export default{
        data(){
            return {
                pageInfo: {
                    title: this.$t('home.turntable.myprize'),
                    navbarStyle: "normal"
                },
                head:headInfo,
                pageNum:0, //第一页
                submiting: false,
            }
        },
        components:{navbar},
        watch:{},
        computed:{
            list(){
                return this.$store.state.app.vanList;
            },
            finished(){
                return this.$store.state.app.finished;
            }
        },
        mounted(){
            // 验证登录
            let that = this;
            that.$mts.initPage();
            that.$mts.checkLogin('needback',()=>{
                if (that.$store.state.isLogin) {
                    that.refresh();
                }
            });
        },
        methods:{
            refresh(){
                this.pageNum = 0;
                this.$mts.initPage();
                this.$store.state.app.loading = false;
                this.query()
            },
            query(){
                let that = this;
                that.pageNum ++
                that.$mts.post({
                    url:'draw/own',
                    data:{
                        pageNum: that.pageNum,
                        id: that.$route.params.id,
                    },
                    success(response){
                        if(response.data.code == 200){
                            that.$mts.loading(response.data.data);
                            that.submiting = false;
                        }
                    }
                });
            }
        }
    }
</script>
