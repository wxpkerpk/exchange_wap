export default {
    state: {
        theme: false, //是否夜间模式，样式切换
        loading:false,
        finished:false,
        // scrollTop:0, //窗口滚动距离顶部px
        uploadAvatar:{
            show: false
        },
        vanList:[],
        rates: JSON.parse(localStorage.getItem('rates'))|| {},
        coins:{},
        market:[],
        pairs:[],
    },
    getters: {},
    mutations: {
        
    },
    actions: {}
}

