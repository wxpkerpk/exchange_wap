let config = {}
if(process.env.NODE_ENV !== 'production'){
	//开发环境
	config = {
		baseUrl : "http://127.0.0.1:8880",
		nettyWssUrl: 'wss://stream.btbit.io',
  		chatWsUrl:'wss://stream.btbit.io',
  		drawWsUrl:'wss://stream.btbit.io',
		domain:'https://wap.btbit.io'
	}
}else{
	//生产环境
	config = {
		baseUrl : "https://api.btbit.io",
		nettyWssUrl: 'wss://stream.btbit.io',
  		chatWsUrl:'wss://stream.btbit.io',
  		drawWsUrl:'wss://stream.btbit.io',
		domain:'https://wap.btbit.io'
	}
}
export default config;