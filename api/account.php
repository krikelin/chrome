<?php
include("conn.php");
header("content-type:application/json");
$STH = $pdo->query('SELECT *, transactions.id AS id, transactions.comments AS comments, (SELECT sum(amount) FROM chromes WHERE chromes.type = 1 AND chromes.transaction_id = transactions.id) AS armani, (SELECT sum(amount) FROM chromes WHERE chromes.type > 1 AND chromes.transaction_id = transactions.id) AS amount FROM transactions WHERE user_id = '.$user_id);  
  
# setting the fetch mode  
$STH->setFetchMode(PDO::FETCH_ASSOC);  
$transactions = Array();
while($row = $STH->fetch()) {  
	if($row["amount"] > 0)
	$transactions[] = "{ \"id\": ".$row["id"].", \"time\":\"".date("y-m-d", strtotime($row["time"]))."\", \"armani\":".$row["armani"].", \"comments\":\"".$row["comments"]."\", \"amount\" : ".$row["amount"]."}";
}
?>{
	"balance":"",
	"transactions":[
		<?php print(implode(",", $transactions)); ?>
	]
}