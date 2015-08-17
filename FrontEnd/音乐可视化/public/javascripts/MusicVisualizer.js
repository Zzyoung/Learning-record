function MusicVisualizer(obj){
	this.currentSource = null;
	this.count = 0;
	this.analyser = MusicVisualizer.ac.createAnalyser();
	this.size = obj.size;
	this.analyser.fftSize = this.size * 2;
	this.gainNode = MusicVisualizer.ac[MusicVisualizer.ac.createGain?"createGain":"createGainNode"]();
	this.gainNode.connect(MusicVisualizer.ac.destination);
	this.analyser.connect(this.gainNode);
	this.xhr = new XMLHttpRequest();
	this.visualizer = obj.visualizer;
	this.visualize();//初始化的时候执行一次渲染
	this.initCallback = null;
}

MusicVisualizer.ac = new (window.AudioContext || window.webkitAudioContext)();

MusicVisualizer.prototype.load = function(url,fn){
	url = decodeURI(encodeURI(url));
	this.xhr.abort();
	this.xhr.open("GET",url);
	this.xhr.responseType = "arraybuffer";
	var self = this;
	this.xhr.onload = function(){
		fn(self.xhr.response);//ajax返回之后执行
	};
	this.xhr.send();
};

MusicVisualizer.prototype.decode = function(arraybuffer,fn){
	MusicVisualizer.ac.decodeAudioData(arraybuffer,function(buffer){
		fn(buffer);//解码成功之后执行
	},function(err){
		console.log(err);
	});
};

MusicVisualizer.prototype.play = function(url){
	var n = ++this.count;
	var self = this;
	this.currentSource && this.stop();
	
	if(url instanceof ArrayBuffer){
		self.decode(url,function(){
			self.currentSource = this;
			self.decode(url,function(buffer){
				if(n!=self.count) return;
				var bufferSource = MusicVisualizer.ac.createBufferSource();
				bufferSource.connect(self.analyser);
				bufferSource.buffer = buffer;
				bufferSource[bufferSource.start?"start":"noteOn"](0);
				self.currentSource = bufferSource; 
			});
		});
	}else if(typeof(url) === 'string'){
		this.load(url,function(arraybuffer){
			if(n!=self.count) return;
			self.decode(arraybuffer,function(buffer){
				if(n!=self.count) return;
				var bufferSource = MusicVisualizer.ac.createBufferSource();
				bufferSource.connect(self.analyser);
				bufferSource.buffer = buffer;
				bufferSource[bufferSource.start?"start":"noteOn"](0);
				self.currentSource = bufferSource; 
			});
		});
	}
};

MusicVisualizer.prototype.stop = function(){
	this.currentSource[this.currentSource.stop?"stop":"noteOff"](0);
};

MusicVisualizer.prototype.changeVolume = function(percent){
	this.gainNode.gain.value = percent * percent;
};

MusicVisualizer.prototype.visualize = function(){
	var arr = new Uint8Array(this.analyser.frequencyBinCount);
	requestAnimationFrame = window.requestAnimationFrame || window.webkitrequestAnimationFrame || window.mozrequestAnimationFrame;
	var self = this;
	function v(){
		self.analyser.getByteFrequencyData(arr);
		//draw(arr);
		self.visualizer(arr);
		requestAnimationFrame(v);
	}
	
	requestAnimationFrame(v);
	
};

MusicVisualizer.prototype.addinit = function(fun){
	this.initCallback = fun;
};