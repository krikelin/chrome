var Leros = function () {
	
	var viewStack = {};
	this.play = function () {};
	this.stop = function () {};
	this.navigate = function(args) {
		document.getElementById("content").innerHTML="<img src=\"img/throbber.png\" />";
		if(args[0] == "app") {
			console.log(args);
			var app = args[1];
			var sections = args.splice(2);
			
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function () {
				console.log(xmlHttp.responseText);
				var appInstance = eval("(new " + xmlHttp.responseText + ")");
				console.log(appInstance);
				viewStack["leros:" + args.join(":")] = appInstance;
				document.getElementById("content").innerHTML =  "";
				console.log(appInstance.node);
				document.getElementById("content").appendChild(appInstance.node);
			};
			xmlHttp.open("GET", "apps/" + app + "/app.js?w=" + Math.random(), true);
			xmlHttp.send(null);
		}
		
	};
	this.require = function(path, onfinish) {
		var c = new XMLHttpRequest();
		try {
			c.open("GET", path+".js", true);
			c.send(null);
			c.onreadystatechange = function () {
				var pc = "(new (function() { var exports = {};\n" + c.responseText +"\nthis._exports = exports;})())._exports";
			//	console.log(pc);
				onfinish(eval(pc));
			};
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

