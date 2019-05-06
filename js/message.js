var current_chat_id = 0;
checkCookie();
checkToken();
getChatting();
getChat();
var websocket_client = '';
initWebsocket();

/**
 * 左侧控件绑定
 */
function bindChatLeftEvent() {
    let chat_name = $(".chat_name");
    let chat_end = $(".chat_end");
    chat_name.off();
    chat_end.off();
    chat_name.on("click", function () {
        $(".chat-select").removeClass("chat-select");
        $(this).find(".Hui-iconfont").removeClass("Hui-iconfont-xiaoxi");
        $(this).addClass("chat-select");
        current_chat_id = $(this).attr("chat_id");
        let mark = current_chat_id;
        console.log(current_chat_id);
        filterChatLog();
        clickNewStatusChatting(mark);
        isReadChat(mark);
    });
    chat_end.on("click", function () {
        let parent = $(this).parent().parent();
        let with_id = parent.attr("chat_id");
        if (with_id == current_chat_id) {
            parent.remove();
            let next = $($("#chat-left").children().get(0));
            next.addClass("chat-select");
            current_chat_id = next.attr("chat_id");
            console.log(current_chat_id);
            filterChatLog();
            closeChatting(with_id);
        } else {
            parent.remove();
            closeChatting(with_id);
        }
    });

}

/**
 * 刷新聊天记录状态
 */
function filterChatLog() {
    let send = $(".chat_massage_send");
    let get = $(".chat_massage_get");
    send.addClass("enable_show");
    get.addClass("enable_show");
    send.each(function () {
        if (current_chat_id == $(this).attr("chat_id")) {
            $(this).removeClass("enable_show")
        }
    });
    get.each(function () {
        if (current_chat_id == $(this).attr("chat_id")) {
            $(this).removeClass("enable_show")
        }
    });
    let show = $("#chat-show-message");
    show.scrollTop(show[0].scrollHeight);
}

/**
 * check
 */
function checkToken() {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/status",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                console.log()
            } else {
                HiAlert('ajax fail');
            }
        }
    })
}

function HiAlert(string, time = 2000) {
    $.Huimodalalert(string, time)
}

function getChatting() {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/chatting",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                let html = "";
                let is_new = "  <i class=\"Hui-iconfont Hui-iconfont-xiaoxi\" style='color: #FFC600'></i>";
                for (let i = 0; i < evt['data'].length; i++) {
                    html += "<div class=\"chat_name\" chat_id = " + evt['data'][i]['with_id'] + ">\n" +
                        "            <p class=\"chat_organize_name\">\n" +
                        "                <b>" + evt['data'][i]['organize'] + "</b>\n" +
                        "            </p>\n" +
                        "            <p class=\"chat_player_name\">\n" +
                        "                <b class=\"chat_end\">x</b>\n" +
                        "                " + evt['data'][i]['player_name'] +
                        "  <i class=\"Hui-iconfont ";
                    if (evt['data'][i]['is_new'] === 1) html += "Hui-iconfont-xiaoxi";
                    html += "\" style='color: #FFC600'></i>" +
                        "            </p>\n" +
                        "        </div>";
                }
                let chat_left = $("#chat-left").html(html);
                chat_left.html(html);
                let firstChatting = $(chat_left.children().get(0));
                firstChatting.addClass("chat-select");
                current_chat_id = firstChatting.attr("chat_id");
                let mark = current_chat_id;
                firstChatting.find(".Hui-iconfont").removeClass("Hui-iconfont-xiaoxi");
                bindChatLeftEvent();
                filterChatLog();
                clickNewStatusChatting(mark);
                isReadChat(mark);
            } else {
                HiAlert('ajax fail');
            }
        }
    })
}

function getChat() {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/chatLog",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                let html = "";
                let pid = cookie.get("player_id");
                //<div class="show_time_get">2019-10-12 12:12:12</div>
                for (let i = 0; i < evt['data'].length; i++) {
                    if (pid == evt['data'][i]['from_id']) {
                        html += "<div class=\"chat_massage_send enable_show\"chat_id =\"" + evt['data'][i]['to_id'] + "\"><p>" + evt['data'][i]['message'] + "</p><div class=\"show_time_send \">" + formatDate(new Date(evt['data'][i]['create_time'] * 1000)) + "</div></div>"
                    } else {
                        html += "<div class=\"chat_massage_get enable_show\" chat_id =\"" + evt['data'][i]['from_id'] + "\" ><p>" + evt['data'][i]['message'] + "</p><div class=\"show_time_get\">" + formatDate(new Date(evt['data'][i]['create_time'] * 1000)) + "</div></div>"
                    }
                }
                $("#chat-show-message").html(html);
                bindChatLeftEvent();
                filterChatLog();
            } else {
                HiAlert('ajax fail');
            }
        }
    })
}

