var clipMap = {
    sent_t:0,
    events:[],
    method:'',
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
        var x = clipMap.x();
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
        this.url = (typeof obj.url !== 'undefined' ? obj.url : '');
        this.wordpress = (typeof obj.wordpress !== 'undefined' ? obj.wordpress : false);
        this.method = (typeof obj.method !== 'undefined' ? obj.method : false);
        window.addEventListener("mousemove", function(event){
            clipMap.send_t++;
            var ev = {
                x:event.clientX,
                y:event.clientY
            }
            clipMap.events.push(JSON.stringify(ev));
            if (clipMap.wordpress) {
                var post = {
                    action :'droplet_wp_ajax',
                    method :clipMap.method,
                    data:clipMap.events
                };
            }else{
                var post = clipMap.events;
            }
            if (clipMap.send_t > 100) {
                clipMap.send_t = 0;
                clipMap.post(clipMap.url, post, function() {});
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
            if (clipMap.wordpress) {
                var post = {
                    action :'droplet_wp_ajax',
                    method :clipMap.method,
                    data:JSON.stringify(ev)
                };
            }else{
                var post = JSON.stringify(ev);
            }
            clipMap.post(clipMap.url, post, function() {});
        });
    }
}

