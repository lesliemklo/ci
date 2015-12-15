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

$app->post('/user','getUser');

$app->post('/login','login');


$app->run();

function login($request,$response,$args){
    $json = $request->getParsedBody();

    $email = sanitize($json['email']);
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) return $response->withJson(array('authenticated'=>0),401,0);
    $password = sanitize($json['password']);

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
            $key = "xCrNT2xD4hD746qMCO3iyE8ml8MK205I";
            $token = array('id'=>$userId,'firstName'=>$firstName,'lastName'=>$lastName,'email'=>$email);
            $jwt = JWT::encode($token, $key);
            return $response->withJson(array('authenticated'=>1,'','email'=>$email,'token'=>$jwt));
        }
        return $response->withJson(array('authenticated'=>0),401,0);
    }
    catch(PDOException $e) {
        return $response->withJson(array('authenticated'=>0),401,0);
    }
}

function addUser($request,$response,$args){
    $json = $request->getParsedBody();
    $firstName = sanitize($json['firstName']);
    $lastName = sanitize($json['lastName']);
    $email = sanitize($json['email']);
    $password = sanitize($json['password']);
    $hash = password_hash($password, PASSWORD_DEFAULT);
	try{
	    $db = dbConnect();
	    $sth = $db->prepare("INSERT INTO ci_user (firstName,lastName,email,password) VALUES ('$firstName','$lastName','$email','$hash')");
        $sth->execute();
        $db = null;
        return $response->withJson(array('registered'=>1));

    } catch(PDOException $e) {
        return $response->withJson(array('registered'=>0),401,0);
     }

}

function getUser($request,$response,$args){
    $json = $request->getParsedBody();
    $jwt = $json['token'];
    $key = "xCrNT2xD4hD746qMCO3iyE8ml8MK205I";
    try{
        $decoded = JWT::decode($jwt, $key, array('HS256'));
        return $response->withJson($decoded,200);
    }
    catch(Exception $u){
        echo '{"error":{"text":'. $u->getMessage() .'}}';
    }
}


?>