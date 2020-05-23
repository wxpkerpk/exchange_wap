<template>
<div class="flexPage themePage">
	<div class="flexHead">
		<navbar :params="pageInfo" />	
	</div>
	<div class="flexContent">
		<div class="secondMenus otcTab">
            <div class="menusHeader">
                <ul class="tab">
                    <li v-for="(item,index) in tabs" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index)">{{item.title}}<span></span></li>
                </ul>
            </div>
        </div>
		<!-- 全部 -->
		<div class="orderListBox" v-if="typeActive == 0">
            <nodata v-if="!list||list.length==0" />
			<ul>
				<van-pull-refresh v-model="submiting" @refresh="refresh">
					<van-list
						v-model="$store.state.app.loading"
						:finished="finished"
						@load="query"
						:offset="50"
					>
						<loading slot="loading" />
						<li v-for="(item,index) of list" :key="index">
							<div class="orderHead flexBothSidesVertical">
								<div class="orderHeadLeft">
									<b class="coinType">{{item.coinCode}}</b>
									<span>{{$tool.dataFormat(new Date(item.time),'yyyy-MM-dd hh:mm:ss')}}</span>
								</div>
								<div class="orderHeadRight flexBothSidesVertical">
									<span class="rightHandle" v-html="formatStatus(item.status)"></span>
								</div>
							</div>
							<div class="orderContent">
								<dl>
									<dt>{{$t('form.assets.txNum')}}</dt>
									<dd>{{item.number}}</dd>
								</dl>
								<dl>
									<dt>{{$t('form.assets.fee')}}</dt>
									<dd>{{item.realFee}} {{item.feeCoinCode}}</dd>
								</dl>
							</div>
							<div class="orderContent">
								<div class="addressing">{{item.hash}}
									<div class="fr"><van-button @click="$mts.copy(item.hash)" type="info" size="mini">{{$t('form.assets.copyAddr')}}</van-button></div>
								</div>
							</div>
						</li>
					</van-list>
				</van-pull-refresh>		
			</ul>
		</div>
		<!-- 进行中 -->
		<div class="orderListBox" v-if="typeActive == 1">
            <nodata v-if="!list||list.length==0" />
			<ul>
				<van-pull-refresh v-model="submiting" @refresh="refresh">
					<van-list
						v-model="$store.state.app.loading"
						:finished="finished"
						@load="query"
						:offset="50"
					>
						<loading slot="loading" />
						<li v-for="(item,index) of list" :key="index">
							<div class="orderHead flexBothSidesVertical">
								<div class="orderHeadLeft">
									<b class="coinType">{{item.coinCode}}</b>
									<span>{{$tool.dataFormat(new Date(item.time),'yyyy-MM-dd hh:mm:ss')}}</span>
								</div>
								<div class="orderHeadRight flexBothSidesVertical">
									<span class="rightHandle" v-html="formatStatus(item.status)"></span>
								</div>
							</div>
							<div class="orderContent">
								<dl>
									<dt>{{$t('form.assets.txNum')}}</dt>
									<dd>{{item.number}}</dd>
								</dl>
								<dl>
									<dt>{{$t('form.assets.fee')}}</dt>
									<dd>{{item.realFee}} {{item.feeCoinCode}}</dd>
								</dl>
							</div>
							<div class="orderContent">
								<div class="addressing">{{item.hash}}
									<div class="fr"><van-button @click="$mts.copy(item.hash)" type="info" size="mini">{{$t('form.assets.copyAddr')}}</van-button></div>
								</div>
							</div>
						</li>
					</van-list>
				</van-pull-refresh>		
			</ul>
		</div>
		<!-- 已完成 -->
		<div class="orderListBox" v-if="typeActive == 2">
            <nodata v-if="!list||list.length==0" />
			<ul>
				<van-pull-refresh v-model="submiting" @refresh="refresh">
					<van-list
						v-model="$store.state.app.loading"
						:finished="finished"
						@load="query"
						:offset="50"
					>
						<loading slot="loading" />
						<li v-for="(item,index) of list" :key="index">
							<div class="orderHead flexBothSidesVertical">
								<div class="orderHeadLeft">
									<b class="coinType">{{item.coinCode}}</b>
									<span>{{$tool.dataFormat(new Date(item.time),'yyyy-MM-dd hh:mm:ss')}}</span>
								</div>
								<div class="orderHeadRight flexBothSidesVertical">
									<span class="rightHandle" v-html="formatStatus(item.status)"></span>
								</div>
							</div>
							<div class="orderContent">
								<dl>
									<dt>{{$t('form.assets.txNum')}}</dt>
									<dd>{{item.number}}</dd>
								</dl>
								<dl>
									<dt>{{$t('form.assets.fee')}}</dt>
									<dd>{{item.fee}} {{item.feeCoinCode}}</dd>
								</dl>
							</div>
							<div class="orderContent">
								<div class="addressing">{{item.hash}}
									<div class="fr"><van-button @click="$mts.copy(item.hash)" type="info" size="mini">{{$t('form.assets.copyAddr')}}</van-button></div>
								</div>
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
import navbar from '@/views/modules/navbar.vue'
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('form.assets.tbResult'),
				navbarStyle: 'normal'
			},
			typeActive:0,
            tabs:[
                { title: this.$t('trade.all'),active: 'active'},
                { title: this.$t('otc.order.pending'),active: '' },
                { title: this.$t('otc.order.completed'),active: ''}
            ],
    		pageNum: 1, // 当前页码
    		submiting:false
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
	methods:{
		onChooseTab(index){
            this.typeActive = index;
            this.refresh();
        },
		refresh(){
			this.pageNum = 1;
            this.$mts.initPage();
            this.$store.state.app.loading = true;
            this.query()
		},
		query(){
			var that = this;
			that.$mts.post({
				url:'chain/withdraw/flow',
				data:{
					pageNum: that.pageNum,
					state: that.typeActive
				},success(response){
					if (response.data.code == 200) {
						that.$mts.loading(response.data.data);
						that.submiting = false;
					}
				}
			});
		},
		formatStatus(status){
            switch(status){
                case "CONFIRM":   //已到账
                    return this.$t('otc.order.completed');
                    break;
                default:
                    return this.$t('otc.order.pending');
                    break;
            }
        },
	}
}
</script>
