<?php
if(version_compare('5.0.0',PHP_VERSION)>0){
	die('Restler requires PHP 5.x.x');
}
#requires 5.3.2
if(!method_exists('ReflectionMethod', 'setAccessible')){
	#echo'RESTLER_METHOD_UNPROTECTION_MODE';
	function isRestlerCompatibilityModeEnabled(){
		return TRUE;
	}
	function unprotect($method_info){
		$class_name = $method_info->class_name;
		$method = $method_info->method_name;
		$params = $method_info->arguments;
		$unique = uniqid('Dynamic')."_";
		$class_code = "class $unique$class_name extends $class_name {";
		$p = array();
		for ($i = 0; $i < count($params); $i++) {
			$p[]='$'."P$i";
		}
		$p = implode(',', $p);
		$class_code .= "function $unique$method($p){return parent::$method($p);}";
		$class_code .= "}";
		#echo $class_code;
		eval($class_code);
		$method_info->class_name = "$unique$class_name";
		$method_info->method_name = "$unique$method";
		return $method_info;
	}
	function call_protected_user_method_array($class_name, $method, $params)
	{
		if(is_object($class_name))$class_name = get_class($class_name);
		$unique = uniqid('Dynamic')."_";
		$class_code = "class $unique$class_name  extends  $class_name {";
		$p = array();
		for ($i = 0; $i < count($params); $i++) {
			$p[]='$'."P$i";
		}
		$p = implode(',', $p);
		$class_code .= "function $unique$method($p){return parent::$method($p);}";
		$class_code .= "}";
		#echo $class_code;
		eval($class_code);
		$obj = $unique.$class_name;
		$obj = new $obj();
		return call_user_func_array(array($obj,$unique.$method), $params);
	}
}

#requires 5.2.3
#if(!method_exists('ReflectionParameter', 'getPosition')){
#found fix! not using getPosition in restler 2.0
#}

#requires 5.3.0
#if(!defined('__DIR__')){
# avoided using it in Restler and replaced it with dirname(__FILE__)
#}
