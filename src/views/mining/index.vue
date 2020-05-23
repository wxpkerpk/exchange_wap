<template>
    <div>
        <div class="back-container">
            <van-icon name="arrow-left" @click="$router.go(-1)" color="#fff" size="20" />
        </div>
        <div class="mining-container">
            <div class="header">
                <div class="hexagon-box">
                    <div class="hex-border" v-if="showHex == 1">
                        <div class="hexagons">
                            <div class="hexagon"></div>
                            <div class="hexagon"></div>
                            <div class="hexagon"></div>
                            <div class="hexagon"></div>
                            <div class="hexagon"></div>
                            <div class="hexagon"></div>
                            <div class="hexagon"></div>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
                <div class="header-des">
                    <span>当前算力：{{ info.selfPower }}MH/s</span>
                    <span>
                        我的收入：
                        <span class="scale-num">{{ info.gained ? info.gained.toFixed(4) : 0.0000 }}</span>
                    </span>
                    <span>
                        未领取：
                        <span class="scale-num">{{ unaccalimedText }}</span>
                    </span>
                </div>
            </div>
            <div class="menu">
                <div v-for="(item, index) in hexList" :key="index" class="hexagon-item">
                    <div class="hex-item">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="hex-item">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <a class="hex-content" @click="jump(item.link)">
                        <div class="hex-content-inner">
                            <img :src="item.icon" alt="" class="hex-icon">
                            <span class="title">{{ item.text }}</span>
                        </div>
                        <svg viewBox="0 0 173.20508075688772 200" height="118" width="174" version="1.1"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                                fill="#1e2530"></path>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="node-list">
                <span>我的节点：</span>
                <div class="node-item ripple" v-for="(item, index) in myNodeList" :key="index"
                    @click="getComPower(item.id, index, item.circleValue)">
                    <img :src="require(`@/assets/img/node-list-icon${item.level}.gif`)" alt="" class="icon" />
                    <div class="node-list-text">
                        <span>{{ item.name }}</span>
                        <span>算力：{{ item.power }}{{ item.unit }}</span>
                        <span>已获得：{{ item.gained ? item.gained.toFixed(2) : 0 }}</span>
                        <span>剩余天数：{{ item.timeLeft }}天</span>
                    </div>
                    <!-- <van-circle
                        v-model="item.circleProcess"
                        :key="index" 
                        :rate="100" 
                        :speed="speed"
                        :text="item.circleText" 
                        size="15vw" 
                        layer-color="#1E637C" 
                    /> -->
                    <el-progress
                        type="circle" 
                        :percentage="item.circleProcess"
                        :stroke-width="2"
                        :width="60"
                        :format="() => {return item.circleText}"
                    ></el-progress>
                </div>
            </div>
        </div>
        <canvas id="mineCanvas"></canvas>
        <canvas id="miningBg"></canvas>
    </div>
</template>

