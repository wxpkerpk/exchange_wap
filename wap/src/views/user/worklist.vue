<template>
<div class="flexPage darkPage">
	<div class="flexHead">
		<div class="payHead">
			<navbar :params="pageInfo" />	
			<p class="addAcount" @click="$router.push('/createWorklist')"><van-icon name="add-o"></van-icon>{{$t('trade.add')}}</p>
		</div>
	</div>
	<div class="flexContent">
		<div class="secondMenus otcTab">
			<div class="menusHeader">
                <ul class="tab">
                    <li v-for="(item,index) in tabs" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index)">{{item.title}}<span></span></li>
                </ul>
            </div>
		</div>
		<!-- 没有需要处理的工单 -->
		<div class="noWorklist flexSpindle" v-if="show">
			{{$t('assets.worklist.noworklist')}}
		</div>
		<!-- 全部 -->
		<div class="worklistWrapper" v-if="typeActive == 0">
            <loading />
           	<nodata v-if="!list || list.length==0"></nodata>
			<div class="worklistBox" v-for="(item,index) of list" :key="index">
				<div class="workHead flexBothSidesVertical">
					<span>{{item.time}}</span>
					<span :class="formatClass(item)" v-html="formatState(item)">
						<van-icon name="clock" :class="formatClass(item)"></van-icon>
					</span>
				</div>
				<h3 class="workTitle">{{item.question}}</h3>
				<div class="workReason">
					{{item.reason}}
				</div>
				<ul class="workMaterial">
					<li class="flexSpindle" v-for="(ite,idx) of item.materials" :key="idx">
						<img :src="ite" alt="" class="smallImg" @click="bigImg.show = true">
						<div class="canvasImg flexSpindle" v-if="bigImg.show && cur == idx">
							<img :src="ite" alt="" class="bigImg" @click="bigImg.show = false">
						</div>
					</li>
				</ul>
				<div class="responseBox">
					<p v-for="(it,ide) of item.details" :key="ide" :class="it.own =='Y' ? 'userRep' : 'serviceRep' ">
						<b v-html="it.own == 'Y' ? $t('assets.worklist.mine') : $t('assets.worklist.service')"></b>
						{{it.content}}
					</p>
					<p><span v-if="item.state != 3" @click="reply(item)">{{$t('assets.worklist.reply')}}</span></p>
				</div>
			</div>
		</div>
		<!-- 待处理 -->
		<div class="worklistWrapper" v-if="typeActive == 1">
            <loading />
           	<nodata v-if="!list || list.length==0"></nodata>
			<div class="worklistBox" v-for="(item,index) of list" :key="index">
				<div class="workHead flexBothSidesVertical">
					<span>{{item.time}}</span>
					<span :class="formatClass(item)" v-html="formatState(item)">
						<van-icon name="clock" :class="formatClass(item)"></van-icon>
					</span>
				</div>
				<h3 class="workTitle">{{item.question}}</h3>
				<div class="workReason">
					{{item.reason}}
				</div>
				<ul class="workMaterial">
					<li v-for="(it,idx) of item.materials" :key="idx">
						<img :src="it" alt="">
					</li>
				</ul>
				<div class="responseBox">
					<p v-for="(it,ide) of item.details" :key="ide" :class="it.own =='Y' ? 'userRep' : 'serviceRep' ">
						<b v-html="it.own == 'Y' ? $t('assets.worklist.mine') : $t('assets.worklist.service')"></b>
						{{it.content}}
					</p>
					<p ><span v-if="item.state != 3" @click="reply(item)">{{$t('assets.worklist.reply')}}</span></p>
				</div>
			</div>
		</div>
		<!-- 处理中 -->
		<div class="worklistWrapper" v-if="typeActive == 2">
            <loading />
           	<nodata v-if="!list || list.length==0"></nodata>
			<div class="worklistBox" v-for="(item,index) of list" :key="index">
				<div class="workHead flexBothSidesVertical">
					<span>{{item.time}}</span>
					<span :class="formatClass(item)" v-html="formatState(item)">
						<van-icon name="clock" :class="formatClass(item)"></van-icon>
					</span>
				</div>
				<h3 class="workTitle">{{item.question}}</h3>
				<div class="workReason">
					{{item.reason}}
				</div>
				<ul class="workMaterial">
					<li v-for="(it,idx) of item.materials" :key="idx">
						<img :src="it" alt="">
					</li>
				</ul>
				<div class="responseBox">
					<p v-for="(it,ide) of item.details" :key="ide" :class="it.own =='Y' ? 'userRep' : 'serviceRep' ">
						<b v-html="it.own == 'Y' ? $t('assets.worklist.mine') : $t('assets.worklist.service')"></b>
						{{it.content}}
					</p>
					<p><span v-if="item.state != 3" @click="reply(item)">{{$t('assets.worklist.reply')}}</span></p>
				</div>
			</div>
		</div>
		<!-- 已关闭 -->
		<div class="worklistWrapper" v-if="typeActive == 3">
            <loading />
           	<nodata v-if="!list || list.length==0"></nodata>
			<div class="worklistBox" v-for="(item,index) of list" :key="index">
				<div class="workHead flexBothSidesVertical">
					<span>{{item.time}}</span>
					<span :class="formatClass(item)" v-html="formatState(item)">
						<van-icon name="clock" :class="formatClass(item)"></van-icon>
					</span>
				</div>
				<h3 class="workTitle">{{item.question}}</h3>
				<div class="workReason">
					{{item.reason}}
				</div>
				<ul class="workMaterial">
					<li v-for="(it,idx) of item.materials" :key="idx">
						<img :src="it" alt="">
					</li>
				</ul>
				<div class="responseBox" v-if="!responseBox.show">
					<p v-for="(it,ide) of item.details" :key="ide" :class="it.own =='Y' ? 'userRep' : 'serviceRep' ">
						<b v-html="it.own == 'Y' ? $t('assets.worklist.mine') : $t('assets.worklist.service')"></b>
						{{it.content}}
					</p>
					<p><span v-if="item.state != 3" @click="reply(item)">{{$t('assets.worklist.reply')}}</span></p>
					<!-- 只有已关闭界面需要展开全部回复 -->
					<p class="loadMore" @click="responseBox.show = true">{{$t('assets.worklist.open')}}<van-icon name="arrow"></van-icon></p>
				</div>
				<div class="responseBox" v-if="responseBox.show">
					<p class="loadMore" @click="responseBox.show = false">{{$t('assets.worklist.close')}}<van-icon name="arrow"></van-icon></p>
				</div>
			</div>
		</div>
		<!-- 回复客服 -->
		<van-popup
			v-model="concact.show"
			position="bottom"
		>
			<div class="popupInput flexBothSidesVertical">
				<div class="inputText">
					<input type="text" :placeholder="$t('otc.order.i5')" v-model="content">
					<!-- <van-uploader>
						<van-icon name="photo-o"></van-icon>
					</van-uploader> -->
				</div>
				<span @click="send">{{$t('button.otc.send')}}</span>
			</div>
		</van-popup>
	</div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default {
	data(){
    	return {
			pageInfo:{
				title: this.$t('assets.worklist.myworklist'),
				url: '',
				value: '',
				icon: '',
				navbarStyle: 'normal',
				backname:"user"
			},
			typeActive:0,
            tabs:[
                { title: this.$t('trade.all'),active: 'active'},
                { title: this.$t('assets.worklist.wait'),active: '' },
				{ title: this.$t('assets.worklist.doing'),active: ''},
				{ title: this.$t('otc.order.completed'),active: ''},
			],
			cur: 0,
			bigImg:{
				show: false,
			},
			show: false, // 用户是否有工单记录
			concact:{
				show: false,
			},
			responseBox:{
				show: false, // 是否展开全部回复
			},
			content: '', //用户输入信息
			workId:'',
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
	},
	methods:{
		onChooseTab(index){
			this.typeActive = index;
			this.refresh()
		},
		onSendInput(){
			// 处理交流信息
			this.concact.show = false;
		},
		reply(item){
			let that = this;
			that.concact.show = true;
			that.workId = item.id;
		},
		formatState(item){
			switch(item.state){
				case 1:
					return this.$t('assets.worklist.wait');
					break;
				case 2:
					return this.$t('assets.worklist.doing');
					break;
				case 3:
					return this.$t('otc.order.completed');
					break;		
			}
		},
		formatClass(item){
			switch(item.state){
				case 1:
					return 'pink';
					break;
				case 2:
					return 'orange';
					break;
				case 3:
					return 'gray';
					break;		
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
				url:'work/query',
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
		},
		send(){
			let that = this;
			that.$mts.post({
				url:'work/reply',
				data:{
					workId:that.workId,
					content: that.content,
				},
				success(response){
					if(response.data.code == 200){
						that.concact.show = false;
						that.refresh();		
					}
				}
			});
		}
	}
}
</script>
