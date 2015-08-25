/**
 * Created by junge on 15/8/21.
 */
(function(){
    var $ = function(id){return document.getElementById(id);}
    var $C = function(className){return document.getElementsByClassName(className);}
    $('start').onclick = function(){
        //sessionStorage.running = true;
        alert("start");
        //chrome.tabs.sendRequest({running: "start"}, function(response) {
        //    console.log(response.farewell);
        //});
    }

    $('stop').onclick = function(){
        //sessionStorage.running = false;
        alert("stop");
        //chrome.tabs.sendRequest({running: "stop"}, function(response) {
        //    console.log(response.farewell);
        //});
    }
})();
