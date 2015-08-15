var data = ["IPhone6","三星笔记本","IPad","谢谢参与","索尼游戏机","小米电视机","50元充值卡","100元超市购物券"],
	timer =  null,
	started = false;

window.onload = function(){
	var play = document.getElementById("play"),
		stop = document.getElementById("stop");

	//开始抽奖
	play.onclick = palyFun;

	stop.onclick = stopFun;

	//键盘事件
	document.onkeyup = function (event) {
		event = event || window.event;
		if(event.keyCode == 13){
			if(started===false){
				palyFun();
			}else{
				stopFun();
			}
		}
	}
}

function palyFun () {
	var title = document.getElementById("title"),
		play = document.getElementById("play");
	clearInterval(timer);
	timer = setInterval(function(){
		var random = Math.floor(Math.random()*data.length);
		title.innerHTML = data[random];
	},50);
	play.style.background = '#999';
	started = true;
}

function stopFun () {
	clearInterval(timer);
	var play = document.getElementById("play");
	play.style.background = "#036";
	started = false;
}