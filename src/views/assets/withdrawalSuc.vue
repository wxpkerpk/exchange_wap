<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent">
            <div class="assetsWrapper">
                <div class="assetsForm">
                    <div class="assetsHead">
                        <h3>{{$t('user.index.withdrawal')}}</h3>
                    </div>
                    <div class="successBox">
                        <div class="successImg">
                            <img src="@/assets/img/success.png" alt="">
                        </div>
                        <h3>提现成功</h3>
                        <div class="content">
                            您的提现申请已提交，<br/>请耐心等待，会在1到2个工作日内联系您！
                        </div>
                    </div>
                </div>   
            </div>
        </div>    
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'
    export default {
        data(){
            return {
                backUrl:{
                    url: '',
                    icon: ''
                },
            }
        },
        computed:{
            
        },
        components:{
            backbar
        },
        mounted(){
            
        },
        watch:{
            
        },
        methods:{
            
        }
    }
</script>  

<style>
    
</style> 