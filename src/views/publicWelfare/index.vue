<template>
    <div>
        <div class="public-welfare-home">
            <div class="header">
                <van-icon
                    name="arrow-left"
                    @click="$router.go(-1)"
                    color="#fff"
                    size="20"
                    class="back-icon"
                />
                <span>公益奖金池</span>
            </div>
            <div :class="['money-container', showMenu && 'menu-show']">
                <span class="money" v-if="info.amount">
                    {{ info.amount }}<span>USDT(第{{ Phase }}期)</span>
                </span>
                <span class="money-nodata" v-else>
                    暂无数据
                </span>
            </div>
            <div :class="['main', showMenu && 'main-show']">
                <div class="swicth-container">
                    <van-icon
                        :name="arrowName"
                        color="#fff"
                        size="30"
                        @click="switchHandle"
                    />
                </div>
                <div
                    class="list"
                    v-if="list.length"
                >
                    <div
                        class="list-item"
                        v-for="(item, index) in list"
                        :key="index"
                        @click="jump(item.url)"
                    >
                        <div class="des">{{ item.title }}</div>
                        <van-button
                            type="default"
                            size="small"
                            round
                            :color="item.liked ? 'linear-gradient(to right, #f29c54, #DB4367)' : ''"
                            @click.stop="like(item.id, index, item.liked)"
                        >
                            点赞
                            {{ item.supports }}
                        </van-button>
                    </div>
                    <div
                        v-if="list.length < 3"
                        class="bottom-line"
                    ></div>
                </div>
                <div 
                    class="blank"
                    v-else
                >暂无数据</div>
                <div class="swiper-box">
                    <swiper
                        :options="swiperOption"
                        ref="mySwiper"
                    >
                        <swiper-slide v-for="(item, index) in swiperListPage" :key="index">
                            <div class="period-container">
                                <div
                                    class="period"
                                    @click="clickPeriodHandle(swiperList[item])"
                                >{{ swiperList[item] }}期</div>
                                <div
                                    v-if="swiperList[item + 1]"
                                    class="period"
                                    @click="clickPeriodHandle(swiperList[item + 1])"
                                >{{ swiperList[item + 1] }}期</div>
                                <div
                                    v-if="swiperList[item + 1]"
                                    class="period"
                                    @click="clickPeriodHandle(swiperList[item + 2])"
                                >{{ swiperList[item + 2] }}期</div>
                            </div>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                    <div class="swiper-button-next swiper-button-white"></div>
                    <div class="swiper-button-prev swiper-button-white"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    // require styles
    import 'swiper/dist/css/swiper.css';

    export default {
        name: 'PublicWelfare',
        components:{
            swiper,
            swiperSlide,
        },
        data() {
            return {
                showMenu: false,
                swiperList: [],
                swiperListPage: [],
                list: [],
                swiperOption: {
                    // loop: true,
                    // slidesPerView: 1.1,
                    // centeredSlides: true,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                    },
                },
                // loading: false,
                // finished: false,
                startX: 0,
                startY: 0,
                info: {},
                userId : this.$mts.getUserValue('sysUserID') || '',
                Phase: 0,
            };
        },
        computed: {
            arrowName() {
                return this.showMenu ? 'arrow-down' : 'arrow-up';
            },
            isLogin(){
                return this.$store.state.isLogin;
            },
        },
        created() {
            this.getInfo();
        },
        mounted() {
            window.addEventListener('touchstart', this.handleTouchEvent);
            window.addEventListener('touchend', this.handleTouchEvent);
        },
        beforeDestroy () {
//             window.removeEventListener('scroll', this.scroll);    //离开页面时移除
        },
        methods: {
            // 获取公益信息
            getInfo() {
                let that = this;
                this.$mts.posts({
                    url: 'api/activity/charity/queryStage',
                    data:{},
                    success(res){
                        if(res.data.status == 200){
                            that.info = res.data.data;
                            that.Phase = that.info.num;
                            // 处理底部滑块显示
                            for (let i = 1; i <= that.info.num; i++) {
                                that.swiperList[that.info.num - i] = i;
                            }
                            for (let i = 0, j = 0; i < that.info.num / 3; i++, j++) {
                                i = i * 3;
                                that.swiperListPage[j] = i;
                            }
                            that.getPWList(that.info.num);
                            // console.log(that.swiperList, that.swiperListPage)
                        }
                    }
                });
            },
            // 获取公益列表
            getPWList(num) {
                let that = this;
                this.$mts.get({
                    url: 'api/activity/charity/queryRows',
                    data:{
                        num,
                        userId: this.userId,
                    },
                    success(res){
                        if(res.data.status == 200){
                            that.list = res.data.data;
                            // console.log(that.list)
                        }
                    }
                });
            },
            // 点赞公益
            like(rowId, index, isLiked) {
                let that = this;
                if (isLiked) {
                    that.$toast({ type: 'fail', message: '已点赞' });
                    return;
                };
                if (!that.isLogin) {
                    that.$router.push({name: 'signin'});
                    return;
                }
                this.$mts.postUrl({
                    url: 'api/activity/charity/support',
                    data:{
                        rowId
                    },
                    success(res){
                        if(res.data.status == 200){
                            that.$toast({ type: 'success', message: '点赞成功' });
                            that.list[index].liked = true;
                            that.list[index].supports++;
                        } else if (res.data.status === 901) {
                            // 不能重复点赞
                            that.$toast({ type: 'fail', message: '已点赞' });
                        }
                    }
                });
            },
            // 跳转
            jump(url) {
                this.$router.push({
                    name: 'publicWelfareDetail',
                    params: {
                        url,
                    },
                })
            },
            handleTouchEvent(event) {
                switch (event.type){
                    case "touchstart":
                        this.startX = event.touches[0].pageX;
                        this.startY = event.touches[0].pageY;
                        break;
                    case "touchend":
                        var spanX = event.changedTouches[0].pageX - this.startX;
                        var spanY = event.changedTouches[0].pageY - this.startY;
                        if(Math.abs(spanX) > Math.abs(spanY)){      //认定为水平方向滑动
                            if(spanX > 30){         //向右
                            
                            } else if(spanX < -30){ //向左
                            
                            }
                        } else {                                    //认定为垂直方向滑动
                            if(spanY > 30){         //向下
                                // console.log(2)
                            } else if (spanY < -30) {//向上
                                this.showMenu = true;
                            }
                        }

                        break;
                    case "touchmove":
                        //阻止默认行为
                        if(isPreventDefault)
                            event.preventDefault();
                        break;
                }
            },
            switchHandle() {
                this.showMenu = !this.showMenu;
            },
            // 点击底部期数
            clickPeriodHandle(index) {
                this.getPWList(index);
                this.Phase = index;
            },
        },
    };
