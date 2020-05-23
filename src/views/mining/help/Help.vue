<template>
    <!-- 帮助中心 -->
    <div class="mining-help">
        <div class="back-container">
            <van-icon name="arrow-left" @click="$router.go(-1)" color="#fff" size="20" />
        </div>
        <div class="tipsIcon">
            <van-icon name="arrow-down" color="#fff" size="30" @click="scrollBtn"/>
        </div>
        <div
            class="page-container"
            v-fullpage="opts"
            ref="fullPage"
        >
            <div class="page page-1">
                <p class="part" v-animate="{value: 'afdeIn'}">
                    火盾生态节点矿机介绍：<br>
                        新用户注册并且实名认证，可以免费获得体验节点一台，（限时限量赠送）算力0MH/s，租期365天，总产能100枚：8枚基础、92枚做任务解锁（每天公益签到解锁92÷365≈0.25）
                        青铜节点：租金10枚T盾，算力+1MH/s，租期30天，总产量13枚T盾，每天产出0.43个T盾，每人限购2台，到期不可续租，收益率达 30.00%；
                        白银节点：租金50枚T盾，算力+5MH/s，租期40天，总产量77.5枚T盾，每天产出1.9个T盾，每人限购3台，到期可续租，收益率达 55.00%；
                        翡翠节点：租金300枚T盾，算力+30MH/s，租期60天，总产量450枚T盾，每天产出个7.5个T盾，每人限购2台，到期可续租，收益率达 50.00%；
                        黄金节点：租金800枚T盾，算力+80MH/s，租期80天，总产量1168枚T盾，每天产出14.6个T盾,每人限购2台，到期可续租，收益率达46.00%；
                        白金节点：租金1500枚T盾，算力+150MH/s，租期100天，总产量2138枚T盾，每天产出21.3个T盾，全网算力达标后开放，到期可续租，收益率达42 %；
                        钻石节点：租金3000枚T盾，算力+300MH/s，租期120天，总产量4200枚T盾，每天产出35个T盾，全网算力达标后开放，到期可以续租，收益率达 40%<br>
                        注：节点矿机限购台数
                        青铜节点2台，白银节点3台，翡翠节点2台，
                        黄金节点2台，白金节点未开放，钻石节点未开放。
                </p>
            </div>
            <div class="page page-2">
                 <p class="part" v-animate="{value: 'afdeIn'}">
                        邀请关系
                        直推收益三代奖励，分别是百分之三，百分之二，百分之一，严格控制泡沫，必须直推完成领取才会奖励上级代币奖励。
                        你所邀请的每个人在交易其他币种时同时享有三代交易所奖励，不只是节点奖励还有交易所返佣。<br><br>
                     火盾生态推广奖励介绍：
                    1、零撸收益：只要直推下级开节点（有算力），就可以拿到租金的4%奖励，实时到账；第一代每日节点产出的3%奖励，第二代每日节点产出的2%奖励，第三代每日节点产出的1%奖励，以上零撸收益合计超过10%。
                    2、个人等级（社区等级）升级：
                    升级闪耀矿工：需要直推10人实名，直推5人开节点，直推的总算力达到100MH/s，额外奖励青铜节点一台（收益13枚T盾）；
                    （如果你已经成为闪耀矿工，并且能够带领你的团队，在 3代 内合计推广超过 15 个人激活开矿，那你可以继续往下看团队等级升级以后的额外奖励）
                    升级闪耀公益社区：需要 3代 团队总实名30人、
                    有15个人开节点，且团队总算力达到1000MH/s，额外奖励翡翠节点一台（收益450枚T盾），享受全网USDT手续费分红百分之30%
                 </p>
            </div>
            <div class="page page-3">
                 <p class="part" v-animate="{value: 'afdeIn'}">

                    升级星耀矿工：需要直推20人实名，直推10人开节点，直推的总算力达到600MH/s，额外奖励白银节点一台（收益77.5枚T盾）；
                    升级星耀公益社区：直推中培养3个闪耀社区，且团队总算力达到4000MH/s，额外奖励黄金节点一台（收益1168枚T盾），享受全网USDT手续费分红百分之20%

                    升级荣耀矿工：需要直推60人实名，直推30人开节点，直推的总算力达到1500MH/s，额外奖励翡翠节点一台（收益450枚T盾）；
                    升级荣耀公益社区：直推中培养3个星耀社区，且团队总算力达到12000MH/s，额外奖励白金节点一台（收益2138枚T盾），享受全网USDT手续费分红百分之15%

                    升级灼耀矿工：需要直推100人实名，直推60人开节点，直推的总算力达到4000MH/s，额外黄金节点一台（收益1168枚T盾）；
                    升级灼耀公益社区：直推中培养3个荣耀社区，且团队，力达到40000MH/s，额外奖励钻石节点一台（收益4200枚T盾），享受全网USDT手续费分红百分之10%<br><br>
                    烧伤制度
                    上级个人算力只有大于下级，才可以得到下级
                    所带来的分红奖励。
                 </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Help',
        data() {
            return {
                opts: {
                    start: 0,
                    dir: 'v',
                    duration: 500,
                }
            };
        },
        methods: {
            scrollBtn() {
                this.$refs.fullPage
            },
        }
    };
</script>

<style lang="scss" scoped>
    .mining-help {
        width: 100vw;
        height: 100vh;
        .back-container {
            width: 100vw;
            padding: 2vw;
            position: absolute;
            top: 0;
            background-color: inherit;
            z-index: 1;
        }
        .tipsIcon {
            width: 100vw;
            position: absolute;
            bottom: 5vw;
            z-index: 1;
            text-align: center;
        }
        .page-container {
            .page {
                overflow-y: scroll;
            }
            .page-1 {
                background-image: linear-gradient(10deg,#66a6b8 20%, #5471B9 80%);
            }
            .page-2 {
                background-image: linear-gradient(45deg,#f29c54 0%, #DB4367 100%);
            }
            .page-3 {
                background-image: linear-gradient(135deg,#23af56 0%, #67A79A 100%);
            }
            .part {
                padding: 4vw;
                font-size: 4vw;
                line-height: 7vw;
                margin-top: 7vw;
                color: #fff;
            }
        }
    }
</style>
