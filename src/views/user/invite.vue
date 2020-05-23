<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" class="normal" />
        </div>
        <div class="flexContent whiteBg">
            <div class="inviteWrapper">
                <div class="inviteTitle flexCenter"><span></span>上级<span></span></div>
                <div
                    class="superior"
                    v-if="inviter"
                >
                    <div>uid：{{ inviter.id || '--' }}</div>
                    <div>手机号：{{ inviter.tel_phone || '--' }}</div>
                    <div>email：{{ inviter.email || '--' }}</div>
                    <div>用户名：{{ inviter.username || '--' }}</div>
                </div>
                <div class="inviteTitle flexCenter"><span></span>我的二维码<span></span></div>
                <div class="inviteSide">
                    <div class="qrcodeImg" ref="imageWrapper">
                        <img class="real_pic" ref="image" :src="dataURL"
                            style="position: absolute;left:15px;right:0;width:92vw;;top:0;z-index:200" />
                        <slot>
                            <div class="downPic">
                                <div class="inviteBox">
                                    <div class="qrCodeBox">
                                        <div class="qrcode flexCenter">
                                            <qrcode :value="inviteUrl" tag="img" :options="{ width: 160 }"></qrcode>
                                        </div>
                                        <div class='save'>{{$t('user.invite.save')}}</div>
                                    </div>
                                </div>
                            </div>
                        </slot>
                    </div>
                    <div class="inviteTitle flexCenter"><span></span>{{$t('user.invite.myinvite')}}<span></span></div>
                    <div class="inviteList">
                        <div class="topOne">
                            <img src="@/assets/img/i2.png" alt="">
                            <div>
                                <span class="title">{{$t('user.invite.invitePeople')}}</span>
                                <span class="amount"><strong>{{inviteTotal}}</strong>{{$t('user.invite.person')}}</span>
                            </div>
                        </div>
                        <div class="topTwo">
                            <p class="noRecord flexCenter" v-if="!list || list.length == 0">
                                <span>{{$t('list.nodata')}}</span>
                            </p>
                            <ul v-else>
                                <!-- <van-pull-refresh v-model="submiting" @refresh="refresh"> -->
                                <van-list v-model="$store.state.app.loading" :finished="finished"
                                    :finished-text="$t('list.nomore')" @load="query" :offset="50">
                                    <li v-for="(item,index) in list" :key="index">
                                        <dl>
                                            <dt><img :src="item.icon" alt=""></dt>
                                            <dd>{{item.mobile ? item.mobile : item.email}}</dd>
                                            <dd 
                                                class="invite-tag"
                                                v-if="item.kyc === 'LV1_PASS'"
                                            >认证通过</dd>
                                        </dl>
                                    </li>
                                </van-list>
                                <!-- </van-pull-refresh> -->
                            </ul>
                        </div>
                    </div>
                    <!-- <div class="activityRules">
                        <div class="title flexCenter">
                            <img src="@/assets/img/s_dots.png" alt="">
                            <span>{{$t('user.invite.inviteRules')}}</span>
                            <img src="@/assets/img/s_dots.png" alt="">
                        </div>
                        <div class="content" v-html="$t('activity.i1')"></div>
                    </div> -->

                    <div class="moreFeatures">
                        <dl @click="$mts.copy(inviteCode)">
                            <dt>{{inviteCode}}</dt>
                            <dd>{{$t('user.invite.inviteCode')}}</dd>
                        </dl>
                        <dl @click="$mts.copy(inviteUrl)">
                            <dt><i class="iconfont iconlianjie"></i></dt>
                            <dd>{{$t('activity.shareLink')}}</dd>
                        </dl>
                        <!-- <dl @click="downLoad">
                            <dt><i class="iconfont icontupian"></i></dt>
                            <dd>{{$t('activity.saveImg')}}</dd>
                        </dl> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import backbar from "@/views/modules/back.vue"
    import html2canvas from "html2canvas"

    export default {
        data() {
            return {
                backUrl: {
                    url: this.$route.params.backUrl == 'home' ? 'home' : 'user',
                    leftText: '邀请',
                },
                inviteTotal: 0,
                invitePrize: 0,
                page: 0,
                limit: 10,
                submiting: false,
                dataURL: '',
                inviteUrl: '--',
                inviteCode: '',
                inviter: {},
            }
        },
        components: {
            backbar
        },
        computed: {
            list() {
                return this.$store.state.app.vanList;
            },
            finished() {
                return this.$store.state.app.finished;
            },
            vImg() {
                return localStorage.getItem('language') === 'en-US' ? true : false;
            }
        },
        mounted() {
            let that = this;
            if (that.$store.state.isLogin) {
                that.initPage();
            }
            that.$mts.checkExpire('needback', 'invite', () => {
                that.getInviteUrl();
            });

            setTimeout(() => {
                let that = this;
                that.toImage();
            }, 1000)
        },
        watch: {

        },
        methods: {
            initPage() {
                this.refresh();
                this.getAmount();
            },
            vUsdt(value) {
                let that = this;
                let rates = JSON.parse(localStorage.getItem('rates'));
                let price = rates['CNY'].price;
                return that.$mkt.fmtZero(value / price, 2);
            },
            refresh() {
                this.$mts.initPage();
                this.page = 0;
                this.$store.state.app.loading = true;
                this.submiting = false;
                this.query();
            },
            copy(value) {
                this.$mts.copy(value);
            },
            query() {
                let that = this;
                that.page += 1;
                that.$mts.posts({
                    url: 'api/me/referralRewards/inviteFriends',
                    data: {
                        page: that.page,
                        limit: that.limit
                    },
                    success(response) {
                        if (response.data.status == 200) {
                            that.inviteTotal = response.data.data.total;
                            that.submiting = false;
                            let arr = response.data.data.rows;
                            that.$mts.loading(arr, that.size);
                            // that.$store.state.app.loading = false;
                        }
                    },
                    error(error) {

                    }
                });
            },
            getAmount() {
                let that = this;
                that.$mts.posts({
                    url: "api/me/referralRewards/referralRewards",
                    data: {},
                    success(response) {
                        if (response.data.status == 200) {
                            that.invitePrize = !response.data.data ? 0 : response.data.data;
                        }
                    },
                    error(error) {

                    }
                });
            },
            goInvite() {
                let that = this;
                if (that.$store.state.isLogin) {
                    that.$router.push({
                        name: 'invitePage'
                    });
                } else {
                    that.$router.push({
                        name: 'signin',
                        query: {
                            path: 'invite'
                        }
                    });
                }
            },
            getInviteUrl() {
                let that = this;
                that.$mts.posts({
                    url: "api/me/referralRewards/getReferralCode",
                    data: {},
                    success(response) {
                        if (response.data.status == 200) {
                            that.inviteCode = response.data.data.invitationCode;
                            that.inviter = response.data.data.inviter;
                            that.inviteUrl = 'https://wap.huo-dun.com/signup.html?inviteCode=' + that.inviteCode;
                        }
                    }
                });
            },
            toImage() {
                html2canvas(this.$refs.imageWrapper, {
                    backgroundColor: null,
                    allowTaint: true
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.dataURL = dataURL;
                });
            },
            downLoad() {
                let that = this;
                setTimeout(() => {
                    if (that.dataURL) {
                        that.$mts.savePic(that.$refs.image);
                    }
                }, 1500);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .invite-tag {
        flex: 1;
        text-align: right;
    }

    @keyframes gradientBG {
        0% {
            background-position: 0% 50%;
        }

        50% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0% 50%;
        }
    }

    .flexContent {
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        .inviteTitle {
            margin: 8vw 0 2vw;
            font-size: 4.2667vw;
            color: #fff;
            font-weight: 500;

            span {
                width: 1.8667vw;
                height: 1.8667vw;
                border-radius: 50%;
                background: #FFA524;

                &:first-child {
                    margin-right: 2.6667vw;
                }

                &:last-child {
                    margin-left: 2.6667vw;
                }
            }
        }
    }

    .inviteWrapper {
        .superior {
            background-color: #fff;
            border-radius: 5px;
            margin: 5vw;
            box-sizing: border-box;
            padding: 5vw;
            margin-bottom: 0;
        }
        .topOne {
            display: flex;
            align-items: center;
            justify-content: center;

            &>div {
                display: flex;
                flex-direction: column;
                margin-left: 2vw;
            }

            .title {
                color: #AE7C66;
            }

            .amount {
                color: #FA6400;
            }

            img {
                width: 10vw;
            }
        }

        .inviteBox {
            margin-top: 6vw;

            .qrCodeBox {
                padding-bottom: 3vw;
            }
        }

        .save {
            text-align: center;
        }

        .moreFeatures {
            width: 100vw;
            height: 20vw;
            background: #fff;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 201;
            right: 0;
            display: flex;
            align-items: center;

            dl {
                width: 50vw;
                height: 20vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-right: 1px solid #f2f2f2;

                &:last-child {
                    border: none;
                }

                dt {
                    font-size: 5vw;
                    color: #0352D4;
                    font-weight: 500;
                    line-height: 6vw;

                    i {
                        font-size: 5vw;
                        color: #0352D4;
                    }
                }

                dd {
                    margin-top: 2.4vw;
                    line-height: 4.4vw;
                    font-size: 3.2vw;
                    color: #666;
                }
            }
        }
    }
</style>