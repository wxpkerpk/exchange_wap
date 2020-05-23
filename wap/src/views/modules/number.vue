<template>
<div>
    <div class="numberBox">
    	<icons name="remove" v-if="addsub" @click.native="sub()" type="ios"/><input v-model="dataValue" @input="onInput" :placeholder="placeholder"  type="number"><icons name="add" @click.native="add()" v-if="addsub" type="ios"/>
    </div>
</div>
</template>
<style scoped lang="stylus">
.numberBox{display:flex;border:1px solid #ddd;padding:1vw 0;
	i{display: flex;width:10vw;height:8vw;display: flex;justify-content:center;align-items:center;font-size:6vw;position: relative;}
	input{border:0; text-align: center;flex:1;width:10vw;height:8vw;}
}
</style>
<script>
export default {
	data(){
    	return {
    		dataValue:"",
    		time:null
    	}
    },
  	components:{
  		
  	},
  	props:{
        value:{
            type: String,
            default:0,
            validator: function (value) {
                return true;
            }
        },
        addsub:{
            type: Boolean,
            default:true,
            validator: function (value) {
                return true;
            }
        },

        placeholder:'',
        min:{
            type: Number,
            default:1000000,
            validator: function (value) {
                return true;
            }
        },
        max:{
            type: Number,
            default:1000000,
            validator: function (value) {
                return true;
            }
        },
        step:{
            type: Number,
            default:1,
            validator: function (value) {
                return true;
            }
        },
        fixed:{
            type: Number,
            default:4,
            validator: function (value) {
                return true;
            }
        },
  	},
  	watch:{
  		value(cur,old){
  			this.dataValue = this.value;
  		}
  	},
  	computed:{
  	},
	mounted(){
		this.dataValue = this.value;
	},
	methods:{
		sub(){
			if(this.dataValue - this.step < this.min){
				this.dataValue = this.min
			}else{
				this.dataValue = (this.dataValue*1000000 - this.step*1000000)/1000000;
			}
			this.setVal(this.dataValue);   
		},
		add(){
			if(parseFloat(this.dataValue) + this.step > this.max){
				this.dataValue = this.max
			}else{
				this.dataValue = ((this.dataValue?this.dataValue:this.min)*1000000 + this.step*1000000)/1000000;
			}

			this.setVal(this.dataValue);  
		},
		onInput() {
			if(this.dataValue>this.max){
				this.dataValue = this.max;
			}else if(this.dataValue<this.min){  //|| !this.dataValue
				this.dataValue = this.min;
			}
			this.setVal(this.dataValue);
		},
		setVal(val){
			let valArr = val.toString().split(".");
			if(valArr.length>1){
				if(valArr[1].length>this.fixed){
					val = parseFloat(val).toFixed(this.fixed)
					this.dataValue = val
				};  
			}
			this.$emit('input', val.toString());
		}
	}
}
</script>
