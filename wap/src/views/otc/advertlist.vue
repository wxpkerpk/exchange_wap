<template>
<div class="flexPage themePage flexContent">
    <navbar :params="pageInfo"/>  
    <div class="flexContent">
        <div class="secondMenus otcTab">
            <div class="menusHeader">
                <ul class="tab">
                    <li v-for="(item,index) in tabs" :key="index" :class="{active: typeActive==index}" @click="onChooseTab(index)">{{item.title}}<span></span></li>
                </ul>
            </div>
        </div>
        <!-- 全部订单 -->
        <div class="orderListBox" v-show="typeActive==0">
            <ul>
                <nodata v-if="!list || list.length==0"></nodata>
                <van-pull-refresh v-model="submiting" @refresh="refresh">
                    <van-list
                        v-model="$store.state.app.loading"
                        :finished="finished"
                        :offset="50"
                    >
                        <loading slot="loading" />
                        <li  v-for="(item,index) of list" :key="index">
                            <div class="orderHead flexBothSidesVertical">
                                <div class="orderHeadLeft">
                                    <span :class="[item.type == 'BUY' ? 'green' : 'red','flexSpindle']" v-html="formatType(item.type)"></span>
                                    <b>{{item.symbol}}</b>
                                    <span>{{item.createTime}}</span>
                                </div>
                                <div class="orderHeadRight flexBothSidesVertical">
                                    <span v-html="formatState(item.state)"></span><van-icon name="arrow" />
                                </div>
                            </div>
                            <div class="orderContent">
                                <dl>
                                    <dt>{{$t('otc.detail.price')}}</dt>
                                    <dd>{{item.price}} {{item.rate}}/ {{item.symbol}}</dd>
                                </dl>
                                <dl>
                                    <dt v-if="item.type =='SELL'">{{$t('otc.order.lave')}}</dt>
                                    <dd v-if="item.type =='SELL'">{{item.remindNum?item.remindNum.toFixed(2):''}} {{item.symbol}}</dd>
                                </dl>
                                <dl>
                                    <dt>{{$t('otc.index.limitAmount')}}</dt>
                                    <dd>{{item.limitDown}} - {{item.limitUp}} {{item.rate}}</dd>
                                </dl>
                                <dl v-if="item.state == '1'">
                                    <dt></dt>
                                    <dd>
                                        <van-button @click="under(item)" size="mini" type="warning">{{$t('otc.order.obtained')}}</van-button>
                                    </dd>
                                </dl>
                            </div>
                        </li>
                    </van-list>
                </van-pull-refresh>
            </ul>
        </div>
        <!-- 进行中 -->
        <div class="orderListBox" v-show="typeActive==1">
            <ul>
                <nodata v-if="!list || list.length==0"></nodata>
                <van-pull-refresh v-model="submiting" @refresh="refresh">
                    <van-list
                        v-model="$store.state.app.loading"
                        :finished="finished"
                        :offset="50"
                    >
                        <loading slot="loading" />
                        <li v-for="(item,index) of list" :key="index">
                            <div class="orderHead flexBothSidesVertical">
                                <div class="orderHeadLeft">
                                    <span :class="[item.type == 'BUY' ? 'green' : 'red','flexSpindle']" v-html="formatType(item.type)"></span>
                                    <b>{{item.symbol}}</b>
                                    <span>{{item.createTime}}</span>
                                </div>
                                <div class="orderHeadRight flexBothSidesVertical">
                                    <span v-html="formatState(item.state)"></span><van-icon name="arrow" />
                                </div>
                            </div>
                            <div class="orderContent">
                                <dl>
                                    <dt>{{$t('otc.detail.price')}}</dt>
                                    <dd>{{item.price}} {{item.rate}}/{{item.symbol}}</dd>
                                </dl>
                                <dl>
                                    <dt v-if="item.type =='SELL'">{{$t('otc.order.lave')}}</dt>
                                    <dd v-if="item.type =='SELL'">{{item.remindNum?item.remindNum.toFixed(2):''}} {{item.symbol}}</dd>
                                </dl>
                                <dl>
                                    <dt>{{$t('otc.index.limitAmount')}}</dt>
                                    <dd>{{item.limitDown}} - {{item.limitUp}} {{item.rate}}</dd>
                                </dl>
                            </div>
                        </li>
                    </van-list>
                </van-pull-refresh>
            </ul>
        </div>
        <!-- 已完成 -->
        <div class="orderListBox" v-show="typeActive==2">
            <ul>
                <nodata v-if="!list || list.length==0"></nodata>
                <van-pull-refresh v-model="submiting" @refresh="refresh">
                    <van-list
                        v-model="$store.state.app.loading"
                        :finished="finished"
                        :offset="50"
                    >
                        <loading slot="loading" />
                        <li v-for="(item,index) of list" :key="index">
                            <div class="orderHead flexBothSidesVertical">
                                <div class="orderHeadLeft">
                                    <span :class="[item.type == 'BUY' ? 'green' : 'red','flexSpindle']" v-html="formatType(item.type)"></span>
                                    <b>{{item.symbol}}</b>
                                    <span>{{item.createTime}}</span>
                                </div>
                                <div class="orderHeadRight flexBothSidesVertical">
                                    <span v-html="formatState(item.state)"></span><van-icon name="arrow" />
                                </div>
                            </div>
                            <div class="orderContent">
                                <dl>
                                    <dt>{{$t('otc.detail.price')}}</dt>
                                    <dd>{{item.price}} {{item.rate}}/{{item.symbol}}</dd>
                                </dl>
                                <dl>
                                    <dt v-if="item.type =='SELL'">{{$t('otc.order.lave')}}</dt>
                                    <dd v-if="item.type =='SELL'">{{item.remindNum?item.remindNum.toFixed(2):''}} {{item.symbol}}</dd>
                                </dl>
                                <dl>
                                    <dt>{{$t('otc.index.limitAmount')}}</dt>
                                    <dd>{{item.limitDown}} - {{item.limitUp}} {{item.rate}}</dd>
                                </dl>
                            </div>
                        </li>
                    </van-list>
                </van-pull-refresh>        
            </ul>
        </div>
    </div>
    <downbar/>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