<script>
    import HeaderTitle from '@/components/HeaderTitle';
    import '@/assets/css/hexagon.css';

    export default {
        af: {},
        name: 'mining',
        components: {
            HeaderTitle
        },
        data() {
            return {
                speed: 0,
                showHex: 0,
                hexList: [{
                        text: '节点列表',
                        icon: require('@/assets/svg/mining-h1.svg'),
                        link: 'miningList',
                    },
                    {
                        text: '团队',
                        icon: require('@/assets/svg/mining-h2.svg'),
                        link: 'miningTeams',
                    },
                    {
                        text: '收益明细',
                        icon: require('@/assets/svg/mining-h3.svg'),
                        link: 'miningIncome',
                    },
                    {
                        text: '社区',
                        icon: require('@/assets/svg/mining-h4.svg'),
                        // link: 'miningCommunity',
                        link: '',
                    },
                    {
                        text: '帮助中心',
                        icon: require('@/assets/svg/mining-h5.svg'),
                        link: 'miningHelp',
                    },
                ],
                timeOut: null,
                myNodeList: [],
                info: {},
                unaccalimedText: 0,
                unaccalimedValue: 0,
                interval: null,
            };
        },
        computed: {
            isLogin() {
                return this.$store.state.isLogin;
            },
        },
        mounted() {
            if (!this.isLogin) {
                this.$router.push({
                    name: 'signin',
                    query: {
                        path: '/mining'
                    }
                });
                return;
            }
            this.timeOut = setTimeout(() => {
                this.initCanvas();
                this.initClickCanvas();
                this.showHex = 1;
            }, 400)
            this.getMyNode();
            this.getInfo();
            this.getNodeList();
            this.getSelfInfo();
            this.getLevel();
        },
        beforeRouteLeave(to, from, next) {
            this.showHex = 0;
            cancelAnimationFrame(this.af);
            const canvas = document.querySelector("#miningBg");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const canvas2 = document.querySelector("#mineCanvas");
            const ctx2 = canvas2.getContext("2d");
            ctx2.clearRect(0, 0, canvas2.width, canvas.height);
            clearTimeout(this.timeOut);
            clearInterval(this.interval);
            next();
        },
        methods: {
            // 获取顶部信息
            getSelfInfo() {
                let that = this;
                this.$mts.posts({
                    url: 'api/activity/mining/getSelfInfo',
                    data: {},
                    success(res) {
                        if (res.data.status == 200) {
                            localStorage.setItem('selfInfo', JSON.stringify(res.data.data));
                        }
                    }
                });
            },
            // 获取列表
            getLevel() {
                let that = this;
                this.$mts.posts({
                    url: 'api/activity/mining/getGroupLevelCondition',
                    data: {},
                    success(res) {
                        if (res.data.status == 200) {
                            localStorage.setItem('lvlList', JSON.stringify(res.data.data));
                        }
                    }
                });
            },
            // 获取节点
            getNodeList() {
                const that = this;
                const nodeListExpire = localStorage.getItem('nodeListExpire');
                if (Number(nodeListExpire) - Date.now() < 0) {
                    this.$mts.posts({
                        url: 'api/activity/mining/getAllPoints',
                        data: {},
                        success(res) {
                            if (res.data.status == 200) {
                                localStorage.setItem('nodeList', JSON.stringify(res.data.data));
                                localStorage.setItem('nodeListExpire', JSON.stringify(Date.now() + 10 * 60 *
                                    1000));
                            }
                        }
                    });
                }
            },
            // 顶部信息
            getInfo() {
                let that = this;
                this.$mts.posts({
                    url: 'api/activity/mining/getSelfInfo',
                    data: {},
                    success(res) {
                        if (res.data.status == 200) {
                            that.info = res.data.data;
                        }
                    }
                });
            },
            // 获取我的节点
            getMyNode() {
                let that = this;
                this.$mts.posts({
                    url: 'api/activity/mining/getSelfPoints',
                    data: {},
                    success(res) {
                        if (res.data.status == 200) {
                            that.myNodeList = res.data.data;
                            that.myNodeList.forEach(v => {
                                let time = (new Date().getTime() - new Date(v.startTime.replace(/-/g, '/')).getTime()) - v.perLastTime > 0 ? v.perLastTime : new Date().getTime() - new Date(v.startTime.replace(/-/g, '/')).getTime();
                                if (time < 0) time = 0;
                                // 剩余天数
                                that.$set(v, 'timeLeft', parseInt(Math.abs(new Date(v.endTime.replace(/-/g, '/')).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24));
                                that.$set(v, 'circleValue', (time * v.transform / 1000));
                                that.$set(v, 'circleText', v.circleValue.toFixed(3));
                                that.$set(v, 'circleProcess', parseInt((time / v.perLastTime) * 100));
                                that.unaccalimedValue = (Number(that.unaccalimedValue) + Number(v.circleValue));
                                that.unaccalimedText = that.unaccalimedValue.toFixed(4);
                            });
                            // console.log(that.myNodeList)
                            clearInterval(this.interval);
                            that.interval = setInterval(() => {
                                that.myNodeList.forEach(v => {
                                    let time = (new Date().getTime() - new Date(v.startTime.replace(/-/g, '/')).getTime()) - v.perLastTime > 0 ? v.perLastTime : new Date().getTime() - new Date(v.startTime.replace(/-/g, '/')).getTime();
                                    v.circleValue += v.transform;
                                    v.circleText = v.circleValue.toFixed(3);
                                    v.circleProcess = Number((time / v.perLastTime) * 100);
                                    that.unaccalimedValue = (Number(that.unaccalimedValue) + Number(v.transform));
                                    that.unaccalimedText = that.unaccalimedValue.toFixed(4);
                                });
                            }, 1000);
                        }
                    }
                });
            },
            // 领取算力
            getComPower(miningId, index, num) {
                let that = this;
                this.$mts.postUrl({
                    url: 'api/activity/mining/obtain',
                    data: {
                        miningId,
                    },
                    success(res) {
                        if (res.data.status == 200) {
                            that.speed = 0;
                            const myNode = that.myNodeList[index];
                            // 展示
                            that.$toast({ message: `领取到了${(res.data.data.gained - myNode.gained).toFixed(5)}个` });
                            myNode.gained = res.data.data.gained; // 已获得
                            myNode.circleValue = 0; // 圈圈值重置为0
                            myNode.circleText = '0.000'; // 圈圈取3位小数值重置为0
                            myNode.circleProcess = 0; // 圈圈进度重置为0
                            myNode.startTime = that.$dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'); // startTime重置为当前时间
                            that.getInfo(); // 重新获取顶部数据
                            that.unaccalimedValue = Number(that.unaccalimedValue) - Number(num) > 0 ? Number(that.unaccalimedValue) - Number(num) : 0;
                            that.unaccalimedText = that.unaccalimedValue > 0 ? that.unaccalimedValue.toFixed(4) : 0;
                            const scaleNum = document.querySelectorAll('.scale-num');
                            scaleNum.forEach(v => {
                                v.style.transform = 'scale(1.2)';
                            });
                            this.timeOut = setTimeout(() => {
                                scaleNum.forEach(v => {
                                    v.style.transform = 'scale(1)';
                                });
                            }, 300);
                        }
                    }
                });
            },
            jump(name) {
                if (!name) {
                    this.$toast({ type: 'fail', message: '敬请期待' });
                }
                this.timeOut = setTimeout(() => {
                    this.$router.push({
                        name,
                    });
                }, 400);
            },
            initCanvas() {
                const canvas = document.querySelector("#miningBg");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const numLasers = 200;
                const tail = 200;
                const createLasers = n => {
                    const lasers = [];
                    for (let i = 0; i < n; ++i) {
                        lasers.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            s: Math.random() * 2 + 1
                        });
                    }
                    return lasers;
                };
                const renderLaser = l => {
                    const grad = ctx.createLinearGradient(l.x, l.y, l.x, l.y + tail);
                    const a = 1 - (canvas.height - l.y) / canvas.height * 0.8;
                    grad.addColorStop(0, `hsla(340,100%,100%,${a})`);
                    grad.addColorStop(1, "hsla(340,100%,50%,0)");
                    ctx.strokeStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(l.x, l.y);
                    ctx.lineTo(l.x, l.y + tail);
                    ctx.stroke();
                };
                const updateLaser = l => {
                    l.y -= l.s;
                    if (l.y < -tail) {
                        l.y = canvas.height;
                    }
                };
                const render = lasers => {
                    ctx.fillStyle = "hsl(261,43%,7%)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    for (let l of lasers) {
                        renderLaser(l);
                        updateLaser(l);
                    }
                    this.af = requestAnimationFrame(() => render(lasers));
                };
                const init = () => {
                    cancelAnimationFrame(this.af);
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    render(createLasers(numLasers));
                };
                window.onresize = init;
                init();
            },
            initClickCanvas() {
                const cnv = document.getElementById('mineCanvas');
                const ctx = cnv.getContext('2d');

                let count = 20;
                let innerRadius = 30;
                let outterRadius = 150;
                let moreOutterRadius = 200;
                let easing = 0.05;
                let mcolor = [
                    '#f44336',
                    '#ffeb3b',
                    '#03a9f4'
                ]

                window.onresize = resize();

                function resize() {
                    cnv.width = window.innerWidth;
                    cnv.height = window.innerHeight;
                }

                const init =  () => {
                    resize();

                    // mouse class
                    class Mouse {
                        constructor() {
                            this.x = 0;
                            this.y = 0;
                        }

                        getMousePosition(cnv) {
                            window.addEventListener('mousedown', (e) => {
                                this.x = e.clientX - cnv.offsetLeft;
                                this.y = e.clientY - cnv.offsetTop;
                            }, false)
                        }
                    }
                    let mouse = new Mouse();
                    mouse.getMousePosition(cnv);
                    document.querySelectorAll('.node-item').forEach(v => {
                        v.addEventListener('mousedown', (e) => {
                            const x = e.clientX;
                            const y = e.clientY;
                            let balls = getEnoughBall(count, x, y);

                            let circle = new Ball(x, y, innerRadius, '#f4433699');

                            var opacticy = 0.6;

                            (function animation(process) {

                                process = process + 1;
                                let raf = requestAnimationFrame(function () {
                                    animation(process);
                                });
                                if (process >= 120) cancelAnimationFrame(raf)


                                ctx.clearRect(0, 0, cnv.width, cnv.height);

                                balls.forEach(item => {
                                    item.draw('fill');

                                    item.vx = (item.dx - item.x) * easing;
                                    item.vy = (item.dy - item.y) * easing;
                                    item.x += item.vx;
                                    item.y += item.vy;
                                    item.sx += -item.sx * easing;
                                    item.sy += -item.sy * easing;
                                })

                                circle.draw('stroke');
                                circle.radius += (outterRadius - circle.radius) * easing;
                                opacticy = opacticy - 0.6 * easing;
                                circle.color = `rgba(244, 67, 54, ${opacticy})`
                            })(0)
                        }, false)
                    });
                };
                init();

                function getEnoughBall(num, mouseX, mouseY) {
                    var balls = [];

                    for (let i = 0; i < num; i++) {
                        var ball = new Ball(0, 0, Math.random() * (40 - 5 + 1) + 5, mcolor[parseInt(Math.random() *
                        3)]);
                        ball.x = mouseX + Math.random() * innerRadius - Math.random() * innerRadius;
                        ball.y = mouseY + Math.random() * innerRadius - Math.random() * innerRadius;

                        var x = mouseX - ball.x;
                        var y = mouseY - ball.y;
                        var scale = Math.abs(x / y);
                        ball.dx = (x < 0 ? 1 : -1) * moreOutterRadius / Math.sqrt(scale * scale + 1) * Math.random() *
                            scale + mouseX;
                        ball.dy = (y < 0 ? 1 : -1) * moreOutterRadius / Math.sqrt(scale * scale + 1) * Math.random() +
                            mouseY;

                        balls.push(ball);
                    }

                    return balls;
                }

                // ball class
                class Ball {
                    constructor(x, y, radius, color) {
                        this.x = x || 0;
                        this.y = y || 0;
                        this.vx = 0;
                        this.vy = 0;
                        this.sx = 1;
                        this.sy = 1;
                        this.radius = radius || 10;
                        this.color = color || 'black';
                    }

                    draw(type) {
                        if (['fill', 'stroke'].indexOf(type) == -1) {
                            throw ('ball.draw need a right type');
                        }
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        ctx.scale(this.sx, this.sy);
                        ctx.fillStyle = this.color;
                        ctx.strokeStyle = this.color;
                        ctx.beginPath();
                        ctx.arc(0, 0, this.radius / 2, 0, 360 * Math.PI / 180);
                        ctx.closePath();
                        type === 'fill' ? ctx.fill() : ctx.stroke();
                        ctx.restore();
                    }
                }

            },
        }

    }
