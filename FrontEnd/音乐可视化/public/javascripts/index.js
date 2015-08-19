function $(s){
	return document.querySelectorAll(s);
}
var lis = $("#list li"),
	size = 32,
	type = $("#type")[0],
	box = $("#box")[0],
	spanmute = $("#spanmute")[0],
	spanvolume = $("#spanvolume")[0],
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
$("#volume")[0].onmousedown = function() {
	this.onmousemove = function() {
		mv.changeVolume(this.value / this.max);
	};
};
mv.changeVolume(0.2);//默认音量

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
playModeBtn.onclick = function(){
	var self = this;
	var playModeSelect = $("#play_mode_select")[0];
	playModeSelect.style.display = "block";
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
};

//选中一个播放模式之后切换整个列表的顺序，让选中的排在最下面
function changeModeSequence(title,playModeSelect){
	console.log(title);
	var selectIndex = 0;
	for (var i = 0,len = playModeSelect.childNodes.length; i < len; i++) {
		if(playModeSelect.childNodes[i].title ==title){
			selectIndex = i;
			break;
		}
	};	
	while(selectIndex<3){
		playModeSelect.insertBefore(playModeSelect.removeChild(playModeSelect.lastChild),playModeSelect.firstChild);
		selectIndex++;
	}
}
spanmute.onclick = function(){
	this.className = this.className=="volume_open"?"volume_close":"volume_open";
};
spanvolume.onclick = function(event){
	var left = calculateLeft(this);
	var width = this.offsetWidth;
	var percent = Math.floor((event.clientX-left)/width*100);
	console.log(percent);
	$("#spanvolumebar")[0].style.width = percent+"%";
	$("#spanvolumeop")[0].style.left = percent+"%";

}

function calculateLeft(self){
	var left = self.offsetLeft;
	var parent = self.parentNode;
	while(parent = parent.parentNode){
		if(parent===document.body){
			break;
		}
		left+=parent.offsetLeft;
	}
	return left;
}