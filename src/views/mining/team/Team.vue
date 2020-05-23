<template>
     <!-- 团队  -->
    <div class="mining-team">
        <div class="container">
            <div class="back-container">
                <van-icon name="arrow-left" @click="$router.go(-1)" color="#fff" size="20" />
            </div>
            <div class="menu">
                <div class="menu-item">
                    <div
                        class="menu-card"
                        v-for="(item, index) in menuList"
                        :key="index"
                    >
                        <span>{{ item.text }}: {{ item.value }}</span>
                        <div class="bottom-line"></div>
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
            <div class="level-container">
                <van-tabs v-model="active">
                    <van-tab title="个人等级">
                        <div class="node-list">
                            <div 
                                class="node-item"
                                v-for="(item, index) in personList"
                                :key="index"
                                :style="`background:${bgColorList[index]}`"
                            >
                                <div class="name">{{ item.name }}</div>
                                <div class="condition">
                                    <!-- <div> -->
                                        <span v-if="item.directKyc">直推实名: {{ selfInfo.directKyc - item.directKyc > 0 ? item.directKyc : selfInfo.directKyc }}/{{ item.directKyc }}</span>
                                        <span v-if="item.directMining">直推挖矿: {{ selfInfo.directMiningNum - item.directMining > 0 ? item.directMining : selfInfo.directMiningNum }}/{{ item.directMining }}</span>
                                    <!-- </div>
                                    <div> -->
                                        <span v-if="item.directPower">直推算力: {{ selfInfo.childrensPower - item.directPower > 0 ? item.directPower : selfInfo.childrensPower }}/{{ item.directPower }}</span>
                                    <!-- </div> -->
                                </div>
                                <div class="btn-container">
                                    <van-button 
                                        type="default"
                                        round
                                        size="small"
                                        @click="clickHandle(item.id, index, 'personList')"
                                        class="getBtn"
                                        :disabled="item.obtained"
                                    >
                                        <span v-if="!item.obtained">获取</span>
                                        <span v-else>已获得</span>
                                    </van-button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="团队等级">
                        <div class="node-list">
                            <div 
                                class="node-item"
                                v-for="(item, index) in grounpList"
                                :key="index"
                                :style="`background:${bgColorList[index]}`"
                            >
                                <div class="name">{{ item.name }}</div>
                                <div class="condition">
                                    <!-- <div> -->
                                        <span v-if="item.groupKyc">团队实名: {{ selfInfo.groupKyc - item.groupKyc > 0 ?  item.groupKyc : selfInfo.groupKyc  }}/{{ item.groupKyc }}</span>
                                        <span v-if="item.groupMining">团队挖矿: {{ selfInfo.groupMiningNum - item.groupMining > 0 ? item.groupMining : selfInfo.groupMiningNum }}/{{ item.groupMining }}</span>
                                    <!-- </div>
                                    <div> -->
                                        <span v-if="item.groupPower">团队算力: {{ selfInfo.groupPower - item.groupPower > 0 ? item.groupPower : selfInfo.groupPower }}/{{ item.groupPower }}</span>
                                        <span v-if="index === 1 && item.needDirectGroupNum">直推{{ grounpList[index - 1].name }}：{{ item.directGroupNum }}/{{ item.needDirectGroupNum }}</span>
                                        <span v-if="index === 2 && item.needDirectGroupNum">直推{{ grounpList[index - 1].name }}：{{ item.directGroupNum }}/{{ item.needDirectGroupNum }}</span>
                                        <span v-if="index === 3 && item.needDirectGroupNum">直推{{ grounpList[index - 1].name }}：{{ item.directGroupNum }}/{{ item.needDirectGroupNum }}</span>
                                    <!-- </div> -->
                                </div>
                                <div class="btn-container">
                                    <van-button 
                                        type="default"
                                        round
                                        size="small"
                                        @click="clickHandle(item.id, index, 'grounpList')"
                                        class="getBtn"
                                        :style="textColorList[index]"
                                        :disabled="item.obtained"
                                    >
                                        <span v-if="!item.obtained">获取</span>
                                        <span v-else>已获得</span>
                                    </van-button>
                                </div>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <canvas id="teamBg"></canvas>
    </div>
</template>

