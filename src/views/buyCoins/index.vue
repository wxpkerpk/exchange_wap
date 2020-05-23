<template>
    <div class="buy-coins">
        <backbar :back="{ url: 'home' }" >
            <div
                class="order"
                @click="toOrder"
            >订单</div>
        </backbar>
        <!-- <div class="title">
            <div class="switch-container">
                <span 
                    class="active"
                    @click="switchBtn('buy')"
                >我要买</span>
                <span @click="switchBtn('sale')">我要卖</span>
            </div>
            <div
                class="order"
                @click="toOrder"
            >订单</div>
        </div>
        <div class="main">
            <div class="coins-tips">币种</div>
            <div class="coins-type">USDT</div>
            <div class="coins-tips">购买个数</div>
            <van-cell-group>
                <van-field 
                    v-model="number" 
                    placeholder="10个起" 
                    label-width="30"
                    type="digit"
                />
            </van-cell-group>
            <div class="exchangeRate-container">
                <span>单价约{{ exchangeRate }}CNY/USDT</span>
            </div>
            <van-button
                block 
                class="buy-btn"
                @click="buy"
                :disabled="disabled"
            >买入</van-button>
        </div> -->
        <van-tabs v-model="active">
            <van-tab title="买入">
                <div
                    class="list-item"
                    v-for="(item, index) in buyList" 
                    :key="index"
                >
                    <div class="title">{{ item.name }}</div>
                    <van-divider :style="{  margin: '10px 0' }"/>
                    <div class="body">
                        <span>买入价格：{{ item.sellPrice }}￥</span>
                        <van-button
                            class="buy-btn"
                            @click="clickHanlde('buy', item.sellPrice, item.userId)"
                            size="small"
                            round
                            :style="{ backgroundColor: '#1DD063' }"
                            v-if="userInfo.userType !== 'merchant'"
                        >买入</van-button>
                    </div>
                </div>
            </van-tab>
            <van-tab title="卖出">
                <div
                    class="list-item"
                    v-for="(item, index) in sellList" 
                    :key="index"
                >
                    <div class="title">{{ item.name }}</div>
                    <van-divider :style="{  margin: '10px 0' }"/>
                    <div class="body">
                        <span>卖出价格：{{ item.buyPrice }}￥</span>
                        <van-button
                            class="buy-btn"
                            @click="clickHanlde('sell', item.buyPrice, item.userId)"
                            size="small"
                            round
                            :style="{ backgroundColor: '#F94E65' }"
                            v-if="userInfo.userType !== 'merchant'"
                        >卖出</van-button>
                    </div>
                </div>
            </van-tab>
        </van-tabs>

        <van-popup v-model="show" closeable>
            <div class="buy-popup-container">
                <div class="token-container">
                    <van-cell-group class="input-box">
                        <van-field v-model="showNum" placeholder="请输入数量" ></van-field>
                    </van-cell-group>
                    <span class="sell-price">价格：{{ showPrice }} ￥</span>
                    <span class="sell-price">总价：{{ showTotalPrice }} ￥</span>
                    <div class="btn-container2">
                        <van-button 
                            type="info"
                            size="small"
                            @click="sureHandle()"
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
    import backbar from '@/views/modules/back.vue';

    export default {
        name: 'BugCoins',
        components: {
            backbar,
        },
        data() {
            return {
                number: null,
                exchangeRate: 0,
                userInfo: {},
                disabled: false,

                active: 0,
                buyList: [],
                sellList: [],
                show: false,
                type: 'sell',
                showPrice: 0,
                showNum: '',
            };
        },
        computed: {
            showTotalPrice() {
                return this.accMul(this.showPrice, this.showNum);
            }
        },
        created() {
            this.getPrice();
            this.getUserInfo();
        },
        methods: {
            sureHandle() {
                if (!this.showNum) {
                    this.$toast('请输入购买数量');
                    return;
                }
                if (this.showNum < 10) {
                    this.$toast('最少购买10个');
                    return;
                }
                this.$router.push({
                    name: 'payWay',
                    query: {
                        type: this.type,
                        number: this.showNum,
                        aliPay: this.userInfo.alipay,
                        wxPay: this.userInfo.weixin,
                        exchangeRate: this.showPrice,
                        merchantId: this.merchantId,
                    }
                });
            },
            getList(userInfo) {
                this.$mts.posts({
                    url: 'api/otc/otc/getMerchant',
                    data:{},
                    success: (res) => {
                        if(res.data.status === 200){
                            if (res.data.data === null) {
                                // this.$toast({ type: 'fail', message: '请绑定支付方式' });
                                // this.disabled = true;
                            } else {
                                const data = res.data.data.filter(v => {
                                    return v.isOnline;
                                });
                                if (userInfo.userType !== 'merchant') {
                                    // 普通用户
                                    this.buyList = data.filter(v => {
                                        return v.allowSell;
                                    });
                                    this.sellList = data.filter(v => {
                                        return v.allowBuy;
                                    });
                                } else {
                                    // 商户
                                    this.buyList = data.filter(v => {
                                        return v.allowSell;
                                    });
                                    this.sellList = data.filter(v => {
                                        return v.allowBuy;
                                    });
                                }
                            }
                        }
                    }
                });
            },
            // 查询用户信息
            getUserInfo() {
                this.$mts.posts({
                    url: 'api/otc/otc/getOtcInfo',
                    data:{},
                    success: (res) => {
                        if(res.data.status === 200){
                            if (res.data.data === null) {
                                this.$toast({ type: 'fail', message: '请绑定支付方式' });
                                this.disabled = true;
                            } else {
                                this.userInfo = res.data.data;
                                this.$store.state.app.userinfo = res.data.data;
                                this.getList(res.data.data);
                            }
                        }
                    }
                });
            },
            // 获取usdt价格
            getPrice() {
                this.$mts.posts({
                    url: 'api/otc/otc/getOtcPrice',
                    data:{},
                    success: (res) => {
                        if(res.data.status === 200){
                            this.exchangeRate = res.data.data;
                        } else if (res.data.status === 201) {
                            this.$toast(res.data.data);
                        }
                    }
                });
            },
            clickHanlde(type, price, merchantId) {
                this.type = type;
                this.show = true;
                this.showPrice = price;
                this.merchantId = merchantId;
            },
            toOrder() {
                this.$router.push({
                    name: 'coinsOrder',
                });
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
    };
</script>

<style lang="scss" scoped>
    .buy-coins {
        width: 100vw;
        .back {
            background-color: inherit;
        }
        .list-item {
            margin: 5vw;
            padding: 3vw;
            box-sizing: border-box;
            border-radius: 5px;
            color: #333;
            background-color: #fff;
            .body {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .buy-btn {
                color: #fff;
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
    .buy-coins {
        .van-popup {
            border-radius: 2vw;
            background-color: #fff;
        }
        .van-pull-refresh__track {
            min-height: 150vw;
        }
    }
</style>
