<template>
    <div class="flexPage themeColor mine">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$t('user.mine.myProfile')}}</h3>
                </div>
                <div class="signForm kyc">
                    <van-cell-group>
                        <van-cell title="UID" :value="$mkt.makeUid(form.sysUserID)" />
                        <van-cell :title="$t('user.mine.account')" :value="$mkt.hideName(form.telPhone ? form.telPhone : form.email)" />
                        <van-cell :title="$t('user.mine.nick')" :value="form.nickName" is-link @click="$router.push({path:'/edit',query:{title: $t('user.mine.nick'),value:form.nickName}})" />
                        <!-- <van-cell :title="$t('user.mine.username')" :value="form.username" :is-link="form.isUsernameUpdate === 1 ? false : true" @click="onEdit" /> -->
                    </van-cell-group>
                </div>
            </div>
        </div>   
	</div>
</template>
<script>
    import backbar from "@/views/modules/back.vue"
    export default {
        data(){
            return {
                backUrl:{
                    url: 'user'
                },
                form:{
                    sysUserID: '',
                    telPhone: '',
                    nickName: '',
                    username: '',
                    email: '',
                    isUsernameUpdate: ''
                }
            }
        },
        components:{
            backbar
        },
        computed:{
            
        },
        mounted(){
            this.getUserInfo();
        },
        watch:{
            
        },
        methods:{
            getUserInfo(){
                let that = this;
                that.$mts.posts({
                    url:"api/me/user/info",
                    data:{},
                    success(response){
                        that.submiting = false;
                        if(response.data.status == 200){
                            that.form = response.data.data;
                            localStorage.setItem("user",JSON.stringify(response.data.data));
                        }
                    },error(error){
                        
                    }
                });
            },
            onEdit(){
                let that = this;
                if(that.form.isUsernameUpdate !== 1){
                    that.$router.push({path:'/edit',query:{title: that.$t('user.mine.username'),value:that.form.username}})
                }
            }
        }
    }
</script>

<style lang="scss">
    .mine {
        .signWrapper {
            .signForm {
                .van-cell-group {
                    .van-cell {
                        background-color: #E4EEEF;
                        border-bottom: 1px solid #d5d5d5;
                    }
                }
            }
        }
    }
</style>
