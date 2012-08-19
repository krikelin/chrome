<?php
class OAuth implements iAuthenticate {

    function __isAuthenticated() {
		
        return get_user($_GET['access_token']) != FALSE;
    }
    function key(){
        return SimpleAuth::KEY;
    }
}
?>