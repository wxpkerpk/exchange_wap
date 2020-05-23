<template>
<div class="flexPage themeColor">
	<div class="flexHead">
        <div class="currencyHead fixed">
            <navbar :params="pageInfo" />
        </div>
	</div>
	<div class="flexContent">
		<div class="rulesContent">
            <p v-html="pageInfo.html"></p>
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
				title: '',
				navbarStyle: 'normal',
                html:""
			},
        }
    },
    components:{navbar},
    watch:{},
    computed:{
        
    },
	mounted(){
		switch(this.$route.query.rule){
            case "contract":
                this.pageInfo.title = this.$t('assets.myteam.rule1');
                this.pageInfo.html = this.$t('rule.s1')
                break;
            case "star":
                this.pageInfo.title = this.$t('assets.myteam.rule2');
                this.pageInfo.html = this.$t('rule.s2')
                break;
            default:
                this.pageInfo.title = this.$t('assets.myteam.rule1');
                this.pageInfo.html = this.$t('rule.s1')
                break;
        }
	},
	methods:{
    }
}
</script>
