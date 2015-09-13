window.onload = function(){
	var interval = null;
	var timeout = null;
	var msg = document.getElementById("zh-top-nav-count-wrap");
	var buttons = document.querySelectorAll('.zm-noti7-popup-tab-item');
	var scrollPanels = document.querySelectorAll('.zh-scroller-inner');
	var barContainers = document.querySelectorAll('.zh-scroller-bar-container');
	var panel = document.getElementById("zh-top-nav-live-new");
	var panels = document.querySelectorAll(".zm-noti7-content");
	msg.onclick = function(event){
		event = Utils.getEvent(event);
		var panelStyle = Utils.getComputedStyle(panel);
		if(panelStyle.display == "block"){
			panel.style.display = "none";
		}else if(panelStyle.display == "none"){
			panel.style.display = "block"
			//初始化滚动条长度
			for (var i = 0; i < scrollPanels.length; i++) {
				var scrollerBar = scrollPanels[i].parentNode.querySelector('.zh-scroller-bar');
				var height = scrollPanels[i].scrollHeight;
				scrollerBar.style.height = (300*296/height)+"px";
			};
		}
		Utils.preventDefault(event);
		Utils.stopPropagation(event);
	};
	document.onclick = function(event){
		event = Utils.getEvent(event);
		var panel = document.getElementById("zh-top-nav-live-new");
		var panelStyle = Utils.getComputedStyle(panel);
		if(panelStyle.display == "block"){
			panel.style.display = "none";
		}
		Utils.preventDefault(event);
	};
	document.querySelector('#zh-top-nav-live-new').onclick = function (event) {
		event = Utils.getEvent(event);
		Utils.stopPropagation(event);
	};
	function clearTimer () {
		clearInterval(interval);
		clearTimeout(timeout);
	}
	function hideBarTimer(scrollerBar,delay){
		clearTimer();
		timeout = setTimeout(function(){
			interval = setInterval(function () {
				Utils.hideBar(scrollerBar);
				if(Utils.getComputedStyle(scrollerBar).display==="none"){
					clearInterval(interval);
				}
			},50);
		},delay);
	}
	function showBar (scrollerBar) {
		scrollerBar.style.opacity = 0.5;
		scrollerBar.style.display = "block";
	}

	for (var i = 0; i < buttons.length; i++) {
		(function(i){
			//三个小标签
			var scrollerBar = panels[i].querySelector('.zh-scroller-bar');
			buttons[i].onclick = function(event){
				//设置current样式
				for (var k = 0; k < buttons.length; k++) {
					if(Utils.containsClass(buttons[k],"current")){
						Utils.removeClass(buttons[k],"current");
					}
				};
				Utils.addClass(this,"current");
				event = Utils.getEvent(event);


				for (var j = 0; j < panels.length; j++) {
					panels[j].style.display = "none";
				};
				panels[i].style.display = "block";

				showBar(scrollerBar);
				hideBarTimer(scrollerBar,500);
				Utils.stopPropagation(event);
			}
			//显示面板
			function handler(event){
				event = Utils.getEvent(event);
				showBar(scrollerBar);
				var scrollTop = scrollPanels[i].scrollTop,
					totalHeight = scrollPanels[i].scrollHeight,
					viewHeight = scrollPanels[i].offsetHeight,
					barHeight = scrollerBar.offsetHeight,
					barTop = scrollerBar.offsetTop,
					addTop = subTop = (300*120/totalHeight);
				if(Utils.getWheelDelta(event)<0){
					//向下滚动
					if(barHeight+barTop+addTop>298){
						scrollerBar.style.top = 298-barHeight +"px";
					}else{
						scrollerBar.style.top = barTop + addTop +"px"; 
					}
					scrollPanels[i].scrollTop += 120;
				}else if(Utils.getWheelDelta(event)>0){
					//向上滚动
					if(barTop - subTop<=2){
						scrollerBar.style.top = 2 +"px";
						scrollPanels[i].scrollTop = 0;
					}else{
						scrollPanels[i].scrollTop -= 120;
						scrollerBar.style.top = barTop - subTop +"px"; 
					}
				}
				hideBarTimer(scrollerBar,1200);
				Utils.preventDefault(event);
			}
			scrollPanels[i].onmouseover = function(){
				(function () {
					Utils.addEventListener(document,"mousewheel",handler);
					Utils.addEventListener(document,"DOMMouseScroll",handler);
				})();
			};
			scrollPanels[i].onmouseout = function(){
				Utils.removeEventListener(document,"mousewheel",handler);
				Utils.removeEventListener(document,"DOMMouseScroll",handler);
			};

			//滚动条容器
			scrollerBar.onmouseover = function(){
				clearTimer();
				barContainers[i].style.opacity = 0.2;
				showBar(scrollerBar);
				scrollerBar.onmouseout = function () {
					barContainers[i].style.opacity = 0;
					hideBarTimer(scrollerBar,1200);
				};
			};
			scrollerBar.onmousedown = function(event){
				var scrollerBar = this,
				oriClientY = event.clientY,
				oriOffsetTop = scrollerBar.offsetTop,
				oriPanelTop = scrollPanels[i].scrollTop,
				event = Utils.getEvent(event);
				//拖动滚动条
				document.onmousemove = function(e){
					clearTimer();
					barContainers[i].style.opacity = 0.2;
					showBar(scrollerBar);

					e = Utils.getEvent(e);
					var scrollClientY = e.clientY-oriClientY;

					scroll(oriOffsetTop,scrollClientY,oriPanelTop,scrollPanels[i].scrollHeight);
				};
				//松开鼠标，取消事件
				document.onmouseup = function(event){
					this.onmousemove = null;
					barContainers[i].style.opacity = 0;
					hideBarTimer(scrollerBar,1200);
				};
				Utils.preventDefault(event);
			};
			barContainers[i].onclick = function(event){
				event = Utils.getEvent(event);
				var clientY = event.clientY,
				barHeight = scrollerBar.offsetHeight,
				oriOffsetTop = scrollerBar.offsetTop,
				oriPanelTop = scrollPanels[i].scrollTop,
				scrollClientY = clientY - Utils.calculateTop(barContainers[i]) - oriOffsetTop - barHeight / 2;

				scroll(oriOffsetTop,scrollClientY,oriPanelTop,scrollPanels[i].scrollHeight);
				Utils.stopPropagation(event);
			}
			function scroll (oriOffsetTop,scrollClientY,oriPanelTop,totalHeight) {
				if(oriOffsetTop + scrollClientY <=2){
					scrollerBar.style.top = "2px";	
				}else if(oriOffsetTop + scrollClientY + scrollerBar.offsetHeight >=298){
					scrollerBar.style.top = 298-scrollerBar.offsetHeight+"px";
				}else{
					scrollerBar.style.top = oriOffsetTop + scrollClientY + "px"; 
				}
				scrollPanels[i].scrollTop =oriPanelTop + parseInt((totalHeight -300)/(296-scrollerBar.offsetHeight)*scrollClientY,10);
			}
			barContainers[i].onmouseover = function () {
				clearTimer();
				barContainers[i].style.opacity = 0.2;
				showBar(scrollerBar);
				barContainers[i].onmouseout = function () {
					barContainers[i].style.opacity = 0;
					hideBarTimer(scrollerBar,1200);
				};
			};
		})(i);
	};
	
};
