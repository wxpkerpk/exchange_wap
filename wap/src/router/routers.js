import home from '@/views/home.vue'
export default [
    {path:'/',name:'home',meta:{title:"首页",index:1},component:home},
    {path:'/turntable/:id',name:'turntable',meta:{title:"幸运大转盘",index:2},component:(resolve) => require(['@/views/others/turntable.vue'], resolve)},
    {path:'/myprize/:id',name:'myprize',meta:{title:"我的奖品",index:3},component:(resolve) => require(['@/views/others/myprize.vue'], resolve)},
    {path:'/winlist/:id',name:'winlist',meta:{title:"中奖名单",index:4},component:(resolve) => require(['@/views/others/winlist.vue'], resolve)},
    {path:'/download',name:'download',meta:{title:"App下载",index:4},component:(resolve) => require(['@/views/others/download.vue'], resolve)},
    {path:'/inviteQr',name:'inviteQr',meta:{title:"推荐二维码",index:4},component:(resolve) => require(['@/views/others/inviteQr.vue'], resolve)},


  	{path:'/signin',name:'signin',meta:{title:"登录",index:1},component:(resolve) => require(['@/views/base/signin.vue'], resolve)},
  	{path:'/signup',name:'signup',meta:{title:"注册",index:2},component:(resolve) => require(['@/views/base/signup.vue'], resolve)},
  	{path:'/forget',name:'forget',meta:{title:"忘记密码",index:3},component:(resolve) => require(['@/views/base/forget.vue'], resolve)},


    {path:'/coinlist',name:'coinlist',meta:{title:"行情列表",index:1},component:(resolve) => require(['@/views/trade/coinlist.vue'], resolve)},


    {path:'/assets',name:'assets',meta:{title:"我的资产",index:1},component:(resolve) => require(['@/views/assets/index.vue'], resolve)},

    {path:'/transfer',name:'transfer',meta:{title:"划转",index:2},component:(resolve) => require(['@/views/assets/transfer.vue'], resolve)},
    {path:'/withdrawal',name:'withdrawal',meta:{title:"提币",index:3},component:(resolve) => require(['@/views/assets/withdrawal.vue'], resolve)},
    {path:'/deposit',name:'deposit',meta:{title:"充值",index:3},component:(resolve) => require(['@/views/assets/deposit.vue'], resolve)},
    {path:'/withdrawalHistory',name:'withdrawalHistory',meta:{title:"提币记录",index:4},component:(resolve) => require(['@/views/assets/withdrawalHistory.vue'], resolve)},
    {path:'/depositHistory',name:'depositHistory',meta:{title:"充值记录",index:4},component:(resolve) => require(['@/views/assets/depositHistory.vue'], resolve)},

    {path:'/allorders',name:'allorders',meta:{title:"交易记录",index:2},component:(resolve) => require(['@/views/trade/allorders.vue'], resolve)},




    {path:'/otc',name:'otc',meta:{title:"OTC交易",index:1},component:(resolve) => require(['@/views/otc/index.vue'], resolve)},
    {path:'/otcrepresentation',name:'otcRepresentation',meta:{title:"otc申述",index:5},component:(resolve) => require(['@/views/otc/otcRepresentation.vue'], resolve)},
    {path:'/otcbook/:id',name:'otcbook',meta:{title:"OTC下单",index:2},component:(resolve) => require(['@/views/otc/book.vue'], resolve)},
    {path:'/otccontact',name:'otccontact',meta:{title:"在线沟通",index:9},component:(resolve) => require(['@/views/otc/otccontact.vue'], resolve)},
    {path:'/otcorders',name:'otcorders',meta:{title:"OTC订单",index:3},component:(resolve) => require(['@/views/otc/orderlist.vue'], resolve),
    },
    {path:'/otcAddAd',name:'otcAddAd',meta:{title:"发布广告",index:2},component:(resolve) => require(['@/views/otc/addAd.vue'], resolve)},
    {path:'/toBePos',name:'toBePos',meta:{title:"申请成为商户",index:2},component:(resolve) => require(['@/views/otc/toBePos.vue'], resolve)},
    {path:'/otcDetail/:id',name:'otcDetail',meta:{title:"购买订单详情",index:4},component:(resolve) => require(['@/views/otc/otcdetail.vue'], resolve)},
    {path:'/otcselldetail/:id',name:'otcSellDetail',meta:{title:"出售订单详情",index:4},component:(resolve) => require(['@/views/otc/otcSellDetail.vue'], resolve)},
    {path:'/otccancel/:id',name:'otcCancel',meta:{title:"取消订单",index:3},component:(resolve) => require(['@/views/otc/otcCancel.vue'], resolve)},
    {path:'/advertlist',name:'advertlist',meta:{title:"我的广告",index:2},component:(resolve) => require(['@/views/otc/advertlist.vue'], resolve)},


    // {path:'/otcorders',name:'otcorders',meta:{title:"OTC交易订单",index:2},component:(resolve) => require(['@/views/otc/orders.vue'], resolve)},
    // {path:'/otcOrderDetail/:type/:id',name:'otcOrderDetail',meta:{title:"OTC订单详情",index:3},component:(resolve) => require(['@/views/otc/orderDetail.vue'], resolve)},
    // {path:'/merchantOrders',name:'merchantOrders',meta:{title:"OTC商户",index:3},component:(resolve) => require(['@/views/otc/merchantOrders.vue'], resolve)},


    {path:'/lockCoin',name:'lockCoin',meta:{title:"锁币",index:2},component:(resolve) => require(['@/views/lockCoin/index.vue'], resolve)},
    {path:'/lockCoinHistory',name:'lockCoinHistory',meta:{title:"释放历史",index:3},component:(resolve) => require(['@/views/lockCoin/lockCoinHistory.vue'], resolve)},





   //个人中心
    {path:'/user',name:'user',meta:{title:"用户中心",index:2},component:(resolve) => require(['@/views/user/index.vue'], resolve)},
    {path:'/kyc',name:'kyc',meta:{title:"实名认证",index:3},component:(resolve) => require(['@/views/user/kyc.vue'], resolve)},
        {path:'/c1',name:'c1',meta:{title:"C1认证",index:4},component:(resolve) => require(['@/views/user/kyc/c1.vue'], resolve)},
        {path:'/c2',name:'c2',meta:{title:"C2认证",index:5},component:(resolve) => require(['@/views/user/kyc/c2.vue'], resolve)},

    {path:'/invite',name:'invite',meta:{title:"我的邀请码",index:3},component:(resolve) => require(['@/views/user/invite.vue'], resolve)},
    {path:'/myteam',name:'myteam',meta:{title:"我的团队",index:3},component:(resolve) => require(['@/views/user/myteam.vue'], resolve)},
        {path:'/contractInfo',name:'contractInfo',meta:{title:"秒合约奖励明细",index:4},component:(resolve) => require(['@/views/user/myteam/contractInfo.vue'], resolve)},
        {path:'/coinInfo',name:'coinInfo',meta:{title:"BTB奖励明细",index:4},component:(resolve) => require(['@/views/user/myteam/coinInfo.vue'], resolve)},
        {path:'/rules',name:'rules',meta:{title:"规则",index:4},component:(resolve) => require(['@/views/user/myteam/rules.vue'], resolve)},
        {path:'/seeAll',name:'seeAll',meta:{title:"全部团队",index:4},component:(resolve) => require(['@/views/user/myteam/seeAll.vue'], resolve)},

    {path:'/safe',name:'safe',meta:{title:"安全中心",index:3},component:(resolve) => require(['@/views/user/safe.vue'], resolve)},
        {path:'/bindEmail',name:'bindEmail',meta:{title:"绑定邮箱",index:4},component:(resolve) => require(['@/views/base/bindEmail.vue'], resolve)},
        {path:'/bindMobile',name:'bindMobile',meta:{title:"绑定电话号码",index:4},component:(resolve) => require(['@/views/base/bindMobile.vue'], resolve)},
        {path:'/changePsw',name:'changePsw',meta:{title:"修改登录密码",index:4},component:(resolve) => require(['@/views/base/changePsw.vue'], resolve)},
        {path:'/changeAssetsPsw',name:'changeAssetsPsw',meta:{title:"修改资金密码",index:4},component:(resolve) => require(['@/views/base/changeAssetsPsw.vue'], resolve)},
    {path:'/payaccount',name:'payaccount',meta:{title:"支付账户",index:3},component:(resolve) => require(['@/views/user/payaccount.vue'], resolve)},
        {path:'/addNewAccount/:type',name:'addNewAccount',meta:{title:"添加支付账户",index:4},component:(resolve) => require(['@/views/user/addNewAccount.vue'], resolve)},

    {path:'/coinaddress',name:'coinaddress',meta:{title:"提币地址",index:3},component:(resolve) => require(['@/views/user/coinaddress.vue'], resolve)},
        {path:'/addNewCoinAddress',name:'addNewCoinAddress',meta:{title:"添加提币地址",index:4},component:(resolve) => require(['@/views/user/addNewCoinAddress.vue'], resolve)},

    {path:'/message',name:'message',meta:{title:"消息中心",index:3},component:(resolve) => require(['@/views/user/message.vue'], resolve)},
        {path:'/msgdetail/:id',name:'msgdetail',meta:{title:"站内信详情",index:4},component:(resolve) => require(['@/views/user/msgDetail.vue'], resolve)},
    {path:'/service',name:'service',meta:{title:"联系客服",index:3},component:(resolve) => require(['@/views/user/service.vue'], resolve)},
    {path:'/worklist',name:'worklist',meta:{title:"我的工单",index:3},component:(resolve) => require(['@/views/user/worklist.vue'], resolve)},
    {path:'/createworklist',name:'createworklist',meta:{title:"新建工单",index:4},component:(resolve) => require(['@/views/user/createWorkList.vue'], resolve)},





    {path:'/notice',name:'notice',meta:{title:"新闻公告",index:2},component:(resolve) => require(['@/views/article/noticelist.vue'], resolve)},
    {path:'/noticedetail/:id',name:'noticedetail',meta:{title:"新闻公告详情",index:3},component:(resolve) => require(['@/views/article/noticedetail.vue'], resolve)},
    {path:'/helpcenter',name:'helpcenter',meta:{title:"帮助中心",index:2},component:(resolve) => require(['@/views/article/helpcenter.vue'], resolve)},
    {path:'/helpdetail/:id',name:'helpdetail',meta:{title:"帮助详情",index:3},component:(resolve) => require(['@/views/article/helpdetail.vue'], resolve)},

    {path: '/trading',name:"trading",component:(resolve) => require(['@/views/trade/index.vue'], resolve),
        children:[
            {path:'/trade/:symbol',name:'trade',meta:{title:"交易",index:1},component:(resolve) => require(['@/views/trade/trade.vue'], resolve)},
            {path:'/tradeDetail/:symbol',name:'tradeDetail',meta:{title:"K线图-交易详情",index:3},component:(resolve) => require(['@/views/trade/tradeDetail.vue'], resolve)},
            {path:'/secondContract/:symbol',name:'secondContract',meta:{title:"秒合约",index:4},component:(resolve) => require(['@/views/trade/secondContract/index.vue'], resolve)},
            {path:'/secondContractOrders/:symbol',name:'secondContractOrders',meta:{title:"秒合约订单",index:5},component:(resolve) => require(['@/views/trade/secondContract/orders.vue'], resolve)},
        ]
    },
]