const hpe = {
  c: {
      e: function(e) {
          console.error(e);
      },
      i: function(e) {
          console.info(e);
      },
      w: function(e) {
          console.warn(e);
      },
      l: function(e) {
          console.log(e);
      }
  },
  navbar: function(obj) {
      if (typeof(obj) !== "object") hpe.c.e("No object structure defined for navbar");
      else {
          var structure = document.createElement("section");
          structure.id = "nav";
          var wrapper = document.createElement("section");
          wrapper.setAttribute("class", "wrapper");
          var burger = document.createElement("div");
          burger.id = "burger";
          for (i = 0; i < 4; i++) {
              var line = document.createElement("span");
              burger.appendChild(line);
          }
          // LOGO
          var logo = document.createElement("div");
          logo.id = "logo";
          // ADD ICONS
          var icons = document.createElement("div");
          var ul = document.createElement("ul");
          icons.id = "icons";
          icons.appendChild(ul);
          // ADD NAV
          var nav = document.createElement("nav");
          var ul = document.createElement("ul");
          nav.appendChild(ul);

          if (typeof(obj.nav) === "object")
              wrapper.appendChild(burger);
          wrapper.appendChild(logo);
          wrapper.appendChild(icons);
          wrapper.appendChild(nav);
          structure.appendChild(wrapper);
          // APPEND STRUCTURE
          document.querySelector("body").style.paddingTop = "90px";
          document.querySelector("body").appendChild(structure);
          hpe._dom.nav = document.querySelector("#nav nav");
          try {
              if (typeof(obj.title) === "string") document.querySelector("#nav #logo").innerHTML = obj.title;
              if (typeof(obj.nav) === "object") {
                  var nav = document.querySelector("#nav nav ul");
                  obj.nav.forEach(function(item) {
                      if (typeof(item.html) === "string") nav.innerHTML += item.html;
                      else nav.innerHTML += '<li><a href="' + item.href + '" target="_blank">' + item.label + '</a></li>';
                  });
              }
              if (typeof(obj.icons) === "object") {
                  var icon = document.querySelector("#nav #icons ul");
                  obj.icons.forEach(function(item) {
                      if (typeof(item.html) === "string") icon.innerHTML += item.html;
                  });
              }
              if (typeof(obj.nav) === "object")
                  hpe._burger.init();
          } catch (err) {
              hpe.c.e("Unable to process structure population");
              hpe.c.e(err);
          }
      }
  },
  footer: function() {
      let body = document.querySelector('body');
      body.style.paddingBottom = '150px';
      body.style.position = 'relative';

      let footer = hpe.fn.node('section', {
          'id': 'footer'
      });
      let wrapper = hpe.fn.node('section', {
          'class': 'wrapper'
      });
      let logoRow = hpe.fn.node('div', {
          'class': 'row logo'
      });
      let textRow = hpe.fn.node('div', {
          'class': 'row text'
      });
      let copyrightColumn = hpe.fn.node('div', {
          'class': 'left col col-40'
      });
      let linksColumn = hpe.fn.node('div', {
          'class': 'col right col-60'
      });
      let cfix = hpe.fn.node('div', {
          'class': 'cfix'
      });

      logoRow.innerHTML = '<a class="logo default-logo footerLogo" href="https://prp-dxp.it.hpe.com/group/internal">' +
          '<img src="https://cdn1.prp-dxp.it.hpe.com/o/prp-theme/images/icons/footer_logo.png">' +
          '</a>';
      copyrightColumn.innerHTML = '<span>Â© Copyright ' + new Date().getFullYear() + ' Hewlett Packard Enterprise Development, L.P.</span>';
      linksColumn.innerHTML = '<ul>' +
          '<li>' +
          '<a href="http://www.hpe.com" target="_blank" data-toggle="tooltip" title="" data-original-title="Open in new window">HPE.com</a>' +
          '</li>' +
          '<li>' +
          '<a href="http://www.hpe.com/us/en/about/governance/policies.html" target="_blank" data-toggle="tooltip" title="" data-original-title="Open in new window">Partner Code of Conduct</a>' +
          '</li>' +
          '<li>' +
          '<a href="http://www.hpe.com/us/en/about/legal/terms-of-use.html" target="_blank" data-toggle="tooltip" title="" data-original-title="Open in new window">Terms of use</a>' +
          '</li>' +
          '<li>' +
          '<a href="http://www.hpe.com/us/en/privacy.html" target="_blank" data-toggle="tooltip" title="" data-original-title="Open in new window">Privacy</a>' +
          '</li>' +
          '</ul>';

      textRow.appendChild(copyrightColumn);
      textRow.appendChild(linksColumn);
      textRow.appendChild(cfix);

      wrapper.appendChild(logoRow);
      wrapper.appendChild(textRow);

      footer.appendChild(wrapper);
      body.appendChild(footer);
  },
  supplies: {
      crud: function() {
          this.q.list.push("crud");
          if (typeof(crud) !== "undefined") hpe.c.w("CRUD is already defined.");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.it.hpe.com/resources/rs/custom/js/crud.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("CRUD JS added to the document");
          }
      },
      ckie: function() {
          this.q.list.push("ckie");
          if (typeof(ckie) !== "undefined") hpe.c.w("COOKIE is already defined.");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.it.hpe.com/resources/rs/custom/js/ckie.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("COOKIE JS added to the document");
          }
      },
      mail: function() {
          this.q.list.push("mail");
          if (typeof(mail) !== "undefined") hpe.c.w("MAIL JS is already defined (or the variable is already stored in memory).");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.it.hpe.com/resources/rs/custom/onb/js/mail.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("MAIL JS added to the document");
          }
      },
      mojs: function() {
          this.q.list.push("mo");
          if (typeof(mo) !== "undefined") hpe.c.w("Modal & Overlay JS is already defined (or the variable is already stored in memory).");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.it.hpe.com/resources/rs/custom/js/mo2.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("MOJS 2 added to the document");
          }
      },
      tokn: function() {
          this.q.list.push("tokn");
          if (typeof(tokn) !== "undefined") hpe.c.w("TOKN JS is already defined (or the variable is already stored in memory).");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.it.hpe.com/resources/rs/custom/js/tokn.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("TOKN JS added to the document");
          }
      },
      nbsf: function() {
          this.q.list.push("nbsf");
          if (typeof(nbsf) !== "undefined") hpe.c.w("NBSF JS is already defined (or the variable is already stored in memory).");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.itcs.hpe.com/resources/rs/custom/js/nbsf/nbsf2.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("NBSF JS added to the document");
          }
      },
      lov: function() {
          this.q.list.push("lov");
          if (typeof(lov) !== "undefined") hpe.c.w("LOV JS is already defined (or the variable is already stored in memory).");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.it.hpe.com/resources/rs/custom/js/lov.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("LOV JS added to the document");
          }
      },
