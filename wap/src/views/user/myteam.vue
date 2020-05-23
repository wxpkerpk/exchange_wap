<template>
<div class="flexPage darkPage">
	<div class="flexHead">
	    <div class="currencyHead themeHead fixed">
			<navbar :params="pageInfo"  />
		</div>
	</div>
	<div class="flexContent">
		<div class="zcInfoWrapper teamWrapper">
			<div class="zcInfo">
				<div class="teaminfos">
					<dl>
						<dt>{{$t('assets.myteam.teamNum')}}</dt>
						<dd>{{teams.teamNum}}<router-link class="seeAll" :to="{name:'seeAll'}">【{{$t('assets.myteam.seeAll')}}】</router-link></dd>
					</dl>
					<dl>
						<dt>{{$t('assets.myteam.directPush')}}</dt>
						<dd>{{teams.directNum}}</dd>
					</dl>
				</div>
			</div>
			<div class="zcInfo">
				<h1 @click="$router.push({path: '/rules',query:{rule: 'contract'}})"><span>{{$t('home.i3')}}</span><van-icon class="ml1" name="question-o"></van-icon></h1>
				<div class="teamInfo">
					<dl>
						<dt>{{$t('assets.myteam.mytitle')}}</dt>
						<dd v-html="fmtRank(teams.contractLv)"></dd>
					</dl>
					<dl>
						<dt>{{$t('assets.myteam.joinNum')}}</dt>
						<dd>{{teams.contractTeamNum}}</dd>
					</dl>
					<dl>
						<dt>{{$t('assets.myteam.directPush')}}</dt>
						<dd>{{teams.contractDirectNum}}</dd>
					</dl>
					<dl>
						<dt>{{$t('assets.myteam.o1')}}</dt>
						<dd>{{teams.acNum}}</dd>
					</dl>
					<dl>
						<dt>{{$t('assets.myteam.o2')}}</dt>
						<dd>{{teams.dcNum}}</dd>
					</dl>
					<dl>
						<dt>{{$t('assets.myteam.o3')}}</dt>
						<dd>{{teams.rcNum}}</dd>
					</dl>
				</div>
			</div>
			<div class="zcInfo">
				<h1 @click="$router.push({path: '/rules',query:{rule: 'star'}})"><span>{{$t('assets.index.n4')}}</span><van-icon class="ml1" name="question-o"></van-icon></h1>
				<div class="teamInfo">
					<dl>
						<dt>{{$t('assets.myteam.mytitle')}}</dt>
						<dd v-html="fmtGrade(teams.lockLv)"></dd>
					</dl>
					<dl>
						<dt>{{$t('assets.myteam.allNum')}}</dt>
						<dd>{{teams.lockNum}}</dd>
					</dl>
				</div>
			</div>
			<h3>{{$t('assets.myteam.yesIncome')}}</h3>
			<div class="zcInfo noShadow">
				<div class="teamContent">
					<p class="flexBothSidesVertical"><b>{{$t('home.i3')}}</b><span @click="$router.push('/contractInfo')">{{$t('assets.myteam.seeDetail')}}</span></p>
					<van-cell-group>
						<van-cell v-for="(item,index) of contractVO" :key="index" :title="item.symbol" :value="item.amount" />
					</van-cell-group>
				</div>
			</div>
			<div class="zcInfo noShadow">
				<div class="teamContent">
					<p class="flexBothSidesVertical"><b>{{$t('assets.index.n4')}}</b><span @click="$router.push('/coinInfo')">{{$t('assets.myteam.seeDetail')}}</span></p>
					<van-cell-group>
						<van-cell v-for="(item,index) of profitVO" :key="index" :title="item.symbol" :value="item.amount" />
					</van-cell-group>
				</div>
			</div>
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
				title: this.$t('assets.personal.myteam'),
				navbarStyle: 'blue'
			},
    		isInvite:true,
    		teams:{},
    		profitVO:[],
    		contractVO:[],
    	}
    },
  	components:{navbar},
  	watch:{},
  	computed:{
  		userSign(){
  			let un = this.$mts.getUserValue('sign');
  			return un;
  		}
  	},
	mounted(){
		this.team();
		this.contract();
		this.profit();
	},
	methods:{
		fmtGrade(field){
			let v = "";
			switch(field){
				case 4:
					v = this.$t('assets.myteam.v1');
					break;
				case 5:
					v = this.$t('assets.myteam.v2');
					break;
				case 6:
					v = this.$t('assets.myteam.v3');
					break;
				case 7:
					v = this.$t('assets.myteam.v4');
					break;	
				default:
					v = this.$t('assets.myteam.v0');	
					break;
				}	
				return v;
		},
		fmtRank(field){
			let v = "";
			switch(field){
				case 'RC':
					v = this.$t('assets.myteam.l1');
					break;
				case 'DC':
					v = this.$t('assets.myteam.l2');
					break;
				case 'AC':
					v = this.$t('assets.myteam.l3');
					break;
				default:
					v = this.$t('assets.myteam.l0');	
					break;
				}	
				return v;
		},
		team(){
			let that = this;
			this.$mts.posts({
	            url:'team/extension',
	            data:{},
	            success(response){
	                if(response.data.code == 200){
	                 	that.teams = response.data.data
	                }
	            }, error( error){
	            }
	        });
		},
		contract(){
			let that = this;
			this.$mts.posts({
	            url:'team/contract',
	            data:{},
	            success(response){
	                if(response.data.code == 200){
	                 	that.contractVO = response.data.data
	                }
	            }, error( error){
	            }
	        });
		},
		profit(){
			let that = this;
			this.$mts.posts({
	            url:'team/profit',
	            data:{},
	            success(response){
	                if(response.data.code == 200){
	                 	that.profitVO = response.data.data
	                }
	            }, error( error){
	            }
	        });
		},
	}
}
</script>
