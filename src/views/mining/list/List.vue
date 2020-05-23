<template>
    <!-- 节点列表 -->
    <div class="mining-list">
        <div class="back-container">
            <van-icon
                name="arrow-left"
                @click="$router.go(-1)"
                color="#fff"
                size="20"
            />
        </div>
        <div class="main">
            <swiper :options="swiperOption" ref="mySwiper" class="blog-slider">
                <swiper-slide v-for="(item,index) of nodeList" :key="index" class="blog-slider__item">
                    <div class="blog-slider__img">
                        <img :src="require(`@/assets/img/node-list-icon${item.level}.gif`)" alt="" class="icon" />
                    </div>
                    <div class="blog-slider__content">
                        <div class="blog-slider__title">{{ item.name }}</div>
                        <div class="blog-slider__text">{{ item.introduction }}</div>
                        <div class="btn-container">
                            <van-button 
                                type="default"
                                round size="large"
                                color="linear-gradient(to right, #1F7076, #46A7AD)"
                                @click="buy(item.id)"
                            >购买</van-button>
                        </div>
                    </div>
                </swiper-slide>
                <div class="swiper-pagination blog-slider__pagination" slot="pagination"></div>
            </swiper>
        </div>
    </div>
</template>

<script>
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper';
    // require styles
    import 'swiper/dist/css/swiper.css';

    export default {
        name: 'List',
        components: {
            swiper,
            swiperSlide,
        },
        data() {
            return {
                swiperOption: {
                    spaceBetween: 30,
                    effect: 'fade',
                    loop: true,
                    mousewheel: {
                        invert: false,
                    },
                    // autoHeight: true,
                    pagination: {
                        el: '.blog-slider__pagination',
                        // clickable: true,
                    }
                },
                nodeList: JSON.parse(localStorage.getItem('nodeList')),
            };
        },
        methods: {
            // 购买节点
            buy(pointId) {
                let that = this;
                this.$mts.postUrl({
                    url: 'api/activity/mining/buyPoint',
                    data:{
                        pointId,
                    },
                    success(res){
                        /**
                         * 200 - 购买成功
                         * 700 - 超过购买限制
                         * 800 - 余额不足
                         */
                        if(res.data.status === 200){
                            that.$toast({ type: 'success', message: '购买成功' });
                        } else if (res.data.status === 700) {
                            that.$toast({ type: 'fail', message: '超过购买限制' });
                        } else if (res.data.status === 800) {
                            that.$toast({ type: 'fail', message: '余额不足' });
                        }
                    }
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .swiper-container {
        overflow: visible;
    }

    .mining-list {
        overflow: hidden;
        background: linear-gradient(to bottom, #25DEFF, #000);
        width: 100vw;
        min-height: 100vh;
        .main {
            display: flex;
            height: calc(100vh - 7vh);
            overflow: hidden;
        }
        .back-container {
            padding: 4vw;
        }
        .blog-slider {
            width: 90vw;
            position: relative;
            max-width: 800px;
            margin: 40vw auto;
            background: #fff;
            box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
            padding: 25px;
            border-radius: 25px;
            height: 133vw;
            transition: all .3s;

            .blog-slider__item {
                display: flex;
                align-items: center;
                flex-direction: column;

                .blog-slider__img {
                    width: 90%;
                    flex-shrink: 0;
                    height: 80vw;
                    background-image: linear-gradient(147deg, #fe8a39 0%, #fd3838 74%);
                    box-shadow: 4px 13px 30px 1px rgba(252, 56, 56, 0.2);
                    border-radius: 20px;
                    transform: translateY(-50%);
                    overflow: hidden;

                    &:after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: linear-gradient(147deg, #25DEFF, #000);
                        border-radius: 20px;
                        opacity: 0.8;
                    }

                    & img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                        /* opacity: 0; */
                        border-radius: 20px;
                        transition: all .3s;
                    }
                }

                .blog-slider__content {
                    margin-top: -80px;
                    text-align: center;
                    padding: 0 30px;

                    &>* {
                        opacity: 0;
                        transform: translateY(25px);
                        transition: all .4s;
                    }

                    .blog-slider__title {
                        font-size: 24px;
                        font-weight: 700;
                        color: #0d0925;
                        margin-bottom: 20px;
                    }

                    .blog-slider__text {
                        color: #4e4a67;
                        margin-bottom: 30px;
                        line-height: 1.5em;
                    }
                }
            }

            .blog-slider__pagination {
                position: absolute;
                right: 20px;
                text-align: center;
                bottom: auto !important;
                transform: translateX(-50%);
                left: 50% !important;
                top: 205px;
                width: 100% !important;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .blog-slider__pagination .swiper-pagination-bullet {
                width: 11px;
                height: 11px;
                display: block;
                border-radius: 10px;
                background: #062744;
                opacity: 0.2;
                transition: all .3s;
            }

            .blog-slider__pagination .swiper-pagination-bullet-active {
                opacity: 1;
                background: #fd3838;
                height: 11px;
                width: 30px;
                box-shadow: 0px 0px 20px rgba(252, 56, 56, 0.3);
            }

            .blog-slider__item.swiper-slide-active .blog-slider__img img {
                opacity: 1;
                transition-delay: .3s;
            }

            .blog-slider__item.swiper-slide-active .blog-slider__content>* {
                opacity: 1;
                transform: none;
            }

            .blog-slider__item.swiper-slide-active .blog-slider__content>*:nth-child(1) {
                transition-delay: 0.5s;
            }

            .blog-slider__item.swiper-slide-active .blog-slider__content>*:nth-child(2) {
                transition-delay: 0.6s;
            }

            .blog-slider__item.swiper-slide-active .blog-slider__content>*:nth-child(3) {
                transition-delay: 0.7s;
            }

            .blog-slider__item.swiper-slide-active .blog-slider__content>*:nth-child(4) {
                transition-delay: 0.8s;
            }

            .blog-slider__item.swiper-slide-active .blog-slider__content>*:nth-child(5) {
                transition-delay: 0.9s;
            }

            .blog-slider__item.swiper-slide-active .blog-slider__content>*:nth-child(6) {
                transition-delay: 1s;
            }
        }

        .btn-container {
            width: 80vw;
            padding: 0 5vw;
            // position: absolute;
            // bottom: 10vw;
        }
    }
</style>

<style lang="scss">
    .blog-slider__pagination .swiper-pagination-bullet {
        width: 11px;
        height: 11px;
        display: block;
        border-radius: 10px;
        background: #062744;
        opacity: 0.2;
        transition: all .3s;
    }

    .blog-slider__pagination .swiper-pagination-bullet-active {
        opacity: 1;
        background: #fd3838;
        height: 11px;
        width: 30px;
        box-shadow: 0px 0px 20px rgba(252, 56, 56, 0.3);
    }
</style>
