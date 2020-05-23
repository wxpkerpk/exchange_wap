<template>
<div class="flexPage themeColor">
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
        <div class="lockCoinList" v-if="typeActive == 0">
            <nodata v-if="!unLockAll||unLockAll.length==0" />
            <ul>
				<li v-for="(time,index) of unLockAll" :key="index" >
				    <p>
						<span v-if="time.taskNum >= taskNum.split(',')[0] " class="green">释放</span>
						<span v-if="time.taskNum < taskNum.split(',')[0] " class="red">销毁</span>
						<b>{{coin}}</b>
					</p>
				    <div class="listInfo">
				        <dl>
				            <dt>{{$t('assets.lockcoin.workCompleted')}}</dt>
				            <dd>{{time.taskNum}}/{{taskNum}}</dd>
				        </dl>
				        <dl>
				            <dt>{{$t('trade.number')}}</dt>
				            <dd v-if="time.unlockNum != 0">{{time.unlockNum}}{{coin}}</dd>
							<dd v-if="time.unlockNum == 0">{{time.expireNum}}{{coin}}</dd>
				        </dl>
				        <dl>
				            <dt>{{$t('assets.lockcoin.completedTime')}}</dt>
				            <dd>{{$tool.dataFormat(new Date(time.unlockDate),"yyyy-MM-dd")}}</dd>
				        </dl>
				    </div>
				</li>
            </ul>
        </div>
        <!-- 释放 -->
        <div class="lockCoinList" v-if="typeActive == 1">
            <nodata v-if="!unLock||unLock.length==0" />
            <ul>
                <li v-for="(time,index) of unLock" :key="index" v-if="time.taskNum >= taskNum.split(',')[0] ">
                    <p><span class="green">{{$t('assets.lockcoin.free')}}</span><b>{{coin}}</b></p>
                    <div class="listInfo">
                        <dl>
                            <dt>{{$t('assets.lockcoin.workCompleted')}}</dt>
                            <dd>{{time.taskNum}}/{{taskNum}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('trade.number')}}</dt>
                            <dd>{{time.unlockNum}}{{coin}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('assets.lockcoin.completedTime')}}</dt>
                            <dd>{{$tool.dataFormat(new Date(time.unlockDate),"yyyy-MM-dd")}}</dd>
                        </dl>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 销毁 -->
        <div class="lockCoinList" v-if="typeActive == 2">
            <nodata v-if="!unLockFail||unLockFail.length==0" />
            <ul>
                <li v-for="(time,index) of unLockFail" :key="index" v-if="time.taskNum < taskNum.split(',')[0] ">
                    <p><span class="red">{{$t('assets.lockcoin.destroy')}}</span><b>{{coin}}</b></p>
                    <div class="listInfo">
                        <dl>
                            <dt>{{$t('assets.lockcoin.workCompleted')}}</dt>
                            <dd>{{time.taskNum}}/{{taskNum}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('trade.number')}}</dt>
                            <dd>{{time.expireNum}}{{coin}}</dd>
                        </dl>
                        <dl>
                            <dt>{{$t('assets.lockcoin.completedTime')}}</dt>
                            <dd>{{$tool.dataFormat(new Date(time.unlockDate),"yyyy-MM-dd")}}</dd>
                        </dl>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
    data(){
        return {
            pageInfo:{
                title: this.$t('assets.index.freeResult'),
				navbarStyle: 'normal'
            },
            typeActive: 0,
            tabs:[
                { title: this.$t('trade.all'),active: 'active'},
                { title: this.$t('assets.lockcoin.free'),active: '' },
                { title: this.$t('assets.lockcoin.destroy'),active: ''}
            ],
            pageNum:1,
            pageSize:10,
			unLock:[],
			unLockAll:[],
			unLockFail:[],
			taskNum:0,
			coin:"BTB",
			tabIndex:2
        }   
    },
    components:{navbar},
    watch:{},
    computed:{
    },
    mounted(){
        this.unlockFlow();
		this.lockWhareConfig();
    },
    methods:{
        onChooseTab(index){
            this.typeActive = index;
			this.unlockFlow();
        },  
        unlockFlow(){ // 订单流
        	let that = this;
        	that.$mts.posts({
        		url:'lockWarehouse/unlockFlow',
        		data:{
					"pageNum":that.pageNum,
					"pageSize":that.pageSize,
					"tabIndex":that.typeActive,
        		},
        		success(response){
        			console.log(response)
        			if (response.data.code==200) {
						if(that.typeActive == 0){
							that.unLockAll = response.data.data.list;
						}else if(that.typeActive == 1){
							that.unLock = response.data.data.records;
						}else{
							that.unLockFail = response.data.data.list;
						}
						
        			}
        		}
        	});
        },
		lockWhareConfig(){ // 锁仓配置
			let that = this;
			that.$mts.get({
				url:'lockWarehouse/config',
				data:{
				},
				success(response){
					console.log(response)
					if (response.data.code==200) {
						var config = response.data.data;
						that.taskNum = config.taskNum;
						that.coin = config.coin;
					}
				},
			});
		},
    }
}
</script>
