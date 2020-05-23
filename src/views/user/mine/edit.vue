<template>
    <div class="flexPage themeColor">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="signWrapper">
                <div class="signHead">
                    <h3>{{$route.query.title}}</h3>
                </div>
                <div class="signForm kyc">
                    <van-field v-model="value" class="edit" />
                    <div class="danger" v-if="$route.query.title != $t('user.mine.nick')">{{$t('user.mine.t1')}}</div>
                    <div class="btnBox fixed">
                        <van-button size="large" class="active" @click="onSave($route.query.title)">{{$t('button.public.save')}}</van-button>
                    </div>
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
                url: ''
            },
            value: this.$route.query.value || ''
        }
    },
    components:{backbar},
    computed:{
        
    },
	mounted(){
        
    },
    watch:{
        
    },
	methods:{
        onSave(type){
            let that = this;
            that.$mts.posts({
                url:"api/me/user/setUserInfo",
                data:{
                    username: type == that.$t('user.mine.username') ? that.value : '',
                    nickName: type == that.$t('user.mine.nick') ? that.value : '',
                    avatar: '',
                    sign: ''
                },
                success(response){
                    that.submiting = false;
                    if(response.data.status == 200){
                        that.$mts.toast(that.$t('message.public.modifySuc'));
                        that.$router.push('/mine');
                    }
                },error(error){

                }
            });
        }
	}
}
</script>
