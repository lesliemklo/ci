ciApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginController',
        }).
        when('/register', {
            templateUrl: 'views/register.html',
            controller: 'registerController'
        }).
        when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardController',
            resolve: {
                auth: function(authenticationService,$location){
                    authenticationService.init();
                    if(!authenticationService.isAuthenticated()) $location.path('/login');
                }
            }
        }).
        otherwise({
            redirectTo: '/dashboard'
        });
    }]);