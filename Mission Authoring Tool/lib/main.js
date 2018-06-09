/**
 * Created by lucka on 06/09/2018.
 * @author lucka-me
 */

var map;
var waypointList = [];
var markerList = [];

function initMap() {
    map = new AMap.Map(document.getElementById("map"), {
        zoom: 10,
        viewMode:'3D'
    });
    AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.MapType',
    ], function(){
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.MapType());
    });
}

function removeAt(i) {
    waypointList.split(i, 1);
    map.remove(markerList[i]);
    markerList.split(i, 1);
}

function clearWaypoints() {
    waypointList = [];
    for (var i = 0; i < markerList.length; i++) {
        map.remove(markerList[i]);
    }
    markerList = [];
}
