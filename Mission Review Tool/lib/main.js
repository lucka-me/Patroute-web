/**
 * Created by lucka on 06/16/2018.
 * @author lucka-me
 */

var map;
var locationList = [];
var markerList = [];
var routePolyline;

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

function openLogFile() {
    var element = document.createElement("input");
    element.type = "file";
    element.accpet = ".log";
    element.addEventListener('change', loadLog, false);
    element.click();
}

function loadLog(event) {
    var file = event.target.files[0];
    if (!file) {
        alert("载入文件出错。");
        return;
    }
    var fileReader = new FileReader();
    fileReader.onload = function() {
        clearAll();

        var lineList = fileReader.result.split("\n");
        for (var i = 0; i < lineList.length; i++) {

            if (lineList[i].startsWith("VER")) {

                var line = lineList[i].split(" ");
                var newCard = document.querySelector("#template-card-title");
                newCard.content.querySelector("#logIcon").innerHTML = String("<i class=\"fas fa-info-circle fa-fw\"></i>");
                newCard.content.querySelector("#logTitle").innerHTML = String("客户端版本 " + line[1] + " (" + line[2] + ")");
                document.getElementById("logList").appendChild(newCard.content.cloneNode(true));

            } else if (lineList[i].startsWith("MID")) {

                var line = lineList[i].split(" ");
                document.getElementById("missionIDInput").value = line[1];

            } else if (lineList[i].startsWith("UID")) {

                var line = lineList[i].split(" ");
                document.getElementById("userIDInput").value = line[1];

            } else if (lineList[i].startsWith("STA")) {

                var line = lineList[i].split(" ");
                var newCard = document.querySelector("#template-card-desc");
                newCard.content.querySelector("#logIcon").innerHTML = String("<i class=\"fas fa-arrow-alt-circle-up fa-fw\"></i>");
                newCard.content.querySelector("#logTitle").innerHTML = String("[" + line[1] + "] " + line[2] + ", " + line[3]);
                newCard.content.querySelector("#logDesc").innerHTML = String(line[4]);
                document.getElementById("logList").appendChild(newCard.content.cloneNode(true));
                locationList.push(new AMap.LngLat(line[2], line[3]));

            } else if (lineList[i].startsWith("LOC")) {

                var line = lineList[i].split(" ");
                var newCard = document.querySelector("#template-card-title");
                newCard.content.querySelector("#logIcon").innerHTML = String("<i class=\"fas fa-map-marker-alt fa-fw\"></i>");
                newCard.content.querySelector("#logTitle").innerHTML = String("[" + line[1] + "] " + line[2] + ", " + line[3]);
                document.getElementById("logList").appendChild(newCard.content.cloneNode(true));
                locationList.push(new AMap.LngLat(line[2], line[3]));

            } else if (lineList[i].startsWith("CHK")) {

                var line = lineList[i].split(" ");
                var newCard = document.querySelector("#template-card-desc");
                newCard.content.querySelector("#logIcon").innerHTML = String("<i class=\"fas fa-check-square fa-fw\"></i>");
                newCard.content.querySelector("#logTitle").innerHTML = String("[" + line[1] + "] " + line[2] + ", " + line[3]);
                var waypointTitle = line[4];
                if (line.length > 5) {
                    for (var j = 5; j < line.length; j++) {
                        waypointTitle = waypointTitle + " " + line[j];
                    }
                }
                newCard.content.querySelector("#logDesc").innerHTML = String("检查完成：" + line[4]);
                document.getElementById("logList").appendChild(newCard.content.cloneNode(true));
                var location = new AMap.LngLat(line[2], line[3]);
                locationList.push(location);
                var marker = new AMap.Marker({
                    content: "<div class=\"square-20 bg-white roundy-c\"><i class=\"t-primary font-20 fas fa-check-circle\"></i></div>",
                    offset: new AMap.Pixel(-10, -10),
                    position: location,
                });
                markerList.push(marker);

            } else if (lineList[i].startsWith("REP")) {

                var line = lineList[i].split(" ");
                var newCard = document.querySelector("#template-card-desc");
                newCard.content.querySelector("#logIcon").innerHTML = String("<i class=\"fas fa-bug fa-fw\"></i>");
                newCard.content.querySelector("#logTitle").innerHTML = String("[" + line[1] + "] " + line[2] + ", " + line[3]);
                var reportDesc = "";
                if (line.length > 5) {
                    reportDesc = line[5];
                    if (line.length > 6) {
                        for (var j = 6; j < line.length; j++) {
                            reportDesc = reportDesc + " " + line[j];
                        }
                    }
                }
                newCard.content.querySelector("#logDesc").innerHTML = String(line[4] + "<br/>" + reportDesc);
                document.getElementById("logList").appendChild(newCard.content.cloneNode(true));
                var location = new AMap.LngLat(line[2], line[3]);
                locationList.push(location);
                var marker = new AMap.Marker({
                    content: "<div class=\"square-20 bg-white roundy-c\"><i class=\"t-accent font-20 fas fa-exclamation-circle\"></i></div>",
                    offset: new AMap.Pixel(-10, -10),
                    position: location,
                });
                markerList.push(marker);

            } else if (lineList[i].startsWith("WRN")) {

                var line = lineList[i].split(" ");
                var newCard = document.querySelector("#template-card-desc");
                newCard.content.querySelector("#logIcon").innerHTML = String("<i class=\"fas fa-exclamation-triangle fa-fw\"></i>");
                newCard.content.querySelector("#logTitle").innerHTML = String("[" + line[1] + "] " + line[2] + ", " + line[3]);
                var warningDesc = "";
                if (line.length > 4) {
                    warningDesc = line[4];
                    if (line.length > 5) {
                        for (var j = 5; j < line.length; j++) {
                            warningDesc = warningDesc + " " + line[j];
                        }
                    }
                }
                newCard.content.querySelector("#logDesc").innerHTML = String(warningDesc);
                document.getElementById("logList").appendChild(newCard.content.cloneNode(true));
                locationList.push(new AMap.LngLat(line[2], line[3]));

            }

        }

        routePolyline = new AMap.Polyline({
            path: locationList,
            strokeColor: "#0068B7",
            strokeWeight: 2,
            strokeOpacity: 1.0
        });
        map.add(routePolyline);
        map.add(markerList);
        map.setBounds(routePolyline.getBounds());
    };
    fileReader.readAsText(file);
}

function clearAll() {
    map.clearMap();
    markerList.splice(0, markerList.length);
    locationList.splice(0, locationList.length);
    document.getElementById("missionIDInput").value = "M";
    document.getElementById("userIDInput").value = "U";
    document.getElementById("logList").innerHTML = "";
}
