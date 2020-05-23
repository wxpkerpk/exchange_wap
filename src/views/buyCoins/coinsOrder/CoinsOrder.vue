<template>
    <div class="coins-order">
        <backbar :back="{ url: 'home' }" >
            <div
                class="icon-container"
                @click="showFilter = true"
            >
                <svg class="icon securityIcon" aria-hidden="true" slot="icon">
                    <use xlink:href="#iconshaixuan1"></use>
                </svg>
            </div>
        </backbar>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            class="list"
        >
            <div
                class="list-item"
                v-for="(item, index) in list" 
                :key="item.id"
                :style="`background: ${item.payway === 'weixin' ? 'linear-gradient(to right, #62b900, #90EE90)' : 'linear-gradient(to right, #108ee9, #87CEFA)'}`"
            >
                <div class="header">
                    <div>
                        <img
                            :src="item.payway === 'weixin' ? require('@/assets/svg/wxPay-light.svg') : require('@/assets/svg/aliPay-light.svg')"
                            class="pay-icon"
                            alt=""
                        />
                        <span>
                            支付账号：{{ item.payAccount || item.userAccount }}
                            <img class="copy-icon" :src="require('@/assets/svg/copy.svg')" slot="icon" @click="$mts.copy(item.payAccount || item.userAccount)"/>
                        </span>
                    </div>
                    <span>{{ item.payway === 'weixin' ? '微信支付' : '支付宝支付' }}</span>
                </div>
                <div class="content">
                    <div class="content-info">
                        <span class="order-num">
                            订单号：
                            <span unselectable="on" class="unselectable">{{ item.id }}</span>
                            <img class="copy-icon" :src="require('@/assets/svg/copy.svg')" slot="icon" @click="$mts.copy(item.id)"/>
                        </span>
                        <span>订单类型：{{ item.type === 'sell' ? '卖单' : '买单' }}</span>
                        <span>{{ item.number }} 个 × {{ item.price }}￥ = {{ accMul(item.number, item.price) }}￥</span>
                        <span v-if="userType !== 'merchant'">商家收款账号：{{ item.merchantAccount }}</span>
                        <span v-if="userType === 'merchant'">联系方式：{{ item.userTel }}</span>
                        <span v-else>联系方式：{{ item.merchantTel }}</span>
                        <span>状态：{{ item.statusCN }}</span>
                    </div>
                    <div 
                        class="btn-container"
                        v-if="item.status !== 'finished'"
                    >
                        <van-button
                            size="mini"
                            type="default"
                            @click="clickHandle('cancel', item, index)"
                            v-if="item.status === 'unPayed' && ((item.type === 'sell' && userType === 'merchant') || (item.type === 'buy' && userType !== 'merchant'))"
                            class="btn"
                        >取消订单</van-button>
                        <template v-if="item.type === 'sell'">
                            <!-- 卖单 -->
                            <van-button
                                size="mini"
                                type="default"
                                @click="clickHandle('merchantPayed', item, index)"
                                v-if="item.status === 'unPayed' && item.type === 'sell' && userType === 'merchant'"
                                class="btn"
                            >我已支付</van-button>
                            <!-- 已确认收款 -->
                            <van-button
                                size="mini"
                                type="default"
                                @click="clickHandle('userFinished', item, index)"
                                v-if="item.status === 'payed' && userType !== 'merchant'"
                                class="btn"
                            >已确认收款</van-button>
                        </template>
                        <template v-else>
                            <!-- 买单 -->
                            <van-button
                                size="mini"
                                type="default"
                                @click="clickHandle('payed', item, index)"
                                v-if="item.status === 'unPayed' && userType !== 'merchant'"
                                class="btn"
                            >我已支付</van-button>
                            <!-- 商家才有以下按钮 -->
                            <template v-if="userType === 'merchant'">
                                <van-button
                                    size="mini"
                                    type="default"
                                    @click="clickHandle('pending', item, index)"
                                    v-if="item.status === 'payed'"
                                    class="btn"
                                >处理订单</van-button>
                                <template v-if="item.status === 'pending'">
                                    <van-button
                                        size="mini"
                                        type="default"
                                        @click="clickHandle('success', item, index)"
                                        class="btn"
                                    >处理成功</van-button>
                                    <van-button
                                        size="mini"
                                        type="default"
                                        @click="clickHandle('fail', item, index)"
                                        class="btn"
                                    >处理失败</van-button>
                                </template>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </van-list>
        <van-popup
            v-model="show"
            position="bottom"
            class="popup"
        >
            <van-cell-group>
                <van-cell 
                    title="价格"
                    :value="`${popupData.item.price}￥`"
                >
                </van-cell>
                <van-cell 
                    title="数量"
                    :value="`${popupData.item.number}个`"
                >
                </van-cell>
                <van-cell 
                    title="总价"
                    :value="`${popupData.item.price * popupData.item.number}￥`"
                >
                </van-cell>
                <div class="btn-container-popup">
                        <van-button
                            type="default"
                            class="popup-btn"
                            @click="show = false"
                        >取消</van-button>
                        <van-button
                            type="default"
                            class="popup-btn"
                            @click="sureHandle"
                        >确认</van-button>
                </div>
            </van-cell-group>
        </van-popup>
        <van-popup
            v-model="showFilter"
            position="right"
            class="popup"
        >
            <div class="order-filter-container">
                <h3>订单筛选</h3>
                <div class="title">交易类型</div>
                <div class="content-container">
                    <div
                        v-for="(item, index) in transactionTypeOptions"
                        :key="index"
                    >
                        <el-radio
                            v-model="transactionType"
                            :label="item.label" 
                            border
                            size="small"
                        ></el-radio>
                    </div>
                </div>
                <div class="title">订单状态</div>
                <div class="content-container">
                    <div
                        v-for="(item, index) in orderStatusOptions"
                        :key="index"
                    >
                        <el-radio 
                            v-model="orderStatus"
                            :label="item.label" 
                            border
                            size="small"
                        ></el-radio>
                    </div>
                </div>
                <!-- <div class="title">商家状态</div>
                <div class="content-container">
                    <div
                        v-for="(item, index) in merchantStatusOptions"
                        :key="index"
                    >
                        <el-radio 
                            v-model="item.value"
                            :label="item.label" 
                            border
                            size="small"
                        ></el-radio>
                    </div>
                </div> -->
                <div class="title">订单号</div>
                <div class="content-container">
                    <van-field v-model="filterData.orderId" placeholder="请输入订单号" size="small"/>
                </div>
                <template v-if="userType === 'merchant'">
                    <div class="title">手机号</div>
                    <div class="content-container">
                        <van-field v-model="filterData.tel" placeholder="请输入手机号" />
                    </div>
                </template>
                <div class="serach-container">
                    <van-button
                        size="small"
                        class="search"
                        @click="searchHandle"
                        type="info"
                    >搜索</van-button>
                </div>
                <van-divider />
                <div
                    class="line-btn-container"
                    v-if="userType === 'merchant'"
                >
                    <span class="switch-tips">当前{{ checked ? '在线' : '下线' }}, 点击{{ checked ? '下线' : '上线' }}</span>
                    <van-switch 
                        v-model="checked" 
                        @input="onInput"
                    />
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import backbar from '@/views/modules/back.vue'

    export default {
        name: 'CoinsOrder',
        components: {
            backbar,
        },
        data() {
            return {
                checked: true,
                list: [],
                page: 1,
                loading: false,
                finished: false,
                userType: this.$store.state.app.userinfo.userType,
                show: false,
                showFilter: false,
                popupData: {
                    item: {},
                    way: '',
                    index: '',
                },
                filterData: {
                    orderId: '',
                    tel: '',
                },
                transactionType: '买&卖',
                transactionTypeOptions: [
                    {
                        label: '买&卖',
                        value: null,
                    },{
                        label: '买入',
                        value: 'buy',
                    },{
                        label: '卖出',
                        value: 'sell',
                    },
                ],
                orderStatus: '全部',
                orderStatusOptions: [
                    {
                        label: '全部',
                        value: null,
                    },
                    {
                        label: '待付款',
                        value: 'unPayed',
                    },
                    {
                        label: '商户处理中',
                        value: 'pending',
                    },
                    {
                        label: '已完成',
                        value: 'finished',
                    },
                    {
                        label: '已取消',
                        value: 'canceled',
                    },
                    {
                        label: ' 已失败',
                        value: 'fail',
                    },
                    {
                        label: ' 已付款',
                        value: 'payed',
                    },
                ],
                // 商家状态
                // merchantStatusOptions: [
                //     {
                //         label: '上线',
                //         value: true,
                //     },
                //     {
                //         label: '下线',
                //         value: false,
                //     },
                // ]
            };
        },
        created() {
            this.getList(1);
            this.getMerchantOnline();
        },
        methods: {
            // 商家切换在线状态
            changeMerchantOnline(checked) {
                this.$mts.posts({
                    url: 'api/otc/otc/changeMerchantOnline',
                    data:{},
                    success: (res) => {
                        if(res.data.status !== 200){
                            this.$toast('切换在线状态失败');
                        } else {
                            this.$toast('切换在线状态成功');
                        }
                    }
                });
            },
            // 获取商家上线线状态
            getMerchantOnline() {
                this.$mts.posts({
                    url: 'api/otc/otc/getMerchantOnline',
                    data:{},
                    success: (res) => {
                        if(res.data.status === 200){
                            this.checked = res.data.data;
                        } else {
                            this.$toast('获取在线状态失败');
                        }
                    }
                });
            },
            // 商家设置订单为支付成功
            storeSetOrderSuccess(orderId, index) {
                this.$mts.postUrl({
                    url: 'api/otc/otc/merchantFinished',
                    data:{
                        orderId,
                    },
                    success: (res) => {
                        if(res.data.data.status === 200){
                            this.$toast('操作成功');
                            this.translate(res.data.data.data);
                            this.$set(this.list, index, res.data.data.data);
                            this.show = false;
                        } else {
                            this.$toast('操作失败');
                        }
                    }
                });
            },
            // 商家设置订单为支付失败
            storeSetOrderFail(orderId, index) {
                this.$mts.postUrl({
                    url: 'api/otc/otc/merchantFail',
                    data:{
                        orderId,
                    },
                    success: (res) => {
                        if(res.data.data.status === 200){
                            this.$toast('操作成功');
                            this.translate(res.data.data.data);
                            this.$set(this.list, index, res.data.data.data);
                            this.show = false;
                        } else {
                            this.$toast('操作失败');
                        }
                    }
                });
            },
            // 用户确认收款
            userFinished(orderId, index) {
                this.$mts.postUrl({
                    url: `api/otc/otc/userFinished`,
                    data:{
                        orderId,
                    },
                    success: (res) => {
                        if(res.data.data.status === 200){
                            this.$toast('操作成功');
                            this.translate(res.data.data.data);
                            this.$set(this.list, index, res.data.data.data);
                        } else {
                            this.$toast('操作失败');
                        }
                    }
                });
            },
            // 商户已支付
            merchantPayed(orderId, index) {
                this.$mts.postUrl({
                    url: `api/otc/otc/merchantPay`,
                    data:{
                        orderId,
                    },
                    success: (res) => {
                        if(res.data.data.status === 200){
                            this.$toast('操作成功');
                            this.translate(res.data.data.data);
                            this.$set(this.list, index, res.data.data.data);
                        } else {
                            this.$toast('操作失败');
                        }
                    }
                });
            },
            // 用户取消订单
            cancelOrder(orderId, index, type) {
                this.$mts.postUrl({
                    url: `api/otc/otc/${type}`,
                    data:{
                        orderId,
                    },
                    success: (res) => {
                        if(res.data.data.status === 200){
                            this.$toast('操作成功');
                            this.translate(res.data.data.data);
                            this.$set(this.list, index, res.data.data.data);
                        } else {
                            this.$toast('操作失败');
                        }
                    }
                });
            },
            // 商家设置订单为处理中
            storeSetOrderPending(orderId, index) {
                this.$mts.postUrl({
                    url: 'api/otc/otc/merchantPending',
                    data:{
                        orderId,
                    },
                    success: (res) => {
                        if(res.data.data.status === 200){
                            this.$toast('操作成功');
                            this.translate(res.data.data.data);
                            this.$set(this.list, index, res.data.data.data);
                        } else {
                            this.$toast('操作失败');
                        }
                    }
                });
            },
            // 用户将订单状态设置成已支付
            userSetOrderStatus(orderId, index) {
                this.$mts.postUrl({
                    url: 'api/otc/otc/userPay',
                    data:{
                        orderId,
                    },
                    success: (res) => {
                        if(res.data.data.status === 200){
                            this.$toast('操作成功');
                            this.translate(res.data.data.data);
                            this.$set(this.list, index, res.data.data.data);
                        } else {
                            this.$toast('操作失败');
                        }
                    }
                });
            },
            // 获取订单列表
            getList(page, params) {
                this.$mts.postUrl({
                    url: 'api/otc/otc/queryOrder',
                    data:{
                        page,
                        size: 10,
                        ...params
                    },
                    success: (res) => {
                        if(res.data.status === 200){
                            res.data.data.forEach(v => {
                                this.translate(v);
                            });
                            if (page === 1) {
                                this.list = res.data.data;
                            } else {
                                this.list = this.list.concat(res.data.data);
                            }
                            if (res.data.data.length < 10) this.finished = true;
                        }
                    }
                });
            },
            onInput(checked) {
                this.changeMerchantOnline(checked);
                // console.log(checked);
            },
            searchHandle() {
                let choosedArr = [];
                // console.log(this.transactionType, this.orderStatus);
                const type = this.transactionTypeOptions.filter(v => {
                    return v.label === this.transactionType;
                })[0].value;
                const status = this.orderStatusOptions.filter(v => {
                    return v.label === this.orderStatus;
                })[0].value;
                // console.log(type, status);
                // console.log(choosedArr);
                const params = {
                    id: this.filterData.orderId,
                    tel: this.filterData.tel,
                    type,
                    status,
                }
                Object.keys(params).forEach(key => {
                    if (!params[key]) delete params[key];
                });
                this.getList(1, params);
                this.showFilter = false;
            },
            sureHandle() {
                if (this.popupData.way === 'success') this.storeSetOrderSuccess(this.popupData.item.id ,this.popupData.index);
                else this.storeSetOrderFail(this.popupData.item.id ,this.popupData.index);
            },
            /**
             *  @param { String } way payed - 买家已支付, pending - 正在处理, success - 支付成功, fail - 支付失败, 
             */
            clickHandle(way, item, index) {
                this.popupData = {
                    item,
                    way,
                    index,
                }
                switch(way) {
                    case 'payed':
                        this.userSetOrderStatus(item.id, index);
                        break;
                    case 'pending':
                        this.storeSetOrderPending(item.id, index);
                        break;
                    case 'success':
                        this.show = true;
                        break;
                    case 'fail':
                        this.show = true;
                        break;
                    case 'cancel':
                        this.cancelOrder(item.id, index, this.userType === 'merchant' ? 'merchantCancel' : 'userCancel');
                        break;
                    case 'merchantPayed':
                        // 商家已付款
                        this.merchantPayed(item.id, index);
                        break;
                    case 'userFinished':
                        this.userFinished(item.id, index);
                        break;
                    default: break;
                }
            },
            onLoad() {
                this.page++;
                this.getList(this.page);
                this.loading = false;
            },
            translate(obj) {
                switch(obj.status) {
                    case 'unPayed':
                        obj.statusCN = obj.type === 'sell' ? '商户未付款' : '用户未付款';
                        break;
                    case 'payed':
                        obj.statusCN = obj.type === 'sell' ? '商户已付款' : '用户已付款';
                        break;
                    case 'pending':
                        obj.statusCN = '商户正在处理';
                        break;
                    case 'finished':
                        obj.statusCN = '订单已完成';
                        break;
                    case 'fail':
                        obj.statusCN = obj.type === 'sell' ? '商户已取消订单' : '订单处理失败';
                        break;
                    case 'canceled':
                        obj.statusCN = obj.type === 'sell' ? '商户已取消订单' : '用户已取消订单';
                        break;
                    default:
                        obj.statusCN = '处理订单';
                }
                // return obj;
            },
            accMul(arg1, arg2) {
                var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try {
                    m += s1.split(".")[1].length
                } catch (e) {
                }
                try {
                    m += s2.split(".")[1].length
                } catch (e) {
                }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .coins-order {
        width: 100vw;
        .back {
            background-color: inherit;
            .icon-container {
                width: 10vw;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                .securityIcon {
                    width: 4vw;
                    height: 4vw;
                }
            }
        }
        .list-item {
            margin: 5vw;
            padding: 3vw;
            box-sizing: border-box;
            border-radius: 5px;
            color: #fff;
            &:first-child {
                margin-top: 0;
            }
            .header {
                position: relative;
                padding-bottom: 2vw;
                display: flex;
                justify-content: space-between;
                &>div>span {
                    display: flex;
                    align-items: center;
                }
                &>div {
                    display: flex;
                    align-items: center;
                }
                .pay-icon {
                    width: 5vw;
                    margin-right: 2vw;
                }
                &::after {
                    position: absolute;
                    box-sizing: border-box;
                    content: ' ';
                    pointer-events: none;
                    top: -50%;
                    right: -50%;
                    bottom: -50%;
                    left: -50%;
                    border: 0 solid #ebedf0;
                    -webkit-transform: scale(.5);
                    transform: scale(.5);
                    border-bottom: 1px solid #ddd;
                }
            }
            .content {
                // display: flex;
                &-info {
                    padding-top: 4vw;
                    display: flex;
                    flex-direction: column;
                    span:first-child {
                        font-size: 4vw;
                    }
                    .order-num {
                        display: flex;
                        align-content: center;
                    }
                }
                .btn-container {
                    flex: 1 1 auto;
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    .btn {
                        color: #fff;
                        background-color: #0bBED5;
                        border: 1px solid #0bBED5;
                    }
                }
                .unselectable {
                    -moz-user-select: none;
                    -webkit-user-select: none;
                }
            }
            .copy-icon {
                width: 5vw;
                height: 5vw;
                margin-left: 2vw;
            }
        }
        .order-filter-container {
            width: 80vw;
            height: 100vh;
            background-color: #fff;
            padding: 5vw;
            box-sizing: border-box;
            overflow-y: scroll;
            h3 {
                text-align: center;
                padding: 5vw;
            }
            .title {
                color: #4C5A65;
                font-size: 4vw;
                margin-bottom: 2vw;
            }
            .content-container {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 2vw;
            }
            .serach-container {
                margin-top: 5vw;
                text-align: center;
            }
            .line-btn-container {
                margin-top: 5vw;
                display: flex;
                justify-content: center;
                align-items: center;
                .switch-tips {
                    margin-right: 5vw;
                }
            }
        }
    }
</style>

<style lang="scss">
    .coins-order {
        .list {
            .van-cell {
                background-color: #E4EEEF;
                // flex-direction: column;
                .van-cell__title {
                    display: flex;
                    justify-content: space-between;
                }
                .van-cell__label {
                    color: #333;
                }
                .van-cell__value {
                    text-align: left;
                    color: #333;
                    margin-top: 2vw;
                }
            }
            .van-cell:not(:last-child)::after {
                border-bottom: 1px solid #ccc;
            }
            .van-button {
                padding: 0 2vw;
            }
            .van-button--mini  {
                min-width: 65px;
            }
        }
        .popup {
            .van-cell:not(:nth-child(3))::after {
                border-bottom: 1px solid #ccc;
            }
            .btn-container-popup {
                .popup-btn {
                    width: 50%;
                }
            }
        }
        .order-filter-container {
            .el-radio {
                width: 25vw;
                margin: 0 5vw 5vw 0;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 8px 15px 9px 10px;
            }
            .van-cell {
                border: 1px solid #DCDFE6;
                border-radius: 3px;
                padding: 4px 16px;
            }
        }
    }
</style>
