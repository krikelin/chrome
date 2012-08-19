/**
The index app
**/
exports.index = function(args) {
	this.node = document.createElement("div");
	var node = this.node;
	this.create = function(args) {	
	
		var leros = getLerosApi(1);
		leros.prepare("index.html", {
			onSuccess: function (html) {
				
				node.innerHTML = html;
			}
		});
	};
};