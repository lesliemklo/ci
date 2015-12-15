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



ciApp.controller("dashboardController",function($scope,authenticationService,$location,$cookieStore,userService){

    authenticationService.init()

    $scope.email = authenticationService.getEmail();
    $scope.user = userService.getUser($cookieStore.get('token'));

    $scope.logout = function(){
        authenticationService.logout();
        $location.path('/login');
    }

});