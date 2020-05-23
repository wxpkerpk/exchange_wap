<template>
    <div>
        <header-title title="钱包资产">
            <span @click="$toast({ type: 'fail', message: '敬请期待' })">财务记录</span>
        </header-title>
        <div class="wallet-header">
            <div class="currency">
                <img :src="data.icon" alt="">
                <div class="currency-num">
                    <span>
                        <template>
                            <span v-if="index == 0">{{ $mkt.fmtNum(data.available + data.frozen, data.scale) }}</span>
                            <span v-else-if="index == 1">{{ $mkt.fmtNum(data.mining, data.scale) }}</span>
                            <span v-else>{{ $mkt.fmtNum(data.applyAmount, data.scale) }}</span>
                        </template>
                        <span> {{ data.coinCode }}</span>
                    </span>
                    <span>
                        ≈
                        <template>
                            <span v-if="index == 0">{{ $mkt.fmtNum((data.available + data.frozen) * $mkt.vPrice() * data.price, data.scale) }}</span>
                            <span v-else-if="index == 1">{{ $mkt.fmtNum(data.mining * $mkt.vPrice() * data.price, data.scale) }}</span>
                            <span v-else>{{ $mkt.fmtNum(data.applyAmount * $mkt.vPrice() * data.price, data.scale) }}</span>
                        </template>
                        {{ unit }}
                    </span>
                </div>
            </div>
            <div class="currency-detail">
                <div>
                    <span>可用资产</span>
                    <span v-if="index == 0">{{ $mkt.fmtNum(data.available, data.scale) }}</span>
                    <span v-else-if="index == 1">{{ $mkt.fmtNum(data.mining, data.scale) }}</span>
                    <span v-else>{{ $mkt.fmtNum(data.applyAmount, data.scale) }}</span>
                </div>
                <div v-if="isUse">
                    <span>冻结资产</span>
                    <span>{{ $mkt.fmtNum(data.frozen, data.scale) }}</span>
                </div>
            </div>
        </div>
        <div class="operate-container">
            <div @click="goDeposit">
                <img
                    v-if="allowDeposit"
                    src="@/assets/svg/deposit.svg"
                    alt=""
                    class="icon"
                />
                <img
                    v-else
                    src="@/assets/svg/deposit-disabled.svg"
                    alt=""
                    class="icon"
                />
                <label
                    :style="{ color: allowDeposit ? '#208D87' : '#999' }"
                >充币</label>
            </div>
            <div @click="goWithdrawal">
                <img
                    v-if="allowWithdraw"
                    src="@/assets/svg/withdrawal.svg"
                    alt=""
                    class="icon"
                />
                <img
                    v-else
                    src="@/assets/svg/withdrawal-disabled.svg"
                    alt=""
                    class="icon"
                />
                <label
                    :style="{ color: allowWithdraw ? '#208D87' : '#999' }"
                >提币</label>
            </div>
            <div @click="goTransfer">
                <img
                    src="@/assets/svg/transfer.svg"
                    alt=""
                    class="icon"
                />
                <label>划转</label>
            </div>
        </div>
        <!-- 提示去设置PIN -->
        <van-popup v-model="showToast" class="showMore">
            <div class="goModal dark">
                <h3>{{$t('message.public.systemTitle')}}</h3>
                <p>{{$t('message.safe.noFund')}}</p>
                <div class="btnBox flexLevel">
                    <span class="btn1" @click="showToast = false">{{$t('button.public.know')}}</span>
                    <span class="btn2" @click="$router.push({name: 'changeFundPsw',query:{path:'/withdrawal'}})">{{$t('button.user.setting')}}</span>
                </div>
            </div>
        </van-popup> 
        <!-- <div id="walletView"></div> -->
    </div>
</template>

<script>
    import HeaderTitle from '@/components/HeaderTitle';

    export default {
        name: 'wallet',
        components: {
            HeaderTitle
        },
        data() {
            return {
                data: JSON.parse(localStorage.getItem('walletData')),
                showToast: false,
                index: this.$route.query.index,
                isUse: this.$route.query.type,
                price: this.$store.state.app.rates.CNY.price,
                unit: this.$store.state.app.rates.CNY.unit,
            }
        },
        // created() {
        //     console.log(this.index)
        // },
        computed: {
            allowDeposit() {
                // 是否可以充值
                const arr = localStorage.getItem('coins') ? JSON.parse(localStorage.getItem('coins')).balance : [];
                for (const v in arr) {
                    if (arr[v].coinCode === this.data.coinCode) {
                        return arr[v].allowDeposit;
                    }
                }
            },
            allowWithdraw() {
                // 是否可以提现
                const arr = localStorage.getItem('coins') ? JSON.parse(localStorage.getItem('coins')).balance : [];
                for (const v in arr) {
                    if (arr[v].coinCode === this.data.coinCode) {
                        return arr[v].allowWithdraw;
                    }
                }
            }
        },
        activated() {
            this.data = JSON.parse(localStorage.getItem('walletData')),
            this.showToast = false,
            this.index = this.$route.query.index,
            this.isUse = this.$route.query.type,
            this.price = this.$store.state.app.rates.CNY.price,
            this.unit = this.$store.state.app.rates.CNY.unit,
            this.$mts.checkExpire('needback','deposit',()=>{
                if (this.$store.state.isLogin && !localStorage.getItem('coins')) {
                    this.$mts.getCoins();
                }
            });
        },
        // mounted() {
        //     this.$mts.checkExpire('needback','deposit',()=>{
        //         if (this.$store.state.isLogin && !localStorage.getItem('coins')) {
        //             this.$mts.getCoins();
        //         }
        //     });
        // },
        methods: {
            goDeposit() {
                // 充值
                if (this.allowDeposit) {
                    this.$store.state.app.coinCode = this.data.coinCode;
                    this.$router.push({
                        name:'deposit',
                        // params: {
                        //     coinCode: this.data.coinCode
                        // }
                    });
                }
            },
            goWithdrawal(){
                // 提现
                if (this.allowWithdraw) {
                    const flag = JSON.parse(localStorage.getItem('setFundPsw'));
                    if (flag) {
                        this.$store.state.app.coinCode = this.data.coinCode;
                        this.$router.push({
                            name:'withdrawal',
                        });
                    } else {
                        this.showToast = true;
                    }
                }
            },
            goTransfer() {
                this.$router.push({
                    name:'transfer',
                    params: {
                        coinCode: this.data.coinCode
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wallet-header {
        width: 90vw;
        margin: 5vw;
        background-color: #039A91; 
        border-radius: 5px;
        padding: 7vw;
        box-sizing: border-box;
        .currency {
            display: flex;
            align-items: center;
            img {
                width: 10vw;
                border-radius: 100%;
                margin-right: 10px;
            }
            &-num {
                display: flex;
                flex-direction: column;
                color: #fff;
                &>span:first-child {
                    font-size: 5vw;
                    span {
                        font-size: 3.2vw;
                    }
                }
                &>span:last-child {
                    font-size: 3.2vw;
                }
            }
        }
        .currency-detail {
            color: #fff;
            font-size: 3.2vw;
            padding: 0 12.5vw;
            margin-top: 5vw;
            &>div {
                display: flex;
                justify-content: space-between;
            }
        }
    }
    .operate-container {
        display: flex;
        justify-content: space-between;
        &>div {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #208D87;
            padding: 2vw 10vw;
            .icon {
                width: 7vw;
                height: 7vw;
                border-radius: 100%;
            }
        }
    }
    #walletView {
        width: 90vw;
        height: 82vw;
        overflow: hidden;
        margin: auto;
    }
</style>
