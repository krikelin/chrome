<?php
/***** 
 * Session class
 ****/
class Session {
	public __construct() {
		$this->pdo = new PDO(CONNECTION_STRING);
	}
	protected function get($id = null, $access_token = null) {
		$user = get_user($access_token);
		$sql = "SELECT 
	}
}