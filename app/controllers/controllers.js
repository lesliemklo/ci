ciApp.controller("loginController",function($scope,authenticationService,$location){

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

ciApp.controller("registerController",function($scope,registrationService,$location){

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



ciApp.controller("dashboardController",function($scope,authenticationService,$location,userService,$cookies){

    authenticationService.init()

    $scope.email = authenticationService.getEmail();
    $scope.user = userService.getUser($cookies.token);

    $scope.logout = function(){
        authenticationService.logout();
        $location.path('/login');
    }

});