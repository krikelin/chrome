var ___args = [];
var Leros = function () {
	
	var viewStack = {};
	this.play = function () {};
	this.stop = function () {};
	this.navigate = function(args) {
		document.getElementById("content").innerHTML="<img src=\"img/throbber.png\" />";
		
		if(args[0] == "app" || args[0] == "bungalow") {
			var c = new XMLHttpRequest();
			
			c.onreadystatechange = function () {
		
				if(c.readyState == 4 && c.status == 200) {
					
					var manifest = eval("(" + c.responseText + ")");
					console.log(manifest);
					
					document.getElementById("content").innerHTML =  "";
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
			var sections = args;
			
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function () {
				if(xmlHttp.readyState == 4) {
					if(xmlHttp.status == 200) {
						console.log(xmlHttp.responseText);
						___args = args;
						var appInstance = eval("new (" + xmlHttp.responseText + ")(___args)");
						console.log(appInstance);
						viewStack["leros:" + args.join(":")] = appInstance;
						document.getElementById("content").innerHTML =  "";
						console.log(appInstance.node);
						document.getElementById("content").appendChild(appInstance.node);
					}
				}
			};
			xmlHttp.open("GET", "apps/" + app + "/app.js?w=" + Math.random(), true);
			xmlHttp.send(null);
		}
		
	};
	this.require = function(path, onfinish) {
		var c = new XMLHttpRequest();
		try {
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

