(function () {
    angular.module("mcswcd")
        .controller("LandingCtrl", function ($scope) {
            // controller logic goes here
            $scope.message = "Where's the fruit?!";
            $scope.login = true;
            $scope.names = [{
                id: 0,
                name: "All"
            }, {
                id: 1,
                name: "Open"
            }, {
                id: 2,
                name: "Organic"
            }];
            $scope.selected = $scope.names[0].name;
            $scope.links = [{
                href: "http://www.in.gov/isda/",
                name: "Indiana Department of Agriculture"
            }, {
                href: "http://www.in.gov/isda/",
                name: "Indiana Department of Agriculture"
            }, {
                href: "http://www.in.gov/isda/",
                name: "Indiana Department of Agriculture"
            }]


        });
})();
