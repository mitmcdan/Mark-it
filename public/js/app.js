(function () {
    var app = angular.module("mcswcd", ['ngRoute']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: "/app/views/landing.html",
                controller: "LandingCtrl"
            })
            .when('/register', {
                templateUrl: '/auth/register/farmerProfile.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/auth/register/farmerProfile.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .when('/searchResults/:item/:id', {
                templateUrl: "/app/views/searchResults.html",
                controller: "SearchResultsCtrl",
                controllerAs: 'vm'
            })
            .when('/admin', {
            	templateUrl: '/app/views/adminProfile.html',
            	controller: 'AdminProfileCtrl',
                resolve: {loggedIn: onlyLoggedIn},
                controllerAs: 'vm'
            })
            .when('/farmerProfile', {
                templateUrl: '/app/views/farmerProfile.html',
                controller: 'FarmerProfileCtrl',
                resolve: {loggedIn: onlyLoggedIn},
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
	}]);
    var onlyLoggedIn = function ($location, $q, authentication) {
        var deferred = $q.defer();
        if (authentication.isLoggedIn()) {
            deferred.resolve();
        } else {
            deferred.reject();
            $location.url('/landing.html');
        }
        return deferred.promise;
    };
})();
