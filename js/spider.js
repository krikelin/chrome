/**
Open Source Clean Room Implementation of the layout engine created by Spotify for internal use in the Spotify client in Canvas/JavaScript.
@module spider
**/

/***
@class Spider view
Creates a resuable form
***/
exports.PARSEMODE = {
	DEFAULT: 0x01,
	INBOUND: 0x02,
	ABOUND: 0x04,
	OUTBOUND: 0x08
};
var __globalBuffer = "";
var __fdata = {};
function __printx(str) {

	return __globalBuffer+= typeof(str) === "string" ? str.replace(/%QUOTE%/g, "\"").replace(/%BR%/g, "\r\n"): str;
}
// @from http://stackoverflow.com/questions/649614/xml-parsing-of-a-variable-string-in-javascript
var parseXml;

if (typeof window.DOMParser != "undefined") {
    parseXml = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}
function isBreak(i, str) {
	
	var c = str.tokenAt(i, "\r\n") || str[i] === "\n" || str[i] === "\r" || str[i] === "\t";

	return false;
}
String.prototype.tokenAt = function(index, token) {
	return this.substring(index, token.length + index) === token;
};
exports.Spider = function(form) {	
	this.node = document.createElement("canvas");
	var self = this;
	this.template = "";
	this.loadPage = function(url) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					self.template = xmlHttp.responseText;
					var elements = parseXml(self.parseTemplate(self.template, {}));
				}
			}
		};
		xmlHttp.open("GET", url+"?c=" + Math.random()*2, true);
		xmlHttp.send();
	};
	/**
	@function parseTemplate
	@description Parses a spider template and convert it to a page
	**/
	this.parseTemplate = function (data, dataSource) {
		__fdata = dataSource;
		var mode = exports.PARSEMODE.OUTBOUND; 
		var inString = false;
		var output = "";
		var currentString = "";
		var inboundData = [];
		var outboundData = [];
		for(var i = 0; i < data.length; i++) {
			
			if(data[i] == "%" && mode == exports.PARSEMODE.OUTBOUND) {
				mode = exports.PARSEMODE.ABOUND;
				continue;
			}
			if(data[i] == "\n" && data[i-1] != "\\" && mode == exports.PARSEMODE.INBOUND) {
				mode = exports.PARSEMODE.OUTBOUND;
				continue;
			}
		
			if(data[i] == "<" && (data[i+1] == "%" || data[i+1] == "?") && !inString) {
				mode = exports.PARSEMODE.INBOUND;
				outboundData.push(currentString);
				
				currentString = "";
				
				i+=1;
				continue;
			}
			
			if((data[i] == "%" || data[i] == "?") && data[i+1] == ">" && !inString) {
				mode = exports.PARSEMODE.OUTBOUND;
				i+=1;
				inboundData.push(currentString);
				currentString = "";
				continue;
			} 
			
			if(data[i+1] == "\"" && data[i] != "\\" && (mode == exports.PARSEMODE.INBOUND || mode == exports.PARSEMODE.ABOUND)) {
				inString = !inString;
				
			}
			if(mode == exports.PARSEMODE.INBOUND || mode == exports.PARSEMODE.ABOUND) {
				/*if(data[i -1 ] != "\\" && isBreak(i, data)) {
					currentString += ";";
					continue;
				}
				
				if(data.tokenAt(i, "then")) {
					currentString += "){";
					i+="then".length;
				}
				if(data.tokenAt(i, "for")) {
					currentString += "for(";
					i+="for(".length;
				}
				if(data.tokenAt(i, "do")) {
					currentString += "){";
					
					i+="do".length-1;
				}
				if(data.tokenAt(i, "begin")) {
					currentString += "){";
					i+="begin".length;
				}
				if(data.tokenAt(i, "end")) {
					currentString += "}";
					i+="end".length;
				}
				if(isBreak(i, data)) {
					continue;
				}*/
				currentString += data[i];
				//currentString = currentString.replace("{o", "{");
			} else {
				if(isBreak(i, data)) {
					continue;
				} else {
					currentString += data[i];
				}
			//		alert(data[i]);
				
			}
		}
		console.log(outboundData, inboundData);
		for(var i = 0; i < outboundData.length; i++) {
				
			try {
				output += "__printx(\"" + outboundData[i].replace(/"/g, "%QUOTE%").replace(/\r\n/g, "%BR%");
				output += "\"); " + inboundData[i];
			} catch (e) {
				alert(e.stack);
			}
		
				
				
			
				
		}
		
		console.log(output);
		__globalBuffer = "";
		eval("var data = __fdata;" + output);
		
		console.log(__globalBuffer);
	};
	
};