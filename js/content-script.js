console.log('这是content script!');
// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
	// 注入自定义JS
	injectCustomJs();
	// 给谷歌搜索结果的超链接增加 _target="blank"
	if(location.host == 'www.google.com.tw')
	{
		var objs = document.querySelectorAll('h3.r a');
		for(var i=0; i<objs.length; i++)
		{
			objs[i].setAttribute('_target', 'blank');
		}
		console.log('已处理谷歌超链接！');
	}
	else if(location.host == 'www.baidu.com')
	{
		function fuckBaiduAD()
		{
			if(document.getElementById('my_custom_css')) return;
			var temp = document.createElement('style');
			temp.id = 'my_custom_css';
			(document.head || document.body).appendChild(temp);
			var css = `
			/* 移除百度右侧广告 */
			#content_right{display:none;}
			/* 覆盖整个屏幕的相关推荐 */
			.rrecom-btn-parent{display:none;}'
			/* 难看的按钮 */
			.result-op.xpath-log{display:none !important;}`;
			temp.innerHTML = css;
			console.log('已注入自定义CSS！');
			// 屏蔽百度推广信息
			removeAdByJs();
			// 这种必须用JS移除的广告一般会有延迟，干脆每隔一段时间清楚一次
			interval = setInterval(removeAdByJs, 2000);

			// 重新搜索时页面不会刷新，但是被注入的style会被移除，所以需要重新执行
			temp.addEventListener('DOMNodeRemoved', function(e)
			{
				console.log('自定义CSS被移除，重新注入！');
				if(interval) clearInterval(interval);
				fuckBaiduAD();
			});
		}
		let interval = 0;
		function removeAdByJs()
		{
			$('[data-tuiguang]').parents('[data-click]').remove();
		}
		fuckBaiduAD();
		initCustomPanel();
		initCustomEventListen();
	}else if(location.href.indexOf('http://studio.coding.net/ws/')>-1){
		initPreviewPanel();
	}else{
		// initCustomPanel();
		// initCustomEventListen();
		initPreviewPanel();
	}
});

function initCustomPanel()
{
	var panel = document.createElement('div');
	panel.id = 'testPanel';
	panel.className = 'chrome-plugin-demo-panel';
	panel.innerHTML = `
		<h2>injected-script操作content-script演示区：</h2>
		<div class="btn-area">
			<a href="javascript:openPreviewModal('')">改变样式</a><br>
			<a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
			<a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
			<a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br>
		</div>
		<div id="my_custom_log">
		</div>
	`;
	document.body.appendChild(panel);
	console.log("length",$("#testPanel").llength);
	$("#testPanel").draggable();
}

