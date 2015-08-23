function $(s){
	return document.querySelectorAll(s);
}
var lis = $("#list li"),
	size = 32,
	type = $("#type")[0],
	box = $("#box")[0],
	spanmute = $("#spanmute")[0],
	spanvolume = $("#spanvolume")[0],
	spanvolumeop = $("#spanvolumeop")[0],
	spanvolumebar = $("#spanvolumebar")[0],
	canvas = document.createElement("canvas"),
	height,width,
	ctx = canvas.getContext("2d"),
	dots = [],
	line = null,//线性渐变被覆盖，拿出来声明避免被覆盖
	local = $("#add span")[0],
	playModeBtn = $("#palyModeBtn")[0],
	mv = new MusicVisualizer({
		size:size,
		visualizer:draw
	});

box.appendChild(canvas);
for ( var i = 0; i < lis.length; i++) {
	lis[i].onclick = function() {
		for ( var j = 0; j < lis.length; j++) {
			lis[j].className = "";
		};
		this.className = "selected";
		local.style.color = "white";
		local.innerHTML = "Local Music";
		local.title = "Local Music";
		mv.play("/music/public/media/" + this.title);
	};
};


function random(m,n){
	return Math.round(Math.random()*(n-m)+m);
}

function getDots(){
	dots = [];
	for(var i =0;i<size;i++){
		var x= random(0,width);
		var y = random(0,height);
		var color = "rgba("+random(0,255)+","+random(0,255)+","+random(0,128)+",0)";
		dots.push({
			x:x,
			y:y,
			dx:random(1,4),
			color:color,
			cap:0
		});
	}
}
function resize(){
	height = box.clientHeight;
	width = box.clientWidth;
	canvas.height = height;
	canvas.width = width;
	line = ctx.createLinearGradient(0,0,0,height);
	line.addColorStop(0,"red");
	line.addColorStop(0.5,"yellow");
	line.addColorStop(1,"green");
	//ctx.fillStyle = line;
	getDots();
}
		
function draw(arr){
	ctx.clearRect(0,0,width,height);
	var w = width / size;
	var rectWidth = w * 0.6;
	var capH = rectWidth >10?10:rectWidth;//小帽的高度
	ctx.fillStyle = line;
	if(draw.type=="column"){
		for (var i = 0; i < size; i++) {
			var o = dots[i];
			var h = arr[i]/256 * height;
			ctx.fillRect(w*i,height-h+capH+height*0.04,rectWidth,h);
			ctx.fillRect(w*i,height-(o.cap+capH),rectWidth,capH);
			o.cap--;
			if(o.cap<0){
				o.cap=0;
			}
			if(h>0 && o.cap<h + height*0.04){
				o.cap = (h + height*0.04) > (height - capH) ? (height - capH) : (h + height*0.04);
			}
		}
	}else if(draw.type=="dot"){
		for (var i = 0; i < size; i++) {
			ctx.beginPath();
			var r = 10 + arr[i]/256*(height>width?width:height)/8;
			var o = dots[i];
			ctx.arc(o.x,o.y,r,0,Math.PI*2,true);
			var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
			g.addColorStop(0,"#fff");
			g.addColorStop(1,o.color);
			ctx.fillStyle = g;
			ctx.fill();
			o.x+=o.dx;
			o.x = o.x>width?0:o.x;
		}
	}
}

draw.type = "column";

type.onclick = function(){
	var classList = $("#type i")[0].classList;
	if(draw.type == "column"){
		this.setAttribute("data-type","dot");
		draw.type = "dot";
		classList.remove("fa-bar-chart");
		classList.add("fa-star");
	}else if(draw.type == "dot"){
		this.setAttribute("data-type","column");
		draw.type = "column";
		classList.remove("fa-star");
		classList.add("fa-bar-chart");
	}
};


resize();//初始化
window.onresize = resize;//窗口大小改变时重新初始化


$("#add")[0].onclick = function(){
	$("#upload")[0].click();
};
$("#upload")[0].onchange = function(){
	var file = this.files[0];
	var fr = new FileReader();
	
	fr.onload = function(e){
		mv.play(e.target.result);
	};
	fr.readAsArrayBuffer(file);
	if($(".play")[0]){
		$(".play")[0].className = "";
	}
	local.innerHTML = this.value.substring(this.value.lastIndexOf("\\")+1);
	local.title = this.value.substring(this.value.lastIndexOf("\\")+1);
	local.style.color = "green";
	for ( var j = 0; j < lis.length; j++) {
		lis[j].className = "";
	};
	
};
playModeBtn.onclick = function(event){
	var self = this;
	var playModeSelect = $("#play_mode_select")[0];
	playModeSelect.style.display = "block";
	playModeSelect.style.left = calculateLeft(playModeBtn) +"px";
	playModeSelect.style.top = calculateTop(playModeBtn) +"px";
	var playModes = playModeSelect.childNodes;
	for (var i = 0,len = playModes.length; i < len ; i++) {
		playModes[i].onclick = function(event){
			self.title = this.title;
			self.querySelector("span").innerHTML = this.title;
			self.className = this.className;
			playModeSelect.style.display = "none";
			changeModeSequence(this.title,playModeSelect);
		}
	};
	event.stopPropagation();
};

