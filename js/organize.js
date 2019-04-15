$("#organize_name").html(cookie.get("organize_name"));
checkCookie();
//todo 分页
//getOrganizeScore();
getOrganizeBestScore();
getEchartsTreeData();
getEchartsPieData();


/**
 * 获取运动员所有成绩
 */
function getOrganizeScore() {
    let id = cookie.get("organize_id");
    $.ajax({
        url: "http://api.fsh.ink/v1/organize/getAllScore",
        method: "GET",
        dataType: "json",
        data: {
            id: id,
            token: cookie.get("organize_token"),
        },
        success: function (evt, req, settings) {
            let html = "";
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                for (let i = 0; i < evt['data'].length; i++) {
                    let group = evt['data'][i]['s_group'];
                    group = group.replace("第", "");
                    group = group.replace("组", "");
                    html += "<tr onclick='new OnGroupBtnClick(" + evt['data'][i]['match_id'] + "," + group + ") ' >\n" +
                        "        <td>" + evt['data'][i]['match_name'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['group_type'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['player_name'] + "</td>\n" +
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
                $("#myScore").append(html);
            } else {
                HiAlert("ajax fail")
            }
        }
    })
}

/**
 * ajax获取单项最好成绩
 */
function getOrganizeBestScore() {
    let id = cookie.get("organize_id");
    $.ajax({
        url: "http://api.fsh.ink/v1/organize/getBestScore",
        method: "GET",
        dataType: "json",
        data: {
            id: id,
            token: cookie.get("organize_token"),
        },
        success: function (evt, req, settings) {
            if (evt['message'] === "fail") {
                token_timeout();
            }
            let matchName = ["500米", "1000米", "1500米", "4圈", "7圈"];
            let html = "";
            if (req === "success") {
                for (let i = 0; i < 5; i++) {
                    let e = evt[matchName[i]];
                    if (e !== "filter") {
                        let group = e['s_group'];
                        group = group.replace("第", "");
                        group = group.replace("组", "");
                        html += "<tr onclick=' new OnGroupBtnClick(" + e['match_id'] + "," + group + ")'>\n" +
                            "        <td>" + e['match_name'] + "</td>\n" +
                            "        <td>" + e['group_type'] + "</td>\n" +
                            "        <td>" + e['player_name'] + "</td>\n" +
                            "        <td>" + e['gender'] + "</td>\n" +
                            "        <td>" + e['match_type'] + "</td>\n" +
                            "        <td>" + e['s_group'] + "</td>\n" +
                            "        <td>" + e['no'] + "</td>\n" +
                            "        <td>" + e['time_score'] + "</td>\n" +
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
 *
 * @param id
 * @param group
 * @constructor
 */
function OnGroupBtnClick(id, group) {
    $.ajax({
        url: "http://api.fsh.ink/v1/index/getMatchScore/" + id + "/" + group,
        method: "GET",
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
                        "        <td>" + evt['data'][i]['name'] + "</td>\n" +
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

function getEchartsTreeData() {
    let data = [];
    let id = cookie.get("organize_id");
    $.ajax({
        url: "http://api.fsh.ink/v1/organize/getTreeData",
        method: "GET",
        dataType: "json",
        data: {
            id: id,
            token: cookie.get("organize_token"),
        },
        success: function (evt, req, settings) {
            if (evt['message'] === "fail") {
                token_timeout();
            }
            if (req === "success") {
                data = evt['data'];
                buildEchartsTree(data)
            } else {
                HiAlert("ajax fail")
            }
        }
    });
}

function buildEchartsTree(data) {

    var dom = document.getElementById("container_l");
    var myChart = echarts.init(dom);
    var app = {};
    var option = null;
    myChart.showLoading();
    var myData = data;
    myChart.showLoading();
    myChart.hideLoading();
    myChart.setOption(option = {
        series: [
            {
                type: 'tree',

                name: 'tree',

                data: [myData],

                top: '5%',
                left: '30%',
                bottom: '2%',
                right: '20%',

                symbolSize: 10,

                label: {
                    normal: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },

                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            },

        ]
    });
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
        myChart.on('click',function (p) {
            console.log(p)
        })
    }
}

function getEchartsPieData() {
    let data = [];
    let id = cookie.get("organize_id");
    $.ajax({
        url: "http://api.fsh.ink/v1/organize/getPieData",
        method: "GET",
        dataType: "json",
        data: {
            id: id,
            token: cookie.get("organize_token"),
        },
        success: function (evt, req, settings) {
            if (evt['message'] === "fail") {
                token_timeout();
            }
            if (req === "success") {

                buildEchartsPie(evt)
            } else {
                HiAlert("ajax fail")
            }
        }
    });
}

function buildEchartsPie(data) {
    var pie = document.getElementById("container_r");
    var myPie = echarts.init(pie);
    var Poption = {
        title: {
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
                    {value: data['value'][0], name: data['name'][0]},
                    {value: data['value'][1], name: data['name'][1]},
                    {value: data['value'][2], name: data['name'][2]},
                    {value: data['value'][3], name: data['name'][3]},
                    {value: data['value'][4], name: data['name'][4]}
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
           console.log(p)
        });
    }
}




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

