<template>
<i class="ion" :class="classname"></i>
</template>
<script>
export default {
	props:{
        name:String,
        type:{
            type: String,
            default: 'md'
        },
    },
    computed:{
    	classname(){
    		switch(this.type){
    			case "md":
    				return 'ion-md-'+this.name;
    			case "ios":
    				return 'ion-ios-'+this.name;
    			case "other":
    				return 'ion-'+this.name;
    		}
    	}
    }
}
</script>