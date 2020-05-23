<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="ruseWrapper">
                <div class="ruseTitle">
                    <h3>{{$t('user.article.announcement')}}</h3>
                    <div class="articleList">
                        <nodata v-if="!list || list.length == 0" />
                        <ul v-else>
                            <!-- <van-pull-refresh v-model="submiting" @refresh="refresh"> -->
                            <van-list
                                v-model="loading"
                                :finished="finished"
                                @load="query"
                                :offset="50"
                            >
                                <li @click="$router.push({ name: 'announcementDetail', params: { item } })" v-for="(item,index) in list" :key="index">
                                    <dl>
                                        <dt>{{item.title}}</dt>
                                        <dd>{{item.time}}</dd>
                                    </dl>
                                </li>
                            </van-list>
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
            loading: false,
            finished: false,
            backUrl:{
                url: '',
            },
            pageNum: 1,
            submiting: false,
            size:5,
            list: [],
        }
    },
    components:{backbar},
    mounted() {
        this.list = [];
        this.getList(1);
    },
    watch:{
        
    },
	methods:{
        // 获取公告列表
        getList(page) {
            const that = this;
            that.$mts.posts({
                url: `api/me/app/lastNews?page=${page}&size=5`,
                data:{
                },success(response){
                    that.submiting = false;
                    if (response.status == 200) {
                        that.list = that.list.concat(response.data.data);
                        if (response.data.data.length < 5) that.finished = true;
                    }
                }
            });
        },
        query() {
            this.pageNum++;
            this.getList(this.pageNum);
            this.loading = false;
        } 
	}
}
</script>

<style lang="scss" scoped>
    .back {
        background-color: #E4EEEF;
    }
</style>
