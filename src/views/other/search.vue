<template>  
    <div class="flexPage">
        <div class="flexHead"></div>
        <div class="flexContent whiteBg">
            <div class="searchWrapper">
                <div class="searchHead">
                    <form action="/">
                        <van-search
                            v-model="searchValue"
                            :placeholder="$t('validate.public.search')"
                            show-action
                            :action-text="$t('button.public.cancel')"
                            @input="onSearch(searchValue)"
                            @cancel="onCancel"
                        >
                            <i slot="left-icon" class="iconfont iconsearch" />
                        </van-search>
                    </form>
                </div>
                <div class="searchContent">
                    <div class="searchHistory flexLevel">
                        <span class="old">{{$t('trade.searchHistory')}}</span>
                        <span class="clear" @click="onClear">{{$t('trade.clearSearch')}}</span>
                    </div>
                    <div class="searchResult">
                        <dl>
                            <dd v-for="(item,index) in historyList" :key="index">{{item}}</dd>
                        </dl>
                    </div>
                    <div class="searchList">
                        <loading v-if="submiting"/>
                        <nodata v-if="!searchList || searchList.length == 0" />
                        <ul v-else>
                            <li v-for="(item,index) in searchList" :key="index" @click="goDetail(item)">
                                <b>{{$mkt.vPair(item.pair)}}</b>
                                <b>{{$mkt.fmtNum(item.price,$mkt.getScale($store.state.app.pairs, item.pair, true))}}</b>
                                <b :class="$mkt.vMColor(item.gain_24)" v-html="$mkt.format(item,item.gain_24)"></b>
                                <span>
                                    <i class="iconfont iconfavorites" v-if="!item.isFav" @click.stop="$mts.onSetFav(item)" />
                                    <i class="iconfont iconfavorites_selected" v-if="item.isFav" @click.stop="$mts.onCancelFav(item)" />
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>  

<script>  
    export default {
        data(){
            return{
                searchValue: '',
                historyList: JSON.parse(localStorage.getItem('searchHistory')) || [],
                searchList: [],
                submiting:false,
            }
        },
        props:['data'],
        computed:{

        },
        components:{
            
        },
        mounted(){
            this.$mts.currency();
            this.initPage();
        },
        watch:{

        },
        methods:{
            initPage(){
                let that = this;
                if(!that.submiting){
                    that.submiting = true;
                    const marketAllExpire = localStorage.getItem('marketAllExpire');
                    if (Number(marketAllExpire) - Date.now() > 0) {
                        that.searchList = JSON.parse(localStorage.getItem('marketAll'));
                        that.submiting = false;
                    } else {
                        that.$mts.posts({
                            url: 'api/v2/marketAll',
                            data:{},
                            success(response){
                                if(response.data.status == 200){
                                    that.submiting = false;
                                    that.searchList = response.data.data;
                                }else{
                                    that.$mts.toast(that.$t('message.public.dataError'));
                                }
                            }
                        })
                    }
                } 
            },
            onSearch(value){
                let that = this;
                let arr = that.searchList;
                let list = [];
                if(value){
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i].pair.indexOf(value.toUpperCase()) >= 0){
                            list.push(arr[i]);
                        }
                    }
                    that.searchList = list;
                }else{
                    that.initPage();
                }
            },
            goDetail(item){
                let that = this;
                if(that.$route.query.backUrl != 'trade'){
                    that.$router.push({path: '/tradedetail',query:{pair: item.pair}});
                }else{
                    that.$router.push({path: '/trade',query:{pair: item.pair}});
                }
                that.historyList.push(item.pair); 
                let arr = Array.from(new Set(that.historyList)); // 去重
                // that.$mts.initPage();
                localStorage.setItem('searchHistory',JSON.stringify(arr));
            },
            onCancel(){
                this.$router.push(this.$route.query.backUrl);
            },
            onClear(){
                this.historyList = [];
                localStorage.removeItem('searchHistory');
            },
        }
    }
</script>  

<style lang="scss" scoped>
    .van-search {
        background-color: #E4EEEF;
    }
</style>