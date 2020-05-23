<template>
<div class="flexPage themeColor">
	<div class="flexHead">
	    <navbar :params="pageInfo" />	
	</div>
	<div class="flexContent">
		<ul class="articleList">
            <nodata v-if="!list || list.length==0"></nodata>
			<van-pull-refresh v-model="submiting" @refresh="refresh">
				<van-list
					v-model="$store.state.app.loading"
					:finished="finished"
					@load="articles"
					:offset="50"
				>
            		<loading slot="loading" />
					<li v-for="(item,index) of list" :key="index" @click="$router.push({name:'noticedetail',params:{id:item.id}})">
						<h3><span class="dot"></span>{{item.caption}}</h3>
						<div class="date">{{item.pubTime}}</div>
					</li>
				</van-list>
			</van-pull-refresh>	
		</ul>
	</div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar"
export default {
	data(){
    	return {
    		pageNum: 0, // 当前页码
			submiting:false,
			pageInfo:{
				title: this.$t("article.notice"),
				navbarStyle: 'normal'
			},
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
	},
	beforeDestroy(){
		
		this.$mts.initPage();
	},
	methods:{
		refresh(){
			this.pageNum = 0;
            this.$mts.initPage();
            this.$store.state.app.loading = true;
            this.articles()
		},
		articles(){
			let that = this;
			that.pageNum ++;
			that.$mts.post({
				url:'article',
				data:{
					type:'NOTICE', // 查询通知
					pageNum: that.pageNum
				},success(response){
					that.$store.state.app.loading = false;
					if (response.data.code == 200) {
						that.$mts.loading(response.data.data);
						that.submiting = false;
					}
				}
			});
		}
	}
}
</script>
