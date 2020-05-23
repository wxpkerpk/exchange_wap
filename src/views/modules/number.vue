<template>
<div>
    <div class="numberBox">
		<i class="iconfont iconjianhao" v-if="addsub" @click="sub()" type="ios"/><input v-model="dataValue" @blur="onInput" :placeholder="placeholder"  type="number"><i class="iconfont iconaddto" @click="add()" v-if="addsub" />
    </div>
</div>
</template>

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
			this.$emit('input', Number(val).toString());
		}
	}
}
</script>

<style lang="scss">
	
</style>
