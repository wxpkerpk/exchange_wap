const lang = {
    nav:{
        n1:"Home",
        n2:"Markets",
        n3:"Trade",
        n4:"Subscription",
        n5:"Balances",
        back:"Back",
        fav:"Fav",
    },
    form:{
        kline:{
            open:'O',
            high:'H',
            low:'L',
            close:'C',
            volume:'Volume'
        },
        public:{
            unprocess:"Unprocessed",
            processing:"Processing",
            processed:"Completed"
        },
        sign:{
            password:"Password",
            signin:"Sign in",
            signup:"Sign up",
            signOut:"Logout",
            mSignin:"Phone",
            eSignin:"Email",
            mSignup:"Phone",
            eSignup:"Email",
            forget:"Forgot password",
            resetPsw:"Reset password",
            psw:"Password",
            repPsw:"Repeat password",
            inviteCode:"Referal code",
            read:"I agree to the",
            userRules:"Terms and Conditions.",
            smsCode:"Enter confirmation code",
            smsToast:"We've send you an SMS code to verify your phone number.<br/>Please enter the code below",
            emailToast:"We've send you an SMS code to verify your email.<br/>Please enter the code below",
            completed:"Completed",
            changeMobile:"Switch phone",
            changeEmail:"Switch email",
            country:"Country / Area",
            expire:"The current login has expired, please sign in again"
        },
        kyc:{
            realname:"Realname",
            firstName:"Last name",
            lastName:"First Name",
            idNumber:"ID number",
            idType:"ID type",
            idCard:"ID card",
            passport:"Passport",
            face:"ID card front",
            back:"ID card back",
            hold:"Hand-held ID photo and note",
            facePassport:"Passport front",
            backPassport:"Passport back",
            holdPassport:"Hand-held passport and note",
            note:"The content of the personal signature entry contains:",
            date:"Date",
            img:"Description: The image format is limited to .JPG, .PNG, .JPEG, and the image size is limited to 8M.",
            kycLevel:"KYC Level",
            noKyc:"You have not certified KYC, please authenticate first!"
        },
        safe:{
            email:"Email",
            emailCode:"Email code",
            code:"Code",
            mobile:"Phone number",
            smsCode:"Sms Code",
            oldPsw:"Old password",
            newPsw:"New password",
            repPsw:"Enter the new password again",
            oldFundPsw:"Old fund password",
            newFundPsw:"fund password",
            repFundPsw:"Enter the fund password again",
            t1:`Description:<br/>
            The original password for setting the fund password for the first time is the login password.<br/>
            Only the mailbox and mobile phone can be bound at the same time to modify the transaction password.`,
            changePsw:"change Password"
        },
        workOrder:{
            type:"Select transaction type",
        }
    },
    home:{
        rise:"Gainers",
        fall:"Losers",
        executed:"Transaction",
        features:{
            h1:"Book in",
            h2:"Free USDT",
            h3:"Flash sale",
            h4:"Subscription",
            h5:"Bonus",
            h6:"Invite",
            h7:"Deposit",
            h8:"Announcement"
        },
    },
    table:{
        coin:"Pair",
        volume:"Volume",
        price:"Price",
        change:"Change",
        high:"High",
        low:"Low",
        time:"Time"
    },
    trade:{
        buyin:"BUY",
        sellout:"SELL",
        marketPrice:"Market order",
        limitPrice:"Limit order",
        inputPrice:"Price",
        inputAmount:"Amount",
        amount:"Total",
        number:"Amount",
        nowOrder:"Pending",
        allOrder:"All Orders",
        historyOrder:"History",
        buy:"BUY",
        sell:"SELL",
        orderPrice:"Price",
        orderNum:"Amount",
        executed:"Deal",
        Unexecuted:"Not Deal",
        searchHistory:"History Search",
        clearSearch:"Clear",
        goSignin:"Sign in",
        confirmOrder:"Confirm Order",
        buyPair:"Pair",
        buyPrice:"Price",
        sumPrice:"Total",
        market:"Market",
        executedNum:"Vol",
        executedPrice:"Price",
        title:"Selection",
        coin:"Coin",
        tradeType:"Type",
        buyandsell:"Buy&Sell",
        orderStatus:"Order Status",
        date:"Date",
        someExecuted:"Part Deal",
        someCancel:"Part Cancel",
        canceled:"Canceled",
        to:"To",
        cancelAll:"Revoke all",
        onlyNowPair:"Show only current transaction pairs",
        clinch:'Deal',
        entrust:"Entrust",
        deep:"Depth",
        lastExecuted:"Deal",
        buyNum:"Buy quantity",
        sellNum:"Sell quantity",
        deepMerge:"Precistion",
        o1:"Filled/Amount",
        o2:"Avge/Price",
        o3:"Fee",
        o4:"Total",
        orderdetail:"Order detail",
        canvas:{
            second:"min",
            min: 'Min',
            hour: 'Hour', 
            day: 'Day',
            times: 'Times',
        },
    },
    validate:{
        public:{
            search:"Enter a name",
            searchArea:"Enter a country or region"
        },
        trade:{
            inputPair:"Please select currency"
        },
        kyc:{
            t1:"Enter real name",
            t2:"Enter ID number",
            t3:"Enter the last name",
            t4:"Enter the first name",
        },
        sign:{
            password:"Enter the password",
            newPsw:"Enter the new password",
            repPsw:"Enter the password again",
            inviteCode:"Enter the recommendation code",
            mobile:"Enter the phone number",
            email:"Enter the email",
            fundPsw:"The fund password consists of 6 digits",
        },
        safe:{
            e1:"Enter th email",
            e2:"Enter th email code",
            m1:"Enter the phone number",
            m2:"Enter the sms code",
            c1:"Enter code",
            t1:"Enter the old password",
            t2:"Enter the new password",
            t3:"Enter the new password again",
            fish:"Set the Anti-fishing code"
        },
        withdrawal:{
            t1:"Enter the address",
            t2:"Limit amount ",
            t3:"Enter the fund password",
            t4:"Enter a note (optional)"
        },
        workOrder:{
            t1:"Enter your question",
            t2:"Select currency",
            t3:"Enter the transaction ID or block HASH",
            t4:"Describe your question",
            t5:"Enter your question"
        },
        purchase:{
            t1:"Enter amount",
            t2:"Enter the deduction amount"
        }
    },
    quotes:{
        index:{
            title:"Market",
        }
    },
    list:{
        nodata:"No Record",
        nomore:"No more"
    },
    message:{
        public:{
            notEmpty:"Enter all options!",
            smsSuc:"The verification code was sent successfully!",
            oldPswError:"old password format error",
            pswError:"Please enter a 6-16 digit password with at least two combinations of numbers, letters, and symbols!",
            fundError:"Please enter a 6-digit combination of funds password",
            repPswError:"The password input is inconsistent twice!",
            signinSuc:"Login successful",
            signupSuc:"Registration successful",
            checked:"Please make sure to check the user agreement!",
            dataError:"Failed to get data!",
            modifySuc:"Modify successful!",
            addSuc:"add successfully!",
            submitSuc:"Submit successfully",
            systemTitle:'Friendship Tips',
            avatarSuc:"The avatar was uploaded successfully!",
            imgSuc:"Picture saved successfully!",
            withdrawSuc:"The coin address was deleted successfully.",
            noFish:"Fishing code cannot be empty"
        },
        sign:{
            mobileEmpty:"Phone number cannot be empty!",
            emailEmpty:"Email cannot be empty!",
            mobileError:"Phone number format error!",
            emailError:"Email format error!",
            passwordEmpty:"Password cannot be empty!",
            passwordError:"password format error!",
            smsCode:"Sms code cannot be empty!",
            smsError:"Sms code input error",
            signOut:"Do you really want to logout？",
            inviteCodeEmpty:"Invite code cannot be empty!",
            signExpired:"Login has expired, please log in again!",
            userSigned:"User already exists",
            noSignMobile:"The mobile  does not exist",
            noSignEmail:"The email  does not exist",
            noRepeat:"The account already exists",
            noRegister:"The user does not exist",
            robotError:"Machine verification failed"
        },
        kyc:{
            s1:"【Pending】",
            s2:"【Pass failed】",
            s3:"Kyc certification is complete, please be patient and wait for the results!",
            n1:'Your certification has been submitted. Please be patient and the review will be completed within 1-3 business days.',
            n2:'Your ID photo does not match what you filled in. <br/> Please try again!',
            idCardEmpty:"ID card cannot be empty!",
            idCardError:"ID card format error!",
            firstNameEmpty:"Lastname cannot be empty!",
            lastNameEmpty:"Firstname cannot be empty!",
            allImg:"Please confirm uploading all ID photos",
            oversize:"The maximum size of the image is no more than 8M. Please cut it before uploading."
        },
        safe:{
            emailEmpty:"Email cannot be empty!",
            emailCodeEmpty:"Email code cannot be empty!",
            emailCodeSuc:"Email code sent successfully!",
            emailError:"Email format error!",
            mobileEmpty:"Phone number cannot be empty!",
            smsCodeEmpty:"Sms code cannot be empty!",
            smsCodeSuc:"Sms code sent successfully!",
            mobileError:"Phone number format error!",
            bindSuc:"Bind Successful!",
            modifySuc:"Modify Successful!",
            oldPswEmpty:"Old password cannot be empty!",
            newPswEmpty:"New password cannot be empty!",
            repPswEmpty:"Confirm password cannot be empty!",
            oldFundPswEmpty:"Old Fund password cannot be empty!",
            newFundPswEmpty:"New Fund password cannot be empty!",
            oldFundPSwError:"Old Fund password format error or empty!",
            fishSuc:"Fishing code binding is successful!",
            mobileModal:"You have completed the phone binding operation. If your mobile phone number is lost or no longer used, please contact customer service to modify or submit the work order to modify.",
            emailModal:"You have completed the email binding operation. If your mailbox is lost or no longer used, please contact customer service to modify or submit the work order to modify.",
            fundSuc:"The fund password modified successfully",
            noFund:"Please set your fund password"
        },
        deposit:{

        },
        withdrawal:{
            withdrawalEmpty:"Address cannot be empty!",
            withdrawalNumEmpty:"Amount cannot be empty!",
            fundPswEmpty:"Fund password cannot be empty!",
            checkSuc:"Address format is correct!",
            checkError:"Address format is error!",
            min:"The amount of withdraw is less than the minimum withdraw limit!",
            max:"The amount of withdraw is greater than the minimum withdraw limit!",
            t1:"The address or the number of withdraw is empty or the format is wrong.",
            kyc:"You have not completed real-name certification and cannot withdraw coins.",
            confirmDelete:"Are you sure to delete the current billing address?",
            maxAmount:"The premise cash amount is greater than the single cash withdrawal amount",
            minAmount:"The premise cash amount is less than the single cash withdrawal amount",
        },
        transfer:{
            minAmount:"The minimum number of transfers is",
            maxAmount:"The maximum number of transfers is",
            transferEmpty:"The number of transfers cannot be empty",
            transferSuc:"Transfer successfully！",
            transferError:"Wrong number of transfers",
        },
        trade:{
            price:"Please enter or select the transaction price!",
            tradeSuc:"Successful Order!",
            tradeFail:"Failed Order!",
            cancelSuc:"Cancel successful!",
            cancelFail:"Cancel Failed!",
            decimals:'{num} decimals',
        },
        workOrder:{
            suc:"Work order submitted successfully!",
            themeEmpty:"Question cannot be empty",
            coinEmpty:"Currency cannot be empty",
            introductionEmpty:"Description cannot be empty",
            imgError:"Proof material cannot be empty",
        },
        purchase:{
            minAmount:"The minimum number of subscriptions is",
            maxAmount:"The maximum number of subscriptions is",
            purchaseNumEmpty:"The number of subscriptions cannot be empty",
            over:"Insufficient balance in the currency account！",
            maxSale:"The maximum amount of deduction is",
            priceError:"Insufficient current bonus balance！",
            purchaseSuc:"Successful subscription",
            spikeSuc:"Spike success",
            unStart:"The subscription has not started yet, please be patient!",
            pending:"The subscription is in progress, please participate quickly!",
            finish:"Subscription has ended!",
            noMoney:"Insufficient account balance",
            paramsError:"Please enter a valid number",
            time: "DD d HH:mm:ss"
        },
        airdrop:{
            success:"Receive success!",
            receive:"You have already received it. You cannot receive it again."
        }
    },
    button:{
        public:{
            year:"",
            month:"",
            day:"",
            submit:"Submit",
            sent:"Send Code",
            sending:"Sent",
            resend:"Resend",
            confirm:"Confirm",
            cancel: "Cancel",
            know:"OK",
            save:"Save",
            send:"Send",
            next:"Next",
            delete:"Delete",
            copySuc:"Copy successful!",
            copyFail:"Copy Failed",
            recharge:"Go deposit",
            confirmBuy:"Confirm Buy",
            checkIn:"Book in",
            checked:"Booked in today",
            help:"Help him",
            toGet:"To get",
            addWithdraw:"Add address",
            goConfirm:"To go",
            recertification:"Try Again",
            copy:"Copy address"
        },
        user:{
            copy:"Copy",
            copyTxid:"Copy Txid",
            confirmTxid:"Confirm Txid",
            setting:'Setting',
        },
        trade:{
            reset:"Reset"
        },
        purchase:{
            unstart:"Not Start",
            now:"Subscribe",
            buy:"Buy Now",
            end:"Over",
            buy:"Go Buy",
            miningTeam:"Mining team",
            invite:"Inviting Now",
            makeOrder:"Make Order",
        },
        airdrop:{
            receive:"Go Receive",
            received:"Received",
            unReceive:"unReceived"
        }
    },
    purchase:{
        title:"Subscription",
        mining:"Mining",
        start:"Subscription is about to begin",
        end:"Ended",
        seeDetail:"See Details>",
        totalRounds:"Total",
        limitTime:"Limited subscription",
        last:"Remind {number}",
        power:"Whole network computing power",
        nowPower:"Current computing power",
        output:"Whole network output",
        income:"Accumulated income",
        purchaseNum:"Subscribed",
        purchasePrice:"Price",
        purchaseAmount:"Amount",
        mypurchase:"My subscription",
        superMining:"Super mining",
        total:"Total Issuance",
        over:"Remain",
        stage:"Stage",
        countdown:"Countdown",
        active:"Immediate activation",
        developer:"Discoverer",
        buyPower:"Purchasing power",
        calc:"Mining algorithm",
        powerPrice:"Calculated price",
        exchange:"Current exchange",
        buyPrice:"Purchase amount",
        invite:"Invite Friends",
        inviteMoney:"Friend deposit",
        powerAdd:"Force gain",
        inviteTotal:"Invitations",
        onlineMining:"Current online mining population",
        coinName:"Name",
        myinvite:"My invited friend",
        step:"The {step} Round",
        deduction:"Deductible amount",
        deductionSale:"Bonus deductible",
        t1:"The discoverer can get free basic computing power every day, and activate the computing power every day to participate in the mining of mineral coins. The activation of mining requires the user to hold a position of not less than 1000.",
        t2:"On the basis of free computing power, if you need to get more coins, you can buy power by using. The calculated power is released according to the mining algorithm.",
        t3:"You can get more mining gains by inviting your friends to participate in mining. You can get a friend's 5% mining power gain every time you invite a friend.",
        t4:"Invite friends to mine at the same time to gain additional mining rate gain",
        totalAmount:"Toatl",
        released:"Released",
        unReleased:"Unreleased",
        checkInDay:"Accumulated book in {total} days",
        prizeAccount:"Reward bonus {total}，deductible ",
        purchaseTotal:"Total",
        purchaseCoin:'Subscription coin',
        min:"Minimum subscription {min} ",
        max:"Maximum subscription {max} ",
        limitBuy:"The rest can be bought",
        activityAndTime:"At the end of the event: ",
        purchaseTitle:"Subscription information:",
        whitePaper:"whitePaper",
        internet:"Official Website",
    },
    user:{
        public:{
            chooseCoin:"Select",
            fundRecord:"Fund record",
            orderId:"Order ID",
            nowStatus:"Current status:",
            success:"Success",
            failed:"Failed",
            pending:"Pending",
        },
        index:{
            total:"Balances",
            deposit:"Deposit",
            withdrawal:"Withdraw",
            transfer:"Transfer",
            lockhouse:"Locked",
            other:"Other",
            search:"Search",
            hide:"Exclude 0 amounts",
            available:"Available",
            freeze:"Freeze",
            apply:"Apply",
            equal:"Equivalent",
            from:"From",
            to:"To",
            a1:"Exchange",
            a2:"Bonus",
            a3:"Subscribe",
            b1:"Balances",
            b2:"Balances",
            b3:"Balances",
            t1:'Please check the deduction part of bonus in "Locked"',
        },
        safe:{
            bindEmail:"Bind email",
            bindMobile:"Bind Phone",
            modifyPsw:"Modify password",
            modifyFundPsw:"Modify fund password",
            noFish:"Anti-fishing code",
            bind:"Has Set",
            unbind:"Not Set",
        },
        kyc:{
            verified:"Verified",
            authentication:"Authentication",
            verifiedSuc:"Verified has been completed"    
        },
        mine:{
            my:"Personal Center",
            security:"Security Center",
            workOrder:"My work order",
            myProfile:"My Profile",
            about:"About Me",
            account:"Account",
            nick:"Nickname",
            username:"Username",
            t1:"Note: User name can only be modified once, please be careful to modify!"
        },
        setting:{
            set:"Setting",
            notice:"Notifications",
            language:"Language",
            rate:"Currency",
            day:"Day Mode",
            dark:"Night Mode",
            chooseModal:"Select Mode",
            chooseRate:"Select currency",
            system:"Follow system",
        },
        deposit:{
            save:"Long press the QR code to save",
            depositAddr:"Deposit address",
            t1: `Warm tips: <br/>
            • The minimum number of coins is: {number} {symbol}<br>• please do not <br/> deposit any not {symbol} assets to the above address,<br/> otherwise it will not be recovered. `,
            depositRecord:"Deposit Record",
            date:"Time",
            depositNum:"Amount",
            usdt:"Only support USDT(<b>ERC20</b>)"
        },
        withdrawal:{
            withdrawalAddr:"Address",
            addwithdrawalAddr:"Add withdraw address",
            mdfwithdrawalAddr:"Edit withdraw address",
            withdrawalNum:"Amount",
            all:"All",
            fee:"Handling fee",
            limit:"Limit prompt",
            minAmount:"Single minimum withdrawal",
            maxAmount:"Single maximum withdrawal",
            limitAmount:"One-day limit",
            maxTimes:"Single maximum times",
            available:"Available",
            arriveNum:"Arrivals",
            times:"times",
            withdrawalRecord:"Withdraw record",
            note:"Note",
        },
        transfer:{
            transferNum:"Amount",
            transferToast:"Transfer reminder",
            minAmount:"Single minimum transfer",
            direction:"Transfer direction",
            t1:"Can only be transferred from the subscription account to the balance account"
        },
        article:{
            announcement:"Announcement"
        },
        workOrder:{
            submit:"Submit work order",
            theme:"Theme",
            hash:"Transaction ID or block HASH",
            introduction:"Introduction",
            img:"Picture (you can upload three pictures)",
            assistant:"assistant",
            add:"Add"
        },
        invite:{
            inviteRules:"Invite Rules",
            inviteCode:"Invite code",
            inviteLink:"Invite link",
            invitePeople:"Total People",
            invitePrize:"Accumulated rewards",
            touch:"Long press to save",
            copy:"Copy",
            toast:"Recharge USDT to send 15% USDT, up to 20000USDT",
            save:"Long tap to save QR code",
            inviteFriends:"Friend Deposit, Inviter will get 40 USDT again.",
            people:"Connection award",
            t1:"Invite 1 friend（complete KYC），<br/>get bonus（10 USDT），Unlimited",
            t2:"Friends for the first time<br/> USDT deposit unfreeze <br/>USDT worth {amount} USDT.",
            t3:"3% of the friend’s <br/>subscription amount can<br/> unfreeze your bonus.",
            noNumber:"Unlimited number",
            u:"USDT",
            nocapped:"Not capped",
            myinvite:"My Earnings",
            rmb:"RMB",
            person:"people",
            r1:`1.Invite new users to complete KYC, the inviter will receive 10USDT bonus. The new user gets 100 DOC, worth about 3.5USDT. The new user join telegram to gets 100 DOC again.<br/>
            2.Invite a friend to deposit the USDT for the first time, and then you can unfreeze about 1.42 USDT. There is no limit to the number of promotion.<br/>
            3.Invite a friend to subscribe, 3% of the subscription amount can be used to unfreeze the bonus.<br/>
            4.If the program is adjusted, please refer to the update on dogex.app ,The final interpretation right shall be owned by DOGEX.`
        },
        upload:{
            image:"Please choose Image"
        }
    },
    
    activity:{
        title:"Free USDT",
        unchecked:"Not signed today",
        value:"Record",
        happy:"Carnival does not fight",
        limitAmount:"USDT limited daily release",
        congratulations:"Congratulations to you",
        good:"Congratulations",
        getThirty:"Succeed to get 30 USDT",
        open:"Open",
        sendOut:"Today has Sent",
        share:"Share To Get More USDT",
        invite:"invite new users and complete KYC to get more rewards.",
        getRecord:"Records",
        showList:"Rewards",
        inviteMore:"Invite new users to complete KYC to get more Free USDT",
        unWithdraw:"Pending",
        total:"Accumulated to {total} to withdraw",
        overTime:" bonus will expire",
        stillNeed:"Need",
        canGet:"Can get ",
        code:"Long press to save the picture",
        helpOther:"You and your friend will get free USDT",
        inviteFriends:"Invite {num} friends to get 30 USDT, the currency has been received",
        inviteLog:"Consumer {userName},Help you get {amount} USDT",
        prize:"{total} Submitted to your account<br/>Please check it out",
        help:"Both inviter and invitee will get free USDT",
        pullPeople:"Go to Invite",
        oldPrice:"Original:",
        saveImg:"Save picture",
        sharePassword:"Copy KEY",
        shareLink:"Copy invite link",
        spike:"Flash Sale",
        mySpike:"My spike",
        countdown:"End of the spike",
        nowBuy:"Pending",
        nowStart:"Unstarted",
        finished:"Ended",
        discount:" off bitcoin",
        spikeUnStarted:"The current spike activity has not yet started",
        spikeFinished:"The current spike activity has ended",
        people:" people got",
        limit:"Limit",
        bout:"copies",
        for:"For",
        helpSuc:"Help successful",
        con:"Congratulations to TA",
        conY:"Congratulations on getting",
        toStart:"Start",
        toEnd:"End",
        rightBuy:"Buy",
        toastMe:"Unstarted",
        rules:"Activity rules",
        spikeRules:"Flash sale rule",
        buySuc:"Purchase successful",
        buyFail:"Purchase Failed",
        noMoney:"Balance no money",
        buyPrice:"price",
        buyNum:"Number",
        fundPsw:"Fund password",
        checkIn:"Daily Book-in",
        invitePurchase:"Invitation to subscribe",
        bonus:"Bouns",
        myBonus:"My bonus",
        bonusRecord:"Bouns record",
        checkRules:"Book-in  Rules",
        noFrozen:"How to unfreeze bonuses？",
        checkSuc:"Book in successfully",
        hasRelease:"hasReleased",
        obtained:"Total",
        getBonus:"Get rewards",
        inviteNew:"Invite new users",
        deposit:"Deposit USDT and give 15% <br/> credit ",
        inviteFirst:"Invite friends to deposit and get 40",
        signUpSuc:"Register success can get 10",
        levelBuy:"Down purchase",
        dayCheck:"Daily Book In",
        goInvite:"Go invite",
        goCheckIn:"Go Book-in",
        checked: 'Booked in',
        bonusRules:"Bonus Rules",
        priceFreed:"Released bonus {amount}",
        noPrice:"Insufficient bonus balance, release failed",
        all:"All",
        get:"Get",
        release:"Freed",
        checkInToast:"You have already checked in today!",
        noBalance:"Your balance is insufficient!",
        yourFriends:"Friend subscription, 3% of the <br/> subscription amount",
        helped:"You have helped this user!",
        yqkl:`【Help me to get FREE 30USDT】Click,¢<span>{url}</span>¢ or copy this passage, then  launch Dogex App`,
        zlsm:'Friends copy the above text, open Dogex App to receive benefits',
        copySuc:"Copy successful",
        noEnough:"Current amount is insufficient to withdraw",
        getBouns:"Get bonus",
        freeBonus:"Release bonus",
        airdrop:"Airdrop",
        p1:`1.10% of the subscription amount can be deducted with the bonus, and the deductible will not participate in the repurchase plan.<br/>
            2.If you use abnormal means to obtain platform rewards (including but not limited to malicious repeated brush rewards, use malware to swindle rewards, etc.), the platform has the right not to issue rewards, and the rewards already issued will also be deducted.<br/>
            3.The final interpretation of this activity belongs to DOGEX. If you have any questions, Please contact the official email address of the platform (E-mail: service@dogex.app).`,

        s1:`1.The activity will start at 20:00(UTC+8) everynight, the maximum number of people per round is 100.<br/>
            2.The size of the snapped up amount is the actual purchase amount and is not fixed.Because the market is volatile, take the real-time price as the standard, please pay attention to your account balance to ensure the payment is successful.<br/>
            3.The number of flash sale is limited. When the flash sale is successful, it will be Depositd to the user's Coins account, and the user can trade the coins at any time.<br/>
            4.The activity is flash sale, which is a probabilistic event. There is no guarantee that every user can buy it successfully. Finally, the success of the flash sale price is used as the criterion,If the purchase is successful, please pay attention to other activities.<br/>
            5.The final interpretation of this activity belongs to DogEX. If you have any questions, Please contact the official email address of the platform (E-mail: service@dogex.app).`,
            
        c1:`1.Book in every day to unfreeze a certain amount of bonus.<br/>
            2.If you don’t have a bonus yet, you can't get Free USDT when you book in.<br/>
            3.If you use abnormal means to obtain platform rewards (including but not limited to malicious repeated brush rewards, use malware to swindle rewards, etc.), the platform has the right not to issue rewards, and the rewards already issued will also be deducted.<br/>
            4.The final interpretation of this activity belongs to DOGEX. If you have any questions, Please contact the official email address of the platform (E-mail: service@dogex.app).`,
        
        a1:`1. Users can get the USDT bonus by sharing with friends and inviting friends to help.<br/>
            2. Users can withdraw USDT when the accumulated USDT amount reaches 30USDT within 72 hours, otherwise it will be invalid.<br/>
            3. If the accumulated USDT bonus amount of users reaches the withdrawal amount, it will be automatically deposit to the users’ currency account after clicking “withdraw”.<br/>
            4. If improper means are used to obtain the platforms awards (including but not to limited to malicious repeated obtaining awards, using malware to cheat rewards, etc.), the platform has right not to issue awards, and the awards already issued will also be deducted.<br/>
            5. The final interpretation of this activity belongs to DOGEX. If you have any questions, Please contact the official email address of the platform (E-mail: service@dogex.app)`,    
        
        b1:`1.After inviting a new user to complete KYC, the inviter can receive a reward of 10 USDT; the invitee complete the first USDT Deposit, and the inviter can receive an additional bonus of 40 USDT; the number of promotion is not limited.<br/>
            2. In the subscription plan, 10% of the subscription amount can be deducted by the bonus, and the deductible part does not participate in the project-side repurchase plan.<br/>
            3. After depositing any amount of USDT, the user will get an additional 15% of the Deposit amount as a bonus; the bonus will be awarded multiple times, but the total amount is up to 20000 USDT.<br/><br/>
            How to unfreeze bonuses<br/>
            1. The invited new user completes the USDT Deposit, and the inviter can unfreeze a certain amount of bonus (about 1.42 USDT) without limiting the number of invitees.<br/>
            2. The invitee participates in the subscription (the portion of the deductible is not included), and the inviter can obtain 3% of the single subscription amount as the rebate, without limiting the number of times.<br/>
            3. You can unfreeze a certain amount of bonus when you book in every day.<br/><br/>
            Other introduction<br/>
            1.If you use abnormal means to obtain platform rewards (including but not limited to malicious repeated brush rewards, use malware to swindle rewards, etc.), the platform has the right not to issue rewards, and the rewards already issued will also be deducted.<br/>
            2.The final interpretation of this activity belongs to DOGEX. If you have any questions, Please contact the official email address of the platform (E-mail: service@dogex.app).`,
        
        i1:`1.Invite new users and complete registration and KYC, and the inviter will receive a 10USDT bonus. The new user gets 100 DOC（DOGEX Coin）, worth about 3.5USDT. The new user join telegram to gets 100 DOC again.<br/>
            2.Invite a friend to deposit the USDT for the first time, and then you can unfreeze the 1.42USDT. There is no limit to the number of promotion.<br/>
            3.Invite a friend to subscribe, 3% of the subscription amount can be used to unfreeze the bonus。<br/>
            4.If the program is adjusted, please refer to the update on dogex.app ,The final interpretation right shall be owned by DOGEX.`
    
    }, 
    filter:{
        all:"All",
        withdraw:"Withdraw",
        desposit:"Deposit",
        invite:"Invite",
        system:"System",
        activity:"Activity",
        tradeIn:"Trade",
        tradeOut:"Maker",
        fee:"Fee",
        transferIn:"TransferIn",
        transferOut:"TransferOut",
        unLockIn:"Release",
        unLockOut:"unlockout",
        purchase:'Subscription',
        unLock:'unlock'
    },
    endNotice:{
        signin:{
            overTimes:"Exceeded login failure limit", // 900
            error:"Incorrect username or password", // 40001
            limitAccount:"Account is restricted to login", // 40103
            codeError:"Verification code error", // 701
            codeRepeat:"Verification code repetition", // 703
            twice:"Need secondary verification", // 40102
        },
        signup:{
            paramsError:"Data format error", // 700
            codeError:"Verification code error", // 701
            hasAccount:"Account already exists", // 901
        },
        sms:{
            smsError:"SMS module does not exist", // 900
            limitTimes:"Exceeded the limit of sending", // 700
        },
        bind:{ // emial / telphone
            paramsError:"Data format error", // 700
            codeError:"Verification code error", // 701
            hasAccount:"Account already exists", // 901
        },
        fish:{
            paramsError:"Data format error", // 700
        },
        order:{
            limitOrder:"Order restriction", // 40003
            timeOut:"Time expired", // 989
            signatureExpired:"Transaction signature expired", // 801
            signatureError:"Transaction signature error", // 802
            paramsError:"Data format error", // 700
            noMoney:"Insufficient balance", // 800
        },
        purchase:{
            timeExpired:"Currently not open", // 990
            fundPswError:"The fund password error", // 40002
            noNumber:"Insufficient current transaction volume", // 604
            noMoney:"Insufficient balance", // 800
            noRange:"The number of subscriptions is not between the minimum and maximum range", // 700
            noRemind:"Insufficient number of subscriptions", //601
        },
        spike:{
            timeExpired:"Activity has not started yet", // 990
            fundPswError:"The fund password error", // 40002
            noNumber:"Insufficient current transaction volume", // 604
            noMoney:"Insufficient balance", // 800
            noRange:"The number of subscriptions is not between the minimum and maximum range", // 700
        },
        checkIn:{
            checkRepeat:"You have already checked in!",
        },
        forgot:{ // emial / telphone
            paramsError:"Data format error", // 700
            codeError:"Verification code error", // 701
        },
        modifyPsw:{ // psw / fundPsw
            paramsError:"Data format error", // 700
            codeError:"Verification code error", // 701
            overtimes:"Exceeded limit" // 900 fundPsw
        },
        withdraw:{
            noKyc:"Uncertified KYC, unable to withdraw coins", // 602
            userLimit:"User is restricted from withdrawing", // 40003
            coinLimit:"Current currency cannot be withdrawn", // 902
            noFundPsw:"You do not set fund password", // 601
            fundPswError:"Fund password error", // 40002
            codeError:"Verification code error", // 701
            noMoney:"No money", // 800
        }
    },
    other:{
        isSaveImg:'Whether to save this image？',
        findIos:"Find a new version of Ios V",
        findAd:"Find a new version of Android V",
        isUpdate:"Whether to update immediately？",
        imgUpload:"Image is uploading, please wait...",
        chooseImg:"Select Image",
        uploadSure:"Confirm upload",
        imgType:"Image type must be one of .gif, jpeg, jpg, png, bmp",
        imgSize:"Upload images can't exceed 5M",
        goChoose:"Please select the map you want to upload."
    },
    update:{
        version:"current version: {version}（Build 18）",
        apple:"Apple download",
        android:"Android download",
        app:"APP Download",
        fast:"One-stop trading platform"
    },
    network:{
        unknown:"Unknown connection",
        none:"None connection",
        ethernet:"Ethernet connection",
        wifi:"WiFi connection",
        cellularTwo:"Cellular 2G connection",
        cellularThree:"Cellular 3G connection",
        cellularFour:"Cellular 4G connection",
        isWifi:"Current network is WiFi",
        noWifi:"The current network is not WiFi, and slow data loading may occur ...",
        noNetwork:"No network currently",
        copySuc:"Successfully copied to clipboard"
    }
}
export default lang;