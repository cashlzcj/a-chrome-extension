/**
 * Created by junge on 15/8/21.
 */

window.addEventListener ("load", run_automatic, false);

var timerOut = null;
function run_automatic (evt) {
    var jsInitChecktimer = setInterval (checkForJS_Finish, 100);

    function checkForJS_Finish () {
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
        console.log("array count", array.length);
        console.log("index", index+1);
        sessionStorage.currentIndex = 0;
        localStorage.total = Number(localStorage.total) + array.length;
        if($("a.next")[0]){
            $("a.next")[0].click();
            reloadAfter(4);
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

    getRoomDetail(function (brs) {
        sessionStorage.currentIndex = index + 1;
        if (brs) {
            $("#id_batch_set_onsale").click();
            timerOut = setTimeout(function () {
                putaway(array, index);
            }, 2000);
        }
        else {
            console.log("这个房型没有配额");
            reloadAfter(2);
        }
    });
}

// 上架
function putaway(array, index){
    clearTimerout(timerOut);
    //$(".mlr")[0].click();
    putawayRequest();

    // 10秒后进入下一轮
    //timerOut = setTimeout(function(){
    //    location.reload();
    //}, 10000);
}

// 清理timeout
function clearTimerout(timer){
    if(timer){
        clearTimeout(timerOut);
        timerOut = null;
    }
}

// 上架请求
function putawayRequest(){
    var id = $(".test4select:checked").val();
    $.ajax(
        {
            url:"http://mangocity.fangcang.com/HPMS/batchCommodityOnsale.shtml",
            dataType:"json",
            data:{
                "commodityOnSaleVO.city":$("#cityCode").val(),
                "commodityOnSaleVO.commodityIds":id,
                "commodityOnSaleVO.isOnSale":1
            },
            success:function(result)
            {
                $('#popup_exit')[0].click();
                reloadAfter(1);
            }
        });
}

function reloadAfter(second){
    timerOut = setTimeout(function(){
        location.reload();
    }, second * 1000);
}

// 获取房间数据
function getRoomDetail(callback){
    $.ajax({
        url:"http://mangocity.fangcang.com/HPMS/hotelPriceDetailAction!toDayPriceDetail.shtml",
        data:{
            "commodityId":$(".test4select:checked").val(),
            "cityCode":$("#cityCode").val()
        },
        dataType: "html",
        type: "POST",
        target:"#dayPriceDetailResult",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success:function(result){
            callback(verifyRoomQuota($.makeArray($("#commodityQuotaList tr", $('<div>').append(result)))));
        },
        error:function(result){
            callback(false);
        }
    });
}

function verifyRoomQuota(quotas){
    for(var i=0; i<quotas.length; ++i){
        var text = $("td:eq(6)", $(quotas[i])).text();
        // 如果发现一个有存量的说明可以上
        if(verifyNum(text.replace(/\n|\s/g, ''))){
           return true;
        }
    }

    return false;
}

function verifyNum(str){
    var array = str.split("/");
    for(var i=0; i<array.length; ++i){
        if(parseInt(array[i]) > 0){
            //console.log(parseInt(array[i]));
            return true;
        }
    }

    return false;
}
