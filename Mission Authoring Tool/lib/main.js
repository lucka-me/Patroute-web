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
    map.on('click', function(event) {
        createWaypoint(event.lnglat);
    })
}

function createWaypoint(lnglat) {
    var newMarker = new AMap.Marker({
        position: lnglat,
        label: {content: String(waypointList.length + 1), offset: AMap.Pixel(0, 0)}
    });
    markerList.push(newMarker);
    map.add(newMarker);

    waypointList.push({lnglat});

    var newCard = document.querySelector("#template-card");
    newCard.content.querySelector(".waypoint-card").setAttribute("id", "waypointCard" + String(waypointList.length - 1));
    newCard.content.querySelector("#waypointIndex").innerHTML = String(waypointList.length);
    newCard.content.querySelector("#removeButton").setAttribute("onclick", "removeAt(" + String(waypointList.length - 1) + ")");
    document.getElementById("waypointList").appendChild(newCard.content.cloneNode(true));
}

function removeAt(index) {
    waypointList.splice(index, 1);
    map.remove(markerList[index]);
    markerList.splice(index, 1);
    for (var i = index; i < markerList.length; i++) {
        markerList[i].setLabel({content: String(i + 1), offset: AMap.Pixel(0, 0)});
    }
    var card = document.getElementById("waypointCard" + String(index));
    card.parentNode.removeChild(card);
    for (var i = index + 1; i < markerList.length + 1; i++) {
        var card = document.getElementById("waypointCard" + String(i));
        card.setAttribute("id", "waypointCard" + String(i - 1));
        card.querySelector("#waypointIndex").innerHTML = String(i);
        card.querySelector("#removeButton").setAttribute("onclick", "removeAt(" + String(i - 1) + ")");
    }
}

function clearWaypoints() {
    while (waypointList.length > 0) {
        removeAt(0);
    }
}
