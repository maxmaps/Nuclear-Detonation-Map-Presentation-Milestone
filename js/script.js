//map and tilelayer
var myMap = L.map("mapid", {
    maxZoom: 17,
    minZoom: 2,
    maxBounds: [[-85,-180.0], [85,180.0]],
}).setView([38.82259, 0], 2);
    tiles = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                accessToken: 'pk.eyJ1Ijoic2NobWl0bWEiLCJhIjoiY2o4a3phaW11MGowMTJ2anM5d2JhMmc3ZyJ9.AUgXecxV7PFNkmL9Xdj6-g',
                id: 'mapbox.streets-satellite',
                noWrap: true
            }).addTo(myMap);

//adding dataset
addSipriReport();
function addSipriReport() {
    $.getJSON( "data/sipri-report-explosions-geojson-edit.geojson", function( data ) {
        var sipriReport = data;
        for (var index = 0; index < sipriReport.features.length; index++) {
            sipriReport.features[index].properties.date_long_moment = moment(sipriReport.features[index].properties.date_long, "YYYYMMDD");
        };
        sipriReportTimeline(sipriReport);
    });
};

//markers and marker clusters
var sipriReportPointToLayer = function (feature, latlng){
    var sipriReportMarker = L.marker(latlng);
    sipriReportMarker.bindPopup("<strong>Name:</strong> " + feature.properties.name + "<br/><strong>Country:</strong> " + feature.properties.country + "<br/><strong>Date:</strong> " + feature.properties.date_long3 + "<br/><strong>Region:</strong> " + feature.properties.region + "<br/><strong>Type:</strong> " + feature.properties.type + "<br/><strong>Purpose:</strong> " + feature.properties.purpose+ "<br/><strong>Depth</strong> " + feature.properties.depth + "<br/><strong>Lower Yield:</strong> " + feature.properties.yield_1 + "<br/><strong>Upper Yield:</strong> " + feature.properties.yield_u);
    markers.addLayer(sipriReportMarker);
    return markers;
}

var markers = L.markerClusterGroup({
    singleMarkerMode: true,
    spiderfyDistanceMultiplier: 1.5,
    animateAddingMarkers: true,
    waitToUpdateMap: true,
});

//timeline
function sipriReportTimeline(data){
    var getInterval = function(feature) {
        return {
            start: feature.properties.date_long_moment,
            end: moment("1998-05-30"),
        };
    };
    var timelineControl = L.timelineSliderControl({
        formatOutput: function(date){
            return new Date(date).toLocaleDateString();
        },
        duration: 100000,
    });
    var timeline = L.timeline(data, {
        getInterval: getInterval,
        pointToLayer: sipriReportPointToLayer,
    });
    timelineControl.addTo(myMap);
    timelineControl.addTimelines(timeline);
    timeline.addTo(myMap);
};
