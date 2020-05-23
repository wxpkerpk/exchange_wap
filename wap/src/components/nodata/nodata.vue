<template>
<div>
    <div class="nodata" v-if="!$store.state.app.loading"><i class="iconfont iconnodata"></i><p>{{$t('message.nodata')}}</p></div>
</div>
</template>
<style lang="stylus">
.nodata{padding:10vw;color:#abb2c7;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;
  >i{font-size:10vw;}
  >p{font-size:3.2vw; text-align:center;width:100%;}
}
</style>
<script>
export default {
	props:{
        
    },
    computed:{
    	// show(){
     //        if(this.val){
     //            if(this.val.length>0){
     //                return true 
     //            }else{
     //                return false 
     //            }
     //        }else{
     //            return false;
     //        }
     //    }
    },
    methods:{

    }
}
</script>