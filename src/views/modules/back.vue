<template>  
    <div class="back">
        <div class="left">
            <i class="iconfont iconreturn" @click="goUrl($props.back.url)"/>
            <span>{{$props.back.leftText}}</span>
        </div>
        <div class="right">
            <i v-if="$props.back.icon" :class="['iconfont',$props.back.icon]" @click="goPath($props.back.path)" />
            <span @click="goPath($props.back.path)">{{$props.back.rightText}}</span>
        </div>
        <slot></slot>
    </div>
</template>  

<script>  
    export default {
        data(){
            return{
                
            }
        },
        props: ['back'],
        computed:{
            
        },
        components:{
            
        },
        mounted(){
            
        },
        watch:{

        },
        methods:{
            goUrl(url){
                if(url){
                    this.$router.push({name: url});
                }else{
                    this.$router.go(-1);
                }
            },
            goPath(name){
                this.$router.push({name: name});
            }
        }
    }
</script>  

<style lang="scss">
    
</style>