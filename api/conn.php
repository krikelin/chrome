<?php
define("CONNECTION_STRING", "odbc:Driver={Microsoft Access Driver (*.mdb)};Dbq=C:\\Users\\Alexander\\Dropbox\\chrome.mdb;Uid=Admin");

function get_user($access_token) {	
	$pdo = new PDO(CONNECTION_STRING);
	$user_id = 0;
	$SQL = "SELECT * FROM access_tokens WHERE token = '".$access_token."'";

	$STH = $pdo->query($SQL) or die($SQL) ;  
	$STH->setFetchMode(PDO::FETCH_ASSOC);  
	while($row = $STH->fetch()) {  
		return $row;
	}
	return FALSE;
	
}
?>