<?php
require_once 'conn.php';
require_once 'restler.php';
require_once 'transaction.php';
require_once 'account.php';
$r = new Restler();
$r->addAPIClass('Account');
$r->addAPIClass('Transaction');
$r->addAPIClass('Authenticate');
$r->addAuthenticationClass('OAuth');
$r->handle();