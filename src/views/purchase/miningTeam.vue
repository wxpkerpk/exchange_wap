<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent">
            <div class="miningWrapper">
                <div class="miningTitle">
                    <h3>{{$t('button.purchase.miningTeam')}}</h3>
                </div>
                <div class="inviteTop">
                    <dl>
                        <dt>{{$t('purchase.inviteTotal')}}</dt>
                        <dd>10</dd>
                    </dl>
                    <dl>
                        <dt>{{$t('purchase.onlineMining')}}</dt>
                        <dd>1999</dd>
                    </dl>
                </div>
                <div class="inviteList">
                    <div class="title">{{$t('purchase.myinvite')}}</div>
                    <nodata v-if="!list || list.length == 0" />
                    <ul v-else>
                        <li v-for="(item,index) in 15" :key="index">132****1234</li>
                    </ul>
                </div>
                <div class="inviteBtnBox">
                    <p>{{$t('purchase.t4')}}</p>
                    <span>{{$t('button.purchase.invite')}}</span>
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
                list:[]
            }
        },
        computed:{

        },
        components:{
            backbar
        },
        watch:{

        },
        methods:{

        }
    }
</script>  

<style lang="scss">

</style>