import downbar from "@/views/modules/downbar.vue";
export default {
    data(){
        return {
            pageInfo:{
                title: this.$t('otc.popup.myAd'),
                navbarStyle: 'normal',
            },
            typeActive:0,
            tabs:[
                { title: this.$t('trade.all'),active: 'active'},
                { title: this.$t('otc.order.pending'),active: '' },
                { title: this.$t('otc.order.remove'),active: ''}
            ],
            pageNum:1, //第一页
            submiting: true,
        }
    },
    components:{navbar,downbar},
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
            this.refresh();
        },
        formatType(type){
            switch(type){
                case 'SELL':
                    return this.$t('trade.sellOut');
                    break;
                case 'BUY' :
                    return this.$t('trade.buyIn');
                    break;    
            }
        },
        formatState(state){
            switch(state){
                case 1 :
                    return this.$t('otc.order.pending');
                    break;  
                case 2 :
                    return this.$t('otc.order.remove');
                    break;
            }
        },
        refresh(){
            this.pageNum = 1;
            this.$mts.initPage();
            this.$store.state.app.loading = false;
            this.query()
        },
        query(){
            let that = this;
            that.$mts.post({
                url:'otc/advert/query',
                data:{
                    pageNum: that.pageNum,
                    pageSize:10000,
                    state:that.typeActive,
                },success(response){
                    if (response.data.code == 200) {
                        that.$mts.loading(response.data.data);
                        // that.submiting = false;
                    }
                }
            });
        },
        under(item){
            let that = this;
            that.$mts.posts({
                url:'otc/advert/invalid/' + item.id,
                data:{
                },success(response){
                    if (response.data.code == 200) {
                        that.$toast(that.$t('message.otc.removeSuc'));
                        that.refresh();
                    }
                }
            });
        }
    }
}
</script>
<style lang="stylus"></style>