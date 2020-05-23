<template>
<div class="flexPage themePage">
    <div class="currencyHead fixed themeHead">
		<navbar :params="pageInfo" />
	</div>
    <div class="flexContent">
        <div class="zcInfoWrapper">
            <div class="zcInfo adver">
                <div class="form">
                    <div class="cellGroup">
                        <div class="tbTitle">{{$t('assets.worklist.question')}}</div>
                        <van-cell :title="form.question" :value="$t('form.otc.initiateAd.goChoose')" @click="chooseQuestions.show=true" is-link />
                    </div>
                    <div class="textArea">
                        <p>{{$t('form.otc.state.stateReason')}}</p>
                        <textarea v-model="form.reason" :placeholder="$t('form.otc.state.i2')"></textarea>
                    </div>
                    <div class="photoBox">
                        <p>{{$t('form.otc.state.evidence')}}</p>
                        <div class="photoUpdate">
                            <van-uploader v-model="form.materials" @delete="deleteImg" class="miniLoader" :after-read="onRead" :max-count="4"  multiple>
                                <van-icon name="photograph" />
                            </van-uploader>
                        </div>
                    </div>
                    <div class="mt5">
                        <van-button 
                            @click="submit()" 
                            :loading-text="$t('button.otc.sure')" size="large" type="info">{{$t('button.otc.sure')}}
                        </van-button>
                    </div>
                </div>
            </div>
        </div>
        <!--选择提问-->
        <van-popup v-model="chooseQuestions.show"  :default-index="1" position="bottom" :overlay="true">
            <van-picker :columns="chooseQuestions.data" show-toolbar  @cancel="chooseQuestions.show=false" @confirm="onQuestionsConfirm" :confirm-button-text="$t('button.otc.sure')" :cancel-button-text="$t('button.otc.cancel')" />
        </van-popup>
    </div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue"
export default {
    data(){
        return {
            pageInfo:{
				title: this.$t('assets.worklist.newworklist'),
				url: '',
				value: '',
				navbarStyle: 'blue'
			},
            form: {
                question: '充值未到账',
                reason: '',
                materials:[],
            },
            chooseQuestions:{
                show: false,
                name: this.$t('form.otc.state.stateReason'),
                data: []
            },
            showImg:[],
            material:[],
        }
    },
    components:{navbar},
    watch:{},
    mounted(){
        this.dict();
    },
    methods:{
        onQuestionsConfirm(tag,index){
			this.form.question = tag;
			this.chooseQuestions.show = false;
        },
        onRead(file, detail){
            // 开始上传图片
            let that = this;
            let data = new FormData();
            data.append('img', file.file);
            data.append('name', detail.name);
            let key = file.file.name;
            that.$mts.upload({
                url:'work/material',
                data,success(response){
                    if (response.data.code == 200) {
                        that.material.push({key:key,value:response.data.data})
                    }
                }
            });
        },
        dict(){
            let that = this;
            that.$mts.post({
                url:'dict',
                data:{
                    type:'WORK'
                },success(response){
                    if(response.data.code == 200){
                        that.chooseQuestions.data = response.data.data
                    }
                }
            });
        },
        deleteImg(file){
            for(var i = 0; i < this.materials; i++){
                if(this.materials[i] == file){
                    this.materials(i,1);
                }
            }
            for(let idx = 0; idx < this.material.length; idx ++){
                if(file.file.name == this.material[idx].key){
                    this.material.splice(idx,1);
                    break;
                }
            }
        },
        submit(){
            let that = this;
            let list = [];
            for(let idx = 0; idx < that.material.length; idx ++){
                list.push(that.material[idx].value)
            }
            that.$mts.post({
                url:'work/modify',
                data:{
                    question:that.form.question,
                    reason:that.form.reason,
                    material:list.join(",")
                },success(response){
                    if(response.data.code == 200){
                        //回到列表页面
                        that.$toast(that.$t('message.assets.t10'));
                        that.$router.push({name:"worklist"})
                    }
                }
            });
        },
    }
}
</script>
<style lang="stylus"></style>