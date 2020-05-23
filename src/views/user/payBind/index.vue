<template>
    <div class="pay-bind">
        <backbar back="user" />
        <van-form @submit="submit">
            <van-field
                v-model="userInfo.alipay"
                name="支付宝"
                label="支付宝"
                placeholder="输入支付宝账号"
            >
                <template slot="right-icon">
                    <img 
                        :src="require('@/assets/svg/aliPay.svg')" 
                        class="pay-icon"
                        alt=""
                    />
                </template>
            </van-field>
            <van-field
                v-model="userInfo.weixin"
                name="微信"
                label="微信"
                placeholder="输入微信账号"
            >
                <template slot="right-icon">
                    <img 
                        :src="require('@/assets/svg/wxPay.svg')" 
                        class="pay-icon"
                        alt=""
                    />
                </template>
            </van-field>
            <van-button 
                round 
                block 
                type="info" 
                native-type="submit"
                class="submit-btn"
            >
                提交
            </van-button>
        </van-form>
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'

    export default {
        name: 'PayBind',
        components: {
            backbar,
        },
        data() {
            return {
                // alipay: '',
                // weixin: '',
                userInfo: {
                    alipay: '',
                    weixin: '',
                },
            };
        },
        created() {
            this.getUserInfo();
        },
        methods: {
            // 查询用户信息
            getUserInfo() {
                this.$mts.posts({
                    url: 'api/otc/otc/getOtcInfo',
                    data:{},
                    success: (res) => {
                        if(res.data.status === 200){
                            if (res.data.data === null) {
                                // this.$toast({ type: 'fail', message: '请绑定支付方式' });
                                this.disabled = true;
                            } else {
                                this.userInfo = res.data.data;
                            }
                        }
                    }
                });
            },
            submit() {
                if(!this.userInfo.alipay && !this.userInfo.weixin) {
                    this.$toast('请输入支付宝账号或微信账号');
                    return;
                }
                if (this.userInfo.alipay) {
                    this.$mts.postUrl({
                        url: 'api/otc/otc/bindPay',
                        data:{
                            account: this.userInfo.alipay,
                            payWay: 'aliPay',
                        },
                        success: (res) => {
                            if(res.data.data.status == 200){
                                this.$toast('绑定成功');
                            } else {
                                this.$toast(res.data.data.data);
                            }
                            this.$router.push({
                                name: 'user',
                            });
                        }
                    });
                }
                if (this.userInfo.weixin) {
                    this.$mts.postUrl({
                        url: 'api/otc/otc/bindPay',
                        data:{
                            account: this.userInfo.weixin,
                            payWay: 'weixin',
                        },
                        success: (res) => {
                            if(res.data.data.status == 200){
                                this.$toast('绑定成功');
                            } else {
                                this.$toast(res.data.data.data);
                            }
                            this.$router.push({
                                name: 'user',
                            });
                        }
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .pay-bind {
        width: 100vw;
        overflow: hidden;
        .back {
            background-color: inherit;
        }
        .submit-btn {
            margin-top: 10vw;
        }
        .pay-icon {
            width: 6vw;
        }
    }
</style>

<style lang="scss">
    .pay-bind {
        .van-form {
            padding: 0 5vw;
        }
        .van-cell {
            background-color: #E4EEEF;
        }
        .van-cell:not(:last-child)::after {
            border-bottom: 1px solid #ccc;
        }
        .van-cell__title {
            display: flex;
            align-items: center;
        }
    }
</style>
