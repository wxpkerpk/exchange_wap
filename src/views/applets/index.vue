<template>
    <div class="applets">
        <backbar :back="{ url: 'home' }" />
        <div class="main">
            <div @click="jump" class="jump-container">
                <img class="icon" :src="require('@/assets/svg/t-help.svg')"/>
                <span>T盾帮扶</span>
            </div>
        </div>
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'

    export default {
        name: 'Applets',
        components: {
            backbar,
        },
        methods: {
            jump() {
                this.$router.push({ name: 'tHelp' })
            },
        },
    };
</script>

<style lang="scss" scoped>
    .main {
        padding: 5vw;
        display: flex;
        .jump-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            .icon {
                width: 10vw;
                height: 10vw;
                margin-bottom: 2vw;
            }
        }
    }
</style>
