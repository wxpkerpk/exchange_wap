//let proxy = require('http-proxy-middleware');
const path = require('path')

function resolve (dir) {
	console.log(dir)
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
	devServer: {
		// proxy: {
	    //   	'/api': {
	    //     	target: 'https://api.btbit.io',
	    //     	ws: true,
	    //     	changeOrigin: true
	    //   	}
	    // }
	}
}