function initWebsocket() {
    checkToken();
    let uri = 'ws://api.fsh.ink/v1/player/chat';
    websocket_client = new WebSocket(uri);
    websocket_client.onopen = function () {
        console.log('Connected');
        websocket_client.send("{\"from\":\"" + cookie.get("player_id") + "\"}");
    };
    websocket_client.onmessage = function (evt) {
        let obj = eval('(' + evt.data + ')');
        getMessage(obj['Msg'], obj['From']);
        if (current_chat_id != obj['From']) {
            isNewStatus(obj['From']);
        }
    };
    websocket_client.onclose = function () {
        console.log("close");
        initWebsocket()
    };
}

function getMessage(message, from_id) {
    let html = "<div class=\"chat_massage_get enable_show\" chat_id =\"" + from_id + "\" ><p>" + message + "</p><div class=\"show_time_get\">" + formatDate(new Date()) + "</div></div>";
    let show = $("#chat-show-message");
    show.append(html);
    filterChatLog();
}

function isNewStatus(from_id) {
    let chat_name = $(".chat_name");
    let flag = 0;
    chat_name.each(function () {
        if ($(this).attr("chat_id") == from_id) {
            console.log("searched");
            $(this).find(".Hui-iconfont").addClass("Hui-iconfont-xiaoxi");
            flag = 1;
            return false;
        }
    });
    if (flag == 0) {
        //todo prepend
        getNewChatName(from_id)
    }

}

function sendMessage() {
    //todo check token
    let text_area = $("#text-send");
    if (text_area.val() == null || text_area.val() === "") {
        HiAlert("消息内容不能为空", 1000);
        return false;
    }

    let msg = unHtml(text_area.val());
    console.log(msg);
    websocket_client.send("{\"from\":\"" + cookie.get("player_id") + "\",\"msg\":\"" + msg+ "\",\"to\":\"" + current_chat_id + "\"}");
    let html = "<div class=\"chat_massage_send enable_show\" chat_id =\"" + current_chat_id + "\" ><p>" + msg + "</p><div class=\"show_time_send \">" + formatDate(new Date()) + "</div></div>";
    $("#chat-show-message").append(html);
    filterChatLog();
}

function getNewChatName(with_id) {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/getChatName",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
            with_id: with_id
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }
                let html = "";
                html += "<div class=\"chat_name\" chat_id = " + with_id + ">\n" +
                    "            <p class=\"chat_organize_name\">\n" +
                    "                <b>" + evt['data']['organize'] + "</b>\n" +
                    "            </p>\n" +
                    "            <p class=\"chat_player_name\">\n" +
                    "                <b class=\"chat_end\">x</b>\n" +
                    "                " + evt['data']['player_name'] +
                    "  <i class=\"Hui-iconfont Hui-iconfont-xiaoxi\" style='color: #FFC600'></i>" +
                    "            </p>\n" +
                    "        </div>";
                $("#chat-left").prepend(html);
                bindChatLeftEvent();
            } else {
                HiAlert('ajax fail');
            }
        }
    })
}

function clickNewStatusChatting(with_id) {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/notNew",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
            with_id: with_id
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }

            } else {
                HiAlert('ajax fail');
            }
        }
    })
}

function closeChatting(with_id) {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/closeChatting",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
            with_id: with_id
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }

            } else {
                HiAlert('ajax fail');
            }
        }
    })
}

function isReadChat(with_id) {
    $.ajax({
        url: "http://api.fsh.ink/v1/player/readChatMessage",
        method: "GET",
        dataType: "json",
        data: {
            id: cookie.get("player_id"),
            token: cookie.get("player_token"),
            with_id: with_id
        },
        success: function (evt, req, settings) {
            if (req === "success") {
                if (evt['message'] === "fail") {
                    token_timeout();
                }

            } else {
                HiAlert('ajax fail');
            }
        }
    })
}

function unHtml(str) {
    return str ? str.replace(/[<">']/g, (a) => {
        return {
            '<': '&lt;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
        }[a]
    }) : '';
}