checkCookie();
getPlayerScore();
getPlayerBestScore();
let current_page = 1;
var myData = [];
var show_data = [];
getEchartsData();
getFollowList();
getFanList();

/**
 * 弹出层
 * @param tabBar
 * @param tabCon
 * @param class_name
 * @param tabEvent
 * @param i
 * @constructor
 */
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
    $.Huitab("#tab_demo .tabBar span", "#tab_demo .tabCon", "current", "click", "0")
});


HiAlert = function (string, time = 2000) {
    $.Huimodalalert(string, time)
};
// #tab_demo 父级id
// #tab_demo .tabBar span 控制条
// #tab_demo .tabCon 内容区
// click 事件 点击切换，可以换成mousemove 移动鼠标切换
// 1	默认第2个tab为当前状态（从0开始）

/**
 * 获取运动员所有成绩
 */
function getPlayerScore(p = 1) {
    let id = cookie.get("player_id");
    $.ajax({
        url: "http://api.fsh.ink/v1/player/getPlayerScore",
        method: "GET",
        dataType: "json",
        data: {
            id: id,
            token: cookie.get("player_token"),
            page: p,
        },
        success: function (evt, req, settings) {
            let html = "";
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                html += "<thead>\n" +
                    "                    <tr>\n" +
                    "                        <th>项目</th>\n" +
                    "                        <th>组别</th>\n" +
                    "                        <th>性别</th>\n" +
                    "                        <th>赛别</th>\n" +
                    "                        <th>分组</th>\n" +
                    "                        <th>名次</th>\n" +
                    "                        <th>成绩</th>\n" +
                    "                    </tr>\n" +
                    "                    </thead>";
                for (let i = 0; i < evt['data'].length; i++) {
                    let group = evt['data'][i]['s_group'];
                    group = group.replace("第", "");
                    group = group.replace("组", "");
                    html += "<tr onclick='new OnGroupBtnClick(" + evt['data'][i]['match_id'] + "," + group + ") ' >\n" +
                        "        <td>" + evt['data'][i]['match_name'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['group_type'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['gender'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['match_type'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['s_group'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['no'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['time_score'] + "</td>\n" +
                        "    </tr>\n";
                }
                if (evt['data'].length === 0) {
                    html += "        <tr><td colspan='8' style='text-align: center'>暂无数据</td></tr>\n"
                }
                $("#myScore").html(html);
                current_page = evt['page'];
                page(evt['page'], evt['page_num']);
                $("#organize_name").html(evt['data'][0]['organize']);
                $("#player_name").html(evt['data'][0]['name']);
            } else {
                HiAlert("ajax fail")
            }
        }
    })
}

/**
 * ajax获取单项最好成绩
 */
function getPlayerBestScore() {
    let id = cookie.get("player_id");
    $.ajax({
        url: "http://api.fsh.ink/v1/player/getPlayerBestScore",
        method: "GET",
        dataType: "json",
        data: {
            id: id,
            token: cookie.get("player_token"),
        },
        success: function (evt, req, settings) {
            if (evt['message'] === "fail") {
                token_timeout();
            }
            let matchName = ["500米", "1000米", "1500米", "4圈", "7圈"];
            let html = "";
            if (req === "success") {
                for (let i = 0; i < 5; i++) {
                    if (evt[i] !== "filter") {
                        let group = evt[i]['s_group'];
                        group = group.replace("第", "");
                        group = group.replace("组", "");
                        html += "<tr onclick=' new OnGroupBtnClick(" + evt[i]['match_id'] + "," + group + ")'>\n" +
                            "        <td>" + evt[i]['match_name'] + "</td>\n" +
                            "        <td>" + evt[i]['group_type'] + "</td>\n" +
                            "        <td>" + evt[i]['gender'] + "</td>\n" +
                            "        <td>" + evt[i]['match_type'] + "</td>\n" +
                            "        <td>" + evt[i]['s_group'] + "</td>\n" +
                            "        <td>" + evt[i]['no'] + "</td>\n" +
                            "        <td>" + evt[i]['time_score'] + "</td>\n" +
                            "    </tr>\n";
                    } else {
                        html += "<tr><td>" + matchName[i] + "</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>"
                    }
                }
                $("#myBestScore").append(html)
            } else {
                HiAlert("ajax fail")
            }
        }
    })

}

/**
 * ajax获取Echarts数据
 */
function getEchartsData() {
    let id = cookie.get("player_id");
    $.ajax({
        url: "http://api.fsh.ink/v1/player/getShowData",
        method: "GET",
        dataType: "json",
        data: {
            id: id,
            token: cookie.get("player_token"),
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                myData = evt;
                let match = ["4圈", "7圈", "500米", "1000米", "1500米"];
                let name = "";
                for (let i = 0; i < match.length; i++) {
                    show_data = myData[match[i]];
                    if (show_data !== "") {
                        name = match[i];
                        break;
                    }
                }
                if (name !== "") {
                    buildPie();
                    buildLine(name);
                }
            } else {
                HiAlert("ajax fail")
            }
        }
    })
}

/**
 * 构建饼图数据 点击事件
 */
function buildPie() {
    var pie = document.getElementById("container_l");
    var myPie = echarts.init(pie);
    var Poption = {
        title: {
            text: '有效记录',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}场 ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '记录',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: pieCount(myData['4圈']), name: '4圈'},
                    {value: pieCount(myData['7圈']), name: '7圈'},
                    {value: pieCount(myData['500米']), name: '500米'},
                    {value: pieCount(myData['1000米']), name: '1000米'},
                    {value: pieCount(myData['1500米']), name: '1500米'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    if (Poption && typeof Poption === "object") {
        myPie.setOption(Poption, true);
        myPie.on('click', function (p) {
            show_data = myData[p['name']];
            buildLine(p['name'])
        });
    }
}

/**
 * 构建折线图数据 点击事件
 * @param name
 */
function buildLine(name) {
    var line = document.getElementById("container_r");
    var myLine = echarts.init(line);
    var Loption = {
        title: {
            text: name,
            x: 'left'
        },
        yAxis: {
            type: 'time',
            name: '记录',
            splitLine: {
                show: true
            },
            inverse: true,
        },
        xAxis: {
            type: 'category',
            axisLabel: "",
            name: '比赛日期',
            data: show_data['date'],
            splitLine: {
                show: true
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (p) {
                return p[0]['axisValue'] + "</br>  " + show_data['match_type'][p[0]['dataIndex']] + "</br> 成绩: " + p[0]['value'].replace("0000-00-00 00:", "")
            },
            axisPointer: {
                type: 'cross',
                label: {
                    precision: 2,
                    backgroundColor: '#6a7985'
                },

            }
        },
        series: [{
            data: show_data['value'],
            type: 'line',

        }]
    };
    if (Loption && typeof Loption === "object") {
        myLine.setOption(Loption, true);
        myLine.on('click', function (p) {
            new OnGroupBtnClick(show_data['match_id'][p['dataIndex']], show_data['group'][p['dataIndex']]);
        })
    }

}


function pieCount(v) {
    if (v === "") return 0;
    return v['value'].length
}

/**
 *
 * @param id
 * @param group
 * @constructor
 */
function OnGroupBtnClick(id, group) {
    $.ajax({
        url: "http://api.fsh.ink/v1/index/getMatchScore",
        method: "GET",
        data: {
            id: id,
            group: group
        },
        success: function (evt, req) {
            if (req === "success") {
                let html = "<table class=\"table table-border table-bg table-bordered table-striped table-hover\">\n" +
                    "    <thead>\n" +
                    "    <tr>\n" +
                    "        <th>名次</th>\n" +
                    "        <th>道次</th>\n" +
                    "        <th>头盔号</th>\n" +
                    "        <th>姓名</th>\n" +
                    "        <th>单位</th>\n" +
                    "        <th>成绩</th>\n" +
                    "        <th>备注</th>\n" +
                    "    </tr>\n" +
                    "    </thead>\n" +
                    "    <tbody>\n";
                for (let i = 0; i < evt['data'].length; i++) {
                    html += "<tr>\n" +
                        "        <td>" + evt['data'][i]['no'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['row_num'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['head_num'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['name'];
                    if (FollowList != "") {
                        if (in_array(evt['data'][i]['player_id'], FollowList)) {
                            html += "<i class=\"icoon Hui-iconfont\" title=\"已关注关注\">&#xe676;</i> ";
                        } else {
                            if (evt['data'][i]['player_id'] != cookie.get("player_id")) {
                                html += "<i class=\"icoon Hui-iconfont\" onclick='scoreFollow(" + evt['data'][i]['player_id'] + ",this)' title=\"加关注\">&#xe60d;</i> ";
                            }

                        }
                    }
                    html += "</td>\n" +
                        "        <td>" + evt['data'][i]['organize'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['time_score'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['remark'] + "</td>\n" +
                        "    </tr>\n";
                }
                if (evt['data'].length === 0) {
                    html += "        <tr><td colspan='8' style='text-align: center'>暂无数据</td></tr>\n"
                }
                html += "</tbody>\n" +
                    "</table>";
                $("div.modal-body").html(html);
                $("#modal-demo").modal("show")
            }
        }
    })

}

function page_func(page) {
    getPlayerScore(page)
}

function getFollowList() {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/followList",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
        },
        success: function (evt, req, settings) {
            let html = "";
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                for (let i = 0; i < evt['data'].length; i++) {
                    html += " <tr class='follow-row' pid='" + evt['data'][i]['user_id'] + "'>\n" +
                        "                        <td>" + evt['data'][i]['player_name'] + "</td>\n" +
                        "                        <td>" + evt['data'][i]['organize'] + "</td>\n" +
                        "                        <td class=\" icooooon\"><i class=\"Hui-iconfont\" onclick='goChatting(" + evt['data'][i]['user_id'] + ")' title=\"发消息\">&#xe6c5;</i> " +
                        "<i class=\"Hui-iconfont\" onclick='removeFollow(" + evt['data'][i]['user_id'] + ")'  title=\"取消关注\">&#xe6e0;</i>\n" +
                        "                        </td>\n" +
                        "                    </tr>"
                }
                $("#follow_list").html(html)
            } else {
                HiAlert("ajax fail")
            }
        }
    })
}

function getFanList() {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/fanList",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
        },
        success: function (evt, req, settings) {
            let html = "";
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                for (let i = 0; i < evt['data'].length; i++) {
                    html += " <tr class='fan-row' pid='" + evt['data'][i]['fan_id'] + "'>\n" +
                        "                        <td>" + evt['data'][i]['player_name'] + "</td>\n" +
                        "                        <td>" + evt['data'][i]['organize'] + "</td>\n" +
                        "                        <td class=\" icooooon\">";
                    if (in_array(evt['data'][i]['fan_id'], FollowList)) {
                        html += "<i class=\"Hui-iconfont\"  title=\"已经关注\">&#xe676;</i> ";
                    } else {
                        html += "<i class=\"Hui-iconfont\" onclick='doFollow(" + evt['data'][i]['fan_id'] + ")' title=\"加关注\">&#xe60d;</i> ";
                    }
                    html += "<i class=\"Hui-iconfont\" onclick='goChatting(" + evt['data'][i]['fan_id'] + ")'  title=\"发消息\">&#xe6c5;</i>\n" +
                        "                        </td>\n" +
                        "                    </tr>"
                }
                $("#fans_list").html(html)
            } else {
                HiAlert("ajax fail")
            }
        }
    })
}

function removeFollow(id) {
    $(".follow-row").each(function () {
        if ($(this).attr("pid") == id) {
            notFollow(id);
            this.remove();
            for (let i = 0; i < FollowList.length; i++) {
                if (FollowList[i] == id) {
                    FollowList[i] = '0';
                }
            }
            return false
        }
    })
}

function doFollow(id) {
    FollowList.push(id);
    $(".fan-row").each(function () {
        if ($(this).attr("pid") == id) {
            let elem = $($(this).find(".Hui-iconfont").get(0));
            elem.html("&#xe676");
            elem.attr("title", "已关注");
            elem.prop("onclick", null).off("click");
            playerFollow(id);
            return false;
        }
    });
    addFollowList(id);
}

function addFollowList(id) {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/getChatName",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
            with_id: id,
        },
        success: function (evt, req, settings) {
            let html = "";
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                html = " <tr class='follow-row' pid='" + id + "'>\n" +
                    "                        <td>" + evt['data']['player_name'] + "</td>\n" +
                    "                        <td>" + evt['data']['organize'] + "</td>\n" +
                    "                        <td class=\" icooooon\"><i class=\"Hui-iconfont\" onclick='goChatting(" + id + ")' title=\"发消息\">&#xe6c5;</i> " +
                    "<i class=\"Hui-iconfont\" onclick='removeFollow(" + id + ")'  title=\"取消关注\">&#xe6e0;</i>\n" +
                    "                        </td>\n" +
                    "                    </tr>";
                $("#follow_list").prepend(html)
            } else {
                HiAlert("ajax fail")
            }
        }
    })
}

function scoreFollow(id, obj) {
    playerFollow(id);
    let elem = $(obj);
    elem.html("&#xe676;");
    elem.attr("title", "已关注");
    elem.prop("onclick", null).off("click");
    doFollow(id)
}