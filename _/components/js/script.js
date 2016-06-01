var clipMap = {
    sent_t:0,
    events:[],
    x: function () {
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
    },
    send: function (url, callback, method, data, async) {
        if (async === undefined) {
            async = true;
        }
        var x = ajax.x();
        clipMap.x.open(method, url, async);
        clipMap.x.onreadystatechange = function () {
            if (clipMap.x.readyState == 4) {
                callback(clipMap.x.responseText)
            }
        };
        if (method == 'POST') {
            clipMap.x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        clipMap.x.send(data)
    },
    get: function (url, data, callback, async) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        clipMap.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
    },
    post: function (url, data, callback, async) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        clipMap.send(url, callback, 'POST', query.join('&'), async)
    },
    init: function(obj) {
        this.url == (typeof obj.url !== 'undefined' ? obj.url : false);
        this.wordpress = (typeof obj.wordpress !== 'undefined' ? obj.wordpress : false);
        window.addEventListener("mousemove", function(event){
            this.send_t++;
            var ev = {
                x:event.clientX,
                y:event.clientY
            }
            this.events.push(JSON.stringify(ev));
            if (this.send_t > 100) {
                this.send_t = 0;
                clipMap.post(url, this.events, function() {});
            }
        });
        window.addEventListener("click", function(event){
            var ev = {
                x:event.clientX,
                y:event.clientY,
                tag:event.target.tagName,
                class:event.target.getAttribute("class"),
                id:event.target.getAttribute("id"),
                href:event.target.getAttribute("href"),
                src:event.target.getAttribute("src")
            }
            clipMap.post(url, JSON.stringify(ev), function() {});
        });
    }
}

