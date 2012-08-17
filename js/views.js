/**
@module views
**/
/**
@class ListView
**/
exports.ListView = function(dataSource, options) {
	this.dataSource = dataSource;
	this.node = document.createElement("table");
	this.node.setAttribute("width", "100%");
	this.node.setAttribute("cellspacing", "0");
	this.node.setAttribute("style", "box-sizing: border-box");
	// Make headers
	var headers = document.createElement("thead");
	var tr = document.createElement("tr");
	headers.appendChild(tr);
	for(var i = 0; i < dataSource.numberOfColumns(); i++) {
		var header = dataSource.makeHeader(i);
		
		var td = document.createElement("td");
		td.appendChild(header);
		header.appendChild(tr);
	}
	var tbody = document.createElement("tbody");
	for(var i = 0; i < dataSource.count(); i++) {
		var tr = document.createElement("tr");
		for(var j = 0; j < dataSource.numberOfColumns(); j++) {
			
			var item = dataSource.makeNode(i, j);
			var td = document.createElement("td");
		
			td.appendChild(item);
			//alert(td.innerHTML);
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	this.node.appendChild(headers);
	this.node.appendChild(tbody);
};
/**
@class ListItem
@description A list item
**/
exports.ListItem = function(data) {
	
};
/***
@class Form
Creates a resuable form
***/
exports.Form = function(form) {	

	this.node = document.createElement("div");
	this.node.setAttribute("id", "form_" + form.name);
	
	this.form = form;
	var self = this;
	// Loop through field sets and append values
	for(var i = 0; i < form.sets.length; i++) {
		var set = form.sets[i];
		var fieldset = document.createElement("fieldset");
		var legend = document.createElement("legend");
		fieldset.appendChild(legend);
		legend.innerHTML = set.legend;
		// Create fields
		for(var j = 0; j < set.fields.length; j++) {
			var field = set.fields[j];
			var input = new exports.Input(self, field);
			fieldset.appendChild(input.node);
			
			
		}
		this.node.appendChild(fieldset);
	}
	var btnSubmit = document.createElement("button");
	btnSubmit.addEventListener("clilick", function () {
		var params = [];
		for(var i = 0; i < self.form.sets.length; i++) {
			var fieldset = self.form.sets[i];
			for(var j = 0; j < fieldset.fields.length; j++) {
				var field = fieldset.fields[j];
				console.log(form);
				console.log(field);
				var input = document.getElementById("field$" + form.name + "$" + field.name + "");
				var value = "";
				if(input.tagName === "input" || input.tagName === "textarea") {
					value = input.value;
				}
				if(input.tagName === "select") {
					value = input.options[input.selectedIndex].value;
				}
				params.push(field.name + "=" + encodeURI(value) + "");
				
			}
		}
		params = params.join("&");
		var xmlHttp = null;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", params.length);
		xmlHttp.setRequestHeader("Connection", "close");
		xmlHttp.open("POST", form.action, true);
		xmlHttp.send(params);
	});
	this.node.appendChild(btnSubmit);
	
};
/**
@enum fieldtype
**/
exports.FIELDTYPE = {
	TEXT : 0x01,
	NUMBER : 0x02,
	DATETIME: 0x03,
	RANGE: 0x04,
	PM: 0x05,
	USERNAME: 0x06,
	PASSWORD: 0x07,
	EMAIL: 0x08,
	SELECT: 0x09
};
/***
@class Input
Creates an input 
@param field Field class to create from
**/
exports.Input = function(form, field) {
	this.label = document.createElement("label");
	this.field = document.createElement("input");
	this.label.innerHTML = field.title;
	switch(field.type) {
		case exports.FIELDTYPE.TEXT: 
		case exports.FIELDTYPE.USERNAME:
			this.field.setAttribute("type", "text");
			
			break;
		case exports.FIELDTYPE.PM:
			this.field = document.createElement("textarea");
			break;
		case exports.FIELDTYPE.SELECT:
			this.field = document.createElement("select");
		case exports.FIELDTYPE.NUMBER:
			this.field.setAttribute("type", "text");
			break;
		case exports.FIELDTYPE.RANGE:
			this.field.setAttribute("type", "range");
			break;
		case exports.FIELDTYPE.NUMBER:
			this.field.setAttribute("type", "number");
			break;		
	}
	this.field.setAttribute("name", "data[" + form.name + "][" + field.name + "]");
	this.field.setAttribute("id", "field$" + form.name + "$" + field.name + "");
	this.field.setAttribute("placeholder", typeof(field.placeholder) !== "undefined" ? field.placeholder : "");
	// Set options
	for(var key in field.options) {
		this.field.setAttribute(key, field.options[key]);
	}
	this.node = document.createElement("span");
	this.node.appendChild(this.label);
	this.node.appendChild(this.field);
	
	
};

/**
@class Gallery 
@description A gallery view
**/
exports.Gallery = function(datasource) {

	this.node = document.createElement("div");
		
	for(var i = 0; i < datasource.count() ; i++) {
	
		var object = new exports.Object(datasource.makeObject(i), datasource.getTemplate(i));
		object.node.style.cssFloat = "left";
		this.node.appendChild(object.node);

	}
};
/**
@class Object
@description An object that is created from a data source and template
**/
exports.Object = function(data, template) {
	this.node = document.createElement("div");
	for(var key in data) {
		template = template.replace("{{" + key + "}}", data[key]);
		
	}
	this.node.innerHTML = template;
};