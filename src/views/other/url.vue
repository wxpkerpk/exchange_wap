<template>  
<div>
    
</div>
</template>
<script>  
export default {
    data(){
        return{}
    },
    computed:{},
    components:{},
    mounted(){
        switch(this.$route.params.type){
            case "download":
                this.goToDownload(this.$route.query.app);
                break;
            default:
                this.$router.back(-1)
        }
    },
    watch:{},
    methods:{
        goToDownload(app){
            //如果APP内部打开
            if(localStorage.getItem("isAPP")){
                this.$router.back(-1)
                return;
            }

            //浏览器打开
            let that = this;
            that.$mts.posts({
                url: 'api/me/app/config',
                data: {noNeedCode:true},
                success(response){
                    if(response.data.status == 200){
                        if(app=="ios"){
                            window.location.href = response.data.data.iosUrl
                        }else if(app=="android"){
                            window.location.href = response.data.data.androidUrl
                        }
                    }
                }
            })
        },
    }
}
</script> 