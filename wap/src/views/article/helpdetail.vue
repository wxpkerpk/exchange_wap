<template>
<div class="flexPage themeColor">
	<div class="flexHead">
		<navbar :params="pageInfo" />	
	</div>
	<div class="flexContent">
		<div class="article">
			<h1>{{article.caption}}</h1>
			<div class="date">{{article.pubTime}}</div>
			<div class="content" v-html="article.content"></div>
		</div>
	</div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar"
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t("nav.back"),
				navbarStyle: 'normal'
			},
    		article:{
    			title:"",
    			date:"",
    			content:""
    		}
    	}
    },
  	components:{navbar},
  	watch:{},
  	computed:{
  	},
	mounted(){
		this.pageInit()
	},
	methods:{
		pageInit(){
			this.detail();
		},
		detail(){
			var _self = this;
			_self.$mts.post({
				url:'article/' + this.$route.params.id,
				data:{
				},success(response){
					if (response.data.code==200) {
						_self.article = response.data.data;
					}
				}
			});
		}
	}
}
</script>
