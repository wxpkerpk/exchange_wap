<template>
    <div class="pay-way">
        <backbar back="bugCoins" />
        <van-cell
            is-link 
            @click="show = !show"
        >{{ payWayCN }}</van-cell>
        <div class="content">
            <van-cell-group>
                <van-cell :title="type === 'buy' ? '购买数量：' : '卖出数量：'" :value="`${number} 个`" />
                <van-cell :title="type === 'buy' ? '购买单价：' : '卖出单价：'" :value="`${exchangeRate} CNY/USDT`" />
                <van-cell :title="type === 'buy' ? '购买总价：' : '卖出总价：'" :value="`${accMul(number, exchangeRate)} CNY`" />
            </van-cell-group>
        </div>
        <van-popup
            v-model="show"
            position="bottom"
            class="popup"
        >
            <van-cell-group>
                <van-cell 
                    v-if="aliPay"
                    title="支付宝支付"
                    @click="choosePayWay('ali')"
                >
                    <template slot="default">
                        <img
                            :src="require('@/assets/svg/aliPay.svg')"
                            class="pay-icon"
                            alt=""
                        />
                    </template>
                </van-cell>
                <van-cell 
                    v-if="wxPay"
                    @click="choosePayWay('wx')"
                    title="微信支付"
                >
                    <template slot="default">
                        <img 
                            :src="require('@/assets/svg/wxPay.svg')" 
                            class="pay-icon"
                            alt=""
                        />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-popup>
        <van-button
            block
            type="info"
            class="btn"
            @click="clickHandle"
        >
            {{ type === 'buy' ? '支付' : '确认' }}
        </van-button>
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'

    export default {
        name: 'payWay',
        components: {
            backbar,
        },
        data() {
            return {
                show: true,
                payWayCN: '选择支付方式',
                payWay: '',
                type: this.$route.query.type,
                number: this.$route.query.number,
                aliPay: this.$route.query.aliPay,
                wxPay: this.$route.query.wxPay,
                exchangeRate: this.$route.query.exchangeRate,
                merchantId: this.$route.query.merchantId,
            };
        },
        methods: {
            clickHandle() {
                if (!this.payWay) {
                    this.$toast('请选择支付方式');
                    return;
                }
                if (this.$route.query.type === 'buy') {
                    // 购买
                    this.$mts.postUrl({
                        url: 'api/otc/otc/userBuy',
                        data:{
                            number: this.number,
                            payWay: this.payWay,
                            merchantId: this.merchantId,
                        },
                        success: (res) => {
                            if(res.data.data.status === 200){
                                this.$toast('支付成功！');
                                this.$router.push({
                                    name: 'coinsOrder',
                                });
                            } else if (res.data.data.status === 201) {
                                this.$toast(res.data.data.data);
                            }
                        }
                    });
                } else {
                    // 卖出
                    this.$mts.postUrl({
                        url: 'api/otc/otc/userSell',
                        data:{
                            number: this.number,
                            payWay: this.payWay,
                            merchantId: this.merchantId,
                        },
                        success: (res) => {
                            if(res.data.data.status === 200){
                                this.$toast('支付成功！');
                                this.$router.push({
                                    name: 'coinsOrder',
                                });
                            } else {
                                this.$toast(res.data.data.data);
                            }
                        }
                    });
                }
            },
            choosePayWay(type) {
                if (type === 'ali') {
                    this.payWay = 'aliPay';
                    this.payWayCN = '支付宝支付';
                } else {
                    this.payWay = 'weixin';
                    this.payWayCN = '微信支付';
                }
                this.show = false;
            },
            accMul(arg1, arg2) {
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
        }
    }
</script>

<style lang="scss" scoped>
    .pay-way {
        width: 100vw;
        height: 100vh;
        .back {
            background-color: inherit;
        }
        .btn {
            position: absolute;
            bottom: 0;
        }
        .pay-icon {
            width: 6vw;
        }
        .content {
            // padding: 5vw;
            // margin: 5vw;
            margin-top: 5vw;
            border-radius: 5px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
        }
    }
</style>

<style lang="scss">
    .pay-way {
        .popup, .content {
            .van-cell:not(:last-child)::after {
                border-bottom: 1px solid #ccc;
            }
        }
        .van-cell__title {
            display: flex;
            align-items: center;
        }
    }
</style>
