/***
An app is a JS object
*/
function App() {
	this.title = "Home";
	var node = document.createElement("div");
	this.view = function(args) {
		
		this.node = node;
		getLerosApi(1).prepare("home", {
			onSuccess : function (html) {
			
				node.innerHTML = html;
				
			}
		});
	};
}