<script>
    const compare = (property) => {
        return (a, b) => {
            return a[property] - b[property];
        }
    }

    export default {
        name: 'Team',
        data() {
            return {
                active: 0,
                menuList: [
                    {
                        value: 0,
                        text: '直推人数',
                        active: true,
                    },
                    {
                        value: 0,
                        text: '直推算力',
                        active: true,
                    },
                    {
                        value: 0,
                        text: '直推实名',
                        active: false,
                    },
                    {
                        value: 0,
                        text: '直推挖矿',
                        active: false,
                    },
                    {
                        value: 0,
                        text: '团队人数',
                        active: false,
                    },
                    {
                        value: 0,
                        text: '团队实名',
                        active: false,
                    },
                    {
                        value: 0,
                        text: '团队算力',
                        active: false,
                    },
                    {
                        value: 0,
                        text: '团队挖矿',
                        active: false,
                    },
                ],
                process: 20,
                selfInfo: JSON.parse(localStorage.getItem('selfInfo')),
                lvlList: JSON.parse(localStorage.getItem('lvlList')),
                bgColorList: [
                    'linear-gradient(to right, #C3CFE9, #7089A8);',
                    'linear-gradient(to right, #53DFEC, #48D7AD);',
                    'linear-gradient(to right, #ee7752, #e73c7e);',
                    'linear-gradient(to right, #FFE3B1, #EAB45E);',
                ],
                textColorList: [
                    'color: #7089A8',
                    'color: #48D7AD',
                    'color: #EAB45E',
                ],
                timeOut: null,
                myAnimation: null,
            };
        },
        computed: {
            personList() {
                return this.lvlList.filter(v => {
                    return v.type === 'person';
                }).sort(compare('level'));
            },
            grounpList() {
                return this.lvlList.filter(v => {
                    return v.type === 'group';
                }).sort(compare('level'));
            },
        },
        created() {
            this.menuList[0].value = this.selfInfo.directNum;
            this.menuList[1].value = this.selfInfo.childrensPower;
            this.menuList[2].value = this.selfInfo.directKyc;
            this.menuList[3].value = this.selfInfo.directMiningNum;
            this.menuList[4].value = this.selfInfo.groupNum;
            this.menuList[5].value = this.selfInfo.groupKyc;
            this.menuList[6].value = this.selfInfo.groupPower;
            this.menuList[7].value = this.selfInfo.groupMiningNum;
        },
        beforeRouteLeave (to, from, next) {
            cancelAnimationFrame(this.myAnimation);
            const canvas = document.querySelector("#teamBg");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width,canvas.height);
            clearTimeout(this.timeOut);
            next();
        },
        mounted() {
            this.timeOut = setTimeout(()=>{
                this.initCanvas();
            },400)
        },
        methods: {
            clickHandle(levelId, index, type) {
                this.$mts.postUrl({
                    url: 'api/activity/mining/obtainLevel',
                    data:{
                        levelId,
                    },
                    success: (res) => {
                        if(res.data.status === 200){
                            if (res.data.data) {
                                this.$toast('领取成功');
                                this.$set(this[type][index], 'obtained', true);
                                console.log(this[type][index]);
                            } else {
                                this.$toast('领取失败');
                            }
                        } else {
                            this.$toast('领取失败');
                        }
                    }
                });
            },
            initCanvas() {
                const that = this;
                var requestAnimationFrame = window.requestAnimationFrame || function(callback) {
                    window.setTimeout(callback, 1000 / 60)
                };


                var canvas = document.querySelector("#teamBg");
                var ctx = canvas.getContext("2d");
                var maximumPossibleDistance;
                var centerX;
                var centerY;
                var mousePositionX;
                var mousePositionY;
                var mouseElement;
                var isRunning;

                var lines = 0;
                var objects = [];

                var initAnimation = function(){

                    
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    
                    maximumPossibleDistance = Math.round(Math.sqrt((canvas.width * canvas.width) + (canvas.height * canvas.height)));  
                    
                    centerX = Math.floor(canvas.width / 2);
                    centerY = Math.floor(canvas.height / 2);
                    
                    objects.length = 0;
                    clearCanvas();
                    createParticles();

                };

                window.addEventListener("resize", function(){initAnimation();},false);

                var options = {

                    particlesNumber: 80,
                    initialSize: 3,
                    moveLimit: 50,
                    durationMin: 50,
                    durationMax: 300,
                    drawConnections: true,
                    mouseInteractionDistance:150,
                    mouseGravity:true,
                    drawMouseConnections:true,
                    red:255,
                    green:0,
                    blue:255,
                    opacity:1,
                    connectionRed:255,
                    connectionGreen:255,
                    connectionBlue:255,
                    connectionOpacity:0.1,
                    mouseConnectionRed:255,
                    mouseConnectionGreen:255,
                    mouseConnectionBlue:255,
                    mouseConnectionOpacity:0.1
                    
                }

                // ----------------------------------------------------
                // Helper functions //
                //-----------------------------------------------------

                var getRandomBetween = function(a, b) {

                    return Math.floor(Math.random() * b) + a;

                };

                var hitTest = function(object1, object2) {


                    if ((object1.positionX < object2.positionX + object2.size) && (object1.positionX + object2.size > object2.positionX) &&
                        (object1.positionY < object2.positionY + object2.size) && (object1.positionY > object2.positionY)) {

                        return true;


                    } else {

                        return false;

                    };


                };

                // Get distance between particles by using Pythagorean theorem

                var getDistance = function(element1, element2) {


                    var difX = Math.round(Math.abs(element1.positionX - element2.positionX));
                    var difY = Math.round(Math.abs(element1.positionY - element2.positionY));

                    return Math.round(Math.sqrt((difX * difX) + (difY * difY)));


                };



                // ----------------------------------------------------
                // Particle constructor function //
                //-----------------------------------------------------
                function Particle(positionX, positionY, size, red, green, blue, opacity) {

                    this.positionX = positionX;
                    this.positionY = positionY;
                    this.size = size;

                    this.duration = getRandomBetween(options.durationMin, options.durationMax);
                    this.limit = options.moveLimit
                    this.timer = 0;

                    this.red = red
                    this.green = green
                    this.blue = blue
                    this.opacity = opacity


                    this.color = "rgba(" + this.red + "," + this.green + "," + this.blue + ",+" + this.opacity + ")";

                };

                // ----------------------------------------------------
                // Mouse Particle constructor function //
                //-----------------------------------------------------
                function MouseParticle(positionX, positionY, size, red, green, blue, opacity) {

                    this.positionX = mousePositionX;
                    this.positionY = mousePositionY;
                    this.size = size;

                    this.red = red
                    this.green = green
                    this.blue = blue
                    this.opacity = opacity


                    this.color = "rgba(" + this.red + "," + this.green + "," + this.blue + ",+" + this.opacity + ")";

                };




                Particle.prototype.animateTo = function(newX, newY) {

                    var duration = this.duration;

                    var animatePosition = function(newPosition, currentPosition) {

                        if (newPosition > currentPosition) {

                            var step = (newPosition - currentPosition) / duration;
                            newPosition = currentPosition + step;

                        } else {

                            var step = (currentPosition - newPosition) / duration;
                            newPosition = currentPosition - step;

                        };

                        return newPosition;

                    }

                    this.positionX = animatePosition(newX, this.positionX)
                    this.positionY = animatePosition(newY, this.positionY)



                    // generate new vector

                    if (this.timer == this.duration) {

                        this.calculateVector();
                        this.timer = 0;

                    } else {

                        this.timer++;

                    }


                };

                Particle.prototype.updateColor = function() {

                    this.color = "rgba(" + this.red + "," + this.green + "," + this.blue + ",+" + this.opacity + ")";

                };

                Particle.prototype.calculateVector = function() {


                    var distance
                    var newPosition = {};
                    var particle = this;

                    var getCoordinates = function() {


                        newPosition.positionX = getRandomBetween(0, window.innerWidth);
                        newPosition.positionY = getRandomBetween(0, window.innerHeight);

                        distance = getDistance(particle, newPosition);

                    };

                    while ((typeof distance === "undefined") || (distance > this.limit)) {

                        getCoordinates();

                    }


                    this.vectorX = newPosition.positionX;
                    this.vectorY = newPosition.positionY;


                };


                Particle.prototype.testInteraction = function() {

                    if (!options.drawConnections) return;
                    
                    var closestElement;
                    var distanceToClosestElement = maximumPossibleDistance;

                    for (var x = 0; x < objects.length; x++) {

                        var testedObject = objects[x];
                        var distance = getDistance(this, testedObject)


                        if ((distance < distanceToClosestElement) && (testedObject !== this)) {

                            distanceToClosestElement = distance;
                            closestElement = testedObject;

                        }
                        
                        // Hittest

                    /* if (hitTest(this, testedObject)) {

                            var winner = true;

                            if (this.size > testedObject.size) {

                                var objToDelete = testedObject
                                var objToSave = this


                            } else if (this.size < testedObject.size) {

                                var objToDelete = this
                                var objToSave = testedObject

                            } else {

                                winner = false

                            }


                            if (winner) {

                                var index = objects.indexOf(objToDelete)
                                objects.splice(index, 1)
                                objToSave.size++;



                                if (objToSave.opacity <= 1) objToSave.opacity += 0.1;

                                objToSave.updateColor();
                            }

                        }*/
                        
                        // Hittest end



                    };

                    if (closestElement) {

                        ctx.beginPath();
                        ctx.moveTo(this.positionX + this.size / 2, this.positionY + this.size / 2);
                        ctx.lineTo(closestElement.positionX + closestElement.size * 0.5, closestElement.positionY + closestElement.size * 0.5);
                        ctx.strokeStyle = "rgba(" + options.connectionRed + ","+ options.connectionGreen +","+ options.connectionBlue +"," + options.connectionOpacity + ")";
                        ctx.stroke();
                        lines++
                    }

                };

                MouseParticle.prototype.testInteraction = function() {  

                    if (options.mouseInteractionDistance === 0) return;
                        
                    var closestElements = []
                    var distanceToClosestElement = maximumPossibleDistance;

                    for (var x = 0; x < objects.length; x++) {

                        var testedObject = objects[x];
                        var distance = getDistance(this, testedObject)


                        if ((distance < options.mouseInteractionDistance) && (testedObject !== this)) {

                            
                            closestElements.push(objects[x])

                        }
                        
                    }

                    
                    for (var x = 0; x < closestElements.length; x++) {
                    
                    
                        if (options.drawMouseConnections) {
                        
                            var element = closestElements[x]
                            ctx.beginPath();
                            ctx.moveTo(this.positionX, this.positionY);
                            ctx.lineTo(element.positionX + element.size * 0.5, element.positionY + element.size * 0.5);
                            ctx.strokeStyle = "rgba(" + options.mouseConnectionRed + ","+ options.mouseConnectionGreen +","+ options.mouseConnectionBlue +"," + options.mouseConnectionOpacity + ")";
                            ctx.stroke();
                            lines++ 
                        
                        }
                        
                        if (options.mouseGravity) {
                            
                            closestElements[x].vectorX = this.positionX;
                            closestElements[x].vectorY = this.positionY;
                        
                        }
                        
                    
                    
                
                    
                    }
                

                };

                Particle.prototype.updateAnimation = function() {

                    this.animateTo(this.vectorX, this.vectorY);
                    this.testInteraction();
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.positionX, this.positionY, this.size, this.size);

                };



                MouseParticle.prototype.updateAnimation = function() {
                    
                    
                    this.positionX = mousePositionX;
                    this.positionY = mousePositionY;

                    this.testInteraction();
                    

                };


                var createParticles = function() {

                    // create mouse particle
                    mouseElement = new MouseParticle(0, 0, options.initialSize, 255, 255, 255)
                
                
                    for (var x = 0; x < options.particlesNumber; x++) {

                        var randomX = Math.floor((Math.random() * window.innerWidth) + 1);
                        var randomY = Math.floor((Math.random() * window.innerHeight) + 1);

                        var particle = new Particle(randomX, randomY, options.initialSize, options.red, options.green, options.blue, options.opacity)
                        particle.calculateVector()

                        objects.push(particle)

                    }
                    
                

                };


                var updatePosition = function() {

                    for (var x = 0; x < objects.length; x++) {

                        objects[x].updateAnimation()

                    }
                    
                    // handle mouse 
                    mouseElement.updateAnimation()
                    
                    
                    

                };


                window.onmousemove = function(e){
                
                    mousePositionX = e.clientX;
                    mousePositionY = e.clientY;

                }

                var clearCanvas = function() {

                    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)


                };

                var stopAnimation = function(){


                window.cancelAnimationFrame(myAnimation)
                isRunning = false;

                };



                // ----------------------------------------------------
                // FPS //
                //-----------------------------------------------------
                var lastCalledTime
                var fps
                var averageFps;
                var averageFpsTemp = 0;
                var averageFpsCounter = 0;


                function requestFps() {

                    if (!lastCalledTime) {

                        lastCalledTime = Date.now();
                        fps = 0;
                        return;

                    }
                    
                    

                    const delta = (new Date().getTime() - lastCalledTime) / 1000;
                    lastCalledTime = Date.now();
                    fps = Math.floor(1 / delta);
                    
                    averageFpsTemp = averageFpsTemp + fps;
                    averageFpsCounter++;
                    
                    if ( averageFpsCounter === 5) {
                    
                        
                        averageFps = Math.floor(averageFpsTemp / 5) 
                        averageFpsCounter = 0;  
                        averageFpsTemp = 0; 
                    }
                    
                    if (!averageFps) {
                        
                        return;
                    
                    } else if (averageFps < 10) {
                        
                    
                    
                    
                    }
                    
                    
                
                }





                // ----------------------------------------------------
                // Init! //
                //-----------------------------------------------------

                var loop = function() {

                    clearCanvas();
                    updatePosition();


                    ctx.fillStyle = "#fff";
                    // ctx.fillText("FPS: " + fps + " lines: " + lines + " Average FPS: " + averageFps , 10, 20);
                    lines = 0;

                
                    that.myAnimation = requestAnimationFrame(loop);
                    isRunning = true;
                    requestFps();

                };

                initAnimation();
                loop();
            },
        }
    };
