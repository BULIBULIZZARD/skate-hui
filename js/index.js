getContest();

function getContest() {
    $.ajax(
        {
            url: "http://api.fsh.ink/v1/index/getContest",
            method: "GET",
            success: function (evt, req,) {
                let html = "";
                if (req === "success") {
                    for (let i = 0; i < evt['data'].length; i++) {
                        html += "<li class=\"item\">\n" +
                            "        <h4>" + evt['data'][i]['name'];
                        if (evt['data'][i]['station'].length > 0) html += "&nbsp;&nbsp;&nbsp;&nbsp;(" + evt['data'][i]['station'] + ")";
                        html += "<b>+</b></h4>\n" +
                            "        <div class=\"info\" id=\"" + evt['data'][i]['id'] + "\"></div>\n" +
                            "    </li>\n";
                    }
                    $("#Huifold1").html(html);
                    showMatch("#Huifold1 .item h4", "#Huifold1 .item .info", "fast", 1, "click"); /*5个参数顺序不可打乱，分别是：相应区,隐藏显示的内容,速度,类型,事件*/
                } else {
                    HiAlert("ajax fail");
                    //todo fail handle
                }
            }
        }
    );
}


function showMatch(obj, obj_c, speed, obj_type, Event) {
    $(obj).on(Event, function () {
        if ($(this).next().is(":visible")) {
            $(this).next()['isSetEvents'] = true;
            $(this).next().slideUp(speed).end().removeClass("selected");
            $(this).find("b").html("+")
        } else {
            $(obj_c).slideUp(speed);
            $(obj).removeClass("selected");
            $(obj).find("b").html("+");
            $(this).next().slideDown(speed).end().addClass("selected");
            if ($(this).next().html() === "") {
                $.GetMatch($(this).next());
            }
            $(this).find("b").html("-")
        }
    });
}

jQuery.GetMatch = function (obj) {
    let contestId = obj.attr("id");
    $.ajax({
        url: "http://api.fsh.ink/v1/index/getContestMatch/" + contestId,
        success: function (evt, req, settings) {
            if (req === "success") {
                let html = "<table class=\"table table-border table-bg table-bordered table-striped table-hover\">\n" +
                    "    <thead>\n" +
                    "    <tr>\n" +
                    "        <th>项目</th>\n" +
                    "        <th>组别</th>\n" +
                    "        <th>性别</th>\n" +
                    "        <th>赛别</th>\n" +
                    "        <th>人数</th>\n" +
                    "        <th>组数</th>\n" +
                    "        <th>录取</th>\n" +
                    "        <th>备注</th>\n" +
                    "    </tr>\n" +
                    "    </thead>\n" +
                    "    <tbody>\n";
                for (let i = 0; i < evt['data'].length; i++) {
                    html += "<tr onclick='MatchOnClick(" + evt['data'][i]['group_num'] + "," + evt['data'][i]['id'] + ")'>\n" +
                        "        <td>" + evt['data'][i]['match_name'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['group_type'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['gender'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['match_type'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['player_num'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['group_num'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['enter'] + "</td>\n" +
                        "        <td>" + evt['data'][i]['remark'] + "</td>\n" +
                        "    </tr>\n";
                }
                if (evt['data'].length === 0) {
                    html += "        <tr><td colspan='8' style='text-align: center'>暂无数据</td></tr>\n"
                }
                html += "</tbody>\n" +
                    "</table>";
                obj.html(html);
            } else {
                HiAlert("ajax fail")
            }

        },
        //dataType: dataType
    });
};


MatchOnClick = function (num, id) {
    modaldemo(num, id)
};

function modaldemo(num, id) {
    let html = "";
    for (let i = 1; i <= num; i++) {
        html += "<button  onclick='OnGroupBtnClick(" + id + "," + i + ")' class=\"btn btn-primary-outline radius mb-5 mr-5\" >第" + i + "组</button>";
    }
    $("div.modal-body").html(html);
    $("#modal-demo").modal("show")
}

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
            }
        }
    })

}

HiAlert = function (string, time = 2000) {
    $.Huimodalalert(string, time)
};


$(function () {
    jQuery("#slider-1 .slider").slide({
        mainCell: ".bd ul",
        titCell: ".hd li",
        trigger: "mousemove",
        effect: "leftLoop",
        autoPlay: true,
        delayTime: 850,
        interTime: 1500,
        pnLoop: true,
        titOnClassName: "active"
    })
});
checkCookie();