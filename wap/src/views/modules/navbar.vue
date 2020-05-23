<template>
    <div class="navbar">
        <van-nav-bar v-if="$props.params.title != $t('home.turntable.lucky')"
            :class="$props.params.navbarStyle"
            :left-text="$props.params.title"
            :right-text="$props.params.value"
            left-arrow
            @click-left="goback()"
            @click-right="$router.push($props.params.url)"
        >
            <van-icon v-if="$props.params.value == ''" :name="$props.params.icon" slot="right" />
        </van-nav-bar>
        <van-nav-bar v-else
            :class="$props.params.navbarStyle"
            :left-text="$props.params.title"
            :right-text="$props.params.value"
            left-arrow
            @click-left="$props.params.backname?$router.push({name:$props.params.backname}):$router.push('/')"
            @click-right="$router.push($props.params.url)"
        >
        </van-nav-bar>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    props: ['params'],
    mounted(){
        
    },
    methods:{
        goback(){
            if(this.$props.params.backname){
                this.$router.push({name:this.$props.params.backname})
            }else{
                this.$router.go(-1)
            }
        }
        
    }
}
</script>

<style>

</style>
