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

    waypointList.push(lnglat);

    var newCard = document.querySelector("#template-card");
    newCard.content.querySelector(".card").setAttribute("id", "waypointCard" + String(waypointList.length - 1));
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

function generateMission() {
    if (waypointList.length == 0) {
        alert("没有添加检查点。");
        return;
    }

    var missionID = document.getElementById("missionIDInput").value;
    var userID = document.getElementById("userIDInput").value;
    var missionDesc = document.getElementById("missionDesc").value;
    missionDesc = missionDesc.replace(/\r?\n/g, "\\n");
    // JSON file
    var jsonText = "{\n\t\"id\": \"" + missionID + "\",\n\t\"description\": \"" + missionDesc + "\"\n}";

    // GPX file
    var gpxText = [];
    gpxText.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<gpx version=\"1.1\" creator=\"Mission Authoring Tool for Patroute\">\n");
    var date = new Date();
    gpxText.push("\t<metadata>\n\t\t<name>" + String(missionID) + "</name>\n\t\t<time>" + date.toISOString()+ "</time>\n\t</metadata>\n")
    for (var i = 0; i < waypointList.length; i++) {
        var card = document.getElementById("waypointCard" + String(i));
        var title = card.querySelector("input").value;
        var desc = card.querySelector("textarea").value;
        desc = desc.replace(/\r?\n/g, "<br/>");
        gpxText.push("\t<wpt lat=\"" + waypointList[i].getLat() + "\" lon=\"" + waypointList[i].getLng() + "\">\n\t\t<name>" + title + "</name>\n\t\t<desc>" + desc + "</desc>\n\t</wpt>\n");
    }
    gpxText.push("</gpx>");

    var zip = new JSZip();
    zip.file(userID + ".json", jsonText);
    var gpxFolder = zip.folder("GPX");
    gpxFolder.file(String(missionID) + ".gpx", gpxText.join(""));

    zip.generateAsync({type:"blob"}).then(function(content) {
        var element = document.createElement("a");
        element.href = window.URL.createObjectURL(content)
        element.download = "Mission.zip";;
        element.style.display = "none";
        element.click();
    });
}
