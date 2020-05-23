<template>
    <div class="flexPage announcement-detail">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="ruseWrapper">
                <div class="ruseTitle">
                    <h3 class="title">{{notice.title}}</h3>
                    <p class="time">{{notice.time}}</p>
                </div>
                <div class="article-content show-content"></div>
            </div>
        </div>   
	</div>
</template>

<script>
import marked from 'marked';
import backbar from "@/views/modules/back.vue"

export default {
	data(){
        return {
            backUrl:{
                url: ''
            },
            content:'',
            notice:{},
            openUrl:[],
            fileUrl:'file://',
            zendeskUrl:'https://dogex.zendesk.com',
        }
    },
    components:{backbar},
    computed:{
        
    },
	mounted(){
        let that = this;
        // that.details();
        // this.notice = JSON.parse(localStorage.getItem('noticeV0'))[this.$route.params.index];
        this.notice = this.$route.params.item;

        document.querySelector('.article-content').innerHTML = marked(this.notice.content);

        $('.article-content').on('click','.openLink',function(e){
            let str = e.target.className;
            let url = '';
            if(str.indexOf('url') != -1){
                url = that.openUrl[str.slice(str.length-1)-1];
            }
            if(localStorage.getItem('isAPP')){
                plus.runtime.openURL(url,()=>{});
            }else{
                that.$mts.copy(url);
            }
        });
    },
    watch:{
        
    },
	methods:{
	}
}
</script>

<style lang="scss" scoped>
    .hiding{
        display: none;
        width: 0vw;
        height: 0vw;
        opacity: 0;
    }
    img {
        width: 100%;
    }
    .ruseTitle {
        text-align: center;
        .time {
            margin-top: 2vw;
        }
    }
    .back {
        background-color: #E4EEEF;
    }
    .article-content {
        background-color: #fff;
        margin: 5vw;
        border-radius: 5vw;
        padding: 5vw;
    }
</style>
