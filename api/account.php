<?php
/***
 *
 * @protected
**/
class Account {
	public function __construct() {
		$this->pdo = new PDO(CONNECTION_STRING);
	}
	
	protected  function get($id = null, $access_token = null) {
		$user = get_user($access_token);
		$NTH = $this->pdo->query('SELECT TOP 1 *, transactions.id AS id, transactions.comments AS comments, (SELECT sum(amount) FROM chromes WHERE chromes.type = 1) AS armani, (SELECT sum(amount) FROM chromes WHERE chromes.type > 1) AS amount FROM transactions WHERE user_id = '.$user["id"].' AND NOT geoholium  ORDER BY time DESC');  

		$STH = $this->pdo->query('SELECT *, transactions.id AS id, transactions.comments AS comments, (SELECT sum(amount) FROM chromes WHERE chromes.type = 1 AND chromes.transaction_id = transactions.id) AS armani, (SELECT sum(amount) FROM chromes WHERE chromes.type > 1 AND chromes.transaction_id = transactions.id) AS amount FROM transactions WHERE user_id = '.$user["id"].' AND NOT geoholium  ORDER BY time DESC');  
		  
		# setting the fetch mode  
		$STH->setFetchMode(PDO::FETCH_ASSOC);  
		$transactions = Array();
		while($row = $NTH->fetch()) {  
			$transactions[] = $row;
		}
		while($row = $STH->fetch()) {  
			
			$transactions[] = $row;
		}
		return Array("transactions" => $transactions);
	}
}

