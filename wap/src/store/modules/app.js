export default {
    state: {
        nightModel: localStorage.getItem('nightModel')=="true" || false,     	//是否夜间模式，样式切换
        language:'简体中文',
        rate:'CNY',
        uploadhead:{
            show:false
        },
        rates:{},
        currency:[],
        market:[],
        drawer:{
            show:false
        },
        trade:{
            scrollTop:0,
            chooseType:0      //交易类型 0币币  1秒合约
        },
        loading:false,
        scrollTop:0,            //窗口滚动距离顶部px
        vanList:[],
        finished: false
    },
    getters: {},
    mutations: {
    },
    actions: {}
}