</script>

<style lang="scss" scoped>
    canvas {
        background-color: #111;
        position: absolute;
        top: 0;
        height: 100vh;
        width: 100vw;
        z-index: 1;
    }
    .mining-team {
        width: 100vw;
        min-height: 100vh;
        // background-color: #F1F5F8;
        // background-color: #333;
        background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        filter: drop-shadow(0 0 10px white);
        .container {
            width: 100vw;
            min-height: 100vh;
            position: relative;
            z-index: 2;
            // background-image:radial-gradient(circle at 2% 60%,#9c1f8f,transparent 100%),radial-gradient(circle at 98% 70%,#000c91,transparent 100%),radial-gradient(circle at 50% 50%,#ed68ed,transparent 100%);
        }

        .back-container {
            padding: 4vw 4vw 1vw;
        }

        .menu {
            // display: flex;
            // flex-wrap: wrap;
            padding: 0 2vw 5vw;
            .menu-item {
                display: flex;
                flex-wrap: wrap;
                .menu-card + .menu-card {
                    margin-left: 1vw;
                }
                .menu-card {
                    width: 32.6%;
                    color: #fff;
                    // flex: 1 1 auto;
                    background-color: #1e2530;
                    opacity: 0.8;
                    height: 90px;
                    margin-top: 1vw;
                    padding: 3vw;
                    box-sizing: border-box;
                    transition: width 0.8s, opacity 0.8s;
                    font-size: 12px;
                    &:nth-child(4), &:nth-child(7) {
                        margin-left: 0;
                    }
                    .bottom-line {
                        height: 2px;
                        width: 10vw;
                        background-color: #3A80F0;
                        transition: width 0.8s;
                    }
                }
            }
        }

        .level-container {
            .node-list {
                // display: flex;
                // flex-direction: column;
                padding: 5vw;
                height: calc(100vh - 118vw);
                overflow-y: scroll;
                &>span {
                    font-size: 4.5vw;
                }

                .node-list-text {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #C8CDD7;
                }

                .node-item {
                    padding: 4vw;
                    color: #fff;
                    border-radius: 3px;
                    margin-top: 5vw;
                    .name {
                        font-size: 4.5vw;
                        margin-bottom: 3vw;
                    }
                    .condition {
                        border-bottom: 1px solid #fff;
                        // div {
                        //     display: flex;
                        //     justify-content: space-between;
                        //     margin-bottom: 2vw;
                        // }
                        span {
                            display: inline-block;
                            width: 50%;
                            margin-bottom: 2vw;
                            &:nth-child(2n) {
                                text-align: right;
                            }
                        }
                    }
                    .btn-container {
                        margin-top: 3vw;
                        display: flex;
                        flex-direction: row-reverse;
                        .getBtn {
                            width: 10vw;
                        }
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    .mining-team {
        .van-circle__text {
            color: #C8CDD7;
        }
        .van-tabs__wrap {
            opacity: 0.8;
            background-color: #1e2530;
        }
        .van-tabs__nav {
            background-color: #1e2530;
        }
        .van-tab__text {
            color: #fff;
        }
    }
</style>
