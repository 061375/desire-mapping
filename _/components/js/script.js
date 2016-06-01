var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];
    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), async)
};
var url = "";
var send_t = 0;
var events = [];
window.addEventListener("mousemove", function(event){
    send_t++;
    var ev = {
        x:event.clientX,
        y:event.clientY
    }
    events.push(JSON.stringify(ev));
    if (send_t > 100) {
        send_t = 0;
        ajax.post(url, events, function() {});
    }
});
window.addEventListener("click", function(event){
    /*
    console.log(event.target.tagName);
    console.log(event.target.getAttribute("class"));
    console.log(event.target.getAttribute("id"));
    console.log(event.target.getAttribute("href"));
    console.log(event.target.getAttribute("src"));
    */
    var ev = {
        x:event.clientX,
        y:event.clientY,
        tag:event.target.tagName,
        class:event.target.getAttribute("class"),
        id:event.target.getAttribute("id"),
        href:event.target.getAttribute("href"),
        src:event.target.getAttribute("src")
    }
    ajax.post(url, JSON.stringify(ev), function() {});
});

