<template>
    <div class="t-help">
        <backbar :back="{ url: 'applets' }" />
        <van-tabs
            v-model="active"
            @click="clickTabs"
        >
            <van-tab title="卖出记录">
                <van-pull-refresh v-model="refreshingSale" @refresh="onRefreshSale" class="pull-container">
                    <van-list
                        v-model="loadingSale"
                        :finished="finishedSale"
                        finished-text="没有更多了"
                        @load="onLoadSale"
                    >
                        <div
                            class="list-item"
                            v-for="(item, index) in listSale"
                            :key="index"
                        >
                            <div class="head">
                                <span>id：{{ item.id }}</span>
                                <img class="logo-icon" :src="require('@/assets/svg/t-help-icon.svg')"/>
                            </div>
                            <div class="secret-container">
                                <span>口令：{{ item.secret }}</span>
                                <img class="copy-icon" :src="require('@/assets/svg/copy.svg')" slot="icon" @click="$mts.copy(item.secret)"/>
                            </div>
                            <div class="content">
                                <div class="left">
                                    <span>价格：{{ item.price }} $</span>
                                    <span>状态：{{ item.status === 'pending' ? '未完成' : item.status === 'finish' ? '已完成' : '已取消' }}</span>
                                </div>
                                <div class="center">
                                    <span>数量：{{ item.amount }}</span>
                                    <span v-if="item.fee">手续费：{{ item.fee }}</span>
                                </div>
                                <div class="right">
                                    <span>总价：{{ accMul(item.price, item.amount)}} $</span>
                                    <span class="cancel-btn">
                                        <van-button 
                                            v-if="item.status === 'pending'"
                                            type="default"
                                            size="mini"
                                            round
                                            @click="cancelOrder(item.id)"
                                        >
                                            <span>取消</span>
                                        </van-button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="买入记录">
                <van-pull-refresh v-model="refreshingBuy" @refresh="onRefreshBuy">
                    <van-list
                        v-model="loadingBuy"
                        :finished="finishedBuy"
                        finished-text="没有更多了"
                        @load="onLoadBuy"
                    >
                        <div
                            class="list-item"
                            v-for="(item, index) in listBuy"
                            :key="index"
                        >
                            <div class="head">id：{{ item.id }}</div>
                            <div class="secret-container">
                                <span>口令：{{ item.secret }}</span>
                                <img class="copy-icon" :src="require('@/assets/svg/copy.svg')" slot="icon" @click="$mts.copy(item.secret)"/>
                            </div>
                            <div class="content">
                                <div class="left">
                                    <span>价格：{{ item.price }} $</span>
                                    <span>状态：{{ item.status === 'pending' ? '未完成' : item.status === 'finish' ? '已完成' : '已取消' }}</span>
                                </div>
                                <div class="center">
                                    <span>数量：{{ item.amount }}</span>
                                    <span v-if="item.fee">手续费：{{ item.fee }} $</span>
                                </div>
                                <div class="right">
                                    <span>总价：{{ accMul(item.price, item.amount)}} $</span>
                                </div>
                            </div>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
        <div class="btn-container">
            <van-button 
                type="default"
                round
                size="small"
                @click="clickHandle('sell')"
                class="operat-btn"
                color="#1DD063"
            >
                <span>卖出</span>
            </van-button>
            <van-button 
                type="default"
                round
                size="small"
                @click="clickHandle('buy')"
                class="operat-btn"
                color="#F94E65"
            >
                <span>买入</span>
            </van-button>
        </div>

        <van-popup 
            v-model="bugTokenShow"
            @closed="closedBuyPopHandle"
            closeable
        >
            <div class="buy-popup-container">
                <div class="token-container">
                    <van-cell-group class="input-box">
                        <van-field v-model="secret" placeholder="请输入口令" >
                            <template #button>
                                <van-button 
                                    type="default"
                                    size="small"
                                    @click="searchHandle()"
                                >
                                    <span>搜索</span>
                                </van-button>
                            </template>
                        </van-field>
                    </van-cell-group>
                    <template v-if="showOrederInfo">
                        <div class="order-info">
                            <span>价格：{{ dataBySecret.price }} $ ≈ {{ accMul(dataBySecret.price, $mkt.vPrice()) }} ￥</span>
                            <span>数量：{{ dataBySecret.amount }}</span>
                            <span>总价：{{ accMul(dataBySecret.price, dataBySecret.amount) }} $ ≈ {{ accMul(accMul(dataBySecret.price, dataBySecret.amount), $mkt.vPrice()) }} ￥</span>
                            <span>订单号：{{ dataBySecret.id }}</span>
                            <span>状态：{{ dataBySecret.status === 'pending' ? '未完成' : dataBySecret.status === 'finish' ? '已完成' : '已取消' }}</span>
                        </div>
                        <div
                            class="sure-container"
                            v-if="dataBySecret.status === 'pending'"
                        >
                            <van-button 
                                type="default"
                                size="small"
                                @click="sureHandle()"
                            >
                                <span>确认</span>
                            </van-button>
                        </div>
                    </template>
                </div>
            </div>
        </van-popup>
        
        <van-popup v-model="sellTokenShow" closeable>
            <div class="buy-popup-container">
                <div class="token-container">
                    <van-cell-group class="input-box">
                        <van-field v-model="amount" placeholder="请输入数量" ></van-field>
                    </van-cell-group>
                    <span class="sell-price">价格：{{ price }} $</span>
                    <div class="btn-container2">
                        <van-button 
                            type="info"
                            size="small"
                            @click="sellHandle()"
                        >
                            <span>确认</span>
                        </van-button>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'

    export default {
        name: 'Help',
        components: {
            backbar,
        },
        data() {
            return {
                active: 0,
                activeName: 'sell',
                listSale: [],
                loadingSale: false,
                finishedSale: false,
                refreshingSale: false,

                listBuy: [],
                loadingBuy: false,
                finishedBuy: false,
                refreshingBuy: false,

                bugTokenShow: false,
                showOrederInfo: false,
                secret: '',
                page: 1,
                dataBySecret: {},
                sellTokenShow: false,
                amount: '',
                price: '',
            };
        },
        created() {
            this.getPrice();
        },
        methods: {
            // 获取价格
            getPrice() {
                this.$mts.posts({
                    url: 'api/applications/p2p/price',
                    data:{},
                    success: (res) => {
                        if(res.data.status === 200){
                            this.price = res.data.data;
                        }
                    }
                });
            },
            // 订单查询
            getList(page, direction) {
                this.$mts.postUrl({
                    url: 'api/applications/p2p/queryOrder',
                    data:{
                        page,
                        size: 10,
                        direction,
                    },
                    success: (res) => {
                        if(res.data.status === 200){
                            if (direction === 'sell') {
                                // 卖出
                                if (page === 1) {
                                    this.listSale = res.data.data;
                                } else {
                                    this.listSale = this.listSale.concat(res.data.data);
                                }
                                this.loadingSale = false;
                                this.refreshingSale = false;
                                if (!res.data.data.length) this.finishedSale = true;
                            } else {
                                // 买入
                                if (page === 1) {
                                    this.listBuy = res.data.data;
                                } else {
                                    this.listBuy = this.listBuy.concat(res.data.data);
                                }
                                this.loadingBuy = false;
                                this.refreshingBuy = false;
                                if (res.data.data.length < 10) this.finishedBuy = true;
                            }
                        }
                    }
                });
            },
            // 通过口令查询
            getSearch(secret) {
                this.$mts.postUrl({
                    url: 'api/applications/p2p/queryBySecret',
                    data:{
                        secret,
                    },
                    success: (res) => {
                        if(res.data.status === 200){
                            this.dataBySecret = res.data.data || {};
                            if (res.data.data) this.showOrederInfo = true;
                        }
                    }
                });
            },
            // 买入
            buy(secret) {
                this.$mts.postUrl({
                    url: 'api/applications/p2p/buy',
                    data:{
                        secret,
                    },
                    success: (res) => {
                        if(res.data.status === 200){
                            this.$toast('买入成功');
                            this.bugTokenShow = false;
                            if (this.active) {
                                this.page = 1;
                                this.getList(1, 'buy');
                            }
                        } else if (res.data.status === 800) {
                            this.$toast('余额不足');
                        } else if (res.data.status === 700) {
                            this.$toast('订单已经完成，不能重复购买');
                        } else {
                            this.$toast(res.data.message);
                        }
                    }
                });
            },
            // 卖出
            sellHandle() {
                this.$mts.postUrl({
                    url: 'api/applications/p2p/sell',
                    data:{
                        amount: this.amount,
                    },
                    success: (res) => {
                        if(res.data.status === 200){
                            this.$toast('卖出成功');
                            if (!this.active) {
                                this.page = 1;
                                this.getList(1, 'sell');
                            }
                            this.amount = '';
                            this.sellTokenShow = false;
                        } else if (res.data.status === 800) {
                            this.$toast('余额不足');
                        } else if (res.data.status === 700) {
                            this.$toast('可售额度不足');
                        } else {
                            this.$toast(res.data.message);
                        }
                    }
                });
            },
            onLoadSale() {
                this.getList(this.page, 'sell');
                this.page++;
                this.loadingSale = false;
            },
            onRefreshSale() {
                // 重新加载数据
                this.getList(1, this.activeName);
                this.page = 2;
            },
            onLoadBuy() {
                this.getList(this.page, 'sell');
                this.page++;
                this.loadingBuy = false;
            },
            onRefreshBuy() {
                // 重新加载数据
                this.getList(1, this.activeName);
                this.page = 2;
                // this.finishedBuy = false;
            },
            clickHandle(type) {
                if (type === 'sell') {
                    this.sellTokenShow = true;
                } else {
                    this.bugTokenShow = true;
                }
            },
            searchHandle() {
                this.getSearch(this.secret);
            },
            sureHandle() {
                this.buy(this.secret);
            },
            clickTabs(name, title) {
                this.page = 1;
                // console.log(name)
                if (name) {
                    // 买入
                    this.getList(this.page, 'buy');
                    this.activeName = 'buy';
                } else {
                    // 卖出
                    this.getList(this.page, 'sell');
                    this.activeName = 'sell';
                }
            },
            cancelOrder(id) {
                this.$mts.postUrl({
                    url: 'api/applications/p2p/cancel',
                    data:{
                        id,
                    },
                    success: (res) => {
                        if(res.data.status === 200){
                            this.$toast('取消成功');
                            this.page = 1;
                            this.getList(1, 'sell');
                        } else {
                            this.$toast(res.data.message);
                        }
                    }
                });
            },
            closedBuyPopHandle() {
                this.secret = '';
                this.showOrederInfo = false;
            },
            accMul(arg1 = 0, arg2 = 0) {
                var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try {
                    m += s1.split(".")[1].length
                } catch (e) {
                }
                try {
                    m += s2.split(".")[1].length
                } catch (e) {
                }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .t-help {
        width: 100vw;
        height: 100vh;
        // background-color: #E4EEEF;
        // overflow-y: scroll;
        .list-item {
            margin: 5vw;
            padding: 3vw;
            box-sizing: border-box;
            border-radius: 5px;
            color: #fff;
            background: linear-gradient(-45deg, #23a6d5, #23d5ab);
            .head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .logo-icon {
                    width: 8vw;
                }
            }
            .secret-container {
                display: flex;
                align-items: center;
                margin-top: 2vw;
            }
            .content {
                margin-top: 2vw;
                display: flex;
                justify-content: space-between;
                &>div {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    span + span {
                        margin-top: 2vw;
                    }
                }
                .cancel-btn {
                    text-align: right;
                }
                .center {
                    span {
                        display: flex;
                        align-items: center;
                    }
                }
            }
            .copy-icon {
                width: 5vw;
                height: 5vw;
                margin-left: 2vw;
            }
        }
        .btn-container {
            width: 100vw;
            display: flex;
            justify-content: center;
            position: fixed;
            bottom: 5vw;
            .operat-btn {
                width: 39vw;
            }
            .operat-btn + .operat-btn {
                margin-left: 10vw;
            }
        }
        .buy-popup-container {
            width: 80vw;
            padding: 5vw;
            box-sizing: border-box;
            background-color: #fff;
            margin-top: 10vw;
            .token-container {
                // display: flex;
                // align-items: center;
                .sell-price {
                    color: #666;
                    margin-top: 2vw;
                    margin-left: 4.2vw;
                    display: block;
                }
                .btn-container2 {
                    text-align: right;
                }
                .input-box {
                    &::after {
                        border: 1px solid #ddd;
                    }
                }
                .order-info {
                    // margin-top: 2vw;
                    padding: 4vw;
                    font-size: 14px;
                    &>div {
                        display: flex;
                        justify-content: space-between;
                    }
                    span {
                        display: block;
                        color: #333;
                    }
                }
                .sure-container {
                    text-align: right;
                }
            }
        }
    }
</style>

<style lang="scss">
    .t-help {
        .van-tabs__content {
            height: 81vh;
            overflow-y: scroll;
        }
        .van-popup {
            border-radius: 2vw;
            background-color: #fff;
        }
        .van-pull-refresh__track {
            min-height: 150vw;
        }
    }
</style>
