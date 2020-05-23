<template>
	<div class="flexPage darkPage">
		<div class="flexHead">
			<div class="payHead">
				<navbar :params="pageInfo" />	
				<p class="addAcount" @click="addAccount"><van-icon name="add-o"></van-icon>{{$t('trade.add')}}</p>
			</div>
		</div>
		<div class="flexContent">
			<div class="addresslist">
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
							<li class="" v-for="(item,index) of list" :key="index">
								<div class="alTitle">
									<img :src="item.icon" alt="">
									<dl>
										<dt>{{item.token}}</dt>
										<dd>{{item.address}}</dd>
									</dl>
									<van-icon name="delete" @click="remove(item.id)"></van-icon>
								</div>
								<div class="alContent">
									<div class="alDes">{{item.remark}}</div>
								</div>
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
				title: this.$t('form.assets.tbAddr'),
				navbarStyle: 'normal',
				backname:"user"
			},
    		pageNum: 0, // 当前页码
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
	beforeDestroy(){
		this.$mts.initPage();
	},
	mounted(){
		// 验证登录
		this.$store.state.app.vanList = [];
		let that = this;
		that.$mts.checkLogin('needback',()=>{
 			if (that.$store.state.isLogin) {
				that.query();
				that.$mts.getKyc();
			}
		});
	},
	methods:{
		addAccount(){
			if(this.$store.state.user.kycState>5){
				this.$router.push('/addNewCoinAddress')
			}else{
				this.$toast(this.$t("assets.kyc.needC2"));
			}
		},
		refresh(){
			this.pageNum = 0;
            this.$mts.initPage();
            this.$store.state.app.loading = false;
            this.query()
		},
		query(){
			let that = this;
			that.pageNum ++;
			that.$mts.post({
				url:'cheque/query',
				data:{
					pageNum: that.pageNum
				},success(response){
					if (response.data.code==200) {
						that.$mts.loading(response.data.data);
						that.submiting = false;
					}
				}
			});
		},
		remove(id){
			let that = this;
			that.$dialog.confirm({
				title: that.$t('assets.coinaddr.t1'),
				message: that.$t('assets.coinaddr.t2'),
				confirmButtonText: that.$t('button.otc.sure'),
                cancelButtonText: that.$t('button.otc.cancel')
			}).then(() => {
				that.$mts.post({
					url:'cheque/delete/' + id,
					data:{
					},success(response){
						if (response.data.code==200) {
							that.$toast(that.$t('assets.coinaddr.t3'));
							that.refresh();
						}
					}
				});
			}).catch(() => {});
		}
	}
}
</script>