function initPreviewPanel() {
	;(function(){
		function _buildDom() {
			var panel1 = document.createElement('div');
			panel1.id = '_previewContainer';
			panel1.className = 'previewContainer';
			panel1.innerHTML = `
				<div id="_previewOpen" class="previewIcon-openWrapper">
					<button id="_previewOpen" class="previewIcon-open">
						<svg t="1533795735987" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2863" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em"><defs><style type="text/css">@font-face { font-family: uc-nexus-iconfont; src: url("chrome-extension://pogijhnlcfmcppgimcaccdkmbedjkmhi/res/font_9qmmi8b8jsxxbt9.woff") format("woff"), url("chrome-extension://pogijhnlcfmcppgimcaccdkmbedjkmhi/res/font_9qmmi8b8jsxxbt9.ttf") format("truetype"); }
						</style></defs><path d="M519.338479 794.068534c-242.802029 0-433.128291-251.314664-441.099008-262.017552l-15.105976-20.254201 15.105976-20.254201C86.210187 480.839691 276.53645 229.570187 519.338479 229.570187c242.824609 0 433.150871 251.269504 441.121588 261.972393l15.128556 20.254201-15.128556 20.254201C952.48935 542.75387 762.163087 794.068534 519.338479 794.068534zM149.050143 511.796781c48.659757 57.014333 198.567938 214.531951 370.288335 214.531951 171.720397 0 321.673738-157.517619 370.310915-214.531951-48.637178-57.014333-198.590518-214.486792-370.310915-214.486792C347.618082 297.309989 197.687321 454.782448 149.050143 511.796781z" p-id="2864" fill="#bfbfbf"></path><path d="M511.819361 519.338479m-105.380551 0a4.667 4.667 0 1 0 210.761103 0 4.667 4.667 0 1 0-210.761103 0Z" p-id="2865" fill="#bfbfbf"></path></svg>
					</button>
				</div>
				<div class="previewHeader">
					<div class="previewControl">
						<!-- <button class="previewIcon-back" onclick="_back()">
								 <svg fill="currentColor" preserveaspectratio="xMidYMid meet" height="1em" width="1em" viewbox="0 0 40 40" style="vertical-align: middle;">
									<g>
									 <path d="m26.5 12.1q0 0.3-0.2 0.6l-8.8 8.7 8.8 8.8q0.2 0.2 0.2 0.5t-0.2 0.5l-1.1 1.1q-0.3 0.3-0.6 0.3t-0.5-0.3l-10.4-10.4q-0.2-0.2-0.2-0.5t0.2-0.5l10.4-10.4q0.3-0.2 0.5-0.2t0.6 0.2l1.1 1.1q0.2 0.2 0.2 0.5z"></path>
									</g>
								 </svg>
						</button>
						<button class="previewIcon-forward" onclick="_forward()">
									<svg fill="currentColor" preserveaspectratio="xMidYMid meet" height="1em" width="1em" viewbox="0 0 40 40" style="vertical-align: middle;">
									<g>
									 <path d="m26.3 21.4q0 0.3-0.2 0.5l-10.4 10.4q-0.3 0.3-0.6 0.3t-0.5-0.3l-1.1-1.1q-0.2-0.2-0.2-0.5t0.2-0.5l8.8-8.8-8.8-8.7q-0.2-0.3-0.2-0.6t0.2-0.5l1.1-1.1q0.3-0.2 0.5-0.2t0.6 0.2l10.4 10.4q0.2 0.2 0.2 0.5z"></path>
									</g>
								 </svg>
						</button> -->
						<button id="_previewClose" class="previewIcon-close">
							<svg t="1533795839386" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1822" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em"><defs><style type="text/css">@font-face { font-family: uc-nexus-iconfont; src: url("chrome-extension://pogijhnlcfmcppgimcaccdkmbedjkmhi/res/font_9qmmi8b8jsxxbt9.woff") format("woff"), url("chrome-extension://pogijhnlcfmcppgimcaccdkmbedjkmhi/res/font_9qmmi8b8jsxxbt9.ttf") format("truetype"); }
							</style></defs><path d="M722.02112 729.6l74.24 71.68c7.68 7.68 12.8 17.92 12.8 30.72 0 23.04-17.92 43.52-43.52 43.52-12.8 0-23.04-5.12-30.72-12.8L76.90112 222.72c-7.68-7.68-12.8-17.92-12.8-30.72 0-23.04 17.92-43.52 43.52-43.52 10.24 2.56 20.48 5.12 28.16 12.8l115.2 110.08c74.24-35.84 161.28-58.88 261.12-58.88 309.76 0 512 245.76 512 276.48 0 25.6-112.64 168.96-302.08 240.64z m-220.16-453.12c-66.56 0-125.44 30.72-166.4 76.8l76.8 74.24c20.48-25.6 53.76-43.52 92.16-43.52 66.56 0 117.76 53.76 117.76 117.76 0 35.84-15.36 66.56-40.96 89.6l76.8 74.24c43.52-40.96 69.12-97.28 69.12-161.28-2.56-125.44-102.4-227.84-225.28-227.84zM530.02112 768H512.10112C184.42112 768-5.01888 532.48 0.10112 491.52c0-15.36 40.96-71.68 112.64-130.56L530.02112 768z" p-id="1823" fill="#bfbfbf"></path></svg>
						</button>
						<button id="_previewRefresh" class="previewIcon-refresh">
							 <svg fill="currentColor" preserveaspectratio="xMidYMid meet" height="1em" width="1em" viewbox="0 0 40 40" style="vertical-align: middle;">
									<g>
									 <path d="m29.5 10.5l3.9-3.9v11.8h-11.8l5.4-5.4c-1.8-1.8-4.3-3-7-3-5.5 0-10 4.5-10 10s4.5 10 10 10c4.4 0 8.1-2.7 9.5-6.6h3.4c-1.5 5.7-6.6 10-12.9 10-7.3 0-13.3-6.1-13.3-13.4s6-13.4 13.3-13.4c3.7 0 7 1.5 9.5 3.9z"></path>
									</g>
								 </svg>
						</button>
					</div>
					<input type="text" id="_previewInput" class="previewInput"/>
				</div>
				<iframe id="_previewIframe" style="width:100%;height:100%;" src="" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>
			`;
			var panel2 = document.createElement('div');
			panel2.id = '_preview_Xadapter';
			document.body.appendChild(panel1);
			document.body.appendChild(panel2);
		}
		function _back(){
			document.getElementById('_previewIframe').contentWindow.history.back();
		}
		function _forward(){
			document.getElementById('_previewIframe').contentWindow.history.forward();
		}
		function _refresh(){
			var url = document.getElementById('_previewInput').value;
			// if (url.indexOf("?")>-1) {
			//   if(url.indexOf("&")){
			//     url += '&t='+Math.random()
			//   }else{
			//     url += 't='+Math.random()
			//   }
			// }else{
			//   url += '?t='+Math.random()
			// }
			if(url.trim()!=""){
				localStorage.setItem("_previewUrl",url);
				document.getElementById('_previewIframe').setAttribute('src', url);
			}
		}
		function _close(){
			var container = document.getElementById('_previewContainer');
			container.style.width = 0+"px"
			if (document.getElementsByClassName('primary-panel-axis').length>0) {
				document.getElementsByClassName('primary-panel-axis')[0].style.width = "100%";
			}
			document.getElementById('_preview_Xadapter').style.display = "none";
		}
		function _setPostion(previewContainerWidth) {
			if(previewContainerWidth!==undefined){
				localStorage.setItem("_previewContainerWidth",previewContainerWidth);
			}else{
				previewContainerWidth = parseInt(localStorage.getItem("_previewContainerWidth")) || 500;
			}
			var container = document.getElementById('_previewContainer');
			var Xadapter = document.getElementById('_preview_Xadapter');
			container.style.height = document.documentElement.clientHeight+'px';
			container.style.width = previewContainerWidth+"px"
			Xadapter.style.right = previewContainerWidth-3+"px"
			Xadapter.style.display = "block";
			if (document.getElementsByClassName('primary-panel-axis').length>0) {
				document.getElementsByClassName('primary-panel-axis')[0].style.width = document.documentElement.clientWidth-previewContainerWidth+"px";
			}
		}
		function _open(){
			_setPostion()
			var previewUrl = localStorage.getItem("_previewUrl") || "";
			var input = document.getElementById("_previewInput");
			input.value = previewUrl;
			_refresh();
		}
		function _bindEvent(){
			$(window).on("resize",function(){
				if(parseInt(document.getElementById('_previewContainer').style.width)>0){
					_setPostion()
				}
			})
			$("#_previewClose").click(function(){
				_close();
			})
			$("#_previewOpen").click(function(){
				_open();
			})
			$("#_previewRefresh").click(function(){
				_refresh();
			})
			$("#_preview_Xadapter").draggable({
				axis: "x",
				drag: function() {
					console.log(this.style.right)
					console.log(this.style.left)
					// var v = Math.abs(parseInt(this.style.left))-5+3;
					var v = document.documentElement.clientWidth - Math.abs(parseInt(this.style.left))-5+3;
					_setPostion(v);
					// var container = document.getElementById('_previewContainer');
					// console.log("v",v)
					// container.style.width = v+"px";
				},
				stop: function() {
					// var v = Math.abs(parseInt(this.style.left))-5;
					var v = document.documentElement.clientWidth - Math.abs(parseInt(this.style.left))-5;
					// delete this.style.left;
					this.style.left = "auto"
					this.style.right = v+"px";
					localStorage.setItem("_previewContainerWidth",v+3)
				}
			});
		}
		function _init(){
			//_open()
			_buildDom();
			_bindEvent();
		}
		_init();
	})();
}

// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
	if(request.cmd == 'update_font_size') {
		var ele = document.createElement('style');
		ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
		document.head.appendChild(ele);
	}
	else {
		tip(JSON.stringify(request));
		sendResponse('我收到你的消息了：'+JSON.stringify(request));
	}
});

// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(message) {
	chrome.runtime.sendMessage({greeting: message || '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
		tip('收到来自后台的回复：' + response);
	});
}

// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'test-connect') {
		port.onMessage.addListener(function(msg) {
			console.log('收到长连接消息：', msg);
			tip('收到长连接消息：' + JSON.stringify(msg));
			if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
		});
	}
});

window.addEventListener("message", function(e)
{
	console.log('收到消息：', e.data);
	if(e.data && e.data.cmd == 'invoke') {
		eval('('+e.data.code+')');
	}
	else if(e.data && e.data.cmd == 'message') {
		tip(e.data.data);
	}
	else if(e.data && e.data.cmd == 'openPreviewModal') {
		var o = document.getElementById('testPanel')
		console.log('o', o)
		o.style["background-color"] = "#fff";
	}else if(e.data && e.data.cmd == 'accessSubMoudleMethod') {
		console.log("data",e.data)
	}
}, false);


function initCustomEventListen() {
	var hiddenDiv = document.getElementById('myCustomEventDiv');
	if(!hiddenDiv) {
		hiddenDiv = document.createElement('div');
		hiddenDiv.style.display = 'none';
		hiddenDiv.id = 'myCustomEventDiv';
		document.body.appendChild(hiddenDiv);
	}
	hiddenDiv.addEventListener('myCustomEvent', function() {
		var eventData = document.getElementById('myCustomEventDiv').innerText;
		tip('收到自定义事件：' + eventData);
	});
}

var tipCount = 0;
// 简单的消息通知
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 20 + 'px';
	ele.innerHTML = `<div>${info}</div>`;
	document.body.appendChild(ele);
	ele.classList.add('animated');
	tipCount++;
	setTimeout(() => {
		ele.style.top = '-100px';
		setTimeout(() => {
			ele.remove();
			tipCount--;
		}, 400);
	}, 3000);
}
