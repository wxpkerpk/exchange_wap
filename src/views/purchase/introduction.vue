<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="purchaseWrapper nopd">
                <div class="purchaseTitle">
                    <h3>{{$mkt.vCnField(item, 'title')}}</h3>
                </div>
                <div class="introductionBox" v-html="$mkt.vCnField(item,'introduction')">
                </div>
            </div>
        </div>
    </div>
</template>  

<script>  
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return{
                backUrl:{
                    url: ''
                },
                status: 'pending',
                item:{

                }
            }
        },
        computed:{

        },
        components:{
            backbar
        },
        watch:{

        },
        mounted(){
            this.getChase();
        },
        methods:{
            getChase(){
                let that = this;
                that.$mts.posts({
                    url:'api/activity/labsApply/labsApply?status='+that.status,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            let list = response.data.data.filter((item) => {return item.id == that.$route.params.id});
                            if (list && list.length > 0) {
                                that.item = list[0];
                            }
                        }
                    }
                })
            }
        }
    }
</script>  

<style lang="scss">

</style>