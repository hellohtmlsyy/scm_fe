// import Axios from 'axios'

//获取cookie、
export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//设置cookie,增加到vue实例方便全局调用
export function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//删除cookie
export function delCookie(cname) {
    setCookie(cname, '', '-1');
}


// 判断设备
export function isDevice() {
    var ua = navigator.userAgent.toLowerCase()
    var u = navigator.userAgent
    var wxDevice = ua.match(/MicroMessenger/i) == 'micromessenger' //微信浏览器
    var appDevice = u.indexOf('/mcapp') >= 0 //app设备
    var adrDevice = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //安卓设备
    var iosDevice = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios设备
    if (wxDevice) {
        return '微信浏览器'
    } else if (appDevice) {
        if (adrDevice) {
            return 'adr'
        } else if (iosDevice) {
            return 'ios'
        }
    } else {
        return "其他浏览器"
    }

}

export function address() {

    var html = "";
    $("#input_city").append(html);
    $("#input_area").append(html);
    $.each(pdata, function(idx, item) {
        if (parseInt(item.level) == 0) {
            html += "" + item.names + "";
        }
    });
    $("#input_province").append(html);

    $("#input_province").change(function() {
        if ($(this).val() == "") return;
        $("#input_city option").remove();
        $("#input_area option").remove();
        var code = $(this).find("option:selected").attr("exid");
        code = code.substring(0, 2);
        var html = "--请选择--";
        $("#input_area").append(html);
        $.each(pdata, function(idx, item) {
            if (parseInt(item.level) == 1 && code == item.code.substring(0, 2)) {
                html += "" + item.names + "";
            }
        });
        $("#input_city").append(html);
    });

    $("#input_city").change(function() {
        if ($(this).val() == "") return;
        $("#input_area option").remove();
        var code = $(this).find("option:selected").attr("exid");
        code = code.substring(0, 4);
        var html = "--请选择--";
        $.each(pdata, function(idx, item) {
            if (parseInt(item.level) == 2 && code == item.code.substring(0, 4)) {
                html += "" + item.names + "";
            }
        });
        $("#input_area").append(html);
    });
}