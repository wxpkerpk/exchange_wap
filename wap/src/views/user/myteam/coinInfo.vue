<template>
<div class="flexPage themeColor">
	<div class="flexHead">
        <div class="currencyHead fixed">
            <navbar :params="pageInfo" />
        </div>
	</div>
	<div class="flexContent">
        <div class="coinBox">
            <!--  <div class="coinHead flexBothSidesVertical">
                <span>日期</span>
                <span>BTB</span>
            </div> -->
            
            <nodata v-if="!list || list.length==0"></nodata>
            <ul class="coinContent">
                <van-pull-refresh v-model="submiting" @refresh="refresh">
                    <van-list
                        v-model="$store.state.app.loading"
                        :finished="finished"
                        :offset="50"
                        @load="query"
                    >
                        <loading slot="loading" />
                        <li v-for="(item,index) of list" :key="index" class="coinConList flexBothSidesVertical">
                            <dl>
                                <dt><van-icon name="clock"></van-icon></dt>
                                <dd>{{item.time}}</dd>
                            </dl>
                            <span>{{item.symbol}}</span>
                            <span>{{item.amount}}</span>
                        </li>  
                    </van-list>
                </van-pull-refresh>        
            </ul>
        </div>
    </div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default {
	data(){
        return {
            pageInfo: {
				title: this.$t('assets.myteam.i2'),
                navbarStyle: 'normal',
			},
            pageNum:0,  //第一页
            submiting: true,
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
            that.pageNum ++;
            this.$mts.posts({
                url:'team/profits',
                data:{
                    pageNum:that.pageNum,
                },
                success(response){
                    if(response.data.code == 200){
                        that.$mts.loading(response.data.data);
                        that.submiting = false;
                    }
                }, error( error){
                }
            });
        },
    }
}
</script>
