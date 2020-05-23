<template>  
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">
            <div class="chatWrapper">
                <div class="chatTitle">
                    <h3>{{'HUODUN '+$t('user.workOrder.assistant')}}</h3>
                </div>
                <div class="chatContent">
                    <nodata v-if="!list || list.length == 0" />
                    <div class="block" v-else>
                        <div class="blockInSide">
                            <div class="content">
                                <div class="introduction">{{list[0].content}}</div>
                                <ul>
                                    <li v-for="(item,index) in JSON.parse(list[0].imageList)" :key="index"><img :src="item" alt=""></li>
                                </ul>
                            </div>
                            <div class="date" v-html="$mkt.dateFormat('yyyy-mm-dd HH:MM:SS',list[0].time)"></div>
                        </div>
                        <div class="blockInSide" v-for="(item,index) in list.filter((parm,cur) => {return cur != 0})" :key="index">
                            <div class="content">
                                <div class="introduction">{{item.content}}</div>
                                <ul>
                                    <li v-for="(child,index) in item.imageList" :key="index"><img :src="child" alt=""></li>
                                </ul>
                            </div>
                            <div class="date" v-html="$mkt.dateFormat('yyyy-mm-dd HH:MM:SS',item.time)"></div>
                        </div>
                    </div>
                </div>
                <div class="inputBox">
                    <van-uploader
                        multiple
                        :max-count="3"
                        :max-size="8388608"
                        @oversize="oversize()" 
                        :after-read="onRead"
                    >
                        <van-icon name="add-o"></van-icon>
                    </van-uploader>
                    <input type="text" v-model="value" :placeholder="$t('validate.workOrder.t5')" />
                    <span @click="onSend">{{$t('button.public.send')+vLength}}</span>
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
                value:'',
                list: [],
                imageList:[],
                images: []
            }
        },
        computed:{
            vLength(){
                return this.imageList.length > 0 ? '('+this.imageList.length+')' : '';
            }
        },
        components:{
            backbar
        },
        mounted(){
            this.initPage();
        },
        watch:{

        },
        methods:{
            initPage(){
                this.getDetail();
            },
            getDetail(){
                let that = this;
                that.$mts.posts({
                    url:"api/me/workOrder/detail?id="+that.$route.params.id,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.list = response.data.data;
                        }
                    },error(error){

                    }
                });
            },
            oversize(){
                this.$mts.toast(that.$t('message.kyc.oversize'));
            },
            onRead(file,detail){
                let that = this;
                let data = new FormData();
                data.append('file', file.file);
                data.append('type', 'prove');
                data.append('name',detail.name);
                that.$mts.upload({
                    url:'api/push/image/upload',
                    data:data,
                    success(response){
                        if (response.status == 200) {
                            that.imageList.push(response.data.data);
                        }
                    }
                });
            },
            onSend(){
                let that = this;
                if (that.value || that.imageList.length > 0) {
                    that.$mts.posts({
                        url:"api/me/workOrder/reply",
                        data:{
                            orderId: that.$route.params.id,
                            content: that.value,
                            imageList: that.imageList
                        },
                        success(response){
                            if(response.data.status == 200){
                                that.getDetail();
                                that.value = '';
                                that.imageList = [];
                            }
                        }
                    }); 
                }
            }
        }
    }
</script>  

<style lang="scss">

</style>