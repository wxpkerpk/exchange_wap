<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="ruseWrapper">
                <div class="ruseTitle">
                    <h3>{{notice.title}}</h3>
                </div>
                <div class="hiding" v-html="content"></div>
                <div class="article-content show-content" v-html="notice.content"></div>
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
            content:'',
            notice:{
                title:'',
                content: ''
            },
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
        that.details();
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
        loop(point, $t, content, idx, callback){
            let that = this;
            let total = $t.find(point).length;
            if (idx >= total) {
                callback( content);
                return ;
            } 

            let ele = $t.find(point)[idx];
            let href = String(ele.href);

            href = href.replace(that.$mts.domain, '');
            href = href.replace(that.fileUrl, '');

            let xsrc = href.substr(href.indexOf('/hc'),href.length);

            let nsrc = that.zendeskUrl + xsrc;
            content = content.replace('"' + xsrc, '"' + nsrc);
            that.loop(point, $t, content, ++ idx, callback);
        },
        details(){
            let that = this;
            let url = that.$route.params.url;
            that.$mts.posts({
                url:'api/push/support/page?url=' + url,
                data:{},
                success(response){
                    if (response.status == 200) {
                        that.content = response.data;
                        setTimeout(()=>{
                            let content = $('.article-content').html();
                            let $t = $(content);
                            let full = window.location.href
                            let host = window.location.host;
                            let ori = full.substr(0,full.lastIndexOf(host) + host.length);
                            $t.find('img').each((index,element)=>{
                                let src = String(element.src);
                                let xsrc = src.substr(src.indexOf('/hc'),src.length);
                                src = src.replace(that.$mts.domain, '');
                                src = src.replace(that.fileUrl, '');

                                let nsrc = that.zendeskUrl + src;
                                content = content.replace('"' + xsrc, '"' + nsrc);
                                content = content.replace(ori,'');
                            });

                            that.loop('a[target=_blank]', $t, content, 0 , 
                                (c)=>{
                                    that.notice = {
                                        title: String($('.article-title').html()).trim(),
                                        content: c
                                    }

                                    setTimeout(() => {
                                        that.getUrl();
                                    },100);
                                }
                            );
                        }, 100);
                    }
                }
            });
        },
        getUrl(){
            let that = this;
            $('.openLink').css({'color':'#337EFD'});
            let arr = [];
            if($('.openLink','.show-content').length > 0){
                arr = $('.openLink','.show-content');
                for(let i = 0; i < arr.length; i++){
                    that.openUrl.push(arr[i].innerText)
                }
            }
        },
	}
}
</script>
<style lang="scss">
    .hiding{
        display: none;
        width: 0vw;height: 0vw;
        opacity: 0;
    }
</style>



