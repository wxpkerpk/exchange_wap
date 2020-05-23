<!-- 各栏目顶部标题 -->
<template>
    <div class="header-title">
        <div 
            class="header-title-left"
            @click="goBackHandle"
        >
            <slot name="left">
                <van-icon
                    name="arrow-left"
                    v-if="showBackBtn"
                />
            </slot>
        </div>
        <div class="header-title-center ">
            <span>{{ title }}</span>
            <span class="desc">
                <slot name="remark-desc"></slot>
            </span>
        </div>
        <div class="header-title-right">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'HeaderTitle',
        props: {
            // 栏目标题
            title: {
                type: String,
                default: '默认标题',
            },
            // 是否展示返回按钮
            showBackBtn: {
                type: Boolean,
                default: true,
            },
            // 返回的路由名
            backRouteName: {
                type: String,
                default: '',
            },
            // 返回的路由配置
            backRouteOptions: {
                type: Object,
                default() {
                    return {};
                },
            },
        },
        methods: {
            goBackHandle() {
                this.$router.go(-1);
            },
        },
    };
</script>

<style lang="scss">
    .header-title {
        width: 90%;
        height: 14vw;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5%;
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-color: #fff;
        overflow: hidden;
        &-center {
            position: absolute;
            top: 0;
            left: 40vw;
            min-width: 20vw;
            text-align: center;
            font-weight: 500;
            line-height: 14vw;
        }
        &-left {
            width: 20vw;
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
</style>
