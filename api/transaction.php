<?php
/***
@class Transaction
@protected
**/
class Transaction {
	static $FIELDS = "description";
	function __construct() {
		$this->pdo = new PDO("odbc:Driver={Microsoft Access Driver (*.mdb)};Dbq=C:\\Users\\Alexander\\Dropbox\\chrome.mdb;Uid=Admin");
	}
	function get($access_token, $id = null) {
		$user = get_user($access_token);
		$SQL = ("SELECT *, chromes.description AS description, chrome_type.title AS chrome_type_name, chrome_type.id AS type_id FROM chromes, chrome_type, transactions WHERE chromes.type = chrome_type.id AND transactions.id = chromes.transaction_id AND transactions.id = ".$id." AND transactions.user_id = ".$user["id"]." ORDER BY chromes.time DESC");;
	
		$transactions = Array();
		$STH = $this->pdo->query($SQL);  
		while($row = $STH->fetch()) {  
			
			$transactions[] = $row;
		}
		return Array("chromes" => $transactions);
	}
}