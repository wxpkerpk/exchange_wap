//let proxy = require('http-proxy-middleware');
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
	publicPath:"./",
	configureWebpack: config => {
    	if (process.env.NODE_ENV === 'production') {
			config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    	} else {
			
    	}
  	},
	// devServer: {
	// 	proxy: {
	// 		'/api': {
	// 			// target: 'http://277t463h35.qicp.vip/',
	// 			// target:'http://192.168.0.130:8765',
	// 			ws: true,
	// 			changeOrigin: true
	// 		}
	// 	}
	// }
}

