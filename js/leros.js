/***************************************************
Copyright (C) 2012 Alexander Forselius

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var ___args = [];
var ___leros = null;
var ___objects = {}; // global object list

/***
 * @function registerObject
 * @description Register an object in the global stack
 * @return id the id of the object
 */

function registerObject(object) {
	var objectID = Math.random() * 25000 + new Date().getTime(); // Generate id
	___objects[objectID] = object;
	return objectID; // Return the object id
}
function getObject(id) {
	return ___objects[id];
}
/***
 * @function registerObject
 * @description Bind an object to the particular element
 */
HTMLElement.prototype.setObject = function (id, obj) {
	var objectID = registerObject(obj);
	this.dataset["object_" + id] = objectID;
	
};
/***
 * @function registerObject
 * @description Bind an object to the particular element
 */
HTMLElement.prototype.getObject = function (id) {

	return getObject(this.dataset["object_" + id]);
	
};
function getLerosApi(ver) {
	if(ver != 1) throw "Invalid leros version";
	
	if((___leros) === null) {
		___leros = new Leros();
	} 
	return ___leros;
}
var Leros = function () {
	
	var viewStack = {};
	this.playQueue = [];
	this.play = function () {
		
	};
	/***
	@function login
	@description Log in to the service
	***/
	this.login = function (userName, passWord, appKey, callbacks) {
		this.requireAsync("$api/models", function(models) {
			var dataSource = new models.DataSource("authenticate");
			dataSource.query(models.ACTION.POST, {username: userName, password: passWord}, "", {
				onSuccess: function(result) {
					
				}
			});
		});
	};
	this.stop = function () {};
	this.logout = function () {
		
		localStorage.access_token = "";
		localStorage.loggedIn = "false";
		self.location="#!/";
	};
	this.navigate = function(args) {
		
	//	document.getElementById("content").innerHTML="<img src=\"img/throbber.png\" />";

		if(localStorage.loggedIn == "true") {
			document.getElementById("nonLoggedIn").style.display = "none";
			document.getElementById("loggedIn").style.display = "block";
		} else {
		
			document.getElementById("nonLoggedIn").style.display = "block";
			document.getElementById("loggedIn").style.display = "none";
		}
		if(args[0] == "app" || args[0] == "bungalow") {
			var c = new XMLHttpRequest();
			
			c.onreadystatechange = function () {
		
				if(c.readyState == 4 && c.status == 200) {
					
					var manifest = eval("(" + c.responseText + ")");
					console.log(manifest);
					
				//	document.getElementById("content").innerHTML =  "";
					var iframe = document.createElement("iframe");
					iframe.style.width = "100%";
					iframe.style.height = "100%";
					iframe.setAttribute("allowtransparency", true);
					iframe.setAttribute("frameborder", 0);
					document.getElementById("content").appendChild(iframe);
					iframe.setAttribute("src", manifest.apps[args[1]].src + "?&token=523523523523");
				}
			};
			c.open("GET", "manifest.json", true);
			c.send();
		}
		if(args[0] != "app") {
			console.log(args);
			var app = args[0];
			if(app == "") {
				app = "home";
			}
			var action = "index";
			if(args.length > 2) {
				action = args[2];
			}
				
	//		alert(app);
			var sections = args;
				
			// Hide all instances
			var apps = document.querySelectorAll(".app");
			console.log("G", apps);
			for(var i = 0; i < apps.length; i++) {
				//alert("AW");
				console.log(apps[i].getObject("holder"));
				try {
				apps[i].getObject("holder").onDeactivate();
				} catch (e) {
				}
				apps[i].style.display = "none";
			}
			
			// Check if there is an existing view or new in the viewstack,
			// We have cache all app instance to save energy
			
			if(document.querySelectorAll("#app_" + args.join("_")).length > 0) {	
		
				var app = document.querySelector("#app_" + args.join("_"));
				app.style.display = "block";
				var view = app.getObject("holder");
				try {
				view.onActivate();
				} catch (e) {
				}
			} else {
				this.requireAsync("apps/" + app + "", function(app) {
					var view = new app[action](args);
					var canvas = document.createElement("div");
					canvas.classList.add("app");
					canvas.classList.add("content");
					canvas.setAttribute("id", "app_" + args.join("_"));
					canvas.setObject("holder", view);
					view.create(args); // Create view
					
					canvas.appendChild(view.node); // append child to view
					
					document.getElementById("content").appendChild(canvas);
					console.log("A", document.querySelectorAll( "#app_" + args.join("_")));
				});
			}
			console.log(document.querySelectorAll(".app"));
			
			
			if(false) {
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.onreadystatechange = function () {
					if(xmlHttp.readyState == 4) {
						if(xmlHttp.status == 200) {
							
							___args = args;
							var appInstance = eval("new (" + xmlHttp.responseText + ")(___args)");
							console.log(appInstance);
							viewStack["leros:" + args.join(":")] = appInstance;
							document.getElementById("content").innerHTML =  "";
							console.log(appInstance.node);
							var action = "view";
							
							if(args.length > 2) {
								action = args[1];
							}
							var view = new appInstance[action](args);
							console.log(view.node);
							document.getElementById("content").appendChild(view.node);
						}
					}
				};
				xmlHttp.open("GET", "apps/" + app + "/app.js?w=" + Math.random(), true);
				xmlHttp.send(null);
			}
		}
		
	};
	/**
	@function prepare
	@description Prepare a view from a template
	***/
	this.prepare = function(view, callback) {
		var xmlHttp = new XMLHttpRequest(); // TODO Please change later!
		xmlHttp.onreadystatechange = function () {
			if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					callback.onSuccess(xmlHttp.responseText);
				} else {
					callback.onFailure({ errorCode: xmlHttp.status});
				}
			}
		};
		//xmlHttp.open("GET", "apps/" + view + "/index.html?c=" + Math.random(), true);
		xmlHttp.open("GET", "views/" + view + "?c=" + Math.random(), true);
		xmlHttp.send(null);
	};
	this.requireAsync = function(path, onfinish) {
		var c = new XMLHttpRequest();
		try {
			// Replace ${api} with path
			
			path = path.replace("$api/", "js/api/scripts/");
			
			c.open("GET", path+".js?c=" + Math.random(), true);
			
			c.onreadystatechange = function () {
				if(c.readyState == 4) {
					if(c.status == 200) {
						
						var pc = "(new (function() { var exports = {};\n" + c.responseText +"\nthis._exports = exports;})())._exports";
					//	console.log(pc);
						console.log("F");
						onfinish(eval(pc));
					}
				}
			};
			c.send(null);
		} catch (e) {
			console.log(e.stack);
		}
		
	};
	this.require = function(path) {
		var c = new XMLHttpRequest();
		try {
			// Replace ${api} with path
			
			path = path.replace("$api/", "js/api/scripts/");
			
			c.open("GET", path+".js?c=" + Math.random(), false);
			c.send(null);
			
						
			var pc = "(new (function() { var exports = {};\n" + c.responseText +"\nthis._exports = exports;})())._exports";
		//	console.log(pc);
			console.log("F");
			return eval(pc);
		} catch (e) {
			console.log(e.stack);
		}
	
	};
			
		
		
};
leros = new Leros();	
window.onbeforeunload =  function () {	
	var d = document.createElement("div");
	d.style.width = "100%";
	d.style.height = "100%";
	d.style.display = "block";
	d.style.position = "fixed";
	d.style.left = "0px";
	d.style.top = "0px";
	d.style.backgroundImage = "assets/img/fade.png";
	document.body.appendChild(d);
	
};
window.addEventListener("load", function () {
	
	navigator.registerProtocolHandler(
    'web+bistlr', '#!/%s', 'Bistlr');
	
	var url = self.location.href.split("#")[1];
	loadApp();
	
});
function loadApp() {
	var url = decodeURI(document.location.hash.replace("#!/", "").replace("%3A", "\/"));
	//alert(url);
	url = url.replace(":", "\/");
	var nitUrl = "#!/" + url;
	var menuitems = document.querySelectorAll("a[href]");
	console.log(menuitems);
	for(var i = 0; i < menuitems.length; i++) {
		var item  = menuitems[i];
	
		console.log(nitUrl, item.getAttribute("href"));
		if(nitUrl == item.getAttribute("href")) {
			
			item.parentNode.classList.add("selected");
		} else {
			item.parentNode.classList.remove("selected");
		}
	}
	url = url.split("\/");
	var app = url[0];
	var section = url[1];
	var parameter = url[2];
	var query = url[3];
	leros.navigate(url);
}
window.addEventListener("hashchange", function (evt) {
	loadApp();
});