document.onclick = function () {
	$("#play_mode_select")[0].style.display = "none";
}

//选中一个播放模式之后切换整个列表的顺序，让选中的排在最上面
function changeModeSequence(title,playModeSelect){
	var selectIndex = 0;
	for (var i = 0,len = playModeSelect.childNodes.length; i < len; i++) {
		if(playModeSelect.childNodes[i].title ==title){
			selectIndex = i;
			break;
		}
	};	
	while(selectIndex>0){
		playModeSelect.appendChild(playModeSelect.firstChild);
		selectIndex--;
	}
}

//音量控制
spanmute.onclick = function(){
	this.className = this.className=="volume_open"?"volume_close":"volume_open";
	var volume = this.className=="volume_close"?0:spanvolumeop.offsetLeft/(spanvolume.offsetWidth-spanvolumeop.offsetWidth);
	mv.changeVolume(volume);
	//mv.volumeOpen = this.className=="volume_close"?false:true;
};
spanvolume.onclick = function(event){
	var left = calculateLeft(this);
	var width = this.offsetWidth;
	var percent = Math.floor((event.clientX-left)/width*100);
	spanvolumebar.style.width = percent+"%";
	spanvolumeop.style.left = percent+"%";
	mv.changeVolume(percent/100);
	spanmute.className === "volume_close" && (spanmute.className = "volume_open");
}

function calculateLeft(self){
	var left = self.offsetLeft;
	var parent = self.parentNode;
	while(parent = parent.offsetParent){
		left+=parent.offsetLeft;
	}
	return left;
}
function calculateTop(self){
	var top = self.offsetTop;
	var parent = self.parentNode;
	while(parent = parent.offsetParent){
		top+=parent.offsetTop;
	}
	return top;
}

spanvolumeop.onmousedown = function(event){
	this.style.backgroundPositionY = -16+"px";
	spanvolumebar.style.backgroundPositionY = -22+"px";
	spanmute.className === "volume_close" && (spanmute.className = "volume_open");
	document.onmousemove = function(e){
		var width = spanvolume.offsetWidth;
		var percent = (e.clientX - calculateLeft(spanvolume))/width*100;
		percent = percent>=(100-spanvolumeop.offsetWidth)?(100-spanvolumeop.offsetWidth)	:percent<=0?0:percent;
		spanvolumebar.style.width = percent+"%"; 
		spanvolumeop.style.left =  percent +"%";
		mv.changeVolume(percent/100);
	}
	document.onmouseup = function(e){
		this.onmousemove = null;
		spanvolumeop.style.backgroundPositionY = 0 +"px";
		spanvolumebar.style.backgroundPositionY = 0+"px";
	}
};


mv.changeVolume(spanvolumeop.offsetLeft/(spanvolume.offsetWidth-spanvolumeop.offsetWidth));//默认音量

$("#playbtn")[0].onclick = function(){
	if(this.className==="pausemusic"){
		mv.stopSeconds = mv.getAC().currentTime;
		mv.playedSeconds += Math.floor(mv.stopSeconds - mv.beginSeconds);
		if(!mv.currentBufferSourceNode){
			return ;
		}
		mv.currentBufferSourceNode[mv.currentBufferSourceNode.stop?"stop":noteOff](0);
		console.log("stopSeconds:"+mv.stopSeconds+";playedSeconds:"+mv.playedSeconds+";beginSeconds:"+mv.beginSeconds);
	}else if(this.className === "playmusic"){
		var bufferSource = mv.getAC().createBufferSource();
		mv.currentBufferSourceNode = bufferSource;
		bufferSource.connect(mv.analyser);
		bufferSource.buffer = mv.currentArrayBuffer;//保存解析好的buffer
		bufferSource[bufferSource.start?"start":"noteOn"](mv.getAC().currentTime,mv.playedSeconds);
		mv.beginSeconds = mv.getAC().currentTime;
		mv.currentSource = bufferSource; 
	}

	this.className = this.className=="playmusic"?"pausemusic":"playmusic";
	console.log(mv.getAC().currentTime);
}
