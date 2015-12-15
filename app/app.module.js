var ciApp = angular.module('ciApp', [
    'ngRoute','ngMessages','ngCookies'
]);

ciApp.factory("authenticationService",function($http,$location,$window,$cookies,$q){
    var service = {};

    service.login = login;
    service.getToken = getToken;
    service.init = init;
    service.isAuthenticated = isAuthenticated;
    service.getEmail = getEmail;
    service.logout = logout;


    return service;

    var token;
    var email;

    function login(form){

        var deferred = $q.defer();

        var obj = {
            'email': form.email,
            'password': form.password
        };
        $http.post('api/index.php/login',obj)
            .then(function(response) {
                token = response.data.token;
                email = response.data.email;
                $cookies.token = token;
                $cookies.email = email;
                deferred.resolve(response)
            },function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function init() {
        if ($cookies.token) {
            token = $cookies.token;
        }
        if ($cookies.email) {
            email = $cookies.email;
        }

    }

    init()

    function isAuthenticated(){
        if(typeof token !== "undefined") return true;
        return false;
    }

    function getToken(){
        return token;
    }

    function getEmail(){
        return email;
    }

    function logout(){
        $cookies.token = undefined;
        $cookies.email = undefined;
        init();
    }
});


ciApp.factory("registrationService",function($http,$location,$q){
    var service = {};

    service.register = register;

    return service;


    function register(form){

        var deferred = $q.defer();

        var obj = {
            'firstName': form.firstName.$modelValue,
            'lastName': form.lastName.$modelValue,
            'email': form.email.$modelValue,
            'password': form.password1.$modelValue
        };

        $http.post('api/index.php',obj)
            .then(function(response){
                deferred.resolve(response)
            },function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    }
});




ciApp.factory("userService",function($http,$q){
    var service = {};

    service.getUser = getUser;

    return service;

    function getUser(token){

        var deferred = $q.defer();

        var obj = {
            'token': token
        };

        $http.post('api/index.php/user',obj)
            .then(function(response){
                deferred.resolve(response)
            },function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    }
});