<template>
<div class="loadingBox" v-if="$store.state.app.loading"><van-loading color="#1989fa" /></div>
</template>
<style lang="stylus">
.loadingBox{padding:10vw;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;
}
</style>
<script>
export default {
	props:{
        name:String,
        type:{
            type: String,
            default: ''
        },
    },
    computed:{
    	
    }
}
</script>