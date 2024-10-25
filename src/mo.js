
var mo = {
	info: function() {
		mo.c.l("Modal & Overlay (M&O) script information:"+"\n"+"Version: 1.0"+"\n"+"Dependencies: Thanks CyberSecurity, can I have my Steam back now?"+"\n"+"Console: Enabled"+"\n"+"Author: Philippe F."+"\n"+"Employee ID: 60073790");
	},
	c: {
		e: function(msg) {
			console.error("M&O: "+msg+".");
		},
		w: function(msg) {
			console.warn("M&O: "+msg+".");
		},
		i: function(msg) {
			console.info("M&O: "+msg+".");
		},
		l: function(m) {
			console.log(m);
		}
	},
	dom: {
		html: document.querySelector("html"),
		body: document.querySelector("body"),
		fn: {
			clone: function(node) {
				var newNode = node.cloneNode(true);
				node.parentNode.replaceChild(newNode, node);
			},
			css: function(source) {
				// MODAL CSS
				if(document.querySelector("style.dxpModalCss") == null) {
					var modal = document.createElement("STYLE");
					modal.setAttribute("mo-state","dxpModalCss");
					modal.innerHTML = "div.dxpModal{display:block;position:fixed;top:-100vh;left:0;right:0;max-width:700px;max-height:100vh;padding:50px;margin:0 auto;background-color:#fff;transition:top .5s;z-index:-2}div.dxpModal[mo-state=active]{z-index:9991;top:0}div.dxpModal,div.dxpModal *,div.dxpModal .dxpModalCTA,div.dxpModal .dxpModalClose,div.dxpModal .dxpModalContent,div.dxpModal .dxpModalTitle{font-family:MetricHPE,Metric,HPSimplified,Arial,Helvetica,sans-serif!important}div.dxpModal .dxpModalTitle{margin:0;padding:0;font-size:42px;font-weight:300;line-height:46px;color:#333}div.dxpModal .dxpModalContainer{display:block;position:relative;padding-bottom:70px;margin-bottom:70px;max-height:calc(100vh - 300px);overflow:auto}div.dxpModal .dxpModalContent{margin:0;padding:30px 0 0 0;font-size:18px;font-weight:300;line-height:1.5;overflow:auto}div.dxpModal .dxpModalFooter{display:block;position:absolute;bottom:50px;left:50px;right:50px;padding-top:25px;border-top:1px solid #999}div.dxpModal .dxpModalCTA{display:inline-block;cursor:pointer;box-sizing:border-box;height:42px;min-width:135px;border:2px solid #01a982;background-color:#01a982;color:#fff;padding-top:8px;font-size:18px;line-height:42px;font-weight:600;text-align:center;padding:0 25px}div.dxpModal .dxpModalCTA[state=disabled]{background-color:#ccc;border:2px solid #ccc;color:#333}div.dxpModal .dxpModalCloseButton{display:inline-block;cursor:pointer;box-sizing:border-box;height:42px;min-width:135px;border:2px solid #333;background-color:#fff;color:#333;padding-top:8px;font-size:18px;line-height:38px;font-weight:600;text-align:center;padding:0 25px;margin-left:25px}div.dxpModal .dxpModalClose{position:absolute;top:20px;right:20px;background:#fff;width:auto;height:auto;padding:0;font-size:58px;font-weight:300;line-height:44px;color:#686868;cursor:pointer}div.dxpModal .modalCloseButton{display:inline-block;cursor:pointer;box-sizing:border-box;height:42px;min-width:135px;border:2px solid #333;background-color:#fff;color:#333;padding-top:8px;font-size:18px;line-height:42px;font-weight:600;text-align:center;padding:0 25px;margin-left:25px}.dxpModalContainer .msg{display:none;position:relative;background-color:#fff;margin:10px auto;max-height:none;height:0;overflow:hidden;padding:0 20px;box-sizing:border-box;font-weight:300;font-size:16px;line-height:1.5;color:#333;transition:max-height .3s ease-out}.dxpModalContainer .msg.def{display:block;min-height:45px;padding:10px 20px;margin:20px 0 0 0;height:auto;background-color:#f5f5f5;color:#333}.dxpModalContainer .msg.err{display:block;min-height:45px;padding:10px 20px;margin:20px 0 0 0;height:auto;background-color:#ca2b4e;color:#fff}.dxpModalContainer .msg.wrn{display:block;min-height:45px;padding:10px 20px;margin:20px 0 0 0;height:auto;background-color:#ffe75e;color:#333}.dxpModalContainer .msg.scs{display:block;min-height:45px;padding:10px 20px;margin:20px 0 0 0;height:auto;background-color:#00b388;color:#fff}.dxpModalContainer .msg span.close{display:block;position:absolute;top:2px;right:20px;font-size:40px;line-height:1;cursor:pointer}.dxpModalContainer .msg p{margin:0 60px 0 0;padding:0}div.dxpModal.locked .dxpModalClose,div.dxpModal.locked .dxpModalContainer,div.dxpModal.locked .dxpModalFooter{pointer-events:none;opacity:.3}@media only screen and (max-width:768px){body .dxpModal{padding:50px 30px 30px 30px}body .dxpModal .dxpModalClose{top:10px;right:10px}body .dxpModal .dxpModalTitle{font-size:34px}body .dxpModal .modalCloseButton{display:none!important}}@media only screen and (max-width:500px){body .dxpModal{height:calc(100vh - 50px);padding:50px 10px 0 10px}body .dxpModal .dxpModalTitle{position:absolute;top:0;left:0;padding:20px 30px 20px 10px;line-height:1;font-size:26px}body .dxpModal .dxpModalContent{margin:30px 0;height:calc(100vh - 300px);max-height:calc(100vh - 300px)!important}body .dxpModal .dxpModalFooter{position:absolute;padding:10px 0 10px 0;bottom:0;width:calc(100% - 20px)}body .dxpModal .modalCloseButton{display:none!important}}";
					mo.dom.body.appendChild(modal);
				}
				// OVERLAY CSS
				if(document.querySelector("style.dxpOverlayCss") == null) {
					var overlay = document.createElement("STYLE");
					overlay.setAttribute("mo-state","dxpOverlayCss");
					overlay.innerHTML = "div#dxpOverlay{z-index:-10;visibility:hidden;width:0;height:0;overflow:hidden;background-color:rgba(0,0,0,0);transition:background-color .5s linear}div#dxpOverlay.active{visibility:visible;position:fixed;top:0;left:0;z-index:9990;overflow:hidden;width:100%;height:100vh;background-color:rgba(0,0,0,.63)}div#dxpOverlay.active.loading{background-image:url(https://hpe-rfb.it.hpe.com/resources/rs/custom/images/loader.svg);background-size:120px;background-position:center;background-repeat:no-repeat}div#dxpOverlay #dxpOverlayLoading{display:block;position:absolute;bottom:0;left:0;right:0;width:100%;opacity:0;transition:.8s}div#dxpOverlay #dxpOverlayLoading.active{opacity:1}div#dxpOverlay #dxpOverlayLoadingText{display:block;font-family:MetricHPE,Metric,HPSimplified,Arial,Helvetica,sans-serif!important;font-weight:300;text-align:left;font-size:16px;color:#f1f1f1;padding:5px 10px 10px 10px;opacity:.5}div#dxpOverlay #dxpOverlayProgress{display:block;float:left;background-color:#00b388;width:0%;height:3px;transition:.5s}";
					mo.dom.body.appendChild(overlay);
				}
				// DXP ONLY CSS
				if(typeof(source) === "string" && source.toLowerCase() == "dxp" && document.querySelector("style.dxpMOCss") == null) {
					var dxp = document.createElement("STYLE");
					dxp.setAttribute("mo-state","dxpMOCss");
					dxp.innerHTML = "div.dxpModal .dxpModalCTA,div.dxpModal .modalCloseButton{line-height:40px!important}div.dxpModal .dxpModalClose{top:10px!important}";
					mo.dom.body.appendChild(dxp);
				}
				// CONTAINER OVERLAY CSS
				if (document.querySelector("style.dxpContainerOverlayCss") == null) {
					const containerOverlay = document.createElement("STYLE");
					containerOverlay.setAttribute("mo-state","dxpContainerOverlayCss");
					containerOverlay.innerHTML = "div.moOverlayHeight {min-height: 75px;} div.moContainerOverlay {background-image: none;background-size: 30px;background-position: center;background-repeat: no-repeat;position: absolute;background-color: transparent;z-index: 9990} div.moShadowOverlay{background-color: #000;opacity: 0.5;} div.moLoadingIconOverlay{background-image: url(https://hpe-rfb.it.hpe.com/resources/rs/custom/images/loader.svg);background-size:120px;background-position: center;background-repeat: no-repeat;position: absolute;background-color: transparent;z-index: 9991}";
					mo.dom.body.appendChild(containerOverlay);
				}
			}
		}
	},
	fn: {
		overlay: {
			html: function(){
				if(document.querySelector("#dxpOverlay") == null) {
					var overlay = document.createElement("DIV");
					overlay.setAttribute("id","dxpOverlay");
					var loading = document.createElement("DIV");
					loading.setAttribute("id","dxpOverlayLoading");
					var loadingText = document.createElement("DIV");
					loadingText.setAttribute("id","dxpOverlayLoadingText");
					var progressBar = document.createElement("DIV");
					progressBar.setAttribute("id","dxpOverlayProgress");
					
					loading.appendChild(loadingText);
					loading.appendChild(progressBar);

					overlay.appendChild(loading);
					
					mo.dom.html.appendChild(overlay);

					mo.dom.overlay = document.querySelector("#dxpOverlay");
					mo.dom.progress = document.querySelector("#dxpOverlayLoading");
					mo.dom.progressTxt = document.querySelector("#dxpOverlayLoadingText");
					mo.dom.progressBar = document.querySelector("#dxpOverlayProgress");

					mo.c.i("Added Overlay DOM elements");
				}
			},
			show: function(config,cb) {
				mo.dom.html.style.overflow = "hidden";
				
				if(mo.dom.overlay.classList.value.indexOf("active") > -1) mo.c.i("Overlay state changed to active");
				else mo.c.i("Updated Overlay state");

				if(typeof(config) === "undefined" || typeof(config.loading) === "undefined" || config.loading != true) mo.dom.overlay.setAttribute("class","active");
				else mo.dom.overlay.setAttribute("class","active loading");
				
				if(typeof(config) !== "undefined" && (typeof(config.progressText) !== "undefined" || typeof(config.progressPercent) !== "undefined")) {
					mo.dom.overlay.setAttribute("class","active");
					mo.fn.progress.show(config)
				}
				
				if(typeof(config) !== "undefined" && typeof(config.close) !== "undefined" && config.close == false) {
					mo.dom.overlay.removeEventListener("click",mo.fn.events.closeAll);
					mo.dom.overlay.removeEventListener("touchstart",mo.fn.events.closeAll);
				} else {
					mo.dom.overlay.addEventListener("click",mo.fn.events.closeAll);
					mo.dom.overlay.addEventListener("touchstart",mo.fn.events.closeAll);
				}
				
				if(typeof(config) !== "undefined" && typeof(config.top) !== "undefined" && config.top == true) window.scrollTo({top:0,behavior:'smooth'});

				if(typeof(cb) == "function") return cb(true);
				else return true;
			},
			hide: function(cb) {
				mo.dom.html.style.overflow = "auto";
				
				mo.dom.overlay.setAttribute("class","");
				
				mo.c.i("Overlay state changed to inactive");
				
				if(typeof(cb) == "function") return cb(true);
				else return true;
			}
		},
		modal: {
			html: function() {
				var mdl = document.createElement("DIV");
				mdl.setAttribute("class","dxpModal");
				var modalContainer = document.createElement("DIV");
				modalContainer.setAttribute("class","dxpModalContainer");
				var modalHeader = document.createElement("DIV");
				modalHeader.setAttribute("class","dxpModalTitle");
				var modalContent = document.createElement("DIV");
				modalContent.setAttribute("class","dxpModalContent");
				var modalFooter = document.createElement("DIV");
				modalFooter.setAttribute("class","dxpModalFooter");
				var modalClose = document.createElement("DIV");
				modalClose.setAttribute("class","dxpModalClose");
				modalClose.innerHTML = "&#xd7;";
				var modalCTA = document.createElement("DIV");
				modalCTA.setAttribute("class","dxpModalCTA");
				var modalCloseButton = document.createElement("DIV");
				modalCloseButton.setAttribute("class","modalCloseButton");
				var modalMSG = document.createElement("DIV");
				modalMSG.setAttribute("class","msg");
				var modalMSGTXT = document.createElement("P");
				var modalMSGCLS = document.createElement("SPAN");
				modalMSGCLS.setAttribute("class","close");
				modalMSGCLS.innerHTML = "&#xd7;";
				modalMSG.appendChild(modalMSGTXT);
				modalMSG.appendChild(modalMSGCLS);
				
				modalContainer.appendChild(modalHeader);
				modalContainer.appendChild(modalMSG);
				modalContainer.appendChild(modalContent);
				
				modalFooter.appendChild(modalCTA);
				modalFooter.appendChild(modalCloseButton);
				
				mdl.appendChild(modalContainer);
				mdl.appendChild(modalFooter);
				mdl.appendChild(modalClose);
				mo.dom.html.appendChild(mdl);

				mo.dom.modal = document.querySelector(".dxpModal");
				mo.dom.modalHeader = document.querySelector(".dxpModal .dxpModalTitle");
				mo.dom.modalContainer = document.querySelector(".dxpModal .dxpModalContainer");
				mo.dom.modalContent = document.querySelector(".dxpModal .dxpModalContent");
				mo.dom.modalFooter = document.querySelector(".dxpModal .dxpModalFooter");
				mo.dom.modalCloseIcon = document.querySelector(".dxpModal .dxpModalClose");
				mo.dom.modalCloseButton = document.querySelector(".dxpModal .modalCloseButton");
				mo.dom.modalCTA = document.querySelector(".dxpModal .dxpModalCTA");
				mo.dom.modalMSG = document.querySelector(".dxpModal .dxpModalContainer .msg");
				
				mo.c.i("Added Modal DOM elements");
			},
			show: function(config,cb) {
				function isModalEligible(config) {
					if(typeof(config) !== "object" || typeof(config.title) !== "string" || typeof(config.content) !== "string" || typeof(config.ctaLabel) !== "string") return false;
					else return true;
				}

				if(!isModalEligible(config)) mo.c.e("Unable to open modal window. Undefined or incorrectly defined configuration.");
				else {
					// DEFINE OVERLAY CONFIGURATION
					if(typeof(config.overlay) === "object") var overlayConfig = config.overlay;
					else var overlayConfig = {loading:true};
					
					// LOAD OVERLAY ON PAGE
					mo.fn.overlay.show(overlayConfig);
					
					// ADD TITLE TO MODAL
					mo.dom.modalHeader.innerHTML = config.title;
					
					// ADD CONTENT TO MODAL
					mo.dom.modalContent.innerHTML = config.content;
					
					// ADD CTA TO MODAL
					mo.dom.modalCTA.innerText = config.ctaLabel;
					
					mo.c.i("Updated Modal DOM nodes");
					
					// ASSIGN ID TO MODAL IF AVAILABLE
					if(typeof(config.id) === 'string')
						mo.dom.modal.setAttribute('id', config.id);
					
					// SET MODAL WIDTH IF REDEFINED
					if(typeof(config.width) === "number") {
						var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
						if(config.width <= 90 && config.width >= 30) mo.dom.modal.style.maxWidth = parseInt(config.width)+"%";
						else if(config.width >= 300 && config.width < w) mo.dom.modal.style.maxWidth = parseInt(config.width)+"px";
					}
					else mo.dom.modal.style.maxWidth = "700px";
					
					// CONTENT CALLBACK FUNCTION
					if(typeof(config.contentCallback) === "function") {
						mo.c.i("Run Modal content callback");
						config.contentCallback();
					}
					
					// RESET CTA BUTTON
					mo.dom.fn.clone(mo.dom.modalCTA);
					mo.dom.modalCTA = document.querySelector(".dxpModal .dxpModalCTA");
					mo.dom.modalCTA.setAttribute("state","enabled");
					
					// CTA CALLBACK Function
					if(typeof(config.ctaDisabled) !== "undefined" && config.ctaDisabled == true) {
						mo.dom.modalCTA.setAttribute("state","disabled");
						if(typeof(config.ctaCallback) === "function") mo.c.w("Modal's CTA button was requested as disabled. Unable to apply CTA interaction function");
					}
					else {
						if(typeof(config.ctaCallback) === "function") {
							mo.dom.modalCTA.addEventListener("click",config.ctaCallback);
							mo.dom.modalCTA.addEventListener("touchstart",config.ctaCallback);
							mo.c.i("Added Modal CTA custom callback");
						} else {
							mo.dom.modalCTA.addEventListener("click",mo.fn.events.closeAll);
							mo.dom.modalCTA.addEventListener("touchstart",mo.fn.events.closeAll);
							mo.c.i("Added Modal CTA default callback");
						}
					}
					
					// DEFAULT CLOSE ACTION
					if(typeof(config.close) === "undefined" || config.close != false) {
						// CLOSE ICON
						mo.dom.modalCloseIcon.style.display = "block";
						mo.dom.modalCloseIcon.addEventListener("touchstart",mo.fn.events.closeAll);
						mo.dom.modalCloseIcon.addEventListener("click",mo.fn.events.closeAll);
						document.addEventListener('keydown', mo.fn.events.escKeyPress);
						
						// CLOSE BUTTON
						if(typeof(config.closeLabel) === "string") {
							mo.dom.modalCloseButton.innerText = config.closeLabel;
							mo.dom.modalCloseButton.style.display = "inline-block";
							mo.dom.modalCloseButton.addEventListener("touchstart",mo.fn.events.closeAll);
							mo.dom.modalCloseButton.addEventListener("click",mo.fn.events.closeAll);
						}
						else {
							mo.dom.modalCloseButton.innerText = "";
							mo.dom.modalCloseButton.style.display = "none";
							mo.dom.modalCloseButton.removeEventListener("touchstart",mo.fn.events.closeAll);
							mo.dom.modalCloseButton.removeEventListener("click",mo.fn.events.closeAll);
						}
					}
					else {
						mo.dom.modalCloseIcon.style.display = "none";
						mo.dom.modalCloseButton.innerText = "";
						mo.dom.modalCloseButton.style.display = "none";
						
						mo.dom.modalCloseIcon.removeEventListener("touchstart",mo.fn.events.closeAll);
						mo.dom.modalCloseIcon.removeEventListener("click",mo.fn.events.closeAll);
						mo.dom.modalCloseButton.removeEventListener("touchstart",mo.fn.events.closeAll);
						mo.dom.modalCloseButton.removeEventListener("click",mo.fn.events.closeAll);
						document.removeEventListener('keydown', mo.fn.events.escKeyPress);
					}
					
					if(typeof(config.class) === "string")
						mo.dom.modal.classList.add(config.class);
					
									
					if(typeof(config.closeCTA) === "function" || config.closeCTA != false) {
						mo.dom.modalCloseButton.addEventListener("touchstart",config.closeCTA);
						mo.dom.modalCloseButton.addEventListener("click",config.closeCTA);
					}
					// ADD CLOSE MESSAGE function
					mo.dom.modalMSG.querySelector("span.close").addEventListener("click",mo.fn.modal.msg);
					
					// FINISHED LOADING
					mo.dom.modal.setAttribute("mo-state","active");
					let overlayCFG = {};
					if(config.close === false) 
						overlayCFG.close = false;
					mo.fn.overlay.show(overlayCFG);
					mo.c.i("Modal state changed to active");
				}
			},
			hide: function() {
				mo.fn.overlay.hide();
				mo.dom.modal.setAttribute("mo-state","");
				mo.dom.modal.setAttribute("class","dxpModal");
				mo.dom.modal.setAttribute('id','');
				mo.fn.modal.unlock();
				mo.c.i("Modal state changed to inactive");
			},
			lock: function() {
				if(mo.dom.modal.getAttribute("class").indexOf("locked") == -1)
					mo.dom.modal.classList.add("locked");
			},
			unlock: function() {
				mo.dom.modal.classList.remove("locked");
			},
			msg: function(txt,lvl) {
				if(typeof(txt) === "undefined" && typeof(lvl) === "undefined") {
					mo.dom.modalMSG.setAttribute("class","msg");
					mo.dom.modalMSG.querySelector("p").innerText = "";
				}
				else {
					mo.dom.modalMSG.querySelector("p").innerText = txt;
					mo.dom.modalMSG.setAttribute("class","msg");
					if(lvl == 0) mo.dom.modalMSG.classList.add("def");
					else if(lvl == 1)  mo.dom.modalMSG.classList.add("scs");
					else if(lvl == 2)  mo.dom.modalMSG.classList.add("wrn");
					else if(lvl == 3)  mo.dom.modalMSG.classList.add("err");
					else mo.fn.modal.msg();
					mo.dom.modalContainer.scrollTo({top:0,behavior:"smooth"});
				}
			}
		},
		progress: {
			setProgressBar: function(percent) {
				mo.dom.progressBar.style.width = percent;
			},
			setLoadingTxt: function(string) {
				var loadingText = document.createTextNode(string);
				mo.dom.progressTxt.innerText = string;
			},
			show: function(config) {
				if(typeof(config) !== "object" || typeof(config.progressPercent) !== "number") {
					mo.c.e("Unable to load progress bar. Undefined or incorrectly defined object");
					mo.fn.progress.hide();
				}

				else {
					mo.dom.progress.setAttribute("class","active");
					
					if(typeof(config.progressText) === "string")
						mo.fn.progress.setLoadingTxt(config.progressText);
					
					if(typeof(config.progressPercent) === "number") {
						var percent = parseInt(config.progressPercent)+"%";
						mo.fn.progress.setProgressBar(percent);
						if(typeof(config.progressText) !== "string")
							mo.fn.progress.setLoadingTxt(percent);
					}
					if(config.progressPercent == 100) {
						setTimeout(function(){
							mo.fn.progress.hide();
						}, 500)
					}
				}
			},
			hide: function() {
				mo.dom.overlay.classList.remove("loading");
				mo.dom.progress.setAttribute("class","");
				mo.fn.progress.setLoadingTxt("");
				mo.fn.progress.setProgressBar("0");
			}
		},
		events: {
			enableModalCTA: function(cb) {
				if(typeof(cb) === "function") {
					mo.dom.modalCTA.addEventListener("click",cb);
					mo.dom.modalCTA.addEventListener("touchstart",cb);
					mo.dom.modalCTA.setAttribute("state","");
				}
				else {
					mo.dom.modalCTA.addEventListener("click",mo.fn.events.closeAll);
					mo.dom.modalCTA.addEventListener("touchstart",mo.fn.events.closeAll);
					mo.dom.modalCTA.setAttribute("state","");
				}
			},
			escKeyPress: function(key) {
				if(key.keyCode == 27) mo.fn.events.closeAll();
			},
			enterKeyPress: function(key,cb) {
				if(key.keyCode == 13) {
					if(typeof(cb) === "function") cb();
					else mo.fn.events.closeAll();
				}
			},
			closeAll: function() {
				mo.fn.progress.hide();
				mo.fn.modal.hide();
				mo.fn.modal.msg();
				setTimeout(function(){
					mo.fn.progress.hide();
				},500);
			}
		},
		containerOverlay: {
			show: function(params) {
				const container = params.hasOwnProperty('container') ? params.container : null,
					loading = params.hasOwnProperty('loading') ? params.loading : false,
					shadow = params.hasOwnProperty('shadow') ? params.shadow : false;

				if (container === null || container === undefined) return;

				const style = window.getComputedStyle(container),
    				paddingLeft = style.getPropertyValue('padding-left'),
    				paddingTop = style.getPropertyValue('padding-top');
    				height = container.offsetHeight,
    				width = container.offsetWidth;

				const node = document.createElement('div');
				node.style.height = height + 'px';
				node.style.width = width + 'px';
				node.classList.add('moContainerOverlay');

				if (shadow) node.classList.add('moShadowOverlay');
				if (height < 75) node.classList.add('moOverlayHeight');
				if (paddingLeft) node.style.marginLeft = '-' + paddingLeft;
				if (paddingTop) node.style.marginTop = '-' + paddingTop;

				if (loading) {
					const loadingIcon = document.createElement('div');
					loadingIcon.style.height = height + 'px';
					loadingIcon.style.width = width + 'px';
					loadingIcon.classList.add('moLoadingIconOverlay');

					if (height < 75) loadingIcon.classList.add('moOverlayHeight');
					if (paddingLeft) loadingIcon.style.marginLeft = '-' + paddingLeft;
					if (paddingTop) loadingIcon.style.marginTop = '-' + paddingTop;

					container.prepend(loadingIcon);
				}

				container.prepend(node);
			},
			hide: function(container) {
				const nodes = [
					...container.getElementsByClassName('moContainerOverlay'),
					...container.getElementsByClassName('moLoadingIconOverlay'),
				];
				if (nodes.length > 0) {
					nodes.forEach(function(node) {
						node.parentNode.removeChild(node);
					});
				}
			},
		}
	},
	init: function(source) {
		mo.dom.fn.css(source);
		mo.fn.overlay.html();
		mo.fn.modal.html();
	}
}