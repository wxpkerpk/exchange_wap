<template>
<div class="flexPage">
	<div class="flexHead">
	    <van-nav-bar class="signHead" left-arrow left-text="联系客服" title="" @click-left="$router.go(-1)"></van-nav-bar>
	</div>
	<div class="flexContent">
		<ul class="messageList">
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
                <div v-for="advice of messageList" :key="advice"> 
                    <div class="dateLine">{{advice.time}}</div>
                    <li v-for="item of advice.details" :key="item" :class="{rightType:!item.isReply}">
                        <div class="messageBox">
                            <div class="mine" v-if="!item.isReply">
                                <van-icon name="contact" />
                            </div>
                            <div class="reply" v-if="item.isReply"><van-icon name="service-o" /></div>
                            <div class="contents" v-if="!item.type || item.type=='TEXT'">{{item.content}}</div>
                            <div class="contents" v-if="item.type=='IMG'">
                                <img :src="item.content">
                            </div>
                        </div>
                    </li>
                </div>

            <!-- </van-pull-refresh> -->
		</ul>
	</div>
	<div class="downChat">
		<van-cell-group>
			<van-field
                v-model="message"
                type="textarea"
                placeholder="请输入想说的话"
                rows="1"
                autosize
            >
                <div  slot="button">
                    <!--  <van-button size="small" class="mr3" @click="upimg()" type="default">上传图片</van-button> -->
                    <van-uploader :max-size="8388608" @oversize="oversize()" :after-read="upload">
                        <van-button size="small" class="mr3" icon="photo" type="primary">上传图片</van-button>
                    </van-uploader>
                    <van-button size="small" @click="sendInfo()" type="info">发送</van-button>
                </div>
			</van-field>
		</van-cell-group>
	</div>
</div>
</template>
<script>
export default {
	data(){
    	return {
            pageNo:1,
            pageSize:2,
    		message:"",
            isLoading:false,
    		messageList:[],
    		form:{
                submiting:false,
                data:{

                }
    		},
            talk: false,
            timeOut:null
    	}
    },
  	components:{},
  	watch:{
        talk(){
            this.$nextTick(() => {
                const container = this.$el.querySelector(".flexContent");            
                container.scrollTop = 10000000;//container.scrollHeight;
            });
        }
    },
  	computed:{
  	},
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        clearInterval(this.timeOut);
        next();
    },
	mounted(){
        let that = this;
        that.$mts.checkLogin('needback',()=>{
            that.getMessage( that.pageNo);
            that.timeOut = setInterval(()=>{
                that.pageNo = 1;
                that.getMessage(that.pageNo);
            },5000)
        });
	},
	methods:{
        oversize(){
            this.$toast('图片大小最高不超过8M，请先裁剪后再上传');
        },
        onRefresh(){ // 拉取历史记录
            let that = this;
            if (!that.form.submiting) {
                that.form.submiting = true;
                that.pageNo ++;
                that.$mts.posts({
                    url:'advice/query',
                    data:{
                        pageNo: that.pageNo,
                        pageSize: that.pageSize
                    },success(response){
                        that.form.submiting = false;
                        if (response.data.code==200) {
                            that.isLoading = false;
                            let list = response.data.data.list;
                            if (list && list.length > 0) {
                                for(let idx = list.length - 1; idx >= 0; idx --){
                                    that.messageList.unshift( list[ idx])
                                }
                            }
                        }
                    }
                });
            }
        },
		getMessage(pageNo){
			//获取留言列表
            let that = this;
            if (!that.form.submiting) {
                that.form.submiting = true;
                that.talk = false;
                that.$mts.posts({
                    url:'advice/query',
                    data:{
                        pageNo,
                        pageSize: that.pageSize
                    },success(response){
                        that.form.submiting = false;
                        if (response.data.code==200) {
                            that.messageList = response.data.data.list;
                            that.talk = true;
                        }
                    }
                });
            }
		},
        upload(file, detail){
            // 开始上传图片
            let that = this;
            let data = new FormData();
            data.append('img', file.file);
            if (!that.form.submiting) {
                that.form.submiting = true;
                that.$mts.upload({
                    url:'advice/upload',
                    data,
                    success(response){
                        that.form.submiting = false;
                        if (response.data.code == 200) {
                            that.$toast('留言成功，请耐心等待...');
                            that.pageNo = 1
                            that.getMessage( that.pageNo);
                        }
                    }
                });
            }
        },
		sendInfo(){
			//先发送留言
			let that = this;
            if (that.message == "" || that.message == null) {
                that.$toast('请输入留言内容');
                return;
            }
            if (!that.form.submiting) {
                that.form.submiting = true;
                that.$mts.posts({
                    url:'advice/modify',
                    data:{
                        content: that.message
                    },
                    success(response){
                        that.form.submiting = false;
                        if (response.data.code==200) {
                            that.$toast('留言成功，请耐心等待...');
                            that.pageNo = 1
                            that.getMessage( that.pageNo);
                        }
                    }
                });
            }
			//清空message
			this.message = "";
		}
	}
}
</script>
