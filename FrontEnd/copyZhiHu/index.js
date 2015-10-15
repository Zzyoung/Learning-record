window.onload = function(){
	var timeout = null;
	var msgBox = document.getElementById("zh-top-nav-count-wrap");
	var buttons = document.querySelectorAll('.zm-noti7-popup-tab-item');
	var scrollPanels = document.querySelectorAll('.zh-scroller-inner');
	var barContainers = document.querySelectorAll('.zh-scroller-bar-container');
	var panel = document.getElementById("zh-top-nav-live-new");
	var panels = document.querySelectorAll(".zm-noti7-content");
	msgBox.onclick = function(event){
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
	function hideBarTimer(scrollerBar,delay){
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			Utils.hideBar(scrollerBar);
			if(Utils.getComputedStyle(scrollerBar).display!=="none"){
				timeout = setTimeout(arguments.callee,50);
			}
		},delay);
	}
	function showBar (scrollerBar) {
		scrollerBar.style.opacity = 0.5;
		scrollerBar.style.display = "block";
	}
	function showBarContainer (container) {
		container.style.opacity = 0.2;
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
			var handler = function (event){
				event = Utils.getEvent(event);
				showBar(scrollerBar);
				var oriPanelTop = scrollPanels[i].scrollTop,
					totalHeight = scrollPanels[i].scrollHeight,
					oriOffsetTop = scrollerBar.offsetTop,
					addTop =  (300*120/totalHeight),
					subTop = (-1) * addTop;
				if(Utils.getWheelDelta(event)<0){
					//向下滚动
					scroll(oriOffsetTop,addTop,oriPanelTop,scrollPanels[i].scrollHeight);
				}else if(Utils.getWheelDelta(event)>0){
					//向上滚动
					scroll(oriOffsetTop,subTop,oriPanelTop,scrollPanels[i].scrollHeight);
				}
				hideBarTimer(scrollerBar,1200);
				Utils.preventDefault(event);
			}
			var scroll = function (oriOffsetTop,scrollClientY,oriPanelTop,totalHeight) {
				if(oriOffsetTop + scrollClientY <=2){
					scrollerBar.style.top = "2px";	
				}else if(oriOffsetTop + scrollClientY + scrollerBar.offsetHeight >=298){
					scrollerBar.style.top = 298-scrollerBar.offsetHeight+"px";
				}else{
					scrollerBar.style.top = oriOffsetTop + scrollClientY + "px"; 
				}
				scrollPanels[i].scrollTop =oriPanelTop + parseInt((totalHeight -300)/(296-scrollerBar.offsetHeight)*scrollClientY,10);
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
				clearTimeout(timeout);
				showBarContainer(barContainers[i]);
				showBar(scrollerBar);
				scrollerBar.onmouseout = function () {
					barContainers[i].style.opacity = 0;
					hideBarTimer(scrollerBar,1200);
				};
			};
			scrollerBar.onmouseup = function(event){
				Utils.stopPropagation(Utils.getEvent(event));
				document.onmousemove = null;
			}	
			scrollerBar.onmousedown = function(event){
				event = Utils.getEvent(event);
				var oriClientY = event.clientY,
					oriOffsetTop = scrollerBar.offsetTop,
					oriPanelTop = scrollPanels[i].scrollTop;
				//拖动滚动条
				document.onmousemove = function(e){
					clearTimeout(timeout);
					showBarContainer(barContainers[i]);
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
				var	barHeight = scrollerBar.offsetHeight,
					oriOffsetTop = scrollerBar.offsetTop,
					oriPanelTop = scrollPanels[i].scrollTop,
					scrollClientY = event.clientY - Utils.calculateTop(barContainers[i]) - oriOffsetTop - barHeight / 2;

				scroll(oriOffsetTop,scrollClientY,oriPanelTop,scrollPanels[i].scrollHeight);
				Utils.stopPropagation(event);
			}
			
			barContainers[i].onmouseover = function () {
				clearTimeout(timeout);
				showBarContainer(barContainers[i]);
				showBar(scrollerBar);
				barContainers[i].onmouseout = function () {
					barContainers[i].style.opacity = 0;
					hideBarTimer(scrollerBar,1200);
				};
			};

		})(i);
	};
	//zu-top-add-question
	var askBtn = document.querySelector('#zu-top-add-question');
	askBtn.onclick = function(){
		var askPanel = document.querySelector(".modal-wrapper"),
			askPanelClose = document.querySelector(".modal-dialog-title-close"),
			askPanelBg = document.querySelector('.modal-dialog-bg');
		var forbidScroll = function (event) {
			event = Utils.getEvent(event);
			Utils.preventDefault(event);
		}
		//显示提问面板
		askPanel.style.display = "flex";
		askPanelBg.style.display = "block";
		//禁止滚动、隐藏滚动条
		Utils.addEventListener(document,"mousewheel",forbidScroll);
		Utils.addEventListener(document,"DOMMouseScroll",forbidScroll);
		
		Utils.addClass(document.documentElement,"modal-doc-overflow");
		Utils.addClass(document.documentElement,"modal-open");
		askPanelClose.onclick = function(){
			askPanel.style.display = "none";
			askPanelBg.style.display = "none";
			Utils.removeEventListener(document,"mousewheel",forbidScroll);
			Utils.removeEventListener(document,"DOMMouseScroll",forbidScroll);
			Utils.removeClass(document.documentElement,"modal-doc-overflow");
			Utils.removeClass(document.documentElement,"modal-open");
		}
	}

	var icons = document.querySelectorAll(".zm-item-link-avatar");
	var tooltip = document.querySelector("#zh-tooltip");

	for (var i = icons.length - 1; i >= 0; i--) {
		(function(i){

			icons[i].onmouseover = function(){
				me = this;
				tooltip.style.display = "block";
				var meTop = Utils.calculateTop(me);
				var meLeft = Utils.calculateLeft(me);
				var meWidth = me.offsetWidth;
				var meHeight = me.offsetHeight;
				var toolTipHeight = tooltip.offsetHeight;
				var triangle = tooltip.querySelector(".arrow");
				var finalLeft = 0;
				var finalTop = 0;

				//判断顶部是不是超过视窗
				if(meTop-toolTipHeight-Utils.getBodyScrollTop()<=5){
					//提示框显示在下面
					if(!Utils.containsClass(tooltip,"bottom")){
						Utils.removeClass(tooltip,"top");
						Utils.addClass(tooltip,"bottom");
					}
					finalTop = meTop + meHeight + 6;
				}else{
					//提示框显示在上面
					if(!Utils.containsClass(tooltip,"top")){
						Utils.removeClass(tooltip,"bottom");
						Utils.addClass(tooltip,"top");
					}
					finalTop = meTop -toolTipHeight;
				}

				finalLeft = meLeft+meWidth/2 - triangle.offsetWidth/2 - triangle.offsetLeft;
				//计算顶部中点的坐标(meLeft+meWidth/2,meTop)
				//算出尖三角底部坐标(meLeft+meWidth/2,meTop)
					//算出尖三角距离提示框左边的位置
					//算出尖三角距离提示框顶部的位置
				//算出提示框左上角坐标(meLeft+meWidth-triangle.offsetWidth/2-triangle.offsetLeft,meTop-margin-toolTipHeight)

				// console.log(meLeft+meWidth/2 - triangle.offsetWidth/2 - triangle.offsetLeft);
				// console.log(meTop- 5 -toolTipHeight);

				setTimeout(function(){
					tooltip.style.left = finalLeft+"px";
					tooltip.style.top = finalTop +"px";
					tooltip.style.visibility = "visible";
				},200)
			}

			icons[i].onmouseout = function(){
				setTimeout(function(){
					tooltip.style.visibility = "hidden";
					tooltip.style.display = "none";
				},200)
			}
		})(i);
	};

	var feeds = document.querySelectorAll(".feed-item");
	var createComment = function(commentArr){
		var frag = document.createDocumentFragment();
		var commentBox = Utils.createElement("div",["zm-comment-box"]);
		var iconSpike = Utils.createElement("i",["icon","icon-spike","zm-comment-bubble"]);
		iconSpike.style.display = "inline-block";
		iconSpike.style.left = "102px";
		commentBox.appendChild(iconSpike);
		var commentList = Utils.createElement("div",["zm-comment-list"]);
		commentBox.appendChild(commentList);
		for (var i = 0; i < commentArr.length; i++) {
			var comment = Utils.createElement("div",["zm-item-comment"]);
			var photoAnchor = Utils.createElement("a",["zm-item-link-avatar"]);
			var photoImg = Utils.createElement("img",["zm-item-img-avatar"]);
			photoImg.src=commentArr[i].imageSrc;
			photoAnchor.appendChild(photoImg);
			comment.appendChild(photoAnchor);

			var contentWarp = Utils.createElement("div",["zm-comment-content-wrap"]);
			var contentHead = Utils.createElement("div",["zm-comment-hd"]);
			var contentAuth = Utils.createElement("a",["zg-link"]);
			var authName = document.createTextNode(commentArr[i].auth);
			contentAuth.appendChild(authName);
			contentHead.appendChild(contentAuth);
			contentWarp.appendChild(contentHead);

			var contentNode = Utils.createElement("div",["zm-comment-content"]);
			var content = document.createTextNode(commentArr[i].comment);
			contentNode.appendChild(content);
			contentWarp.appendChild(contentNode);

			var contentFoot = Utils.createElement("div",["zm-comment-ft"]);
			var tiemNode = Utils.createElement("span",["date"]);
			var time = document.createTextNode(commentArr[i].time);
			tiemNode.appendChild(time);
			contentFoot.appendChild(tiemNode);

			var replyNode = Utils.createElement("a",["reply","zm-comment-op-link"]);
			var replyIcon = Utils.createElement("i",["zg-icon","zg-icon-comment-reply"]);
			replyNode.appendChild(replyIcon);
			var replyText = document.createTextNode("回复")
			replyNode.appendChild(replyText);
			contentFoot.appendChild(replyNode);

			var likeNode = Utils.createElement("a",["like","zm-comment-op-link"]);
			var likeIcon = Utils.createElement("i",["zg-icon","zg-icon-comment-like"]);
			likeNode.appendChild(likeIcon);
			likeNode.appendChild(document.createTextNode("赞"));
			contentFoot.appendChild(likeNode);

			var likeNumNode = Utils.createElement("span",["like-num"]);
			var likeNumEm = Utils.createElement("em",[]);
			likeNumEm.appendChild(document.createTextNode(commentArr[i].like));
			likeNumNode.appendChild(likeNumEm);
			var likeSpan = Utils.createElement("span",[]);
			likeSpan.appendChild(document.createTextNode("赞"));
			likeNumNode.appendChild(likeSpan);
			contentFoot.appendChild(likeNumNode);

			var reportNode = Utils.createElement("a",["report","zm-comment-op-link","needsfocus","goog-inline-block","goog-menu-button"]);
			var reportIcon = Utils.createElement("i",["zg-icon","z-icon-no-help"]);
			reportNode.appendChild(reportIcon);
			reportNode.appendChild(document.createTextNode("举报"));
			contentFoot.appendChild(reportNode);


			contentWarp.appendChild(contentFoot);
			comment.appendChild(contentWarp);
			commentList.appendChild(comment);
		};

		var commentForm = Utils.createElement("div",["zm-comment-form","zm-comment-box-ft"]);
		var commentInput = Utils.createElement("div",["zm-comment-editable","editable"]);
		var commentPara = Utils.createElement("div",[]);
		commentPara.appendChild(document.createTextNode("写下你的评论…"));
		commentInput.appendChild(commentPara);
		commentForm.appendChild(commentInput);

		var commentBtns = Utils.createElement("div",["zm-command","zg-clear"]);
		var addBtn = Utils.createElement("a",["zg-right","zg-btn-blue"]);
		addBtn.appendChild(document.createTextNode("评论"));
		commentBtns.appendChild(addBtn);
		var closeBtn = Utils.createElement("a",["zm-command-cancel"]);
		closeBtn.appendChild(document.createTextNode("取消"));
		commentBtns.appendChild(closeBtn);
		commentForm.appendChild(commentBtns);

		var commentInfo = Utils.createElement("div",["zm-comment-info"]);
		commentForm.appendChild(commentInfo);

		commentBox.appendChild(commentForm);
		frag.appendChild(commentBox);
		return frag;
	}
	for (var i = feeds.length - 1; i >= 0; i--) {
		(function(i){
			var summary = feeds[i].querySelector(".zh-summary");
			if(summary==null){
				return;
			}
			summary.onclick = function(){
				var me = this;
				var parent = me.parentNode;
				var collapseBtns = me.parentNode.querySelectorAll('.collapse');
				var content = parent.querySelector('.zm-editable-content');
				var voteInfo = feeds[i].querySelector(".zm-item-vote-info");
				var questionDetail = feeds[i].querySelector(".btn-toggle-question-detail");
				var questionDesc = feeds[i].querySelector(".question-description");
				var autoHideBtns = feeds[i].querySelectorAll(".zu-autohide");
				
				if(content == null){
					//获取要添加的内容
					var hideContent = parent.querySelector(".content.hidden");
					var answer = Utils.getNodeText(hideContent);
					// console.log(answer);
					var frag = document.createDocumentFragment();
					var div = document.createElement("div");
					Utils.addClass(div,"zm-editable-content");
					div.innerHTML = answer;
					div.style.display = "block";
					frag.appendChild(div);
					parent.insertBefore(frag,hideContent);

				}else{
					content.style.display = "block";
				}

				var collapseBtns = feeds[i].querySelectorAll('.collapse');
				collapseBtns[0].style.display = "block";
				collapseBtns[0].onclick = function(){
					parent.querySelector('.zm-editable-content').style.display = "none";
					me.style.display = "block";
					this.style.display = "none";
					if(collapseBtns[1]){
						collapseBtns[1].style.display = "none";
					}
					if(voteInfo){
						voteInfo.style.display = "none";
					}
					if(questionDetail){
						questionDetail.style.display = "none";
					}
					if(questionDesc){
						questionDesc.style.display = "none";
					}
					for (var j = autoHideBtns.length - 1; j >= 0; j--) {
						// autoHideBtns[j].style.display = "none";
						autoHideBtns[j].removeAttribute("style");
					};
				};

				if (collapseBtns.length===2) {
					collapseBtns[1].style.display = "block";
					collapseBtns[1].onclick = function(){
						parent.querySelector('.zm-editable-content').style.display = "none";
						me.style.display = "block";
						this.style.display = "none";
						collapseBtns[0].style.display = "none";
						for (var j = autoHideBtns.length - 1; j >= 0; j--) {
							// autoHideBtns[j].style.display = "none";
							autoHideBtns[j].removeAttribute("style");
						};
						if(voteInfo){
							voteInfo.style.display = "none";
						}
						if(questionDetail){
							questionDetail.style.display = "none";
						}
						if(questionDesc){
							questionDesc.style.display = "none";
						}
					};
				}

				for (var j = autoHideBtns.length - 1; j >= 0; j--) {
					autoHideBtns[j].style.display = "inline-block";
				};


				if(questionDetail){
					questionDetail.style.display = "block";
					questionDetail.onclick = function(){
						if(questionDesc){
							questionDesc.style.display = "block";
						}
						this.style.display = "none";
					}
				}
				if(voteInfo){
					voteInfo.style.display = "block";
				}
				me.style.display = "none";
			}

			var toggleComment = feeds[i].querySelector(".toggle-comment");
			toggleComment.onclick = function(){
				var commentBox = feeds[i].querySelector(".zm-comment-box");
				if(commentBox){

				}else{
					var frag = createComment([{
						auth:"七个柚子多少钱",
						comment:"印象深刻",
						time:"2015-09-17",
						like:1,
						imageSrc:"images/20a52613d2af2feb4eeaf58629383725_s.jpg"
					},{
						auth:"七个柚子多少钱",
						comment:"印象深刻",
						time:"2015-09-17",
						like:1,
						imageSrc:"images/20a52613d2af2feb4eeaf58629383725_s.jpg"
					}]);
					// console.log(frag);
					var commentContainer = feeds[i].querySelector(".zm-item-meta");
					commentContainer.appendChild(frag);
					// console.log(commentContainer);
				}
			}

		
		})(i);
	};

	var backtotop = document.querySelector('.zh-backtotop');

	window.onscroll = function(){
		if(Utils.getBodyScrollTop()>1200){
			backtotop.style.display = "block";
			backtotop.onclick = function(){
				var body = null;
				if(document.body.scrollTop){
					body = document.body;
				}else{
					body = document.documentElement;
				}
				setTimeout(function(){
					if (body.scrollTop<200) {
						body.scrollTop =0;
					}else{
						body.scrollTop -=200;
					}
					if (body.scrollTop>0) {
						setTimeout(arguments.callee,30);
					};
				},30);
			}
		}else{
			backtotop.style.display = "none";
			backtotop.onclick = null;
		}
		// console.log(Utils.getBodyScrollTop());
	}
};
