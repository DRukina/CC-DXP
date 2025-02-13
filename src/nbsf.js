const nbsf = {
	init: function(config,page) {
		// POLYFILL FOR IE
		nbsf.fn.closest();
		// SET LOCALE
		nbsf.fn.locale(config);
		
		// SET PAGE IF PROVIDED
		if(typeof(page) === "number")
			config.page = page;
		if(typeof(config.page) !== "number")
			config.page = 0;
		if(config.page < 0)
			config.page = 0;
		if(config.page > config.pages.length-1)
			config.page = config.pages.length-1;

		// CREATE REFERENCE DATA
		nbsf.builder.reference(config);
		// CLEAN DOM
		nbsf.builder.reset(config,config.page);
		// BUILD FORM PAGE
		nbsf.builder.header(config,config.page);
		nbsf.builder.structure(config,config.page);
		nbsf.builder.navigation(config,config.page);
		nbsf.builder.defaults(config,config.page);
		// ASSIGN UI INTERACTION
		// AND UI EVENTS TO FORM
		nbsf.builder.interaction(config,config.page);
		nbsf.builder.events(config,config.page);
		nbsf.ev.global(config,config.page,false);
		// EXECUTE PAGE CALLBACK IF AVAILABLE
		if(typeof(config.pages[page].callback) === "function")
			config.pages[page].callback(config);
	},
	builder: {
		reset: function(config,page) {
			nbsf.c.i("Set or default current page");
			config.page = parseInt(page) || 0;
			
			nbsf.c.i("Clean DOM workspace");
			config.dom.innerHTML = '';
			config.dom.classList.add("nbsf");
			config.dom.setAttribute("data-step", "step-" + page);
			config.dom.setAttribute("data-step-name", config.pages[page].title);
		},
		reference: function(config) {
			if(typeof(config.data) !== "object") {
				nbsf.c.i("Setting reference defaults");
				if(typeof(config.dataset) === "undefined")
					config.dataset = {};
				for(i=0;i<config.pages.length;i++) {
					var cPage = config.pages[i];
					for(j=0;j<cPage.structure.length;j++) {
						var cStructure = cPage.structure[j];
						for(k=0;k<cStructure.group.length;k++) {
							var cFieldset = cStructure.group[k];
							for(l=0;l<cFieldset.length;l++) {
								cInput = cFieldset[l];
								if(typeof(cInput.data) == "string") {
									if(typeof(config.dataset[cInput.data]) === "undefined" || config.dataset[cInput.data] == null || config.dataset[cInput.data].length == 0) {
										if(typeof(cInput.value) !== "undefined") config.dataset[cInput.data] = cInput.value;
										else config.dataset[cInput.data] = null;
									}
								}
							}
						}
					}
				}
			}
		},
		header: function(config,page) {
			nbsf.c.i("Building form header");
			if(typeof(config.pages[page].title) === "string" || typeof(config.pages[page].subtitle) === "string" || typeof(config.pages[page].description) === "string") {
				var header = document.createElement("div");
				header.setAttribute("class","header");
				if(typeof(config.pages[page].title) === "string") {
					var title = document.createElement("h2");
					title.setAttribute("class","title");
					title.innerHTML = nbsf.ui.translate(config,config.pages[page].title);
					header.appendChild(title);
				}
				if(typeof(config.pages[page].subtitle) === "string") {
					var subtitle = document.createElement("h4");
					subtitle.setAttribute("class","subtitle");
					subtitle.innerHTML = nbsf.ui.translate(config,config.pages[page].subtitle);
					header.appendChild(subtitle);
				}
				if(typeof(config.pages[page].description) === "string") {
					var description = document.createElement("p");
					description.setAttribute("class","description");
					description.innerHTML = nbsf.ui.translate(config,config.pages[page].description);
					header.appendChild(description);
				}
				config.dom.appendChild(header);
			}
		},
		structure: function(config,page) {
			nbsf.c.i("Building form structure");
			for(i=0;i<config.pages[page].structure.length;i++) {
				var structure = config.pages[page].structure[i];
				var filter = true;
				if(typeof(config.pages[page].structure[i].filter) === "object")
					filter = nbsf.fn.filter(config.pages[page].structure[i].filter);
				if(typeof(config.pages[page].structure[i].group) === "object" && filter)
					nbsf.builder.row(config,page,i);
				else
					nbsf.c.i("Unable to build currect form structure for page "+page+" and structure "+structure);
			}
		},
		row: function(config,page,structureIndex,selector) {
			// DEFAULT STRUCTURE SELECTOR
			let structure = config.pages[page].structure[structureIndex];

			// DEFINE IF CLONE
			/*let clone = false;
			if(typeof(selector) === "object")
				clone = true;*/
			
			// CREATE DOM ROW
			var rowAttr = {'class':'row'};
			if(typeof(structure.hidden) === "boolean" && structure.hidden)
				rowAttr["class"] = 'row hidden';
			if(typeof(structure.id) === "string")
				rowAttr['id'] = structure.id
			var row = nbsf.fn.node("div",rowAttr);
			
			// ROW CREATION
			// CREATE ROW HEADING
			if((typeof(structure.header) === "string" || structure.description != undefined) && typeof(selector) !== "object") {
				// CREATE DOM ROW HEADING
				var heading = nbsf.fn.node("div",{'class':'heading'});
				if(typeof(structure.header) === "string") {
					var headingTitle = nbsf.fn.node("h4");
					headingTitle.innerHTML = nbsf.ui.translate(config,structure.header);
					heading.appendChild(headingTitle);
				}
				if(typeof(structure.description) === "string") {
					var headingDescription = nbsf.fn.node("p");
					headingDescription.innerHTML = nbsf.ui.translate(config,structure.description);
					heading.appendChild(headingDescription);
				}
			  	else if (typeof(structure.description) === "function")
				{
					var headingDescription = nbsf.fn.node("p");
					headingDescription.innerHTML = structure.description(config);
					heading.appendChild(headingDescription);
				}
				// APPEND HEADING TO ROW
				row.appendChild(heading);
			}
			else nbsf.c.i("Missing configuration or selector to set heading for a form section.");
			// CREATE REPEATABLE ROW
			if(typeof(structure.repeatable) === "string") {
				// CREATE REPEATABLE COMPONENT
				var repeat = nbsf.fn.node('div',{'class':'repeater'});
				
				row.setAttribute("data-rname",structure.repeatable);
				
				// IF REPEATABLE LIMIT DEFINED
				if(typeof(structure.repeatableLimit) === "number")
					row.setAttribute("data-rlimit",structure.repeatableLimit);
				
				// IF REPEATABLE ADD TO TOP INSTEAD OF BOTTOM
				if(typeof(structure.repeatableDirection) === 'string')
					row.setAttribute("data-rdirection",structure.repeatableDirection);
				
				// CREATE DUPLICATE COMPONENT
				var repeatAdd = nbsf.fn.node('svg',{'class':'add','version':'1.1','viewbox':'0 0 24 24','role':'img','aria-label':'add circle','width':'24px','height':'24px'});
				var repeatAddPath = nbsf.fn.node('path',{'fill':'none','stroke':'#666','stroke-width':'2','d':'M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,18 L12,6 M6,12 L18,12'});
				repeatAdd.appendChild(repeatAddPath);
				
				repeat.appendChild(repeatAdd);
				repeatAdd.addEventListener("click",function(e) {
					nbsf.fn.clone(config, e.target.closest(".row"));
				});
				
				// DONOR NODE BEHAVIOUR ONLY
				// ASSIGN RANDOMLY GENERATED
				// REPEATABLE DONOR ATTRIBUTE
				var donor = nbsf.fn.random(0,99999999);
				structure.donor = donor;
				row.setAttribute("data-donor",donor);
				
				// APPEND TO ROW
				row.appendChild(repeat);
			}
			
			// BUILD ROW FIELDSETS
			// FIELDSETS CALL INPUT BUILDER
			// NEEDS TO BE CALLED BEFORE
			// APPENDING ROW TO DOCUMENT
			nbsf.builder.fieldsets(config,page,structureIndex,row);
			
			// ADD ROW TO DOCUMENT
			config.dom.appendChild(row);
		},
		fieldsets: function(config,page,structureIndex,row) {
			structure = config.pages[page].structure[structureIndex];
			structure.group.forEach(function(group,groupIndex) {
				var fieldset = nbsf.fn.node("fieldset");
				group.forEach(function(input,inputIndex) {
					var address = [page,structureIndex,groupIndex,inputIndex].join(",");
					nbsf.builder.input(config,page,structure,group,input,fieldset,address);
				});
				row.appendChild(fieldset);
			});
		},
		input: function(config,page,structure,group,item,selector,address) {
			// CURRENT ITEM
			var cItem = item;
			var cFieldset = selector;

			if(typeof(cItem.data) === "string" && typeof(cItem.type) === "string") {
				// CURRENT VALUE
				var cValue = "";
				if(typeof(cItem.value) !== "undefined" && cItem.value != null && cItem.value != false)
					cValue = cItem.value;
				if(typeof(config.dataset[cItem.data]) !== "undefined" && config.dataset[cItem.data] != null)
					cValue = config.dataset[cItem.data];

				// ADD LABEL WRAPPER DOM NODE
				var cClass = 'wrapper '+cItem.type;
				if(typeof(cItem.class) === 'string')
					cClass = cClass+' '+cItem.class;
				var cLabel = nbsf.fn.node("label",{'class':cClass,'data-address':address,'style':'display:block'})
				if(cItem.type === "hidden")
					cLabel.setAttribute("style","display:none");
			  
				if(cItem.disabled)
					cLabel.classList.add("wrapper-disabled")
			  
			    if(cItem.attributes && cItem.attributes.length > 0)
				{
					for(var i =0; i < cItem.attributes.length; i++)
					{
					    var keys = Object.keys(cItem.attributes[i]);
						if(keys.length > 0)
							cLabel.setAttribute(keys[0], cItem.attributes[i][keys[0]]);
						
					}
				}

				// ADD LABEL TEXT
				if(typeof(cItem.label) !== "undefined" && cItem.label != null && cItem.type != "kUpload") {
					var name = document.createElement("span");
					name.setAttribute("class","name");
					name.innerHTML = nbsf.ui.translate(config,cItem.label);
					// ADD REQUIRED FLAG
					if(typeof(cItem.required) !== "undefined" && cItem.required != null && cItem.required == true) {
						var req = document.createElement("span");
						req.setAttribute("class","required");
						req.innerText = "*";
						name.appendChild(req);
					}
					cLabel.appendChild(name);
				}

				// ADD COSMIN'S WRAPPER
				var fmmc = document.createElement("div");
				fmmc.setAttribute("class","fmmcosmin");
			  	if(cItem.id != undefined)
					fmmc.setAttribute("data-id",cItem.id);
				cLabel.appendChild(fmmc);
				var cWrapper = cLabel.querySelector("div");

				// PLACEHOLDER DEFAULT
				var placeholder = "";
				if(typeof(cItem.placeholder) === "string")
					placeholder = cItem.placeholder;
				placeholder = nbsf.ui.translate(config,placeholder);

				// SWITCH CASE FOR TYPES OF INPUT
				switch (cItem.type) {
					case "hidden":
						var input = nbsf.fn.node("input",{'type':'hidden','data-name':cItem.data,'data-type':cItem.type,'value':cValue});
						cWrapper.appendChild(input);
						break;
					case "text":
						var input = nbsf.fn.node("input",{'type':'text','data-name':cItem.data,'data-type':cItem.type,'value':cValue,'placeholder':placeholder},cItem.disabled);
						cWrapper.appendChild(input);
						break;
					case "email":
						var input = nbsf.fn.node("input",{'type':'email','data-name':cItem.data,'data-type':cItem.type,'value':cValue,'placeholder':placeholder},cItem.disabled);
						cWrapper.appendChild(input);
						break;
					case "password":
						var input = nbsf.fn.node("input",{'type':'password','data-name':cItem.data,'data-type':cItem.type,'value':cValue,'placeholder':placeholder},cItem.disabled);
						cWrapper.appendChild(input);
						break;
					case "textarea":
						var input = nbsf.fn.node("textarea",{'data-name':cItem.data,'data-type':cItem.type,'placeholder':placeholder},cItem.disabled);
						input.innerText = cValue;
						cWrapper.appendChild(input);
						break;
					case "richtextarea":
						nbsf.c.e("Rich textarea is not yet supported");
						break;
					case "select":
						var input = nbsf.fn.node("select",{'data-name':cItem.data,'data-type':cItem.type},cItem.disabled);
						var selectOne = nbsf.fn.node("option",{'disabled':true,'selected':true});
						if(!cItem.required)
							var selectOne = nbsf.fn.node("option",{'selected':true});
						selectOne.innerText = nbsf.ui.translate(config,nbsf.fn.translate('selectOne',config.locale, config.reference));
						input.appendChild(selectOne);
						if(typeof(cItem.values) === "function")
							vals = cItem.values();
						else
							vals = cItem.values;
						
						for(vIndex=0;vIndex<vals.length;vIndex++) {
							var label = vals[vIndex];
							if(typeof(cItem.options) === "object" && vals.length == cItem.options.length)
								label = cItem.options[vIndex];
							var option = nbsf.fn.node("option",{'value':vals[vIndex]});
							option.innerText = nbsf.ui.translate(config,nbsf.fn.translate(label,config.locale));
							input.appendChild(option);
						}

						if(vals.indexOf(cValue) > -1)
							input.value = cValue;

						cWrapper.appendChild(input);
						
						break;
					case "multiselect":
						// CREATE THE SELECT
						var input = nbsf.fn.node("select",{'data-name':cItem.data,'data-type':cItem.type,'multiple':true},cItem.disabled);
						
						// CREATE & APPEND OPTIONS
						if(typeof(cItem.values) === "function")
							vals = cItem.values();
						else
							vals = cItem.values;

						for(vIndex=0;vIndex<vals.length;vIndex++) {
							var label = vals[vIndex];
							if(typeof(cItem.options) === "object" && vals.length == cItem.options.length)
								label = cItem.options[vIndex];
							var option = nbsf.fn.node("option",{'value':vals[vIndex]});
							option.innerText = nbsf.ui.translate(config,nbsf.fn.translate(label,config.locale));
							input.appendChild(option);
						}

						// SET SELECTED OPTIONS
						if(typeof(cValue) === "string" && cValue.length > 0) {
							var vls = cValue.split(",");
							vls.forEach(function(vl) {
								var opt = input.querySelector("option[value='"+vl+"']");
								if(opt != null)
									opt.setAttribute("selected",true);
							});
						}
						
						// APPEND THE SELECT
						cWrapper.appendChild(input);
						
						// CREATE & APPEND TOOLTIP
						var tip = document.createElement("em");
						tip.setAttribute("class","tooltip");
						tip.innerText = nbsf.ui.translate(config,nbsf.fn.translate('multipleCtrl',config.locale));
						cWrapper.appendChild(tip);
						
						break;
					case "checkbox":
						// BUILD LOCAL INSTANCE VALUES ARRAY
						var vls = [];
						if(typeof(cItem.values) === "function") var vls = cItem.values();
						else if(typeof(cItem.values) === "object") var vls = cItem.values;
						else nbsf.c.e("Value array is undefined; cannot build checkbox object");
						
						// BUILD LOCAL INSTANCE OPTIONS ARRAY
						var opts = [];
						if(typeof(cItem.options) == "function") var opts = cItem.options();
						else if(typeof(cItem.options) == "object") var opts = cItem.options;
						
						// CREATE AND APPEND CHECKBOXES
						for(vIndex=0;vIndex<vls.length;vIndex++) {
							var label = nbsf.fn.node("label");
							var input = nbsf.fn.node("input",{'type':"checkbox",'data-type':'checkbox','class':"checkbox",'data-name':cItem.data,'value':vls[vIndex]},cItem.disabled);
							var span = nbsf.fn.node("span");

							if(vls.length == opts.length)
								var text = document.createTextNode(nbsf.ui.translate(config,opts[vIndex]));
							else
								var text = document.createTextNode(nbsf.ui.translate(config,vls[vIndex]));

							label.appendChild(input);
							label.appendChild(span);
							label.appendChild(text);
							cWrapper.appendChild(label);
						};
						break;
					case "radio":
						// BUILD LOCAL INSTANCE VALUES ARRAY
						var vls = [];
						if(typeof(cItem.values) === "function") var vls = cItem.values();
						else if(typeof(cItem.values) === "object") var vls = cItem.values;
						else nbsf.c.e("Value array is undefined; cannot build checkbox object");

						// BUILD LOCAL INSTANCE OPTIONS ARRAY
						var opts = [];
						if(typeof(cItem.options) == "function") var opts = cItem.options();
						else if(typeof(cItem.options) == "object") var opts = cItem.options;

						// CREATE AND APPEND CHECKBOXES
						for(vIndex=0;vIndex<vls.length;vIndex++) {
							var label = nbsf.fn.node("label");
							var input = nbsf.fn.node("input",{'type':"radio",'class':"radio",'name':cItem.data,'data-name':cItem.data,'data-type':"radio",'value':vls[vIndex]},cItem.disabled);
							var span = nbsf.fn.node("span");

							if(vls.length == opts.length)
								var text = document.createTextNode(nbsf.ui.translate(config,opts[vIndex]));
							else
								var text = document.createTextNode(nbsf.ui.translate(config,vls[vIndex]));

							label.appendChild(input);
							label.appendChild(span);
							label.appendChild(text);
							cWrapper.appendChild(label);
						};
						break;
					case "agree":
						var label = nbsf.fn.node("label");
						var input = nbsf.fn.node("input",{'type':"checkbox",'data-name':cItem.data,'value':cItem.values[0],'data-type':"agree"},cItem.disabled);
						var span = nbsf.fn.node("span");
						label.appendChild(input);
						label.appendChild(span);
						cWrapper.appendChild(label);
						break;
					case "toggle":
						// BUILD LOCAL INSTANCE VALUES ARRAY
						var vls = [];
						if(typeof(cItem.values) === "function") var vls = cItem.values();
						else if(typeof(cItem.values) === "object") var vls = cItem.values;
						
						if(vls.length != 2) nbsf.c.e("Value array is undefined or is not matching the number of values required for input");
						else {
							var label = nbsf.fn.node("label",{'for':cItem.data});
							var input = nbsf.fn.node("input",{'type':"hidden",'name':cItem.data,'data-name':cItem.data,'value':vls[0],'data-type':"toggle"});
							var toggle = nbsf.fn.node("div",{'class':'toggle','data-values':vls.join(",")},cItem.disabled);
							var span = nbsf.fn.node("span");
							
							// NON DEFAULT VALUE
							if(vls.indexOf(config[cItem.data]) == 1) {
								label.classList.add("active");
								input.value = config[cItem.data];
							}
							
							toggle.appendChild(span);
							label.appendChild(input);
							label.appendChild(toggle);
							cWrapper.appendChild(label);
						}
						break;
					case "confirm":
						var placeholder = "";
						if(typeof(cItem.placeholder) !== "undefined" && cItem.placeholder != null)
							var placeholder = cItem.placeholder;
						
						var value = "";
						if(typeof(config[cItem.data]) === "string" && config[cItem.data].length > 0)
							value = config[cItem.data];
						else if(typeof(cItem.value) === "string" && cItem.value.length > 0)
							value = cItem.value;
						
						// MAIN INPUT
						var input = nbsf.fn.node("input",{'type':"text",'data-type':'confirm','name':cItem.data,'placeholder':nbsf.ui.translate(config,placeholder),'data-name':cItem.data,'value':value});
						cWrapper.appendChild(input);
						
						// BUILD AND APPEND CONFIRMATION
						var label = nbsf.fn.node("label",{'class':"wrapper "+cItem.type,'data-address':address});
						var span = nbsf.fn.node("span",{'class':"name"});
						if(typeof(cItem.confirm) === 'string')
							span.innerText = nbsf.fn.translate(cItem.confirm,config.locale);
						else
							span.innerText = nbsf.fn.translate("confirm",config.locale) + " " +  nbsf.ui.translate(config,cItem.label).toLowerCase();
						var req = nbsf.fn.node("span",{'class':"required"});
						req.innerText = "*";
						span.appendChild(req);
						var fmmc = nbsf.fn.node("div",{'class':"fmmcosmin"});
						var input = nbsf.fn.node("input",{'type':"text",'placeholder':nbsf.ui.translate(config,placeholder),'data-confirm':cItem.data,'value':value});
						fmmc.appendChild(input);
						label.appendChild(span);
						label.appendChild(fmmc);

						break;
					case "upload":
						cWrapper.innerHTML += '<iframe src="'+cItem.values+'?EntryId='+config.dataset.EntryId+'&Language='+config.dataset.Language+'" frameBorder="0" width="100%" height="80px" scrolling="false" data-name="'+cItem.data + '" data-type="upload"></iframe>';
						// LISTEN TO MESSAGES FROM THE IFRAMED PAGE
						window.onmessage = function(e) {
							nbsf.c.i("Message received from upload module.");
							nbsf.ev.global(config,page,false);
						};
						break;
					case "kUpload":
						//check libraries
						if(!nbsf.fn.isJQ() || !nbsf.fn.isKendo())
							nbsf.c.e("Unable to run kendo file uploader; jQuery and/or Kendo are not available");
						//check page index is zero
						else if(page == 0 && typeof(config.dataset.EntryId) !== 'number')
							nbsf.c.e("Unable to init kendo file uploader; the uploader can not be on the first page");
						 else if(config.dataset == undefined || config.dataset.EntryId == undefined && !cItem.uploadConfig.entryId && !cItem.uploadConfig.getEntryId)
							nbsf.c.e("Unable to init kendo file uploader; EntryId is not specified");

						//kendo upload is available
						else
						{
							var input = nbsf.fn.node("input",{'type':"file",'name':cItem.data,'data-name':cItem.data});

							var span = nbsf.fn.node("span");

							span.innerHTML =
										nbsf.fn.translate('uploadCaptionPart1',config.locale) + " " +
										cItem.uploadConfig.extensions.join(", ") + " " +
										nbsf.fn.translate('uploadCaptionPart2',config.locale) + " " +
										cItem.uploadConfig.maxFileSize + " " +
										"MB.";

							cWrapper.appendChild(input);
							cWrapper.appendChild(span);

							var files = [];
							if(cItem.value != undefined)
							{ 
							  if(typeof(cItem.value) === "function")
								cValue = cItem.value();
							  else cValue = cItem.value;
							}
							if(cValue)
							{
							  files.push({
								name: cValue,
								extension: "." + cValue.split('.').pop()
							  });
							  input.setAttribute("uploaded", true);
							}

							var id = config.dataset.EntryId || cItem.uploadConfig.entryId;
							if(cItem.uploadConfig.getEntryId)
							  id =  cItem.uploadConfig.getEntryId();
							$(input).kendoUpload({
							  async: {
								saveUrl: 'https://'+window.location.hostname+'/form/'+cItem.uploadConfig.formId+'/attachments/'+ id +'/'+cItem.data +'/handler',
								autoUpload: !!!cItem.preventAutoUpload
							  },
							  validation: {
								allowedExtensions: cItem.uploadConfig.extensions,
								maxFileSize: (cItem.uploadConfig.maxFileSize || 1) * 1024 * 1024
							  },
							  localization: {
								select: cItem.label
							  },
							  multiple: false,
							  files: files
							}).data("kendoUpload");

						}
						break;
					case "pdf":
								//checking libraries
						 if (!nbsf.fn.isJQ() || !nbsf.fn.isPdf())
		           			nbsf.c.e("jQuery and/or pdf.js are not available");

						 else {
							var link = cItem.pdfConfig.link;
							if (typeof (cItem.pdfConfig.link) === "function") 
								link = cItem.pdfConfig.link();
							
							var defaultPage = config.dataset[cItem.pdfConfig.page];
							if(!defaultPage)
								defaultPage = 0;

						   if(cItem.description)
						   {
							 var caption = nbsf.fn.node("div", {'class':"pdf-caption"});

							 caption.innerHTML = cItem.description;
							 cWrapper.appendChild(caption);
						   }
						   
							var wrapper = nbsf.fn.node("div", {'class':"pdf-wrapper", 'name':cItem.data,'data-name':cItem.data});
							if(cValue == "Y")
								wrapper.setAttribute("value", "Y");

							cWrapper.appendChild(wrapper);

							var toolbar = nbsf.fn.node("div", {'class':"pdf-toolbar"});
							var toolbarContainer = nbsf.fn.node("div", {'class':"pdf-toolbar-container"});
							var btnPrevPage = nbsf.fn.node("span", {'class':"span-prev-page"});
							var separator = nbsf.fn.node("span", {'class':"span-separator"});
							var btnNextPage = nbsf.fn.node("span", {'class':"span-next-page"});
							var inputPageNum = nbsf.fn.node("input", {'class':"input-page-num"});
							var spanPageNum = nbsf.fn.node("span", {'class':"page-num-caption"});
							if(nbsf.fn.isKendo())
							{
								var btnPreview = nbsf.fn.node("span", {'class':"span-preview-mode"});
							}
							else nbsf.c.e("Kendo window is not available. The preview button will be hidden");

							var btnDownload = nbsf.fn.node("span", {'class':"span-download"});

							toolbarContainer.appendChild(btnPreview);
                                toolbarContainer.appendChild(btnDownload);
                                toolbarContainer.appendChild(btnPrevPage);
                                toolbarContainer.appendChild(separator);
                                toolbarContainer.appendChild(btnNextPage);
                                toolbarContainer.appendChild(inputPageNum);
                                toolbarContainer.appendChild(spanPageNum);

                                toolbar.appendChild(toolbarContainer);
                                wrapper.appendChild(toolbar);

                                var loadingBar = nbsf.fn.node("div", {
                                    'class': "pdf-loading-bar"
                                });
                                wrapper.appendChild(loadingBar);

                                //PREVIEW MODE
                                function showPreviewMode(viewerData) {
                                    var modalWindow = nbsf.fn.node("div");
                                    $(modalWindow).kendoWindow({
                                        width: "60%",
                                        title: "",
                                        resizable: false
                                    });
                                    var dialog = $(modalWindow).data("kendoWindow");

                                    var modalViewerData = initViewer(
                                        link,
                                        "pdf-container-preview-mode",
                                        function() {
                                            //update main viewer too
                                            var curPage = getCurrentPage(modalViewerData);
                                            updatePagination(curPage, viewerData);
                                            moveToPage(0, curPage, viewerData);
                                        },
                                        getCurrentPage(viewerData));
                                    dialog.content(modalViewerData.container);
                                    dialog.center().open();
                                }

                                //EVENTS
                                btnPrevPage.addEventListener("click", function() {
                                    moveToPage(-1, undefined, viewerData);
                                });

                                btnNextPage.addEventListener("click", function() {
                                    moveToPage(1, undefined, viewerData);
                                });

                                inputPageNum.addEventListener("input", function() {
                                    if (!isNaN(parseInt(inputPageNum.value)))
                                        moveToPage(undefined, parseInt(inputPageNum.value) - 1, viewerData);
                                });

                                btnPreview.addEventListener("click", function() {
                                    showPreviewMode(viewerData);
                                });

                                btnDownload.addEventListener("click", function() {
                                    var request = new XMLHttpRequest();
                                    request.open("GET", link);
                                    request.responseType = "blob";
                                    request.onload = function() {
                                        var a = document.createElement("a");
                                        a.href = URL.createObjectURL(this.response);
                                        a.download = cItem.pdfConfig.displayName;
                                        document.body.appendChild(a);
                                        a.click();
                                    }
                                    request.send();
                                });

                                //HELP MEHTODS
                                function moveToPage(dir, val, viewerData) {
								  
                                    var nexIdx = val;
                                    if (dir) {
                                        var pageIdx = getCurrentPage(viewerData);
                                        var nexIdx = pageIdx + dir;
                                    }
                                    if (nexIdx < 0 || (nexIdx + 1) > viewerData.viewer.getAttribute("total-pages-count"))
                                        return;

                                    viewerData.vpContainer.scrollTo(0, nexIdx * getItemHeight(viewerData));
								  
								  	if(cItem.pageChanged)
								    	cItem.pageChanged(nexIdx);
                                };

                                function getItemHeight(viewerData) {
                                    var itemHeight = viewerData.vpContainer.scrollHeight / viewerData.pagesCount;
                                    if (!itemHeight || itemHeight == 0) return 0;
                                    return itemHeight;
                                }

                                function updatePagination(curIdx, viewerData) {
                                    var totalCount = viewerData.viewer.getAttribute("total-pages-count");
                                    var pageNumber = curIdx + 1;
                                    viewerData.pagination.innerHTML = pageNumber + '/' + totalCount;

                                    inputPageNum.value = pageNumber;
                                    spanPageNum.innerHTML = "/ " + totalCount;
                                    if (pageNumber == totalCount && wrapper.getAttribute("value") != "Y") {
                                        wrapper.setAttribute("value", "Y");
                                        var event = document.createEvent("Event");
                                        event.initEvent('pdf_viewed', false, true);
                                        wrapper.dispatchEvent(event);
                                    }
                                };

                                function getCurrentPage(viewerData) {
                                    var vpContainer = viewerData.vpContainer;
                                    var itemHeight = getItemHeight(viewerData);
                                    return parseInt((vpContainer.scrollTop + (vpContainer.clientHeight / 2)) / itemHeight);
                                }

                                //PDF VIEWER
                                function initViewer(pdfUrl, containerStyle, scrollCallback, scrollToPage) {
                                    if (scrollToPage == undefined)
                                        scrollToPage = 0;

                                    var container = nbsf.fn.node("div", {
                                        'class': containerStyle
                                    });
                                    var viewer = nbsf.fn.node("div", {
                                        'class': "pdf-viewer"
                                    });
                                    var vpContainer = nbsf.fn.node("div", {
                                        'class': "pdf-viewport-container"
                                    });
                                    var viewport = nbsf.fn.node("div", {
                                        'class': "pdf-viewport"
                                    });
                                    var annLayer = nbsf.fn.node("div", {
                                        'class': "pdf-viewport"
                                    });
                                    var pagination = nbsf.fn.node("div", {
                                        'class': "pdf-pagination"
                                    });

                                    vpContainer.appendChild(viewport);
                                    vpContainer.appendChild(annLayer);
                                    viewer.appendChild(vpContainer);
                                    viewer.appendChild(pagination);
                                    container.appendChild(viewer);

                                    viewerData = {
                                        container: container,
                                        viewer: viewer,
                                        vpContainer: vpContainer,
                                        viewport: viewport,
                                        pagination: pagination
                                    };

                                    //LOAD AND RENDER PDF
                                    function initPDFViewer(pdfURL) {
                                        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.6.347/es5/build/pdf.worker.js'; // 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
                                        var task = pdfjsLib.getDocument(pdfURL);
                                        task.promise.then(function(pdf) {


                                            pdfInstance = pdf;
                                            viewer.setAttribute("total-pages-count", pdf.numPages);

                                            viewerData.pagesCount = pdf.numPages;

                                            updatePagination(0, viewerData);
                                            $(pagination).css("display", "block");

                                            render(pdf.numPages);
                                        });
                                        task.onProgress = function(progress) {
                                            var progressPerc = (progress.loaded / progress.total * 100);
                                            $(loadingBar).css('width', progressPerc + "%")
                                            if (progressPerc == 100)
                                                $(loadingBar).css("display", "none");
                                        };
                                    };

                                    function render(totalPagesCount) {

                                        const renderPagesPromises = [];
                                        for (let i = 0; i < totalPagesCount; i++) {
                                            renderPagesPromises.push(pdfInstance.getPage(i + 1));
                                        }

                                        Promise.all(renderPagesPromises).then(function(pages) {
                                            pages.forEach(function() {
                                                var cont = nbsf.fn.node("div");
                                                cont.style.position = "relative";

                                                var canvas = nbsf.fn.node("canvas");

                                                var ann = nbsf.fn.node("div");
                                                ann.style.position = "absolute";
                                                ann.style.left = "0px";
                                                ann.style.top = "0px";


                                                cont.appendChild(canvas);
                                                cont.appendChild(ann);
                                                viewport.appendChild(cont)
                                            });
                                            pages.forEach(function(page) {
                                                renderPage(page, totalPagesCount);
                                            });
                                        });
                                    };


                                    //HELP METHODS
                                    function setupAnnotations(page, canvas, viewport, annotationLayerDiv) {

									  	var containerHeight = canvas.clientHeight;
									  	var widthScale = canvas.clientWidth / viewport.viewBox[2];
									  	var heightScale = canvas.clientHeight / viewport.viewBox[3];
                                        var promise = page.getAnnotations().then(function(annotationsData) {
                                            viewport = viewport.clone({
                                                dontFlip: true
                                            });
										  
                                            for (var i = 0; i < annotationsData.length; i++) {

                                                var data = annotationsData[i];
											  	
                                                var element = nbsf.fn.node("a", {});
                                                element.setAttribute("href", data.url);
                                                element.setAttribute("target", "_blank");
                                                var rect = data.rect;
											   
											    rect[0] = rect[0] * widthScale;
											    rect[2] = rect[2] * widthScale;
											    var annHeight  = rect[3] - rect[1];
											    rect[1] = (containerHeight - annHeight) - rect[1] * heightScale;
											  
                                                element.style.left = (rect[0]) + 'px';
                                                element.style.top = (rect[1]) + 'px';
											    element.style.width = (rect[2] - rect[0]) + 'px';
                                                element.style.height = (annHeight) + 'px';
                                                element.style.position = 'absolute'; 

                                               
                                                annotationLayerDiv.append(element);
                                            }
                                        });
                                        return promise;
                                    }

                                    function renderPage(page, totalPagesCount) {

                                        let pdfViewport = page.getViewport({
                                            scale: cItem.pdfConfig.scale ||  0.5
                                        });
                                        pdfViewport = page.getViewport({
                                            scale: viewport.clientWidth / pdfViewport.width
                                        });

                                        let canvas = viewport.children[page.pageNumber - 1].children[0];
                                        const context = canvas.getContext("2d");
                                        canvas.height = pdfViewport.height;
                                        canvas.width = pdfViewport.width;

                                        page.render({
                                            canvasContext: context,
                                            viewport: pdfViewport,
                                        });


                                        setupAnnotations(page, 
														 canvas,
														 pdfViewport, 
														 $(viewport.children[page.pageNumber - 1].children[1])
														);


                                        if (page._pageIndex + 1 == totalPagesCount) {

                                            updatePagination(scrollToPage, viewerData);

                                            moveToPage(defaultPage, scrollToPage, viewerData);

											var moveToPagePublic = function(dir, idx){
												moveToPage(dir, idx, viewerData);
											};
										  	if(cItem.callback)
												cItem.callback(moveToPagePublic);
                                        }

                                    }

                                    function addScrollEvent() {
                                        $(vpContainer).scroll(function(e) {
                                            viewerData = e.target.viewerData;
                                            updatePagination(getCurrentPage(viewerData), viewerData);
                                            if (scrollCallback != undefined)
                                                scrollCallback();
                                        });
                                    }

                                    //INIT
                                    initPDFViewer(pdfUrl);
                                    addScrollEvent();

                                    vpContainer.viewerData = viewerData;
                                    return viewerData;
                                }

                                var viewerData = initViewer(link, "pdf-container");
                                wrapper.appendChild(viewerData.container);
						}
						break;
					case "date":
						// jQuery AND/OR jQuery DateTimePicker
						// ARE NOT AVAILABLE
						if(!nbsf.fn.isJQ() || !nbsf.fn.isDTP)
							nbsf.c.e("Unable to run jQuery date picker; jQuery and/or jQuery DateTimePicker are not available");
						// ARE AVAILABLE
						else {
							var placeholder = "";
							if(typeof(cItem.placeholder) !== "undefined" && cItem.placeholder != null)
								var placeholder = cItem.placeholder;
							
							var value = "";
							if(typeof(config[cItem.data]) === "string" && config[cItem.data].length > 0)
								value = config[cItem.data];
							else if(typeof(cItem.value) === "string" && cItem.value.length > 0)
								value = cItem.value;
								
							var input = nbsf.fn.node("input",{'type':"text",'data-name':cItem.data,'placeholder':placeholder,'data-type':'date','value':value,'readonly':'readonly'});
							var svg = nbsf.fn.node("svg",{'version':"1.1",'viewbox':"0 0 24 24", 'role':"img",'aria-label':"calendar",'width':"128px",'height':"128px"});
							var path = nbsf.fn.node("path",{'fill':"none",'stroke':"#333",'d':"M2,5 L22,5 L22,22 L2,22 L2,5 Z M18,5 L18,1 M6,5 L6,1 M2,10 L22,10"});
							svg.appendChild(path);
							cWrapper.appendChild(input);
							cWrapper.appendChild(svg);
						}
						break;
					case "datetime":
						// jQuery &&/|| jQuery DateTimePicker
						// ARE NOT AVAILABLE
						if(!nbsf.fn.isJQ() || !nbsf.fn.isDTP)
							nbsf.c.e("Unable to run jQuery datetime picker; jQuery and/or jQuery DateTimePicker are not available");
						
						// jQuery & jQuery UI
						// ARE AVAILABLE
						else {
							var placeholder = "";
							if(typeof(cItem.placeholder) !== "undefined" && cItem.placeholder != null)
								var placeholder = cItem.placeholder;
							
							var value = "";
							if(typeof(config[cItem.data]) === "string" && config[cItem.data].length > 0)
								value = config[cItem.data];
							else if(typeof(cItem.value) === "string" && cItem.value.length > 0)
								value = cItem.value;
								
							var input = nbsf.fn.node("input",{'type':"text",'data-name':cItem.data,'placeholder':placeholder,'data-type':'datetime','value':value,'readonly':'readonly'});
							var svg = nbsf.fn.node("svg",{'version':"1.1",'viewbox':"0 0 24 24", 'role':"img",'aria-label':"calendar",'width':"128px",'height':"128px"});
							var path = nbsf.fn.node("path",{'fill':"none",'stroke':"#333",'d':"M2,5 L22,5 L22,22 L2,22 L2,5 Z M18,5 L18,1 M6,5 L6,1 M2,10 L22,10"});
							svg.appendChild(path);
							cWrapper.appendChild(input);
							cWrapper.appendChild(svg);
						}
						break;
					case "daterange":
						// jQuery &&/|| jQuery DateTimePicker
						// ARE NOT AVAILABLE
						if(!nbsf.fn.isJQ() || !nbsf.fn.isDTP)
							nbsf.c.e("Unable to run jQuery date range picker; jQuery and/or jQuery DateTimePicker are not available");

						// jQuery & jQuery UI
						// ARE AVAILABLE
						else {
							var startdate = nbsf.fn.node("span",{'class':'startdate'});
							var enddate = nbsf.fn.node("span",{'class':'enddate'});
							
							var placeholder = "Start date|End date";
							if(typeof(cItem.placeholder) !== "undefined" && cItem.placeholder != null)
								var placeholder = cItem.placeholder;
							
							var value = "";
							if(typeof(config[cItem.data]) === "string" && config[cItem.data].length > 0)
								value = config[cItem.data];
							else if(typeof(cItem.value) === "string" && cItem.value.length > 0)
								value = cItem.value;
								
							var input = nbsf.fn.node("input",{'type':"text",'data-name':cItem.data,'placeholder':nbsf.ui.translate(config,'Start date'),'data-type':'daterange','value':value,'readonly':'readonly'});
							var svg = nbsf.fn.node("svg",{'version':"1.1",'viewbox':"0 0 24 24", 'role':"img",'aria-label':"calendar",'width':"128px",'height':"128px"});
							var path = nbsf.fn.node("path",{'fill':"none",'stroke':"#333",'d':"M2,5 L22,5 L22,22 L2,22 L2,5 Z M18,5 L18,1 M6,5 L6,1 M2,10 L22,10"});
							var input2 = nbsf.fn.node("input",{'type':"text",'data-name':cItem.data,'placeholder':nbsf.ui.translate(config,'End date'),'data-type':'daterange','value':value,'readonly':'readonly'});
							var svg2 = nbsf.fn.node("svg",{'version':"1.1",'viewbox':"0 0 24 24", 'role':"img",'aria-label':"calendar",'width':"128px",'height':"128px"});
							var path2 = nbsf.fn.node("path",{'fill':"none",'stroke':"#333",'d':"M2,5 L22,5 L22,22 L2,22 L2,5 Z M18,5 L18,1 M6,5 L6,1 M2,10 L22,10"});
							var cfix = nbsf.fn.node("div",{'style':"clear:both"});
							svg.appendChild(path);
							svg2.appendChild(path2);
							startdate.appendChild(input);
							startdate.appendChild(svg);
							enddate.appendChild(input2);
							enddate.appendChild(svg2);
							
							cWrapper.appendChild(startdate);
							cWrapper.appendChild(enddate);
							cWrapper.appendChild(cfix);
						}
						break;
					default:
						nbsf.c.e("Unrecognized configuration item/input provided ("+cItem.type+")");
				}
				
				// ADD INPUT TO ITEM
				cItem.input = input;
				
				// APPEND RESULT TO FIELDSET
				cFieldset.appendChild(cLabel);
				if(cItem.type == "confirm")
					cFieldset.appendChild(label);
			}
			else nbsf.c.i("Column configured incorrectly; Missing header setup");
		},
		navigation: function(config,page) {
			if(typeof(config.pages[page].nav) === "boolean" && config.pages[page].nav) {
				nbsf.c.i("Building form navigation");
				var wrapper = nbsf.fn.node("div",{'class':"buttons"});
				var prev = nbsf.fn.node("div",{'class':"btn back"});
				var next = nbsf.fn.node("div",{'class':"btn continue disabled"});
				var submit = document.createTextNode(nbsf.ui.translate(config,"Submit"));
				var cont = document.createTextNode(nbsf.ui.translate(config,"Continue"));
				var back = document.createTextNode(nbsf.ui.translate(config,"Back"));
				
				// SINGLE PAGE FORM
				// DEFAULTS TO SUBMIT ONLY
				// NO PREVIOUS PAGE NAVIGATION
				// NO NEXT PAGE NAVIGATION
				if(config.pages.length == 1) {
					next.appendChild(submit);
					wrapper.appendChild(next);
					config.dom.appendChild(wrapper);
				}
				// MULTI PAGE FORM
				else {
					// FIRST PAGE
					// NO RETREAT
					// NO SURRENDER
					if(page == 0) {
						next.appendChild(cont);
						wrapper.appendChild(next);
						config.dom.appendChild(wrapper);
					}
					// LAST PAGE
					// DECISIONS
					// DECISIONS
					else if(page == config.pages.length-1) {
						next.appendChild(submit);
						prev.appendChild(back);
						wrapper.appendChild(prev);
						wrapper.appendChild(next);
						config.dom.appendChild(wrapper);
					}
					// EVERYBODY
					// MIX AND MATCH
					// NO WRONG ANSWER
					else {
						next.appendChild(cont);
						prev.appendChild(back);
						wrapper.appendChild(prev);
						wrapper.appendChild(next);
						config.dom.appendChild(wrapper);
					}
				}
				
				if(config.dom.querySelector(".buttons .btn.back") != null)
					config.dom.querySelector(".buttons .btn.back").addEventListener("click", function(e) {
						nbsf.nav.prev(config,page);
					});
				if(config.dom.querySelector(".buttons .btn.continue") != null)
					config.dom.querySelector(".buttons .btn.continue").addEventListener("click", function(e) {
						nbsf.nav.next(config,page);
					});
			}
		},
		defaults: function(config,page) {
			nbsf.c.i("Adding existing values where available");
			let rd = config.dataset; // reference data
			let rdk = Object.keys(rd); // reference data keys
			let pageKeys = nbsf.fn.getAllData(config,page); // keys available in the page configuration
			for(let i=0;i<rdk.length;i++) { // iterate through all available object keys
				if(rd[rdk[i]] != null && pageKeys.indexOf(rdk[i]) > -1) { // key is not null and is matched in page available keys
					// REPEATABLE
					let repeatable = nbsf.fn.findRepeatable(config,page,rdk[i]); // identify if key is a repeatable structure
					if(repeatable) {
						let ds = false; // if repeatable, attempt conversion of string to object to build additional reference data (dataset)
						try {
							ds = JSON.parse(rd[rdk[i]]); // dataset reference data
						}
						catch(err) {
							// expected exception if data value is null or empty
							// otherwise throw error
							if(rd[rdk[i]] != null && rd[rdk[i]].length > 0) {
								nbsf.c.e("Unable to parse JSON for repeatable object.");
								console.error(err);
							}
						}
						if(ds) { // was trycatch successfull
							if(ds.length > 1) // if dataset array is greater than 1, we need to add additional repeated fieldsets in the page
								for(let j=0;j<ds.length-1;j++)
									nbsf.fn.clone(config,config.dom.querySelector("div.row[data-rname='"+rdk[i]+"']"));
							
							var repeaterDomNodes = config.dom.querySelectorAll("div.row[data-rname='"+rdk[i]+"']"); // select all repeatable dom nodes and their structures

							for(let j=0;j<ds.length;j++) { // iterate through each dataset, and assign values to each repeater node data
								let dsk = Object.keys(ds[j]); // dataset reference data keys for current dataset item
								for(let k=0;k<dsk.length;k++) {
									let key = dsk[k];
									let selector = repeaterDomNodes[j].querySelectorAll("*[data-name="+dsk[k]+"]");
									if(selector.length > 0) {
										var type = selector[0].getAttribute("data-type");
										nbsf.builder.population(config,page,selector,type,ds[j],k);
									}
									else nbsf.c.w("Unidentified flying saucer pack");
								}
							}
						}
					}
					else {
						let selector = config.dom.querySelectorAll("*[data-name=" + rdk[i] + "]");
						if(selector.length > 0) {
							var type = selector[0].getAttribute("data-type");
							nbsf.builder.population(config,page,selector,type,rd,i);
						}
						else nbsf.c.w("Unidentified flying saucer");
					}
				} else nbsf.c.i("If you don't eat your meat, you can't have any pudding");
			}
		},
		population: function(config,page,selector,type,dataset,idx) {
			let rd = dataset; // reference data
			let rdk = Object.keys(dataset); // reference data keys
			// SINGLE INPUT PROVISIONING -> TEXT, EMAIL, SELECT
			if("select,text,email,confirm,upload,date,datetime,daterange,toggle,textarea,hidden".indexOf(type) > -1) {
				// CONFIRM CASE
				if(type == "confirm") {
					selector[0].value = rd[rdk[idx]];
					if(config.dom.querySelector("*[data-confirm='" + rdk[idx] + "']") != null)
						config.dom.querySelector("[data-confirm='" + rdk[idx] + "']").value = rd[rdk[idx]];
				}
				// TOGGLE CASE
				else if(type == "toggle") {
					selector[0].value = rd[rdk[idx]];
					if(selector[0].nextSibling != null) {
						var values = selector[0].nextSibling.getAttribute("data-values").split(",");
						if(values.indexOf(rd[rdk[idx]]) == 1)
							selector[0].parentNode.setAttribute("class","active");
					}
				}
				// DATERANGE
				else if(type == "daterange") {
					let value = rd[rdk[idx]];
					if(value.indexOf(";") > -1 && value.split(";").length == 2) {
						selector[0].value = value.split(";")[0];
						selector[1].value = value.split(";")[1];
					}
				}
				// DEFAULT CASE
				else selector[0].value = rd[rdk[idx]];
			}
			// MULTIPLE INPUTS PROVISIONING -> SELECT MULTIPLE / CHECKBOX / RADIO
			else {
				if(type == "agree" && rd[rdk[idx]] == "Y")
					{
						selector[0].setAttribute("checked", true);
						selector[0].checked = true;
					}
				else if(type == "radio")
					{
						config.dom.querySelector("*[data-name=" + rdk[idx] + "][value='" + rd[rdk[idx]] + "']").setAttribute("checked", true);
						config.dom.querySelector("*[data-name=" + rdk[idx] + "][value='" + rd[rdk[idx]] + "']").checked = true;
					}
				else if(type == "select") {
					if(selector[0].querySelector("option[value='" + rd[rdk[idx]] + "']") != null)
						{
							selector[0].querySelector("option[value='" + rd[rdk[idx]] + "']").setAttribute("selected", true);
							selector[0].querySelector("option[value='" + rd[rdk[idx]] + "']").checked = true;
						}
				}
				// RADIO CASE
				else if(type == "radio") {
					for(j=0;j<selector.length;j++)
						if(selector[j].value == rd[rdk[idx]]) {
							selector[j].setAttribute("checked",true);
							selector[j].checked = true;
							break;
						}
				}
				// CHECKBOX
				else if(type == "checkbox") {
					var values = rd[rdk[idx]].split(",");
					for(j=0;j<selector.length;j++) {
						for(k=0;k<values.length;k++) {
							if(selector[j].value == values[k]) {
								selector[j].setAttribute("checked", true);
								selector[j].checked = true;
								break;
							}
						}
					}
				}
				else if (type == "multiselect") {
					var options = selector[0].querySelectorAll("option");
					var values = rd[rdk[idx]].split(",");
					for (j = 0; j < options.length; j++) {
						for (k = 0; k < values.length; k++) {
							if (options[j].getAttribute("value") == values[k]) 
								options[j].setAttribute("selected", true);
						}
					}
				}
				/*else if (type == "date") {
					var cInput =  config.dom.querySelector("*[data-name="+rdk[idx]+"]");
					var cWrapper = cInput.closest(".wrapper");

					var date = new Date();
					var cDay = date.getDate();
					var cMonth = date.getMonth();
					var cYear = date.getFullYear();

					cWrapper.querySelector("select.dd").value = cDay;
					cWrapper.querySelector("select.mm").value = cMonth+1;
					cWrapper.querySelector("select.yyyy").value = cYear;
					
					cInput.value = cDay + "/" + cMonth + "/" +cYear;
				}*/
			}
		},
		interaction: function(config,page) {
			nbsf.c.i("Adding user interaction");
			// ADD TOGGLE INTERACTION
			nbsf.ui.toggle(config);
			// ADD DATEPICKER INTERACTION
			nbsf.ui.date(config,page);
		},
		events: function(config,page) {
			nbsf.c.i("Adding interaction events for validations");
			// ADD VALIDATION INTERACTION
			for(i=0;i<config.pages[page].structure.length;i++) {
				var cStructure = config.pages[page].structure[i];
				for(j=0;j<cStructure.group.length;j++) {
					var filter = true;
					if(typeof(config.pages[page].structure[i].filter) !== "undefined")
						filter = nbsf.fn.filter(config.pages[page].structure[i].filter, config);
					if(typeof(config.pages[page].structure[i].group) !== "undefined" && config.pages[page].structure[i].group.length != 0 && filter) {
						var cGroup = cStructure.group[j];
						for(k=0;k<cGroup.length;k++) {
							var cItem = cGroup[k];
							var address = [page,i,j,k];
							// disabled validation event only on required fields
							// if(cItem.required) {
								// INPUT TYPING VALIDATIONS
								if(nbsf.fn.prp(cItem.typing) && nbsf.fn.typ().indexOf(cItem.type) > -1) {
									if(typeof(cItem.typing) === "string") {
										nbsf.ev.input(config, cItem, page, address);
										nbsf.ev.keystroke(config, cItem, cItem.typing);
									}
									else
										for(l=0;l<cItem.typing.length;l++) {
											nbsf.ev.input(config, cItem, page, address);
											nbsf.ev.keystroke(config, cItem, cItem.typing[l]);
										}
								}
								else {
										if(cItem.type != 'kUpload') {
											cItem.typing = "kpDefault";
											nbsf.ev.input(config, cItem, page, address);
										}
								}
								// SELECT CHANGE VALIDATIONS
								if(typeof(cItem.change) !== "undefined" && cItem.change != false) {
									if(typeof(cItem.values) !== "undefined" && cItem.values != false && cItem.values != null)
										nbsf.ev.change(config, cItem, page, address);
									else
										nbsf.ev.change(config, cItem, page, address);
								}

								// FOCUS IN/OUT VALIDATIONS
								if((typeof(cItem.validation) !== "undefined" && cItem.validation != false) || ["select","multiselect"].indexOf(cItem.type) > -1)
									nbsf.ev.focus(config, cItem, page, address);

								// DATEPICKER MADNESS
								if(typeof(cItem.date) == "date") {
									// TO DO!!!
								}

								// PDF Viewer
								if(cItem.type == "pdf") {
									nbsf.ev.pdf(config, cItem, page, address);
								}

								// UPLOAD
								if(cItem.type == "kUpload") {
									nbsf.ev.upload(config, cItem, page, address);
								}
							// }
						}
					}
				}
			}
			// ADD GLOBAL ON ANY DOCUMENT INTERACTION
			// nbsf.ev.document(config,false);
		}
	},
	data: {
		update: function(config,output) {
			if(typeof(config) !== "object" && typeof(output) !== "object") {
				nbsf.c.e("Missing critical arguements");
				return false;
			}
			else {
				if(typeof(config.dataset) !== "object") config.dataset = {};
				var cPage = config.pages[config.page];
				for(i=0;i<cPage.structure.length;i++) {
					var cStructure = cPage.structure[i];
					if(typeof(cStructure.repeatable) === "string") {
						var repeatableColumn = cStructure.repeatable;
						var repeatableData = [];
						var repeatableCount = document.querySelectorAll(".row[data-donor='"+cStructure.donor+"']").length;
						for(h=0;h<repeatableCount;h++) {
							var repeatableCollection = {};
							var row = config.dom.querySelectorAll(".row[data-donor='"+cStructure.donor+"']");
							for(j=0;j<cStructure.group.length;j++) {
								var cGroup = cStructure.group[j];
								for(k=0;k<cGroup.length;k++) {
									var cInput = cGroup[k];
									repeatableCollection[cInput.data] = nbsf.data.input(config,row[h],cInput);
								}
							}
							repeatableData.push(repeatableCollection);
						}
						config.dataset[repeatableColumn] = JSON.stringify(repeatableData);
					}
					else {
						for(j=0;j<cStructure.group.length;j++) {
							var cGroup = cStructure.group[j];
							for(k=0;k<cGroup.length;k++) {
								var cInput = cGroup[k];
								var row = config.dom.querySelector("[data-name='"+cInput.data+"']").closest(".row");
								config.dataset[cInput.data] = nbsf.data.input(config,row,cInput);
							}
						}
					}
				}
			}
		},
		input: function(config,row,item) {
			var cValue = "";
			var cType = item.type;
			var cData = item.data;
			switch(cType) {
				case 'hidden':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'multiselect':
					var options = Array.from(row.querySelectorAll('[data-name="'+cData+'"] option')).filter(function(el){ return el.selected })
					 
					var values = [];
					for(index=0;index<options.length;index++)
						values.push(options[index].value);
					cValue = values.join(",");
					break;
				case 'select':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'text':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'textarea':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'email':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'password':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'toggle':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'checkbox':
					var options = row.querySelectorAll("[data-name="+cData+"]");
					var values = [];
					options.forEach(function(option) {
						if(option.checked)
							values.push(option.value);
					});
					cValue = values.join(",");
					break;
				case 'radio':
					if(row.querySelector("[data-name="+cData+"]:checked"))
						cValue = row.querySelector("[data-name="+cData+"]:checked").value;
					else cValue = "";
					break;
				case 'agree':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'confirm':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'date':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'datetime':
					cValue = row.querySelector("[data-name="+cData+"]").value;
					break;
				case 'daterange':
					if(row.querySelectorAll("[data-name="+cData+"]")[0].value.length > 0 && row.querySelectorAll("[data-name="+cData+"]")[1].value.length > 0)
						cValue = row.querySelectorAll("[data-name="+cData+"]")[0].value + ';' + row.querySelectorAll("[data-name="+cData+"]")[1].value;
					break;
				case 'pdf':
					if(row.querySelector("[data-name="+cData+"]"))
					 	 cValue = row.querySelector("[data-name="+cData+"]").getAttribute("value");
					else cValue = "N";
					break;
				case 'kUpload':
						var upload = $(row.querySelector("[data-name="+cData+"]")).data("kendoUpload");
						if(upload != undefined)
						{
							files = upload.getFiles();
					  	cValue = files.length > 0 ? files[0].name : "";
						}
					break;
				default:
					cValue = "";
			}
			if(cValue.length == 0)
				cValue = null;
			return cValue;
		}
	},
	ev: {
		keystroke: function(config,item,validation) {
			if(typeof(item.data) === "string") var els = config.dom.querySelectorAll("*[data-name="+item.data+"],*[data-confirm="+item.data+"]");
			else els = item;
			els.forEach(function(el) {
				["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
					el.addEventListener(event,function(e) {
						if(e.isTrusted) {
							if(nbsf.vld[validation](this.value) || this.value.length == 0) {
								this.oldValue = this.value;
								this.oldSelectionStart = this.selectionStart;
								this.oldSelectionEnd = this.selectionEnd;
							} else if(this.hasOwnProperty("oldValue")) {
								this.value = this.oldValue;
								this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
							}
						} else {
							e.preventDefault();
							nbsf.c.e("Keystroke event was not called organically");
						}
					});
				});
			});
		},
		input: function(config,item,page,address) {
			if(typeof(item.data) === "string") var els = config.dom.querySelectorAll("*[data-name="+item.data+"],*[data-confirm="+item.data+"]");
			else var els = item;
			/*els.forEach(function(el) {
				nbsf.ev.keystroke(el, function(value) {
					return nbsf.vld[item.typing](value);
				});
			});*/
			// REMOVED MOUSEDOWN & MOUSEUP
			// TO PREVENT HIGHLIGHT
			// WHEN USER SELECTS INPUT
			// FOR THE FIRST TIME
			// REMOVED KEYUP KEYDOWN
			// TO IMPROVE PERFORMANCE
			// AND EXECUTE LESS GLOBAL VALIDATIONS
			["input", "select", "contextmenu", "drop","change"].forEach(function(event) {
				els.forEach(function(el) {
					el.addEventListener(event,function(e) {
						// add local event validation
						if(e.target.type == "checkbox" || e.target.type == "radio")
							nbsf.ev.global(config,true,e.target,address);
						else
							nbsf.ev.global(config,true,e.target,address);
						// adding global event trigger as well
						nbsf.ev.global(config,false);
					});
					// CONFIRM EVENT ADDED
					el.setAttribute("data-ev-input","true");
				});
			});

		},
		change: function(config,item,page,address) {
			if(typeof(item.data) === "string")
				var els = config.dom.querySelectorAll("*[data-name="+item.data+"],*[data-confirm="+item.data+"]");
			else
				var els = item;
			for(var el=0;el<els.length;el++) {
				els[el].addEventListener("change",function(e) {
					if(e.isTrusted)
					{	
					  nbsf.ev.global(config,true,e.target,address);
					  if(typeof(item.change) === "function")
						item.change();
					}
					else {
						e.preventDefault();
						nbsf.c.e("Change was not performed organically. Operation will not be taken into account");
					}
				});
				// CONFIRM EVENT ADDED
				els[el].setAttribute("data-ev-change","true");
			}
		},
		focus: function(config,item,page,address) {
			if(typeof(item.data) === "string")
				var els = config.dom.querySelectorAll("*[data-name="+item.data+"],*[data-confirm="+item.data+"]");
			else
				var els = item;
			els.forEach(function(el) {
				// REMOVED FOCUS IN
				// TO PREVENT HIGHLIGHT
				// WHEN USER SELECTS INPUT
				// FOR THE FIRST TIME
				["focusout"].forEach(function(event) {
					el.addEventListener(event,function(e) {
						if(e.isTrusted)
							nbsf.ev.global(config,true,e.target,address);
						else {
							e.preventDefault();
							nbsf.c.e("Focus was not performed organically. Operation will not be taken into account");
						}
					});
				});
				// CONFIRM EVENT ADDED
				el.setAttribute("data-ev-focusout","true");
			});
		},
		pdf: function(config,item,page,address) {
			if(typeof(item.data) === "string")
				var els = config.dom.querySelectorAll("*[data-name="+item.data+"],*[data-confirm="+item.data+"]");
			else
				var els = item;
			for(var el=0;el<els.length;el++) {
				//listening for custom pdf event
				els[el].addEventListener("pdf_viewed",function(e) {
					nbsf.ev.global(config,true,e.target,address);
				});
				// CONFIRM EVENT ADDED
				els[el].setAttribute("data-ev-pdf","true");
			}
    	},
		upload:function(config,item,page,address) {
			var el = config.dom.querySelector("[data-name="+item.data+"]");
			if(el != undefined)
			{
					var kendoUpload = $(el).data("kendoUpload");
					if(kendoUpload != undefined)
					{
					if(!!item.preventAutoUpload) {
					  //when the file is successfully uploaded to the server
					  ["select"].forEach(function(event) {
						kendoUpload.bind(event, function(e) {
						  e.sender.element[0].setAttribute("uploaded", true);
						  nbsf.ev.global(config,true,e.sender.element[0],address);
						});
					  });
					}
					else {
					  //when the file is successfully uploaded to the server
					  ["success"].forEach(function(event) {
						kendoUpload.bind(event, function(e) {
						  e.sender.element.closest(".kUpload")[0].querySelector(".k-icon").classList.remove("k-i-loading")
						  e.sender.element[0].setAttribute("uploaded", true);
						  nbsf.ev.global(config,true,e.sender.element[0],address);
						});
					  });
			  
					  //when previously uploaded file is removed
					  ["select", "cancel", "remove"].forEach(function(event) {
						kendoUpload.bind(event, function(e) {
						  e.sender.element[0].setAttribute("uploaded", false);
						  nbsf.ev.global(config,false,e.sender.element[0],address);
						});
					  });
					}

						// CONFIRM EVENT ADDED
						el.setAttribute("data-ev-upload","true");
					}
			}
		},
 		global: function(config,highlight,node,address,cb) {
			nbsf.c.i("Running global validation");
			if(typeof(node) === "object") {
				let page = config.pages[address[0]];
				let structure = page.structure[address[1]];
				let group = structure.group[address[2]];
				let item = group[address[3]];
			} else nbsf.c.i("Running independent global validation");

			// DEFAULT OUTPUT
			let output = {
				total: {
					fail: 0,
					pass: 0,
					optional: 0,
				},
				input: {
					fail: [],
					pass: [],
					optional: [],
					custom: {
						fail: [],
						pass: []
					}
				},
				_total: function() {
					output.total.fail = output.input.fail.length + output.input.custom.fail.length;
					output.total.pass = output.input.pass.length + output.input.custom.pass.length;
					output.total.optional = output.input.optional.length;
				}
			}
			
			// CURRENT PAGE
			let cPage = config.pages[config.page];
			
			// ITERATE THROUGH CONFIG PAGE ITEMS
			// IDENTIFY MATCHES IN DOM ARRAY
			// VALIDATE AGAINST CONFIGURATION
			// PUSH TO DETAILED OUTPUT
			for(i=0;i<cPage.structure.length;i++) { // iterate through all structures on the current page
				var cStructure = cPage.structure[i]; // current structure
				// IF SECTION IS CONDITIONAL
				// CHECK IF CONDITION IS MET
				// OTHERWISE SKIP VALIDATION
				var filter = true;
				if((typeof(cStructure.filter) === "object") ||
                         (typeof(cStructure.filter) === "function"))
					filter = nbsf.fn.filter(cStructure.filter, config); // is current structure available for usage; if not, filter returns false
				if(filter) {
					for(j=0;j<cStructure.group.length;j++) {
						var cGroup = cStructure.group[j]; // current group
						for(k=0;k<cGroup.length;k++) {
							if(typeof(cGroup[k].required) === "boolean" && cGroup[k].required) { // is current input required?
								var cItem = cStructure.group[j][k];
								var cAddress = [config.page,i,j,k];
								var cWrapper = config.dom.querySelectorAll("label.wrapper[data-address='"+cAddress.join(",")+"']"); // select matching parent labels of input by address
								cWrapper.forEach(function(wrapper) {
									var els = wrapper.querySelectorAll("*[data-name],*[data-confirm]");
									if(nbsf.fn.health(config,els,cItem) == 0) output.input.pass.push(wrapper);
									else output.input.fail.push(wrapper);
								});
							}
							else output.input.optional.push(cWrapper);
						}
					}
				}
			}
			
			// IF PAGE CONFIGURATION
			// VALIDATIONS ARE ENABLED
			// GO THROUGH ITS OPERATION
			// AND PROCESS ITS RESPONSE
			if(typeof(cPage.validation) === "function") {
				nbsf.c.i("Running page level custom validations");
				// EXPECTED RESPONSE STRUCTURE
				// OBJECT WITH NODE WRAPPER ARRAYS
				// {fail:[NodeList...,NodeList...],pass:[NodeList...,NodeList...]}
				try {
					var configurationValidations = cPage.validation();
					if(typeof(configurationValidations.fail) !== "object" || typeof(configurationValidations.pass) !== "object")
						nbsf.c.e("Custom configuration validation for the page are set incorrectly");
					else
						output.input.custom = configurationValidations;
				} catch(err) {
					nbsf.c.e("Failed running page level custom validations");
					nbsf.c.e(err);
				}
			}

			// OPTIONAL INPUTS ON PAGE
			if(output.input.optional.length > 0) {
				nbsf.c.i("Found optional fields that are outside of the default validation scope:");
			}
			
			// UPDATE TOTAL
			output._total();
			
			// IF HIFHLIGHT IS ENABLED
			// WHEN CALLING GLOBAL VALIDATION
			// MANAGE EITHER SPECIFIC FORM PAGE
			// INPUT VALIDATION OR
			// UPDATE HIGHLIGHT FOR ALL PAGE INPUTS
			if(typeof(highlight) === "boolean" && highlight) {
				// IF GLOBAL IS CALLED
				// AS AN EVENT FIRED BY
				// A SPECIFIC FORM INPUT
				if(typeof(node) === "object") {
					// SINGLE HIGHLIGHT
					// FIND WRAPPER
					var target = node.closest("label.wrapper");
					var targetNodes = target.querySelectorAll("*[data-name],*[data-confirm]");
					var targetAddress = target.getAttribute("data-address").split(",");
					var targetConfig = config.pages[targetAddress[0]].structure[targetAddress[1]].group[targetAddress[2]][targetAddress[3]];
					if(
						// configuration and dom health check
						nbsf.fn.health(config,targetNodes,targetConfig) > 0 &&
						// skip empty optional validation
						(
							typeof(targetConfig.required) === 'boolean' &&
							(
								targetConfig.required ||
								(targetConfig.type == 'select' && targetConfig.selectedIndex > 0) ||
								(targetConfig.type == 'confirm' && (targetNodes[0].value.length > 0 || targetNodes[1].value.length > 0)) ||
								(targetConfig.type != 'select' && targetNodes[0].value.length > 0)
							)
						)
					) {
						target.setAttribute("data-state","error");
						if(targetConfig.type == "confirm") {
							if(node.getAttribute("data-confirm") == null)
								target.nextSibling.setAttribute("data-state","error");
							else
								target.previousSibling.setAttribute("data-state","error");
						}
					}
					else {
						target.setAttribute("data-state","");
						if(targetConfig.type == "confirm") {
							if(node.getAttribute("data-confirm") == null)
								target.nextSibling.setAttribute("data-state","");
							else
								target.previousSibling.setAttribute("data-state","");
						}
					}
					
					// IF USER PROVIDED INPTU HAS FAILED
					// THROUGH CONFIGURATION VALIDATION
					if(output.input.custom.fail.length > 0)
						output.input.custom.fail.forEach(function(wrapper){
							if(wrapper == target)
								target.setAttribute("data-state","error");
						});
					// SUPERSET IF PART OF
					// CUSTOM PAGE VALIDATIONS
				}
				// IF GLOBAL IS CALLED
				// AS AN EVENT OUTSIDE OF
				// A SPECIFIC FORM INPUT
				// THE GOAL IS TO UPDATE HIGHLIGHT STATES
				// FOR ALL FORM PAGE INPUTS
				else {
					for(i=0;i<output.input.pass.length;i++)
						output.input.pass.forEach(function(wrapper){
							wrapper.setAttribute("data-state","");
						});
					for(i=0;i<output.input.fail.length;i++)
						output.input.fail.forEach(function(wrapper){
							wrapper.setAttribute("data-state","error");
						});
				}
			}
			
			// UPDATE REFERENCE DATA
			if(output.total.fail == 0)
				nbsf.data.update(config,output);
			
			// MANAGE PAGINATION
			// IS PAGINATION ENABLED?
			if(typeof(cPage.nav) === "boolean" && cPage.nav && config.dom.querySelector(".buttons .btn.continue") != null) {
				if(output.total.fail > 0)
					config.dom.querySelector(".buttons .btn.continue").setAttribute("class","btn continue disabled");
				else
					config.dom.querySelector(".buttons .btn.continue").setAttribute("class","btn continue");
			} else nbsf.c.i("Navigation is disabled");

			// IF CALLBACK PROVIDED
			// RETURN CALLBACK FUNCTION
			// WITH PROCESSED RESULT
			// OTHERWISE JUST RETURN
			// THE PROCESSED RESULTS
			// AS ARGUMENT
			if(typeof(cb) === "function")
				cb(config,output);

			nbsf.c.i("Global event validation ran successfully");
			nbsf.c.i(output);
			return output;
		},
		document: function(config,highlight) {
			/*["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focus", "focusout", "change"].forEach(function(event) {
				document.addEventListener(event, function(e) {
					nbsf.ev.global(config,false);
				});
			});*/
		}
	},
	ui: {
		translate: function(config,key,lang) {
			try {
				if(typeof(lang) === "undefined") lang = config.lang;
				if(typeof(lang) === "undefined" || lang == null) lang = "en_US";
				if(typeof(config.reference.languages[key]) !== "undefined") {
					if(typeof(config.reference.languages[key][lang]) !== "undefined") return config.reference.languages[key][lang];
					else if(typeof(config.reference.languages[key]["en_US"]) !== "undefined") return config.reference.languages[key]["en_US"];
				} else if(typeof(key) === "string") {
					return key;
				} else {
					return "Error: MLK";
				}
			} catch(err) {
				return key;
			}
		},
		toggle: function(config) {
			if(config.dom.querySelectorAll("label.wrapper.toggle .toggle").length > 0) {
				var toggles = config.dom.querySelectorAll("label.wrapper.toggle .toggle")
				for (i = 0; i < toggles.length; i++) {
					toggles[i].addEventListener("click", function(e) {
						var parent;
						if (e.target.nodeName.toLowerCase() == "span")
							parent = e.target.parentNode.parentNode.parentNode.parentNode;
						else
							parent = e.target.parentNode.parentNode.parentNode;

						var values = parent.querySelector(".fmmcosmin .toggle").getAttribute("data-values").split(",");

						var target = parent.querySelector(".fmmcosmin label");
						if (target.getAttribute("class") == null || target.getAttribute("class") == "") {
							target.setAttribute("class", "active");
							parent.querySelector(".fmmcosmin input").value = values[1];
						} else {
							target.setAttribute("class", "");
							parent.querySelector(".fmmcosmin input").value = values[0];
						}
						
						// run gloal event
						nbsf.ev.global(config,false);
					});
				}
			}
		},
		date: function(config,page) {
			var structure = config.pages[page].structure;
			for(i=0;i<structure.length;i++) {
				for(j=0;j<structure[i].group.length;j++) {
					for(k=0;k<structure[i].group[j].length;k++) {
						var cItem = structure[i].group[j][k];
						if(["date","datetime","daterange"].indexOf(cItem.type) > -1) {
							// JQUERY
							if(nbsf.fn.isJQ && nbsf.fn.isDTP) {
								if(cItem.type == "date")
									$('.wrapper.date input[data-name='+cItem.data+']').datetimepicker(cItem.dtp);
								else if(cItem.type == "datetime")
									$('.wrapper.datetime input[data-name='+cItem.data+']').datetimepicker(cItem.dtp);
								else if(cItem.type == "daterange") {
									cItem.dtpStart.onShow = function(ct) {
										this.setOptions({
											maxDate: $('.wrapper.daterange .enddate input[data-name='+cItem.data+']').val() ? $('.wrapper.daterange .enddate input[data-name='+cItem.data+']').val():false
										});
									}
									cItem.dtpEnd.onShow = function(ct) {
										this.setOptions({
											minDate: $('.wrapper.daterange .startdate input[data-name='+cItem.data+']').val() ? $('.wrapper.daterange .startdate input[data-name='+cItem.data+']').val():false
										});
									}
									$('.wrapper.daterange .startdate input[data-name='+cItem.data+']').datetimepicker(cItem.dtpStart);
									$('.wrapper.daterange .enddate input[data-name='+cItem.data+']').datetimepicker(cItem.dtpEnd);
								}
							}
							// !JQUERY
							else {
								// todo
								// throw error; missing dependencies
							}
						}
					}
				}
			}
		},
		highlight: function(node,state) {
			if(state) var state = "error";
			else var state = "";
			
			if(typeof(node) === "string") {
				if(document.querySelector("*[data-name="+node+"]") != null)
					document.querySelector("*[data-name="+node+"]").closest("label.wrapper").setAttribute("data-state",state);
				if(document.querySelector("*[data-confirm="+node+"]") != null)
					document.querySelector("*[data-confirm="+node+"]").closest("label.wrapper").setAttribute("data-state",state);
			}
			else if(typeof(node) === "object") {
				node.closest("label.wrapper").setAttribute("data-state",state);
			}
		},
	  	ignoreValidation: function(input,state) {
			input.setAttribute("ignore-validation", state);
		  	var required = input.closest(".wrapper").querySelector(".required");
			if(required)
			  required.hidden = state;
		}
	},
	nav: {
		next: function(config,page) {
			if(nbsf.ev.global(config,true).total.fail > 0)
				nbsf.c.w("Unable to move to next page, errors on current page");
			else {
				if(config.page == config.pages.length-1 && typeof(config.onSubmit) === "function"){
					config.onSubmit(config.page,config.dataset);
				}
				else if(typeof(config.onNext) === "function")
					config.onNext(config.page,config.page+1,config.dataset);
				else
					nbsf.init(config,config.page+1);
			}
		},
		prev: function(config,page) {
			if(typeof(config.onPrev) === "function")
				config.onPrev(config.page,config.page-1,config.dataset);
			else
				nbsf.init(config,config.page-1);
		}
	},
	fn: {
		closest: function() {
			// IF MATCHES IS UNSUPPORTED,
			// REDEFINE MATCHES AS BROWSER SPECIFIC MATCHS
			if(!Element.prototype.matches)
				Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
			
			// IF CLOSEST DOES NOT EXIST
			// REDEFINE CLOSEST AS MATCHES METHOD
			if(!Element.prototype.closest) {
				Element.prototype.closest = function(s) {
					var el = this;
					do {
						if(Element.prototype.matches.call(el, s))
							return el;
						el = el.parentElement || el.parentNode;
					} while(el !== null && el.nodeType === 1);
					return null;
				};
			}
		},
		remove: function() {
			if(typeof(document.querySelector("body").remove) !== "function")
				(function (arr) {
				  arr.forEach(function (item) {
					if (item.hasOwnProperty('remove')) {
					  return;
					}
					Object.defineProperty(item, 'remove', {
					  configurable: true,
					  enumerable: true,
					  writable: true,
					  value: function remove() {
						this.parentNode.removeChild(this);
					  }
					});
				  });
				})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
		},
		filter: function(filter) {
			console.log("Filter processing...");
			function process(filter) {
				var global = 0;
				// BASIC FILTER PROCESSING
				function basic(filter) {
					var local = 0;
					if(typeof(filter.column) !== "string" || typeof(filter.value) === "undefined" || ["eq","neq","contains","notcontains"].indexOf(filter.operator) == -1) {
						local++;
						return local;
					}
					else {
						var data = filter.column;
						if(typeof(config.reference.app[data]) !== "undefined") data = config.reference.app[data];
						switch(filter.operator) {
							case "eq": if(data != filter.value) local++; break;
							case "neq": if(data == filter.value) local++; break;
							case "contains": if(data.indexOf(filter.value) == -1) local++; break;
							case "notcontains": if(data.indexOf(filter.value) > -1) local++; break;
						}
						return local;
					}
				}
				// LOGIC FILTER PROCESSING
				function logic(filter) {
					function arrayClean(arr) {
						var newArr = [];
						for(i=0;i<arr.length;i++)
							if(newArr.indexOf(arr[i]) == -1)
								newArr.push(arr[i]);
						return newArr;
					}
					var local = [];
					if(filter.filters.length == 0) return 1;
					else {
						for(i=0;i<filter.filters.length;i++)
							local.push(basic(filter.filters[i]));
						local = arrayClean(local);
						switch(filter.logic) {
							case "and": if(local.length == 1 && local[0] == 0) return 0; break;
							case "or": if(local.indexOf(0) > -1) return 0; break;
						}
					}
				}

				if(typeof(filter.logic) !== "string") global = global + basic(filter);
				else global = global + logic(filter);
				return global;
			}
			try {
				if(typeof(filter) !== "object") return false;
				else {
					if(process(filter) != 0) return false;
					else return true;
				}
			}
			catch(err) {
				console.error("Filter error: "+err);
				return false;
			}
		},
		escape: function() {
			return "!A";
		},
		prp: function(p) {
			// CHECK IF JAVASCRIPT OBJECT IS DEFINED / TRUE
			if(typeof(p) === "undefined" || p == null || !p) return false;
			else return true;
		},
		node: function(type,attr,disabled) {
			if(["svg","path"].indexOf(type) == -1)
				var node = document.createElement(type);
			else
				var node = document.createElementNS('http://www.w3.org/2000/svg',type)
			if(typeof(attr) === "object")
				for(obji=0;obji<Object.keys(attr).length;obji++)
					node.setAttribute(Object.keys(attr)[obji],attr[Object.keys(attr)[obji]]);

			if(disabled)
				node.setAttribute("disabled", "");
			return node;
				
		},
		clone: function(config,donor) {
			var donorId = donor.getAttribute("data-donor");
			
			// CHECK LIMIT
			if(donor.getAttribute("data-rlimit") != null && config.dom.querySelectorAll(".row[data-donor='"+donorId+"']").length > parseInt(donor.getAttribute("data-rlimit"))-1) {
				nbsf.c.w("Max cloning limit reached");
				return false;
			}

			// CLONE
			var clone = donor.cloneNode(true);
			// SET CLONE ATTRIBUTE
			clone.setAttribute("data-clone",clone.getAttribute("data-donor"));
			// REMOVE HEADING IF CLONE OF PATIENT 0
			if(clone.querySelector(".heading") != null)
				clone.querySelector(".heading").remove();
			// CLEAN INPUTS
			var inputs = clone.querySelectorAll("input[data-name],select[data-name],textarea[data-name]");
			for(let i=0;i<inputs.length;i++) {
				if(inputs[i].type == "radio" || inputs[i].type == "checkbox")
					inputs[i].checked = false;
				else if(inputs[i].tagName.toLowerCase() == "select")
					inputs[i].selectedIndex = 0;
				else
					inputs[i].value = "";
			}
			var wrappers = clone.querySelectorAll("label.wrapper");
			wrappers.forEach(function(wrapper){
				wrapper.setAttribute("data-state","");
			});
			// ADD NODE REMOVER
			if(clone.querySelector(".repeater .rem") == null) {
				var repeater = clone.querySelector(".repeater");
				var remover = nbsf.fn.node('svg',{'class':'rem','version':'1.1','viewbox':'0 0 24 24','role':'img','aria-label':'subtract circle','width':'24px','height':'24px'});
				var removerPath = nbsf.fn.node('path',{'fill':'none','stroke':'#666','stroke-width':'2','d':'M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M6,12 L18,12'});
				remover.appendChild(removerPath);
				repeater.appendChild(remover);
			}
			// ADD EV LISTENER TO ADD / REMOVE FROM CLONE
			clone.querySelector(".repeater .add").addEventListener("click",function(e) {
				nbsf.fn.clone(config,e.target.closest(".row"));
			});
			clone.querySelector(".repeater .rem").addEventListener("click",function(e) {
				var targetRow = e.target.closest(".row");
				if(typeof(config.onDeClone) === "function")
					config.onDeClone(config.dom.querySelector(".row[data-donor='"+targetRow.getAttribute('data-clone')+"']"),targetRow)
				targetRow.remove();
			});
			// ADD VALIDATION EVENT LISTENERS
			var labels = clone.querySelectorAll("label.wrapper[data-address]");
			for(let i=0;i<labels.length;i++) {
				var address = labels[i].getAttribute("data-address");
				if(address != null) {
					address = address.split(",");
					var page = config.pages[address[0]];
					var item = page.structure[address[1]].group[address[2]][address[3]];
					var nodes = labels[i].querySelectorAll("*[data-name="+item.data+"],*[data-confirm="+item.data+"]");
					// INPUT TYPING VALIDATIONS
					if(nbsf.fn.prp(item.typing) && nbsf.fn.typ().indexOf(item.type) > -1) {
						if(typeof(item.typing) === "string") {
							nbsf.ev.input(config, nodes, page, address);
							nbsf.ev.keystroke(config, nodes, item.typing);
						}
						else
							for(l=0;l<item.typing.length;l++) {
								nbsf.ev.input(config, nodes, page, address);
								nbsf.ev.keystroke(config, nodes, item.typing[l]);
							}
					} else {
						item.typing = "kpDefault";
						nbsf.ev.input(config, nodes, page, address);
					}
					// SELECT CHANGE VALIDATIONS
					if(typeof(item.change) !== "undefined" && item.change != false) {
						if(typeof(item.values) !== "undefined" && item.values != false && item.values != null)
							nbsf.ev.change(config, nodes, page, address);
						else
							nbsf.ev.change(config, nodes, page, address);
					}

					// FOCUS IN/OUT VALIDATIONS
					if((typeof(item.validation) !== "undefined" && item.validation != false) || ["select","multiselect"].indexOf(item.type) > -1)
						nbsf.ev.focus(config, nodes, page, address);
						
					// DATEPICKER MADNESS
					if(typeof(item.date) == "date") {
						// TO DO!!!
					}
				}
			}
			
			// ADD DATE EVENT LISTENERS
			if(nbsf.fn.isJQ && nbsf.fn.isDTP) {
				var dateArray = clone.querySelectorAll(".wrapper.date,.wrapper.datetime,.wrapper.daterange");
				dateArray.forEach(function(node) {
					var address = node.getAttribute("data-address").split(",");
					var page = config.pages[address[0]];
					var item = page.structure[address[1]].group[address[2]][address[3]];
					var type = item.type;
					if(["date","datetime"].indexOf(type) > -1)
						$(node).find("input").datetimepicker(item.dtp);
					else if(type == "daterange") {
						item.dtpStart.onShow = function(ct) {
							this.setOptions({
								maxDate: $(node).find(".enddate input").val() ? $(node).find(".enddate input").val():false
							});
						}
						item.dtpEnd.onShow = function(ct) {
							this.setOptions({
								minDate: $(node).find(".startdate input").val() ? $(node).find(".startdate input").val():false
							});
						}
						$(node).find(".startdate input").datetimepicker(cItem.dtpStart);
						$(node).find(".enddate input").datetimepicker(cItem.dtpEnd);
					}
				});
			}
			else nbsf.c.w("Missing jQuery and/or jQuery DateTimePicker to load date selection behaviour");
			
			// ON CLONE
			if(typeof(config.onClone) === "function")
				config.onClone(donor,clone);
			// ADD CLONE TO PAGE
			// insert before current node
			if(donor.getAttribute("data-rdirection") != null && donor.getAttribute("data-rdirection") == "top")
				return donor.parentNode.insertBefore(clone,donor);
			// default insert after current node
			return donor.parentNode.insertBefore(clone,donor.nextSibling);
		},
		health: function(config,el,item) {
			// FUNCTION TO CHECK SPECIFIC INPUT
			// COMPARING ITS CURRENT VALUE TO
			// VALIDATION CONFIGURATION
			// WITHIN THE CONFIG FILE
			let message = "Checking health of "+item.data+"... ";
			
			var count = 0;
	  
		  	if(el[0].getAttribute("ignore-validation") == "true")
				return 0;

			// TYPE AGREE
			// GENERATES A SINGLE CHECKBOX WITH TEXT
			// AGREE IS VALID AS LONG AS
			// THE CHECKBOX IS CHECKED AND VALUE IS Y
			if(item.type == "agree")
				if(item.required == true && (el.length != 1 || typeof(el[0].value) == "undefined" || el[0].value != item.values[0] || el[0].checked == false))
					count++;

			// TYPE CONFIRM
			// GENERATES TWO CLONED INPUTS
			// INFORMATION SHOULD MATCH BETWEEN FIELDS
			// INFORMATION IN FIELD AND VALIDATION CONFIG
			// IS CHECKED IN THE INPUT TYPE TEXT LOGIC
			if(item.type == "confirm") {
				if(el[0].getAttribute("data-confirm") == null) {
					var elConfirm = el[0].closest("label").nextSibling.querySelector("input");
					if(el[0].value != elConfirm.value) count++;
				}
				else {
					var elConfirm = el[0].closest("label").previousSibling.querySelector("input");
					if(el[0].value != elConfirm.value) count++;
				}
			}

			// TYPE SELECT
			// MULTIPLE OPTIONS BUT SINGLE SELECTION
			// VALIDATION SHOULD ALWAYS BE IN ARRAY
			// SELECTED VALUE SHOULD BE IN PROVIDED VALUES ARRAY
			if(item.type == "select") {
				try {
					// IF VALUES KEY IS FUNCTION
					if(typeof(item.values) === "function" && item.values().indexOf(el[0].value) == -1) count++;
					// IF VALUES KEY IS ARRAY
					else if(typeof(item.values) === "object" && item.values.indexOf(el[0].value) == -1) count++;
				} catch(err) {
					nbsf.c.e("Required SELECT type input validation failed.");
					count++;
				}
			}
			
			// TYPE RADIO
			if(item.type == "radio") {
				try {
					var selected = config.dom.querySelector("input[data-name="+item.data+"]:checked");
					if(selected == null) count++;
					else if(typeof(item.values) === "function" && item.values().indexOf(selected.value) == -1) count++;
					else if(typeof(item.values) === "object" && item.values.indexOf(selected.value) == -1) count++;
				}
				catch(err) {
					nbsf.c.e("Required RADIO type input validation failed");
					count++;
				}
			}
			
			// TYPE CHECKBOX
			// FIRST CHECK IF AT LEAST
			// ONE ITEM IS SELECTED
			// THEN CHECK IF SELECTED ITEMS
			// AR PART OF PROVIDED ARRAY
			if(item.type == "checkbox") {
				for(index=0;index<el.length;index++) {
					if(el[index].checked) break;
					if(index == el.length-1) count++;
				}
				el.forEach(function(option) {
					if(typeof(item.values) === "function" && item.values().indexOf(option.value) == -1) count++;
					else if(typeof(item.values) === "object" && item.values.indexOf(option.value) == -1) count++;
				});
			}
			
			// TYPE MULTISELECT
			// MULTIPLE OPTIONS AND MULTIPLE SELECTIONS
			// VALIDATION SHOULD ALWAYS BE IN ARRAY
			// SELECTED VALUE SHOULD BE IN PROVIDED VALUES ARRAY
			if(item.type == "multiselect") {
				var options = el[0].querySelectorAll("option:checked");
				if(options.length == 0) count++;
				else {
					options.forEach(function(option) {
						if(typeof(item.values) === "function" && item.values().indexOf(option.value) == -1) count++;
						else if(typeof(item.values) === "object" && item.values.indexOf(option.value) == -1) count++;
					});
				}
			}

			// TYPE EMAIL
			// INPUT TYPE TEXT EXPECTING AN EMAIL INPUT
			// USING NBSF EMAIL VALIDATION BY DEFAULT
			if(item.type == "email")
				if(!nbsf.vld.isEmail(el[0].value))
					count++
			
			// TYPE PASSWORD
			// INPUT TYPE PASSWORD EXPECTING AN PASSWORD INPUT
			// USING NBSF PASSWORD VALIDATION BY DEFAULT
			if(item.type == "password")
				if(!nbsf.vld.isPassword(el[0].value))
					count++
			
			// TYPE TEXT / TEXTAREA / DUPLICATE
			// CAN SUPPORT CUSTOM INPUT VALIDATION
			if(item.type == "text" || item.type == "confirm" || item.type == "textarea") {
				var cValue = el[0].value;
				// BLANK INPUT NOT ALLOWED FOR REQUIRED FIELDS
				if(cValue.replace(/\s/g,'').length == 0) count++;
				else {
					for(l=0;l<item.validation.length;l++) {
						// SIMPLE VALIDATION
						if(item.validation[l].indexOf("|") == -1 && nbsf.vld[item.validation[l]](cValue) == false)
							count++;
						// COMPLEX VALIDATION
						// VALIDATION NAME AND ARGUEMENT
						if(item.validation[l].indexOf("|") > -1) {
							let fn = item.validation[l].split("|")[0];
							let ref = item.validation[l].split("|")[1];
							if(fn.toLowerCase().indexOf('val') > -1 && nbsf.vld[fn](parseInt(cValue),parseInt(ref)) == false)
								count++
							else if(fn.toLowerCase().indexOf('len') > -1 && nbsf.vld[fn](cValue,ref) == false)
								count++
						}
					}
				}
			}
			
			// TYPE DUPLICATE
			// EXPECTS CLONE INPUT TO HOLD THE SAME VALUE
			// AS DONOR INPUT
			if(item.type == "duplicate")
				if(el[0].value != config.dom.querySelector("*[data-confirm="+item.data+"]").value) count++

			// TYPE UPLOAD
			// RFB IFRAME WINDOW WITH UPLOAD FIELDS
			if(item.type == "upload") {
				if(
					el[0].contentWindow.config.dom.querySelectorAll("li.k-file.k-file-success").length == 0 ||
					getComputedStyle(el[0].contentWindow.config.dom.querySelector('.k-file-size'), ':before').getPropertyValue('content').indexOf("100%") == -1 ||
					el[0].contentWindow.config.dom.querySelector("input[type=hidden][name="+item.data+"]").value.length == 0
				) {
					count++;
					config.reference.app[item.data] = null;
				}
				else {
					config.reference.app[item.data] = el[0].contentWindow.config.dom.querySelector("input[type=hidden][name="+item.data+"]").value;
				}
			}


			// TYPE KENDO UPLOAD
			if(item.type == "kUpload") {
				if(el[el.length-1].getAttribute("uploaded") != "true")
					count++;
			}

			//TYPE PDF
			if(item.type == "pdf") {
				if(el.length > 0 && el[0].getAttribute("value") != "Y")
					count++;
			}


			if(count == 0)
				nbsf.c.i(message + item.data+" is in good health");
			else
				nbsf.c.i(message + item.data+" is in bad health");

			// RETURN COUNT
			// COUNT IS 0 BY DEFAULT
			// FOR EVERY ISSUE Found
			// COUNT IS INCRMENTED
			return count;
		},
		dbg: function() {
			// RETURN WHETHER APPLICATION IS SET TO DEBUG MODE
			var url = window.location.href;
			if(url.indexOf("debug=true") > -1 || url.indexOf("debug=1") > -1) return true;
			else return false;
		},
		typ: function() {
			// RETURN ARRAY OF INPUTS ENABLED FOR ON INPUT EVENT
			return ["text","email","textarea","duplicate","password"];
		},
		isJQ: function() {
			if(typeof($) === "function" && typeof($()) === "object") return true;
			else return false
		},
		isDTP: function() {
			if(nbsf.fn.isJQ() && typeof($().datetimepicker) === "function") return true;
			else return false;
		},
		isKendo: function() {
			if(typeof(kendo) === "undefined") return false;
			else return true;
		},
		isPdf: function() {
			if(typeof(pdfjsLib) === "undefined") return false;
			else return true;
		},
		random: function(min,max) {
			return Math.round(Math.random() * (max - min) + min);
		},
		locale: function(config) {
			if(typeof(config.locale) !== "undefined" && config.locale != "en_US") {
				let language = config.locale.split("_")[0].toLowerCase();
				if(["zh","ja","ko","in","ru","tr","de","fr","es","pt","it"].indexOf(language) == -1)
					language = "en";
				let country = config.locale.split("_")[1];
				
				// SET DTP LANGUAGE
				if(nbsf.fn.isDTP())
					$.datetimepicker.setLocale(language);
			}
		},
		translate: function(key,locale,reference) {
			if(typeof(reference) !== "undefined") {
				try {
					return reference[locale][key];
				} catch(err) {
					return key;
				}
			}
			else {
				if(typeof(nbsf.localization[locale]) !== "undefined" && typeof(nbsf.localization[locale][key]) === "string")
					return nbsf.localization[locale][key];
				else if(typeof(nbsf.localization['en_US'][key]) === "string")
					return nbsf.localization['en_US'][key];
				else
					return key;
			}
		},
		
		// FIND FROM DATA NAME
		// IF IT IS CONFIGURED AS REPEATABLE
		findRepeatable: function(config,page,data) {
			let target = config.pages[page];
			for(let i=0;i<target.structure.length;i++)
				if(typeof(target.structure[i].repeatable) == "string" && target.structure[i].repeatable == data)
					return target.structure[i];
			return false;
		},
		// IDENTIFY PARENT STRUCTURES OF SPECIFIC
		// DATA NAME OBJECT
		getFromData: function(config,page,data,scope) {
			let target = config.pages[page];
			for(let i=0;i<target.structure.length;i++)
				for(let j=0;j<target.structure[i].group.length;j++)
					for(let k=0;k<target.structure[i].group[j].length;k++)
						if(target.structure[i].group[j][k].data == data) {
							if(typeof(scope) === "undefined" || ["addy","strct","group","input"].indexOf(scope) == -1)
								return false;
							else if(scope == "strct")
								return target.structure[i];
							else if(scope == "group")
								return target.structure[i].group[j];
							else if(scope == "input")
								return target.structure[i].group[j];
							else if(scope == "addy")
								return [i,j,k];
						}
			return false;
		},
		// GET ALL DATANAME OBJECTS FROM
		// CONFIG FILE
		getAllData: function(config,page) {
			let dataArr = [];
			let target = config.pages[page];
			for(let i=0;i<target.structure.length;i++) {
				if(typeof(target.structure[i].repeatable) === "string")
					dataArr.push(target.structure[i].repeatable);
				for(let j=0;j<target.structure[i].group.length;j++)
					for(let k=0;k<target.structure[i].group[j].length;k++)
						if(typeof(target.structure[i].group[j][k].data) === "string")
							dataArr.push(target.structure[i].group[j][k].data);
			}
			return dataArr;
		}
	},
	vld: {
		// KP PREFIX USED FOR KEY PREVENTION
		// IS PREFIX USED FOR FULL STRING/VALUE VALIDATION
		isInteger: function(value) {
			return /^\d*$/.test(value);
		},
		frendlyURL: function(value) {
			return /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(value);
		},
		isEmail: function(value) {
			return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
		},
		isEmailNA: function(value) {
			if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || value == "NA") return true;
			else return false;
		},
		isDomain: function(value) {
			return /^@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm.test(value);
		},
		isPhone: function(value) {
			return /^[+]{1}([0-9]{7,15})$/.test(value);
		},
		isPassword: function(value) {
			if(value.length < 30 && /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/.test(value))
				return true;
			return false;
		},
		len: function(value,limit) {
			return value.length == limit;
		},
		minLen: function(value,limit) {
			return value.length >= limit;
		},
		maxLen: function(value,limit) {
			return value.length <= limit;
		},
		val: function(value,limit) {
			return value == limit;
		},
		minVal: function(value,limit) {
			return value >= limit;
		},
		maxVal: function(value,limit) {
			return value <= limit;
		},
		flt: function(value) {
			return /^-?\d*[.,]?\d*$/.test(value);
		},
		az: function(value) {
			return /^[a-z]*$/i.test(value);
		},
		an: function(value) {
			return /^[0-9a-z]*$/i.test(value)
		},
		alphanumeric: function(value) {
			return /^[a-zA-Z0-9]*$/.test(value);
		},
		onlyAlphanumericAndDash: function(value) {
			return /^[A-Za-z0-9-]*$/.test(value);
		},
		superalphanumeric: function(value) {
			return /^[a-zA-Z0-9-_ /\\/]*$/.test(value);
		},
		ponumber: function(value) {
			return /^[a-zA-Z0-9-_[\](\)&# /\\/]*$/.test(value);
		},
		povalue: function(value) {
			if(value.length < 16 && /^(?!0\d|$)\d*(\.\d{1,4})?$/.test(value)) return true;
			else return false;
		},
		povaluetyping: function(value) {
			if(/^[0-9.]*$/.test(value) && value.split(".").length <= 2) return true;
			else return false;
		},
		ascii: function(value) {
			return /^[\x00-\x7F]*$/.test(value);
		},
		letters: function(value) { //enhanced az validation, including all non standanrd letters from different alphabets (japanese, spanish, chinese)
            if(!value)
                return true;
            return /^((?![0-9.,!?:;_|~+\-*\\/=%Â°@&#Â§$"'`Â¨^Ë‡()\[\]<>{}])[\S ])+$/.test(value);
        },
		quote: function(value) {
			// CHECK FOR NGQ
			if(
				// LENGTH IS 13
				value.length == 13 &&
				// STARTS WITH NQ
				value.indexOf("NQ") == 0 &&
				// HAS A DASH
				value.indexOf("-") > -1 &&
				// MAIN BODY IS DIGIT ONLY
				/^\d*$/.test(value.replace("NQ","").replace("-","")) &&
				// TAIL LENGTH IS 2
				value.split("-")[1].length == 2
			) return true;
			// CHECK FOR ELITE
			// else if(value.indexOf("5") == 0 && /^\d*$/.test(value)) return true;
			// CHECK FOR NA
			else if(value == "NA") return true;
			// ELSE FALSE
			else return false;
		},
		paymentTerms: function(value) {
			if(/^\d*$/.test(value) || value == "NA") return true;
			else return false;
		},
		partnerIds: function(value) {
			return /^[A-Z0-9-]+$/.test(value);
		},
		nointeger: function(value) {
			return /^([^0-9]*)$/.test(value);
		},
		nochars: function(value) {
			return /[^0-9]\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\s/g.test(value);
		},
		kpLatin: function(value) {
			return /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(value);
		},
		kpDefault: function(value) {
			return true;
		},
		mixB:function(value) {
			// ALPHA NUMERIC, NO EXCEPTIONAL CHARACTERS
			return /^[A-Za-z0-9'\.\-\s\,]/g.test(value);
		},
		mixC:function(value) {
			if(/^[+]*[0-9]*$/g.test(value) && value.length < 14) return true;
			else return false;
		},
		mixD: function(value) {
			return /^[A-Za-z0-9 .-]/g.test(value);
		},
		mixE: function(value) {
			if(v.nointeger(value) && v.WW(value) && v.minLen(value,2)) return true;
			else return false;
		},
		eq:function(sel,value) {
			if(document.querySelector(sel)) {
				if(document.querySelector(sel).value == value) return true;
				else return false;
			} else return true;
		},
		checked:function(sel) {
			if(document.querySelector(sel)) {
				if(document.querySelector(sel).checked == true) return true
				else return false
			} else return false
		},
		tax:function(value) {
			//TO DO return /^[a-zA-Z0-9.\/- ]*$/.test(value);
			return true
		},
		url: function(value) {
			return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,15}(:[0-9]{1,5})?(\/.*)?$/.test(value);
		},
		again: function(value,selector) {
			if(value == document.querySelector(selector).value) return true
			else return false
		},
		latinName: function(value) {
			return /^[a-zA-Z0-9- ]*$/.test(value);
		},
		typeEmail: function(value) {
			return /^[a-zA-Z0-9-._@ ]*$/g.test(value);
		},
		typePhone: function(value) {
			return /^[+0-9- ]*$/.test(value);
		},
		noBlanks: function(value) {
			return /^$|^\S+.*/.test(value);
		},
		noZeroFirst: function(value) {
			return /^[1-9]\d*$/.test(value);
		},
		noSpecialCharset: function(value) {
			if(/^[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]$/.test(value)) return false;
			else return true;
		},
		inArray: function(selector,array) {
			count = 0;
			if(document.querySelector("*[data-name='"+selector+"']").type == "select-multiple") {
				var options = document.querySelector("*[data-name='"+selector+"']").selectedOptions;
				if(options.length == 0) count++;
				else {
				  for(i=0;i<options.length;i++)
					if(array.indexOf(options[i]) == -1)
					  count++;
				}
			} else if(document.querySelector("*[data-name='"+selector+"']").type == "checkbox") {
				var options = document.querySelectorAll("*[data-name='"+selector+"']:checked");
				if(options.length == 0) count++;
				else {
				  for(i=0;i<options.length;i++)
					if(array.indexOf(options[i]) == -1)
					  count++;
				}
			} else if(document.querySelector("*[data-name='"+selector+"']").type == "select") {
				if(array.indexOf(document.querySelector("*[data-name='"+selector+"']").value) == -1)
					  count++;
			} else if(document.querySelector("*[data-name='"+selector+"']").type == "radio") {
				if(array.indexOf(document.querySelector("*[data-name='"+selector+"']:checked").value) == -1)
					  count++;
			}
			if(count == 0) return true;
			else return false;
		},
		duplicate: function(selector) {
			if(document.querySelector("*[data-name="+selector+"]").value == document.querySelector("*[data-confirm="+selector+"]").value) return true;
			else return false;
		},
		deliverydate: function(value) {
			if(typeof(value) === "undefined" || value == null || value.indexOf("/") == -1) return false;
			else {
				var ddate = value.split("/");
				var unix = new Date(ddate[2],parseInt(ddate[1])-1,parseInt(ddate[0])+1,0,0,0,0).getTime();
				var delta = unix - new Date().getTime();
				if(delta < 7862400000 && delta > 0) return true;
				else return false;
			}
		}
	},
	localization: {
		en_US: {
			selectOne: "Select one",
			multipleCtrl: "Hold control key to select multiple items",
			confirm: "Confirm",
			other: "Other",
			uploadCaptionPart1: "The documents need to be sent in",
			uploadCaptionPart2: "format of a maximum of",
			other: "Other"
		}
	},
	c: {
		e: function(msg) {
			console.error("NBSF: "+msg+".");
			nbsf.c.history.push({type:'ERROR',message: msg});
		},
		w: function(msg) {
			if(nbsf.fn.dbg()) console.warn("NBSF: "+msg+".");
			nbsf.c.history.push({type:'WARN',message: msg});
		},
		i: function(msg) {
			if(nbsf.fn.dbg()) {
				if(typeof(msg) === "string") console.info("NBSF: "+msg+".");
				else console.info("NBSF:",msg);
			}
			nbsf.c.history.push({type:'INFO',message: msg});
		},
		history: []
	}
}