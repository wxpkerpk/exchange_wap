<template>
    <!-- 收益明细 -->
    <div class="mining-income">
        <div class="back-container">
            <van-icon name="arrow-left" @click="$router.go(-1)" color="#333" size="20" class="back-icon" />
        </div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="list">
            <van-cell v-for="item in list" :key="item.id"
                :title="item.type === 'fire' ? '燃烧' : item.type === 'mining' ? '挖矿' : '返佣'"
                :value="item.amount || 0" :label="item.time || '2020-04-02 23:23:23'"
                :style="{ 'background': item.type === 'fire' ? bgColorList[0] : item.type === 'mining' ? bgColorList[2] : bgColorList[1] }" />
        </van-list>
    </div>
</template>

<script>
    export default {
        name: 'Income',
        data() {
            return {
                list: [1],
                page: 1,
                loading: false,
                finished: false,
                bgColorList: [
                    'linear-gradient(to right, #ee7752, #e73c7e)',
                    'linear-gradient(to right, #C3CFE9, #7089A8)',
                    'linear-gradient(to right, #53DFEC, #48D7AD)',
                ],
            };
        },
        created() {
            this.getMiningLog(1);
        },
        methods: {
            // 获取挖矿收益
            getMiningLog(page) {
                let that = this;
                this.$mts.postUrl({
                    url: 'api/activity/mining/queryMiningLog',
                    data: {
                        page,
                        size: 10,
                    },
                    success(res) {
                        if (res.data.status == 200) {
                            res.data.data.forEach(item => {
                                item.amount = that.toNonExponential(item.amount);
                            });
                            if (page === 1) {
                                that.list = res.data.data;
                            } else {
                                that.list = that.list.concat(res.data.data);
                            }
                            if (res.data.data.length < 10) that.finished = true;
                            // console.log(that.list)
                        }
                    }
                });
            },
            onLoad() {
                this.page++;
                this.getMiningLog(this.page);
                this.loading = false;
            },
            toNonExponential(num) {
                let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
                return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
            },
        }
    };
</script>

<style lang="scss" scoped>
    .mining-income {
        width: 100vw;
        min-height: 100vh;

        // background: linear-gradient(to bottom, rgb(15, 12, 41), rgb(48, 43, 99), rgb(36, 36, 62));
        .back-container {
            width: 100vw;
            padding: 2vw;
            position: fixed;
            top: 0;
            z-index: 1;
            background-color: #fff;
        }

        .list {
            box-sizing: border-box;
            padding-top: 10vw;
        }
    }
</style>

<style lang="scss">
    .mining-income {
        .van-cell {

            // &::after {
            //     border: none;
            // }
            // margin-bottom: 1vw;
            .van-cell__title,
            .van-cell__label,
            .van-cell__value {
                color: #333;
            }

            // &:nth-child(odd) {
            //     background-color: #7089A8;
            // }
            // &:nth-child(even) {
            //     background-color: #48D7AD;
            // }
        }
    }
</style>