profile: function() {
          this.q.list.push("profile");
          if (typeof(lov) !== "undefined") hpe.c.w("Profile JS is already defined (or the variable is already stored in memory).");
          else {
              let script = document.createElement("script");
              script.src = 'https://hpe-rfb.it.hpe.com/resources/rs/custom/js/profile.js';
              document.querySelector("body").appendChild(script);
              hpe.c.i("Profile JS added to the document");
          }
      },
      q: {
          end: function(cb) {
              let qLoop = setInterval(qCheck, 200);

              function qCheck() {
                  qList = hpe.supplies.q.list;
                  for (let i = qList.length; i >= 0; i--) {
                      let evalProcess = false;
                      try {
                          if (typeof(eval(qList[i])) === "object")
                              evalProcess = true;
                      } catch (err) {}
                      if (typeof(window[qList[i]]) === "object" || evalProcess)
                          hpe.supplies.q.list.splice(i, 1);
                  }
                  if (hpe.supplies.q.list.length == 0) {
                      clearInterval(qLoop);
                      if (typeof(cb) === "function")
                          return cb();
                      else
                          return true;
                  }
              }
          },
          list: []
      }
  },
  time: {
      timestamp: function(callback) {
          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.addEventListener("readystatechange", function() {
              if (this.readyState === 4) {
                  if (typeof(callback) === "function") return callback(this.responseText);
                  else return this.responseText;
              }
          });
          xhr.open("GET", "https://hpe-rfb.it.hpe.com/resources/rs/custom/onb/timestamp.php");
          xhr.send();
      }
  },
  ui: {
      rate: function(config, callback) {
          config.dom.innerHTML = '<span class="rating" data-rating="' + config.rating + '" data-rating-id="' + config.ratingId + '">' +
              '<span class="star">' +
              '<svg class="empty" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="none" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="full" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="#666" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="half" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star half" width="128px" height="128px"><path fill="none" stroke="#666" stroke-width="2" d="M5,21 L8,14 L3,9 L9,9 L12,3 L15,9 L21,9 L16,14 L19,21 L12,17 L5,21 Z M11,8 L11,16 L8,17.5 L9.5,14 L5.5,10 L10,10 L11,8 Z M8,11 L10,13 L10,11 L8,11 Z"></path></svg>' +
              '</span>' +
              '<span class="star">' +
              '<svg class="empty" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="none" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="full" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="#666" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="half" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star half" width="128px" height="128px"><path fill="none" stroke="#666" stroke-width="2" d="M5,21 L8,14 L3,9 L9,9 L12,3 L15,9 L21,9 L16,14 L19,21 L12,17 L5,21 Z M11,8 L11,16 L8,17.5 L9.5,14 L5.5,10 L10,10 L11,8 Z M8,11 L10,13 L10,11 L8,11 Z"></path></svg>' +
              '</span>' +
              '<span class="star">' +
              '<svg class="empty" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="none" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="full" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="#666" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="half" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star half" width="128px" height="128px"><path fill="none" stroke="#666" stroke-width="2" d="M5,21 L8,14 L3,9 L9,9 L12,3 L15,9 L21,9 L16,14 L19,21 L12,17 L5,21 Z M11,8 L11,16 L8,17.5 L9.5,14 L5.5,10 L10,10 L11,8 Z M8,11 L10,13 L10,11 L8,11 Z"></path></svg>' +
              '</span>' +
              '<span class="star">' +
              '<svg class="empty" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="none" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="full" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="#666" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="half" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star half" width="128px" height="128px"><path fill="none" stroke="#666" stroke-width="2" d="M5,21 L8,14 L3,9 L9,9 L12,3 L15,9 L21,9 L16,14 L19,21 L12,17 L5,21 Z M11,8 L11,16 L8,17.5 L9.5,14 L5.5,10 L10,10 L11,8 Z M8,11 L10,13 L10,11 L8,11 Z"></path></svg>' +
              '</span>' +
              '<span class="star">' +
              '<svg class="empty" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="none" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="full" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star" width="128px" height="128px"><polygon fill="#666" stroke="#666" stroke-width="2" points="5 21 8 14 3 9 9 9 12 3 15 9 21 9 16 14 19 21 12 17"></polygon></svg>' +
              '<svg class="half" version="1.1" viewBox="0 0 24 24" role="img" aria-label="star half" width="128px" height="128px"><path fill="none" stroke="#666" stroke-width="2" d="M5,21 L8,14 L3,9 L9,9 L12,3 L15,9 L21,9 L16,14 L19,21 L12,17 L5,21 Z M11,8 L11,16 L8,17.5 L9.5,14 L5.5,10 L10,10 L11,8 Z M8,11 L10,13 L10,11 L8,11 Z"></path></svg>' +
              '</span>' +
              '</span><sup class="total"></sup><div class="cfix"></div>';
          var target = config.dom.querySelector(".rating");
          // TOTAL UNIQUE RATINGS
          if (typeof(config.total) === "number" || typeof(config.total) === "string")
              config.dom.querySelector(".total").innerText = config.total;
          // ACTIVE OR INACTIVE STATE
          if (typeof(config.active) === "boolean" && config.active)
              target.classList.add("active");
          // SIZE OF RATING UI
          if (typeof(config.size) === "string" && ["xs", "xl", "md"].indexOf(config.size) > -1)
              target.classList.add(config.size);
          // MIRROR
          if (typeof(config.mirror) === "boolean" && config.mirror)
              target.classList.add("mirror");
          // DISABLED
          if (typeof(config.disabled) === "boolean" && config.disabled)
              target.classList.add("disabled");
          else {
              // STARS INTERACTION
              let stars = target.querySelectorAll(".star");
              stars.forEach(function(star) {
                  star.addEventListener("click", function(e) {
                      let selector = e.target;
                      if (e.target.getAttribute("class") == null || e.target.getAttribute("class") != "star")
                          selector = e.target.closest(".star");
                      let parent = e.target.closest(".rating");
                      let ratingId = config.ratingId;
                      let rating = Array.prototype.indexOf.call(parent.querySelectorAll(".star"), selector);
                      switch (rating) {
                          case 4:
                              rating = 1;
                              break;
                          case 3:
                              rating = 2;
                              break;
                          case 2:
                              rating = 3;
                              break;
                          case 1:
                              rating = 4;
                              break;
                          case 0:
                              rating = 5;
                              break;
                          default:
                              rating = 3;
                              break;
                      }
                      parent.setAttribute("data-rating", rating);
                      if (parent.getAttribute("class").indexOf("active") == -1) {
                          try {

                              let count = parent.parentNode.querySelector(".total").innerText;
                              count = parseInt(count) + 1;
                              parent.parentNode.querySelector(".total").innerText = count;
                          } catch (err) {
                              hpe.c.w("Unable to update UI rating count");
                          }
                      }
                      parent.classList.add("active");
                      if (typeof(callback) === "function")
                          callback({
                              rating: rating,
                              ratingId: ratingId
                          });
                      else
                          return {
                              rating: rating,
                              ratingId: ratingId
                          };
                  });
              });
          }
      },
      tabs: function(config, callback) {
          // build parents
          let tabs = hpe.fn.node('div', {
              'class': 'tabs'
          });
          let containers = hpe.fn.node('div', {
              'class': 'container'
          });

          // build dom tree
          let active = false;
          config.tabs.forEach(function(item) {
              let tab = hpe.fn.node('span', {
                  'tab-id': item.id
              });
              tab.innerText = item.label;
              let container = hpe.fn.node('div', {
                  'tab-id': item.id
              });

              // container has children
              let html = false;
              if (typeof(item.html) === 'function')
                  html = item.html();
              else if (typeof(item.html) === 'string')
                  html = item.html;
              if (typeof(html) === 'string')
                  container.innerHTML = html;
              else if (typeof(html) === 'object')
                  container.appendChild(html);

              // add on click event
              if (typeof(item.click) === 'function')
                  tab.addEventListener('click', function(e) {
                      if (
                          e.target.classList.value.indexOf('active') == -1 &&
                          e.target.getAttribute('tab-loaded') == null
                      ) {
                          e.target.setAttribute('tab-loaded', true);
                          item.click(item.id, container);
                      }
                  });

              // add active flag if available
              if (!active && typeof(item.active) === 'boolean' && item.active) {
                  tab.classList.add('active');
                  container.classList.add('active');
                  active = item.id;
              }

              // append to parents
              tabs.appendChild(tab);
              containers.appendChild(container);
          });

          // append to parent
          config.dom.appendChild(tabs);
          config.dom.appendChild(containers);

          // add toggle event
          tabs = config.dom.querySelectorAll("span[tab-id]");
          containers = config.dom.querySelectorAll("div[tab-id]");
          for (let i = 0; i < tabs.length; i++) {
              tabs[i].addEventListener("click", function(e) {
                  var target = e.target;
                  var parent = e.target.parentNode;
                  var tabs = parent.querySelectorAll("[tab-id]");
                  var container = parent.nextSibling;
                  var cont = container.querySelectorAll("[tab-id]");
                  for (i = 0; i < tabs.length; i++) {
                      tabs[i].classList.remove('active');
                      cont[i].classList.remove('active');
                  }
                  target.classList.add('active');
                  container.querySelector("[tab-id='" + target.getAttribute("tab-id") + "']").classList.add('active');
              });
          }

          // default active first tab and container if still false
          if (!active) {
              config.dom.querySelector("span[tab-id]").click();
              active = true;
          } else
              config.dom.querySelector("span[tab-id].active").click();

          // return
          if (typeof(callback) === "function")
              return callback(containers);
          return cont;
      }
  },
  fn: {
      node: function(type, attr) {
          if (["svg", "path"].indexOf(type) == -1)
              var node = document.createElement(type);
          else
              var node = document.createElementNS('http://www.w3.org/2000/svg', type)
          if (typeof(attr) === "object")
              for (obji = 0; obji < Object.keys(attr).length; obji++)
                  node.setAttribute(Object.keys(attr)[obji], attr[Object.keys(attr)[obji]]);
          return node;

      },
      lang: function(key, locale, source) {
          try {
              if (typeof(locale) === "undefined")
                  locale = "en_US";
              if (typeof(source[key]) !== "undefined") {
                  if (typeof(source[key][locale]) !== "undefined" && source[key][locale] != null && source[key][locale] != "")
                      return source[key][locale];
                  else if (typeof(source[key]["en_US"]) !== "undefined" && source[key]["en_US"] != null)
                      return source[key]["en_US"];
              } else if (typeof(key) === "string")
                  return key;
              else
                  return "Error MLK";
          } catch (err) {
              return key;
          }
      },
      resizeable: function() {
          // RESIZE OBSERVER
          try {
              const resizeObserver = new ResizeObserver(function(entries) {
        var cnt = document.querySelector("body");
        if(document.querySelector("body > div")) cnt = document.querySelector("body > div");
                  var height = Math.max(cnt.scrollHeight, cnt.offsetHeight, cnt.clientHeight);
        if(height < 500 && document.querySelector('div[data-role="grid"]')) height = 500;
                  window.parent.postMessage(JSON.stringify({
                      "h": height
                  }), "*");
              });
              resizeObserver.observe(document.querySelector("body > div"));
          }
          // BROWSER DOES NOT SUPPORT RESIZE OBSERVER
          catch (err) {
              function resizeObserver() {
        var cnt = document.querySelector("body");
        if(document.querySelector("body > div")) cnt = document.querySelector("body > div");
                  var height = Math.max(cnt.offsetHeight, cnt.clientHeight);
        if(height < 500 && document.querySelector('div[data-role="grid"]')) height = 500;
                  window.parent.postMessage(JSON.stringify({
                      "h": height
                  }), "*");
              }
              setInterval(resizeObserver, 500);
          }
      }
  },
  data: {
      xref: function(id, callback, timeout) {
          if (typeof(id) === "string" && typeof(callback) === "function") {
              // check request health and set request type
              var type = false;
              if (!isNaN(id)) {
                  if (id.length == 10) type = 'pid'; // party id
                  else if (id.length == 8) type = 'lid'; // location id
                  else {
                      console.error('Unrecognized numerical id format provided; unable to submit request to EMDM PartyLookup Service');
                      return false;
                  }
              } else if (["1", "2", "3"].indexOf(id.split('-')[0]) > -1 && id.length > 4)
                  type = 'sprm';
              if (!type) {
                  console.error('Unrecognized id format provided; unable to submit request to EMDM PartyLookup Service');
                  return false;
              }
              // submit request
              else {
                  var response = null;
                  var xhr = new XMLHttpRequest();
                  xhr.withCredentials = true;
      if(!!timeout) {
        xhr.timeout = timeout;
      }
                  xhr.addEventListener("readystatechange", function() {
                      if (this.readyState === 4) {
                          if (typeof(callback) === "function") {
                              try {
                                  return callback(JSON.parse(this.responseText));
                              } catch (e) {
                                  console.error(e);
                                  return callback(this.responseText);
                              }
                          } else
                              return this.responseText;
                      }
                  });
                  xhr.open("GET", "https://hpe-rfb.it.hpe.com/resources/rs/custom/partyrequest.php?type=" + type + "&id=" + id);
                  xhr.send(response);
              }
          } else {
              console.error('Please ensure required payload is provided to call EMDM PartyLookup Service');
              return false;
          }
      },
      user: function(email, scope, callback) {
          if (typeof(email) !== "string" || email.indexOf("@") == -1 || typeof(callback) !== "function") {
              console.error("Missing or incorrectly formatted payload");
              return false;
          }
          var payload = {};
          payload.type = "emailAddress";
          payload.emailAddress = email;
          payload.scope = 0;

          if ([0, 1, 2].indexOf(scope) > -1)
              payload.scope = scope;

          payload = JSON.stringify(payload);

          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.addEventListener("readystatechange", function() {
              if (this.readyState === 4) {
                  try {
                      let response = JSON.parse(this.responseText);
                      if (response.Success)
                          return callback(JSON.parse(response.Response));
                  } catch (e) {
                      console.error(e);
                      return callback(false);
                  }
              }
          });
          xhr.open("POST", "https://hpe-rfb.it.hpe.com/resources/rs/custom/php/dxp/userSearch.php");
          xhr.setRequestHeader("Content-Type", "text/plain");
          xhr.send(payload);
      },
      countries: function(callback) {
          crud.read('3668', false, function(d) {
              callback(d.Rows);
          });
      }
  },
  dxp: {
user: {
  get: function(email, scope, callback) {
          if (typeof(email) !== "string" || email.indexOf("@") == -1 || typeof(callback) !== "function") {
              console.error("Missing or incorrectly formatted payload");
              return false;
          }
          var payload = {};
          payload.type = "emailAddress";
          payload.emailAddress = email;
          payload.scope = 0;

          if ([0, 1, 2].indexOf(scope) > -1)
              payload.scope = scope;

          payload = JSON.stringify(payload);

          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.addEventListener("readystatechange", function() {
              if (this.readyState === 4) {
                  try {
                      let response = JSON.parse(this.responseText);
                      if (response.Success)
                          return callback(JSON.parse(response.Response));
                  } catch (e) {
                      console.error(e);
                      return callback(false);
                  }
              }
          });
          xhr.open("POST", "https://hpe-rfb.it.hpe.com/resources/rs/custom/php/dxp/userSearch_v2.php");
          xhr.setRequestHeader("Content-Type", "text/plain");
          xhr.send(payload);
      }
}
},
api: {
      queue: 0,
      dataset: function(config, callback) {
          let start = new Date().getTime();
          let scaffolding = {
              Success: false,
              Data: [],
              Message: null,
              Total: 0,
              Config: config,
              AggregateResults: {},
    AbsoluteTotal: 0,
              Type: null,
              Performance: {
                  request: 0,
                  total: 0
              }
          };

          if (
              typeof(config) !== 'object' ||
              typeof(config.form) !== 'string' ||
              typeof(config.dataset) !== 'string'
          ) {
              scaffolding.Message = 'Missing or incorrectly formatted configuration';
              console.error(scaffolding.Message);
              console.log(scaffolding);
              return callback(scaffolding);
          }

          var payload = new FormData();

          // set default request configuration
          config.method = 'POST';
          config.uri = 'https://hpe-rfb.it.hpe.com/form/data-set-provider/v2/' + config.form + '/' + config.dataset + '/kendo/data/search';

          if (config.payload) {
              if (typeof(config.payload.data) === "object") {
                  config.uri = 'https://hpe-rfb.it.hpe.com/form/data-set-provider/v2/' + config.form + '/' + config.dataset + '/kendo/data';
                  payload.append('models', JSON.stringify([config.payload.data]));
                  if (config.payload.data.EntryId) {
                      config.method = 'PUT';
                      if (config.payload.delete)
                          config.method = 'DELETE';
                  }
              } else {
                  if (config.payload.take)
                      payload.append("take", config.payload.take);
                  else
                      payload.append("take", "10");

                  if (config.payload.skip)
                      payload.append("skip", config.payload.skip);
                  else
                      payload.append("skip", "0");

                  if (config.payload.page)
                      payload.append("page", config.payload.page);
                  else
                      payload.append("page", "1");

                  if (config.payload.pageSize)
                      payload.append("pageSize", config.payload.pageSize);
                  else
                      payload.append("pageSize", "10");

                  if (config.payload.filter)
                      payload.append("filter", JSON.stringify(config.payload.filter));
                  else
                      payload.append("filter", "{}");
              }
          } else {
              payload.append("take", "10");
              payload.append("skip", "0");
              payload.append("page", "1");
              payload.append("pageSize", "10");
              payload.append("filter", "{}");
          }

          // increment xhr execution
          this.queue++;
          // execute xhr
          var xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.addEventListener("readystatechange", function() {
              if (this.readyState === 4) {
                  scaffolding.Performance.request = new Date().getTime() - start;
                  try {
                      let response = JSON.parse(this.responseText);

                      // set type of request
                      if (config.payload && config.payload.data) {
                          if (config.payload.data.EntryId) {
                              if (config.payload.delete)
                                  scaffolding.Type = "delete";
                              else
                                  scaffolding.Type = "update";
                          } else
                              scaffolding.Type = "create";
                      } else scaffolding.Type = 'search';

                      // successful delete operations return boolean
                      if (typeof(response) === 'boolean') {
                          scaffolding.Success = response;
                          scaffolding.Data = [{
                              "EntryId": config.payload.data.EntryId
                          }];
                      }
                      // successful search operations and failed create/update/delete operations return dictionary object
                      else if (typeof(response) === 'object' && typeof(response.length) === 'undefined') {
                          if (response.AggregateResults)
                              scaffolding.AggregateResults = response.AggregateResults;

                          // lookup errors
                          if (response.Errors && response.Errors != null) {
                              scaffolding.Success = false;
                              scaffolding.Message = scaffolding.Errors;
                          }
                          // create/update/delete errors
                          else if (typeof(response.Success) === 'boolean' && !response.Success) {
                              scaffolding.Success = false;
                              scaffolding.Message = scaffolding.Message;
                          } else {
                              scaffolding.Success = true;
                              scaffolding.Data = response.Data;
                              scaffolding.Total = response.Data.length;
            scaffolding.AbsoluteTotal = response.Total;
                          }
                      }
                      // successful create/update operations return object array
                      else {
                          if (response.length == 0)
                              scaffolding.Message = 'No data was returned in REST API call';
                          else {
                              scaffolding.Success = true;
                              scaffolding.Data = response;
                              scaffolding.Total = response.length;
                          }
                      }

                      // return only specific columns
                      if (scaffolding.Success) {
                          if (config.data && config.data.columns && scaffolding.Data.length > 0) {
                              let columns = Object.keys(scaffolding.Data[0]);
                              for (let i = 0; i < scaffolding.Data.length; i++) {
                                  for (let j = 0; j < columns.length; j++) {
                                      if (config.data.columns.indexOf(columns[j]) == -1) {
                                          delete scaffolding.Data[i][columns[j]];
                                      }
                                  }
                              }
                          }
                      }

                      scaffolding.Performance.total = new Date().getTime() - start;

                      // return only data
                      if (config.data && config.data.clean && scaffolding.Data)
                          callback(scaffolding.Data);
        // return response
        else callback(scaffolding);
                  } catch (err) {
                      scaffolding.Performance.total = new Date().getTime() - start;
                      if (this.responseText.toLowerCase().indexOf('not found') > -1)
                          scaffolding.Message = 'Target form not found';
                      else {
                          scaffolding.Message = 'Unexpected error while trying to process response';
                          console.error(err);
                      }
                      callback(scaffolding);
                  }
                  hpe.api.queue--;
              }
          });
          xhr.open(config.method, config.uri);
          xhr.send(payload);
      },
      stop: function(callback) {
          let self = this;
          let loop = setInterval(function() {
    stop(callback);
  }, 500);

          function stop(callback) {
              if (hpe.api.queue == 0) {
                  clearInterval(loop);
                  callback();
              }
          };
      }
  },
  logr: function(config,callback) {
if(!config || !config.target || !config.endpoint || !config.postdata || !config.response) {
  console.warn('Failed to execute log due to missing or incomplete payload provided');
  return false;
}

config.type = 'standard';

if(!config.tat)
  config.tat = 0;

if(!config.ip)
  config.ip = '0.0.0.0';

console.l

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4 && typeof(callback) === 'function') {
    try {
      callback(JSON.parse(this.responseText));
    }
    catch(err) {
      callback(this.responseText);
    }
  }
});

xhr.open("POST", "https://hpe-rfb.it.hpe.com/resources/rs/custom/php/inc/_logr.php");
xhr.send(JSON.stringify(config));
},
_dom: {},
  _burger: {
      init: function() {
          hpe._dom.burger = document.querySelector("#burger");
          hpe._dom.burger.addEventListener("click", hpe._burger.toggle);
          hpe._events.onDocument(hpe._burger.escape);
      },
      show: function() {
          hpe._dom.burger.classList.add("open");
          hpe._dom.nav.classList.add("open");
      },
      hide: function() {
          hpe._dom.burger.classList.remove("open");
          hpe._dom.nav.classList.remove("open");
      },
      toggle: function() {
          if (hpe._dom.burger.getAttribute("class") == null || hpe._dom.burger.getAttribute("class").indexOf("open") == -1) hpe._burger.show();
          else hpe._burger.hide();
      },
      escape: function(e) {
          if (e.target.closest("#burger") == null && (e.target.closest("nav") == null || (e.target.closest("nav") != null && e.target.closest("li") != null)))
              hpe._burger.hide();
      }
  },
  _events: {
      onDocument: function(cb) {
          document.addEventListener("click", function(e) {
              cb(e);
          });
      }
  }
}