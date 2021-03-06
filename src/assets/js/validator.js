const validator = {
	checkValue(value,type){
		var regular = "";
		switch(type){
			case "number": 			//数字
				regular = /^[0-9]+.?[0-9]*$/;
				break;
			case "int": 			//正整数
				regular = /^[0-9]*[1-9][0-9]*$/;
				break;
			case "noint": 			//非负整数
				regular = /^(0|[1-9]\d*)$/;
				break;
			case "string": 			//字符串
				regular = /^\s*$/g;
				break;
			case "sms4": 			//4位验证码
				regular = /^\d{4}$/;
				break;
			case "sms6": 			//6位验证码
				regular = /^\d{6}$/;
				break;
			case "time": 			//时间 0000-00-00
				regular = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;
				break;
			case "qq": 				//QQ号
				regular = /^\d{5,11}$/;
				break;
			case "mobile": 			//中国手机号码
				regular = /^1[3456789]\d{9}$/;
				break;
			case "email": 			//邮箱
				regular = /^.+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				break;
			case "username": 		//用户名:邮箱/手机
				regular = /^.+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$|^1[3456789]\d{9}$/;
				break;
			case "idcard": 			//15/18位中国身份证
				regular = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
				break;
			case "passport": 			// 中国护照
				regular = /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/;
				break;
			case "password": 		//数字、字母、符号至少两种组合的6-16位密码
				// regular = /^(?!^\d*$)(?!^[a-zA-Z]*$)(?!^[-_*+@]*$)[-\d\w*+@]{6,16}$/;
				regular = /((?=.*[0-9])(?=.*[A-z]))|((?=.*[A-z])(?=.*[^A-z0-9]))|((?=.*[0-9])(?=.*[^A-z0-9]))^.{6,16}$/
				break;
			case "random6": 		//6位以上任意字符
				regular = /^.{6,}$/;
			break;
			case "uppercase": 		//大写字母
				regular = /^.*([A-Z])+.*$/;
				break;
			case "lowercase": 		//小写字母
				regular = /^.*([a-z])+.*$/;
				break;
			case "inter": 		//数字
				regular = /^.*([0-9])+.*$/;
				break;
			case "eth":
				regular = /^(0x)?[0-9a-fA-F]{40}$/
				break;
		}
		return regular.test(value);
	}
}
export default validator;




















