	<template>
<div class="flexPage themeColor">
	<div class="flexHead">
		<navbar :params="pageInfo" />	
	</div>
	<div class="flexContent">
		<div class="secondMenus">
            <div class="menusHeader">
                <ul class="tab">
                    <li v-for="(item,index) in tabs" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index)" >{{item.title}}<span></span></li>
                </ul>
            </div>
		</div>
		<div class="messageList" v-if="typeActive == 0">
           	<nodata v-if="!list || list.length==0"></nodata>
			<ul>
				<van-pull-refresh v-model="submiting" @refresh="refresh">
                    <van-list
                        v-model="$store.state.app.loading"
                        :finished="finished"
                        :offset="50"
                        @load="query"
					>
            			<loading slot="loading" />
						<li class="unread" v-for="(item,index) of list" :key="index" @click="$router.push({name:'msgdetail',params:{id:item.id}})">
							<div>{{item.createTime}}</div>
							<p>{{item.title}}</p>
						</li>
					</van-list>
				</van-pull-refresh>		
			</ul>
		</div>
		<div class="messageList" v-if="typeActive == 1">
           	<nodata v-if="!list || list.length==0"></nodata>
			<ul>
				<van-pull-refresh v-model="submiting" @refresh="refresh">
                    <van-list
                        v-model="$store.state.app.loading"
                        :finished="finished"
                        :offset="50"
					>
            			<loading slot="loading" />
						<li v-for="(item,index) of list" :key="index" @click="$router.push({name:'msgdetail',params:{id:item.id}})">
							<div>{{item.createTime}}</div>
							<p>{{item.title}}</p>
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
			pageInfo:{
				title: this.$t('assets.personal.message'),
				navbarStyle: 'normal',
				backname:'user'
			},
			typeActive:0,
            tabs:[
                { title: this.$t('assets.message.unread'),active: 'active'},
                { title: this.$t('assets.message.readed'),active: '' },
            ],
            polling:null,
			pageNum:0, //第一页
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
        // 设置定时请求
        // this.polling = setInterval(()=>{
        //     this.refresh();
        // }, 10000);
	},
	methods:{
		onChooseTab(index){
			this.typeActive = index;
			this.refresh();
		},
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
				url:'user/messages',
				data:{
					state:that.typeActive,
					pageNum: that.pageNum,
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
