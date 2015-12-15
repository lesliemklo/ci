ciApp.factory("authenticationService",function($http,$location,$window,$cookieStore,$q){
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
                $cookieStore.put("token", token);
                $cookieStore.put("email", email);
                deferred.resolve(response)
            },function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function init() {
        if ($cookieStore.get("token")) {
            token = $cookieStore.get("token");
        }
        if ($cookieStore.get("email")) {
            email = $cookieStore.get("email");
        }

    }

    init()

    function isAuthenticated(){
        if(token) return true;
        return false;
    }

    function getToken(){
        return token;
    }

    function getEmail(){
        return email;
    }

    function logout(){
        $cookieStore.remove("token");
        $cookieStore.remove("email")
        init();
    }
});



ciApp.controller("loginController",function($scope,authenticationService,$location,$window){

    $scope.login = function(form){
        $scope.invalidCred = false;
        if(form) {
            authenticationService.login(form)
                .then(function(result){
                    $location.path('/dashboard');
                }, function(error){
                   $scope.invalidCred = true;
                });
        }
        else{
            $scope.invalidCred = true;
        }
    }


    $scope.notUser = function(){
        $location.path('/register');
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


ciApp.controller("registerController",function($scope,registrationService,$location,$q){

    $scope.register = function(form){

        $scope.emailTaken = false;

        registrationService.register(form)
            .then(function(result){
                $scope.userCreated = true;
            },function(error){
                $scope.userCreated = false;
                $scope.emailTaken = true;
                $scope.email = '';
            })
    }


    $scope.toLogin = function(){
        $location.path('/login');
    }


});



ciApp.controller("dashboardController",function($scope,authenticationService,$location){

    authenticationService.init()

    $scope.email = authenticationService.getEmail();

    $scope.logout = function(){
        authenticationService.logout();
        $location.path('/login');
    }

});

