var cookie = {
    set: function (key, val, time) {//设置cookie方法
        var date = new Date(); //获取当前时间
        var expiresDays = time;  //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString();  //设置cookie
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";");  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if (key === arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    delete: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        document.cookie = key + "= ; expires =" + date.toGMTString();//设置cookie
    }
};


function checkCookie() {
    let id = cookie.get("player_id");
    let name = cookie.get("player_name");
    let token = cookie.get("player_token");
    if (typeof (id) !== "undefined" && typeof (name) !== "undefined" && typeof (token) !== "undefined") {
        //todo count最新消息
        $("#nav_left").html("<a href='../index.html'>" + name + ", 欢迎访问</a>");
        $("#nav_right").html("<span class=\"r_nav\">" + "[ <a rel=\"nofollow\" href=\"../message.html\">消息中心<em  class='you_get_message' style='color: #ee5f5b;'></em></a> ]</span><span class=\"pipe\">|</span>" +
            "<span class=\"r_nav\">[ <a rel=\"nofollow\" href=\"../player.html\">个人中心</a> ]</span><span class=\"pipe\">|</span>" +
            "<span class=\"r_nav\">[ <a href=\"javascript:logout();\" rel=\"nofollow\">退出登陆</a> ]</span>");
        return ""
    }
    id = cookie.get("organize_id");
    name = cookie.get("organize_name");
    token = cookie.get("organize_token");
    if (typeof (id) !== "undefined" && typeof (name) !== "undefined" && typeof (token) !== "undefined") {
        $("#nav_left").html("<a href='../index.html'>" + name + ", 欢迎访问</a>");
        $("#nav_right").html("<span class=\"r_nav\">[ <a rel=\"nofollow\" " +
            "href=\"../organize.html\">组织主页</a> ]</span><span class=\"pipe\">|</span>" +
            "<span class=\"r_nav\">[ <a href=\"javascript:logout();\" rel=\"nofollow\">退出登陆</a> ]</span>")
    } else {
        $("#nav_left").html("<a href='../index.html'>您好, 欢迎访问</a>");
        $("#nav_right").html("<span class=\"r_nav\">[ <a rel=\"nofollow\" " +
            "href=\"../login.html\">登陆</a> ]</span>");
    }
}

function logout() {
    cookie.delete("player_id");
    cookie.delete("player_name");
    cookie.delete("player_token");
    cookie.delete("organize_id");
    cookie.delete("organize_name");
    cookie.delete("organize_token");
    HiAlert("退出成功");
    window.setTimeout("window.location='index.html'", 2000);
}

function token_timeout() {
    cookie.delete("player_id");
    cookie.delete("player_name");
    cookie.delete("player_token");
    HiAlert("令牌过期请重新登陆");
    window.setTimeout("window.location='index.html'", 2000);
}

function page(page, page_num) {
    let pre = "<a onclick='page_func(" + (current_page - 1) + ")'><</a>";
    let fix = "<a onclick='page_func(" + (current_page + 1) + ")'>></a>";
    let min = 1;
    let max = page_num;
    if (page > 6) {
        pre += "<a onclick='page_func(" + (page - 6) + ")'>...</a>"
        min = page - 5;
    }
    if (page + 6 < page_num) {
        fix = "<a onclick='page_func(" + (page + 6) + ")'>...</a>" + fix;
        max = page + 5
    }
    for (let i = min; i <= max; i++) {
        if (i == page) {
            pre += "<a class = \"page_select\" onclick='page_func(" + i + ")'>" + i + "</a>"
            continue;
        }
        pre += "<a onclick='page_func(" + i + ")'>" + i + "</a>"
    }
    pre += fix;
    $(".pagination").html(pre)
}