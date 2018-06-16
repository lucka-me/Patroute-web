/**
 * Created by lucka on 06/16/2018.
 * @author lucka-me
 */

var map;

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
    element.addEventListener('change', loadLogFile, false);
    element.click();
}

function loadLogFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
}
