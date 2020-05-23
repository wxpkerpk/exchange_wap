<template>
<div class="flexPage darkPage">
    <div class="currencyHead fixed themeHead" >
		<navbar :params="pageInfo" />
	</div>
    <div class="flexContent">
        <div class="zcInfoWrapper sbInfoWrapper">
			<div class="zcInfo sb moreTimes" style="marginBottom: 2.6667vw;">
                <dl>
                    <dt>{{$t('assets.lockcoin.i1')}}</dt>
                    <dd>{{task_minimum}} {{coin}}</dd>
                </dl>
                <dl>
                    <dt>{{$t('assets.lockcoin.i2')}}</dt>
                    <dd>{{newTaskNum}} /{{'（'+taskNum+'）'}}</dd>
                </dl>
                <dl>
                    <dt>{{$t('assets.lockcoin.i3')}}</dt>
                    <dd>{{unlockDayNum}} {{coin}}</dd>
                </dl>
                <dl>
					<dt @click="$router.push({name:'secondContract',params:{symbol:'ETH_USDT'}})">
						{{$t('assets.lockcoin.go')}}
						<van-icon name="arrow"></van-icon>
					</dt>
				</dl>
            </div>
            <!-- 用户默认进来应该没有锁币记录，样式切换 -->
            <div class="zcInfo noSb" style="marginBottom: 2.6667vw;" v-if="!isLockCoin">
                <p>{{$t('assets.lockcoin.notLock')}}{{coin}}</p>
                <van-button @click="show = true">{{$t('assets.lockcoin.lock')}}{{coin}}</van-button>
                <div class="mt1 center sellcolor">请确认币币账户BTBT充足</div>
            </div>
			<div class="zcInfo noSb" style="marginBottom: 2.6667vw;" v-if="isLockCoin && lockToplimit-lockTotal>0">
			    <p>{{$t('assets.lockcoin.hasLock')}} {{lockToplimit-lockTotal}} {{coin}}</p>
			    <van-button @click="show = true">{{$t('assets.lockcoin.lock')}}{{coin}}</van-button>
                <div class="mt1 center sellcolor">{{$t('assets.lockcoin.tips')}}</div>
			</div>
            <div class="zcInfo sb sblist" style="marginBottom: 2.6667vw;" v-if="isLockCoin" v-for="(item,index) of userLockDetails" :key="index">
                <dl>
                    <dt>{{$t('assets.lockcoin.lock')}}{{coin}}</dt>
                    <dd>{{item.lockNum}}</dd>
                </dl>
                <dl>
                    <dt>{{$t('assets.lockcoin.hasFreed')}}</dt>
                    <dd>{{item.unlockNum/item.lockNum*100}}%</dd>
                </dl>
                <dl>
                    <dt>{{$t('assets.lockcoin.hasBoom')}}</dt>
                    <dd>{{item.expireNum/item.lockNum*100}}%</dd>
                </dl>
                <dl>
                    <dt>{{$t('assets.lockcoin.lockTime')}}</dt>
                    <dd>{{$tool.dataFormat(new Date(item.lockDate),"yyyy-MM-dd")}}</dd>
                </dl>
            </div>
        </div>
        <div class="promptInfo sbToast">
            {{$t('assets.lockcoin.description')}}<br>  
            <div v-html="$t('assets.lockcoin.rules')"></div>
        </div>

        <div class="lockCoinHandle">
            <div class="flexBothSidesVertical">
                <dl>
                    <dt>{{$t('assets.lockcoin.lockTotal')}}</dt>
                    <dd>{{lockTotal}}</dd>
                </dl>
                <dl>
                    <dt>{{$t('assets.lockcoin.hasAdd')}}</dt>
                    <dd>{{lockToplimit-lockTotal}}</dd>
                </dl>
            </div>
            <van-button @click.native="show = true" size="large">{{$t('assets.lockcoin.lock')}}{{coin}}</van-button>
        </div>
    </div>
    <van-action-sheet
        class="lockCoinAmount"
        v-model="show"
        :title="$t('assets.lockcoin.chooseNum')+coin+' '+$t('trade.number')"
    >
        <van-picker
            :columns="columns"
            :default-index="0"
            @change="onChange"
        />
        <van-button type="info" size="large" @click="lockCoin()">{{$t('form.submit')}}</van-button>
    </van-action-sheet>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
    data(){
        return {
            pageInfo:{
				title: this.$t('assets.index.n4'),
				url: '/lockCoinHistory',
				value: this.$t('assets.index.freeResult'),
				navbarStyle: 'blue'
            },
            isLockCoin: false,
            lockCoinAmount: 0,
            columns: [],
            show:false,
            radio:"",
			userId:"",
			coin:"BTBT",
			newTaskNum:0,
			config:null,
			userLockDetails:[],
			task_minimum:0,
			unlockDayNum:0,
			dayNum:0,
			lockTotal:0,
			lockToplimit:0,
			explain:"",
			taskNum:""
        }
    },
    components:{navbar},
    watch:{},
    computed:{
    },
    mounted(){
        this.lockWhareConfig();
    },
    methods:{
        // 增加锁币
        onChange(picker,value,index){
            this.lockCoinAmount = value;
        },
		lockWhareConfig(){ // 锁仓配置
			let that = this;
			that.$mts.get({
				url:'lockWarehouse/config',
				data:{
				},
				success(response){
					if (response.data.code==200) {
						that.config = response.data.data;
						that.columns = that.config.lockNum.split(',');
						that.dayNum = that.config.dayNum;
						that.lockToplimit = that.config.lockToplimit;
						that.explain = that.config.lockExplain;
						that.taskNum = that.config.taskNum;
						that.dayTaskNum();
						that.lockDetails();
						
					}
				},
			});
		},
		lockDetails(){ //锁仓情况
			let that = this;
			that.$mts.posts({
				url:'lockWarehouse/lockDetails',
				data:{},
				success(response){
					if (response.data.code==200) {
						that.userLockDetails = response.data.data;
						if(that.userLockDetails.length > 0){
							that.isLockCoin = true;
						}
						for(var i = 0; i < that.userLockDetails.length; i++) { 
							console.log(that.userLockDetails[i].lockNum+";"+that.lockTotal)
							that.lockTotal  = that.lockTotal + that.userLockDetails[i].lockNum; 
						};
						that.task_minimum = that.lockTotal * that.config.taskRatio
						that.unlockDayNum = that.lockTotal * that.config.unlockDayRatio * that.config.taskNum.split(',').length
					}
				}
			});
		},
		lockCoin(){ //用户锁仓
			let that = this;
			that.show = false;
			if(that.lockCoinAmount==0){
				that.lockCoinAmount = that.columns[0]
			}
			that.$mts.posts({
				url:'lockWarehouse/lockCoin',
				data:{
					"lockNum":that.lockCoinAmount,
					"coin":that.coin
				},
				success(response){
					console.log(response.data)
					if (response.data.code==200) {
						that.lockTotal = 0;
						that.dayTaskNum();
						that.lockDetails();
					}
				}
			});
		},
		onSelect(item){
			console.log(item)
		},
		dayTaskNum(){//当天任务完成次数
			let that = this;
			that.$mts.posts({
				url:'lockWarehouse/dayTaskNum',
				data:{
				},
				success(response){
					if (response.data.code==200) {
						that.newTaskNum = response.data.data;
					}
				}
			});
		}
    }
}
</script>
