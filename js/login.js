jQuery.Huitab = function (tabBar, tabCon, class_name, tabEvent, i) {
    var $tab_menu = $(tabBar);
    // 初始化操作
    $tab_menu.removeClass(class_name);
    $(tabBar).eq(i).addClass(class_name);
    $(tabCon).hide();
    $(tabCon).eq(i).show();

    $tab_menu.bind(tabEvent, function () {
        $tab_menu.removeClass(class_name);
        $(this).addClass(class_name);
        var index = $tab_menu.index(this);
        $(tabCon).hide();
        $(tabCon).eq(index).show()
    })
};

$(function () {
    $.Huitab("#tab_demo .tabBar span", "#tab_demo .tabCon", "current", "click", "1")
});

function organize_login() {
    let username = document.getElementById("org_username").value;
    let password = document.getElementById("org_password").value;
    if (username.length === 0) {
        HiAlert("username is empty");
        return ""
    }
    if (password.length === 0) {
        HiAlert("username is empty");
        return ""
    }
    $.ajax({
        url: "http://api.fsh.ink/v1/organize/login",
        method: "POST",
        dataType: "json",
        data: {
            username: username,
            password: password,
        },
        success: function (evt, req) {
            if (req === "success") {
                console.log(evt);
                if (evt['flag']) {
                    cookie.set("organize_name", evt['name']);
                    cookie.set("organize_token", evt['token']);
                    cookie.set("organize_id", evt['id']);
                    HiAlert("登陆成功");
                    window.setTimeout("window.location='index.html'",2000);
                } else {
                    HiAlert(evt['message'])
                }
            } else {
                HiAlert("ajax fail")
            }
        }
    });
}

function player_login() {
    let username = document.getElementById("player_username").value;
    let password = document.getElementById("player_password").value;
    if (username.length === 0) {
        HiAlert("username is empty");
        return ""
    }
    if (password.length === 0) {
        HiAlert("username is empty");
        return ""
    }
    $.ajax({
        url: "http://api.fsh.ink/v1/player/login",
        method: "POST",
        dataType: "json",
        data: {
            username: username,
            password: password,
        },
        success: function (evt, req) {
            if (req === "success") {
                console.log(evt);
                if (evt['flag']) {
                    cookie.set("player_name", evt['name']);
                    cookie.set("player_token", evt['token']);
                    cookie.set("player_id", evt['id']);
                    HiAlert("登陆成功");
                    window.setTimeout("window.location='index.html'",2000);
                } else {
                    HiAlert(evt['message'])
                }
            } else {
                HiAlert("ajax fail")
            }
        }
    });

}

HiAlert = function (string, time = 2000) {
    $.Huimodalalert(string, time)
};
// #tab_demo .tabBar span 控制条
// #tab_demo .tabCon 内容区
// click 事件 点击切换，可以换成mousemove 移动鼠标切换
// 1	默认第2个tab为当前状态（从0开始）