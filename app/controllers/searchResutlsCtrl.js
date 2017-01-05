(function () {
    angular.module("mcswcd").controller("SearchResultsCtrl", function ($scope, $routeParams, $http) {
        $scope.item = $routeParams.item
        $scope.id = $routeParams.id
        $scope.pins = [];
        if ($scope.id == "All") {
            $http({
                url: '/api/allfarmer/' + $scope.item
                , method: 'GET'
            }).success(function (data) {
                $scope.farmer = data;
                //module.exports
            }).error(function (data) {
                console.log(data);
                console.log('Error: ' + data);
            });
        }
        else if ($scope.id == "Organic") {
            $http({
                url: '/api/organic/' + $scope.item
                , method: 'GET'
            }).success(function (data) {
                $scope.farmer = data;
                //module.exports
            }).error(function (data) {
                console.log(data);
                console.log('Error: ' + data);
            });
        }
        else if ($scope.id == "Open") {
            $http({
                url: '/api/open/' + $scope.item
                , method: 'GET'
            }).success(function (data) {
                $scope.farmer = data;
                //module.exports
            }).error(function (data) {
                console.log(data);
                console.log('Error: ' + data);
            });
        };
        drawMap();

        function drawMap() {
            var marketId = [];
            var allLatlng = [];
            var infoWindow = null;
            var pos;
            var userCords;
            var tempMarkerHolder = [];
            //Start Geolocation
            if (navigator.geolocation) {
                function error(err) {
                    console.warn('ERROR(' + err.code + '):' + err.message);
                }

                function success(pos) {
                    userCords = pos.coords;
                    console.log("pos", pos);
                    console.log("userCords", userCords);
                    //Google Map Options Start
                    var mapOptions = {
                        zoom: 14
                        , disableDefualtUI: true
                        , center: new google.maps.LatLng(userCords.latitude, userCords.longitude)
                        , panControl: true
                        , panControlOptions: {
                            position: google.maps.ControlPosition.BOTTOM_LEFT
                        }
                        , zoomControl: true
                        , zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.LARGE
                            , position: google.maps.ControlPosition.RIGHT_BOTTOM
                        }
                        , streetViewControl: false
                        , scaleControl: false
                        , rotateControl: false
                        , fullscreenControl: false
                        , mapTypeId: 'roadmap'
                    };
                    //Google Map Options End
                    //Start Map load
                    stand_map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    //Start User Location Marker
                    var userMarker = new google.maps.LatLng(userCords.latitude, userCords.longitude);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(userCords.latitude, userCords.longitude)
                        , map: stand_map
                        , title: 'testing'
                        , icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    });
                    //Info Window Content
                    var infoWindowContent = [];
                    for (i = 0; i < $scope.farmer.length; i++) {
                        infoWindowContent.push('<div class="info_content">' 
                            + '<h3>' + $scope.farmer[i].farm_name + '</h3>' 
                            + '<p>' + $scope.listProducts($scope.farmer[i]) + '</p>' 
                            + '<a href="https://www.google.com/maps/dir/Current+Location/' + $scope.farmer[i].stand[0].location.lat + ',' + $scope.farmer[i].stand[0].location.lon + '" target="_blank">' + "Get Direcitons" + '<a>' + '</div>')
                    }
                    //Displays multiple markers on the actual map-canvas
                    var infoWindow = new google.maps.InfoWindow()
                        , marker, i;
                    //Loops through each of the arrays of markers
                    for (i = 0; i < $scope.farmer.length; i++) {
                        var position = new google.maps.LatLng($scope.farmer[i].stand[0].location.lat, $scope.farmer[i].stand[0].location.lon);
                        //bounds.extend(position);
                        marker = new google.maps.Marker({
                            position: position
                            , map: stand_map
                            , title: $scope.farmer[i].farm_name
                            , icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        });
                        $scope.pins.push(marker);
                        //Makers each marker have a different info window
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infoWindow.setContent(infoWindowContent[i]);
                                infoWindow.open(stand_map, marker);

                                removeHighlightClass();
                                $(".sidebar").children().eq(i).addClass('sidebar-selected');
                            }
                        })(marker, i));

                        google.maps.event.addListener(infoWindow, 'closeclick', function(){
                            removeHighlightClass();
                        });

                        //Auto center map with all markers
                        //Was Causing the for loop to only use the first object
                        //                        map.fitBounds(bounds);
                    }
                    //Makes sure the zoom level is set right
                    var boundsListener = google.maps.event.addListener((stand_map), 'bounds_changed', function () {
                        this.setZoom(14);
                        google.maps.event.removeListener(boundsListener);
                    });
                }
                //End Farm Stand Markers and info windows
                navigator.geolocation.getCurrentPosition(success, error);
            }
            else {
                alert('Geolocation is not supported in your browser');
            }
            //End Geolocation
        };
        //End Geolocation
        //Getting error 'Cannot read property 'firstChild' of null'
        //Enter data base logic here???
        // };
        //function that returns the full address of the farmer location

        removeHighlightClass = function() {
            var sidebar_items = $(".sidebar").children()
            for (var j = 0; j < sidebar_items.length; j++){
                sidebar_items.eq(j).removeClass('sidebar-selected');
            }
        };

        $scope.getFarmLocation = function (farmer) {
            var location = farmer.stand[0].location;
            return location.street + ", " + location.city;
        };

        $scope.hasProduct = function (farmer, category) {
            if (farmer.stand[0].products[category].length == 0) {
                return false;
            }
            else {
                return true;
            }
        };

        $scope.listProducts = function (farmer) {
            var prodList = "";
            var prodCat = Object.keys(farmer.stand[0].products);
            for (i = 0; i < prodCat.length; i++) {
                if (farmer.stand[0].products[prodCat[i]].length > 0) {
                    prodList = prodList.concat(farmer.stand[0].products[prodCat[i]].join(", ") + ", ");
                }
            }
            return prodList;
        };

        $scope.highlightSidebar = function(item_index) {
            google.maps.event.trigger($scope.pins[item_index], 'click');
        }
    });
})();