<template>
    <div class="flexPage">
        <div class="flexContent whiteBg">
            <div class="areaCodeWrapper">
                <div class="searchHead">
                    <form action="/">
                        <van-search
                            v-model="searchValue"
                            :placeholder="$t('validate.public.searchArea')"
                            show-action
                            @input="onSearch(searchValue)"
                            @cancel="onCancel"
                        >
                            <i slot="left-icon" class="iconfont iconsearch" />
                        </van-search>
                    </form>
                </div>
                <div class="areaList">
                    <ul>
                        <li v-for="(item,index) in areaList" :key="index" @click="onConfirm(item.area_code)">
                            <dl class="flexLevel">
                                <dt>{{item.area_cn+'('+item.area_en+')'}}</dt>
                                <dd>{{'+'+item.area_code}}</dd>
                            </dl>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import areaCode from '@/assets/js/areaCode.js'
    export default {
        data(){
            return{
                searchValue: '',
                areaList: areaCode,
            }
        },
        computed:{

        },
        components:{
            
        },
        mounted(){
            
        },
        beforeDestroy(){

        },
        watch:{

        },
        methods:{
            onSearch(value){
                let that = this;
                let arr = that.areaList;
                let list = [];
                if(value){
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i].area_cn.indexOf(value) >= 0 
                            || String(arr[i].area_en).toLowerCase().indexOf(value.toLowerCase()) >= 0
                            || arr[i].area_py.indexOf(value) >= 0){
                            list.push(arr[i]);
                        }
                    }
                    that.areaList = list;
                }else{
                    that.areaList = areaCode;
                }
            },
            onCancel(){
                this.$router.go(-1);
            },
            onConfirm(areaCode){
                let that = this;
                that.$router.push({path:that.$route.query.back,query:{areaCode:areaCode}});
            }
        }
    }
</script>

<style lang="scss">

</style>