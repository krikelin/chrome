<?php
include("conn.php");
$pdo = new PDO(CONNECTION_STRING);
$username = $_POST['username'];
$password = $_POST['password'];
$SQL = "SELECT * FROM users WHERE userName = '".$username."'";
$query = $pdo->query($SQL);
$query->setFetchMode(PDO::FETCH_ASSOC);  
$user = $query->fetch();
if($user["password"] == "sha1\$md5\$".sha1(md5($password))) {
	// Create access token
	$access_token = md5(sha1(date("Y-m-d H:i:s")." ".rand()));
	$SQL = "INSERT INTO access_token(token) VALUES ('$access_token')";
	$query = $pdo->query($SQL);
	header("location: ../#!/authenticate/token/" . $access_token);	
} else {
	die("Wrong password");
}