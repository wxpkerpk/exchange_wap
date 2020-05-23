<template>
<div>
    <router-view/>
</div>
</template>
<script>
export default {
	data(){
    	return {
            symbol:'',
            heartbeat:null
    	}
    },
  	components:{  },
    watch: {
        '$store.state.symbol':function(cur, old){//重新订阅
            let that = this;
            if(cur && cur != old){
                let type = that.$route.name;
                clearInterval( that.heartbeat);
                if (type != 'secondContract') {
                    that.history();
                    that.heartbeat = setInterval(()=>{
                        that.history();
                    },1000);
                }
            }
        },
        '$route.name':function(cur,old){
            if (cur != 'trade' && cur != 'tradeDetail') {
                clearInterval( this.heartbeat);
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        let that = this;
        that.$store.state.symbol = "";// 置空
        clearInterval( that.heartbeat);
        next();
    },
    beforeDestroy(){
        let that = this;
        that.$store.state.symbol = "";// 置空
        clearInterval( that.heartbeat);
    },
	mounted(){
        this.$store.state.symbol = this.$route.params.symbol;
        this.symbol = this.$route.params.symbol;
        this.$mts.configure();
        this.$mts.checkLogin('clear',()=>{
        });
	},
	methods:{
		clientId(){
		    // 当前登录用户
		    let token = !localStorage.getItem('token')?'empty':localStorage.getItem('token');
		    return token+'_'+this.symbol;
		},
        curCoin(tick){
            if (tick) {
                return tick.symbol + '_' + tick.market;
            }
            return '';
        },
        coin() {
            return this.$mts.getVs(this.$store.state.symbol, 0);
        },
        market() {
            return this.$mts.getVs(this.$store.state.symbol, 1);
        },
        current() { // 当前交易货币配置
            if (!this.market || !this.$store.state.coin) {
                return null;
            }
            return this.$store.state.coin[this.market];
        },
        digit() {
            let token = this.current;
            if (token && token.digit) {
                return token.digit[0];
            }
            return 8;
        },
        history(){
            let that = this;
            that.$mts.post({
                url:'trade/history',
                data:{
                    symbol: that.$store.state.symbol
                },success(response){
                    if (response.data.code==200) {
                        that.onmessage(response.data.data);
                    } else {
                        // 错误信息
                    }
                }
            });
        },
        onmessage(data){
            let that = this;
            that.$store.state.ws.tick = data.tick;
            that.$store.state.ws.history = data.history;
            that.queue(data); 
            if (that.$store.state.isLogin) {
                that.$store.state.ws.actives = data.actives;
                that.$store.state.ws.capital = data.capital;
            }
        },
        queue( data){
            let that = this;
            let buys = data.buys ? 
                        data.buys[ that.digit] : that.$store.state.ws.buys;

            let sells = data.sells ? 
                        data.sells[ that.digit] : that.$store.state.ws.sells;          
            let ask = {}; // 
            let bid = {};
            if ( buys && sells) {
                for(let b = 0;b < buys.length;b ++){
                    let bv = buys[ b];
                    for(let s = sells.length - 1; s >= 0; s --){
                        let sv = sells[ s];

                        if ( bv.price >= sv.price) {
                            let number = bv.number - sv.number;

                            let total = bv.total - sv.total;

                            if ( number > 0) {
                                ask[bv.price] = [number, total];

                                bid[bv.price] = [0, 0];
                            } else if( number < 0){
                                bid[bv.price] = [-number, -total];

                                ask[bv.price] = [0, 0];
                            } else {
                                ask[bv.price] = [0, 0];

                                bid[bv.price] = [0, 0];
                            }

                        }

                    }
                    if ( !that.$mts.isEmpty( ask)) {
                        let newbuys = [];
                        for(let idx = 0;idx < buys.length;idx ++) {

                            let item = buys[ idx];

                            let array = ask[ item.price];
                            if ( array && array.length > 0) {
                                if ( array[0] > 0) {
                                    newbuys.push( {
                                        price: item.price,
                                        number: array[0],
                                        total: array[1]
                                    });
                                }
                            } else {
                                newbuys.push( item);
                            }

                        }

                        data.buys[ that.digit] = newbuys;
                    }

                    if ( !that.$mts.isEmpty( bid)) {
                        let newsells = [];
                        for(let idx = 0;idx < sells.length;idx ++) {

                            let item = sells[ idx];

                            let array = bid[ item.price];
                            if ( array && array.length > 0) {
                                if ( array[0] > 0) {
                                    newsells.push( {
                                        price: item.price,
                                        number: array[0],
                                        total: array[1]
                                    });
                                }
                            } else {
                                newsells.push( item);
                            }

                        }
                        data.sells[ that.digit] = newsells;
                    }
                }
            }
            if (data.buys) {
                that.$store.state.ws.buys =  data.buys;
            }
            if (data.sells) {
                that.$store.state.ws.sells =  data.sells;
            }

            let vBid = false, vAsk = false;
            if (!that.$mts.isEmpty(data.buys)) {
                vBid = true;
                that.$store.state.ask = true;
            }
            if (!that.$mts.isEmpty(data.sells)) {
                vAsk = true;
                that.$store.state.bid = true;
            }
            that.$store.state.bidask = vAsk && vBid;
        }

	}
}
</script>