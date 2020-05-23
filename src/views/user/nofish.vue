<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('user.safe.noFish')}}</h3>
                </div>
                <div class="signForm kyc">
                    <div class="cellGroup">
                        <p class="title">{{$t('user.safe.noFish')}}</p>
                        <van-field type="text" v-model="form.fishcode" maxlength="10" :placeholder="$t('validate.safe.fish')" clearable />
                    </div>
                    <div class="btnBox fixed">
                        <van-button size="large" class="active" @click="onSave">{{$t('button.public.confirm')}}</van-button>
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
            return{
                backUrl:{
                    url: ''
                },
                form:{
                    fishcode:this.$route.params.name || ''
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
        methods:{
            onSave(){
                let that = this;
                if(that.form.fishcode){
                    that.$mts.posts({
                        url:'api/me/security/antiPhishingCode',
                        data:{
                            code: that.form.fishcode,
                        },
                        success(response){
                            if(response.data.status == 200){
                                that.$mts.toast(that.$t('message.safe.fishSuc'));
                                that.$router.push({name:'security'});
                            }else if(responsee.data.status == 700){
                                that.$mts.toast(that.$t('endNotice.fish.paramsError'));
                            }
                        }
                    })
                }else{
                    that.$mts.toast(that.$t('message.public.noFish'));
                }
            }
        }
    }
</script>  

<style lang="scss">

</style>