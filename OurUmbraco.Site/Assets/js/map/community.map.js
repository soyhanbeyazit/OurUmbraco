﻿function initMap() {

    var map = new google.maps.Map(document.getElementById('map'),
        {
            zoom: 5,
            center: { lat: 0, lng: 0 }
        });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {            
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //Use the lat & lon of the users current location
            //To set the center of the map
            map.setCenter(pos);

        }, function () {
            //If we ever need todo handle error handling - or user denined permission
        });
    }

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    $.getJSON("/umbraco/api/mapapi/GetAllMemberLocations", function(data) {
        
        var markers = data.map(function(item) {
            var latlng = new google.maps.LatLng(item.Lat, item.Lon);
            var marker = new google.maps.Marker({
                position: latlng
            });

            var infowindow = new google.maps.InfoWindow({
                content: "<span>Loading</span>"
            });

            //Only render the HTML content - when you click the marker
            var html = "<a href='/member/" + item.Id + "' style='display:flex; align-items:center;'><img src='" + item.Avatar + "' title='" + item.Name + "' style='margin-right:5px;'/>" + item.Name + "</a>";

            marker.addListener('click', function () {
                infowindow.setContent(html);
                infowindow.open(map, marker);
            });

            return marker;
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map,
            markers,
            {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
    });
};