(function () {
    angular.module("mcswcd")
        .controller("IndexCtrl", function ($scope, $location, authentication) {
            $scope.login = true;
            $scope.register = true;
            var vm = this;
            console.log(vm);
            $scope.credentials = {
                email : "",
                password : "",
                first_name : "",
                last_name: "",
                farmname : "",
            };
        
            //console.log("credentials", $scope.credentials);
            $scope.isLoggedIn = authentication.isLoggedIn();

            $scope.currentUser = authentication.currentUser();

            $scope.isRegistering = false;

            
        
            $scope.regFunc = function () {
                console.log("in on submit")
                authentication
                .register($scope.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    $('#loginModal').modal('hide');
                    console.log("then credentials", $scope.credentials);
                    $scope.isLoggedIn = authentication.isLoggedIn();
                    $location.path('/farmerProfile');
                });
            console.log("onSubmit")
            console.log($scope.credentials)
            };

            $scope.loginFunc = function () {
                authentication
                .login($scope.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    $('#loginModal').modal('hide');
                    $scope.isLoggedIn = authentication.isLoggedIn();
                    $location.path('/farmerProfile');
                });
            };

            
            $scope.logoutFunc = function () {
                authentication.logout($scope.credientails);
                $scope.isLoggedIn = authentication.isLoggedIn();
                $('#logoutModal').modal('hide');
                $location.path('/');
            };

            $scope.toggleRegister = function() {
                console.log("in toggleRegister");
                $scope.isRegistering = !$scope.isRegistering;
            };
            
            $scope.profileLink = function() {
                console.log("currentUser")
                $location.path('/farmerProfile');
            };
    });
})();

