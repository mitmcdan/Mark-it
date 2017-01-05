(function () {
    angular.module("mcswcd").controller("FarmerProfileCtrl", function ($scope, $routeParams, $http, authentication, $httpParamSerializer) {
        $scope.edit = false;
        $scope.message = "Farmer Profile Page";

        $scope.farmer = {};

        var userId = authentication.currentUser();

        $http({
            url: '/api/getFarmerById/' + userId,
            method: 'GET'
        }).success(function(data){
            $scope.farmer = data;
            console.log("farmer", $scope.farmer);
        }).error(function(data) {
            console.log('Error:', data);
        })

        $scope.addStand = function() {
            if ($scope.farmer.stand.length < 3) {
                            var standNum = $scope.farmer.stand.length + 1;
                var newStand = {
                    "name": "Stand " + standNum,
                    "open": false,
                    "products": {
                        "comm": [],
                        "meat": [],
                        "flower": [],
                        "fruit": [],
                        "veg": []
                    },
                    "location": {
                        "street": "Stand Address",
                        "city": "",
                        "state": "",
                        "zip": 0,
                        "lat": 0,
                        "lon": 0
                    }
                };

                // $scope.farmer.stand.push(newStand);

                $http({
                    url: '/api/addStand/' + userId + '/' + JSON.stringify(newStand),
                    method: 'POST'
                }).success(function(data) {
                    $scope.farmer.stand.push(data);
                }).error(function(data) {

                });
            } else {
                alert("Sorry, you are only allow to have 3 stands. Please edit your existing stands.")
            }

        };
        

        $scope.updateStand = function(stand) {
            console.log(stand);
            $http({
                url: '/api/updateStand/' + userId + '/' + stand._id + '/' + JSON.stringify(stand),
                method: 'POST'
            }).success(function(data) {

            }).error(function(data) {

            });
            $scope.isEditingModal();
        };

        $scope.updateFarmer = function() {
            console.log($scope.farmer);
            $http({
                url: '/api/updateFarmer/' + userId  + '/' + JSON.stringify($scope.farmer),
                method: 'POST'
            }).success(function(data) {

            }).error(function(data) {

            });
            $scope.isEditing();
        };

        $scope.deleteStand = function(stand) {
            console.log("_id", stand._id);
            var confirmDelete = confirm("Are you sure you want to delete this stand?");
            if (confirmDelete == true){
                $http({
                    url: '/api/deleteStand/' + userId + '/' + stand._id,
                    method: 'DELETE'
                }).success(function(data) {
                    window.location.reload();
                }).error(function(data){

                });
            }
        };

        $scope.isEditing = function () {
            $scope.edit = !$scope.edit;
        };
        $scope.isEditingModal = function () {
            $scope.editModal = !$scope.editModal;
        };
        
        $scope.addFarmerItem = function (editStand, item) {
            console.log("In addFarmerItem")
            console.log("editStand", editStand)
            //console.log(stand)
            //var newItem = $scope.farmer.stand.length+1;
            editStand.products[item].push("")
            console.log("$scope.farmer.stand", $scope.farmer.stand)
        };
        
        $scope.deleteFarmerItem = function (editStand, item) {
            console.log("In addFarmerItem")
            console.log("editStand", editStand)
            //console.log(stand)
            //var newItem = $scope.farmer.stand.length+1;
            editStand.products[item].splice(0,1)
            console.log("$scope.farmer.stand", $scope.farmer.stand)
        };


        $scope.listProduct = function(catagory) {
            return catagory.join(", ");
        };

        $scope.combineAddressInfo = function(address) {
            var fullAddress = "";
            for (loc in address){
                if (address[loc] != "" && loc != "lat" && loc != "lon"){
                    if (loc == 'state' || loc == 'city'){
                        fullAddress += ","
                    }
                    fullAddress += " " + address[loc];
                }
            }
            return fullAddress;
        };

        $scope.resetEditingModal = function() {
            $scope.editModal = false;
        }


        $scope.checkProductLength = function(prod) {
            return prod.length;
        }
    });
})();