/***
An app is a JS object
*/




function App(args) {
	
	var ChromeDataSource = function (result) {
		var COLUMN_TIME = 0;
		var COLUMN_TYPE = 1;
		var COLUMN_DESC = 2;
		var COLUMN_AMOUNT = 3;
		
		this.result  = result;
		this.count = function() {
			return this.result.chromes.length;
		};
		this.numberOfColumns = function() { return 4; };
		this.makeHeader = function(columnIndex) {
			var columns = ["Time", "Type", "Description", "Amount"];
			var div = document.createElement("span");
			div.innerHTML=columns[columnIndex];
			return div;
		};
		this.makeNode = function(rowIndex, columnIndex) {
			var chrome = this.result.chromes[rowIndex];
			switch(columnIndex) {
				case COLUMN_TIME: {
					var d = document.createElement("span");
					d.innerHTML = chrome.time;
					return d;
				}
				case COLUMN_TYPE: {
					var d = document.createElement("div");
					d.innerHTML = chrome.type.name;
					return d;
				}
				case COLUMN_DESC: {
					var d = document.createElement("div");
					d.innerHTML = chrome.description;
					return d;
				}
				case COLUMN_AMOUNT: {
					var d = document.createElement("div");
					d.innerHTML = chrome.amount;
					d.classList.add("chrome");
					d.style.textAlign = "right";
					return d;
					
				}
				
			}
			return null;
		};
	};
	this.add = function(args) {
		var node = document.createElement("div");
		this.node = node;
		leros.prepare("transaction", {
			onSuccess: function (html) {
			
				node.innerHTML = html ;
				//alert(node.innerHTML);
				var leros = new Leros();
				leros.requireAsync("$api/models", function(models) {
					var dataSource = new models.DataSource("transaction");
					dataSource.query(models.ACTION.GET, {id:args[1]}, "test", {
						onSuccess: function(result) {
							var divAccounts = node.querySelector("#transaction");
							
							leros.require("$api/views", function(views) {
								
								var listView = new views.ListView(new ChromeDataSource(result), {});
								divAccounts.appendChild(listView.node);
							});
						}
					});
				
				});
			}
		});
	};
	this.view = function(args) {
		
		var action = "view";
		
		this.title = "Transaction";
		var node = document.createElement("div");
		this.node = node;
		var leros = getLerosApi(1);
		console.log(leros);
		leros.prepare("transaction", {
			onSuccess: function (html) {
			
				node.innerHTML = html ;
				//alert(node.innerHTML);
				var leros = getLerosApi(1);
				leros.require("$api/models", function(models) {
					var dataSource = new models.DataSource("transaction");
					dataSource.query(models.ACTION.GET, {id:args[1]}, "test", {
						onSuccess: function(result) {
							var divAccounts = node.querySelector("#transaction");
							
							leros.requireAsync("$api/views", function(views) {
								
								var listView = new views.ListView(new ChromeDataSource(result), {});
								divAccounts.appendChild(listView.node);
							});
						}
					});
				
				});
			}
		});
	};
	
}