/***
An app is a JS object
*/




function App() {
	var ItemsDataSource = function (result) {
		var COLUMN_TIME = 0;
		var COLUMN_DESC = 1;
		var COLUMN_AMOUNT = 2;
		this.result  = result;
		this.count = function() {
			return this.result.accounts.length;
		};
		this.numberOfColumns = function() { return 3; };
		this.makeHeader = function(columnIndex) {
			var columns = ["Time", "Description", "Amount"];
			var div = document.createElement("span");
			div.innerHTML=columns[columnIndex];
			return div;
		};
		this.makeNode = function(rowIndex, columnIndex) {
			var account = this.result.accounts[rowIndex];
			switch(columnIndex) {
				case COLUMN_TIME: {
					var d = document.createElement("span");
					d.innerHTML = account.time;
					return d;
				}
				case COLUMN_DESC: {
					var d = document.createElement("div");
					d.innerHTML = "<a href=\"#!/account/" + account.id;
					return d;
				}
			}
			return null;
		};
	};
	var AccountsDataSource = function (result) {
		
		var COLUMN_NAME = 0;
		var COLUMN_BALANCE = 1;
		this.result  = result;
		this.count = function() {
			return this.result.accounts.length;
		};
		this.numberOfColumns = function() { return 2; };
		this.makeHeader = function(columnIndex) {
			var columns = ["Account", "balance"];
			var div = document.createElement("span");
			div.innerHTML=columns[columnIndex];
			return div;
		};
		this.makeNode = function(rowIndex, columnIndex) {
			var account = this.result.accounts[rowIndex];
			switch(columnIndex) {
				case COLUMN_BALANCE: {
					
					var d = document.createElement("span");
					d.innerHTML = account.balance;
					return d;
				}
				case COLUMN_NAME: {
					var div = document.createElement("span");
					div.innerHTML = "<a href=\"#!/account/" + account.id + "\">" + account.name + "</a>";
					return div;
				}
			}
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
					dataSource.query(models.ACTION.GET, {}, "52522525", {
						onSuccess: function(result) {
							var divAccounts = document.getElementById("accounts");
							leros.require("js/views", function(views) {
								
								var listView = new views.ListView(new AccountsDataSource(result), {});
								divAccounts.appendChild(listView.node);
							});
						}
					});
					
				});
			}
		}
	};
	xmlHttp.open("GET", "apps/accounts/index.html?c" + Math.random(), true);
	xmlHttp.send(null);
	
	
}