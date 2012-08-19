<?php
/***
 * @class Authenticate 
 */
class Authenticate {
	public $restler;
	function __construct() {
		$this->pdo = new PDO(CONNECTION_STRING);
	}
	public function login($username = "", $password = "") {
		$SQL = "SELECT * FROM users WHERE userName = '".$username."'";
		$query = $this->pdo->query($SQL);
		$query->setFetchMode(PDO::FETCH_ASSOC);  
		$user = $query->fetch();
		
		// passwords must always encrypted before sending, this MUST be done from the client!
		if($user["password"] == md5(sha1($password))) {
			// Create access token
			$access_token = md5(sha1(date("Y-m-d H:i:s")." ".rand()));
			$SQL = "INSERT INTO access_token(token) VALUES ('$access_token')";
			$query = $this->pdo->query($SQL);
			return Array("status" => "OK", "access_token" => $access_token, "TTL" => 200);
		}
	}
}