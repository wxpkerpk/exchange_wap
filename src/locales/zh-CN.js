const lang = {
    nav:{
        n1:"首页",
        n2:"行情",
        n3:"交易",
        n4:"认购",
        n5:"资产",
        back:"返回",
        fav:"自选",
    },
    form:{
        kline:{
            open:'开',
            high:'高',
            low:'低',
            close:'收',
            volume:'量'
        },
        public:{
            unprocess:"未处理",
            processing:"处理中",
            processed:"已完成"
        },
        sign:{
            password:"登录密码",
            signin:"登 录",
            signup:"注册",
            signOut:"退出登录",
            mSignin:"手机登录",
            eSignin:"邮箱登录",
            mSignup:"手机注册",
            eSignup:"邮箱注册",
            forget:"忘记密码？",
            resetPsw:"重置密码",
            psw:"密码",
            repPsw:"再次输入密码",
            inviteCode:"推荐码（非必填）",
            read:"同意",
            userRules:"隐私政策和服务条款",
            smsCode:"输入验证码",
            smsToast:"验证码已发送到您的手机<br/>请输入验证码",
            emailToast:"验证码已发送到您的邮箱<br/>请输入验证码",
            completed:"完成",
            changeMobile:"切换手机",
            changeEmail:"切换邮箱",
            country:"国家 / 地区",
            expire:"当前登录已过期，请重新登录"
        },
        kyc:{
            realname:"真实姓名",
            firstName:"姓",
            lastName:"名",
            idNumber:"证件号码",
            idType:"证件类型",
            idCard:"身份证",
            passport:"护照",
            face:"身份证正面",
            back:"身份证反面",
            hold:"手持证件照和字条",
            facePassport:"护照正面",
            backPassport:"护照反面",
            holdPassport:"手持护照和字条",
            note:"个人签字字条的内容包含：",
            date:"当天日期",
            img:"说明：图片格式限制为.JPG,.PNG,.JPEG，图片大小限制为8M.",
            kycLevel:"KYC等级",
            noKyc:"您还未认证KYC，请先认证！"
        },
        safe:{
            email:"电子邮箱",
            emailCode:"邮箱验证码",
            code:"验证码",
            mobile:"手机号码",
            smsCode:"短信验证码",
            oldPsw:"原密码",
            newPsw:"新密码",
            repPsw:"再次输入新密码",
            oldFundPsw:"原资金密码",
            newFundPsw:"资金密码",
            repFundPsw:"再次输入资金密码",
            t1:`说明：<br/>
            第一次设置资金密码的原密码为登录密码<br/>
            只有同时绑定了邮箱和手机才能修改交易密码`,
            changePsw:"修改密码"
        },
        workOrder:{
            type:"选择交易类型",
        }
    },
    home:{
        rise:"涨幅榜",
        fall:"跌幅榜",
        executed:"成交榜",
        features:{
            h1:"节点",
            h2:"奖励金",
            h3:"抢购",
            h4:"公告"
        }
    },
    table:{
        coin:"币种",
        volume:"成交量",
        price:"价格",
        change:"涨跌幅",
        high:"最高",
        low:"最低",
        time:"时间"
    },
    trade:{
        buyin:"买入",
        sellout:"卖出",
        marketPrice:"市价",
        limitPrice:"限价",
        inputPrice:"输入价格",
        inputAmount:"输入数量",
        amount:"交易额",
        number:"数量",
        nowOrder:"当前委托",
        allOrder:"全部委托",
        historyOrder:"历史委托",
        buy:"买",
        sell:"卖",
        orderPrice:"委托单价",
        orderNum:"委托数量",
        executed:"已成交",
        Unexecuted:"未成交",
        searchHistory:"搜索历史",
        clearSearch:"清除历史记录",
        goSignin:"去登录",
        confirmOrder:"确认订单",
        buyPair:"买入交易对",
        buyPrice:"买入单价",
        sellPair:"卖出交易对",
        sellPrice:"卖出单价",
        sumPrice:"交易总价",
        market:"市场",
        executedNum:"成交数量",
        executedPrice:"成交价格",
        title:"筛选",
        coin:"币种",
        tradeType:"交易类型",
        buyandsell:"买&卖",
        orderStatus:"订单状态",
        date:"日期",
        someExecuted:"部分成交",
        someCancel:"部分取消",
        canceled:"已取消",
        to:"至",
        cancelAll:"撤销全部",
        onlyNowPair:"仅显示当前交易对",
        clinch:'成交',
        entrust:"委托",
        deep:"深度",
        lastExecuted:"最新成交",
        buyNum:"买入数量",
        sellNum:"卖出数量",
        deepMerge:"深度合并",
        o1:"成交数量/数量",
        o2:"均价/价格",
        o3:"手续费",
        o4:"成交金额",
        orderdetail:"订单详情",
        canvas:{
            second:"秒",
            min: '分钟',
            hour: '小时', 
            day: '天',
            times: '分时',
        },
    },
    validate:{
        public:{
            search:"请输入搜索关键词",
            searchArea:"请输入国家或地区"
        },
        trade:{
            inputPair:"请选择币种"
        },
        kyc:{
            t1:"请输入真实姓名",
            t2:"请输入证件号码",
            t3:"请输入您的姓",
            t4:"请输入您的名",
        },
        sign:{
            password:"设置密码",
            newPsw:"请输入新密码",
            repPsw:"再次输入密码",
            inviteCode:"邀请码(选填)",
            mobile:"输入手机号码",
            email:"输入邮箱",
            fundPsw:"输入6位数字组成的资金密码",
        },
        safe:{
            e1:"输入电子邮箱",
            e2:"输入邮箱验证码",
            m1:"输入手机号码",
            m2:"输入短信验证码",
            c1:"输入验证码",
            t1:"输入原密码",
            t2:"输入新密码",
            t3:"再次输入新密码",
            fish:"请为您的邮箱设置防钓鱼码",
        },
        withdrawal:{
            t1:"请输入提币地址",
            t2:"最小提币数量为",
            t3:"请输入资金密码",
            t4:"请输入交易备注（选填）"
        },
        workOrder:{
            t1:"请输入您的主题",
            t2:"请点击选择币种名称",
            t3:"请在此输入交易ID或区块HASH...",
            t4:"请说明您的问题...",
            t5:"请输入您的问题"
        },
        purchase:{
            t1:"请输入认购数量",
            t2:"请输入抵扣金额"
        },
    },
    quotes:{
        index:{
            title:"行情",
        }
    },
    list:{
        nodata:"暂无数据",
        nomore:"没有更多了"
    },
    message:{
        public:{
            notEmpty:"请填写完所有选项！",
            smsSuc:"验证码发送成功！",
            oldPswError:"原密码格式错误",
            pswError:"请输入数字、字母、符号至少两种组合的6-16位密码！",
            fundError:"请输入6位数字组合的资金密码",
            repPswError:"两次密码输入不一致！",
            signinSuc:"登录成功",
            signupSuc:"注册成功",
            checked:"请确认勾选用户协议！",
            dataError:"获取数据失败！",
            modifySuc:"修改成功！",
            addSuc:"添加成功",
            submitSuc:"提交成功",
            systemTitle:'温馨提示',
            avatarSuc:"头像上传成功！",
            imgSuc:"图片保存成功",
            withdrawSuc:"提币地址删除成功",
            noFish:"钓鱼码不能为空"
        },
        sign:{
            mobileEmpty:"手机号不能为空",
            emailEmpty:"电子邮箱不能为空",
            passwordEmpty:"密码不能为空",
            mobileError:"手机号码格式错误",
            emailError:"电子邮箱格式错误",
            passwordError:"密码错误",
            smsCode:"验证码不能为空!",
            smsError:"验证码输入错误",
            signOut:"是否确认退出当前账号？",
            inviteCodeEmpty:"推荐码不能为空",
            signExpired:"登录已过期，请重新登录",
            userSigned:"用户已存在",
            noSignMobile:"该手机号还未被注册",
            noSignEmail:"该邮箱号还未被注册",
            noRepeat:"该账号已注册",
            noRegister:"当前用户不存在",
            robotError:"人机验证失败"
        },
        kyc:{
            s1:"【认证待审核】",
            s2:"【审核未通过】",
            s3:"kyc认证完成，请耐心等待审核结果！",
            n1:'您的认证已提交<br/>请耐心等待，审核会在1-3个工作日内完成',
            n2:'您的证件照与填写内容不匹配<br/>请重新认证！',
            idCardEmpty:"证件号码不能为空",
            idCardError:"证件号码格式错误",
            firstNameEmpty:"您的姓不能为空",
            lastNameEmpty:"您的名不能为空",
            allImg:"请确认上传所有证件照",
            oversize:"图片大小最高不超过8M，请先裁剪后再上传"
        },
        safe:{
            emailEmpty:"电子邮箱不能为空",
            emailCodeEmpty:"邮箱验证码不能为空",
            emailCodeSuc:"邮箱验证码发送成功！",
            emailError:"电子邮箱格式错误！",
            mobileEmpty:"手机号码不能为空",
            smsCodeEmpty:"短信验证码不能为空",
            smsCodeSuc:"短信验证码发送成功！",
            mobileError:"手机号码格式错误！",
            bindSuc:"绑定成功！",
            modifySuc:"修改成功！",
            oldPswEmpty:"原密码不能为空",
            newPswEmpty:"新密码不能为空",
            repPswEmpty:"确认密码不能为空",
            oldFundPswEmpty:"原资金密码不能为空",
            newFundPswEmpty:"新资金密码不能为空",
            oldFundPSwError:"原资金密码为空或错误！",
            fishSuc:"钓鱼码绑定成功！",
            mobileModal:"您已完成了手机绑定操作，如果您的手机号码{mobile}遗失或不再使用，请联系客服修改或提交工单进行修改",
            emailModal:"您已完成了邮箱绑定操作，如果您的邮箱{email}遗失或不再使用，请联系客服修改或提交工单进行修改",
            fundSuc:"资金密码修改成功",
            noFund:"您还未设置资金密码，请先设置"
        },
        deposit:{

        },
        withdrawal:{
            withdrawalEmpty:"提币地址不能为空",
            withdrawalNumEmpty:"提币数量不能为空",
            fundPswEmpty:"资金密码不能为空",
            checkSuc:"提币地址格式正确！",
            checkError:"提币地址格式错误！",
            min:"提币数量小于最低提币限制",
            max:"提币数量大于单笔提币限制",
            t1:"提币地址或提币数量为空或格式错误",
            kyc:"您未完成实名认证，无法提币",
            confirmDelete:"确认删除当前提币地址吗？",
            maxAmount:"当前提现金额大于单次提现金额",
            minAmount:"当前提现金额小于单次提现金额",
        },
        transfer:{
            minAmount:"最小划转数量为",
            maxAmount:"最大划转数量为",
            transferEmpty:"划转数量不能为空",
            transferSuc:"划转成功！",
            transferError:"划转数量错误",
        },
        trade:{
            price:"请输入或选择交易价格！",
            tradeSuc:"下单成功！",
            tradeFail:"下单失败！",
            cancelSuc:"撤单成功！",
            cancelFail:"撤单失败！",
            decimals:'{num}位小数',
        },
        workOrder:{
            suc:"工单提交成功！",
            themeEmpty:"问题不能为空",
            coinEmpty:"币种不能为空",
            introductionEmpty:"描述不能为空",
            imgError:"证明材料不能为空",
        },
        purchase:{
            minAmount:"认购数量最小为",
            maxAmount:"认购数量最大为",
            purchaseNumEmpty:"认购数量不能为空",
            over:"币币账户余额不足！",
            maxSale:"抵扣金额最大为",
            priceError:"当前奖励金余额不足！",
            purchaseSuc:"认购成功",
            spikeSuc:"秒杀成功",
            unStart:"认购还未开始，请耐心等待！",
            pending:"认购进行中，请快速参与！",
            finish:"认购已结束！",
            noMoney:"账户余额不足",
            paramsError:"请输入有效的划转数量",
            time: "DD天 HH:mm:ss"
        },
        airdrop:{
            success:"领取成功！",
            receive:"您已领过了，不能重复领取。"
        }
    },
    button:{
        public:{
            year:"年",
            month:"月",
            day:"日",
            submit:"提交",
            sent:"发送验证码",
            sending:"发送中",
            resend:"重新发送",
            confirm:"确定",
            cancel: "取消",
            know:"知道了",
            save:"保存",
            send:"发送",
            delete:"删除",
            next:"下一步",
            copySuc:"复制成功！",
            copyFail:"复制失败！",
            recharge:"去充值",
            confirmBuy:"确认购买",
            checkIn:"签到",
            checked:"今日已签到",
            help:"为TA助力",
            toGet:"马上去获取",
            addWithdraw:"添加地址",
            goConfirm:"去认证",
            recertification:"重新认证",
            copy:"复制地址"
        },
        user:{
            copy:"复制地址",
            copyTxid:"复制Txid",
            confirmTxid:"确认Txid",
            setting:'去设置',
        },
        trade:{
            reset:"重置"
        },
        purchase:{
            unstart:"未开始",
            now:"立即认购",
            end:"已结束",
            buy:"立即购买",
            miningTeam:"挖矿团队",
            invite:"邀请好友",
            makeOrder:"下单",
        },
        airdrop:{
            receive:"点击领取",
            received:"已领取",
            unReceive:"未领取"
        }
    },
    purchase:{
        title:"认购",
        mining:"挖矿",
        start:"认购即将开始",
        seeDetail:"查看详情>",
        totalRounds:"本轮总数",
        limitTime:"限时认购",
        last:"剩余 {number}",
        end:"已结束",
        power:"全网算力",
        nowPower:"当前算力",
        output:"全网产出",
        income:"累计收益",
        purchaseNum:"认购数量",
        purchasePrice:"认购价格",
        purchaseAmount:"认购总额",
        mypurchase:"我的认购",
        superMining:"超级挖矿",
        total:"发行总量",
        over:"当前剩余",
        stage:"当前阶段",
        countdown:"倒计时",
        active:"立即激活",
        developer:"发现者",
        buyPower:"购买算力",
        calc:"挖矿算法",
        powerPrice:"算力价格",
        exchange:"当前兑换",
        buyPrice:"购买金额",
        invite:"邀请好友",
        inviteMoney:"好友入金",
        powerAdd:"算力增益",
        inviteTotal:"累计邀请人数",
        onlineMining:"当前在线挖矿人数",
        coinName:"币种全称",
        myinvite:"我邀请的好友",
        step:"第 {step} 轮",
        deduction:"奖励金抵扣",
        deductionSale:"奖励金可抵扣",
        t1:"发现者每天可获得免费基础算力，每天激活算力即可参与挖矿，激活挖矿需要用户持仓不小于1000",
        t2:"在免费算力基础上，如果需要获取更多，您可以通过使用购买算力。所购买的算力根据挖矿算法释放。",
        t3:"您可以通过邀请好友参与挖矿的方式获取更多挖矿算力增加益，每邀请一名好友即可获得好友5%挖矿算力增益",
        t4:"邀请好友同时在线挖矿可获得额外挖矿率增益",
        totalAmount:"总量",
        released:"已释放",
        unReleased:"待释放",
        checkInDay:"累计签到 {total} 天",
        prizeAccount:"奖励金共{total}，可抵扣",
        purchaseTotal:"认购总额",
        purchaseCoin:'认购币种',
        min:"单次认购数量最少为{min} ",
        max:"单次认购数量最多为{max} ",
        limitBuy:"剩余可买",
        activityAndTime:"距离本次活动结束还剩：",
        purchaseTitle:"认购信息",
        whitePaper:"白皮书",
        internet:"官网",
    },
    user:{
        public:{
            chooseCoin:"选择币种",
            fundRecord:"资金记录",
            orderId:"订单ID",
            nowStatus:"当前状态：",
            success:"成功",
            failed:"失败",
            pending:"进行中",
        },
        index:{
            total:"总资产折合",
            deposit:"充值",
            withdrawal:"提现",
            transfer:"划转",
            lockhouse:"锁仓",
            other:"其他",
            search:"搜索",
            hide:"隐藏为0的资产",
            available:"可用",
            freeze:"冻结",
            apply:"已认购",
            equal:"折合",
            from:"从",
            to:"到",
            a1:"币币账户",
            a2:"奖励金账户",
            a3:"认购账户",
            b1:"币币总资产折合",
            b2:"奖励金总资产折合",
            b3:"认购总资产折合",
            t1:"奖励金抵扣部分请在“锁仓”中查看",
        },
        safe:{
            bindEmail:"电子邮箱",
            bindMobile:"手机号码",
            modifyPsw:"登录密码",
            modifyFundPsw:"资金密码",
            noFish:"防钓鱼码",
            bind:"已设置",
            unbind:"未设置",
        },
        kyc:{
            verified:"实名认证",
            authentication:"身份认证",
            verifiedSuc:"已完成实名认证",    
        },
        mine:{
            my:"个人中心",
            security:"安全中心",
            workOrder:"我的工单",
            myProfile:"我的资料",
            about:"关于我们",
            account:"账户",
            nick:"昵称",
            username:"用户名",
            t1:"注：用户名只能修改一次，请谨慎修改！"
        },
        setting:{
            set:"设置",
            notice:"通知",
            language:"语言",
            rate:"货币",
            day:"白天模式",
            dark:"夜间模式",
            chooseModal:"选择模式",
            chooseRate:"选择货币",
            system:"跟随系统",
        },
        deposit:{
            save:"长按二维码保存",
            depositAddr:"充币地址",
            t1: ` 温馨提示：<br/>
            • 最小充币数量为：{number} {symbol}<br>• 请勿向上述地址充值任何非{symbol}资产，否则将不可找回。<br/>`,
            depositRecord:"充值记录",
            date:"充币时间",
            depositNum:"充币数量",
            usdt:"暂仅支持 <b>ERC20</b> 的USDT"
        },
        withdrawal:{
            withdrawalAddr:"提币地址",
            addwithdrawalAddr:"添加提币地址",
            mdfwithdrawalAddr:"编辑提币地址",
            withdrawalNum:"提币数量",
            all:"全部",
            fee:"手续费",
            limit:"限额提示",
            minAmount:"单次最小提现",
            maxAmount:"单次最大提现",
            limitAmount:"单日限额",
            maxTimes:"单日提现最大次数",
            available:"可用",
            arriveNum:"到账数量",
            times:"次",
            withdrawalRecord:"提现记录",
            note:"备注",
        },
        transfer:{
            transferNum:"划转数量",
            transferToast:"划转提醒",
            minAmount:"单次最小划转",
            direction:"划转方向",
            t1:"只能从认购账户划转到币币账户"
        },
        article:{
            announcement:"公告"
        },
        workOrder:{
            submit:"提交工单",
            theme:"主题",
            hash:"交易ID或区块HASH",
            introduction:"简介",
            img:"图片（您可以上传三张图片）",
            assistant:"助手",
            add:"添加工单"
        },
        invite:{
            inviteRules:"邀请规则",
            inviteCode:"复制邀请码",
            inviteLink:"邀请链接",
            invitePeople:"累计邀请人数",
            invitePrize:"累计邀请奖励",
            touch:"长按保存",
            copy:"复制邀请链接",
            toast:"充值USDT额外送15%USDT，最高送20000USDT",
            save:"长按二维码保存",
            inviteFriends:"好友入金，邀请人再得 40USDT",
            people:"人脉奖",
            t1:"每邀请1名好友注册(KYC)，得10USDT<br/>上不封顶",
            t2:"好友首次USDT充值<br/>解锁价值{amount}USDT",
            t3:"好友认购额度的<br/>3%释放奖励金",
            noNumber:"不限数量",
            u:"泰达币",
            nocapped:"上不封顶",
            myinvite:"我的邀请",
            rmb:"元",
            person:"人",
            r1:`1.邀请新用户，并完成注册和实名认证，邀请人即可获得10USDT奖励金。新用户获得100平台币DOC，价值约3.5USDT，新用户加入电报群再得100DOC。<br/>
                2.邀请好友首次USDT充值，即可解锁约1.42USDT，不限制推广人数。<br/>
                3.邀请好友认购，认购额度的3%可用于释放奖励金。<br/>
                4.活动如有调整，以火盾平台官网更新为准，最终解释权归火盾所有。`
        },
    },
    activity:{
        title:"天天领现金",
        unchecked:"今日还未签到哦",
        value:"提现记录",
        happy:"狂欢不打烊",
        limitAmount:"USDT每日限量发放",
        congratulations:"恭喜发财，大吉大利",
        good:"恭喜你",
        getThirty:"成功获取30USDT",
        open:"开",
        sendOut:"今日已送出",
        share:"分享给好友，再领一次USDT",
        invite:"邀请新用户通过实名认证可获得更多奖励哦",
        getRecord:"获得记录",
        showList:"打款晒单",
        inviteMore:"邀请新用户可获得更多奖励哦",
        unWithdraw:"待提现",
        total:"累计到{total}就能提现到钱包",
        overTime:"后奖金将失效",
        stillNeed:"仅差",
        canGet:"可提现",
        code:"长按保存图片",
        helpOther:"为TA助力，双方都能得USDT",
        inviteFriends:"成功邀请好友获得了{sum}，币已到账",
        inviteLog:"用户{userName},帮你获得 {amount} USDT",
        prize:"{total}USDT已提现到您的账户<br/>请及时查看",
        help:"帮我助力，你我都能得USDT",
        pullPeople:"好友助力",
        oldPrice:"原价：",
        saveImg:"保存图片",
        sharePassword:"复制邀请口令",
        shareLink:"复制分享链接",
        spike:"限时秒杀",
        mySpike:"我的秒杀",
        countdown:"距本场秒杀结束",
        nowBuy:"正在抢购",
        nowStart:"即将开始",
        finished:"已结束",
        discount:"折比特币",
        spikeUnStarted:"当前秒杀活动还未开始",
        spikeFinished:"当前秒杀活动已结束",
        people:"人抢到",
        limit:"限量",
        bout:"份",
        for:"为",
        helpSuc:"助力成功",
        con:"恭喜TA获得",
        conY:"恭喜你获得",
        toStart:"开始",
        toEnd:"结束",
        rightBuy:"马上抢",
        toastMe:"即将开始",
        rules:"活动规则",
        spikeRules:"秒杀规则",
        buySuc:"抢购成功",
        buyFail:"抢购失败",
        noMoney:"余额不足，请先充值",
        buyPrice:"抢购价格",
        buyNum:"抢购数量",
        fundPsw:"资金密码",
        checkIn:"每日签到",
        invitePurchase:"邀请认购",
        bonus:"奖励金",
        myBonus:"我的奖励金",
        bonusRecord:"奖励金记录",
        checkRules:"签到规则",
        noFrozen:"如何释放奖励金?",
        checkSuc:"签到成功",
        hasRelease:"已释放",
        obtained:"总获得",
        getBonus:"获取奖励金",
        inviteNew:"邀请新用户",
        deposit:"充值USDT，赠送充值额度15%",
        inviteFirst:"邀请好友首次入金，获得40",
        signUpSuc:"好友注册并实名认证，获得10",
        levelBuy:"下级认购",
        dayCheck:"每日签到",
        goInvite:"去邀请",
        goCheckIn:"去签到",
        checked:'已签到',
        bonusRules:"奖励金规则",
        priceFreed:"已释放奖励金{amount}",
        noPrice:"奖励金余额不足，释放失败",
        all:"全部",
        get:"获得",
        release:"释放",
        checkInToast:"您今天已经签到过啦！",
        noBalance:"您的余额不足",
        yourFriends:"好友认购，获认购金额3%的奖励",
        helped:"您已助力过该用户！",
        yqkl:`【免费助力得30USDT】点击，¢<span>{url}</span>¢或复制该段文字，打开火盾`,
        zlsm:'好友复制以上文字，打开火盾 App领取福利',
        copySuc:"复制成功",
        noEnough:"当前金额不足以提现",
        getBouns:"获得奖励金",
        freeBonus:"释放奖励金",
        airdrop:"空投",
        p1:`1.认购金额的10%可用奖励金进行抵扣，抵扣部分将不参与回购计划。<br/>
            2.若使用非正常手段获取平台奖励（包括但不限于恶意重复刷奖励，使用恶意软件骗取奖励等），平台有权不发放奖励，已发放的奖励也将被扣除。<br/>
            3.本活动的最终解释权归火盾所有。如有疑问，请联系平台官方微信客服（火盾change）。`,

        s1:`1.每天20:00(UTC+8)开始抢购，每轮抢购人数上限为100人。<br/>
            2.抢购数额的大小为实际购买数额，不定额。由于市场行情波动较大，秒杀价格最终以实时价格为准，请注意您的账户余额，以保障付款成功。<br/>
            3.秒杀数量有限，抢完即止，秒杀成功后会直接充值到用户的币币账户，用户可随时提币交易。<br/>
            4.活动为秒杀，属于概率性事件，不能保证每一位用户都能抢购成功，最终以秒杀价支付成功作为评判标准，如未抢购成功，请关注其他活动。<br/>
            5.本活动的最终解释权归火盾所有。如有疑问，请联系平台官方微信客服（火盾change）。`,
        
        c1:`1.每天签到即可释放一定数额的奖励金。<br/>
            2.没有奖励金时，签到不会获得释放的奖励金。<br/>
            3.若使用非正常手段获取平台奖励（包括但不限于恶意重复刷奖励，使用恶意软件骗取奖励等），平台有权不发放奖励，已发放的奖励也将被扣除。<br/>
            4.本活动的最终解释权归火盾所有。如有疑问，请联系平台官方微信客服（火盾change）。`,
        
        a1:`1.用户可以通过好友分享及邀请好友助力的方式获得现金红包。<br/>
            2.用户在72小时内累计现金数额达到30USDT即可提现，逾期则失效。<br/>
            3.用户积累的现金红包金额达到提现金额，点击提现后会自动充值到用户的币币账户。<br/>
            4.若使用非正常手段获取平台奖励（包括但不限于恶意重复刷奖励，使用恶意软件骗取奖励等），平台有权不发放奖励，已发放的奖励也将被扣除。<br/>
            5.本活动的最终解释权归火盾所有，如有疑问，请联系平台官方微信客服（火盾change）。`,
        
        b1:`1.邀请新用户完成实名认证后，邀请人可获得10USDT的奖励金；被邀请人完成第一笔USDT充值，邀请人可额外获得40USDT的奖励金；不限制推广人数。<br/>
            2.认购计划中，认购额度的10%可用奖励金抵扣，抵扣部分不参与项目方回购计划。<br/>
            3.用户完成任意数额的USDT充值之后，会额外赠送当次充值金额的15%作为奖励金；奖励金可多次获得，奖励金总金额上限为20000USDT。<br /><br/>
            如何释放奖励金<br/>
            1.邀请的新用户完成USDT充值，邀请人即可释放一定数额的奖励金（约1.42USDT），不限制邀请人数。<br/>
            2.被邀请人参与认购（用抵扣金的部分不计算在内），邀请人可获得单笔认购金额的3%作为返利，不限制次数。<br/>
            3.每天签到即可释放一定数额的奖励金。<br/><br/>
            其他说明<br/>
            1.若使用非正常手段获取平台奖励（包括但不限于恶意重复刷奖励，使用恶意软件骗取奖励等），平台有权不发放奖励，已发放的奖励也将被扣除。<br/>
            2.本活动的最终解释权归火盾所有。如有疑问，请联系平台官方微信客服（火盾change）。`,

        i1:`1.邀请新用户，并完成注册和实名认证，邀请人即可获得10USDT奖励金。新用户获得100平台币DOC，价值约3.5USDT，新用户加入电报群再得100DOC。<br/>
            2.邀请好友首次USDT充值，即可解锁价值10元的USDT，不限制推广人数。<br/>
            3.邀请好友认购，认购额度的3%可用于释放奖励金。<br/>
            4.活动如有调整，以火盾平台官网更新为准，最终解释权归火盾所有。`
    },
    filter:{
        all:"全部",
        withdraw:"提现",
        desposit:"充值",
        invite:"邀请奖励",
        system:"系统赠送",
        activity:"活动赠送",
        tradeIn:"成交",
        tradeOut:"下单",
        fee:"手续费",
        transferIn:"划入",
        transferOut:"划出",
        unLockIn:"释放获得",
        unLockOut:"释放流出",
        purchase:'认购',
        unLock:'解锁',
    },
    endNotice:{
        signin:{
            overTimes:"超过登录次数", // 900
            error:"账号或密码错误", // 40001
            limitAccount:"账号被限制登录", // 40103
            codeError:"验证码错误", // 701
            codeRepeat:"验证码重复发送", // 703
            twice:"需要二次验证", // 40102
        },
        signup:{
            paramsError:"数据格式错误", // 700
            codeError:"验证码错误", // 701
            hasAccount:"账号已存在", // 901
        },
        sms:{
            smsError:"短信模块不存在", // 900
            limitTimes:"超过发送限制次数", // 700,

        },
        bind:{ // emial / telphone
            paramsError:"数据格式错误", // 700
            codeError:"验证码错误", // 701
            hasAccount:"账号已存在", // 901
        },
        fish:{
            paramsError:"数据格式错误", // 700
        },
        order:{
            limitOrder:"下单限制", // 40003
            timeOut:"时间过期", // 989
            signatureExpired:"交易签名过期", // 801
            signatureError:"交易签名错误", // 802
            paramsError:"数据格式错误", // 700
            noMoney:"余额不足", // 800
        },
        purchase:{
            timeExpired:"认购活动还未开始", // 990
            fundPswError:"资金密码错误", // 40002
            noNumber:"剩余认购币种数量不足", // 604
            noMoney:"余额不足", // 800
            noRange:"认购数量不在最小和最大范围之间", // 700
            noRemind:"可认购数量不足", // 601
        },
        spike:{
            timeExpired:"秒杀活动还未开始", // 990
            fundPswError:"资金密码错误", // 40002
            noNumber:"当前交易数量不足", // 604
            noMoney:"余额不足", // 800
            noRange:"秒杀数量不在最小和最大范围之间", // 700
        },
        checkIn:{
            checkRepeat:"您已经签到过了啦！", // 901 
        },
     
        forgot:{ // emial / telphone
            paramsError:"数据格式错误", // 700
            codeError:"验证码错误", // 701
        },
        modifyPsw:{ // psw / fundPsw
            paramsError:"密码错误，请重新输入", // 700
            codeError:"验证码错误", // 701
            overtimes:"超过次数限制" // 900 fundPsw
        },
        withdraw:{
            noKyc:"未认证KYC，无法提币", // 602
            userLimit:"用户被限制提现", // 40003
            coinLimit:"当前币种无法提现", // 902
            noFundPsw:"当前未设置资金密码", // 601
            fundPswError:"资金密码错误", // 40002
            codeError:"验证码错误", // 701
            noMoney:"余额不足", // 800
        }
    },
    other:{
        isSaveImg:'是否保存此图片？',
        findIos:"发现Ios新版本 V",
        findAd:"发现Android新版本 V",
        isUpdate:"是否立刻更新？",
        imgUpload:"图片上传中，请稍后...",
        chooseImg:"选择图片",
        uploadSure:"确认上传",
        imgType:"图片类型必须是.gif,jpeg,jpg,png,bmp中的一种",
        imgSize:"上传图片不能超过5M",
        goChoose:"请选择需要上传的图片"
    },
    update:{
        version:"当前版本：{version}（Build 18）",
        apple:"苹果下载",
        android:"安卓下载",
        app:"APP下载",
        fast:"一站式交易平台，随时随地快人一步"
    },
    network:{
        unknown:"未知连接",
        none:"未连接",
        ethernet:"以太网连接",
        wifi:"WiFi 连接",
        cellularTwo:"蜂窝2G连接",
        cellularThree:"蜂窝3G连接",
        cellularFour:"蜂窝4G连接",
        isWifi:"当前网络为WiFi",
        noWifi:"当前网络非WiFi，可能会出现数据加载缓慢问题...",
        noNetwork:"当前没有网络",
        copySuc:"已成功复制到剪贴板"
    }
}
export default lang;