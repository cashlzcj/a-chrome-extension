/**
 * Created by junge on 15/8/21.
 */

//chrome.tabs.onRequest.addListener(
//    function(request, sender, sendResponse) {
//        console.log(request.running);
//        //console.log(sender.tab ?
//        //"from a content script:" + sender.tab.url :
//        //    "from the extension");
//        //if (request.greeting == "hello")
//        //    sendResponse({farewell: "goodbye"});
//        //else
//        //    sendResponse({}); // snub them.
//        sendResponse({running: "start"});
//    });

window.addEventListener ("load", run_automatic, false);
//window作用域下覆盖alert的方法
//window.alert = function(str){
//    console.log(str);
//}

//window.onbeforeunload = function(event){
//    // 关闭
//    if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey) {
//        return "确定要关闭吗?";
//    }else{ // 刷新
//        return "你正在刷新页面";
//    }
//}

var timerOut = null;
function run_automatic (evt) {
    var jsInitChecktimer = setInterval (checkForJS_Finish, 100);

    function checkForJS_Finish () {
        //var running = sessionStorage.running;
        //console.log(running);
        var test4Arr = $(".test4select");
        if(test4Arr.length > 0) {
            clearInterval (jsInitChecktimer);
            var cunrrentIndex = sessionStorage.currentIndex;
            if(cunrrentIndex === undefined){
                cunrrentIndex = 0;
                localStorage.lastBeginTime =localStorage.beginTime;
                localStorage.lastTotal = localStorage.total;
                localStorage.lastEndTime = localStorage.endTime;

                localStorage.beginTime = new Date();
                localStorage.total = 0;
                localStorage.endTime = 0;
            }

            //console.log("cunrrentIndex",cunrrentIndex);
            //console.log("array length",$.makeArray(test4Arr).length);
            begin($.makeArray(test4Arr), Number(cunrrentIndex));
        }
    }
}

// 开始
function begin(array, index){
    clearTimerout(timerOut);
    if(index+1 > array.length){
        //console.log("array count", array.length);
        //console.log("index", index+1);
        sessionStorage.currentIndex = 0;
        localStorage.total = Number(localStorage.total) + array.length;
        if($("a.next")[0]){
            $("a.next")[0].click();
            timerOut = setTimeout(function(){
                location.reload();
            },1000);
        }
        else{
            // 结束了
            localStorage.endTime = new Date();
            var result = "开始时间:"+localStorage.beginTime+"\n"+"结束时间:"+localStorage.endTime+"\n"+"共点击了"+localStorage.total+"个房型";
            alert(result);
        }
        return;
    }

    array[index].checked = true;
    $("#id_batch_set_onsale").click();
    timerOut = setTimeout(function(){
        putaway(array, index);
    },2000);
}

// 上架
function putaway(array, index){
    clearTimerout(timerOut);
    $(".mlr")[0].click();
    sessionStorage.currentIndex = index + 1;

    // 10秒后进入下一轮
    timerOut = setTimeout(function(){
        location.reload();
    }, 10000);
}

// 清理timeout
function clearTimerout(timer){
    if(timer){
        clearTimeout(timerOut);
        timerOut = null;
    }
}


//function begin(item, callback){
//    //console.log(item);
//    item.checked = true;
//    $("#id_batch_set_onsale").click();
//    // 延迟1秒上架
//    console.log("x1");
//    setTimeout(function(){
//        putaway(callback);
//    },1000);
//}

// 上架
//function putaway(callback){
//    $(".mlr")[0].click();
//    callback(null);
//    //blooping = true;
//    console.log("x2");
//    //setTimeout(close,1000);
//    //sleep(1500);
//}

// 点 x 关闭
//function close(){
//    //blooping = false;
//    //console.log(document.getElementById("popup_exit_1"));
//    //console.log($("#popup_exit_1"));
//    //return;
//    //$("#popup_exit_1").click();
//    console.log("x3");
//}
//
//function sleep(d){
//    for(var t = Date.now();Date.now() - t <= d;);
//}