</script>

<style lang="scss" scoped>
    .public-welfare-home {
        width: 100vw;
        height: 100vh;
        position: relative;
        background: linear-gradient(135deg, #53DFEC -20%, #48D7AD 120%);
        overflow: hidden;
        color: #fff;
        .header {
            padding: 4vw;
            display: flex;
            align-items: center;
            justify-content: center;
            .back-icon {
                position: absolute;
                left: 4vw;
            }
            span {
                font-size: 7vw;
                font-family: 'Microsoft Yahei';
            }
        }
        .money-container {
            position: absolute;
            width: 100vw;
            top: 42%;
            text-align: center;
            transition: 0.75s ease-in-out;
            // transform: translateZ(0);
            .money {
                font-size: 20vw;
                font-weight: 700;
                span {
                    font-size: 6vw;
                    font-weight: 500;
                }
            }
            .money-nodata {
                font-size: 15vw;
            }
        }
        .main {
            width: 100vw;
            position: absolute;
            bottom: 0;
            transition: all 0.75s ease-in-out;
            transform: translateY(100%) translateZ(0);
            // border-top: 1px solid #000;
            background: rgba(255, 255, 255, 0.15);
            .swicth-container {
                position: absolute;
                top: -9vw;
                width: 100vw;
                text-align: center;
            }
            .list {
                height: calc(100vh - 98vw);
                overflow-y: scroll;
                margin-bottom: 49vw;
                .list-item{
                    height: 33%;
                    padding: 5vw;
                    box-sizing: border-box;
                    background-color: inherit;
                    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    &::after {
                        border: none;
                    }
                    .des {
                        font-size: 5vw;
                    }
                }
                .bottom-line {
                    height: 1px;
                    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }
            }
            .blank {
                height: calc(100vh - 98vw);
                margin-bottom: 49vw;
                text-align: center;
                padding-top: 20vw;
                box-sizing: border-box;
                // box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            .swiper-box {
                width: 100vw;
                height: 50vw;
                position: absolute;
                bottom: 0;
                box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                .period-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    .period {
                        font-size: 5vw;
                        width: 33%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .swiper-slide {
                    display: flex;
                    align-items: center;
                }
                .swiper-slide-active,.swiper-slide-duplicate-active{
                    transform: scale(1) translateZ(0);
                }
            }
        }
        .menu-show {
            transform: translateX(-20vw) scale(0.7) translateZ(0);
            top: 18vw;
        }
        .main-show {
            transform: translateY(0) translateZ(0);
            // bottom: 0;
        }
    }
</style>

<style lang="scss">
    .public-welfare-home {
        .van-list {
            height: 100%;
        }
        .swiper-container {
            height: 100%;
        }
        .swiper-pagination-bullet {
            background-color: #fff;
            width: 6px;
            height: 6px;
        }
        .swiper-pagination-bullet-active {
            // background-color: #999;
            transform: scale(1.8) translateZ(0);
        }
    }
</style>
