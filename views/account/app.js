/***
An app is a JS object
*/




function App(args) {
	var AccountDataSource = function (result) {
		var COLUMN_TIME = 0;
		var COLUMN_DESC = 1;
		var COLUMN_AMOUNT = 3;
		var COLUMN_POWER = 2;
		this.result  = result;
		this.count = function() {
			return this.result.transactions.length;
		};
		this.numberOfColumns = function() { return 4; };
		this.makeHeader = function(columnIndex) {
			var columns = ["Time", "Description", "Human Energy", "Karma/Chrome"];
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
					
					d.innerHTML = "<a href=\"#!/transaction/" + transaction.id + "\">" + transaction.comments + "</a>";
					return d;
				}
				case COLUMN_AMOUNT: {
					var d = document.createElement("div");
					d.style.textAlign = "right";
					d.innerHTML = "" + transaction.amount;
					
					if(transaction.amount > 0 && transaction.armani < 0)
						d.classList.add("chrome_income");
					if(transaction.amount < 0 && transaction.armani > 0)
						d.classList.add("chrome_expenditure");
						
					if(transaction.amount == 0) {
						d.innerHTML = " - ";
					} else {
						d.classList.add("chrome");
					}
					return d;
				}
				case COLUMN_POWER: {
					
					var d = document.createElement("div");
					if(transaction.amount > 0 && transaction.armani < 0)
						d.classList.add("karma_expenditure");
					if(transaction.amount < 0 && transaction.armani > 0)
						d.classList.add("karma_income");
					d.style.textAlign = "right";
					
					d.innerHTML = "" + transaction.armani;
					if(transaction.armani == 0) {
						d.innerHTML = " - ";
					} else {
						d.classList.add("chrome");
					}
					return d;
				}
			}
			return null;
		};
	};
	this.view = function (args) {
		this.title = "Home";
		var node = document.createElement("div");
		this.node = node;
		var xmlHttp = new XMLHttpRequest();
		var leros = getLerosApi(1);
		leros.prepare("account",{
			onSuccess: function(html){
				node.innerHTML = html;
				//alert(node.innerHTML);
				var leros = new Leros();
				leros.requireAsync("$api/models", function(models) {
					var dataSource = new models.DataSource("account");
					dataSource.query(models.ACTION.GET, {id:args[1]}, "test", {
						onSuccess: function(result) {
						
							var divAccounts = document.getElementById("account");
							leros.requireAsync("$api/views", function(views) {
								console.log(result);
								var listView = new views.ListView(new AccountDataSource(result), {});
							
								divAccounts.appendChild(listView.node);
							});
						}
					});
					
				});
			}
		});
		xmlHttp.open("GET", "apps/account/index.html?c" + Math.random(), true);
		xmlHttp.send(null);
	}
	
}