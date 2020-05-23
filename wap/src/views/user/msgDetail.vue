<template>
<div class="flexPage themePage">
	<div class="flexHead">
		<navbar :params="pageInfo" />	
	</div>
	<div class="flexContent">
		<div class="article">
			<h1>{{message.title}}</h1>
			<div class="date">{{message.createTime}}</div>
			<div class="content" v-html="message.content"></div>
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
				title: this.$t('nav.back'),
				navbarStyle: 'normal'
			},
    		message:{
    			title:"",
    			createTime:"",
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
			var that = this;
			that.$mts.post({
				url:'user/message/' + this.$route.params.id,
				data:{
				},success(response){
					if (response.data.code==200) {
						that.message = response.data.data;
					}
				}
			});
		}
	}
}
</script>
