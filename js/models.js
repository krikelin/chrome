/**
@module models
*/
/**
@enum ACTION
**/
exports.ACTION = {
	GET : 0x1,
	POST: 0x2,
	PUT: 0x4,
	DELETE: 0x8
};
/**
@enum EVENT
*/
exports.EVENT = {
	SUCCESS: 0x1,
	FAILED: 0x2
};
/**
@class DataSet
@description Provides the shell DataSource for the given entity
@constructor DataSource
@param model The model to connect to.
***/
exports.DataSource = function(model) {
	this.observers = [];
	this.observe = function() {};
	this.model = model;
	this.adress = "api/" + model + "";
	/**
	@function query
	@description queries for data by the condition
	**/
	this.query = function(action, params, access_token, handler) {
		var xmlHttp = new XMLHttpRequest();
		switch(action) {
			case exports.ACTION.GET:
				xmlHttp.onreadystatechange = function () {
					if(xmlHttp.readyState == 4) {
						if(xmlHttp.status == 200) {
							console.log(xmlHttp.responseText);
							var json = eval("(" + xmlHttp.responseText + ")");
							console.log(json);
							handler.onSuccess(json);
						}
					}
				};
				var posts = [];
				posts.push("access_token=" + access_token);
				for(var key in params) {
					posts.push(key + "=" + encodeURI(params[key]));
				}
				var url = this.adress + "?" + posts.join("&");
				console.log(url);
				xmlHttp.open("GET", url, true);
				xmlHttp.send();
				break;
			case exports.ACTION.PUT:
				xmlHttp.onreadystatechange = function () {
					if(xmlHttp.readyState == 4) {
						if(xmlHttp.status == 200) {
							var json = eval("(" + xmlHttp.responseText + ")");
							handler.onSuccess(json);
						}
					}
				};
				xmlHttp.open("GET", this.adress, true);
				xmlHttp.send();
				break;
			case exports.ACTION.POST:
				break;
		}
	};
	
	
};