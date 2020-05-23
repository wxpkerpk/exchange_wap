<template>
<div class="flexPage themeColor">
	<div class="flexHead">
        <navbar :params="pageInfo" />
	</div>
	<div class="flexContent">
		<div class="teamlist">
            <nodata v-if="!list|| list.length==0" />
            <dl v-if="list && list.length>0" v-for="item,index of list" :key="index">
                <dt>{{username( item)}}</dt>
                <ul>
                    <li v-for="(child,idx) of item.list" :key="idx">{{username( child)}}</li>
                </ul>
            </dl>
            <div class="center pt5 pb5 teammore"  v-if="more"><span @click="query()">查看更多</span></div>
        </div>
    </div>
</div>
</template>
<script>
import navbar from "@/views/modules/navbar.vue";
export default {
	data(){
        return {
            pageInfo: {
				title: this.$t('assets.myteam.seeAll'),
				navbarStyle: 'normal',
                html:"",
			},
            pageNum:0,
            teamVO:{
                total: 0,
                list: []
            },
            list:[],
            more: false
        }
    },
    components:{navbar},
    watch:{},
    computed:{
        
    },
	mounted(){
		this.query();
	},
	methods:{
        query(){
            let that = this;

            that.pageNum ++;

            that.$mts.posts({
                url:'team/stage',
                data:{
                    pageNum: that.pageNum
                },
                success(response){
                    if (response.data.code==200) {
                        that.teamVO = response.data.data;

                        that.list = that.list.concat(that.teamVO.list);
                        if ( that.teamVO.list.length < 10) {
                            that.more = false;
                        } else {
                            that.more = true;
                        }
                    }
                }
            });
        },
        username(item){
            let email = item.email;
            let mobile = item.mobile;
            return mobile ? mobile : email;
        }
    }
}
</script>
