var clickMap = {
    send_t:0,
    send_tmax:100,
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
        var x = clickMap.x();
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
        clickMap.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
    },
    post: function (url, data, callback, async) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        clickMap.send(url, callback, 'POST', query.join('&'), async)
    },
    init: function(obj) {
        this.url = (typeof obj.url !== 'undefined' ? obj.url : '');
        this.wordpress = (typeof obj.wordpress !== 'undefined' ? obj.wordpress : false);
        this.method = (typeof obj.method !== 'undefined' ? obj.method : false);
        this.send_tmax = (typeof obj.max !== 'undefined' ? obj.max : 100);
        if (clickMap.wordpress) {
            var post = {
                action :'droplet_wp_ajax',
                method :clickMap.method+'_width',
                data:JSON.stringify({width:document.documentElement.clientWidth,height:document.documentElement.clientHeight})
            };
        }else{
            var post = JSON.stringify({width:window.screen.availWidth,height:window.screen.availHeight});
        }
        clickMap.post(clickMap.url+"?m=width", post, function() {});
        window.addEventListener("mousemove", function(event){
            clickMap.send_t++;
            var ev = {
                x:event.clientX,
                y:event.clientY
            }
            clickMap.events.push(JSON.stringify(ev));
            if (clickMap.wordpress) {
                var post = {
                    action :'droplet_wp_ajax',
                    method :clickMap.method+'_move',
                    data:clickMap.events
                };
            }else{
                var post = clickMap.events;
            }
            if (clickMap.send_t > clickMap.send_tmax) {
                clickMap.send_t = 0;
                clickMap.post(clickMap.url+"?m=move", post, function() {});
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
            if (clickMap.wordpress) {
                var post = {
                    action :'droplet_wp_ajax',
                    method :clickMap.method+'_click',
                    data:JSON.stringify(ev)
                };
            }else{
                var post = JSON.stringify(ev);
            }
            clickMap.post(clickMap.url+"?m=click", post, function() {});
        });
    } 
}