</script>

<style lang="scss" scoped>
    .heading-page {
        font-size: 16px;
        font-weight: bolder;
        letter-spacing: 2px;
        color: white;
    }

    a {
        color: inherit;
        -webkit-transition: all 0.3s ease 0s;
        -moz-transition: all 0.3s ease 0s;
        -o-transition: all 0.3s ease 0s;
        transition: all 0.3s ease 0s;
    }

    a:hover,
    a:focus {
        /* color: #ababab; */
        text-decoration: none;
        outline: 0 none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        color: #1e2530;
        font-family: "Microsoft Yahei", sans-serif;
        margin: 0;
        line-height: 1.3;
    }

    p {
        margin-bottom: 12px;
    }

    p:last-child {
        margin-bottom: 0;
    }

    /*
 * Selection color
 */
    ::-moz-selection {
        background-color: #FA6862;
        color: #fff;
    }

    ::selection {
        background-color: #FA6862;
        color: #fff;
    }

    /*
 *  Reset bootstrap's default style
 */
    .form-control::-webkit-input-placeholder,
    ::-webkit-input-placeholder {
        opacity: 1;
        color: inherit;
    }

    .form-control:-moz-placeholder,
    :-moz-placeholder {
        /* Firefox 18- */
        opacity: 1;
        color: inherit;
    }

    .form-control::-moz-placeholder,
    ::-moz-placeholder {
        /* Firefox 19+ */
        opacity: 1;
        color: inherit;
    }

    .form-control:-ms-input-placeholder,
    :-ms-input-placeholder {
        opacity: 1;
        color: inherit;
    }

    button,
    input,
    select,
    textarea,
    label {
        font-weight: 400;
    }

    .btn {
        -webkit-transition: all 0.3s ease 0s;
        -moz-transition: all 0.3s ease 0s;
        -o-transition: all 0.3s ease 0s;
        transition: all 0.3s ease 0s;
    }

    .btn:hover,
    .btn:focus,
    .btn:active:focus {
        outline: 0 none;
    }

    .btn-primary {
        background-color: #FA6862;
        border: 0;
        font-family: "Open Sans", sans-serif;
        font-weight: 700;
        height: 28px;
        line-height: 29px;
        padding: 0 25px;
        text-transform: uppercase;
    }

    .btn-primary:hover,
    .btn-primary:focus,
    .btn-primary:active,
    .btn-primary:active:focus {
        background-color: #f9423a;
    }

    .btn-border {
        border: 1px solid #d7d8db;
        display: inline-block;
        padding: 4px;
    }

    /*
 *  CSS Helper Class
 */
    .clear:before,
    .clear:after {
        content: " ";
        display: table;
    }

    .clear:after {
        clear: both;
    }

    .pt-table {
        display: table;
        width: 100%;
        height: -webkit-calc(100vh - 2px);
        height: -moz-calc(100vh - 2px);
        height: calc(100vh - 2px);
    }

    .pt-tablecell {
        display: table-cell;
        vertical-align: middle;
    }

    .overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .relative {
        position: relative;
    }

    .primary,
    .link:hover {
        color: #FA6862;
    }

    .no-gutter {
        margin-left: 0;
        margin-right: 0;
    }

    .no-gutter>[class^="col-"] {
        padding-left: 0;
        padding-right: 0;
    }

    .flex {
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
    }

    .flex-middle {
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -moz-align-items: center;
        align-items: center;
    }

    .space-between {
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        -moz-justify-content: space-between;
        justify-content: space-between;
    }

    .nicescroll-cursors {
        background: #FA6862 !important;
    }

    .preloader {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1000;
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
    }

    .preloader.active.hidden {
        display: none;
    }

    .loading-mask {
        background-color: #FA6862;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 20%;
        -webkit-transition: all 0.6s cubic-bezier(0.61, 0, 0.6, 1) 0s;
        -moz-transition: all 0.6s cubic-bezier(0.61, 0, 0.6, 1) 0s;
        -o-transition: all 0.6s cubic-bezier(0.61, 0, 0.6, 1) 0s;
        transition: all 0.6s cubic-bezier(0.61, 0, 0.6, 1) 0s;
    }

    .loading-mask:nth-child(2) {
        left: 20%;
        -webkit-transition-delay: 0.1s;
        -moz-transition-delay: 0.1s;
        -o-transition-delay: 0.1s;
        transition-delay: 0.1s;
    }

    .loading-mask:nth-child(3) {
        left: 40%;
        -webkit-transition-delay: 0.2s;
        -moz-transition-delay: 0.2s;
        -o-transition-delay: 0.2s;
        transition-delay: 0.2s;
    }

    .loading-mask:nth-child(4) {
        left: 60%;
        -webkit-transition-delay: 0.3s;
        -moz-transition-delay: 0.3s;
        -o-transition-delay: 0.3s;
        transition-delay: 0.3s;
    }

    .loading-mask:nth-child(5) {
        left: 80%;
        -webkit-transition-delay: 0.4s;
        -moz-transition-delay: 0.4s;
        -o-transition-delay: 0.4s;
        transition-delay: 0.4s;
    }

    .preloader.active.done {
        z-index: 0;
    }

    .preloader.active .loading-mask {
        width: 0;
    }

    /*------------------------------------------------
	Start Styling
-------------------------------------------------*/
    .mt20 {
        margin-top: 12px;
    }

    .site-wrapper {
        border-top: 2px solid #ff0037;
    }

    .page-close {
        font-size: 18px;
        position: absolute;
        right: 18px;
        top: 18px;
        z-index: 100;
    }

    .page-title {
        margin-bottom: 44px;
    }

    .page-title img {
        margin-bottom: 12px;
    }

    .page-title h2 {
        font-size: 40px;
        margin-bottom: 15px;
        position: relative;
        z-index: 0;
        font-weight: 900;
        text-transform: uppercase;
    }

    .page-title p {
        font-size: 9px;
    }

    .page-title .title-bg {
        color: rgba(30, 37, 48, 0.07);
        font-size: 93px;
        left: 0;
        letter-spacing: 6px;
        line-height: 0.7;
        position: absolute;
        right: 0;
        top: 50%;
        z-index: -1;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    .section-title {
        margin-bottom: 12px;
    }

    .section-title h3 {
        display: inline-block;
        position: relative;
    }

    .section-title h3::before,
    .section-title h3::after {
        content: "";
        height: 2px;
        position: absolute;
        bottom: 5px;
        left: -webkit-calc(100% + 8px);
        left: -moz-calc(100% + 8px);
        left: calc(100% + 8px);
    }

    .section-title h3::before {
        background-color: #1e2530;
        width: 56px;
        bottom: 8px;
    }

    .section-title h3::after {
        background-color: #FA6862;
        width: 43px;
    }

    .section-title.light h3 {
        color: #fff;
    }

    .section-title.light h3::before {
        background-color: #fff;
    }

    .page-nav {
        bottom: 24px;
        left: 0;
        position: absolute;
        right: 0;
    }

    .page-nav span {
        font-family: "Open Sans", sans-serif;
        font-size: 8px;
        font-weight: 500;
        line-height: 0.9;
        text-transform: uppercase;
    }

    /*------------------------------------------------
    Home Page
-------------------------------------------------*/

    .hexagon-item:first-child {
        margin-left: 0;
    }

    .page-home {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        vertical-align: middle;
    }

    .page-home .overlay {
        background-color: rgba(14, 17, 24, 0.97);
    }

    /* End of container */
    .hexagon-item {
        cursor: pointer;
        width: 118px;
        height: 101.88534px;
        float: left;
        margin-left: -17px;
        z-index: 0;
        position: relative;
        -webkit-transform: rotate(30deg);
        -moz-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
        -o-transform: rotate(30deg);
        transform: rotate(30deg);
    }

    .hexagon-item:first-child {
        margin-left: 0;
    }

    .hexagon-item:hover {
        z-index: 1;
    }

    .hexagon-item:hover .hex-item:last-child {
        opacity: 1;
        -webkit-transform: scale(1.3);
        -moz-transform: scale(1.3);
        -ms-transform: scale(1.3);
        -o-transform: scale(1.3);
        transform: scale(1.3);
    }

    .hexagon-item:hover .hex-item:first-child {
        opacity: 1;
        -webkit-transform: scale(1.2);
        -moz-transform: scale(1.2);
        -ms-transform: scale(1.2);
        -o-transform: scale(1.2);
        transform: scale(1.2);
    }

    .hexagon-item:hover .hex-item:first-child div:before,
    .hexagon-item:hover .hex-item:first-child div:after {
        height: 3px;
    }

    .hexagon-item:hover .hex-item div::before,
    .hexagon-item:hover .hex-item div::after {
        background-color: #ff0037;
    }

    .hexagon-item:hover .hex-content svg {
        -webkit-transform: scale(0.97);
        -moz-transform: scale(0.97);
        -ms-transform: scale(0.97);
        -o-transform: scale(0.97);
        transform: scale(0.97);
    }

    .page-home .hexagon-item:nth-last-child(1),
    .page-home .hexagon-item:nth-last-child(2),
    .page-home .hexagon-item:nth-last-child(3) {
        -webkit-transform: rotate(30deg) translate(51px, -47px);
        -moz-transform: rotate(30deg) translate(51px, -47px);
        -ms-transform: rotate(30deg) translate(51px, -47px);
        -o-transform: rotate(30deg) translate(51px, -47px);
        transform: rotate(30deg) translate(51px, -47px);
    }

    .hex-item {
        position: absolute;
        top: 0;
        left: 29px;
        width: 59px;
        height: 101.88534px;
    }

    .hex-item:first-child {
        z-index: 0;
        -webkit-transform: scale(0.9);
        -moz-transform: scale(0.9);
        -ms-transform: scale(0.9);
        -o-transform: scale(0.9);
        transform: scale(0.9);
        -webkit-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .hex-item:last-child {
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        z-index: 1;
    }

    .hex-item div {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        width: 59px;
        height: 101.88534px;
        -webkit-transform-origin: center center;
        -moz-transform-origin: center center;
        -ms-transform-origin: center center;
        -o-transform-origin: center center;
        transform-origin: center center;
    }

    .hex-item div::before,
    .hex-item div::after {
        background-color: #1e2530;
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        -webkit-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
        -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
        -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
    }

    .hex-item div:before {
        top: 0;
    }

    .hex-item div:after {
        bottom: 0;
    }

    .hex-item div:nth-child(1) {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    .hex-item div:nth-child(2) {
        -webkit-transform: rotate(60deg);
        -moz-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
        -o-transform: rotate(60deg);
        transform: rotate(60deg);
    }

    .hex-item div:nth-child(3) {
        -webkit-transform: rotate(120deg);
        -moz-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
        -o-transform: rotate(120deg);
        transform: rotate(120deg);
    }

    .hex-content {
        color: #fff;
        display: block;
        height: 106px;
        margin: 0 auto;
        position: relative;
        text-align: center;
        transform: rotate(-30deg);
        width: 92px;
    }

    .hex-content .icon {
        display: block;
        font-size: 21px;
        line-height: 18px;
        margin-bottom: 6px;
    }

    .hex-content .title {
        display: block;
        font-family: "Microsoft Yahei", sans-serif;
        font-size: 8px;
        letter-spacing: 1px;
        line-height: 14px;
        text-transform: uppercase;
    }

    .hex-content svg {
        left: -40px;
        position: absolute;
        top: -8px;
        transform: scale(0.87);
        z-index: -1;
        -webkit-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
        -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
        -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
    }

    .hex-content:hover {
        color: #fff;
    }

    .page-home .hexagon-item:nth-last-child(1),
    .page-home .hexagon-item:nth-last-child(2),
    .page-home .hexagon-item:nth-last-child(3) {
        -webkit-transform: rotate(30deg) translate(51px, -47px);
        -moz-transform: rotate(30deg) translate(51px, -47px);
        -ms-transform: rotate(30deg) translate(51px, -47px);
        -o-transform: rotate(30deg) translate(51px, -47px);
        transform: rotate(30deg) translate(51px, -47px);
    }

    /*------------------------------------------------
    Welcome Page
-------------------------------------------------*/
    .author-image-large {
        position: absolute;
        right: 0;
        top: 0;
    }

    .author-image-large img {
        height: -webkit-calc(100vh - 2px);
        height: -moz-calc(100vh - 2px);
        height: calc(100vh - 2px);
    }


    @media (min-width: 706px) {
        .col-lg-offset-2 {
            margin-left: 16.66666667%;
        }
    }

    @media (min-width: 706px) {
        .col-lg-8 {
            width: 66.66666667%;
        }
    }

    .hexagon-item:first-child {
        margin-left: 0;
    }

    .pt-table.desktop-768 .pt-tablecell {
        padding-bottom: 65px;
        padding-top: 35px;
    }



    .hexagon-item:hover .icon i {
        color: #ff0037;
        transition: 0.6s;

    }


    .hexagon-item:hover .title {
        -webkit-animation: focus-in-contract 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        animation: focus-in-contract 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }

    /***************************/

    @-webkit-keyframes focus-in-contract {
        0% {
            letter-spacing: 1em;
            -webkit-filter: blur(7px);
            filter: blur(7px);
            opacity: 0;
        }

        100% {
            -webkit-filter: blur(0px);
            filter: blur(0px);
            opacity: 1;
        }
    }

    @keyframes focus-in-contract {
        0% {
            letter-spacing: 1em;
            -webkit-filter: blur(7px);
            filter: blur(7px);
            opacity: 0;
        }

        100% {
            -webkit-filter: blur(0px);
            filter: blur(0px);
            opacity: 1;
        }
    }





    @media only screen and (max-width: 451px) {
        .hexagon-item {
            float: none;
            margin: 0 auto 29px;
        }

        .hexagon-item:first-child {
            margin-left: auto;
        }

        .page-home .hexagon-item:nth-last-child(1),
        .page-home .hexagon-item:nth-last-child(2),
        .page-home .hexagon-item:nth-last-child(3) {
            -webkit-transform: rotate(30deg) translate(0px, 0px);
            -moz-transform: rotate(30deg) translate(0px, 0px);
            -ms-transform: rotate(30deg) translate(0px, 0px);
            -o-transform: rotate(30deg) translate(0px, 0px);
            transform: rotate(30deg) translate(0px, 0px);
        }

    }

    #miningBg {
        background-color: #111;
        position: absolute;
        top: 0;
        height: 100vh;
        width: 100vw;
        -webkit-filter: blur(calc(let(--blur) * 1px));
        filter: blur(calc(let(--blur) * 1px));
        z-index: 1;
    }

    #mineCanvas {
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        -webkit-filter: blur(calc(let(--blur) * 1px));
        filter: blur(calc(let(--blur) * 1px));
        z-index: 4;
        pointer-events: none;
        background-color: inherit;
    }

    .back-container {
        position: relative;
        z-index: 3;
        padding: 4vw;
        padding-bottom: 0;
    }

    .mining-container {
        position: relative;
        z-index: 3;
        overflow: hidden;

        .header {
            width: 90vw;
            height: 30vw;
            border-radius: 5px;
            background-color: rgba(23, 23, 23, 0.5);
            // background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            color: #D5CBCB;
            margin: 5vw;
            margin-top: 1vw;
            display: flex;

            .hexagon-box {
                position: relative;
                width: 22vw;
                height: 30vw;
            }

            .line {
                width: 1vw;
                height: 18vw;
                background-color: #C8CDD7;
                margin: 6vw 7vw;
            }

            &-des {
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 4.5vw;

                span+span {
                    margin-top: 3vw;
                }
                .scale-num {
                    display: inline-block;
                    transition: all 0.3s;
                }
            }
        }

        .menu {
            margin: 4vw auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 10vw;
            max-width: 350px;

            .hexagon-item {
                margin: -2.1vw;
                position: relative;
                opacity: 0.8;

                .hex-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &-inner {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        // justify-content: center;
                    }

                    .title {
                        font-size: 3.2vw;
                    }

                    .hex-icon {
                        width: 7vw;
                        margin-top: -3vw;
                        margin-bottom: 2vw;
                    }
                }
            }
        }

        .node-list {
            // display: flex;
            // flex-direction: column;
            padding: 5vw;
            margin-top: 10vw;
            overflow-y: scroll;
            height: calc(100vh - 118vw);

            // position: relative;
            &>span {
                color: #C8CDD7;
                font-size: 4.5vw;
            }

            .icon {
                width: 12vw;
                height: 12vw;
                border-radius: 6vw;
                // background-color: #fff;
            }

            .node-list-text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-size: 12px;
                flex: 1 1 auto;
                padding: 0 5vw;
                color: #ababab;

                span:not(:first-child) {
                    margin-left: 12.3vw;
                }
            }

            .node-item {
                padding: 4vw;
                background-color: #1A1B1B;
                border-radius: 3px;
                margin-top: 5vw;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }

        .ripple {
            position: relative;
        }

        .ripple:focus {
            outline: none;
        }

        .ripple:after {
            content: "";
            display: block;
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            pointer-events: none;
            background-color: #ABC7FF;
            background-repeat: no-repeat;
            background-position: 50%;
            opacity: 0;
            transition: all .3s;
        }

        .ripple:active:after {
            opacity: .3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            transition: 0s;
        }
    }
</style>

<style lang="scss">
    .mining-container {
        .el-progress__text {
            color: #C8CDD7;
        }
    }
</style>