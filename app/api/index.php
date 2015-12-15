<?php
use \Firebase\JWT\JWT;
require '../../vendor/autoload.php';
require 'functions.php';

$app = new Slim\App();


$app->get('/',function($request,$response,$args){
    $response->withStatus(200);
    echo "Welcome to Slim based API";
});
$app->post('/','addUser');

$app->post('/login','login');


$app->run();

function login($request,$response,$args){
    $json = $request->getParsedBody();
    $email = $json['email'];
    $password = $json['password'];

    try{
        $db = dbConnect();
        $sth = $db->prepare("SELECT * FROM ci_user WHERE email ='$email'");
        $sth->execute();

        $user = $sth->fetch(PDO::FETCH_OBJ);

        $db = null;

        if(password_verify($password, $user->password)){
            $firstName = $user->firstName;
            $lastName = $user->lastName;
            $userId = $user->userId;
            $token = array('id'=>$userId,'firstName'=>$firstName,'lastName'=>$lastName,'email'=>$email);
            $key = "xCrNT2xD4hD746qMCO3iyE8ml8MK205I";
            $jwt = JWT::encode($token, $key);
            return $response->withJson(array('authenticated'=>1,'','email'=>$email,'token'=>$jwt));
        }
        return $response->withJson(array('authenticated'=>0),401,0);
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addUser($request,$response,$args){
    $json = $request->getParsedBody();
    $firstName = $json['firstName'];
    $lastName = $json['lastName'];
    $email = $json['email'];
    $password = $json['password'];
    $hash = password_hash($password, PASSWORD_DEFAULT);
	try{
	    $db = dbConnect();
	    $sth = $db->prepare("INSERT INTO ci_user (firstName,lastName,email,password) VALUES ('$firstName','$lastName','$email','$hash')");
        $sth->execute();
        $db = null;
        return $response->withJson(array('registered'=>1));

    } catch(PDOException $e) {
        return $response->withJson(array('registered'=>0));
     }

}


function dbConnect(){
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="root";
	$dbname="ci";

	$mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbConnection;
}

?>