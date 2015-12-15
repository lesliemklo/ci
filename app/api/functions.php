<?php
function dbConnect(){
	$dbhost="127.3.119.130:3306";
	$dbuser="adminGXQfEiX";
	$dbpass="XiL4TKYrjmHl";
	$dbname="ci";

	$mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbConnection;
}

function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}


?>