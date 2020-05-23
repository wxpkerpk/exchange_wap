export default class countdown{
	constructor(parameter){
		this.startTime = new Date(parameter.startTime).getTime();
		this.endTime = new Date(parameter.endTime).getTime();
		this.endhanlder = parameter.endhanlder;
		this.interval = null;
		this.time = "00:00";
		this._init();
	}

	_init(){
		this._setInterval();
	}

	_setInterval(){
		this.interval = setInterval(()=>{
			let now 		= this.startTime;
			let enddate 	= this.endTime;
			let leftTime 	= enddate - now;

			if(leftTime<0){
				this._destroyInterval();
				return;
			}else{
				this.startTime = this.startTime + 1000
			}

			var leftsecond 	= parseInt(leftTime/1000);
			var day 		= Math.floor(leftsecond/(60*60*24));
			day = this._formatZero(day)
			var hour 		= Math.floor((leftsecond-day*24*60*60)/3600);
			hour = this._formatZero(hour)
			var minute 		= Math.floor((leftsecond-day*24*60*60-hour*3600)/60);
			minute = this._formatZero(minute)
			var second 		= Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60);
			second = this._formatZero(second)

			this.time = `${minute}:${second}`;
		},1000);
	}

	_formatZero(number){
		return number<10?"0"+number:number;
	}

	_destroyInterval(){
		this.endhanlder();
		clearInterval(this.interval);
	}
	clear(){
		clearInterval(this.interval);
	}

}