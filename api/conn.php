<?php
$pdo = new PDO("odbc:Driver={Microsoft Access Driver (*.mdb)};Dbq=C:\\Users\\Alexander\\Dropbox\\chrome.mdb;Uid=Admin");
$access_token = $_GET['access_token'];
$user_id = 0;
$SQL = "SELECT * FROM access_tokens WHERE token = '".$access_token."'";
$STH = $pdo->query($SQL) or die($SQL) ;  
$STH->setFetchMode(PDO::FETCH_ASSOC);  
while($row = $STH->fetch()) {  
	$user_id = $row["user_id"];
}
?>