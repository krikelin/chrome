/***
An app is a JS object
*/




function App(args) {
	var AccountDataSource = function (result) {
		var COLUMN_TIME = 0;
		var COLUMN_DESC = 1;
		var COLUMN_AMOUNT = 2;
		var COLUMN_POWER = 3;
		this.result  = result;
		this.count = function() {
			return this.result.transactions.length;
		};
		this.numberOfColumns = function() { return 4; };
		this.makeHeader = function(columnIndex) {
			var columns = ["Time", "Description", "Amount", "Human Energy"];
			var div = document.createElement("span");
			div.innerHTML=columns[columnIndex];
			return div;
		};
		this.makeNode = function(rowIndex, columnIndex) {
			var transaction = this.result.transactions[rowIndex];
			switch(columnIndex) {
				case COLUMN_TIME: {
					var d = document.createElement("span");
					d.innerHTML = transaction.time;
					return d;
				}
				case COLUMN_DESC: {
					var d = document.createElement("div");
					d.innerHTML = "<a href=\"#!/transactions/" + transaction.id + "\">" + transaction.comments + "</a>";
					return d;
				}
				case COLUMN_AMOUNT: {
					var d = document.createElement("div");
					d.style.textAlign = "right";
					d.innerHTML = "" + transaction.amount;
					return d;
				}
				case COLUMN_POWER: {
					var d = document.createElement("div");
					d.style.textAlign = "right";
					d.innerHTML = "" + transaction.armani;
					return d;
				}
			}
			return null;
		};
	};
	
	this.title = "Home";
	var node = document.createElement("div");
	this.node = node;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if(xmlHttp.readyState == 4) {
			if(xmlHttp.status == 200) {
				node.innerHTML = xmlHttp.responseText ;
				//alert(node.innerHTML);
				var leros = new Leros();
				leros.require("js/models", function(models) {
					var dataSource = new models.DataSource("account.php");
					dataSource.query(models.ACTION.GET, {id:args[1]}, "test", {
						onSuccess: function(result) {
							var divAccounts = document.getElementById("account");
							leros.require("js/views", function(views) {
								console.log(result);
								var listView = new views.ListView(new AccountDataSource(result), {});
							
								divAccounts.appendChild(listView.node);
							});
						}
					});
					
				});
			}
		}
	};
	xmlHttp.open("GET", "apps/account/index.html?c" + Math.random(), true);
	xmlHttp.send(null);
	
	
}