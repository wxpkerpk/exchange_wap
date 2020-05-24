const router = [
    {
        path: '/',
        redirect: {
            name: 'home'
        }
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: "首页",
            titleEn: 'Home',
            index: 1,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/home.vue'], resolve)
    },

    // 安全中心&&登录注册
    {
        path: '/signin',
        name: 'signin',
        meta: {
            title: '登录',
            titleEn: 'Sign in',
            index: 2,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/base/signin.vue'], resolve)
    },
    {
        path: '/signup',
        name: 'signup',
        meta: {
            title: '注册',
            titleEn: 'Sign up',
            index: 3,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/base/signup.vue'], resolve)
    },
    {
        path: '/smscode',
        name: 'smscode',
        meta: {
            title: '输入验证码',
            titleEn: 'Verification code',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/base/smscode.vue'], resolve)
    },
    {
        path: '/forget',
        name: 'forget',
        meta: {
            title: '忘记密码',
            titleEn: 'forgot',
            index: 3,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/base/forget.vue'], resolve)
    },
    {
        path: '/bindEmail',
        name: 'bindEmail',
        meta: {
            title: '绑定邮箱',
            titleEn: 'Bind email',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/base/bindEmail.vue'], resolve)
    },
    {
        path: '/bindMobile',
        name: 'bindMobile',
        meta: {
            title: '绑定手机',
            titleEn: 'Bind Mobile',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/base/bindMobile.vue'], resolve)
    },
    {
        path: '/changePsw',
        name: 'changePsw',
        meta: {
            title: '修改密码',
            titleEn: 'Modify password',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/base/changePsw.vue'], resolve)
    },
    {
        path: '/changeFundPsw',
        name: 'changeFundPsw',
        meta: {
            title: '修改资金密码',
            titleEn: 'Modify fund password',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/base/changeFundPsw.vue'], resolve)
    },

    // 节点
    {
        path: '/mining',
        name: 'mining',
        meta: {
            title: '节点',
            titleEn: 'node',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/mining/index.vue'], resolve)
    },

    //节点列表 
    {
        path: '/mining/list',
        name: 'miningList',
        meta: {
            title: '节点列表',
            titleEn: 'node-list',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/mining/list/List.vue'], resolve)
    },

    //团队 
    {
        path: '/mining/team',
        name: 'miningTeams',
        meta: {
            title: '团队',
            titleEn: 'node-team',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/mining/team/Team.vue'], resolve)
    },

    //收益明细 
    {
        path: '/mining/income',
        name: 'miningIncome',
        meta: {
            title: '收益明细',
            titleEn: 'node-income',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/mining/income/Income.vue'], resolve)
    },

    //社区 
    {
        path: '/mining/community',
        name: 'miningCommunity',
        meta: {
            title: '社区',
            titleEn: 'node-community',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/mining/community/Community.vue'], resolve)
    },

    // 帮助中心 
    {
        path: '/mining/help',
        name: 'miningHelp',
        meta: {
            title: '帮助中心',
            titleEn: 'node-help',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/mining/help/Help.vue'], resolve)
    },

    // 公益 
    {
        path: '/publicWelfare',
        name: 'publicWelfare',
        meta: {
            title: '公益',
            titleEn: 'public-welfare',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/publicWelfare/index.vue'], resolve)
    },

    // 公益文章详情
    {
        path: '/publicWelfare/detail',
        name: 'publicWelfareDetail',
        meta: {
            title: '公益',
            titleEn: 'public-welfare-detail',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/publicWelfare/detail/detail.vue'], resolve)
    },

    // 快捷买币
    {
        path: '/buyCoins',
        name: 'buyCoins',
        meta: {
            title: '快捷买币',
            titleEn: 'buy-coins',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/buyCoins/index.vue'], resolve)
    },

    // 快捷选择支付方式
    {
        path: '/payWay',
        name: 'payWay',
        meta: {
            title: '快捷买币',
            titleEn: 'pay-way',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/buyCoins/payWay/PayWay.vue'], resolve)
    },

    // 快捷买币订单
    {
        path: '/coinsOrder',
        name: 'coinsOrder',
        meta: {
            title: '订单',
            titleEn: 'coins-order',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/buyCoins/coinsOrder/CoinsOrder.vue'], resolve)
    },

    // 小程序
    {
        path: '/applets',
        name: 'applets',
        meta: {
            title: '小程序',
            titleEn: 'applets',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/applets/index.vue'], resolve)
    },

    // T盾帮扶
    {
        path: '/tHelp',
        name: 'tHelp',
        meta: {
            title: 'T盾帮扶',
            titleEn: 'T-help',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/applets/tHelp/THelp.vue'], resolve)
    },

    // 实名认证
    {
        path: '/c1',
        name: 'c1',
        meta: {
            title: '实名认证',
            titleEn: 'Verified',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/kyc/c1.vue'], resolve)
    },
    {
        path: '/c2',
        name: 'c2',
        meta: {
            title: '身份认证',
            titleEn: 'Authentication',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/kyc/c2.vue'], resolve)
    },

    // 设置
    {
        path: '/setting',
        name: 'setting',
        meta: {
            title: '设置',
            titleEn: 'Setting',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/setting/index.vue'], resolve)
    },

    // 支付绑定
    {
        path: '/payBind',
        name: 'payBind',
        meta: {
            title: '支付绑定',
            titleEn: 'pay-bind',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/payBind/index.vue'], resolve)
    },

    // 资产
    {
        path: '/assets',
        name: 'assets',
        meta: {
            title: '我的资产',
            titleEn: 'Assets',
            index: 1,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/assets/index.vue'], resolve)
    },
    {
        path: '/wallet',
        name: 'wallet',
        meta: {
            title: '钱包资产',
            titleEn: 'wallet',
            index: 2,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/assets/wallet/Wallet.vue'], resolve),
    },
    {
        path: '/deposit',
        name: 'deposit',
        meta: {
            title: '充值',
            titleEn: 'Deposit',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/assets/deposit.vue'], resolve)
    },
    {
        path: '/depositHistory',
        name: 'depositHistory',
        meta: {
            title: '充值列表',
            titleEn: 'Deposit list',
            index: 5,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/assets/depositHistory.vue'], resolve)
    },
    {
        path: '/depositDetail/:id',
        name: 'depositDetail',
        meta: {
            title: '充值记录',
            titleEn: 'Deposit record',
            index: 6,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/assets/depositDetail.vue'], resolve)
    },
    {
        path: '/withdrawal',
        name: 'withdrawal',
        meta: {
            title: '提现',
            titleEn: 'Withdraw',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/assets/withdrawal.vue'], resolve)
    },
    {
        path: '/withdrawalHistory',
        name: 'withdrawalHistory',
        meta: {
            title: '提现列表',
            titleEn: 'Withdraw list',
            index: 5,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/assets/withdrawalHistory.vue'], resolve)
    },
    {
        path: '/withdrawalDetail/:id',
        name: 'withdrawalDetail',
        meta: {
            title: '提现记录',
            titleEn: 'Withdraw record',
            index: 6,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/assets/withdrawalDetail.vue'], resolve)
    },
    {
        path: '/withdrawalSuc',
        name: 'withdrawalSuc',
        meta: {
            title: '提现成功',
            titleEn: 'Withdraw success',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/assets/withdrawalSuc.vue'], resolve)
    },
    {
        path: '/transfer',
        name: 'transfer',
        meta: {
            title: '划转',
            titleEn: 'Transfer',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/assets/transfer.vue'], resolve)
    },
    {
        path: '/fundRecord',
        name: 'fundRecord',
        meta: {
            title: '资金记录',
            titleEn: 'Fund record',
            index: 3,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/assets/fundRecord.vue'], resolve)
    },
    {
        path: '/lockhouse',
        name: 'lockhouse',
        meta: {
            title: '锁仓',
            titleEn: 'Locked warehouse',
            index: 3,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/assets/lockHouse.vue'], resolve)
    },

    // 用户中心
    {
        path: '/user',
        name: 'user',
        meta: {
            title: '我的',
            titleEn: 'Mine',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/index.vue'], resolve)
    },
    {
        path: '/security',
        name: 'security',
        meta: {
            title: '安全中心',
            titleEn: 'Security',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/security.vue'], resolve)
    },
    {
        path: '/withdrawalAddress',
        name: 'withdrawalAddress',
        meta: {
            title: '提币地址',
            titleEn: 'Withdraw address',
            index: 3,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/user/withdrawalAddress.vue'], resolve)
    },
    {
        path: '/addwithdrawalAddress',
        name: 'addwithdrawalAddress',
        meta: {
            title: '添加提币地址',
            titleEn: 'Add withdraw address',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/addwithdrawalAddress.vue'], resolve)
    },
    {
        path: '/nofish',
        name: 'nofish',
        meta: {
            title: '防钓鱼码',
            titleEn: 'Anti-fishing code',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/nofish.vue'], resolve)
    },
    {
        path: '/mine',
        name: 'mine',
        meta: {
            title: '我的资料',
            titleEn: 'My Profile',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/mine/index.vue'], resolve)
    },
    {
        path: '/edit',
        name: 'edit',
        meta: {
            title: '编辑资料',
            titleEn: 'Modify Profile',
            index: 6,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/mine/edit.vue'], resolve)
    },
    {
        path: '/invite',
        name: 'invite',
        meta: {
            title: '邀请好友',
            titleEn: 'Invite Friends',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/invite.vue'], resolve)
    },

    // 搜索
    {
        path: '/search',
        name: 'search',
        meta: {
            title: '搜索',
            titleEn: 'Search',
            index: 7,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/other/search.vue'], resolve)
    },

    // 地区选择
    {
        path: '/areaCode',
        name: 'areaCode',
        meta: {
            title: '地区选择',
            titleEn: 'AreaCode',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/other/areaCode.vue'], resolve)
    },

    // 公告
    {
        path: '/announcement',
        name: 'announcement',
        meta: {
            title: '公告',
            titleEn: 'Announcement',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/article/announcement.vue'], resolve)
    },
    {
        path: '/announcementDetail',
        name: 'announcementDetail',
        meta: {
            title: '公告详情',
            titleEn: 'Announcement detail',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/article/detail.vue'], resolve)
    },
    {
        path: '/service/:url',
        name: 'service',
        meta: {
            title: '用户协议',
            titleEn: 'User Agreement',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/article/service.vue'], resolve)
    },

    // 工单
    {
        path: '/workorder',
        name: 'workorder',
        meta: {
            title: '工单记录',
            titleEn: 'Work order record',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/user/workOrder/index.vue'], resolve)
    },
    {
        path: '/addworkorder',
        name: 'addworkorder',
        meta: {
            title: '提交工单',
            titleEn: 'Submit work order',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/workOrder/addworkOrder.vue'], resolve)
    },
    {
        path: '/chat/:id',
        name: 'chat',
        meta: {
            title: '回复工单',
            titleEn: 'Reply work order',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/user/workOrder/chat.vue'], resolve)
    },

    // 行情
    {
        path: '/quotes',
        name: 'quotes',
        meta: {
            title: '行情',
            titleEn: 'Markets',
            index: 1,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/quotes/index.vue'], resolve)
    },

    // 交易
    {
        path: '/trade',
        name: 'trade',
        meta: {
            title: '交易',
            titleEn: 'Trade',
            index: 1,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/trade/index.vue'], resolve)
    },
    {
        path: '/allorder',
        name: 'allorder',
        meta: {
            title: '全部委托',
            titleEn: 'All Orders',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/trade/allorder.vue'], resolve)
    },
    {
        path: '/tradedetail',
        name: 'tradedetail',
        meta: {
            title: '交易详情',
            titleEn: 'Trade detail',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/trade/tradeDetail.vue'], resolve)
    },
    {
        path: '/orderdetail/:id',
        name: 'orderdetail',
        meta: {
            title: '订单详情',
            titleEn: 'Order detail',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/trade/orderDetail.vue'], resolve)
    },

    // 认购
    {
        path: '/purchase',
        name: 'purchase',
        meta: {
            title: '认购',
            titleEn: 'Subscription',
            index: 1,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/purchase/index.vue'], resolve)
    },
    {
        path: '/mypurchase',
        name: 'mypurchase',
        meta: {
            title: '我的认购',
            titleEn: 'My subscription',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/purchase/mypurchase.vue'], resolve)
    },
    {
        path: '/miningdetail',
        name: 'miningdetail',
        meta: {
            title: '挖矿详情',
            titleEn: 'Mining detail',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/purchase/miningDetail.vue'], resolve)
    },
    {
        path: '/miningTeam',
        name: 'miningTeam',
        meta: {
            title: '挖矿团队',
            titleEn: 'Mining team',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/purchase/miningTeam.vue'], resolve)
    },
    {
        path: '/purchasedetail/:id',
        name: 'purchasedetail',
        meta: {
            title: '认购详情',
            titleEn: 'Subscription detail',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/purchase/purchaseDetail.vue'], resolve)
    },
    {
        path: '/introduction/:id',
        name: 'introduction',
        meta: {
            title: '认购介绍',
            titleEn: 'Introduction',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/purchase/introduction.vue'], resolve)
    },
    {
        path: '/goPurchase',
        name: 'goPurchas',
        meta: {
            title: '认购下单',
            titleEn: 'Go subscription',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/purchase/goPurchase.vue'], resolve)
    },

    // 活动
    {
        path: '/redEnvelope',
        name: 'redEnvelope',
        meta: {
            title: '红包',
            titleEn: 'Red envelope',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/redEnvelope.vue'], resolve)
    },
    {
        path: '/redDetail',
        name: 'redDetail',
        meta: {
            title: '领取详情',
            titleEn: 'Red detail',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/redDetail.vue'], resolve)
    },
    {
        path: '/share',
        name: 'share',
        meta: {
            title: '分享得更多',
            titleEn: 'share',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/share.vue'], resolve)
    },
    {
        path: '/shareImg',
        name: 'shareImg',
        meta: {
            title: '邀请海报',
            titleEn: 'Share img',
            index: 5,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/shareImg.vue'], resolve)
    },
    {
        path: '/spike',
        name: 'spike',
        meta: {
            title: '限时秒杀',
            titleEn: 'spike',
            index: 2,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/spike.vue'], resolve)
    },
    {
        path: '/mySpike',
        name: 'mySpike',
        meta: {
            title: '我的秒杀',
            titleEn: 'My spike',
            index: 3,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/activity/mySpike.vue'], resolve)
    },
    {
        path: '/bonus',
        name: 'bonus',
        meta: {
            title: '奖励金',
            titleEn: 'bonus',
            index: 3,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/bonus.vue'], resolve)
    },
    {
        path: '/myBonus',
        name: 'myBonus',
        meta: {
            title: '奖励金记录',
            titleEn: 'My bonus',
            index: 4,
            keepAlive: true
        },
        component: (resolve) => require(['@/views/activity/myBonus.vue'], resolve)
    },
    {
        path: '/checkIn',
        name: 'checkIn',
        meta: {
            title: '每日签到',
            titleEn: 'Check in',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/checkIn.vue'], resolve)
    },
    {
        path: '/airdrop',
        name: 'airdrop',
        meta: {
            title: '空投',
            titleEn: 'Airdrop',
            index: 4,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/activity/airdrop.vue'], resolve)
    },

    {
        path: '/url/:type',
        name: 'url',
        meta: {
            title: '跳转中',
            titleEn: 'Location...',
            index: 1,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/other/url.vue'], resolve)
    },

    // 下载
    {
        path: '/download',
        name: 'download',
        meta: {
            title: '下载页',
            titleEn: 'Download',
            index: 1,
            keepAlive: false
        },
        component: (resolve) => require(['@/views/other/download.vue'], resolve)
    },
];
export default router;