/**
The index app
**/
exports.index = function(args) {
	this.node = document.createElement("div");
	this.create = function(args) {
		var leros = getLerosApi(1);
		leros.prepare("index.html", {
			onSuccess: function (html) {
				
			}
		});
	};
};