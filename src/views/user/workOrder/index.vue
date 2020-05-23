<template>
    <div class="flexPage">
        <div class="flexHead">
            <backbar :back="backUrl" />
        </div>
        <div class="flexContent whiteBg">   
            <div class="ruseWrapper">
                <div class="ruseTitle">
                    <h3>{{$t('user.mine.workOrder')}}</h3>
                    <div class="workOrderList">
                        <loading v-if="submiting" />
                        <nodata v-if="!list || list.length == 0" />  
                        <ul v-else>
                            <li v-for="(item,index) in list" :key="index" @click="$router.push({name:'chat',params:{id: item.id}})">
                                <div class="flexLevel">
                                    <dl>
                                        <dd class="title">{{item.title}}</dd>
                                        <dd class="reason">{{item.type}}</dd>
                                        <dd class="date" v-html="$mkt.dateFormat('yyyy.mm.dd HH:MM:SS',item.time)"></dd>
                                    </dl>
                                    <span class="green">{{vStatus(item.status)}}</span>
                                </div>
                            </li>
                        </ul>
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
                url: 'user',
                rightText: this.$t('user.workOrder.add'),
                path: 'addworkorder'
            },
            submiting: false,
            size: 100
        }
    },
    components:{backbar},
    computed:{
        list(){
            return this.$store.state.app.vanList;
        },
    },
	mounted(){
        this.getWorkOrder();
    },
    watch:{
        
    },
	methods:{
        getWorkOrder(){
            let that = this;
            if(!that.submiting){
                that.submiting = true;
                that.$mts.posts({
                    url:"api/me/workOrder/list?size="+that.size,
                    data:{},
                    success(response){
                        if(response.data.status == 200){
                            that.submiting = false;
                            that.$store.state.app.vanList = response.data.data;
                        }
                    },error(error){

                    }
                });
            }
        },
        vStatus(status){
            switch(status){
                case 'Unprocessed':
                    return this.$t('form.public.unprocess');
                case 'Processing':
                    return this.$t('form.public.processing');
                case 'Processed':
                    return this.$t('form.public.processed');
                default:
                    return this.$t('form.public.unprocess');
            }
        }
	}
}
</script>
