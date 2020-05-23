let config = {}
if(process.env.NODE_ENV !== 'production'){
	//开发环境
	config = {
		baseUrl: "https://api.huo-dun.com:9768",
		// baseUrl: "http://221.229.174.49:8766",
		wsUrl: "wss://api.huo-dun.com:9768",
		domain:"https://wap.dogex.app"
	}
}else{
	//生产环境
	config = {
		baseUrl: "https://api.huo-dun.com:9768",
		wsUrl: "wss://api.huo-dun.com:9768",
		domain:"https://wap.dogex.app"
	}
}
export default config;